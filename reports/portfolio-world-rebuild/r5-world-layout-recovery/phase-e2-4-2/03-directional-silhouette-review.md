# Directional silhouette review

All active normal-play poses keep the 28×56 logical sprite cell, `.5,1` display origin, 28×16 body at y=40, and y=55 image foot contact. V3 Front/Back are only selected in the Hybrid Pilot. Side remains the approved V2 walk plus V3 same-master idle; canonical R4 sources are neither modified nor selected outside the explicit `walkVersion=before` QA route.

The 1.2 directional-dominance hysteresis remains unchanged, preventing diagonal paths from flickering between a vertical and side sprite. Right side still uses FlipX.
