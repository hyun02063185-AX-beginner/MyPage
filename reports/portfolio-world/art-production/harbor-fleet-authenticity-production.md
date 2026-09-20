# Harbor Fleet Authenticity Production

## A. Gate

`READY_FOR_FLEET_AUTHENTICITY_INDEPENDENT_REVIEW`

## B. Work Context

Fleet Authenticity Production Pass on `feature/portfolio-world-sprint-02`; Batch 04 is not started. Starting review commit: `2884406`.

## C. Starting Commit

`2884406 docs(portfolio-world): review harbor fleet authenticity`.

## D. Director Decision

Exactly four active sailing assets were regenerated; small workboat and dinghy were retained; new vessel count is zero.

## E. Human Art Direction

All active moored sailing vessels use visibly furled/stowed canvas, tied to readable yards, with exposed deck, mast, hull, and rigging interest instead of deployed sails.

## F. Active Fleet Before

The previous active Hero, brig, medium vessel, and cutter were deployed-sail v01 exports. Their paths remain as non-active historical evidence only.

## G. Hero Ship Regeneration

Hero D v02 is a three-mast Age-of-Sail merchant/exploration tall ship with a substantial wooden hull, raised stern, three mast/yard groups, rigging, and tied canvas bundles.

## H. Secondary Brig Regeneration

The v02 two-mast commercial brig is furled and deliberately free of text, national marks, or directional insignia so the existing horizontal mirror reuse remains valid.

## I. Medium Sailing Vessel Regeneration

The v02 compact two-mast merchant vessel is furled, deck-readable, and 16,202 bytes against the fixed 38,912-byte ceiling.

## J. Harbor Cutter Regeneration

The v02 cutter is a compact single-mast coastal trader with one furled sail, lighter rigging, and no military language.

## K. Small Craft Preservation

Small workboat and dinghy are unchanged.

## L. Furled-sail Treatment

No sail pixels were merely erased: all four sprites were regenerated with tied canvas bundles, yards, mast structure, and rigging.

## M. Age-of-Sail Treatment

The four assets use merchant/exploration wood hulls, deck detail, masts, spars, and neutral markings; there are no modern or national-naval cues.

## N. 15° Grammar

All regeneration prompts used the locked hybrid orthographic 2.5D, 15° elevation, 0° yaw grammar with hull-side dominance and a secondary deck plane.

## O. Fleet Scale Hierarchy

Hero remains `357×247`; medium is `160×113`; brig is `128×88`; cutter is `93×78`; preserved workboat is `79×56`; dinghy is `68×29`. Hero > medium > brig/cutter > utility craft remains clear.

## P. Berthing Preservation

`BERTHING_SLOTS`, `berthSlotId`, assignments, coordinates, headings, and layout data are unchanged.

## Q. Gangplank / Rope Compatibility

The existing gangplank-to-workboat and rope validation remain unchanged and pass; regenerated vessels do not alter their relationships.

## R. Alpha-bound / Overlap Revalidation

Each v02 alpha bound is exact 4px padding. The existing local harbor validation and broad sweep pass with no unintended material overlap.

## S. Asset Hygiene

All v02 files are RGBA, 1× runtime exports, `alpha > 16` padded, max alpha 255, and contain zero non-black RGB pixels where alpha is zero.

## T. Asset Weight Results

| Vessel | Old Sail State | New Sail State | Old Visible W×H | New Visible W×H | Old Bytes | New Bytes | Action |
| --- | --- | --- | --- | --- | ---: | ---: | --- |
| Hero D | deployed | furled/stowed | 357×247 | 357×247 | 142,840 | 91,556 | v02 replace |
| Brig | deployed | furled/stowed | 128×113 | 128×88 | 23,837 | 10,310 | v02 replace |
| Medium | deployed | furled/stowed | 160×113 | 160×113 | 31,654 | 16,202 | v02 replace |
| Cutter | deployed | furled/stowed | 93×92 | 93×78 | 13,771 | 6,441 | v02 replace |

## U. Runtime Preload

Four active fleet textures changed from 212,102 to 124,509 bytes (−87,593). Canonical production preload changes from 691,006 to 603,413 bytes; no source-resolution master is preloaded.

## V. QA

`npm run typecheck`, `npm test`, and `npm run build` pass; the suite is 31/31. PNG alpha/hidden-RGB/padding/byte audits pass, and the Medium remains below 38 KB.

## W. Human Review Targets

Review that these read as moored, furled Age-of-Sail ships rather than actively sailing vessels: Hero; brig mirror pair; medium; cutter; fleet/dock relationship.

## X. Files Changed

Four v02 runtime PNGs, manifest metadata, fleet audit/test, build output, director record, status/handoff, and this report.

## Y. Final Gate

`READY_FOR_FLEET_AUTHENTICITY_INDEPENDENT_REVIEW`
