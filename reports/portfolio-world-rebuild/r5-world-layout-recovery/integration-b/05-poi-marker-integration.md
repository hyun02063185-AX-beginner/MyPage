# POI marker integration

`r5PoiContract.ts` contains exactly Hall `(175,190)`, Workshop `(245,440)`, Archive `(180,560)`, and Hero threshold `(1020,364)`. Visual anchors remain distinct from navigation targets. The runtime projects anchors against the real Canvas bounding rect and camera view, and Marker handlers stop propagation before requesting a route.
