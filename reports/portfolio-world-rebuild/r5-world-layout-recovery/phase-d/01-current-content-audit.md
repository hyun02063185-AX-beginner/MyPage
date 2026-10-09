# R5 Phase D — Current Content Audit

## Verified source pages

| Page | Actual purpose | Core material | Visitor expectation |
|---|---|---|---|
| `career.html` | Professional narrative | 2004–2022 maker, protector, operator roles; leadership and operations | Assess professional depth and journey |
| `teaching.html` | Teaching offer | AX view, samples, curriculum, credentials, history, `index.html#contact` CTA | Assess fit and make an inquiry |
| `making.html` | AI-enabled making method | Human/AI roles, transition case, validation, public work links | Review execution method and outcomes |
| `gallery.html` | AI/AX reference library | Grouped, plain-language illustrated concepts and modal cases | Browse supporting concepts |

The four pages share the existing site navigation and each links back to `index.html`; none contains a direct `world/` return link. Browser Back is the only present World return behavior.

## Current navigation distinction

`destinationNavigation.mjs` plus `WorldScene.ts` define forecourt activation using E/Enter or pointer input and navigate to the existing HTML target. `CanonicalRuntimeR4Scene.ts` instead emits `canonical-interaction`; it contains no HTML navigation. R5 has not implemented either behavior.

Status: verified content inventory; no existing HTML was altered.
