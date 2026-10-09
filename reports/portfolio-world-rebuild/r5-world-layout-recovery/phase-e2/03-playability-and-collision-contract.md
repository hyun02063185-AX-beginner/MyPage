# Playability and collision contract

The scene is `1280×720`; its logical viewport is `1024×576` at camera zoom `1.25`. The R4 selected player uses a native `28×56` visual and an explicit `28×16` feet body.

Every attempted step samples all four body corners plus centre against the union of named C1+C2 walkable polygons. Any pixel outside the union is water/non-walkable. Hall, Workshop, Archive, cliff and Hero hull polygons are authored blockers. The C2 `N_HERO` is a threshold only; the deck remains blocked.
