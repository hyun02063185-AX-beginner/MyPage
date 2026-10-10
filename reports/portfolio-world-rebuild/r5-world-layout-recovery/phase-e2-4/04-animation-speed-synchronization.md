# Animation speed synchronization

The old 4-frame / 8fps loop lasted 0.5s and travelled 85 world pixels at the accepted 170px/s movement speed. V2 keeps movement speed unchanged but runs the 4-frame front/back cycle at 24fps and the 8-frame side cycle at 48fps. Both complete a gait cycle in about 0.167s (28px travelled), reducing apparent foot sliding without changing A*, collision, camera, or movement speed.

Direction changes require a 1.2 dominance ratio; near-diagonal input retains the last cardinal facing to prevent FRONT/SIDE flicker.
