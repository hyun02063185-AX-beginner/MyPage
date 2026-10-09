# Depth-transition repair

The old player-X branch hid or showed an entire foreground layer. R1 never switches environment assets by player coordinate. Primary structure is drawn, then player, then stable foreground. If the player’s rectangle has no alpha-mask intersection with the foreground, the player alone is redrawn above it; if it intersects, the foreground naturally occludes the player.

Hero-route output uses 16 frames to add detail through the prior transition region. Layer-by-layer composites for frames 10–12 are saved in `layer-debug/`. Their no-player world hash is invariant across every Hero frame, proving player movement does not swap water or ship environment art.
