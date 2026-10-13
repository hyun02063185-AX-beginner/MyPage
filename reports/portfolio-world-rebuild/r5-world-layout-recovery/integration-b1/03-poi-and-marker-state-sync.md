# POI and Marker state synchronization

Both controls are generated from `R5_POIS` and call the same `requestPoi(poi)` then `requestRoute()` flow. `updateNavigationButtons()` applies the shared IDLE/MOVING/ARRIVED/BLOCKED/CANCELLED state to both marker and menu button, including `aria-pressed`. Hero Ship is always present in the menu even when the camera does not show its Marker.
