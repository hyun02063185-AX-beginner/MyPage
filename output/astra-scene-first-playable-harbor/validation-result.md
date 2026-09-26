# Astra Scene-First Playable Harbor Validation: COMPLETE

Final bounded repair gate. Starting HEAD: `1774d5af6c513d2a01de0725987d8081e3245e88`.

Master Reference:
`output/astra-master-harbor-benchmark/master-harbor-scene-final.png`

Scene-First Final:
`output/astra-scene-first-playable-harbor/scene-first-vertical-slice-final.png`

**The localized edit completed successfully and removed the fourth mast. The gate still fails because hanging scalloped canvas remains and no tested constant player scale is convincing across the entire foreground route. This is not a capacity-blocked result.**

Assessment:

| Criterion | Result | Current evidence |
| --- | --- | --- |
| Master visual continuity | PASS | The established warm stone, timber, navy/gold and sheltered teal-water world survives the edit. |
| Whole-scene cohesion | PASS | No modular assembly was introduced; continuous quay, lighting and reflections retain the previous scene's cohesion. |
| Hero Ship mast count | PASS | Exactly three deck-rooted groups at approximately source x=827,941,1177. Extra bow-side mast near x=1340 removed, with natural waterfront restoration behind it. |
| Hero Ship furled sails | **FAIL** | Several yards retain deep scalloped hanging cream fabric instead of compact rolls directly on spars. New prominent gathered cloth on the bowsprit also fails the strict compact-bundle requirement. No broad deployed sail is present, but that alone is insufficient. |
| Hero Ship overall quality | **FAIL** | Landmark hull and three-mast silhouette are retained; required sail semantics remain wrong. |
| Environment integration | PASS | Waterline, berth, water, quay and architecture remain integrated; no visible patch seam found at the removed mast. |
| Projection consistency | PASS | No substantial camera, perspective or composition change. Existing foreground depth scaling remains relevant to player calibration. |
| Foreground occlusion viability | PASS | Same lamp alpha selection, refreshed with repaired source RGB. Proxy is naturally partly behind the shaft; static reconstruction is exact. |
| Player integration viability | **FAIL** | Approximately 64 logical px is the best tested scale at Hall and middle quay, but the nearest bollards/paving still make the actor appear undersized. The 49 and 56 px candidates are worse. No tested constant scale clears the full-route requirement. |
| Navigation-mask viability | PASS | Existing masks and hotspot data unchanged; all required routes, hotspot polygons and four scale-test positions remain accessible. |

## Bounded edit and locality

One completed localized image edit was performed in this final repair gate. The prior attempt at starting HEAD had returned HTTP 429 before producing an image; capacity was available for this attempt. No new complete scene, new harbor design, new character or further art iteration was generated.

The before image remains `evidence/authored-initial.png`; the returned repair is `evidence/authored-repair.png`. The environment plate is an exact copy of the latter. Actual inspection found retained layouts of the Hall, quay, hull, water, vegetation and secondary vessel. Texture-level drift outside the target is measurable, so this is not claimed as a pixel-locked masked edit.

`evidence/repair-comparison.json` records mean absolute RGB-channel differences on a 0–255 scale: Hall 10.65, foreground 13.31, open water 5.63, hull 7.44, removed-mast/background area 25.58. These numbers document drift, not a stand-alone quality pass. The largest structural change is where intended; unrelated architecture/water/quay composition did not change substantially enough to reject the entire returned image. The visible sail defects still prevent acceptance.

Refinement cycles used:
**1 completed bounded repair in this gate.** Across the original validation plus repair: two edit requests, one capacity-blocked and one completed. No further visual repair was attempted.

## Player-scale selection

The existing temporary proxy was rendered at 64, 73 and 84 source pixels: approximately 49, 56 and 64 logical pixels. All three were compared at Hall (145,480), middle quay (330,628), lamp (128,612) and foreground promenade (720,880). See `evidence/player-scale-comparison.png`.

Selected review-frame height: **84 source px = 64.27 logical px**, called the 64 px candidate. The larger candidate gives the most credible door/body and mid-quay furniture relationship and keeps useful path width. It is the best available candidate, not an approved final character scale: the foreground still reads too large around it. Increasing the tested range indefinitely or introducing perspective scaling would exceed this bounded evaluation. No character art was generated or changed.

## Actual visual QA

Opened the original plate, returned repair, 12-panel scale comparison, native Hero review crop, rebuilt final gameplay frame, three-position proof and full layer reconstruction. Examined the revised ship's mast bases and retained yards, restored shoreline behind the removed mast, hull/water contact and player contact at the four positions. The final frame and Director JPEG have no labels, masks or debug marks.

The three-mast correction visibly succeeded. The sail correction visibly did not. The contact and lamp occlusion mechanism works, while whole-route scale remains unconvincing. These findings govern the gate independently of successful scripts.

## Technical QA

Commands completed successfully:

```text
powershell -NoProfile -ExecutionPolicy Bypass -File output/astra-scene-first-playable-harbor/evidence/repair-review.ps1
python output/astra-scene-first-playable-harbor/evidence/validate.py
python output/astra-scene-first-playable-harbor/evidence/compare-repair.py
```

- Walkable/collision PNGs are byte-identical to starting HEAD; hotspot JSON is unchanged (Git line-ending normalization accounted for). No navigation edits were necessary.
- Start, all three hotspot centers, every pixel of their polygons and all four scale-test positions are reachable.
- Water and architecture samples remain blocked; no route regression.
- Reachable legal area remains 130,433 / 131,004 pixels (99.564%); 571 nonessential isolated pixels remain an existing limitation.
- Foreground uses the same 2,727 opaque source coordinates, now sampled from the repaired plate. Maximum reconstruction channel difference: **0**.
- Exact 1280 × 720 Director JPEG: 437,931 bytes; Hero crop 1012 × 750: 319,067 bytes. Both below 1 MB, JPEG quality 92.

Director files:

- `evidence/director-review-1280x720.jpg`
- `evidence/director-review-hero-crop.jpg`

## Major remaining risks

1. Sail bundles still violate the explicit no-deep-scallops rule; the generated correction only partially satisfies the ship request.
2. Player scale improves locally but fails across the closest foreground cues at all three tested constant heights.
3. The edit introduces non-target texture drift, though spatial layout is preserved. General pixel-locked edit repeatability is not established.
4. Occlusion is proven only for one bounded static lamp corridor; movement, swept collisions, entrance traversal and tiny isolated mask pockets remain outside this static validation.

Only the existing scene-first output directory was changed. Runtime, prior benchmarks, root portfolio files, masks and hotspot definitions were left untouched. This commit records a completed failed repair, not visual success or production readiness. Do not begin Codex scene-first integration from this candidate.

FINAL GATE:
**ASTRA_SCENE_FIRST_NO_GO**
