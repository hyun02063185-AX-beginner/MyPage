# Known Risks and Deferred Items

| severity | item | disposition |
|---|---|---|
| Blocker for production R5 | Pilot is absent from Vite build and imports `/src/...` directly | solve in Integration A; no production R5 entry until then |
| Major | content relative links resolve under `/MyPage/world/`, not site root | solve and test four links in Integration C |
| Major | live Workshop→Hall auto route stopped on current build | reproduce, diagnose route/collision-grid interaction in Integration B |
| Medium | one 1.49MB minified Runtime chunk warning | assess code split during A/C; it did not fail build |
| Medium | current art occlusion history | defer; upgrade if an actual route obstructs play |
| Medium | Android physical behavior | test in Integration C |
| Low | QA query flags could be mistaken for defaults | preserve B/170 default and document flags |

Deferred by explicit scope: Candidate B redesign, character regeneration, POI/reserve expansion, content-page changes, R4 source changes, main merge, and GitHub Pages publication. The dirty worktree has pre-existing/unrelated generated and evidence files; this Gate does not normalize or delete them.

