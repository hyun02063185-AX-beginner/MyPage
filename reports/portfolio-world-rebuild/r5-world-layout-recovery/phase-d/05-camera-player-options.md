# R5 Phase D — Camera and Player Options

All comparisons use the 1024×576 logical viewport and the same world-to-screen transform for player and scenery. They are planning simulations, not runtime screenshots. Hall stairs, Workshop approach, central route, Archive approach, and Hero boarding remain subject to the preserved C.2 walkability/clearance data.

| Option | Visual player | Zoom | Visible world | Screen player height | Review |
|---|---:|---:|---:|---:|---|
| A | 28×56 | 1.0 | 1024×576 | 56px | Maximum orientation context; player may feel small. |
| B | 28×56 | 1.25 | 819.2×460.8 | 70px | Stronger presence while preserving an adjacent landmark and route. |
| C | 32×64 | 1.0 | 1024×576 | 64px | Larger read but no closer scenery; visual and corridor pressure rise. |

Recommendation: test B first, with a separate overview affordance rather than using an overview as the normal gameplay view. The 32-unit C.2 collision/48-unit minimum-clearance contract does not auto-approve 32×64 visual art. Camera and player scale remain pending Human decision.
