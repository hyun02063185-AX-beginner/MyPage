# R5 Phase E — Layer Decomposition Plan

| Layer | Production classification | Rationale |
|---|---|---|
| Distant background | Fixed scenic reference only | No player occlusion, but not sufficient for camera-edge exposure. |
| Water | Reauthor | Must exist behind dock/ship and respond to layer reveals. |
| Ground / terrain | Reauthor | Hidden walkable ground cannot be extracted from the plate. |
| Architecture | Reauthor | Major buildings need ground contact and depth/occlusion splits. |
| Pier / dock | Reauthor | Deck, piles, and player-depth require separate geometry. |
| Hero Ship | Reauthor | Hull, shadow, waterline, and gangway are inseparable in the plate. |
| Foreground occlusion | Reauthor + piloted | Two actual RGBA pilots establish a feasible depth pattern. |
| Decoration | Unresolved | Static people and props require selective recreation/removal. |

Target order: scenic reference → authored water/base terrain → authored structures → player feet at C.2 anchor → foreground occlusion → future interaction prompt.
