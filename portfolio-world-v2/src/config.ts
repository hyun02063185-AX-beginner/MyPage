import Phaser from "phaser";

export const VIEWPORT_WIDTH = 1280;
export const VIEWPORT_HEIGHT = 720;
export const WORLD_WIDTH = 2600;
export const WORLD_HEIGHT = 1600;
export const PLAYER_SPEED = 270;

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "portfolio-world-root",
  width: VIEWPORT_WIDTH,
  height: VIEWPORT_HEIGHT,
  backgroundColor: "#172b37",
  antialias: true,
  roundPixels: true,
  banner: false,
  input: {
    keyboard: {
      capture: [
        Phaser.Input.Keyboard.KeyCodes.W,
        Phaser.Input.Keyboard.KeyCodes.A,
        Phaser.Input.Keyboard.KeyCodes.S,
        Phaser.Input.Keyboard.KeyCodes.D,
        Phaser.Input.Keyboard.KeyCodes.UP,
        Phaser.Input.Keyboard.KeyCodes.DOWN,
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.RIGHT,
      ],
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
  },
};
