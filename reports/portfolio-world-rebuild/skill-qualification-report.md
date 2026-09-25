# Portfolio World Rebuild (Phase R0) — Skill Qualification Report

Date: 2026-09-25
Role: Research only. `feature/portfolio-world-concept-vertical-slice` and `main` were not modified. No skill was installed into this repository. No new branch, no Phaser project, no asset was created.

## A. Rebuild Goals (from canonical docs + the task brief)

Read `00_PROJECT_BRIEF.md`, `01_GAME_CONCEPT.md`, `02_WORLD_IA.md`, `retro-harbor-campus-art-direction-v1.0.md`, and `retro-harbor-campus-visual-grammar-v1.0-lock.md`. Combined with the rebuild brief's own explicit direction, the v2 target is:

- A **walkable portfolio interface**, not an RPG: Career/Teaching/Making/Gallery reached by walking, not a page list (`01_GAME_CONCEPT.md`).
- **Retro Harbor Campus** theme, kept: World = 16-bit-inspired harbor; Portfolio UI = modern/clean (`retro-harbor-campus-art-direction-v1.0.md` §4).
- **Harbor as identity**: substantial water, dock/waterfront, Hero Ship as Tier-1 landmark, fleet hierarchy, warehouse/cargo/harbor-life props, visible negative water space — composition elements, not decoration.
- **Asymmetry preferred over the v1 perfect cardinal cross.** IA (Guild Hall/Academy/Workshop/Exhibition Hall) can stay; physical placement is open for redesign.
- **Mood**: Bright/Warm/Open/Explorable/Professional/Creative/Welcoming, avoiding Dark Pirate Port, Heavy Medieval Fantasy, Overly Cute Chibi, clutter, and generic AI game art.
- **v1 lessons, explicitly not implementation values**: sheltered-harbor water must stay calm/low-energy/broad-ripple, not sharp-crested or open-sea-energetic; plaza stone units must read as surface texture, not compete with benches/player or repeat obviously; "value changed / pixel diff exists / build passed / effect is technically present" is never sufficient proof of good design — the normal gameplay view must actually look right.

This last point is the project's own hard-won lesson from the ART-01 → ART-12 history on this branch (treated here as history, not as a spec to copy): the same "technically-present-but-wrong" failure mode recurred at least three times — a stretched, seamed promenade texture (ART-03/04), a vessel water-occlusion layer that existed in code but covered zero hull pixels (ART-10), and three successive tile-scale corrections for the plaza stone (0.9 → 0.72 → 0.42 across ART-07/09) before a human said the grain was actually right. A rebuild-skill stack that cannot independently notice these classes of defect is not qualified for this project, regardless of how sophisticated its process language is.

## B. Candidate Sources Inspected

| Source | Repo | What it actually is |
| --- | --- | --- |
| A | `github.com/Donchitos/Claude-Code-Game-Studios` (+ Codex forks: `pa4uslf`, `Millionluna`, `daveashworth`) | Full "game dev studio" simulation: 49 agents, 74 skills (slash commands), 12 hooks, 13 rules, 39 templates. Requires its own `design/gdd/`, `design/art/`, `design/registry/`, `project.yaml`, `.claude/docs/*` convention. |
| B | `github.com/gamedev-skills/awesome-gamedev-agent-skills` | 73 portable `SKILL.md` files (Agent Skills open standard) + a router that detects engine/genre and loads only matching skills. Self-contained per skill; no shared studio directory required. |
| C | `github.com/Yakoub-ai/phaser4-gamedev` | Phaser **4**-specific plugin: 5 agents (`phaser-architect`, `phaser-coder`, `phaser-debugger`, `phaser-playtester`, plus asset-advisor content folded into skills) and **26** skills (the README's "4 agents + 6 skills" undercounts the actual repo by a wide margin — verified via the GitHub contents API, not the README). Ships both `.claude-plugin` and `.codex-plugin`. |
| D | `github.com/daymade/claude-code-skills` → `frontend-visual-qa` | One skill among 60+ in a general marketplace repo. Plain Node/Playwright scripts + reference docs; no Claude-specific tool syntax. |

## C. Exact Skills Inspected (actual `SKILL.md` content read, not README marketing)

- A: `art-bible`, `asset-spec`, `vertical-slice`, `team-level`, `playtest-report` (plus the skill/hook directory listing for the remaining 69 skills and 14 hooks).
- B: `create-game-assets`, `level-design` (plus the full 73-skill category listing).
- C: `phaser-playtest`, `phaser-asset-advisor` (plus the full 26-skill and 5-agent listing).
- D: `frontend-visual-qa` (full ~540-line `SKILL.md`, including its evidence-level table and reference-file index).

## D. What Each Skill Actually Does

**`art-bible` (A)** — An interactive, multi-phase *document-authoring* workflow. It reads `design/gdd/game-concept.md`, asks the user to scope 9 sections (Visual Identity, Palette, Lighting, Character, Environment, UI, VFX, Asset Standards, Prohibitions), and delegates each section to a spawned `art-director` sub-agent, writing prose to `design/art/art-bible.md`. It never opens a screenshot. It is a **pre-production** gate: `MASS_ASSET_PRODUCTION = HOLD` until this document exists — which is structurally identical to what this project already did by hand (`retro-harbor-campus-art-direction-v1.0.md`, `visual-grammar-v1.0-lock.md`).

**`asset-spec` (A)** — Per-asset spec + AI-generation-prompt-text generator, reading from an `entity-inventory.md`/`asset-manifest.md` it also helps build. Also text-only; it emits generation *prompts*, never calls an image API or inspects the resulting PNG.

**`vertical-slice` (A)** — Runs a real, isolated (`isolation: worktree`) build to test whether "the full loop is achievable," with a PROCEED/PIVOT/KILL verdict. Genuinely process-sound (this project effectively re-derived the same idea by hand across ART-02→ART-12), but it assumes `design/gdd/`, `docs/architecture/architecture.md`, and `docs/architecture/control-manifest.md` already exist in the studio's own format.

**`team-level` (A)** — Orchestrates up to 6 sub-agents (`level-designer`, `narrative-director`, `world-builder`, `art-director`, `systems-designer`, `qa-tester`) via `TaskCreate`/`TaskUpdate` and a config-resolved `team.size`. Heavyweight even at its own smallest ("individual") setting; requires the hook/config infrastructure to run at all.

**`playtest-report` (A)** — Not a QA tool. It is a **markdown template** that either prints a blank playtest-report skeleton or reformats *human-supplied* notes into that skeleton. It contains no browser automation, no screenshot capture, no rendering of any kind.

**`create-game-assets` (B)** — A 10-step, engine-neutral asset pipeline: inspect existing direction → lock the technical frame → name the visual system → build an asset manifest → **approve one visual target at actual game scale before producing a family** → produce related assets as a family (not one-off prompts) → normalize deterministically with bundled Pillow scripts (`asset_report.py` for alpha/size/color-count checks, `build_preview_sheet.py` for nearest-neighbor contact sheets) → import with engine-native settings → **validate in context at native resolution** → record provenance. Its own "Quality gates" section explicitly lists *"Tiles/backgrounds: required edges tile without seams; repetition is tolerable"* and closes with *"Do not call an asset production-ready from a prompt result alone. Approval requires ... an in-engine or native-scale visual inspection."*

**`level-design` (B)** — Engine-neutral level-design practice: derive player movement metrics first, blockout with primitives, define critical/golden path, pace tension vs. rest, gate with intent, playtest and iterate before dressing with art. Explicitly out of scope for procedural generation (routes to `procedural-gen`) and for the engine's own tile tools (routes to `godot-tilemap`/`unity-tilemap-2d`). Its worked examples are jump-distance gaps, combat-intensity beat timelines, and key/ability gating graphs.

**`phaser-playtest` (C)** — A single Node/Playwright harness (`scripts/playtest.mjs`) that boots the *actual* dev server in headless Chromium and checks: page load, canvas creation, `Phaser.Game` reachable, `isBooted`, active scenes and their display-object counts, non-empty rendering per scene, median/5th-percentile FPS, non-blank canvas via pixel analysis, zero uncaught exceptions, zero console errors, and that every declared asset actually loaded (catching the "200 text/html" masked-404 case). Supports scripted input scenarios with live-state assertions (`game.scene.getScene(...).player.x`, etc.) and `--mode build` to catch base-path/bundling bugs. This is exactly the harness this session hand-built ad hoc (headless Edge + CDP `Runtime`/`Log` domains) for every ART-05/08/10/12 review, but packaged, scriptable, and CI-ready.

**`phaser-asset-advisor` (C)** — Technical guidance only: BootScene vs. PreloaderScene vs. lazy loading, atlas vs. spritesheet vs. individual-image choice, audio format pairing, load-key registries, HTTP/GPU/mobile-memory budget. No visual-composition or material-mood content.

**`frontend-visual-qa` (D)** — A rigorous audit *discipline* with a bundled Playwright DOM sweep as one evidence tier among four (A: real-browser/native-app journey, B: DevTools/E2E with representative data, C: the bundled headless mechanical sweep, D: source/lint/build/static reasoning — explicitly *not sufficient alone*). Core rules: name the artifact/state/viewport contract before judging pixels; never treat an unopened screenshot, a passing build, or DOM presence as visual proof; capture the whole composition before zooming into a defect; crop before/after at the *same* window and *same* scale so a 3px difference doesn't vanish into a shrunk full-page comparison; report findings as Blocker/Major/Moderate/Minor with cropped evidence, never prose alone; a "reference-parity" profile exists specifically for "make ours look like theirs" comparisons, driven by a supplied reference/SSOT.

## E. Strengths

- **A**: A locked, gating visual-identity document *before* asset production is genuinely the right idea — and this project already independently arrived at it (`retro-harbor-campus-art-direction-v1.0.md`). `vertical-slice`'s PROCEED/PIVOT/KILL framing is a clean way to force an early feasibility check. Hooks (`validate-push.sh`, `validate-commit.sh`) show real defensive design (warn on protected-branch pushes) rather than silent automation.
- **B**: Genuinely portable, self-contained, no external directory convention required. `create-game-assets`'s "approve one target before producing a family," native-scale validation, and seam-testing rule map almost line-for-line onto this project's actual promenade-seam and pavement-scale incidents. `level-design`'s metrics-first, blockout-before-dress discipline is sound engineering practice independent of genre.
- **C**: The only candidate whose engine target (Phaser **4**, not 3) matches this project's actual `package.json` dependency exactly. `phaser-playtest` automates a harness this session had to build by hand, and is honest about only proving the game *runs*, not that it *looks right*.
- **D**: The most rigorous anti-false-pass reasoning of any candidate — its evidence-level ladder and "an assertion that stayed green through the whole bug is not a guard" principle would have caught this project's own ART-10 rowboat/dinghy Major (a real code change and a real non-zero pixel diff that still occluded zero hull pixels) faster than the three manual pixel-diff-plus-nearest-neighbor-crop passes this session actually needed.

## F. Weaknesses

- **A**: No step in the entire studio pipeline *opens a rendered screenshot*. `art-bible` and `asset-spec` are text-only; `playtest-report` reformats human notes; `vertical-slice` validates schedule/pipeline feasibility, not visual correctness. A team could complete every gate at `review_mode: full` and still ship the exact three defects listed in §A. Requires wholesale adoption of a directory/config convention (`design/gdd/`, `project.yaml`, `.claude/docs/*`, `yaml-helper.sh`) this project does not use and would have to retrofit around, not into.
- **B**: `level-design`'s entire worked-example vocabulary (jump metrics, combat beats, key/ability gating, sawtooth difficulty) assumes an action/platformer game; a walkable, no-combat, no-death portfolio world uses well under half of it. The repo's own installer bundles the router *plus all 73 skills* — more than this project should install for two disciplines.
- **C**: The README's "4 agents + 6 skills" underclaims the repo by roughly 4×; anyone gating a decision on the README alone would misjudge its scope (this is exactly why the brief required reading actual `SKILL.md` files). `phaser-playtest` and `phaser-asset-advisor` are, by design, blind to composition, mood, material language, and scale-relative-to-props — zero overlap with this project's actual recurring defect class.
- **D**: Built for DOM-rendered web UI. A Phaser canvas is one opaque bitmap to the DOM; the bundled `visual_layout_audit.mjs` sweep's "Level C" evidence (overflow, wrapping, clipping, responsive breakpoints) does not apply inside the canvas at all. Its reference-parity profile needs a supplied mood/reference document to check against — it carries no built-in domain knowledge that a "sheltered harbor" should look calm, or that a stone tile pattern can be "too large."

## G. Security / Operational Concerns

- No candidate performs a hidden network call, silent repo mutation, or destructive git operation by default. `frontend-visual-qa` is explicitly audit-only unless the user names a fix-and-verify scope; A's hooks warn on (not silently allow) protected-branch pushes; B's `create-game-assets` scripts are local Pillow-only, no network.
- **Real cost, not a hidden risk**: `phaser-playtest` requires `npm install -D playwright && npx playwright install chromium` — a genuine, sizeable (hundreds of MB) one-time Chromium download. This must be an explicit, approved step, not something silently triggered mid-task.
- **Broadest permission surface**: candidate A's skills declare `allowed-tools` including `Agent` (sub-agent spawning), `AskUserQuestion`, and — for `team-level` — `TaskCreate/TaskGet/TaskUpdate`. Individually scoped (e.g., the `Bash` grant is pattern-locked to `*/hooks/yaml-helper.sh resolve_config *`, not a free shell), but the *aggregate* surface (49 agents each able to spawn further agents) is the largest blast radius of anything reviewed, and is the main reason to reject wholesale installation regardless of the individual hooks looking safe on inspection.
- Licensing was not exhaustively audited for any repo; before literal file reuse (not just pattern reference), confirm each repo's LICENSE permits the intended use.

## H. Portfolio World Blind-Test Suitability

No skill was installed or executed to run this test — that would exceed this phase's read-only mandate and would not be "blind" in any case, since installing a skill requires telling it what project it's in. Instead, each skill's **own documented decision procedure** (§D) was checked against four concrete, already-known defect classes from this project's real QA history, asking only: *would this skill's stated workflow, followed as written and without being told the answer, surface this class of problem on its own?*

| Test (real v1 history, used as fixture) | A (`art-bible`/`playtest-report`) | B `create-game-assets` | B `level-design` | C `phaser-playtest` | C `phaser-asset-advisor` | D `frontend-visual-qa` |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Mechanical N/S/E/W cross layout | Could *forbid* it in the doc, but nothing later checks the build against the doc | No — asset-scope, not composition-scope | No — flow/reachability lens, not composition-critique | No — functional only | No | Would surface it if the actor opens the whole-world capture per its own step 4 ("capture the whole visible composition") — but only flags it as a finding if a supplied reference/brief calls symmetry a defect |
| 2. Sharp/energetic water on a "calm sheltered harbor" | Could specify "calm water" in the doc, unverified after | Partial — its "Cohesion" gate checks material consistency, not mood-appropriateness | No | No | No | Only via its reference-parity profile, and only if fed a mood brief — no built-in harbor-design knowledge |
| 3. Plaza stone units too large vs. benches/player (the 0.9→0.72→0.42 saga) | No | **Yes** — explicit tile-seam and native-scale-vs-props validation step | No | No | No | Yes, in principle — "capture whole composition then zoom to defect," but its bundled sweep script targets DOM, not canvas pixels; would need a manual/CDP capture step substituted in |
| 4. Code/value changed but the actual pixel effect is absent (ART-10 rowboat) | No — nothing inspects a render | **Yes** — "do not call an asset production-ready from a prompt result alone" | No | No — proves the game *runs*, not that an effect is visible | No | **Yes** — exactly the "pixel-diff exists but is it real evidence" discipline; matches this session's own before/after crop method |

**Reading the table**: the two genuinely visual-defect-catching candidates are B's `create-game-assets` (asset-production-time gates) and D's `frontend-visual-qa` (post-render audit discipline) — and they catch *different* halves of the problem (production-time family/seam/scale checks vs. post-render evidence discipline). Neither A nor C's inspected skills independently catch any of the four tests; A because nothing in its pipeline ever inspects a render, C's Phaser skills because they are deliberately scoped to functional runtime correctness, not visual judgment — which is a legitimate, complementary division of labor, not a flaw, as long as it isn't mistaken for visual QA.

## I. Claude Compatibility

- A: Native Claude Code skills (`allowed-tools`, `AskUserQuestion`, `Agent`, `TaskCreate/TaskGet/TaskUpdate` are Claude Code primitives). Fully compatible as authored.
- B: Plain `SKILL.md` (Agent Skills open standard) with no Claude-specific frontmatter beyond `name`/`description`. Fully compatible.
- C: Ships a `.claude-plugin` directory; agents use standard Claude Code agent-definition conventions. Fully compatible.
- D: Plain markdown + Node scripts; no Claude-specific syntax. Fully compatible.

## J. Codex Compatibility

- A: Several forks explicitly claim to "turn Codex into a full game dev studio," but the skills themselves call Claude-Code-specific tool names (`Agent`, `AskUserQuestion`, `TaskCreate`) that Codex does not expose identically — compatibility is **claimed, not structurally verified** from the skill files themselves; likely needs a Codex-side shim per fork.
- B: Explicitly designed engine/agent-neutral; its own description states it "runs in Claude Code, Cursor, Kiro, Codex, Copilot, Gemini CLI and more." No Claude-specific syntax observed in the fetched skill files — plausible as stated.
- C: Ships a parallel `.codex-plugin` directory alongside `.claude-plugin` — structural dual-support, not just a claim.
- D: No agent-specific syntax at all (plain Node + markdown) — trivially portable to any agent that can run `node` and read a markdown instructions file, Codex included.

## K. Recommended Stack

Ranked by what each closes, aiming at the smallest set that actually covers this project's real, evidenced failure modes (§A, §H) rather than generic game-dev coverage:

1. **`create-game-assets`** (B) — **ADOPT**. Asset-family production discipline, native-scale approval gate, bundled seam/alpha/scale QA scripts. Directly closes Test 3/4-class defects at production time.
2. **`phaser-playtest`** (C) — **ADOPT**. Automates this session's hand-built headless-browser + console-error + FPS + asset-404 harness, for the exact engine version this project runs (Phaser 4). Requires one approved Playwright/Chromium install.
3. **`phaser-architect`** (C) — **ADOPT**. Scene/state/asset-strategy planning *for an already-approved visual design*, so engine constraints don't quietly become art-direction decisions.
4. **`phaser-coder`** (C) — **ADOPT**. Paired implementation skill; keeps Phaser 4 API usage consistent with what `phaser-architect` planned.
5. **`phaser-asset-advisor`** (C) — **ADOPT**. Technical loading/atlas/budget guidance, complementary to `create-game-assets`'s art-direction layer (one owns *how assets look and cohere*, the other owns *how they load and perform*).
6. **`frontend-visual-qa`'s discipline** (D) — **ADAPT**. Do not install its DOM sweep script as-is against canvas content. Instead, write its evidence-level ladder, mandatory-screenshot-inspection rule, and before/after-at-identical-crop method into a short project-specific "Portfolio World Visual QA Profile" that substitutes this session's CDP/headless-Edge/Pillow-crop approach (or `phaser-playtest`'s own screenshot output) as the Level A/C evidence source. **Literally adopt it unmodified**, no adaptation needed, for the one real DOM surface in this project: the `world/index.html` shell (header, exit link, ARIA region, footer) outside the canvas.

Everything else examined is **not** in the recommended stack (see §L). This is 5 literal adopts + 1 adapted discipline — at the low end of the requested 5–8, deliberately not padded to hit a round number.

## L. Rejected / Unnecessary Skills

- **A, wholesale** (`Claude-Code-Game-Studios`/`Codex-Game-Studios` and all forks) — **REJECT** as an installed system. Requires adopting an entire foreign directory/config convention for a project that already has its own (`docs/portfolio-world/`, `reports/portfolio-world/`); the largest permission/agent-spawn surface of any candidate; and — critically — no step in its pipeline ever inspects a rendered screenshot, so it cannot catch this project's actual, evidenced defect class. Its individual ideas (locked art bible before production, PROCEED/PIVOT/KILL vertical-slice gate) are **REFERENCE_ONLY** — already independently satisfied by this project's own `retro-harbor-campus-art-direction-v1.0.md` and its multi-round ART-02→ART-12 vertical-slice history.
- **`team-level`, `playtest-report`, `asset-spec`, `vertical-slice`** (A, individually) — **REJECT** as installs (same reasons); **REFERENCE_ONLY** for the process ideas.
- **`level-design`** (B) — **ADAPT, low priority / optional 7th**. Only the metrics-first-blockout and landmark/wayfinding framing transfer; everything about combat pacing, key/ability gating, and sawtooth difficulty must be stripped for a no-combat walkable world. Not in the 6-item core stack; add only if a future pass needs a formal reachability-graph check across more than four destinations.
- **Godot/Unity/Unreal/Bevy/pygame/LÖVE/Roblox skills** (B) — **REJECT**, wrong engine entirely.
- **`phaser-core`/`phaser-arcade-physics`** (B's web-engine skills) — **REJECT** as redundant; superseded by candidate C's dedicated, deeper Phaser **4** coverage.
- **Remaining ~20 skills in C** (`phaser-matter`, `phaser-particles`, `phaser-mobile`, `phaser-saveload`, `phaser-release`, `phaser-migrate`, `phaser-fx`, `phaser-audio`, `phaser-animation`, `phaser-gameobj`, `phaser-input`, `phaser-physics`, `phaser-scene`, `phaser-tilemap`, `phaser-ui`, `phaser-brainstorm`, `phaser-gdd`, `phaser-init`, `phaser-build`, `phaser-analyze`, `phaser-feedback`, `phaser-debugger`) — **REFERENCE_ONLY / not now**. None are needed for the current scope (no v3→v4 migration, no mobile-specific requirement, no save system yet). Revisit `phaser-tilemap` if the rebuild adopts a Tiled-based map, and `phaser-debugger` reactively if a runtime bug appears.
- **`frontend-visual-qa`'s bundled DOM sweep script** — **REJECT** as a literal tool against canvas content (see §D/§F); its discipline is **ADAPT**, not the script itself.
- **Every other skill in D's 60+-skill marketplace repo** (untouched) — out of scope; not inspected because none were named as a candidate by the brief.

## M. Minimal Installation Strategy

Per §12 of the brief, generic-skill content and Portfolio-World-specific rules must not be mixed. Concretely:

1. From B, copy only the `create-game-assets/` skill folder (its `SKILL.md`, `scripts/`, `references/`) into this project's own skill/plugin location — do **not** run B's installer, which bundles the router plus all 73 skills.
2. From C, copy only `phaser-architect/`, `phaser-coder/`, `phaser-asset-advisor/`, and `phaser-playtest/` (their `SKILL.md` + `scripts/`), plus the two matching agent definitions if sub-agent spawning is desired — not the full 26-skill/5-agent plugin.
3. Do not install anything from A. Reference its `art-bible`/`vertical-slice` *process shape* only when writing this project's own rebuild-planning docs.
4. Write a new, project-owned **`portfolio-world-visual-brief.md`** (or fold it into a v2 art bible under `docs/portfolio-world-rebuild/`) that states, as data — not as a generic skill: the calm-sheltered-water rule, the plaza-stone-scale rule, the asymmetry-preferred rule, the mood/avoid lists from §A. This is the "project-specific Visual Brief / Art Bible" the brief's §12 asks to keep separate from installed skills; `create-game-assets` and the adapted `frontend-visual-qa` profile both consume it as their reference/SSOT.
5. Write the adapted **Portfolio World Visual QA Profile** (§K item 6) as a short project skill/checklist, not a copy of `frontend-visual-qa`'s script.

## N. Proposed Rebuild Workflow

```text
1. Author portfolio-world-visual-brief.md
   (this project's own document; encodes §A's lessons as explicit rules,
   not generic-skill content)

2. phaser-architect (C)
   Scene/state/asset-loading plan for an engine that already fits Phaser 4,
   written against the visual brief, not ahead of it.

3. create-game-assets (B), driven by the visual brief
   Approve one representative visual target (a single harbor composition
   frame — Harbor Square + waterfront + Hero Ship) at actual game scale
   BEFORE producing the full asset family. This is the step this project's
   v1 history skipped, and paid for across three later polish rounds.

4. phaser-coder (C)
   Implement against the architect's plan and the approved visual target.

5. phaser-playtest (C)
   Automated functional runtime verification after every implementation
   change — replaces this session's manual headless-Edge/CDP harness.

6. Portfolio World Visual QA Profile (D, adapted)
   Post-render visual audit against the visual brief, using phaser-playtest's
   own screenshots (or an equivalent capture) as Level A/C evidence, applying
   frontend-visual-qa's evidence-ladder and before/after-at-identical-crop
   discipline. Run this BEFORE calling any pass "PASS" — mirroring the
   anti-pass rule this project's own ART reviews had to invent by hand.

7. Only after 3–6 both pass once for the harbor hub in isolation,
   repeat 3–6 per destination zone.
```

Repeat step 6's discipline at every subsequent milestone; it is the one step this project's v1 history shows is cheapest to skip and most expensive to skip.
