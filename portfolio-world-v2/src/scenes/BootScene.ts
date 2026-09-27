import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  public constructor() {
    super("BootScene");
  }

  public preload(): void {
    // R3A.1 and the R4.1 interaction targets are the only preloaded visual assets in this isolated v2 slice.
    this.load.image("hero-ship-r3a1", "assets/world/ships/hero/hero-ship-r3a1.png");
    this.load.image("golden-master-r4", "assets/world/reference/golden-master-r4.jpg");
    this.load.image("harbor-player-r4-1", "assets/world/r4-1/harbor-player-r4-1.png");
    this.load.image("harbor-player-r4-2-muted", "assets/world/r4-2/harbor-player-r4-2-muted.png");
    this.load.image("harbor-cargo-occluder-r4-1", "assets/world/r4-1/harbor-cargo-occluder-r4-1.png");
  }

  public create(): void {
    this.scene.start("WorldScene");
  }
}
