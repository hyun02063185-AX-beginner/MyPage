# Runtime R2.4 — Foundation Master Art Candidates (Phase A)

## Status

`FOUNDATION_MASTER_METHOD = IMPLEMENTED`  
`FOUNDATION_MASTER_A = COMPLETE`  
`FOUNDATION_MASTER_B = COMPLETE`  
`HUMAN_FOUNDATION_SELECTION = PENDING`  
`RUNTIME_INTEGRATION = BLOCKED`

## Why R2.3 is insufficient

R2.3 correctly eliminated dark continuity holes and noisy tonal blobs, but it still assembles small, zone-scoped visual pieces at runtime. That is a useful safe fallback, not the final authored architectural read required for the Hall terrace, retaining wall/stairs, and connected quays.

R2.4 therefore changes only the **candidate-art production method**: ImageGen environment-art studies were calibrated into transparent 1920×1080 foundation masters, then prepared as a base plus a vertical-structure slice. Runtime R2.3 remains exactly in place pending human selection.

## Scene-plate distinction

These masters contain only paving, terrace, retaining architecture, stairs, quay tops/faces, capstones, and narrow contact shadows. They contain no building, vessel, player, UI, landscape, full water, or props. They are transparent RGBA overlays and are never a collision source. The canonical projection is used as a visual/compositional reference only; it is not traced, used as a plate, or used to derive collision.

## Skills and production method

The requested `environment-art`, `create-game-assets`, `portfolio-world-visual-qa`, and Phaser-rendering skills were not available in this session. The available **ImageGen** skill was used for the two transparent environment-art studies, and visual inspection was used for the review boards. The deterministic pipeline at `scripts/portfolio-world/build-r24-foundation-master-candidates.py` performs only allowed cleanup/calibration/compositing/export/validation tasks.

Both prompts required: elevated-oblique 2D Mediterranean harbor; warm limestone upper terrace; retaining wall; actual stair; continuous working lower plaza; central and hero quays; transparent isolated foundation; and explicit exclusion of buildings, ships, people, props, water surface, sky, distant landscape, UI, and text.

Calibration uses fixed 1920×1080 placement constants after visual review. It does not alter landmarks, fleet, P1–P8, polygons, water exclusions, player scale, camera, routes, coverage JSON, or runtime code. No localized warp was required after the generated studies were inspected.

## Candidate scoring (out of 30)

| Candidate | Canonical | Continuity | Limestone | Hall depth | Quay | Runtime | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A | 4/5 | 4/5 | 4/5 | 5/5 | 3/5 | 4/5 | **24/30** |
| B | 4/5 | 5/5 | 4/5 | 5/5 | 5/5 | 4/5 | **27/30** |

- **A** has a softer civic terrace and an excellent stair hierarchy, but the right quay is less strongly articulated for Hero-B.
- **B** has the clearest terrace-to-lower-level architecture, heavier coherent quay construction, and calmer large paving; the exposed lower-front apron is more formal than the canonical working harbor and should be softened only after selection.

**Recommendation: Foundation Master B.** This is a recommendation, not approval. `humanSelection` stays `PENDING`.

## Runtime decomposition proven for Phase B

1. Existing water layer (unchanged)
2. selected `foundation-master-*-base.png` (top surfaces)
3. selected `foundation-master-*-vertical-structure.png` (retaining/quay faces)
4. existing locked architecture, fleet, player, and any later front occlusion

The new candidate assets are deliberately not loaded by `BootScene` or `CanonicalRuntimeR2Scene` in Phase A.

## Transparency and scene-plate regression check

The manifest records 1920×1080 RGBA output, verified alpha, SHA-256 hashes, and a `collisionSource: never` declaration. `scene-plate-check.json` records automatic pipeline checks (dimensions, transparent canvas, runtime-import absence, restricted compositor inputs) and visual inspection checks for the prohibited subject categories. Structural capstones/corner piers are retained as quay/retaining construction, not props.

## Evidence

- [01 — transparent Foundation Master A](evidence/runtime-r24-foundation-master/01-foundation-master-a.png)
- [02 — transparent Foundation Master B](evidence/runtime-r24-foundation-master/02-foundation-master-b.png)
- [04 — A/B transparency and full-composition comparison](evidence/runtime-r24-foundation-master/04-foundation-candidate-comparison.png)
- [05 — A with locked buildings, fleet, and 56px player](evidence/runtime-r24-foundation-master/05-a-full-composition-preview.png)
- [06 — B with locked buildings, fleet, and 56px player](evidence/runtime-r24-foundation-master/06-b-full-composition-preview.png)
- [08 — Canonical Projection A versus candidates](evidence/runtime-r24-foundation-master/08-canonical-vs-foundation-candidates.png)
- [09 — material close-up review](evidence/runtime-r24-foundation-master/09-foundation-material-review.png)

Candidate C and its review frames 03/07 are intentionally omitted: two materially distinct candidates satisfy the Phase-A requirement.

## Gate

`READY_FOR_R2_4_FOUNDATION_MASTER_HUMAN_SELECTION`

Phase B may only import the selected master after human choice. R3 remains blocked.
