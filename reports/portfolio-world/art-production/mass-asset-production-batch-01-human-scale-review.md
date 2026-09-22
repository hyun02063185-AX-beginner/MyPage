# Mass Asset Production Batch 01 — Human Scale Review Record

## Decision

The post-Batch-01 human review requires `SAME_CLASS_SCALE_CONSISTENCY = REQUIRED`. The authoritative building reference is `PLAYER -> MAIN DOOR -> BUILDING MASS`: a primary entrance should visually admit about two 24 px-wide player bodies side-by-side. Workshop read as artificially enlarged and Academy as artificially reduced. Ship-relative size is accepted, but active vessel perspective requires an explicit audit. Full rollout remains on hold.

## Applied Review Rule

The practical entrance-width target is `1.8–2.6×` player width (43–62 px for the current 24 px player). This is evidence-led rather than a forced exact 2.000× value: it accommodates 2 px raster measurement uncertainty, door-frame thickness, facade projection, and Workshop's open split doors. Door height is a coherence check rather than collision data.

| Building | Before display | After display | Main door | Door/player W×H | Review action |
| --- | --- | --- | --- | --- | --- |
| Guild Hall | 338×204 | 338×204 | 50×58 | 2.08× / 1.81× | retained reference |
| Academy | 338×198 | 370×216 | 50×57 | 2.08× / 1.78× | uniformly increased |
| Workshop | 338×198 | 291×170 | 60×51 | 2.50× / 1.59× | uniformly reduced |
| Exhibition Hall | 332×204 | 356×218 | 46×60 | 1.92× / 1.88× | uniformly increased legacy art |

All three changed files are content-preserving, uniform 1× re-exports of already-valid art; no PNG was stretched nonuniformly, no collision was derived from visual size, and no full-rollout work was authorized.

## Same-class Policy

`SAME_CLASS_SCALE_CONSISTENCY = REQUIRED`: objects in the same semantic family must share a coherent apparent real-world reference even when silhouettes differ. Primary buildings use player/door/floor/mass; ships use hull/deck/human cues and their accepted hierarchy; trees use trunk/canopy/player; small props use player/hand-or-waist-scale cues. Numeric bands are added only where evidence exists.

## Human-review Evidence Prepared

DEV-only `assetPreview=scaleReview` views place the player directly in front of each major door, provide a four-building whole-world frame, and provide tree/prop adjacency frames. The production bundle test verifies this query text is removed. Visual inspection confirmed the four door views, whole-world context, Hero D plus the active fleet, and tree/prop scale sanity. Player placement is review-only and does not alter normal spawning, routes, collision, or IA.

## Ship Direction

Current size order remains unchanged: Hero D > medium vessels > small working boats. The legacy 15° geometry audit is recorded in `legacy-15deg-audit-major-building-scale-recalibration.md`; it finds no material ship correction requirement, so no vessel art was regenerated or resized.

## Gate

```text
HUMAN_SCALE_REVIEW_FINDINGS = APPLIED
FULL_WORLD_ROLLOUT = HOLD
NEXT_GATE = READY_FOR_RECALIBRATION_HUMAN_REVIEW
```
