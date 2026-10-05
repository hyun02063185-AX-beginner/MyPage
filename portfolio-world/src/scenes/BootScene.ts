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
    const canonical = new URLSearchParams(window.location.search).get("canonical");
    if (canonical === "1") {
      const base = import.meta.env.BASE_URL;
      for (const [key, file] of Object.entries({ "r1-hall":"hall-b.png", "r1-workshop":"workshop-c.png", "r1-hero":"hero-b.png", "r1-secondary":"secondary-b.png", "r1-workboat":"workboat-a.png", "r1-office":"office-b.png" })) {
        this.load.image(key, `${base}assets/canonical-r1/${file}`);
      }
      return;
    }
    if (canonical === "2") {
      const base = import.meta.env.BASE_URL;
      const assets: Record<string, string> = {
        "r2-hall": "architecture/hall-b.png", "r2-workshop": "architecture/workshop-c.png", "r2-office": "architecture/office-b.png",
        "r2-hero": "ships/hero-b.png", "r2-secondary": "ships/secondary-b.png", "r2-workboat": "ships/workboat-a.png",
        "r2-paving": "environment/f1-premium-limestone-paving.png", "r2-quay": "environment/f2-continuous-quay-surface.png",
        "r2-edge": "environment/f3-quay-wall-edge.png", "r2-stairs": "environment/f4-limestone-main-stairs.png",
        "r2-wall": "environment/f5-terrace-retaining-wall.png", "r2-gangway": "environment/f6-gangway-foundation.png",
        "r2-water": "environment/w1-sheltered-turquoise-water.png", "r2-player": "player/player-a.png",
      };
      for (const [key, file] of Object.entries(assets)) this.load.image(key, `${base}assets/canonical-r2/${file}`);
      return;
    }
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
    const canonical = new URLSearchParams(window.location.search).get("canonical");
    this.scene.start(canonical === "1" ? "CanonicalRuntimeR1Scene" : canonical === "2" ? "CanonicalRuntimeR2Scene" : "WorldScene");
  }
}
