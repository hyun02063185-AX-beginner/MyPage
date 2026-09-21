import { createWaterCollisionRects, rectsOverlap } from "./waterCollisionGeometry.mjs";
import { FLEET_PRESENTATION, getFleetVisibleRect } from "./fleetPresentation.mjs";

const HARBOR_VISUAL_TYPES = new Set([
  "navigation-monument",
  "planter",
  "bench",
  "lamp",
  "harbor-sign",
  "crate",
  "barrel",
  "dock",
  "water",
  "small-boat",
  "secondary-sailing-ship",
  "market-kiosk",
  "notice-board",
  "route-map",
  "registry-stand",
  "flag",
  "study-garden",
  "academic-sign",
  "banner",
  "tree",
  "worktable",
  "tool-rack",
  "cart",
  "timber-stack",
  "display-board",
  "viewing-terrace",
  "large-ship",
  "warehouse",
  "cargo-shed",
  "warehouse-annex",
  "service-hut",
  "rope-coil",
  "safety-rail",
  "mooring-bollard",
  "service-marker",
  "buoy",
  "gangplank",
]);
const HARBOR_VISUAL_TIERS = new Set(["primary", "secondary", "detail"]);
const COLLIDABLE_HARBOR_VISUAL_TYPES = new Set(["water", "warehouse"]);
const FLOATING_VESSEL_TYPES = new Set(["large-ship", "small-boat", "secondary-sailing-ship"]);
const SUPPORT_BUILDING_TYPES = new Set(["warehouse", "cargo-shed", "warehouse-annex", "service-hut"]);
const LAND_SIDE_PROP_TYPES = new Set(["planter", "bench", "lamp", "crate", "barrel", "viewing-terrace", "rope-coil", "safety-rail", "mooring-bollard", "service-marker"]);
const REQUIRED_WALKABLE_PIER_IDS = new Set([
  "harbor-pier-west",
  "harbor-pier-east",
  "harbor-service-jetty",
]);
const PERMANENT_STREETSCAPE_TYPES = new Set([
  "navigation-monument",
  "dock",
  "water",
  "market-kiosk",
  "notice-board",
  "route-map",
  "registry-stand",
  "study-garden",
  "academic-sign",
  "worktable",
  "tool-rack",
  "cart",
  "timber-stack",
  "display-board",
  "viewing-terrace",
  "large-ship",
  "warehouse",
  "cargo-shed",
  "warehouse-annex",
  "service-hut",
  "safety-rail",
  "service-marker",
]);
// Harbor refinement adds a bounded fleet and service berth without reopening town density.
const DENSITY_CAPS = { primary: 10, secondary: 40, detail: 45 };
const FLEET_CLASS_ORDER = ["hero", "medium", "brig", "cutter", "small-workboat", "dinghy"];
const SQUARE_REST_ITEM_IDS = new Set([
  "harbor-tree-02", "harbor-shrub-planter", "harbor-bench", "waterfront-promenade-planter",
]);
const WORKING_WATERFRONT_ITEM_IDS = new Set([
  "waterfront-dock", "harbor-pier-west", "harbor-pier-east", "harbor-service-jetty",
  "harbor-large-ship", "harbor-west-merchant-brig", "harbor-west-cargo-schooner",
  "harbor-east-merchant-brig", "harbor-east-harbor-cutter", "harbor-small-workboat",
  "harbor-dinghy", "dock-rope-line", "dock-gangplank", "dock-buoy", "dock-hand-cart", "dock-work-net",
  "harbor-cargo-stack", "harbor-barrel-cluster", "harbor-rope-coil", "harbor-mooring-bollard", "harbor-service-marker",
]);

function assertRect(rect, worldWidth, worldHeight) {
  if (
    typeof rect.id !== "string" ||
    !Number.isFinite(rect.x) ||
    !Number.isFinite(rect.y) ||
    !Number.isFinite(rect.width) ||
    !Number.isFinite(rect.height) ||
    rect.width <= 0 ||
    rect.height <= 0
  ) {
    throw new Error(`Invalid geometry for placement: ${rect.id ?? "UNKNOWN"}`);
  }

  if (
    rect.x - rect.width / 2 < 0 ||
    rect.x + rect.width / 2 > worldWidth ||
    rect.y - rect.height / 2 < 0 ||
    rect.y + rect.height / 2 > worldHeight
  ) {
    throw new Error(`Out-of-bounds placement: ${rect.id}`);
  }
}

function overlaps(a, b) {
  return (
    a.x - a.width / 2 < b.x + b.width / 2 &&
    a.x + a.width / 2 > b.x - b.width / 2 &&
    a.y - a.height / 2 < b.y + b.height / 2 &&
    a.y + a.height / 2 > b.y - b.height / 2
  );
}

function contains(outer, inner) {
  return (
    inner.x - inner.width / 2 >= outer.x - outer.width / 2 &&
    inner.x + inner.width / 2 <= outer.x + outer.width / 2 &&
    inner.y - inner.height / 2 >= outer.y - outer.height / 2 &&
    inner.y + inner.height / 2 <= outer.y + outer.height / 2
  );
}

function assertDoesNotOverlap(rect, protectedRect, reason) {
  if (overlaps(rect, protectedRect)) {
    throw new Error(`${reason}: ${rect.id} / ${protectedRect.id}`);
  }
}

// Explicit rendered-alpha bounds for the four Batch 02 props reviewed against accepted waterfront furniture.
const BATCH02_VISIBLE_BOUNDS = Object.freeze({
  "harbor-tree-02": { x: 4, y: 13, width: 54, height: 47, displayWidth: 62, displayHeight: 74, originY: 0.95 },
  "harbor-shrub-planter": { x: 4, y: 11, width: 48, height: 26, displayWidth: 56, displayHeight: 48, originY: 0.94 },
  "harbor-safety-rail": { x: 4, y: 9, width: 56, height: 26, displayWidth: 64, displayHeight: 44, originY: 0.91 },
  "harbor-service-marker": { x: 15, y: 4, width: 18, height: 48, displayWidth: 48, displayHeight: 56, originY: 0.95 },
  "harbor-notice-board": { x: 10, y: 4, width: 35, height: 56, displayWidth: 56, displayHeight: 64, originY: 0.94 },
  "harbor-mooring-bollard": { x: 5, y: 4, width: 21, height: 32, displayWidth: 32, displayHeight: 40, originY: 0.95 },
});

// Measured practical-alpha bounds and actual WorldScene image placement for Batch 03.
// This stays a narrow harbor-scene contract, rather than becoming a general collision system.
const BATCH03_VISIBLE_BOUNDS = Object.freeze({
  "harbor-small-workboat": { x: 15, y: 4, width: 79, height: 56, displayWidth: 110, displayHeight: 64, originY: 0.86 },
  "harbor-dinghy": { x: 4, y: 6, width: 68, height: 29, displayWidth: 76, displayHeight: 42, originY: 0.85 },
  "dock-rope-line": { x: 4, y: 6, width: 56, height: 21, displayWidth: 64, displayHeight: 34, originY: 0.9 },
  "dock-gangplank": { x: 8, y: 4, width: 47, height: 30, displayWidth: 64, displayHeight: 38, originY: 0.9 },
  "dock-buoy": { x: 4, y: 4, width: 24, height: 32, displayWidth: 32, displayHeight: 40, originY: 0.9 },
  "dock-hand-cart": { x: 4, y: 7, width: 48, height: 31, displayWidth: 56, displayHeight: 46, originY: 0.9 },
  "dock-work-net": { x: 4, y: 4, width: 50, height: 40, displayWidth: 58, displayHeight: 48, originY: 0.9 },
});

const BATCH03_HARBOR_SCENE_ITEMS = new Set([
  ...Object.keys(BATCH03_VISIBLE_BOUNDS),
  "waterfront-viewing-terrace", "waterfront-viewing-lamp", "harbor-mooring-bollard",
  "harbor-rope-coil", "harbor-barrel-cluster", "harbor-cargo-stack", "harbor-notice-board",
  "harbor-pier-west", "harbor-service-jetty", "harbor-warehouse-annex", "harbor-service-hut",
]);
const BATCH03_INTENTIONAL_OVERLAPS = new Set(["dock-gangplank|harbor-small-workboat"]);

// This is deliberately a local scene contract, not a whole-world collision engine.
// Every selected pair is expected to remain visibly separate; no intentional overlaps exist here.
const WATERFRONT_STATIC_VISUAL_ITEMS = new Set([
  "waterfront-viewing-terrace", "waterfront-viewing-bench", "exhibition-flag-east",
  "exhibition-display-board", "harbor-notice-board", "harbor-tree-02",
  "harbor-shrub-planter", "harbor-safety-rail", "harbor-service-marker",
]);

function renderedVisibleRect(visual, bounds) {
  return { id: visual.id, x: visual.x - bounds.displayWidth / 2 + bounds.x + bounds.width / 2, y: visual.y + visual.height / 2 - bounds.originY * bounds.displayHeight + bounds.y + bounds.height / 2, width: bounds.width, height: bounds.height };
}

function sceneRect(visual) {
  const fleetRect = getFleetVisibleRect(visual);
  if (fleetRect) return fleetRect;
  const bounds = BATCH03_VISIBLE_BOUNDS[visual.id] ?? BATCH02_VISIBLE_BOUNDS[visual.id];
  return bounds ? renderedVisibleRect(visual, bounds) : visual;
}

function pairKey(first, second) {
  return [first.id, second.id].sort().join("|");
}

function hasMaterialOverlap(first, second) {
  const width = Math.min(first.x + first.width / 2, second.x + second.width / 2)
    - Math.max(first.x - first.width / 2, second.x - second.width / 2);
  const height = Math.min(first.y + first.height / 2, second.y + second.height / 2)
    - Math.max(first.y - first.height / 2, second.y - second.height / 2);
  // A one-pixel alpha-edge touch is not a visible conflict; all review-classified
  // material cases are comfortably above this floor in both dimensions.
  return width > 2 && height > 2;
}

function fleetSceneRect(vessel) {
  return getFleetVisibleRect(vessel) ?? vessel;
}

/** Actual alpha envelopes are used so enlarged transparent canvases never mask a collision. */
export function findFleetMaterialOverlaps(visuals) {
  const vessels = visuals.filter((visual) => FLOATING_VESSEL_TYPES.has(visual.type));
  const overlapsFound = [];
  for (let index = 0; index < vessels.length; index += 1) {
    for (let comparison = index + 1; comparison < vessels.length; comparison += 1) {
      if (hasMaterialOverlap(fleetSceneRect(vessels[index]), fleetSceneRect(vessels[comparison]))) {
        overlapsFound.push(pairKey(vessels[index], vessels[comparison]));
      }
    }
  }
  return overlapsFound;
}

function assertFleetPresenceContract(visuals) {
  const vessels = visuals.filter((visual) => FLEET_PRESENTATION[visual.id]);
  const facings = new Set();
  const classWidths = new Map();
  for (const vessel of vessels) {
    const presentation = FLEET_PRESENTATION[vessel.id];
    if (presentation.scale <= 0 || presentation.scale > 1.5) {
      throw new Error(`Fleet presentation scale is out of range: ${vessel.id}`);
    }
    facings.add(presentation.facing);
    const visibleRect = fleetSceneRect(vessel);
    const current = classWidths.get(presentation.vesselClass) ?? 0;
    classWidths.set(presentation.vesselClass, Math.max(current, visibleRect.width));
  }
  if (!facings.has("left") || !facings.has("right")) {
    throw new Error("Fleet presentation requires both left and right facings");
  }
  for (let index = 0; index < FLEET_CLASS_ORDER.length - 1; index += 1) {
    const larger = classWidths.get(FLEET_CLASS_ORDER[index]);
    const smaller = classWidths.get(FLEET_CLASS_ORDER[index + 1]);
    if (!(larger > smaller)) {
      throw new Error(`Fleet hierarchy is not preserved: ${FLEET_CLASS_ORDER[index]} / ${FLEET_CLASS_ORDER[index + 1]}`);
    }
  }
  const overlapsFound = findFleetMaterialOverlaps(visuals);
  if (overlapsFound.length > 0) {
    throw new Error(`Fleet material overlap: ${overlapsFound[0].replace("|", " / ")}`);
  }
}

function assertHarborZoning(layout) {
  const plaza = layout.zones.find((zone) => zone.id === "plaza");
  if (!plaza) throw new Error("Harbor Square is missing");
  for (const visual of layout.harborVisuals) {
    if (SQUARE_REST_ITEM_IDS.has(visual.id) && (visual.zone !== "plaza" || !contains(plaza, visual))) {
      throw new Error(`Square landscape zoning drift: ${visual.id}`);
    }
    if (WORKING_WATERFRONT_ITEM_IDS.has(visual.id) && visual.zone !== "gallery") {
      throw new Error(`Working waterfront zoning drift: ${visual.id}`);
    }
  }
}

export function findBatch03HarborSceneOverlaps(visuals) {
  const sceneItems = visuals.filter((visual) => BATCH03_HARBOR_SCENE_ITEMS.has(visual.id));
  const overlapsFound = [];
  for (let index = 0; index < sceneItems.length; index += 1) {
    for (let comparison = index + 1; comparison < sceneItems.length; comparison += 1) {
      const first = sceneItems[index];
      const second = sceneItems[comparison];
      if (!BATCH03_VISIBLE_BOUNDS[first.id] && !BATCH03_VISIBLE_BOUNDS[second.id]) continue;
      if (BATCH03_INTENTIONAL_OVERLAPS.has(pairKey(first, second))) continue;
      if (hasMaterialOverlap(sceneRect(first), sceneRect(second))) overlapsFound.push(pairKey(first, second));
    }
  }
  return overlapsFound;
}

function assertBatch03HarborSceneClearance(visuals) {
  const overlapsFound = findBatch03HarborSceneOverlaps(visuals);
  if (overlapsFound.length > 0) {
    throw new Error(`Batch 03 harbor scene overlap: ${overlapsFound[0].replace("|", " / ")}`);
  }
}

function assertGangplankRelationship(visuals, protectedNavigation) {
  const gangplank = visuals.find((visual) => visual.id === "dock-gangplank");
  const workboat = visuals.find((visual) => visual.id === "harbor-small-workboat");
  const pier = visuals.find((visual) => visual.id === "harbor-pier-west");
  if (!gangplank || gangplank.type !== "gangplank" || !workboat || !pier) {
    throw new Error("Batch 03 gangplank relationship is incomplete");
  }
  const gangplankRect = sceneRect(gangplank);
  const workboatRect = sceneRect(workboat);
  if (!overlaps(gangplankRect, workboatRect)) {
    throw new Error("Gangplank must contact the small workboat");
  }
  const pierTop = pier.y - pier.height / 2;
  const gangplankBottom = gangplankRect.y + gangplankRect.height / 2;
  const crossesPierSpan = gangplankRect.x + gangplankRect.width / 2 >= pier.x - pier.width / 2
    && gangplankRect.x - gangplankRect.width / 2 <= pier.x + pier.width / 2;
  if (!crossesPierSpan || Math.abs(pierTop - gangplankBottom) > 8) {
    throw new Error("Gangplank must terminate at the west pier edge");
  }
  for (const protectedRect of protectedNavigation) {
    assertDoesNotOverlap(gangplankRect, protectedRect, "Gangplank overlaps protected navigation");
  }
}

function assertWaterfrontStaticVisualClearance(visuals) {
  const sceneItems = visuals.filter((visual) => WATERFRONT_STATIC_VISUAL_ITEMS.has(visual.id));
  for (let index = 0; index < sceneItems.length; index += 1) {
    const first = sceneItems[index];
    const firstRect = BATCH02_VISIBLE_BOUNDS[first.id] ? renderedVisibleRect(first, BATCH02_VISIBLE_BOUNDS[first.id]) : first;
    for (let comparison = index + 1; comparison < sceneItems.length; comparison += 1) {
      const second = sceneItems[comparison];
      const secondRect = BATCH02_VISIBLE_BOUNDS[second.id] ? renderedVisibleRect(second, BATCH02_VISIBLE_BOUNDS[second.id]) : second;
      assertDoesNotOverlap(firstRect, secondRect, "Waterfront static visual overlap");
    }
  }
}

/** Shared runtime and Node-test validation for the project-owned layout data. */
export function validateWorldLayout(layout, { worldWidth, worldHeight }) {
  const placementCollections = [
    layout.zones,
    layout.paths,
    layout.forecourts,
    layout.harborVisuals,
    layout.reservedLots,
    layout.edgeDecorations,
  ];
  const ids = new Set();

  for (const collection of placementCollections) {
    if (!Array.isArray(collection)) {
      throw new Error("Layout placement collection is missing");
    }
    for (const placement of collection) {
      assertRect(placement, worldWidth, worldHeight);
      if (ids.has(placement.id)) {
        throw new Error(`Duplicate placement ID: ${placement.id}`);
      }
      ids.add(placement.id);
    }
  }

  const zoneIds = new Set(layout.zones.map((zone) => zone.id));
  const buildingFootprints = layout.zones.filter((zone) => zone.id !== "plaza");
  const protectedNavigation = [...layout.paths, ...layout.forecourts, ...buildingFootprints];
  const dockVisuals = layout.harborVisuals.filter((visual) => visual.type === "dock");

  for (const lot of layout.reservedLots) {
    if (lot.zone !== "path" && !zoneIds.has(lot.zone)) {
      throw new Error(`Unknown reserved lot zone: ${lot.id}`);
    }
    for (const protectedRect of protectedNavigation) {
      assertDoesNotOverlap(lot, protectedRect, "Reserved lot overlaps protected layout");
    }
  }
  for (let index = 0; index < layout.reservedLots.length; index += 1) {
    for (let comparison = index + 1; comparison < layout.reservedLots.length; comparison += 1) {
      assertDoesNotOverlap(
        layout.reservedLots[index],
        layout.reservedLots[comparison],
        "Reserved lots overlap",
      );
    }
  }

  const tierCounts = { primary: 0, secondary: 0, detail: 0 };
  for (const visual of layout.harborVisuals) {
    if (!HARBOR_VISUAL_TYPES.has(visual.type)) {
      throw new Error(`Unknown harbor visual type: ${visual.id}`);
    }
    if (!HARBOR_VISUAL_TIERS.has(visual.tier)) {
      throw new Error(`Unknown harbor visual tier: ${visual.id}`);
    }
    if (typeof visual.collidable !== "boolean") {
      throw new Error(`Invalid collision config: ${visual.id}`);
    }
    if (visual.walkable !== undefined && (visual.type !== "dock" || typeof visual.walkable !== "boolean")) {
      throw new Error(`Invalid walkable dock config: ${visual.id}`);
    }
    if (visual.collidable && !COLLIDABLE_HARBOR_VISUAL_TYPES.has(visual.type)) {
      throw new Error(`Unexpected collidable harbor visual: ${visual.id}`);
    }
    if (visual.type === "water" && !visual.collidable) {
      throw new Error(`Water boundary must be collidable: ${visual.id}`);
    }
    if (visual.zone !== "path" && !zoneIds.has(visual.zone)) {
      throw new Error(`Unknown harbor visual zone: ${visual.id}`);
    }
    for (const lot of layout.reservedLots) {
      assertDoesNotOverlap(visual, lot, "Harbor visual consumes reserved lot");
    }
    if (PERMANENT_STREETSCAPE_TYPES.has(visual.type)) {
      for (const protectedRect of protectedNavigation) {
        assertDoesNotOverlap(
          visual,
          protectedRect,
          "Permanent streetscape overlaps protected navigation",
        );
      }
    }
    if (SUPPORT_BUILDING_TYPES.has(visual.type)) {
      for (const dock of dockVisuals) {
        assertDoesNotOverlap(visual, dock, "Support building overlaps dock traversal");
      }
    }
    tierCounts[visual.tier] += 1;
  }

  for (const [tier, maximum] of Object.entries(DENSITY_CAPS)) {
    if (tierCounts[tier] > maximum) {
      throw new Error(`Harbor visual density cap exceeded: ${tier}`);
    }
  }

  const waterVisuals = layout.harborVisuals.filter((visual) => visual.type === "water");
  for (const buoy of layout.harborVisuals.filter((visual) => visual.type === "buoy")) {
    if (!waterVisuals.some((water) => contains(water, buoy))) throw new Error(`Buoy must be contained in water: ${buoy.id}`);
  }
  assertWaterfrontStaticVisualClearance(layout.harborVisuals);
  assertBatch03HarborSceneClearance(layout.harborVisuals);
  assertGangplankRelationship(layout.harborVisuals, protectedNavigation);
  assertHarborZoning(layout);
  const southWater = waterVisuals.find((visual) => visual.id === "waterfront-water");
  if (!southWater || waterVisuals.length < 3) {
    throw new Error("Layout requires south water plus both inner harbor basins");
  }
  if (southWater.y + southWater.height / 2 !== worldHeight) {
    throw new Error("Water must be anchored to the south world edge");
  }
  for (const visual of layout.harborVisuals) {
    if (FLOATING_VESSEL_TYPES.has(visual.type) && !waterVisuals.some((water) => contains(water, visual))) {
      throw new Error(`Floating vessel must be fully contained in water: ${visual.id}`);
    }
    if (SUPPORT_BUILDING_TYPES.has(visual.type)) {
      for (const water of waterVisuals) {
        assertDoesNotOverlap(visual, water, "Support building overlaps harbor water");
      }
    }
    if (LAND_SIDE_PROP_TYPES.has(visual.type)) {
      for (const water of waterVisuals) {
        assertDoesNotOverlap(visual, water, "Land-side prop overlaps harbor water");
      }
    }
  }
  const walkablePiers = [];
  for (const pierId of REQUIRED_WALKABLE_PIER_IDS) {
    const pier = layout.harborVisuals.find((visual) => visual.id === pierId);
    if (!pier || pier.type !== "dock" || !pier.walkable) {
      throw new Error(`Required walkable harbor pier is missing: ${pierId}`);
    }
    walkablePiers.push(pier);
  }
  const waterCollisionRects = createWaterCollisionRects(waterVisuals, walkablePiers);
  for (const pier of walkablePiers) {
    if (waterCollisionRects.some((water) => rectsOverlap(water, pier))) {
      throw new Error(`Walkable harbor pier is covered by water collision: ${pier.id}`);
    }
  }
  const vessels = layout.harborVisuals.filter((visual) => FLOATING_VESSEL_TYPES.has(visual.type));
  for (let index = 0; index < vessels.length; index += 1) {
    for (let comparison = index + 1; comparison < vessels.length; comparison += 1) {
      assertDoesNotOverlap(vessels[index], vessels[comparison], "Floating vessels overlap");
    }
  }
  assertFleetPresenceContract(layout.harborVisuals);
}
