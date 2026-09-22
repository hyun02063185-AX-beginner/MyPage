# Fleet Native-Resolution Quality Pass

Date: 2026-09-22

## A. Work Context

- Profile: `HOME_WINDOWS`
- Machine context ID: `06cd98a5-32c4-40db-a628-5416e4795ed6`
- Branch: `feature/portfolio-world-sprint-02`
- Start commit: `7426cc5`
- Final runtime commit: `d1d1daa`

## B. Scope

This is a **native-resolution quality pass**, not a fleet redesign. It replaces only the active Hero, Medium, Brig, and Cutter raster assets and their runtime display metadata. The approved vessel classes, berth positions, mixed facings, roles, furled-sail state, 15° / 0° visual grammar, world dimensions, paths, collision, depth policy, and waterfront zoning are unchanged. Workboat and Dinghy remain unchanged because they are subordinate and did not require this core pass.

## C. Updated Assets

| Asset | Old → new file bytes | Old display relation | New display relation | Runtime scale | Sail / grammar |
| --- | ---: | --- | --- | --- | --- |
| Hero Ship D | 91,556 → 59,597 | 365×255 at 1.35×; 482×333 visible | 490×341 at 1×; 482×333 visible | 1.35 → 1.0 | furled-stowed / 15° pass |
| Medium Vessel | 16,202 → 10,541 | 168×121 at 1.30×; 208×147 visible | 216×155 at 1×; 208×147 visible | 1.30 → 1.0 | furled-stowed / 15° pass |
| Brig | 10,310 → 6,815 | 136×96 at 1.25×; 160×110 visible | 168×118 at 1×; 160×110 visible | 1.25 → 1.0 | furled-stowed / 15° pass |
| Cutter | 6,441 → 5,323 | 101×86 at 1.30×; 121×101 visible | 129×109 at 1×; 121×101 visible | 1.30 → 1.0 | furled-stowed / 15° pass |

All v03 PNGs have transparent backgrounds, alpha-threshold (`alpha > 16`) bounds with four pixels of padding, hidden-RGB cleanup, generated-original provenance, and existing category-ceiling compliance. The prior v02 files remain historical evidence only and are no longer active manifest paths.

## D. Visual Outcome

- Hero: the same three-mast blue-and-warm-wood landmark silhouette, raised stern, visible deck strip, furled yard bundles, and left-facing runtime presentation are retained; its native canvas now carries the approved visible envelope without 1.35× enlargement.
- Medium: the same two-mast merchant hierarchy and deck readability are retained at a 1× 216×155 canvas.
- Brig: the same smaller two-mast merchant silhouette is retained and mirrored only by the existing runtime facing contract.
- Cutter: the same compact one-mast cutter silhouette, bowsprit, and deck sliver are retained at a 1× 129×109 canvas; this directly addresses the prior small-canvas confidence note.

The processed v03 assets were opened and inspected as transparent PNGs. They preserve the established visible size hierarchy: Hero > Medium > Brig > Cutter > Workboat > Dinghy. A connected-browser canvas surface was unavailable in this environment, so a human review is intentionally retained for final perceptual confirmation rather than claimed here.

## E. Runtime / Layout Integrity

- Berths, raw layout coordinates, ship roles, and `BERTHING_SLOTS` are unchanged.
- Existing left/right facings are unchanged.
- Fleet alpha-envelope overlap sweep: 0 material overlaps.
- Water containment, gangplank and buoy rules, dock/water collision carve-outs, depth anchors, and destination/world layout tests pass unchanged.
- No collision, IA, path, depth-policy, building-placement, or harbor-zoning file changed.

## F. Preload / Weight

Normal BootScene preload: **31 assets / 561,180 bytes**.

Previous canonical preload: 603,413 bytes. Delta: **−42,233 bytes**. The four remastered active ship files total 82,276 bytes versus 124,509 bytes for their active v02 predecessors; each stays within its existing category ceiling.

## G. QA

- `npm ci` — PASS (after stopping project-local Vite servers that held the Windows native binding lock)
- `npm run typecheck` — PASS
- `npm test` — PASS, 32/32
- `npm run build` — PASS
- Production preview asset loading — PASS: `/MyPage/world/` and all four v03 PNG endpoints returned HTTP 200 with audited byte lengths
- `git diff --check` — PASS

## H. Final Gate

`READY_FOR_FLEET_NATIVE_RESOLUTION_HUMAN_REVIEW`
