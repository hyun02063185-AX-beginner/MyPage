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
import { getHeroShipAsset, WORLD_ASSETS } from "../world/worldAssetManifest";
import { WORLD_LAYOUT } from "../world/worldLayout";

type MovementKeys = Record<
  "up" | "down" | "left" | "right" | "w" | "a" | "s" | "d",
  Phaser.Input.Keyboard.Key
>;

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

    // Undocumented QA framing for ship A/B/C comparison; normal play keeps camera follow.
    if (new URLSearchParams(window.location.search).get("assetPreview") === "harbor") {
      this.cameras.main.stopFollow().centerOn(1250, 992);
    }
  }

  private renderWorld(): void {
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
      if (building.id === "gallery" && this.textures.exists(WORLD_ASSETS.exhibitionHall.textureKey)) {
        continue;
      }
      drawHarborBuilding(this, building);
    }
    for (const visual of WORLD_LAYOUT.harborVisuals.filter((item) => item.type !== "water")) {
      if (visual.type === "large-ship" && this.textures.exists(getHeroShipAsset(window.location.search).textureKey)) {
        continue;
      }
      drawHarborVisual(this, visual);
    }
    this.drawFirstAssetSlice();
  }

  /** Asset graphics intentionally replace only their matching programmatic fallbacks. */
  private drawFirstAssetSlice(): void {
    const exhibition = WORLD_LAYOUT.buildings.find((building) => building.id === "gallery");
    const ship = WORLD_LAYOUT.harborVisuals.find((visual) => visual.type === "large-ship");
    const exhibitionAsset = WORLD_ASSETS.exhibitionHall;
    const heroShipAsset = getHeroShipAsset(window.location.search);

    if (exhibition && this.textures.exists(exhibitionAsset.textureKey)) {
      this.add
        .image(exhibition.x, exhibition.y + exhibition.height / 2, exhibitionAsset.textureKey)
        .setOrigin(0.5, exhibitionAsset.originY)
        .setDisplaySize(exhibitionAsset.displayWidth, exhibitionAsset.displayHeight)
        .setDepth(5);
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
        .setDepth(8);
    }

    if (ship && this.textures.exists(heroShipAsset.textureKey)) {
      this.add
        .image(ship.x, ship.y + 18, heroShipAsset.textureKey)
        .setOrigin(0.5, heroShipAsset.originY)
        .setDisplaySize(heroShipAsset.displayWidth, heroShipAsset.displayHeight)
        .setDepth(7);
    }
  }
}
