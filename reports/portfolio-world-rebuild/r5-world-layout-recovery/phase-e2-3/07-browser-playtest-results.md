# Browser playtest results

| Check | Result | Evidence |
|---|---|---|
| Hall stairs/front-back depth | PASS for extracted Hall alpha | `10-hall-stair-occlusion.png`, route frame |
| Workshop foreground | PASS | `11-workshop-occlusion.png` |
| Archive approach | PASS for extracted alpha | `12-archive-occlusion.png` |
| Hero dock/gangway | PASS for extracted alpha | `13-hero-dock-occlusion.png` |
| Shore stone wall exact mask | ART_OCCLUSION_REQUIRED | no matching approved alpha asset |
| Workshop panel / Esc | PASS | interactive Chrome check; `14-...png` |
| New tab / retained world | PASS | Chrome opened `making.html`; world retained `245,440` |
| Local approved links | PASS | four local HTTP 200 responses |
| GitHub Pages approved links | PASS | four deployed HTTP 200 responses |
| Mobile panel | PASS in browser emulation | `16-mobile-content-panel.png` |

Existing C.2 route/collision data was not edited. Hall/Archive/Hero route and manual override retain the prior E2.2 test coverage; content panel did not auto-open during routing.
