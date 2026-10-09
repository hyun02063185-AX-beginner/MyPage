# Hero dock / ship reconstruction

The Hero kit separates `hero_ship_hull_rgba`, `hero_side_dock_rgba`, `hero_gangway_rgba`, `hero_dock_piles_rgba`, `hero_water_base`, `hero_water_contact_rgba`, `hero_water_foreground_rgba`, and `hero_foreground_rgba`. `hero_ship_dock_reconstruction_bundle_rgba.png` is the non-runtime composition helper used in `14-hero-reconstructed-composite.png`.

The base has no source ship or berth. The source-matched Hero bundle is placed at `(410,80)` and aligned with the C.2 boarding threshold `(1028,355)`. The gangway remains a threshold only; no ship deck is claimed as walkable.

Result: the source ship is not doubly displayed. Hull, dock, and gangway maintain their original mutual alignment. The generated water beneath the bundle is visually plausible, but reflection/contact blending remains conditional and needs a production artist.
