# Portfolio World — Fleet Presence & Harbor Zoning Refinement

Status: `READY_FOR_FLEET_PRESENCE_HUMAN_REVIEW`

## Runtime changes

- Added the reviewed fleet presentation contract in `portfolio-world/src/world/fleetPresentation.mjs`.
- The runtime now applies each vessel's explicit scale and facing at render time while preserving the existing 15° art, furled sails, static berths, collision, routes, camera behavior, and world dimensions.
- Hero and Medium vessels now resolve through their existing static berth slots as well as the Small Workboat and Dinghy.
- Re-spaced the Hero, east Brig, Cutter, foreground basin boat, and waterfront boat so their rendered material envelopes are clear.
- Moved the service marker east to keep it clear of the enlarged Hero.

## Fleet scale and direction rationale

| Class | Runtime scale | Facing | Review rationale |
| --- | ---: | --- | --- |
| Hero | 1.35× | left | Restores the harbor landmark role while remaining below the 1.5× cap. |
| Medium | 1.30× | right | Reads as the clear second tier. |
| Brig | 1.25× | west right / east left | Maintains a paired merchant rhythm without a uniform silhouette. |
| Cutter | 1.30× | left | Remains below Brig in visible width despite its slightly higher multiplier. |
| Small workboat / Dinghy | 1.10× / 1.00× | right / left | Preserve the small-craft tier and add directional variety. |

Actual alpha-envelope widths preserve: Hero > Medium > Brig > Cutter > Small workboat > Dinghy.

## Zoning

- Working waterfront remains in `gallery`: docks, berths, vessels, service marker, rope, buoy, cart, net, cargo, barrels, and mooring assets.
- Harbor Square now holds the relocated tree, shrub planter, bench, and planter, in addition to its existing square greenery and rest furniture.
- The validator rejects drift of either curated zone set.

## Verification

- `npm test` passed: 31 tests, 0 failures.
- The layout validator checks scale cap, both facings, fleet hierarchy, actual alpha-envelope vessel overlap, water containment, berth resolution, and zoning intent.
- Existing dock/gangplank and water-collision validation remains active; the gangplank check now uses the scaled workboat alpha envelope.
- Browser visual QA confirmed the enlarged Hero clears the Exhibition Hall silhouette and that the right-side fleet reads as separate vessels.

## Human review focus

Review whether the 1.35× left-facing Hero has the desired landmark emphasis, and whether the left/right balance feels composed at the harbor's normal camera framing.
