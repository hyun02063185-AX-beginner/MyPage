# Provenance — phaserjs/phaser (official)

- **Source repository**: https://github.com/phaserjs/phaser
- **Source commit (HEAD at vendor time)**: `02d8931b626d9764c133cbb3fbf99966c03c757c` (2026-08-21)
- **License**: MIT (per GitHub repository license metadata and `LICENSE.md`, copyright Richard Davey / Phaser Studio Inc.)
- **Vendored on**: 2026-09-26 (R1.1, replacing the removed `yakoub-ai-phaser4-gamedev` vendor — see that source's `PROVENANCE.md`)
- **Vendored path**: `skills/` → `skills/` (unchanged relative path); `LICENSE.md` copied to this directory's root for reference.
- **Vendored skills** (6 of 27 in the source repo's `skills/` directory):
  - `skills/game-setup-and-config/SKILL.md`
  - `skills/scenes/SKILL.md` + `skills/scenes/references/REFERENCE.md`
  - `skills/cameras/SKILL.md` + `skills/cameras/references/REFERENCE.md`
  - `skills/loading-assets/SKILL.md` + `skills/loading-assets/references/REFERENCE.md`
  - `skills/sprites-and-images/SKILL.md` + `skills/sprites-and-images/references/REFERENCE.md`
  - `skills/input-keyboard-mouse-touch/SKILL.md` + `skills/input-keyboard-mouse-touch/references/REFERENCE.md`
- **Modifications from source**: none. Files are byte-identical to the fetched source at the commit above.
- **Not vendored** (21 remaining skills in the source repo): `actions-and-utilities`, `animations`, `audio-and-sound`, `curves-and-paths`, `data-manager`, `events-system`, `filters-and-postfx`, `game-object-components`, `geometry-and-math`, `graphics-and-shapes`, `groups-and-containers`, `particles`, `physics-arcade`, `physics-matter`, `render-textures`, `scale-and-responsive`, `text-and-bitmaptext`, `tilemaps`, `time-and-timers`, `tweens`, `v3-to-v4-migration`, `v4-new-features`.

## Reason for adoption — per skill

| Skill | Reason |
| --- | --- |
| `game-setup-and-config` | Every Phaser 4 project needs a correctly configured `Phaser.Game`/`GameConfig` (renderer, pixel-art mode, FPS, canvas). Foundational, needed on day one. |
| `scenes` | Portfolio World v2 is scene-organized by design (boot/world/destination scenes, mirroring v1's own `BootScene`/`WorldScene` split). Core architecture skill. |
| `cameras` | v1's entire history relied heavily on camera follow, bounds, and zoom (bounded follow camera, dev-only QA framings via `stopFollow`/`setZoom`/`centerOn`). Directly reusable knowledge for v2's camera behavior regardless of layout changes. |
| `loading-assets` | Any sprite/image-based world needs correct preloading, progress tracking, and cache usage. Foundational. |
| `sprites-and-images` | v1's most recurring, most-revised code path (`drawVesselWaterComposite`, vessel/building compositing) was entirely `this.add.image`/`this.add.sprite` positioning, origin, depth, tint, and alpha work. Directly the skill for the class of bug this project keeps encountering. |
| `input-keyboard-mouse-touch` | v2 keeps a walkable world with WASD/arrow movement and E/Enter/click destination interaction — the exact input surface this skill covers. |

## Not adopted now (rationale)

- `tilemaps` — v1 did not use a Tiled-based map (its world layout is a project-owned JSON describing zones/paths procedurally); no decision has been made for v2 either. Revisit if a Tiled-based approach is chosen.
- `scale-and-responsive` — plausible future need (mobile/responsive canvas), not a currently active requirement. Revisit if responsive/mobile support becomes a stated goal.
- `v4-new-features` — this project is greenfield on Phaser 4, not migrating from v3; the new-in-v4 feature set (Filters, RenderNodes, GPU layers) is advanced/optional territory, not a day-one need. Revisit if a specific v4-only feature (e.g. a custom Filter) becomes necessary.
- `game-object-components` — meaningful overlap with `sprites-and-images` (which already documents Origin/Depth/Tint/Alpha as used through the factory methods); kept out to avoid padding the stack past what's actually needed right now.
- All physics (`physics-arcade`, `physics-matter`), audio, particle, tween, animation, and math/geometry skills — no confirmed need yet for a walkable, no-combat, no-physics-puzzle portfolio interface. Revisit per actual v2 requirement as it's specified, not speculatively.

## Applicability note

This is the official engine repository's own skill set — no engine-version mismatch risk (contrast with the removed `Yakoub-ai/phaser4-gamedev`, which was a third-party interpretation of the same API surface). No visual/artistic judgment content in any of these 6 skills — they are pure API/architecture reference, complementary to (not a substitute for) `01_ART_BIBLE.md` and `tools/agent-skills/profiles/portfolio-world-visual-qa/`.
