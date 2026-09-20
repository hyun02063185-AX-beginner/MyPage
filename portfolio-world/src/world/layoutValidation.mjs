import { createWaterCollisionRects, rectsOverlap } from "./waterCollisionGeometry.mjs";

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
});

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
}
