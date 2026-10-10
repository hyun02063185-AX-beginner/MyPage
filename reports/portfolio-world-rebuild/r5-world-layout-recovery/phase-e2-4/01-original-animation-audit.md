# Original animation audit

- FRONT/BACK: four unique contact/passing poses, 28×56 cells, 8fps (0.5s cycle).
- SIDE: four cells; raw frame 1 has a 12px-wide opaque silhouette. The prior normalized strip stabilised bounds but left too little leg separation.
- At 170 world px/s, the old 0.5s cycle travelled 85px. This exceeded the visible stride and read as sliding.
- R4 source PNGs are untouched. Front/back were accepted and preserved byte-for-byte in the Pilot namespace.
