# R3D Environment Art Batch B — Exhibition Hall + Workshop

## Scope and invariant

R3D replaces only the Exhibition Hall and Workshop graybox rendering in `GrayboxScene.ts`. The R3A/R3A.1 walkable rectangles, building/ship blockers, water limits, player, motion, and camera are unchanged. No Hero Ship, props, terrain, or background plate is included.

## Source art and runtime selection

Hall A, Hall B, Workshop A, and Workshop B were returned as HTTP 200, decoded as 1024×1024 PNGs, opened successfully, and recorded with redacted provider metadata in the ignored Codyssey output directory. Hall B and Workshop B are the runtime selections. Their original returned bytes and hashes are recorded in their adjacent metadata files; no raw source is committed.

The `#ff00ff` source backdrop is removed deterministically by `scripts/portfolio-world/build-r3d-architecture-assets.py`. The lossless PNG output is constrained to the manifest rectangles: Hall left `(500,18) 190×145`, entrance `(690,68) 100×95`, right `(790,18) 150×145`, and Workshop `(80,650) 180×230`. The optional awning foreground split is not needed.

## Evidence and QA

`reports/portfolio-world-rebuild/evidence/r3d-architecture/` contains the required seven 1280×720 runtime views, `architecture-contact-sheet.png`, and `qa-result.json`. Functional checks passed: typecheck, production build, movement and reverse-stairs regression, route reachability, collision/water exclusion, camera dead-zone/follow, player animation/idle restoration, and zero browser or console errors.

## Human review matrix

| Criterion | Result | Note |
| --- | --- | --- |
| Hall visual quality | CAUTION | Premium landmark treatment is present; judge compressed gameplay-scale facade in runtime captures. |
| Hall player scale | PASS | The doorway and player share the approved Hall approach frame. |
| Hall entrance readability | PASS | Bright recessed central entry, never a black collision-like hole. |
| Hall/plaza integration | PASS | Hall is pinned to the exact locked threshold envelope. |
| Workshop visual quality | CAUTION | Stronger crafted identity; human review owns final richness judgment. |
| Workshop player scale | PASS | Readable beside the approved approach. |
| Workshop/quay integration | PASS | Transparent silhouette meets the existing approach/quay without a plate seam. |
| Shared Mediterranean style | PASS | Limestone, terracotta, blue/gold accents are consistent. |
| Landmark hierarchy | PASS | Hall remains wider/civic; Workshop remains secondary. |
| Route readability | PASS | No props or architecture were added to routes. |
| Occlusion correctness | PASS | Architecture is L2 behind the player; no foreground slice is used. |
| Remaining graybox impression | CAUTION | Hero Ship is intentionally deferred to Batch C. |

This is not a self-approval. No Batch C work is authorized by this report.

```text
R3D_ENVIRONMENT_ART_BATCH_B = COMPLETE — implementation and functional QA
NEXT                        = ENVIRONMENT_ART_BATCH_B_HUMAN_GATE
GATE                        = READY_FOR_ENVIRONMENT_ART_BATCH_B_HUMAN_GATE
```
