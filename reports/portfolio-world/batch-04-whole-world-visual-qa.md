# Batch 04 — Whole-world Visual QA

Date: 2026-09-21

## A. Gate

Starting gate: `READY_FOR_BATCH_04_WHOLE_WORLD_VISUAL_QA`. This is an independent visual/composition review of the completed Production Pass; it does not redo Codex's automated harness work.

## B. Reviewed Commits

- Batch 04 runtime commit: `3ea8401` — feat(portfolio-world): complete whole-world environment pass
- Batch 04 docs commit: `7118497` — docs(portfolio-world): record batch 04 production pass
- Branch: `feature/portfolio-world-sprint-02`
- Worktree at review time: clean

## C. Visual Inspection Method

The Batch 04 production report explicitly deferred browser visual capture ("no browser surface was provided") to this pass. For this review, the actual world was rendered and inspected, not judged from JSON/reports:

1. Production bundle rebuilt (`npm run build` in `portfolio-world/`) — output byte-identical to the committed `world/` bundle (`git status` remained clean after the build).
2. Production preview served locally (`vite preview --base /MyPage/world/`) and confirmed HTTP 200.
3. Dev server started locally and driven with Playwright (Chromium) using the project's existing dev-only QA framing (`?assetPreview=scaleReview&scaleView=...` and `?assetPreview=batch01|harbor`), which are pre-existing, code-defined camera presets used by prior batches for exactly this purpose — no runtime or layout code was modified to produce them.
4. Twelve full-resolution screenshots were captured and visually inspected: whole-world overview (zoom 0.4), each of the four destinations at close framing, a waterfront/fleet composite (zoom 0.6, covering Harbor Square + all four approach zones + the full dock/fleet), and the four Batch 01-era single-building framings for a perspective cross-check.
5. `npm test`, `npm run typecheck`, and `git diff --check` were re-run as the technical sanity check permitted by this pass (not a re-implementation of Production Harness analysis).

## D. Whole-world Overview

The full-world screenshot shows one coherent, complete-looking settlement: Academy (north, domed hall), Guild Hall (west, blue-roofed), Workshop (east, orange-roofed), Exhibition Hall (south, classical white/teal), all arranged around Harbor Square, with the waterfront and fleet along the full south edge. No area reads as an obviously unfinished patch — every quadrant has legible ground texture, a distinct destination silhouette, and non-zero incidental detail. The green perimeter edge treatment is visible and continuous on all four sides. The world reads as one completed environment, not a set of disconnected staged areas.

## E. Harbor Square

Harbor Square remains the visual breathing space: a large paved cross-shaped plaza with a central navigation monument, a scattering of planters/benches/lamps concentrated at the corners, and a market kiosk — but the majority of the paved area stays open. Placement is asymmetric/naturalistic rather than mirrored, matching the "not overly symmetrical" and "not filled for density's sake" goals. No new Batch 04 placement (all four are trees/planters at the destination edges, not in the square itself) added any clutter here.

## F. Guild Hall Edge

The new `guild-edge-tree` sits at the far northwest corner of the approach, framing the outer edge without touching the building, its forecourt, or the civic props (notice board, route map, registry stand, bench, lamp, flag) already established at the entrance. The Hall itself remains fully unobstructed and formal in character (compass-rose gable, anchors, banners). The transition from the tree-lined edge into the civic entrance reads as intentional, not clipped or empty.

## G. Academy Approach

The new `academy-garden-tree-west` sits beside the existing study garden/bench, reinforcing the calmer, greener character of the approach without crowding the path or forecourt. The Academy's tall domed silhouette remains the dominant visual element in the frame from a distance; nothing placed by Batch 04 sits between the camera and the building on approach.

## H. Workshop Transition

The `workshop-transition-planter` sits at the western edge of the Workshop's working yard, between the plaza-facing path and the cart/timber-stack/tool-rack/worktable cluster. It reads as a soft marker of "civic space ending, work yard beginning" rather than a wall of clutter — there is no sudden density spike at the boundary, and the practical character of the yard (crates, barrels, worktable) is preserved. The Workshop building itself remains legible and unobstructed by the new placement.

## I. Exhibition Promenade

`exhibition-promenade-planter-east` sits along the south path/plaza edge, outside the Exhibition Hall's own forecourt and outside the dock. In the close Exhibition framing, the Hero ship (moored to the Hall's east side) keeps a clear gap from the building — it does not overlap or visually merge with the Hall's silhouette. The promenade in the wider waterfront composite reads as populated-but-walkable: display board, viewing terrace, flags, and now the one added planter, without feeling crowded or bare.

## J. Waterfront / Fleet

The waterfront composite (zoom 0.6 covering the full dock line) confirms the working-harbor read is intact: warehouse, cargo shed, crates, barrels, rope coils, a hand cart, and a work net cluster around the west basin, contrasted against the calmer plaza above it. The fleet is arranged with visible facing variety (vessels oriented toward and away from the camera on opposite sides of the basin), furled-sail silhouettes are visible on the standing rigging, and hull separation between adjacent moored vessels is clean — no two hulls visually overlap or merge in any captured frame. The Hero ship remains the largest, most detailed vessel and the clear focal point without dwarfing the Exhibition Hall itself (the Hall's roofline and facade stay fully readable above and beside the ship). Functional messiness (irregular crate/barrel/rope scatter) is present in the work zone without tipping into visual confusion — nothing overlaps unreadably.

## K. Destination Readability

| Destination | Verdict | Notes |
| --- | --- | --- |
| Guild Hall | CLEAR | Distinct blue-roofed hall with compass motif and anchors; new edge tree sits outside the sightline. |
| Academy | CLEAR | Tallest, most ornamented silhouette (dome + spires); new tree sits beside the study garden, off-axis from the direct approach. |
| Workshop | CLEAR | Orange-roofed hall with gear/tool signage and a visibly working yard around it; new planter sits at the yard's edge, not in front of the door. |
| Exhibition Hall | CLEAR | Classical white/teal museum facade with clear waterfront frontage; Hero ship stays separated from the building's silhouette. |

All four destinations are identifiable by silhouette/architecture alone; no Batch 04 prop, tree, or planter sits between the camera's approach and any building.

## L. Density / Balance

Density stays differentiated by zone, matching the Batch 04 classification: the dock/work zone is visibly the busiest environment, Harbor Square stays the most open, and the three destination approach zones (Guild, Academy, Workshop) plus the Exhibition promenade sit at a light-but-populated middle density — each received exactly one new reused prop, and none of the four approaches now reads as heavier than the destination building it serves. No single side of the map (east/Workshop vs. west/Guild vs. north/Academy) is visually overloaded relative to the others; all three land-side approaches remain comparably light, and the south/waterfront edge is the intentionally denser working zone.

## M. Transition Quality

All four changed transitions (Guild edge, Academy approach, Workshop yard entry, Exhibition promenade) read as gradual rather than abrupt: each added element is a single small tree or planter placed at the boundary, not a wall of new objects. Harbor, Square, Academy, Workshop, and Exhibition all share the same ground texture, prop art style, and camera angle, so the transitions between them feel like one continuous world rather than separately staged sets.

## N. Fleet Presence Stability

No Batch 04 change touched fleet placements, berth slots, ship assets, or fleet-adjacent zoning (confirmed in the diff: only `worldLayoutData.json`, `WorldScene.ts`, `layoutValidation.mjs`, and the corresponding test file changed, and the JSON diff is limited to the four new tree/planter entries). Visual inspection of the waterfront composite confirms the Hero ship's prominence, mixed left/right vessel facing, furled-sail impression, hull separation, and ship/building balance are all unchanged from what Production QA already accepted.

**Verdict: `FLEET_PRESENCE_STABLE`**

## O. Perspective Coherence

Buildings, vessels, large props, and ground/water all share the same painted, 15°-grammar visual style across every captured frame, including the two newly reused assets (`harbor-tree-02-v01`, `harbor-shrub-planter-v01`), which were already present elsewhere in the world and are simply reused, so no new perspective was introduced.

**Verdict: PASS** (broad sanity check only; the detailed 15° fleet audit was not reopened).

## P. Findings

No Blocker, Major, or new Minor findings were identified during this whole-world visual pass. One cosmetic observation, recorded for completeness only and not rising to Minor:

- A handful of small gray filled triangles appear scattered across the ground in several frames (e.g., near the Workshop yard and the plaza/waterfront transition). These are pre-existing procedural ground-detail flecks drawn at fixed world coordinates (`harborVisualCatalog.ts`, ground-detail pass), unrelated to any Batch 04 placement, and were not touched by this batch. No action needed.

The two historical deferred Minor findings (from Fleet Authenticity Production) were not reopened — Batch 04 did not touch fleet assets, occlusion, or overlap validation for those vessels, and nothing in this pass's visual evidence made them worse or more visible.

## Q. Human Review Readiness

Blocker = 0, Major = 0. All four destinations remain clearly readable, the four changed transitions read as intentional and gradual, fleet presence is stable, and the whole-world overview reads as one complete, balanced environment. The world is ready for milestone-level Human Review.

## R. Final Gate

```text
READY_FOR_BATCH_04_HUMAN_REVIEW
```
