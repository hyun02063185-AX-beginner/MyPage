import assert from "node:assert/strict";
import test from "node:test";
import rawWorldLayout from "../src/world/worldLayoutData.json" with { type: "json" };
import {
  depthAtContact,
  getBuildingDepth,
  getPlayerDepth,
  getVesselDepth,
  getWorldLabelDepth,
  stableDepthTie,
  WORLD_DEPTH,
} from "../src/world/worldDepth.mjs";
import { translateTownLayout } from "../src/world/layoutTransform.mjs";

test("semantic depth bands keep ground, walkable structures, bodies, and labels ordered", () => {
  assert.ok(WORLD_DEPTH.GROUND_WATER < WORLD_DEPTH.GROUND_DETAIL);
  assert.ok(WORLD_DEPTH.GROUND_DETAIL < WORLD_DEPTH.WALKABLE_STRUCTURE);
  assert.ok(WORLD_DEPTH.WALKABLE_STRUCTURE < WORLD_DEPTH.LOW_PROP);
  assert.ok(WORLD_DEPTH.LOW_PROP < WORLD_DEPTH.WORLD_OBJECT_BODY);
  assert.equal(WORLD_DEPTH.WORLD_OBJECT_BODY, WORLD_DEPTH.ACTOR_PLAYER);
  assert.ok(WORLD_DEPTH.UPPER_OCCLUDER > WORLD_DEPTH.WORLD_OBJECT_BODY);
  assert.ok(getWorldLabelDepth("gallery") > WORLD_DEPTH.UPPER_OCCLUDER);
  assert.ok(WORLD_DEPTH.HTML_UI > getWorldLabelDepth("gallery"));
});

test("world-object depth increases with logical contact Y", () => {
  assert.ok(
    depthAtContact(WORLD_DEPTH.WORLD_OBJECT_BODY, 900, "rear")
      < depthAtContact(WORLD_DEPTH.WORLD_OBJECT_BODY, 901, "front"),
  );
});

test("equal contact rows resolve deterministically without overtaking a one-pixel Y difference", () => {
  assert.equal(stableDepthTie("same-id"), stableDepthTie("same-id"));
  assert.notEqual(stableDepthTie("alpha"), stableDepthTie("bravo"));
  assert.ok(
    depthAtContact(WORLD_DEPTH.WORLD_OBJECT_BODY, 700, "max-tie")
      < depthAtContact(WORLD_DEPTH.WORLD_OBJECT_BODY, 701, "min-tie"),
  );
});

test("Hero D and the rear east brig use waterline anchors rather than image canvas height", () => {
  const layout = translateTownLayout(rawWorldLayout, { worldWidth: 2048, worldHeight: 1280 });
  const hero = layout.harborVisuals.find((visual) => visual.id === "harbor-large-ship");
  const brig = layout.harborVisuals.find((visual) => visual.id === "harbor-east-merchant-brig");
  assert.ok(hero && brig);

  const heroWaterlineY = hero.y + 18; // Existing Hero D hull/waterline placement anchor.
  const brigWaterlineY = brig.y + brig.height / 2;
  assert.ok(heroWaterlineY > brigWaterlineY);
  assert.ok(getVesselDepth(heroWaterlineY, hero.id) > getVesselDepth(brigWaterlineY, brig.id));
});

test("player is behind Exhibition Hall north of its base and in front south of it", () => {
  const layout = translateTownLayout(rawWorldLayout, { worldWidth: 2048, worldHeight: 1280 });
  const exhibition = layout.zones.find((zone) => zone.id === "gallery");
  assert.ok(exhibition);
  const buildingDepth = getBuildingDepth({ ...exhibition, collidable: true });
  const baseY = exhibition.y + exhibition.height / 2;

  assert.ok(getPlayerDepth(baseY - 32) < buildingDepth);
  assert.ok(getPlayerDepth(baseY + 32) > buildingDepth);
});
