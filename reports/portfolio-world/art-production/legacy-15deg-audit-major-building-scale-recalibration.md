# Legacy 15° Compliance Audit + Major Building Scale Recalibration

## A. Gate

```text
VISUAL_GRAMMAR = LOCKED (Hybrid Orthographic 2.5D / 15° / yaw 0°)
FULL_ASSET_ROLLOUT = HOLD
FINAL_GATE = READY_FOR_RECALIBRATION_HUMAN_REVIEW
```

## B. Work Context

2026-09-19, `feature/portfolio-world-sprint-02`; work-context reported the expected HOME_WINDOWS profile, Node `v24.16.0`, npm `11.13.0`, clean worktree, and an up-to-date fast-forward pull.

## C. Starting Commit

`ce51475 docs(portfolio-world): review mass asset production batch 01`.

## D. Human Review Source

The authoritative focused correction instruction records the independently reviewed Batch 01 result and requires the four major buildings to use the player/door/mass calibration chain. It identifies Workshop as visually over-enlarged, Academy as visually reduced, accepts current ship-size hierarchy, and requires a direct legacy-geometry audit.

## E. Active Runtime Asset Inventory

| Asset | Runtime status | Render use | Pre/Post lock |
| --- | --- | --- | --- |
| Guild Hall v01 | ACTIVE_PRODUCTION | `career` | POST_LOCK |
| Academy v02 | ACTIVE_PRODUCTION | `lecture` | POST_LOCK art, recalibrated export |
| Workshop v02 | ACTIVE_PRODUCTION | `ai-lab` | POST_LOCK art, recalibrated export |
| Exhibition Hall v02 | ACTIVE_PRODUCTION | `gallery` | PRE_LOCK art, recalibrated export |
| Hero Ship D | ACTIVE_LEGACY | `harbor-large-ship` | PRE_LOCK |
| Brig | ACTIVE_LEGACY | west + mirrored east merchant berths | PRE_LOCK |
| Medium Sailing Vessel | ACTIVE_PRODUCTION | west cargo berth | POST_LOCK |
| Cutter | ACTIVE_LEGACY | east cutter berth | PRE_LOCK |
| Four small working boats | ACTIVE_PRODUCTION (programmatic) | waterfront, basin, cargo, offshore | POST_LOCK runtime grammar |
| Secondary Schooner | DEPRECATED | not preloaded or rendered | PRE_LOCK |
| Hero A/B/C and calibration PNGs | CONCEPT_UNUSED / CALIBRATION_ONLY | DEV only | PRE_LOCK evidence |

`WORLD_ASSETS` now makes active Hero D, Brig, Cutter, Medium Vessel, and all four destinations `GAME_READY`; the orphaned Schooner is `DEPRECATED`.

## F. Legacy vs Post-lock Classification

Commit ancestry confirms Exhibition (`8c17eda`) and Hero D/Brig/Cutter (`e501d0c`) predate Visual Grammar Lock `d21b47a`. Pre-lock means audit required, not failure. Guild/Academy/Workshop/Medium Vessel entered after the lock; their visible geometry was still inspected rather than trusted from provenance.

## G. Building 15° Audit

| Building | Result | Visual geometry conclusion |
| --- | --- | --- |
| Guild Hall | PASS_WITH_MINOR | facade dominates; pitched roof is shallow and readable; central entrance aligns with facade |
| Academy | PASS_WITH_MINOR | facade remains dominant despite institutional dome; roof visibility remains secondary |
| Workshop | PASS_WITH_MINOR | facade/work-bay dominates; controlled roof strip and vertical walls avoid bird's-eye reading |
| Exhibition Hall | PASS_15_DEG | pre-lock frontal facade has shallow roof exposure, readable entrance, and no high-isometric treatment |

## H. Ship 15° Audit

| Vessel | Result | Visual geometry conclusion |
| --- | --- | --- |
| Hero Ship D | PASS_WITH_MINOR | hull side remains the mass; continuous deck is secondary, masts vertical, bow/stern readable |
| Brig | PASS_WITH_MINOR | side-dominant two-mast hull with visible but subordinate deck and clear heading |
| Medium Sailing Vessel | PASS_15_DEG | two-mast hull/deck/sail relationship cleanly matches the locked grammar |
| Cutter | PASS_WITH_MINOR | small hull keeps a readable deck cue without turning into a bird's-eye illustration |
| Programmatic working boats | PASS_WITH_MINOR | intentionally simplified hull/sail marks; remain below cutter and do not impersonate a medium vessel |

## I. Noncompliant Ship List

None. No active vessel is a pure side profile or a bird's-eye top view; no material 15° contradiction was found.

## J. Ship Correction Disposition

No correction batch is opened. Preserve all active vessel display sizes, object headings, berth geometry, collision, and fleet identity. The pre-lock assets are `PRE_LOCK_BUT_COMPLIANT`, with the three `PASS_WITH_MINOR` notes retained as visual follow-up context rather than treated as defects.

## K. Building Scale Measurement Method

Measurements use actual runtime 1× display pixels, not padded source width. The readable framed main-door opening was measured from the rendered raster; source and practical-alpha bounds are recorded in `majorBuildingScaleAudit.json`. Door readings carry +/- 2 px uncertainty from antialiasing, decorative frame thickness, and projected edges.

## L. Player Reference

The programmatic runtime player is `24×32 px`. It is a calibration reference only; collision remains independent from art.

## M. Door Reference Rule

Target main-door width is `1.8–2.6×` player width (43–62 px), practically “about two players side-by-side.” Door heights are accepted at `1.5–2.15×` player height to preserve differing civic, institutional, workshop, and waterfront identities.

## N. Guild Hall Measurements

338×204 display; 330×196 visible; main door 50×58; door/player 2.08× / 1.81×; door/visible mass 0.152 / 0.296. Action: retain as the broad civic reference.

## O. Academy Measurements

Before 338×198; after 370×216 display / 362×208 visible; main door 50×57; door/player 2.08× / 1.78×; door/visible mass 0.138 / 0.274. Action: uniform increase, no raster redesign.

## P. Workshop Measurements

Before 338×198; after 291×170 display / 283×162 visible; readable split-door bay 60×51; door/player 2.50× / 1.59×; door/visible mass 0.212 / 0.315. Action: uniform reduction, preserving its compact practical identity.

## Q. Exhibition Hall Measurements

Before 332×204; after 356×218 display / 348×210 visible; main door 46×60; door/player 1.92× / 1.88×; door/visible mass 0.132 / 0.286. Action: uniform increase of compliant pre-lock art.

## R. Cross-building Ratio Analysis

All four doors now fall in the same 1.8–2.6× width family (1.92–2.50×) and 1.5–2.15× height sanity family (1.59–1.88×). Guild remains broad, Academy institutional and taller, Workshop compact, and Exhibition wider-fronted; equal PNG dimensions were neither used nor desired.

## S. Recalibration Decisions

Guild Hall remains v01. Academy, Workshop, and Exhibition are uniform v02 re-exports at their corrected 1× runtime size: `academy-v02.png` 137,572 bytes, `workshop-v02.png` 97,906 bytes, and `exhibition-hall-v02.png` 135,282 bytes. All have practical-alpha content with 4 px padding, zero hidden RGB, and remain within the 138,240-byte destination ceiling.

## T. Same-class Scale Consistency Rule

`SAME_CLASS_SCALE_CONSISTENCY = REQUIRED`. Primary buildings use player -> door -> floor/building mass; ships use hull/deck/human cues -> hierarchy; trees use trunk/canopy/player; small props use player/hand-or-waist cues. This is a production rule, not a command to homogenize silhouettes.

## U. Runtime Changes

Manifest display and source dimensions now point to three v02 exports; `PRIMARY_DESTINATION_PLAYER_DOOR_BUILDING_V1` records the shared policy. An executable audit and focused test make the four displays, player reference, door range, active ship statuses, and Schooner deprecation reviewable. DEV-only `scaleReview` player/camera views prepare door, whole-world, tree, and prop comparisons and are asserted absent from the production bundle.

## V. Collision / IA Protection

No destination coordinate, collision rectangle, route, reserved lot, water carve-out, interaction mapping, player control value, or world layout was changed. Visual bounds remain independent from collision. The known art-overhang limitation is retained; no collision change was silently inferred.

## W. Whole-world Comparison

Live runtime inspection covered all four player-at-door views, a four-building whole-world frame, Hero D plus active secondary vessels, and tree/prop adjacency. Academy no longer reads as a reduced model; Workshop no longer visually dominates as a blown-up small shop; Guild and Exhibition remain coherent references. The existing hero-to-medium-to-working-boat hierarchy remains intact.

## X. QA

Final QA passed after documentation updates: `npm ci` completed with 0 vulnerabilities; `npm run typecheck` passed; `npm test` passed 22/22; `npm run build` emitted `index-BxAv_xSE.js` at 1,424.89 kB (gzip 369.85 kB); and `git diff --check` was clean. The only build note is Vite's existing >500 kB chunk advisory. The focused suite also verifies production dead-code elimination of review queries.

## Y. Remaining Findings

No ship art correction is required. The pre-lock Hero D, Brig, and Cutter remain visually approved with minor audit notes only. Destination visual art still may overhang the fixed 256 px collision footprint by design; this correction does not change that accepted collision-independent limitation.

## Z. Human Review Required

Review the dev-only player-at-door and four-building frames for aesthetic acceptance of Academy's increase and Workshop's reduction. Confirm that the retained within-class differences feel intentional. Do not use this review to authorize full asset rollout.

## AA. Final Gate

```text
READY_FOR_RECALIBRATION_HUMAN_REVIEW
```
