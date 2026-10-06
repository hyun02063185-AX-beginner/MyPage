# Runtime R3 Phase A.1 — Selected Composition C Correction

## Scope and decision

Human direction from Phase A is retained: **Scenic A**, **Composition C selective gameplay-first**, and **Fountain B**. This is a bounded correction, not a new scenic or prop candidate. `Composition C.1` uses the selected Scenic A correction, the existing C selective prop family, and Fountain B at F1 (Hall Plaza center-left).

No Phaser scene, bootstrap import, collision polygon, route point, camera, player, visitable, Foundation Master B, building, or ship was changed. The output is static Human Gate evidence only; `runtimeImported` remains `false`.

## Scenic A correction

- The former upper transparent/dark-background void is replaced in the preview by pale blue daytime sky and warm atmospheric haze.
- Blue-gray mountains stay behind the warm stucco/terracotta hillside town, with deliberately reduced saturation so Hall and Hero remain the first two reads.
- The town resolves through pale limestone cliffs to a subdued open sea. The small far-right lighthouse remains a distant accent rather than a rival landmark.
- The corrected asset is render-only and declares `collisionIntent: none` in the manifest.

## Fountain B relocation

The former placement at `(500, 360)` was adjacent to the P5 stair approach. The selected F1 placement is `(330, 330)`: Hall upper plaza center-left, visually separated from the P4 → P5 stair line and the P5 → P6 Hall-entry line. Fountain B remains its normalized `168×150` candidate canvas (a roughly 110–145px civic focal read) and retains `future-small-obstacle` only as a future runtime intent; it is not collision in this phase.

F2 `(470, 330)` was reviewed only as the allowed alternate and was not selected.

## Prop, route, and hierarchy review

The selective C mix retains the Hall planter/cypress/bench/banner, office lamp and notice board, limited workshop crate/barrel cluster, Central Quay bollard/rope coil, and Hero Quay bollard/mooring rope. No new prop family or visitable was introduced.

The preview route overlay retains the same P1–P8 coordinates and shows the F1 fountain outside the visual corridor. At reduced scale, the intended order remains Hall → Hero Ship → Workshop → Harbor Office; town, lighthouse, and fountain read as supporting layers. This is Level D static-composite evidence, not a runtime visual pass: the Phase A.1 Human Gate must inspect a rendered runtime after a later, explicitly authorized R3 integration.

## Evidence

| File | Review purpose |
| --- | --- |
| `01-scenic-a-original.png` | Original selected Scenic A alpha coverage |
| `02-scenic-a-corrected.png` | Corrected scenic alpha coverage |
| `03-scenic-before-after.png` | Upper-sky/town/cliff completion comparison |
| `04-fountain-placement-review.png` | Old, F2, and selected F1 with P4/P5/P6 markers |
| `05-composition-c1-corrected.png` | Primary 1920×1080 Composition C.1 Human Gate board |
| `06-canonical-vs-c1.png` | Canonical Projection A comparison |
| `07-c1-route-legibility.png` | Unchanged-route overlay |

## Status

```text
SCENIC_A_CORRECTION = COMPLETE
MEDITERRANEAN_TOWN = IMPLEMENTED_IN_PREVIEW
SKY_MOUNTAINS = IMPLEMENTED_IN_PREVIEW
CLIFF_LIGHTHOUSE = IMPLEMENTED_IN_PREVIEW
FOUNTAIN_B_PLACEMENT = CORRECTED
COMPOSITION_C1 = COMPLETE
ROUTE_LEGIBILITY = PASS (static preview)
RUNTIME_R3_INTEGRATION = BLOCKED
NEXT = R3_PHASE_A1_HUMAN_VISUAL_GATE
GATE = READY_FOR_R3_PHASE_A1_HUMAN_VISUAL_GATE
```
