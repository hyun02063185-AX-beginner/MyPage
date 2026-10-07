# Runtime R3 Phase A.2 — Scenic Final Correction

## Scope

Phase A.1 Human review accepted the sky, mountain, cliff, lighthouse, Fountain B/F1, selective C prop mix, routes, hierarchy, and asymmetry. It identified two static-preview blockers: the hillside town did not read clearly at gameplay scale, and the far-sea plate met the turquoise harbor with an abrupt colour break.

This bounded final correction keeps every approved C.1 element in place. It creates **Composition C2** with a `scenic-a-final` render-only asset, no runtime import, and no collision source.

## Corrections

- **Hillside town:** a hazed, low-saturation sequence of small cream/stucco, terracotta-roof clusters now carries from upper-left into upper-center. Gaps and cypress silhouettes avoid a continuous wall; the town resolves down into the existing pale limestone coast.
- **Water transition:** a deterministic, non-repeating blue→turquoise bridge is confined by the existing Foundation Master B alpha mask. Its 22px feather ensures it affects only visual water gaps, not plaza, wall, landmark, ship, collision, or gameplay geometry.
- **Hierarchy:** Hall and Hero remain primary at normal board scale; town, lighthouse, and outer water stay supporting depth layers. Fountain B remains at approved F1 `(330, 330)` with the unchanged selective C prop list.

## Validation

The C2 route board retains the identical P1–P8 points and all original route segments. Foundation Master B and the runtime-scene/BootScene source hashes remain locked. `runtimeImported` remains `false`.

These are Level D static-composite assets and open-image inspection; they are ready for, but do not substitute for, the subsequent runtime Human Gate after explicitly authorized R3 integration.

## Evidence

| File | Purpose |
| --- | --- |
| `01-town-before.png` / `02-town-after.png` | Town visibility at the Hall-side gameplay framing |
| `03-water-transition-before.png` / `04-water-transition-after.png` | Far sea / protected-harbor color continuity |
| `05-composition-c2-final.png` | Primary 1920×1080 C2 Human Gate board |
| `06-canonical-vs-c2.png` | Canonical reference comparison |
| `07-c1-vs-c2.png` | Bounded correction comparison |
| `08-c2-route-legibility.png` | Unchanged P1–P8 preview overlay |

## Status

```text
SCENIC_A_FINAL = COMPLETE
MEDITERRANEAN_HILLSIDE_TOWN = COMPLETE
SKY_MOUNTAINS = COMPLETE
CLIFF_LIGHTHOUSE = COMPLETE
SEA_TO_HARBOR_TRANSITION = COMPLETE
FOUNTAIN_B = APPROVED_UNCHANGED
PROP_MIX_C = APPROVED_UNCHANGED
COMPOSITION_C2 = COMPLETE
ROUTE_LEGIBILITY = PASS (static preview)
RUNTIME_R3_INTEGRATION = BLOCKED
NEXT = R3_PHASE_A2_FINAL_HUMAN_VISUAL_GATE
GATE = READY_FOR_R3_PHASE_A2_FINAL_HUMAN_VISUAL_GATE
```
