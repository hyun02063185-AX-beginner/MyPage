import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { WorldScene } from "./scenes/WorldScene";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "portfolio-world-root",
  width: 960,
  height: 540,
  backgroundColor: "#111827",
  scene: [BootScene, WorldScene],
});
