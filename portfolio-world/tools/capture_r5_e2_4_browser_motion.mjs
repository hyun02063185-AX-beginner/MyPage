/** Capture real Vite/Phaser canvas motion through Chrome DevTools Protocol.
 *
 * This intentionally records the running pilot page rather than composing a
 * synthetic sprite strip. It assumes a local Chrome launched with
 * --remote-debugging-port=9224 and the Vite server on port 5173.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname.replace(/^\//, ""));
const output = resolve(root, "../reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4/motion-evidence");
mkdirSync(output, { recursive: true });

const targets = await (await fetch("http://127.0.0.1:9224/json/list")).json();
const target = targets.find((entry) => entry.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("No CDP page target on port 9224");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolveOpen, rejectOpen) => { socket.addEventListener("open", resolveOpen, { once: true }); socket.addEventListener("error", rejectOpen, { once: true }); });
let identifier = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const payload = JSON.parse(event.data);
  if (payload.id && pending.has(payload.id)) { pending.get(payload.id)(payload); pending.delete(payload.id); }
});
const command = (method, params = {}) => new Promise((resolveCommand, rejectCommand) => {
  const id = ++identifier;
  pending.set(id, (reply) => reply.error ? rejectCommand(new Error(`${method}: ${reply.error.message}`)) : resolveCommand(reply.result));
  socket.send(JSON.stringify({ id, method, params }));
});
const pause = (milliseconds) => new Promise((resolvePause) => setTimeout(resolvePause, milliseconds));
await command("Page.enable");
await command("Emulation.setDeviceMetricsOverride", { width: 1024, height: 576, deviceScaleFactor: 1, mobile: false });

async function navigate(query) {
  await command("Page.navigate", { url: `http://127.0.0.1:5173/r5-hybrid-pilot.html?spawn=workshop&${query}` });
  await pause(1000);
}
async function key(type, key, code) {
  await command("Input.dispatchKeyEvent", { type, key, code, windowsVirtualKeyCode: key === "ArrowLeft" ? 37 : key === "ArrowRight" ? 39 : key === "ArrowUp" ? 38 : 40, nativeVirtualKeyCode: key === "ArrowLeft" ? 37 : key === "ArrowRight" ? 39 : key === "ArrowUp" ? 38 : 40 });
}
async function capture(name, actions) {
  const folder = resolve(output, `${name}-frames`); mkdirSync(folder, { recursive: true });
  for (let index = 0; index < actions.length; index += 1) {
    const action = actions[index];
    if (action.key) await key(action.type, action.key, action.code);
    await pause(action.wait ?? 75);
    const screenshot = await command("Page.captureScreenshot", { format: "png" });
    writeFileSync(resolve(folder, `frame-${String(index).padStart(2, "0")}.png`), Buffer.from(screenshot.data, "base64"));
  }
  return folder;
}
const heldFrames = (keyName, code) => [
  { type: "keyDown", key: keyName, code, wait: 90 },
  ...Array.from({ length: 11 }, () => ({ wait: 90 })),
  { type: "keyUp", key: keyName, code, wait: 90 },
];
const captures = {};
await navigate("walkVersion=before"); captures.sideBefore = await capture("side-before", heldFrames("ArrowLeft", "ArrowLeft"));
await navigate("walkVersion=after"); captures.sideAfter = await capture("side-after", heldFrames("ArrowLeft", "ArrowLeft"));
await navigate("walkVersion=before"); captures.frontBefore = await capture("front-before", heldFrames("ArrowDown", "ArrowDown"));
await navigate("walkVersion=after"); captures.frontAfter = await capture("front-after", heldFrames("ArrowDown", "ArrowDown"));
await navigate("walkVersion=before"); captures.backBefore = await capture("back-before", heldFrames("ArrowUp", "ArrowUp"));
await navigate("walkVersion=after"); captures.backAfter = await capture("back-after", heldFrames("ArrowUp", "ArrowUp"));
await navigate("walkVersion=after"); captures.directionTransition = await capture("direction-transition", [
  { type: "keyDown", key: "ArrowRight", code: "ArrowRight", wait: 100 }, { wait: 100 }, { wait: 100 }, { type: "keyUp", key: "ArrowRight", code: "ArrowRight", wait: 80 },
  { type: "keyDown", key: "ArrowDown", code: "ArrowDown", wait: 100 }, { wait: 100 }, { wait: 100 }, { type: "keyUp", key: "ArrowDown", code: "ArrowDown", wait: 80 },
  { type: "keyDown", key: "ArrowLeft", code: "ArrowLeft", wait: 100 }, { wait: 100 }, { type: "keyUp", key: "ArrowLeft", code: "ArrowLeft", wait: 80 },
]);
await navigate("walkVersion=after");
await command("Runtime.evaluate", { expression: "document.querySelector('[data-world-marker=\\\"hero\\\"]')?.click()" });
captures.autoNavigation = await capture("auto-navigation-walk", Array.from({ length: 18 }, () => ({ wait: 110 })));
writeFileSync(resolve(output, "capture-manifest.json"), JSON.stringify({ runtime: "actual Phaser/Vite page", viewport: [1024, 576], walkSpeed: 170, frameIntervalMs: 90, captures }, null, 2) + "\n");
socket.close();
