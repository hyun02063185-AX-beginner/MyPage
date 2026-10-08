# Portfolio World — R4 Phase A Player Candidates

## R3.1 closeout

`R3_1_ACTUAL_RUNTIME_HUMAN_GATE = APPROVED`. The R3 contract records `scenic.runtimeParity = APPROVED`, `water.seam = PASS`, `humanGate = APPROVED`, and `status = R3_RUNTIME_APPROVED`. This closeout made no runtime visual change.

## Role and locked player contract

The current `R2_NEUTRAL_PLAYER_BASELINE` remains a runtime placeholder. R4 designs a modern, intelligent, approachable PLAYER / VISITOR / GUIDE for the warm Mediterranean harbor without pirate, fantasy, sailor, or combat cues.

- Display: **28×56 px**. Source candidates are 1024×1536 px and normalized.
- Physics: **28×16 px**, offset **(0,40)** — unchanged.
- Anchor: bottom-center; feet midpoint **(14,56)** in every candidate frame.
- Scale: fixed. Perspective scaling is not allowed.

## Candidate A — Modern Harbor Explorer

Cream shirt, navy vest, dark trousers, practical brown shoes, a small crossbody satchel, and a restrained gold detail. It is friendly and mobile; the satchel is a strong harbor-explorer cue but is slightly less formal than Candidate B.

Score: **24/30** — environment match 4, native readability 4, professional identity 4, direction readability 4, four-location fit 4, animation suitability 4.

## Candidate B — Refined Portfolio Guide

Navy overshirt/jacket over a cream inner layer, tailored charcoal trousers, clean shoes, a small notebook, and a restrained gold lapel detail. It reads calm, professional, and premium while still belonging in the harbor.

Score: **27/30** — environment match 5, native readability 4, professional identity 5, direction readability 4, four-location fit 5, animation suitability 4.

## 28×56 native-scale and projection validation

The review board shows front, back, and side at **1×, 2×, and 4×**. At actual 1×, each has an identifiable head, directional torso, separated legs, and a readable navy/cream outfit family. Neither is chibi, stick-like, or oversized in the head. B's simpler jacket/cream value hierarchy is clearest. Both use a modest elevated-oblique projection with limited top-plane visibility, not portrait staging.

## Four-location comparison

The fixed 28×56 front pose was composited on opened, approved R3.1 captures — it was not imported into runtime — at P1 Workshop, P8 Harbor Office, P5 Hall Plaza, and P7 Hero Ship. No placement changes scale.

| Location | Review |
| --- | --- |
| Workshop | Both hold against wood/cargo detail; B's jacket is clearest. |
| Office | Fixed scale reads as a visitor, not a prop; B best matches the destination. |
| Hall | Both feel human-sized against stairs and facade; no scale adjustment needed. |
| Hero | Both remain readable against the dark ship; B is marginally clearer. |

## Direction strategy and animation plan

Input remains 8-direction. Art stays deliberately **4-direction**: DOWN/front, UP/back, LEFT/side, and RIGHT as mirrored side. Diagonals use the dominant axis or last-facing direction on ties. After Human selection, produce 1–2 idle frames and four walk frames for front, back, and side; mirror side for right. Keep the shared feet baseline. A full 8-direction sheet is out of scope for Phase A.

## Recommendation and Human Gate

Recommend **B — Refined Portfolio Guide**: its navy/cream block gives the strongest professional small-scale read. This is only a recommendation.

`FINAL_PLAYER_SELECTION = PENDING`  
`RUNTIME_PLAYER_REPLACEMENT = BLOCKED`  
`GATE = READY_FOR_R4_PLAYER_HUMAN_SELECTION`

## Evidence

1. `evidence/runtime-r4-player-candidates/01-player-a-direction-sheet.png`
2. `evidence/runtime-r4-player-candidates/02-player-b-direction-sheet.png`
3. `evidence/runtime-r4-player-candidates/03-player-native-scale-review.png`
4. `evidence/runtime-r4-player-candidates/04-player-a-four-location-preview.png`
5. `evidence/runtime-r4-player-candidates/05-player-b-four-location-preview.png`
6. `evidence/runtime-r4-player-candidates/06-player-a-vs-b.png`
7. `evidence/runtime-r4-player-candidates/07-player-silhouette-review.png`
8. `evidence/runtime-r4-player-candidates/08-player-movement-direction-plan.png`

The direction, native-scale, comparison, and four-location boards were visually opened in this pass. Four-location boards are source-capture composites for selection, not evidence of runtime import.

