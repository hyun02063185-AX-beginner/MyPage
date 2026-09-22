# Portfolio World — Visual Pass 5 Pre-review

## Retro Harbor Campus — Art Style Application

Reviewer: Claude Code — Sonnet 5
Role: Independent pre-implementation reviewer (plan review only; no runtime changes made)

---

## A. Gate

```text
DESIGN_READY_FOR_DIRECTOR_GATE
```

The Visual Pass 5 Director Plan is well-scoped, consistent with `retro-harbor-campus-art-direction-v1.0.md`, consistent with the approved Pass 4 composition, and implementable entirely within the current programmatic rendering architecture. No redesign is needed. Three concrete, code-grounded findings (Section V) should be carried into the Codex implementation step — one real rendering defect in the current dock/pier drawing code, one palette-duplication risk that Pass 5's own "color palette refinement" task will otherwise aggravate, and one documentation gap in the project's own canonical records. None of these require changing the plan document itself.

---

## B. Work Context

| Field | Value |
|---|---|
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | win32 x64 |
| Branch | `feature/portfolio-world-sprint-02` |
| HEAD | `c658d35` (`docs(portfolio-world): add visual pass 5 director plan`) |
| Git status | clean |
| Node / npm | v24.16.0 / 11.13.0 |

`npm test` (typecheck + build + `node --test`) was run to confirm the current baseline: **7/7 tests pass**, build succeeds at 1,407.32 kB / 365.77 kB gzip (matches the figure cited in the review assignment exactly). The build regenerated `world/index.html` and `world/assets/index-J3llFWZa.js` with line-ending-only churn (no content diff); those two files were reverted with `git checkout --` to keep the tree clean before writing this report. No source or gameplay file was modified.

---

## C. Source State

Read directly: `retro-harbor-campus-art-direction-v1.0.md`; `visual-pass-04/00-director-gate.md`, `06-claude-focused-verification.md`, `07-human-visual-feel-test.md`; `visual-pass-05/00-director-plan.md`; `docs/portfolio-world/{02_WORLD_IA,04_ARCHITECTURE,06_QA_RELEASE_POLICY,07_ASSET_POLICY,08_ENVIRONMENT_POLICY,90_DECISIONS,91_STATUS,92_HANDOFF}.md`.

One gap worth naming here rather than fabricating past it (see Finding VP5R-03): `visual-pass-04/07-human-visual-feel-test.md` is the unfilled question template (every choice block still lists the raw options, free-form notes are still `...`), and `91_STATUS.md`/`92_HANDOFF.md` at current HEAD both still read Pass 4's user test as **PENDING**. The Pass 5 Director Plan nonetheless states Pass 4 is "approved by user" as settled fact. I'm treating that as true for this review (it is consistent with the plan's own framing and with what the Director was told directly), but the git-canonical record does not yet reflect it.

---

## D. Layout Lock

```text
LAYOUT_LOCK_APPROPRIATE
```

Read `worldLayoutData.json` directly. Harbor Square, the four destination buildings, both inner-harbor basins, the dock/peninsula, the large ship, all four small boats, and all three reserved lots match the values verified byte-identical in the Pass 4 focused-verification review. The Pass 5 plan does not propose touching any of these, and correctly frames itself as a styling pass over locked geometry, not a composition pass.

---

## E. Art Direction

```text
ART_DIRECTION_CLEAR
```

The Pass 5 plan is a faithful, appropriately-scoped interpretation of `retro-harbor-campus-art-direction-v1.0.md` — mood, material language (water/wood/stone/greenery), the World-is-retro/UI-is-modern split, and the avoid-list all carry through correctly. The "still open" items the art-direction doc deliberately deferred (exact palette values, final tile scale) are exactly what this pass is now meant to resolve at prototype fidelity — that's the correct order, not a gap.

---

## F. Palette

```text
ADD_MINIMAL_STYLE_CONSTANTS
```

A palette already exists — `harborVisualCatalog.ts` defines a single `COLORS` object (31 keys: ground, stone, water, wood, roof, per-zone accents for academy/guild/workshop/exhibition, greenery, gold, ink, lamp, label) that is already organized close to what the Director Plan's 9.1 asks for. The actual gap: `streetscapeVisuals.ts` defines its **own separate** `COLORS` object with 11 keys, 9 of which overlap by name and currently match by value (ink, stone, stoneShade, wood, woodDark, gold, greenery, greeneryLight, water) — hand-duplicated literals with no shared import and nothing enforcing they stay in sync (Finding VP5R-02). Since Pass 5's primary task is refining exactly these values, I recommend a narrow `visualPalette.ts` exporting the shared tokens, imported by both files — not a new taxonomy, not a theming engine.

---

## G. Harbor Square

```text
HARBOR_SQUARE_STYLE_NEEDS_REFINEMENT
```

All the required components are already placed and rendered: navigation monument (`drawNavigationMonument` — armillary-style rings, cross-axes, needle), four planters, two benches, four lamps, a harbor sign, a market kiosk. `drawHarborPlaza`, however, is currently a flat stone fill with a light grid overlay and a single-weight border stroke — it does not yet deliver the "cleaner paving language / stronger visual framing / arrival feeling" the plan asks for in 8.1. This is a refinement of an existing function, not new scope.

---

## H. Destination Buildings

```text
BUILDING_IDENTITY_NEEDS_REFINEMENT
```

The foundation is stronger than a from-scratch task: `drawHarborBuilding()` already gives each of the four buildings a distinct hand-drawn silhouette (Guild: peaked roof + medallion + framed notice panel; Academy: pediment + flanking columns; Workshop: plank siding + exposed beams + tool-like circle motif; Exhibition: portico band + two window frames + dark central "artwork" panel), and each zone already carries role-appropriate supporting props from `worldLayoutData.json` (Guild: notice-board, route-map, registry-stand, flag; Academy: study-garden, academic-sign, tree, banners; Workshop: worktable, tool-rack, cart, timber-stack; Exhibition: display-board, viewing-terrace). Pass 5's job is to deepen this existing differentiation (roofline weight, trim bands, signage rendering quality), not invent it.

### Guild — practical/historical cues present, roofline could read stronger against Academy's.
### Academy — pediment/column motif reads correctly as "calmer/refined" vs Workshop.
### Workshop — plank + beam language is legible; could use one more "active" cue (Director Plan 8.4).
### Exhibition — portico + skylight strip is already the most "clean/organized" of the four, consistent with 8.5.

---

## I. Water

```text
PROGRAMMATIC_WATER_STYLE_SUFFICIENT
```

This is the area with the largest gap between current implementation and Pass 5's ambition, and the plan is right to call it out (Director Plan 8.6, 9.4). `drawWater()` currently does one flat fill plus a uniform pair of short wave-line strokes repeated every 72 px — identical treatment for the south open sea and both enclosed inner basins, with no depth cue and no edge contrast against dock/land. All of the improvements the plan asks for (inner-basin-vs-open-sea distinction, edge contrast, subtle wave language) are achievable with more `fillStyle`/`lineStyle` layering inside the existing function — no shader, no particle system, no architecture change is needed to hit this pass's water goals.

---

## J. Dock / Pier

```text
DOCK_STYLE_NEEDS_REFINEMENT
```

`drawDock()` already renders plank seams and mooring posts with rope lines, but it has a real, currently-shipping defect (Finding VP5R-01): its five mooring-post x-offsets are hardcoded absolute pixel values tuned for the 448 px-wide `waterfront-dock`. The same function also renders both 160 px-wide piers (`harbor-pier-west`, `harbor-pier-east`), where two of those five offsets land 64–176 px past the pier's right edge — a mooring post and its connecting rope currently render floating over open water. Pass 5's own scope (5.3, 8.6, 12 — "mooring posts", "plank segmentation") will touch and visually emphasize exactly this code, so it should be fixed as part of this pass, not treated as pre-existing and out of scope.

---

## K. Large Ship

```text
LARGE_SHIP_HELPER_REFINEMENT_REQUIRED
```

`drawLargeShip()` already has a hull silhouette, a deck band, a mast, one sail, and two trim details — a reasonable placeholder, but not yet the "designed landmark" Pass 5's success criteria (Director Plan Section 10.2) call for. A second sail or clearer mast hierarchy, a hull outline/shadow pass, and light rigging lines are all achievable inside the existing function with no new architecture or asset.

---

## L. Small Boats

```text
SMALL_BOAT_STYLE_NEEDS_REFINEMENT
```

All four small-boat placements (`waterfront-boat`, `harbor-basin-boat`, `harbor-cargo-boat`, `harbor-offshore-boat`) currently render through the same `drawBoat()` silhouette, differentiated only by the `width`/`height` each is instantiated with in `worldLayoutData.json`. Director Plan 14 asks for actual silhouette variation (sail/no-sail, trim, cargo hint) — currently there is none beyond uniform scaling.

---

## M. Support Structures

```text
SUPPORT_STYLE_READY
```

`drawWarehouse()` and `drawCargoShed()` are already differentiated exactly as the art direction intends: warehouse uses the heavier stone-shade wall + dark roof + loading-bay language, cargo shed is the simpler all-wood shed. Both remain visually secondary to the four destination buildings. No refinement is required to meet this pass's bar; only the general palette-source-of-truth fix (Finding VP5R-02) touches this file indirectly.

---

## N. Greenery / Dressing

```text
DRESSING_STYLE_READY
```

Greenery currently concentrates at the Academy (study-garden, tree, banners) and Harbor Square (planters), while Guild Hall and Workshop carry none. This matches the art direction's intended material split (Academy = garden/calm vs. Guild = stone+wood/historical, Workshop = wood/craft) rather than being an oversight, so I'm not calling it a gap. One thing worth the Director's judgment call, not a required fix: Guild Hall and Workshop currently read slightly "drier" than the other three zones — a single restrained prop (not a tree) at each could soften that without diluting their material identity.

---

## O. Rendering Architecture

```text
ADD_STYLE_CONSTANTS_MODULE
```

Everything else about the current architecture is sufficient for Pass 5 as scoped: `WorldScene.renderWorld()` builds all `Graphics` objects once at scene `create()` (not per-frame), the visual dispatch in `harborVisualCatalog.ts` is exhaustive and fails loudly on an unhandled type, and `streetscapeVisuals.ts` already exists as the correct place for focused drawing primitives. The one concrete addition is the shared palette module from Section F/Finding VP5R-02 — narrowly scoped, matching the plan's own instruction to avoid a theme engine.

---

## P. Programmatic vs Assets

```text
PROGRAMMATIC_ONLY_FOR_PASS_5
```

Nothing found in the current code suggests a genuine blocker to staying programmatic-only. Every review item above (water, dock, ship, boats, buildings, square) is achievable by extending existing draw functions with more `fillStyle`/`lineStyle`/`strokeRect` calls, consistent with every prior pass in this project.

---

## Q. UI / World Boundary

```text
WORLD_UI_BOUNDARY_CLEAR
```

Verified directly: `world.css`'s `.world-header`/`.world-footer`/`.portfolio-link` use a clean monospace-on-dark-navy modern shell, entirely separate from the Phaser canvas (`#portfolio-world-root canvas { image-rendering: pixelated }` is scoped to the canvas only). `main.ts` mounts the game into that shell without any retro styling leaking into the HTML chrome. Pass 5's scope (Section 6 of the Director Plan) correctly excludes touching this boundary.

---

## R. Navigation / Accessibility

```text
WAYFINDING_RISK_LOW
```

Pass 5 as scoped only touches fill/stroke drawing, not collision geometry, path/forecourt data, or keyboard/focus handling (`Player.ts`, `WorldScene`'s key bindings and blur-reset are untouched by anything in scope). The one process risk worth naming: Pass 4's actual regression (submerged waterfront props) came from a visual/collision mismatch introduced while repositioning land-side props near water. Any Pass 5 work that *moves* a prop's rendered footprint (as opposed to just repainting it in place) must be re-checked against the same `LAND_SIDE_PROP_TYPES`-vs-water validation category in `layoutValidation.mjs` that caught that bug.

---

## S. Performance

```text
NO_SPECIAL_PERF_WORK
```

All drawing happens once at scene creation via one `Graphics` object per catalog call, not per frame — adding more strokes/fills to existing draw functions (water banding, ship rigging, dock planks) does not change that pattern or introduce new per-frame cost. Bundle size (1,407 kB / 366 kB gzip) is a pre-existing, already-tracked follow-up in `91_STATUS.md` unrelated to Pass 5's scope.

---

## T. QA Strategy

```text
CURRENT_TESTS_PLUS_VISUAL_QA
```

The existing seven automated tests validate layout data shape, water-collision geometry, pier walkability, vessel containment, and reserved lots — exactly the invariants a pure-visual pass must not regress, and they require no new categories since Pass 5 does not add or move collidable geometry. Visual quality itself (palette coherence, silhouette clarity) is correctly a human/screenshot judgment, not a pixel-perfect automated test, consistent with this project's stated QA layering (`06_QA_RELEASE_POLICY.md`).

---

## U. Evidence Plan

Minimum recommended for the Codex implementation report, adapted to this project's actual zones:

1. Harbor Square (full plaza, all four approach directions visible)
2. Guild Hall / Academy / Workshop side-by-side-style comparison (to judge silhouette + prop distinctness)
3. Exhibition Hall → waterfront promenade → dock transition
4. Wide harbor view: both inner basins, large ship, all four small boats in frame
5. Close-up on the large ship and on both piers (to confirm the mooring-post fix from Finding VP5R-01 and general dock/water contrast)

Before/after screenshots for water and the large ship specifically would be the highest-value comparison, since those are the two areas this review found furthest from Pass 5's stated bar.

---

## V. Findings

```text
ID: VP5R-01
Severity: Major
Finding: drawDock() in harborVisualCatalog.ts renders mooring posts and their
  connecting rope at five hardcoded absolute x-offsets (left+16, left+112,
  left+224, left+336, left+width-16) sized for the 448 px waterfront-dock.
  The same function also renders both 160 px-wide walkable piers
  (harbor-pier-west, harbor-pier-east). For those, offsets left+224 and
  left+336 fall 64-176 px past the pier's actual right edge.
Evidence: harborVisualCatalog.ts (drawDock, ~lines 350-365);
  worldLayoutData.json — waterfront-dock width 448 vs harbor-pier-west/east
  width 160 each. Confirmed by direct arithmetic against the committed
  geometry, not a screenshot.
Impact: A mooring post and a rope segment currently render floating over
  open basin water on both piers. Pass 5's own scope (5.3/8.6/12) explicitly
  targets "mooring posts" and "plank segmentation" on these exact piers, so
  the defect will become more visually prominent, not less, once styled.
Recommended action: Scale mooring-post x-positions relative to visual.width
  (evenly spaced, clamped within [left, left+visual.width]) instead of using
  absolute pixel constants, so drawDock() is correct for both dock widths.

ID: VP5R-02
Severity: Minor
Finding: harborVisualCatalog.ts and streetscapeVisuals.ts each define their
  own COLORS object. Nine keys overlap by name (ink, stone, stoneShade,
  wood, woodDark, gold, greenery, greeneryLight, water) and currently match
  by value, but there is no shared import — they are two independent literal
  tables kept in sync only by hand.
Evidence: harborVisualCatalog.ts lines 31-53; streetscapeVisuals.ts lines
  4-16.
Impact: Director Plan 9.1 makes "color palette refinement" a primary Pass 5
  task. Editing colors against two unlinked tables risks silent drift (one
  file updated, the other missed), with no test to catch it since color
  values aren't part of layoutValidation.mjs's checks.
Recommended action: Extract the shared subset into one small module (e.g.
  visualPalette.ts) imported by both files. Keep it a flat constant export —
  do not generalize into a theme system.

ID: VP5R-03
Severity: Minor (process/documentation)
Finding: reports/portfolio-world/visual-pass-04/07-human-visual-feel-test.md
  (committed at ea10019) is still the unfilled question template — every
  choice block lists only the raw options, free-form notes are still "...".
  docs/portfolio-world/91_STATUS.md and 92_HANDOFF.md at current HEAD both
  still read Visual Pass 4's user test as PENDING. The Pass 5 Director Plan
  states Pass 4 is "approved by user" as settled fact.
Evidence: git show ea10019 --stat (386 insertions, template file only);
  91_STATUS.md line 6 and line 59; 92_HANDOFF.md line 115.
Impact: 90_DECISIONS.md D-010 establishes git as the canonical record
  ("Git이 canonical. Chat은 작업실"). The canonical record and the decision
  Pass 5 is being built on currently disagree. Not a blocker — the actual
  approval was given directly to the Director — but it is a real gap in the
  project's own audit trail.
Recommended action: Fill in 07-human-visual-feel-test.md with the verdict
  actually given (or add a short closing note referencing it), and refresh
  91_STATUS.md / 92_HANDOFF.md to show Pass 4 as approved, ideally before or
  alongside the Pass 5 Director Gate.
```

No Blocker-severity finding was identified.

---

## W. Exact Recommended Codex Scope

In addition to the Director Plan's own Section 5 (ground/terrain, buildings, harbor elements, town dressing, identity cues):

- Fix the pier mooring-post/rope offsets in `drawDock()` (Finding VP5R-01) as part of dock/pier styling work.
- Introduce a small shared palette module and have both visual files import from it (Finding VP5R-02) before or while touching color values.
- Prioritize water (`drawWater`) and the large ship (`drawLargeShip`) — these are furthest from Pass 5's stated bar per Sections I and K above.
- Give the four small boats actual silhouette variation, not just uniform scaling (Section L).
- Re-run `layoutValidation.mjs`'s land-side-prop-vs-water checks if any prop's rendered footprint moves, not just its paint.

---

## X. Explicit Non-scope

Unchanged from the Director Plan Section 6: no new destinations, no portal/interaction functionality, no NPCs/dialogue, no interiors, no audio, no day/night cycle, no particle systems requiring runtime changes, no Tiled migration, no multiplayer/auth/backend, no production sprite pipeline, no binary art asset import requirement, and no reopening of the approved layout composition.

---

## Y. Decision Summary

```text
Layout:        KEEP_APPROVED_LAYOUT
Palette:       ADD_MINIMAL_STYLE_CONSTANTS
Rendering:     PROGRAMMATIC_ONLY_FOR_PASS_5
Architecture:  ADD_STYLE_CONSTANTS_MODULE
Water:         PROGRAMMATIC_WATER_STYLE_SUFFICIENT
Large Ship:    LARGE_SHIP_HELPER_REFINEMENT_REQUIRED
Performance:   NO_SPECIAL_PERF_WORK
QA:            CURRENT_TESTS_PLUS_VISUAL_QA
```

---

## Z. Final Recommendation

```text
DESIGN_READY_FOR_DIRECTOR_GATE
```

The plan requires no redesign and no changes to the plan document itself. Carry Findings VP5R-01/02/03 into the Director Gate and Codex implementation instruction as concrete, evidence-grounded scope items.
