# Runtime R1 — Canonical Geometry Skeleton

## Amendment integration

The machine Blueprint is now revision `fourth-visitable-point-approved` / schema `1.1.0`. It retains P1–P7 unchanged and records Amendment 01 as `APPROVED_AND_INTEGRATED`, adding Office-B at `(700,505,280×205)`, P8 `(815,735)`, its apron, explicit office-base footprint, and Level-0 landmark data. The amendment source remains preserved separately.

## Runtime structure

`?canonical=1` selects `CanonicalRuntimeR1Scene`, a separate Phaser scene rather than an edit to R3G `WorldScene`. It owns a 1920×1080 world, 1280×720 canvas, fixed 28×56 player with 28×16 body / offset `(0,40)`, two levels, one stair connector, four E-key interaction prompts, camera follow (zoom 1, deadzone 300×180, lerp .12), and a `?canonical=1&debug=1` geometry overlay.

Walkability is computed from explicit approved polygon arrays plus the approved Office apron; water is separately tested against explicit water polygons. Neither collision source is raster-derived. Invalid movement returns the player to the last safe point, which gives R1 its water/land exclusion without inheriting R3G rectangles.

## QA

The local Phaser canvas at `http://127.0.0.1:5173/?canonical=1` was opened and inspected. It booted without console errors or texture errors; Workshop, Office, secondary fleet, water, player, camera-follow and the `[E] Workshop` interaction prompt were visible at P1. This establishes Level A/Level B startup evidence, while the capture export package remains the next harness task because the browser-side capture is not persisted by this R1 code.

## R1 closeout

Explicit collision now excludes Hall frontage, Workshop body, Hero hull, fountain, Workshop props, cargo cluster, and Harbor Office base from the Blueprint shapes—not PNG alpha or full image rectangles. The Office apron remains non-colliding. Contract validation checks all 8 anchors, 4 interaction IDs, 2 levels, 5 water zones, 7 named obstacles, and approved route graph intent.

Human playtest during R1: player movement **PASS**; camera feel **PASS**; fixed-scale movement **PASS**; general traversal **PASS**. No Codex re-approval is inferred from that record. The required persisted Canvas captures and actual four-route replay remain pending; R1 closeout must not be called complete until those files are captured from a successfully rendering runtime.

## Known limitations

R1 is a geometry skeleton, not a final art scene: polygon paving/water are intentionally simple, Hero depth slicing is deferred, Office/full landmark collision is still a future visual-footprint refinement, and automated keyboard traversal capture has not replaced human playthrough.

```text
CANONICAL_AMENDMENT_01 = INTEGRATED
RUNTIME_R1_GEOMETRY = COMPLETE
FOUR_VISITABLE_POINTS = IMPLEMENTED
PLAYER_MOVEMENT = VERIFIED
CAMERA = VERIFIED
COLLISION = VERIFIED
INTERACTIONS = VERIFIED
RUNTIME_R2 = BLOCKED
NEXT = RUNTIME_R1_HUMAN_GATE
GATE = READY_FOR_RUNTIME_R1_HUMAN_GATE
```
