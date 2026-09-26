# Master Harbor visual system — extracted before asset production

Primary reference: ../astra-master-harbor-benchmark/master-harbor-scene-final.png (1672 × 941). Its actual appearance outranks historical numeric camera assumptions. The master remains unchanged.

## Observable production rules

| Axis | Extracted rule |
| --- | --- |
| Palette | Warm ivory limestone and plaster; terracotta roofs; honey/umber timber; subdued navy painted accents and small aged-brass highlights; olive/sage foliage; cool teal basin. |
| Warm/cool balance | Warm built environment and ships against cool water; sunlit neutrals dominate land without an overall orange cast. |
| Stone | Irregular but coursed masonry, softened chipped edges, thin warm gray joints, local ochre wear. Quay structural blocks larger than fine paving units. No heavy black outlines. |
| Timber | Long coherent plank courses, restrained grain, warm edges and dark joints; beams and ship frames retain volume. Brass supports wood rather than dominating it. |
| Plaster/roof | Light warm plaster over stone bases, restrained unevenness; closely spaced clay roof tiles and weathered timber doors. Functional warehouse proportions, minimal ornament. |
| Water | Broad teal color field with fine low-energy ripples, small highlights and subdued broken reflections. Opaque at hull immersion, no whitewater. Separate reusable surface, reflection and contact layers. |
| Greenery | Dense olive/sage canopy masses with small sunlit leaf clusters, dark interior foliage, slender brown branching. Flowers minor accents. Low pale-stone planters. |
| Edges | Crisp silhouette at scene scale with soft antialiasing; internal edges defined by value/material, not cartoon ink. Thin rigging must retain real alpha. |
| Shadows | Warm-neutral directional light from upper left; softly bounded ground shadows toward lower right; concentrated contact darkening. No black sticker outlines or baked white halos. |
| Texture density | Architecture, timber hulls and stone share fine illustrated detail. Paving reads as a surface first. Hero rigging is finer but does not justify a different rendering style. |
| Contrast | Hero hull/masts and warehouse openings darkest; sunlit walls and bundled canvas provide light accents. Water and paving carry less contrast. |
| Building projection | Long visible primary facades with shallow-to-moderate roof planes, limited side walls and nearly vertical verticals; frontal, weak-perspective illustration rather than strict isometric. Extract from master rather than impose exact 15°. |
| Ship projection | Broad hull elevation, slight deck visibility, tall vertical masts, readable bow/stern. Hero bow right, secondary bow left. Furled canvas compact on yards/boom; no deployed triangles. |
| Human scale | Door about 1.3–1.6 adult heights, warehouse eave about 2.5–3.5 adult heights. People around 28–34 pixels at planned 1920 × 1080 slice; paving units only a few pixels. Ship about 18–24 adult heights long. |
| Hierarchy | Hero: merchant ship. Unique: warehouse and smaller vessel. Modular: water/paving/quay/dock. Dressing: tree-planter and navy/ivory harbor banner. |

## Technical frame and construction plan

Produce exactly nine representative categories. Object assets: transparent PNGs with trimmed alpha and bottom/waterline anchors. Surfaces: repeatable opaque PNGs; inspect tiled previews. No separate per-asset human selection. Initial family plus at most two meaningful refinement cycles.

Assemble a 1920 × 1080 static reference frame from the reusable files using a reproducible compositor. Repeated quay segments, dock segments, paving and water tiles demonstrate reuse. Reflection/contact/shadow layers are derived from object alpha and placed independently; water animation phase can be previewed separately. A scene manifest records filenames, placements, scales and anchors for later Phaser integration. The compositor must never read the master as a background or paint over the assembled output using image generation.

A small functional working-quay slice is sufficient; it does not require the master's full campus skyline. Clear circulation and open basin space remain visible. Representative object size anchors are calibrated together after initial generation rather than independently optimized.

## Gates

Inspect the actual assembled frame beside the master, the nine-category sheet, alpha edges, repetition and human-relative surface scale. Passing file checks alone does not constitute visual success. Record failure honestly if a strong one-shot illustration cannot survive this decomposition.

