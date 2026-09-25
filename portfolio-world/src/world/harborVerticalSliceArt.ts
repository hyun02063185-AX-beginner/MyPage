import Phaser from "phaser";
import {
  getHarborVisualDepth,
  getWorldLabelDepth,
  WORLD_DEPTH,
} from "./worldDepth.mjs";
import { WORLD_ASSETS } from "./worldAssetManifest";
import type {
  BuildingFootprint,
  HarborVisualPlacement,
  WorldPath,
  WorldZone,
} from "./worldTypes";

const hasSliceArt = (scene: Phaser.Scene): boolean => scene.textures.exists(
  WORLD_ASSETS.harborVerticalSliceTerrain.textureKey,
);

/** Shared system-sans rule keeps destination labels legible without a font payload. */
export const WORLD_LABEL_FONT_FAMILY = '"Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", Arial, sans-serif';

/** ART-02 keeps its final raster treatment bounded to the south harbor slice. */
export function drawHarborVerticalSliceTerrain(scene: Phaser.Scene): void {
  if (!hasSliceArt(scene)) return;
  scene.add
    .image(1024, 1000, WORLD_ASSETS.harborVerticalSliceTerrain.textureKey)
    .setDisplaySize(2048, 560)
    .setDepth(WORLD_DEPTH.BACKGROUND_GROUND + 1);
}

export function drawHarborVerticalSliceWater(
  scene: Phaser.Scene,
  waterVisuals: readonly HarborVisualPlacement[],
): boolean {
  if (!scene.textures.exists(WORLD_ASSETS.harborVerticalSliceWater.textureKey)) return false;
  for (const water of waterVisuals) {
    scene.add
      .image(water.x, water.y, WORLD_ASSETS.harborVerticalSliceWater.textureKey)
      .setDisplaySize(water.width, water.height)
      .setDepth(getHarborVisualDepth(water));
  }
  return true;
}

export function drawHarborVerticalSliceShoreline(
  scene: Phaser.Scene,
  waterVisuals: readonly HarborVisualPlacement[],
): void {
  if (!scene.textures.exists(WORLD_ASSETS.harborOpenShoreline.textureKey)) return;
  for (const water of waterVisuals) {
    scene.add
      .image(
        water.x,
        water.y - water.height / 2 + Math.min(20, water.height * 0.2),
        WORLD_ASSETS.harborOpenShoreline.textureKey,
      )
      .setDisplaySize(water.width, Math.min(76, water.height * 0.6))
      .setAlpha(0.72)
      .setDepth(WORLD_DEPTH.GROUND_WATER + 1);
  }

  // The east basin's land-facing top-left corner is exposed beside Exhibition Hall.
  // Continue the already-approved shoreline raster down that visible vertical edge so
  // its deliberately soft horizontal end never leaves a hard rectangular corner.
  const eastBasin = waterVisuals.find((water) => water.id === "harbor-east-basin");
  if (eastBasin) {
    scene.add
      .image(
        eastBasin.x - eastBasin.width / 2 + 20,
        eastBasin.y - eastBasin.height / 2 + 64,
        WORLD_ASSETS.harborOpenShoreline.textureKey,
      )
      .setDisplaySize(128, 76)
      .setRotation(-Math.PI / 2)
      .setAlpha(0.72)
      .setDepth(WORLD_DEPTH.GROUND_WATER + 2);
  }
}

export const isHarborVerticalSlicePath = (path: WorldPath): boolean =>
  path.id === "path-south" || path.id === "forecourt-gallery";

export function drawHarborVerticalSlicePaving(
  scene: Phaser.Scene,
  plaza: WorldZone,
  paths: readonly WorldPath[],
): boolean {
  if (!scene.textures.exists(WORLD_ASSETS.harborVerticalSlicePromenade.textureKey)) return false;
  const drawAlignedPavingRegion = (region: WorldZone | WorldPath): void => {
    const left = region.x - region.width / 2;
    const top = region.y - region.height / 2;
    const paving = scene.add
      .tileSprite(region.x, region.y, region.width, region.height, WORLD_ASSETS.harborVerticalSlicePromenade.textureKey)
      .setDepth(WORLD_DEPTH.GROUND_DETAIL + 2);
    // Each rectangle samples the same 0.42× raster coordinate system. This preserves
    // stone-joint scale and lets the plaza, narrow path, and overlapping forecourt
    // meet as one material instead of independently stretched texture cards.
    paving.setTileScale(0.42, 0.42);
    paving.tilePositionX = -left;
    paving.tilePositionY = -top;
  };
  drawAlignedPavingRegion(plaza);
  for (const path of paths) {
    drawAlignedPavingRegion(path);
  }
  scene.add
    .text(plaza.x, plaza.y - plaza.height / 2 + 18, plaza.label, {
      color: "#213840",
      fontFamily: WORLD_LABEL_FONT_FAMILY,
      fontSize: "17px",
      fontStyle: "bold",
      stroke: "#f3ead8",
      strokeThickness: 1,
    })
    .setOrigin(0.5)
    .setDepth(getWorldLabelDepth(plaza.id));
  return true;
}

export function drawHarborVerticalSliceBuildingGrounding(
  scene: Phaser.Scene,
  building: BuildingFootprint,
  depth: number,
): void {
  if (building.id !== "gallery" || !scene.textures.exists(WORLD_ASSETS.harborExhibitionFoundationContact.textureKey)) return;
  scene.add
    .image(building.x, building.y + building.height / 2 + 2, WORLD_ASSETS.harborExhibitionFoundationContact.textureKey)
    .setDisplaySize(400, 92)
    .setDepth(depth - 0.001);
}
