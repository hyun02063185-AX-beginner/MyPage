/**
 * Minimal semantic depth policy for the hybrid orthographic 2.5D world.
 * Contact Y, not transparent image/crown/roof height, establishes spatial order.
 */
export const WORLD_DEPTH = Object.freeze({
  GROUND_WATER: 0,
  GROUND_DETAIL: 20_000,
  WALKABLE_STRUCTURE: 40_000,
  LOW_PROP: 60_000,
  WORLD_OBJECT_BODY: 80_000,
  ACTOR_PLAYER: 80_000,
  UPPER_OCCLUDER: 120_000,
  LABEL_WORLD_ANNOTATION: 160_000,
  HTML_UI: 200_000,
});

const CONTACT_Y_MULTIPLIER = 10;

/** A sub-unit deterministic tie-breaker: equal contact rows never flicker. */
export function stableDepthTie(id) {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
  }
  return (hash % 10_000) / 10_000;
}

/**
 * Formula: semantic band + rounded logical contact Y × 10 + stable sub-unit tie.
 * One logical pixel always outweighs an ID tie while bands remain non-overlapping.
 */
export function depthAtContact(baseBand, contactY, id) {
  return baseBand + Math.round(contactY) * CONTACT_Y_MULTIPLIER + stableDepthTie(id);
}

export function buildingContactY(building) {
  return building.y + building.height / 2;
}

export function visualGroundContactY(visual) {
  return visual.y + visual.height / 2;
}

export function getBuildingDepth(building) {
  return depthAtContact(
    WORLD_DEPTH.WORLD_OBJECT_BODY,
    buildingContactY(building),
    building.id,
  );
}

export function getVesselDepth(waterlineY, id) {
  return depthAtContact(WORLD_DEPTH.WORLD_OBJECT_BODY, waterlineY, id);
}

export function getPlayerDepth(footY) {
  return depthAtContact(WORLD_DEPTH.ACTOR_PLAYER, footY, "actor-player");
}

export function getWorldLabelDepth(id) {
  return WORLD_DEPTH.LABEL_WORLD_ANNOTATION + stableDepthTie(id);
}

const LOW_PROP_TYPES = new Set([
  "bench",
  "lamp",
  "crate",
  "barrel",
  "flag",
]);

const BODY_TYPES = new Set([
  "navigation-monument",
  "planter",
  "harbor-sign",
  "small-boat",
  "secondary-sailing-ship",
  "market-kiosk",
  "notice-board",
  "route-map",
  "registry-stand",
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
]);

export function getHarborVisualDepth(visual) {
  if (visual.type === "water") {
    return WORLD_DEPTH.GROUND_WATER + stableDepthTie(visual.id);
  }
  if (visual.type === "dock") {
    return depthAtContact(
      visual.walkable ? WORLD_DEPTH.WALKABLE_STRUCTURE : WORLD_DEPTH.GROUND_DETAIL,
      visualGroundContactY(visual),
      visual.id,
    );
  }
  const band = LOW_PROP_TYPES.has(visual.type)
    ? WORLD_DEPTH.LOW_PROP
    : BODY_TYPES.has(visual.type)
      ? WORLD_DEPTH.WORLD_OBJECT_BODY
      : WORLD_DEPTH.GROUND_DETAIL;
  return depthAtContact(band, visualGroundContactY(visual), visual.id);
}
