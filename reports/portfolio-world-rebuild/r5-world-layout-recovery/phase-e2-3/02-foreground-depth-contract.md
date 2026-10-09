# Foreground depth contract

| Extracted alpha asset | Foot-Y | Intended coverage |
|---|---:|---|
| Hall stairs/retaining | 242 | Hall stairs and railing |
| Workshop foreground | 430 | Workshop lower rail/structure |
| Archive approach | 552 | Archive approach wall/rail |
| Dock piles | 382 | Dock rail/piles |
| Hero gangway | 368 | Hero threshold/gangway |

The foreground sprite depth is always `30 + footY / 1000`; it is never toggled visible/invisible. Because the sprites have alpha, only their authored opaque portions can cover the player. F2 adds thin orange reference rows only in debug mode; it is not normal UI.

The broad shore stone wall has no exact independent alpha mask in the approved Pilot asset set. It is recorded as `ART_OCCLUSION_REQUIRED`, rather than creating a speculative crop or restarting ship separation.
