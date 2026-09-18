import Phaser from "phaser";
import {
  getHeroShipAsset,
  WORLD_ASSETS,
  resolveWorldAssetUrl,
} from "../world/worldAssetManifest";

/** Loads the explicit first art slice; later phases can keep this focused list small. */
export class BootScene extends Phaser.Scene {
  public constructor() {
    super("BootScene");
  }

  public preload(): void {
    // A/B/C are separate comparison loads; normal play pays only for default B + Exhibition.
    for (const asset of [getHeroShipAsset(window.location.search), WORLD_ASSETS.exhibitionHall]) {
      this.load.image(asset.textureKey, resolveWorldAssetUrl(asset));
    }
  }

  public create(): void {
    this.scene.start("WorldScene");
  }
}
