# Marker anchor and interaction contract

Markers are DOM buttons inside the Pilot root. Every frame they convert `visualAnchor` world coordinates through the active Phaser camera `worldView` and zoom to root-relative CSS position. This permits browser keyboard focus and touch/click interaction while following pan and zoom. Near the right edge the label opens inward so it remains readable.

`visualAnchor` is presentational only. `navigationTarget` is the existing safe C.2/Pilot target; `interactionRange` is a separate 58-unit content-preview radius. No collision polygon, walk zone, target, pathfinding algorithm, or background scenery changed. Marker clicks prevent default and stop propagation before emitting the existing `hybrid:poi` event, so no background click is duplicated.
