import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (name) => readFileSync(new URL(`../src/scenes/${name}`, import.meta.url), "utf8").replaceAll("\r\n", "\n");
const r2 = read("CanonicalRuntimeR2Scene.ts");
const r3 = read("CanonicalRuntimeR3Scene.ts");
const boot = readFileSync(new URL("../src/scenes/BootScene.ts", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r3-scenic-props-candidates.json", import.meta.url)));
const contract = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r3-contract.json", import.meta.url)));
const geometry = (source, name) => source.match(new RegExp(`const ${name}:[\\s\\S]*?\\n];`, "m"))?.[0].replaceAll(/\s+/g, "");

test("canonical=3 registers the selected R3 scene and loads only promoted approved assets", () => {
  assert.match(boot, /canonical === "3"/);
  assert.match(boot, /CanonicalRuntimeR3Scene/);
  assert.match(boot, /assets\/canonical-r3\/runtime\/\$\{file\}/);
  assert.match(boot, /"r3-scenic-a-final": "scenic\/scenic-a-final\.png"/);
  assert.match(boot, /"r3-fountain-b": "props\/fountain-b\.png"/);
  assert.doesNotMatch(boot, /canonical-r3\/candidates/);
  assert.doesNotMatch(boot, /scenic-b\.png|fountain-a\.png/);
  assert.equal(manifest.selectionStatus, "APPROVED");
  assert.equal(manifest.runtimeIntegration, "COMPLETE_PENDING_HUMAN_GATE");
});

test("R3 preserves locked R2 geometry and adds Fountain B as explicit vector-only collision", () => {
  for (const name of ["WALKABLE", "WATER", "OBSTACLES"]) assert.equal(geometry(r3, name), geometry(r2, name), `${name} changed`);
  assert.match(r3, /const FOUNTAIN_FOOTPRINT: Polygon/);
  assert.match(r3, /fountain=inside\(x,y,FOUNTAIN_FOOTPRINT\)/);
  assert.doesNotMatch(r3.slice(r3.indexOf("private enforceGeometry"), r3.indexOf("private updateInteraction")), /r3-fountain-b|texture|alpha/);
  assert.equal(contract.collisions.source, "explicit-vector-geometry-only");
  assert.equal(contract.fountain.collision.kind, "convex-polygon");
});

test("R3 contract locks the visitable points, routes, Foundation Master B, and promoted evidence", () => {
  assert.equal(contract.foundation.selected, "foundation-master-b");
  assert.equal(contract.foundation.unchanged, true);
  assert.deepEqual(contract.routes, { A: "PASS", B: "PASS", C: "PASS", D: "PASS" });
  assert.deepEqual(contract.interactions.visitablePoints, ["exhibition-hall", "workshop", "hero-ship", "harbor-office"]);
  for (const asset of [...manifest.runtimeAssets.scenic, ...manifest.runtimeAssets.props]) {
    assert.ok(existsSync(new URL(`../public/assets/canonical-r3/runtime/${asset}`, import.meta.url)), asset);
  }
});
