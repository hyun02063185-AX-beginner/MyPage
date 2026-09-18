import assert from "node:assert/strict";
import test from "node:test";
import rawWorldLayout from "../src/world/worldLayoutData.json" with { type: "json" };
import { validateWorldLayout } from "../src/world/layoutValidation.mjs";
import {
  assertTownTranslation,
  HARBOR_BASIN_HEIGHT,
  TOWN_TRANSLATION_Y,
  translateTownLayout,
} from "../src/world/layoutTransform.mjs";

const WORLD_DIMENSIONS = { worldWidth: 2048, worldHeight: 1280 };
const translatedLayout = () => translateTownLayout(rawWorldLayout, WORLD_DIMENSIONS);

test("project-owned spatial layout validates", () => {
  assert.doesNotThrow(() => validateWorldLayout(translatedLayout(), WORLD_DIMENSIONS));
});

test("spatial validation rejects duplicate IDs, invalid harbor visual catalog entries, and collision drift", () => {
  const duplicateId = structuredClone(translatedLayout());
  duplicateId.harborVisuals[0].id = duplicateId.zones[0].id;
  assert.throws(() => validateWorldLayout(duplicateId, WORLD_DIMENSIONS), /Duplicate placement ID/);

  const outOfBounds = structuredClone(translatedLayout());
  outOfBounds.harborVisuals[0].x = -1;
  assert.throws(() => validateWorldLayout(outOfBounds, WORLD_DIMENSIONS), /Out-of-bounds placement/);

  const invalidCollision = structuredClone(translatedLayout());
  invalidCollision.harborVisuals[0].collidable = true;
  assert.throws(() => validateWorldLayout(invalidCollision, WORLD_DIMENSIONS), /Unexpected collidable harbor visual/);

  const unknownType = structuredClone(translatedLayout());
  unknownType.harborVisuals[0].type = "unrendered-visual";
  assert.throws(() => validateWorldLayout(unknownType, WORLD_DIMENSIONS), /Unknown harbor visual type/);

  const duplicateWater = structuredClone(translatedLayout());
  duplicateWater.harborVisuals.push({ ...duplicateWater.harborVisuals[2] });
  assert.throws(() => validateWorldLayout(duplicateWater, WORLD_DIMENSIONS), /Duplicate placement ID/);
});

test("Pass 2 constraints protect navigation, building footprints, and expansion lots", () => {
  const reservedLotOutOfBounds = structuredClone(translatedLayout());
  reservedLotOutOfBounds.reservedLots[0].x = -1;
  assert.throws(
    () => validateWorldLayout(reservedLotOutOfBounds, WORLD_DIMENSIONS),
    /Out-of-bounds placement/,
  );

  const reservedLotOnPath = structuredClone(translatedLayout());
  reservedLotOnPath.reservedLots[0].x = 1024;
  reservedLotOnPath.reservedLots[0].y = 392;
  assert.throws(
    () => validateWorldLayout(reservedLotOnPath, WORLD_DIMENSIONS),
    /Reserved lot overlaps protected layout/,
  );

  const overlappingLots = structuredClone(translatedLayout());
  overlappingLots.reservedLots[1].x = overlappingLots.reservedLots[0].x;
  overlappingLots.reservedLots[1].y = overlappingLots.reservedLots[0].y;
  assert.throws(() => validateWorldLayout(overlappingLots, WORLD_DIMENSIONS), /Reserved lots overlap/);

  const permanentOnForecourt = structuredClone(translatedLayout());
  const noticeBoard = permanentOnForecourt.harborVisuals.find(
    (visual) => visual.id === "guild-notice-board",
  );
  const guildForecourt = permanentOnForecourt.forecourts.find(
    (forecourt) => forecourt.id === "forecourt-career",
  );
  noticeBoard.x = guildForecourt.x;
  noticeBoard.y = guildForecourt.y;
  assert.throws(
    () => validateWorldLayout(permanentOnForecourt, WORLD_DIMENSIONS),
    /Permanent streetscape overlaps protected navigation/,
  );

  const permanentOnBuilding = structuredClone(translatedLayout());
  const displayBoard = permanentOnBuilding.harborVisuals.find(
    (visual) => visual.id === "exhibition-display-board",
  );
  const exhibition = permanentOnBuilding.zones.find((zone) => zone.id === "gallery");
  displayBoard.x = exhibition.x;
  displayBoard.y = exhibition.y;
  assert.throws(
    () => validateWorldLayout(permanentOnBuilding, WORLD_DIMENSIONS),
    /Permanent streetscape overlaps protected navigation/,
  );

  const detailConsumesLot = structuredClone(translatedLayout());
  const crate = detailConsumesLot.harborVisuals.find((visual) => visual.id === "guild-travel-crate");
  crate.x = detailConsumesLot.reservedLots[0].x;
  crate.y = detailConsumesLot.reservedLots[0].y;
  assert.throws(() => validateWorldLayout(detailConsumesLot, WORLD_DIMENSIONS), /consumes reserved lot/);
});

test("Pass 3 applies the approved translation exactly once and anchors water to the south edge", () => {
  const translated = translatedLayout();
  assert.doesNotThrow(() => assertTownTranslation(rawWorldLayout, translated, WORLD_DIMENSIONS));
  assert.equal(TOWN_TRANSLATION_Y, -96);
  assert.equal(translated.playerSpawn.y, rawWorldLayout.playerSpawn.y - 96);
  for (const collectionName of ["zones", "paths", "forecourts", "reservedLots"]) {
    for (let index = 0; index < rawWorldLayout[collectionName].length; index += 1) {
      assert.equal(
        translated[collectionName][index].y,
        rawWorldLayout[collectionName][index].y + TOWN_TRANSLATION_Y,
      );
    }
  }
  const water = translated.harborVisuals.find((visual) => visual.id === "waterfront-water");
  assert.equal(water.height, HARBOR_BASIN_HEIGHT);
  assert.equal(water.y - water.height / 2, WORLD_DIMENSIONS.worldHeight - HARBOR_BASIN_HEIGHT);
  assert.equal(water.y + water.height / 2, WORLD_DIMENSIONS.worldHeight);

  const omittedShift = structuredClone(translated);
  omittedShift.reservedLots[0].y += 96;
  assert.throws(
    () => assertTownTranslation(rawWorldLayout, omittedShift, WORLD_DIMENSIONS),
    /Town translation mismatch/,
  );
});

test("Pass 3 requires all vessels to remain in water and support structures off protected land", () => {
  const vesselOnLand = structuredClone(translatedLayout());
  const largeShip = vesselOnLand.harborVisuals.find((visual) => visual.type === "large-ship");
  largeShip.y = 1060;
  assert.throws(() => validateWorldLayout(vesselOnLand, WORLD_DIMENSIONS), /fully contained in water/);

  const smallBoatBeyondWater = structuredClone(translatedLayout());
  const smallBoat = smallBoatBeyondWater.harborVisuals.find((visual) => visual.type === "small-boat");
  smallBoat.y = 1095;
  assert.throws(() => validateWorldLayout(smallBoatBeyondWater, WORLD_DIMENSIONS), /fully contained in water/);

  const missingBasin = structuredClone(translatedLayout());
  missingBasin.harborVisuals = missingBasin.harborVisuals.filter(
    (visual) => visual.id !== "harbor-east-basin",
  );
  assert.throws(() => validateWorldLayout(missingBasin, WORLD_DIMENSIONS), /both inner harbor basins/);

  const overlappingVessels = structuredClone(translatedLayout());
  const secondBoat = overlappingVessels.harborVisuals.find(
    (visual) => visual.id === "harbor-basin-boat",
  );
  const firstBoat = overlappingVessels.harborVisuals.find(
    (visual) => visual.id === "waterfront-boat",
  );
  secondBoat.x = firstBoat.x;
  secondBoat.y = firstBoat.y;
  assert.throws(() => validateWorldLayout(overlappingVessels, WORLD_DIMENSIONS), /Floating vessels overlap/);

  const supportOnDock = structuredClone(translatedLayout());
  const warehouse = supportOnDock.harborVisuals.find((visual) => visual.type === "warehouse");
  const dock = supportOnDock.harborVisuals.find((visual) => visual.type === "dock");
  warehouse.x = dock.x - dock.width / 2 - warehouse.width / 2 + 40;
  warehouse.y = dock.y;
  assert.throws(() => validateWorldLayout(supportOnDock, WORLD_DIMENSIONS), /overlaps dock traversal/);

  const supportInLot = structuredClone(translatedLayout());
  const cargoShed = supportInLot.harborVisuals.find((visual) => visual.type === "cargo-shed");
  cargoShed.x = supportInLot.reservedLots[0].x;
  cargoShed.y = supportInLot.reservedLots[0].y;
  assert.throws(() => validateWorldLayout(supportInLot, WORLD_DIMENSIONS), /consumes reserved lot/);
});
