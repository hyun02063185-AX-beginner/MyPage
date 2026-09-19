# Portfolio World — Art Asset Phase 01 Human Asset Slice Review
## Hero Ship / Exhibition Hall / Harbor Composition

> Canonical repo path:
> `reports/portfolio-world/art-asset-phase-01/06-human-asset-slice-review.md`

---

## 1. Review Status

```text
ART_ASSET_PHASE_01_HUMAN_REVIEW = APPROVED_WITH_REFINEMENT_DIRECTION
```

The first asset slice successfully provided enough visual evidence to judge:

- hero ship scale
- hero ship design direction
- camera / perspective fit
- building-to-ship proportion
- harbor fleet density potential
- dock / berthing expansion potential

The user does **not** select A, B, or C unchanged as the final hero ship.

Instead, the next step is a refinement that combines the strongest aspects of the current candidates.

---

## 2. Human Verdict — Ship Scale

The user judged the **building-to-ship proportion of Variant A** to be the most appropriate.

```text
SHIP_SCALE_REFERENCE = VARIANT_A
```

Interpretation:

- the final largest ship should not retain Variant C's current oversized visual envelope
- Variant A is the better reference for the maximum hero-ship scale
- the current harbor can support more vessels if the largest ship is kept closer to A's proportion

Decision:

```text
USE_A_AS_HERO_SHIP_SCALE_REFERENCE
DO_NOT_USE_C_CURRENT_SCALE_AS_FINAL
```

---

## 3. Human Verdict — Ship Design

The user preferred **Variant C's ship design itself**.

```text
SHIP_DESIGN_REFERENCE = VARIANT_C
```

What should be retained from C:

- stronger sailing-ship character
- richer silhouette
- more convincing multi-mast presence
- greater visual identity as a major harbor vessel

However, C must **not** be reused unchanged.

Decision:

```text
C_DESIGN_LANGUAGE_APPROVED
C_CURRENT_SIZE_NOT_APPROVED
C_CURRENT_VIEW_ANGLE_NOT_APPROVED
```

---

## 4. Perspective / Camera Correction

The user identified a perspective mismatch.

### A / B

A and B are viewed slightly from above, so part of the deck is visible.

### C

C reads too strongly as a pure side/profile view:

```text
deck visibility = insufficient
camera alignment with world = weaker
```

This makes C feel less consistent with the current Retro Harbor Campus world perspective.

Required correction:

```text
retain C-like design
+ shift to a slightly elevated / downward-looking view
+ reveal part of the deck
+ align with the practical perspective grammar already used by the world
```

Decision:

```text
FINAL_HERO_SHIP_REQUIRES_VISIBLE_DECK
PURE_SIDE_PROFILE_NOT_ACCEPTED
```

---

## 5. Final Hero Ship Refinement Direction

The next hero-ship candidate should combine:

```text
A = scale / proportion reference
C = design / character reference
A/B = camera / deck-visibility reference
```

Working definition:

```text
Hero Ship D
```

Target:

- visual footprint approximately in Variant A's perceived scale range
- C-inspired ship character
- 2–3 mast sailing-ship identity where visually appropriate
- deck partly visible
- coherent with the world's top-down / slight-isometric environment
- large enough to remain the harbor's primary vessel
- small enough to leave room for a denser harbor fleet

Decision:

```text
CREATE_HERO_SHIP_D
```

---

## 6. Building Scale Direction

The user judged that the destination buildings should become **somewhat larger** relative to the new ship scale.

Reason:

- better building-to-vessel realism
- stronger destination presence
- more believable town scale
- reduced risk that the harbor reads as oversized ships beside undersized buildings

This is a **visual scale refinement**, not a world-layout redesign.

Decision:

```text
INCREASE_PRIMARY_BUILDING_VISUAL_SCALE_MODESTLY
KEEP_WORLD_POSITION_AND_IA
```

Important:

- do not move destinations unless a later review proves necessary
- do not derive collision from new visual bounds
- do not enlarge buildings so much that paths / forecourts become visually blocked

---

## 7. Harbor Fleet Density Direction

With the largest ship closer to A's scale, the user sees room for **more vessels than the current large-ship + 3–4 small-boat composition**.

The harbor should move toward:

```text
one principal hero ship
+ a denser set of secondary sailing vessels
+ smaller boats as supporting activity
```

The user specifically noted that approximately **four additional sailing vessels with 2–3 masts may be visually possible**, depending on placement.

This is a design direction, not a final locked fleet count.

Decision:

```text
INCREASE_HARBOR_VESSEL_DENSITY
TEST_MULTIPLE_SECONDARY_SAILING_VESSELS
FINAL_FLEET_COUNT_NOT_YET_LOCKED
```

---

## 8. Dock / Berthing Direction

The current harbor effectively reads as having one principal berthing structure.

The user judged that a denser fleet may justify:

```text
two or more docking / berthing structures
```

Therefore the next refinement may test additional dock / pier capacity.

Decision:

```text
ALLOW_DOCK_BERTHING_EXPANSION
```

Constraints:

- preserve the approved harbor identity
- preserve walkability
- preserve route readability
- avoid turning the harbor into a maze
- do not fill every water area with structures
- new docks must correspond to actual vessel-placement needs

---

## 9. Revised Harbor Composition Principle

The next iteration should favor:

```text
credible harbor density
```

over:

```text
one oversized hero ship dominating an otherwise sparse basin
```

Preferred hierarchy:

```text
1. Hero Ship D — main landmark
2. Several secondary sailing vessels
3. Small working boats
4. Multiple believable berthing points
5. Exhibition Hall / waterfront destination remains clearly readable
```

---

## 10. Empty Space Policy

The previous decision remains unchanged:

```text
EMPTY_LOT_FILLING_DEFERRED
```

The next refinement is about:

- ship scale
- perspective
- building scale
- fleet density
- dock capacity

It is **not** a general prop-filling pass.

---

## 11. Art Style Note

Claude's previous review noted that the current generated assets are more detailed / painterly than the original "16-bit-inspired retro" wording.

This Human Review does not reject the current asset direction solely for that reason.

However, the next Hero Ship D and related assets should prioritize:

- strong readable silhouette
- clean deck / mast forms at runtime scale
- reduced dependence on tiny detail
- consistent world perspective
- reasonable file size

Final art-style fidelity remains subject to later review.

---

## 12. Human Review Gate

```text
HUMAN_ASSET_SLICE_GATE = APPROVED_WITH_REFINEMENT
```

Next authorized work:

```text
Hero Ship D refinement
+ modest primary-building visual scale adjustment
+ denser harbor fleet composition
+ additional berthing / dock test
```

The current A/B/C set remains valuable as comparison evidence but is not the final production selection.
