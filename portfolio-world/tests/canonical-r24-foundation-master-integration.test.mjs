import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const r1 = readFileSync(new URL("../src/scenes/CanonicalRuntimeR1Scene.ts", import.meta.url), "utf8");
const r2 = readFileSync(new URL("../src/scenes/CanonicalRuntimeR2Scene.ts", import.meta.url), "utf8");
const boot = readFileSync(new URL("../src/scenes/BootScene.ts", import.meta.url), "utf8");
const contract = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r2-contract.json", import.meta.url), "utf8"));
const evidence = new URL("../../reports/portfolio-world-rebuild/evidence/runtime-r24-foundation-master-integration/", import.meta.url);
const literal = (source, name) => {
  const declaration = source.slice(source.indexOf(`const ${name}`));
  const start = declaration.indexOf("[", declaration.indexOf("="));
  const end = declaration.indexOf("\n];") + 2;
  return declaration.slice(start, end);
};

test("R2.4 loads only the selected master B and retires legacy zone visual assembly", () => {
  assert.match(boot, /r24-foundation-master-b/);
  assert.match(boot, /r24-foundation-master-b-vertical/);
  assert.doesNotMatch(boot, /r21-hall-plaza|r21-lower-plaza|r21-main-stairs|r21-central-edge|r2-gangway/);
  assert.match(r2, /R2_4_FOUNDATION_MASTER_B/);
  assert.match(r2, /this\.zone\("r24-foundation-master-b", 0, 0, 20\)/);
  assert.match(r2, /this\.zone\("r24-foundation-master-b-vertical", 0, 0, 25\)/);
  assert.doesNotMatch(r2, /drawR23StructuralDepth|drawVisualLandCoverage|r21-hall-plaza|r21-lower-plaza|r2-gangway/);
  assert.doesNotMatch(r2, /foundation-master-a/);
});

test("R2.4 browser runtime evidence is complete", () => {
  for (const name of [
    "01-r24-runtime-overview.png", "02-r24-hall.png", "03-r24-workshop-office.png", "04-r24-central-quay.png",
    "05-r24-hero-quay.png", "06-r24-debug.png", "07-canonical-vs-r24.png", "08-r23-vs-r24.png",
    "09-b-before-after-minor-refinement.png",
  ]) assert.ok(existsSync(new URL(name, evidence)), `${name} is required`);
});

test("R2.4 master is render-only and geometry, water, routes, and player contract stay unchanged", () => {
  for (const name of ["WALKABLE", "WATER", "OBSTACLES"]) {
    assert.deepEqual(JSON.parse(literal(r2, name).replace(/,\s*\]$/, "]")), JSON.parse(literal(r1, name).replace(/,\s*\]$/, "]")), `${name} must stay unchanged`);
  }
  const enforcement = r2.slice(r2.indexOf("private enforceGeometry"), r2.indexOf("private updateInteraction"));
  assert.doesNotMatch(enforcement, /foundation-master|r24-foundation|coverage/);
  assert.equal(contract.visualRevision, "R2_4_FOUNDATION_MASTER_B");
  assert.deepEqual(contract.foundationMaster, { selected: "foundation-master-b", humanApproved: true, collisionSource: false, runtimeIntegrated: true });
  assert.equal(contract.foundationRendering.legacyFoundationVisual, "DISABLED_RUNTIME");
  assert.equal(contract.geometryRevision, "R1_UNCHANGED");
  assert.deepEqual(contract.routes, { A: "PASS", B: "PASS", C: "PASS", D: "PASS" });
  assert.deepEqual(contract.player.visual, [28, 56]);
});
