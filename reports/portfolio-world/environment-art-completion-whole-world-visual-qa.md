# Environment Art Completion — Independent Whole-world Visual QA

Date: 2026-09-24 (Asia/Seoul)

## A. Gate

Starting gate: `READY_FOR_ENVIRONMENT_ART_WHOLE_WORLD_VISUAL_QA`. This is an independent visual-quality review of the completed Environment Art Completion production pass (`reports/portfolio-world/environment-art-completion-production.md`). It does not redo the automated harness, and it does not touch V1-accepted architecture, collision, routes, buildings, or fleet.

## B. Reviewed State

- Branch: `feature/portfolio-world-environment-art-completion`
- Runtime commit under review: `3e31b27` — feat(portfolio-world): complete environment art pass
- Worktree at review time: clean (`git status` — nothing to commit)
- No source, layout, or asset file was modified during this review.

## C. Visual Inspection Method

The actual running application was rendered and inspected — not judged from source, JSON, or the production report's own claims:

1. `npm run dev` (Vite dev server) started locally; Playwright (Chromium, headless) launched and driven against `http://localhost:5173/`.
2. Two capture methods were used, both against the real running app:
   - The project's existing, pre-existing dev-only camera framings (`?assetPreview=scaleReview&scaleView=world|guild|academy|workshop|exhibition` and `?assetPreview=batch01&batchView=harbor`) — code-defined presets already used by prior QA passes for this exact purpose. No runtime or layout code was added or modified to produce them.
   - Real player-driven movement from spawn (WASD/Arrow keys, held for time-based distances) to Harbor Square, each of the four destination forecourts, the exhibition promenade, and the waterfront, confirming natural in-game camera framing and the actual forecourt interaction prompts (e.g., "Academy: press E or Enter to open" was observed live).
3. 15 full-resolution screenshots were captured and visually inspected: a whole-world overview, one close framing per destination, a wide harbor composite, and 9 movement-driven frames covering the spawn view, all four approaches, the exhibition promenade, and three waterfront/shoreline angles.
4. Browser console was monitored for the full session: **0 console errors, 0 page errors** across all 15 captures and all navigation.
5. Suspect visual elements were cross-checked against source (`harborVisualCatalog.ts`, `worldLayoutData.json`) only to identify root cause for the report — not to fix or change anything.

## D. Whole-world Composition

The whole-world overview (zoom 0.4) shows one coherent settlement: Academy (north, domed hall), Guild Hall (west, blue-roofed), Workshop (east, orange-roofed), Exhibition Hall (south, classical white/teal) around Harbor Square, with the waterfront and fleet along the south edge. The macro terrain masses read as soft tonal variation rather than a visible grid, and the four destinations are immediately distinguishable by silhouette. This part of the pass's goal is met.

However, the same overview is where a Major defect (Finding 1, below) is most visible: a long diagonal line cuts across the top of the map, inconsistent with everything else in the frame.

## E. Harbor Square

The plaza reads as an open, asymmetric paved cross with a central navigation monument, benches/planters concentrated off-center, and the previously-reviewed restrained paving wear (small ~40 px crack marks at the four path/plaza junctions, `drawHarborNaturalizedGroundDetails`) — these are subtle and read correctly as wear, not as artifacts. The square remains the visual breathing space it was accepted as in prior Human Review.

## F. Guild Hall

Clearly readable on approach: compass-rose gable, anchors, banners, "Guild Hall" signage. The west world-edge line (Finding 1) is visible in the background of this approach, running the full height of the map just past the Hall — this is the one instance where the defect sits directly behind a primary destination building.

## G. Academy

Clearly readable: domed hall, spires, "Academy" signage, forecourt prompt fires correctly on approach. The north world-edge diagonal line (Finding 1) is the most visible instance of the defect, cutting across open grass directly above the building in both the fixed framing and real movement approach.

## H. Workshop

Clearly readable: orange roof, gear/tool signage, working yard (crates, barrels, worktable, tool rack, cart). The east world-edge line (Finding 1) is visible at the right edge of the frame. Additionally, this is where Finding 2 (compacted-ground patch) and Finding 3 (pre-existing ground-detail flecks) sit — see below.

## I. Exhibition Promenade

Clearly readable: classical white/teal facade, "Exhibition Hall" signage, display board, viewing terrace, flags. The Hero ship moors directly east of the Hall with a clean gap — no overlap with the building silhouette. The promenade reads as populated-but-walkable, consistent with the prior Batch 04 acceptance.

## J. Waterfront / Fleet

The fleet composition is unchanged and reads well: the Hero ship remains the dominant, most detailed vessel; secondary vessels and small boats show mixed facing; hull separation between moored vessels is clean in every captured frame. The water itself now shows the intended deep/shallow layered bands, a foam highlight line, and offset ripple dashes — a clear improvement over a flat single-tone fill, and no repeated/tiled wave stamp is visible.

## K. Shoreline / Path Transition

At dock edges, the grass-to-dock-to-water sequence reads cleanly (this is where most of the shoreline is, since docks front most of the waterfront). At the open (non-dock) shoreline segments, the transition is a clean shallow-band-then-deep-band color change with visible foam-line texture — a real improvement over the prior flat/hard-edged water, though it still reads as a band-to-band change rather than a fully organic wet-sand gradient (Polish note, Finding 6).

## L. Findings

### Blocker

None.

### Major

**1. World-edge boundary treatment renders as a long diagonal streak, not a border/highlight.**

`drawHarborEdgeTreatment()` (`portfolio-world/src/world/harborVisualCatalog.ts`) draws each edge decoration rectangle's accent line with:

```ts
graphics.lineStyle(3, COLORS.greeneryLight, 0.72).lineBetween(
  edge.x - edge.width / 2, edge.y - edge.height / 2,
  edge.x + edge.width / 2, edge.y + edge.height / 2,
);
```

This connects the rectangle's top-left corner to its bottom-right corner. For the north/south edges (2048 × 64 px) this produces a near-horizontal diagonal line running the **entire 2048 px width of the world**; for the west/east edges (64 × 1152 px) it produces a near-vertical diagonal running the entire height. The result is clearly visible as a stray-looking bright-green diagonal scratch across open grass in the whole-world overview and in the Academy (north), Guild Hall (west), and Workshop (east) approach framings — the south edge shares the same code path and almost certainly shows the same artifact along the waterfront, though it was harder to isolate visually against the fleet/dock detail there.

This directly reproduces the "residual mockup character" / flat-geometric-artifact impression that this pass's own Human Visual Feedback (production report, Section D) was chartered to remove, and it sits in the same file this pass edited. It was not caught by the pass's own production visual inspection (production report Section V: "no Blocker or Major was observed").

Note on origin: `drawHarborEdgeTreatment()` itself was **not** modified by this batch's diff (commit `3e31b27` only changed `drawHarborPath`, `drawHarborPlaza`, and the water/ground functions) — this is a pre-existing defect, not one newly introduced by this pass. It is reported here because whole-world Visual QA scope is the current rendered state, and this pass's stated goal (removing grid/mockup-like ground artifacts) makes it squarely in-scope.

**Recommendation:** replace the corner-to-corner `lineBetween` with either a proper border/stroke (e.g., `strokeRect`) or two edge-aligned lines, so the accent reads as a boundary highlight rather than a diagonal slash. Visual-only change; no collision/layout/route impact expected.

### Minor

**2. Workshop/waterfront "compacted-ground patches" read as visibly rectangular rather than blended.**

`drawHarborGround()` draws the two compacted-ground patches as:

```ts
graphics.fillStyle(COLORS.groundDry, 0.22);
graphics.fillRoundedRect(1440, 704, 408, 184, 22);
graphics.fillRoundedRect(112, 826, 548, 166, 20);
```

At normal gameplay zoom, both patches (Workshop-adjacent and Guild/waterfront-adjacent) are visible as distinctly rectangular, hard-cornered tonal shapes rather than an organic compacted-earth blend — the 20–22 px corner radius is too small relative to the ~400–550 px patch size to soften the silhouette. This partially undercuts this pass's own "Workshop ground: PLACEHOLDER → compacted gravel patches → PRODUCTION_READY" classification (production report Section E): the shape reads as geometric rather than natural.

**Recommendation:** increase the corner radius substantially and/or add a soft alpha falloff at the edges (e.g., layered progressively smaller/lighter rounded rects) rather than one hard-edged rounded rectangle.

**3. Pre-existing ground-detail flecks remain visible (carried forward, no new action).**

Small gray filled triangles at fixed world coordinates (`drawHarborNaturalizedGroundDetails`, plaza-corner shoulder decorations, and separately the small gravel-gouge marks near the Workshop patch) are visible near the Workshop yard and the plaza/waterfront transition. This is the same element already identified and explicitly accepted as non-blocking by the Batch 04 Whole-world Visual QA (`reports/portfolio-world/batch-04-whole-world-visual-qa.md`, Section P: "pre-existing procedural ground-detail flecks... No action needed"). Re-confirmed present and visually unchanged by this pass. Recorded here for completeness only; not a new finding and does not need separate action.

**4. Vite >500 kB JS chunk warning (carried forward, deferred).**

Unchanged from every prior report; unrelated to this pass's visual work.

### Polish

**5. Whole-world zoom-out label proximity.**

At the `scaleView=world` zoom (0.4×, dev-only QA framing, not the player's normal camera), the "Harbor Square" label sits close to the central navigation-monument icon. At normal gameplay zoom (1×) this is not an issue — confirmed in real player-movement screenshots. Cosmetic only; no action required.

**6. Open-shoreline transition is clean but still band-like.**

Non-dock shoreline segments now show the intended deep/shallow water bands and a foam-line highlight (a clear improvement over the prior flat/hard-edged water), but the grass-to-water edge itself is still a fairly abrupt color-band change rather than a fully organic wet-sand/foam gradient. Optional future refinement; does not block.

## M. Technical Hygiene

- Console/page errors across the full session: **0**.
- No layout, collision, route, building, or fleet data was read as changed from the accepted V1 baseline; only ground/water rendering (`harborVisualCatalog.ts`) was in scope for this pass, matching the production report's stated diff.
- No file was modified during this review.

## N. Verdict

Blocker = 0, Major = 1, Minor = 2 (new: the ground-patch rectangularity; carried forward: pre-existing ground flecks, Vite chunk warning), Polish = 2. The whole-world composition, all four destinations, and the waterfront/fleet are readable and cohesive, and the water/shoreline work is a genuine improvement over the prior flat treatment. The world-edge diagonal-line defect (Finding 1) is visually prominent enough in a whole-world/destination-approach context — and specifically contradicts this pass's own "no grid/mockup artifact" goal — that it should be fixed before Human Review rather than deferred.

**This pass is not yet ready for Human Review.** A short, scoped repair (Finding 1 only; Finding 2 optional/at implementer's discretion) followed by a short re-check is recommended before Human Review, consistent with the project's established Production → Harness → Visual QA → repair → short re-check → Human Review flow.

## O. Next Gate

```text
READY_FOR_ENVIRONMENT_ART_MAJOR_REPAIR
```
