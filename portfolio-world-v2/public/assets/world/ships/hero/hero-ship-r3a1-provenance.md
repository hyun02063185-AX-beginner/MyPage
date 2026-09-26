# Hero Ship R3A.1 provenance

- Asset ID: `world.ship.hero.r3a1`
- Runtime file: `hero-ship-r3a1.png` (1024 × 1024 RGBA)
- Source file: `portfolio-world-v2/art-source/world/ships/hero/hero-ship-r3a1-source.png` (1254 × 1254 RGBA)
- Supersedes at runtime: `world.ship.hero.r3a` only. The prior R3A asset remains as historical evidence; its sail state was broadly deployed.
- Sail-state correction: cream canvas is now tied/rolled into compact bundles along yards and the bowsprit; no broad deployed or billowing sail surface is present.
- Mast/readability: three distinct mast groups (foremast, mainmast, mizzenmast), with yards, shrouds, rigging, raised stern cabin, and bowsprit retained for an Age-of-Sail merchant/exploration identity.
- Method: OpenAI built-in image editing from the R3A target as the reference. The first edit replaced deployed sails with furled bundles; a constrained follow-up edit introduced a distinct deck-mounted foremast. The selected generated 1254 × 1254 source was retained unmodified, then deterministically normalized to a 1024 × 1024 runtime PNG with high-quality bicubic resampling and a 19 px downward canvas placement so alpha content reaches the bottom-center waterline pivot.
- Generated: 2026-09-26.
- Prompt intent: stationary three-mast merchant/exploration tall ship, side-dominant hybrid-orthographic 2.5D hull, warm wood, restrained deep blue/muted gold, and visible rigging/furled cream canvas; no pirate, warship, scenery, water, text, or active-sailing posture.
- License / media note: generated media; retain this record with the asset. No third-party source asset was used.
- Runtime display / pivot: 460 × 460 world px, Phaser Image origin `(0.5, 1.0)` at waterline.
- Filtering: browser-native image sampling with Phaser `roundPixels`; this is retro-inspired raster art, not a strict low-resolution pixel-grid sprite.
- Approval: visual approval is explicitly pending independent R3A.1 QA.
