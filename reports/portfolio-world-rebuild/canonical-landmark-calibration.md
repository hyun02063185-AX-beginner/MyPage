# Gate B — Canonical Landmark Calibration

## Status and scope

`GATE_A_LANDMARK_SELECTION = COMPLETE`

This Gate B pass calibrates the already selected candidates in the approved 1920 × 1080 Blueprint design space. It creates no new visual candidate and changes no Phaser code, collision, `GrayboxScene`, geometry, Canonical Target, or runtime integration. The selected assets are **not** production-approved; Human Gate B remains required.

## Source of truth and selected assets

- [Canonical Projection A](evidence/gameplay-projection-refinement/projection-a-elevated-gameplay.png)
- [Approved Blueprint](canonical-target-implementation-blueprint.md) and [machine Blueprint](../../data/portfolio-world/canonical-target-implementation-blueprint.json)
- [Gate A / Gate B landmark manifest](../../data/portfolio-world/canonical-landmark-assets.json)
- Hall: `hall-b` ([PNG](evidence/canonical-landmark-assets/hall/hall-b.png))
- Workshop: `workshop-c` ([PNG](evidence/canonical-landmark-assets/workshop/workshop-c.png))
- Hero Ship: `hero-b` ([PNG](evidence/canonical-landmark-assets/hero-ship/hero-b.png))

## Skills applied

- `environment-art`: applied the squint/hierarchy, negative-space, and human-scale checks. Hall and Hero remain Tier 1; Workshop remains Tier 2 and the neutral placeholders remain subordinate.
- `create-game-assets`: verified the already-normalized transparent images at their native Blueprint bounds, retained aspect ratio, and documented pivots, waterline, proposed runtime slices, and cleanup gates. No image generation or source-art alteration was used.
- `portfolio-world-visual-qa`: the six static calibration boards were opened and inspected against the Visual Brief's harbor hierarchy, warm material language, and sheltered-water rule. This is static evidence, not a Phaser Level A runtime capture; therefore it does not claim a runtime visual pass.

## Exact Blueprint placement

| Asset | Selected | Placement / bound | Calibration convention |
| --- | --- | --- | --- |
| Exhibition Hall | Hall-B | `x=135, y=0, 605×320` | bottom-center ground anchor; door target `75×106` at world `470,118` |
| Workshop | Workshop-C | `x=85, y=520, 505×280` | bottom-center ground anchor; awning `245×110`, entrance approximately `95×105` |
| Hero Ship | Hero-B | envelope `x=1325, y=115, 595×685` | waterline `world Y=707` / local `y=592`; hull `1335,505,565×285`; gangway `1410,620,115×155` |

Secondary Ship (`1045,240,275×255`) and Small Workboat (`1140,470,140×75`) are neutral Blueprint silhouettes only. They are not generated assets and are not proposed for production.

## Evidence

All master images are 1920 × 1080. Matching `-review-1280x720.png` frames are included for each master.

1. [Native-scale calibration](evidence/canonical-landmark-calibration/01-native-scale-calibration.png) — exact bounds, P1/P5/P6/P7 anchors, and neutral fleet placeholders.
2. [Player-scale calibration](evidence/canonical-landmark-calibration/02-player-scale-calibration.png) — four fixed 56 px players, door/awning/entrance/hull/gangway guides.
3. [Canonical side-by-side](evidence/canonical-landmark-calibration/03-canonical-side-by-side.png) — Canonical Projection A beside the independent calibration board.
4. [Canonical ghost overlay](evidence/canonical-landmark-calibration/04-canonical-ghost-overlay.png) — selected assets at 38% opacity at exact Blueprint coordinates; QA-only use of the Canonical image.
5. [Hero waterline and gangway validation](evidence/canonical-landmark-calibration/05-hero-waterline-gangway-validation.png) — waterline, hull, P7, gangway and planned layer extraction.
6. [Projection and lighting review](evidence/canonical-landmark-calibration/06-projection-lighting-review.png) — static projection, daylight, and hierarchy review.

## Player calibration

Every silhouette is exactly `28×56`; no perspective scaling was introduced.

| Anchor | World anchor | Static finding |
| --- | --- | --- |
| P1 Workshop foreground | `430,763` | The player establishes readable workshop scale, but overlaps dense foreground/cart detail. Preserve the route by making the cart a conscious collision/occlusion decision before runtime. |
| P5 Hall Plaza | `640,453` | Hall remains an upper-plaza landmark without making the fixed player feel toy-sized. |
| P6 Hall Entrance | `505,213` | The 56 px silhouette sits plausibly against the `75×106` target door guide. Keep the entrance anchor and foreground planter occlusion separate. |
| P7 Hero gangway | `1435,718` | The player reads at the selected gangway beneath the Hero hull; its ground anchor is `11 px` below the specified calm-water line, so runtime needs an explicit gangway/water-contact depth decision. |

## Landmark calibration results

| Area | Result | Evidence-based finding |
| --- | --- | --- |
| Hall-B | `PASS_WITH_MINOR_CLEANUP` | 605×320 canvas, façade hierarchy, warm limestone, terracotta, and blue/gold identity sustain a Tier-1 plaza-facing landmark. Required cleanup is the front-planter/entrance occlusion separation; no rescale is permitted. |
| Workshop-C | `PASS_WITH_MINOR_CLEANUP` | 505×280 canvas reads as an active maritime facility with a subordinate Tier-2 footprint. Dense cart/workbench/awning foreground must be resolved against P1 before runtime. |
| Hero-B | `PASS_WITH_MINOR_CLEANUP` | Three mast groups, moored merchant character, hull presence, and a readable gangway satisfy the static scale test. The calm waterline, hull body, and front/rear rigging cannot remain a single unsliced runtime image. |

## Projection, lighting, and hierarchy

**Projection consistency: `PASS_WITH_MINOR_CLEANUP`.** The Hall roof, Workshop roof/awning, and ship deck read as compatible elevated-oblique views; no asset is a cinematic low-angle outlier. The Hero's rigging is visually dense, so its foreground/rear split is required to maintain this read around the player.

**Lighting consistency: `PASS`.** All selected pieces share warm daylight with turquoise-water/cool-blue contrast, warm stone/wood, and blue-plus-muted-gold accents. They do not read as different times of day.

**Hierarchy: `PASS`.** Hall-B and Hero-B remain Tier 1. Workshop-C reads lower in both bound size and visual weight. The neutral secondary/small-boat silhouettes do not compete with the Hero.

## Runtime decomposition feasibility

The static PNG itself is not an occlusion-safe runtime asset. Hero-B supports the following planned slices, but they must be prepared before runtime:

1. `hero-hull-body`
2. `hero-masts-rear`
3. `hero-rigging-rear`
4. `hero-rigging-front`
5. `hero-rails-front`
6. `hero-gangway`
7. `hero-water-contact`

The required calm-water contact must honor the Visual Brief: soft, low-energy harbor contact rather than sharp open-sea foam. This is a cleanup requirement, not a request to generate a new ship.

## Production cleanup plan

| Asset | REQUIRED_BEFORE_RUNTIME | OPTIONAL_POLISH |
| --- | --- | --- |
| Hall-B | Preserve `605×320` and bottom anchor; split front planter/entrance occlusion; define the entrance interaction anchor without changing Blueprint geometry. | Reduce minor banner/planter competition only if native gameplay framing needs it. |
| Workshop-C | Preserve `505×280` and bottom anchor; decide workbench/cart collision and P1 visual clearance; split awning/front-workbench occlusion. | Reduce small-prop density only if it masks interaction cues at the gameplay camera. |
| Hero-B | Preserve envelope and local waterline `y=592`; extract all seven planned slices; create calm `hero-water-contact`; validate P7 gangway occlusion and hull boundary. | Subtle rigging simplification only if it competes with the player at gameplay zoom. |

## Remaining risks

- This pass proves deterministic asset placement and static visual compatibility, not in-engine collision or movement. A Phaser Level A visual claim is intentionally not made.
- Hero-B's visual envelope includes `93 px` below the canonical waterline. Water contact, hull depth, and player occlusion must be authored as separate runtime layers.
- Workshop-C's detailed foreground has the greatest local readability/collision risk around P1.

## Gate B recommendation

`LANDMARK_CALIBRATION_ANALYSIS = COMPLETE`

The static calibration supports returning the selected combination for Human Gate B with a `PASS_WITH_MINOR_CLEANUP` recommendation. Codex does not promote these assets to `PRODUCTION_APPROVED` and does not unblock runtime rebuild.

```text
GATE_A_LANDMARK_SELECTION = COMPLETE
LANDMARK_CALIBRATION_ANALYSIS = COMPLETE
LANDMARK_PRODUCTION_APPROVAL = PENDING_HUMAN
RUNTIME_REBUILD = BLOCKED
NEXT = LANDMARK_CALIBRATION_HUMAN_GATE
GATE = READY_FOR_LANDMARK_CALIBRATION_HUMAN_GATE
```
