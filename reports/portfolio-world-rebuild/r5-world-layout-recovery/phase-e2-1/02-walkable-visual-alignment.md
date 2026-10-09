# Walkable visual alignment

This Pilot contracts, never expands, the visible corridor: stone Workshop forecourt → narrow apron → timber shore pier → side dock → painted gangway. The C1/C2 source JSON is unchanged. The Pilot threshold is `[1020,364]`, replacing the C2 centre `[1028,355]` because it is the last 28×16 full-body-safe gangway location.

All movement, including each frame segment, is sampled every two world pixels. A route cannot cross a water gap merely because its endpoints are valid.
