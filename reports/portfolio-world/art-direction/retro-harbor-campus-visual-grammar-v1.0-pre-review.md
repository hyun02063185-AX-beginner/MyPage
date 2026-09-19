# Retro Harbor Campus — Visual Grammar / Art Bible v1.0 — Independent Pre-review

> Canonical repo path:
> `reports/portfolio-world/art-direction/retro-harbor-campus-visual-grammar-v1.0-pre-review.md`

Reviewer: Claude Code (independent pre-production reviewer). Scope: review only. No runtime code, production asset, or
existing PNG was modified; the Art Bible draft was not rewritten. All measurement scripts and reconstructions ran from the
session scratchpad, outside the repository.

---

## A. Gate

```text
READY_WITH_FIXES
ART_BIBLE_FIX_REQUIRED
```

The Art Bible is fundamentally compatible with the runtime and the previously locked "practical mixed grammar". It is
**not yet precise enough to lock**: the projection wording does not describe what the runtime actually does, the
"one side facade visible" rule cannot hold with the world's axis-aligned layout, the scale table has an undefined unit and
disagrees with runtime for several categories, and the depth grammar cannot be produced by the current fixed-depth
renderer. All are targeted clarifications, not a rework. The calibration plan itself is sound and should proceed once the
fixes in section AI are absorbed.

Mass asset production must remain on hold (unchanged).

---

## B. Work Context

| Item | Value |
| --- | --- |
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | `win32 x64` (Windows 11 Pro 10.0.26200) |
| Branch | `feature/portfolio-world-sprint-02` (expected branch — matches) |
| HEAD at start | `014386d docs(portfolio-world): review harbor scale and fleet refinement` |
| Git status at start | dirty, untracked only (see below) |
| Node / npm | `v24.16.0` / `11.13.0` |
| Environment/machine switch | none detected |

Untracked at start (none staged or modified by this review):

```text
reports/art-direction/                                         (contains the Art Bible draft itself)
reports/portfolio-world/art-asset-phase-01/00-director-gate.md
reports/portfolio-world/art-asset-phase-01/01-asset-strategy.md
reports/portfolio-world/art-asset-phase-01/03-director-gate.md
reports/portfolio-world/art-asset-phase-01/06-human-asset-slice-review.md
reports/portfolio-world/visual-pass-05/05-human-visual-feel-test.md
```

**Path note (VG-15):** the instruction expected the Art Bible at
`reports/portfolio-world/art-direction/retro-harbor-campus-visual-grammar-v1.0.md` (the path the draft itself
recommends). It exists only at `reports/art-direction/retro-harbor-campus-visual-grammar-v1.0.md`, untracked. The review
was performed against that file. The expected path holds only the already-committed Art Direction v1.0.

---

## C. Sources Reviewed

Read in full: the Art Bible draft; `retro-harbor-campus-art-direction-v1.0.md`; `07_ASSET_POLICY.md`; `91_STATUS.md`;
`90_DECISIONS.md`; `02_WORLD_IA.md`; `03_REQUIREMENTS.md`; `04_ARCHITECTURE.md`; `06_QA_RELEASE_POLICY.md`;
`08_ENVIRONMENT_POLICY.md` (first part); phase records `06` and `07`; runtime files `gameConfig.ts`, `WorldScene.ts`,
`BootScene.ts`, `worldLayout.ts`, `worldLayoutData.json`, `worldAssetManifest.ts`, `visualPalette.ts`,
`waterCollisionGeometry.mjs`, `layoutTransform.mjs`, `Player.ts`, and the building/prop drawing sections of
`harborVisualCatalog.ts`.

Read by targeted excerpt (grep plus the relevant sections), not end-to-end: phase records `00`, `01`, `02`, `03`, `04`,
`05`, `08`; `92_HANDOFF.md` (tail only); `streetscapeVisuals.ts` (depth/shadow grep only).
`drawWarehouse` / `drawCargoShed` / `drawTree` bodies were not opened in detail; their footprints come from layout data.

Not read: `05_AI_WORKFLOW.md`, `00`/`01` project docs (not in the requested list). No expected file was missing.

Direct asset inspection: opened Hero A, C, D and Exhibition Hall visually; measured all eight harbor PNGs (A–D, brig,
schooner, cutter, Exhibition Hall) with Pillow/NumPy for alpha, content bounds, colour and compressed weight. Not opened
visually: hero B, brig/schooner/cutter (measured numerically; brig and cutter seen in the reconstruction). `dock/` and
`water/` asset folders are empty, so there are no dock or water PNGs to inspect.

**Limits of this review's visual evidence.** No live browser session was run (a prior session recorded Vite dev-server
`EACCES`). I built a scale-accurate reconstruction of the harbor viewport (1024 × 576 window at the `assetPreview=harbor`
framing) from layout data and manifest values, using the runtime's NEAREST sampling. It is faithful to sizes, anchors and
draw order but is not a screenshot of the running game.

---

## D. Current Runtime Perspective

### D.1 Measured runtime values

| Item | Value | Source |
| --- | --- | --- |
| Viewport / logical surface | 1024 × 576, `Scale.FIT`, `pixelArt: true`, `roundPixels: true`, camera zoom 1 (no resolution/DPR scaling configured) | `gameConfig.ts` |
| World | 2048 × 1280 (64 × 40 LU) | `gameConfig.ts` |
| `LOGICAL_UNIT` (LU) | 32 px | `gameConfig.ts` |
| Player | 24 × 32 programmatic rectangle (0.75 × 1.0 LU), centre-anchored, **placeholder** — final sprite deferred | `Player.ts`, Art Direction §22 |
| Hero Ship D | canvas display 395 × 263; **content** (alpha ≥ 128) ≈ 357 × 247 (11.2 × 7.7 LU); logical footprint 280 × 80 unchanged | manifest + measurement |
| Secondary vessels | brig canvas 188 × 125 → content ≈ 128 × 113 (4.0 LU); schooner 205 × 137 → ≈ 177 × 129 (5.5 LU); cutter 145 × 97 → ≈ 93 × 91 (2.9 LU) | manifest + measurement |
| Programmatic small boats | 80–112 wide × 32–48 (2.5–3.5 LU wide) | layout data |
| Exhibition Hall | canvas display 340 × 227, content ≈ 324 × 196 (10.1 × 6.1 LU); collision footprint 256 × 128 (8 × 4 LU) | manifest + layout |
| Other destinations | programmatic, 256 × 128 footprint each | layout |
| Warehouse / cargo shed | programmatic; 160 × 96 (warehouse, collidable) / 80 × 56 | layout |
| Dock | 448 × 64; piers 160 × 32; service jetty 144 × 32 | layout |
| Props | crate 40–48 × 32–40; barrel 28 × 36; bench 56–64 × 24; planter 48 × 40; lamp 24 × 48; tree 48 × 64 | layout |

Draw depths: ground `-4`, edge `-2`, water `0`, paths `1`, plaza `2`, programmatic buildings `4`, Exhibition Hall PNG `5`,
programmatic props/docks `6`, D and all secondary vessels `7` (creation-order tie-break), labels `8`, player `11`/`12`.
There is no y-sorting anywhere.

### D.2 What perspective grammar the project actually uses

Confirmed by code and by opening the assets; this matches the grammar the Director gate locked
(`03-director-gate.md` "Perspective grammar") and the earlier strategy review (`02-…`, §Q / AAP-04):

1. **Ground, paths, plaza, water, dock deck** are drawn in true **plan view** on a square 32 px grid — no foreshortening
   at all.
2. **Programmatic buildings** are **flat front elevations** (rectangle wall + triangle/flat roof band), yaw 0, no side face.
3. **Exhibition Hall PNG** is a frontal facade, yaw 0, bilaterally symmetric, with pitched roof planes visible above and
   entrance steps visible below. No side face.
4. **Ships** are elevation-style broadside silhouettes. **Hero D is not at yaw 0**: it is rotated roughly 3/4 with the bow
   toward the camera (bow low-left, stern deck raised on the right), with about 40 % of the image as deck (`08…` HRF-01).
   A and B show a narrow deck strip; C is near pure side profile.
5. Nothing anywhere is dimetric or isometric: no rotated grid, no diamond footprints. The world layout is entirely
   axis-aligned rectangles.

So the practical grammar is **plan-view ground + camera-facing elevation objects with a visible top surface** — the
classic RPG 3/4 convention. It is a deliberate non-physical hybrid (a strict orthographic camera at 15–30° would
foreshorten the ground by sin E = 0.26–0.50; the runtime does not).

**This explains the human's "ships feel inconsistent with buildings/world".** Two variables differ between D and the
Hall, not one: **elevation** (D visibly higher) **and yaw** (D 3/4-turned, Hall frontal). A calibration that varies only
elevation would not remove the mismatch. See G, H, VG-02.

---

## E. Projection Grammar

```text
PROJECTION_GRAMMAR_NEEDS_REFINEMENT
```

The draft's `ORTHOGRAPHIC / DIMETRIC-STYLE PRESENTATION` and "environment: top-down / slight-isometric reading" are
imprecise and partly misleading:

- "Dimetric" implies a yawed camera and a rotated grid. The runtime has neither and the layout is rectilinear; an AI or
  artist following "dimetric" would produce diamond-footprint buildings that do not sit on the existing axis-aligned
  footprints.
- It never states that the ground stays in plan view — the single most consequential rule for making assets sit on it.
- It departs from the wording the Director already locked (mixed grammar), without saying so.

Not `INCORRECT`: the intent (orthographic-feeling, no vanishing point, consistency over purity) is right.

**Exact replacement wording for §3:**

```text
PROJECTION = RPG 3/4 HYBRID (plan-view ground + elevated-elevation objects), orthographic, horizon-free.

1. Ground plane — grass, paths, plaza, water, dock/pier decks — is drawn in true plan view on the 32 px logical grid,
   with no foreshortening.
2. Every standing object — ship, building, tree, prop — is drawn as an orthographic elevation seen from ONE fixed
   camera elevation E above the horizon (section 4) and ONE fixed yaw (section 6). Its top surface (roof / deck /
   lid) is visible, foreshortened by E.
3. There are no vanishing points, no horizon, and no size change with screen-y. Objects do not shrink or converge
   with distance.
4. This is not isometric and not dimetric. Do not rotate footprints; do not draw diamond bases.
5. The angle E applies to object bodies only. It is not applied to the ground plane.
```

---

## F. Camera Elevation Convention

```text
ANGLE_CONVENTION_NEEDS_EXPLICIT_AXIS_DEFINITION
```

"0° = horizontal, 90° = vertical top-down" is unambiguous at its endpoints, but the draft never says *what* is measured.
Risks: image tools and 3D packages disagree (Blender camera pitch 90° is horizontal; "isometric 30°" is common shorthand
for a different construction), and "15° tilt" is often read as tilt-from-vertical.

**Add to §4:**

```text
CAMERA_ELEVATION = angle E between the camera view direction and the horizontal ground plane
                   (E = 0° looking level at the object, E = 90° looking straight down).
                   Not tilt-from-vertical. Not a rotation of the object. Independent of yaw.
```

**Add measurable proxies** (a locked angle that cannot be verified is not lock-able). For an orthographic camera at
elevation E:

| E | ground-circle ellipse ratio (minor/major = sin E) | box top-face ÷ front-face height (for a unit cube = tan E) | vertical heights shrink (cos E) |
| --- | --- | --- | --- |
| 15° | 0.26 (≈ 3.9 : 1) | 0.27 | 0.97 |
| 22.5° | 0.38 (≈ 2.6 : 1) | 0.41 | 0.92 |
| 30° | **0.50 (exactly 2 : 1)** | 0.58 | 0.87 |

The 30° row is the classic 2 : 1 pixel-art ellipse. This is a decision aid only; no angle is chosen here.

---

## G. Calibration Angles

```text
CALIBRATION_ANGLES_KEEP_15_22_5_30
```

- **Distinct enough?** On measurement primitives, yes: top-face ratios step ×1.5 and ×1.4. On painterly generated assets a
  7.5° step will be hard to see and hard to hit reliably — which is why the primitives (section AC/AE) matter, not a
  different angle set.
- **15° too low?** Not for ships: with a typical beam/side-height near 2 : 1, the deck band is still ≈ 0.5 of the hull side
  at 15°. It sits at the A/B end of what the human called acceptable. Its risk is buildings whose roofs nearly vanish, which
  the Hall already partly shows.
- **30° too high?** It brackets D (D reads roughly at or above this range per `08…` HRF-01), so it is a correct upper bound
  for "too steep". Its cost is a bigger visual jump against a plan-view ground.
- **15/20/25?** Would drop the upper bracket that reproduces D's perceived problem and would not test the 2 : 1 case. No
  benefit.

Two conditions to attach: (1) each sample must verify within about ±2.5° on the primitives, otherwise the three "angles"
are not actually three angles; (2) yaw must be held at one value across all three (H).

---

## H. Camera Yaw

```text
INHERIT_CURRENT_YAW_AND_DOCUMENT
```

Yaw is not a free calibration variable here: the ground grid, paths, forecourts, collision footprints and all destination
rectangles are axis-aligned, so any yaw ≠ 0 makes assets misalign with the ground they stand on (or forces a rotated
world — a redesign). The current yaw is therefore derivable from the world:

**Derivation of the canonical visible side:**

```text
World is axis-aligned, north-up; the camera is south of the scene looking north; yaw = 0 relative to world axes.
- The visible (camera-facing) facade of every building is its SOUTH face. The entrance of every destination is placed on
  that face (matches: paths approach destinations from the plaza side; the Hall's entrance/steps face south).
- Ships lie along the east–west axis with the SOUTH-facing hull side toward the camera (broadside). Bow points west or
  east; this is a per-vessel facing, not a camera property.
- Props' camera-facing side is south.
```

**Consequence the Art Bible must resolve (VG-02):** with yaw 0 no side face is visible, so §7.2's "one side facade
consistently visible" is impossible as written. The Hall (yaw 0, no side) already obeys yaw 0; **D does not** (3/4 turned).
Recommended replacement: remove the side-facade requirement; convey depth by roof, eaves, steps and contact shadow. If the
Director instead wants a visible side plane, that is a *yaw redesign* and must be an explicit, separate calibration decision
with the ground plane's consequences stated — not an implicit property of the elevation test.

The draft's "do not mirror" rule (§6) also conflicts with existing runtime — see VG-08.

---

## I. Ship Surface Grammar

```text
SHIP_SURFACE_GRAMMAR_NEEDS_REFINEMENT
```

The list (hull side dominant, deck secondary, vertical masts, readable sails, distinguishable bow/stern, prohibit pure
profile and bird's-eye) is right in spirit but is not measurable and does not prevent the D-style yaw drift.

Proposed practical wording (AI-generation friendly):

```text
Broadside ship view from slightly above. The ship's long axis is horizontal in the image (bow left or right, never toward
the camera). The camera-facing hull side is the dominant surface; the deck appears as a foreshortened band above the near
rail, never as a full plan. Masts are vertical. Sails are flat vertical panels with no perspective convergence. Bow and
stern are told apart by silhouette (bowsprit/figurehead vs raised stern deck), not by fine detail.
Measured: deck-band height ÷ hull-side height = [locked at calibration].
```

Hero ships may show slightly more upper structure than small boats (keep). Note D currently violates "bow never toward the
camera"; whether that is acceptable is exactly the yaw decision.

---

## J. Building Surface Grammar

```text
BUILDING_SURFACE_GRAMMAR_NEEDS_REFINEMENT
```

- **"Primary facade" vs "front facade":** "primary facade" is the better canonical term *if defined*, because "front" is
  ambiguous between "faces the camera" and "has the door". Define: *the camera-facing (south) facade, which always carries
  the entrance.* Then "entrance direction = readable" becomes automatic rather than a separate check.
- "Roof partially visible": keep. The Hall's roof is roughly the top 40 % of its content height — a usable reference
  band; lock the ratio at calibration (`BUILDING_TOP_FRONT_SIDE_RATIO` should become `BUILDING_TOP_FRONT_RATIO` under yaw 0).
- "One side facade consistently visible": remove or re-scope per H.
- Prohibitions are good. Add: "no mixed viewing sides between buildings" is already implied; keep.

---

## K. Props Grammar

```text
ADD_PROP_CATEGORY_RULES
```

Minimal additions only. Current rules cover crate, barrel, bench, lamp but not **trees** or **signs**, which the review
prompt and runtime both use (`academy-tree`, harbor sign, flags, banners, notice boards). Also "crate: top + front + side"
conflicts with yaw 0.

```text
crate/box:   top + front (no side face at yaw 0)
barrel:      top ellipse (ratio sin E) + body
bench/table: seat top + front structure
lamp/post:   ground contact + vertical body + readable fixture; drawn vertical, no lean
tree:        trunk base at the ground contact; canopy as a rounded volume with a visible top; no perspective distortion
sign/flag/banner/board: camera-facing vertical panel; frontal, no perspective; thickness implied, not drawn
All props: same E and yaw as buildings; ground contact point is the anchor; no baked cast shadow.
```

---

## L. Scale Reference Model

```text
USE_LOGICAL_UNIT_REFERENCE
```

"PLAYER = 1.0" has three defects against the runtime:

1. **Undefined dimension.** The player is 24 wide × 32 tall. Ratios differ by 33 % depending on which is meant.
2. **The reference is a placeholder.** The player rectangle has no final art; Art Direction §22 defers it. A master unit
   that may change silently rescales every category.
3. **The player is not the unit the world is built on.** The 32 px `LOGICAL_UNIT` is the grid cell, the layout unit, and
   the player's height — `PLAYER_HEIGHT === LOGICAL_UNIT` today.

Recommendation: **1.0 = 1 LU = 32 px.** State that the player's height is currently exactly 1.0 LU, so the "player as human
yardstick" intuition is preserved without depending on it. Keep "human-scale anchors" as *sanity checks* (door height,
rail height, plank width in player-heights), not as the definition. A hybrid (player *and* LU *and* per-category) would add
a second source of truth for no benefit.

---

## M. Scale Ranges

```text
REPLACE_WITH_CATEGORY_DIMENSION_RULES
```

Comparison of the draft table against runtime, measuring "long axis width in LU" on **content bounds** (see VG-04 for why
canvas size is not the right measure):

| Category | Draft range | Runtime evidence | Fit |
| --- | --- | --- | --- |
| crate / small prop | 0.4–0.8 | crates 1.25–1.5 LU wide; barrel 0.9 × 1.1 | **no — runtime props are ~2× larger** |
| bench / planter | 0.8–1.5 | bench 1.75–2.0; planter 1.5 | bench no, planter edge |
| small working boat | 2.5–4.0 | programmatic 2.5–3.5; cutter content 2.9; brig content 4.0 | yes (brig/cutter classification ambiguous) |
| medium sailing vessel | 5.0–7.0 | schooner content 5.5; brig 4.0; cutter 2.9 | only the schooner fits |
| hero ship | 8.0–10.0 | D 11.2; A 10.4; (B 13.3, C 15.6 rejected) | **no — D and A both exceed** |
| warehouse | 7.0–10.0 | 5.0 (programmatic footprint) | **no** |
| destination building | 9.0–13.0 | Hall 10.1 (content); other destinations 8.0 (programmatic) | Hall yes, others no |

The table's numbers are mostly consistent with *canvas width in LU* for ships and the Hall and inconsistent everywhere
else, i.e. it was written without a stated measure. Revising numbers alone would re-create the ambiguity. Recommended
minimum schema:

```text
category | measured dimension | unit=LU(32px) | min–max | reference asset | tier
```

with **measured dimension defined per category on content bounds (alpha ≥ 128), not canvas**:

- ships: hull/long-axis length (content width, bowsprit included); optionally mast-top height
- buildings: primary-facade width and visible content height
- props: ground-footprint width
- ground assets: plan size in LU

Ranges should be filled in at the calibration gate, seeded from the runtime values above; they are not locked here.

---

## N. Building-to-Ship Ratio

```text
BUILDING_SHIP_RATIO_RULE_NEEDS_DEFINITION
```

The draft only says buildings "should feel structurally important and plausible beside the hero ship". Human direction
(D acceptable; buildings somewhat larger) should be encoded as **relations plus independent human-scale anchors**, so it
does not overfit one screenshot:

```text
R1  destination_facade_width : hero_hull_length     = [band, set at calibration]
    (current evidence: Hall 10.1 LU : D 11.2 LU ≈ 0.9; human wants buildings "somewhat larger")
R2  hero_hull_length : medium_hull_length           = [band]
    (current: D 11.2 : schooner 5.5 = 2.0; D : brig 4.0 = 2.8; D : cutter 2.9 = 3.9)
R3  human-scale cross-checks, independent of any ship:
      door opening height  ≈ [n] player-heights     (Hall door ≈ 2 by eye; unmeasured)
      ship rail/bulwark    ≈ [n] player-heights
      dock plank/edge, bollard heights in LU
R4  ratios are measured on the calibration scene at final display scale, never from a single screenshot.
```

R3 is the overfitting guard: buildings and ships are each tied to the player, so they agree with each other through the
player rather than by tuning one against the other. No final building scale is chosen here.

---

## O. Anchor Rules

```text
ANCHOR_RULES_NEED_CATEGORY_DETAIL
```

The concepts (ship = hull/waterline, building = ground footprint / entrance-side base, prop = ground contact) are correct
and match current use (ships `originY 0.84`, Hall `0.91`, both `originX 0.5`). What is missing is the **encoding**.

Phaser's `setOrigin` is normalised to the *frame including transparent padding*, so an origin fraction is only meaningful
relative to a specific canvas. Measured content bounds:

| Asset | content w × h ÷ canvas | horizontal content-centre offset (source px) |
| --- | --- | --- |
| D | 0.90 × 0.94 | −2 |
| Hall | 0.95 × 0.86 | 0 |
| brig | **0.68** × 0.90 | **+46** |
| schooner | 0.86 × 0.94 | +24 |
| cutter | **0.64** × 0.94 | +20 |

Consequences: (a) `originY` in the manifest is an eyeballed fraction, not a defined anchor pixel; (b) `originX` is assumed
0.5, but the brig's content centre is 46 source px (≈ 5.6 display px) off it, so the mirrored east brig lands ≈ 11 px
displaced from where the west brig sits relative to its layout anchor (`setFlipX` mirrors about the frame centre).

Add per category: ship anchor = **waterline contact point at the hull's horizontal centre** (not keel, not canvas centre);
building anchor = **centre of the camera-facing base line**; prop anchor = **ground contact centre**; record the anchor as
a **pixel coordinate** (`anchorX`, `anchorY`) in the manifest, and require `anchorX = 0.5` (or use `1 − anchorX`) for any
asset that may be flipped. Phaser compatibility: confirmed — origin math is unchanged; only the manifest source of the
fraction changes. Note the future player sprite should use a feet anchor (the placeholder rectangle is centre-anchored).

---

## P. Visual / Collision Bounds

```text
VISUAL_COLLISION_RULE_READY
```

§11 preserves `visual bounds ≠ collision bounds`, states transparent pixels and overhangs never define collision, and keeps
collision as explicit world data. This matches runtime: collision is built from `worldLayoutData.json` rectangles and
`waterCollisionRects`; images have no physics bodies (`createEnvironmentalCollision`). No change needed. One coupling to
watch, not a rule fault: enlarging the Hall art reveals that its roof now extends past the collision footprint (see VG-05).

---

## Q. Lighting Schema

```text
LIGHTING_SCHEMA_TOO_COMPLEX
```

Runtime evidence: the programmatic art contains **no baked shadow and no light direction** (grep confirms none), so light
direction cannot be inherited from the world — it is a genuine new decision. The draft's seven parameters (eight in the
review prompt) mix two different things:

- **What an artist/generator can control in a painted PNG:** key-light direction, key-light elevation (coarse), warmth, and
  a value-contrast cap. Fill level and ambient brightness are baked and not separately controllable or verifiable.
- **What the runtime controls if a shadow is drawn:** shadow direction/offset, opacity, softness.

Recommended minimum, split accordingly:

```text
BAKED (per asset):   key direction (screen-space, e.g. "upper-left"), key elevation (high/mid), warmth, value-contrast cap
RUNTIME (once, shared): contact-shadow shape, offset direction, opacity, softness
```

Elevation is genuinely missing from the draft and should be present; fill/ambient/softness-per-asset should not be
required. Not `NEEDS_MORE_FIELDS`, because the correct fix is a smaller, better-split schema.

---

## R. Baked vs Runtime Lighting

```text
BAKED_LIGHTING_WITH_SIMPLE_RUNTIME_SHADOW
```

The world is a PNG/programmatic mix with no lights, `pixelArt: true`, no normal maps, and a Phaser bundle already flagged
for size. Painted shading is baked; **cast shadows are not baked** (they break under overlap, mirroring and depth sorting);
grounding comes from one shared runtime contact shadow. No dynamic-lighting recommendation is justified by evidence.

---

## S. Day / Night Readiness

```text
DAY_NIGHT_PREP_NEEDS_REFINEMENT
```

§20 asks to separate "base material colour / day profile / night profile". In a baked-shading PNG world that separation
cannot be performed or verified, so as written it is an aspirational statement, not a rule. Smallest future-safe rule:

```text
1. No baked cast shadows, no baked glow/halo, no baked vignette or sky/water reflection in the asset.
2. Emissive elements (lamp light, lit windows) are identifiable as separable pixels/regions.
Everything else is deferred until day/night is actually scoped.
```

Evidence for why rule 1 is needed: D, C and the Hall were generated with golden glow/halo backgrounds that survive as
low-alpha pixels (VG-07). Rule 2 is optional if it costs anything now.

---

## T. Palette

```text
ADD_VALUE_SATURATION_RULES
```

`visualPalette.ts` is a suitable colour-language reference (small static list; keep it). The generated assets harmonise
with it at the hue level — most median-cut colour mass lands within RGB distance ≈ 9–40 of a named palette entry
(e.g. Hall cream ≈ `wall` 14, roof ≈ `dockWood` 29, navy/teal ≈ `ink` 17); only the near-black clusters fall outside
(distance ≈ 59–63 to the nearest entry) — but they leave the palette's **value and saturation envelope**:

| | palette entries | Hero D | Hall | brig |
| --- | --- | --- | --- | --- |
| 5th-percentile value (V) | darkest entry ≈ 0.27–0.29 (`ink`, `shipHull`) | **0.12** | 0.21 | **0.10** |
| 95th-percentile saturation (S) | non-water max ≈ 0.61 | **0.85** | 0.76 | 0.70 |

Near-black shadows and high-chroma gold/teal are what make the assets read as separate paintings next to flat programmatic
neighbours (also noted as AAP-06). No token system is needed; add two numbers: **a value floor** and **a saturation cap**
(non-water), set at calibration, plus the existing "harmonise, do not invent" rule.

---

## U. Material Language

```text
MATERIAL_LANGUAGE_NEEDS_ADDITIONS
```

§16 lists seven materials but defines only three (water, wood, stone). Greenery, fabric/sail, metal accent and
plaster/painted facade have no treatment. Add one line each, tied to palette entries, for example: sail = `sail` palette,
flat panels with seam lines, no translucency or painterly billowing highlights; metal accent = `shipTrim` gold only for
trim, small area share; greenery = `greenery`/`greeneryLight`, rounded masses, no leaf detail; facade = `wall`/
`exhibitionAccent`, flat planes with 2–3 tone steps. Water should say "flat-plan, matches the plan-view rule" explicitly.

---

## V. Silhouette

```text
SILHOUETTE_RULE_READY
```

The priority order is sound and tied to a verifiable outcome ("if it disappears at runtime size it carries no identity").
Its test lives in W. Minor addition, optional: pair each category with "its silhouette must identify it as a solid fill".

---

## W. Detail Density

```text
ADD_RUNTIME_READABILITY_TEST
```

Evidence: the runtime renders 1536 × 1024 sources at scale ≈ 0.257 with **NEAREST** sampling (`pixelArt: true`). One
display pixel therefore samples one of ≈ 15 source pixels; rigging lines a few source pixels wide fall below one display
pixel and alias (visible as grain in the reconstruction, compared with smooth downscaling). Detail beyond what survives
this is cost with no readability. The generated set is also painterly/glowing versus the Art Direction's "16-bit-inspired"
target — the Bible's own Avoid list names "hyper-detailed painterly rendering"; the current calibration assets show that
style (VG-09).

Recommended production test, no invented thresholds:

```text
1. Export the asset at its final display size (runtime scale 1.0 or an integer reciprocal — see VG-06) and place it in the
   calibration scene at 1024 × 576.
2. Squint/greyscale pass: the silhouette must identify the category as a solid fill.
3. Feature pass: every element that carries identity must be visible at that size; anything that is not is removed.
4. Fail if the result relies on lines finer than 1 display pixel.
```

A minimum-feature rule then falls out of exporting at display size (1 display pixel is the floor) rather than needing a
made-up number. `ADD_MIN_FEATURE_SIZE_RULE` is deliberately not chosen.

---

## X. Depth / Occlusion

```text
DEPTH_ARCHITECTURE_CHANGE_REQUIRED
```

Small change, but real, and confirmed against runtime:

- The draft's layer list (water … "ship hull/building body" … "upper ship/roof" … foreground details) omits the **player**
  and implies two-part assets (body + upper). Assets are single PNGs.
- Runtime depth is **fixed per class** and creation-order for ties: Hall `5`, props `6`, vessels `7`, **player `11`**.
  Consequences, each verifiable from code and layout data:
  1. **Player over roofs.** The Hall art spans y ≈ 817–1024; its collision footprint is y 896–1024. The `path-south`
     approach ends at the collision top edge (y ≈ 896), so the player's normal stopping position is drawn on top of the
     Hall roof (depth 11 > 5) although in a 3/4 view the player is behind the building.
  2. **Rear vessel over hero.** In the reconstruction the east brig (anchor y ≈ 1048, further north, so *behind*) is drawn
     **over D's mid sails** (anchor y ≈ 1158), because both are depth 7 and the brig is created later. The brig's canvas
     lies entirely inside D's canvas. Logical rectangles do not overlap (this is what the prior review checked), but the
     visual envelopes do.
  3. Player also draws over labels and every ship/tree.

Recommended grammar to put in the Bible (§21): fixed low layers (ground `< 0`, water, paths/plaza/dock decks, edge), then
**one y-sorted layer for every standing object including the player, sort key = anchor y** (feet / waterline / base line),
then labels, then HTML/UI. This is an explicit level list, but it cannot be produced by the current renderer, hence the
token. The code change (depth = anchor y for tall objects and player) is a few lines, needed **after lock** and before a
dense town of tall assets; it is not needed to run the calibration gate. Runtime change to be decided by the Director — not
made here.

---

## Y. Harbor Composition

```text
HARBOR_COMPOSITION_RULE_READY
```

The qualitative rule (hero + several medium + small working boats + berthing where justified + support structures +
negative water) matches the human direction and the current implementation (1 hero, 4 secondary, 4 small, dock + 2 piers +
service jetty). Numbers are correctly left open by §34. Two tightening notes that do not change the token: the composition
test should evaluate **visual envelopes** (sails/masts), not logical vessel rectangles (see X.2), and "negative space" will
eventually want a measurable definition once the Director settles fleet count.

---

## Z. Randomization Preparation

```text
DEFER_RANDOMIZATION_DEFINE_BERTHING_SLOTS
```

Nothing to implement. To keep the option safe, the Art Bible should define only the vessel-side contract that a slot needs:

```text
Berthing slot = { id, anchor point, allowed vessel classes, facing (bow left/right), max content extent (LU), depth key }
```

which requires exactly what sections H, M and O already fix: a canonical facing, content-bounds sizing per class, an
encoded anchor, and a mirroring policy (VG-08). No additional randomization content is warranted.

---

## AA. Asset Metrics / Weight

```text
ASSET_METRICS_RULE_NEEDS_MORE_FIELDS
ADD_CATEGORY_ASSET_WEIGHT_BUDGET
```

### AA.1 Metrics

The Bible requires source dimensions, display dimensions, runtime scale, file size. The manifest currently holds source and
display dimensions and `originY` only; file size lives in prose reports. Missing to make the scale rules enforceable:

```text
category, content bounds (px, alpha ≥ 128), content size in LU, anchorX/anchorY (px), export scale, file size (bytes)
```

Runtime scale is derivable and need not be stored.

### AA.2 Weight — measured, not assumed

Experiments on copies in scratchpad; repository assets were not touched. Production set = D + Hall + brig + schooner +
cutter:

| Variant | Total bytes |
| --- | ---: |
| Current files as committed | 8,557,016 |
| Same pixels, RGB zeroed where alpha = 0 (lossless for display) | 5,551,274 (−35 %) |
| + crop to content | 5,533,046 |
| Export at 2 × display size, RGBA | 1,068,592 (−88 %) |
| Export at 1 × display size, RGBA | **315,072 (−96 %)** |
| Export at 1 × display size, 256-colour palette | 73,629 (−99 %) — visual fidelity **not checked** |

Per asset at 1 × display RGBA: D 135,725; Hall 116,097; schooner 29,425; brig 21,353; cutter 12,472 → about 0.9–1.5 bytes
per canvas pixel. Because the internal canvas is fixed at 1024 × 576 with no DPR/zoom configuration, a source larger than the
display size adds cost and NEAREST aliasing but no visible detail.

### AA.3 Should a budget be locked before mass production?

Yes — the lock list already contains `ASSET_SIZE_BUDGET`, and the volume ahead (Art Direction §15: 6–10 primary,
15–25 secondary, 30–50 detail objects) at today's ≈ 1.4–2.2 MB each would be tens of MB. The Bible's §25 "optimize after
visual approval" does not work at that volume. The evidence supports **derived provisional ceilings**, to be confirmed by
the Director at the calibration lock (they depend on the chosen export scale):

```text
Lossless RGBA at final display size — rule of thumb ≤ ~1.5 bytes per canvas pixel.
Provisional ceilings (≈ 1.5 × measured at 1 × export):
  hero ship / large building   ≤ 200 KB
  medium vessel                ≤  50 KB
  small vessel                 ≤  25 KB
  props / trees / signs        ≤  10 KB   (extrapolated, not measured)
Initial-load PNG total for the current harbor scope ≤ ~1 MB (today 8.56 MB).
```

If the Director prefers to keep the budget open until calibration, the fixed fact still stands: hygiene (zero hidden RGB,
crop, export at display size) is mandatory rather than "after approval".

---

## AB. Alpha / Provenance / Naming

### AB.1 Alpha edge

```text
ALPHA_EDGE_RULE_NEEDS_EXPANSION
```

The four-corner test passes on all eight assets (all corners alpha 0), so it is being met — and it is insufficient:

| Asset | alpha > 0 touches a canvas edge | hidden RGB under alpha 0 | alpha 1–31 halo band |
| --- | --- | --- | --- |
| A | left, top | 0 % | 5.5 % |
| B | bottom | 45 % | 6.8 % |
| C | top, right, bottom | 37 % | 11.7 % |
| D | left, bottom | 44 % | 4.7 % |
| Hall | left | 32 % | 1.8 % |
| brig | bottom | 47 % | 2.9 % |
| schooner | bottom | 50 % | 3.4 % |
| cutter | bottom | 44 % | 2.1 % |

Findings: near-transparent glow/halo pixels reach the canvas edge (so padding is not real padding); ≈ 32–50 % of most
canvases carry meaningless RGB (this is the −35 % in AA.2); A is the only asset with clean hidden RGB but has visible
fringing (`05…`). The halo is not visibly harmful over the runtime water in the reconstruction (alpha ≤ 12 %), so this is a
hygiene/weight/future-lighting issue, not a live visual defect.

Expand §26 to: (1) transparent margin of N px on all four **edges** (not only corners), N set by the padding convention;
(2) RGB zeroed where alpha = 0; (3) no baked halo/glow band — alpha 1–31 area capped; (4) composite test over water, grass
and stone before acceptance; (5) fringe check.

### AB.2 Provenance / naming

```text
PROVENANCE_NAMING_RULE_NEEDS_ALIGNMENT
```

Aligned: `generated-original` provenance, kebab-case `name-vNN.png`, no provider/model in filenames, `CONCEPT`→… status
vocabulary mirrored from `07_ASSET_POLICY.md`, `BASE_URL`-safe paths.

Misaligned/small gaps:
- `07_ASSET_POLICY.md` categories are `character/ tilesets/ buildings/ props/ effects/ ui/ audio/`; the Bible and manifest
  use `harbor/{ship,buildings,dock,water}`. `ship/` and `water/` are not policy categories. Decide once whether the manifest
  category or the folder is authoritative.
- `07` metadata lists "modification status" and "original" (source) — the manifest has neither; `sourceType` and `provenance`
  are always identical (redundant).
- The Bible's allowed provenance list (`generated-original / project-owned / user-created / licensed-third-party`) is wider
  than the manifest's type (`"generated-original"` only); widen the type when a second class is first needed.
- Bible §28 example `warehouse-harbor-v01.png` is category-last while others are category-first; pick one pattern.

---

## AC. Calibration Set

```text
CALIBRATION_SET_EXPAND
```

The proposed eight-item set under-tests three things: it has no way to *measure* an angle, no small working boat (the
bottom of the ship hierarchy and a 2.5–4 LU category), and no thin-tall prop for silhouette. It also omits the plan-view
ground that every object must sit on, which is the seam where the perceived inconsistency arises.

Also, §29 reads as eight assets × three angles (24 painterly PNGs) — expensive and not needed to choose an angle. **Stage it:**

```text
STAGE 1 — angle test (three elevations, one yaw):
  Hero Ship D (blockout or D-equivalent), Exhibition Hall, Warehouse,
  measurement primitives: unit cube + cylinder (barrel-like),
  plan-view ground context: 32 px grid + dock deck + water (programmatic, angle-independent),
  player placeholder 24 × 32.

STAGE 2 — remaining set at the chosen elevation only:
  Medium Sailing Ship, Small Working Boat, Tree, Crate, Barrel, Lamp (thin-tall silhouette), Dock segment
  (plan deck + its water-side edge face).
```

Replacement total: Hero Ship D, Medium Sailing Ship, Small Working Boat, Exhibition Hall, Warehouse, Tree, Crate, Lamp,
Dock segment, Player reference, Measurement primitives (cube + cylinder), Plan-view ground context.

---

## AD. Calibration Scene

```text
USE_BOTH
```

- **Dedicated calibration scene** (dev-only, dead-code-eliminated in production like the existing `assetPreview` path):
  fixed grid, no world clutter, all assets side-by-side at each angle, primitives with measurement overlay, player
  rectangle, identical lighting/palette/scale — the only place a controlled comparison is possible.
- **Existing harbor scene** (`?assetPreview=harbor`, already exists): real ground, water, depth ordering, collision and
  camera — the only place "does it feel like one world" and the depth defects (X) can be judged.

One risk to record, not solve: a prior session could not start the Vite dev server (`EACCES`), so screenshot-based review
was unavailable; confirm the calibration environment before the gate.

---

## AE. Angle Calibration Method

```text
CONTROLLED_THREE_ANGLE_GENERATION
```

The principle is right and should be adopted with one amendment: **prompting an image generator to "change only the
elevation" will not hold the design fixed** — that is the exact drift the Bible wants to prevent. The controllable method is
a **shared geometry source**: build simple orthographic blockouts (unit cube, cylinder, and greybox ship/hall/warehouse) and
render them at exactly 15° / 22.5° / 30°; use those renders as the angle-accurate guide/underlay for any generated or
hand-painted art, and let the primitives verify the angle. Human review of angle needs massing, top-surface visibility and
map readability, which blockouts show; textured art is only needed for the winning angle.

Variables that must remain unchanged across the three samples:

```text
subject and design (same geometry)     runtime display size and export scale (same size in LU/px)
yaw / facing / bow direction           canvas size, padding, anchor point
key-light direction, elevation, warmth  shadow policy (none baked)
palette and material assignment        value floor / saturation cap
detail budget (same detail level)      background/transparency treatment
ground context, grid, and neighbours   sample-to-sample scene composition and camera position
```

Only camera elevation E changes.

---

## AF. Production Prompt Template

```text
PRODUCTION_PROMPT_TEMPLATE_NEEDS_FIELDS
```

Present in §32: projection, elevation, yaw/visible side, visible surfaces, scale (role only), lighting, palette, detail
level, transparent background, perspective consistency, copyright/originality. Fields to add, exactly:

```text
TARGET_DISPLAY_SIZE_PX      (final content size and export canvas size; scale 1.0)
CANVAS_AND_PADDING          (canvas size, transparent margin, content must not touch edges)
ANCHOR_POINT                (pixel coordinate; what it represents per category)
ORIENTATION                 (ship bow direction; building entrance = camera-facing south; mirror-allowed yes/no)
SHADOW_POLICY               (no baked cast/ground shadow)
NEGATIVE_LIST               (no glow, halo, vignette, background fill, text, watermark)
MATERIAL_SPEC               (material families by name + palette entries + value floor / saturation cap)
DETAIL_BUDGET               (reference to the readability test; identity features listed)
PROVENANCE_TAG              (generated-original + asset id / version)
```

The negative list and padding are grounded in evidence: D, C and Hall arrived with glow/vignette backdrops that had to be
keyed out (VG-07).

---

## AG. Lock Criteria

```text
LOCK_CRITERIA_NEEDS_ADDITIONS
```

The thirteen listed locks are appropriate. Add:

```text
VISIBLE_SIDE_CONVENTION      camera-facing = south; entrance on it; ship bow facing; mirroring policy (lock)
ORIGIN_PADDING_CONVENTION    anchor as pixel coordinate; canvas padding; flip requirement (lock)
ALPHA_EDGE_POLICY            per AB.1 (lock)
OCCLUSION_DEPTH_SORT_RULE    y-sorted standing objects, sort key = anchor y (lock; needs the runtime change in X)
CATEGORY_ASSET_METRICS       content-bounds-based dimension per category, replacing the single-player-unit table (lock)
HORIZON_FREE_ORTHOGRAPHIC_RULE  no vanishing points, no size change with y (lock, as part of PERSPECTIVE_GRAMMAR)
PLAN_GROUND_RULE             ground plane stays plan-view (lock, as part of PERSPECTIVE_GRAMMAR)
STYLE_TARGET                 pixel-inspired vs painterly (lock)
EXPORT_SCALE_RULE            final display size, runtime scale 1.0 (or integer reciprocal) (lock)
```

`BUILDING_TOP_FRONT_SIDE_RATIO` should be renamed `BUILDING_TOP_FRONT_RATIO` if yaw stays 0.

---

## AH. Findings

Nothing was manufactured; every entry cites evidence above. There is no Blocker.

```text
ID: VG-01
Severity: Major
Category: ambiguous production rule / conflict with locked runtime grammar
Finding: §3 "ORTHOGRAPHIC / DIMETRIC-STYLE" and "top-down / slight-isometric reading" do not describe the runtime and omit
  that the ground stays plan-view.
Evidence: worldLayoutData.json (all rectangles axis-aligned); drawHarborGround/drawHarborPlaza (plan, 32 px grid);
  drawHarborBuilding (front elevation, yaw 0); 03-director-gate.md and 02-… §Q ("mixed grammar" is the locked convention).
Impact: an artist or generator following "dimetric" produces diamond-footprint or yawed assets that cannot sit on the
  existing footprints; the angle candidates would be calibrated against the wrong model.
Recommended action: replace §3 with the wording in section E; add "ground is plan-view" as a lock item.

ID: VG-02
Severity: Major
Category: conflict with current runtime / calibration risk
Finding: §7.2 "one side facade consistently visible" is impossible at yaw 0 in an axis-aligned world; Hall is yaw 0 and D is
  ~3/4 yawed, so the current ship/building mismatch is elevation AND yaw, which an elevation-only calibration would miss.
Evidence: reconstruction of Hall (frontal, symmetric, no side) vs D (bow toward camera); layout footprints axis-aligned;
  §6 leaves yaw "to be locked during calibration".
Impact: after the angle test, ships could still disagree with buildings; a visible-side rule the world cannot satisfy would
  be silently violated or force a layout redesign.
Recommended action: inherit yaw 0 with south-facing primary facade and broadside ships (section H); remove the side-facade
  requirement, or make a yawed camera an explicit Director decision with its ground-plane consequences.

ID: VG-03
Severity: Major
Category: under-specification / conflict with runtime
Finding: The scale table's unit is undefined ("PLAYER = 1.0": width 24 or height 32, and the player is a placeholder) and
  its ranges disagree with runtime for props (~2×), warehouse, non-Hall destinations, and hero ships.
Evidence: table in section M against layout data and manifest.
Impact: any lock on this table either fits nothing or mis-sizes future props by 2×.
Recommended action: use LOGICAL_UNIT (32 px) as the master unit; replace the table with category dimension rules
  (measured dimension, LU, min–max, reference asset, tier); fill values at calibration.

ID: VG-04
Severity: Major
Category: under-specification
Finding: Manifest display sizes are canvas sizes including varying transparent padding, so scale ratios computed from
  them are wrong.
Evidence: content fraction of canvas width — brig 0.68, cutter 0.64, schooner 0.86, D 0.90, Hall 0.95. The brig is 188 px on
  its canvas but ≈ 128 px of content; brig : D is 0.36 by content vs 0.48 by canvas (cutter 0.26 vs 0.37).
Impact: fleet hierarchy and building-to-ship ratio judged on canvas numbers misstate what the player sees; the human-approved
  proportions were tuned on canvas values.
Recommended action: define every scale measurement on alpha ≥ 128 content bounds; add content bounds to the manifest; fix a
  padding convention (section AA).

ID: VG-05
Severity: Major
Category: conflict with current runtime
Finding: The Art Bible's depth grammar cannot be produced by fixed per-class depths with no y-sort; two effects are visible
  in current data.
Evidence: WorldScene.ts / Player.ts depths (Hall 5, vessels 7, player 11; secondaries created after D at equal depth).
  Reconstruction: east brig drawn over D's sails though it is behind; player stops on Hall roof pixels at the end of
  path-south (art y 817–1024, collision y 896–1024).
Impact: growing the town with tall assets multiplies these errors; the layering list itself (body vs "upper ship/roof")
  implies two-part assets that do not exist.
Recommended action: put the y-sorted standing-object layer (section X) in the Bible; schedule the small runtime change after
  lock. Not required to run the calibration gate.

ID: VG-06
Severity: Major
Category: under-specification
Finding: Asset-weight and export rules are deferred ("optimize after visual approval") though the measured waste is large
  and the planned asset count is tens of times today's. Related: 0.257× NEAREST downscaling of 1536 × 1024 sources loses
  fine detail.
Evidence: 8.56 MB now; 5.55 MB from zeroing hidden RGB alone; 0.32 MB at 1 × display export; fixed 1024 × 576 canvas;
  Art Direction §15 asset volumes.
Impact: compounding page weight and aliasing that no post-hoc pass can fully undo.
Recommended action: lock category ceilings (section AA.3) and an export rule: final display size, runtime scale 1.0 or an
  integer reciprocal, tested in the calibration scene. Not a blocker (each record has flagged this before; no runtime failure).

ID: VG-07
Severity: Minor
Category: ambiguous production rule
Finding: The alpha rule tests only four corners; assets pass it while carrying halo pixels to the canvas edge and 32–50 %
  hidden RGB.
Evidence: table in AB.1.
Impact: dirty edges, needless weight, and baked glow that blocks future day/night treatment.
Recommended action: expand §26 per AB.1; add a negative-list to the prompt template.

ID: VG-08
Severity: Minor
Category: conflict with current runtime
Finding: §6 forbids mirroring except with Director approval and valid lighting; runtime already mirrors the east brig
  (`setFlipX`) and the mirrored brig lands ≈ 11 px off its layout anchor because content is 46 source px off-centre.
Evidence: WorldScene.ts (setFlipX for harbor-east-merchant-brig); brig content-centre offset +46 px.
Impact: rule violated in practice or, if enforced, forces a fourth near-duplicate texture; light direction also flips.
Recommended action: allow mirroring for ships (bow direction) only when lighting is low-directional and anchorX = 0.5; state
  it in the Bible and re-anchor the brig.

ID: VG-09
Severity: Minor
Category: calibration risk / style
Finding: The Bible's Avoid list rejects "hyper-detailed painterly rendering", but every current calibration asset is
  detailed/painterly with glowing backdrops; the style target is unresolved.
Evidence: opened D, C, Hall, A; Art Direction §23 ("16-bit inspired"); AAP-06.
Impact: the calibration set would validate a style the Bible forbids.
Recommended action: state a style position (e.g., pixel-inspired, resolved at display size) and add STYLE_TARGET to the lock.

ID: VG-10
Severity: Minor
Category: under-specification
Finding: Palette rule does not bound value/saturation; assets exceed the palette envelope (near-black shadows, V ≈ 0.10–0.12;
  saturation up to 0.85).
Evidence: section T.
Impact: painted assets read as separate images next to programmatic neighbours.
Recommended action: add a value floor and a saturation cap; no token system.

ID: VG-11
Severity: Minor
Category: under-specification
Finding: Four of seven listed materials have no treatment; prop rules omit tree and sign; lighting schema mixes baked and
  runtime parameters and omits elevation.
Evidence: sections K, Q, U.
Impact: generation drift within a category.
Recommended action: add the one-line material entries, tree/sign rules, and the split lighting schema.

ID: VG-12
Severity: Minor
Category: overengineering / future-only concern
Finding: §20 day/night "separate base, day and night profile" is unverifiable for baked PNGs; the calibration plan as
  written (8 assets × 3 angles) is more expensive than the decision needs.
Evidence: section S, AC.
Impact: unenforceable rule; unnecessary generation cost.
Recommended action: use the two-line day/night rule in S; stage the calibration and use measurement primitives / blockouts.

ID: VG-13
Severity: Minor
Category: ambiguous production rule
Finding: "Front facade" is ambiguous; entrance readability is a separate check that can be made automatic.
Evidence: section J.
Impact: buildings could put the door off the camera-facing side.
Recommended action: use "primary facade" defined as camera-facing (south) and entrance-bearing.

ID: VG-14
Severity: Minor
Category: under-specification
Finding: Prompt template lacks target display size, canvas/padding, anchor, orientation, shadow policy, negative list,
  material spec, detail budget, provenance tag; lock list lacks the items in AG; provenance/naming has small alignment gaps
  with 07_ASSET_POLICY.md.
Evidence: sections AB.2, AF, AG.
Impact: gaps re-open after lock.
Recommended action: add the fields/locks listed.

ID: VG-15
Severity: Minor
Category: repository hygiene
Finding: The Art Bible draft is untracked at reports/art-direction/, not at its recommended path
  reports/portfolio-world/art-direction/, so this committed review refers to an uncommitted file.
Evidence: git status at start; file listing.
Impact: the reviewed document has no canonical, versioned home; the review's line references can drift.
Recommended action: Director moves/commits the Bible (revised) to the recommended path with the fixes from section AI.
  This review did not move or commit it.
```

---

## AI. Exact Director-Gate Changes

Apply these to the Art Bible before or together with the calibration gate:

1. **§3 Projection** — replace with the section E wording (RPG 3/4 hybrid; plan-view ground; one elevation, one yaw;
   horizon-free; not isometric/dimetric).
2. **§4 Camera Elevation** — add the axis definition and the proxy table from section F.
3. **§6 Yaw** — replace with: yaw 0 relative to world axes; camera-facing side is south; every entrance on it; ships broadside,
   bow left or right; mirroring policy per VG-08. Remove "to be locked during calibration" for yaw unless a yawed camera is
   chosen deliberately.
4. **§7.1 Ships** — add the section I wording and a measured deck-band ratio placeholder.
5. **§7.2 Buildings** — "front facade" → "primary facade (camera-facing, entrance-bearing)"; delete or re-scope "one side facade".
6. **§7.3 Props** — replace with the section K list; drop "side" from the crate line.
7. **§8 Scale Bible** — 1.0 = 1 LU = 32 px; player = 1.0 LU high (currently); replace the table with category dimension rules
   on content bounds; add relations R1–R4 from section N; note that ranges are seeded from runtime and set at calibration.
8. **§12 Anchors** — add the pixel-coordinate encoding and the flip requirement (section O).
9. **§16/§17** — add the four missing material lines and the value floor / saturation cap.
10. **§18–§20 Lighting** — replace with the baked/runtime split (Q), keep "baked shading, shared runtime contact shadow" (R),
    and replace day/night with the two-line rule (S).
11. **§21 Depth** — replace with the y-sorted standing-object layer including the player (X).
12. **§24–§26** — export at display size, runtime scale 1.0 or integer reciprocal, weight ceilings (AA.3), expanded alpha
    policy (AB.1).
13. **§29–§30 Calibration** — use the staged set and the blockout/primitive method (AC, AE); add "use both scenes" (AD).
14. **§31 Lock list** — add the nine items in AG; rename the top/front ratio.
15. **§32 Prompt template** — add the nine fields in AF.
16. **New** — a one-paragraph style-target statement (VG-09) and the berthing-slot contract (Z).
17. **Repository** — relocate the revised Bible to `reports/portfolio-world/art-direction/` and commit it (VG-15).

Not requested by this review: any runtime change before calibration. The depth change (X) is post-lock.

---

## AJ. Decision Summary

```text
Projection              PROJECTION_GRAMMAR_NEEDS_REFINEMENT
Angle Convention        ANGLE_CONVENTION_NEEDS_EXPLICIT_AXIS_DEFINITION
Calibration Angles      CALIBRATION_ANGLES_KEEP_15_22_5_30
Yaw                     INHERIT_CURRENT_YAW_AND_DOCUMENT
Ship Surface            SHIP_SURFACE_GRAMMAR_NEEDS_REFINEMENT
Building Surface        BUILDING_SURFACE_GRAMMAR_NEEDS_REFINEMENT
Props                   ADD_PROP_CATEGORY_RULES
Scale                   USE_LOGICAL_UNIT_REFERENCE
Scale Ranges            REPLACE_WITH_CATEGORY_DIMENSION_RULES
Building-to-Ship Ratio  BUILDING_SHIP_RATIO_RULE_NEEDS_DEFINITION
Anchor Rules            ANCHOR_RULES_NEED_CATEGORY_DETAIL
Visual/Collision        VISUAL_COLLISION_RULE_READY
Lighting                LIGHTING_SCHEMA_TOO_COMPLEX
Baked vs Runtime        BAKED_LIGHTING_WITH_SIMPLE_RUNTIME_SHADOW
Day/Night               DAY_NIGHT_PREP_NEEDS_REFINEMENT
Palette                 ADD_VALUE_SATURATION_RULES
Material Language       MATERIAL_LANGUAGE_NEEDS_ADDITIONS
Silhouette              SILHOUETTE_RULE_READY
Detail                  ADD_RUNTIME_READABILITY_TEST
Depth                   DEPTH_ARCHITECTURE_CHANGE_REQUIRED
Occlusion               ADD_LARGE_OBJECT_OCCLUSION_RULES
Harbor Composition      HARBOR_COMPOSITION_RULE_READY
Randomization           DEFER_RANDOMIZATION_DEFINE_BERTHING_SLOTS
Asset Metrics           ASSET_METRICS_RULE_NEEDS_MORE_FIELDS
Asset Weight Budget     ADD_CATEGORY_ASSET_WEIGHT_BUDGET
Alpha Edge              ALPHA_EDGE_RULE_NEEDS_EXPANSION
Provenance/Naming       PROVENANCE_NAMING_RULE_NEEDS_ALIGNMENT
Calibration Set         CALIBRATION_SET_EXPAND
Calibration Scene       USE_BOTH
Angle Generation        CONTROLLED_THREE_ANGLE_GENERATION
Prompt Template         PRODUCTION_PROMPT_TEMPLATE_NEEDS_FIELDS
Lock Criteria           LOCK_CRITERIA_NEEDS_ADDITIONS

Pre-review Gate         READY_WITH_FIXES
```

---

## AK. Final Recommendation

```text
ART_BIBLE_FIX_REQUIRED
```

The draft is on the right track and its calibration-then-lock structure is correct. It should not be locked, or used to
start mass production, until section AI's changes are absorbed. The six Major findings (VG-01 to VG-06) are all
clarifications or a small post-lock runtime change; none requires redesign, and none conflicts with the layout, IA or
collision model. The most valuable single change is VG-02: the ship/building mismatch the human
perceives is a joint elevation-and-yaw difference, so yaw 0 should be documented before the elevation samples are produced.
The remaining decisions (final elevation, ratio bands, scale ranges, light direction, budgets, style target) stay with the
Director and the human calibration review.

Suggested next step: Director absorbs section AI into a revised Art Bible (moved to the canonical path), then issues the
calibration gate for the staged set in AC.
