# Production Base Path Validation

The R5 Manifest resolves every entry as `${import.meta.env.BASE_URL}assets/r5-hybrid/<file>`. This produces `/assets/r5-hybrid/...` in development and `/MyPage/world/assets/r5-hybrid/...` in the production build.

`npm run build` emitted the R5 assets beneath `world/assets/r5-hybrid` and a new Runtime bundle. A fresh `npm run preview` process on port 4175 successfully rendered `http://127.0.0.1:4175/MyPage/world/?r5=1`: one canvas, the visible Integration A notice, Candidate B and foreground layers, with zero browser console warnings/errors.

An already-running preview on port 4174 briefly returned a stale/blank page after its source directory was replaced by build. This was process staleness, not accepted production evidence; the fresh port-4175 process is the authoritative result. GitHub Pages was not published or modified.

