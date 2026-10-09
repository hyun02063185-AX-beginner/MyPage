# R5 Phase C.1 — Geometry Conflict Audit

Status: `DRAFT_SPATIAL_INTEGRITY_REPAIRED_PENDING_HUMAN_REVIEW`  
Reference: Candidate B — **PROVISIONAL**  
Baseline preserved: `c2ac4093ab4a51198bf4b5f6a224547012cbf6e6`

## Reproduced Phase C conflicts

The C.1 automated test loads the preserved Phase C JSON and reproduces these factual data failures:

| Preserved C declaration | Result | Why the old test passed |
|---|---|---|
| `N_HALL_STAIR_BASE` `[195,320]` | Inside `B_WORKSHOP_BUILDING` | It checked only its named stair polygon, not blocked zones. |
| `N_ARCHIVE` `[125,480]` | Inside `B_ARCHIVE_INTERIOR` | It checked only its named Archive approach, not blocked zones. |
| `E_WORKSHOP_HALL_BASE` / `E_HALL_STAIRS` | Vertices overlap Workshop blocked polygon | It tested vertices as walkable, not collision-free full segments. |
| `E_WORKSHOP_ARCHIVE` | Path did not prove continuous walkable surface and approached Archive interior | It tested vertices, no segment/width/collision check. |
| `S_WORKSHOP_LOWER` | Connector had no matching navigation edge | Connector and navigation data were not cross-checked. |
| Workshop → Promenade | L1→L0 was declared as ordinary ground | Edge endpoint elevations were not checked against edge type/connector. |

## C.1 repair approach

Phase C is unchanged. C.1 writes a separate `r5-spatial-blueprint-c1-draft.json` and records every change there.

- The Hall stair base moves to `[120,315]`, outside Workshop collision.
- Archive interaction moves to `[180,560]`, on an exterior approach and outside Archive collision.
- Workshop → Hall bends around the Workshop ground footprint before using two explicit Hall stair connectors.
- Workshop → Archive uses an exterior right-side approach corridor, never the Archive interior.
- Workshop and promenade are both L0 continuous ground. `S_WORKSHOP_LOWER` is removed rather than invented.
- Hall elevation is represented as L0 → L1 → L2 with a lower and upper named stair connector.
- The shore-to-pier apron is named as a separate bridge surface; Hero access remains promenade → pier → dock → gangway → boarding threshold.

## Visual projection versus authored collision

The painted Candidate B image is perspective/projection art. A facade, roof, mast, foliage, or foreground plant can cover a screen coordinate without occupying that coordinate at player ground level. C.1 therefore keeps four distinct annotations:

1. **Visual silhouette** — projected art extent; never collision by itself.
2. **Ground footprint** — design intent for the structure’s contact with ground.
3. **Collision footprint** — draft runtime-facing blocked intent, to be authored later from approved assets.
4. **Foreground occlusion** — visual depth candidate, expressly not collision.

Collision footprints were not reduced merely to pass tests. They are independently declared ground-contact envelopes with a stated basis; the routes are then rerouted outside them. Their exact final shape is still unresolved until authored source assets and Human spatial choice exist.

## Camera / world-range finding

The 1280×720 draft world has no camera travel at zoom 1.0. At zoom 1.25, the 1024×576 visible world allows only 256×144 units of travel. This is a legitimate constraint for a broad single-screen composition, but is limited for an exploration-oriented portfolio. C.1 records it and does not select a final world size.

## Validation added

`portfolio-world/tests/r5-spatial-blueprint-c1.test.mjs` now checks the preserved failures and C.1’s repair using declared geometry:

- all nodes in named walkable surfaces and outside building/cliff/hull collision;
- every route segment sampled at 2u spacing, at center and ±16u player half-width;
- route centerlines do not intersect non-water collision polygons;
- only named bridge surfaces traverse water;
- level changes use a stair connector or gangway;
- every major requested route is connected;
- widths meet the 48u 32×64-player corridor minimum.

No source pixels, alpha, or colour are interpreted as collision data.
