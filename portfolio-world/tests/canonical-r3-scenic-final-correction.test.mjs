import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r3-scenic-props-candidates.json", import.meta.url), "utf8"));
const r24Manifest = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r24-foundation-master-candidates.json", import.meta.url), "utf8"));
const runtime = new URL("../src/scenes/CanonicalRuntimeR2Scene.ts", import.meta.url);
const boot = new URL("../src/scenes/BootScene.ts", import.meta.url);
const evidence = new URL("reports/portfolio-world-rebuild/evidence/runtime-r3-scenic-final-correction/", root);
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

test("R3 Phase B retains the final scenic provenance and preserves locked R2 assets", () => {
  assert.equal(manifest.runtimeImported, true);
  assert.equal(manifest.selectedScenic, "scenic-a-final");
  assert.equal(manifest.selectedPropComposition, "composition-c-selective-mix");
  assert.equal(manifest.selectedFountain, "fountain-b");
  assert.ok(["composition-c2", "composition-c3"].includes(manifest.correctedComposition));
  assert.equal(manifest.scenicTownStatus, "COMPLETE");
  assert.ok(["COMPLETE", "PASS"].includes(manifest.waterTransitionStatus));
  assert.equal(manifest.finalHumanSelection, "composition-c3");
  assert.equal(hash(runtime), "209cfcbf355d96617fb6aaabb28c7a9fd6dec098c5777aa7a8cd27c181130dec");
  assert.match(readFileSync(boot, "utf8"), /CanonicalRuntimeR3Scene/);
  const base = r24Manifest.candidates.find(({ id }) => id === "foundation-master-b");
  assert.equal(hash(new URL(`../../${base.files.base}`, import.meta.url)), base.hashes.baseSha256);
  const fountain = manifest.fountainCandidates.find(({ id }) => id === "fountain-b");
  assert.equal(fountain.hash, "4a6ac18d41abf518f94ee9b9ed62ee3cf095623272d23dd2fbe8f8f04f75b4b1");
});

test("R3 Phase A.2 final scenic and complete Human Gate evidence exist", () => {
  const scenic = manifest.scenicCandidates.find(({ id }) => id === "scenic-a-final");
  assert.ok(scenic);
  assert.equal(scenic.collisionIntent, "none");
  assert.ok(existsSync(new URL(`../../${scenic.file}`, import.meta.url)));
  for (const name of [
    "01-town-before.png", "02-town-after.png", "03-water-transition-before.png", "04-water-transition-after.png",
    "05-composition-c2-final.png", "06-canonical-vs-c2.png", "07-c1-vs-c2.png", "08-c2-route-legibility.png",
  ]) assert.ok(existsSync(new URL(name, evidence)), `${name} is required`);
});
