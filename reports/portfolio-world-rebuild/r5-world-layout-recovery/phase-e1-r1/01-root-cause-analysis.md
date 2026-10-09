# Root-cause analysis

E.1-R used narrow semantic polygons as the clean-base repair mask. Those polygons did not cover every mast, dock, and lower-hull pixel, leaving source fragments in water. `hero_ship_foreground` also owned a lower hull/water slab; Hull OFF therefore left apparent ship pixels. Finally, `composite()` conditionally painted the entire foreground asset based on player X, which made a broad opaque source region appear during Hero-route frames.

R1 separates these concerns: a broad Hero cleanup mask owns all removal pixels; semantic masks own only the structure being drawn; and foreground environment is always painted. Only the player is redrawn in front when its 28×56 footprint does not intersect the actual foreground alpha mask.
