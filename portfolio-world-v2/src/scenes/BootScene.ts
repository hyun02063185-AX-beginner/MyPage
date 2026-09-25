import Phaser from "phaser";

/** The blockout intentionally registers no image assets: all geometry is native Phaser Graphics. */
export class BootScene extends Phaser.Scene {
  public constructor() {
    super("BootScene");
  }

  public create(): void {
    this.scene.start("WorldScene");
  }
}
