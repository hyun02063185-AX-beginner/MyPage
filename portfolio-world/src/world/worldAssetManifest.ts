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
}>;

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
    path: "assets/world/harbor/ship/hero-ship-d-v01.png",
    role: "hero ship refinement candidate D — current review default",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "CONCEPT",
    version: "v01",
    notes: "A-like display envelope with C-like three-mast character; elevated profile-biased deck view. Human approval pending.",
    sourceWidth: 1536,
    sourceHeight: 1024,
    displayWidth: 395,
    displayHeight: 263,
    originY: 0.84,
  },
  secondaryBrig: {
    id: "secondary-brig-v01",
    textureKey: "harbor-secondary-brig-v01",
    path: "assets/world/harbor/ship/secondary-brig-v01.png",
    role: "secondary two-mast merchant brig",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "CONCEPT",
    version: "v01",
    notes: "Simpler two-mast working vessel; reused once with horizontal mirroring for fleet variety.",
    sourceWidth: 1536,
    sourceHeight: 1024,
    displayWidth: 188,
    displayHeight: 125,
    originY: 0.84,
  },
  secondarySchooner: {
    id: "secondary-schooner-v01",
    textureKey: "harbor-secondary-schooner-v01",
    path: "assets/world/harbor/ship/secondary-schooner-v01.png",
    role: "secondary two-mast cargo schooner",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "CONCEPT",
    version: "v01",
    notes: "Long low cargo vessel with raked masts; lower hierarchy than Hero Ship D.",
    sourceWidth: 1536,
    sourceHeight: 1024,
    displayWidth: 205,
    displayHeight: 137,
    originY: 0.84,
  },
  secondaryCutter: {
    id: "secondary-cutter-v01",
    textureKey: "harbor-secondary-cutter-v01",
    path: "assets/world/harbor/ship/secondary-cutter-v01.png",
    role: "secondary one-mast harbor cutter",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "CONCEPT",
    version: "v01",
    notes: "Compact one-mast working craft; supports the fleet scale hierarchy.",
    sourceWidth: 1536,
    sourceHeight: 1024,
    displayWidth: 145,
    displayHeight: 97,
    originY: 0.84,
  },
  exhibitionHall: {
    id: "exhibition-hall-v01",
    textureKey: "harbor-exhibition-hall-v01",
    path: "assets/world/harbor/buildings/exhibition-hall-v01.png",
    role: "waterfront Exhibition Hall production-style candidate",
    sourceType: "generated-original",
    provenance: "generated-original",
    status: "CONCEPT",
    version: "v01",
    notes: "Top-down footprint with frontal facade; replaces only the Gallery programmatic visual in this slice.",
    sourceWidth: 1536,
    sourceHeight: 1024,
    displayWidth: 340,
    displayHeight: 227,
    originY: 0.91,
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
