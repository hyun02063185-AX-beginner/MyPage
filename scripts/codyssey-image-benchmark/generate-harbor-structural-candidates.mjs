#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findImagePayload } from "./run-codyssey-image-benchmark.mjs";

const MODELS = ["gpt-image-2", "gemini-2.5-flash-image"];
const DEFAULT_BASE_URL = "https://copa.codyssey.kr";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(SCRIPT_DIR, "..", "..");
const OUTPUT_DIR = resolve(REPOSITORY_ROOT, "output", "codyssey-image-benchmark", "harbor-structural-candidates");

const SHARED_PROMPT = `Create a single whole-scene concept image for Portfolio World that can become a playable 2D exploration map. This is not a generic pretty harbor illustration and not a poster. Use a readable elevated 3/4 or isometric game-world composition, with a large visible ground plane and deliberate player-scale circulation.

The Mediterranean fantasy harbor should be elegant and refined: pale stone architecture, terracotta roofs, turquoise sheltered water, calm refined atmosphere, rich but controlled environmental detail. The main hall, workshop/market, hero quay, and Hero Ship must be distinct spatial destinations. The Hero Ship is a major landmark at the water edge, but it must not block the principal walking space. Buildings frame the play space instead of filling it. Show broad walkable paving, doors, stairs, railings, lamps, benches, dock posts, and human-scale figures only as spatial cues.

Prioritize structural gameplay clarity over beauty: visibly connect the plaza, main hall, workshop/market, and hero quay with plausible unobstructed ground routes. Avoid typography, labels, UI, maps, diagram arrows, collage panels, cropped close-ups, open ocean, dramatic waves, dense building walls across routes, or any composition that makes a character's path ambiguous.`;

const VARIANTS = [
  {
    id: "central-plaza-hub",
    title: "Central Plaza Hub",
    instruction: `Structure variant: Central Plaza Hub. Make one broad, open central harbor plaza the clear playable hub, with three wide and visibly distinct ground exits: a main hall forecourt, a workshop/market lane, and a descending or gently sloped route to Hero Quay. Keep the hub usable rather than filled with buildings or props. Put the Hero Ship moored beyond the quay as a sightline landmark, outside the walking core.`,
  },
  {
    id: "terrace-steps-harbor",
    title: "Terrace Steps Harbor",
    instruction: `Structure variant: Terrace Steps Harbor. Organize the scene as clearly connected stepped terraces: an upper main hall entry terrace, a generous middle plaza terrace, and a lower waterfront/hero-quay terrace. Show stairs and ramps with wide landings that make the vertical route legible and walkable. Place the workshop/market on a side terrace connected to the middle plaza. Keep the Hero Ship at the lower edge, visually dominant but outside the stairs and promenade circulation.`,
  },
  {
    id: "waterfront-promenade",
    title: "Waterfront Promenade",
    instruction: `Structure variant: Waterfront Promenade. Make a wide continuous waterside promenade the primary exploration spine, with an open plaza widening at one point and short, clear inland branches to the main hall and workshop/market. The Hero Quay should extend naturally from the promenade, with the Hero Ship moored alongside or beyond it without severing the path. Preserve a large readable waterfront ground plane and make every destination visibly reachable on foot.`,
  },
];

function cleanBaseUrl(value) {
  return (value || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function safeName(value) {
  return value.replace(/[^a-z0-9.-]/gi, "-");
}

function imageExtension(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return "jpg";
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  return "bin";
}

function redactPayload(value) {
  if (Array.isArray(value)) return value.map(redactPayload);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [
    key,
    key === "b64_json" ? "[omitted; saved as image file]" : redactPayload(child),
  ]));
}

async function writeJson(name, value) {
  await writeFile(resolve(OUTPUT_DIR, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function comparisonMarkdown(results) {
  const rows = results.map((result) => {
    const image = result.imageFile ? `[${result.imageFile}](./${result.imageFile})` : "—";
    return `| ${result.variantTitle} | ${result.model} | ${result.status} | ${image} | [metadata](./${result.metadataFile}) |`;
  }).join("\n");

  const candidates = results.map((result) => `${result.variantTitle} / ${result.model}`).join(" | ");
  const blankCells = results.map(() => "").join(" | ");
  return `# Portfolio World — Harbor Structural Candidates\n\n` +
    `Exactly six candidates were requested: three structural variants, each generated once with each listed model. This is candidate ideation only; it does not modify Portfolio World runtime code.\n\n` +
    `| Structural variant | Model | Result | Image | Metadata |\n| --- | --- | --- | --- | --- |\n${rows}\n\n` +
    `## Structural comparison worksheet\n\n` +
    `Score 1–5 and add short evidence-based notes. Favor gameplay structure before visual beauty.\n\n` +
    `| Criterion | ${candidates} |\n| --- | ${results.map(() => "---").join(" | ")} |\n` +
    `| Path readability | ${blankCells} |\n` +
    `| Plaza usability | ${blankCells} |\n` +
    `| Hero Ship placement | ${blankCells} |\n` +
    `| Future gameplay suitability | ${blankCells} |\n` +
    `| Visual appeal | ${blankCells} |\n\n` +
    `## Review rule\n\n` +
    `Reject a visually attractive candidate if plaza-to-hall-to-workshop-to-quay circulation is not legible from the image.\n`;
}

async function generateCandidate(baseUrl, apiKey, model, variant) {
  const prompt = `${SHARED_PROMPT}\n\n${variant.instruction}`;
  const requestBody = { model, prompt, response_format: "b64_json" };
  const prefix = `${safeName(variant.id)}.${safeName(model)}`;
  const metadataFile = `${prefix}.metadata.json`;
  const startedAt = new Date().toISOString();
  const started = performance.now();
  let metadata;

  try {
    const response = await fetch(`${baseUrl}/api/v1/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const raw = await response.text();
    let body;
    try {
      body = raw ? JSON.parse(raw) : null;
    } catch {
      body = { nonJsonBody: raw.slice(0, 1000) };
    }
    metadata = {
      model,
      variant: { id: variant.id, title: variant.title },
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: Math.round(performance.now() - started),
      request: { endpoint: "/api/v1/images", body: requestBody },
      response: { status: response.status, ok: response.ok, body: redactPayload(body) },
    };
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const imagePayload = findImagePayload(body);
    if (!imagePayload?.b64Json) throw new Error("Successful response did not contain an image base64 payload.");
    const buffer = Buffer.from(imagePayload.b64Json, "base64");
    if (!buffer.length) throw new Error("Image response contained an empty base64 payload.");
    const imageFile = `${prefix}.${imageExtension(buffer)}`;
    await writeFile(resolve(OUTPUT_DIR, imageFile), buffer);
    metadata.image = { file: imageFile, bytes: buffer.length, source: imagePayload.source };
    await writeJson(metadataFile, metadata);
    return { model, variantTitle: variant.title, status: "success", imageFile, metadataFile };
  } catch (error) {
    metadata ??= {
      model,
      variant: { id: variant.id, title: variant.title },
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: Math.round(performance.now() - started),
      request: { endpoint: "/api/v1/images", body: requestBody },
    };
    metadata.error = error instanceof Error ? error.message : String(error);
    await writeJson(metadataFile, metadata);
    return { model, variantTitle: variant.title, status: "failed", metadataFile };
  }
}

async function main() {
  const apiKey = process.env.CODYSSEY_API_KEY;
  if (!apiKey) {
    console.error("Harbor candidate generation not started: CODYSSEY_API_KEY is not set. No requests were sent.");
    process.exitCode = 1;
    return;
  }
  const baseUrl = cleanBaseUrl(process.env.CODYSSEY_API_BASE_URL);
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(resolve(OUTPUT_DIR, "prompts.md"), `# Harbor structural candidate prompts\n\n${SHARED_PROMPT}\n\n${VARIANTS.map((variant) => `## ${variant.title}\n\n${variant.instruction}`).join("\n\n")}\n`, "utf8");
  await writeJson("run.json", {
    endpoint: "/api/v1/images",
    baseUrl,
    responseFormat: "b64_json",
    models: MODELS,
    variants: VARIANTS.map(({ id, title }) => ({ id, title })),
    plannedPostCalls: MODELS.length * VARIANTS.length,
    startedAt: new Date().toISOString(),
  });

  const results = [];
  for (const variant of VARIANTS) {
    for (const model of MODELS) results.push(await generateCandidate(baseUrl, apiKey, model, variant));
  }
  await writeFile(resolve(OUTPUT_DIR, "comparison.md"), comparisonMarkdown(results), "utf8");
  const succeeded = results.filter((result) => result.status === "success").length;
  console.log(`Harbor structural candidates complete: ${succeeded}/${MODELS.length * VARIANTS.length} images saved to ${OUTPUT_DIR}`);
  if (succeeded !== MODELS.length * VARIANTS.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Harbor candidate generation failed before completion: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
