import Phaser from "phaser";
import {
  CAMERA_LERP_X,
  CAMERA_LERP_Y,
  LOGICAL_UNIT,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/gameConfig";
import { Player } from "../player/Player";
import { WORLD_LAYOUT, type WorldZone } from "../world/worldLayout";

type MovementKeys = Record<
  "up" | "down" | "left" | "right" | "w" | "a" | "s" | "d",
  Phaser.Input.Keyboard.Key
>;

const COLORS = {
  ground: 0x183047,
  grid: 0x23435b,
  plaza: 0x2a5570,
  path: 0x3d7084,
  landmark: 0xf5c96a,
  zone: 0x203b54,
  zoneStroke: 0x7fb1c7,
  label: "#e7eef8",
} as const;

/** Composes layout data, placeholder world visuals, player, and camera. */
export class WorldScene extends Phaser.Scene {
  private player?: Player;
  private movementKeys?: MovementKeys;

  public constructor() {
    super("WorldScene");
  }

  public create(): void {
    this.renderWorld();
    this.createPlayer();
    this.configureCamera();
    this.game.events.on(Phaser.Core.Events.BLUR, this.resetMovementKeys, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.disposeInput, this);
  }

  public update(_time: number, deltaMs: number): void {
    if (!this.player || !this.movementKeys) {
      return;
    }

    this.player.update(deltaMs, {
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

  /** Phaser emits this on browser/game blur; reset prevents a held key sticking. */
  private resetMovementKeys(): void {
    this.input.keyboard?.resetKeys();
  }

  private disposeInput(): void {
    this.game.events.off(Phaser.Core.Events.BLUR, this.resetMovementKeys, this);
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
    graphics.lineStyle(1, COLORS.grid, 0.6);

    for (let x = 0; x <= WORLD_WIDTH; x += LOGICAL_UNIT) {
      graphics.lineBetween(x, 0, x, WORLD_HEIGHT);
    }
    for (let y = 0; y <= WORLD_HEIGHT; y += LOGICAL_UNIT) {
      graphics.lineBetween(0, y, WORLD_WIDTH, y);
    }

    const plaza = WORLD_LAYOUT.centralPlaza;
    graphics.fillStyle(COLORS.path).fillRect(
      plaza.x - LOGICAL_UNIT,
      LOGICAL_UNIT * 9,
      LOGICAL_UNIT * 2,
      WORLD_HEIGHT - LOGICAL_UNIT * 18,
    );
    graphics.fillStyle(COLORS.path).fillRect(
      LOGICAL_UNIT * 11,
      plaza.y - LOGICAL_UNIT,
      WORLD_WIDTH - LOGICAL_UNIT * 22,
      LOGICAL_UNIT * 2,
    );

    this.drawZone(plaza, COLORS.plaza, COLORS.zoneStroke);
    for (const zone of WORLD_LAYOUT.zones) {
      if (zone.id !== "plaza") {
        this.drawZone(zone, COLORS.zone, COLORS.zoneStroke);
      }
    }

    graphics.fillStyle(COLORS.landmark).fillRect(
      plaza.x - LOGICAL_UNIT,
      plaza.y - LOGICAL_UNIT,
      LOGICAL_UNIT * 2,
      LOGICAL_UNIT * 2,
    );
    this.add
      .text(plaza.x, plaza.y - LOGICAL_UNIT * 2, "Central landmark", {
        color: COLORS.label,
        fontFamily: "monospace",
        fontSize: "16px",
      })
      .setOrigin(0.5);
  }

  private drawZone(zone: WorldZone, fillColor: number, strokeColor: number): void {
    this.add
      .rectangle(zone.x, zone.y, zone.width, zone.height, fillColor)
      .setStrokeStyle(2, strokeColor);
    this.add
      .text(zone.x, zone.y, zone.label, {
        align: "center",
        color: COLORS.label,
        fontFamily: "monospace",
        fontSize: "16px",
        wordWrap: { width: zone.width - LOGICAL_UNIT },
      })
      .setOrigin(0.5);
  }
}
