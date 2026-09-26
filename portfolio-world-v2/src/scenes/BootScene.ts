import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  public constructor() {
    super("BootScene");
  }

  public preload(): void {
    // R3A's only production asset. Keep placeholders as native Graphics until their own art passes.
    this.load.image("hero-ship-r3a", "assets/world/ships/hero/hero-ship-r3a.png");
  }

  public create(): void {
    this.scene.start("WorldScene");
  }
}
