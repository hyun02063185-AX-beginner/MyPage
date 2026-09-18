export type WorldZoneId = "plaza" | "lecture" | "career" | "ai-lab" | "gallery";

export type HarborVisualType =
  | "navigation-monument"
  | "planter"
  | "bench"
  | "lamp"
  | "harbor-sign"
  | "crate"
  | "barrel"
  | "dock"
  | "water"
  | "small-boat";

export type HarborVisualTier = "primary" | "secondary" | "detail";

export type PlacementZone = WorldZoneId | "path";

export type WorldRect = Readonly<{
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type WorldZone = WorldRect &
  Readonly<{
    id: WorldZoneId;
    label: string;
  }>;

export type HarborVisualPlacement = WorldRect &
  Readonly<{
    type: HarborVisualType;
    tier: HarborVisualTier;
    collidable: boolean;
    zone: PlacementZone;
  }>;

export type BuildingFootprint = WorldZone &
  Readonly<{
    collidable: true;
  }>;

export type WorldPath = WorldRect &
  Readonly<{
    label: string;
  }>;

export type WorldLayout = Readonly<{
  centralPlaza: WorldZone;
  playerSpawn: Readonly<{ x: number; y: number }>;
  zones: readonly WorldZone[];
  buildings: readonly BuildingFootprint[];
  paths: readonly WorldPath[];
  forecourts: readonly WorldPath[];
  harborVisuals: readonly HarborVisualPlacement[];
  edgeDecorations: readonly WorldRect[];
}>;
