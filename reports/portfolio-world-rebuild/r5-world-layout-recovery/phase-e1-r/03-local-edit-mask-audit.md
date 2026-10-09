# Local edit-mask audit

`12-local-edit-mask-map.png` visualizes source-derived ownership. Production masks are `MASK_WORKSHOP_HALL`, `MASK_HERO_DOCK`, `MASK_STATIC_FIGURES`, and their union `MASK_ALL_LOCAL_EDITS` in `production-assets/`.

`MASK_STATIC_FIGURES` is intentionally empty: the visible static figure is not on an E.1-R C.2 test route, so removing it would be unnecessary scope expansion. Feather is 0 pixels; hard ownership boundaries are deliberate so the exact mask also defines the pixel-integrity region.

The build computes Candidate B versus Common Base after PNG conversion. `CHANGED_PIXELS_OUTSIDE_EDIT_MASK = 0`; any nonzero value raises an error.
