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
    if (canonical === "2" || canonical === "3") {
      const base = import.meta.env.BASE_URL;
      const assets: Record<string, string> = {
        "r2-hall": "architecture/hall-b.png", "r2-workshop": "architecture/workshop-c.png", "r2-office": "architecture/office-b.png",
        "r2-hero": "ships/hero-b.png", "r2-secondary": "ships/secondary-b.png", "r2-workboat": "ships/workboat-a.png",
        "r2-water": "environment/w1-sheltered-turquoise-water.png", "r2-player": "player/player-a.png",
        "r21-inner-harbor": "water/inner-harbor.png", "r21-hero-berth": "water/hero-berth.png",
        "r21-secondary-berth": "water/secondary-berth.png", "r21-workboat-water": "water/workboat-water.png", "r21-outer-water": "water/outer-scenic-water.png",
        "r24-foundation-master-b": "candidates/runtime-r24-foundation-master/foundation-master-b.png",
        "r24-foundation-master-b-vertical": "candidates/runtime-r24-foundation-master/foundation-master-b-vertical-structure.png",
      };
      for (const [key, file] of Object.entries(assets)) this.load.image(key, `${base}assets/canonical-r2/${file}`);
      if (canonical === "3") {
        const r3Assets: Record<string, string> = {
          "r3-scenic-a-final": "scenic/scenic-a-final.png", "r3-fountain-b": "props/fountain-b.png",
          "r3-flower-planter": "props/flower-planter.png", "r3-cypress-planter": "props/cypress-planter.png",
          "r3-bench": "props/bench.png", "r3-lamp": "props/lamp.png", "r3-banner": "props/banner.png",
          "r3-crate-stack": "props/crate-stack.png", "r3-barrels": "props/barrels.png", "r3-notice-board": "props/notice-board.png",
          "r3-bollard": "props/bollard.png", "r3-rope-coil": "props/rope-coil.png", "r3-mooring-rope": "props/mooring-rope.png",
        };
        for (const [key, file] of Object.entries(r3Assets)) this.load.image(key, `${base}assets/canonical-r3/runtime/${file}`);
      }
      // Water continuity remains a render-only data input, separate from R1 collision vectors.
      this.load.json("r22-visual-water-coverage", `${base}assets/canonical-r2/visual-water-coverage.json`);
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
    this.scene.start(canonical === "1" ? "CanonicalRuntimeR1Scene" : canonical === "2" ? "CanonicalRuntimeR2Scene" : canonical === "3" ? "CanonicalRuntimeR3Scene" : "WorldScene");
  }
}
