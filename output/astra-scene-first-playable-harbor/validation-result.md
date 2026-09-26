# Astra Scene-First Playable Harbor Validation: COMPLETE

Master Reference:
`output/astra-master-harbor-benchmark/master-harbor-scene-final.png`

Scene-First Final:
`output/astra-scene-first-playable-harbor/scene-first-vertical-slice-final.png`

Assessment:

| Criterion | Result | Evidence and limit |
| --- | --- | --- |
| Master visual continuity | PASS | Warm limestone, terracotta, navy/gold, timber and teal water retain the same visual family. The sky and distant fortified waterfront introduce camera/context drift; the result is not a pixel-identical continuation. |
| Whole-scene cohesion | PASS | Quay turns, contact shadows, localized planting, hull reflection and continuous ground read as one authored place, substantially closer to A than the repeated surfaces and pasted structures of B. |
| Hero Ship quality | **FAIL** | Landmark rendering and water contact are strong, but **four visible deck-rooted masts violate the required three-mast identity**. Cream bundles also retain conspicuous hanging scallops. Requested correction was blocked before generation. |
| Environment integration | PASS | Water, masonry, timber, roofs and foliage share lighting and detail treatment. No primary water/paving tiles or copied trees were assembled. Large foreground paving units remain a scale concern. |
| Projection consistency | PASS | Buildings and hull share a coherent illustrated scene with upright structures and strong elevations. More perspective recession than the Master means a fixed-size actor needs broader scale validation. No numeric-angle test was used. |
| Foreground occlusion viability | PASS | Limited static lamp corridor: original opaque scene pixels cover part of the proxy naturally. Recomposition has zero pixel error. This proves a static redraw stencil, not a removable-object/clean-background pipeline. |
| Player integration viability | **FAIL** | Three local placements show contact and partial lamp occlusion, but the fixed 49-logical-pixel proxy is small against the large foreground bollards/paving; convincing scale over the entire lower playable promenade is not established. No moving-player test was performed. |
| Navigation-mask viability | PASS | Start, all three proof placements and every pixel of all three hotspot polygons share a connected legal route. Water and major architecture sample points are blocked. This is mask-level viability only. |

Refinement cycles used:
**1 / 2 attempted; 0 completed art refinements.** One initial whole-scene generation succeeded. The first localized correction returned HTTP 429 `usage_limit_reached`; no correction image exists. The result does not demonstrate that successful refinement would require more than two cycles.

## Visual inspection performed

Opened the actual Master and failed modular reference before production. Opened the authored candidate, final 1280 × 720 gameplay-like frame, labeled three-placement proof, full static reconstruction, foreground PNG, walkable PNG and collision PNG. Inspected the lamp crop and proxy source. Final output contains one natural frame with one temporary player and no debug labels or masks.

The strongest improvement over B is authored continuity: the water has localized reflections, the quay bends without repeating wall modules, and vegetation belongs to the architecture and ground. The hard ship error is visible in the actual image: mast groups at approximately source x=827, 941, 1177 and 1340. No amount of successful mask testing overrides that failure.

The foreground-hidden plate was inspected: it remains the original complete scene because this workflow deliberately retains the baked lamp below the identical foreground redraw. There is no repaired patch, smear or hole. This avoids unnecessary background regeneration but does not prove clean-background extraction behind a movable object.

## Gameplay logic evidence

`evidence/logic-validation.json` records the reproducible assertions from `python output/astra-scene-first-playable-harbor/evidence/validate.py`:

- Native masks: 1672 × 941; binary values; foreground alpha is real 0/255.
- Start (330,628), Hall (145,480), Quay (335,633), Square return (28,514): accessible and connected.
- All hotspot polygon pixels are accessible, not only their centers.
- 130,433 reachable pixels of 131,004 legal pixels (99.564%); 571 isolated nonessential pixels remain outside the start component. No required route depends on those pockets.
- Water and major-architecture test samples are not legal movement positions. The hand-authored ground boundary also excludes their visible regions.
- Static recomposition maximum channel difference: **0**. Foreground contains **2,727** opaque pixels, all copied exactly from the same source coordinates.
- The initial start-near-edge failure and return-polygon-boundary failure were corrected by moving the QA start and shrinking the transition polygon. The navigation surface was not expanded into water to make tests pass.

## Major risks

1. Four-mast Hero Ship and loose furled-canvas treatment remain uncorrected due to image-service quota. This is the decisive semantic failure.
2. Foreground object/paving scale versus a fixed-size actor needs a resolved camera/scale decision and continuous-motion validation. Broadening the scene-first claim from three still frames would be premature.
3. Occlusion covers a single bounded lamp shaft corridor. Full-scene depth switching, diagonal/swept collision, entrance traversal and tiny isolated mask pockets require future implementation decisions only after a new visual gate passes.
4. Generation introduced a sky/horizon and fortified distant waterfront absent from the Master's tighter crop. The visual family survives, but continuity should be judged at scene level rather than inferred from palette alone.

## Scope and disposition

All work is new evidence under `output/astra-scene-first-playable-harbor/`. No runtime, public game assets, root portfolio files or previous Astra evidence were modified. No individual asset approval was requested. No routes or water animation were implemented.

The scene-first method retains substantially more visual cohesion than the failed modular reconstruction, but **this delivered candidate does not pass**. Preserve the evidence; do not begin Codex integration from it. This report is a completed failed-candidate validation, not a claim that the game or art pipeline is production-ready.

FINAL GATE:
**ASTRA_SCENE_FIRST_NO_GO**
