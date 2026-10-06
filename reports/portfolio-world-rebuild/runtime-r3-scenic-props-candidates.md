# Runtime R3 Phase A — Scenic Background and Harbor Props Candidates

## Scope and locked baseline

R2.4 Foundation Master B, the world frame, camera, P1–P8, routes, collision, locked buildings, locked fleet, and 28×56 player remain unchanged. This is a **static art-direction and composition gate**: no R3 candidate is imported by the Phaser runtime.

## Skills used

- **environment-art:** applied the squint test, Hero/Unique/Dressing hierarchy, asymmetric negative-space discipline, and story-vignette approach. Hero-B and Hall-B remain the dominant reads; props are clustered as small functional cues instead of uniform decoration.
- **create-game-assets:** established transparent family normalization, deterministic canvases, scale targets, provenance, collision intent, and occlusion intent. ImageGen outputs were treated as source studies, then cropped and normalized before preview.
- **portfolio-world-visual-qa:** the Visual Brief and Art Bible were reread before review. All claims here are static candidate-preview findings, not an actual-runtime visual pass; R3 remains pending human selection and later runtime QA.
- **ImageGen:** generated the five source studies: Scenic A/B, one prop-family collection, and Fountain A/B.

## Canonical gap and direction

The R2.4 runtime has coherent harbor construction but lacks distant coastal context and lived-in detail. The candidates restore bright warm Mediterranean depth, cliff/town/lighthouse scale cues, selective civic props, and light harbor work cues without changing the four-point playable structure or turning dressing into new landmarks.

## Scenic candidates

| Candidate | Direction | Strengths | Weaknesses | Score /20 |
| --- | --- | --- | --- | ---: |
| Scenic A | Lush hill town, layered blue-gray mountains, small far lighthouse | Strong canonical atmosphere and depth; wide open lower playfield; warm but subordinate | Slightly denser left background needs final in-engine contrast validation | **18** |
| Scenic B | Cleaner cliff town and lighthouse coast | Clear separation and broad negative space | Darker sky/value treatment is less aligned to the approved bright harbor brief | **14** |

## Prop family and scale

- **Hall:** Fountain, flower planter, cypress/urn, banner, bench, and lamp candidates support the civic terrace without competing with Hall-B.
- **Workshop:** crate stack and barrels form one restrained working vignette; Workshop-C already carries the primary craft read.
- **Office:** a small notice board and lamp establish a quiet functional node rather than a new landmark.
- **Central Quay:** bollard and rope coil communicate mooring without obstructing P3 routes.
- **Hero Quay:** a larger bollard and short mooring rope reinforce berth purpose while preserving Hero-B dominance.
- **Vegetation:** cypress, white/pink flowers, and small planters soften the fortress-like foundation in asymmetric clusters.
- **Lamps/Benches:** dark metal/brass and warm wood use the existing blue/gold and honey/limestone family.
- **Bollards/Ropes:** future collision is not implemented. Manifest records `decorative-no-collision` or `future-small-obstacle`, plus future occlusion intent.

Fountain A is ornate and attractive but too visually assertive at the plaza scale. **Fountain B is recommended**: its low, simple silhouette reads as a civic focal point without competing with Hall-B. Both are candidates; neither is runtime art.

## Composition candidates

| Candidate | Assembly | Score /25 | Review |
| --- | --- | ---: | --- |
| A | Scenic A + richer canonical-inspired props | 20 | Strong life and convergence, but has less visual breathing room near working zones. |
| B | Scenic B + restrained props | 20 | Best route restraint, but weaker atmosphere and less bright-Mediterranean alignment. |
| C | Scenic A + selective gameplay-first mix | **25** | Recommended balance: background context, visible paths, intentional vignettes, and preserved Hero/Hall hierarchy. |

## Readability, hierarchy, and water

Composition C keeps the P1→P2→P8→P4→P5→P6 and P8→P3→P7 corridors visually open; the route board makes this assessment auditable without claiming a collision change. Hall-B and Hero-B remain Tier 1 under the squint-test hierarchy. Workshop-C and Office-B remain readable; the lighthouse is a small distant accent. Preview water polish is limited to calm turquoise depth and subtle soft highlights—no wave crests, foam, or animated-noise treatment.

## Human gate

Recommended starting point: **Composition C, Scenic A, Fountain B**. This is not an automatic approval and no R3 asset is loaded into the runtime.

## Evidence

- [01 Scenic A](evidence/runtime-r3-scenic-props-candidates/01-scenic-a.png)
- [02 Scenic B](evidence/runtime-r3-scenic-props-candidates/02-scenic-b.png)
- [03 Prop family](evidence/runtime-r3-scenic-props-candidates/03-prop-family-sheet.png)
- [04 Fountain candidates](evidence/runtime-r3-scenic-props-candidates/04-fountain-candidates.png)
- [05 Composition A](evidence/runtime-r3-scenic-props-candidates/05-composition-a.png)
- [06 Composition B](evidence/runtime-r3-scenic-props-candidates/06-composition-b.png)
- [07 Composition C recommended](evidence/runtime-r3-scenic-props-candidates/07-composition-c-recommended.png)
- [08 Canonical comparison](evidence/runtime-r3-scenic-props-candidates/08-canonical-vs-r3-candidates.png)
- [09 Route legibility](evidence/runtime-r3-scenic-props-candidates/09-player-route-legibility.png)
- [10 Prop scale review](evidence/runtime-r3-scenic-props-candidates/10-prop-scale-review.png)

`READY_FOR_R3_SCENIC_PROPS_HUMAN_SELECTION`
