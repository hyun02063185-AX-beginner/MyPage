import Phaser from "phaser";
import { GAME_CONFIG } from "./config/gameConfig";
import { BootScene } from "./scenes/BootScene";
import { WorldScene } from "./scenes/WorldScene";
import { CanonicalRuntimeR1Scene } from "./scenes/CanonicalRuntimeR1Scene";
import { CanonicalRuntimeR2Scene } from "./scenes/CanonicalRuntimeR2Scene";
import "./world.css";

const canonical = new URLSearchParams(window.location.search).get("canonical");
new Phaser.Game({
  ...GAME_CONFIG,
  ...(canonical ? { type: Phaser.CANVAS, width: 1280, height: 720, scale: { ...GAME_CONFIG.scale, width: 1280, height: 720 } } : {}),
  scene: [BootScene, WorldScene, CanonicalRuntimeR1Scene, CanonicalRuntimeR2Scene],
});
