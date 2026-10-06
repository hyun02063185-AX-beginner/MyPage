import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const r1 = readFileSync(new URL("../src/scenes/CanonicalRuntimeR1Scene.ts", import.meta.url), "utf8");
const r2 = readFileSync(new URL("../src/scenes/CanonicalRuntimeR2Scene.ts", import.meta.url), "utf8");
const assetRoot = new URL("../public/assets/canonical-r2/", import.meta.url);
const readCoverage = (file) => JSON.parse(readFileSync(new URL(file, assetRoot), "utf8"));
const literal = (source, name) => {
  const declaration = source.slice(source.indexOf(`const ${name}`));
  const start = declaration.indexOf("[", declaration.indexOf("="));
  const end = declaration.indexOf("\n];") + 2;
  return declaration.slice(start, end);
};

test("R2.2 coverage assets exist, name all required continuity zones, and declare no collision", () => {
  for (const file of ["visual-land-coverage.json", "visual-water-coverage.json"]) assert.ok(existsSync(new URL(file, assetRoot)), `${file} is required`);
  const land = readCoverage("visual-land-coverage.json");
  const water = readCoverage("visual-water-coverage.json");
  assert.equal(land.collision, "none");
  assert.equal(water.collision, "none");
  for (const id of [
    "hall-upper-terrace", "hall-to-retaining-transition", "workshop-lower-ground", "central-harbor-ground",
    "harbor-office-ground", "central-quay-structure", "hero-quay-structure", "connecting-stone-fill-regions",
  ]) assert.ok(land.zones.some((zone) => zone.id === id), `${id} is required`);
  assert.ok(water.zones.some(({ id }) => id === "sheltered-harbor-surface"));
  assert.ok(water.zones.some(({ id }) => id === "outer-sea-continuity"));
});

test("R2.2 preserves canonical collision literals and uses coverage only from drawFoundation", () => {
  // R1/R2 use different line wrapping in one historic literal; parsed vector data must stay identical.
  for (const name of ["WALKABLE", "WATER", "OBSTACLES"]) {
    assert.deepEqual(JSON.parse(literal(r2, name).replace(/,\s*\]$/, "]")), JSON.parse(literal(r1, name).replace(/,\s*\]$/, "]")), `${name} must remain semantically equivalent to R1`);
  }
  const enforcement = r2.slice(r2.indexOf("private enforceGeometry"), r2.indexOf("private updateInteraction"));
  assert.doesNotMatch(enforcement, /coverage|r22-visual|VisualCoverage/);
  assert.match(r2, /if \(this\.r22Coverage\) \{ this\.drawVisualLandCoverage\(\); this\.drawVisualWaterCoverage\(\); \}/);
  assert.match(r2, /Coverage assets are a render-only input/);
});
