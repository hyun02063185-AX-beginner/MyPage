import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r3-scenic-props-candidates.json", import.meta.url), "utf8"));
const r24Manifest = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r24-foundation-master-candidates.json", import.meta.url), "utf8"));
const runtime = new URL("../src/scenes/CanonicalRuntimeR2Scene.ts", import.meta.url);
const boot = new URL("../src/scenes/BootScene.ts", import.meta.url);
const evidence = new URL("reports/portfolio-world-rebuild/evidence/runtime-r3-final-compositing-fix/", root);
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

test("R3 Phase B retains approved C3 provenance while preserving all locked source assets", () => {
  assert.equal(manifest.runtimeImported, true);
  assert.equal(manifest.selectedScenic, "scenic-a-final-composite");
  assert.equal(manifest.selectedPropComposition, "composition-c-selective-mix");
  assert.equal(manifest.selectedFountain, "fountain-b");
  assert.equal(manifest.correctedComposition, "composition-c3");
  assert.equal(manifest.fountainGrounding, "PASS");
  assert.equal(manifest.waterTransitionStatus, "PASS");
  assert.equal(manifest.scenicCoverageStatus, "PASS");
  assert.equal(manifest.finalHumanSelection, "composition-c3");
  assert.equal(hash(runtime), "209cfcbf355d96617fb6aaabb28c7a9fd6dec098c5777aa7a8cd27c181130dec");
  assert.match(readFileSync(boot, "utf8"), /CanonicalRuntimeR3Scene/);
  const base = r24Manifest.candidates.find(({ id }) => id === "foundation-master-b");
  assert.equal(hash(new URL(`../../${base.files.base}`, import.meta.url)), base.hashes.baseSha256);
  const fountain = manifest.fountainCandidates.find(({ id }) => id === "fountain-b");
  assert.equal(fountain.hash, "4a6ac18d41abf518f94ee9b9ed62ee3cf095623272d23dd2fbe8f8f04f75b4b1");
  assert.equal(hash(new URL(`../../${fountain.file}`, import.meta.url)), fountain.hash);
  for (const prop of manifest.propFamilies) assert.equal(hash(new URL(`../../${prop.file}`, import.meta.url)), prop.hash, `${prop.id} must remain unchanged`);
});

test("R3 Phase A.3 compositing asset and human-gate evidence exist without collision intent", () => {
  const asset = manifest.finalCompositingAsset;
  assert.equal(asset.collisionIntent, "none");
  assert.equal(asset.runtimeImported, true, "the scenic-only composite is a runtime background layer, never a full-scene plate");
  assert.equal(hash(new URL(`../../${asset.file}`, import.meta.url)), asset.hash);
  for (const name of [
    "01-fountain-before-after.png", "02-fountain-grounding-closeup.png", "03-water-blend-before-after.png",
    "04-water-blend-squint-test.png", "05-scenic-coverage-before-after.png", "06-composition-c3-final.png",
    "07-canonical-vs-c3.png", "08-c2-vs-c3.png", "09-c3-route-legibility.png",
  ]) assert.ok(existsSync(new URL(name, evidence)), `${name} is required`);
});
