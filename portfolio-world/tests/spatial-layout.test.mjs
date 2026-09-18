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

test("Pass 2 constraints protect navigation, building footprints, and expansion lots", () => {
  const reservedLotOutOfBounds = structuredClone(rawWorldLayout);
  reservedLotOutOfBounds.reservedLots[0].x = -1;
  assert.throws(
    () => validateWorldLayout(reservedLotOutOfBounds, WORLD_DIMENSIONS),
    /Out-of-bounds placement/,
  );

  const reservedLotOnPath = structuredClone(rawWorldLayout);
  reservedLotOnPath.reservedLots[0].x = 1024;
  reservedLotOnPath.reservedLots[0].y = 392;
  assert.throws(
    () => validateWorldLayout(reservedLotOnPath, WORLD_DIMENSIONS),
    /Reserved lot overlaps protected layout/,
  );

  const overlappingLots = structuredClone(rawWorldLayout);
  overlappingLots.reservedLots[1].x = overlappingLots.reservedLots[0].x;
  overlappingLots.reservedLots[1].y = overlappingLots.reservedLots[0].y;
  assert.throws(() => validateWorldLayout(overlappingLots, WORLD_DIMENSIONS), /Reserved lots overlap/);

  const permanentOnForecourt = structuredClone(rawWorldLayout);
  const noticeBoard = permanentOnForecourt.harborVisuals.find(
    (visual) => visual.id === "guild-notice-board",
  );
  noticeBoard.x = 416;
  noticeBoard.y = 640;
  assert.throws(
    () => validateWorldLayout(permanentOnForecourt, WORLD_DIMENSIONS),
    /Permanent streetscape overlaps protected navigation/,
  );

  const permanentOnBuilding = structuredClone(rawWorldLayout);
  const displayBoard = permanentOnBuilding.harborVisuals.find(
    (visual) => visual.id === "exhibition-display-board",
  );
  displayBoard.x = 1024;
  displayBoard.y = 1056;
  assert.throws(
    () => validateWorldLayout(permanentOnBuilding, WORLD_DIMENSIONS),
    /Permanent streetscape overlaps protected navigation/,
  );

  const detailConsumesLot = structuredClone(rawWorldLayout);
  const crate = detailConsumesLot.harborVisuals.find((visual) => visual.id === "guild-travel-crate");
  crate.x = detailConsumesLot.reservedLots[0].x;
  crate.y = detailConsumesLot.reservedLots[0].y;
  assert.throws(() => validateWorldLayout(detailConsumesLot, WORLD_DIMENSIONS), /consumes reserved lot/);
});
