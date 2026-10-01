import { mkdir, mkdtemp, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { tmpdir } from "node:os";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const repoRoot = path.resolve(projectRoot, "..");
const fidelityBatch = process.argv.includes("--r3c1-foundation");
const foundationBatch = process.argv.includes("--r3c-foundation") || fidelityBatch;
const evidenceDir = path.join(repoRoot, "reports", "portfolio-world-rebuild", "evidence", fidelityBatch ? "r3c1-foundation-fidelity" : foundationBatch ? "r3c-foundation" : "r3a1-graybox-motion");
const edgePaths = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"];
const edgePath = edgePaths.find((candidate) => process.getBuiltinModule("node:fs").existsSync(candidate));

function freePort() { return new Promise((resolve, reject) => { const server = createServer(); server.once("error", reject); server.listen(0, "127.0.0.1", () => { const address = server.address(); server.close(() => resolve(address.port)); }); }); }
function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
async function waitFor(url) { let lastError; for (let i = 0; i < 80; i += 1) { try { const response = await fetch(url); if (response.ok) return response; } catch (error) { lastError = error; } await delay(125); } throw lastError ?? new Error(`Timed out waiting for ${url}`); }
function run(command, args, cwd) { return new Promise((resolve, reject) => { const child = spawn(command, args, { cwd, stdio: "pipe" }); let stderr = ""; child.stderr.on("data", (chunk) => { stderr += chunk; }); child.on("error", reject); child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}: ${stderr}`))); }); }

class CdpClient {
  constructor(socketUrl) { this.socket = new WebSocket(socketUrl); this.nextId = 1; this.pending = new Map(); this.events = []; this.listeners = new Map(); }
  async open() { await new Promise((resolve, reject) => { this.socket.addEventListener("open", resolve, { once: true }); this.socket.addEventListener("error", reject, { once: true }); }); this.socket.addEventListener("message", (event) => { const message = JSON.parse(event.data); if (message.id) { const pending = this.pending.get(message.id); if (!pending) return; this.pending.delete(message.id); message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result); } else { this.events.push(message); for (const listener of this.listeners.get(message.method) ?? []) listener(message); } }); }
  command(method, params = {}) { const id = this.nextId++; return new Promise((resolve, reject) => { this.pending.set(id, { resolve, reject }); this.socket.send(JSON.stringify({ id, method, params })); }); }
  on(method, listener) { const listeners = this.listeners.get(method) ?? []; listeners.push(listener); this.listeners.set(method, listeners); return () => this.listeners.set(method, (this.listeners.get(method) ?? []).filter((candidate) => candidate !== listener)); }
  close() { this.socket.close(); }
}

async function qaState(client) { const result = await client.command("Runtime.evaluate", { expression: "JSON.stringify(window.__PORTFOLIO_WORLD_V2_GRAYBOX_QA__)", returnByValue: true }); return result.result.value ? JSON.parse(result.result.value) : undefined; }
async function navigateAndWait(client, url, expectedQa) { await client.command("Page.navigate", { url }); for (let i = 0; i < 80; i += 1) { await delay(100); const state = await qaState(client); if (state?.activeScene === "GrayboxScene" && state.qaState === expectedQa) return state; } throw new Error(`Graybox state ${expectedQa} did not load.`); }
async function screenshot(client, fileName) { const image = await client.command("Page.captureScreenshot", { format: "png" }); const target = path.join(evidenceDir, fileName); await writeFile(target, Buffer.from(image.data, "base64")); const details = await stat(target); if (!details.size) throw new Error(`${fileName} is empty.`); return { fileName, bytes: details.size }; }
function assertState(state, label) {
  if (!state?.routes?.plazaToHall || !state.routes.plazaToStairs || !state.routes.stairsToQuay || !state.routes.quayToWorkshop || !state.routes.quayToGangway) throw new Error(`${label}: intended route assertion failed.`);
  if (!state?.collisions?.buildingFootprints || !state.collisions.waterBoundaries || !state.collisions.railings || !state.collisions.shipExclusion) throw new Error(`${label}: explicit collision assertion failed.`);
}
function assertNoBrowserErrors(events) { const errors = events.filter((event) => event.method === "Runtime.exceptionThrown" || (event.method === "Runtime.consoleAPICalled" && event.params.type === "error") || (event.method === "Log.entryAdded" && event.params.entry.level === "error") || (event.method === "Network.responseReceived" && event.params.response.status >= 400)); if (errors.length) throw new Error(`Browser errors: ${JSON.stringify(errors, null, 2)}`); }

async function main() {
  if (!edgePath) throw new Error("Microsoft Edge is required for graybox QA.");
  await mkdir(evidenceDir, { recursive: true });
  const webPort = await freePort(); const cdpPort = await freePort(); const profile = await mkdtemp(path.join(tmpdir(), "portfolio-world-graybox-qa-"));
  const vite = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", String(webPort)], { cwd: projectRoot, stdio: "pipe" });
  const edge = spawn(edgePath, ["--headless=new", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "about:blank"], { stdio: "ignore" });
  try {
    const origin = `http://127.0.0.1:${webPort}`;
    await waitFor(origin);
    const tabs = await (await waitFor(`http://127.0.0.1:${cdpPort}/json`)).json(); const page = tabs.find((tab) => tab.type === "page");
    if (!page?.webSocketDebuggerUrl) throw new Error("Edge did not expose a debuggable page.");
    const client = new CdpClient(page.webSocketDebuggerUrl); await client.open();
    await client.command("Runtime.enable"); await client.command("Log.enable"); await client.command("Network.enable"); await client.command("Page.enable");
    await client.command("Emulation.setDeviceMetricsOverride", { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
    const states = foundationBatch
      ? [["A-upper-plaza.png", "upper"], ["B-stairs-top.png", "stairs-top"], ["C-stairs-bottom.png", "stairs-bottom"], ["D-lower-quay.png", "quay"]]
      : [["A-upper-plaza.png", "upper"], ["B-exhibition-entrance.png", "hall"], ["C-top-of-stairs.png", "stairs-top"], ["D-bottom-of-stairs.png", "stairs-bottom"], ["E-workshop-approach.png", "workshop"], ["F-hero-quay.png", "quay"], ["G-hero-ship-gangway.png", "gangway"]];
    const captures = [];
    for (const [fileName, stateName] of states) { const state = await navigateAndWait(client, `${origin}/?graybox=1&qa=${stateName}`, stateName); assertState(state, fileName); captures.push({ ...(await screenshot(client, fileName)), state }); }
    await navigateAndWait(client, `${origin}/?graybox=1&qa=movement`, "movement");
    const framesDir = path.join(evidenceDir, "movement-frames"); await mkdir(framesDir, { recursive: true });
    const movementStates = []; const movementSnapshots = []; const captureFps = fidelityBatch ? 10 : 30; const frameCount = captureFps * 7; const screencastFrames = [];
    const removeScreencastListener = client.on("Page.screencastFrame", (event) => { screencastFrames.push({ data: event.params.data, timestamp: event.params.metadata.timestamp }); client.command("Page.screencastFrameAck", { sessionId: event.params.sessionId }).catch(() => {}); });
    const captureStartedAt = performance.now();
    await client.command("Page.startScreencast", { format: "png", maxWidth: 1280, maxHeight: 720, everyNthFrame: 1 });
    for (let index = 0; index < 14; index += 1) {
      await delay(500); const state = await qaState(client); movementStates.push(state);
      if (foundationBatch && index === 2) movementSnapshots.push({ ...(await screenshot(client, "E-player-plaza.png")), state });
      if (foundationBatch && index === 4) movementSnapshots.push({ ...(await screenshot(client, "F-player-stairs.png")), state });
      if (foundationBatch && index === 5) movementSnapshots.push({ ...(await screenshot(client, "G-player-quay.png")), state });
    }
    await client.command("Page.stopScreencast"); removeScreencastListener();
    const captureElapsedSeconds = (performance.now() - captureStartedAt) / 1000;
    const firstTimestamp = screencastFrames[0]?.timestamp;
    if (!firstTimestamp) throw new Error("No browser screencast frames were captured.");
    const sampledFrames = []; let nextTimestamp = firstTimestamp;
    for (const frame of screencastFrames) { if (frame.timestamp >= nextTimestamp - 0.002) { sampledFrames.push(frame); nextTimestamp += 1 / captureFps; if (sampledFrames.length === frameCount) break; } }
    if (sampledFrames.length !== frameCount) throw new Error(`Screencast produced ${sampledFrames.length}/${frameCount} real-time frames.`);
    const sampledDurationSeconds = sampledFrames.at(-1).timestamp - sampledFrames[0].timestamp;
    const sampledFps = (sampledFrames.length - 1) / sampledDurationSeconds;
    const minimumFps = fidelityBatch ? 9 : 28; const maximumFps = fidelityBatch ? 11 : 31;
    if (sampledDurationSeconds < 6.8 || sampledDurationSeconds > 7.4 || sampledFps < minimumFps || sampledFps > maximumFps) throw new Error(`Screencast timing was invalid: ${sampledFps.toFixed(2)} fps over ${sampledDurationSeconds.toFixed(2)}s.`);
    for (const [index, frame] of sampledFrames.entries()) await writeFile(path.join(framesDir, `frame-${String(index).padStart(3, "0")}.png`), Buffer.from(frame.data, "base64"));
    await delay(350); const movementEnd = await qaState(client);
    const maximumRealTimeSeconds = fidelityBatch ? 10 : 8.5;
    if (captureElapsedSeconds < 6.9 || captureElapsedSeconds > maximumRealTimeSeconds) throw new Error(`Real-time capture duration was invalid: ${captureElapsedSeconds.toFixed(2)}s.`);
    if (!movementStates.some((state) => state?.player?.moving && state.player.animation.startsWith("gb-walk-"))) throw new Error("Movement evidence did not expose a walk animation state.");
    if (!movementStates.some((state) => state?.player?.animation === "gb-walk-right") || !movementStates.some((state) => state?.player?.animation === "gb-walk-down")) throw new Error("Movement evidence did not expose expected directional walk animations.");
    if (!movementStates.some((state) => state?.camera?.deadzone?.width === 300 && state.camera.deadzone.height === 180)) throw new Error("Camera dead-zone was not active during motion evidence.");
    if (new Set(movementStates.map((state) => `${state?.camera?.x},${state?.camera?.y}`)).size < 2) throw new Error("Camera did not follow after the player crossed the dead-zone.");
    if (movementEnd?.player?.animation !== `gb-idle-${movementEnd.player.facing}`) throw new Error("Movement evidence did not return the player to the matching idle animation.");
    await navigateAndWait(client, `${origin}/?graybox=1&qa=movement-reverse`, "movement-reverse");
    const reverseStates = [];
    for (let index = 0; index < 9; index += 1) { await delay(500); reverseStates.push(await qaState(client)); }
    if (!reverseStates.some((state) => state?.player?.moving && state.player.animation === "gb-walk-up")) throw new Error("Reverse stair traversal did not expose an upward walk animation.");
    if (!reverseStates.some((state) => state?.player?.y < 650)) throw new Error("Reverse stair traversal did not reach the upper level.");
    const gif = path.join(evidenceDir, "movement-plaza-stairs-quay-30fps.gif"); const mp4 = path.join(evidenceDir, "movement-plaza-stairs-quay-30fps.mp4");
    await run("ffmpeg", ["-y", "-framerate", String(captureFps), "-i", path.join(framesDir, "frame-%03d.png"), "-vf", `fps=${captureFps},scale=1280:-2:flags=lanczos`, gif], evidenceDir);
    await run("ffmpeg", ["-y", "-framerate", String(captureFps), "-i", path.join(framesDir, "frame-%03d.png"), "-c:v", "libx264", "-pix_fmt", "yuv420p", mp4], evidenceDir);
    assertNoBrowserErrors(client.events);
    if (foundationBatch && movementSnapshots.length !== 3) throw new Error("R3C foundation evidence did not capture all three moving-player views.");
    const gate = fidelityBatch ? "READY_FOR_FOUNDATION_VISUAL_FIDELITY_HUMAN_GATE" : foundationBatch ? "READY_FOR_ENVIRONMENT_ART_BATCH_A_HUMAN_GATE" : "READY_FOR_GRAYBOX_MOTION_HUMAN_GATE";
    await writeFile(path.join(evidenceDir, "qa-result.json"), `${JSON.stringify({ gate, viewport: "1280x720", captures: [...captures, ...movementSnapshots].map(({ fileName, bytes, state }) => ({ fileName, bytes, qaState: state.qaState, player: state.player, camera: state.camera })), movement: { gif: path.basename(gif), mp4: path.basename(mp4), frames: frameCount, encodedFps: captureFps, encodedDurationSeconds: frameCount / captureFps, sampledCaptureFps: Number(sampledFps.toFixed(3)), sampledCaptureSeconds: Number(sampledDurationSeconds.toFixed(3)), realTimeCaptureSeconds: Number(captureElapsedSeconds.toFixed(3)), walkAnimationObserved: true, directionalWalkAnimationsObserved: ["right", "down"], reverseStairTraversalObserved: true, idleAnimationRestored: true, cameraDeadzone: { width: 300, height: 180 }, cameraFollowObserved: true }, browserErrors: 0 }, null, 2)}\n`, "utf8");
    await client.command("Browser.close"); client.close(); console.log(`Graybox QA complete: ${evidenceDir}`);
  } finally { vite.kill(); edge.kill(); }
}
main().catch((error) => { console.error(error.stack || error); process.exitCode = 1; });
