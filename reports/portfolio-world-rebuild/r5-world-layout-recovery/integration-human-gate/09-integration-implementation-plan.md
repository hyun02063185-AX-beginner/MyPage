# Proposed R5 Integration Plan (not authorized implementation)

## Integration A — Runtime entry and assets

Change `src/main.ts`, `src/scenes/BootScene.ts`, a new R5 scene/module and `vite.config.ts` only as needed for a production entry. Reuse Candidate B, Pilot character/foreground assets and existing Phaser config; change all asset paths to `BASE_URL`. Test `npm run typecheck`, `npm run build`, built Preview R5 and `?canonical=4`. Risk: entry graph/base paths. Human check: R5 entry and R4 rollback URL both launch. Rollback: remove the new selector/scene registration and restore prior built World artifacts.

## Integration B — navigation and destination UX

Move/reuse `hybridCollision.ts`, `hybridNavigation.ts`, POI data and DOM-projection logic without altering the approved geometry or B/170 animation. Add focused regression tests for all four actual A* routes, manual cancel, water/cliff/hull exclusions, marker projection, panel state, and the live Workshop→Hall failure. Risk: camera/DOM lifecycle and wrong coordinate migration. Human check: each POI route and Hero threshold. Rollback: disable the R5 selector; R4 remains untouched.

## Integration C — content, mobile and deployment

Add a base-safe four-page route resolver; preserve new tab during this release. Test production preview at `/MyPage/world/`, all four paths, refresh/return behavior, mobile browser viewport and Android device. Review chunk sizing and Pages asset URLs. Risk: base URL and browser state. Human check: final four content visits and Android usability. Rollback: withdraw the R5 entry while preserving content pages and R4 URL.

Completion requires passing automated checks plus the listed live checks; it is not satisfied by static images.

