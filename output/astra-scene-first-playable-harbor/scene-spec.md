# Scene-first harbor slice specification

- Source: 1672 × 941, the native generated plate. No upscale. Final logical frame: 1280 × 720. Source-to-logical conversion is x × 1280/1672, y × 720/941; the negligible aspect difference is normalized in the final frame.
- Scope: Harbor Square west transition → Exhibition Hall entrance approach → continuous Hero Quay → baked Hero Ship and sheltered water. This candidate is **NO-GO**, not an integration-approved asset.
- Camera: one bounded view, no camera scrolling required or tested. Native source provides about 1.3× sampling at the intended viewport. No unnecessarily large background was produced.
- Memory: one RGBA source texture is approximately 6.00 MiB decoded; plate plus full-canvas foreground is approximately 12.00 MiB before GPU padding/mipmaps. Each 8-bit CPU navigation mask is approximately 1.50 MiB; PNG file size is not runtime memory. Foreground can later use a cropped texture with an offset after approval.
- Player: the same **temporary** worker from `../astra-vertical-slice-validation/assets/props/scale-worker.png`, now rendered at 31 × 84 source pixels (about 24 × 64.3 logical). Bottom center is the feet anchor. Tested heights: 64/73/84 source pixels, approximately 49/56/64 logical, at Hall, middle quay, lamp and foreground promenade. Selected approximately 64 logical for the review frame because it best matches the entrance and middle-quay furniture. It still reads small beside the nearest foreground bollards; no tested constant scale passed across the full playable promenade. Selection is a best-candidate choice, not scale approval. No new character art was generated. Contact shadow remains QA-only.

## Baked and separated content

Buildings, ship, smaller vessel, quay, paving, greenery, planter, cargo, shadows, water and reflections remain one scene-authored picture. The current plate is a copy of `evidence/authored-repair.png`, produced by the final bounded localized edit of the original plate. The extra bow-side mast was removed; exactly three deck-rooted groups remain. Hanging scalloped canvas persists, so the sail repair fails. Composition and spatial relationships survived, with measured non-target texture drift documented in `evidence/repair-comparison.json`. Nothing is rebuilt from tiles or reusable environmental sprites. No water-motion overlay was introduced.

`foreground-occlusion.png` contains only exact source pixels from the foreground lamp shaft/base, within source bounds x=99–130, y=479–651. The crown remains baked because allowed actor heads in this corridor cannot reach it. This is a small gameplay occlusion stencil, not a new reusable lamp asset. The planter was considered but not separated: its physical footprint is excluded, and the lamp gives a much cleaner meaningful depth test without foliage reconstruction.

The lamp remains in the base plate. The foreground RGB was refreshed from the repaired plate using the unchanged alpha selection, so its redraw is still exact. Rendering those opaque pixels above an actor restores the lamp where that actor overlaps it. This requires **no background hole or lamp inpainting**; hiding the foreground leaves the intact scene. The image model separately restored the background behind the removed ship mast. This stencil does not validate extraction of a removable prop.

Draw the foreground above the player when the player's feet are behind the lamp base (source y < 652) and the player's head is below y=479. In front of the base, draw the player above it. This rule applies only to the bounded local lamp corridor, not every scene object. Ship rigging is outside player space and stays baked. Static reconstruction is pixel-identical to the authored target.

## Navigation and interactions

- All PNG masks share the source plate dimensions and origin at top left. No interpolation when sampling masks.
- `walkable-mask.png`: white = candidate foot positions on the promenade; black = outside the playable ground or excluded obstacle footprints. Water and architecture are black.
- `collision-mask.png`: white = collision/exclusion; black = no additional collider. It contains simple obstacle footprints and a 10-source-pixel inward boundary band sampled in cardinal directions. Black collision pixels alone never grant walkability.
- Legal position = **walkable white AND collision black**. Movement must sample the feet, not the sprite rectangle. This prototype band is not a substitute for swept-body collision testing at runtime.
- Start: (330,628). Hall approach: (145,480). Quay inspection: (335,633). Return to Harbor Square: (28,514).
- `interaction-hotspots.json` defines accessible polygons, semantic roles and future actions. Hall → `gallery.html`; Harbor Square → `index.html`; quay → future ship/portfolio inspection. No route is implemented. Hall approach ends below the entrance steps; climbing stairs and entering the building are outside this validation.

## Future Phaser assumptions, if a later gate passes

Use one background image, one depth-conditioned foreground stencil, an independent player, CPU mask lookup and hotspot polygons in the same coordinate space. Camera bounds must stop at this authored plate. Do not infer extra navigable area from the drawing. Keep the full authored water. Test continuous movement, scale, entrances, lamp depth switching and input behavior separately before integration. No Phaser runtime was changed in this phase.
