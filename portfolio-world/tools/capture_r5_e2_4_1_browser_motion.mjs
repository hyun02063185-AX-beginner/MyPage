/** Actual Phaser motion evidence for R5 E2.4.1 through a local CDP browser. */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname.replace(/^\//, ""));
const output = resolve(root, "../reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4-1/motion-evidence");
mkdirSync(output, { recursive: true });
const targets = await (await fetch("http://127.0.0.1:9225/json/list")).json();
const target = targets.find((entry) => entry.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("No local Chrome CDP page on port 9225");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolveOpen, rejectOpen) => { socket.addEventListener("open", resolveOpen, { once: true }); socket.addEventListener("error", rejectOpen, { once: true }); });
let identifier = 0; const pending = new Map();
socket.addEventListener("message", (event) => { const payload = JSON.parse(event.data); if (payload.id && pending.has(payload.id)) { pending.get(payload.id)(payload); pending.delete(payload.id); } });
const command = (method, params = {}) => new Promise((resolveCommand, rejectCommand) => { const id = ++identifier; pending.set(id, (reply) => reply.error ? rejectCommand(new Error(`${method}: ${reply.error.message}`)) : resolveCommand(reply.result)); socket.send(JSON.stringify({ id, method, params })); });
const pause = (milliseconds) => new Promise((resolvePause) => setTimeout(resolvePause, milliseconds));
await command("Page.enable"); await command("Emulation.setDeviceMetricsOverride", { width: 1024, height: 576, deviceScaleFactor: 1, mobile: false });
async function navigate(query = "") { await command("Page.navigate", { url: `http://127.0.0.1:5173/r5-hybrid-pilot.html?spawn=workshop${query}` }); await pause(800); }
async function key(type, keyName) { const virtual = keyName === "ArrowLeft" ? 37 : keyName === "ArrowRight" ? 39 : keyName === "ArrowUp" ? 38 : 40; await command("Input.dispatchKeyEvent", { type, key: keyName, code: keyName, windowsVirtualKeyCode: virtual, nativeVirtualKeyCode: virtual }); }
async function capture(name, actions) { const folder = resolve(output, `${name}-frames`); mkdirSync(folder, { recursive: true }); for (let index = 0; index < actions.length; index += 1) { const action = actions[index]; if (action.key) await key(action.type, action.key); if (action.evaluate) await command("Runtime.evaluate", { expression: action.evaluate }); await pause(action.wait ?? 110); const image = await command("Page.captureScreenshot", { format: "png" }); writeFileSync(resolve(folder, `frame-${String(index).padStart(2, "0")}.png`), Buffer.from(image.data, "base64")); } return folder; }
const hold = (keyName) => [{ type: "keyDown", key: keyName, wait: 120 }, ...Array.from({ length: 10 }, () => ({ wait: 120 })), { type: "keyUp", key: keyName, wait: 120 }];
const captures = {};
await navigate("&animationQa=1");
captures.sideIdleToWalk = await capture("side-idle-to-walk", [{ type: "keyDown", key: "ArrowLeft", wait: 120 }, { type: "keyUp", key: "ArrowLeft", wait: 110 }, ...Array.from({ length: 8 }, () => ({ wait: 120 }))]);
await navigate("&animationQa=1"); captures.sideWalkToIdle = await capture("side-walk-to-idle", hold("ArrowRight"));
await navigate("&animationQa=1"); captures.frontWalk = await capture("front-walk", hold("ArrowDown"));
await navigate("&animationQa=1"); captures.backWalk = await capture("back-walk", hold("ArrowUp"));
await navigate("&animationQa=1"); captures.sideWalk = await capture("side-walk", hold("ArrowLeft"));
await navigate("&animationQa=1"); captures.directionalTransition = await capture("directional-transition", [{ type: "keyDown", key: "ArrowRight", wait: 120 }, { wait: 120 }, { type: "keyUp", key: "ArrowRight", wait: 90 }, { type: "keyDown", key: "ArrowDown", wait: 120 }, { wait: 120 }, { type: "keyUp", key: "ArrowDown", wait: 90 }, { type: "keyDown", key: "ArrowLeft", wait: 120 }, { wait: 120 }, { type: "keyUp", key: "ArrowLeft", wait: 100 }]);
await navigate("&animationQa=1"); await command("Runtime.evaluate", { expression: "document.querySelector('[data-world-marker=\\\"hero\\\"]')?.click()" }); captures.autoNavigation = await capture("auto-navigation", Array.from({ length: 16 }, () => ({ wait: 120 })));
await navigate("&animationQa=1"); captures.cadence = await capture("cadence", [{ evaluate: "document.querySelector('[data-qa-preset=\\\"\"]')" }, { evaluate: "const s=document.querySelector('[data-qa-preset]');s.value='a';s.dispatchEvent(new Event('change',{bubbles:true}))", wait: 150 }, { type: "keyDown", key: "ArrowLeft", wait: 120 }, { wait: 120 }, { type: "keyUp", key: "ArrowLeft", wait: 120 }, { evaluate: "const s=document.querySelector('[data-qa-preset]');s.value='b';s.dispatchEvent(new Event('change',{bubbles:true}))", wait: 150 }, { type: "keyDown", key: "ArrowLeft", wait: 120 }, { wait: 120 }, { type: "keyUp", key: "ArrowLeft", wait: 120 }, { evaluate: "const s=document.querySelector('[data-qa-preset]');s.value='c';s.dispatchEvent(new Event('change',{bubbles:true}))", wait: 150 }, { type: "keyDown", key: "ArrowLeft", wait: 120 }, { wait: 120 }, { type: "keyUp", key: "ArrowLeft", wait: 120 }]);
writeFileSync(resolve(output, "capture-manifest.json"), JSON.stringify({ runtime: "actual Phaser/Vite via CDP", viewport: [1024, 576], defaultPreset: "B (20fps side / 10fps vertical)", defaultSpeed: 170, captures }, null, 2) + "\n");
socket.close();
