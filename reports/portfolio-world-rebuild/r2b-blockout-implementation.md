# R2B — Candidate A+ Visual Blockout Implementation

Date: 2026-09-26
Branch: `feature/portfolio-world-rebuild-v2`
Base verified before implementation: `10047b5`

## Delivered Scope

- New isolated source project: `portfolio-world-v2/`.
- New committed Pages artifact: `world-v2/`, built with base `/MyPage/world-v2/`.
- Two-scene Phaser 4.2.1 runtime: `BootScene` starts `WorldScene`.
- Flat `Graphics` and text blockout only. No v1 runtime code, v1 assets, raster production art, or root site link was reused or changed.
- Player movement uses WASD/arrow keys. A simple basin test blocks main-water entry while keeping Square → Exhibition Hall → Hero Quay walkable.

## Candidate A+ Layout Translation

The world is 2600 × 1600 world units. These are implementation coordinates for the blockout only, not a newly locked production grid.

| Element | Blockout placement / relationship |
| --- | --- |
| Crescent basin | One broad ellipse centered around `(1450, 1160)`, with a deeper calm interior and open water behind the ship. |
| Walking spine | Bent route from Workshop-side working dock `(345, 1080)` through Harbor Square `(960, 605)`, Exhibition `(1400, 680)`, then Hero Quay. |
| Harbor Square | An offset widening on the spine; it is not a route origin or radial hub. |
| Hero Quay + Hero Ship | An asymmetric triangular pier reaches the ship at roughly `(2010, 1070)`, leaving the basin visible behind. |
| Exhibition Hall | The only destination building mass, adjacent to the waterfront-side spine and quay approach. |
| Workshop / Guild / Academy | Labeled secondary flat markers only: Workshop is at the working-dock end; Guild takes the short inland branch; Academy takes a longer separate branch. |

This preserves Candidate A+'s relation-based arrangement: no destination is implemented as a cardinal opposite through Harbor Square, and Candidate B's twin-basin structure is not present.

## Projection and Scale Calibration

`?projection=low|mid|high` changes only the drawn roof/sail plane height. The Phaser camera remains a non-rotating 2D orthographic camera in every mode. Mid is the current blockout default, not a final illustrated-projection lock. The scale frame includes player, Exhibition Hall mass, door, paving patch, bench, lamp, Hero Ship, medium vessel, small boat, and Hero Quay width in one real gameplay framing.

## Functional Runtime QA

Project-owned harness: `portfolio-world-v2/qa/r2b-runtime-qa.mjs`.

It launches a fixed 1280 × 720 headless Edge session through CDP, validates the Phaser canvas and active `WorldScene`, captures JavaScript exceptions/console errors/failed network requests, confirms deterministic QA state, and writes stable filenames. It supports dev and built preview modes.

Completed successfully:

```text
npm run typecheck
npm run build
npm run qa:runtime
npm run qa:runtime -- --mode build
```

Both modes completed with canvas present, `WorldScene` active, no uncaught JavaScript/console errors, and no asset failures.

| Screenshot / query state | Camera center | Zoom | Player |
| --- | ---: | ---: | ---: |
| A entry | `(960, 605)` | `0.78` | `(960, 605)` |
| B overview | `(1300, 830)` | `0.46` | `(960, 605)` |
| C hero | `(1840, 960)` | `0.83` | `(1620, 830)` |
| D scale | `(1480, 760)` | `0.92` | `(1420, 705)` |

Evidence files (actual built-preview captures, opened during implementation):

- `reports/portfolio-world-rebuild/evidence/r2b/A-entry.png`
- `reports/portfolio-world-rebuild/evidence/r2b/B-overview.png`
- `reports/portfolio-world-rebuild/evidence/r2b/C-hero-quay.png`
- `reports/portfolio-world-rebuild/evidence/r2b/D-scale-calibration.png`
- `reports/portfolio-world-rebuild/evidence/r2b/projection-low.png`
- `reports/portfolio-world-rebuild/evidence/r2b/projection-mid.png`
- `reports/portfolio-world-rebuild/evidence/r2b/projection-high.png`

## Visual-Evidence Boundary

The entry, overview, Hero Quay, and scale PNGs were opened after rereading the brief. They visibly show the broad basin, bent spine with offset square, quay physically reaching the Hero Ship, and calibration references. This is evidence supplied to the next independent visual-QA pass, not a `VISUAL_PASS` or approval of final materials, scale, or composition. Functional QA remains separate from the eight qualitative blockout conditions in `07_RUNTIME_QA_PLAN.md`.

## Known Limitations

- This is deliberately a flat-shape blockout: there are no production assets, finished materials, final paving, or final destination interiors.
- Guild Hall, Academy, and Workshop are spatial markers, not implemented destinations or interaction targets.
- Basin exclusion is intentionally simple and does not replace a future navigation/collision system.
- Low/Mid/High are evidence variants only. No projection winner or visual approval was selected in R2B.

## Skill Discovery Record

The repository's `.codex/skills/` contained the nine intended materialized skills: `environment-art`, `create-game-assets`, six official Phaser skills, and `portfolio-world-visual-qa`. They were not dynamically listed as active session skills, so implementation read canonical vendored/project profile sources under `tools/agent-skills/` directly. Relevant guidance applied: readable Hero-vs-secondary hierarchy, protected negative water space, human-scale references, fixed Phaser config/scenes/camera/input, and opened-render evidence discipline.

## Handoff

Next owner: independent visual QA against `00_VISUAL_BRIEF.md`, `01_ART_BIBLE.md`, and the eight conditions in `07_RUNTIME_QA_PLAN.md` §2. Re-capture any state with `npm run qa:runtime -- --mode build` from `portfolio-world-v2/`. No visual pass has been granted by this report.
