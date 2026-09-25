import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { tmpdir } from "node:os";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const repoRoot = path.resolve(projectRoot, "..");
const reportsDir = path.join(repoRoot, "reports", "portfolio-world-rebuild", "evidence", "r2b");
const edgePaths = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const edgePath = edgePaths.find((candidate) => BunOrNodeFileExists(candidate));
const mode = process.argv.includes("--mode") ? process.argv[process.argv.indexOf("--mode") + 1] : "dev";

function BunOrNodeFileExists(candidate) {
  try {
    // Node keeps this synchronous check deliberately tiny; it only resolves the chosen browser executable.
    return process.getBuiltinModule("node:fs").existsSync(candidate);
  } catch {
    return false;
  }
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitFor(url, attempts = 80) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      lastError = error;
    }
    await delay(125);
  }
  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

class CdpClient {
  constructor(socketUrl) {
    this.socket = new WebSocket(socketUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result);
        return;
      }
      this.events.push(message);
    });
  }

  command(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async close() {
    this.socket.close();
  }
}

async function runCapture(client, origin, relativePath, fileName, qa, projection) {
  const errorsBefore = client.events.length;
  await client.command("Page.navigate", { url: `${origin}${relativePath}?qa=${qa}&projection=${projection}` });
  let state;
  let status = { canvas: false };
  for (let attempt = 0; attempt < 100; attempt += 1) {
    await delay(125);
    state = await client.command("Runtime.evaluate", {
      expression: "JSON.stringify({ canvas: Boolean(document.querySelector('canvas')), qa: window.__PORTFOLIO_WORLD_V2_QA__ })",
      returnByValue: true,
    });
    status = JSON.parse(state.result.value);
    if (status.canvas && status.qa?.activeScene === "WorldScene") break;
  }
  if (!status.canvas || status.qa?.activeScene !== "WorldScene") {
    const location = await client.command("Runtime.evaluate", { expression: "JSON.stringify({ href: location.href, title: document.title, body: document.body?.innerText.slice(0, 500) })", returnByValue: true });
    throw new Error(`${fileName}: canvas or WorldScene unavailable: ${state?.result.value}; page=${location.result.value}; events=${JSON.stringify(client.events.slice(-20), null, 2)}`);
  }
  if (status.qa.qaState !== qa || status.qa.projection !== projection) {
    throw new Error(`${fileName}: deterministic state mismatch: ${state.result.value}`);
  }
  const screenshot = await client.command("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(reportsDir, fileName), Buffer.from(screenshot.data, "base64"));

  const errors = client.events.slice(errorsBefore).filter((event) => {
    if (event.method === "Runtime.exceptionThrown") return true;
    if (event.method === "Runtime.consoleAPICalled") return event.params.type === "error";
    if (event.method === "Log.entryAdded") return event.params.entry.level === "error";
    if (event.method === "Network.loadingFailed") return !event.params.canceled;
    if (event.method === "Network.responseReceived") return event.params.response.status >= 400;
    return false;
  });
  if (errors.length) throw new Error(`${fileName}: browser errors: ${JSON.stringify(errors, null, 2)}`);
  return { fileName, state: status.qa };
}

async function main() {
  if (!edgePath) throw new Error("Microsoft Edge was not found at an expected project QA path.");
  await mkdir(reportsDir, { recursive: true });

  const webPort = await freePort();
  const cdpPort = await freePort();
  // Edge can retain a child process briefly on Windows; a unique OS-temp profile avoids
  // cross-run locks without adding a generated browser directory to the repository.
  const profileDir = await mkdtemp(path.join(tmpdir(), "portfolio-world-v2-qa-"));
  const viteArgs = mode === "build"
    ? ["node_modules/vite/bin/vite.js", "preview", "--base", "/MyPage/world-v2/", "--host", "127.0.0.1", "--port", String(webPort)]
    : ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", String(webPort)];
  const vite = spawn(process.execPath, viteArgs, { cwd: projectRoot, stdio: "pipe" });
  const edge = spawn(edgePath, [
    "--headless=new",
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${profileDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ], { stdio: "ignore" });

  try {
    const relativePath = mode === "build" ? "/MyPage/world-v2/" : "/";
    const origin = `http://127.0.0.1:${webPort}`;
    await waitFor(`${origin}${relativePath}`);
    const tabs = await (await waitFor(`http://127.0.0.1:${cdpPort}/json`)).json();
    const page = tabs.find((tab) => tab.type === "page");
    if (!page?.webSocketDebuggerUrl) throw new Error("Edge did not expose a debuggable page target.");
    const client = new CdpClient(page.webSocketDebuggerUrl);
    await client.open();
    await client.command("Runtime.enable");
    await client.command("Log.enable");
    await client.command("Network.enable");
    await client.command("Page.enable");
    await client.command("Emulation.setDeviceMetricsOverride", {
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const captures = [
      ["A-entry.png", "entry", "mid"],
      ["B-overview.png", "overview", "mid"],
      ["C-hero-quay.png", "hero", "mid"],
      ["D-scale-calibration.png", "scale", "mid"],
      ["projection-low.png", "overview", "low"],
      ["projection-mid.png", "overview", "mid"],
      ["projection-high.png", "overview", "high"],
    ];
    const results = [];
    for (const [fileName, qa, projection] of captures) results.push(await runCapture(client, origin, relativePath, fileName, qa, projection));
    await client.command("Browser.close");
    await client.close();
    console.log(JSON.stringify({ mode, viewport: "1280x720", results }, null, 2));
  } finally {
    vite.kill();
    edge.kill();
  }
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
