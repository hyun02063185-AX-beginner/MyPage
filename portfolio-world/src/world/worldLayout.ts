import { LOGICAL_UNIT, WORLD_HEIGHT, WORLD_WIDTH } from "../config/gameConfig";

export type WorldZone = Readonly<{
  id: "plaza" | "lecture" | "career" | "ai-lab" | "gallery";
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}>;

const PLAZA_WIDTH = LOGICAL_UNIT * 14;
const PLAZA_HEIGHT = LOGICAL_UNIT * 9;

const centralPlaza: WorldZone = {
  id: "plaza",
  label: "Central Plaza",
  x: WORLD_WIDTH / 2,
  y: WORLD_HEIGHT / 2,
  width: PLAZA_WIDTH,
  height: PLAZA_HEIGHT,
};

/** Directional prototype data only: no URLs, handlers, collision, or Tiled map. */
export const WORLD_LAYOUT = {
  centralPlaza,
  playerSpawn: {
    x: centralPlaza.x,
    y: centralPlaza.y + centralPlaza.height / 2 + LOGICAL_UNIT * 2,
  },
  zones: [
    centralPlaza,
    {
      id: "lecture",
      label: "North · Future Lecture",
      x: WORLD_WIDTH / 2,
      y: LOGICAL_UNIT * 5,
      width: LOGICAL_UNIT * 8,
      height: LOGICAL_UNIT * 4,
    },
    {
      id: "career",
      label: "West · Future Career",
      x: LOGICAL_UNIT * 7,
      y: WORLD_HEIGHT / 2,
      width: LOGICAL_UNIT * 8,
      height: LOGICAL_UNIT * 4,
    },
    {
      id: "ai-lab",
      label: "East · Future AI Lab",
      x: WORLD_WIDTH - LOGICAL_UNIT * 7,
      y: WORLD_HEIGHT / 2,
      width: LOGICAL_UNIT * 8,
      height: LOGICAL_UNIT * 4,
    },
    {
      id: "gallery",
      label: "South · Future Gallery",
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT - LOGICAL_UNIT * 5,
      width: LOGICAL_UNIT * 8,
      height: LOGICAL_UNIT * 4,
    },
  ] as const satisfies readonly WorldZone[],
} as const;
