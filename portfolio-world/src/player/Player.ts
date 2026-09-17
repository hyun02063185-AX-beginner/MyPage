import Phaser from "phaser";
import { PLAYER_SPEED, WORLD_HEIGHT, WORLD_WIDTH } from "../config/gameConfig";
import { getMovementDelta, type MovementInput } from "./movement";

export const PLAYER_WIDTH = 24;
export const PLAYER_HEIGHT = 32;

/** Programmatic placeholder player with manual world-boundary clamping. */
export class Player {
  public readonly gameObject: Phaser.GameObjects.Container;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    const body = scene.add
      .rectangle(0, 0, PLAYER_WIDTH, PLAYER_HEIGHT, 0xf5c96a)
      .setStrokeStyle(2, 0x28384d);
    const face = scene.add.rectangle(
      0,
      -PLAYER_HEIGHT / 4,
      PLAYER_WIDTH / 3,
      PLAYER_HEIGHT / 6,
      0x28384d,
    );

    this.gameObject = scene.add
      .container(x, y, [body, face])
      .setDepth(11);
  }

  public update(deltaMs: number, input: MovementInput): void {
    const delta = getMovementDelta(input, PLAYER_SPEED, deltaMs);
    const halfWidth = PLAYER_WIDTH / 2;
    const halfHeight = PLAYER_HEIGHT / 2;

    this.gameObject.x = Phaser.Math.Clamp(
      this.gameObject.x + delta.x,
      halfWidth,
      WORLD_WIDTH - halfWidth,
    );
    this.gameObject.y = Phaser.Math.Clamp(
      this.gameObject.y + delta.y,
      halfHeight,
      WORLD_HEIGHT - halfHeight,
    );
  }
}
