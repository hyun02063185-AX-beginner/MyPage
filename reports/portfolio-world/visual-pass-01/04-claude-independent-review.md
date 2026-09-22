# Portfolio World — Retro Harbor Campus Visual Pass 1 Independent Review

Reviewer: Claude Code — Sonnet 5
Role: Independent implementation reviewer (did not implement this change)

---

## A. Gate

```text
READY_WITH_MINOR_NOTES
```

No Blocker or Major defect was found. All mandatory pre-review fixes (F1–F5) verify.
Three Minor findings are recorded below; none block the user's Visual Feel Test.

---

## B. Work Context

| Field | Value |
|---|---|
| Profile | `CODYSSEY_SHARED_MAC` |
| Machine Context ID | `3c5410ed-2e15-4583-abb7-9de45a28bbe5` |
| OS | darwin x64 |
| Branch | `feature/portfolio-world-sprint-02` |
| HEAD | `6f21ecb` |
| Git status | clean (before and after this review) |
| Node / npm | v24.21.0 / 11.19.0 |

`work-context.mjs` reported an environment/machine switch relative to the last handoff
(`HOME_WINDOWS`, machine `06cd98a5-...`), which is expected multi-machine workflow per
`08_ENVIRONMENT_POLICY.md` and not treated as a location judgment.

Observation (non-blocking, process note): `03-codex-implementation.md` records
`Model: GPT-5`, while `90_DECISIONS.md` (D-006) and `92_HANDOFF.md` designate
`GPT-5.6 Terra High` as the preferred Codex model. This is a work-context discrepancy
worth the Director's attention, not a defect in the delivered code.

`01-claude-pre-review.md` is absent on this machine, as flagged in the assignment; the
original pre-review ran on `HOME_WINDOWS`. This review was conducted independently from
the Director Plan, Art Direction doc, implementation report, and the actual repository
state, per instruction.

---

## C. Reviewed Range

```text
base:                fe199a4
implementation commits:
  b3b2968  feat(portfolio-world): add retro harbor visual pass
  6f21ecb  docs(portfolio-world): record visual pass 1 implementation
```

`git diff --stat fe199a4..HEAD`: 14 files changed, 513 insertions, 238 deletions —
confined to `portfolio-world/src/world/*`, `portfolio-world/src/scenes/WorldScene.ts`,
`portfolio-world/tests/*`, `docs/portfolio-world/*`, `reports/portfolio-world/visual-pass-01/*`,
and the generated `world/` build output. No other repository path was touched.

---

## D. Architecture

```text
ARCHITECTURE_PASS
```

- `harborVisualCatalog.ts` (new, 282 lines) is a focused Phaser Graphics catalog. Its own
  doc-comment states it is "not a reusable renderer or asset/theme system," which matches
  its actual shape: one draw function per concern (ground, edge, path, plaza, building,
  visual), no generic dispatch table beyond the harbor vocabulary.
- `WorldScene.ts` shrank from 285 → 138 lines and now only orchestrates layout, collision,
  input, and camera (`renderWorld`, `createPlayer`, `createEnvironmentalCollision`,
  `configureCamera`). All drawing code moved out.
- Placement data (`worldLayoutData.json`) remains fully separate from rendering
  (`harborVisualCatalog.ts`); `worldLayout.ts` is unchanged in structure, only renamed
  `landmarks` → `harborVisuals` with an added `tier` field.
- No premature generalization: harbor-specific naming and drawing stay local to this
  catalog rather than becoming a cross-theme engine.
- Visual dispatch is a real discriminated union with a `never`-guard (see F3).

---

## E. Mandatory Fixes

### F1 — Density Cap

```text
PASS (with a minor note)
```

Counted directly from `worldLayoutData.json` `harborVisuals` (validated against
`layoutValidation.mjs` caps: primary ≤ 8, secondary ≤ 16, detail ≤ 20):

- primary tier: 3 (`navigation-monument`, `dock`, `water`) — combined with the 4 fixed
  destination buildings, 7 "primary structures" exist, inside the Director's 6–8 spirit
  guard.
- secondary tier: 12 (4 planters, 2 benches, 4 lamps, 1 sign, 1 boat) — inside 10–16.
- detail tier: 8 (4 crates, 4 barrels) — **below** the Director's 12–20 spirit-guard floor,
  though comfortably inside the hard cap of 20. Zero detail-tier items sit in the
  `plaza` zone itself; all 8 are at Guild Hall, Workshop, and the dock.

The implementation report's "15 detail cues" figure includes mooring posts and rope
drawn as static shapes *inside* `drawDock()` — these are not separate `harborVisuals`
entries, so they don't appear in the layout data or density accounting. The report's
number is not wrong about what renders, but it is not comparable to the tracked density
count. See Finding VP1-01.

### F2 — Validation / Catalog Sync

```text
PASS
```

`HARBOR_VISUAL_TYPES` (layoutValidation.mjs), `HarborVisualType` (worldTypes.ts),
`HARBOR_VISUAL_CATALOG` (harborVisualCatalog.ts), and `LANDMARK_CATALOG`
(landmarkCatalog.ts) all list the same 10 types. Confirmed live:
- unknown type (`"unrendered-visual"`) → throws `Unknown harbor visual type` (test + code).
- duplicate ID → throws `Duplicate placement ID` (test + code).
- out-of-bounds geometry → throws `Out-of-bounds placement` (test + code).
- duplicate water → throws `... exactly one coherent waterfront ...` (test + code).

### F3 — Exhaustive Dispatch

```text
PASS
```

`drawHarborVisual`'s `switch` has one `case` per `HarborVisualType` (10/10) plus a
`default: return exhaustiveVisual(visual.type)` where `exhaustiveVisual(value: never)`
throws. The same pattern (`exhaustiveBuilding`) covers the 5 `WorldZoneId` branches in
`drawHarborBuilding`. `npm run typecheck` passes, which is only possible if these
switches are actually exhaustive under TypeScript's `never` narrowing — a missing case
would fail the build, not just fail silently at runtime.

### F4 — Orphan Sprint 2 Water

```text
PASS
```

Diff confirms the old `south-water-feature` (`type: "water-feature"`, `collidable: true`,
sitting on top of `path-south` at x=1088,y=888 — i.e. blocking the walking path in
Sprint 2) is fully removed, along with the old collidable `north-planter`. Exactly one
`type: "water"` entry now exists (`waterfront-water`), placed at the world's southern
edge and enforced as singular by both the runtime validator and the Node test.

### F5 — Stale Labels

```text
PASS
```

`worldLayoutData.json` diff confirms: `Central Plaza → Harbor Square`,
`North · Lecture Studio → Academy`, `West · Career Archive → Guild Hall`,
`East · AI Lab / Making → Workshop`, `South · Gallery → Exhibition Hall`, plus matching
path/forecourt label renames (e.g. "Academy promenade"). Internal stable IDs
(`plaza`, `lecture`, `career`, `ai-lab`, `gallery`) are unchanged.

---

## F. Harbor Square

```text
HARBOR_SQUARE_READY
```

All required elements are present in the layout data and confirmed in the captured
screenshot (`/tmp/portfolio-world-harbor-square.png`): stone plaza with grid pattern,
central navigation-monument (compass/armillary silhouette, clearly legible), four-way
path connections, 1 harbor sign, 2 benches, 4 lamps, 4 planters. The plaza and its
connecting paths intentionally share a similar warm stone/tan palette since they are
meant to read as one continuous hub — this is by design, not a readability defect.

---

## G. Waterfront

```text
WATERFRONT_READY_WITH_MINOR
```

Confirmed via `/tmp/portfolio-world-waterfront.png` and code: water is visually legible
(teal fill + wave-line texture), the dock reads as a distinct wood-textured walkable
surface, mooring posts and connecting rope lines are visible along the dock edge, and
crates/barrels sit on the dock without crowding it. The screenshot also shows the
player's rectangle stopped flush against the water's edge, which is direct visual
confirmation that the water collider behaves as intended (no penetration, no gap).
Water spans the full world width at the south edge, so there is no unstyled/empty south
boundary.

Minor: the small boat (`waterfront-boat`, x=1450) is outside the frame of both provided
screenshots. Its rendering (`drawBoat`: dark hull triangle, mast line, sail triangle) was
verified by code reading only, not by rendered evidence. See Finding VP1-02.

---

## H. Destinations

```text
No destination looks functionally identical to another.
```

| Destination | Fill | Distinguishing silhouette/props (beyond color) |
|---|---|---|
| Guild Hall (`career`) | dark stone-gray | triangular roof + gold crest circle + notice-board rectangle |
| Academy (`lecture`) | bright beige | triangular roof + vertical roof-spire accent + two gold banners |
| Workshop (`ai-lab`) | medium brown | triangular roof + two dark support beams + gold crane arm/joint |
| Exhibition Hall (`gallery`) | light neutral | flat banded roof (only non-triangular roofline) + two display-board frames + centered dark entrance |

Each destination has at least three visual cues (fill color, silhouette/roofline
treatment, and role-specific props), consistent with the Art Direction's per-building
"Visual Characteristics" and "Supporting Objects" and the Director Plan's
two-cues-minimum requirement.

---

## I. Collision / Movement

```text
Verified cases only — see below.
```

**Confirmed by evidence (screenshot + code):**
- Water-edge approach: the player's rectangle sits immediately adjacent to, not inside,
  `waterfront-water` in the captured screenshot — the collider is coherent at that edge.
- Collider set: `createEnvironmentalCollision` builds exactly 5 static colliders (4
  building footprints + the single `water` visual), matching
  `COLLIDABLE_HARBOR_VISUAL_TYPES = {"water"}` and the validator's single-water rule. No
  double collider exists at the waterfront.
- Dock, crates, barrels, lamps, benches, planters, sign, and boat are all
  `collidable: false` in the data and are not in the collidable-type set, so they cannot
  create an unexpected physical/visual mismatch.

**Not independently re-tested by me this session:** diagonal movement, approaching
Exhibition Hall, moving away from the waterfront, world-edge clamp, and blur/reset
behavior. No browser-automation tool is available in this review environment, and adding
Playwright is explicitly out of scope for this review. `Player.ts`, `movement.ts`, and
`gameConfig.ts` show zero changes in `git diff fe199a4..HEAD`, and these paths were
validated in Sprint 1/2, so regression risk is low — but I am not claiming a manual pass
on cases I did not personally exercise.

---

## J. Accessibility / Wayfinding

```text
ACCESSIBILITY_PASS
```

`index.html` (ARIA `role="region"` + `aria-label`, Portfolio exit link, keyboard-move
footer text, coarse-pointer fallback text) is untouched by this diff — confirmed via
`git diff fe199a4..HEAD -- index.html` returning empty inside `portfolio-world/`. New
Phaser text (plaza/building labels) is supplementary, not the sole navigation cue, since
each destination is also differentiated by silhouette and props (Section H). No
regression identified.

---

## K. QA

| Check | Result |
|---|---|
| `npm ci` | PASS — 20 packages, 0 vulnerabilities |
| `npm run typecheck` | PASS |
| `npm test` (typecheck + build + 3 Node tests) | PASS — 3/3 tests green |
| `npm run build` | PASS — main JS 1,391.01 kB, gzip 362.32 kB (matches implementation report exactly) |
| production preview (`vite preview --base /MyPage/world/`) | PASS — served 200 OK at `/MyPage/world/`, HTML references the correct rebuilt asset hash |
| `git diff --check` | PASS — no whitespace errors |
| `git status --short` | clean before and after |

---

## L. Performance

- Main JS: 1,391.01 kB; gzip: 362.32 kB — identical to the implementation report; the
  pre-existing Vite 500 kB chunk-size warning is a tracked Phaser-bundle-size issue, not
  introduced by this pass.
- Binary assets added: 0.
- All harbor drawing (`renderWorld()`) executes once inside `create()`; nothing in
  `WorldScene.update()` allocates Graphics. `Player`'s body/face rectangles are created
  once in its constructor and only repositioned in `constrainToWorldBounds()`, never
  recreated per frame.
- Static collider count is 5 (4 buildings + 1 water) — actually one fewer than Sprint 2's
  6 (which had 2 collidable landmarks), despite the much richer visual scene.
- No unbounded Graphics creation, no duplicated static bodies, no excessive text objects
  (5 total: 1 plaza label + 4 building labels) were found.

```text
PERF_PASS
```

---

## M. Asset Policy

```text
ASSET_POLICY_PASS
```

`git diff --name-status fe199a4..HEAD` shows only `.ts` / `.mjs` / `.json` / `.md`
changes plus a renamed (hashed) built JS bundle — no new binary image/audio files.
Rendering is 100% programmatic Phaser Graphics/Rectangle/Text, matching the Rendering
Strategy priority in the Director Plan.

---

## N. Existing Portfolio Protection

```text
PORTFOLIO_PROTECTION_PASS
```

`git diff fe199a4..HEAD -- index.html career.html teaching.html making.html gallery.html`
is empty for all five files — none were touched. Only `world/index.html` and the
`world/assets/` bundle changed, which is the expected generated-output update under the
current GitHub Pages deployment policy.

---

## O. Findings

**VP1-01 — Minor**
Finding: Detail-tier prop density (8) is below the Director's 12–20 spirit-guard floor
for Visual Pass 1, and Harbor Square itself has zero detail-tier props.
Evidence: `worldLayoutData.json` — only `guild-crates`, `workshop-crates`,
`dock-crates-west`, `dock-crates-east`, `guild-barrel`, `workshop-barrel`,
`dock-barrel-west`, `dock-barrel-east` carry `"tier": "detail"`; none are in
`"zone": "plaza"`.
Impact: Harbor Square could read as slightly cleaner/emptier at the fine-clutter layer
than the "medium-high visual density" target in the Art Direction doc. Low risk, since 1
primary + 10 secondary items already occupy the plaza — but this is exactly what
Question 5 of the Human Visual Feel Test ("오브젝트가 너무 적거나 너무 많은가?") probes.
Recommended action: No change required before the Visual Feel Test. If the user's
verdict leans `TOO_EMPTY`, add a small number of non-collidable detail props (flowers,
sacks, small crates) to the plaza and dock in a follow-up pass.

**VP1-02 — Minor**
Finding: Available visual evidence covers only 2 of the 3 minimum required views and does
not establish boat legibility.
Evidence: Only `/tmp/portfolio-world-harbor-square.png` and
`/tmp/portfolio-world-waterfront.png` exist (both ephemeral, uncommitted). Neither frame
contains the `small-boat` (x=1450) or two-or-more destination buildings together for a
side-by-side comparison. No browser-automation tool is available in this review session
to capture additional views, and Playwright is out of scope.
Impact: My assessment of "does the boat read as a harbor cue" and "are all four
destinations simultaneously distinguishable" rests on code/color inspection, not
rendered evidence.
Recommended action: Treat these two specific aspects as pending confirmation in the
user's manual Visual Feel Test rather than fully closed by this review.

**VP1-03 — Minor / cosmetic**
Finding: The `edge-south` decorative strip is fully geometrically occluded by
`waterfront-water` and never actually renders; `edge-west`/`edge-east` are partially
occluded at their southern ends by the same rect.
Evidence: `edge-south` spans y:1216–1280 across the full world width; `waterfront-water`
spans y:1184–1280 across the full world width at a higher render depth (0 vs. −2), fully
covering it.
Impact: None functionally — purely wasted Graphics fill for pixels that are never
visible.
Recommended action: Optional cleanup in a later pass (drop or trim the south edge
decoration now that the waterfront owns that space); not worth blocking on.

No Blocker or Major finding was identified.

---

## P. User Visual Test Readiness

The user can now meaningfully judge:
- first impression — yes, Harbor Square and the path-to-waterfront flow render coherently
- harbor identity — yes, water/dock/boat/moorings/crates establish a harbor read
- game/portfolio balance — yes, world stays retro/pixel-inspired while the HTML shell
  (title, exit link, footer) stays modern/clean, per the locked UI rule
- Concept Image #1 direction — plausible from the two captured views; not fully
  confirmable from static evidence alone
- density — mostly yes; the detail-tier gap (VP1-01) is exactly the kind of judgment this
  test exists to make
- waterfront proportion — yes, from the captured south view
- destination readability — yes, from code/data inspection (Section H); not yet
  confirmed from a single side-by-side rendered view (VP1-02)
- desire to expand the direction — the user is positioned to answer this now

Nothing found in this review should block proceeding to the Visual Feel Test.

---

## Q. Final Recommendation

```text
PROCEED_WITH_MINOR_NOTES
```
