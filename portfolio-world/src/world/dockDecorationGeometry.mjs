/**
 * Returns relative post centers for a dock silhouette. Small pier arms receive
 * fewer, inset posts so neither posts nor rope spans can escape the footprint.
 */
export function getDockPostOffsets(width) {
  if (width < 224) {
    return [0.16, 0.5, 0.84];
  }
  return [0.06, 0.27, 0.5, 0.73, 0.94];
}
