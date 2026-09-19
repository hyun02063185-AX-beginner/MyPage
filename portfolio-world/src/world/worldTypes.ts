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
  | "small-boat"
  | "secondary-sailing-ship"
  | "market-kiosk"
  | "notice-board"
  | "route-map"
  | "registry-stand"
  | "flag"
  | "study-garden"
  | "academic-sign"
  | "banner"
  | "tree"
  | "worktable"
  | "tool-rack"
  | "cart"
  | "timber-stack"
  | "display-board"
  | "viewing-terrace"
  | "large-ship"
  | "warehouse"
  | "cargo-shed";

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
    /** Dock footprints that remain visually water-adjacent but are player-walkable. */
    walkable?: boolean;
    zone: PlacementZone;
  }>;

/** Internal future-capacity parcel; intentionally has no end-user presentation label. */
export type ReservedLot = WorldRect &
  Readonly<{
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
  waterCollisionRects: readonly WorldRect[];
  reservedLots: readonly ReservedLot[];
  edgeDecorations: readonly WorldRect[];
}>;
