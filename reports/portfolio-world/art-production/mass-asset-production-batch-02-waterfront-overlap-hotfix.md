# Batch 02 Waterfront Overlap Hotfix

## A. Gate
Independent review `fb1d505` returned `RETURN_TO_CODEX`: Blocker 0, Major 1.

## B. Work Context
HOME_WINDOWS; branch `feature/portfolio-world-sprint-02`; expected machine context confirmed; clean worktree.

## C. Starting Commit
`fb1d505 docs(portfolio-world): review harbor support streetscape batch`.

## D. Independent Review Major Finding
Four Batch 02 alpha-visible props covered accepted waterfront terrace/bench/flag composition. No art, size, anchor, depth, collision, IA, route, primary building, ship, terrace, bench, or flag was changed.

## E. Reproduced Overlaps / F. Coordinate Changes
| Prop | Before X/Y | After X/Y | Protected object | Overlap before | Overlap after |
| --- | --- | --- | --- | --- | --- |
| harbor-tree-02 | 720/952 | 800/896 | viewing terrace / bench | yes | no |
| harbor-shrub-planter | 648/1000 | 640/892 | viewing terrace / bench | yes | no |
| harbor-safety-rail | 704/1012 | 824/912 | viewing terrace / bench | yes | no |
| harbor-service-marker | 1200/980 | 1212/980 | exhibition flag east | yes | no |

## G. Protected Existing Composition / H. Layout-naturalization Preservation
The accepted terrace, bench, and flag coordinates are byte-unchanged. The four intentionally uneven nudges preserve the western work-yard/waterfront character without forming a new regular row.

## I. Regression Validator / J. Tests Added
`layoutValidation.mjs` now maps explicit alpha-visible display bounds (including origin anchors) for the four affected props and AABB-checks them against the accepted terrace, bench, and east flag. `spatial-layout.test.mjs` injects the pre-hotfix coordinates and proves the validator rejects them.

## K. Runtime Visual Re-check
Bounds reconstruction used the runtime `setDisplaySize` and `setOrigin` rules plus alpha>16 pixel bounds. Each new visible rectangle clears the relevant unchanged protected visual rectangle; no water, route, dock, or nearby protected-object overlap was introduced.

## L. Preload Baseline Reconciliation
Canonical production preload measurement is the sum of the normal-production `BootScene` asset list using the on-disk bytes: pre-Batch-02 `579,941`, post-Batch-02 `659,767` bytes. The historical `744,949` figure is absent from repository reports and predates the door-canonicalization export reductions; it likely included historical/non-preloaded or duplicate candidates. It is not used as a runtime baseline.

## M. QA
`npm ci`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass; test count is 26.

## N. Files Changed
`worldLayoutData.json`, `layoutValidation.mjs`, `spatial-layout.test.mjs`, rebuilt `world/`, this report, status, and handoff.

## O. Deferred Minor Findings
Keep independent-review BS-01, BS-02, BS-04, and BS-05 deferred; no Batch 03 work began.

## P. Final Gate
`READY_FOR_BATCH_02_SHORT_RECHECK`
