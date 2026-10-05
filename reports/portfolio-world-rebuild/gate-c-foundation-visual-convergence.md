# Gate C — Foundation Visual Convergence

## Outcome

This package replaces the prior engineering-grid integration board with a
1920×1080 modular foundation composition. It proves the approved Blueprint
geometry can receive the existing F1–F6 and W1 families while retaining the
locked Landmark and fleet canvases at their exact placements. This is static
visual evidence only: no Phaser scene, GrayboxScene, collision, camera,
player, runtime import, or Blueprint geometry was changed.

Foundation visual approval remains **PENDING_HUMAN**. The comparison is for a
human Gate C decision, not an automated claim that the intentionally
background-free evidence has reached final scenic richness.

## Source of truth and locks

- Canonical comparison reference: `evidence/gameplay-projection-refinement/projection-a-elevated-gameplay.png`.
- Geometry and placements: `data/portfolio-world/canonical-target-implementation-blueprint.json`.
- Hall: **hall-b**, `(135, 0, 605×320)`; Workshop: **workshop-c**, `(85, 520, 505×280)`; Hero: **hero-b**, `(1325, 115, 595×685)`.
- Selected fleet: **secondary-b** `(1045, 240, 275×255)` and **workboat-a** `(1140, 470, 140×75)`. Both selections are recorded as `SELECTED_HUMAN` in the manifest.
- Design space remains 1920×1080; P1–P7, both levels, stair connector, water exclusions, and all placements remain unchanged.

## Foundation application

Each application is a separate layer constrained by its Blueprint polygon:

| Module | Applied use |
| --- | --- |
| F1 fine limestone paving | Hall Plaza, entrance apron, Lower Plaza, Workshop forecourt |
| F2 quay surface | Central Quay, Hero Quay, gangway access field |
| F3 quay/water edge | Small water-facing edge fragments above the quay surface |
| F4 main stairs | P4→P5 short two-level connector |
| F5 retaining wall | Hall Plaza elevation edge |
| F6 gangway access | Hero Quay to the locked Hero-B gangway zone |
| W1 sheltered turquoise water | Inner Harbor and Hero/Secondary/Workboat berths |

The compositor uses deterministic tiling, low-frequency 2–4% tonal cycling,
polygon masks, separate shallow contact shadows, and independent hull-contact
ripple strokes. It does not crop or sample the Canonical reference as a floor
source, flatten the world to a scene plate, create raster collision, or change
the approved polygons.

### Bounded repairs

None. Existing F1–F6 and W1 source modules were retained unchanged. The only
application-level correction is deterministic phase/brightness variation to
avoid an immediately stamped tile pattern; it is not a Foundation-family
redesign.

## Evidence

- [01 — material application](evidence/gate-c-foundation-convergence/01-foundation-material-application.png)
- [02 — sheltered-water application](evidence/gate-c-foundation-convergence/02-water-material-application.png)
- [03 — full visual integration board](evidence/gate-c-foundation-convergence/03-full-visual-integration-board.png)
- [04 — Canonical / Foundation comparison](evidence/gate-c-foundation-convergence/04-canonical-vs-foundation-convergence.png)
- [05 — native-scale detail review](evidence/gate-c-foundation-convergence/05-foundation-detail-review.png)
- [06 — player-route review](evidence/gate-c-foundation-convergence/06-player-route-foundation-review.png)
- [07 — water/berth review](evidence/gate-c-foundation-convergence/07-water-berth-review.png)

Each master is 1920×1080 and has a 1280×720 review derivative beside it.

## Visual, player, and water review

The full integration board removes the grid, debug coordinate labels, colored
polygon fills, and asset bounding boxes. Hall-B and Hero-B remain the largest,
highest-detail focal landmarks; Foundation texture stays quieter than both.
F1 reads as fine paving rather than large repeated blocks, and F2 stays less
contrast-heavy beneath Hero-B.

P1, P5, P6, and P7 appear as the same 28×56 character. The route review shows
P1→P2→P3→P4→P5→P6 and P3→P7 on the final foundation layer. No QA line crosses
a water exclusion; P4→P5 is represented by the short stair module; P7 remains
outside the Hero hull exclusion.

W1 is used as low-energy turquoise harbor water with modest depth variation.
Hero-B receives a soft hull-contact arc, Secondary-B a smaller contact, and
Workboat-A a minimal contact ring. The berth review confirms these are visual
layers only, preserving separate water, ship, and foundation ownership.

## Canonical convergence and attractiveness

The side-by-side board confirms the same left-Hall / lower-Workshop /
right-Hero composition and water-to-land balance without copying pixels from
the Canonical raster. It also makes the remaining difference explicit: this
Gate C board deliberately excludes final props and scenic background, so it
cannot equal the Canonical image's town, cliff, foliage, crate, lamp, and
atmosphere richness. Within the authorised Foundation scope, the harbor reads
as a composed playable space rather than an engineering overlay, but the
human review should judge whether the quiet paving and sparse reserved areas
leave enough room for that later dressing pass.

## Runtime decomposability

The composition remains separable: F1/F2 tile layers, F3 edge, F4 stair, F5
wall, F6 gangway, W1 water, three independent vessel canvases, and independent
contact layers. No scene plate or baked collision was introduced. Runtime
rebuild remains blocked pending the human Gate C decision.

## Skill use and QA limits

- **environment-art:** applied material hierarchy, negative-space restraint,
  modular thinking, and deterministic variation to avoid obvious tiling.
- **create-game-assets:** verified existing family canvases before composition,
  preserved source/placement constraints, and produced native-scale detail
  evidence rather than claiming source modules shippable from existence alone.
- **portfolio-world-visual-qa:** reread Visual Brief §§8–12, opened the full
  board plus contact-sheet review, and separated the static inspection from a
  runtime visual verdict.

The required Level-A actual Phaser-canvas capture and Level-B console check are
intentionally unavailable because this task explicitly prohibits runtime work.
Accordingly, this is static Gate C evidence, not an in-runtime `VISUAL_PASS`.

## Remaining risk and recommendation

The largest remaining risk is material richness at real runtime zoom once
scenic background and prop layers exist: F1/F2 are intentionally quiet, and a
human should verify that their reduced contrast still reads as premium stone
rather than flat beige. No geometry change is recommended to address that
risk.

```text
SUPPORTING_FLEET_SELECTION = APPROVED
FOUNDATION_VISUAL_CONVERGENCE_ANALYSIS = COMPLETE
FOUNDATION_VISUAL_APPROVAL = PENDING_HUMAN
GATE_C = PENDING_HUMAN
RUNTIME_REBUILD = BLOCKED
NEXT = GATE_C_FINAL_HUMAN_REVIEW
GATE = READY_FOR_GATE_C_FINAL_HUMAN_REVIEW
```
