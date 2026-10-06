import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const source = readFileSync(new URL("../src/scenes/CanonicalRuntimeR2Scene.ts", import.meta.url), "utf8");
const generator = readFileSync(new URL("../../scripts/portfolio-world/build-r21-foundation-zone-assets.py", import.meta.url), "utf8");
const contract = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r2-contract.json", import.meta.url), "utf8"));
const evidence = new URL("reports/portfolio-world-rebuild/evidence/runtime-r23-visual-cleanup/", root);

test("R2.3 cleanup remains archived while R2.4 retires its procedural structure", () => {
  assert.doesNotMatch(generator, /ellipse/i);
  assert.doesNotMatch(source, /fillEllipse|\.ellipse\(/);
  assert.match(source, /R2_4_FOUNDATION_MASTER_B/);
  assert.doesNotMatch(source, /drawR23StructuralDepth/);
  assert.match(source, /Coverage assets are a render-only input/);
});

test("R2.3 contract history preserves the unchanged geometry audit beneath R2.4", () => {
  assert.equal(contract.visualRevision, "R2_4_FOUNDATION_MASTER_B");
  assert.equal(contract.r23.geometryRevision, "UNCHANGED");
  assert.equal(contract.r23.routes, "UNCHANGED_PASS");
  assert.equal(contract.r23.runtimeR3, "BLOCKED");
  assert.equal(contract.gate, "READY_FOR_R2_4_RUNTIME_HUMAN_VISUAL_GATE");
});

test("R2.3 browser evidence set is complete", () => {
  for (const name of [
    "01-r23-overview.png", "02-r23-hall-plaza.png", "03-r23-retaining-stairs.png", "04-r23-workshop-office.png",
    "05-r23-central-quay.png", "06-r23-hero-quay.png", "07-canonical-vs-r23.png", "08-r22-vs-r23.png",
  ]) assert.ok(existsSync(new URL(name, evidence)), `${name} is required`);
});
