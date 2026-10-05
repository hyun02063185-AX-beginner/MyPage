import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const contract = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r2-contract.json", import.meta.url)));
test("Canonical R2 preserves R1 geometry while registering the visual runtime asset contract", () => {
  assert.equal(contract.scene, "CanonicalRuntimeR2Scene");
  assert.deepEqual(contract.world.size, [1920, 1080]);
  assert.deepEqual(contract.world.viewport, [1280, 720]);
  assert.deepEqual(contract.player.visual, [28, 56]);
  assert.deepEqual(contract.player.body, [28, 16]);
  assert.deepEqual(contract.anchors, ["P1","P2","P3","P4","P5","P6","P7","P8"]);
  assert.equal(contract.geometryRevision, "R1_UNCHANGED");
  for (const asset of contract.runtimeAssets) assert.ok(existsSync(new URL(`../public/assets/canonical-r2/${asset}`, import.meta.url)));
});
