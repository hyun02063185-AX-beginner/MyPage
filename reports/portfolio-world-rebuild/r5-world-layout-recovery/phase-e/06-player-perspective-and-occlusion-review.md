# R5 Phase E — Player Perspective and Occlusion Review

Review baseline: 28×56 Refined Portfolio Guide, fixed visual size, 1.25 camera zoom, bottom-center feet at C.2 anchors. The preview formula is `screen = (world − clampedCamera) × zoom`, followed once by output scaling.

At Workshop/Hall, drawing player before the foreground rail/wall creates legible behind-rail movement. Drawing player after it visibly breaks depth. At Hero, player remains at the gangway threshold, while the hull/dock foreground may occlude only solid portions.

The player is readable at this scale, but a single perspective-painted Master still creates MAJOR risk for vertical movement unless terrain/architecture depth layers are authored. Static people in the source remain an unresolved duplication risk.
