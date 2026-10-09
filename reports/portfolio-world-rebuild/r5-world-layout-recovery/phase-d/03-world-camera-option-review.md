# R5 Phase D — World Extent and Camera Option Review

## World plans

| Option | Bounds | Zoom-1 camera travel | Use | Art implication |
|---|---:|---:|---|---|
| A — Compact Exploration | 1600×960 | 576×384 | Four-POI core; later expansion becomes a separate area | Author edge continuation and camera-safe terrain/water. |
| B — Expandable Continuous Harbor | 2048×1280 | 1024×704 | Four-POI core with an inactive east scenic/reserve side | Author continuous water/shore extension, east boundary scenery, parallax, and any later dock geometry. |

Neither option is permission to scale or paste the 1280×720 Candidate B image into a larger canvas. The new areas need authored R5 environment assets. Option B is the recommended **planning** option because it preserves future seam capacity, but remains pending Human selection.

## Shared viewport

The existing logical viewport is 1024×576. Camera and player use one transform in the accompanying simulations; the boards are conceptual, not Phaser captures.

| Camera | Player screen height | Visible world | Read |
|---|---:|---:|---|
| 28×56 / zoom 1.0 | 56px | 1024×576 | Strong context, but player can read too small. |
| 28×56 / zoom 1.25 | 70px | 819.2×460.8 | Recommended first gameplay test: player and nearby route become clearer. |
| 32×64 / zoom 1.0 | 64px | 1024×576 | Larger player but retains broad framing and adds corridor pressure. |

Recommended camera direction: test 28×56 at zoom 1.25 for normal gameplay, then add a separate overview affordance if orientation needs it. Do not make the gameplay player small merely to keep the entire harbor on screen.
