# Browser playtest results

Actual local Edge/Phaser captures back the image set. Status is intentionally conservative.

| Test | Result | Evidence / note |
|---|---|---|
| T01 FRONT→SIDE | PASS | fixed-pose actual captures plus alpha bounds |
| T02 SIDE→BACK | PASS | all derived Side feet end Y=54 |
| T03 Walk→Idle | PASS | same display/origin/body contract; asset QA |
| T04 continuous changes | PASS | four Side walk cells all share the final footprint |
| T05 normal discoverability | PASS | `12-destination-normal-mode.png` |
| T06 Hall marker | PENDING human path watch | common `hybrid:poi` A* dispatcher verified |
| T07 Workshop marker | PASS | browser marker click arrived at Workshop |
| T08 Archive marker | PENDING human path watch | same dispatcher; not claimed manually watched |
| T09 Hero marker | PASS | browser click selected Hero route; E2.1 threshold path retained |
| T10 keyboard override | PASS (regression) | unchanged cancellation path; requires final human feel check |
| T11 camera anchoring | PASS | world-to-camera transform and overview/normal captures |
| T12 mobile width | PASS | repaired 2-column controls in `qa-mobile.png` |

F2 is still a separate graphics-only debug overlay; markers remain normal UI rather than collision diagnostics.
