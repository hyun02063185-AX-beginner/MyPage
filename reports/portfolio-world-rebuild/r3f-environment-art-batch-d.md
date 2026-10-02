# R3F Environment Art Batch D — Props & Foreground

## 1. Human Gate C record

Director review recorded `BATCH_C_HUMAN_ROUTE_OCCLUSION_GATE = APPROVED`.
This approves the Hero Ship route, depth, and occlusion structure only. It does
not approve the whole Portfolio World as a final visual design.

## 2. Study A / Study B

Two immutable Gemini originals were generated through the existing DPAPI
Codyssey wrapper with `gemini-2.5-flash-image`, then retained outside Git at
`output/codyssey-image-benchmark/r3f-environment-art-batch-d/`.

| Study | Density strategy | Original PNG | SHA-256 |
| --- | --- | --- | --- |
| A — restrained premium | Sparse, curated props and broad walking quiet | `A-restrained-premium.gemini-2.5-flash-image.original.png` | `82269b9dd6594cb6a812955c765fd4418eff7feb67f4ae89aa8a878d15a50fcf` |
| B — lived-in working | Controlled crate/barrel/rope/bollard work cues while retaining route margins | `B-lived-in-working.gemini-2.5-flash-image.original.png` | `c6e9bebb3f6b6bf7c431f0c5ec16be49e1eeb916661c1a2a8a66bb49ff49d423` |

`batch-d-study-contact-sheet.png` compares the two directions at 1280×720.
Study B is selected: it makes the quay read as a place of work while all props
remain on visual margins and leave the Hall, workshop, stair, gangway, and ship
routes open. The runtime PNGs are lossless, transparent, deterministic cleanup
assets informed by the studies; neither study is a scene plate or collision
source.

## 3. Implemented manifest assets

`assets/world/props/r3f/` supplies every Batch D manifest item: `bollard-set`,
`plaza-bench-set`, `lamp-set`, `planter-pair`, `quay-crate-barrel-set`,
`hall-banner-set`, `stair-railing-overlay`, `quay-railing-overlay`, and
`low-wall-vegetation`. Their positions are the R3B manifest rectangles.

## 4. Runtime depth

L0 water, L1 foundation, L2 Hall banners, L3 player, L4 bench/planters/
bollards/crates and lamp/vegetation bases, L5 lamp upper, stair rail, quay rail,
and vegetation upper, L6 Hero Ship occlusion, and L7 UI are preserved. The
lamp and vegetation are explicitly split at runtime so a player can pass behind
their upper components. No art pixels participate in collision.

## 5. Evidence and QA

`reports/portfolio-world-rebuild/evidence/r3f-environment-art-batch-d/`
contains the required `01`–`08` 1280×720 runtime captures,
`batch-d-before-after-contact-sheet.png`, `batch-d-study-contact-sheet.png`,
movement captures, and `qa-result.json`.

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run build` | PASS (existing bundle-size warning only) |
| `npm run qa:props` | PASS — movement, both stair directions, Hall/workshop/gangway/Hero Ship routes, water and collision assertions, player/ship depth, foreground depth, camera follow/dead-zone, zero browser errors and failed requests |

## 6. Visual observations / Final-Look Convergence backlog

1. The Hall asset is much more resolved than the small runtime prop language;
   a final prop family needs richer lighting and material nuance to match it.
2. Foundation stone remains broad and quiet; selective edge wear, shadow and
   contact-darkening are needed to ground all assets without creating false
   collision cues.
3. Water is clean but visually flat; restrained animated light, depth variation,
   and shoreline reflections are needed for final cohesion.
4. Workshop and Hero Ship need a final cross-family lighting/material pass.
5. The player is still a simplified temporary sprite and undercuts the target
   environment quality.

## 7. Human Gate checklist

- [ ] Prop density feels intentional rather than cluttered.
- [ ] Harbor Square → Hall → stairs → quay → Hero Ship remains readable.
- [ ] Foreground rail/vegetation/lamp occlusion reads naturally.
- [ ] Scene cohesion is visibly increased in the before/after review.
- [ ] This review does not imply final Portfolio World visual approval.

```text
BATCH_C_HUMAN_ROUTE_OCCLUSION_GATE = APPROVED
R3F_ENVIRONMENT_ART_BATCH_D        = COMPLETE
NEXT                               = BATCH_D_HUMAN_CLUTTER_OCCLUSION_GATE
GATE                               = READY_FOR_ENVIRONMENT_ART_BATCH_D_HUMAN_GATE
```
