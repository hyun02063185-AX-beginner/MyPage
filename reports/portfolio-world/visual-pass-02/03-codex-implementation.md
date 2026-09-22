# Portfolio World — Retro Harbor Campus Visual Pass 2 Implementation

## Work Context

- Agent: Codex
- Model: GPT-5
- Profile: `CODYSSEY_SHARED_MAC`
- Machine Context ID: `3c5410ed-2e15-4583-abb7-9de45a28bbe5`
- OS: darwin x64
- Node / npm: v24.21.0 / 11.19.0
- Base commit: `1ffff76`
- Branch: `feature/portfolio-world-sprint-02`
- Implementation commit: `86b4614` (`feat(portfolio-world): add streetscape and reserved expansion lots`)

## Reserved expansion lots and layout constraints

`reservedLots` is an internal `WorldRect + zone` layout field. It intentionally has no
end-user label and no collision behavior.

| ID | Rectangle (x, y, width, height) | Location / intended future capacity |
|---|---|---|
| `guild-annex-lot` | 700, 360, 224, 160 | NW, quiet Guild Hall annex / archive capacity |
| `academy-library-lot` | 1440, 352, 224, 160 | NE, Academy library / learning capacity |
| `workshop-studio-lot` | 1568, 864, 224, 160 | SE, Workshop studio / lab capacity |

`layoutValidation.mjs` now includes reserved lots in bounds and duplicate-ID validation,
rejects their overlap with paths, forecourts, building footprints, or one another, and
rejects **all** harbor visuals that consume a reserved lot. Permanent streetscape types
also cannot overlap protected paths, forecourts, or building footprints. The new Node
test covers lot bounds, lot/path overlap, lot/lot overlap, permanent object/forecourt,
permanent object/building, and detail object/reserved-lot failures.

## Streetscape and visual architecture

- `harborVisualCatalog.ts` remains the one exhaustive `HarborVisualType` dispatcher.
- Added `streetscapeVisuals.ts` for the Pass 2 programmatic drawing primitives, keeping
  the catalog focused instead of creating a route framework or generic renderer.
- Added 15 harbor-specific visual types for market, journey, learning, maker, and
  waterfront composition. `worldTypes.ts`, `landmarkCatalog.ts`, runtime catalog, and
  validation whitelist were updated together.
- Guild Hall / Journey Street: notice board, route map, registry stand, flag, travel crate,
  bench, and lamp.
- Academy / Learning Walk: study garden, academic sign, tree, banners, bench, and lamp.
- Workshop / Maker Yard: worktable, tool rack, cart, timber stack, material crate, and lamp.
- Exhibition / Waterfront Promenade: display board, viewing terrace, flags, bench, lamp,
  planter, cargo, dock, water, and boat.

The quality-bar route received the strongest composition work: Harbor Square adds a small
market kiosk while retaining open orientation space; Exhibition gains display/flag cues;
the waterfront adds a viewing terrace and seated/lit promenade sequence before the dock,
water, and boat. North/South beats remain compressed; longer Guild/Workshop routes hold
the fuller identity clusters.

## Density, collision, and accessibility

- Approximate density: 7 primary structures (four destinations plus monument/dock/water),
  25 secondary anchors, and 25 detail props. Reserved lots remain visually open.
- All new streetscape props are non-collidable. The static collider set remains five:
  four building footprints and the water boundary. Dock movement remains clear.
- Keyboard movement, normalized diagonal movement, blur key reset implementation,
  persistent Portfolio exit, ARIA region, focus behavior, and coarse-pointer fallback
  were not changed.

## Validation and evidence

- `npm ci`: PASS (20 packages; 0 vulnerabilities reported).
- `npm run typecheck`: PASS.
- `npm test`: PASS — production build plus 4 Node tests.
- `npm run build`: PASS; preview served HTTP 200 at `/MyPage/world/`.
- Headless production-preview evidence (temporary, not runtime assets):
  - `/tmp/portfolio-world-pass2-harbor-square.png`
  - `/tmp/portfolio-world-pass2-waterfront.png`
  - `/tmp/portfolio-world-pass2-dock.png`
  - `/tmp/portfolio-world-pass2-boat.png`
- Preview interaction exercised initial Harbor Square rendering, normal rightward movement,
  normalized down-left travel to the water edge, water collision, and rightward dock
  movement. The screenshots directly show the player stopped above water, on the dock,
  and beside the boat. Full per-route entrance, world-edge clamp, and blur/reset manual
  walks were not independently repeated in this environment; their code paths are
  unchanged from the accepted Sprint 1/Pass 1 baseline.

## Performance, scope, and status

- Main JS: 1,401.11 kB; gzip: 364.17 kB. The existing Vite Phaser-size warning remains
  tracked; no premature optimization or code split was introduced.
- Approximate static visual display objects: 72 (59 Graphics, 8 path/forecourt rectangles,
  5 labels), plus 5 hidden static collision rectangles. Visuals are created in `create()`,
  never per-frame.
- Binary assets added / bytes added: 0 / 0. Programmatic-only rendering remains sufficient.
- Visual Pass 1 review and human foundation approval are recorded as complete in status and
  handoff. Visual Pass 2 independent review and user Visual Feel Test remain pending.
- Existing root Portfolio pages were not changed. Expected generated `world/` output was
  rebuilt. No functional buildings, portals, routing, interiors, NPCs, dialogue, AI,
  quests, combat, audio, day/night, final art assets, generic theme engine, Tiled,
  multiplayer, authentication, or database work was added.
