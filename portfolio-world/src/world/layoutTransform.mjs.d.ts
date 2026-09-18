export const TOWN_TRANSLATION_Y: number;
export const HARBOR_BASIN_HEIGHT: number;
export function translateTownLayout(
  sourceLayout: unknown,
  dimensions: Readonly<{ worldHeight: number }>,
): unknown;
export function assertTownTranslation(
  sourceLayout: unknown,
  translatedLayout: unknown,
  dimensions: Readonly<{ worldHeight: number }>,
): void;
