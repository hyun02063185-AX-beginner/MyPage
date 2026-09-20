import { WORLD_HEIGHT, WORLD_WIDTH } from "../config/gameConfig";
import { validateWorldLayout } from "./layoutValidation.mjs";
import { assertTownTranslation, translateTownLayout } from "./layoutTransform.mjs";
import { createWaterCollisionRects } from "./waterCollisionGeometry.mjs";
import rawWorldLayout from "./worldLayoutData.json";
import { BERTHING_SLOTS } from "./berthingSlots";
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

const sourceLayoutData = rawWorldLayout as unknown as RawLayout;
const translatedLayoutData = translateTownLayout(sourceLayoutData, {
  worldHeight: WORLD_HEIGHT,
}) as RawLayout;
const berthByVessel = new Map(BERTHING_SLOTS.filter((slot) => slot.assignedVesselId).map((slot) => [slot.assignedVesselId, slot]));
const layoutData = {
  ...translatedLayoutData,
  harborVisuals: translatedLayoutData.harborVisuals.map((visual) => {
    const berth = berthByVessel.get(visual.id);
    return berth ? { ...visual, x: berth.x, y: berth.y - 96 } : visual;
  }),
} as RawLayout;
assertTownTranslation(sourceLayoutData, translatedLayoutData, { worldHeight: WORLD_HEIGHT });
const centralPlaza = layoutData.zones.find((zone) => zone.id === "plaza");

if (!centralPlaza) {
  throw new Error("World layout requires a Central Plaza");
}

const buildings = layoutData.zones
  .filter((zone): zone is Exclude<WorldZone, { id: "plaza" }> => zone.id !== "plaza")
  .map((zone) => ({ ...zone, collidable: true as const }));
const waterCollisionRects = createWaterCollisionRects(
  layoutData.harborVisuals.filter((visual) => visual.type === "water"),
  layoutData.harborVisuals.filter((visual) => visual.type === "dock" && visual.walkable),
);

const layout: WorldLayout = {
  ...layoutData,
  centralPlaza,
  buildings: buildings as readonly BuildingFootprint[],
  waterCollisionRects,
};

validateWorldLayout(layoutData, { worldWidth: WORLD_WIDTH, worldHeight: WORLD_HEIGHT });

/** Project-owned spatial data; Tiled and URL/content payloads remain deferred. */
export const WORLD_LAYOUT = layout;

export type { HarborVisualPlacement, ReservedLot, WorldZone, WorldZoneId } from "./worldTypes";
