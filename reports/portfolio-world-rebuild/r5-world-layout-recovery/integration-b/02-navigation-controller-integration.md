# Navigation controller integration

Pointer ground clicks and marker clicks call `findPilotPath([player.x, player.y], target)`. Every runtime movement candidate is checked by both `canOccupyFeet` and `isMovementSegmentSafe`. WASD/arrows normalize diagonal velocity and cancel an active automatic route. A route guide is rendered only from remaining A* waypoints and can be toggled ON/OFF.
