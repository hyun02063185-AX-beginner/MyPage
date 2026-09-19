import Phaser from "phaser";
import { PLAYER_SPEED, WORLD_HEIGHT, WORLD_WIDTH } from "../config/gameConfig";
import { getPlayerDepth } from "../world/worldDepth.mjs";
import { getMovementDirection, type MovementInput } from "./movement";

export const PLAYER_WIDTH = 24;
export const PLAYER_HEIGHT = 32;

type RectangleWithArcadeBody = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

/** Programmatic player with Arcade object collision and manual world-edge clamping. */
export class Player {
  public readonly gameObject: Phaser.GameObjects.Rectangle;
  private readonly body: Phaser.Physics.Arcade.Body;
  private readonly face: Phaser.GameObjects.Rectangle;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    this.gameObject = scene.add
      .rectangle(x, y, PLAYER_WIDTH, PLAYER_HEIGHT, 0xf5c96a)
      .setStrokeStyle(2, 0x28384d);
    this.face = scene.add
      .rectangle(
      x,
      y - PLAYER_HEIGHT / 4,
      PLAYER_WIDTH / 3,
      PLAYER_HEIGHT / 6,
      0x28384d,
      );

    scene.physics.add.existing(this.gameObject);
    this.body = (this.gameObject as RectangleWithArcadeBody).body;
    this.body.setAllowGravity(false).setSize(PLAYER_WIDTH, PLAYER_HEIGHT);
    this.syncVisualDepth();
  }

  /** Arcade integrates this fixed velocity with Phaser's frame delta. */
  public update(input: MovementInput): void {
    const direction = getMovementDirection(input);
    this.body.setVelocity(direction.x * PLAYER_SPEED, direction.y * PLAYER_SPEED);
  }

  public stop(): void {
    this.body.setVelocity(0, 0);
  }

  /** World bounds deliberately remain outside Arcade Physics authority. */
  public constrainToWorldBounds(): void {
    const halfWidth = PLAYER_WIDTH / 2;
    const halfHeight = PLAYER_HEIGHT / 2;
    const x = Phaser.Math.Clamp(this.gameObject.x, halfWidth, WORLD_WIDTH - halfWidth);
    const y = Phaser.Math.Clamp(this.gameObject.y, halfHeight, WORLD_HEIGHT - halfHeight);

    if (x !== this.gameObject.x || y !== this.gameObject.y) {
      this.gameObject.setPosition(x, y);
      this.body.updateFromGameObject();
    }
    this.face.setPosition(this.gameObject.x, this.gameObject.y - PLAYER_HEIGHT / 4);
    this.syncVisualDepth();
  }

  /** Two scalar updates per frame; no display-list rebuild or allocation is required. */
  private syncVisualDepth(): void {
    const depth = getPlayerDepth(this.gameObject.y + PLAYER_HEIGHT / 2);
    this.gameObject.setDepth(depth);
    this.face.setDepth(depth + 0.1);
  }
}
