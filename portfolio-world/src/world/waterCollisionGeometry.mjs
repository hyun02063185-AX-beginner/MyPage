const overlaps = (first, second) => (
  first.x - first.width / 2 < second.x + second.width / 2 &&
  first.x + first.width / 2 > second.x - second.width / 2 &&
  first.y - first.height / 2 < second.y + second.height / 2 &&
  first.y + first.height / 2 > second.y - second.height / 2
);

const rect = (id, left, top, right, bottom) => ({
  id,
  x: (left + right) / 2,
  y: (top + bottom) / 2,
  width: right - left,
  height: bottom - top,
});

/** Removes a walkable dock footprint from one water collision rectangle. */
function subtractWalkableFootprint(water, dock) {
  if (!overlaps(water, dock)) {
    return [water];
  }

  const left = water.x - water.width / 2;
  const top = water.y - water.height / 2;
  const right = water.x + water.width / 2;
  const bottom = water.y + water.height / 2;
  const cutLeft = Math.max(left, dock.x - dock.width / 2);
  const cutTop = Math.max(top, dock.y - dock.height / 2);
  const cutRight = Math.min(right, dock.x + dock.width / 2);
  const cutBottom = Math.min(bottom, dock.y + dock.height / 2);
  const pieces = [];
  const add = (suffix, pieceLeft, pieceTop, pieceRight, pieceBottom) => {
    if (pieceRight > pieceLeft && pieceBottom > pieceTop) {
      pieces.push(rect(`${water.id}-${suffix}`, pieceLeft, pieceTop, pieceRight, pieceBottom));
    }
  };

  add("north", left, top, right, cutTop);
  add("south", left, cutBottom, right, bottom);
  add("west", left, cutTop, cutLeft, cutBottom);
  add("east", cutRight, cutTop, right, cutBottom);
  return pieces;
}

/**
 * Keeps visual water continuous while carving only declared walkable dock footprints
 * from its Arcade collision geometry.
 */
export function createWaterCollisionRects(waterVisuals, walkableDocks) {
  return walkableDocks.reduce(
    (collisionRects, dock) => collisionRects.flatMap((water) => subtractWalkableFootprint(water, dock)),
    waterVisuals.map((water) => ({ ...water })),
  );
}

export { overlaps as rectsOverlap };
