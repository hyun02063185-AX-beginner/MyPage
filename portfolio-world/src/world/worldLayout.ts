import { WORLD_HEIGHT, WORLD_WIDTH } from "../config/gameConfig";
import { validateWorldLayout } from "./layoutValidation.mjs";
import rawWorldLayout from "./worldLayoutData.json";
import type {
  BuildingFootprint,
  HarborVisualPlacement,
  ReservedLot,
  WorldLayout,
  WorldPath,
  WorldRect,
  WorldZone,
  WorldZoneId,
} from "./worldTypes";

type RawLayout = Readonly<{
  playerSpawn: Readonly<{ x: number; y: number }>;
  zones: readonly WorldZone[];
  paths: readonly WorldPath[];
  forecourts: readonly WorldPath[];
  harborVisuals: readonly HarborVisualPlacement[];
  reservedLots: readonly ReservedLot[];
  edgeDecorations: readonly WorldRect[];
}>;

const layoutData = rawWorldLayout as unknown as RawLayout;
const centralPlaza = layoutData.zones.find((zone) => zone.id === "plaza");

if (!centralPlaza) {
  throw new Error("World layout requires a Central Plaza");
}

const buildings = layoutData.zones
  .filter((zone): zone is Exclude<WorldZone, { id: "plaza" }> => zone.id !== "plaza")
  .map((zone) => ({ ...zone, collidable: true as const }));

const layout: WorldLayout = {
  ...layoutData,
  centralPlaza,
  buildings: buildings as readonly BuildingFootprint[],
};

validateWorldLayout(layoutData, { worldWidth: WORLD_WIDTH, worldHeight: WORLD_HEIGHT });

/** Project-owned spatial data; Tiled and URL/content payloads remain deferred. */
export const WORLD_LAYOUT = layout;

export type { HarborVisualPlacement, ReservedLot, WorldZone, WorldZoneId } from "./worldTypes";
