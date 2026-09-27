# R4.1 authored interaction assets

- `harbor-player-r4-1.png` — one transparent, full-body playable target created for the R4.1 repair. It uses the locked `world.reference.golden-master.r4` only as a palette and illustrated-rendering reference; it does not alter the Golden Master plate.
- `harbor-cargo-occluder-r4-1.png` — one transparent foreground cargo cluster created for the R4.1 repair, using the same locked reference for its warm painted waterfront material language.

Both files retain alpha transparency. Runtime ownership remains with Phaser: movement, collision, depth ordering, camera limits, interaction and the Exhibition Hall hotspot are authored in `WorldScene.ts`.

## R4.2 player treatment

`../r4-2/harbor-player-r4-2-muted.png` is a non-destructive local derivative of the R4.1 player, not a new generated character. It preserves the source alpha and silhouette while reducing saturation and contrast slightly for closer outdoor plate integration. The original R4.1 source remains unchanged.
