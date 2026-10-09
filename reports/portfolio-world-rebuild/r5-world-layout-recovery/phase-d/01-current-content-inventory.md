# R5 Phase D — Current Content Inventory

Status: verified files and routing facts; no R5 route implementation.

| Existing page | Verified content | Current connection fact |
|---|---|---|
| `career.html` | 2004–2022 career narrative: maker, protector, operator; product/operations/leadership outcomes | Existing static page; GitHub Pages URL returned HTTP 200. |
| `teaching.html` | AX perspective, public samples, formats, curriculum, exercises, credentials, teaching history, inquiry CTA | Existing static page; its inquiry CTA goes to `index.html#contact`; GitHub Pages URL returned HTTP 200. |
| `making.html` | Human/AI collaboration method, transition-engine case, quality checks, public work links | Existing static page; GitHub Pages URL returned HTTP 200. |
| `gallery.html` | Grouped, illustrated AI/AX/IT concept cases and modal detail | Existing static page; GitHub Pages URL returned HTTP 200. |

## Existing world behavior, separated by runtime

`WorldScene.ts` plus `destinationNavigation.mjs` currently maps four legacy forecourts to `../career.html`, `../teaching.html`, `../making.html`, and `../gallery.html`. It requires explicit E/Enter or a pointer click; proximity alone does not navigate.

`CanonicalRuntimeR4Scene.ts` is different: E emits `canonical-interaction` and does **not** call browser navigation. R5 has no runtime implementation in this phase.

## URL facts

- Local Vite world URL: `http://localhost:5173/`; `../career.html` resolves to `/career.html`.
- GitHub Pages world URL: `https://hyun02063185-ax-beginner.github.io/MyPage/world/`; `../career.html` resolves within `/MyPage/career.html` (the same applies to the other three pages).
- Browser Back is the only current return to the world. The four content pages do not currently contain a direct `world/` link; an explicit return link is a later implementation decision.
