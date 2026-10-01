#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { findImagePayload } from "./run-codyssey-image-benchmark.mjs";

const MODELS = ["gpt-image-2", "gemini-2.5-flash-image"];
const DEFAULT_BASE_URL = "https://copa.codyssey.kr";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(SCRIPT_DIR, "..", "..");
const OUTPUT_DIR = resolve(REPOSITORY_ROOT, "output", "codyssey-image-benchmark", "harbor-playable-round-02");
const CONTACT_SHEET_SCRIPT = resolve(SCRIPT_DIR, "create-harbor-contact-sheet.ps1");

const CORE_PROMPT = `Design this as an actual playable 2D exploration game environment, not as a scenic harbor illustration. The primary controllable player character must be clearly readable at gameplay scale, approximately 7–10 percent of the image height. Use a closer elevated three-quarter gameplay camera rather than a distant panoramic overview. Make all walkable ground immediately understandable through broad stone paving, clear paths, stairs, doors, quay edges and architectural boundaries. Slightly exaggerate or compress architectural scale where necessary for game readability. Buildings should frame the playable space rather than consume it. The scene must remain visually premium and attractive, with crisp, production-quality rendering and clean readable environmental forms. Do not create a tiny-player scenic panorama.

Create a refined Mediterranean fantasy harbor with warm pale-stone architecture, terracotta roofs, teal/turquoise sheltered water, elegant greenery, warm daylight, and a three-mast Age-of-Sail Hero Ship with controlled furled or stowed sails. Use a large central playable stone ground area, clear collision boundaries at water, walls, building footprints, railings, and elevation edges. The main hall, workshop/market, Hero Quay, and Hero Ship must be visibly distinct and connected by broad plausible walking routes. The Hero Ship is a landmark destination at the water edge, not an obstruction to the central movement space.

Production-quality game environment concept art; crisp architectural edges; clean high-detail rendering; sharp readable paving; clearly defined stairs, doors, quay edges, and player silhouette; controlled high-frequency detail; strong local clarity; clean forms; refined materials. Clarity is more important than micro-detail. Avoid blurry rendering, soft focus, haze, muddy textures, painterly smearing, oversharpening artifacts, noisy micro-detail, malformed stairs/railings, distorted architecture, mushy paving, labels, typography, UI, maps, arrows, collage panels, huge foreground buildings, open ocean, and panoramic postcard framing.`;

const VARIANTS = [
  {
    code: "A",
    id: "central-plaza",
    title: "Central Plaza — Gameplay Close",
    prompt: `Create a broad, asymmetrical Harbor Square as the dominant playable hub. The Exhibition Hall is above or beside the square with a single broad stair or clear paved connection. Put the Workshop/market on one plaza edge, clearly separate from the main hall. A generous promenade exits naturally toward Hero Quay and the moored Hero Ship. Keep the player clearly visible in the open plaza at gameplay scale.`,
  },
  {
    code: "B",
    id: "promenade",
    title: "Plaza + Waterfront Promenade",
    prompt: `Create an open central plaza as the primary hub with a broad, continuous seaside promenade as the main exploration spine. The Exhibition Hall and Workshop/market connect naturally from the plaza with wide short routes, never a narrow corridor. Hero Quay is at the end or side of the promenade, and the Hero Ship is visible as the destination without cutting the route.`,
  },
  {
    code: "C",
    id: "two-level",
    title: "Simple Two-Level Harbor",
    prompt: `Create only two meaningful gameplay elevations: an upper civic plaza containing the Exhibition Hall, and a lower waterfront/quay level. Connect them with one or two broad, simple stair flights and obvious landing space. Put the Workshop near the transition. The lower level leads cleanly to Hero Quay and the Hero Ship. Do not create a terrace maze.`,
  },
];

function cleanBaseUrl(value) {
  return (value || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function safeName(value) {
  return value.replace(/[^a-z0-9.-]/gi, "-");
}

function fileInfo(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { format: "png", width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    let index = 2;
    while (index < buffer.length - 9) {
      if (buffer[index] !== 0xff) { index += 1; continue; }
      const marker = buffer[index + 1];
      const length = buffer.readUInt16BE(index + 2);
      if (marker >= 0xc0 && marker <= 0xc3) return { format: "jpg", height: buffer.readUInt16BE(index + 5), width: buffer.readUInt16BE(index + 7) };
      index += 2 + length;
    }
  }
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") {
    const chunk = buffer.subarray(12, 16).toString("ascii");
    if (chunk === "VP8X") return { format: "webp", width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { format: "webp", width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = buffer.readUInt32LE(21);
      return { format: "webp", width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  throw new Error("Decoded image has an unsupported or unreadable format.");
}

function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, key === "b64_json" ? "[omitted; saved as original image file]" : redact(child)]));
}

async function writeJson(name, value) {
  await writeFile(resolve(OUTPUT_DIR, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function requestOnce(baseUrl, apiKey, requestBody) {
  const response = await fetch(`${baseUrl}/api/v1/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  const raw = await response.text();
  let body;
  try { body = raw ? JSON.parse(raw) : null; } catch { body = { nonJsonBody: raw.slice(0, 1000) }; }
  return { response, body };
}

async function generate(baseUrl, apiKey, variant, model, phase) {
  const prompt = `${CORE_PROMPT}\n\nStructural variant: ${variant.title}.\n${variant.prompt}`;
  const requestBody = { model, prompt, response_format: "b64_json" };
  const stem = `${variant.code}-${variant.id}.${safeName(model)}`;
  const metadataFile = `${stem}.metadata.json`;
  const startedAt = new Date().toISOString();
  const started = performance.now();
  const attempts = [];
  let metadata;

  try {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      const { response, body } = await requestOnce(baseUrl, apiKey, requestBody);
      attempts.push({ attempt, status: response.status });
      metadata = {
        model,
        variant: { code: variant.code, id: variant.id, title: variant.title },
        phase,
        startedAt,
        completedAt: new Date().toISOString(),
        durationMs: Math.round(performance.now() - started),
        request: { endpoint: "/api/v1/images", body: requestBody },
        response: { status: response.status, ok: response.ok, body: redact(body) },
        attempts,
      };
      if (response.ok) {
        const payload = findImagePayload(body);
        if (!payload?.b64Json) throw new Error("Successful response did not contain result.images[].b64_json or a supported fallback.");
        const image = Buffer.from(payload.b64Json, "base64");
        const info = fileInfo(image);
        if (!image.length || !info.width || !info.height) throw new Error("Decoded image bytes could not be opened and measured.");
        const imageFile = `${stem}.${info.format}`;
        await writeFile(resolve(OUTPUT_DIR, imageFile), image);
        metadata.image = { file: imageFile, format: info.format, width: info.width, height: info.height, bytes: image.length, source: payload.source };
        await writeJson(metadataFile, metadata);
        return { model, variant, phase, status: "success", imageFile, metadataFile, ...metadata.image };
      }
      if (response.status < 500 || attempt === 2) throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    metadata ??= { model, variant: { code: variant.code, id: variant.id, title: variant.title }, phase, startedAt, completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - started), request: { endpoint: "/api/v1/images", body: requestBody }, attempts };
    metadata.error = error instanceof Error ? error.message : String(error);
    await writeJson(metadataFile, metadata);
    return { model, variant, phase, status: "failed", metadataFile, error: metadata.error, attempts };
  }
  throw new Error("Unreachable generation state.");
}

function comparisonMarkdown(results) {
  const names = results.map((result) => `${result.variant.code}/${result.model}`).join(" | ");
  const cells = results.map(() => "").join(" | ");
  const rows = results.map((result) => `| ${result.variant.title} | ${result.model} | ${result.status} | ${result.imageFile ? `[${result.imageFile}](./${result.imageFile})` : "—"} |`).join("\n");
  return `# Portfolio World — Playable Harbor Design Round 2\n\n` +
    `No overall winner is selected automatically. Each entry must be reviewed by a human against the structure-first matrix below.\n\n` +
    `| Variant | Model | Result | Original image |\n| --- | --- | --- | --- |\n${rows}\n\n` +
    `## Candidate PASS / CAUTION / FAIL matrix\n\n` +
    `Use only PASS, CAUTION, or FAIL with a concise note; do not assign numbers or choose a winner here.\n\n` +
    `| Check | ${names} |\n| --- | ${results.map(() => "---").join(" | ")} |\n` +
    ["Player readability", "Player/environment scale", "Central playable-ground area", "Path readability", "Plaza → Exhibition Hall", "Plaza → Workshop", "Plaza → Hero Quay", "Collision-boundary clarity", "Hero Ship placement", "Camera distance", "Visual appeal", "Image clarity / sharpness", "Static-illustration risk"].map((check) => `| ${check} | ${cells} |`).join("\n") +
    `\n\n## Rejection rules\n\nMark FAIL for a tiny player, ambiguous primary paths, routes crossing roofs/walls, building-blocked movement, a ship overwhelming usable ground, distant panoramic camera, or blurry/malformed paving, stairs, doors, or architecture.\n`;
}

function makeContactSheet() {
  return new Promise((resolve, reject) => {
    const process = spawn("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", CONTACT_SHEET_SCRIPT, "-InputDirectory", OUTPUT_DIR], { stdio: "pipe", windowsHide: true });
    let error = "";
    process.stderr.on("data", (chunk) => { error += chunk.toString(); });
    process.on("error", reject);
    process.on("exit", (code) => code === 0 ? resolve() : reject(new Error(error || `Contact-sheet process exited ${code}.`)));
  });
}

async function main() {
  const apiKey = process.env.CODYSSEY_API_KEY;
  if (!apiKey) {
    console.error("Round 2 not started: CODYSSEY_API_KEY is not set. No requests were sent.");
    process.exitCode = 1;
    return;
  }
  const baseUrl = cleanBaseUrl(process.env.CODYSSEY_API_BASE_URL);
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(resolve(OUTPUT_DIR, "prompts.md"), `# Round 2 prompts\n\n${CORE_PROMPT}\n\n${VARIANTS.map((variant) => `## ${variant.code}. ${variant.title}\n\n${variant.prompt}`).join("\n\n")}\n`, "utf8");
  await writeJson("run.json", { round: "round-02", endpoint: "/api/v1/images", baseUrl, responseFormat: "b64_json", models: MODELS, variants: VARIANTS.map(({ code, id, title }) => ({ code, id, title })), plannedCandidatePostCalls: 6, retryPolicy: "one identical retry only for HTTP 5xx", startedAt: new Date().toISOString() });

  const plan = VARIANTS.flatMap((variant) => MODELS.map((model) => ({ variant, model })));
  const results = [];
  // The first planned candidate doubles as the smoke request, avoiding a duplicate seventh design.
  const smoke = await generate(baseUrl, apiKey, plan[0].variant, plan[0].model, "smoke-and-candidate");
  results.push(smoke);
  if (smoke.status !== "success") {
    await writeFile(resolve(OUTPUT_DIR, "comparison.md"), comparisonMarkdown(results), "utf8");
    console.error("Round 2 smoke request failed; remaining five candidate requests were not sent.");
    process.exitCode = 1;
    return;
  }
  for (const item of plan.slice(1)) results.push(await generate(baseUrl, apiKey, item.variant, item.model, "batch"));
  await writeFile(resolve(OUTPUT_DIR, "comparison.md"), comparisonMarkdown(results), "utf8");
  if (results.every((result) => result.status === "success")) await makeContactSheet();
  const succeeded = results.filter((result) => result.status === "success").length;
  console.log(`Round 2 complete: ${succeeded}/6 original images saved to ${OUTPUT_DIR}`);
  if (succeeded !== 6) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Round 2 failed before completion: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
