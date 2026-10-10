/** Actual Phaser motion evidence for R5 E2.4.2 through a local CDP browser. */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname.replace(/^\//, ""));
const output = resolve(root, "../reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4-2/motion-evidence");
mkdirSync(output, { recursive: true });
const targets = await (await fetch("http://127.0.0.1:9226/json/list")).json();
const target = targets.find((entry) => entry.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("No local Chrome CDP page on port 9226");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolveOpen, rejectOpen) => { socket.addEventListener("open", resolveOpen, { once: true }); socket.addEventListener("error", rejectOpen, { once: true }); });
let identifier = 0; const pending = new Map();
socket.addEventListener("message", (event) => { const payload = JSON.parse(event.data); if (payload.id && pending.has(payload.id)) { pending.get(payload.id)(payload); pending.delete(payload.id); } });
const command = (method, params = {}) => new Promise((resolveCommand, rejectCommand) => { const id = ++identifier; pending.set(id, (reply) => reply.error ? rejectCommand(new Error(`${method}: ${reply.error.message}`)) : resolveCommand(reply.result)); socket.send(JSON.stringify({ id, method, params })); });
const pause = (milliseconds) => new Promise((resolvePause) => setTimeout(resolvePause, milliseconds));
await command("Page.enable"); await command("Emulation.setDeviceMetricsOverride", { width: 1024, height: 576, deviceScaleFactor: 1, mobile: false });
async function navigate() { await command("Page.navigate", { url: "http://127.0.0.1:5173/r5-hybrid-pilot.html?spawn=workshop&animationQa=1" }); await pause(850); }
async function key(type, keyName) { const virtual = keyName === "ArrowLeft" ? 37 : keyName === "ArrowRight" ? 39 : keyName === "ArrowUp" ? 38 : 40; await command("Input.dispatchKeyEvent", { type, key: keyName, code: keyName, windowsVirtualKeyCode: virtual, nativeVirtualKeyCode: virtual }); }
async function capture(name, actions) { const folder = resolve(output, `${name}-frames`); mkdirSync(folder, { recursive: true }); for (let index = 0; index < actions.length; index += 1) { const action = actions[index]; if (action.key) await key(action.type, action.key); if (action.evaluate) await command("Runtime.evaluate", { expression: action.evaluate }); await pause(action.wait ?? 105); const image = await command("Page.captureScreenshot", { format: "png" }); writeFileSync(resolve(folder, `frame-${String(index).padStart(2, "0")}.png`), Buffer.from(image.data, "base64")); } return folder; }
const hold = (keyName) => [{ type: "keyDown", key: keyName, wait: 110 }, ...Array.from({ length: 14 }, () => ({ wait: 105 })), { type: "keyUp", key: keyName, wait: 150 }, ...Array.from({ length: 3 }, () => ({ wait: 105 }))];
const captures = {};
await navigate(); captures.frontWalk = await capture("front-walk", hold("ArrowDown"));
await navigate(); captures.backWalk = await capture("back-walk", hold("ArrowUp"));
await navigate(); captures.sideWalk = await capture("side-walk", hold("ArrowLeft"));
await navigate(); captures.directionTransition = await capture("direction-transition", [
  { type: "keyDown", key: "ArrowRight", wait: 115 }, { wait: 110 }, { type: "keyUp", key: "ArrowRight", wait: 105 },
  { type: "keyDown", key: "ArrowDown", wait: 115 }, { wait: 110 }, { type: "keyUp", key: "ArrowDown", wait: 105 },
  { type: "keyDown", key: "ArrowLeft", wait: 115 }, { wait: 110 }, { type: "keyUp", key: "ArrowLeft", wait: 150 }, ...Array.from({ length: 3 }, () => ({ wait: 105 }))
]);
writeFileSync(resolve(output, "capture-manifest.json"), JSON.stringify({ runtime: "actual Phaser/Vite via CDP", viewport: [1024, 576], defaultPreset: "B (20fps side / 16fps front-back)", defaultSpeed: 170, captures }, null, 2) + "\n");
socket.close();
