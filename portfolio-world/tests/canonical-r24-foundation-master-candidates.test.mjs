import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const runtime = readFileSync(new URL("../src/scenes/CanonicalRuntimeR2Scene.ts", import.meta.url), "utf8");
const boot = readFileSync(new URL("../src/scenes/BootScene.ts", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r24-foundation-master-candidates.json", import.meta.url), "utf8"));
const evidence = new URL("reports/portfolio-world-rebuild/evidence/runtime-r24-foundation-master/", root);

const digest = (url) => createHash("sha256").update(readFileSync(url)).digest("hex");

test("R2.4 selected candidate assets are transparent, calibrated, and B is the runtime import", () => {
  assert.equal(manifest.phase, "R2.4 Phase B — selected Foundation Master B runtime integration");
  assert.equal(manifest.generation.collisionSource, "never");
  assert.equal(manifest.generation.runtimeImported, true);
  assert.equal(manifest.humanSelection, "foundation-master-b");
  assert.equal(manifest.selectionStatus, "APPROVED");
  assert.equal(manifest.runtimeIntegration, "COMPLETE_PENDING_HUMAN_GATE");
  assert.equal(manifest.recommendedCandidate, "foundation-master-b");
  assert.match(runtime, /r24-foundation-master-b/);
  assert.match(boot, /r24-foundation-master-b/);
  assert.doesNotMatch(runtime, /r24-foundation-master-a/);
  assert.doesNotMatch(boot, /r24-foundation-master-a/);
  assert.equal(manifest.candidates.length, 2);
  for (const candidate of manifest.candidates) {
    assert.deepEqual(candidate.dimensions, { width: 1920, height: 1080 });
    assert.equal(candidate.transparency.mode, "RGBA");
    assert.equal(candidate.transparency.alphaVerified, true);
    assert.match(candidate.calibration.placement, /geometry untouched/);
    const base = new URL(`../../${candidate.files.base}`, import.meta.url);
    const vertical = new URL(`../../${candidate.files.verticalStructure}`, import.meta.url);
    assert.ok(existsSync(base)); assert.ok(existsSync(vertical));
    assert.equal(digest(base), candidate.hashes.baseSha256);
    assert.equal(digest(vertical), candidate.hashes.verticalStructureSha256);
  }
});

test("R2.4 Phase A evidence and scene-plate check are complete", () => {
  for (const name of [
    "01-foundation-master-a.png", "02-foundation-master-b.png", "04-foundation-candidate-comparison.png",
    "05-a-full-composition-preview.png", "06-b-full-composition-preview.png", "08-canonical-vs-foundation-candidates.png",
    "09-foundation-material-review.png", "scene-plate-check.json",
  ]) assert.ok(existsSync(new URL(name, evidence)), `${name} is required`);
  const sceneCheck = JSON.parse(readFileSync(new URL("scene-plate-check.json", evidence), "utf8"));
  assert.equal(sceneCheck.automated.dimensions, "PASS");
  assert.equal(sceneCheck.automated.forbiddenAssetComposite, "PASS (pipeline allowlist contains only source art and review-only locked overlays)");
  assert.equal(sceneCheck.manual.noBuildings, "PASS");
  assert.equal(sceneCheck.manual.noShips, "PASS");
  assert.equal(sceneCheck.manual.noSkyTownMountainsLighthouseUI, "PASS");
});
