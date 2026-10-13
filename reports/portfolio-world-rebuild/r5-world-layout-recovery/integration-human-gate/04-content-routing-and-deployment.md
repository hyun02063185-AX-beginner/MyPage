# Content Routing and Deployment

`vite.config.ts` builds with base `/MyPage/world/` to `../world`. The build output contains `index.html` and the main Runtime chunks; it does not contain `r5-hybrid-pilot.html` or its independent source import. Thus successful dev-server Pilot play is **not** production deploy evidence.

The Pilot currently evaluates `new URL(candidate.content, window.location.href)`. From a future `/MyPage/world/...` entry, `teaching.html` becomes `/MyPage/world/teaching.html`, not the required `/MyPage/teaching.html` (same for making, gallery, career). In local root development it resolves to `/teaching.html`, which masks the deployed issue.

Recommended integration helper: construct `/MyPage/${file}` from `import.meta.env.BASE_URL` by resolving `../${file}` against the World base, or store an explicit site-root route map tested for both local and Pages bases. Do not move the content files. Retain `target=_blank` during initial integration: it preserves the World tab and exact player state. Same-tab and overlay are future product choices, not Gate implementation.

Deployment safety: preserve existing `/MyPage/world/?canonical=4`; add a separate R5 selector during verification; build and inspect generated paths before any Pages publish; rollback by removing R5 entry/selector and redeploying the prior World artifact. GitHub Pages publishing was not changed.

