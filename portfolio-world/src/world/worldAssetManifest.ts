/** First-slice production assets. Status terms intentionally mirror 07_ASSET_POLICY.md. */
export type WorldAssetStatus = "CONCEPT" | "APPROVED" | "GAME_READY" | "DEPRECATED";

export type WorldAsset = Readonly<{
  id: string;
  textureKey: string;
  path: string;
  role: string;
  sourceType: "generated-original";
  provenance: "generated-original";
  status: WorldAssetStatus;
  version: string;
  notes: string;
  sourceWidth: number;
  sourceHeight: number;
  displayWidth: number;
  displayHeight: number;
  originY: number;
  scaleFamily?: "PRIMARY_DESTINATION_PLAYER_DOOR_BUILDING_V1";
  scaleCalibration?: "reference-retained" | "door-chain-increased" | "door-chain-reduced" | "legacy-door-chain-increased" | "door-canonicalized";
}>;

/** Human-reviewed destination scale contract; collision remains independent. */
export const PRIMARY_DESTINATION_SCALE_FAMILY = {
  id: "PRIMARY_DESTINATION_PLAYER_DOOR_BUILDING_V1",
  playerWidth: 24,
  playerHeight: 32,
  doorWidthRatioRange: [1.65, 1.95],
  reference: "PLAYER -> OPENABLE MAIN DOOR -> BUILDING MASS",
} as const;

export type CalibrationAngle = 15 | 22.5 | 30;
export type CalibrationSubject = "heroShipD" | "exhibitionHall" | "warehouse";

export const WORLD_ASSETS = {
  heroShipA: {
    id: "hero-ship-a-v01",
    textureKey: "harbor-hero-ship-a-v01",
    path: "assets/world/harbor/ship/hero-ship-a-v01.png",
    role: "hero ship comparison candidate A — conservative",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "CONCEPT",
    version: "v01",
    notes: "Conservative hull and two-sail silhouette; approximately 1.15× perceived mockup envelope.",
    sourceWidth: 1448,
    sourceHeight: 1086,
    displayWidth: 360,
    displayHeight: 270,
    originY: 0.84,
  },
  heroShipB: {
    id: "hero-ship-b-v01",
    textureKey: "harbor-hero-ship-b-v01",
    path: "assets/world/harbor/ship/hero-ship-b-v01.png",
    role: "hero ship comparison candidate B — target",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "CONCEPT",
    version: "v01",
    notes: "Target long-hull, two-mast landmark silhouette; approximately 1.30× perceived mockup envelope.",
    sourceWidth: 1536,
    sourceHeight: 1024,
    displayWidth: 440,
    displayHeight: 293,
    originY: 0.84,
  },
  heroShipC: {
    id: "hero-ship-c-v01",
    textureKey: "harbor-hero-ship-c-v01",
    path: "assets/world/harbor/ship/hero-ship-c-v01.png",
    role: "hero ship comparison candidate C — bold",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "CONCEPT",
    version: "v01",
    notes: "Bold three-mast, broader-sail landmark silhouette; approximately 1.45× perceived mockup envelope.",
    sourceWidth: 1536,
    sourceHeight: 1024,
    displayWidth: 510,
    displayHeight: 340,
    originY: 0.84,
  },
  heroShipD: {
    id: "hero-ship-d-v01",
    textureKey: "harbor-hero-ship-d-v01",
    path: "assets/world/harbor/optimized/hero-ship-d-v01.png",
    role: "hero ship refinement candidate D — current review default",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v01",
    notes: "A-like visible envelope with C-like three-mast character; locked 1× runtime export. Source master remains non-loaded.",
    sourceWidth: 365,
    sourceHeight: 255,
    displayWidth: 365,
    displayHeight: 255,
    originY: 0.864,
  },
  secondaryBrig: {
    id: "secondary-brig-v01",
    textureKey: "harbor-secondary-brig-v01",
    path: "assets/world/harbor/optimized/secondary-brig-v01.png",
    role: "secondary two-mast merchant brig",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v01",
    notes: "Simpler two-mast working vessel; locked 1× runtime export, reused once with horizontal mirroring.",
    sourceWidth: 136,
    sourceHeight: 121,
    displayWidth: 136,
    displayHeight: 121,
    originY: 0.866,
  },
  secondarySchooner: {
    id: "secondary-schooner-v01",
    textureKey: "harbor-secondary-schooner-v01",
    path: "assets/world/harbor/ship/secondary-schooner-v01.png",
    role: "secondary two-mast cargo schooner",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "DEPRECATED",
    version: "v01",
    notes: "Superseded by the Batch 01 medium vessel; retained as non-loaded source evidence only.",
    sourceWidth: 1536,
    sourceHeight: 1024,
    displayWidth: 205,
    displayHeight: 137,
    originY: 0.84,
  },
  secondaryCutter: {
    id: "secondary-cutter-v01",
    textureKey: "harbor-secondary-cutter-v01",
    path: "assets/world/harbor/optimized/secondary-cutter-v01.png",
    role: "secondary one-mast harbor cutter",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v01",
    notes: "Compact one-mast working craft; locked 1× runtime export supports fleet hierarchy.",
    sourceWidth: 101,
    sourceHeight: 100,
    displayWidth: 101,
    displayHeight: 100,
    originY: 0.832,
  },
  exhibitionHall: {
    id: "exhibition-hall-v03",
    textureKey: "harbor-exhibition-hall-v03",
    path: "assets/world/harbor/buildings/exhibition-hall-v03.png",
    role: "waterfront Exhibition Hall production-style candidate",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v03",
    notes: "Door-canonicalized original art; the broad double-leaf entrance now follows the Guild Hall human-scale reference.",
    sourceWidth: 356,
    sourceHeight: 218,
    displayWidth: 356,
    displayHeight: 218,
    originY: 0.998,
    scaleFamily: "PRIMARY_DESTINATION_PLAYER_DOOR_BUILDING_V1",
    scaleCalibration: "door-canonicalized",
  },
  guildHall: {
    id: "guild-hall-v01",
    textureKey: "harbor-guild-hall-v01",
    path: "assets/world/harbor/buildings/guild-hall-v01.png",
    role: "Tier 1 Career destination building",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v01",
    notes: "Batch 01 1× export; 330×196 practical visible content; functional-base anchor.",
    sourceWidth: 338,
    sourceHeight: 204,
    displayWidth: 338,
    displayHeight: 204,
    originY: 0.98,
    scaleFamily: "PRIMARY_DESTINATION_PLAYER_DOOR_BUILDING_V1",
    scaleCalibration: "reference-retained",
  },
  academy: {
    id: "academy-v03",
    textureKey: "harbor-academy-v03",
    path: "assets/world/harbor/buildings/academy-v03.png",
    role: "Tier 1 Academy destination building",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v03",
    notes: "Door-canonicalized original art; the central double-leaf entrance now follows the Guild Hall human-scale reference.",
    sourceWidth: 370,
    sourceHeight: 216,
    displayWidth: 370,
    displayHeight: 216,
    originY: 0.985,
    scaleFamily: "PRIMARY_DESTINATION_PLAYER_DOOR_BUILDING_V1",
    scaleCalibration: "door-canonicalized",
  },
  workshop: {
    id: "workshop-v03",
    textureKey: "harbor-workshop-v03",
    path: "assets/world/harbor/buildings/workshop-v03.png",
    role: "Tier 1 Workshop destination building",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v03",
    notes: "Door-canonicalized original art replaces the oversized work bay with a Guild Hall-scale central double-leaf entrance.",
    sourceWidth: 291,
    sourceHeight: 170,
    displayWidth: 291,
    displayHeight: 170,
    originY: 0.982,
    scaleFamily: "PRIMARY_DESTINATION_PLAYER_DOOR_BUILDING_V1",
    scaleCalibration: "door-canonicalized",
  },
  harborWarehouse: {
    id: "harbor-warehouse-v01",
    textureKey: "harbor-warehouse-v01",
    path: "assets/world/harbor/buildings/harbor-warehouse-v01.png",
    role: "Tier 2 harbor warehouse support building",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v01",
    notes: "Batch 01 1× export; 160×92 practical visible content; functional-base anchor.",
    sourceWidth: 168,
    sourceHeight: 100,
    displayWidth: 168,
    displayHeight: 100,
    originY: 0.96,
  },
  mediumSailingVessel: {
    id: "medium-sailing-vessel-01-v01",
    textureKey: "harbor-medium-sailing-vessel-01-v01",
    path: "assets/world/harbor/ship/medium-sailing-vessel-01-v01.png",
    role: "Tier 2 two-mast medium sailing vessel reference",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v01",
    notes: "Batch 01 1× export; 160×113 practical visible content; hull/waterline anchor.",
    sourceWidth: 168,
    sourceHeight: 121,
    displayWidth: 168,
    displayHeight: 121,
    originY: 0.84,
  },
  harborTree: {
    id: "harbor-tree-01-v01",
    textureKey: "harbor-tree-01-v01",
    path: "assets/world/harbor/greenery/harbor-tree-01-v01.png",
    role: "Tier 3 harbor tree reference",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v01",
    notes: "Batch 01 1× export; 54×66 practical visible content; ground-contact anchor.",
    sourceWidth: 62,
    sourceHeight: 74,
    displayWidth: 62,
    displayHeight: 74,
    originY: 0.95,
  },
  cargoCrate: {
    id: "cargo-crate-01-v01",
    textureKey: "harbor-cargo-crate-01-v01",
    path: "assets/world/harbor/props/cargo-crate-01-v01.png",
    role: "Tier 4 harbor cargo crate reference",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v01",
    notes: "Batch 01 1× export; 46×38 practical visible content; ground-contact anchor.",
    sourceWidth: 54,
    sourceHeight: 46,
    displayWidth: 54,
    displayHeight: 46,
    originY: 0.91,
  },
  harborLamp: {
    id: "harbor-lamp-01-v01",
    textureKey: "harbor-lamp-01-v01",
    path: "assets/world/harbor/props/harbor-lamp-01-v01.png",
    role: "Tier 4 vertical harbor lamp reference",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "GAME_READY",
    version: "v01",
    notes: "Batch 01 1× export; 16×47 practical visible content; ground-contact anchor.",
    sourceWidth: 24,
    sourceHeight: 55,
    displayWidth: 24,
    displayHeight: 55,
    originY: 0.93,
  },
} as const satisfies Readonly<Record<string, WorldAsset>>;

export type WorldAssetEntry = (typeof WORLD_ASSETS)[keyof typeof WORLD_ASSETS];
export type HeroShipAssetKey = "heroShipA" | "heroShipB" | "heroShipC" | "heroShipD";

const calibrationAsset = (
  id: string,
  path: string,
  role: string,
  displayWidth: number,
  displayHeight: number,
  originY: number,
) => ({
  id,
  textureKey: `harbor-${id}`,
  path,
  role,
  sourceType: "generated-original" as const,
  provenance: "generated-original" as const,
  status: "CONCEPT" as const,
  version: "calibration-v01",
  notes: "Deterministic project-owned visual grammar calibration asset; only CAMERA_ELEVATION differs across this subject's variants.",
  sourceWidth: 512,
  sourceHeight: 320,
  displayWidth,
  displayHeight,
  originY,
});

/** Dev-only candidates: camera elevation is the sole visual variable. */
export const CALIBRATION_ASSETS = {
  heroShipD: {
    15: calibrationAsset("hero-ship-d-cal-15", "assets/world/harbor/calibration/hero-ship-d-cal-15.png", "Hero Ship D at 15° elevation", 395, 263, 0.9),
    22.5: calibrationAsset("hero-ship-d-cal-22-5", "assets/world/harbor/calibration/hero-ship-d-cal-22-5.png", "Hero Ship D at 22.5° elevation", 395, 263, 0.9),
    30: calibrationAsset("hero-ship-d-cal-30", "assets/world/harbor/calibration/hero-ship-d-cal-30.png", "Hero Ship D at 30° elevation", 395, 263, 0.9),
  },
  exhibitionHall: {
    15: calibrationAsset("exhibition-hall-cal-15", "assets/world/harbor/calibration/exhibition-hall-cal-15.png", "Exhibition Hall at 15° elevation", 340, 227, 0.9),
    22.5: calibrationAsset("exhibition-hall-cal-22-5", "assets/world/harbor/calibration/exhibition-hall-cal-22-5.png", "Exhibition Hall at 22.5° elevation", 340, 227, 0.9),
    30: calibrationAsset("exhibition-hall-cal-30", "assets/world/harbor/calibration/exhibition-hall-cal-30.png", "Exhibition Hall at 30° elevation", 340, 227, 0.9),
  },
  warehouse: {
    15: calibrationAsset("harbor-warehouse-cal-15", "assets/world/harbor/calibration/harbor-warehouse-cal-15.png", "Warehouse at 15° elevation", 240, 150, 0.9),
    22.5: calibrationAsset("harbor-warehouse-cal-22-5", "assets/world/harbor/calibration/harbor-warehouse-cal-22-5.png", "Warehouse at 22.5° elevation", 240, 150, 0.9),
    30: calibrationAsset("harbor-warehouse-cal-30", "assets/world/harbor/calibration/harbor-warehouse-cal-30.png", "Warehouse at 30° elevation", 240, 150, 0.9),
  },
} as const;

/** Public assets must resolve from Vite's current base, never from root `/assets`. */
export function resolveWorldAssetUrl(asset: WorldAsset): string {
  return `${import.meta.env.BASE_URL}${asset.path}`;
}

export function getHeroShipAsset(search: string): WorldAssetEntry {
  const requested = import.meta.env.DEV ? new URLSearchParams(search).get("heroShip") : null;
  const key: HeroShipAssetKey = requested === "a"
    ? "heroShipA"
    : requested === "b"
      ? "heroShipB"
      : requested === "c"
        ? "heroShipC"
        : "heroShipD";
  return WORLD_ASSETS[key];
}

/** No calibration URL is meaningful in production: Vite removes this DEV branch. */
export function getCalibrationAngle(search: string): CalibrationAngle | undefined {
  if (!import.meta.env.DEV) {
    return undefined;
  }
  const requested = new URLSearchParams(search).get("assetCalibration");
  return requested === "15" ? 15 : requested === "22.5" ? 22.5 : requested === "30" ? 30 : undefined;
}

export function getCalibrationAssets(search: string) {
  const angle = getCalibrationAngle(search);
  return angle === undefined
    ? undefined
    : {
      angle,
      heroShipD: CALIBRATION_ASSETS.heroShipD[angle],
      exhibitionHall: CALIBRATION_ASSETS.exhibitionHall[angle],
      warehouse: CALIBRATION_ASSETS.warehouse[angle],
    };
}
