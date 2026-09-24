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
}

export const isHarborVerticalSlicePath = (path: WorldPath): boolean =>
  path.id === "path-south" || path.id === "forecourt-gallery";

export function drawHarborVerticalSlicePaving(
  scene: Phaser.Scene,
  plaza: WorldZone,
  paths: readonly WorldPath[],
): boolean {
  if (!scene.textures.exists(WORLD_ASSETS.harborVerticalSlicePromenade.textureKey)) return false;
  scene.add
    .image(plaza.x, plaza.y, WORLD_ASSETS.harborVerticalSlicePromenade.textureKey)
    .setDisplaySize(plaza.width, plaza.height)
    .setDepth(WORLD_DEPTH.GROUND_DETAIL + 2);
  for (const path of paths) {
    scene.add
      .image(path.x, path.y, WORLD_ASSETS.harborVerticalSlicePromenade.textureKey)
      .setDisplaySize(path.width, path.height)
      .setDepth(WORLD_DEPTH.GROUND_DETAIL + 2);
  }
  scene.add
    .text(plaza.x, plaza.y - plaza.height / 2 + 18, plaza.label, {
      color: "#213840",
      fontFamily: "monospace",
      fontSize: "16px",
      fontStyle: "bold",
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
