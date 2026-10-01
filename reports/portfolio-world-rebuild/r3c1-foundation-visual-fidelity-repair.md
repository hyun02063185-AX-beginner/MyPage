# R3C.1 Foundation Visual Fidelity Repair

## Scope and invariant

R3C.1 repairs visual fidelity only. It preserves the R3A geometry, walkable
rectangles, collision topology, eight-step stair footprint, player size and
animation, movement speed, and camera follow/dead-zone behavior. No Batch B
architecture or Batch C Hero Ship work is included.

The source material is the existing untracked R3C Study A — Gameplay-first
PNG. Study B remains a secondary reference only; none of its ornate corner
motifs are used in the runtime route surfaces.

## Runtime derivatives

Four lossless PNG derivatives were deterministically synthesized from Study A
and committed under `portfolio-world-v2/public/assets/world/foundation/r3c1/`.
They load as four aligned L1 surfaces, never as a scene plate, and collision
continues to come only from `GrayboxScene.ts`.

| Asset | Runtime rectangle | Dimensions / bytes | SHA-256 |
| --- | --- | --- | --- |
| `upper-plaza-paving.png` | `(310,155) 780×345` | 780×345 / 443,225 B | `67015FCB522A05B39CF7102ED325A09A098A3477D254E08FB7F9FE9727C61C85` |
| `main-stair-surface.png` | `(650,480) 260×190` | 260×190 / 83,168 B | `F7FE25ABBF9A32DE17D1B14E9A3D1B31229912735E4F2760B277B0A88DBF8A5C` |
| `lower-quay-paving.png` | `(300,650) 890×285` | 890×285 / 387,389 B | `23010BF7BF1D83DFE0D1F9DF42ADB354FFB21CB1DCD3C20D3DC8957BFEED898B` |
| `quay-edge-face.png` | `(300,935) 890×40 visual face` | 890×40 / 64,203 B | `DBBD3058A7680D7B98F9544442CC2D6D7B3FE4ECD23F863E85EFB84AEE757289` |

The exact Study A provenance remains in the ignored local output directory
documented by R3C: `output/codyssey-image-benchmark/r3c-foundation-batch-a-rerun-01/`.

## Evidence and functional regression

Canonical review evidence is
`reports/portfolio-world-rebuild/evidence/r3c1-foundation-fidelity/`:

- `A-upper-plaza.png` through `G-player-quay.png` — required 1280×720
  material, stair, quay, and moving-player views.
- `foundation-before-after-contact-sheet.png` — R3C, Study A, and repaired
  R3C.1 side by side.
- `qa-result.json` and `movement-plaza-stairs-quay-30fps.mp4` — functional
  movement evidence (the filename is retained for continuity; this fidelity
  capture is encoded at 10 fps because no R3C.1 video-rate gate was specified).

`npm run typecheck`, `npm run build`, and `npm run qa:foundation-fidelity`
passed. The QA confirms route and collision assertions, stair traversal in both
directions, water exclusion, camera bounds/dead-zone/follow, directional player
animation and idle restoration, and zero browser/console errors. The build has
only Vite's existing non-fatal bundle-size warning.

## Human visual review preparation

| Criterion | Result | Note |
| --- | --- | --- |
| Material realism | PASS | Visible limestone grain and varied slabs replace the flat fill. |
| Paving clarity | PASS | Seams stay broad and do not imply obstacles. |
| Stair depth/readability | PASS | Sourced tread grain plus the same eight actual risers improve the level read. |
| Upper/lower level distinction | PASS | Warm plaza, weathered darker quay, and stairs remain distinct. |
| Quay masonry readability | PASS | The sourced edge face reads as masonry beneath the fixed rail. |
| Water boundary clarity | PASS | Stone stops at the same rail/face; procedural water remains separate. |
| Player visibility | PASS | The blue/gold player silhouette remains high contrast across surfaces. |
| Mediterranean style consistency | PASS | Warm limestone and controlled aging align with Study A. |
| Visual noise | CAUTION | The lower quay retains intentional maritime wear and needs human judgment at gameplay duration. |
| Remaining graybox impression | CAUTION | Foundation fidelity is repaired; neutral Batch B/C placeholder masses remain deliberately unfinished. |

This is a Human Visual Fidelity Gate preparation, not a self-approval and not
permission to begin Batch B.

```text
R3C.1_FOUNDATION_FIDELITY_REPAIR = COMPLETE
NEXT                             = FOUNDATION_VISUAL_FIDELITY_HUMAN_GATE
GATE                             = READY_FOR_FOUNDATION_VISUAL_FIDELITY_HUMAN_GATE
```
