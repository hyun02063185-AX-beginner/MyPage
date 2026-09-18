import type { HarborVisualPlacement, WorldRect } from "./worldTypes";

export function createWaterCollisionRects(
  waterVisuals: readonly HarborVisualPlacement[],
  walkableDocks: readonly HarborVisualPlacement[],
): WorldRect[];

export function rectsOverlap(first: WorldRect, second: WorldRect): boolean;
