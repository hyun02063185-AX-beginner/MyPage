import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  public constructor() {
    super("BootScene");
  }

  public preload(): void {
    // R3A.1's only production asset. Keep placeholders as native Graphics until their own art passes.
    this.load.image("hero-ship-r3a1", "assets/world/ships/hero/hero-ship-r3a1.png");
  }

  public create(): void {
    this.scene.start("WorldScene");
  }
}
