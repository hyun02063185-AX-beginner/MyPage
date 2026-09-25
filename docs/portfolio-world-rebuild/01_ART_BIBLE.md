# 01. Portfolio World Rebuild — Art Bible

Status: **DRAFT — awaiting Human Gate 1 (paired with `00_VISUAL_BRIEF.md`)**
Updated: 2026-09-26

This document turns the Visual Brief's rules into the working vocabulary agents use during production. Where a principle is adapted from a vendored skill, the source is named. No v1 implementation tuning value (tile scale, alpha, pixel offset, occlusion height, etc.) is copied here — see `00_VISUAL_BRIEF.md` §13 for why.

## 1. Visual Pillars

1. **Visual first read = Harbor. Product priority = Portfolio. Game = the interaction/exploration layer.** The harbor first impression must be strong — it is what makes the space read as a place at all — but it is a *presentation layer* over the actual priority, which is portfolio information delivery. When a visual choice and a portfolio-delivery need genuinely conflict, portfolio delivery wins; the harbor identity does not get to "win" by being the first thing rendered (`00_VISUAL_BRIEF.md` §1, §9). This restates the original "harbor first, portfolio second, game third" ordering language, which read as a strict priority stack when it was meant to describe layers with different jobs, not a ranking where the harbor outranks the portfolio.
2. **Calm water, not adventure water** — sheltered-harbor energy, always (`00_VISUAL_BRIEF.md` §11).
3. **Asymmetric but never disorienting** — organic settlement growth with unambiguous wayfinding (`00_VISUAL_BRIEF.md` §8).
4. **One hero, a supporting cast, and a crowd** — fleet and building hierarchy is deliberate, not flat (`00_VISUAL_BRIEF.md` §10; environment-art's Hero/Unique/Modular/Dressing tiering, adapted below).
5. **Surface reads before detail does** — the squint test governs every composition (environment-art `references/patterns.md`, "The Squint Test for Value Hierarchy").

## 2. Shape Language

- **Water & terrain edges**: broad, rounded curves. No jagged coastline geometry, no sharp interior corners at a water/land boundary (this is a shape-language rule, distinct from — and reinforcing — the water *material* rule in §5).
- **Buildings**: readable rectilinear silhouettes with a dominant primary facade, consistent with a Hybrid 2.5D presentation (camera-facing illustrated elevations on top of plan-view ground) — the *projection concept* from v1's visual-grammar lock is kept; its exact 15°-elevation number is not re-locked here without a fresh runtime prototype to validate it against.
- **Ships**: hull-dominant silhouette, mast vertical, sails readable, bow/stern distinguishable at a glance — kept from v1's ship-surface grammar because it describes a universal sailing-ship-readability rule, not a v1 tuning value.
- **Props**: grounded, simple base shapes; detail lives in surface treatment, not silhouette complexity, for anything below Hero tier (§7).

## 3. Composition Hierarchy (adapted from environment-art's Hero/Unique/Modular/Dressing pattern)

Applied to a 2D harbor world rather than a 3D level:

| Tier | Role | Approx. share of visual "weight" in a given frame |
| --- | --- | --- |
| Hero | Hero Ship, Harbor Square's central landmark | Highest contrast, largest uncontested silhouette |
| Unique | Destination buildings (Guild Hall, Academy, Workshop, Exhibition Hall), medium sailing vessels | Notable, but never competing with Hero for the eye |
| Modular | Paving, dock/pier segments, shoreline, repeated architectural elements | Supports structure; must pass the tiling/repetition check (§11) |
| Dressing | Crates, barrels, benches, lamps, ropes, small working boats | Fills and adds life; lowest individual visual weight, contributes atmosphere in aggregate |

The **squint test** (environment-art `patterns.md`) is the standing acceptance check for every composition: blur or squint at a capture — if the intended focal point (Hero Ship, or the destination the frame is about) isn't what draws the eye first, the composition fails regardless of how much individual detail is "correct."

## 4. Harbor Silhouette

The harbor basin, waterfront structures, and Hero Ship's masts/rigging together must form a recognizable "this is a harbor town" silhouette from the whole-world overview alone, before any building facade or prop detail is legible. This is the 2D-composition equivalent of environment-art's "vista checklist" (clear focal point, leading lines, foreground/background separation, human/player-scale reference visible).

## 5. Water Language

Governed by `00_VISUAL_BRIEF.md` §11 (calm, low-energy, broad, soft, rounded; no sharp crests, no open-sea energy). In art-bible terms:

- Depth read: a gentle deep-to-shallow gradient is acceptable and desirable (kept as a *concept* from v1's water-material direction — not its exact palette values).
- Highlight behavior: soft, broad highlight streaks, not sharp glints.
- Hull contact: a soft, rounded contact treatment at the waterline — the *goal* v1's ART-09/ART-10/ART-11 sequence was trying to reach, reached there with a jagged wave-crest raster that this brief's §11 now explicitly rules out for a sheltered harbor. v2's contact treatment must be validated against §11's one-sentence test before being called final, not against whether a hull pixel is visibly occluded (occlusion existing is necessary, not sufficient — see the Visual QA Profile).

## 6. Fleet Language

Governed by `00_VISUAL_BRIEF.md` §10. In art-bible terms: the three tiers must be distinguishable by silhouette and scale alone, without needing a label — a viewer should be able to sort ships into Hero/Medium/Small by eye. Vessel material/rigging detail should scale with tier (Hero gets the most distinct detail; Small working boats the least) — mirroring environment-art's "hero areas get 80% of the detail budget" ratio in spirit, not as a literal percentage requirement for a 2D sprite project.

## 7. Architecture Language

Each destination building keeps its v1 semantic identity (Guild Hall = strong/historical/trustworthy, Academy = bright/open/vertical emphasis, Workshop = wood/craft/working, Exhibition Hall = clean/elegant/waterfront — from `retro-harbor-campus-art-direction-v1.0.md` §10–13) as a *brief*, to be redesigned visually rather than re-implemented at v1's scale/proportions. Each building must clear the Building-to-Ship rule in spirit: a primary destination building must remain comparable in scene importance to the Hero Ship (visual mass/silhouette/route importance — not literal pixel dimensions).

## 8. Materials

Core: Water, Wood, Stone, Greenery. Supporting: Fabric/Sail, Metal accents, Plaster/facade, Glass/windows (`00_VISUAL_BRIEF.md` §6). Each family must maintain internally coherent value, saturation, and texture-density behavior — a wood crate and a wood dock plank should look like they belong to the same material family even if their detail level differs by tier (§3).

## 9. Color System

Carried forward from the human-approved v1 direction (`retro-harbor-campus-art-direction-v1.0.md` §7) as color *families*, not locked HEX values — exact values are validated at native render scale during production, not chosen in the abstract.

| Family | Palette direction |
| --- | --- |
| Water | Blue / Teal / Blue-Green |
| Wood | Warm Brown / Honey Brown / Dark Brown Accent |
| Stone | Light Beige / Warm Gray / Soft Ivory |
| Structural Accent (roof/trim) | Terracotta / Muted Red / Deep Blue / Slate Blue |
| Greenery | Medium Saturation Green / Fresh Green Accent |
| Portfolio Accent | Blue / Teal / Muted Gold |

Principles:

- No oversaturation. Bright and warm does not mean loud.
- No per-asset palette drift — every asset pulls from the same family table above; a family's role (e.g. "Structural Accent") does not get a one-off substitute color because a single building "needed" it.
- The palette must read as a bright, warm harbor at every hour/lighting condition this project ships (see §10).
- Color contrast is one of the tools that enforces the composition hierarchy in §3 — Hero tier can claim the highest-contrast color moves in a frame; Dressing tier should not compete for that contrast.

Exact HEX values remain open pending the vertical slice.

## 10. Lighting System

Direction: **bright daytime harbor, warm-neutral daylight, soft readable shadows, open/welcoming atmosphere.**

Forbidden:

- Dramatic pirate-fantasy lighting (heavy vignette, cold moody rim light).
- Heavy sunset/orange cast as the default state.
- Horror-contrast lighting (deep crushed blacks, harsh spot falloff).
- Cinematic lighting that reduces navigation readability — a lighting choice never gets to make a destination, path, or the player harder to see.

Goal: buildings, ships, paths, and the player must all read clearly **at the same time**, in the same frame — lighting supports the composition hierarchy (§3) and the wayfinding rule (§12), it does not compete with either. Exact light angle and value range are decided during the Vertical Slice against an actual render, not locked here in the abstract (consistent with §11's tiling-validation ordering: qualitative rule first, number only after a real render check).

## 11. Texture / Detail Density — Tiling and Repetition Discipline

This section exists specifically because of v1's own recurring failure class (`00_VISUAL_BRIEF.md` §12–13). Before any tiled/repeated surface (paving, dock planking, water plate, shoreline) is approved:

1. Render it at **actual gameplay camera scale**, next to a fixed-size reference prop (bench, lamp, or the player sprite) — not at source-image zoom.
2. Apply the squint test (§3). Does an individual repeat unit compete with the reference prop for attention?
3. Check for a visible grid/repeat pattern at normal viewing distance (environment-art `sharp_edges.md`, "Envart Tiling Artifacts" — the only sharp-edges entry from that vendored skill directly applicable to this 2D project; see its `PROVENANCE.md` for why the rest of that file doesn't transfer).
4. Only after 1–3 pass does a scale/tiling number get treated as final. Do not lock a number first and validate later — that ordering is exactly what cost v1 three iterative rounds.

## 12. Landmark Hierarchy & Wayfinding

Every destination needs at least two independent visual cues (silhouette, sign, path direction, emblem, forecourt, landmark — never color alone; kept from v1's wayfinding rule because it is a usability principle, not a visual-style choice). Asymmetric layout (`00_VISUAL_BRIEF.md` §8) must be checked against this rule explicitly, not assumed compatible with it.

## 13. UI / World Relationship

World = retro/pixel-inspired/warm/game-like. Portfolio content UI = modern/clean/professional/readable (unchanged principle from v1, `retro-harbor-campus-art-direction-v1.0.md` §19–20). World labels (destination names, Harbor Square) may use a game-like presentation; actual portfolio content never does.

## 14. Asset Family Rules (from `create-game-assets`, vendored)

Per the vendored skill's own workflow: inspect existing direction before inventing → lock the technical frame (camera/view, native display size, world scale, palette) → approve **one** representative visual target at actual game scale before producing a family → produce related assets as a family sharing palette/view/proportions/lighting/detail density, not as unrelated one-off generations → normalize and validate in context at native resolution before calling anything production-ready. See `tools/agent-skills/vendor/gamedev-skills-awesome-gamedev-agent-skills/skills/disciplines/create-game-assets/SKILL.md`.

## 15. Good References

Policy: see `00_VISUAL_BRIEF.md` §7 — every entry records what is referenced, what is explicitly not referenced, and how it translates. Minimum canonical set, populated now rather than left empty:

**Reference 1 — Original Concept Image #1**
- Status: binary currently unavailable (searched across this repository's full history; not found — `90_DECISIONS.md` item 2).
- Use: the "Refined Retro Harbor" direction it established.
- Do not use: any exact copied asset or layout (none exists to copy in any case).
- Translation: bright, orderly harbor; balanced stone/wood material presence; teal water; a professional-but-exploratory mood — i.e., the written description in `00_VISUAL_BRIEF.md` §2's fallback paragraph, applied directly.

**Reference 2 — `retro-harbor-campus-art-direction-v1.0.md`**
- Status: available in full (`reports/portfolio-world/art-direction/`).
- Use: its approved written visual characteristics (theme, mood, material language, per-destination semantic identity — §7–14 of that document).
- Do not use: any v1 implementation tuning value (scale numbers, palette HEX, pixel offsets — see `00_VISUAL_BRIEF.md` §13).
- Translation: direct — this Art Bible's §1–8 and §12–13 are this reference's principles restated for v2's asymmetric-composition and 2D-Phaser context.

No additional external reference is forced into this document at this stage. New references, when introduced during production, follow the same three-field format above.

## 16. Anti-References

- v1's own final Harbor Vertical Slice screenshots, specifically for: the perfect cardinal cross layout, and the jagged wave-crest water-contact treatment. Kept as internal anti-references precisely because they are well-documented and already known not to fit this brief — not because v1's work was low-quality in an absolute sense.
- Dark Pirate Port / Heavy Medieval Fantasy / Horror Harbor / Overly Cute Chibi / Generic AI Game Art / Overdecorated Theme Park (`00_VISUAL_BRIEF.md` §5).

## 17. Environment-Art Skill Review Result

Reviewed in full (`tools/agent-skills/vendor/omer-metin-skills-for-antigravity/skills/environment-art/`, all three references). Verdict: **adopt the pattern/philosophy layer, do not adopt the 3D-engine-specific sharp-edges/validation layer wholesale.**

- `references/patterns.md` — squint test, Hero/Unique/Modular/Dressing tiering, composition framing, environmental-storytelling staging, and both anti-patterns cited in §3/§11/§16 above transfer directly and are incorporated into this Art Bible.
- `references/sharp_edges.md` — of ~10 entries, only "Envart Tiling Artifacts," "Envart Scale Inconsistency," and "Envart Over Cluttering" apply to a 2D Phaser project; the remainder (z-fighting, collision-mesh mismatch, draw-call/GPU-instancing, DCC pivot-origin, VRAM memory budgets, non-POT GPU padding, skybox-cubemap seams, lightmap bleeding, vertex-color density) describe 3D real-time-rendering failure modes that do not exist in this project's rendering pipeline.
- `references/validations.md` — **not applicable as written.** Every rule is a regex check against Unity/Unreal asset-metadata file types (`.meta`/`.asset`/`.uasset`/`.prefab`) that this project does not produce. None of its checks should be run against Portfolio World v2 files.

Full detail: `tools/agent-skills/vendor/omer-metin-skills-for-antigravity/PROVENANCE.md`.

## 18. Status

```text
ART_BIBLE_STATUS = DRAFT
AWAITING = HUMAN_GATE_1
```
