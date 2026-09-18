import assert from "node:assert/strict";
import test from "node:test";
import rawWorldLayout from "../src/world/worldLayoutData.json" with { type: "json" };
import { validateWorldLayout } from "../src/world/layoutValidation.mjs";

const WORLD_DIMENSIONS = { worldWidth: 2048, worldHeight: 1280 };

test("project-owned spatial layout validates", () => {
  assert.doesNotThrow(() => validateWorldLayout(rawWorldLayout, WORLD_DIMENSIONS));
});

test("spatial validation rejects duplicate IDs, invalid harbor visual catalog entries, and collision drift", () => {
  const duplicateId = structuredClone(rawWorldLayout);
  duplicateId.harborVisuals[0].id = duplicateId.zones[0].id;
  assert.throws(() => validateWorldLayout(duplicateId, WORLD_DIMENSIONS), /Duplicate placement ID/);

  const outOfBounds = structuredClone(rawWorldLayout);
  outOfBounds.harborVisuals[0].x = -1;
  assert.throws(() => validateWorldLayout(outOfBounds, WORLD_DIMENSIONS), /Out-of-bounds placement/);

  const invalidCollision = structuredClone(rawWorldLayout);
  invalidCollision.harborVisuals[0].collidable = true;
  assert.throws(() => validateWorldLayout(invalidCollision, WORLD_DIMENSIONS), /Unexpected collidable harbor visual/);

  const unknownType = structuredClone(rawWorldLayout);
  unknownType.harborVisuals[0].type = "unrendered-visual";
  assert.throws(() => validateWorldLayout(unknownType, WORLD_DIMENSIONS), /Unknown harbor visual type/);

  const duplicateWater = structuredClone(rawWorldLayout);
  duplicateWater.harborVisuals.push({ ...duplicateWater.harborVisuals[2], id: "second-water" });
  assert.throws(() => validateWorldLayout(duplicateWater, WORLD_DIMENSIONS), /exactly one coherent waterfront/);
});
