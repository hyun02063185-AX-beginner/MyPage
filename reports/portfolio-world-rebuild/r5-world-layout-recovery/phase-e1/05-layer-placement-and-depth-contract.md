# Layer placement and depth contract

All placements use Candidate B/C.2 1280×720 coordinates, top-left origin. Player anchor is bottom-center feet; 28×56 at zoom 1.25. The data record is `data/portfolio-world/r5-production-layer-reconstruction-draft.json`.

| Order | Layer | Contract |
|---:|---|---|
| 0 | clean plate / water base | opaque estimated background only |
| 35–50 | dock, Workshop/Hall structures, ship hull | solid visual structure |
| player | 28×56 at a C.2 walkable anchor | feet are the ordering reference |
| 55–70 | piles, rails, foreground water/hull | occludes player where appropriate |

No scale is applied twice. The preview crops a 1024×576 world camera region and renders it at 1280×720, representing 1.25 zoom once.
