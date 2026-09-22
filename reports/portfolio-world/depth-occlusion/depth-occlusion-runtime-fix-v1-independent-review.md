# Portfolio World — Depth / Occlusion Runtime Fix v1 — Independent Review

> Canonical repo path:
> `reports/portfolio-world/depth-occlusion/depth-occlusion-runtime-fix-v1-independent-review.md`

Reviewer: Claude Code (independent; did not implement this fix). Scope: depth / occlusion runtime behaviour only. No runtime code,
asset, or test was modified. All measurement scripts, servers and screenshots lived in the session scratchpad, outside the repo.

---

## A. Gate

```text
RETURN_TO_CODEX
```

The depth system itself is sound: both known failures are fixed, the band math and formula are correct, anchors are valid, and
QA is 17/17. It is **not** yet safe to become the foundation for asset rollout because the fix introduced **two visible runtime
regressions**, both reproduced live against the pre-fix build:

1. The world-edge greenery now paints **over the water** (old depth −2 below water 0; new 20,000 above water 0).
2. The flat, walkable **viewing terrace** is classified as a "body" object, so it **hides the player standing on it** and clips a
   lamp head.

Both are small, local fixes (section Z). The review's return criterion "runtime regression exists" applies.

---

## B. Work Context

| Item | Value |
| --- | --- |
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | `win32 x64` |
| Branch | `feature/portfolio-world-sprint-02` (expected) |
| HEAD at start | `ae74ad6 docs(portfolio-world): record depth occlusion runtime fix` |
| Git status at start | clean (in sync with origin) |
| Node / npm | `v24.16.0` / `11.13.0` |
| Switch detection | none |

**Environment note (not a code finding).** The first `npm ci` failed with `EPERM` unlinking Vite's native binding
(`@rolldown/binding-win32-x64-msvc`) because a stale `vite preview --port 4173` (PIDs 30044 and 28840) left from the
implementation session was still running. I stopped exactly those two preview processes (this repo's own preview server; the
unrelated Codex/encoder node processes were not touched), reinstalled, and continued. The same lock was recorded in the earlier
harbor-refinement report. Leaving preview servers running blocks the required `npm ci` on Windows.

---

## C. Reviewed Range

`d21b47a..ae74ad6` (commits `31e1b2c`, `ae74ad6`). Files changed (8 + 3): `worldDepth.mjs`, `worldDepth.mjs.d.ts` (the instruction
named `worldDepth.d.ts`; the actual declaration file is `worldDepth.mjs.d.ts`), `harborVisualCatalog.ts`, `WorldScene.ts`,
`Player.ts`, `tests/world-depth.test.mjs`, rebuilt `world/` bundle, and `91_STATUS.md`, `92_HANDOFF.md`, the implementation report.
No collision, layout-data, asset, manifest or config file changed.

Records read: Art Bible v1.0, my pre-review, lock record (Gate/Implementation/Human calibration read by grep for depth/camera
statements), the implementation report, `04_ARCHITECTURE.md`, `06_QA_RELEASE_POLICY.md`, `91_STATUS.md`, `92_HANDOFF.md`.

---

## D. Previous Failure Reproduction

```text
OLD_FAILURE_REPRODUCTION_CONFIRMED
```

Pre-fix code (`git show d21b47a:…`): ground `-4`, edge `-2`, water `0`, path `1`, plaza `2`, programmatic building `4`, Hall PNG
`5`, harbor visuals `6`, D `7` (calibration `7.2`), all secondary vessels `7`, labels `8`, player `11`/`12`. No contact-point
ordering — the report's model description is accurate.

Both failures reproduced **live** on the extracted pre-fix production build (`git archive d21b47a world`, served locally):
- east brig drawn over Hero D's sails (same depth 7, later creation order);
- player standing at (1024, 875) drawn on top of the Hall pediment/roof (11 > 5).

Discrepancy: the report's "Hero D contact Y `1254`, east brig `1144`" are **pre-translation layout values**. Actual runtime values
after the −96 town translation are **1158** and **1048** (confirmed in the live scene: depths `91580.968` and `90480.586/.754`).
The 110 px separation and the conclusion are unchanged; only the numbers in the report (and the Hero D value in the test comments)
are stale. See DP-03.

---

## E. Depth Band Architecture

```text
DEPTH_BANDS_NEEDS_FIX
```

The band table matches code exactly (`WORLD_DEPTH`, verified by evaluation). Sharing `WORLD_OBJECT_BODY` and `ACTOR_PLAYER` at
80,000 is deliberate and safe: player and objects are meant to interleave by contact Y. `UPPER_OCCLUDER` is defined but unused
(reserved, as reported). The old magic depths in Player/WorldScene/catalog are all replaced.

Two classification defects, however, mean "no category bypasses or is mis-handled by the policy" is not true:

- **Edge treatment (DP-01).** `drawHarborEdgeTreatment` was moved from `-2` to `GROUND_DETAIL` (20,000). Water is
  `GROUND_WATER` (0 + tie) — so the edge (greenery frame) is now **above** water, whereas it was intentionally *below* water before.
  Live comparison, old vs new: the entire south water strip (world y 1216–1280) gains a dark-green band and a diagonal light-green
  line, and the left/right basin edges gain a green strip over water. The approved harbor look (water to the world edge) changed.
- **Flat walkable surface as body (DP-02).** `viewing-terrace` (a flat stone slab, 160 × 80, non-collidable, walkable) is in
  `BODY_TYPES` (band 80,000), so it is y-sorted like a standing object and sits *above* actors standing on it and *above* low
  props (60,000) placed on it. Live at (704, 880): the player is visible on the terrace in the old build and **invisible** in the new
  build; the terrace lamp head (lamp at `LOW_PROP`, terrace at body band) is visibly clipped in the new build. `study-garden` and
  `planter` are small standing objects and are fine.

The band *values* need no change; the type-to-band mapping and the edge treatment do.

---

## F. Band Separation Math

```text
BAND_SEPARATION_MATH_PASS
```

Recomputed: max contact contribution = `1280 × 10 = 12,800`; real objects' `visualGroundContactY` range is 240–1280; the player's foot is
clamped to ≤ 1280. Tie < 1. So a band's maximum is `base + 12,800.9999`, which is `< base + 20,000` — no cross-band collision.
Adjacent band gaps: 20,000 / 20,000 / 20,000 / 20,000 / 0 (body = actor by design) / 40,000 / 40,000 / 40,000. Every layout
visual's computed depth lands in its intended band (checked for all 68). Doubles represent `≈ 92,800.9999` exactly enough
(~1e-11 resolution).

---

## G. Y-aware Formula

```text
Y_AWARE_FORMULA_PASS
```

`depth = base + Math.round(contactY) × 10 + stableTie(id)`. Monotone in the rounded row; a one-pixel change is 10 while the tie is
`< 1`, so it can never invert one-pixel separation. `Math.round` is deterministic across engines. Ties are broken by id hash, not
insertion order, so shuffling creation order does not change ordering (only exact-depth equality would, and none exist among the
layout ids — see H). The player's fractional foot Y is rounded per frame, so order flips at whole-pixel boundaries only; there is no
flicker from sub-pixel motion. Suitable for the 2048 × 1280 world (max 12,800).

---

## H. Stable Tie

```text
STABLE_TIE_PASS_WITH_MINOR
```

Integer 31-multiplier hash with `>>> 0` (max intermediate ≈ 1.3e11, below 2⁵³): deterministic across loads and engines, no random
values, no allocation (string index loop). Range over the layout ids: 0.0089–0.9948; **no tie collisions among the 68 visuals +
zones + player**. Granularity is 1e-4, so collisions between arbitrary future ids are possible but only affect objects that also
share a contact row, which is deterministic anyway.

Minor (DP-05): the player face is set to `depth + 0.1`. Any same-row object whose tie falls within 0.1 above the player's tie
(`0.0857`) ends up *between* body and face: body behind the object, face in front. Computed for integer foot rows: foot row 652
against `square-planter-southwest` and `-southeast` (both non-collidable, walkable), and row 1176 against an offshore boat
(unreachable). A one-pixel-row glitch, not observed live. A face offset below the tie granularity (e.g. 1e-5) removes it.

---

## I. Anchor Semantics

Contact Y equals the world Y where the sprite's origin is placed, so ordering follows the same point that positions the art:
`setOrigin(0.5, originY)` at `(x, contactY)`. That is the correct, padding-independent semantic (transparent padding, mast and roof
height never enter). Details below.

## J. Hero D Anchor

```text
HERO_D_ANCHOR_PASS_WITH_MINOR
```

`+18` is not a new magic number: it is the pre-existing placement offset (`ship.y + 18`, `originY 0.84`) — the depth uses the same
world point the art is anchored to. Layout ship y is 1140 (footprint bottom 1180); the anchor is 1158. D's hull content extends
≈ 30 px below the anchor (content bottom ≈ 0.955 of canvas vs 0.84), the usual sub-waterline hull; ordering vs any neighbour is
governed by the anchor, which is what a waterline sort requires.

Minor (DP-06): the literal `18` appears twice in `WorldScene.drawFirstAssetSlice` (placement and depth) with no shared
constant, and the programmatic fallback (`getHarborVisualDepth`) yields `y + h/2 = 1180` (depth `91800.97`) versus the asset's
`91580.97`. The fallback is only used when the texture is missing, so no live effect; drift risk only.

## K. Secondary Vessel Anchors

```text
SECONDARY_VESSEL_ANCHORS_PASS
```

Assets are placed at `vessel.y + vessel.height / 2` and depth uses the identical expression, so ordering follows the placement
point (not "sprite bottom by convenience"). Content bottoms sit ≈ 12 px below it, again the sub-waterline hull. Programmatic small
boats: `drawBoat` draws the hull tip at `top + height − 3`, i.e. within 3 px of the footprint-bottom contact — consistent.

## L. Building Anchors

```text
BUILDING_ANCHORS_PASS
```

`building.y + height/2`: Hall = 1024, which is exactly where the Hall PNG's base is placed (`y + h/2`, `originY 0.91`). Programmatic
Guild/Academy/Workshop fills run to `top + height`, so the same value is their visual base. Warehouse fill also runs to
`top + height`. Values: Academy 192, Guild 608, Workshop 608, Hall 1024.

## M. Player Anchor

```text
PLAYER_ANCHOR_PASS
```

`player.y + PLAYER_HEIGHT/2` is the centre-anchored rectangle's bottom edge = foot. Body and face are both re-set from the same
value each frame (face `+0.1`, see H); live check: body depth `88910.086` for foot 891 (`80000 + 8910 + 0.0857`).

---

## N. Hero D / East Brig

```text
HERO_BRIG_ORDER_PASS
```

Actual values (independently computed and read from the live scene): Hero D contact **1158**, depth **91580.968**; east brig
contact **1048**, depth **90480.754**; west brig 1048 / `90480.586`. D is in front. Live render at Hero D/brig framing: brig is
behind D's sails and mid-hull, correct. (The report's 1254/1144 are the un-translated numbers; see D and DP-03.)

## O. Full Fleet Ordering

```text
CURRENT_FLEET_ORDER_PASS_WITH_MINOR
```

Contacts (translated): Hero D 1158; schooner and cutter 1049; both brigs 1048; small boats 1166–1176. No pair with overlapping
visual envelope is inverted; the small boats sit horizontally clear of the hero and of the schooners (verified against display
boxes). Brig/brig, schooner/cutter rows differ by ≤ 1 px but are horizontally separate, and ties are deterministic. Tall masts do
not affect ordering (contact-Y only). Live full-fleet frame at zoom 0.6 looked plausible. Minor: the depth values in the report are
stale (DP-03).

---

## P. Exhibition Hall Occlusion

```text
EXHIBITION_OCCLUSION_PASS_WITH_MINOR
```

Live, production build: player at (1024, 875) (foot 891, collision-top approach) is **hidden behind the Hall roof** — old build
shows the player painted over the pediment; player at (1024, 1062) is **in front**, on the dock, visible. Depth check:
foot 992 → player depth `89920.086` < Hall `90240.199` (behind); foot 1056 → `90560.086` > Hall (in front).

Minor (DP-04): the Hall art is 340 px wide (content ≈ 324) while its collision footprint is 256 wide. At x ≈ 872 (12 px outside
collision, on open grass) with foot rows above 1024 the player is drawn **behind the Hall's side wings** and is visibly
clipped (live check). It is consistent with the sort but is a strip of about 30 px each side where the player stands beside, not
behind, the building. Not mentioned in the report's limitations.

## Q. Whole-building Ordering Assessment

```text
WHOLE_BUILDING_ORDERING_SAFE_WITH_DOCUMENTED_LIMIT
```

Current buildings are footprint-blocked; the player cannot reach the visual body, so "behind the whole building north of the base,
in front south of it" is correct for every approach route, and no PNG split is needed now. The limits to document: (1) art wider
than the footprint (Hall wings, DP-04) can partially hide a player standing beside it; (2) any future traversable or tall-overhang
asset needs the reserved upper-occluder split, as the report says. Neither is a current defect. This conclusion applies to
buildings only; it does not extend to flat walkable surfaces (DP-02).

## R. Other Destination Buildings

```text
DESTINATION_BUILDING_REGRESSION_PASS
```

Guild Hall, Academy and Workshop (programmatic): live frames with the player north and south of each on the normal approach
(paths/forecourts) showed correct in-front/behind behaviour and labels drawn above; no regression versus the previous look. (An
Academy-north frame at (1024, 80) placed my teleported player inside the collider; not a valid approach and not counted.)

---

## S. Docks / Jetty / Collision

```text
WALKABLE_STRUCTURE_DEPTH_PASS
COLLISION_PRESERVATION_PASS
```

Walkable piers and the service jetty are in the 40,000 band: above water (0), below actors (80,000). The main
`waterfront-dock` has no `walkable` flag, so it falls in the 20,000 ground-detail band (below piers, above paths/plaza): correct
for its role. Live: player visible on the main dock (1024, 1056) and on the service jetty (1096, 1090); piers unobstructed. The
Hall-front items (crate, bollards) still overlap the dock correctly.

Collision: no collision, layout, or water-geometry file appears in `d21b47a..HEAD`; the existing pier, service-jetty, water
carve-out, building collision and layout tests all pass (17/17). Depth code never reads or writes physics bodies.

**Exception — flat walkable surfaces that are not docks:** see DP-02.

---

## T. Labels / UI

```text
LABEL_ORDER_PASS
HTML_UI_SEPARATION_PASS
```

All world labels use `LABEL_WORLD_ANNOTATION` (160,000 + tie), above every object, the player and the reserved upper-occluder band
(120,000); live frames show Hall, Harbor Square, Guild, Academy and Workshop labels readable over ships, roofs and the player. No
label can be hidden by any current object. The HTML shell (header/exit link) is DOM and outside Phaser ordering. The dev
calibration overlay uses `HTML_UI + n` as a Phaser depth (a naming reuse, not a leak); it is behind `import.meta.env.DEV` and the
production-bundle test still passes (no calibration query path). Cosmetic: a Phaser-internal overlay borrowing the "HTML/UI" band
name is slightly misleading.

---

## U. Performance

```text
STATIC_DEPTH_PERFORMANCE_PASS
PLAYER_DEPTH_PERFORMANCE_PASS_WITH_MINOR
```

Static objects receive depth once at creation; no per-frame array sorting written by the project. Player: two scalar `setDepth`
calls per frame inside the existing POST_UPDATE flow, no allocations.

Minor (DP-07): Phaser's `depth` setter (`Depth.js`) **always** calls `displayList.queueDepthSort()`, even when the value is
unchanged, so the scene's display list (~100–150 objects: 68 visuals, paths/forecourts/zones/edges, labels, images, player) is
re-sorted by Phaser every frame. Trivial at this size and not a defect, but the report's "no scene-wide sort" is true only for
project code. Also `stableDepthTie("actor-player")` is re-hashed per call. Guarding `setDepth` on a change of the rounded foot row
(and caching the player tie) restores the previous zero per-frame sort cost. Worth doing before asset counts grow.

---

## V. Test Review

```text
DEPTH_TESTS_PASS_WITH_MINOR
```

`tests/world-depth.test.mjs` covers semantic band order, increasing Y, deterministic ties (equal id → equal tie; distinct ids
distinct; one-pixel Y wins), Hero D vs east brig from real layout data, and player north/south of the Hall base. It passes.

False-confidence issues (DP-08):
- Hero test hard-codes `hero.y + 18`, duplicating the scene code rather than reading a shared source; it also uses the
  translated layout (so it is correct, unlike the report text).
- The "max-tie"/"min-tie" ids are not actually the extreme tie values; the invariant `tie < 1` is never asserted directly.
- No band-overflow test (assert max contact contribution and every layout type's depth fall inside its band).
- No test on the **type→band mapping** or on **edge vs water** order — either would have caught DP-01 and DP-02.
- Tests exercise pure functions only; nothing exercises `WorldScene` wiring or the Phaser display list.

---

## W. Re-run QA

Run from `portfolio-world/` after stopping the stale preview:

| Step | Result |
| --- | --- |
| `npm ci` | PASS (19 packages, 0 vulnerabilities) — after the stale-preview issue in B |
| `npm run typecheck` | PASS (`tsc --noEmit`, exit 0) |
| `npm run build` | PASS: `world/assets/index-2lo3nuZH.js` 1,419.51 kB / gzip 368.86 kB (only the pre-existing chunk warning) |
| `npm test` (typecheck + build + `node --test`) | **17/17 PASS**, 0 fail |
| Build reproducibility | rebuilt output is byte-identical to the committed `world/` (tree stayed clean; same `index-2lo3nuZH.js` hash) |
| `git diff --check` | PASS (exit 0) |

---

## X. Runtime Visual QA

**Evidence source: live visual inspection plus code/data reconstruction.** I served the production build (`vite preview`, base
`/MyPage/world/`) and, for comparison, the pre-fix build extracted from `d21b47a`, drove headless Chrome over the DevTools
protocol, captured the live Phaser game instance (a prototype-setter hook injected before load — observation only, no repo
change), placed the camera/player and captured screenshots, and read live object depths. The screenshots are **not saved as
project evidence** (scratchpad only) and none is claimed as such. Interactive keyboard play was not exercised; player positions were
set directly. Each case is a single static frame, not a moving sequence.

| Case | Result |
| --- | --- |
| 1 Hero D + east brig | PASS — D in front; live depths 91580.968 vs 90480.754 |
| 2 Hero D + all secondary vessels | PASS — plausible order, no inverted envelope |
| 3 Player north / south of Exhibition base | PASS — behind / in front (old build: over the roof) |
| 3b Player beside Hall wings | limit — partial hiding (DP-04) |
| 4–6 Guild Hall, Academy, Workshop | PASS on normal approaches |
| 7 Main dock | PASS — player visible on dock |
| 8 Service jetty | PASS — player visible |
| 9 Labels over objects | PASS |
| Extra: south / west edge, old vs new | **FAIL** — greenery over water (DP-01) |
| Extra: player on viewing terrace, old vs new | **FAIL** — player hidden, lamp head clipped (DP-02) |

---

## Y. Foundation Regression

```text
FOUNDATION_REGRESSION_NEEDS_FIX
```

Unchanged and verified: world 2048 × 1280; viewport 1024 × 576; camera 15° / yaw 0° (no camera/asset change in diff); asset sizes and
positions (manifest and layout data untouched); IA and collision geometry; water carve-outs; player controls; `BASE_URL`
handling (base-prefixed asset URLs 200 in the preview; asset-loading tests pass); root portfolio; Pages model.

Not preserved: the **approved visual state of the water/edge** (DP-01) and **player visibility on the flat walkable terrace**
(DP-02). Both are depth-classification regressions rather than foundation changes, but they alter shipped visuals.

---

## Z. Findings

No Blocker. Two Major (both regressions, both live-reproduced), seven Minor.

```text
ID: DP-01
Severity: Major
Category: band architecture / regression
Finding: The world-edge greenery treatment now renders above water; before the fix it rendered below it.
Evidence: harborVisualCatalog.ts — edge depth changed from -2 to WORLD_DEPTH.GROUND_DETAIL (20,000); water is
  GROUND_WATER + tie (< 1). Live old-vs-new screenshots at the south edge (world y 1216–1280) and west edge: new build shows a
  dark-green band and diagonal line across the water and green strips over the left basin; the old build shows water to the edge.
Impact: Visible change to the human-approved harbor look on every south-facing view; not covered by any test.
Recommended action: Place ground and edge treatment below water (e.g. explicit sub-order below the water tie inside the
  ground band) and add a test asserting ground < edge < water < paths < plaza. Acceptance: south/west edge frames match d21b47a.

ID: DP-02
Severity: Major
Category: building/ground occlusion / regression
Finding: viewing-terrace (flat, walkable, non-collidable slab) is classified as a world-object body, so it draws above the player
  standing on it and above low props placed on it.
Evidence: worldDepth.mjs BODY_TYPES includes "viewing-terrace"; terrace (704,880), contact 920 → depth ≈ 89,200; player on it
  has foot < 920 → depth < terrace; lamp (LOW_PROP 60,000 + …) below the terrace. Live at (704, 880): player visible in old build,
  invisible in new; lamp head clipped in new.
Impact: The player disappears on a reachable, decorated waterfront area; the same class error will recur for any future flat
  walkable slab, terrace, or plaza extension.
Recommended action: Classify flat walkable surfaces (terrace) as GROUND_DETAIL or WALKABLE_STRUCTURE (below LOW_PROP and actors);
  audit study-garden/planter (standing objects — fine) and document the rule "flat surface = ground band, standing object = body
  band". Add a test asserting every walkable non-collidable flat type sorts below the actor band.

ID: DP-03
Severity: Minor
Category: documentation mismatch
Finding: The implementation report gives Hero D contact 1254 and east brig 1144; actual runtime values are 1158 and 1048.
Evidence: worldLayoutData.json values are pre-translation (-96 Y shift); live depths 91580.968 / 90480.754.
Impact: Misleading numbers in the record; ordering unaffected.
Recommended action: Correct the report values (or state they are pre-translation).

ID: DP-04
Severity: Minor
Category: building occlusion (documented limit missing)
Finding: Whole-building ordering partially hides a player standing beside the Hall on open grass because the art is wider than the
  collision footprint.
Evidence: Hall art content ≈ 324 px vs footprint 256; live at (872, 975): player clipped by the wing, visible in the old build.
Impact: Cosmetic strip of ~30 px each side; correct in a 3/4 sense but unmentioned.
Recommended action: Add it to Known Limitations; no code change needed now.

ID: DP-05
Severity: Minor
Category: formula / tie
Finding: Player face is depth + 0.1, larger than the 1e-4 tie granularity, so same-row objects can fall between body and face.
Evidence: Computed cases: foot row 652 vs square-planter-southwest / southeast (reachable).
Impact: One-row visual glitch (face over an object the body is behind); not observed live.
Recommended action: Use a face offset below the tie granularity (e.g. 1e-5).

ID: DP-06
Severity: Minor
Category: anchor
Finding: Hero D's 18-px anchor offset is duplicated in placement and depth, and the programmatic fallback uses a different contact
  (footprint bottom, 1180 vs 1158).
Evidence: WorldScene.ts drawFirstAssetSlice; getHarborVisualDepth for "large-ship".
Impact: Drift risk only; no live effect while the texture exists.
Recommended action: One shared constant/helper for Hero D's contact Y; make the fallback consistent.

ID: DP-07
Severity: Minor
Category: performance
Finding: Player setDepth() is called every frame and Phaser's depth setter always queues a display-list depth sort; the player tie is
  re-hashed each call.
Evidence: node_modules/phaser/src/gameobjects/components/Depth.js (queueDepthSort in the setter); Player.syncVisualDepth.
Impact: Small (~100–150 objects) but it reintroduces a per-frame sort that the old model did not have.
Recommended action: Call setDepth only when the rounded foot row changes; cache the actor tie.

ID: DP-08
Severity: Minor
Category: test coverage
Finding: Tests pass but would not have caught DP-01 or DP-02 and rely on hard-coded duplicates.
Evidence: See section V.
Impact: False confidence as the object catalogue grows.
Recommended action: Add band-overflow, tie-range, type→band and edge/water-order tests; source the Hero D contact from one helper.

ID: DP-09
Severity: Minor
Category: process
Finding: A leftover vite preview process (port 4173) blocks npm ci on Windows.
Evidence: EPERM unlink on the rolldown binding; PIDs identified; earlier records note the same lock.
Impact: Blocks the mandatory QA reinstall for the next agent.
Recommended action: Stop preview servers at task closeout; note it in the handoff checklist.
```

---

## AA. Next-step Readiness

Not ready to proceed to Scale Bible + Asset Weight Lock. Codex should fix DP-01 and DP-02 (plus, optionally, DP-03/05/06/07/08 in
the same small change), then a short focused re-check is enough: edge/south-west frames match `d21b47a`, the player is visible on
the viewing terrace, and the existing tests plus the new ones pass. The depth model, bands, formula, anchors and the
whole-building decision themselves do not need redesign. Mass asset production remains on hold. `91_STATUS.md` / `92_HANDOFF.md`
were not changed because the review did not complete successfully; they still describe the fix as awaiting independent review.

## AB. Final Recommendation

```text
RETURN_TO_CODEX
```
