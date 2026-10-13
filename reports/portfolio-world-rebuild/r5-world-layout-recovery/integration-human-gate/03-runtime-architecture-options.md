# Runtime Architecture Options

## Option A — add R5 as a Runtime scene (recommended)

Keep `index.html` and one Vite build. Register a future `R5WorldScene` in `main.ts`; have BootScene choose it through a deliberately named query/route while retaining `canonical=4` untouched. Move R5 asset URLs behind `import.meta.env.BASE_URL`, put shared destination/routing data in a pure module, and mount/unmount a small DOM HUD with the scene lifecycle.

This preserves the validated R5 behavior while producing an actual production bundle. It minimizes duplicate Phaser configuration and permits a stable R4 validation URL. It changes a constrained entry/Boot/asset/UI boundary, but does not require a change to `CanonicalRuntimeR4Scene.ts`.

## Option B — promote a separate Hybrid app

Keep `r5-hybrid-pilot.html`, declare it as a Vite multi-page input, and harden its base paths/routing. It has the smallest initial source refactor and highest visual fidelity risk reduction, but duplicates game configuration, leaves two world entry policies, requires separate HTML deployment verification and makes homepage/R4/R5 discovery harder to maintain.

## Decision

Choose Option A for the subsequent approved implementation. It has the better production path and rollback: R4 remains selected by its current query; an R5 failure can remove the new selector/scene without restoring R4 source. Option B remains a valid short-lived staging route only if the team needs a parallel preview before entry integration.

No option is implemented by this Gate.

