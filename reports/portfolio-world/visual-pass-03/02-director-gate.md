# Portfolio World — Visual Pass 3 Director Gate

> Recommended repo path: `reports/portfolio-world/visual-pass-03/02-director-gate.md`

## 1. Gate

Claude pre-review:

```text
READY_WITH_FIXES
DESIGN_FIX_REQUIRED
```

Director decision:

```text
PASS_WITH_REQUIRED_FIXES
DESIGN_READY_FOR_IMPLEMENTATION
```

No IA redesign is required.

## 2. Critical Geometry Correction

The pre-review correctly identified the need to trade unused north margin for more sea, but its proposed water rectangle contained an arithmetic contradiction.

World height is:

```text
1280
```

A water rectangle of:

```text
y = 1184
height = 192
```

would end at:

```text
1376
```

and therefore exceed world bounds.

The Director-corrected target is:

```text
water y = 1088
water height = 192
water bottom = 1280
```

This doubles the existing ~96 px water depth while keeping the south edge anchored to the world boundary.

Actual code remains the source of truth. If the current water x/width differ from assumptions, preserve their intended horizontal geometry while using the corrected in-bounds south anchoring.

## 3. Town Translation

Approved composition shift:

```text
Δy = -96 px
```

Translate the complete town composition upward consistently:

- Academy
- Harbor Square
- Guild Hall
- Workshop
- Exhibition Hall
- dock
- primary paths
- forecourts
- harbor visuals
- streetscape visuals
- reserved lots
- dependent town-layout records

Keep x coordinates and all relative spatial relationships unchanged.

The purpose is to use the previously wasted upper margin and free 96 px for the expanded harbor basin.

## 4. Translation Safety

Claude identified roughly 65 affected records.

Do not manually edit dozens of independent y coordinates if a deterministic transform can be used.

Preferred:

```text
shared translation constant/helper
```

or an equivalently safe scripted/derived transformation.

Requirements:

- every intended record moves exactly once
- no record is omitted
- no record moves twice
- relative destination offsets remain unchanged
- paths/forecourts remain aligned
- layout remains deterministic

## 5. Destination Stability

Approved:

```text
MINOR_DESTINATION_ADJUSTMENT
```

This means absolute y positions change uniformly, but relative IA remains exactly the same.

No relayout of the four primary destinations.

## 6. Vessel Strategy

Approved:

```text
PROGRAMMATIC_VESSELS
NON_COLLIDABLE_IN_WATER
```

Add:

```text
1 large ship
2–3 additional small boats
```

Reuse existing `small-boat` for small vessels.

Add only one new vessel type where needed:

```text
large-ship
```

No new orientation field unless implementation proves it necessary.

The large ship should be the main harbor visual anchor.

## 7. Vessel Composition

Preferred:

```text
large ship = dock-adjacent or slightly offshore
small boat #1 = near dock
small boat #2 = farther in basin
small boat #3 = optional cargo-side cue
```

Avoid even spacing and symmetry.

All vessels must remain entirely inside the non-walkable water region.

## 8. Supporting Harbor Buildings

Approved:

```text
ADD_SUPPORT_BUILDINGS
```

Limit this pass to:

```text
warehouse
cargo-shed
```

They are environmental structures only, not interactive portfolio destinations.

They should:

- sit near waterfront/cargo activity
- avoid primary paths
- avoid forecourts
- avoid primary buildings
- avoid reserved lots
- remain subordinate to destination buildings

## 9. Reserved Lots

Approved:

```text
PRESERVE_ALL_RESERVED_LOTS
```

Keep:

```text
guild-annex-lot
academy-library-lot
workshop-studio-lot
```

Translate them by `-96 px` with the town composition.

Do not consume them for warehouse/cargo-shed placement.

## 10. Architecture

Approved:

```text
CURRENT_VISUAL_ARCHITECTURE_SUFFICIENT
PROGRAMMATIC_ONLY_STILL_SUFFICIENT
```

Keep current architecture:

```text
worldLayout.ts
harborVisualCatalog.ts
streetscapeVisuals.ts
WorldScene.ts
```

Preferred additions:

```text
drawLargeShip → harborVisualCatalog.ts near current boat drawing
warehouse/cargo-shed drawing → streetscapeVisuals.ts
```

No generic vessel system, theme engine, Tiled integration, or new rendering framework.

## 11. Required Validation A — Vessel Containment

Add a new containment check:

```text
every floating vessel must be fully contained by the water rectangle
```

Cover:

```text
large-ship
small-boat
```

Fail validation if any vessel extends onto land or beyond the water bounds.

## 12. Required Validation B — Translation Integrity

Add tests/checks that verify:

- relative destination offsets are unchanged
- paths remain aligned
- forecourts remain aligned
- reserved lots remain valid
- harbor/street visuals stay inside world bounds
- water ends exactly at the south world boundary
- an accidentally unshifted town record can be detected where practical

## 13. Dock / Waterfront

Preserve:

```text
Harbor Square
→ Exhibition Hall
→ Promenade
→ Dock
→ Harbor Basin
```

The dock moves with the town composition.

The expanded water fills more of the lower world.

Do not damage Exhibition Hall access.

## 14. Camera

Keep existing camera behavior by default.

Do not change zoom, lerp, follow model, or camera bounds unless actual preview reveals a concrete defect.

## 15. Collision

Continue:

```text
Visual Density != Collision Density
```

Ships in non-walkable water do not need player collision.

Warehouse/cargo-shed may receive collision only if they occupy walkable land and walking through them would be clearly wrong.

## 16. Mockup Fidelity

This remains a mockup-composition pass.

Do not add production polish merely to hide the fact that it is a mockup.

Do not add:

- PNG/SVG art packs
- final ship assets
- water shaders
- lighting systems
- animation polish

The goal is to validate harbor composition and proportion.

## 17. Status / Handoff Process Fix

Claude identified a repeated stale-state problem in:

```text
docs/portfolio-world/91_STATUS.md
docs/portfolio-world/92_HANDOFF.md
```

From this phase onward, status/handoff refresh is an explicit closeout requirement.

After Pass 3 implementation, these documents should accurately state:

```text
Visual Pass 2 complete
Visual Pass 3 implementation complete
Visual Pass 3 independent review pending
Visual Pass 3 human visual feel test pending
```

## 18. In Scope

- uniform `-96 px` town translation
- corrected water expansion to `y=1088, height=192` if world height is 1280
- one large programmatic ship
- 2–3 additional small boats
- warehouse
- cargo-shed
- dock/waterfront composition adjustment
- vessel-water containment validation
- translation-integrity validation
- reserved-lot preservation
- status/handoff refresh
- QA and visual evidence

## 19. Protected Non-Scope

Do not implement:

- new portfolio destinations
- interactive harbor buildings
- interiors
- NPC/dialogue/quests/combat
- audio/day-night
- final art skin
- final ship asset production
- multiplayer/auth/database
- generic theme engine
- Tiled

## 20. Director Gate

```text
VISUAL_PASS_3_DIRECTOR_GATE = PASS_WITH_REQUIRED_FIXES
```

Next:

```text
Codex Visual Pass 3 Implementation
```
