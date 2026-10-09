# R5 Phase D — Right Expansion Architecture

`RIGHT_SIDE = FUTURE_EXPANSION_RESERVE` remains intact: no new POI, building, path, or water walking. It is a visual water/horizon reserve, not pre-secured land.

| Model | What changes later | Benefit | Risk |
|---|---|---|---|
| A. World extension | Authored east shore/water, dock, collision, route graph, and camera bounds | Can support continuous harbor travel | Largest rework risk and must preserve current composition |
| B. Scene transition | A threshold loads separately authored Hero interior or offshore area | Protects harbor composition and scopes production | Needs loading, state, return location, and transition UX |

Three inactive seams are retained: Hero interior hook (boarding threshold only), east auxiliary berth (visual coordinate only), and offshore route (horizon only). Hero interior needs no east land. Any auxiliary berth must add a real dock and pass 48-unit clearance before activation.

Recommendation: prefer Scene Transition for the next expansion; it is not approved or implemented.
