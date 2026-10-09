# R5 Phase D — World Scale Options

The Candidate B source is 1280×720. It cannot be stretched into a larger playable world. Any area outside its composed core requires authored terrain/water, actual walkable surfaces, collision, route validation, and camera-safe scenery.

| Option | Logical world | z1 camera travel with 1024×576 viewport | Reading |
|---|---:|---:|---|
| A. Single-screen | 1280×720 | 256×144 | Preserves composition, but exploration and camera movement are slight. |
| B. Larger exploration | 1600×900 | 576×324 | Supports a following camera, but requires real authored edge continuation. |
| C. Connected areas | 1280×720 harbor + separate areas | 256×144 in harbor | Preserves the harbor and adds Hero interior/offshore regions through explicit transitions. |

Recommendation: plan around C for the first additive expansion because it avoids retrofitting claimed land into the visual reserve. B can be selected later only with an approved world-art and geometry pass. No size is locked.
