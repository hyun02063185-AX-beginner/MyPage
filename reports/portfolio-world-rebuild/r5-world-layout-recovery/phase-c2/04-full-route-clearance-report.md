# R5 Phase C.2 — Full Route Clearance Report

Status: `DRAFT_MINIMUM_CORRIDOR_REPAIRED_PENDING_HUMAN_REVIEW`  
R4 runtime modified: **NO**

## Measurement method

The C.2 test resolves the C.2 overlay on top of preserved C.1 geometry. For every navigation segment it samples every 2 units or less, checking the centerline and both lateral points:

| Envelope | Meaning | Result |
|---|---|---|
| ±16u | 32u player physics width | PASS on every route |
| ±24u | 48u declared minimum corridor | PASS on every route and route corner |
| ±32u | 64u recommended corridor | PASS OR WARN; not available throughout every existing route |

All centerline segments are also checked against building, cliff, and hull collision footprints. Sea crossing is permitted only for edges typed `PIER` or `GANGWAY` on named bridge surfaces.

## Required route results

| Route | 48u minimum | 64u recommendation | Notes |
|---|---|---|---|
| Workshop → Hall | PASS | PASS | C.1 Hall two-run stair connection retained. |
| Workshop → Archive | PASS | WARN | Existing exterior approach has 48u but not a consistent 64u envelope. |
| Workshop → Hero | PASS | WARN | Network is valid; shore/dock transitions have local 64u limits. |
| Hall → Hero | PASS | WARN | Rejoins the L0 network through validated Hall stairs. |
| Promenade → Pier | PASS | PASS | C.2 centers path on declared existing pier apron and shore pier. |
| Pier → Side Dock | PASS | WARN | Actual geometry meets minimum; recommendation is not continuous. |
| Side Dock → Gangway → Threshold | PASS | WARN | Threshold relocated within the verified gangway envelope; deck remains undeclared. |

## C.2 final state

```ini
GEOMETRY_INTEGRITY = PASS
MINIMUM_CORRIDOR_48 = PASS
RECOMMENDED_CORRIDOR_64 = PASS_OR_WARN
FULL_WORLD_DESIGN = PENDING_HUMAN
FINAL_BLUEPRINT = NOT_APPROVED
RUNTIME = BLOCKED

GATE = READY_FOR_R5_C2_FINAL_SPATIAL_HUMAN_REVIEW
```

## Remaining review scope

- Candidate B remains provisional; no Human design approval is implied.
- Camera/world extents remain unresolved from C.1.
- Archive cue/fourth visitable choice remains pending.
- 64u warning areas are surfaced for any future structural redesign; C.2 does not invent wider structures.
- Hero ship deck interior remains unresolved and inaccessible.
