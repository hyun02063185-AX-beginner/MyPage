# Portfolio World — Depth / Occlusion Runtime Fix v1

## A. Gate

```text
POST_VISUAL_GRAMMAR_LOCK_DEPTH_FIX
CAMERA_ELEVATION = 15°
CAMERA_YAW = 0°
MASS_ASSET_PRODUCTION = HOLD
```

## B. Work Context

`HOME_WINDOWS`; Machine Context `06cd98a5-32c4-40db-a628-5416e4795ed6`; Windows `win32 x64`; Node/npm `v24.16.0` / `11.13.0`; branch `feature/portfolio-world-sprint-02`.

## C. Starting Commit

Start was clean at `d21b47a docs(portfolio-world): lock visual grammar at 15 degrees`; `git pull --ff-only` was already up to date. No merge to `main` occurred.

## D. Problems Reproduced

The actual runtime gave Hero D depth `7` (dev calibration `7.2`) and every secondary sailing vessel depth `7`, so Phaser used display-list insertion order. The east brig has a lower logical waterline than Hero D but could paint its tall sail above it. Exhibition Hall used depth `5`; player body/face used `11`/`12`, so the player always drew over the Hall roof.

## E. Previous Depth Model

Fixed classes were ground `-4`, water `0`, path `1`, plaza `2`, building `4`, Hall image `5`, harbor visual `6`, vessel `7`, label `8`, and player `11`/`12`. None were tied to a contact point.

## F. New Depth Model

`src/world/worldDepth.mjs` centralizes a minimal semantic policy. Scene/catalog code asks it for depth; no 3D scene graph, z-buffer, physics-derived visual depth, renderer rewrite, or manual full-array sorting was added.

## G. Depth Bands

| Band | Value |
| --- | ---: |
| Ground / water | 0 |
| Ground detail | 20,000 |
| Walkable structures | 40,000 |
| Low props | 60,000 |
| World object body | 80,000 |
| Actor / player | 80,000 |
| Upper occluder (reserved) | 120,000 |
| Label / annotation | 160,000 |
| HTML / UI (reserved) | 200,000 |

The 20,000 gap exceeds the full `1280 × 10` contact contribution, preventing cross-band collisions.

## H. Y-aware Formula

```text
depth = baseBand + round(contactY) × 10 + stableTie(id)
```

`stableTie(id)` is deterministic and below `1`; a one-pixel Y difference always wins and equal rows do not flicker.

## I. Anchor Usage

- Hero D: existing hull/waterline render anchor `ship.y + 18`.
- Secondary ships and boats: `visual.y + visual.height / 2` waterline.
- Buildings: `building.y + building.height / 2` functional base.
- Props: `visual.y + visual.height / 2` ground contact.
- Player: `player.y + PLAYER_HEIGHT / 2` foot contact.

Transparent padding, mast/sail/roof/crown height never controls sorting.

## J. Vessel Ordering

Hero D contact Y is `1254`; east brig contact Y is `1144`. The shared world-object band now puts Hero D in front deterministically. Brig, schooner, cutter, and small boats use the same waterline rule.

## K. Player / Building Occlusion

Current footprint collision makes whole-object y-aware ordering sufficient: north of a building base the player is behind it; south of that base the player is in front. No PNG split was required. The reserved upper-occluder band provides a future narrow path if a traversable/tall asset needs a split.

## L. Exhibition Hall Case

Before: Hall `5`, player `11/12`; player always painted over roof. After: Hall and player share the contact-ordered body band. The new test proves player `baseY - 32` is behind Hall and `baseY + 32` is in front. Browser QA retained entrance readability and the pre-existing Hall collision boundary.

## M. Dock / Jetty Regression

Walkable docks and service jetty are above water in the walkable-structure band and below actors. Existing collision tests still verify both pier and service-jetty water carve-outs; collision geometry was not edited.

## N. Label / UI Ordering

Harbor Square and destination labels use the deliberate label band above world objects/player. The HTML shell remains outside Phaser ordering; the existing dev calibration surface alone uses the reserved HTML/UI band.

## O. Runtime Files Changed

- `src/world/worldDepth.mjs` and declaration: depth bands, ties, contact calculations.
- `src/world/harborVisualCatalog.ts`: ground, buildings, visuals, labels.
- `src/scenes/WorldScene.ts`: Hall, Hero D, calibration Warehouse, secondary fleet.
- `src/player/Player.ts`: body/face follow moving foot contact in existing post-update flow.

## P. Tests Added

`tests/world-depth.test.mjs` covers semantic bands, increasing Y, deterministic ties, exact Hero D/east-brig waterline order, and north/south player-vs-Hall geometry. Full suite is `17/17` passing.

## Q. QA Results

- `npm ci`, typecheck, test, and build: PASS.
- Tests: `17/17` PASS.
- Build: `1,419.51 kB` / gzip `368.86 kB`; only the pre-existing chunk warning remains.
- Production preview: base page/asset `200`; prohibited root-absolute asset `404`; production bundle has no `assetCalibration` handling.
- `git diff --check`: PASS.

## R. Visual QA

Browser inspection covered actual harbor and normal player-follow views: Hero D stayed before the lower-waterline vessel; docks remained above water; labels remained readable; warehouse/support structures stayed in normal relation; movement toward Exhibition Hall retained collision and an unobscured entrance. Browser screenshots could be displayed but cannot be exported as supported project evidence files, so none are claimed.

## S. Performance

Static objects receive depth once. The only ongoing work is two scalar `setDepth()` calls for player body/face in the existing post-update callback; it allocates no objects and adds no manual scene-wide sort.

## T. Known Limitations

Current whole-building ordering is correct for footprint-based assets. A future unusually tall/traversable asset may need a minimal body/upper-occluder split. No art redesign, day/night, random berth system, or generic renderer was added.

## U. Regression Protection

Unchanged: world `2048 × 1280`, viewport `1024 × 576`, locked 15° / 0° grammar, assets/positions, IA, collisions, water carve-outs, movement, `BASE_URL`, root portfolio, and GitHub Pages model.

## V. Next-step Impact

Mass asset production remains on hold. After independent review, the next Director work is **Scale Bible + Asset Weight Lock**.

## W. Final Gate

```text
READY_FOR_DEPTH_OCCLUSION_INDEPENDENT_REVIEW
```
