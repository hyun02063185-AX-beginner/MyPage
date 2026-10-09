# R5 Phase D.1 — Camera Calculation Bug Audit

## Root cause

The Phase D gameplay preview cropped `visibleWorld = viewport / zoom` and resized that crop to a thumbnail. The crop-to-thumbnail scale already contains camera zoom. The old player draw calculation used `playerVisual × zoom × tileScale`, so zoom was applied again to the player only.

## Corrected calculation

```text
logicalScreen = (worldPosition - clampedCameraPosition) × zoom
previewScreen = logicalScreen × previewScale

playerPreviewSize = playerWorldSize × zoom × previewScale
                  = playerWorldSize × (previewSize / visibleWorldArea)
```

The corrected preview renderer uses `playerWorldSize × (previewSize / visibleWorldArea)` exactly once. The player bottom-center is aligned to the ground anchor; the top-left is derived by subtracting half width and full height. Background and player share the same crop/scale transform.

## Verification

- 28×56 at zoom 1.0 → 28×56 logical pixels.
- 28×56 at zoom 1.25 → 35×70 logical pixels.
- 32×64 at zoom 1.0 → 32×64 logical pixels.
- Camera clamp and thumbnail scale are tested separately; no duplicate zoom is present.
