#!/usr/bin/env node

import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { findImagePayload } from "./run-codyssey-image-benchmark.mjs";

const MODEL = "gpt-image-2";
const DEFAULT_BASE_URL = "https://copa.codyssey.kr";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..", "..");
const OUTPUT = resolve(ROOT, "output", "codyssey-image-benchmark", "harbor-playable-round-02b");
const CONTACT_SHEET = resolve(SCRIPT_DIR, "create-harbor-round-02b-contact-sheet.ps1");

const CORE = `Create an actual playable 2D exploration game environment, not a distant harbor panorama. Use a close elevated three-quarter, readable isometric-like gameplay camera at player-centered navigation scale. The controllable player is a hard requirement: clearly readable at approximately 8–10 percent of image height, intentionally oversized if needed, with visible facing direction and a clean silhouette. Nearby stairs, doors, benches, and railings must establish usable game scale. Never make the player a tiny human dot or smaller than a normal gameplay-scale character.\n\nUse the proven simple two-level harbor logic: no more than two meaningful gameplay elevations; an upper civic/exhibition plaza; a lower harbor/quay level; one or two broad obvious stair flights with landing space; generous open paved areas; clear water and collision boundaries; no terrace maze; no route through roofs or walls. Keep a visible workshop/making landmark near a plaza edge or level transition. A three-mast Age-of-Sail Hero Ship with an attractive wooden hull and furled/stowed sails is moored beside the playable space at Hero Quay. It is important but does not obstruct routes, dominate half the frame, obscure the player, or force the camera outward.\n\nRefined Mediterranean fantasy harbor: warm pale stone, terracotta roofs, teal sheltered water, elegant planting, lamps, benches, planters, restrained market activity, and premium portfolio-world atmosphere. Decoration frames walkable space and never obscures primary paths. Production-quality game environment concept art: crisp architectural edges, high local clarity, sharply defined paving, clean stair geometry, clear doors, water/quay boundaries, coherent railings and walls, controlled detailed materials. Clarity over micro-detail. Avoid soft focus, haze, muddy textures, painterly smearing, mushy paving, malformed stairs, distorted doors/windows, noisy micro-detail, oversharpened artifacts, labels, typography, UI, maps, arrows, collage panels, huge sea areas, aerial tourism composition, and postcard framing.`;

const VARIANTS = [
  { code: "2B-1", id: "gameplay-priority", title: "Gameplay Priority", prompt: `Prioritize maximum gameplay clarity while retaining a premium harbor. Create a large central open plaza with a clear upper Exhibition Hall, simple broad stairs down to the lower quay, a visible workshop/making landmark on one edge, and a clearly reachable Hero Quay and Hero Ship. Put the player near the center of the playable space at 8–10 percent of image height. Preserve generous walkable ground, clean collision boundaries, closer gameplay camera, and crisp high-quality rendering. Use a stable plaza framing with a subtle circular or semi-circular focal design; keep decoration mostly near edges.` },
  { code: "2B-2", id: "visual-richness", title: "Visual Richness", prompt: `Use the same fundamental two-level playable structure and preserve the 8–10 percent player scale, broad paths, clear routes, and close gameplay camera. Increase visual richness carefully with richer planting, refined lamps, benches, restrained banners, a stronger plaza focal detail, slightly more harbor activity, a more expressive Exhibition Hall facade, workshop character, and premium architectural detailing. Do not add levels, narrow paths, decorative mazes, significant sea area, or an oversized Hero Ship.` },
];

function baseUrl(value) { return (value || DEFAULT_BASE_URL).replace(/\/+$/, ""); }
function safeName(value) { return value.replace(/[^a-z0-9.-]/gi, "-"); }
function redact(value) { if (Array.isArray(value)) return value.map(redact); if (!value || typeof value !== "object") return value; return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, key === "b64_json" ? "[omitted; saved as original image file]" : redact(child)])); }
function imageInfo(image) {
  if (image.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { format: "png", width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
  if (image.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    for (let i = 2; i < image.length - 9;) { if (image[i] !== 0xff) { i += 1; continue; } const marker = image[i + 1]; const length = image.readUInt16BE(i + 2); if (marker >= 0xc0 && marker <= 0xc3) return { format: "jpg", height: image.readUInt16BE(i + 5), width: image.readUInt16BE(i + 7) }; i += 2 + length; }
  }
  if (image.subarray(0, 4).toString("ascii") === "RIFF" && image.subarray(8, 12).toString("ascii") === "WEBP") { const chunk = image.subarray(12, 16).toString("ascii"); if (chunk === "VP8X") return { format: "webp", width: 1 + image.readUIntLE(24, 3), height: 1 + image.readUIntLE(27, 3) }; if (chunk === "VP8 ") return { format: "webp", width: image.readUInt16LE(26) & 0x3fff, height: image.readUInt16LE(28) & 0x3fff }; if (chunk === "VP8L") { const bits = image.readUInt32LE(21); return { format: "webp", width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }; } }
  throw new Error("Unsupported or unreadable returned image format.");
}
async function writeJson(name, value) { await writeFile(resolve(OUTPUT, name), `${JSON.stringify(value, null, 2)}\n`, "utf8"); }
async function fileExists(path) { try { await access(path, constants.F_OK); return true; } catch { return false; } }
async function assertImageOpens(path) { const literalPath = path.replace(/'/g, "''"); await new Promise((resolvePromise, reject) => { const child = spawn("powershell", ["-NoProfile", "-NonInteractive", "-Command", `Add-Type -AssemblyName System.Drawing; $image = [System.Drawing.Image]::FromFile('${literalPath}'); $image.Dispose()`], { windowsHide: true }); let error = ""; child.stderr.on("data", (chunk) => { error += chunk; }); child.on("error", reject); child.on("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(error || `image-open check exited ${code}`))); }); }
async function makeContactSheet() { await new Promise((resolvePromise, reject) => { const child = spawn("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", CONTACT_SHEET, "-InputDirectory", OUTPUT], { windowsHide: true }); let error = ""; child.stderr.on("data", (chunk) => { error += chunk; }); child.on("error", reject); child.on("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(error || `contact sheet exited ${code}`))); }); }
function matrix(results) { const headings = results.map((item) => item.variant.code).join(" | "); const cells = results.map(() => "Human review required").join(" | "); const checks = ["Player readability", "Player scale", "Walkable-ground clarity", "Path readability", "Exhibition Hall approach", "Workshop approach", "Hero Quay approach", "Collision-boundary clarity", "Hero Ship placement", "Camera distance", "Visual richness", "Image clarity / sharpness", "Risk of static-illustration failure"]; return `# Playable Harbor Round 2B — Review Matrix\n\nNo overall winner is selected automatically.\n\n| Check | ${headings} |\n| --- | ${results.map(() => "---").join(" | ")} |\n${checks.map((check) => `| ${check} | ${cells} |`).join("\n")}\n\nUse PASS, CAUTION, or FAIL after visual review.\n`; }

async function generate(apiBaseUrl, apiKey, variant, phase) {
  const request = { model: MODEL, prompt: `${CORE}\n\nCandidate ${variant.code}: ${variant.title}.\n${variant.prompt}`, response_format: "b64_json" };
  const stem = `${variant.code}-${variant.id}.${safeName(MODEL)}`; const metadataFile = `${stem}.metadata.json`; const startedAt = new Date().toISOString(); const started = performance.now(); let metadata;
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/images`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(request) });
    const raw = await response.text(); let body; try { body = raw ? JSON.parse(raw) : null; } catch { body = { nonJsonBody: raw.slice(0, 1000) }; }
    metadata = { model: MODEL, variant, phase, startedAt, completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - started), request: { endpoint: "/api/v1/images", body: request }, response: { status: response.status, ok: response.ok, body: redact(body) } };
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = findImagePayload(body); if (!payload?.b64Json) throw new Error("Successful response did not contain result.images[].b64_json or a supported fallback.");
    const image = Buffer.from(payload.b64Json, "base64"); const info = imageInfo(image); if (!image.length || !info.width || !info.height) throw new Error("Returned image bytes could not be measured.");
    const imageFile = `${stem}.${info.format}`; const imagePath = resolve(OUTPUT, imageFile); await writeFile(imagePath, image); await assertImageOpens(imagePath);
    metadata.image = { file: imageFile, format: info.format, width: info.width, height: info.height, bytes: image.length, source: payload.source, savedAt: new Date().toISOString(), opens: true };
    await writeJson(metadataFile, metadata); return { status: "success", variant, imageFile, metadataFile, ...metadata.image };
  } catch (error) { metadata ??= { model: MODEL, variant, phase, startedAt, completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - started), request: { endpoint: "/api/v1/images", body: request } }; metadata.error = error instanceof Error ? error.message : String(error); await writeJson(metadataFile, metadata); return { status: "failed", variant, metadataFile, error: metadata.error }; }
}

async function main() {
  const mode = process.argv[2] || "--full-batch";
  if (!["--full-batch", "--second-only"].includes(mode)) throw new Error("Use --full-batch or --second-only.");
  const apiKey = process.env.CODYSSEY_API_KEY; if (!apiKey) throw new Error("CODYSSEY_API_KEY is not set; use run-with-codyssey-key.ps1. No requests were sent.");
  await mkdir(OUTPUT, { recursive: true }); const apiBaseUrl = baseUrl(process.env.CODYSSEY_API_BASE_URL);
  await writeJson("run.json", { round: "playable-harbor-02b", endpoint: "/api/v1/images", baseUrl: apiBaseUrl, model: MODEL, variants: VARIANTS.map(({ code, id, title }) => ({ code, id, title })), requestPolicy: "exactly two maximum; 2B-1 must decode and open before 2B-2; no retries", startedAt: new Date().toISOString() });
  await writeFile(resolve(OUTPUT, "prompts.md"), `# Playable Harbor Round 2B prompts\n\n${CORE}\n\n${VARIANTS.map((variant) => `## ${variant.code}. ${variant.title}\n\n${variant.prompt}`).join("\n\n")}`, "utf8");
  let results;
  if (mode === "--second-only") {
    const firstMetadataPath = resolve(OUTPUT, `2B-1-gameplay-priority.${safeName(MODEL)}.metadata.json`);
    if (!(await fileExists(firstMetadataPath))) throw new Error("2B-1 metadata is missing; 2B-2 was not sent.");
    const firstMetadata = JSON.parse(await readFile(firstMetadataPath, "utf8"));
    if (!firstMetadata.response?.ok || !firstMetadata.image?.file) throw new Error("2B-1 was not a validated success; 2B-2 was not sent.");
    const firstImagePath = resolve(OUTPUT, firstMetadata.image.file);
    if (!(await fileExists(firstImagePath))) throw new Error("2B-1 original image is missing; 2B-2 was not sent.");
    await assertImageOpens(firstImagePath);
    results = [{ status: "success", variant: VARIANTS[0], ...firstMetadata.image }];
  }
  else {
    const first = await generate(apiBaseUrl, apiKey, VARIANTS[0], "first-and-gate");
    results = [first];
    if (first.status !== "success") { await writeFile(resolve(OUTPUT, "review-matrix.md"), matrix(results), "utf8"); console.error("2B-1 failed validation; 2B-2 was not sent."); process.exitCode = 1; return; }
  }
  const second = await generate(apiBaseUrl, apiKey, VARIANTS[1], "second-after-first-gate"); results.push(second); await writeFile(resolve(OUTPUT, "review-matrix.md"), matrix(results), "utf8");
  if (second.status !== "success") { console.error("2B-2 failed; no further requests were sent."); process.exitCode = 1; return; }
  await makeContactSheet(); console.log(`Round 2B complete: 2 original images saved to ${OUTPUT}`);
}
main().catch((error) => { console.error(`Round 2B stopped: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
