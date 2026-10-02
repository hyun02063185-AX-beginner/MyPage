#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, constants, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findImagePayload } from "./run-codyssey-image-benchmark.mjs";

const MODEL = "gemini-2.5-flash-image";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUTPUT = resolve(ROOT, "output", "codyssey-image-benchmark", "r3f-environment-art-batch-d");
const CORE = "Create an isolated prop-language study for a premium 2D elevated three-quarter Mediterranean fantasy harbor game. This is a prop board, NOT a complete harbor scene: no buildings, no boats, no people, no background plate, no water vista, no UI, labels, maps, text, collage framing, or watermark. Show warmly sunlit limestone, terracotta clay, warm weathered wood, deep navy and muted-gold maritime metal, clear material separation, crisp readable silhouettes, and controlled gameplay-scale detail. Include only believable dock and plaza details: stone bench, terracotta planter with low green foliage, wrought maritime lamp, blue-and-gold banner, wood crates, barrel, rope coil, cast-metal bollard, and a short iron railing sample. Avoid haze, soft focus, painterly smearing, malformed railings, noisy micro-detail, and ground shadows that imply collision.";
const STUDIES = [
  { code: "A", id: "restrained-premium", title: "RESTRAINED PREMIUM HARBOR", detail: "Use a deliberately sparse, curated arrangement with generous breathing room between each prop. Every object should feel crafted and high-value; emphasize clean silhouettes and a calm, ordered visual rhythm." },
  { code: "B", id: "lived-in-working", title: "LIVED-IN WORKING HARBOR", detail: "Use a slightly richer but still disciplined working-dock cluster: paired crates, one barrel, a coiled rope, fuller planter foliage, and small maritime wear details. Preserve strong walkable-route clarity and avoid clutter." },
];
function cleanBaseUrl(value) { return (value || "https://copa.codyssey.kr").replace(/\/+$/, ""); }
function redact(value) { if (Array.isArray(value)) return value.map(redact); if (!value || typeof value !== "object") return value; return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, key === "b64_json" ? "[omitted; original bytes preserved separately]" : redact(child)])); }
function payloadBase64(value) { return value.replace(/^data:[^,]+,/, ""); }
function imageInfo(bytes) { if (!bytes.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))) throw new Error("Expected a PNG response."); return { format: "png", width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }; }
async function exists(file) { try { await access(file, constants.F_OK); return true; } catch { return false; } }
async function saveJson(name, value) { await writeFile(resolve(OUTPUT, name), `${JSON.stringify(value, null, 2)}\n`, "utf8"); }
async function generate(study, apiKey, baseUrl) {
  const startedAt = new Date().toISOString();
  const request = { model: MODEL, prompt: `${CORE}\n\nStudy direction: ${study.title}.\n${study.detail}`, response_format: "b64_json" };
  const stem = `${study.code}-${study.id}.${MODEL}`;
  let metadata = { round: "R3F Environment Art Batch D", model: MODEL, study, startedAt, request: { endpoint: "/api/v1/images", body: request } };
  try {
    const response = await fetch(`${baseUrl}/api/v1/images`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(request) });
    const raw = await response.text(); let body; try { body = raw ? JSON.parse(raw) : null; } catch { body = { nonJsonBody: raw.slice(0, 1000) }; }
    metadata.response = { status: response.status, ok: response.ok, body: redact(body) }; metadata.completedAt = new Date().toISOString();
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = findImagePayload(body); if (!payload?.b64Json) throw new Error("Successful response did not contain base64 image data.");
    const bytes = Buffer.from(payloadBase64(payload.b64Json), "base64"); const dimensions = imageInfo(bytes);
    const imageFile = `${stem}.original.png`; await writeFile(resolve(OUTPUT, imageFile), bytes);
    metadata.image = { file: imageFile, ...dimensions, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), source: payload.source, originalReturnedBytes: true };
    await saveJson(`${stem}.metadata.json`, metadata); return { status: "success", study, imageFile, ...metadata.image };
  } catch (error) { metadata.completedAt = new Date().toISOString(); metadata.error = error instanceof Error ? error.message : String(error); await saveJson(`${stem}.metadata.json`, metadata); return { status: "failed", study, error: metadata.error }; }
}
async function main() {
  if (process.argv.length > 2) throw new Error("R3F requires exactly two independent studies.");
  const apiKey = process.env.CODYSSEY_API_KEY; if (!apiKey) throw new Error("CODYSSEY_API_KEY is not set; no requests were sent.");
  await mkdir(OUTPUT, { recursive: true }); if (await exists(resolve(OUTPUT, "run.json"))) throw new Error("R3F output exists; refusing duplicate study requests.");
  const baseUrl = cleanBaseUrl(process.env.CODYSSEY_API_BASE_URL);
  await saveJson("run.json", { round: "R3F Environment Art Batch D", model: MODEL, endpoint: "/api/v1/images", baseUrl, requestCount: 2, policy: "two density strategies; isolated prop studies only; originals preserved", startedAt: new Date().toISOString(), studies: STUDIES });
  await writeFile(resolve(OUTPUT, "prompts.md"), `# R3F Batch D prop studies\n\n${CORE}\n\n${STUDIES.map((study) => `## ${study.code}. ${study.title}\n\n${study.detail}`).join("\n\n")}`, "utf8");
  const results = []; for (const study of STUDIES) results.push(await generate(study, apiKey, baseUrl));
  await saveJson("result.json", { results }); console.log(JSON.stringify({ output: OUTPUT, results }, null, 2));
  if (results.some((result) => result.status !== "success")) process.exitCode = 1;
}
main().catch((error) => { console.error(error.stack || error); process.exitCode = 1; });
