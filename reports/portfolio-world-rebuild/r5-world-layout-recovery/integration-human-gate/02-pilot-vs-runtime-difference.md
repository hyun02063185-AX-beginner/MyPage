# Pilot versus Runtime Difference

| concern | R4 canonical Runtime | R5 Hybrid Pilot | integration consequence |
|---|---|---|---|
| entry | `index.html` → `src/main.ts` | `r5-hybrid-pilot.html` → `hybridPilot.ts` | Pilot is not a Vite production entry |
| scene selection | BootScene chooses `canonical=1..4`; R4 is registered with the shared Game | self-contained Phaser Game | preserve the R4 branch and add an explicit R5 route/scene |
| world | 1920×1080; zoom 1; R1 geometry retained | 1280×720; zoom 1.25 | never reuse R4 anchors or polygons |
| loading | `BootScene` uses `import.meta.env.BASE_URL` for assets | hard-coded root `/assets/...` | migrate every R5 path to `BASE_URL`/resolver |
| movement | keyboard; vector polygons; `E` event only | keyboard + click A* + DOM markers + arrival panel | extract navigation unchanged, then adapt its UI boundary |
| UI | Phaser text/footer | Phaser canvas plus absolute DOM HUD/markers/dialog | retain per-frame camera-to-DOM projection |
| content | R4 emits an event | Pilot makes new-tab anchors | choose a routed content helper and explicit return policy |

R4 flow: `main.ts` creates one Game with BootScene, WorldScene and canonical scenes. `BootScene.ts` selects R4 only for `?canonical=4`, loads R4 assets under `BASE_URL`, then starts `CanonicalRuntimeR4Scene`. R4 has its own 28×16 body, 1920×1080 WALKABLE/WATER/OBSTACLES data, keyboard movement and zoom 1.

R5 flow: the independent HTML directly imports its TypeScript source. It creates another Phaser Game, has Pilot-only collision/A*, Candidate B plate and five foreground overlays. DOM elements receive positions from `(anchor - camera.worldView) * camera.zoom` every update. This is valuable code to preserve, but it cannot be copied into R4 because its coordinate contract, lifecycle, and DOM parent differ.

Candidate B's reserve is visual-only water context. Do not add POIs, a walking exception, or a fifth route as part of integration.

