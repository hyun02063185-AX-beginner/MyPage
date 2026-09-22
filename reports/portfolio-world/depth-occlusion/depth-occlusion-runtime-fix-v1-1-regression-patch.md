# Portfolio World — Depth / Occlusion Runtime Fix v1.1 Regression Patch

## A. Gate

```text
RETURN_TO_CODEX → READY_FOR_DEPTH_OCCLUSION_SHORT_RECHECK
```

The locked visual grammar remains `HYBRID_ORTHOGRAPHIC_2_5D`, camera elevation remains 15°, camera yaw remains 0°, and mass asset production remains on hold.

## B. Work Context

`HOME_WINDOWS`; Windows `win32 x64`; Node/npm `v24.16.0` / `11.13.0`; branch `feature/portfolio-world-sprint-02`. The starting tree was clean and `git pull --ff-only` was already up to date.

## C. Starting Commit

`01009a3 docs(portfolio-world): review depth occlusion runtime fix`.

## D. Independent Review Findings Addressed

Addressed DP-01 (world-edge greenery over water), DP-02 (viewing terrace classified as a body), DP-05 (body/face split window), DP-06 (duplicated Hero D offset), and DP-08 (missing regression coverage). Deferred findings remain deferred.

## E. Edge Greenery Root Cause

`drawHarborEdgeTreatment` put the background framing graphics in `GROUND_DETAIL` (20,000), while water is at 0. The dark-green edge strip therefore painted over south water and basin water.

## F. Edge Greenery Fix

The policy now explicitly separates `BACKGROUND_GROUND` (-40,000), `BACKGROUND_EDGE` (-20,000), and water (0). Ground is behind the edge; the edge is still visible where land permits it, while opaque water covers it. `getBackgroundEdgeDepth()` expresses this semantic rule without a catalog magic number.

## G. Viewing Terrace Root Cause

`viewing-terrace` was in `BODY_TYPES`, putting its flat 160 × 80 surface in the 80,000 world-object band. It consequently covered an actor standing on it and a low-prop lamp.

## H. Viewing Terrace Fix

`viewing-terrace` is now an explicit `FLAT_WALKABLE_TYPES` member in `WALKABLE_STRUCTURE` (40,000): water/ground < terrace < low prop/player. No dock, building, collision, or layout classification was broadened.

## I. Terrace Lamp Verification

The terrace lamp remains independently classified as `LOW_PROP` (60,000). The added regression test asserts terrace < lamp, so the platform cannot cover the lamp head.

## J. Hero D Offset Deduplication

`HERO_SHIP_WATERLINE_OFFSET_Y` and `getHeroShipWaterlineY()` now own Hero D's 18-pixel hull/waterline anchor. The asset placement, its depth, and the programmatic large-ship fallback all use the same helper. The Hero D/east-brig test uses that helper.

## K. Player Body / Face Depth Fix

`PLAYER_FACE_DEPTH_OFFSET` is 0.00001, below the 0.0001 stable-tie grid. The face remains over the body but an ordinary world-object tie cannot fall between them. `getPlayerFaceDepth()` makes the invariant explicit in the shared policy.

## L. Tests Added

Added pure regression tests for:

- background edge depth below harbor water;
- terrace depth above water and below a player standing on it, plus terrace below its lamp;
- no stable world-object tie slot between the player body and face.

The Hero ordering test now uses the shared waterline helper. Total suite count increased from 17 to 20.

## M. QA

The repository-owned port 4173 preview check found no stale process, so none was stopped. From `portfolio-world/`:

| Step | Result |
| --- | --- |
| `npm ci` | PASS — 19 packages, 0 vulnerabilities |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 20/20 |
| `npm run build` | PASS — `index-tdLPljhE.js`, 1,419.81 kB / gzip 368.96 kB; pre-existing chunk-size warning only |
| `git diff --check` | PASS |

## N. Visual Re-check

The rebuilt production preview loaded at `/MyPage/world/`. The depth relationships for the required frames were rechecked against the runtime layout: south and west edge treatments are below water; the terrace is above water and below the player and lamp; Hero D retains the later waterline than the east brig; and the Hall uses the unchanged shared body/contact ordering. Browser screenshots were not saved as repository evidence and are not claimed as committed artifacts.

## O. Preserved v1 Behavior

Hero D remains in front of the east brig when it has the lower-screen waterline. The Exhibition Hall retains behind-north / in-front-south player ordering. Labels remain above world objects, and docks remain above water.

## P. Collision / Layout Protection

No world dimensions, viewport, camera, assets, coordinates, sizes, IA, collision rectangles, water subtraction, service-jetty carveout, player movement, routes, or `BASE_URL` behavior changed. This patch changes depth policy and generated build output only.

## Q. Deferred Minor Findings

The Hall art/footprint width limitation, per-frame Phaser depth-sort cost, report-number cleanup outside this patch report, Scale Bible, Asset Weight Budget, upper-occluder architecture, day/night, vessel randomization, and berthing runtime remain out of scope.

## R. Files Changed

- `portfolio-world/src/world/worldDepth.mjs`
- `portfolio-world/src/world/worldDepth.mjs.d.ts`
- `portfolio-world/src/world/harborVisualCatalog.ts`
- `portfolio-world/src/scenes/WorldScene.ts`
- `portfolio-world/src/player/Player.ts`
- `portfolio-world/tests/world-depth.test.mjs`
- rebuilt `world/` production output

## S. Final Gate

```text
READY_FOR_DEPTH_OCCLUSION_SHORT_RECHECK
```
