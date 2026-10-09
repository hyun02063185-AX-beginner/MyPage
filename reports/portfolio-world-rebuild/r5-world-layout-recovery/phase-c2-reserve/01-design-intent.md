# R5 — Right-side Future Expansion Reserve: Design Intent

Status: `DRAFT_RESERVE_STRATEGY_PENDING_HUMAN_REVIEW`  
Reference: Candidate B — **PROVISIONAL**  
Runtime impact: **NONE**

## One-line strategy

**Do not fill the right side now. Design it as an intentional reserve for later expansion while completing the current four-point world first.**

## Why the right side stays open

The existing Hall–Workshop–Hero Ship composition is deliberately asymmetric. The Hero Ship and open water provide the right-side visual weight, while the horizon gives the frame breathing room. Adding a temporary building, a fifth destination, or a central filler would compete with the current landmarks and repeat the rejected “forced central mass” pattern.

The right side is therefore a finished **harbor outlook**, not unfinished playable ground:

- `FUTURE_EXPANSION_RESERVE`
- `NO_CURRENT_POI`
- `KEEP_OPEN_WATER_VIEW`

It is visual-only and non-walkable now. It has no collision exception, no active navigation edge, no camera target, and no hidden water traversal.

## Current and future role

| Now | Later, only after separate approval |
|---|---|
| Calm water / horizon | Hero Ship interior hook |
| Breathing room around Hero Ship | East auxiliary berth |
| Right-frame relief for the asymmetric composition | Offshore/island travel gate |
| No current interaction or POI | New authored routes, collision, clearance, and camera review |

## Reserve rules

1. Retain only Hall, Workshop, Archive, and Hero Ship as `active_poi`.
2. Treat the reserve as `visual_only_now`, never `walkable_now`.
3. Keep all building, cliff, hull, and sea collision unchanged from C.1/C.2.
4. Name seams now, but require new authored geometry and Human approval before activation.
5. Do not use test props, a central building, or decorative objects that read as a fifth destination.

## Camera interpretation

At current draft scale the world fits a single view; at the closer conceptual scale the right side remains a Hero Ship/water composition rather than unused gameplay acreage. Final world extents and camera policy remain unresolved, so this document does not make an implementation decision.
