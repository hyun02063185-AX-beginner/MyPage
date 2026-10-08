# R5 Phase B — Full-World Design Validation / Human Gate Preparation

## Scope and evidence level

This is a **concept-design validation**, not a Phaser visual pass. The Phase A Beauty Masters and every Phase B board were opened and inspected in this pass. The route, berth, and camera conclusions below are visible-layout findings only; spatial Blueprint, collision, runtime camera, and player physics remain blocked until Human selection.

Phase B preserves the Phase A masters byte-for-byte:

| Master | Phase A SHA-256 | Phase B original SHA-256 |
| --- | --- | --- |
| A | `b19f430192caed987a5d7e9548b3ce5d3d4193f392fa58cedcfe68f08e019d4d` | same |
| B | `07f5fff3e9765682a20f106bf58e65e201bcb59c10d1bf065ed45b94b596008b` | same |

## Candidate assessment

### A — Three-Landmark Open Harbor

- **Strength:** the Hall stair, Workshop forecourt, large central paving, and Hero dock are exceptionally direct to read.
- **Weakness:** central hardscape is comparatively formal and the broad plaza makes the 28×56 reference read small outside the foreground.
- **Design status:** valid candidate, but less organically harbor-led than B.

### B — Organic Coastal Harbor

- **Strength:** broad protected-water negative space, an asymmetric cliff/terrace sequence, and a continuous Workshop shoreline → timber pier → side dock → gangway read are present in the original Beauty Master.
- **Weakness to carry into Blueprint:** Workshop-to-Hall’s retained-wall/stair threshold needs a minimum playable-width check; the Workshop-linked Archive needs an emblem/sign/forecourt cue so it is discoverable without becoming a building mass.
- **Design status:** recommended pending Human selection. Neither weakness is a Critical Fail in the current complete design image.

### B2

**Not created.** Candidate B’s prior berth repair is already the preserved Phase A source. Phase B found no visual requirement for a second composition: generating B2 would introduce a new candidate without a demonstrated structural correction.

## Four visible routes

`05-navigation-routes-review.png` traces only surfaces visibly present in each Beauty Master. These are design-continuity checks, not collision claims.

| Route | Candidate B finding |
| --- | --- |
| Workshop → Hall | Stone forecourt meets the visible west stair/terrace route; Hall entrance is a distinct upper landmark. |
| Workshop → Hero Ship | Workshop shoreline joins the continuous timber pier, then the side dock and gangway; no line crosses open water. |
| Workshop → Archive | The lower Workshop-linked arch/alcove is reachable on the same land-side terrace; future cueing is required. |
| Hall → Hero Ship | Descending stair, lower harbor path, and timber pier form an uninterrupted visible sequence. |

Candidate A also retains visible paths for all four, but B has the stronger water-space and berth logic.

## Hero Ship / water / dock

The opened B close-up shows calm water below and both sides of the hull; dock posts and deck sit beside rather than beneath the hull; the timber pier visibly returns toward the Workshop shore; and the short gangway rises from dock to ship. The stern/bow orientation follows the basin edge. No Critical ship-grounding failure is visible in this concept master.

## Fourth visitable point

Option A, **Workshop-linked Harbor Archive**, is still recommended: it gains a meaningful portfolio endpoint while avoiding a new central building. Option B is peripheral but risks detachment. Option C has the least mass but weakens first-time destination read. This is a recommendation only.

## Player / camera concept comparison

`08-player-camera-scale-comparison.png` uses identical Candidate B scene locations: Workshop, central route, Hall plaza, main stairs, and Hero dock.

- **A — 28×56 current FOV:** preserves broad context but gives the player the weakest read at the central route and Hero dock.
- **B — 28×56 closer camera:** increases on-screen player presence while the five crops retain destination silhouettes and pier orientation. Recommended first Blueprint test.
- **C — 32×64 current FOV:** improves the character modestly but requires a new collision/body and asset-scale decision; do not implement merely from this board.

## Human decisions required

```text
HUMAN_DESIGN_SELECTION = A | B | REJECT_BOTH
FOURTH_VISITABLE_SELECTION = A | B | C | REVISIT
PLAYER_CAMERA_SELECTION = CURRENT_28x56 | CLOSER_CAMERA | 32x64 | REVISIT
APPROVAL_SCOPE = FULL_WORLD_DESIGN_TO_SPATIAL_BLUEPRINT_ONLY
```

```text
HUMAN_DESIGN_SELECTION = PENDING
FOURTH_VISITABLE_SELECTION = PENDING
PLAYER_CAMERA_SELECTION = PENDING
SPATIAL_BLUEPRINT = BLOCKED
RUNTIME_IMPLEMENTATION = BLOCKED
GATE = READY_FOR_R5_FINAL_WORLD_DESIGN_HUMAN_GATE
```
