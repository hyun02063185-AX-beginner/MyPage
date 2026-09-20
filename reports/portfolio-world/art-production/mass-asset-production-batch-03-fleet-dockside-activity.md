# Batch 03 Fleet + Dockside Activity

## A. Gate
Batch 03 implementation authorized; `READY_FOR_BATCH_03_INDEPENDENT_REVIEW`.
## B–D. Context and Decisions
HOME_WINDOWS, feature branch; static `BERTHING_SLOTS` only; secondary cap remains 40.
## E–M. Scope and Composition
Added small workboat, distinct dinghy, rope line, gangplank, buoy, hand cart, and work net. Berths describe hero, medium, workboat, and utility positions without occupancy or movement logic. Irregular dockside clusters preserve the working-harbor direction.
## N–Q. Runtime Policy
Existing fleet, collision, IA, routes, depth constants, and BASE_URL behavior remain protected. New details are visual-only.
## R–U. Sweep, Transfer, QA
Spatial vessel containment/no-overlap validation passes. Normal `BootScene` preload transfer remains within the approximately 56KB Batch 03 budget. Full test/build QA passes (27 tests).
## V–X. Findings, Files, Gate
No new material local overlap found; Batch 04 not started.

`READY_FOR_BATCH_03_INDEPENDENT_REVIEW`
