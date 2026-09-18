# Portfolio World — Visual Pass 4 Focused Fix

## Gate

```text
READY_FOR_FOCUSED_VERIFICATION
```

## Scope and source

- Base: `55ec821`; branch: `feature/portfolio-world-sprint-02`
- Reviewed the Pass 4 Director Gate, implementation report, independent review, layout data, validation, and `WorldScene` runtime collision path.
- This is a coordinate/collision corrective patch only; basin extents, vessel placement, destination layout, visual catalog, and programmatic-only policy remain intact.

## Basin props

The six pre-existing west-waterfront props and the viewing terrace are now all above the west basin's `y=960` water edge after the approved town translation:

- Terrace moves to the dry viewing edge at final `(704,880)`.
- Bench, lamp, and planter become a dry promenade line at final `y=936`.
- Crate and barrel move beside the dry cargo edge at final `y=920`.

The placement keeps the viewing group and cargo group distinct rather than piling every prop in one cluster. A narrow permanent land-side prop guard now rejects `bench`, `lamp`, `planter`, `crate`, `barrel`, or `viewing-terrace` rectangles that overlap any harbor water. Boats, docks, and water decorations are intentionally outside this guard.

## Pier walkability

- West and east pier arms are widened from `112` to `160` px, giving each a 32 px overlap with the central dock for a 24 px-wide player.
- Both arms retain their visual water context, but declare `walkable: true`.
- `waterCollisionGeometry.mjs` subtracts only declared walkable dock footprints from water collision rectangles. `WorldScene` uses those derived water collision rectangles while retaining every other water boundary as collidable.
- Validation requires both named pier arms and rejects any derived water collision rectangle that still overlaps either arm.

## Verification

- `npm test`: PASS — 7 tests, including the new land-prop/water and pier-collision regression coverage.
- `npm run typecheck`: PASS.
- `npm run build`: PASS (existing Phaser bundle-size warning only).
- `git diff --check`: PASS.
- Production preview: `HTTP 200` at `/MyPage/world/`.

Focused browser movement and screenshot capture remain pending the next focused verification session; the local execution environment did not expose a browser automation binary. Required evidence paths are `/tmp/portfolio-world-pass4-fix-west-basin.png` and `/tmp/portfolio-world-pass4-fix-piers.png`.

## Follow-up

Perform the focused visual verification: confirm no west-basin prop is submerged; walk from dry land through both pier arms to their tips; confirm surrounding water remains blocked and neither route traps the player; inspect the preserved basin composition and vessels; capture the two named screenshots.
