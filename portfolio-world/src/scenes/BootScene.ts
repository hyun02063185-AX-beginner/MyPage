import Phaser from "phaser";
import {
  getCalibrationAssets,
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
    const calibration = getCalibrationAssets(window.location.search);
    for (const asset of [
      getHeroShipAsset(window.location.search),
      WORLD_ASSETS.exhibitionHall,
      WORLD_ASSETS.secondaryBrig,
      WORLD_ASSETS.secondaryCutter,
      WORLD_ASSETS.guildHall,
      WORLD_ASSETS.academy,
      WORLD_ASSETS.workshop,
      WORLD_ASSETS.harborWarehouse,
      WORLD_ASSETS.mediumSailingVessel,
      WORLD_ASSETS.harborTree,
      WORLD_ASSETS.cargoCrate,
      WORLD_ASSETS.harborLamp,
      WORLD_ASSETS.harborWarehouseAnnex,
      WORLD_ASSETS.harborServiceHut,
      WORLD_ASSETS.harborCargoStack,
      WORLD_ASSETS.harborBarrelCluster,
      WORLD_ASSETS.harborRopeCoil,
      WORLD_ASSETS.harborBench,
      WORLD_ASSETS.harborNoticeBoard,
      WORLD_ASSETS.harborSafetyRail,
      WORLD_ASSETS.harborTree02,
      WORLD_ASSETS.harborShrubPlanter,
      WORLD_ASSETS.harborMooringBollard,
      WORLD_ASSETS.harborServiceMarker,
      WORLD_ASSETS.smallWorkboat, WORLD_ASSETS.harborDinghy, WORLD_ASSETS.dockRopeLine,
      WORLD_ASSETS.dockGangplank, WORLD_ASSETS.dockBuoy, WORLD_ASSETS.dockHandCart, WORLD_ASSETS.dockWorkNet,
      WORLD_ASSETS.harborVerticalSliceTerrain, WORLD_ASSETS.harborVerticalSliceWater,
      WORLD_ASSETS.harborVerticalSlicePromenade, WORLD_ASSETS.harborOpenShoreline,
      WORLD_ASSETS.harborShipWaterContact, WORLD_ASSETS.harborExhibitionFoundationContact,
      WORLD_ASSETS.harborViewingTerrace,
      WORLD_ASSETS.harborVesselShadowRipple, WORLD_ASSETS.harborVesselWaterOcclusion,
      ...(calibration ? [
        calibration.heroShipD,
        calibration.exhibitionHall,
        calibration.warehouse,
      ] : []),
    ]) {
      this.load.image(asset.textureKey, resolveWorldAssetUrl(asset));
    }
  }

  public create(): void {
    this.scene.start("WorldScene");
  }
}
