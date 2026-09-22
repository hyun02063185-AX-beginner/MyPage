# Portfolio World — Retro Harbor Campus Visual Pass 2 Pre-review

Reviewer: Claude Code — Sonnet 5
Role: Independent pre-implementation reviewer (no runtime changes made)

---

## A. Gate

```text
READY_WITH_FIXES
```

Nothing in the Director Plan would damage navigation, architecture, expansion capacity,
or visual direction. Two concrete additions should be folded into Codex's scope before
implementation (reserved-lot data representation, spatial-overlap test coverage), plus
one implementation-guidance note (route length asymmetry) and one housekeeping item
(stale status docs). None of these require redesign.

---

## B. Work Context

| Field | Value |
|---|---|
| Profile | `CODYSSEY_SHARED_MAC` |
| Machine Context ID | `3c5410ed-2e15-4583-abb7-9de45a28bbe5` |
| OS | darwin x64 |
| Branch | `feature/portfolio-world-sprint-02` |
| HEAD | `e960261` (`docs(portfolio-world): record visual pass 1 independent review`) |
| Git status | dirty — two **untracked** files only, no modified tracked files: `reports/portfolio-world/visual-pass-01/05-human-visual-feel-test.md` and the new `reports/portfolio-world/visual-pass-02/` directory. No destructive risk; documented rather than treated as a blocker per instruction. |
| Node / npm | v24.21.0 / 11.19.0 |

Environment/machine-switch relative to last handoff (`HOME_WINDOWS`) is expected
multi-machine workflow, not a location judgment.

---

## C. Source / Repo State

**Documents read:**
- `reports/portfolio-world/art-direction/retro-harbor-campus-art-direction-v1.0.md`
- `reports/portfolio-world/visual-pass-01/00-director-plan.md`
- `reports/portfolio-world/visual-pass-01/03-codex-implementation.md`
- `reports/portfolio-world/visual-pass-01/04-claude-independent-review.md`
- `reports/portfolio-world/visual-pass-01/05-human-visual-feel-test.md`
- `reports/portfolio-world/visual-pass-02/00-director-plan.md`
- `docs/portfolio-world/02_WORLD_IA.md`, `03_REQUIREMENTS.md`, `04_ARCHITECTURE.md`,
  `06_QA_RELEASE_POLICY.md`, `07_ASSET_POLICY.md`, `08_ENVIRONMENT_POLICY.md`,
  `90_DECISIONS.md`, `91_STATUS.md`, `92_HANDOFF.md`
- Full current runtime: `portfolio-world/src/**`, `portfolio-world/tests/**`,
  `portfolio-world/public/**`

**Missing documents:** none for this pass — all Visual Pass 1 project records are
present on this machine this time (unlike the Visual Pass 1 review, where
`01-claude-pre-review.md` was absent). Nothing was fabricated.

**Current Visual Pass 1 implementation state (re-confirmed directly from code, not
assumed from the prior report):**
- `WorldScene.ts` (138 lines) orchestrates only; `harborVisualCatalog.ts` (282 lines) owns
  all drawing, with an exhaustive `HarborVisualType` switch (10 types) guarded by a
  `never`-typed `exhaustiveVisual` throw, and a second exhaustive switch
  (`exhaustiveBuilding`) over the 5 `WorldZoneId` values.
- `worldLayoutData.json` currently holds 21 `harborVisuals` entries: 3 primary
  (`navigation-monument`, `dock`, `water`), 12 secondary, 8 detail — plus 4 fixed
  buildings, 4 paths, 4 forecourts, 4 edge decorations.
- `layoutValidation.mjs` checks: rect validity, world-bounds, duplicate IDs (across all
  placement collections), unknown type, unknown tier, invalid/unexpected collision flags,
  and exactly-one-water. It does **not** check spatial overlap between a `harborVisual`
  and any path/forecourt/building rectangle — see Finding VP2-02.
- `portfolio-world/public/` contains only `.gitkeep` placeholders and a
  `GENERATED_DO_NOT_EDIT.txt` marker — zero binary assets exist anywhere in the project,
  confirming Visual Pass 1's programmatic-only claim at the filesystem level.

**Project-record hygiene note:** `docs/portfolio-world/91_STATUS.md` and `92_HANDOFF.md`
still read "INDEPENDENT REVIEW PENDING" / "USER VISUAL FEEL TEST PENDING," even though
both now exist in the repo (one committed, one on disk). See Finding VP2-04.

---

## D. Expansion Strategy

```text
ADD_RESERVED_LOT_METADATA
```

**Mechanism check (can buildings be added without restructuring `worldLayout.ts`?
Yes.)** `WorldLayout.buildings` is derived automatically from any `zones` entry whose
`id !== "plaza"`, and always gets `collidable: true`. Adding one new destination later
means: (1) extend the `WorldZoneId` union, (2) add one `zones` entry to the JSON, (3) add
one `case` to `drawHarborBuilding`'s already-exhaustive switch. That is additive, not a
restructuring, and TypeScript will force every touch point via the `never` guard.

**What's actually missing is data, not mechanism.** Nothing today marks any specific
empty area as reserved. Visual Pass 2's own density increase (target 25–45 detail props)
could easily consume the open ground that a future building would need, purely by
accident, since there is no record preventing it.

**Candidate locations.** The four primary paths form a cross through the plaza, creating
four large, genuinely open quadrant corners that touch no path, forecourt, or building
rectangle (verified by coordinate check against `worldLayoutData.json`):

| Quadrant | Adjacent to | Approx. open bounds (x, y) |
|---|---|---|
| NW | Guild Hall (west) / Academy (north) | x: 64–896, y: 64–608 |
| NE | Academy (north) / Workshop (east) | x: 1056–1952, y: 64–608 |
| SW | Guild Hall (west) / Exhibition Hall (south) | x: 64–992, y: 704–992 |
| SE | Workshop (east) / Exhibition Hall (south) | x: 1056–1952, y: 704–992 |

These quadrants are far larger than any single future building would need — recommend
reserving a modest parcel (comparable in scale to an existing forecourt/building
footprint, e.g. roughly 200–260 px wide) within each chosen quadrant, near its adjacent
route, rather than reserving the whole quadrant.

**Minimum count:** 3, matching the Director's requirement — one near Guild Hall (NW or
SW), one near Academy (NW or NE), one near Workshop (NE or SE). A 4th near the
waterfront (west of the current dock, along the water's edge, roughly x: 96–720,
y: 1120–1184) is feasible if the Director wants the optional Exhibition-side lot, but is
not required to hit the acceptance bar.

**Representation — smallest safe option:** add one new field to `WorldLayout`,
e.g. `reservedLots: readonly (WorldRect & Readonly<{ label: string; zone: PlacementZone }>)[]`,
populated in `worldLayoutData.json` and validated by `layoutValidation.mjs` for: in-bounds,
no duplicate ID (already covered if included in the shared `ids` set), and — the one new
rule — no overlap with any path, forecourt, building, or `harborVisual` rectangle. This
is one additive array, not a new subsystem.

**Preventing decorative consumption:** the validator should also reject any
`harborVisual` whose rectangle overlaps a `reservedLots` rectangle. That single rule is
enough to make "don't consume the reserved space" a build-time guarantee instead of an
authoring convention Codex has to remember by hand.

Reserved lots should render as ordinary low-density ground (grass, a paved patch, or at
most 1 non-collidable prop) using the existing catalog — no new visual type is required
just to represent "empty but reserved."

---

## E. Streetscape Data Model

```text
CURRENT_LAYOUT_MODEL_SUFFICIENT
```

The "landmark → breathing space → prop cluster → path → focal point → destination"
rhythm is an **authoring discipline** for how Codex places individual `harborVisuals`
entries — it does not require the runtime to know which props "belong" to the same
cluster. No code currently queries clusters as a unit. Introducing a formal
cluster-grouping record now would be structure with no functional payoff. The existing
flat array + `tier` + `zone` fields already give Codex everything needed to compose
clusters through placement alone, exactly as Pass 1 already did for the Harbor Square
bench/lamp/planter groupings.

---

## F. Visual Architecture

```text
SPLIT_STREETSCAPE_HELPERS
```

`harborVisualCatalog.ts` is 282 lines for 10 types. The route streetscape vocabulary in
the Director Plan (notice board, route map, market stall, study-court elements, tool
rack, worktable, cart, display board, viewing terrace, etc.) plausibly adds 10–15 new
`HarborVisualType` values, pushing the file toward 500–700+ lines. That is still a
single, comprehensible exhaustive switch (20–25 cases is not unusual for this pattern),
so **do not fragment `HarborVisualType` into per-route catalogs** — that would split the
one thing that currently guarantees "every type is rendered" (the `never` guard) across
multiple files and weaken it. Instead, once the file grows uncomfortable, extract
drawing-primitive helpers (e.g. a shared crate/rope/rect-with-frame helper reused by
several `case`s) into internal functions grouped by shared geometry — an internal
tidy-up, not a new layer. Re-evaluate `INTRODUCE_ROUTE_CATALOGS` only if the type count
grows well past Pass 2's scope; do not adopt it preemptively. A generic theme system
remains premature and is explicitly disclaimed by the module's own existing doc comment.

---

## G. Rendering / Asset Strategy

```text
PROGRAMMATIC_ONLY_STILL_SUFFICIENT
```

```text
MANIFEST_IF_FIRST_BINARY_ASSET_ADDED
```

Walked through every object category the Director Plan lists (trees/greenery, lamps,
market stall, signage, boat, dock, building façade cues, crates/barrels, garden elements,
workshop machinery silhouettes): each is expressible with the same rect/triangle/circle/
line primitives `harborVisualCatalog.ts` already uses, at the same or slightly higher
shape count per item. Nothing in the Pass 2 scope requires pixel-level asset fidelity
that Phaser Graphics primitives cannot approximate. This matches the user's own Visual
Pass 1 feedback (05-human-visual-feel-test.md): the open question raised was
**composition** ("건물사이 공간을 뭘로 채울지"), not that the graphics themselves looked
too primitive.

Recommend a single, explicit fallback trigger rather than a blanket "assets later"
deferral: if, after implementing route identity and density, the Waterfront quality-bar
route (Section H) still reads as flat or too geometric at normal play-camera scale,
re-open the asset question for a **small, targeted** set (e.g. boat, navigation
monument, one market-stall silhouette) rather than a general asset pass.

`07_ASSET_POLICY.md`'s manifest fields (Asset ID, source, license, status) are only
meaningful once a tracked binary exists; `portfolio-world/public/` currently holds zero
binaries. Trigger: the manifest must exist **before** the first binary asset file is
committed, not created speculatively now.

---

## H. Quality-Bar Route

```text
KEEP_WATERFRONT_QUALITY_BAR
```

Harbor Square → Exhibition Hall → Waterfront is the single area where the theme-defining
material (water) and the richest prop vocabulary (dock, moorings, boat, crates) already
coexist, making it the highest-value test of "does this approach the concept image."

One implementation caveat worth stating explicitly for Codex: `path-south` is only 208 px
long (versus 448 px for `path-west`/`path-east`), and roughly a third of that is already
occupied by `forecourt-gallery`. The full six-step rhythm
(landmark → breathing space → prop cluster → path → focal point → destination) will not
fit at the same pacing used on the Guild/Workshop routes. Recommend compressing the
pre-forecourt rhythm to 1–2 beats on this route, then treating the
dock + water area *south of the building* as a second, separate rhythm sequence
(destination → focal point → waterfront details) rather than trying to cram the whole
six-step sequence into the short northern approach alone.

---

## I. Route Identity Recommendations

### Guild Hall Route — Journey Street
- Material emphasis: stone + darker wood (matches existing `guild` fill `0x726252`)
- Secondary visual cue: travel/departure motifs (crates, a route-map stand) rather than
  color alone
- Prop-cluster ideas: (1) notice board + hanging flags near the forecourt, (2) travel
  crate stack + rope, (3) bench + lamp pairing along `path-west`, (4) small map-stand +
  low planter
- Quiet space: the stretch of `path-west` furthest from both Guild Hall and the plaza
  (mid-path) — keep it to a single bench/lamp pairing, nothing denser
- Expansion parcel: NW or SW quadrant corner, ~200–240 px wide, clear of `path-west`

### Academy Route — Learning Walk
- Material emphasis: light stone + greenery (matches existing `academy` fill `0xe3d5b8`)
- Secondary visual cue: vertical roof-spire silhouette already present on the building;
  echo verticality with taller planters/small trees rather than banners alone
  competing with it
- Prop-cluster ideas: (1) small study-court — 2 benches + a planter, (2) book/sign motif
  near forecourt, (3) paired banners flanking the entrance, (4) stepping-stone paving
  rhythm along `path-north`
- Quiet space: the plaza-facing end of `path-north`, kept open so the Harbor Square view
  north stays uncluttered
- Expansion parcel: NW or NE quadrant corner, near but not touching `path-north`

### Workshop Route — Maker Yard
- Material emphasis: wood + cargo/industrial accents (matches existing `workshop` fill
  `0x7c6045`, echoes the building's own crane accent)
- Secondary visual cue: an open-yard feel — worktable/cart silhouettes at yard scale,
  distinct from Guild's travel-crate framing even though both use crates/barrels
- Prop-cluster ideas: (1) worktable + timber stack, (2) cart + tool rack, (3) barrel +
  rope cluster near the forecourt, (4) material stack beside `path-east`
- Quiet space: keep the yard "active but walkable" — no cluster should narrow the usable
  width beside `path-east` below the existing bench/lamp offset pattern from Pass 1
  (~40–70 px off the path edge)
- Expansion parcel: NE or SE quadrant corner, adjacent to Workshop

### Exhibition Route — Waterfront Promenade
- Material emphasis: stone + water + clean wood (matches existing `exhibition` fill
  `0xd9d7c6` and the dock/water palette already implemented)
- Secondary visual cue: a "viewing terrace" orientation — cluster furniture to face the
  water/boat rather than scattering it symmetrically
- Prop-cluster ideas: (1) bench + lamp + flower planter facing the water, (2) display
  board + flag near the forecourt, (3) additional mooring/rope detail west of the
  existing dock, (4) a second, lighter crate/barrel grouping distinct from the existing
  dock cluster so the promenade doesn't read as a copy of Pass 1's dock dressing
- Quiet space: the open water surface itself and a short stretch of dock — do not prop
  every meter of the waterfront
- Expansion parcel: SW or SE quadrant corner set back from the water, or the optional
  west-of-dock waterfront terrace strip

---

## J. Density Recommendation

Starting point (Pass 1 actual): primary 3 tier-tracked (+4 buildings = 7 total
"structures"), secondary 12, detail 8.

Recommended Pass 2 envelope (deliberately mid-band, not the ceiling, to preserve the
Director's own rhythm/breathing-space requirement):

```text
Primary structures:    7–9   (existing 7; +1–2 only if a genuinely primary-scale
                               landmark, e.g. a market pavilion, is added — most new
                               Pass 2 elements should be secondary/detail, not primary)
Secondary anchors:      18–22 (~4–5 new per route + at most 1–2 more in the square)
Detail props:           28–36 (aim for the lower-middle of 25–45; hold back from 45
                               to keep breathing space real, not just permitted)
Reserved expansion lots: 3    (0–1 light non-collidable dressing item each, at most)
```

Harbor Square specifically should **not** grow much past its current 1 primary + 10
secondary count — the Director wants it to stay open; put Pass 2's growth into the
routes, not the hub. This also directly serves Finding VP2 carry-over item 1
(Section O) by making it structurally unlikely that the square stays at zero detail
props while everything else grows.

---

## K. Collision

- Default every new streetscape type (notice board, route map/stand, flags, banners,
  study-court furniture, worktable, cart, tool rack, display board, small kiosk, extra
  moorings/rope) to **non-collidable**, matching Pass 1's existing pattern.
- No new collidable category is currently justified: nothing in Section 7's proposed
  streetscape is large enough to look wrong to walk through, and no new functional
  building is in scope. If a large market kiosk or similar is added and judged
  wall-like, add it explicitly to `COLLIDABLE_HARBOR_VISUAL_TYPES` rather than defaulting
  new types to collidable.
- `createEnvironmentalCollision` builds one static body per collidable placement, once,
  in `create()` — going from 5 to even 6–8 static bodies (if a large prop is added later)
  is a non-issue for Arcade Physics; no pattern change needed.
- Real risk at higher density is **visual** overlap, not physics: a prop cluster
  drawn on top of a path or forecourt would look wrong even though it can't physically
  block the player (since it's non-collidable). Guardrail: keep the Pass 1 convention of
  offsetting clusters roughly 40–70 px clear of a path's edge, and enforce it at the data
  layer via the overlap check recommended in Section D/Finding VP2-02, not by convention
  alone.
- Reserved expansion lots: collider-light by policy — no collidable prop should be placed
  inside a reserved lot's rectangle, since that would defeat the point of keeping it
  buildable later.
- No new collision-specific tests are needed beyond the existing
  unexpected-collidable / water-must-be-collidable checks; the one test gap that matters
  is spatial overlap (Section M), which is a placement concern, not a collision-flag
  concern.

---

## L. Performance

```text
NO_SPECIAL_PERF_WORK
```

Confirmed the existing pattern generalizes safely: all drawing happens once inside
`renderWorld()` during `create()`; nothing in `WorldScene.update()` allocates Graphics;
`Player`'s own objects are created once and only repositioned. Growing from 21 to
roughly 50–65 `harborVisuals` (per the Section J envelope) is a 2.5–3x increase in static
GameObjects, which is trivial for Phaser/Arcade at this scale — hundreds of static
objects are routine. Static collider count stays essentially flat (5, or 6–8 at most, see
Section K). Text-object count should stay low since the Director explicitly discourages
text-heavy signage. The pre-existing Vite 500 kB chunk-size warning is a Phaser-bundle
issue, unrelated to content volume, and should not be used to justify optimization work
here.

---

## M. QA

```text
ADD_LAYOUT_CONSTRAINT_TESTS
```

`layoutValidation.mjs` currently has no spatial-overlap check between a `harborVisual`
(or the new `reservedLots`) and any path/forecourt/building rectangle — only world-bounds
and duplicate-ID checks exist today. At Pass 1's density (21 items) this gap was low-risk;
at Pass 2's target (~50–65 items across 4 routes) the odds of an accidental
prop-on-path or prop-on-forecourt placement rise materially, and nothing would catch it
before a human notices it visually.

**Minimum tests to add:**
1. Bounding-box overlap rejection: any `harborVisual` (or `reservedLot`) whose rectangle
   intersects a path, forecourt, or building rectangle should fail validation with a
   named error, mirroring the existing error style (`Unexpected collidable harbor
   visual`, etc.).
2. Reserved-lot record tests: in-bounds, non-overlap with all other placement
   collections (reuse test #1's logic), and — if the "collider-light" policy from
   Section K is encoded as data — no collidable `harborVisual` inside a reserved lot's
   rectangle.
3. If Pass 2 updates `DENSITY_CAPS` to reflect the new target range, extend the existing
   density-cap test case for the new numbers; keep the existing duplicate-ID and
   single-water tests unchanged, they remain valid.

No Playwright or browser automation is needed — these are pure data-shape checks via the
existing `node --test` runner, consistent with current test style.

---

## N. Accessibility / Wayfinding

- `index.html`'s ARIA region, exit link, keyboard-move footer text, and coarse-pointer
  fallback must remain untouched by this pass, exactly as in Visual Pass 1.
- Each destination currently has ≥3 non-color cues (fill, silhouette/roofline, role
  props) — Pass 2 must not reduce this margin. New signage/banners are **supplementary**
  cues only; no destination's identifiability may come to depend on a sign or banner
  being present or readable.
- Guardrail for Codex: do not add Phaser `text` objects that carry meaning not already
  redundantly available through shape/color/position (this directly serves the
  Director's own "without text-heavy UI" requirement in Section 7).
- Prop clusters must never be placed such that they visually cover a building's entrance
  cue (door/frame graphics) or a forecourt rectangle — ties directly to the overlap test
  in Section M.
- No new interactive or keyboard-bound behavior is introduced by any decorative prop;
  none is planned, and none should be added as part of this pass.

---

## O. Visual Pass 1 Carry-over Notes

1. **Detail-tier density low / zero in Harbor Square** → `NATURALLY_RESOLVED_BY_PASS_2`.
   Pass 2's own target (25–45 detail props) far exceeds Pass 1's 8, and the density
   recommendation in Section J explicitly calls for at least a small detail-tier presence
   in the square itself so it isn't just the routes that gain richness while the square
   stays at zero.

2. **Screenshot evidence didn't show the boat or a 4-destination comparison** →
   `FIX_IN_PASS_2`. Cheap to correct, and Pass 2's own acceptance criteria already
   require proving the Waterfront route hits the quality bar — that proof needs a
   waterfront shot that includes the boat, and the "four routes are distinguishable"
   acceptance line needs a shot showing multiple destinations together. Recommend Codex's
   implementation evidence explicitly include both.

3. **`edge-south` decoration hidden behind waterfront water** → `IGNORE`. It produces zero
   visible or functional difference either way; not worth review or implementation
   attention as a standalone item. If Codex happens to touch the waterfront edge
   decorations for other Pass 2 reasons, dropping the redundant strip is a free
   opportunistic cleanup, not a required action.

---

## P. Findings

**VP2-01 — Minor**
Finding: No data-level representation exists yet for "reserved expansion lots," so
nothing currently prevents Visual Pass 2's density increase from consuming the open
areas a future building would need.
Evidence: `worldLayoutData.json` has no field beyond `zones`/`paths`/`forecourts`/
`harborVisuals`/`edgeDecorations`; none of these express "reserved, currently empty."
Impact: Without an explicit record + validation rule, "don't fill every empty space" is
only an authoring convention Codex has to remember, not a guarantee.
Recommended action: Add the `reservedLots` field and the overlap-with-reservedLots
validation rule described in Section D before/at the start of Pass 2 implementation.

**VP2-02 — Minor**
Finding: `layoutValidation.mjs` has no spatial-overlap check between `harborVisuals` and
paths/forecourts/buildings.
Evidence: `layoutValidation.mjs` — the only geometric checks are `assertRect` (bounds/
positivity/in-world-bounds) and duplicate-ID; no pairwise-rectangle-intersection logic
exists anywhere in the file.
Impact: Low risk at Pass 1's 21-item density; materially higher risk at Pass 2's
targeted ~50–65 items, where an accidental prop-on-path placement would only be caught
by a human noticing it visually rather than by CI.
Recommended action: Add the bounding-box overlap test described in Section M as part of
Pass 2's test additions.

**VP2-03 — Minor (implementation guidance, not a defect)**
Finding: `path-north`/`path-south` are 208 px long versus 448 px for
`path-west`/`path-east`, and roughly a third of each short path is already occupied by
its forecourt — the Director's six-step streetscape rhythm will not fit at Guild/
Workshop pacing on the Academy or Exhibition routes.
Evidence: `worldLayoutData.json` — `path-north`/`path-south` both have `"height": 208`;
`path-west`/`path-east` both have `"width": 448`; `forecourt-lecture`/`forecourt-gallery`
each occupy 64 px of their respective path's length.
Impact: If Codex applies the same rhythm spacing uniformly across all four routes, the
Academy and Exhibition approaches will feel either compressed or will spill rhythm
elements into the plaza/forecourt space unintentionally.
Recommended action: Pass this guidance to Codex explicitly (already captured in
Section H) — compress the pre-forecourt rhythm on the short routes, and for the
Exhibition route treat the dock/water area as a second rhythm sequence rather than
extending the northern approach's pacing southward.

**VP2-04 — Minor (process/documentation)**
Finding: `docs/portfolio-world/91_STATUS.md` and `92_HANDOFF.md` still state
"INDEPENDENT REVIEW PENDING" / "USER VISUAL FEEL TEST PENDING" for Visual Pass 1, even
though both now exist in the project record.
Evidence: `git log` shows no commit touching either file since `6f21ecb`
("record visual pass 1 implementation"); the independent review
(`04-claude-independent-review.md`) is committed at `e960261`, and the human Visual Feel
Test (`05-human-visual-feel-test.md`) is present on disk (untracked).
Impact: A future agent reading only the canonical status/handoff docs (as
`08_ENVIRONMENT_POLICY.md`'s Environment Gate instructs) would believe Visual Pass 1
review/testing is still pending, when it is in fact complete and approved with minor
notes.
Recommended action: Refresh both docs to reflect Visual Pass 1's actual completed state
before or alongside starting Pass 2 implementation; this is a documentation update, not
a code change.

No Blocker or Major finding was identified.

---

## Q. Final Visual Pass 2 Scope

Recommend Codex receive the Director Plan's Section 18 "In Scope" list, plus these two
concrete additions surfaced by this review:

```text
Zone identity refinement (4 routes, per Section I of this review)
Route-specific streetscape prop clusters
Environmental density increase (per the envelope in Section J)
Reserved expansion lots — AS EXPLICIT DATA RECORDS (new, this review):
  - reservedLots field in WorldLayout / worldLayoutData.json
  - non-overlap validation against reservedLots (new, this review)
Spatial-overlap validation for harborVisuals vs. paths/forecourts/buildings (new)
Waterfront polish as the quality-bar route (with the short-route rhythm
  adjustment noted in Section H)
Stronger destination forecourts
Programmatic-only rendering (no new binary assets)
Continued performance / accessibility / collision QA
```

---

## R. Explicit Non-Scope

Unchanged from the Director Plan; re-confirmed as absent from both the plan text and
the current codebase — must remain out of scope for Codex's Pass 2 implementation:

```text
new functional building implementation
portal navigation
portfolio page routing
building interiors
NPC
dialogue
AI NPC
quest
combat
audio
day/night
final player sprite
full production asset replacement
multiplayer
auth
database
generic theme engine
Tiled integration
```

One interpretation guardrail worth stating explicitly: a "reserved expansion lot" must
render as an ordinary, currently-empty town space (garden/yard/court) — it must **not**
be sketched as a preview silhouette of whatever future building might go there. That
would quietly smuggle "future building implementation" in as a visual, even without
functional code.

---

## S. Evidence Required After Implementation

Minimum for Codex's implementation report and this reviewer's follow-up independent
review:

- Screenshots: (1) Harbor Square wide view, (2) each of the four routes individually
  (Guild/Academy/Workshop/Exhibition), (3) the waterfront quality-bar route including the
  boat in frame, (4) one view showing 2+ destination buildings together for a
  silhouette-comparison check — directly closing Visual Pass 1's evidence gap
  (Section O, item 2).
- Manual checks: walk all four routes end-to-end confirming no path narrowing/trap; visit
  each reserved lot and confirm it reads as an intentional (not unfinished-looking) empty
  space; re-verify the water-edge collision stop; confirm no prop covers a building
  entrance or forecourt.
- Performance evidence: main JS bytes, gzip bytes, binary asset count/bytes (expected 0),
  approximate `harborVisuals` count by tier against the Section J envelope, static
  collider count, and confirmation that `npm ci` / `typecheck` / `test` / `build` /
  production preview / `git diff --check` all pass.
- Data evidence: the new `reservedLots` array in the committed layout data, and evidence
  that the new overlap-validation test cases (Section M) exist and pass.

---

## T. Director Recommendation

```text
DESIGN_FIX_REQUIRED
```
