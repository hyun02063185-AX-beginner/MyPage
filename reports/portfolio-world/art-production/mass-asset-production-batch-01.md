# Mass Asset Production — Batch 01

## A. Gate

```text
MASS_ASSET_PRODUCTION_GATE = PASS
AUTHORIZED_SCOPE = BATCH_01_ONLY
FULL_WORLD_ROLLOUT = HOLD
FINAL_GATE = READY_FOR_BATCH_01_INDEPENDENT_REVIEW
```

## B. Work Context

Branch: `feature/portfolio-world-sprint-02`; Node `v24.16.0`; npm `11.13.0`; `git pull --ff-only` was up to date. The starting worktree contained the untracked, task-related Director Gate report. It was read, preserved, and is intentionally not staged by this batch.

## C. Starting Commit

`fdebe39 docs(portfolio-world): lock scale bible and asset budgets`

## D. Canonical Standards Used

Hybrid Orthographic 2.5D; camera elevation 15° above horizontal; yaw 0°; 32 px logical unit; practical alpha bound `alpha > 16`; 1× export; practical trim plus 4 runtime px padding; fully transparent RGB zeroing; category anchors; semantic v1.1 depth; collision independent of visual bounds; `BASE_URL` runtime paths; generated-original provenance.

## E. Batch 01 Scope

Exactly one generated, production-ready reference was added for Guild Hall, Academy, Workshop, Harbor Warehouse, Medium Sailing Vessel, Tree/Greenery, Crate, and Harbor Lamp. One designated runtime placement is replaced for each non-building category; the other fleet, trees, crates, lamps, layout, collision, IA, routes, water carve-outs, and Hero D design remain intact.

## F. Guild Hall

`guild-hall-v01`: `assets/world/harbor/buildings/guild-hall-v01.png`; Career destination at its existing footprint. Practical content 330×196 px / 10.31×6.13 LU, functional-base anchor, `WORLD_OBJECT_BODY`, 114,758 bytes versus 135 KB ceiling. Teal-roof civic guildhouse with readable central entrance.

## G. Academy

`academy-v01`: `assets/world/harbor/buildings/academy-v01.png`; Academy footprint unchanged. Practical content 330×190 px / 10.31×5.94 LU, functional-base anchor, `WORLD_OBJECT_BODY`, 116,979 bytes versus 135 KB ceiling. Dry-land scholarly facade with observatory/learning cues and no waterfront scene content.

## H. Workshop

`workshop-v01`: `assets/world/harbor/buildings/workshop-v01.png`; Workshop footprint unchanged. Practical content 330×190 px / 10.31×5.94 LU, functional-base anchor, `WORLD_OBJECT_BODY`, 133,080 bytes versus 135 KB ceiling. Timber-and-copper making studio with visible workshop doors and restrained gear/drafting identity.

## I. Harbor Warehouse

`harbor-warehouse-v01`: `assets/world/harbor/buildings/harbor-warehouse-v01.png`; existing `harbor-warehouse` placement only. Practical content 160×92 px / 5.00×2.88 LU, functional-base anchor, `WORLD_OBJECT_BODY`, 33,118 bytes versus 35 KB ceiling. It remains visibly subordinate to destination buildings.

## J. Medium Sailing Vessel

`medium-sailing-vessel-01-v01`: `assets/world/harbor/ship/medium-sailing-vessel-01-v01.png`; replaces only `harbor-west-cargo-schooner`, leaving the other fleet references untouched. Practical content 160×113 px / 5.00×3.53 LU, hull/waterline anchor, vessel contact ordering, 31,654 bytes versus 38 KB ceiling. Two-mast deck/hull/sail hierarchy stays below Hero D.

## K. Tree / Greenery

`harbor-tree-01-v01`: `assets/world/harbor/greenery/harbor-tree-01-v01.png`; replaces only `academy-tree`. Practical content 54×66 px / 1.69×2.06 LU, ground-contact anchor, `WORLD_OBJECT_BODY`, 8,086 bytes versus 12 KB ceiling.

## L. Crate

`cargo-crate-01-v01`: `assets/world/harbor/props/cargo-crate-01-v01.png`; replaces only `dock-crates-west`. Practical content 46×38 px / 1.44×1.19 LU, ground-contact anchor, `LOW_PROP`, 4,280 bytes versus 6 KB ceiling.

## M. Harbor Lamp

`harbor-lamp-01-v01`: `assets/world/harbor/props/harbor-lamp-01-v01.png`; replaces only `waterfront-viewing-lamp`. Practical content 16×47 px / 0.50×1.47 LU, ground-contact anchor, `LOW_PROP`, 1,845 bytes versus 6 KB ceiling. No night-light behavior was added.

## N. Scale Measurements

| Asset | export canvas | practical visible | logical units | locked range |
| --- | --- | --- | --- | --- |
| Guild Hall | 338×204 | 330×196 | 10.31×6.13 | 320–340×190–205 |
| Academy | 338×198 | 330×190 | 10.31×5.94 | 320–340×190–205 |
| Workshop | 338×198 | 330×190 | 10.31×5.94 | 320–340×190–205 |
| Warehouse | 168×100 | 160×92 | 5.00×2.88 | 152–160×90–96 |
| Vessel | 168×121 | 160×113 | 5.00×3.53 | 128–177×113–129 |
| Tree | 62×74 | 54×66 | 1.69×2.06 | 50–56×64–72 |
| Crate | 54×46 | 46×38 | 1.44×1.19 | 16–48×24–48 |
| Lamp | 24×55 | 16×47 | 0.50×1.47 | 16–48×24–48 |

## O. Asset Weight Results

All eight assets are 1× and within their locked ceilings: Guild 114,758 / 138,240 bytes; Academy 116,979 / 138,240; Workshop 133,080 / 138,240; Warehouse 33,118 / 35,840; Vessel 31,654 / 38,912; Tree 8,086 / 12,288; Crate 4,280 / 6,144; Lamp 1,845 / 6,144. Batch total: **443,800 bytes**.

## P. Export / Padding / Hidden RGB

Each source was inspected at high resolution, practical-alpha measured, cropped to its `alpha > 16` bounds, resized with Lanczos to its locked 1× target, padded exactly 4 px on all sides, and encoded RGBA with RGB zeroed only where alpha equals zero. Post-export strict and practical bounds both start at `(4,4)`; hidden-RGB dirty pixel count is zero for every Batch 01 file.

## Q. Manifest / Runtime Integration

`WORLD_ASSETS` records runtime path, texture key, provenance, status, source/display dimensions, and anchor notes. `batch01AssetAudit.json` records the maintained approval metadata. `BootScene` preloads only the needed Batch 01 textures through `resolveWorldAssetUrl()` / `import.meta.env.BASE_URL`. `WorldScene` replaces three destination fallbacks and one selected placement per non-building category.

The pre-lock Hero D, Exhibition Hall, brig, and cutter source masters are retained as non-loaded evidence. Their runtime paths now point to content-preserving 1× optimized exports: 142,840, 118,896, 23,837, and 13,771 bytes respectively. This is an export normalization only: their visible content, scale, anchors, and source art were not redesigned.

## R. Depth Classification

Destination buildings and warehouse use `getBuildingDepth` / `getHarborVisualDepth` body ordering. The vessel uses `getVesselDepth` at its hull/waterline contact. Tree stays in the existing `tree` body class. Crate and lamp remain existing low-prop types. No numeric depth literals, bands, or depth policy were added.

## S. Collision / IA Protection

No layout, route, reserved-lot, collision, destination mapping, harbor-basin, water-carveout, or player-control data changed. PNG bounds are not used for physics. Existing spatial, water, and depth tests continue to cover these guarantees.

## T. Whole-world Visual Check

Live Phaser checks used the normal production view plus DEV-only Batch 01 coordinate framing (removed from production bundle): harbor wide; Guild Hall approach; Academy approach with tree; Workshop approach; warehouse/dock with the new vessel; and Exhibition/dock props. The Hero D remains the dominant sail silhouette; destination buildings share the shallow-roof 15° facade grammar; warehouse/vessel remain Tier 2; tree/crate/lamp remain subordinate. Direct human movement beside each prop is reserved for independent/human review; their contact anchors and semantic depth were verified through the integrated renderer and tests.

## U. Runtime Texture Transfer

Normal initial production transfer for the textures actually preloaded by `BootScene` is **743,144 bytes (0.71 MB)**: 299,344 bytes for the optimized existing runtime references plus 443,800 bytes for Batch 01. This is below the locked 1.01–1.52 MB projected complete-world range because Batch 01 is intentionally only a partial rollout. Repository world-asset bytes are 14,810,237 and include retained source-quality and calibration evidence; they are not normal runtime transfer.

## V. QA

Final verification passed: `npm ci` completed with 0 vulnerabilities; `npm run typecheck` passed; `npm test` passed all 21 tests; `npm run build` completed; and `git diff --check` returned clean. The build retains only Vite's existing >500 kB chunk advisory. The new executable asset-audit test validates eight records, path existence, exact bytes, known provenance, `GAME_READY` status, 1× export, padding, optimization flag, and category ceiling.

## W. Known Limitations

Batch 01 does not approve full-world art, fleet replacement, full greenery/prop rollout, night behavior, new collision, random berthing, or a world-layout redesign. The existing depth v1.1 non-blocking minors remain carried forward. The DEV-only framing is QA-only and excluded from production.

## X. Human Decisions Required

- Do the eight references read as one coherent 15° world?
- Are the destination buildings visually balanced with Hero Ship D?
- Is the harbor ready for broader asset rollout after independent review?

## Y. Files Changed

Runtime: Batch 01 PNGs, four optimized pre-lock runtime exports, manifest, BootScene, WorldScene, audit record, and asset-loading/audit tests. Deployment build output is rebuilt under `world/`. Documentation: this report plus canonical status/handoff updates.

## Z. Final Gate

```text
READY_FOR_BATCH_01_INDEPENDENT_REVIEW
```
