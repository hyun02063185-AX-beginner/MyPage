# Workshop → Hall fix

`advanceAutoRoute` caps each frame at `min(170 * delta / 1000, remainingDistance)`. If the remaining distance is consumed, it snaps only to the already validated target waypoint, updates the Arcade body, then advances the index. This prevents crossing the valid `[160,360]` waypoint into `[160,358]`; collision checks remain enabled.
