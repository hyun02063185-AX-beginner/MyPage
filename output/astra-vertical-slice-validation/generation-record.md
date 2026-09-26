# Astra Vertical Slice — generation and assembly record

Date: 2026-09-26
Primary reference: ../astra-master-harbor-benchmark/master-harbor-scene-final.png
Selected reconstruction: vertical-slice-reconstruction-final.png (1920 × 1080)
Selected representative sheet: representative-asset-sheet.png (1800 × 1320)
Final recommendation: ASTRA_ASSET_PIPELINE_NO_GO

## Method and provenance

Built-in image_gen.imagegen generated each reusable raster component separately, with the unchanged Master Harbor Scene supplied as the reference in every call. This is an Astra benchmark workflow label, not a statement about the image tool's underlying model identity. No web images or third-party art were used.

Nine required categories were generated once each: Hero Ship, secondary vessel, warehouse, quay wall, timber dock, water tile, paving tile, tree-planter and harbor banner. One optional standing worker was generated in refinement cycle 2 as the permitted human-scale reference. No whole-scene generation was performed during this task, and the assembled reconstruction was never submitted to image generation for retouching.

All ten exact prompts and generated source paths are in source-manifest.json. Original generated PNGs are copied to sources/. Selected normalized files are in assets/. asset-manifest.json records their source dimensions, alpha trim bounds, dimensions, byte sizes, SHA-256, nominal anchors and repeat status.

## Normalization

- Object assets: alpha-bounds crop with a 3px safety pad. Existing alpha is preserved, including antialiasing and rigging; no hand-painted background removal.
- Water and paving: source reduced to 256 × 256, then reflected into a 512 × 512 periodic tile. This deterministic technical normalization makes opposite boundaries match. It does not prove visually invisible repetition; mirror-pattern repetition remains a QA concern.
- Scene objects: aspect-preserving resampling to their recorded display sizes.
- Quay: repeated segments mapped onto vertical wall planes; joins and slope are explicit in scene-manifest.json.
- Water: repeated generated texture, reduced contrast, broad procedural color variation, object-derived vertically compressed reflections with scanline displacement/fade, and alpha-derived hull contact.
- Paving: repeated generated texture with restrained broad modulation to reduce uniformity.
- Ground shadows: derived from object alpha, projected toward lower right and softened.
- Mooring ropes and wall rings: deterministic compositing primitives; no extra generated prop library.
- Worker: a single generated sprite reused at 44px height as a scale reference.

The final image uses only this task's assets plus the documented reusable compositing treatments. It contains no portion of the master image as scenery or a background.

## Selection and refinement log

Initial family and initial assembly:
- Accepted the generated object family for the test based on material palette, furled-sail state, intact silhouettes and compatible broad elevations.
- Inspected objects on alpha and the actual reconstruction.
- Rejected the initial assembly as final: oversized warehouse relative to the simple scale figures; repetitive flat paving; overly busy, bright water; weak grounding.
- Evidence: evidence/initial-reconstruction.png.

Meaningful refinement cycle 1:
- Recalibrated warehouse, people, tree and ship relationships and berth placement.
- Reused the same warehouse as a partially framed background building.
- Added projected soft shadows, reduced water contrast and introduced broad variation; fine paving retained but softened.
- Reduced wall height and moved the Hero to a dock-adjacent berth.
- Evidence: evidence/refinement-1-reconstruction.png.
- Result: some scale/clarity improvements, still insufficient scene cohesion.

Meaningful refinement cycle 2:
- Replaced crude scale figures with one generated standing-worker sprite.
- Added masonry-mounted mooring rings, reduced reflection strength and derived narrow hull-contact shading from the actual sprite alpha.
- Created a calm-water motion proof from the same asset/compositing system.
- Selected vertical-slice-reconstruction-final.png as the strongest completed test result.
- Remaining visual failures recorded in validation-result.md. No third cycle was attempted.

## Reproduction

Run build_validation.py with Python, Pillow and NumPy. It normalizes local sources, writes assets, assembles the final PNG, writes the nine-category inspection sheet and scene manifest, and renders repeat/motion evidence. This isolated compositor is not a Phaser integration and does not touch either game runtime.

The master is an image-generation reference only. build_validation.py never reads it. compare_and_verify.py reads it only to create the separate labeled A/B comparison and verify its hash.

## Technical and visual evidence

- evidence/native-scale-overview.png: 960 × 540 inspection reduction; not a live runtime screenshot.
- evidence/surface-repeat-check.png: 3 × 3 surface tests.
- evidence/technical-checks.json: exact opposite-edge comparisons for normalized tiles.
- evidence/calm-water-motion.gif: 16 sampled phases encoded as 12 frames (identical adjacent samples coalesced), a 2.56-second cyclic motion proof at 768 × 432. This is a compositing proof, not an engine-performance test.
- evidence/master-vs-reconstruction.png: labeled A/B at a common comparison size.
- evidence/verification.json: source-reference integrity and file/asset checks.
- scene-manifest.json: concrete assembly positions and sizes.

## Scope

Runtime files were not edited. No complete world library, asset-selection request to the user, runtime build, or integration work was undertaken. The selected Master Harbor Scene remains byte-identical.
