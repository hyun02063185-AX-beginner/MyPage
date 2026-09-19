# Portfolio World — Depth / Occlusion Runtime Fix v1.1 — Short Independent Re-check

> Canonical repo path:
> `reports/portfolio-world/depth-occlusion/depth-occlusion-runtime-fix-v1-1-short-recheck.md`

Reviewer: Claude Code (independent). Scope: targeted verification of the v1.1 regression patch (`2587f3a`, `83c12f4`) against my
`RETURN_TO_CODEX` review (`01009a3`). The full v1 review is not repeated. No runtime code, asset, or test in the repository was
modified; mutation checks, servers and screenshots lived in the session scratchpad.

---

## A. Gate

```text
READY_FOR_SCALE_BIBLE_ASSET_WEIGHT_LOCK
```

Both Major regressions are closed, the original v1 fixes are preserved, the new tests catch each defect when it is reintroduced,
and QA is 20/20. No Blocker or Major remains. Two Minor notes are recorded (section P); neither affects the correctness of the
current depth foundation.

Visual Grammar remains locked (`HYBRID_ORTHOGRAPHIC_2_5D`, 15°, yaw 0°). Mass asset production remains **on hold**.

---

## B. Work Context

| Item | Value |
| --- | --- |
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | `win32 x64` |
| Branch | `feature/portfolio-world-sprint-02` (expected) |
| HEAD at start | `83c12f4 docs(portfolio-world): record depth regression patch` |
| Git status at start | clean |
| Node / npm | `v24.16.0` / `11.13.0` |

Environment note: a stale `vite preview` (PID 34092, port 4173, this repo's own server left by the patch session) was again
running and would have blocked `npm ci` (same Vite/rolldown native-binding lock as before). I stopped exactly that process and no
other. After the re-check, the preview and headless-browser processes I started were also stopped; no listeners remain on
4173/4174/4175/9333.

---

## C. Reviewed Range

`01009a3..83c12f4`. Runtime/test files changed: `worldDepth.mjs`, `worldDepth.mjs.d.ts`, `harborVisualCatalog.ts`,
`WorldScene.ts`, `Player.ts`, `tests/world-depth.test.mjs`, plus rebuilt `world/` output. The patch report was read and every claim
in it was checked against the code diff and the running build. Diff outside depth policy: none.

---

## D. Edge Greenery Fix

```text
EDGE_GREENERY_FIX_PASS
```

Root cause was the edge treatment being placed in the 20,000 ground-detail band, above water (0). The patch introduces two
explicit background bands — `BACKGROUND_GROUND = -40,000`, `BACKGROUND_EDGE = -20,000` — and routes the edge through
`getBackgroundEdgeDepth()`, with ground at `BACKGROUND_GROUND`. The order is now ground < edge < water (0) < ground detail/paths/
plaza (20,000+), the same relative order the pre-fix build had (−4 < −2 < 0 < 1 < 2) but expressed as semantic bands with wide
gaps. It is not a hidden magic number: the value has a named band, a named accessor, a declaration, and an ordering assertion in the
band test. Ground remains below the edge, so land greenery still shows where land is uncovered.

## E. South / West Edge Visual Re-check

```text
EDGE_VISUAL_REGRESSION_CLOSED
```

Live comparison against the extracted `d21b47a` production build (same camera and viewport):

- **South water edge:** the dark-green band and diagonal line across the bottom of the water are gone; the water reads to the
  world edge exactly as in `d21b47a`.
- **West basin edge:** the greenery strip stays visible over land at the far left, stops at the water, and no greenery overlays
  the basin water. Shoreline is identical to `d21b47a`.

---

## F. Viewing Terrace Fix

```text
VIEWING_TERRACE_FIX_PASS
```

`viewing-terrace` was removed from `BODY_TYPES` and placed in an explicit `FLAT_WALKABLE_TYPES` set mapped to
`WALKABLE_STRUCTURE` (40,000). Relation is now water/ground (0 or below) < terrace (`40,000 + 9,200 + tie`) < player
(80,000 + …). Live at the terrace centre (704, 880): the player is **visible on the terrace**, matching `d21b47a` (in the v1
build the player disappeared). The change is scoped to the one type; docks, buildings, and low props are not reclassified.
Cosmetic: the nested ternary in `getHarborVisualDepth` is indented misleadingly (functionally correct).

## G. Terrace Lamp

```text
TERRACE_LAMP_PASS
```

The lamp stays in `LOW_PROP` (60,000), independent of the terrace layer and not merged into it. Terrace (≈ 49,200) < lamp
(≈ 69,600), so the platform can no longer cover the lamp. Live 2.4× zoom at the lamp: the lamp head is fully drawn, identical to
`d21b47a`; the v1 build clipped it. Player/lamp relation is unchanged (low props sit below actors, as before the fix).

---

## H. Hero D / East Brig Preservation

```text
HERO_BRIG_FIX_PRESERVED
```

Live depths: Hero D **91580.968** (contact 1158) versus east brig **90480.754** (contact 1048), west brig 90480.586, cutter and
schooner ≈ 90490 — identical to the v1 review. Live render: D's hull and sails are in front of the brig. The old failure (brig over
D's sails) does not recur.

## I. Exhibition Hall Preservation

```text
EXHIBITION_OCCLUSION_PRESERVED
```

Hall depth `90240.199` (contact 1024, unchanged). Player at (1024, 875) is hidden behind the Hall roof; player at (1024, 1062) is in
front, visible on the dock. Both live.

---

## J. Hero Offset Deduplication

```text
HERO_OFFSET_DEDUP_PASS
```

`HERO_SHIP_WATERLINE_OFFSET_Y = 18` and `getHeroShipWaterlineY(ship)` in `worldDepth.mjs` are the single owner. A repository search
for the raw offset in the Hero path shows: asset placement and depth in `WorldScene.ts` both call the helper; the programmatic
`large-ship` fallback in `getHarborVisualDepth` now calls it (previously `y + h/2`, 1180 versus 1158, now consistent); the Hero/brig
test calls it. No duplicate raw `+ 18` remains in that logical path. The ordering path still resolves through `getVesselDepth`.

## K. Player Body / Face Depth

```text
PLAYER_BODY_FACE_DEPTH_PASS
```

`PLAYER_FACE_DEPTH_OFFSET = 0.00001` (below the `1e-4` tie granularity, exposed as `STABLE_DEPTH_TIE_GRANULARITY`), applied via
`getPlayerFaceDepth()` from the same foot Y. World-object depths lie on the lattice `base + row×10 + k×1e-4`; the open interval
(body, face) has width `1e-5`, so no object depth can fall strictly between them (an object with an identical tie has depth equal to
the body and stays behind the face). The previously reported reachable cases (planters at foot row 652) are covered. Body and
face are set together each frame in the same POST_UPDATE flow, so the player behaves as one spatial actor.

---

## L. Regression Test Review

```text
REGRESSION_TESTS_PASS_WITH_MINOR
```

Three tests were added; the Hero test now uses the shared helper.

- **Edge:** asserts `getBackgroundEdgeDepth(...) < getHarborVisualDepth(water)` (semantic), plus the band-order assertion
  `BACKGROUND_GROUND < BACKGROUND_EDGE < GROUND_WATER`.
- **Terrace:** on the real translated layout, asserts water < terrace < a player standing at the terrace base, and terrace < lamp.
- **Body/face:** asserts the offset is below the tie granularity and, over all 10,000 possible tie slots at a foot row, that no
  ordinary world-object depth lands strictly between body and face.

**Mutation check (scratch copy, not the repo).** I reintroduced each original defect and ran only the depth tests:

| Mutation | Result |
| --- | --- |
| baseline | 8/8 pass |
| terrace back into the body set | 1 fail — terrace test |
| edge accessor returns the ground-detail band | 1 fail — edge test |
| face offset 0.1 | 1 fail — body/face test |
| Hero waterline offset changed to −200 | 1 fail — Hero/brig test |

Each mutation is caught by exactly the intended test, so the tests validate semantics rather than restating constants.

Minor (RC-01): the edge test exercises the accessor, but the original DP-01 defect lived at the *call site*
(`drawHarborEdgeTreatment` passed `WORLD_DEPTH.GROUND_DETAIL` directly). A future edit that bypasses the accessor at the call site,
or changes the ground graphics' band, would not be caught; the id string `"harbor-edge-treatment"` is also duplicated between the
catalogue and the test. Non-blocking.

---

## M. QA

Run from `portfolio-world/`:

| Step | Result |
| --- | --- |
| `npm ci` | PASS — 19 packages, 0 vulnerabilities (after stopping the stale preview) |
| `npm run typecheck` | PASS (exit 0) |
| `npm run build` (inside `npm test`) | PASS — `world/assets/index-tdLPljhE.js` 1,419.81 kB / gzip 368.96 kB; only the pre-existing chunk-size warning |
| `npm test` | **20/20 PASS**, 0 fail |
| Build reproducibility | rebuilt output is byte-identical to committed `world/` (working tree stayed clean; same hash `index-tdLPljhE.js`) |
| `git diff --check` | PASS (exit 0) |

---

## N. Runtime Re-check

**Evidence source: headless browser inspection combined with code/data checks.** I served the patched production build
(`vite preview`, base `/MyPage/world/`) and, for comparison, the `d21b47a` production build extracted with `git archive`, drove
headless Chrome over the DevTools protocol, captured the live Phaser scene (observation-only hook injected before load), placed the
camera/player, captured frames, and read live object depths. Player positions were set directly rather than by keyboard
play. Screenshots were **not** saved to the repository and none is claimed as project evidence.

| Case | Result |
| --- | --- |
| 1 South water edge (vs `d21b47a`) | PASS — no strip over water |
| 2 West basin edge (vs `d21b47a`) | PASS — no greenery over basin water; land greenery intact |
| 3 Player on viewing terrace | PASS — visible |
| 4 Terrace lamp (2.4× zoom) | PASS — head intact |
| 5 Hero D + east brig | PASS — 91580.968 vs 90480.754, D in front |
| 6 Player north / south of Exhibition Hall | PASS — hidden behind / in front |

---

## O. Foundation Protection

```text
FOUNDATION_PROTECTION_PASS
```

The diff `01009a3..HEAD` outside the rebuilt `world/` output touches only the seven files listed in C (depth policy, its
declaration, three call sites, one test file, and the patch report). No change to world size `2048 × 1280`, viewport
`1024 × 576`, camera or the 15° / yaw 0° grammar, asset files/manifest/coordinates/sizes, layout data (IA), collision geometry or
water carve-outs (`waterCollisionGeometry.mjs` and layout files untouched, existing collision/layout tests still pass), player
movement, `BASE_URL` handling (asset-loading tests pass), the root portfolio, or the GitHub Pages model.

---

## P. Remaining Findings

No Blocker, no Major.

```text
ID: RC-01
Severity: Minor
Finding: The edge regression test covers the depth accessor but not the catalogue call site or the ground graphics' band; the
  accessor id string is duplicated in the test.
Evidence: tests/world-depth.test.mjs; harborVisualCatalog.ts drawHarborGround / drawHarborEdgeTreatment; mutation check.
Impact: A future call-site bypass could reintroduce DP-01 without failing a test.
Recommended action: Optional — a small source-level assertion, or export the edge id constant, when the next depth-adjacent change
  is made. Not required before the Scale Bible lock.

ID: RC-02
Severity: Minor
Finding: Cosmetic — misleading indentation of the nested ternary in getHarborVisualDepth; previously deferred v1 minors (Hall
  art wider than footprint DP-04, per-frame Phaser depth-sort queue DP-07, the v1 report's stale 1254/1144 figures DP-03) remain
  as recorded and were not made worse.
Evidence: worldDepth.mjs diff; v1 independent review section Z.
Impact: None on correctness.
Recommended action: Tidy when next touched; carry the deferred items forward as known follow-ups.
```

---

## Q. Next-step Readiness

The depth foundation (semantic bands, contact-Y ordering, waterline/foot/base anchors, whole-building ordering with its documented
limits, label band) is safe to build on. The next Director phase is **Scale Bible + Asset Weight Lock**. Mass asset production
remains on hold until those locks are made; this re-check does not authorise it. `91_STATUS.md` and `92_HANDOFF.md` are updated to
record depth/occlusion v1.1 as independently verified.

## R. Final Recommendation

```text
PROCEED_TO_SCALE_BIBLE_ASSET_WEIGHT_LOCK
```
