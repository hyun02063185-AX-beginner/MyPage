import type { BuildingFootprint } from "./worldTypes";

/**
 * Visual-only offsets break the former cardinal cross without moving the
 * established destination footprints, routes, collision, or IA mapping.
 */
export const MAJOR_BUILDING_VISUAL_OFFSETS = {
  career: { x: -28, y: -8 },
  lecture: { x: 28, y: -8 },
  "ai-lab": { x: -32, y: 8 },
  gallery: { x: 24, y: 8 },
} as const;

export type NaturalizedBuilding = BuildingFootprint & {
  visualOffset: Readonly<{ x: number; y: number }>;
};

/** The returned copy is for rendering/depth only; semantic footprint data is immutable. */
export function getNaturalizedBuilding(building: BuildingFootprint): NaturalizedBuilding {
  const visualOffset = MAJOR_BUILDING_VISUAL_OFFSETS[
    building.id as keyof typeof MAJOR_BUILDING_VISUAL_OFFSETS
  ] ?? { x: 0, y: 0 };

  return {
    ...building,
    x: building.x + visualOffset.x,
    y: building.y + visualOffset.y,
    visualOffset,
  };
}

/** Door-review positions follow the visual façade while retaining collision geometry. */
export const NATURALIZED_SCALE_REVIEW_SPAWNS = {
  guild: { x: 196, y: 632 },
  academy: { x: 1052, y: 216 },
  workshop: { x: 1792, y: 632 },
  exhibition: { x: 1048, y: 1048 },
} as const;
