import Phaser from "phaser";
import {
  CAMERA_LERP_X,
  CAMERA_LERP_Y,
  LOGICAL_UNIT,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/gameConfig";
import { Player } from "../player/Player";
import { LANDMARK_CATALOG } from "../world/landmarkCatalog";
import { WORLD_LAYOUT } from "../world/worldLayout";
import type { BuildingFootprint, LandmarkPlacement, WorldPath, WorldZone } from "../world/worldTypes";

type MovementKeys = Record<
  "up" | "down" | "left" | "right" | "w" | "a" | "s" | "d",
  Phaser.Input.Keyboard.Key
>;

const COLORS = {
  ground: 0x183047,
  grid: 0x23435b,
  plaza: 0x2a5570,
  path: 0x3d7084,
  forecourt: 0x5b8393,
  building: 0x203b54,
  buildingStroke: 0xf5c96a,
  edge: 0x254d44,
  tree: 0x45765f,
  bench: 0xc89b63,
  sign: 0xe5edf5,
  water: 0x287da0,
  planter: 0x5b8f66,
  marker: 0xf5c96a,
  collisionStroke: 0xffffff,
  label: "#e7eef8",
} as const;

/** Composes project-owned layout data, placeholder environment, collision, and camera. */
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
      ...WORLD_LAYOUT.landmarks.filter((landmark) => landmark.collidable),
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
  }

  private renderWorld(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.ground).fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    graphics.lineStyle(1, COLORS.grid, 0.45);

    for (let x = 0; x <= WORLD_WIDTH; x += LOGICAL_UNIT) {
      graphics.lineBetween(x, 0, x, WORLD_HEIGHT);
    }
    for (let y = 0; y <= WORLD_HEIGHT; y += LOGICAL_UNIT) {
      graphics.lineBetween(0, y, WORLD_WIDTH, y);
    }

    this.drawEdgeTreatment(graphics);
    for (const path of WORLD_LAYOUT.paths) {
      this.drawPath(path, COLORS.path);
    }
    for (const forecourt of WORLD_LAYOUT.forecourts) {
      this.drawPath(forecourt, COLORS.forecourt);
    }
    this.drawPlaza(WORLD_LAYOUT.centralPlaza);
    for (const building of WORLD_LAYOUT.buildings) {
      this.drawBuilding(building);
    }
    for (const landmark of WORLD_LAYOUT.landmarks) {
      this.drawLandmark(landmark);
    }
  }

  private drawEdgeTreatment(graphics: Phaser.GameObjects.Graphics): void {
    for (const edge of WORLD_LAYOUT.edgeDecorations) {
      graphics.fillStyle(COLORS.edge, 0.95).fillRect(
        edge.x - edge.width / 2,
        edge.y - edge.height / 2,
        edge.width,
        edge.height,
      );
      graphics.lineStyle(3, COLORS.tree, 0.9).lineBetween(
        edge.x - edge.width / 2,
        edge.y - edge.height / 2,
        edge.x + edge.width / 2,
        edge.y + edge.height / 2,
      );
    }
  }

  private drawPath(path: WorldPath, color: number): void {
    this.add
      .rectangle(path.x, path.y, path.width, path.height, color)
      .setStrokeStyle(2, COLORS.grid)
      .setDepth(1);
  }

  private drawPlaza(plaza: WorldZone): void {
    this.add
      .rectangle(plaza.x, plaza.y, plaza.width, plaza.height, COLORS.plaza)
      .setStrokeStyle(3, COLORS.buildingStroke)
      .setDepth(2);
    this.add
      .text(plaza.x, plaza.y - plaza.height / 2 + 24, plaza.label, {
        color: COLORS.label,
        fontFamily: "monospace",
        fontSize: "18px",
      })
      .setOrigin(0.5)
      .setDepth(5);
  }

  /** Solid fill and heavy outline identify the full rectangular Arcade collider. */
  private drawBuilding(building: BuildingFootprint): void {
    this.add
      .rectangle(building.x, building.y, building.width, building.height, COLORS.building)
      .setStrokeStyle(4, COLORS.buildingStroke)
      .setDepth(3);
    const graphics = this.add.graphics().setDepth(4);
    const left = building.x - building.width / 2;
    const top = building.y - building.height / 2;

    switch (building.id) {
      case "lecture":
        graphics.lineStyle(4, COLORS.buildingStroke).strokeTriangle(left + 24, top + 28, building.x, top + 8, left + building.width - 24, top + 28);
        break;
      case "career":
        graphics.fillStyle(COLORS.buildingStroke).fillRect(left + 24, top + 28, 12, 72);
        graphics.fillStyle(COLORS.buildingStroke).fillRect(left + 52, top + 20, 12, 80);
        graphics.fillStyle(COLORS.buildingStroke).fillRect(left + 80, top + 36, 12, 64);
        break;
      case "ai-lab":
        graphics.lineStyle(3, COLORS.buildingStroke).strokeCircle(building.x, building.y, 26);
        graphics.fillStyle(COLORS.buildingStroke).fillCircle(building.x, building.y, 6);
        break;
      case "gallery":
        graphics.lineStyle(4, COLORS.buildingStroke).strokeRect(left + 24, top + 24, 48, 48);
        graphics.lineStyle(4, COLORS.buildingStroke).strokeRect(left + building.width - 72, top + 24, 48, 48);
        break;
    }
    this.add
      .text(building.x, building.y + building.height / 2 - 20, building.label, {
        align: "center",
        color: COLORS.label,
        fontFamily: "monospace",
        fontSize: "14px",
        wordWrap: { width: building.width - LOGICAL_UNIT },
      })
      .setOrigin(0.5);
  }

  private drawLandmark(landmark: LandmarkPlacement): void {
    const graphics = this.add.graphics().setDepth(6);
    const left = landmark.x - landmark.width / 2;
    const top = landmark.y - landmark.height / 2;

    switch (landmark.type) {
      case "tree-grove":
        graphics.fillStyle(COLORS.tree).fillCircle(landmark.x - 14, landmark.y + 6, 16);
        graphics.fillStyle(COLORS.tree).fillCircle(landmark.x + 12, landmark.y - 8, 18);
        break;
      case "bench-cluster":
        graphics.fillStyle(COLORS.bench).fillRect(left, landmark.y - 4, landmark.width, 8);
        graphics.lineStyle(3, COLORS.bench).lineBetween(left + 8, landmark.y + 4, left + 8, top + landmark.height);
        graphics.lineStyle(3, COLORS.bench).lineBetween(left + landmark.width - 8, landmark.y + 4, left + landmark.width - 8, top + landmark.height);
        break;
      case "wayfinding-sign":
        graphics.lineStyle(4, COLORS.sign).lineBetween(landmark.x, top, landmark.x, top + landmark.height);
        graphics.fillStyle(COLORS.sign).fillTriangle(landmark.x, top + 8, left, top + 20, landmark.x, top + 32);
        break;
      case "plaza-marker":
        graphics.lineStyle(4, COLORS.marker).strokeCircle(landmark.x, landmark.y, 22);
        graphics.lineStyle(3, COLORS.marker).lineBetween(left + 8, landmark.y, left + landmark.width - 8, landmark.y);
        break;
      case "water-feature":
        graphics.fillStyle(COLORS.water).fillRect(left, top, landmark.width, landmark.height);
        graphics.lineStyle(2, COLORS.sign).lineBetween(left + 12, landmark.y - 10, left + landmark.width - 12, landmark.y - 10);
        graphics.lineStyle(2, COLORS.sign).lineBetween(left + 12, landmark.y + 10, left + landmark.width - 12, landmark.y + 10);
        break;
      case "planter":
        graphics.fillStyle(COLORS.planter).fillRect(left, top, landmark.width, landmark.height);
        graphics.fillStyle(COLORS.tree).fillCircle(landmark.x, landmark.y, 18);
        break;
    }

    if (landmark.collidable) {
      graphics.lineStyle(4, COLORS.collisionStroke).strokeRect(left, top, landmark.width, landmark.height);
      graphics.lineStyle(2, COLORS.collisionStroke, 0.8).lineBetween(left + 8, top + 8, left + landmark.width - 8, top + landmark.height - 8);
    }
    this.add
      .text(landmark.x, top - 12, LANDMARK_CATALOG[landmark.type].label, {
        color: COLORS.label,
        fontFamily: "monospace",
        fontSize: "11px",
      })
      .setOrigin(0.5)
      .setDepth(7);
  }
}
