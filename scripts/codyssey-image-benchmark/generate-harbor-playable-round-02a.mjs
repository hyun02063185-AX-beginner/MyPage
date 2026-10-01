#!/usr/bin/env node

import { mkdir, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { findImagePayload } from "./run-codyssey-image-benchmark.mjs";

const MODEL = "gemini-2.5-flash-image";
const DEFAULT_BASE_URL = "https://copa.codyssey.kr";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..", "..");
const OUTPUT = resolve(ROOT, "output", "codyssey-image-benchmark", "harbor-playable-round-02a");
const CONTACT_SHEET = resolve(SCRIPT_DIR, "create-harbor-round-02a-contact-sheet.ps1");

const CORE_PROMPT = `Design this as an actual playable 2D exploration game environment, not as a scenic harbor illustration. Use a closer elevated three-quarter gameplay camera. The primary controllable player character must be clearly readable at gameplay scale, approximately 7–10 percent of image height. Make walkable ground immediately understandable through broad stone paving, clear paths, stairs, doors, quay edges, and architectural boundaries. Buildings frame playable space rather than consume it.\n\nCreate a refined Mediterranean fantasy harbor with warm pale-stone architecture, terracotta roofs, teal sheltered water, elegant greenery, warm daylight, and a three-mast Age-of-Sail Hero Ship with controlled furled or stowed sails. The main hall, workshop/market, Hero Quay, and Hero Ship must be visibly distinct and connected by broad plausible walking routes. The Hero Ship is a landmark at the water edge, not an obstruction to the central movement space.\n\nProduction-quality game environment concept art; crisp architectural edges; clean readable environmental forms; strong local clarity; sharp readable paving; clearly defined stairs, doors, quay edges, and player silhouette. Avoid a tiny-player scenic panorama, blurry rendering, haze, muddy textures, malformed stairs/railings, distorted architecture, labels, typography, UI, maps, arrows, collage panels, huge foreground buildings, open ocean, and panoramic postcard framing.`;

const VARIANTS = [
  { code: "A", id: "central-plaza-hub", title: "Central Plaza Hub", prompt: "Create a broad asymmetrical Harbor Square as the dominant playable hub. The Exhibition Hall is above or beside the square with one broad stair or a clear paved connection. Put the Workshop/market on one plaza edge, clearly separate from the main hall. A generous promenade exits naturally toward Hero Quay and the moored Hero Ship. Keep the player clearly visible in the open plaza at gameplay scale." },
  { code: "B", id: "plaza-waterfront-promenade", title: "Plaza + Waterfront Promenade", prompt: "Create an open central plaza as the primary hub with a broad continuous seaside promenade as the main exploration spine. The Exhibition Hall and Workshop/market connect naturally from the plaza with wide short routes, never a narrow corridor. Hero Quay is at the end or side of the promenade, and the Hero Ship is visible as the destination without cutting the route." },
  { code: "C", id: "simple-two-level-harbor", title: "Simple Two-Level Harbor", prompt: "Create only two meaningful gameplay elevations: an upper civic plaza containing the Exhibition Hall, and a lower waterfront/quay level. Connect them with one or two broad simple stair flights and obvious landing space. Put the Workshop near the transition. The lower level leads cleanly to Hero Quay and the Hero Ship. Do not create a terrace maze." },
];

function cleanBaseUrl(value) { return (value || DEFAULT_BASE_URL).replace(/\/+$/, ""); }
function safeName(value) { return value.replace(/[^a-z0-9.-]/gi, "-"); }
function decodeInfo(image) {
  if (image.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { format: "png", width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
  if (image.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    for (let index = 2; index < image.length - 9;) {
      if (image[index] !== 0xff) { index += 1; continue; }
      const marker = image[index + 1]; const length = image.readUInt16BE(index + 2);
      if (marker >= 0xc0 && marker <= 0xc3) return { format: "jpg", height: image.readUInt16BE(index + 5), width: image.readUInt16BE(index + 7) };
      index += 2 + length;
    }
  }
  if (image.subarray(0, 4).toString("ascii") === "RIFF" && image.subarray(8, 12).toString("ascii") === "WEBP") {
    const chunk = image.subarray(12, 16).toString("ascii");
    if (chunk === "VP8X") return { format: "webp", width: 1 + image.readUIntLE(24, 3), height: 1 + image.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { format: "webp", width: image.readUInt16LE(26) & 0x3fff, height: image.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") { const bits = image.readUInt32LE(21); return { format: "webp", width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }; }
  }
  throw new Error("Unsupported or unreadable returned image format.");
}
function redact(value) { if (Array.isArray(value)) return value.map(redact); if (!value || typeof value !== "object") return value; return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, key === "b64_json" ? "[omitted; saved as original image file]" : redact(child)])); }
async function json(name, value) { await writeFile(resolve(OUTPUT, name), `${JSON.stringify(value, null, 2)}\n`, "utf8"); }
async function exists(path) { try { await access(path, constants.F_OK); return true; } catch { return false; } }

async function generate(baseUrl, apiKey, variant, phase) {
  const prompt = `${CORE_PROMPT}\n\nStructural variant: ${variant.title}.\n${variant.prompt}`;
  const request = { model: MODEL, prompt, response_format: "b64_json" };
  const stem = `${variant.code}-${variant.id}.${safeName(MODEL)}`;
  const metadataFile = `${stem}.metadata.json`; const startedAt = new Date().toISOString(); const started = performance.now();
  let metadata;
  try {
    const response = await fetch(`${baseUrl}/api/v1/images`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(request) });
    const raw = await response.text(); let body;
    try { body = raw ? JSON.parse(raw) : null; } catch { body = { nonJsonBody: raw.slice(0, 1000) }; }
    metadata = { model: MODEL, variant, phase, startedAt, completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - started), request: { endpoint: "/api/v1/images", body: request }, response: { status: response.status, ok: response.ok, body: redact(body) } };
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = findImagePayload(body);
    if (!payload?.b64Json) throw new Error("Successful response did not contain a supported base64 image payload.");
    const image = Buffer.from(payload.b64Json, "base64"); const info = decodeInfo(image);
    if (!image.length || !info.width || !info.height) throw new Error("Returned bytes could not be measured as an image.");
    const imageFile = `${stem}.${info.format}`;
    await writeFile(resolve(OUTPUT, imageFile), image);
    metadata.image = { file: imageFile, format: info.format, width: info.width, height: info.height, bytes: image.length, source: payload.source, savedAt: new Date().toISOString() };
    await json(metadataFile, metadata);
    return { status: "success", variant, imageFile, metadataFile, ...metadata.image };
  } catch (error) {
    metadata ??= { model: MODEL, variant, phase, startedAt, completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - started), request: { endpoint: "/api/v1/images", body: request } };
    metadata.error = error instanceof Error ? error.message : String(error); await json(metadataFile, metadata);
    return { status: "failed", variant, metadataFile, error: metadata.error };
  }
}

function matrix(results) {
  const cols = results.map((r) => r.variant.code).join(" | "); const blanks = results.map(() => "Human review required").join(" | ");
  return `# Playable Harbor Round 2A — Human Review Matrix\n\nNo winner is selected automatically.\n\n| Check | ${cols} |\n| --- | ${results.map(() => "---").join(" | ")} |\n${["Player readability", "Path readability", "Plaza usability", "Hero Ship placement", "Gameplay suitability", "Image clarity"].map((check) => `| ${check} | ${blanks} |`).join("\n")}\n\nUse PASS, CAUTION, or FAIL after visual review.\n`;
}
async function contactSheet() { await new Promise((resolvePromise, reject) => { const child = spawn("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", CONTACT_SHEET, "-InputDirectory", OUTPUT], { windowsHide: true }); let error = ""; child.stderr.on("data", (chunk) => { error += chunk; }); child.on("error", reject); child.on("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(error || `contact sheet exited ${code}`))); }); }

async function main() {
  const mode = process.argv[2] || "--full-batch";
  if (!["--full-batch", "--smoke-only", "--remaining"].includes(mode)) throw new Error("Use --full-batch, --smoke-only, or --remaining.");
  const apiKey = process.env.CODYSSEY_API_KEY; if (!apiKey) throw new Error("CODYSSEY_API_KEY is not set; no requests were sent.");
  await mkdir(OUTPUT, { recursive: true });
  const baseUrl = cleanBaseUrl(process.env.CODYSSEY_API_BASE_URL);
  const runFile = resolve(OUTPUT, "run.json");
  if (!(await exists(runFile))) await json("run.json", { round: "playable-harbor-02a", endpoint: "/api/v1/images", baseUrl, model: MODEL, variants: VARIANTS.map(({ code, id, title }) => ({ code, id, title })), requestPolicy: "one smoke request first; after smoke success exactly two remaining requests; no retries", startedAt: new Date().toISOString() });
  await writeFile(resolve(OUTPUT, "prompts.md"), `# Playable Harbor Round 2A prompts\n\n${CORE_PROMPT}\n\n${VARIANTS.map((v) => `## ${v.code}. ${v.title}\n\n${v.prompt}`).join("\n\n")}`, "utf8");
  if (mode === "--smoke-only") {
    const result = await generate(baseUrl, apiKey, VARIANTS[0], "smoke");
    console.log(JSON.stringify(result)); if (result.status !== "success") process.exitCode = 1; return;
  }
  let results;
  if (mode === "--full-batch") {
    const smoke = await generate(baseUrl, apiKey, VARIANTS[0], "smoke");
    if (smoke.status !== "success") {
      await writeFile(resolve(OUTPUT, "review-matrix.md"), matrix([smoke]), "utf8");
      process.exitCode = 1;
      return;
    }
    results = [smoke];
  }
  else {
    const smokeMetadata = resolve(OUTPUT, `A-${VARIANTS[0].id}.${safeName(MODEL)}.metadata.json`);
    if (!(await exists(smokeMetadata))) throw new Error("Smoke metadata is missing; remaining requests were not sent.");
    results = [VARIANTS[0]].map((variant) => ({ variant }));
  }
  for (const variant of VARIANTS.slice(1)) { const result = await generate(baseUrl, apiKey, variant, "remaining-batch"); results.push(result); if (result.status !== "success") { await writeFile(resolve(OUTPUT, "review-matrix.md"), matrix(results), "utf8"); process.exitCode = 1; return; } }
  await writeFile(resolve(OUTPUT, "review-matrix.md"), matrix(results), "utf8"); await contactSheet(); console.log(`Round 2A complete: 3 original images saved to ${OUTPUT}`);
}
main().catch((error) => { console.error(`Round 2A stopped: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
