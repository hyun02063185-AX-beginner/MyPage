# Phase E defect reproduction

The Phase E images prove alpha compositing, not replacement. `12-workshop-hall-layer-pilot.png` leaves the Candidate B stair, wall, and workshop geometry in its opaque beauty master, then draws a new foreground wall/planter over it. `13-hero-ship-water-layer-pilot.png` likewise leaves the source dock and ship in place beneath a differently proportioned generated hull/dock layer.

In both cases the unwanted original pixels remain behind the pilot layer. This causes duplicate structural edges, unmatched contact shadows, and a misleading apparent route. E.1 does not use either pilot in its reconstruction composites. Candidate B (`02-candidate-b-original.png`, SHA-256 `07f5fff3…b596008b`) is read-only.

Reproduction conclusion: Phase E is correctly classified as a failed production-replacement method, while still being valid evidence that alpha/depth mechanics are possible.
