# Batch 02 Waterfront Overlap — Short Independent Re-check
## Portfolio World — Retro Harbor Campus

> Canonical repo path:
> `reports/portfolio-world/art-production/mass-asset-production-batch-02-waterfront-overlap-short-recheck.md`

Reviewer: Claude Code (independent; did not implement the hotfix). Scope: the waterfront overlap hotfix only, per
the narrow instruction. The full Batch 02 independent review is not repeated. No runtime code, asset, or layout
file was modified; one throwaway scratch script (never committed, deleted immediately after use) was used to
independently exercise the validator against the documented pre-hotfix coordinates.

---

## A. Gate

```text
RETURN_TO_CODEX
```

The hotfix correctly closes all four originally-reported overlaps (independently re-verified against the exact
rendered/display geometry, not just the new validator's own claim). However, independently recomputing the same
rendered-alpha rectangles for the four *repositioned* props against **each other** and against **nearby
pre-existing detail props that were never part of the original finding** found real, comparably-sized new
overlaps that the hotfix's own validator and report both missed and claimed did not exist. This is a new material
overlap under this instruction's own return criterion.

---

## B. Work Context

| Item | Value |
| --- | --- |
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | `win32 x64` |
| Branch | `feature/portfolio-world-sprint-02` (expected, confirmed) |
| HEAD at start | `1b7f888 docs(portfolio-world): record batch 02 overlap hotfix` |
| Git status at start | clean |
| Node / npm | `v24.16.0` / `11.13.0` (matches expected) |

No unrelated modification was present; the review proceeded.

---

## C. Reviewed Range

`fb1d505..1b7f888` (commits `5005e3a` fix, `1b7f888` docs). Diffed directly: `portfolio-world/src/world/
layoutValidation.mjs` (new `BATCH02_VISIBLE_BOUNDS`/`renderedVisibleRect`/`assertBatch02WaterfrontClearance`),
`portfolio-world/src/world/worldLayoutData.json` (exactly the four reported prop lines — confirmed no other line in
the file changed), `portfolio-world/tests/spatial-layout.test.mjs` (one new regression test), and the rebuilt
`world/` bundle. Confirmed the new coordinates match the hotfix report's table exactly
(`harbor-tree-02` 720/952→800/896, `harbor-shrub-planter` 648/1000→640/892, `harbor-safety-rail` 704/1012→824/912,
`harbor-service-marker` 1200/980→1212/980).

---

## Part A — Overlap Closure

```text
A. harbor-tree-02 ↔ viewing terrace / bench:        PASS
B. harbor-shrub-planter ↔ viewing terrace / bench:  PASS
C. harbor-safety-rail ↔ viewing terrace / bench:    PASS
D. harbor-service-marker ↔ flag:                    PASS
```

Independently reconstructed each prop's actual rendered visible-content rectangle from first principles — not
trusted from the validator — by reading the real Phaser placement call in `WorldScene.ts`
(`this.add.image(visual.x, visual.y + visual.height / 2, ...).setOrigin(0.5, asset.originY).setDisplaySize(...)`)
and combining it with the alpha-trimmed local offsets independently re-derived in the prior full review's own
from-scratch PNG decoder (which, cross-checked here, match the hotfix's hardcoded `BATCH02_VISIBLE_BOUNDS` exactly
to the pixel for all four props). Computed world-space rectangles:

| prop | rendered rect (l,r,t,b) |
| --- | --- |
| harbor-tree-02 | 773, 827, 875.7, 922.7 |
| harbor-shrub-planter | 616, 664, 881.9, 907.9 |
| harbor-safety-rail | 796, 852, 903.0, 929.0 |
| harbor-service-marker | 1203, 1221, 958.8, 1006.8 |

Compared against the protected objects' full boxes (`waterfront-viewing-terrace` 624–784×936–1016,
`waterfront-viewing-bench` 672–736×1020–1044, `exhibition-flag-east` 1172–1196×936–984): zero overlap in all
twelve prop×protected-object pairs. All four original cases are genuinely closed.

---

## Part B — Accepted Composition Protection

```text
PROTECTED_COMPOSITION_PASS
```

`git diff fb1d505..5005e3a -- portfolio-world/src/world/worldLayoutData.json` shows exactly four changed lines —
the four reported props' `x`/`y` only (their `width`/`height` are byte-identical). Every other entry in `zones`,
`paths`, `forecourts`, `reservedLots`, and the remaining `harborVisuals` — including `waterfront-viewing-terrace`,
`waterfront-viewing-bench`, and `exhibition-flag-east` themselves — is untouched. `Player.ts`,
`waterCollisionGeometry.mjs`, `gameConfig.ts`, and every primary-building/ship PNG are confirmed byte-unchanged
(empty diff). Collision, IA, destination routes, and water carve-outs are unaffected.

---

## Part C — New-overlap Check

```text
NEW_OVERLAP_CHECK_NEEDS_FIX
```

Re-ran the same rendered-rectangle reconstruction used in Part A for **all twelve** Batch 02 props (not only the
four moved ones) and checked every pair — including the four moved props against each other, and against the
closest pre-existing detail-tier objects the original finding never named. This surfaced real, independently
confirmed new overlaps introduced by the reposition itself:

| pair | overlap (w×h) | new? |
| --- | --- | --- |
| `harbor-safety-rail` ↔ `harbor-tree-02` (both moved) | 31.0 × 19.7 px | **yes** — pre-hotfix rects did not overlap (verified: pre-hotfix y-ranges 1002.96–1028.96 vs 931.7–978.7, no overlap) |
| `harbor-safety-rail` ↔ `exhibition-display-board` (existing, unmoved, not in the original finding) | 28.0 × 26.0 px | **yes** — pre-hotfix safety-rail x-range never reached the board's box |
| `harbor-tree-02` ↔ `exhibition-display-board` | 3.0 × 42.7 px | **yes** — narrow (3 px) but real; pre-hotfix tree-02 never reached the board's x-range |
| `harbor-shrub-planter` ↔ `harbor-notice-board` (notice-board unmoved) | 9.0 × 26.0 px | **yes** — pre-hotfix shrub-planter/notice-board had zero y-overlap (989.9–1015.9 vs 871.8–927.8); post-hotfix they now share 26 px vertically |
| `harbor-rope-coil` ↔ `harbor-notice-board` (both unmoved) | 18.0 × 3.4 px | no — pre-existing, unrelated to this hotfix (already noted as a minor internal touch in the prior full review) |
| `harbor-bench` ↔ `waterfront-viewing-terrace` (bench unmoved) | 41.0 × 1.1 px | no material change — a ≤1.1 px sliver, within alpha-threshold measurement tolerance, not a real visible overlap |

The first four rows are genuinely new, independently reproduced, and comparable in magnitude to the four overlaps
the original independent review classified as Major (which ranged 5×28 to 56×39 px). `harbor-safety-rail` and
`harbor-tree-02` — the two props moved closest together — now visibly overlap each other, and both newly reach
into `exhibition-display-board`, a pre-existing secondary-tier prop near the Exhibition Hall approach that the
original finding, the hotfix, and its validator never considered. None of this is caught by
`assertBatch02WaterfrontClearance`, which only checks the four moved props against the three originally-named
protected IDs (`waterfront-viewing-terrace`, `waterfront-viewing-bench`, `exhibition-flag-east`) — it does not
check the four moved props against each other, nor against any other existing harbor visual.

No new overlap blocks a major visible route (none of the six pairs above involve a `PERMANENT_STREETSCAPE_TYPES`
member overlapping `paths`/`forecourts`/`zones` — that unrelated, pre-existing check still passes at 26/26). No new
mechanical grid was introduced (the moved coordinates are still irregularly spaced). The terrace itself is now
clear and readable (Part A), but a new, equally real clutter problem exists immediately adjacent to it, among the
very props that were supposed to fix the clutter.

---

## Part D — Validator Review

```text
OVERLAP_VALIDATOR_PASS_WITH_MINOR
```

Against this section's own checklist:

- **Uses intended rendered/display bounds:** yes — `renderedVisibleRect()` exactly reproduces
  `WorldScene.ts`'s real placement formula (`imageX = visual.x`, `imageY = visual.y + visual.height/2`,
  `origin = (0.5, asset.originY)`, `displaySize = (asset.displayWidth, asset.displayHeight)`), confirmed by reading
  the actual placement call, not assumed.
- **Protected objects are explicit:** yes — a named `Set` of exactly the three accepted objects.
- **The four affected props are covered:** yes — `BATCH02_VISIBLE_BOUNDS` lists exactly the four, with alpha-trim
  offsets that match an independent from-scratch PNG decode to the pixel.
- **Narrow enough to avoid brittle false positives:** yes, by design — and this is exactly why it produced a false
  *negative* instead (Part C). The validator is correct for the specific 4-vs-3 pairing it was written to check,
  but that scope is now known to be too narrow to have caught what the hotfix actually needed to guarantee ("no
  new nearby overlap"). This is a real gap, not a wrong implementation — it does precisely what it says, and what
  it says turned out to be insufficient.

Recommend broadening the check (or adding a second explicit rule) to also compare the four moved props against
each other and against their nearest existing neighbors (at minimum `exhibition-display-board` and
`harbor-notice-board`) before this is relied on again.

---

## Part E — Pre-hotfix Regression Proof

```text
PRE_HOTFIX_REGRESSION_PROOF_PASS
```

Wrote a standalone scratch script (never committed; imported the real, unmodified
`layoutValidation.mjs`/`layoutTransform.mjs`/`worldLayoutData.json` from a temporary file inside
`portfolio-world/`, deleted immediately after running) that reconstructs each documented pre-hotfix RAW coordinate,
converts it through the real `-96` town-translation `layoutTransform.mjs` applies (confirmed
`TOWN_TRANSLATION_Y = -96`), and calls `validateWorldLayout` on the result — independent of the committed test
file. Result, one prop at a time:

```text
tree-02 alone (720/952 raw)         -> THREW: harbor-tree-02 / waterfront-viewing-terrace
shrub-planter alone (648/1000 raw)  -> THREW: harbor-shrub-planter / waterfront-viewing-terrace
safety-rail alone (704/1012 raw)    -> THREW: harbor-safety-rail / waterfront-viewing-terrace
service-marker alone (1200/980 raw) -> THREW: harbor-service-marker / exhibition-flag-east
current committed coordinates       -> did not throw (correct — no regression in what the validator checks)
```

All four pre-hotfix coordinates independently fail against exactly the protected object the original review
named, confirming the new test and validator are not tautological or accidentally-always-passing.

---

## Part F — Preload Reconciliation

```text
PRELOAD_BASIS_PASS
```

The hotfix changed only `x`/`y` coordinates — no asset file, manifest entry, or `BootScene` preload list changed.
Independently re-summed the exact production (non-DEV) preload set (`heroShipD`, `exhibitionHall`,
`secondaryBrig`, `secondaryCutter`, `guildHall`, `academy`, `workshop`, `harborWarehouse`,
`mediumSailingVessel`, `harborTree`, `cargoCrate`, `harborLamp`, plus the twelve Batch 02 assets) directly from
disk: **659,767 bytes**, matching this instruction's stated canonical figure and the prior full review's
independent reconstruction exactly. `BootScene.preload()`'s actual asset list is confirmed to be the canonical
runtime-transfer basis (it is the only thing that determines what a normal production load actually requests).
The historical `744,949`-byte figure from the prior instruction remains unreconciled documentation history only
(carried-forward Minor BS-05 from the full review); it was not used and is not needed as a baseline going forward.

---

## Part G — QA

Run from `portfolio-world/`:

| Step | Result |
| --- | --- |
| `npm ci` | PASS — 19 packages, 0 vulnerabilities |
| `npm run typecheck` | PASS (exit 0) |
| `npm test` (typecheck + build + tests) | PASS — build `world/assets/index-DbLBZvZc.js` 1,434.62 kB / gzip 371.65 kB (only the pre-existing >500 kB advisory); **26/26 tests PASS**, 0 fail, including the new "Batch 02 rendered alpha bounds cannot cover accepted waterfront amenities" test |
| Build reproducibility | PASS — rebuild produced a byte-identical `world/` output (`git status` empty afterward) |
| `git diff --check` | PASS (exit 0) |

No stale preview process was found or needed stopping.

---

## Part H — Remaining Findings

No Blocker. One Major (carried over in substance, relocated), the four previously-deferred Minors unchanged.

```text
ID: BS-06
Severity: Major
Category: implementation defect (new regression introduced by the fix itself)
Finding: The waterfront-overlap hotfix closed all four originally-reported overlaps but, in relocating
  harbor-tree-02 and harbor-safety-rail close together and close to the pre-existing exhibition-display-board,
  and harbor-shrub-planter closer to the pre-existing harbor-notice-board, introduced new, comparably-sized
  visible-content overlaps that its own validator does not check for and its own report claims do not exist.
Evidence: Independent rendered-rectangle reconstruction (Part C) using the exact WorldScene.ts placement formula:
  harbor-safety-rail/harbor-tree-02 31.0×19.7 px, harbor-safety-rail/exhibition-display-board 28.0×26.0 px,
  harbor-tree-02/exhibition-display-board 3.0×42.7 px, harbor-shrub-planter/harbor-notice-board 9.0×26.0 px; all
  four independently confirmed absent before the hotfix and present after it; none is caught by the current
  26-test suite (`project-owned spatial layout validates` still passes on the current, overlapping state).
Impact: The waterfront/work-yard cluster still has visible sprite-on-sprite clutter after the hotfix — moved to a
  new location and a new pairing (two of the four repositioned props overlapping each other, plus a
  previously-unaffected display board) rather than eliminated. No functional/collision/navigation impact (all
  items remain non-collidable); no impact on any locked contract, primary building, or IA.
Recommended action: Nudge harbor-safety-rail and/or harbor-tree-02 further apart and away from
  exhibition-display-board's box (824–888×880–960), and nudge harbor-shrub-planter away from
  harbor-notice-board's rendered content (590–625×871.8–927.8). Before resubmitting, extend the validator (or add
  a second explicit rule) to check the four repositioned props against each other and against
  exhibition-display-board/harbor-notice-board, so this class of self-inflicted regression cannot recur silently
  a second time.

Carried forward, unchanged, non-blocking: BS-01 (Batch 02 report documentation gap), BS-02 (1–2 px visibleBounds
measurement drift on the original 8 unmoved audit entries — the 4 moved props' bounds are now pixel-exact, see
Part A), BS-04 (harbor-cargo-stack-v01's tight 2.9% weight headroom), BS-05 (unreconciled historical 744,949-byte
figure).
```

---

## Part I — Human Review Readiness

Not ready. The specific defect a human whole-world review would most likely notice — visible clutter/overlap in
the waterfront work-yard corner — is still present; it has simply moved to a new pair of props and a new neighbor.
Sending this forward now would repeat the same wasted-attention problem the first RETURN_TO_CODEX was meant to
avoid.

## Part J — Final Recommendation

```text
RETURN_TO_CODEX
```

Apply a second, small coordinate-only adjustment to `harbor-safety-rail`, `harbor-tree-02`, and (if the
notice-board touch is judged worth fixing at the same time) `harbor-shrub-planter`, verified this time against
each other and against `exhibition-display-board`/`harbor-notice-board`, not only against the original three
protected objects. Batch 03 remains not authorized.
