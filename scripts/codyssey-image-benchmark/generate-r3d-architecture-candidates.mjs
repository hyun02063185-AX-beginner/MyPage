#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findImagePayload } from "./run-codyssey-image-benchmark.mjs";

const MODEL = "gpt-image-2";
const DEFAULT_BASE_URL = "https://copa.codyssey.kr";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUTPUT = resolve(ROOT, "output", "codyssey-image-benchmark", "r3d-environment-art-batch-b");

const CORE = `Create a single isolated source-art study for an actual 2D elevated three-quarter exploration game. This is a building asset, not a complete scene, and it must fit tightly inside a simple uniform #ff00ff chroma background so deterministic background removal can create a clean runtime silhouette. Use no ground plane, no landscape, no water, no people, no loose props, no text, no labels, no UI, no map, no framing, and no cast shadow extending away from the building. Refined Mediterranean fantasy harbor architecture: warm sunlit limestone, restrained terracotta roof, crisp geometry, believable human scale, deep blue and muted gold maritime accents only where requested. The facade faces forward toward the player and is compact enough to read at runtime. A doorway must be visibly human-scale, bright/recessed but never a black hole. Avoid castle silhouettes, giant monumentality, painterly smearing, haze, noisy micro-detail, malformed arches, and background scenery.`;

const CANDIDATES = [
  { code: "hall-a", title: "Hall A — GAMEPLAY-FIRST", detail: "A prestigious but civic exhibition hall facade. Create one continuous low, wide facade with a strong, centered human-scale entrance arch, simple limestone pilasters, a shallow terracotta roofline, and sparse blue accent panels. Prioritize clean silhouette and entrance readability. It must visually break into left facade, central 100-pixel entrance span, and right facade at runtime without making the hall look wider or taller than a compact 440 by 145 gameplay rectangle." },
  { code: "hall-b", title: "Hall B — PREMIUM", detail: "A prestigious cultural exhibition hall facade with the exact same compact, low, wide footprint and central human-scale entrance. Add richer but restrained facade rhythm: elegant limestone bays, a few narrow deep-blue and muted-gold maritime banners fixed to the facade, and fine terracotta eaves. Retain an unmistakable bright/recessed entrance and a clear silhouette; do not make it taller, wider, fortress-like, or plaza-obscuring." },
  { code: "workshop-a", title: "Workshop A — GAMEPLAY-FIRST", detail: "A clearly secondary, practical Mediterranean harbor workshop: compact tall-ish craft-house facade, warm limestone lower walls, terracotta roof, timber lintel and restrained striped awning. Include a broad, bright open-workspace doorway cue with visible interior warmth but no dark hole. The building should read as a working structure, not a civic hall; no loose crates, tools, boats, or route-cluttering props." },
  { code: "workshop-b", title: "Workshop B — RICHER CHARACTER", detail: "A clearly secondary Mediterranean harbor craft-house: warm limestone, weathered timber trim, restrained terracotta roof, a small crafted awning and implied workshop material identity integrated into the facade. Include a broad human-scale, bright open-workspace doorway cue. It should be warmer and more utilitarian than the Hall but remain uncluttered: no loose props, tools, crates, people, boats, or objects outside the clean building silhouette." },
];

function baseUrl(value) { return (value || DEFAULT_BASE_URL).replace(/\/+$/, ""); }
function rawBase64(value) { return value.replace(/^data:[^,]+,/, ""); }
function redact(value) { if (Array.isArray(value)) return value.map(redact); if (!value || typeof value !== "object") return value; return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, key === "b64_json" ? "[omitted; original bytes preserved separately]" : redact(child)])); }
function imageInfo(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { format: "png", width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  throw new Error("Codyssey returned bytes that are not an openable PNG.");
}
async function exists(file) { try { await access(file, constants.F_OK); return true; } catch { return false; } }
async function json(name, value) { await writeFile(resolve(OUTPUT, name), `${JSON.stringify(value, null, 2)}\n`, "utf8"); }
async function assertOpens(file) {
  const safe = file.replace(/'/g, "''");
  await new Promise((resolvePromise, reject) => {
    const child = spawn("powershell", ["-NoProfile", "-NonInteractive", "-Command", `Add-Type -AssemblyName System.Drawing; $image = [System.Drawing.Image]::FromFile('${safe}'); $image.Dispose()`], { windowsHide: true });
    let stderr = ""; child.stderr.on("data", (chunk) => { stderr += chunk; }); child.on("error", reject); child.on("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(stderr || `image open check exited ${code}`)));
  });
}

async function generate(apiBase, apiKey, candidate) {
  const startedAt = new Date().toISOString();
  const request = { model: MODEL, prompt: `${CORE}\n\nCandidate: ${candidate.title}.\n${candidate.detail}`, response_format: "b64_json", size: "1024x1024", quality: "high" };
  const metadata = { round: "R3D Environment Art Batch B", candidate, startedAt, model: MODEL, request: { endpoint: "/api/v1/images", body: request } };
  try {
    const response = await fetch(`${apiBase}/api/v1/images`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(request) });
    const raw = await response.text(); let body;
    try { body = raw ? JSON.parse(raw) : null; } catch { body = { nonJsonBody: raw.slice(0, 1000) }; }
    metadata.response = { status: response.status, ok: response.ok, body: redact(body) };
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = findImagePayload(body); if (!payload?.b64Json) throw new Error("HTTP 200 did not contain image bytes.");
    const bytes = Buffer.from(rawBase64(payload.b64Json), "base64"); const info = imageInfo(bytes);
    if (!bytes.length || !info.width || !info.height) throw new Error("Decoded image was empty or unreadable.");
    const imageFile = `${candidate.code}.${MODEL}.original.png`;
    const imagePath = resolve(OUTPUT, imageFile); await writeFile(imagePath, bytes); await assertOpens(imagePath);
    metadata.image = { file: imageFile, ...info, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), source: payload.source, originalReturnedBytes: true, opens: true };
    metadata.completedAt = new Date().toISOString(); await json(`${candidate.code}.metadata.json`, metadata);
    return metadata.image;
  } catch (error) {
    metadata.completedAt = new Date().toISOString(); metadata.error = error instanceof Error ? error.message : String(error);
    await json(`${candidate.code}.metadata.json`, metadata); throw error;
  }
}

async function main() {
  const nextOnly = process.argv[2] === "--next";
  if (process.argv.length > 2 && !nextOnly) throw new Error("Use no argument for a fresh four-request run or --next to continue after a validated prior response.");
  if (!process.env.CODYSSEY_API_KEY) throw new Error("CODYSSEY_API_KEY is not set; no requests were sent.");
  await mkdir(OUTPUT, { recursive: true });
  const runFile = resolve(OUTPUT, "run.json");
  if (!nextOnly && await exists(runFile)) throw new Error("R3D output already has run.json; refusing duplicate generation.");
  if (nextOnly && !(await exists(runFile)) && !(await exists(resolve(OUTPUT, `${CANDIDATES[0].code}.metadata.json`)))) throw new Error("No validated first R3D candidate exists; refusing an unsequenced continuation.");
  const apiBase = baseUrl(process.env.CODYSSEY_API_BASE_URL);
  if (!nextOnly) {
    await json("run.json", { round: "R3D Environment Art Batch B", model: MODEL, endpoint: "/api/v1/images", baseUrl: apiBase, requestCount: 4, sequence: CANDIDATES.map(({ code, title }) => ({ code, title })), policy: "exactly four sequential requests; stop immediately on provider failure; raw bytes saved unchanged" });
    await writeFile(resolve(OUTPUT, "prompts.md"), `# R3D Environment Art Batch B prompts\n\n${CORE}\n\n${CANDIDATES.map((candidate) => `## ${candidate.title}\n\n${candidate.detail}`).join("\n\n")}`, "utf8");
  }
  const results = [];
  for (const candidate of CANDIDATES) {
    const metadataFile = resolve(OUTPUT, `${candidate.code}.metadata.json`);
    if (await exists(metadataFile)) {
      const metadata = JSON.parse(await readFile(metadataFile, "utf8"));
      if (!metadata.response?.ok || !metadata.image?.file || !(await exists(resolve(OUTPUT, metadata.image.file)))) throw new Error(`${candidate.code} is not a validated success; subsequent requests are blocked.`);
      results.push({ code: candidate.code, ...metadata.image });
      continue;
    }
    results.push({ code: candidate.code, ...(await generate(apiBase, process.env.CODYSSEY_API_KEY, candidate)) });
    if (nextOnly) break;
  }
  await json("summary.json", { status: results.length === CANDIDATES.length ? "success" : "in-progress", results });
  console.log(JSON.stringify({ output: OUTPUT, results }, null, 2));
}

main().catch((error) => { console.error(`R3D Batch B stopped: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
