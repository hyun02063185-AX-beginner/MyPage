# Character directional root cause

The 28×56 frame contract was intact. The failure was inside the alpha content, not Phaser scaling: raw front idle measured 20×52 opaque pixels, back 17×51, raw side idle 12×38. Raw side walk was also unstable across its four cells: 24×38, 12×38, 24×38, 21×38. The 12px second frame made the player collapse during an otherwise stable walk.

The Pilot uses one display contract (`28×56`, origin `.5,1`) and a 28×16 body at offset `(0,40)` every texture transition. Thus scale/origin/body ownership was not the cause. `FlipX` is retained only for left/right mirroring.

The correction uses a Pilot-only normalized Side sheet. It preserves source pixels and aspect ratio, replaces the collapsing walk cell with stable source silhouettes, and places every Side frame on opaque Y=54, matching the front foot endpoint. Raw R4 files are not altered.
