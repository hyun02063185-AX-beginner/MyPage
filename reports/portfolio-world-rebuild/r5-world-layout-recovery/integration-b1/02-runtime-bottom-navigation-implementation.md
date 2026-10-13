# Runtime bottom navigation implementation

`R5WorldScene.mountRuntimeUi()` creates `#r5-runtime-bottom-nav` after `#portfolio-world-root`, before the existing Footer. It therefore occupies an independent row below the Canvas rather than covering the world. The row contains exactly the four `R5_POIS` destination buttons plus the one route-guide toggle. It exists only when R5WorldScene exists and is removed by `destroyRuntimeUi()`.
