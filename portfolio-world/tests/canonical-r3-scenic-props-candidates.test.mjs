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

test("R3 Phase B promotes the approved candidate selection while preserving the selected R2.4 foundation", () => {
  assert.equal(manifest.runtimeImported, true);
  assert.equal(manifest.humanSelection, "composition-c3");
  assert.equal(manifest.selectionStatus, "APPROVED");
  assert.equal(manifest.recommendedComposition, "composition-c");
  assert.equal(manifest.recommendedFountain, "fountain-b");
  assert.ok(manifest.scenicCandidates.length >= 2);
  assert.equal(manifest.compositionCandidates.length, 3);
  assert.match(boot, /assets\/canonical-r3\/runtime\/\$\{file\}/);
  assert.match(boot, /"r3-scenic-a-final-composite": "scenic\/scenic-a-final-composite\.png"/);
  assert.match(boot, /"r3-fountain-b": "props\/fountain-b\.png"/);
  const base = r24Manifest.candidates.find(({ id }) => id === "foundation-master-b");
  const source = new URL(`../../${base.files.base}`, import.meta.url);
  assert.equal(hash(source), base.hashes.baseSha256, "Foundation Master B must be unchanged");
});

test("R3 source candidates and historic selection evidence remain complete", () => {
  for (const scenic of manifest.scenicCandidates) assert.ok(existsSync(new URL(`../../${scenic.file}`, import.meta.url)), scenic.id);
  for (const prop of [...manifest.propFamilies, ...manifest.fountainCandidates]) assert.ok(existsSync(new URL(`../../${prop.file}`, import.meta.url)), prop.id);
  for (const name of [
    "01-scenic-a.png", "02-scenic-b.png", "03-prop-family-sheet.png", "04-fountain-candidates.png",
    "05-composition-a.png", "06-composition-b.png", "07-composition-c-recommended.png",
    "08-canonical-vs-r3-candidates.png", "09-player-route-legibility.png", "10-prop-scale-review.png",
  ]) assert.ok(existsSync(new URL(name, evidence)), `${name} is required`);
});
