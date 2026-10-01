import Phaser from "phaser";
import { GAME_CONFIG } from "./config";
import { BootScene } from "./scenes/BootScene";
import { WorldScene } from "./scenes/WorldScene";
import { GrayboxScene } from "./scenes/GrayboxScene";
import "./style.css";

declare global {
  interface Window {
    __PORTFOLIO_WORLD_V2_QA__?: {
      activeScene: string;
      projection: string;
      qaState: string;
      camera: { x: number; y: number; zoom: number };
      player: { x: number; y: number };
      hotspotActive: boolean;
      activeHotspotId: "square" | "gallery" | "career" | null;
      activeDestination: string | null;
      debug: boolean;
      hotspots: Array<{ id: "square" | "gallery" | "career"; destination: string; reachable: boolean }>;
      walkability: { harborSquareToHall: boolean; hallToHeroQuay: boolean; heroShipApproach: boolean };
    };
    __PORTFOLIO_WORLD_V2_GRAYBOX_QA__?: {
      activeScene: "GrayboxScene";
      qaState: string;
      player: { x: number; y: number; facing: "up" | "down" | "left" | "right"; animation: string; moving: boolean };
      camera: { x: number; y: number; zoom: number; deadzone: { width: number; height: number } };
      routes: { plazaToHall: boolean; plazaToStairs: boolean; stairsToQuay: boolean; quayToWorkshop: boolean; quayToGangway: boolean };
      collisions: { buildingFootprints: boolean; waterBoundaries: boolean; railings: boolean; shipExclusion: boolean };
    };
  }
}

new Phaser.Game({
  ...GAME_CONFIG,
  scene: [BootScene, WorldScene, GrayboxScene],
});
