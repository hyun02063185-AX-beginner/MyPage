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
    // A/B/C/D remain explicit development comparison loads; normal play loads D, the Exhibition,
    // and the small deliberately bounded secondary fleet only.
    for (const asset of [
      getHeroShipAsset(window.location.search),
      WORLD_ASSETS.exhibitionHall,
      WORLD_ASSETS.secondaryBrig,
      WORLD_ASSETS.secondarySchooner,
      WORLD_ASSETS.secondaryCutter,
    ]) {
      this.load.image(asset.textureKey, resolveWorldAssetUrl(asset));
    }
  }

  public create(): void {
    this.scene.start("WorldScene");
  }
}
