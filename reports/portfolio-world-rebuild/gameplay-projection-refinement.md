# Portfolio World — Gameplay Projection Refinement

Status: **COMPLETE — ready for Gameplay Projection Human Review**  
Date: 2026-10-04

## Scope and guardrails

This is a Canonical Final Visual Target exploration only. No `GrayboxScene`,
collision, runtime, Phaser scene, or asset-decomposition work was changed.
The Implementation Gate remains closed.

## Source images and provenance

Primary edit target:

- `evidence/canonical-target-refinements/refinement-2-open-circulation.png`

Composition and art-direction references consulted:

- `evidence/canonical-target-refinements/refinement-1-active-harbor.png`
- `evidence/final-visual-candidates/candidate-a-premium-open-harbor.png`
- `evidence/final-visual-candidates/candidate-b-lived-in-harbor.png`
- `evidence/final-visual-candidates/candidate-c-cinematic-harbor.png`

The generated projections preserve Refinement 2's Hall / Workshop / Hero Ship
relationship and open circulation. They retain Candidate C's wide composition,
Candidate B's harbor-life support vessels and workshop dressing, and Candidate
A's Hall/plaza dignity. They do **not** copy any external game, map, sprite, or
building design.

## Skills and production method

- `environment-art` — used for value hierarchy, landmark readability,
  player-relative scale, material distinction, and an uncluttered playable read.
- `portfolio-world-visual-qa` — used against `00_VISUAL_BRIEF.md` §§8–12 for
  asymmetrical navigability, harbor identity, vessel hierarchy, calm sheltered
  water, and subordinate paving scale.
- `imagegen` — used in built-in edit mode with Refinement 2 as the local edit
  target. The built-in image generator did not expose a model identifier; no
  fallback API/CLI model was used.

The A/B projection art was generated with the built-in image-generation tool.
P1–P7 validation is deterministic compositing, not image generation: the same
56 px navy player silhouette, 60 × 70 px contrast backing, and labels were
drawn at every test location. The deliverables were normalized to exact 16:9
1920 × 1080 masters; separate review frames are 1280 × 720.

## Deliverables

| Artifact | Purpose |
| --- | --- |
| `evidence/gameplay-projection-refinement/projection-a-elevated-gameplay.png` | Projection A master, 1920 × 1080 |
| `evidence/gameplay-projection-refinement/projection-b-balanced-gameplay.png` | Projection B master, 1920 × 1080 |
| `evidence/gameplay-projection-refinement/projection-a-player-fixed-scale-validation.png` | A with deterministic P1–P7 fixed-scale validation |
| `evidence/gameplay-projection-refinement/projection-b-player-fixed-scale-validation.png` | B with deterministic P1–P7 fixed-scale validation |
| `evidence/gameplay-projection-refinement/projection-comparison-sheet.png` | 1280 × 720 four-up review sheet |
| `evidence/gameplay-projection-refinement/*-review-1280x720.png` | Separate 1280 × 720 review frames for every main/validation image |

## Projection comparison

### Projection A — Elevated Gameplay View

Camera elevation is increased most aggressively. The plaza and quay form a
shallow oblique play plane; the main stairs read as a short level connector
instead of a deep perspective corridor. This is the clearest fixed-scale route
from Workshop through Hall, while the scenic city, cliffs, mountains, lighthouse
and outer water retain the deeper perspective.

### Projection B — Balanced Cinematic Gameplay View

This keeps a little more recession in the Hall-to-quay relation and stronger
screen depth around the fleet, while keeping route widths and stair landings
wide enough for a nearly fixed player sprite. It is the more picturesque
alternative, but has marginally less projection safety than A.

## P1–P7 fixed-scale validation

The validation locations are P1 Workshop foreground, P2 Lower Plaza, P3
Central Quay, P4 Main Stairs lower landing, P5 Hall Plaza, P6 Hall Entrance,
and P7 Hero Ship gangway. Every silhouette has an identical 56 px height.

| Location | Projection A | Projection B |
| --- | --- | --- |
| P1 Workshop foreground | 56 px / 0% | 56 px / 0% |
| P2 Lower Plaza | 56 px / 0% | 56 px / 0% |
| P3 Central Quay | 56 px / 0% | 56 px / 0% |
| P4 Main Stairs lower landing | 56 px / 0% | 56 px / 0% |
| P5 Hall Plaza | 56 px / 0% | 56 px / 0% |
| P6 Hall Entrance | 56 px / 0% | 56 px / 0% |
| P7 Hero Ship gangway | 56 px / 0% | 56 px / 0% |

**Fixed-scale result:** both A and B remain credible with a fixed player
scale. No test position requires the prohibited 20–30% shrink.  
**±10% correction result:** not required for either candidate, so no adjusted
scale validation image was created. If later gameplay framing exposes a local
footprint mismatch, reserve correction only within the allowed ±5% for A and
±10% for B.

## Target-art Visual QA

| Criterion | A | B | Evidence-led finding |
| --- | --- | --- | --- |
| Attractive, premium whole | Pass | Pass | Warm daylight, coherent stone/wood/plaster/greenery palette. |
| Convincing active harbor | Pass | Pass | Broad protected basin, docks, cargo, mooring language and working boats. |
| Hero Ship landmark | Pass | Pass | One large blue-gold vessel is the dominant maritime silhouette. |
| Hall landmark | Pass | Pass | Large bannered façade, plaza and stairs form a counterweight to the ship. |
| Workshop reads as work space | Pass | Pass | Bench, awning, crates, barrels, cart and supplies remain legible. |
| 2D route reads immediately | Strong pass | Pass | A has the clearest continuous shallow play plane. |
| Same-size P1–P7 plausibility | Strong pass | Pass | Opened fixed-scale composites show no severe size discontinuity. |
| Scenic depth retained | Pass | Strong pass | B preserves slightly more cinematic recession; both reserve it chiefly for the background. |
| Phaser 2D decomposition feasibility | Pass, conceptual | Pass, conceptual | Clear separable bands: plaza, steps, dock, workshop, Hall, ships, scenic background. |
| Reads as a playable screen | Strong pass | Pass | Validation exposes one continuous traversable story rather than a single static vista. |

The palette and water satisfy the Visual Brief target at target-art level:
turquoise water remains calm and rounded, and paving reads as a fine surface
rather than giant repeated blocks. The layout is asymmetrical without becoming
a cardinal-cross map.

`portfolio-world-visual-qa`'s formal **verified Visual Pass** is intentionally
not claimed: its definition requires an opened screenshot from the actual
running Phaser canvas plus console evidence. This stage forbids runtime work;
the opened masters and composites support a design-target review, not a runtime
render verdict.

## Recommendation

Recommend **Projection A — Elevated Gameplay View** for human selection. It
best meets the primary constraint: a player can move Workshop → Lower Plaza →
Central Quay → Main Stairs → Hall Plaza → Hall entrance at a fixed sprite size
without the target image asking for forced shrinking. Projection B is retained
as the valid, more cinematic alternative if the human review values additional
scenic recession over A's clearer gameplay projection.

## Gate

```text
GAMEPLAY_PROJECTION_REFINEMENT = COMPLETE
PLAYER_MOVEMENT_PROJECTION_VALIDATION = COMPLETE

CANONICAL_FINAL_VISUAL_TARGET = NOT YET APPROVED
IMPLEMENTATION_GATE = CLOSED

NEXT = GAMEPLAY_PROJECTION_HUMAN_REVIEW
GATE = READY_FOR_GAMEPLAY_PROJECTION_HUMAN_REVIEW
```
