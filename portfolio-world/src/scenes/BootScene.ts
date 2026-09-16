import Phaser from "phaser";

/**
 * Placeholder startup scene. Asset loading is intentionally deferred from the
 * runtime foundation sprint; it only proves scene-to-scene startup works.
 */
export class BootScene extends Phaser.Scene {
  public constructor() {
    super("BootScene");
  }

  public create(): void {
    this.scene.start("WorldScene");
  }
}
