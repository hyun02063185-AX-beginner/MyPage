import Phaser from "phaser";
import { GAME_CONFIG } from "./config";
import { BootScene } from "./scenes/BootScene";
import { WorldScene } from "./scenes/WorldScene";
import "./style.css";

declare global {
  interface Window {
    __PORTFOLIO_WORLD_V2_QA__?: {
      activeScene: string;
      projection: string;
      qaState: string;
      camera: { x: number; y: number; zoom: number };
      player: { x: number; y: number };
    };
  }
}

new Phaser.Game({
  ...GAME_CONFIG,
  scene: [BootScene, WorldScene],
});
