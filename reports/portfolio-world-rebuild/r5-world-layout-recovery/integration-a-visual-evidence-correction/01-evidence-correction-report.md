# R5 Integration A Visual Evidence Correction

Task: `R5-INTEGRATION-A-VISUAL-EVIDENCE-CORRECTION`  
Baseline before correction: `037f93ed83831b67bbf22c833eed4814a604ea49`

## Correction finding

The prior Integration A report set incorrectly reused Phase E2 Pilot/review images for `10-r5-runtime-first-render.png`, `11-r5-pilot-vs-runtime-comparison.png`, and `13-production-preview-r5.png`. They were copied during report assembly rather than exported from the new `R5WorldScene` browser session. The filenames therefore overstated their provenance. They remain intact in `integration-a/` as historical artifacts and are not overwritten.

This correction uses CDP `Page.captureScreenshot` against the currently loaded local Chrome tabs after each page reached the visible runtime state. Each capture is 1236×1113 PNG and has the SHA-256 listed in `02`.

## Actual browser evidence

| ID | URL and Scene | Canvas | asset/console result | screenshot |
|---|---|---:|---|---|
| DEV_R5 | `http://127.0.0.1:4173/?r5=1` — `R5WorldScene` | 1 | Candidate B, R5 player and foreground visible; QA notice present; asset errors 0; console errors/warnings 0 | [10-dev-r5-runtime.png](10-dev-r5-runtime.png) |
| PREVIEW_R5 | `http://127.0.0.1:4175/MyPage/world/?r5=1` — `R5WorldScene` | 1 | fresh production preview; BASE_URL asset bundle loaded; QA notice present; asset errors 0; console errors/warnings 0 | [11-production-preview-r5-runtime.png](11-production-preview-r5-runtime.png) |
| R4 | `http://127.0.0.1:4173/?canonical=4&overview=1` — `CanonicalRuntimeR4Scene` | 1 | R4 visible; R5 QA notice absent; asset errors 0; console errors/warnings 0 | [12-canonical-r4-regression.png](12-canonical-r4-regression.png) |
| PILOT | `http://127.0.0.1:4173/r5-hybrid-pilot.html` — `R5HybridPilotScene` | 1 | four DOM markers and content panel present; asset errors 0; console errors/warnings 0 | [13-hybrid-pilot-regression.png](13-hybrid-pilot-regression.png) |

## Pilot versus Runtime comparison

| Hybrid Pilot | Integration A Runtime |
|---|---|
| URL: `http://127.0.0.1:4173/r5-hybrid-pilot.html` | URL: `http://127.0.0.1:4173/?r5=1` |
| Scene: `R5HybridPilotScene`; separate Game; A*, markers, panel and QA controls | Scene: `R5WorldScene`; shared Portfolio World Game; static asset/camera preview only |
| [actual Pilot capture](13-hybrid-pilot-regression.png) | [actual Runtime capture](10-dev-r5-runtime.png) |

The production evidence is deliberately a fresh preview process on port 4175. The earlier port-4174 process was excluded because it served a stale blank page after the build directory was replaced.

