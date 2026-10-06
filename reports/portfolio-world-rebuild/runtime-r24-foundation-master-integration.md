# Runtime R2.4 — Foundation Master B Runtime Integration

## Status

Human selection is recorded as **Foundation Master B / APPROVED**. The selected 1920×1080 RGBA base and its prepared vertical-structure slice now load in the actual `?canonical=2` Phaser runtime. R1 remains available at `?canonical=1`.

`FOUNDATION_MASTER_B_RUNTIME = IMPLEMENTED`

`OLD_ZONE_FOUNDATION_RUNTIME = DISABLED`

`COLLISION_GEOMETRY = UNCHANGED`
`R3 = BLOCKED`

## Runtime layer architecture

1. Existing render-only continuous water underlay and water assets (depth 4–19)
2. `r24-foundation-master-b` at native origin `(0,0)`, native scale, depth 20
3. `r24-foundation-master-b-vertical` at native origin `(0,0)`, depth 25
4. Locked Hall-B, Workshop-C, Office-B, Secondary-B, Workboat-A, Hero-B (30+)
5. Existing fixed 28×56 player and UI

The selected Master is visual-only. It is not passed to `enforceGeometry`, is not a collision mask, and cannot change movement. The R2.3 zone PNG renderer, visual land substrate, gangway foundation, R2.3 procedural wall/stair/quay overlay, and legacy zone asset loads are absent from the final R2.4 rendering path.

## Minor silhouette refinement

**Not required.** Actual-browser review showed the candidate’s transparent negative space was structurally intact. Rather than altering approved B, the existing render-only sheltered-water underlay was extended beneath the master’s lower transparent quay negative space. This preserves water continuity without changing a landmark, geometry, coverage JSON, collision, or master pixels. Evidence 09 records the no-change before/after state.

## Integration review

- **Hall:** Hall-B sits on the upper terrace with the master’s capstone, retaining wall, and stair as one structure; no duplicate stair remains.
- **Workshop / Office:** Workshop-C, the lower plaza, and Office-B share a single paved plane rather than separate zone cards.
- **Central / Hero Quay:** the heavy continuous quay faces support both the central harbor and Hero-B berth; vertical depth remains under all locked landmark layers.
- **Water:** shelter-water remains behind the master. The lower transparent silhouette now reads as water instead of a green fallback gap.
- **Hero:** Hero-B remains the clean single approved asset; no foreground crop, regenerated hull, or rigging substitute was added.
- **Player:** player-a remains fixed at 28×56 and is shown at P1 in overview. No character-design decision was made.

## Collision and interaction regression

Geometry parity, water polygons, obstacle polygons, P1–P8, player body, camera, and routes A–D remain R1-equivalent. Automated tests verify Master B is loaded, A is not, legacy visual assembly is absent, and `enforceGeometry` contains no master or coverage reference. Existing interaction logic and four destination prompts remain unchanged.

## Comparisons and remaining gap

R2.4 removes the assembled-zone visual language visible in R2.3, replacing it with a single coherent terrace/stair/lower-plaza/quay construction. Canonical Projection A remains the spatial and architectural reference; it is not used as a scene plate.

The largest remaining gap is intentionally out of scope: scenic richness and prop dressing (town, foliage, lamps, benches, ropes, bollards, fountain, etc.). R3 remains blocked until a human closes this actual-runtime Foundation gate.

## Evidence

All R2.4 runtime views were captured from the local actual Chrome browser runtime.

- [01 — overview](evidence/runtime-r24-foundation-master-integration/01-r24-runtime-overview.png)
- [02 — Hall](evidence/runtime-r24-foundation-master-integration/02-r24-hall.png)
- [03 — Workshop and Office](evidence/runtime-r24-foundation-master-integration/03-r24-workshop-office.png)
- [04 — Central Quay](evidence/runtime-r24-foundation-master-integration/04-r24-central-quay.png)
- [05 — Hero Quay](evidence/runtime-r24-foundation-master-integration/05-r24-hero-quay.png)
- [06 — geometry debug](evidence/runtime-r24-foundation-master-integration/06-r24-debug.png)
- [07 — Canonical versus R2.4](evidence/runtime-r24-foundation-master-integration/07-canonical-vs-r24.png)
- [08 — R2.3 versus R2.4](evidence/runtime-r24-foundation-master-integration/08-r23-vs-r24.png)
- [09 — B minor-refinement before/after](evidence/runtime-r24-foundation-master-integration/09-b-before-after-minor-refinement.png)

## Gate

`READY_FOR_R2_4_RUNTIME_HUMAN_VISUAL_GATE`

Questions for human review: does the foundation now read as one harbor construction; do Hall terrace/wall/stairs connect; do Workshop/Office/Lower Plaza connect; do both quays read structurally; is Hero-B grounded; and is the asymmetric composition preserved?
