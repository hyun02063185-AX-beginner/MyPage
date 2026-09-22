import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const audit = JSON.parse(readFileSync(resolve(projectRoot, "src/world/majorBuildingScaleAudit.json"), "utf8"));
const manifestSource = readFileSync(resolve(projectRoot, "src/world/worldAssetManifest.ts"), "utf8");

test("major destinations retain the explicit player-door scale-family contract", () => {
  assert.equal(audit.scaleFamily, "PRIMARY_DESTINATION_PLAYER_DOOR_BUILDING_V1");
  assert.deepEqual(audit.player, { displayWidth: 24, displayHeight: 32, visibleBodyWidth: 20, visibleBodyHeight: 28 });
  assert.equal(audit.buildings.length, 4);
  assert.deepEqual(audit.buildings.map((building) => building.id), [
    "guild-hall-v01", "academy-v03", "workshop-v03", "exhibition-hall-v03",
  ]);

  for (const building of audit.buildings) {
    const [doorWidth, doorHeight] = building.mainDoor;
    const [widthRatio, heightRatio] = building.doorToPlayer;
    assert.ok(widthRatio >= audit.doorWidthRatioTarget.minimum && widthRatio <= audit.doorWidthRatioTarget.maximum, `${building.id} door width`);
    assert.ok(heightRatio >= 1.5 && heightRatio <= 2.15, `${building.id} door height`);
    assert.ok(doorWidth > 0 && doorHeight > 0, `${building.id} door measurement`);
    assert.equal(existsSync(resolve(projectRoot, "public", building.runtimePath)), true, `${building.id} runtime art`);
    assert.equal(statSync(resolve(projectRoot, "public", building.runtimePath)).size, building.fileBytes, `${building.id} byte record`);
    assert.match(manifestSource, new RegExp(`id: "${building.id}"`), `${building.id} manifest`);
  }

  assert.equal(audit.buildings.filter((building) => building.action === "targeted-door-regeneration").length, 3);

  for (const activeShip of ["heroShipD", "secondaryBrig", "secondaryCutter", "mediumSailingVessel"]) {
    assert.match(manifestSource, new RegExp(`${activeShip}: \\{[\\s\\S]*?status: "GAME_READY"`), `${activeShip} production status`);
  }
  assert.match(manifestSource, /secondarySchooner: \{[\s\S]*?status: "DEPRECATED"/);
});
