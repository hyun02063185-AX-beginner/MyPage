#!/usr/bin/env node

import { mkdir, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { findImagePayload } from "./run-codyssey-image-benchmark.mjs";

const MODEL = "gpt-image-2";
const DEFAULT_BASE_URL = "https://copa.codyssey.kr";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..", "..");
const OUTPUT = resolve(ROOT, "output", "codyssey-image-benchmark", "harbor-playable-round-02c");
const VARIANT = { code: "2C", id: "gameplay-framing", title: "Gameplay Framing Refinement" };
const STEM = "2C-gameplay-framing.gpt-image-2";
const METADATA = `${STEM}.metadata.json`;

const PROMPT = `Refine the established Round 2B-1 Gameplay Priority harbor into a closer, genuinely player-scale gameplay view. Do not redesign the harbor from scratch. Preserve its large upper plaza, part of the Exhibition Hall, broad main stairs, lower quay, workshop edge, Hero Ship destination, simple two-level navigation, clear water/wall/ground boundaries, and refined Mediterranean harbor identity.\n\nThis is an actual playable 2D exploration environment, not an establishing shot. Use a noticeably closer elevated three-quarter, readable isometric-like gameplay camera. Frame primarily part of the Exhibition Hall, central plaza, broad staircase, lower quay, and only the necessary portion of the Hero Ship. It is correct for buildings, ship, and distant harbor scenery to extend beyond the frame. Reduce sea, skyline, distant architecture, and peripheral decoration. Increase playable ground in screen space, player visibility, doorway/stair readability, and quay width.\n\nHard player requirement: place one clearly primary controllable player near the central playable space at approximately 12–15 percent of total image height, intentionally exaggerated relative to the architecture. The body silhouette, facing direction, legs, and ground contact must be immediately readable and large enough for future walk animation. Do not put multiple similar-sized NPCs near the player; any NPCs are few and visibly secondary.\n\nNavigation must read instantly: plaza to stairs to lower quay to Hero Ship; plaza to Exhibition Hall; plaza/lower edge to Workshop. Keep broad unobstructed walkable ground. Do not add levels, narrow alleys, maze routes, foreground architecture over the player, or decorative clutter in main routes. The three-mast Age-of-Sail Hero Ship needs only enough hull, mast, and gangway to establish a major destination; do not zoom out to show the whole ship.\n\nProduction-quality game environment concept art with crisp architectural geometry, sharply readable stone paving, clean stairs, clear doorways, sharp quay edges, coherent railings, clean player silhouette, high local contrast, refined warm stone, terracotta roofs, and turquoise sheltered water. Clarity over micro-detail. Avoid haze, soft focus, painterly smearing, noisy micro-detail, muddy stone, malformed railings, excessive decorative density, labels, typography, UI, maps, arrows, collage panels, aerial tourism composition, and postcard framing.`;

function cleanBaseUrl(value) { return (value || DEFAULT_BASE_URL).replace(/\/+$/, ""); }
function redact(value) { if (Array.isArray(value)) return value.map(redact); if (!value || typeof value !== "object") return value; return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, key === "b64_json" ? "[omitted; saved as original image file]" : redact(child)])); }
function info(image) {
  if (image.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { format: "png", width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
  if (image.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) { for (let i = 2; i < image.length - 9;) { if (image[i] !== 0xff) { i += 1; continue; } const marker = image[i + 1]; const length = image.readUInt16BE(i + 2); if (marker >= 0xc0 && marker <= 0xc3) return { format: "jpg", height: image.readUInt16BE(i + 5), width: image.readUInt16BE(i + 7) }; i += 2 + length; } }
  if (image.subarray(0, 4).toString("ascii") === "RIFF" && image.subarray(8, 12).toString("ascii") === "WEBP") { const chunk = image.subarray(12, 16).toString("ascii"); if (chunk === "VP8X") return { format: "webp", width: 1 + image.readUIntLE(24, 3), height: 1 + image.readUIntLE(27, 3) }; if (chunk === "VP8 ") return { format: "webp", width: image.readUInt16LE(26) & 0x3fff, height: image.readUInt16LE(28) & 0x3fff }; if (chunk === "VP8L") { const bits = image.readUInt32LE(21); return { format: "webp", width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }; } }
  throw new Error("Unsupported or unreadable returned image format.");
}
async function exists(path) { try { await access(path, constants.F_OK); return true; } catch { return false; } }
async function imageOpens(path) { const literalPath = path.replace(/'/g, "''"); await new Promise((resolvePromise, reject) => { const child = spawn("powershell", ["-NoProfile", "-NonInteractive", "-Command", `Add-Type -AssemblyName System.Drawing; $image = [System.Drawing.Image]::FromFile('${literalPath}'); $image.Dispose()`], { windowsHide: true }); let error = ""; child.stderr.on("data", (chunk) => { error += chunk; }); child.on("error", reject); child.on("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(error || `image-open check exited ${code}`))); }); }
function matrix() { return `# Playable Harbor Round 2C — Review Matrix\n\nNo final selection is automatic.\n\n| Check | 2C |\n| --- | --- |\n${["Player readability", "Player scale", "Gameplay camera distance", "Plaza readability", "Stair readability", "Lower quay readability", "Exhibition Hall approach", "Workshop approach", "Hero Ship approach", "Collision-boundary clarity", "Image sharpness"].map((check) => `| ${check} | Human review required |`).join("\n")}\n\nUse PASS, CAUTION, or FAIL after visual review.\n`; }

async function main() {
  const apiKey = process.env.CODYSSEY_API_KEY;
  if (!apiKey) throw new Error("CODYSSEY_API_KEY is not set; use run-with-codyssey-key.ps1. No requests were sent.");
  await mkdir(OUTPUT, { recursive: true });
  const metadataPath = resolve(OUTPUT, METADATA);
  if (await exists(metadataPath)) throw new Error("Round 2C already has a metadata record; no additional request was sent.");
  const request = { model: MODEL, prompt: PROMPT, response_format: "b64_json" };
  await writeFile(resolve(OUTPUT, "prompt.md"), `# Playable Harbor Round 2C prompt\n\n${PROMPT}\n`, "utf8");
  await writeFile(resolve(OUTPUT, "run.json"), `${JSON.stringify({ round: "playable-harbor-02c", endpoint: "/api/v1/images", model: MODEL, requestPolicy: "exactly one request; no retries; metadata guard prevents repeat requests", startedAt: new Date().toISOString() }, null, 2)}\n`, "utf8");
  const startedAt = new Date().toISOString(); const started = performance.now(); let metadata;
  try {
    const response = await fetch(`${cleanBaseUrl(process.env.CODYSSEY_API_BASE_URL)}/api/v1/images`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(request) });
    const raw = await response.text(); let body; try { body = raw ? JSON.parse(raw) : null; } catch { body = { nonJsonBody: raw.slice(0, 1000) }; }
    metadata = { model: MODEL, variant: VARIANT, startedAt, completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - started), request: { endpoint: "/api/v1/images", body: request }, response: { status: response.status, ok: response.ok, body: redact(body) } };
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = findImagePayload(body); if (!payload?.b64Json) throw new Error("Successful response did not contain a supported base64 image payload.");
    const image = Buffer.from(payload.b64Json, "base64"); const imageInfo = info(image); if (!image.length || !imageInfo.width || !imageInfo.height) throw new Error("Returned image could not be measured.");
    const imageFile = `${STEM}.${imageInfo.format}`; const imagePath = resolve(OUTPUT, imageFile); await writeFile(imagePath, image); await imageOpens(imagePath);
    metadata.image = { file: imageFile, format: imageInfo.format, width: imageInfo.width, height: imageInfo.height, bytes: image.length, sha256: createHash("sha256").update(image).digest("hex"), source: payload.source, savedAt: new Date().toISOString(), opens: true };
    await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8"); await writeFile(resolve(OUTPUT, "review-matrix.md"), matrix(), "utf8");
    console.log(`Round 2C complete: original image saved to ${imagePath}`);
  } catch (error) { metadata ??= { model: MODEL, variant: VARIANT, startedAt, completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - started), request: { endpoint: "/api/v1/images", body: request } }; metadata.error = error instanceof Error ? error.message : String(error); await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8"); process.exitCode = 1; }
}
main().catch((error) => { console.error(`Round 2C stopped: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
