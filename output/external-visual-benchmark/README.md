# External visual benchmark evidence freeze

Recorded 2026-09-27 before the Leonardo one-shot edit gate. These are the Director's supplied benchmark observations, not new image generation or an independent rerun. Costs and token balances describe the first-pass session before its reset.

| Pipeline | Whole-scene quality | Constraint following | Production result | Gate |
| --- | --- | --- | --- | --- |
| Astra Master Scene | Strong | Moderate | Excellent reference image | PASS as Master Reference |
| Astra modular assets | Individual assets useful | Mixed | Cohesion collapses on recomposition | NO-GO |
| Astra scene-first | Strong scene cohesion | Ship/scale failures | Candidate failed final repair | NO-GO |
| Krea Free | Moderate visual appeal | Weak on camera/sails/scale | Too concept-art oriented | NO-GO |
| Leonardo Nano Banana F1 | Strong first-pass potential | Better but incomplete | One candidate merits controlled edit | EDIT GATE |

- Reference: [Astra Master Harbor Scene](../astra-master-harbor-benchmark/master-harbor-scene-final.png).
- [Krea first-pass result](krea-free-f1/benchmark-result.md): four candidates, no ranking.
- [Leonardo first-pass result](leonardo-nano-banana-f1/benchmark-result.md): candidate 01 is the sole correction target, not an approved result.
- [Locked Leonardo edit gate](leonardo-nano-banana-f1/edit-gate.md): one edit generation after the free-token reset; no repeated edits authorized.

## Preserved image evidence

The expected directories were initially absent. The Director identified Downloads as the source location, and all seven harbor outputs were located and copied from `C:\Users\user\Downloads` without changing their bytes. Krea retains three PNGs and one WebP; Leonardo retains three JPGs. No format conversion was performed.

Numbering follows ascending download creation time within each service, not quality ranking. Leonardo's original unsuffixed `...-0.jpg` maps to `candidate-01.jpg`; `...-0 (1).jpg` and `...-0 (2).jpg` map to candidates 02 and 03. Krea candidates are not ranked. The original-to-archive mapping, download times, sizes and verified SHA-256 hashes are in [preservation-manifest.json](preservation-manifest.json).

No artwork was generated, edited, recompressed or replaced. All seven archived copies match their Downloads originals exactly. The next edit is locked to [Leonardo candidate 01](leonardo-nano-banana-f1/candidate-01.jpg), not an approved scene.
