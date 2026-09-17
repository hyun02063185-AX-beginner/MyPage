# Portfolio World — Sprint 2 Plan

## Work Context

- Agent: Codex
- Model: GPT-5
- Environment: HOME_WINDOWS
- MachineContextId: `06cd98a5-32c4-40db-a628-5416e4795ed6`
- Base commit: `cc1a7c9`
- Branch: `feature/portfolio-world-sprint-02`

## Sprint goal

Make the 2048 × 1280 world readable as an authored four-direction portfolio space through project-owned spatial data, placeholder density, and environmental-only collision.

## Approved implementation choices

- Spatial data: `PROJECT_LAYOUT_DATA` (`worldLayout.ts` + project-local data), not Tiled.
- Collision: Phaser Arcade Physics for building footprints and selected large environmental objects only.
- World bounds: existing manual player clamp remains the sole world-edge containment authority.
- Tiled: deferred until a tile/art pipeline exists.

## Explicit non-scope

- Portal navigation, page routing, or content payloads
- Tiled, Playwright, physics plugins, UI frameworks, and asset libraries
- NPCs, dialog, AI NPCs, audio, analytics, multiplayer, accounts, or touch movement
- Final bespoke pixel art or binary art assets
