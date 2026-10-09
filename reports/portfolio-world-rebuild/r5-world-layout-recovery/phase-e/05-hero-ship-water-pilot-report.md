# R5 Phase E — Hero Ship / Water Pilot Report

Actual pilot: `pilot-assets/hero-dock-gangway-hull-v1.png` (1536×1024 RGBA). It is standalone generated art with dock piles, rope rail, gangway, lower hull, and a narrow waterline/contact-shadow accent—not a crop.

Review placement: world `(760,180)` at `520×347`, foreground order 80, with player feet at Hero threshold `(1028,355)`. The threshold remains on `G_GANGWAY`; no ship-deck walkability is added.

Result: dock/gangway/hull can be layered over a separate water plane and in front of the player where solid. However, it is not a pixel-exact replacement for Candidate B; final water, hull, shadow, and dock geometry must be authored together. This is a MAJOR production-art gap, not a successful ship implementation.
