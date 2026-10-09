# Content entry UX options

Pilot test: arrival → explicit E/visit → small panel → existing page in a new tab. This preserves the exact world tab, camera, and player position without edits to the existing content pages. It also avoids pop-up blocking because the link is a direct user click.

Same-tab navigation is simple but needs explicit serialized restore state or browser Back; it risks losing the Pilot position and is not recommended for the final R5 portfolio. Direct content in a game overlay has the best in-world continuity but requires curated content rendering, scrolling, accessibility, loading/error states, and a new runtime UI; it is not implemented here. Recommendation: retain the explicit new-tab pilot flow until a later approved, stateful overlay/content-scene decision.
