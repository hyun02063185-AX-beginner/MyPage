# Gameplay Regression Review

| ID | result | evidence / note |
|---|---|---|
| T01 | PASS | current browser overview showed harbor plus four markers |
| T02–T03 | PASS | E2.4.2 normal assets and 154 automated tests validate the 28×56/28×16 contract; Human accepted expression |
| T04 | FAIL | current browser Workshop→Hall marker route ended `Route blocked — no unsafe shortcut used`; player stopped at 160,358 |
| T05 | PASS (code/test) | keyboard cancels active auto path with `Manual control`; no separate live timing capture |
| T06–T09 | PARTIAL | mapping/panel code and tests cover all four; Hall live panel works, but deployed target routing fails as documented |
| T10 | PASS | live Hall panel close retained 175,190 and returned to exploration |
| T11 | PASS (automated) | feet-body and swept A* checks reject water/hull/cliff; live full-route recheck remains needed |
| T12 | PASS | four accessible DOM marker controls visible in current overview |
| T13 | PASS (code/test) | exactly four active POIs; reserve stays visual-only |
| T14 | PASS | current `?canonical=4&overview=1` loaded one R4 canvas |

Automated result: `npm run typecheck` PASS; `npm run build` PASS (with a 1.49 MB minified-chunk warning); `npm test` PASS, 154/154. Browser QA was via local Vite on 2026-10-13: R5 overview, Hall arrival/panel/close and R4 entry checked. Android hardware, production Pages, full four-POI live route traversal, and full mouse/touch matrix are NOT_TESTED.

R4 source was not modified. R5 formal Runtime was not implemented.

