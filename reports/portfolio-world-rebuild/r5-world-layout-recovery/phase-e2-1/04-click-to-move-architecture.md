# Click-to-move architecture

Canvas click, touch-capable Phaser pointer input, and the four DOM destination buttons call one request path. An 8px A* search runs only on corrected walkable polygons; all neighbours and smoothing segments run the 28×16 collision sweep. Invalid water/building targets are rejected. There is no straight-line shortcut or teleport.

Keyboard input cancels an active route before applying manual movement. A second click recalculates from the live player position.
