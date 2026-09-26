# R2D — Targeted Blockout Repair

Date: 2026-09-26
Branch: `feature/portfolio-world-rebuild-v2`
Starting HEAD: `ae7ee49`
Role: Blockout Repair Implementer (implementation + functional QA only)

**NO VISUAL PASS IS CLAIMED.** This report confirms that evidence was generated and that the intended coordinate changes appear on screen. Whether the layout now reads as a settlement spine with branches, whether the door reads as a human doorway, and whether LOW/MID/HIGH are judgeable belongs to the independent recheck.

## 1. Working Directory / Skill Discovery

- Working directory confirmed: `C:\Users\hyun0\MyPage` (repository root, branch `feature/portfolio-world-rebuild-v2`, HEAD `ae7ee49`, tree clean at start). Not started from the parent home directory.
- Skills **discoverable in this fresh session's Skill-tool list**: all nine — `environment-art`, `create-game-assets`, `phaser-game-setup-and-config`, `phaser-scenes`, `phaser-cameras`, `phaser-loading-assets`, `phaser-sprites-and-images`, `phaser-input-keyboard-mouse-touch`, `portfolio-world-visual-qa`.
- **Natively invoked via the Skill tool**: `environment-art`, `portfolio-world-visual-qa`, `create-game-assets`. The six Phaser skills were discoverable but not invoked; this repair touched drawing/route geometry and the QA harness, not scene lifecycle, loading, or input APIs.
- No direct-read fallback was needed. (R2C's failure to discover them was the working-directory limitation recorded in `90_DECISIONS.md` open item 7; it did not recur.)

## 2. Inputs Read

`r2c-independent-blockout-visual-qa.md`, `05_HARBOR_BLOCKOUT_SPEC.md`, `06_SCALE_CAMERA_CALIBRATION_PLAN.md`, `07_RUNTIME_QA_PLAN.md`, `92_HANDOFF.md`, plus `90_DECISIONS.md`/`91_STATUS.md`. The R2B `B-overview.png` and `D-scale-calibration.png` were reopened to confirm the R2C findings before changing anything. No new layout candidate was invented.

## 3. Files Changed

| File | Change |
| --- | --- |
| `portfolio-world-v2/src/scenes/WorldScene.ts` | Route geometry as shared constants; Square moved; door/player/forecourt rebuilt; projection profiles widened; walkable corridors derived from the drawn routes |
| `portfolio-world-v2/qa/r2b-runtime-qa.mjs` | `--set <phase>` evidence-set argument (default `r2d`); refuses to write `r2b` without `--allow-overwrite-historical`; zero-byte screenshot check; byte size and set name in the result |
| `world-v2/` | Rebuilt production artifact (`index.html`, one JS chunk replaced) |
| `reports/portfolio-world-rebuild/evidence/r2d/` | New evidence set (7 PNGs) |
| `docs/portfolio-world-rebuild/90_DECISIONS.md`, `91_STATUS.md`, `92_HANDOFF.md` | Updated |

Not touched: `00_VISUAL_BRIEF.md`, `01_ART_BIBLE.md`, `evidence/r2b/`, `portfolio-world/**`, `world/**`, root `index.html`, any root `package.json` (none created).

## 4. Junction / Route Repair

**Root cause.** The R2B branches were drawn from hard-coded points that happened to fall 386 world px apart on either side of the Square: Guild left the Workshop→Square leg at (720, 770) and Academy left at (1080, 630) — *inside the Square's own x-range* (825–1095). Moving markers could not have fixed that; the branch origins were the problem.

**Fix.** `SPINE`, `GUILD_BRANCH`, `ACADEMY_BRANCH` and `SQUARE` are now module constants. Each branch's first vertex is a spine vertex, so a branch can only leave where the spine is. Drawing and walkability read the same data.

Sequence along the spine (west → east), which is the required order:

```text
working dock / Workshop (345,1080)
  -> Guild stub, first shoreline bend (560,835)
  -> Harbor Square: a widening the spine passes through, centre (695,585)
  -> continued spine travel
  -> Academy branch, far later (1085,656)
  -> Exhibition Hall (1400, base 830)
  -> Hero Quay (1600,890) ...
```

| | R2B | R2D |
| --- | --- | --- |
| Square centre (world) | (960, 585) | (695, 585) — moved west along the spine |
| Guild origin | (720, 770) | (560, 835) — first shoreline bend, west leg |
| Academy origin | (1080, 630) — at the Square's right edge | (1085, 656) — 275 px past the Square's right edge |
| Guild→Academy origin | 386 px (178 screen px at overview zoom) | 555 px (255 screen px) |
| Guild origin → Square centre | 303 px | 284 px |
| Academy origin → Square centre | 128 px | 396 px |
| Academy origin → hall roof edge | — | 153 px |

Academy's origin moved from 128 px to 396 px from the Square centre (it no longer touches the Square); Guild, at 284 px, is now the nearer branch, with Academy ~1.4× farther, rather than near-equidistant on both sides. An intermediate attempt put both origins ~325 px from the Square centre (323 vs 328); that near-mirror pattern is exactly what `05_HARBOR_BLOCKOUT_SPEC.md` §6 warns about, so it was rejected and the Guild/Square positions were adjusted.

The Square is no longer the route convergence point: the spine runs through it and continues east, and only the Guild stub (on the west leg) and the Academy branch (after it) depart from the spine. Workshop is the terminus of the spine at the working dock, not a branch off the Square.

**Related defect fixed on the way (not in the R2C list).** `isWalkable` excluded the whole basin, but the drawn spine crosses the basin edge, so the Square → Exhibition → Hero Quay route was *not actually walkable* in R2B. Walkable corridors are now derived from the same route constants (spine 62 px, branches 36–38 px half-width, plus the Square and forecourt rectangles). Level-D check on the final constants: 0 of 189 sampled centerline points blocked. This has not been confirmed by playing the build.

**Drawing fix.** Branch edge strokes previously crossed the spine paving at junctions; all edges are now drawn before all paving.

**What Codex can and cannot say.** In `B-overview.png` the intended coordinate changes are visible: Workshop at the SW end, a short Guild road off the west leg, the Square as a widening on the spine, a long gap of open spine, then the Academy road leaving before the hall. Whether that reads as a *settlement spine with branches* rather than *four roads from one area* at squint distance is the independent recheck's call. Not self-certified.

## 5. Door / Player Scale

R2B: door top ~94 px above ground line vs a 54 px player (1.74×), stretched further by the projection height, and the player was placed on top of it.

R2D:
- Player reference height is unchanged (54 px: head + torso). Door placeholder is **38 × 68 px = 1.26× player height**, inside the 1.2–1.5× judging range, and is **fixed** — it no longer stretches with the projection; only the facade/roof exchange varies.
- The door sits on the hall's ground line (`baseY` 830), centred on the facade.
- The `scale` QA state places the player at (1464, 810): a ~33 px gap to the right of the door, same ground line, no overlap. Camera (1450, 770), zoom 0.92.
- The forecourt paving is now drawn *before* the hall so the hall stands on it, then bench (left) and lamp (right) share that ground line. `D-scale-calibration.png` shows player, door, bench, lamp, building mass, and paving together.
- Bench, lamp and paving remain unredesigned placeholders.

## 6. LOW / MID / HIGH Strategy

The Phaser camera is identical in all three. Only the illustrated geometry changes, by exchanging facade/hull-side for top-plane/deck across three subjects that all hold their anchor points (hall ground line, ship gunwale, quay footprint):

| | LOW (facade / hull-side) | MID (hybrid) | HIGH (top-plane / deck) |
| --- | --- | --- | --- |
| Exhibition Hall facade height | 252 | 186 | 130 |
| Hall roof | shallow gable, rise 28 | gable, rise 84 | broad hip-roof top plane with shingle courses, rise 140 |
| Hero Ship hull below gunwale / topsides | 114 / 76 | 64 / 50 | 34 / 16 |
| Hero Ship visible deck plane | ~4 (almost none) | 28 | 82, plank-lined |
| Mast/sail height | ×1.10 | ×1.00 | ×0.80 |
| Hero Quay front face | 46 px dark side face with pilings | 14 px | none — top plane only, lighter, heavier planks |
| Medium/Small vessels | deep hulls, no deck | mild | shallow hulls, visible deck plane |

Hall facade + roof total roughly the same height (≈280) across the three, so the change is an *exchange* of facade for top plane, not three different buildings. Plan-view ground/water, routes and all positions are identical.

Level-C only (does not prove the difference looks right): pixel change vs R2B's <1% is now low↔mid 2.16%, mid↔high 2.82%, low↔high 4.14%, concentrated in the hall, Hero Ship, quay and dock. Whether the difference is describable at overview scale without diffing is the independent recheck's judgment; my own read of the opened frames is that HIGH is unmistakable and LOW-vs-MID is visible but the subtler pair. No projection is selected here.

## 7. Evidence

`reports/portfolio-world-rebuild/evidence/r2d/` — `A-entry.png`, `B-overview.png`, `C-hero-quay.png`, `D-scale-calibration.png`, `projection-low.png`, `projection-mid.png`, `projection-high.png`. Fixed 1280 × 720, `deviceScaleFactor` 1, deterministic `?qa=` / `?projection=` states. The committed set is from the final **build-mode** run; all seven were opened and inspected. `evidence/r2b/` is unmodified.

## 8. Functional QA

| Check | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run build` | pass (chunk-size warning only, pre-existing) |
| `npm run qa:runtime` (dev, → `r2d`) | pass — canvas present, `WorldScene` active, no console/exception/network errors, deterministic state matched, 7 screenshots written |
| `npm run qa:runtime -- --mode build` (→ `r2d`) | pass — same checks against the built preview at `/MyPage/world-v2/` |
| r2b overwrite guard | `--set r2b` throws unless `--allow-overwrite-historical` (not exercised beyond reading; r2b files show no diff) |
| `world-v2/` rebuilt | yes |
| v1 (`portfolio-world/`, `world/`) and root `index.html` untouched | yes — no diff |

The harness has no asset loader (Graphics-only scene), so "no failed assets" is covered by the existing network-failure and HTTP ≥ 400 checks. Functional PASS is not Visual PASS.

## 9. Known Limitations

- **No visual verdict.** All three R2C Major findings are addressed in code and visible in the evidence; none is graded here.
- The Guild road still runs near the Square's west side by design ("nearest branch"). Whether that plus the Workshop leg reads as a west cluster is exactly what the recheck should look at.
- Academy's origin is 153 px from the hall's roof edge. The hall is fixed by the "preserve" list, so Academy could not move farther east; the Square moving west bought the separation instead. The Academy/Exhibition pair may read as a small east cluster.
- The spine, forecourt and Square still overlap the basin edge (as in R2B). The forecourt paving floats over water. Not changed — preserved elements.
- Guild/Academy/Workshop are still flat labelled markers; the schematic road-diagram feel R2C noted as Minor is unchanged.
- Hero Ship silhouette still relies on scale for Tier-1 read (R2C Minor, not in R2D scope).
- Walkability of the route is Level-D verified only.
- LOW/MID/HIGH are still not chosen; the illustrated numbers are blockout values, not locked.

## 10. Final Gate

```text
READY_FOR_R2D_INDEPENDENT_RECHECK
```

Not granted: `VISUAL_PASS`, `READY_FOR_REPRESENTATIVE_VISUAL_TARGET`, `HUMAN_GATE_2`.
