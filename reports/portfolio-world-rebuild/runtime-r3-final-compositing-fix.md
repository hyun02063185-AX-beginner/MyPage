# Runtime R3 Phase A.3 — Final Scenic Compositing Fix

## Scope

Composition C3 corrects only the three failed static-review reads from C2: Fountain B grounding, the far-sea to protected-harbor water transition, and exposed dark-green fallback at the left/lower scenic edge. This is a Level D static board review; no runtime scene, route, collision, player, camera, visitable, water-collision, or walkable geometry was modified.

## C3 corrections

- **Fountain B:** the unchanged Fountain B source is displayed at 128×114 px, top-left `(305, 252)`. Its bottom-center `(369, 366)` is anchored on the Hall upper plaza's horizontal paved surface, with only a tight, low-opacity contact shadow. The previous edge/wall-face read is removed without reducing P6 or route clearance.
- **Water:** a visual-only, nonlinear 610 px blend spans `y=150…760`, moving from far deep blue through blue-turquoise to protected harbor teal. An 86 px blurred visual-water mask uses the inverse Foundation Master B alpha, keeping the Foundation, collision, and Hero silhouette unmodified.
- **Scenic coverage:** Scenic A Final remains intact above a subdued ImageGen-derived coastal continuation (56% alpha, reduced saturation and brightness). The C3 board's fallback is quiet coastal blue rather than dark green. Coverage stays behind Foundation Master B and all locked landmarks.

## Locked content verification

Foundation Master B, Hall-B, Workshop-C, Office-B, Hero-B, Secondary-B, Workboat-A, the Scenic A Final town/mountains/cliffs/lighthouse treatment, Fountain B source, and Composition C prop family hashes are retained. `CanonicalRuntimeR2Scene.ts` and `BootScene.ts` retain their R2.4 SHA-256 baselines.

## Evidence

| File | Review focus |
| --- | --- |
| `01-fountain-before-after.png` | C2 edge read versus C3 plaza anchor |
| `02-fountain-grounding-closeup.png` | Fountain B anchor and contact shadow |
| `03-water-blend-before-after.png` | C2 seam versus C3 broad transition |
| `04-water-blend-squint-test.png` | Seam visibility at reduced detail |
| `05-scenic-coverage-before-after.png` | Removed fallback void |
| `06-composition-c3-final.png` | Final C3 composition |
| `07-canonical-vs-c3.png` | Canonical convergence comparison |
| `08-c2-vs-c3.png` | C2 to C3 delta |
| `09-c3-route-legibility.png` | Preview-only P1–P8 route legibility overlay |

## Human gate

`finalHumanSelection` remains `PENDING`. Runtime R3 integration remains blocked until the final human visual gate approves the static C3 composition.
