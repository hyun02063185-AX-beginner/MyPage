import Phaser from "phaser";

export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 576;
export const LOGICAL_UNIT = 32;
export const WORLD_WIDTH = 2048;
export const WORLD_HEIGHT = 1280;
export const PLAYER_SPEED = 200;
export const CAMERA_LERP_X = 0.15;
export const CAMERA_LERP_Y = 0.15;

const MOVEMENT_KEY_CODES = [
  Phaser.Input.Keyboard.KeyCodes.W,
  Phaser.Input.Keyboard.KeyCodes.A,
  Phaser.Input.Keyboard.KeyCodes.S,
  Phaser.Input.Keyboard.KeyCodes.D,
  Phaser.Input.Keyboard.KeyCodes.UP,
  Phaser.Input.Keyboard.KeyCodes.DOWN,
  Phaser.Input.Keyboard.KeyCodes.LEFT,
  Phaser.Input.Keyboard.KeyCodes.RIGHT,
];

/** Shared Phaser configuration; internal resolution deliberately stays fixed. */
export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "portfolio-world-root",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#122033",
  pixelArt: true,
  roundPixels: true,
  input: {
    keyboard: {
      // Phaser's supported prevent-default capture prevents movement keys scrolling the page.
      capture: MOVEMENT_KEY_CODES,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
};
