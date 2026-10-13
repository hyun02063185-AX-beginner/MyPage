# Scene and Camera Contract

| property | Integration A contract |
|---|---|
| logical viewport | 1024×576 via shared `GAME_CONFIG` |
| R5 world | 1280×720 |
| camera | bounds 0,0–1280,720; zoom 1.25; static centered preview |
| player | x=245, y=440; 28×56; origin .5,1; Arcade body 28×16 at y=40 |
| plate | x=0, y=0, depth 0 |
| foreground | Pilot x/y and occlusion-derived depths: Hall 0,155/30.242; Workshop 0,408/30.430; Archive 0,536/30.552; Dock 429,289/30.382; Gangway 938,297/30.368 |

The player is intentionally static at a valid Pilot walking coordinate. There is no follow camera or user movement in this stage. The camera bounds prevent rendering outside Candidate B; the reserve remains visual-only and unchanged.

