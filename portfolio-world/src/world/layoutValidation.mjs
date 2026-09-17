const COLLIDABLE_LANDMARK_TYPES = new Set(["water-feature", "planter"]);

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
    layout.landmarks,
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
  for (const landmark of layout.landmarks) {
    if (typeof landmark.collidable !== "boolean") {
      throw new Error(`Invalid collision config: ${landmark.id}`);
    }
    if (landmark.collidable && !COLLIDABLE_LANDMARK_TYPES.has(landmark.type)) {
      throw new Error(`Unexpected collidable landmark: ${landmark.id}`);
    }
    if (landmark.zone !== "path" && !zoneIds.has(landmark.zone)) {
      throw new Error(`Unknown landmark zone: ${landmark.id}`);
    }
  }
}
