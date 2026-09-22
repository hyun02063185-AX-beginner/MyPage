# Portfolio World — Art Asset Phase 01 Harbor Scale & Fleet Refinement Independent Review

Reviewer: Claude Code — Sonnet 5
Role: Independent reviewer (did not implement this refinement)

---

## A. Gate

```text
READY_FOR_HARBOR_REFINEMENT_HUMAN_REVIEW
```

Hero Ship D is a genuinely new, C-inspired three-mast vessel rendered at an A-like display footprint,
with a clearly elevated deck-visible perspective that resolves the human review's pure-side-profile
rejection of C. The Exhibition Hall's 9.7% visual enlargement, the four-vessel secondary fleet, and the
new service jetty are all correctly integrated: collision, vessel containment, and pier walkability are
independently re-verified against the actual geometry and pass, including a byte-for-byte match between
every reported asset size/weight figure and the files on disk. QA is 11/11, the production build is
byte-identical to the committed `world/` output, and the built bundle still dead-code-eliminates the
dev-only comparison path. Four Minor findings are recorded — none block human review.

---

## B. Work Context

| Field | Value |
|---|---|
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | win32 x64 |
| Branch | `feature/portfolio-world-sprint-02` |
| HEAD | `6681f10` (`docs(portfolio-world): record harbor asset refinement`) |
| Git status | dirty — only known execution-only instruction/record files untracked (see below) |
| Node / npm | v24.16.0 / 11.13.0 |

Untracked at review start: `art-asset-phase-01/00-director-gate.md`, `01-asset-strategy.md`,
`03-director-gate.md`, `06-human-asset-slice-review.md` (execution-only instructions/records, not
required to be committed per their own headers) and `visual-pass-05/05-human-visual-feel-test.md` (a
real record, untracked since an earlier session). All were read; none were staged or modified by this
review.

---

## C. Reviewed Range

```text
base:    774c6f2  (docs: review first harbor art asset slice)
runtime: e501d0c  (feat: refine harbor ship scale and fleet)
docs:    6681f10  (docs: record harbor asset refinement)
```

`git diff --stat 774c6f2..HEAD`: 23 files. Source: `BootScene.ts`, `WorldScene.ts`,
`harborVisualCatalog.ts`, `landmarkCatalog.ts`, `layoutValidation.mjs`, `worldAssetManifest.ts`,
`worldLayoutData.json`, `worldTypes.ts`. Tests: `asset-loading.test.mjs`, `spatial-layout.test.mjs`.
Assets: four new PNGs (`hero-ship-d-v01.png`, `secondary-brig-v01.png`, `secondary-schooner-v01.png`,
`secondary-cutter-v01.png`) under `public/assets/world/harbor/ship/` and their `world/` build-output
copies. Docs: `91_STATUS.md`, `92_HANDOFF.md`, the new implementation report. Build output:
`world/index.html`, `world/assets/index-*.js` (hash changed, content changed accordingly).

**Not touched**: `waterCollisionGeometry.mjs`, `worldLayout.ts`, `gameConfig.ts`, `Player.ts`,
`visualPalette.ts`, `streetscapeVisuals.ts`, `world.css`, `main.ts`, `vite.config.ts`,
`dock-decoration-geometry.test.mjs`, root `package.json`, and every root Portfolio HTML/CSS/JS file
(`index.html`, `gallery.html`, `career.html`, `making.html`, `teaching.html`, `css/`, `js/`, `content/`,
`images/`, `tools/`) — confirmed via targeted diffs against `774c6f2`, all empty.

---

## D. Hero Ship D Scale

```text
HERO_D_SCALE_PASS_WITH_MINOR
```

Display footprint confirmed exactly as reported: `395 × 263` (manifest `heroShipD`). Against A's
`360 × 270`: D is ~9.7% wider but ~2.6% shorter, for a net area difference of about +7% — genuinely close
to A's perceived envelope, not a re-badged C. Against C's `510 × 340` (173,400 px²) D (103,885 px²) is
~40% smaller by area — materially smaller, matching the human's `DO_NOT_USE_C_CURRENT_SCALE_AS_FINAL`
direction. D's `395 × 263` display is roughly 3.7× the area of the largest secondary vessel (schooner,
`205 × 137` = 28,085 px²), so D unambiguously remains the largest important harbor vessel. Minor: D's
aspect ratio (1.50) differs from A's (1.33) because D keeps a three-mast silhouette A doesn't have — the
two candidates are close in area but not in shape, worth surfacing as a data point for the human's scale
call rather than treating "A-like" as a precise match.

---

## E. Hero Ship D Design

```text
HERO_D_DESIGN_PASS
```

Opened `hero-ship-d-v01.png` directly. It has three full masts with six sails, a long hull with a visible
row of gunports, a gilded lion figurehead and bowsprit at the bow, and an ornate stern cabin with lit
windows, a ship's wheel, and lanterns — the same class of strong multi-mast, landmark-quality silhouette
C established, confirmed by direct side-by-side comparison against `hero-ship-c-v01.png`. It is not a
resize or crop of C: the bow/stern are mirrored relative to C (D's bow points left, C's points right),
the wheel/lantern/window arrangement on the stern deck differs, and the window lighting is amber rather
than C's teal — consistent with the implementation report's claim of a distinct generated asset sharing
C's design language rather than reused art. D reads clearly as a major vessel, not a generic small
working boat, when compared against the far simpler two-mast/one-mast secondary fleet (Section J).

---

## F. Hero Ship D Perspective / Deck Visibility

```text
HERO_D_PERSPECTIVE_PASS_WITH_MINOR
```

Direct visual inspection confirms D is unambiguously not a pure side profile: the deck is extensively
visible, showing the ship's wheel, two lanterns, a cargo hatch, barrels, crates, and a ladder — clearly
readable at the asset's native resolution. This resolves the human review's specific rejection of C
(Section 4 of `06-human-asset-slice-review.md`: "deck visibility = insufficient... PURE_SIDE_PROFILE_NOT
_ACCEPTED"). Minor: comparing all four candidates side by side, D's camera angle reads as more steeply
elevated (closer to a three-quarter aerial view) than A/B's "slightly elevated, deck partly visible"
reference framing — A and B show only a narrow strip of deck along the top rail, while D shows roughly
40% of the image as deck. This does not violate the rejection condition and is not a defect, but it is a
visible difference in degree from the A/B perspective baseline the human named, worth flagging so the
human's judgment of "does this match A/B's camera angle" is made with that difference in view rather than
discovered afterward.

---

## G. Hero Visual / Collision Separation

```text
HERO_D_COLLISION_SEPARATION_PASS
```

Confirmed via `git diff --stat 774c6f2..HEAD`: `worldLayout.ts`, `waterCollisionGeometry.mjs`, and
`Player.ts` are absent from the diff. The `harbor-large-ship` data record in `worldLayoutData.json` is
unchanged (same `x/y/width/height`). `WorldScene.drawFirstAssetSlice()` renders D via a plain
`this.add.image(...).setOrigin(...).setDisplaySize(...)` call with no physics body — `large-ship` was
never in `COLLIDABLE_HARBOR_VISUAL_TYPES` (confirmed unchanged in `layoutValidation.mjs`), so swapping in
D's larger mast/sail silhouette changes nothing about movement geometry. Vessel containment is validated
against the data rectangle, not the PNG's transparent canvas bounds (verified directly: the new
`spatial-layout.test.mjs` containment test checks `vessel.x/y/width/height` against water rectangles, not
image pixels).

---

## H. Exhibition Hall Scale

```text
EXHIBITION_SCALE_PASS_WITH_MINOR
```

Confirmed the display size change is visual-only: `worldLayoutData.json`'s `gallery` building record
(`x: 1024, y: 1056, width: 256, height: 128`) is byte-identical before and after this diff. The `340 / 310
= 1.0968` and `227 / 207 = 1.0966` ratios match exactly, confirming a uniform ~9.7% scale with no aspect
distortion. `WorldScene.drawFirstAssetSlice()` still anchors the facade image at `(exhibition.x,
exhibition.y + exhibition.height / 2)`, i.e. the same ground-line anchor as before — the building's IA
coordinate, label, and collision (driven independently by `WORLD_LAYOUT.buildings`, unchanged) are
unaffected. Minor: computing the facade image's visual bounding box from its origin/display size, the
enlarged `340 × 227` facade extends its top-left corner roughly 34px over the `exhibition-display-board`
prop's footprint on the x-axis (up from ~19px at the previous `310 × 207` size) — a small, data-derived
increase in visual overlap potential with a nearby decorative prop, not confirmed or refuted by an actual
rendered screenshot since persistent canvas capture is unavailable in this environment (consistent with
every prior review in this project). This is worth a quick look during live human review, not a
code-level defect.

---

## I. Building-to-Ship Ratio

```text
BUILDING_SHIP_RATIO_READY_FOR_HUMAN
```

With D near A's footprint (Section D) and the Exhibition Hall modestly enlarged (Section H), the two
landmark objects the human specifically asked to be rebalanced move in the intended direction together:
the ship shrank materially from C, the building grew modestly, and D still dominates the Exhibition Hall
in on-screen area by a wide margin (D ≈103,885 px² vs. Exhibition ≈77,180 px²), preserving the ship as
harbor landmark while giving the building more presence than before. This is a plausibility read from
verified numbers and direct asset inspection, not a claim of final aesthetic correctness — exactly the
kind of judgment the mandatory human visual review exists to make.

---

## J. Secondary Fleet

```text
SECONDARY_FLEET_PASS
```

All four intended placements exist in `worldLayoutData.json` (`harbor-west-merchant-brig`,
`harbor-west-cargo-schooner`, `harbor-east-merchant-brig`, `harbor-east-harbor-cutter`) and are actually
integrated: `WorldScene`'s `getSecondarySailingAsset()` maps each id to a texture, and
`drawFirstAssetSlice()` renders all four via `this.add.image(...)`, skipping the corresponding
programmatic fallback in `renderWorld()` (confirmed both code paths directly). Repeated use is
controlled: only `secondary-brig-v01.png` is reused (west instance unflipped, east instance
`.setFlipX(true)`), and the two instances sit in different basins (west basin vs. east basin, confirmed
by coordinates), so the reuse is not visually obvious side-by-side. All three secondary source PNGs were
opened directly — brig (two masts), schooner (two raked masts, low cargo hull), cutter (one mast) — and
are visibly distinct designs, not palette swaps of one hull. Perspective is coherent with D: all three are
drawn in the same broadside/profile-biased silhouette grammar as the existing programmatic small boats and
prior hero candidates. Every secondary display size (188×125, 205×137, 145×97) is far below D's 395×263,
so the fleet is visibly subordinate to D, not competing with it.

---

## K. Fleet Hierarchy

```text
FLEET_HIERARCHY_READY_FOR_HUMAN
```

Measured display areas confirm a clean three-tier hierarchy: D (103,885 px²) > secondary vessels
(28,085 / 25,600 / 14,065 px²) > small working boats (unchanged programmatic silhouettes, smaller data
footprints than any secondary vessel). D remains the sole primary-tier vessel in the data
(`harbor-large-ship` is the only `tier: "primary"` floating-vessel entry); the four new vessels are
`tier: "secondary"`; the four pre-existing boats remain `tier: "detail"`. The harbor now has five
independent "vessel clusters" instead of one hero ship in open water, which — combined with the retained
small boats — moves it away from "one giant ship in empty water" without geometric evidence of the
opposite failure mode (no vessel-to-vessel overlap was found; see Section L).

---

## L. Fleet Density

```text
FLEET_DENSITY_READY_FOR_HUMAN
```

Directly recomputed vessel containment against the actual water rectangles in `worldLayoutData.json`
(independent of the new test, though it agrees): all four secondary vessels fall entirely inside their
respective basin (`harbor-west-basin` x-range `[0, 800]`, `harbor-east-basin` x-range `[1248, 2048]`), and
no two vessels' rectangles overlap (west brig `x∈[66,254]` vs. west schooner `x∈[397.5,602.5]`; east brig
`x∈[1336,1524]` vs. east cutter `x∈[1737.5,1882.5]`). `layoutValidation.mjs`'s `DENSITY_CAPS.secondary` was
raised from 30 to 36 specifically to accommodate the new count; the actual current secondary-tier count is
34 (recomputed directly from the data file), i.e. the cap increase is proportionate to the added content,
not an arbitrarily loosened ceiling. Four added vessels matches the human's "approximately four additional
sailing vessels" note exactly. This reads as credible, not overfilled — open water clearly remains inside
both basins around each vessel — but as with Section H/I, final density feel is a live-composition
judgment for the human, not something rectangle math alone can certify.

---

## M. Service Jetty

```text
SERVICE_JETTY_GEOMETRY_PASS
```

`harbor-service-jetty` (`x:1096, y:1184, width:144, height:32, walkable:true`) matches the reported
`144 × 32` geometry exactly. Recomputed its bounding box (`x∈[1024,1168], y∈[1168,1200]`) against
`waterfront-dock` (`x∈[800,1248], y∈[1120,1184]`): the two overlap by exactly 16px vertically
(`[1168,1184]`) with full horizontal overlap — confirming the "overlaps the primary dock by 16 logical
pixels" claim precisely, and giving a physically connected berth rather than a floating disconnected
platform. The jetty has no `walkable` PNG asset of its own — it renders via the existing generic `dock`
type/`drawHarborVisual` path, the same programmatic treatment as the two prior piers, so no new "looks
walkable but isn't" visual was introduced. It does not overlap `harbor-pier-east` (`x∈[1216,1376]`) or
`harbor-pier-west` (`x∈[672,832]`), and does not overlap `harbor-large-ship`'s footprint.

---

## N. Berthing Capacity

```text
BERTHING_EXPANSION_READY_FOR_HUMAN
```

The harbor now has four explicit dock/berthing structures (`waterfront-dock`, `harbor-pier-west`,
`harbor-pier-east`, `harbor-service-jetty`) — matching the human's "two or more... when justified by
increased vessel density" allowance, and directly justified by the four newly added secondary vessels.
The jetty's placement (physically merged with the existing primary dock rather than scattered as an
independent island) avoids creating a maze — it's an extension of a structure players already navigate,
not a new obstacle course. Open water is still present in both basins around every vessel (Section L), and
the Exhibition Hall approach path (`waterfront-dock`, forecourt, promenade props) is untouched in the diff
— the jetty sits east of the dock's center, not across the promenade approach.

---

## O. Jetty Collision / Walkability

```text
JETTY_COLLISION_PASS
```

`waterCollisionGeometry.mjs` (the water-collision-carving algorithm) is byte-unchanged in this diff — the
jetty gets its carveout "for free" through the same generic `subtractWalkableFootprint()` reduction every
walkable dock already used, not a special case. Recomputed manually: the jetty overlaps only
`waterfront-water` (`x∈[0,2048], y∈[1184,1280]`) — not `harbor-west-basin` or `harbor-east-basin`, which
don't reach its x-range — and that overlap (`y∈[1184,1200]`) is exactly what gets carved from
`waterfront-water`'s Arcade collision rectangle, leaving the rest of `waterfront-water` (and both basins in
full) still blocking. The new `spatial-layout.test.mjs` test asserting `rectsOverlap(water, serviceJetty)
=== false` across the full carved rectangle set was independently re-run as part of the 11/11 suite
(Section U) and passes. The two pre-existing piers' walkability test (`harbor-pier-west`,
`harbor-pier-east`) still passes unchanged alongside the jetty — no regression to previous pier
walkability.

---

## P. Existing Collision Preservation

```text
EXISTING_COLLISION_PRESERVATION_PASS
```

Confirmed via targeted diffs against `774c6f2`: `Player.ts`, `gameConfig.ts`, `worldLayout.ts`, and
`waterCollisionGeometry.mjs` are all absent from the diff — player collision, world dimensions, and the
collision-rectangle algorithm itself are untouched. Every pre-existing entry in
`worldLayoutData.json`'s `buildings`, `waterCollisionRects`-feeding `harborVisuals` (water/dock entries),
and destination coordinates is line-identical except for four new vessel entries and one new dock entry,
all additive. `layoutValidation.mjs`'s changes are additive only (new type registered in existing sets,
one density cap raised) — no existing validation rule was loosened or removed. All 6 pre-existing
structural/regression tests plus the 2 pre-existing asset tests still pass unchanged alongside the 3 new
assertions (Section U).

---

## Q. Manifest / Provenance

```text
NEW_ASSET_MANIFEST_PASS
```

Read `worldAssetManifest.ts` directly. `heroShipD`, `secondaryBrig`, `secondarySchooner`, and
`secondaryCutter` each carry `id`, `textureKey`, `path`, `role`, `sourceType`/`provenance`
(`generated-original`), `status` (`CONCEPT`, reusing `07_ASSET_POLICY.md`'s existing vocabulary — no
competing status scheme introduced), `version`, `notes`, `sourceWidth/Height`, `displayWidth/Height`, and
`originY`. All new assets are `generated-original` — none fall into the disallowed
`unknown`/`copied-from-web`/`unverified` categories. A/B/C and the Exhibition Hall's original entries
remain present and unmodified except for the Exhibition's intentional display-size bump.

---

## R. Art Readability / Alpha Edge

```text
ART_READABILITY_ACCEPTABLE
```
```text
ALPHA_EDGE_PASS
```

D's elevated-deck framing (Section F) does make its silhouette and deck layout more immediately readable
at a glance than C's flat broadside view, but the underlying art remains the same detailed, softly-shaded
painterly style flagged as a Minor note (AAP-06) in the prior independent review — fine wood-grain
texture, gradient shading, and rigging linework are still present at a level finer than the
"16-bit-inspired retro... strong silhouette... controlled texture" direction in `01-asset-strategy.md`.
This is not a new problem and not a regression; it's the same known style-direction question the human
review is already aware is open, now carried into four more assets.

Pixel-sampled all four new PNGs directly (RGBA reads, not visual impression alone): every corner reads
alpha `0` on all four images, and the alpha ramp along sampled rows/columns is a smooth, short
antialiasing gradient (0 → ~250+ over roughly 5–10px) with colors transitioning from near-black through the
hull's actual warm tones — the same clean-cutout pattern the prior review independently verified for
Hero A/B/C, not a baked halo or background plate. (The warm "glow" visible when viewing these PNGs in an
image viewer against a black canvas is exactly this antialiasing ramp rendered over black, not evidence of
a defect.) No new color fringing beyond the previously-disclosed Hero-A-specific note (AAP-08, unchanged
by this diff, and no longer the production default) was found on D or the three secondary vessels.

---

## S. Asset Weight / Runtime Transfer

```text
ASSET_WEIGHT_READY_WITH_OPTIMIZATION_NOTE
```

Verified every reported byte figure directly against the files on disk — exact matches:

| Asset | Reported bytes | Actual bytes |
|---|---:|---:|
| Hero D | 2,159,287 | 2,159,287 ✓ |
| Secondary brig | 1,378,040 | 1,378,040 ✓ |
| Secondary schooner | 1,731,285 | 1,731,285 ✓ |
| Secondary cutter | 1,223,185 | 1,223,185 ✓ |

Recomputed the derived totals independently rather than trusting them: new-asset sum
`2,159,287 + 1,378,040 + 1,731,285 + 1,223,185 = 6,491,797` ✓ matches exactly. Normal production transfer
(D + Exhibition [2,065,219, unchanged] + 3 unique secondary textures) `= 8,557,016` ✓ matches exactly —
confirmed against `BootScene.preload()`'s actual load list (D, Exhibition, brig, schooner, cutter — 5
`load.image()` calls, the mirrored east brig reuses the already-loaded brig texture key). Full
repository/comparison total across all 8 PNGs (A/B/C/D + 3 secondary + Exhibition) `= 14,040,843` ✓ matches
exactly. This is a real increase over the prior slice's disclosed ~4.15 MB normal-load figure (now
~8.56 MB) with no loading failure observed in this session's production-preview testing — acceptable to
proceed to human review, but the previously-flagged optimization pass (AAP-07) has still not begun despite
being disclosed twice now; this should not be deferred a third time once the human's scale/fleet decision
lands.

---

## T. BASE_URL / Production Preview

```text
BASE_URL_RULE_PRESERVED
```

All four new `path` values in `worldAssetManifest.ts` are public-relative with no leading `/`
(`assets/world/harbor/ship/...`), resolved identically to the existing pattern via
`resolveWorldAssetUrl()`. Built the production bundle independently (`npm run build`) and inspected
`world/assets/index-C_avPXOq.js` directly: zero occurrences of `URLSearchParams` (the dev-only
`?heroShip=`/`?assetPreview=` reading code is still dead-code-eliminated in production, now including the
D-default path), and zero occurrences of any `"/assets/world..."` root-absolute string. Served the actual
production build (`npm run preview`) and curled it directly:

| Request | Result |
|---|---|
| `/MyPage/world/` | `200` |
| `/MyPage/world/assets/world/harbor/ship/hero-ship-d-v01.png` | `200` |
| `/MyPage/world/assets/world/harbor/ship/secondary-brig-v01.png` | `200` |
| `/MyPage/world/assets/world/harbor/ship/secondary-schooner-v01.png` | `200` |
| `/MyPage/world/assets/world/harbor/ship/secondary-cutter-v01.png` | `200` |
| `/MyPage/world/assets/world/harbor/buildings/exhibition-hall-v01.png` | `200` |
| `/assets/world/harbor/ship/hero-ship-d-v01.png` (root-absolute, deliberately wrong) | `404` |

No dev-only control (ship/asset-preview selector) is exposed in the production HTML or bundle — confirmed
by the same dead-code-elimination evidence above.

---

## U. QA

Reproduced independently from `portfolio-world/`:

| Check | Result |
|---|---|
| `npm ci` | PASS, clean install, no lock/EPERM issue this session |
| `npm run typecheck` | PASS |
| `npm test` (typecheck + build + `node --test`) | PASS — **11/11** |
| `npm run build` | PASS — `1,416.20 kB` / gzip `368.01 kB`, matches implementation report exactly |
| `git diff --check` | PASS (only benign LF/CRLF warnings on Windows, no actual whitespace errors) |
| `git status --short` after rebuild | clean — build output byte-identical to committed `world/` |
| `node tools/portfolio-world/work-context.mjs` | PASS on required branch/profile |
| Production preview + BASE_URL/404 checks | PASS (Section T) |

No Windows file-lock/EPERM issue occurred in this review session; nothing required stopping stale
processes.

---

## V. Project Protection

```text
PROJECT_PROTECTION_PASS
```

Confirmed via targeted diffs against `774c6f2`: no root Portfolio HTML/CSS/JS file, `vite.config.ts`, root
`package.json`, `world.css`/`main.ts` UI shell, `worldLayout.ts`, `gameConfig.ts`, or `Player.ts` appears
anywhere in this refinement's diff. World dimensions, destination IA coordinates, reserved-lot data, and
existing player-control code are all byte-unchanged. `portfolio-world/` remains source and `world/`
remains the committed build artifact — the GitHub Pages deployment model is unaffected.

---

## W. Visual Inspection

I directly opened and inspected all four new PNGs as images (Hero D, brig, schooner, cutter), plus A/B/C
side by side for design/perspective comparison (Sections D–F, J, R), and additionally sampled raw RGBA
pixel data from all four new files to verify transparency claims empirically rather than by eye
(Section R). I served the actual production build and verified every new asset URL resolves with real
HTTP requests (Section T), and read the composition code (`WorldScene.drawFirstAssetSlice()`,
`renderWorld()`) directly to confirm anchor points, depths, and fallback-skip conditions for D, the
secondary fleet, and the Exhibition Hall.

What I did **not** do: capture or persist a screenshot of the live, composited Phaser canvas showing D,
the secondary fleet, the enlarged Exhibition Hall, and the service jetty together in the running scene —
no persistent screenshot export is available in this environment, consistent with every prior review in
this project. The overlap concerns noted as Minor in Sections H and (implicitly) I are data-derived from
verified coordinates/dimensions, not confirmed or refuted by an actual rendered frame. This is exactly the
gap the mandatory human visual review closes next.

**Is the current result technically and visually coherent enough for the user to judge D scale, building
scale, fleet density, and berthing layout?** Yes. Every piece of geometry, collision, asset-loading, and
manifest evidence checks out independently against the actual code and files, and direct inspection of the
static art itself supports the scale/design/perspective/hierarchy claims in the implementation report. The
two data-derived Minor overlap notes (Sections H, S) are worth a quick live glance but do not block a
meaningful human judgment.

---

## X. Findings

```text
ID: HRF-01
Severity: Minor
Category: perspective
Finding: Hero Ship D's camera elevation reads as more steeply "looking down" (roughly
  three-quarter aerial, ~40% of the image is deck) than the human review's A/B reference
  framing ("slightly elevated... part of the deck is visible", where A/B show only a
  narrow strip of deck along the top rail).
Evidence: Direct side-by-side visual comparison of hero-ship-a-v01.png,
  hero-ship-b-v01.png, and hero-ship-d-v01.png.
Failure scenario: None functionally — D is unambiguously not a pure side profile, so
  the human's explicit rejection condition for C does not apply. This is a degree
  difference in camera angle, not a defect.
Recommended action: None required before human review; note for the human's perspective
  judgment in case a closer angle match to A/B is desired.

ID: HRF-02
Severity: Minor
Category: hero ship scale
Finding: D's aspect ratio (395:263 ≈ 1.50) differs from A's (360:270 ≈ 1.33); D is ~9.7%
  wider but ~2.6% shorter than A, for a net area difference of about +7%.
Evidence: worldAssetManifest.ts heroShipA/heroShipD displayWidth/displayHeight values.
Failure scenario: None — D's overall footprint is still close to A's and far below C's;
  this is a data point, not a scale mismatch.
Recommended action: None required; useful context for the human's final scale decision,
  since a pixel-identical footprint to A was never the goal (three masts vs. A's two
  requires a different silhouette shape).

ID: HRF-03
Severity: Minor
Category: building scale
Finding: The enlarged 340×227 Exhibition Hall facade's computed bounding box overlaps the
  exhibition-display-board prop's x-range by ~34px, up from ~19px at the previous
  310×207 size — a modest, data-derived increase in visual-overlap potential with a
  nearby waterfront decoration.
Evidence: Computed from worldLayoutData.json (exhibition-display-board x/width) and
  worldAssetManifest.ts (exhibitionHall origin/display values before and after this
  diff).
Failure scenario: Possible minor visual clutter where the facade's upper-left roofline
  passes near the display board, if the actual rendered art makes this visible;
  unconfirmed by a live screenshot (unavailable in this environment).
Recommended action: A quick live-canvas glance during human review; no code change is
  indicated unless actually visible and undesired.

ID: HRF-04
Severity: Minor
Category: asset weight
Finding: Normal production page-load weight grew from ~4.15 MB (previous slice) to
  ~8.56 MB (D + Exhibition + 3 secondary textures); the PNG-compression cost of the
  painterly art style flagged twice already (AAP-06/AAP-07) has not yet been addressed
  despite two more asset-weight-adding refinements landing since.
Evidence: Independently recomputed byte sums (Section S), all matching the
  implementation report exactly.
Failure scenario: No load failure was observed in this session's testing at this weight;
  the risk is compounding technical debt if further phases keep adding painterly PNGs
  before the disclosed optimization pass ever starts.
Recommended action: Prioritize the PNG/alpha/palette optimization pass immediately after
  the human's scale/fleet decision, before any additional asset phase adds further
  weight on top of this.
```

No Blocker or Major finding was identified.

---

## Y. Human Review Readiness

Ready. Every quantitative claim in `07-codex-harbor-scale-fleet-refinement.md` (display dimensions, byte
counts, overlap math, collision carve-out behavior) was independently recomputed or re-measured against
the actual files and code, not accepted on the report's word, and matched exactly. Layout, collision,
player controls, world dimensions, and the existing root portfolio are all confirmed byte-unchanged.
BASE_URL/GitHub Pages handling is verified two independent ways (built-bundle inspection and live HTTP
checks). QA is 11/11 and the production build is byte-identical to committed output. The four Minor
findings above are review notes for the human's judgment (perspective-angle degree, scale aspect ratio,
one geometric overlap possibility, and a compounding asset-weight follow-up) — none are blockers, and none
indicate a broken or regressed system.

---

## Z. Final Recommendation

```text
PROCEED_TO_HARBOR_REFINEMENT_HUMAN_REVIEW
```
