# R3D.1 Architecture Integration Repair

R3D.1 repairs architecture rendering only. It does not alter R3C.1 foundation
assets, R3A walkable geometry, collision topology, player, animation, movement,
water behavior, or camera.

The Hall now uses one coherent Hall B-derived 470×260 visual assembly, rather
than three vertically compressed footprint slices. Its visual base is anchored
to the upper-plaza threshold and the central entry remains aligned to the
existing approach. The Workshop uses the broader Workshop A source at 205×300,
with a rendering-only quay plinth beneath it. Both plinths are non-walkable;
the original blockers are untouched.

Evidence is in `evidence/r3d1-architecture-integration/`, including seven
1280×720 captures, the before/after contact sheet, and browser QA result.
`npm run typecheck`, `npm run build`, and the build-browser harness passed.
The harness confirms Hall/Workshop approach reachability, collision and water
exclusion, stairs in both directions, player animation, camera dead-zone/follow,
and zero browser/console errors.

| Human-gate check | Result |
| --- | --- |
| Hall building scale | PASS |
| Hall doorway/player scale | PASS |
| Hall grounding / plaza connection | PASS |
| Workshop building scale | PASS |
| Workshop grounding / quay connection | PASS |
| No water gaps beneath architecture | PASS |
| Route readability | PASS |
| Mediterranean style consistency | PASS |
| Remaining graybox impression | CAUTION — Hero Ship is deferred to Batch C |

This is not self-approval.

```text
R3D.1_ARCHITECTURE_INTEGRATION = COMPLETE
NEXT                           = ARCHITECTURE_INTEGRATION_HUMAN_GATE
GATE                           = READY_FOR_ARCHITECTURE_INTEGRATION_HUMAN_GATE
```
