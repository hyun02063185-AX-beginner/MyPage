import Phaser from "phaser";
import {
  CAMERA_LERP_X,
  CAMERA_LERP_Y,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/gameConfig";
import { Player } from "../player/Player";
import {
  drawHarborBuilding,
  drawHarborEdgeTreatment,
  drawHarborGround,
  drawHarborPath,
  drawHarborPlaza,
  drawHarborVisual,
} from "../world/harborVisualCatalog";
import {
  getCalibrationAssets,
  getHeroShipAsset,
  WORLD_ASSETS,
} from "../world/worldAssetManifest";
import {
  getBuildingDepth,
  getHarborVisualDepth,
  getVesselDepth,
  getWorldLabelDepth,
  WORLD_DEPTH,
} from "../world/worldDepth.mjs";
import { WORLD_LAYOUT } from "../world/worldLayout";

type MovementKeys = Record<
  "up" | "down" | "left" | "right" | "w" | "a" | "s" | "d",
  Phaser.Input.Keyboard.Key
>;

const getSecondarySailingAsset = (id: string) => {
  switch (id) {
    case "harbor-west-merchant-brig":
    case "harbor-east-merchant-brig":
      return WORLD_ASSETS.secondaryBrig;
    case "harbor-west-cargo-schooner":
      return WORLD_ASSETS.secondarySchooner;
    case "harbor-east-harbor-cutter":
      return WORLD_ASSETS.secondaryCutter;
    default:
      return undefined;
  }
};

/** Orchestrates layout, focused harbor visuals, collision, input, and camera. */
export class WorldScene extends Phaser.Scene {
  private player?: Player;
  private movementKeys?: MovementKeys;

  public constructor() {
    super("WorldScene");
  }

  public create(): void {
    this.renderWorld();
    this.createPlayer();
    this.createEnvironmentalCollision();
    this.configureCamera();
    this.game.events.on(Phaser.Core.Events.BLUR, this.resetMovementKeys, this);
    this.events.on(Phaser.Scenes.Events.POST_UPDATE, this.constrainPlayer, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.disposeInput, this);
  }

  public update(): void {
    if (!this.player || !this.movementKeys) {
      return;
    }

    this.player.update({
      left: this.movementKeys.left.isDown || this.movementKeys.a.isDown,
      right: this.movementKeys.right.isDown || this.movementKeys.d.isDown,
      up: this.movementKeys.up.isDown || this.movementKeys.w.isDown,
      down: this.movementKeys.down.isDown || this.movementKeys.s.isDown,
    });
  }

  private createPlayer(): void {
    this.player = new Player(
      this,
      WORLD_LAYOUT.playerSpawn.x,
      WORLD_LAYOUT.playerSpawn.y,
    );
    this.movementKeys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as MovementKeys | undefined;
  }

  private createEnvironmentalCollision(): void {
    if (!this.player) {
      return;
    }

    const collidablePlacements = [
      ...WORLD_LAYOUT.buildings,
      ...WORLD_LAYOUT.harborVisuals.filter(
        (visual) => visual.collidable && visual.type !== "water",
      ),
      ...WORLD_LAYOUT.waterCollisionRects,
    ];
    const colliderObjects = collidablePlacements.map((placement) =>
      this.add
        .rectangle(placement.x, placement.y, placement.width, placement.height, 0x000000, 0)
        .setVisible(false),
    );
    const staticEnvironment = this.physics.add.staticGroup(colliderObjects);
    this.physics.add.collider(this.player.gameObject, staticEnvironment);
  }

  /** Phaser emits this on browser/game blur; reset prevents a held key sticking. */
  private resetMovementKeys(): void {
    this.input.keyboard?.resetKeys();
    this.player?.stop();
  }

  private constrainPlayer(): void {
    this.player?.constrainToWorldBounds();
  }

  private disposeInput(): void {
    this.game.events.off(Phaser.Core.Events.BLUR, this.resetMovementKeys, this);
    this.events.off(Phaser.Scenes.Events.POST_UPDATE, this.constrainPlayer, this);
  }

  private configureCamera(): void {
    if (!this.player) {
      return;
    }

    this.cameras.main
      .setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
      .startFollow(this.player.gameObject, true, CAMERA_LERP_X, CAMERA_LERP_Y);
    this.cameras.main.roundPixels = true;

    // Dev-only controlled calibration surface. It is removed from production along with
    // getCalibrationAssets' DEV branch and never changes world layout/collision data.
    if (
      import.meta.env.DEV &&
      getCalibrationAssets(window.location.search) &&
      new URLSearchParams(window.location.search).get("assetPreview") === "calibration"
    ) {
      this.cameras.main.stopFollow().setZoom(0.7).centerOn(1050, 576);
      return;
    }

    // Undocumented QA framing for ship A/B/C comparison; normal play keeps camera follow.
    if (
      import.meta.env.DEV &&
      new URLSearchParams(window.location.search).get("assetPreview") === "harbor"
    ) {
      // Frame all three calibration subjects in their real harbor placement.
      this.cameras.main.stopFollow().setZoom(0.6).centerOn(1024, 1050);
    }
  }

  private renderWorld(): void {
    const calibration = getCalibrationAssets(window.location.search);
    drawHarborGround(this);
    for (const visual of WORLD_LAYOUT.harborVisuals.filter((item) => item.type === "water")) {
      drawHarborVisual(this, visual);
    }
    drawHarborEdgeTreatment(this, WORLD_LAYOUT.edgeDecorations);
    for (const path of WORLD_LAYOUT.paths) {
      drawHarborPath(this, path);
    }
    for (const forecourt of WORLD_LAYOUT.forecourts) {
      drawHarborPath(this, forecourt, true);
    }
    drawHarborPlaza(this, WORLD_LAYOUT.centralPlaza);
    for (const building of WORLD_LAYOUT.buildings) {
      if (building.id === "gallery" && this.textures.exists(
        calibration?.exhibitionHall.textureKey ?? WORLD_ASSETS.exhibitionHall.textureKey,
      )) {
        continue;
      }
      drawHarborBuilding(this, building);
    }
    for (const visual of WORLD_LAYOUT.harborVisuals.filter((item) => item.type !== "water")) {
      if (visual.type === "large-ship" && this.textures.exists(
        calibration?.heroShipD.textureKey ?? getHeroShipAsset(window.location.search).textureKey,
      )) {
        continue;
      }
      if (visual.type === "warehouse" && calibration && this.textures.exists(calibration.warehouse.textureKey)) {
        continue;
      }
      const secondaryAsset = visual.type === "secondary-sailing-ship"
        ? getSecondarySailingAsset(visual.id)
        : undefined;
      if (secondaryAsset && this.textures.exists(secondaryAsset.textureKey)) {
        continue;
      }
      drawHarborVisual(this, visual);
    }
    this.drawFirstAssetSlice();
    this.drawControlledCalibrationSurface();
  }

  /** Asset graphics intentionally replace only their matching programmatic fallbacks. */
  private drawFirstAssetSlice(): void {
    const exhibition = WORLD_LAYOUT.buildings.find((building) => building.id === "gallery");
    const ship = WORLD_LAYOUT.harborVisuals.find((visual) => visual.type === "large-ship");
    const calibration = getCalibrationAssets(window.location.search);
    const exhibitionAsset = calibration?.exhibitionHall ?? WORLD_ASSETS.exhibitionHall;
    const heroShipAsset = calibration?.heroShipD ?? getHeroShipAsset(window.location.search);

    if (exhibition && this.textures.exists(exhibitionAsset.textureKey)) {
      this.add
        .image(exhibition.x, exhibition.y + exhibition.height / 2, exhibitionAsset.textureKey)
        .setOrigin(0.5, exhibitionAsset.originY)
        .setDisplaySize(exhibitionAsset.displayWidth, exhibitionAsset.displayHeight)
        .setDepth(getBuildingDepth(exhibition));
      this.add
        .text(exhibition.x, exhibition.y + exhibition.height / 2 - 16, exhibition.label, {
          align: "center",
          color: "#213840",
          fontFamily: "monospace",
          fontSize: "14px",
          fontStyle: "bold",
          wordWrap: { width: exhibition.width - 32 },
        })
        .setOrigin(0.5)
        .setDepth(getWorldLabelDepth(exhibition.id));
    }

    if (ship && this.textures.exists(heroShipAsset.textureKey)) {
      this.add
        .image(ship.x, ship.y + 18, heroShipAsset.textureKey)
        .setOrigin(0.5, heroShipAsset.originY)
        .setDisplaySize(heroShipAsset.displayWidth, heroShipAsset.displayHeight)
        .setDepth(getVesselDepth(ship.y + 18, ship.id));
    }

    const warehouse = WORLD_LAYOUT.harborVisuals.find((visual) => visual.type === "warehouse");
    if (warehouse && calibration && this.textures.exists(calibration.warehouse.textureKey)) {
      this.add
        .image(warehouse.x, warehouse.y + warehouse.height / 2, calibration.warehouse.textureKey)
        .setOrigin(0.5, calibration.warehouse.originY)
        .setDisplaySize(calibration.warehouse.displayWidth, calibration.warehouse.displayHeight)
        .setDepth(getHarborVisualDepth(warehouse));
    }

    for (const vessel of WORLD_LAYOUT.harborVisuals.filter(
      (visual) => visual.type === "secondary-sailing-ship",
    )) {
      const asset = getSecondarySailingAsset(vessel.id);
      if (!asset || !this.textures.exists(asset.textureKey)) {
        continue;
      }
      this.add
        .image(vessel.x, vessel.y + vessel.height / 2, asset.textureKey)
        .setOrigin(0.5, asset.originY)
        .setDisplaySize(asset.displayWidth, asset.displayHeight)
        .setFlipX(vessel.id === "harbor-east-merchant-brig")
        .setDepth(getVesselDepth(vessel.y + vessel.height / 2, vessel.id));
    }
  }

  /** Minimal dev-only side-by-side evidence surface; no editor or persistent UI. */
  private drawControlledCalibrationSurface(): void {
    const calibration = getCalibrationAssets(window.location.search);
    if (
      !import.meta.env.DEV ||
      !calibration ||
      new URLSearchParams(window.location.search).get("assetPreview") !== "calibration"
    ) {
      return;
    }

    this.add.rectangle(1050, 576, 1440, 650, 0xd9c7a5).setDepth(WORLD_DEPTH.HTML_UI);
    this.add.rectangle(1050, 750, 1440, 300, 0x4d9baa).setDepth(WORLD_DEPTH.HTML_UI + 1);
    this.add.rectangle(1050, 742, 1440, 16, 0x8d5637).setDepth(WORLD_DEPTH.HTML_UI + 2);
    const subjects = [
      [650, 650, calibration.heroShipD, "Hero Ship D"],
      [1090, 620, calibration.exhibitionHall, "Exhibition Hall"],
      [1450, 650, calibration.warehouse, "Warehouse"],
    ] as const;
    for (const [x, y, asset, label] of subjects) {
      this.add.image(x, y, asset.textureKey)
        .setOrigin(0.5, asset.originY)
        .setDisplaySize(asset.displayWidth, asset.displayHeight)
        .setDepth(WORLD_DEPTH.HTML_UI + 4);
      this.add.text(x, 290, label, {
        color: "#213840", fontFamily: "monospace", fontSize: "20px", fontStyle: "bold",
      }).setOrigin(0.5).setDepth(WORLD_DEPTH.HTML_UI + 5);
    }
    this.add.text(1050, 205, `Visual grammar calibration — ${calibration.angle}° above horizontal`, {
      color: "#213840", fontFamily: "monospace", fontSize: "24px", fontStyle: "bold",
    }).setOrigin(0.5).setDepth(WORLD_DEPTH.HTML_UI + 5);
  }
}
