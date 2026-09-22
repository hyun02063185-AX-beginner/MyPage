# Batch 03 Integration Hotfix — Fleet + Dockside Activity

## A. Gate

`READY_FOR_BATCH_03_SHORT_RECHECK`

## B. Work Context

This is a coordinate, validation, and static-berthing hotfix to the Batch 03 independent-review result `RETURN_TO_CODEX`. It does not start Fleet Authenticity Pass or Batch 04, regenerate any PNG, change world size, modify collision, or alter routes, IA, or player movement.

## C. Starting Dirty Worktree State

The resumed worktree contained the Batch 03 coordinate candidate in `worldLayoutData.json`: rope `(920,1000)`, gangplank `(726,1140)`, buoy `(600,1160)`, hand cart `(360,900)`, work net `(448,900)`, plus candidate semantic types. The candidate was inspected rather than discarded; the net and cart were subsequently moved again after the broader sweep.

## D. Preserved In-progress Changes

All seven production assets, their 1× exports, alpha padding, hidden-RGB cleanup, tier assignment, and the accepted Batch 02 composition are retained. The two vessels remain secondary and the five props remain detail tier.

## E. Independent Review Major Findings

The authoritative review reported five Majors: six material local overlaps, no Batch 03 validator coverage, a dry-land buoy, a disconnected gangplank, and dead/duplicated `BERTHING_SLOTS` metadata. These are the only hotfix targets.

## F. Six Reproduced Overlaps

The regression test restores the review's original raw coordinates and evaluates the same rendered-alpha geometry used by `WorldScene` (image display size and `originY`, not PNG canvas dimensions). All six review pairs are reproduced.

| Pair | Before rendered overlap | Final overlap | Result |
| --- | ---: | ---: | --- |
| rope line / viewing terrace | 20.0 × 21.0 | 0 | closed |
| rope line / viewing lamp | 24.0 × 5.4 | 0 | closed |
| buoy / mooring bollard | 18.0 × 22.0 | 0 | closed |
| rope line / buoy | 12.0 × 17.4 | 0 | closed |
| hand cart / rope coil | 24.0 × 6.9 | 0 | closed |
| work net / barrel cluster | 7.0 × 17.0 | 0 | closed |

## G. Validator Extension

`layoutValidation.mjs` now owns an explicit, bounded Batch 03 harbor scene set: both vessels, all five Batch 03 props, protected terrace/lamp/bollard/rope/barrel objects, nearby support structures, and the relevant piers. It uses practical alpha bounds for all seven Batch 03 assets and the bollard, treats only a ≤2 px alpha-edge touch as non-material, and rejects material ship/fixed, prop/prop, prop/Batch 02, and prop/protected-object intersections. It is intentionally not a general physics engine.

## H. Coordinate Corrections

| Item | Before x/y | Final x/y | Reason |
| --- | --- | --- | --- |
| dock-rope-line | 792 / 1000 | 920 / 1000 | clears accepted viewing terrace and lamp |
| dock-gangplank | 872 / 1008 | 726 / 1140 | bridges small workboat to west pier edge |
| dock-buoy | 820 / 1008 | 600 / 1160 | moves into west-basin water and away from bollard/rope |
| dock-hand-cart | 560 / 944 | 360 / 960 | clears rope coil and cargo stack in a dry loading edge |
| dock-work-net | 512 / 932 | 440 / 840 | clears barrel cluster and the reworked cart cluster |

## I. Buoy Semantic Type Decision

`dock-buoy` is the explicit `buoy` type, not a re-labelled small boat. The smallest matching catalog/type/landmark additions were made, and `worldDepth.mjs` places it in the pre-existing `LOW_PROP` band. No depth constant was added.

## J. Buoy Water Validation

Every `buoy` must be fully contained by declared water. The old dry fixture fails with `Buoy must be contained in water`; final `(600,1160)` is fully inside `harbor-west-basin`. Final local sweep finds no vessel, dock, or unrelated-prop material intersection.

## K. Gangplank Relationship

The explicit `gangplank` remains visual-only and non-collidable. Its alpha rectangle contacts the small workboat and terminates within 8 px of the west pier's water-facing edge while spanning that pier; protected navigation is also checked. A disconnected fixture fails and the final fixture passes.

## L. BERTHING_SLOTS Runtime Wiring

`resolveStaticBerthPlacements()` resolves a `berthSlotId` through `BERTHING_SLOTS` after town translation. It validates the vessel assignment and applies slot `x`, translated `y`, and `heading`; it implements no occupancy, assignment, search, movement, or spawning behavior.

| Vessel | berthSlotId | Resolved x/y | heading | Manual duplicate coordinate remains? |
| --- | --- | --- | ---: | --- |
| harbor-small-workboat | small-work-west | 700 / 1020 runtime | 0 | No — resolver overrides source geometry |
| harbor-dinghy | utility-pocket | 980 / 1114 runtime | 0 | No — resolver overrides source geometry |

## M. Duplicate Source-of-truth Elimination

The JSON entries contain the standard placement shape needed by layout data, but their B3 vessel `x/y` values are not used at runtime. The regression test deliberately corrupts those raw coordinates and verifies that the resolver still returns each slot's `x/y/heading`; an invalid berth ID fails explicitly.

## N. Regression Tests

The suite increased from 27 to 30 tests. New executable coverage restores all six review overlap fixtures, checks the final local scene, rejects dry buoy and disconnected gangplank fixtures, verifies final semantic passes, and proves B3 berth resolution survives incorrect raw vessel coordinates.

## O. Broad Local Sweep

An independent rendered-geometry sweep of all seven Batch 03 items against nearby Batch 02 waterfront props, support architecture, the west pier, service jetty, and one another returned `material overlap = 0`. The only permitted physical relationship is gangplank ↔ small-workboat; it is compositionally required and separately validated.

## P. Collision / Navigation Protection

All seven Batch 03 entries remain `collidable: false`. Collision rectangles, water carve-outs, routes, IA, player movement, world dimensions, and protected walking surfaces are unchanged. Gangplank also has an explicit protected-navigation clearance check.

## Q. Depth / Occlusion

No magic depth value or band changed. Vessels retain `getVesselDepth`; rope and net retain existing low-prop behavior through their established types; cart retains BODY behavior; buoy and gangplank were added to the existing `LOW_PROP` type set. No new occlusion policy exists.

## R. Runtime Preload

The canonical normal-production `BootScene` preload was independently recomputed from the manifest and source files: pre-hotfix `691,006` bytes; post-hotfix `691,006` bytes; delta `0`. Batch 03 remains `31,239` bytes within that unchanged preload. No PNG changed.

## S. QA

From `portfolio-world/`: `npm ci`, `npm run typecheck`, `npm test`, and `npm run build` pass. `npm test` reports 30/30 passing. Repository-root `git diff --check` passes. Build output is refreshed under `world/`.

## T. Deferred Minor Findings

The independent review's small-workboat and dinghy scale-band documentation notes, per-asset Batch 03 audit-record note, and preload optimization note remain deferred. They are not changed by this integration hotfix.

## U. Files Changed

- `portfolio-world/src/world/worldLayoutData.json`
- `portfolio-world/src/world/worldTypes.ts`
- `portfolio-world/src/world/harborVisualCatalog.ts`
- `portfolio-world/src/world/landmarkCatalog.ts`
- `portfolio-world/src/world/worldDepth.mjs`
- `portfolio-world/src/world/layoutValidation.mjs`
- `portfolio-world/src/world/berthingPlacement.mjs`
- `portfolio-world/src/world/worldLayout.ts`
- `portfolio-world/tests/spatial-layout.test.mjs`
- `world/` production build output
- project status and handoff documents

## V. Final Gate

All six reported material overlaps are closed; Batch 03 is covered by the validator and regression suite; broad-sweep material overlap is zero; buoy is semantic and water-contained; gangplank connects vessel and dock; static slots drive B3 runtime placement; secondary stays `40/40`; collision/navigation and preload are unchanged.

`READY_FOR_BATCH_03_SHORT_RECHECK`
