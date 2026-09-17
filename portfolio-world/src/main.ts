import Phaser from "phaser";
import { GAME_CONFIG } from "./config/gameConfig";
import { BootScene } from "./scenes/BootScene";
import { WorldScene } from "./scenes/WorldScene";
import "./world.css";

new Phaser.Game({
  ...GAME_CONFIG,
  scene: [BootScene, WorldScene],
});
