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
]);
const HARBOR_VISUAL_TIERS = new Set(["primary", "secondary", "detail"]);
const COLLIDABLE_HARBOR_VISUAL_TYPES = new Set(["water"]);
const DENSITY_CAPS = { primary: 8, secondary: 16, detail: 20 };

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

/** Shared runtime and Node-test validation for the project-owned layout data. */
export function validateWorldLayout(layout, { worldWidth, worldHeight }) {
  const placementCollections = [
    layout.zones,
    layout.paths,
    layout.forecourts,
    layout.harborVisuals,
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
    if (visual.collidable && !COLLIDABLE_HARBOR_VISUAL_TYPES.has(visual.type)) {
      throw new Error(`Unexpected collidable harbor visual: ${visual.id}`);
    }
    if (visual.type === "water" && !visual.collidable) {
      throw new Error(`Water boundary must be collidable: ${visual.id}`);
    }
    if (visual.zone !== "path" && !zoneIds.has(visual.zone)) {
      throw new Error(`Unknown harbor visual zone: ${visual.id}`);
    }
    tierCounts[visual.tier] += 1;
  }

  for (const [tier, maximum] of Object.entries(DENSITY_CAPS)) {
    if (tierCounts[tier] > maximum) {
      throw new Error(`Harbor visual density cap exceeded: ${tier}`);
    }
  }

  const waterVisuals = layout.harborVisuals.filter((visual) => visual.type === "water");
  if (waterVisuals.length !== 1) {
    throw new Error("Layout requires exactly one coherent waterfront water visual");
  }
}
