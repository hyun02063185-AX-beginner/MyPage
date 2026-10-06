import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r3-scenic-props-candidates.json", import.meta.url), "utf8"));
const r24Manifest = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r24-foundation-master-candidates.json", import.meta.url), "utf8"));
const runtime = readFileSync(new URL("../src/scenes/CanonicalRuntimeR2Scene.ts", import.meta.url), "utf8");
const boot = readFileSync(new URL("../src/scenes/BootScene.ts", import.meta.url), "utf8");
const evidence = new URL("reports/portfolio-world-rebuild/evidence/runtime-r3-scenic-props-candidates/", root);
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

test("R3 Phase A candidates are static-only and preserve the selected R2.4 foundation", () => {
  assert.equal(manifest.runtimeImported, false);
  assert.equal(manifest.humanSelection, "PENDING");
  assert.equal(manifest.selectionStatus, "PENDING");
  assert.equal(manifest.recommendedComposition, "composition-c");
  assert.equal(manifest.recommendedFountain, "fountain-b");
  assert.ok(manifest.scenicCandidates.length >= 2);
  assert.equal(manifest.compositionCandidates.length, 3);
  assert.doesNotMatch(runtime, /canonical-r3|scenic-a|scenic-b|fountain-[ab]/);
  assert.doesNotMatch(boot, /canonical-r3|scenic-a|scenic-b|fountain-[ab]/);
  const base = r24Manifest.candidates.find(({ id }) => id === "foundation-master-b");
  const source = new URL(`../../${base.files.base}`, import.meta.url);
  assert.equal(hash(source), base.hashes.baseSha256, "Foundation Master B must be unchanged");
});

test("R3 Phase A candidate assets and evidence are complete", () => {
  for (const scenic of manifest.scenicCandidates) assert.ok(existsSync(new URL(`../../${scenic.file}`, import.meta.url)), scenic.id);
  for (const prop of [...manifest.propFamilies, ...manifest.fountainCandidates]) assert.ok(existsSync(new URL(`../../${prop.file}`, import.meta.url)), prop.id);
  for (const name of [
    "01-scenic-a.png", "02-scenic-b.png", "03-prop-family-sheet.png", "04-fountain-candidates.png",
    "05-composition-a.png", "06-composition-b.png", "07-composition-c-recommended.png",
    "08-canonical-vs-r3-candidates.png", "09-player-route-legibility.png", "10-prop-scale-review.png",
  ]) assert.ok(existsSync(new URL(name, evidence)), `${name} is required`);
});
