# Workshop → Hall root cause

Browser-executed navigation returned `[[245,440],[160,360],[152,344],[175,190]]`. Collision evaluation established that `[160,360]` and the segment from `[245,440]` are valid, while the reported old stop `[160,358]` is not valid and the overshoot segment from `[160,360]` to `[160,358]` is unsafe. Therefore the defect is playback waypoint overshoot, not an absent A* connection or a justification to widen geometry.
