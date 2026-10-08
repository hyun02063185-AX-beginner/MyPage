# R5 Phase C — World Coordinate Contract (DRAFT)

Status: `DRAFT_SPATIAL_FEASIBILITY_ONLY`  
Reference Master: Candidate B — **PROVISIONAL**  
Runtime impact: **NONE**

## Scope

This is an explicit, image-derived spatial draft for Human review. It makes no claim that the painted Candidate B source is a collision mask, a scene plate, or a source of extractable runtime layers. The machine-readable source of truth is `data/portfolio-world/r5-spatial-blueprint-draft.json`.

## Coordinate system

| Item | Contract |
|---|---|
| Origin | Top-left |
| Positive axes | x right; y down |
| Draft world bounds | 1280 × 720 units |
| Source-to-world transform | Identity: `world = source` |
| Current camera | zoom 1.00; 1280 × 720 visible world |
| Closer test camera | zoom 1.25; 1024 × 576 visible world |
| Status | Deliberately DRAFT until asset dimensions and Human design choice are known |

Identity mapping is used only to make this review inspectable. It is not approval to make source pixels a production coordinate system.

## Playable ground and elevation

Declared traversable zones are Hall upper terrace (L2), Hall approach and Workshop forecourt (L1), lower harbor promenade and Archive approach (L0), plus explicitly named stairs, shore pier, side dock, and gangway. Buildings, cliff/retaining wall, hull, and sea are blocked. Water is crossed only where the named pier/dock/gangway polygons bridge it.

`S_MAIN` connects Hall stair base to Hall upper terrace. `S_WORKSHOP_LOWER` records the Workshop-to-promenade elevation change. The Hero Ship’s interior deck is intentionally **UNRESOLVED**; the proposed Hero interaction ends at a ship-side boarding threshold.

## Navigation contract

The graph declares polylines rather than arbitrary straight visual lines:

- Workshop → Hall: Workshop forecourt → Hall stair base → `S_MAIN` → Hall upper terrace
- Workshop → Hero: Workshop → promenade → shore pier → side dock → gangway → Hero boarding threshold
- Workshop → Archive: Workshop → Archive approach
- Hall → Hero: Hall → stairs → Workshop/promenade network → pier/dock/gangway
- Archive → Hero: Archive → Workshop/promenade network → pier/dock/gangway

The route graph is connected between the four candidate interaction anchors. Its geometry is covered by `portfolio-world/tests/r5-spatial-blueprint-draft.test.mjs`.

## Player and clearance contract

| Candidate | Visual size | Physics footprint proposal | Minimum corridor | Recommended corridor |
|---|---:|---:|---:|---:|
| A current | 28 × 56 | 28 × 16 | 42u | 56u |
| B larger | 32 × 64 | 32 × 18 | 48u | 64u |

All declared widths meet B’s 48u minimum. Three retain a Human-review warning below 64u: Workshop–Hall threshold (62u), Archive spur (54u), and Hero gangway (54u).

## Explicit non-approvals

- Human design selection: `PENDING`
- Fourth visitable/archive cue: `PENDING`
- Player/camera selection: `PENDING`
- Final spatial blueprint: `NOT APPROVED`
- Runtime implementation: `BLOCKED`

This is not design approval and not runtime approval.
