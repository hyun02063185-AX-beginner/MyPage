# Portfolio World — Release Blocker Navigation Repair

Date: 2026-09-22

## A. Gate

```text
READY_FOR_RELEASE_BLOCKER_SHORT_RECHECK
```

## B. Work Context

- Branch: `feature/portfolio-world-sprint-02`
- Starting audit commit: `f415e1d`
- Worktree at start: clean
- Scope: only the two Blockers from `release-readiness-audit.md`; no Batch 04 visual, layout, fleet, asset, or polish work.

## C. Audit Blockers

| ID | Current failure | Expected behavior | Affected code | Minimal repair |
| --- | --- | --- | --- | --- |
| RR-01 | The root portfolio exposed no optional World entry. | A user can intentionally enter `/MyPage/world/` while normal portfolio navigation remains available. | Root `index.html` | Add one Pages-relative `world/` nav link. |
| RR-02 | World destinations had no interaction or navigation handler. | A player in a destination forecourt can deliberately open the matching portfolio page. | `WorldScene.ts`; new destination contract | Source-driven forecourt mapping plus E/Enter/click activation. |

## D. Root Causes

- RR-01: the root primary-navigation list omitted the required World link.
- RR-02: layout already contained destination buildings and protected forecourts, but no runtime component connected them to the canonical portfolio routes.

## E. Destination Interaction Contract

`src/world/destinationNavigation.mjs` is the single canonical contract:

| Destination | Interaction region | Relative target |
| --- | --- | --- |
| Guild Hall | `forecourt-career` | `../career.html` |
| Academy | `forecourt-lecture` | `../teaching.html` |
| Workshop | `forecourt-ai-lab` | `../making.html` |
| Exhibition Hall | `forecourt-gallery` | `../gallery.html` |

An interaction becomes available only while the player is inside its existing forecourt. It never triggers merely from building collision. The player deliberately presses **E** or **Enter**, or clicks inside the available forecourt. The contextual prompt is visible in the World and mirrored to an `aria-live="polite"` status region.

## F. URL / BASE_URL Handling

Targets are stored once as relative paths and resolved with `new URL(targetPath, window.location.href)`. From `/MyPage/world/`, each resolves to `/MyPage/<target>.html`; no localhost or site-root path is hardcoded. This preserves both Vite’s `/MyPage/world/` production base and GitHub Pages project hosting.

## G. Implementation

- Added the `Portfolio World` root navigation link (`world/`).
- Added canonical destination metadata and forecourt containment/URL-resolution helpers.
- Wired `WorldScene` to show and announce a contextual prompt, handle E/Enter, and support deliberate in-forecourt pointer activation.
- Preserved the existing shell exit (`../`), layout, collision, fleet, and asset preload.

## H. Regression Tests

`tests/destination-navigation.test.mjs` adds three executable checks:

1. all four canonical destination contracts resolve from a deployed `/MyPage/world/` URL to the expected Pages-safe page;
2. a destination is unavailable outside its forecourt, including at a building center, and activation is required before a URL is returned;
3. runtime source uses canonical forecourt lookup, E/Enter and pointer activation, the live-status shell, and the root entry link.

The complete suite passes **35/35**.

## I. Production Browser Verification

- Root portfolio, World, all four destination HTML endpoints, and generated JS/CSS returned HTTP 200 from a GitHub-Pages-shaped local server.
- The rendered production World loaded a `1024 × 576` canvas and reported **0 console errors/warnings**.
- The root `Portfolio World` link was exposed in the browser accessibility tree and navigated to `/MyPage/world/`.
- The browser automation available here emits short key presses, not held Phaser movement input; therefore the independent short recheck must perform the final hands-on walk-to-forecourt activation for all four destinations. The built runtime contract and executable forecourt/activation/URL regression coverage prove the four expected target paths without relying on endpoint existence alone.

| Destination runtime contract | Resolved production path | Endpoint |
| --- | --- | --- |
| Guild Hall | `/MyPage/career.html` | HTTP 200 |
| Academy | `/MyPage/teaching.html` | HTTP 200 |
| Workshop | `/MyPage/making.html` | HTTP 200 |
| Exhibition Hall | `/MyPage/gallery.html` | HTTP 200 |

## J. Exit Regression

PASS. The existing `../` World shell exit was clicked in the production browser and returned to `/MyPage/`. It was not modified.

## K. Accessibility / Fallback Check

- E/Enter offers keyboard activation; pointer activation is additive, not required.
- The nearby contextual instruction is announced through the shell status region.
- Existing exit link, focus style, ARIA game region, and coarse-pointer keyboard notice remain intact.
- No mobile gameplay was added.

## L. Preload

Reconstructed normal BootScene preload: **31 assets / 561,180 bytes**. No image asset was added or changed.

## M. QA

- `npm ci` — PASS; 0 vulnerabilities. A stale project Vite preview initially held the Windows native binding; it was stopped before the successful install.
- `npm run typecheck` — PASS.
- `npm test` — PASS, **35/35**.
- `npm run build` — PASS.
- `git diff --check` — PASS.
- Production route/asset HTTP checks — PASS.
- Production World console errors/warnings — 0.

## N. Deferred Minor

The known Vite >500-kB chunk warning remains **Minor / deferred**. It was not touched because it is unrelated to the two release Blockers.

## O. Files Changed

- `index.html`
- `portfolio-world/index.html`
- `portfolio-world/src/world.css`
- `portfolio-world/src/world/destinationNavigation.mjs`
- `portfolio-world/src/scenes/WorldScene.ts`
- `portfolio-world/tests/destination-navigation.test.mjs`
- `world/index.html` and generated bundle assets
- `docs/portfolio-world/91_STATUS.md`
- `docs/portfolio-world/92_HANDOFF.md`
- this report

## P. Blocker Closure Matrix

| Blocker | Original evidence | Fix | Regression test | Runtime verification | Status |
| --- | --- | --- | --- | --- | --- |
| RR-01 | Root navigation had no World link. | Added root `world/` entry. | Root link assertion in destination-navigation suite. | Browser accessibility tree exposed it; browser navigation loaded `/MyPage/world/`. | CLOSED |
| RR-02 | No interaction/mapping/handler existed. | Canonical forecourt metadata, E/Enter/click activation, Pages-safe URL resolver, status prompt. | Four mapping, outside-zone, activation, runtime-wire assertions. | Built World loads without console errors; all resolved production target endpoints return 200. Hands-on four-destination activation is the required independent short recheck. | CLOSED — PENDING SHORT RECHECK |

## Q. Final Gate

```text
READY_FOR_RELEASE_BLOCKER_SHORT_RECHECK
```
