# R5 Phase C.1 — Final Spatial Integrity Report

Status: `DRAFT_SPATIAL_INTEGRITY_REPAIRED_PENDING_HUMAN_REVIEW`  
R4 runtime modified: **NO**

## Result

The declared C.1 geometry resolves the Phase C data contradictions. Every visitable node is on a named surface and outside every non-water collision footprint. Every required route is a continuous, sampled path with 32u player-width clearance, and no route centerline intersects a building, cliff, or hull collision footprint.

This is technical draft consistency only. It does not establish that the annotated ground footprints are final production collision, does not approve Candidate B, and does not authorize runtime implementation.

## Required-route validation

| Route | Result | Contract |
|---|---|---|
| Workshop → Hall | PASS | Forecourt → lower Hall stair → mid landing → upper Hall stair → terrace approach |
| Workshop → Archive | PASS | Exterior right-side approach; Archive interior remains blocked |
| Workshop → Promenade | PASS | L0 continuous ground; no fabricated stair |
| Promenade → Hero Ship | PASS | Pier apron → shore pier → side dock → gangway → boarding threshold |
| Hall → Hero Ship | PASS | Hall stairs reconnect to L0 network, then berth chain |

## Elevation validation

- Workshop forecourt and lower promenade are both **L0** in this draft; no separate stair is asserted.
- Hall is the only land elevation change: **L0 → L1 → L2**, through two named, graph-connected stair runs.
- The Hero transition is a named gangway to a **threshold only**. No ship-deck interior is inferred.

## Player clearance

The proposed 32×64 player has a 32u physics width. C.1 samples each centerline every 2u and also samples both ±16u lateral boundaries. All edges meet a 48u corridor minimum.

- Recommended (≥64u): Hall stairs 76u, promenade 96u, shore pier 72u.
- Minimum-pass / review: Archive approach 54u, gangway 54u.

## Remaining unresolved items

| Item | Status |
|---|---|
| Ground/collision footprint exactness | UNRESOLVED — requires approved authored assets; not derivable from projected art. |
| Final world extents and camera policy | UNRESOLVED — no travel at current zoom; limited travel when closer. |
| Archive visual cue | MINOR — exterior approach is valid, destination read still needs Human design choice. |
| Archive approach and gangway width | MINOR — minimum passes, recommendation does not. |
| Hero deck interior | UNRESOLVED — boarding threshold only. |

## Human status

Human design selection: **PENDING**  
Final spatial blueprint: **NOT APPROVED**  
Runtime implementation: **BLOCKED**

`READY_FOR_R5_C1_GEOMETRY_REVIEW`
