#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const MODELS = ["gpt-image-2", "imagen-4", "gemini-2.5-flash-image"];
const RECOVERY_MODELS = ["gpt-image-2", "gemini-2.5-flash-image"];
const DEFAULT_BASE_URL = "https://copa.codyssey.kr";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(SCRIPT_DIR, "..", "..");
const OUTPUT_DIR = resolve(REPOSITORY_ROOT, "output/codyssey-image-benchmark/round-01");

// Keep this prompt shared across models so the round measures provider/model
// differences rather than prompt variants.
const PROMPT = `Create a whole-scene concept image for "Portfolio World", a refined retro-harbor 2D portfolio world intended as a playable Phaser exploration scene. Harbor must be the immediate first-read, while Portfolio is the product priority and exploration/interaction is the game layer. Use a three-quarter elevated game-world view, not a poster composition.

Show one cohesive, asymmetrical sheltered harbor with calm water, readable walkable routes, plazas, waterfronts, docks, buildings, and ships. Make the Hero Ship the dominant landmark at Hero Quay. Clearly communicate the spatial relationship and walkable route from Harbor Square to Exhibition Hall to Hero Quay, with the Hero Ship beyond or alongside the quay. Include human/player-scale cues such as a small player character, doors, steps, benches, lamps, railings, and dock posts. Buildings, ship, square, quay, and waterfront must feel like one navigable world, with believable circulation and open paths a character could walk.

Visual language: refined retro game art, stylized 2D, rich but controlled environmental detail, clear silhouettes, warm weathered architecture, muted harbor blues and seafoam water, subtle pixel-inspired shapes without requiring strict pixel-art resolution. Prioritize spatial readability, landmark hierarchy, and a world-target feel suitable for conversion into a Phaser scene. Avoid typography, UI overlays, labels, maps, collage panels, isolated character portraits, dramatic open-ocean waves, perfectly symmetrical layout, and flat poster-like illustration.`;

function usageError(message) {
  console.error(`Benchmark not started: ${message}`);
  process.exitCode = 1;
}

function cleanBaseUrl(value) {
  return (value || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function redactImagePayload(value) {
  if (Array.isArray(value)) return value.map(redactImagePayload);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      key === "b64_json" ? "[omitted; saved as image file]" : redactImagePayload(child),
    ]),
  );
}

export function findImagePayload(body) {
  const canonicalImage = body?.result?.images?.find((item) => typeof item?.b64_json === "string")
    ?? body?.result?.images?.find((item) => typeof item?.url === "string");
  if (canonicalImage) {
    return {
      b64Json: canonicalImage.b64_json,
      url: canonicalImage.url,
      source: "result.images[]",
    };
  }

  const dataImage = body?.data?.find((item) => typeof item?.b64_json === "string")
    ?? body?.data?.find((item) => typeof item?.url === "string");
  if (dataImage) {
    return { b64Json: dataImage.b64_json, url: dataImage.url, source: "data[]" };
  }

  if (typeof body?.b64_json === "string" || typeof body?.url === "string") {
    return { b64Json: body.b64_json, url: body.url, source: "top-level" };
  }

  return undefined;
}

function fileExtension(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return "jpg";
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  return "bin";
}

function safeModelName(model) {
  return model.replace(/[^a-z0-9.-]/gi, "-");
}

function selectedHeaders(headers) {
  const names = ["content-type", "x-request-id", "request-id"];
  return Object.fromEntries(names.flatMap((name) => (headers.get(name) ? [[name, headers.get(name)]] : [])));
}

function recoveryDirectoryFromArgs() {
  const optionIndex = process.argv.indexOf("--round-dir");
  if (optionIndex === -1) return OUTPUT_DIR;
  const suppliedPath = process.argv[optionIndex + 1];
  if (!suppliedPath || suppliedPath.startsWith("--")) {
    throw new Error("--round-dir requires an existing Round 01 directory path.");
  }
  return resolve(REPOSITORY_ROOT, suppliedPath);
}

function findCanonicalRecoveryUrl(metadata) {
  return metadata?.response?.body?.result?.images?.find((image) => typeof image?.url === "string")?.url;
}

async function fetchStoredImage(imageUrl, apiOrigin, apiKey, redirects = 0) {
  if (redirects > 3) throw new Error("Image download exceeded the redirect limit.");

  const response = await fetch(imageUrl, {
    method: "GET",
    // Never forward the API key to a different image/CDN origin.
    headers: imageUrl.origin === apiOrigin ? { Authorization: `Bearer ${apiKey}` } : {},
    redirect: "manual",
  });

  if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
    return fetchStoredImage(new URL(response.headers.get("location"), imageUrl), apiOrigin, apiKey, redirects + 1);
  }
  return response;
}

async function recoverRoundOne() {
  const apiKey = process.env.CODYSSEY_API_KEY;
  // Check before reading metadata or contacting a URL: recovery must be inert
  // when credentials are unavailable.
  if (!apiKey) return usageError("CODYSSEY_API_KEY is required for recovery; no requests were sent.");

  const baseUrl = cleanBaseUrl(process.env.CODYSSEY_API_BASE_URL);
  const apiOrigin = new URL(baseUrl).origin;
  const roundDirectory = recoveryDirectoryFromArgs();
  const results = [];

  for (const model of RECOVERY_MODELS) {
    try {
      const metadata = JSON.parse(await readFile(resolve(roundDirectory, `${model}.metadata.json`), "utf8"));
      const storedUrl = findCanonicalRecoveryUrl(metadata);
      if (!storedUrl) throw new Error("Preserved metadata has no result.images[].url.");

      const imageUrl = new URL(storedUrl, baseUrl);
      if (!['http:', 'https:'].includes(imageUrl.protocol)) throw new Error("Preserved image URL has an unsupported protocol.");
      const response = await fetchStoredImage(imageUrl, apiOrigin, apiKey);
      if (!response.ok) throw new Error(`Image download returned HTTP ${response.status}.`);

      const buffer = Buffer.from(await response.arrayBuffer());
      if (fileExtension(buffer) !== "png") throw new Error("Recovered response is not PNG data.");
      const imageFile = `${safeModelName(model)}.png`;
      await writeFile(resolve(roundDirectory, imageFile), buffer);
      results.push({ model, status: "recovered", imageFile });
      console.log(`${model}: recovered ${imageFile}.`);
    } catch (error) {
      results.push({ model, status: "unavailable" });
      console.error(`${model}: recovery unavailable (${error instanceof Error ? error.message : String(error)}).`);
    }
  }

  const recovered = results.filter((result) => result.status === "recovered").length;
  console.log(`Round 01 recovery complete: ${recovered}/${RECOVERY_MODELS.length} images recovered.`);
  if (recovered !== RECOVERY_MODELS.length) process.exitCode = 1;
}

async function writeJson(name, value) {
  await writeFile(resolve(OUTPUT_DIR, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function comparisonMarkdown(results, models) {
  const rows = results.map((result) => {
    const image = result.imageFile ? `[${result.imageFile}](./${result.imageFile})` : "—";
    return `| ${result.model} | ${result.status} | ${result.durationMs ?? "—"} | ${image} | [metadata](./${result.metadataFile}) |`;
  });

  return `# Codyssey Image Benchmark — Round 01 Comparison\n\n` +
    `This is a provider/model benchmark only. It does not change Portfolio World runtime code. All three models received the identical prompt in [prompt.md](./prompt.md).\n\n` +
    `| Model | Result | Duration (ms) | Image | Request / response metadata |\n` +
    `| --- | --- | ---: | --- | --- |\n${rows.join("\n")}\n\n` +
    `## Manual review rubric\n\n` +
    `Score each generated image from 1–5 against the candidate Golden Master criteria. Record a short reason, especially any reason a scene would be difficult to translate into Phaser.\n\n` +
    `| Criterion | ${models.join(" | ")} |\n` +
    `| --- | ${models.map(() => "---").join(" | ")} |\n` +
    `| Harbor first-read |  |  |  |\n` +
    `| Walkable structure readability |  |  |  |\n` +
    `| Hero Ship hierarchy |  |  |  |\n` +
    `| Human-scale cues |  |  |  |\n` +
    `| Harbor Square → Exhibition Hall → Hero Quay route |  |  |  |\n` +
    `| Whole-scene cohesion |  |  |  |\n` +
    `| Phaser world-target structure |  |  |  |\n\n` +
    `## Notes\n\n` +
    `- Keep the best candidate as a visual reference, not as a production asset or implementation specification.\n` +
    `- Check that the composition is a navigable scene rather than a poster, and that the Hero Ship remains the primary landmark.\n`;
}

async function runModel({ baseUrl, apiKey, model, metadataPrefix = "" }) {
  const startedAt = new Date().toISOString();
  const start = performance.now();
  const requestBody = { model, prompt: PROMPT, response_format: "b64_json" };
  const metadataFile = `${metadataPrefix ? `${metadataPrefix}.` : ""}${safeModelName(model)}.metadata.json`;
  let metadata;

  try {
    const response = await fetch(`${baseUrl}/api/v1/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const rawText = await response.text();
    let responseBody;
    try {
      responseBody = rawText ? JSON.parse(rawText) : null;
    } catch {
      responseBody = { nonJsonBody: rawText.slice(0, 1000) };
    }

    metadata = {
      model,
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: Math.round(performance.now() - start),
      request: { endpoint: "/api/v1/images", body: requestBody },
      response: {
        status: response.status,
        ok: response.ok,
        headers: selectedHeaders(response.headers),
        body: redactImagePayload(responseBody),
      },
    };

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const imagePayload = findImagePayload(responseBody);
    const b64 = imagePayload?.b64Json;
    if (!b64) throw new Error("Successful response did not contain result.images[].b64_json, data[].b64_json, or b64_json.");

    const buffer = Buffer.from(b64, "base64");
    if (!buffer.length) throw new Error("Image response contained an empty base64 payload.");
    const imageFile = `${safeModelName(model)}.${fileExtension(buffer)}`;
    await writeFile(resolve(OUTPUT_DIR, imageFile), buffer);
    metadata.image = {
      file: imageFile,
      bytes: buffer.length,
      source: imagePayload.source,
      ...(imagePayload.url ? { url: imagePayload.url } : {}),
    };
    await writeJson(metadataFile, metadata);
    return { model, status: "success", durationMs: metadata.durationMs, imageFile, metadataFile };
  } catch (error) {
    metadata ??= {
      model,
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: Math.round(performance.now() - start),
      request: { endpoint: "/api/v1/images", body: requestBody },
    };
    metadata.error = error instanceof Error ? error.message : String(error);
    await writeJson(metadataFile, metadata);
    return { model, status: "failed", durationMs: metadata.durationMs, metadataFile };
  }
}

async function main() {
  if (process.argv.includes("--recover-round-01")) return recoverRoundOne();

  const apiKey = process.env.CODYSSEY_API_KEY;
  if (!apiKey) return usageError("CODYSSEY_API_KEY is not set.");

  const isSuccessfulModelRerun = process.argv.includes("--rerun-successful-round-01");
  const selectedModels = isSuccessfulModelRerun ? RECOVERY_MODELS : MODELS;
  // A targeted recovery rerun must preserve the metadata captured by the
  // original Round 01 attempt, including imagen-4's provider failure.
  const metadataPrefix = isSuccessfulModelRerun ? "recovery-rerun-01" : "";
  const baseUrl = cleanBaseUrl(process.env.CODYSSEY_API_BASE_URL);
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(resolve(OUTPUT_DIR, "prompt.md"), `# Shared prompt\n\n${PROMPT}\n`, "utf8");
  await writeJson(metadataPrefix ? `${metadataPrefix}.run.json` : "run.json", {
    round: "round-01",
    mode: isSuccessfulModelRerun ? "successful-model-rerun" : "full-benchmark",
    endpoint: "/api/v1/images",
    baseUrl,
    responseFormat: "b64_json",
    models: selectedModels,
    startedAt: new Date().toISOString(),
  });

  const results = [];
  for (const model of selectedModels) {
    results.push(await runModel({ baseUrl, apiKey, model, metadataPrefix }));
  }
  await writeFile(
    resolve(OUTPUT_DIR, metadataPrefix ? `${metadataPrefix}.comparison.md` : "comparison.md"),
    comparisonMarkdown(results, selectedModels),
    "utf8",
  );

  const succeeded = results.filter((result) => result.status === "success").length;
  console.log(`Round 01 complete: ${succeeded}/${selectedModels.length} images saved to ${OUTPUT_DIR}`);
  if (succeeded !== selectedModels.length) process.exitCode = 1;
}

const isDirectExecution = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  main().catch((error) => {
    console.error(`Benchmark failed before completion: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
