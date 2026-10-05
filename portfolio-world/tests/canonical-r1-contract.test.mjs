import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
const contract = JSON.parse(readFileSync(new URL("../../data/portfolio-world/runtime-r1-contract.json", import.meta.url)));
const blueprint = JSON.parse(readFileSync(new URL("../../data/portfolio-world/canonical-target-implementation-blueprint.json", import.meta.url)));
test("Canonical R1 contract integrates Amendment 01 without changing the canonical frame", () => {
  assert.deepEqual([contract.world.width, contract.world.height], [1920,1080]);
  assert.deepEqual(contract.player.visual, [28,56]); assert.deepEqual(contract.player.body, [28,16]);
  assert.equal(contract.levels.count, 2); assert.equal(contract.visitablePoints.length, 4);
  assert.deepEqual(blueprint.anchors.map((anchor) => anchor.id), ["P1","P2","P3","P4","P5","P6","P7","P8"]);
  assert.equal(blueprint.amendments[0].status, "APPROVED_AND_INTEGRATED");
});
