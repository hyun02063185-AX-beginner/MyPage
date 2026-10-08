# Portfolio World — R4 Phase B Player Animation + Runtime Integration

## Human selection B

Human selection is closed: **B — Refined Portfolio Guide**. Candidate A is not imported. The approved character identity remains the dark swept-hair silhouette, navy jacket block, cream inner block, charcoal trousers, neutral brown shoes, and a restrained gold detail.

## Production method and identity controls

Three ImageGen direction strips were made from the selected B source: FRONT/DOWN, BACK/UP, and LEFT/SIDE. Each strip contained the four required walk phases. A deterministic alpha-component extraction keeps each generated full-body pose intact when a limb crosses an equal-width source-cell boundary; shared max-frame sizing then normalizes each family to an exact 28×56 RGBA frame with a shared bottom-center feet baseline.

Idle uses frame 1, the neutral passing pose, for each source direction. This avoids vertical idle bounce or head wobble. The final source is a single 4-frame horizontal strip per direction. Right-facing movement is the runtime flipX of the LEFT/SIDE strip; no right-facing generation exists.

Repair cycles: **1 deterministic normalization repair** (source cell-edge extraction). No identity-drift ImageGen retry was needed.

## Final player contract

- Display: **28×56 px**, fixed at all locations.
- Physics body: **28×16 px**, offset **(0,40)**.
- Origin and anchor: bottom-center / feet midpoint.
- Scale: fixed; no distance, Hall, Hero, or perspective scaling.
- Walk: 4 frames each for front, back, and side at **8 fps**.
- Idle: one neutral frame per source direction.
- Input: unchanged 8-direction movement at speed 210.
- Visual facing: front, back, left-side, right-side mirror. Ties retain the last horizontal face; stopping retains the current face.

## R4 runtime

'?canonical=4' starts **CanonicalRuntimeR4Scene**, a direct R3-derived scene whose only functional visual change is the Arcade Sprite player. It keeps the R3 environment layers, anchors, collision vectors, camera, depth calculation, interaction prompt, routes, and movement normalization. R3 remains available unchanged at '?canonical=3'.

The R4 Sprite has 28×56 intrinsic frames, bottom-center origin, and the existing 28×16 body with offset (0,40). Animation frames are render-only; collision never reads sprite alpha or an animation image.

## Native-scale QA

The opened native board confirms the navy/cream guide identity at 1× and 4×. Front has alternating leading legs, back keeps shoulder/leg direction readable, and side has the clearest stride. Head scale, jacket hem, trousers, footwear, and body width remain stable across frames. A small amount of source-art softness is expected at 28×56; it does not obscure direction or leg separation.

## Runtime capture QA

Actual Chrome captures of the local Vite runtime were created at P1 Workshop, P8 Harbor Office, P5 Hall Plaza, P4 Main Stairs, P7 Hero Ship, overview, and debug. All were opened in this pass.

- Workshop: the navy/cream player remains readable among cargo and wood detail.
- Office: reads as a person, not as a building/prop detail.
- Hall: looks human-scaled against the stair/facade mass.
- Stairs: fixed 28×56 anchor sits naturally on the stair surface; there is no scale shift.
- Hero: the guide remains readable against the dark-blue/gold hull.
- Depth: the R3 ground-Y semantic depth remains in place; crops show player traceability around workshop detail, stair props, and hero-quay foreground objects.
- Debug: R4 reports the preserved P1 anchor/geometry overlay and no scene boot error.

Browser console: clean (no Runtime exception or Log entry after Runtime/Log enable).

## Automated preservation

The R4 integration test verifies the R4 registration, exact R3 geometry/anchors/visitable list parity, selected B-only runtime asset list, 28×56 idle, 112×56 four-frame sheets, 28×16 body/offset, fixed scale, 8fps animation definitions, and flipX right-facing strategy. The existing route and destination tests continue to pass.

R3 Foundation Master B and Scenic A Final Composite SHA-256 values are unchanged. R3's temporary player and scene are also unchanged.

## Remaining player gap and Human Gate

The remaining subjective check is **interactive keyboard feel**: assess walk cadence, stop transition, and diagonal facing at normal play input. Browser automation can open and capture the Phaser canvas but could not sustain a Canvas key-down through its DOM bridge; the runtime state machine, native-frame review, actual Chrome captures, and all automated contracts are complete.

FINAL_PLAYER_B = HUMAN_SELECTED
R4_RUNTIME = IMPLEMENTED
R3_ENVIRONMENT = UNCHANGED
RUNTIME_GATE = PENDING_HUMAN
GATE = READY_FOR_R4_ACTUAL_PLAYER_HUMAN_VISUAL_GATE

## Evidence

1. evidence/runtime-r4-player-integration/01-final-player-direction-sheet.png
2. evidence/runtime-r4-player-integration/02-final-player-walk-cycle-review.png
3. evidence/runtime-r4-player-integration/03-native-28x56-animation-review.png
4. evidence/runtime-r4-player-integration/04-r4-workshop.png
5. evidence/runtime-r4-player-integration/05-r4-office.png
6. evidence/runtime-r4-player-integration/06-r4-hall.png
7. evidence/runtime-r4-player-integration/07-r4-stairs.png
8. evidence/runtime-r4-player-integration/08-r4-hero.png
9. evidence/runtime-r4-player-integration/09-r4-overview.png
10. evidence/runtime-r4-player-integration/10-r3-vs-r4-player.png
11. evidence/runtime-r4-player-integration/11-r4-depth-occlusion-review.png
12. evidence/runtime-r4-player-integration/12-r4-debug.png
