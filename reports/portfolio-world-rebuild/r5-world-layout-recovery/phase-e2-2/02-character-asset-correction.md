# Character asset correction

New Pilot-only assets:

- `public/assets/r5-hybrid/pilot-player/side-idle-normalized.png`
- `public/assets/r5-hybrid/pilot-player/side-walk-normalized.png`

They derive from the R4 `walk-side.png` source using nearest-neighbour, aspect-preserving placement; no raw R4 image was overwritten and no horizontal-only stretching was used. The derived idle silhouette and every derived walk frame have a 28×51 opaque envelope with feet on Y=54. The front/back assets remain raw R4 assets.

`09-character-turnaround-before-after.png` documents the original raw Side against final Pilot Left/Right plus unchanged Front/Back. `10-character-gameplay-comparison.png` is captured from the actual Phaser Pilot at the Workshop spawn with fixed pose QA URLs.
