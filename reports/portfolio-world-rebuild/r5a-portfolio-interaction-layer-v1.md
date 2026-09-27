# Portfolio World — R5A Portfolio Interaction Layer v1

Date: 2026-09-27

## Scope

The locked Golden Master and R4.2 playable-slice layers remain unchanged. R5A adds only visitor-facing links from grounded, already walkable locations to real existing MyPage content.

| World location | Hotspot | Actual MyPage destination |
| --- | --- | --- |
| Harbor Square plaza | Portfolio introduction | `../#about` |
| Exhibition Hall stair landing | AI·AX concept gallery | `../gallery.html` |
| Hero Quay | Career | `../career.html` |

Teaching and making pages are deliberately not assigned a new landmark in this v1 pass: the present Golden Master has no approved physical counterpart for them.

## Visitor and QA behavior

At a hotspot, **E**, a short tap, or a click opens a compact panel with Korean title, explanatory copy, a real destination action, pointer close, and Escape close. The panel does not attempt to reproduce an entire destination page. `?pwDebug=1` is the only route/label overlay mechanism; normal visitor captures contain no permanent QA guide.

## Validation

- `npm run typecheck`
- `npm run build`
- `npm run qa:runtime -- --mode build --set r5a`
- `npm run qa:runtime -- --mode dev --set r5a1`

Both modes passed the fixed 1280 × 720 harness: normal-mode state, all three destinations and reachability, keyboard and pointer activation, route/collision assertions, and browser/console/network error checks. Built normal evidence: `evidence/r5a/` (9 PNGs). R5A is ready for independent product visual review, not a self-awarded visual approval.
