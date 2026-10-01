#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, mkdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findImagePayload } from "./run-codyssey-image-benchmark.mjs";

const MODEL = "gemini-2.5-flash-image";
const DEFAULT_BASE_URL = "https://copa.codyssey.kr";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..", "..");
// The first authorized attempt is retained separately because its malformed
// PNG validator discarded the inline bytes before persistence. This fresh,
// explicitly authorized run has its own immutable provenance directory.
const OUTPUT = resolve(ROOT, "output", "codyssey-image-benchmark", "r3c-foundation-batch-a-rerun-01");
const CONTACT_SHEET = resolve(SCRIPT_DIR, "create-r3c-foundation-contact-sheet.ps1");

const PROMPT_CORE = `Create one isolated visual material study board for a 2D top-down / elevated three-quarter playable harbor game. It is NOT a complete harbor scene and must contain no buildings, no boats, no people, no plants, no props, no labels, no UI, no maps, and no decorative clutter. Show only four clearly separated, orthographic-friendly material regions: (1) broad upper-plaza paving, (2) a short wide run of main-stair surface with unambiguous risers, (3) broad lower-quay paving, and (4) a narrow vertical quay-edge stone face beside a small strip of turquoise-compatible water. Use warm Mediterranean limestone, refined premium harbor identity, subtle age and wear, crisp paving joints, coherent large stone scale, sharp architectural surfaces, controlled local contrast, and clean water/ground/wall boundaries. The output is a visual language reference for deterministic runtime paving, not a scene background or a texture atlas. Avoid haze, soft focus, painterly smearing, noisy micro-detail, busy mosaic patterns, excessive cracks, fake steps, confusing borders, high-frequency noise, malformed stone, text, watermark, or collage framing.`;

const STUDIES = [
  { code: "A", id: "clean-gameplay-first", title: "CLEAN / GAMEPLAY-FIRST", detail: "Prioritize large clean paving shapes, restrained tonal variation, broad quiet walkable fields, very sharp stair edges, and a plain, unmistakable quay boundary. Keep joints sparse, regular, and legible at player scale." },
  { code: "B", id: "richer-premium", title: "RICHER / PREMIUM", detail: "Keep the same structural clarity while adding slightly richer natural limestone variation, restrained Mediterranean border/inlay language only at outer margins, and a stronger premium material finish. Do not let ornament read as collision geometry or obscure the routes." },
];

function cleanBaseUrl(value) { return (value || DEFAULT_BASE_URL).replace(/\/+$/, ""); }
function safeName(value) { return value.replace(/[^a-z0-9.-]/gi, "-"); }
function redact(value) { if (Array.isArray(value)) return value.map(redact); if (!value || typeof value !== "object") return value; return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, key === "b64_json" ? "[omitted; original bytes preserved separately]" : redact(child)])); }
function imageInfo(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { format: "png", width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    for (let index = 2; index < bytes.length - 9;) { if (bytes[index] !== 0xff) { index += 1; continue; } const marker = bytes[index + 1]; const length = bytes.readUInt16BE(index + 2); if (marker >= 0xc0 && marker <= 0xc3) return { format: "jpg", height: bytes.readUInt16BE(index + 5), width: bytes.readUInt16BE(index + 7) }; index += 2 + length; }
  }
  if (bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") {
    const chunk = bytes.subarray(12, 16).toString("ascii"); if (chunk === "VP8X") return { format: "webp", width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3) }; if (chunk === "VP8 ") return { format: "webp", width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff }; if (chunk === "VP8L") { const bits = bytes.readUInt32LE(21); return { format: "webp", width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }; }
  }
  throw new Error("Codyssey returned an unsupported image payload.");
}
function rawBase64(payload) { return payload.replace(/^data:[^,]+,/, ""); }
async function writeJson(name, value) { await writeFile(resolve(OUTPUT, name), `${JSON.stringify(value, null, 2)}\n`, "utf8"); }
async function exists(path) { try { await access(path, constants.F_OK); return true; } catch { return false; } }

async function generate(baseUrl, apiKey, study) {
  const startedAt = new Date().toISOString(); const timer = performance.now();
  const request = { model: MODEL, prompt: `${PROMPT_CORE}\n\nStudy direction: ${study.title}.\n${study.detail}`, response_format: "b64_json" };
  const stem = `${study.code}-${study.id}.${safeName(MODEL)}`; const metadataFile = `${stem}.metadata.json`;
  let metadata;
  try {
    const response = await fetch(`${baseUrl}/api/v1/images`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(request) });
    const raw = await response.text(); let body;
    try { body = raw ? JSON.parse(raw) : null; } catch { body = { nonJsonBody: raw.slice(0, 1000) }; }
    metadata = { round: "R3C Environment Art Batch A", model: MODEL, study, startedAt, completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - timer), request: { endpoint: "/api/v1/images", body: request }, response: { status: response.status, ok: response.ok, body: redact(body) } };
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = findImagePayload(body); if (!payload?.b64Json) throw new Error("Successful response did not contain base64 image data.");
    const bytes = Buffer.from(rawBase64(payload.b64Json), "base64"); const dimensions = imageInfo(bytes);
    if (!bytes.length || !dimensions.width || !dimensions.height) throw new Error("Returned image bytes were empty or unreadable.");
    const imageFile = `${stem}.${dimensions.format}`; await writeFile(resolve(OUTPUT, imageFile), bytes);
    metadata.image = { file: imageFile, format: dimensions.format, width: dimensions.width, height: dimensions.height, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), source: payload.source, savedAt: new Date().toISOString(), originalReturnedBytes: true };
    await writeJson(metadataFile, metadata); return { status: "success", study, imageFile, metadataFile, ...metadata.image };
  } catch (error) {
    metadata ??= { round: "R3C Environment Art Batch A", model: MODEL, study, startedAt, completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - timer), request: { endpoint: "/api/v1/images", body: request } };
    metadata.error = error instanceof Error ? error.message : String(error); await writeJson(metadataFile, metadata); return { status: "failed", study, metadataFile, error: metadata.error };
  }
}

function reviewMatrix(results) {
  const cols = results.map((result) => result.study.code).join(" | ");
  const rows = ["Paving clarity", "Stair readability", "Level distinction", "Quay edge readability", "Player visibility", "Visual quality", "Mediterranean style consistency", "Risk of clutter / fake collision cues"];
  return `# R3C Environment Art Batch A — Foundation Review Matrix\n\nNo architecture direction is selected by this batch. Review each original study against the fixed graybox geometry.\n\n| Check | ${cols} |\n| --- | ${results.map(() => "---").join(" | ")} |\n${rows.map((row) => `| ${row} | ${results.map(() => "Human review required").join(" | ")} |`).join("\n")}\n\nAllowed values: PASS / CAUTION / FAIL.\n`;
}

async function contactSheet() { await new Promise((resolvePromise, reject) => { const child = spawn("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", CONTACT_SHEET, "-InputDirectory", OUTPUT], { windowsHide: true }); let stderr = ""; child.stderr.on("data", (chunk) => { stderr += chunk; }); child.on("error", reject); child.on("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(stderr || `contact sheet exited ${code}`))); }); }

async function main() {
  if (process.argv.length > 2) throw new Error("R3C Batch A always sends exactly two requests; no retry or subset mode is supported.");
  const apiKey = process.env.CODYSSEY_API_KEY; if (!apiKey) throw new Error("CODYSSEY_API_KEY is not set; no requests were sent.");
  await mkdir(OUTPUT, { recursive: true });
  const run = resolve(OUTPUT, "run.json"); if (await exists(run)) throw new Error("R3C Batch A output already has run.json; refusing to send duplicate requests.");
  const baseUrl = cleanBaseUrl(process.env.CODYSSEY_API_BASE_URL);
  await writeJson("run.json", { round: "R3C Environment Art Batch A", model: MODEL, endpoint: "/api/v1/images", baseUrl, requestCount: 2, policy: "exactly two independent visual foundation studies; no retries", startedAt: new Date().toISOString(), studies: STUDIES.map(({ code, id, title }) => ({ code, id, title })) });
  await writeFile(resolve(OUTPUT, "prompts.md"), `# R3C Batch A prompts\n\n${PROMPT_CORE}\n\n${STUDIES.map((study) => `## ${study.code}. ${study.title}\n\n${study.detail}`).join("\n\n")}`, "utf8");
  const results = []; for (const study of STUDIES) results.push(await generate(baseUrl, apiKey, study));
  await writeFile(resolve(OUTPUT, "review-matrix.md"), reviewMatrix(results), "utf8");
  if (results.every((result) => result.status === "success")) await contactSheet();
  console.log(JSON.stringify({ output: OUTPUT, results }, null, 2));
  if (!results.every((result) => result.status === "success")) process.exitCode = 1;
}

main().catch((error) => { console.error(`R3C Batch A stopped: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
