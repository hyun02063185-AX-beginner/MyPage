# Camera viewport correction

Logical viewport: `1024×576`. Zoom: `1.25`. Visible world: `819.2×460.8`. The player’s native 28×56 world sprite is 35×70 logical pixels.

The harness clamps a floating world camera to the 1280×720 review bounds, performs exactly one affine world-to-logical transform, then enlarges the resulting logical preview to 1280×720 solely for review. Preview scaling is not added to camera zoom.

`18-camera-five-location-board.png` records Hall, Workshop, Archive, Promenade, and Hero-threshold clamps.
