# R5 Phase C.2 — Minimum-Clearance Failure Reproduction

Status: `DRAFT_MINIMUM_CORRIDOR_REPAIRED_PENDING_HUMAN_REVIEW`  
Reference: Candidate B — **PROVISIONAL**  
Base: C.1, preserved unchanged

## Failure reproduced from C.1 geometry

C.1 sampled a 32u physics body at centerline ±16u. That confirms body fit, but does not prove the separately declared 48u minimum corridor. C.2 adds 2u-or-less centerline samples at ±24u.

| C.1 edge | Reproduced out-of-surface ±24 samples | Example coordinates | Cause |
|---|---:|---|---|
| `E_PROMENADE_PIER` | 14 | `(468.2,429.3)`, `(498.2,405.7)`, `(502.7,402.1)` | Pier-apron surface/centerline transition did not cover the complete 48u envelope. |
| `E_GANGWAY_HERO` | 3 | `(1036.2,331.0)`, `(1038.1,331.0)`, `(1040.0,331.0)` | Boarding threshold extended past the verified-width end of the declared gangway. |

The reproduction is automated in `portfolio-world/tests/r5-spatial-blueprint-c2.test.mjs` and visualized in `02-minimum-width-failure-map.png`. It uses declared polygons only—never sampled painting colour or alpha.

## Repair boundaries

- C.1 and Candidate B are retained unchanged.
- Building, cliff, hull, and sea collision footprints are **unchanged**.
- C.2 does not add a new pier: it more accurately declares the broad, already-visible shore-to-pier timber platform and centers the route on it.
- The Hero boarding threshold moves from `(1040,355)` to `(1028,355)`, remaining on the gangway and outside ship-deck space.
- No ship deck interior is made walkable.

## Corrected declaration

`G_PIER_APRON`, `G_SHORE_PIER`, `E_PROMENADE_PIER`, and `E_PIER_DOCK` are corrected as an overlay on C.1. The shore-to-Hero structure is explicitly:

`Shore → Pier apron → Shore pier → Side dock → Gangway → Boarding threshold`

Every C.2 route now passes both ±16u and ±24u sampling plus 24u radial corner checks. The 64u recommendation is evaluated separately and remains a warning where existing geometry does not support it.
