export const TOWN_TRANSLATION_Y = -96;
export const HARBOR_BASIN_HEIGHT = 192;

const TOWN_COLLECTIONS = ["zones", "paths", "forecourts", "reservedLots"];

const shiftY = (placement) => ({ ...placement, y: placement.y + TOWN_TRANSLATION_Y });

/**
 * Applies the approved rigid town translation once at layout construction time.
 * Water is deliberately derived from the fixed south edge after the town moves.
 * Layout rectangles store center coordinates, so its geometric top is 1088px.
 */
export function translateTownLayout(sourceLayout, { worldHeight }) {
  return {
    ...sourceLayout,
    playerSpawn: {
      ...sourceLayout.playerSpawn,
      y: sourceLayout.playerSpawn.y + TOWN_TRANSLATION_Y,
    },
    zones: sourceLayout.zones.map(shiftY),
    paths: sourceLayout.paths.map(shiftY),
    forecourts: sourceLayout.forecourts.map(shiftY),
    reservedLots: sourceLayout.reservedLots.map(shiftY),
    harborVisuals: sourceLayout.harborVisuals.map((visual) =>
      visual.type === "water"
        ? {
            ...visual,
            y: worldHeight - HARBOR_BASIN_HEIGHT / 2,
            height: HARBOR_BASIN_HEIGHT,
          }
        : shiftY(visual),
    ),
  };
}

/** Testable integrity assertion: every intended town record moves exactly once. */
export function assertTownTranslation(sourceLayout, translatedLayout, { worldHeight }) {
  if (translatedLayout.playerSpawn.y !== sourceLayout.playerSpawn.y + TOWN_TRANSLATION_Y) {
    throw new Error("Town translation mismatch: player spawn");
  }

  for (const collectionName of TOWN_COLLECTIONS) {
    const sourceCollection = sourceLayout[collectionName];
    const translatedCollection = translatedLayout[collectionName];
    if (sourceCollection.length !== translatedCollection.length) {
      throw new Error(`Town translation mismatch: ${collectionName} count`);
    }
    for (let index = 0; index < sourceCollection.length; index += 1) {
      const source = sourceCollection[index];
      const translated = translatedCollection[index];
      if (
        source.id !== translated.id ||
        source.x !== translated.x ||
        source.width !== translated.width ||
        source.height !== translated.height ||
        translated.y !== source.y + TOWN_TRANSLATION_Y
      ) {
        throw new Error(`Town translation mismatch: ${collectionName}/${source.id}`);
      }
    }
  }

  for (let index = 0; index < sourceLayout.harborVisuals.length; index += 1) {
    const source = sourceLayout.harborVisuals[index];
    const translated = translatedLayout.harborVisuals[index];
    if (source.id !== translated.id || source.x !== translated.x || source.width !== translated.width) {
      throw new Error(`Town translation mismatch: harbor visual identity/${source.id}`);
    }
    if (source.type === "water") {
      if (
        translated.y - translated.height / 2 !== worldHeight - HARBOR_BASIN_HEIGHT ||
        translated.height !== HARBOR_BASIN_HEIGHT ||
        translated.y + translated.height / 2 !== worldHeight
      ) {
        throw new Error("Town translation mismatch: south-anchored water basin");
      }
    } else if (
      translated.y !== source.y + TOWN_TRANSLATION_Y ||
      translated.height !== source.height
    ) {
      throw new Error(`Town translation mismatch: harbor visual/${source.id}`);
    }
  }
}
