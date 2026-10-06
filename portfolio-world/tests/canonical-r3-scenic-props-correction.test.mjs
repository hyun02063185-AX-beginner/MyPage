import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r3-scenic-props-candidates.json", import.meta.url), "utf8"));
const r24Manifest = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r24-foundation-master-candidates.json", import.meta.url), "utf8"));
const runtime = new URL("../src/scenes/CanonicalRuntimeR2Scene.ts", import.meta.url);
const boot = new URL("../src/scenes/BootScene.ts", import.meta.url);
const evidence = new URL("reports/portfolio-world-rebuild/evidence/runtime-r3-scenic-props-correction/", root);
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

test("R3 Phase A.1 remains a selected static preview and leaves the R2.4 runtime intact", () => {
  assert.equal(manifest.runtimeImported, false);
  assert.equal(manifest.selectedScenic, "scenic-a-corrected");
  assert.equal(manifest.selectedPropComposition, "composition-c-selective-mix");
  assert.equal(manifest.selectedFountain, "fountain-b");
  assert.equal(manifest.correctedComposition, "composition-c1");
  assert.equal(manifest.humanDirectionApproval, true);
  assert.equal(manifest.finalHumanSelection, "PENDING");
  assert.equal(hash(runtime), "209cfcbf355d96617fb6aaabb28c7a9fd6dec098c5777aa7a8cd27c181130dec");
  assert.equal(hash(boot), "6b968448dcb5aa005de046fb18bc15741b1989f40f5e517b4a0ce8c218535bab");
  assert.doesNotMatch(readFileSync(runtime, "utf8"), /canonical-r3|scenic-a-corrected|fountain-b/);
  assert.doesNotMatch(readFileSync(boot, "utf8"), /canonical-r3|scenic-a-corrected|fountain-b/);
  const base = r24Manifest.candidates.find(({ id }) => id === "foundation-master-b");
  assert.equal(hash(new URL(`../../${base.files.base}`, import.meta.url)), base.hashes.baseSha256);
});

test("R3 Phase A.1 corrected scenic source and human-gate evidence are complete", () => {
  const scenic = manifest.scenicCandidates.find(({ id }) => id === "scenic-a-corrected");
  assert.ok(scenic);
  assert.equal(scenic.collisionIntent, "none");
  assert.ok(existsSync(new URL(`../../${scenic.file}`, import.meta.url)));
  for (const name of [
    "01-scenic-a-original.png", "02-scenic-a-corrected.png", "03-scenic-before-after.png",
    "04-fountain-placement-review.png", "05-composition-c1-corrected.png", "06-canonical-vs-c1.png",
    "07-c1-route-legibility.png",
  ]) assert.ok(existsSync(new URL(name, evidence)), `${name} is required`);
});
