# R3G Final-Look Convergence Pass 1

## 1. Director Batch D Human Gate

`R3F_ENVIRONMENT_ART_BATCH_D = COMPLETE` and
`BATCH_D_HUMAN_CLUTTER_OCCLUSION_GATE = APPROVED` are recorded. The approval
covers the prop-density direction, foreground occlusion direction, increased
lived-in space, and preserved Harbor Square → Hall → Quay → Hero Ship route.
It does **not** grant final visual approval, production visual lock, or final
Player art approval.

## 2. R3G purpose

This is a runtime-only convergence pass, not a new place or gameplay batch. It
asks whether the existing individual assets can read as one warm Mediterranean
harbor through water, contact grounding, and cross-family light/material
cohesion. R3A geometry, collision ownership, routes, movement, player scale,
and camera behavior remain unchanged.

## 3. Water

L0 now uses four broad deep-turquoise depth bands, a restrained slow shimmer
(8.5-second phase), quiet shore-contact darkening, and a dark-teal broken
ripple/shadow immediately beneath the Hero Ship hull. It remains Graphics-only:
there is no scene plate, new water collision, white foam outline, or pixel
derived gameplay data.

## 4. Contact / shadow grounding

Short low-opacity warm-brown contacts ground the Hall, Workshop, bench,
planters, crate/barrel set, bollards, and lamp. Quay edge and stair risers gain
shallow ambient separation. The ship uses a soft water contact rather than a
CSS-style drop shadow; all contacts are explicit visual layers.

## 5. Lighting / material cohesion and foundation

Hall, Workshop, Hall banners, Hero hull/mast/rigging receive separate, subtle
warm-daylight tints; no global color filter hides mismatch. Foundation remains
quiet and route-readable, with only stair-riser separation, a quay-edge
contact band, and limited base occlusion added.

## 6. Landmark verdicts

| Landmark | Verdict | Reason |
| --- | --- | --- |
| Exhibition Hall | KEEP | Strong landmark silhouette and warm limestone finish now ground convincingly; no replacement is needed in this pass. |
| Workshop | REPAIR_LATER | Its source-art lighting/material resolution remains lower than Hall despite grounding/tint cohesion. |
| Hero Ship | REPAIR_LATER | Landmark scale and route/depth remain good; purple rigging/material language still needs a source-art refinement for Hall parity. |

## 7. Before / after and evidence

The 1280×720 actual-camera evidence is in
`reports/portfolio-world-rebuild/evidence/r3g-final-look-convergence-pass-1/`:
the required `01`–`08` captures, `r3f-to-r3g-before-after-contact-sheet.png`,
and `water-before-after-contact-sheet.png`. The latter compares the same Quay
state; the former compares the same wide upper-plaza state.

## 8. Functional QA

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run build` | PASS (existing bundle-size warning only) |
| `npm run qa:final-look` | PASS — movement, both stair directions, Hall/workshop/quay/gangway routes, water exclusion, Hero Ship collision, depth/foreground context, camera follow/dead-zone, animated-water capture, failed-request and browser-error checks |

## 9. Visual QA

At 1280×720, water reads as deeper and less tiled than R3F; no strong foam or
sparkle appears. Ground contacts add modest placement cues without closing a
route or becoming sticker shadows. The richer prop direction remains legible,
and no overall tint hides the remaining Workshop/Ship mismatch. This evidence
does not self-grant visual approval.

## 10. FINAL_LOOK_GAPS

1. Final Player character art remains the largest quality discontinuity.
2. Workshop needs source-art material/lighting repair or replacement.
3. Hero Ship needs rigging/hull material refinement for Hall-quality parity.
4. Water benefits from this pass but still lacks tailored reflection assets at landmark scale.
5. A later full-scene lighting/art-direction pass is needed after the source-art repairs.

## 11. Next recommendation

Run the Human Final-Look Pass 1 review against `08-wide-final-look-pass1.png`
and the two comparison sheets. If approved, scope Player final art and the two
recorded source-art repair decisions as separate passes rather than reopening
gameplay geometry.

```text
BATCH_D_HUMAN_CLUTTER_OCCLUSION_GATE = APPROVED
R3G_FINAL_LOOK_CONVERGENCE_PASS_1    = COMPLETE
NEXT                                 = FINAL_LOOK_PASS_1_HUMAN_GATE
GATE                                 = READY_FOR_FINAL_LOOK_PASS_1_HUMAN_GATE
```
