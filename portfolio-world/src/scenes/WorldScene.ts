import Phaser from "phaser";

/** Minimal visual confirmation that Phaser, TypeScript, and Vite are running. */
export class WorldScene extends Phaser.Scene {
  public constructor() {
    super("WorldScene");
  }

  public create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, "Portfolio World\nRuntime Foundation", {
        align: "center",
        color: "#e5e7eb",
        fontFamily: "system-ui, sans-serif",
        fontSize: "32px",
        lineSpacing: 12,
      })
      .setOrigin(0.5);
  }
}
