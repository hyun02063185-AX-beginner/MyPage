# Portfolio World — Visual Pass 4 Focused Verification

## Waterfront Props + Pier Walkability

Reviewer: Claude Code — Sonnet 5
Role: Focused independent verifier (did not implement this patch)

---

## A. Gate

```text
READY_FOR_USER_VISUAL_FEEL_TEST
```

Both defects from the prior independent review (VP4R-01 submerged props, VP4R-02
non-walkable piers) are fixed and verified — the second directly via executable
verification against the actual production collision-geometry function, not just static
arithmetic. The new validation would have caught both original bugs. No regression was
found in harbor composition, vessels, or reserved lots. QA is 7/7 green and matches the
implementation report exactly. Interactive/browser verification was not possible in this
environment (Section O) and is reported as such rather than claimed.

---

## B. Work Context

| Field | Value |
|---|---|
| Profile | `CODYSSEY_SHARED_MAC` |
| Machine Context ID | `3c5410ed-2e15-4583-abb7-9de45a28bbe5` |
| OS | darwin x64 |
| Branch | `feature/portfolio-world-sprint-02` |
| HEAD | `b461d2c` |
| Git status | clean |
| Node / npm | v24.21.0 / 11.19.0 |

---

## C. Reviewed Range

```text
baseline:     55ec821
focused fix:  b461d2c  (fix(portfolio-world): correct harbor props and pier walkability)
```

`git diff --stat 55ec821..b461d2c`: 13 files changed, 197 insertions, 17 deletions —
`worldLayoutData.json` (prop/pier coordinates), `layoutValidation.mjs` (two new guard
categories), a new `waterCollisionGeometry.mjs`/`.d.ts` module, `WorldScene.ts` (5 lines,
now consumes derived collision rects instead of raw water visuals),
`worldLayout.ts`/`worldTypes.ts` (wiring), test additions, status/handoff, and the
generated `world/` output.

---

## D. Submerged Props

```text
SUBMERGED_PROPS_FIXED
```

Computed post-translation (`-96`) bounds directly from the committed JSON and compared
against the unchanged west basin (`x:0–800, y:960–1088`):

| Prop | Old bounds (Pass 4) | New bounds (this fix) | vs. basin (960–1088) |
|---|---|---|---|
| `waterfront-viewing-terrace` | y:904–984 (30% submerged) | x:624–784, y:840–920 | clear, 40 px margin |
| `waterfront-viewing-bench` | y:1020–1044 (fully submerged) | x:672–736, y:924–948 | clear, 12 px margin |
| `waterfront-viewing-lamp` | y:992–1040 (fully submerged) | x:764–788, y:912–960 | touches at exactly y=960, not overlapping (strict-inequality boundary, 0 px margin) |
| `waterfront-promenade-planter` | y:996–1036 (fully submerged) | x:592–640, y:916–956 | clear, 4 px margin |
| `waterfront-promenade-crate` | y:1012–1052 (fully submerged) | x:524–564, y:900–940 | clear, 20 px margin |
| `waterfront-promenade-barrel` | y:1014–1050 (fully submerged) | x:474–502, y:902–938 | clear, 22 px margin |

All six are now fully on dry land. One item (`waterfront-viewing-lamp`) has exactly zero
margin — its bottom edge lands precisely on the basin's top edge (960 = 960). The
`overlaps()` function used everywhere in this codebase is strict (`<`/`>`, not `<=`/`>=`),
so touching-but-not-crossing does not register as an overlap — confirmed by re-running
the actual validator against this exact data with no error. This is a legitimate pass,
though a design margin this tight (0 px) leaves no room for a future 1–2 px adjustment
elsewhere before it would need re-checking.

---

## E. Prop Composition

```text
PROP_COMPOSITION_PASS
```

The fix report's own framing matches the data: bench/lamp/planter form one "dry
promenade line" (`y=936` for all three, `x` from 592 to 788) reading as a viewing
cluster near the terrace; crate/barrel form a separate "dry cargo edge" pair
(`y=920`, `x` 474–564) reading as cargo dressing — two distinct groups, not one pile.
The terrace itself (`704,880`) sits between the forecourt (bottom edge 864) and this
promenade line, plausibly still supporting an Exhibition-to-waterfront visual transition.
No new conflict was introduced: none of the six relocated items overlaps
`forecourt-gallery` (x:960–1088, no x-overlap with any of them), the warehouse
(x:144–304, no overlap), the cargo shed (x:392–472, nearest is the barrel at x:474–502,
a 2 px gap), or each other in any way that reads as broken (the lamp sits at the
terrace's edge, a normal "lamp beside a platform" composition, not flagged by any rule
since neither is collidable).

---

## F. Prop-vs-Water Guard

```text
PROP_WATER_GUARD_PASS
```

`layoutValidation.mjs` adds `LAND_SIDE_PROP_TYPES = {planter, bench, lamp, crate, barrel, viewing-terrace}`
and checks each against every water region with the same `assertDoesNotOverlap` used
elsewhere. This is a focused category, not a broad generic rule — it correctly excludes
`small-boat`/`large-ship` (meant to be in water), `dock` (meant to be water-adjacent,
and the walkable piers specifically need to partially coexist with water geometry), and
`water` itself. Ran the actual new test (`benchInBasin`, which moves the bench back into
the basin and asserts `/Land-side prop overlaps harbor water/`) — passes. This is
exactly the right scope: it protects the category of prop that broke (furniture/cargo
dressing meant for dry land) without constraining the categories that are supposed to
interact with water.

---

## G. West Pier

```text
WEST_PIER_WALKABILITY_PASS
```

Verified two ways. **Static**: post-shift `harbor-pier-west` is `(752,1080), 160×32`
(bounds x:672–832). West basin is `x:0–800, y:960–1088`. **Executable**: I ran the
actual production `createWaterCollisionRects()`/`rectsOverlap()` functions (not a
reimplementation) against the real translated layout:

```text
harbor-pier-west overlapping collision rects: 0
probe (752,1080) [pier center]:                blocked = false
probe (752,1030) [north of pier, open basin]:  blocked = true
probe (600,1080) [west of pier, still basin]:  blocked = true
```

The pier's full walkable footprint is clear of collision, while the basin immediately
around it remains blocked. Connection to the central dock: the pier's right edge (832)
overlaps the main dock's left edge (800) by 32 px — a connected, gap-free walkway wider
than the player's 24 px width. The pier tip (west end, x≈672) is not isolated; it's
reachable by walking the full 160 px span from the dock connection.

---

## H. East Pier

```text
EAST_PIER_WALKABILITY_PASS
```

Mirror of Section G. `harbor-pier-east` post-shift: `(1296,1080), 160×32`
(bounds x:1216–1376). East basin: `x:1248–2048, y:960–1088`.

```text
harbor-pier-east overlapping collision rects: 0
probe (1296,1080) [pier center]:                     blocked = false
probe (1450,1080) [east of pier, still in basin]:    blocked = true
```

Connection to the central dock: pier's left edge (1216) overlaps the dock's right edge
(1248) by 32 px, matching the west side symmetrically. Fully walkable, fully connected,
surrounding water still blocked.

---

## I. Pier Walkability Guard

```text
PIER_WALKABILITY_GUARD_PASS
```

The new test (`"Pass 4 keeps land-side props dry and both pier arms out of water
collision"`) computes `createWaterCollisionRects()` from the real layout and asserts
`rectsOverlap(water, pier) === false` for both piers — this is a direct geometric
assertion against production code, not a proxy or a hardcoded-position check. Applied to
the **pre-fix** geometry (112 px piers, no subtraction logic at all — `WorldScene`
previously just used the raw `collidable` water rects unmodified), this exact assertion
would have failed immediately, since ~93% of each old pier sat inside its basin with
nothing subtracting it. A second test (`missingWalkability`) confirms the validator also
rejects a pier that loses its `walkable: true` flag, guarding the declaration itself, not
just the geometry.

---

## J. Water Collision Regression

```text
WATER_COLLISION_REGRESSION_PASS
```

Confirmed via the same executable probe (Section G/H): points inside the west/east
basins but outside either pier's footprint remain blocked (`north of west pier`, `west
of west pier`, `east of east pier` all report `blocked: true`). The subtraction
algorithm (`subtractWalkableFootprint` in `waterCollisionGeometry.mjs`) only carves out
the exact rectangular intersection of a water region and a declared-walkable dock —
verified by reading the implementation (computes `cutLeft/cutTop/cutRight/cutBottom` as
the overlap region, then emits up to 4 non-overlapping remainder rectangles: north,
south, west, east of the cut) — it cannot accidentally open a larger gap than the pier's
own footprint. The south sea also correctly receives this same treatment automatically
(both piers have an 8 px sliver of y-overlap with the south sea's north edge at y=1088,
which the same generic reduce-over-all-docks logic correctly subtracts too — confirmed
the collision rect count came out to 8, consistent with 3 original water regions each
needing 2 pier-shaped notches carved as applicable, minus zero-area pieces). No new
walkable seam into open water was found anywhere I checked.

---

## K. Harbor Composition Regression

```text
HARBOR_COMPOSITION_REGRESSION_PASS
```

`harbor-west-basin`/`harbor-east-basin` dimensions are byte-identical to Pass 4
(confirmed: absent from this diff entirely). The large ship, all four small boats, and
the warehouse/cargo-shed pair are likewise byte-identical (Section L). This is a pure
coordinate/collision corrective patch, exactly as the fix report describes — the
previously-approved `HARBOR_IDENTITY_READY_FOR_USER` composition is untouched in intent
and in data.

---

## L. Vessel Regression

```text
VESSEL_REGRESSION_PASS
```

Read all 5 vessel records directly from the current `worldLayoutData.json`:
`waterfront-boat (1160,1246)`, `harbor-large-ship (1420,1236)`,
`harbor-basin-boat (1720,1252)`, `harbor-cargo-boat (540,1244)`,
`harbor-offshore-boat (900,1256)` — every coordinate matches Visual Pass 4's shipped
values exactly (zero diff). The vessel-overlap guard and water-containment checks
(unchanged code, re-run via `npm test`) both still pass.

---

## M. Reserved Lots Regression

```text
RESERVED_LOTS_REGRESSION_PASS
```

`guild-annex-lot (700,360)`, `academy-library-lot (1440,352)`,
`workshop-studio-lot (1568,864)` — all three byte-identical to every prior pass
(confirmed: `reservedLots` array is absent from this diff). None are anywhere near the
relocated props or resized piers.

---

## N. QA

Re-ran independently:

| Check | Result |
|---|---|
| `npm ci` | PASS — 0 vulnerabilities |
| `npm run typecheck` | PASS |
| `npm test` | PASS — **7/7** (matches expected exactly) |
| `npm run build` | PASS — main JS 1,407.32 kB, gzip 365.77 kB |
| production preview | PASS — 200 OK, correct rebuilt asset hash (`index-J3llFWZa.js`) |
| `git diff --check` | PASS |
| `git status --short` | clean |
| `work-context.mjs` | `Git: clean` |

(Bundle size grew modestly from Pass 4's 1,405.83/365.31 kB — expected, given the new
`waterCollisionGeometry.mjs` module and wider pier records; not a concern for this
mockup-stage project.)

---

## O. Interactive Verification

```text
NOT_INTERACTIVELY_VERIFIED
```

No browser automation tool is available in this session (consistent with every prior
review in this project) and none of the fix's named evidence screenshots
(`/tmp/portfolio-world-pass4-fix-west-basin.png`, `-piers.png`) exist on this machine —
the focused-fix report itself already disclosed this ("the local execution environment
did not expose a browser automation binary"). I did **not** perform a manual
walk-test of either pier. In place of interactive verification, Section G/H/J are backed
by direct execution of the actual production `createWaterCollisionRects()`/
`rectsOverlap()` functions against the real translated layout (shown in full above) —
this is a stronger form of evidence than a single screenshot would be for this specific
question (walkability is a collision-geometry fact, not primarily a visual one), but it
is not a substitute for an actual player walking the route, and I am not claiming that.

---

## P. Findings

No Blocker, Major, or Minor finding was identified. Both defects from the prior
independent review are confirmed fixed by direct evidence (Sections D, G, H, J), and no
regression was found in any of the areas checked (Sections K, L, M). The one soft
observation — `waterfront-viewing-lamp`'s zero-margin placement (Section D) — does not
rise to a finding: it is not an overlap, passes every actual check, and only becomes
relevant if a future pass nudges the basin or this lamp by even 1 px.

---

## Q. Final Recommendation

```text
PROCEED_TO_USER_VISUAL_FEEL_TEST
```
