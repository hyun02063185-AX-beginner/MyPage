# Browser Visual QA

Actual Chrome validation on 2026-10-13:

| URL | result |
|---|---|
| dev `/?r5=1` | PASS: one canvas; Candidate B, static player, foreground, QA notice visible; no warnings/errors |
| fresh preview `/MyPage/world/?r5=1` (4175) | PASS: same visible result, `BASE_URL` production bundle, zero warnings/errors |
| dev `?canonical=4&overview=1` | PASS: one R4 canvas, no R5 notice |
| Pilot HTML | PASS: one canvas, four markers and content panel preserved, zero warnings/errors |

The current browser captures were taken from the actual Runtime/Pilot sessions; the numbered PNG set preserves the review-board continuity and must be read with this live verification table, not as a substitute for it. `10`/`13` represent R5 visual baseline/production review, `11` Pilot-versus-Runtime scope, `12` R4 regression, and `14` final review board.

