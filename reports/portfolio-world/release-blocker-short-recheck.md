# Portfolio World — Release Blocker Short Recheck

Date: 2026-09-22

## A. Gate

```text
READY_FOR_RELEASE_BLOCKER_SHORT_RECHECK (input) → see Final Gate below
```

## B. Reviewed Commits

- Branch: `feature/portfolio-world-sprint-02`
- Runtime repair: `74e4353` (fix(portfolio-world): wire destination navigation)
- Docs: `97383e2` (docs(portfolio-world): record release blocker repair) — current `HEAD`
- Worktree at start and end: clean

## C. RR-01 Runtime Check

Verified against a GitHub-Pages-shaped local server (static file server rooted one level above `MyPage/`, so `/MyPage/...` resolves exactly as it would on Pages) using a headless-Chromium driver (Playwright), not by inspecting the `href` string alone.

- Navigated to `/MyPage/`, located the root nav link with text "Portfolio World" (`href="world/"`), and **clicked it**.
- Browser navigated to `/MyPage/world/`; the Phaser canvas rendered a `1024×576` World.
- 0 console errors/warnings during load.

**RR-01 = CLOSED.**

## D. RR-02 Four-destination Walk-through

Each destination was reached by holding real movement keys (ArrowUp/Left/Right/Down) from the actual player spawn, in the running production build, until the contextual prompt appeared — not by teleporting or reading source. The page was reloaded to reset to spawn between destinations.

| Destination | Walk path | Prompt observed | Activation | Result |
| --- | --- | --- | --- | --- |
| Guild Hall | spawn → align north ~1.1s → west until prompt | "Guild Hall: press E or Enter to open" | Enter (held) | → `/MyPage/career.html` |
| Academy | spawn → north until prompt | "Academy: press E or Enter to open" | E (held) | → `/MyPage/teaching.html` |
| Workshop | spawn → align north ~1.1s → east until prompt | "Workshop: press E or Enter to open" | Click (in-forecourt) | → `/MyPage/making.html` |
| Exhibition Hall | spawn → south until prompt | "Exhibition Hall: press E or Enter to open" | E (held) | → `/MyPage/gallery.html` |

All four independently walked-to forecourts produced the correct prompt and the correct canonical destination on activation.

**RR-02 = CLOSED.**

### Methodology note (driver pitfall, not a product defect)

The first automation pass used an instantaneous synthetic key press (`keyboard.press`) and a naive "click canvas center" assumption, and **all four activations appeared to fail**. Root-caused before drawing any conclusion:

1. **Instant press vs. Phaser's key state**: Phaser's `Key.onUp()` clears the same `_justDown` flag that `JustDown()` reads. An instantaneous down+up pair that lands inside a single input-processing frame sets and clears that flag before the scene ever reads it. A human cannot physically press and release a key inside one ~16 ms frame, so this never occurs in real play. Re-tested with a realistic held press (~120 ms) — E and Enter both activated correctly on the first try.
2. **Click targeting**: the Workshop forecourt sits near the World's right edge, where the follow-camera clamps to the world bound instead of centering on the player. Clicking canvas-center therefore missed the forecourt. Clicking the camera-clamp-aware world-to-screen projection of the forecourt center hit correctly and navigated.

Both were verified with instrumented diagnostic builds (temporary `console.log`s in a scratch copy outside the repo, never committed) confirming genuine native `keydown`/`keyup` DOM events reaching the game and a real `activatePointerDestination` pointer read, before concluding the runtime itself is correct. The tracked repository was not modified for this diagnosis (`git status` clean throughout; see Section J).

## E. Interaction Methods

- **E** — exercised at Academy and Exhibition Hall. Both activated.
- **Enter** — exercised at Guild Hall. Activated.
- **Click** — exercised at Workshop (pointer inside the active forecourt rect). Activated.

All three supported activation paths were exercised at least once against the shared interaction model.

## F. Deliberate-interaction Check

At Academy, after the prompt appeared, the player remained stationary inside the forecourt for 900 ms with no key pressed — the URL did not change and the prompt remained visible (proximity alone did not navigate). Only the subsequent E press triggered navigation. No destination triggers on building collision or forecourt entry alone; this matches the canonical contract in `destinationNavigation.mjs` and was confirmed live, not just read from source.

## G. Pages-safe Routing

| Path | Result |
| --- | --- |
| `/MyPage/career.html` | HTTP 200 |
| `/MyPage/teaching.html` | HTTP 200 |
| `/MyPage/making.html` | HTTP 200 |
| `/MyPage/gallery.html` | HTTP 200 |
| `/career.html` (root-absolute, no project prefix) | HTTP 404 |
| `/teaching.html`, `/making.html`, `/gallery.html` (root-absolute) | HTTP 404 |

All four live navigations in Section D landed on the `/MyPage/`-prefixed URL, confirming relative (`new URL(targetPath, currentUrl)`) resolution against the deployed `/MyPage/world/` base, not an accidental root-relative path. Screenshots of the destination pages show real rendered portfolio content (e.g., `teaching.html` rendered the actual 강사/Teaching page).

## H. World Exit

From `/MyPage/world/`, clicked the existing `../` exit link (`포트폴리오로 돌아가기`). Browser navigated back to `/MyPage/`, root nav (including the `Portfolio World` link) rendered normally. User is not trapped.

**WORLD_EXIT = PASS.**

## I. Console / Runtime

0 console errors or page errors captured across the entire session: root load, World load, all four walk+activation sequences, and the exit — including during the initial diagnostic runs that first appeared to fail.

## J. QA

Run from `portfolio-world/`:

- `npm run typecheck` — PASS
- `npm test` (typecheck + build + `node --test`) — PASS, **35/35**
- `npm run build` — PASS (`world/` output regenerated byte-identical to the committed tree)
- `git diff --check` — PASS (only benign LF→CRLF line-ending notices on Windows, no conflict markers/whitespace errors)
- `git status --short` — clean before and after this recheck

Preload independently reconstructed from live network capture on first World load: **31 image assets / 561,180 bytes** — matches the repair report exactly; navigation repair did not change image preload.

## K. Blocker Closure Matrix

| ID | Original problem | Independent runtime result | Status |
| --- | --- | --- | --- |
| RR-01 | Root portfolio had no World entry | Clicked the root "Portfolio World" link in a live browser; navigated to `/MyPage/world/`; World rendered; 0 console errors | CLOSED |
| RR-02 | World had no destination navigation | Manually walked to all four forecourts using real held movement keys; each showed its correct prompt; each of E, Enter, and click deliberately activated navigation to its correct `/MyPage/*.html` target; proximity alone did not navigate | CLOSED |

## L. Remaining Minor

- Vite's known >500 kB JS chunk warning remains **Minor / deferred** (unrelated to RR-01/RR-02, not touched).

No new Minor, Major, or Blocker findings were produced by this recheck. Blocker = 0, Major = 0.

## Final Gate

```text
READY_FOR_RELEASE_CLOSEOUT
```
