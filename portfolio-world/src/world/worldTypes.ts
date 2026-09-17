export type WorldZoneId = "plaza" | "lecture" | "career" | "ai-lab" | "gallery";

export type LandmarkType =
  | "tree-grove"
  | "bench-cluster"
  | "wayfinding-sign"
  | "plaza-marker"
  | "water-feature"
  | "planter";

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

export type LandmarkPlacement = WorldRect &
  Readonly<{
    type: LandmarkType;
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
  landmarks: readonly LandmarkPlacement[];
  edgeDecorations: readonly WorldRect[];
}>;
