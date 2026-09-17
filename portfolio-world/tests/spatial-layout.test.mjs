import assert from "node:assert/strict";
import test from "node:test";
import rawWorldLayout from "../src/world/worldLayoutData.json" with { type: "json" };
import { validateWorldLayout } from "../src/world/layoutValidation.mjs";

const WORLD_DIMENSIONS = { worldWidth: 2048, worldHeight: 1280 };

test("project-owned spatial layout validates", () => {
  assert.doesNotThrow(() => validateWorldLayout(rawWorldLayout, WORLD_DIMENSIONS));
});

test("spatial validation rejects duplicate IDs, out-of-bounds geometry, and invalid collision", () => {
  const duplicateId = structuredClone(rawWorldLayout);
  duplicateId.landmarks[0].id = duplicateId.zones[0].id;
  assert.throws(() => validateWorldLayout(duplicateId, WORLD_DIMENSIONS), /Duplicate placement ID/);

  const outOfBounds = structuredClone(rawWorldLayout);
  outOfBounds.landmarks[0].x = -1;
  assert.throws(() => validateWorldLayout(outOfBounds, WORLD_DIMENSIONS), /Out-of-bounds placement/);

  const invalidCollision = structuredClone(rawWorldLayout);
  invalidCollision.landmarks[0].collidable = true;
  assert.throws(() => validateWorldLayout(invalidCollision, WORLD_DIMENSIONS), /Unexpected collidable landmark/);
});
