import Phaser from "phaser";
import { GAME_CONFIG } from "./config/gameConfig";
import { BootScene } from "./scenes/BootScene";
import { WorldScene } from "./scenes/WorldScene";
import { CanonicalRuntimeR1Scene } from "./scenes/CanonicalRuntimeR1Scene";
import "./world.css";

const canonical = new URLSearchParams(window.location.search).get("canonical") === "1";
new Phaser.Game({
  ...GAME_CONFIG,
  ...(canonical ? { width: 1280, height: 720, scale: { ...GAME_CONFIG.scale, width: 1280, height: 720 } } : {}),
  scene: [BootScene, WorldScene, CanonicalRuntimeR1Scene],
});
