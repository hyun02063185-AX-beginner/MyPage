# R5 Phase C — Candidate B Spatial Feasibility Report

Status: `DRAFT_SPATIAL_FEASIBILITY_ONLY`  
Reference Master: **Candidate B — PROVISIONAL**  
R4 runtime modified: **NO**

## Conclusion

Candidate B is spatially feasible as a **draft direction**: a connected Workshop–Hall–Archive–Hero graph can be declared without filling the harbor with central paving or treating water as walkable. The Hero Ship retains a water berth and receives a readable access chain through promenade, pier, side dock, and gangway.

This conclusion supports a Human feasibility gate only. It does **not** approve Candidate B as final design, approve a final spatial blueprint, or authorize Phaser/runtime work.

## Reference integrity

The evidence uses the Phase B Candidate B original, SHA-256 `07f5fff3e9765682a20f106bf58e65e201bcb59c10d1bf065ed45b94b596008b`. Automated tests confirm the checksum before evaluating draft geometry.

## Feasible elements

| Element | Draft decision | Evidence |
|---|---|---|
| Playable ground | Explicit polygons for terrain, stairs, pier, dock, and gangway | `02-playable-ground-map.png` |
| Verticality | L0 harbor, L1 approaches, L2 Hall terrace; two named connectors | `03-elevation-and-stair-map.png` |
| Navigation | Connected, declared polyline graph between all four anchors | `04-navigation-graph.png` |
| Clearance | Every named choke point ≥ 48u (32×64 minimum) | `05-path-width-and-bottlenecks.png` |
| Hero berth | Water stays blocked; board through shore pier → dock → gangway | `06-hero-berth-access.png` |
| Ground contact | Five feet anchors lie in named traversable zones; Hero is on side dock | `07-player-ground-contact-review.png` |
| Camera review | 28×56 current, 28×56 closer, 32×64 current compared at identical anchors | `08-camera-and-player-scale.png` |
| Asset separation | Feasible as authored layers, not as image extraction | `09-runtime-layer-feasibility.png` |

## Navigation

- Workshop → Hall: declared through `S_MAIN`; PASS.
- Workshop → Hero: promenade → shore pier → side dock → gangway → boarding threshold; PASS.
- Workshop → Archive: direct declared branch; PASS.
- Hall → Hero: Hall stairs reconnect to the Workshop/promenade network; PASS.
- Archive → Hero: Archive reconnects through Workshop/promenade network; PASS.

## Bottlenecks and unresolved items

| Issue | Severity | Required follow-up |
|---|---|---|
| Archive needs a clearer destination cue | MINOR | Select emblem/sign/forecourt cue without creating a central mass |
| Workshop–Hall threshold is 62u | MINOR | Validate real structure and collision footprints; below 64u recommended width |
| Archive spur and Hero gangway are 54u | MINOR | Validate railing/collision clearance; minimum passes, recommended width does not |
| Hero Ship deck | UNRESOLVED | Keep interaction at boarding threshold until deck is authored |
| Layer decomposition | UNRESOLVED | Author new water, terrain, structures, pier/dock, ship, and foreground layers; do not extract occluded pixels |

## Automated geometry tests

`node --test tests/r5-spatial-blueprint-draft.test.mjs` validates:

1. draft status and pending Human gate state;
2. Candidate B source checksum;
3. navigation-node containment in named polygons;
4. polyline endpoint/declared-traversal consistency;
5. graph reachability among all four candidate anchors;
6. B-scale clearance minimum and named bottlenecks;
7. grounded player contact including dock—not-water Hero contact;
8. presence of all required Phase C PNG evidence.

No assertion samples source-image colours or alpha. The draft JSON declares the inspected geometry.

## Human gate requested

1. Confirm or reject Candidate B as the chosen design direction.
2. Choose the Archive cue treatment.
3. Choose the first player/camera runtime experiment (recommended first test: 28×56 with closer camera).
4. Accept or revise the 62u/54u bottlenecks.

Human design selection: **PENDING**  
Final spatial blueprint: **NOT APPROVED**  
Runtime implementation: **BLOCKED**  

`READY_FOR_R5_SPATIAL_FEASIBILITY_HUMAN_GATE`
