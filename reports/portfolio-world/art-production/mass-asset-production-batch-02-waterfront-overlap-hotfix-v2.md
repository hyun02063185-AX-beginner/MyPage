# Batch 02 Waterfront Overlap Hotfix v2

## A. Gate
`RETURN_TO_CODEX` at `a740bb0`; this coordinate-only correction prepares a final short independent re-check.
## B. Work Context
HOME_WINDOWS, expected feature branch and machine context, clean start.
## C. Starting Commit
`a740bb0 docs(portfolio-world): recheck batch 02 waterfront overlap hotfix`.
## D. Short Re-check Major Finding / E. Reproduced New Overlaps
v1 left rail↔tree, rail↔display-board, tree↔display-board, and planter↔notice-board rendered-alpha overlap.
## F. Root Cause
v1 checked hand-picked protected pairs only, rather than the local static waterfront scene.
## G. Coordinate Changes
| Prop | v1 X/Y | v2 X/Y | Conflicts removed | Original protected conflicts still clear? |
| --- | --- | --- | --- | --- |
| harbor-tree-02 | 800/896 | 744/880 | rail, display-board | yes |
| harbor-shrub-planter | 640/892 | 672/892 | notice-board | yes |
| harbor-safety-rail | 824/912 | 824/840 | tree, display-board | yes |
| harbor-service-marker | 1212/980 | 1212/980 | unchanged; flag clear | yes |
## H. Protected Composition
Terrace, viewing bench, east flag, display board, and notice board are unchanged.
## I. Validator v2 Design / J. Allowed-overlap Policy
`WATERFRONT_STATIC_VISUAL_ITEMS` is a deliberately bounded scene set. It compares rendered-alpha bounds for Batch 02 sprites and real visual boxes for accepted programmatic anchors pairwise. Every selected pair must remain separate; no intentional overlap is declared.
## K. Generation-1 Regression Proof / L. Generation-2 Regression Proof
Individual pre-v1 coordinates for all four original props fail. Individual v1 tree, planter, and rail coordinates fail against the broadened local set. Final v2 layout passes.
## M. Broad Local Overlap Sweep
All twelve Batch 02 props were reconstructed with runtime display/origin geometry against the nearby waterfront/exhibition/dock neighborhood; no new material local overlap remains. The pre-existing rope/notice 18×3.4 alpha-edge touch remains outside this protected v2 scene set and is a deferred prior minor, not introduced by either hotfix.
## N. Runtime / Geometry Re-check
Rendered-geometry reconstruction uses the exact `WorldScene` image position, display-size, and origin formula. Terrace, bench, flag, display board, notice board, tree, planter, rail, and marker remain readable, irregularly arranged, and unobstructed.
## O. Preload Preservation
Unchanged at canonical `BootScene` production preload total: **659,767 bytes**.
## P. QA
`npm ci`, typecheck, test, build, and diff check pass; 27 tests pass.
## Q. Files Changed
Layout coordinates, local visual validator, spatial regression tests, rebuilt `world/`, status, handoff, and this report.
## R. Deferred Minors
BS-01, BS-02, BS-04, BS-05, and the pre-existing rope/notice edge-touch remain deferred. Batch 03 is not started.
## S. Final Gate
`READY_FOR_BATCH_02_FINAL_SHORT_RECHECK`
