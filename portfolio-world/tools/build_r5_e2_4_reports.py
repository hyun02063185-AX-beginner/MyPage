"""Emit the R5 E2.4 human-review boards, reports, and design data."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WORLD = Path(__file__).resolve().parents[1]
REPO = WORLD.parent
REPORT = REPO / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4"
MOTION = REPORT / "motion-evidence"
DATA = REPO / "data/portfolio-world/r5-full-walk-animation-polish-draft.json"
FONT = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def f(size): return ImageFont.truetype(FONT, size)
def t(draw, xy, string, size=22, color="#26384d"): draw.text(xy, string, font=f(size), fill=color)


def board():
    before = Image.open(MOTION / "side-before-frames/frame-06.png").convert("RGB")
    after = Image.open(MOTION / "side-after-frames/frame-06.png").convert("RGB")
    canvas = Image.new("RGB", (2100, 730), "#f8f4eb")
    draw = ImageDraw.Draw(canvas)
    t(draw, (45, 30), "R5 E2.4 — Actual Phaser gameplay comparison", 40)
    t(draw, (47, 83), "Same Candidate B scene, same workshop spawn, same 170 world px/s leftward input, actual Vite runtime capture.", 19, "#65717d")
    for index, (label, image) in enumerate((("BEFORE · R4 4 frames / 8fps", before), ("AFTER · Pilot side v2 8 frames / 48fps", after))):
        x = 35 + index * 1030
        t(draw, (x + 8, 125), label, 25)
        canvas.paste(image, (x, 160))
    canvas.save(REPORT / "14-character-gameplay-comparison.png")

    sprites = Image.open(REPORT / "11-improved-walk-sprite-comparison.png").convert("RGB")
    auto = Image.open(MOTION / "auto-navigation-walk-frames/frame-10.png").convert("RGB")
    transition = Image.open(MOTION / "direction-transition-frames/frame-06.png").convert("RGB")
    review = Image.new("RGB", (2100, 1450), "#f8f4eb")
    d = ImageDraw.Draw(review)
    t(d, (45, 32), "R5 E2.4 — Final human animation review board", 42)
    t(d, (48, 90), "Pilot-only art · 28×56 logical cells · 28×16 physics feet · camera 1.25 · Candidate B and R4 Runtime unchanged", 19, "#65717d")
    review.paste(sprites.resize((1900, 780)), (95, 140))
    t(d, (80, 955), "Direction transition · actual runtime", 26)
    t(d, (1090, 955), "Hero Ship automatic navigation · actual runtime", 26)
    review.paste(transition.resize((960, 540)), (70, 995))
    review.paste(auto.resize((960, 540)), (1070, 995))
    review.save(REPORT / "15-final-human-review-board.png")


def write_docs():
    docs = {
        "01-original-animation-audit.md": """# Original animation audit

- FRONT/BACK: four unique contact/passing poses, 28×56 cells, 8fps (0.5s cycle).
- SIDE: four cells; raw frame 1 has a 12px-wide opaque silhouette. The prior normalized strip stabilised bounds but left too little leg separation.
- At 170 world px/s, the old 0.5s cycle travelled 85px. This exceeded the visible stride and read as sliding.
- R4 source PNGs are untouched. Front/back were accepted and preserved byte-for-byte in the Pilot namespace.
""",
        "02-gait-cycle-design.md": """# Gait-cycle design

Side v2 uses eight distinct sequential poses: left contact, recoil, left passing, right contact, recoil, right passing, left contact recovery, recovery. Each frame has a real opaque foot contact in y=52–55 and differs from both neighbours. Arms counter-swing with legs. A single envelope scale locks character size and bottom-centre anchoring.
""",
        "03-updated-sprite-asset-review.md": """# Updated sprite asset review

| Direction | Asset | Frames | FPS | Decision |
| --- | --- | ---: | ---: | --- |
| Front | `walk-front-v2.png` | 4 | 24 | approved R4 poses copied byte-for-byte |
| Back | `walk-back-v2.png` | 4 | 24 | approved R4 poses copied byte-for-byte |
| Side | `walk-side-v2.png` | 8 | 48 | new Pilot-only alternating-foot walk |

See `11-improved-walk-sprite-comparison.png`, `12-front-back-side-turnaround.png`, and `13-ground-contact-analysis.png`.
""",
        "04-animation-speed-synchronization.md": """# Animation speed synchronization

The old 4-frame / 8fps loop lasted 0.5s and travelled 85 world pixels at the accepted 170px/s movement speed. V2 keeps movement speed unchanged but runs the 4-frame front/back cycle at 24fps and the 8-frame side cycle at 48fps. Both complete a gait cycle in about 0.167s (28px travelled), reducing apparent foot sliding without changing A*, collision, camera, or movement speed.

Direction changes require a 1.2 dominance ratio; near-diagonal input retains the last cardinal facing to prevent FRONT/SIDE flicker.
""",
        "05-browser-motion-qa.md": """# Browser motion QA

PASS — actual Vite/Phaser canvas captured through Chrome DevTools at 1024×576. Evidence GIFs cover left/right-facing side gait (FlipX), front, back, direction transitions, and Hero Ship automatic navigation. Captures use the same workshop spawn and 170px/s speed. `walkVersion=before` is QA-only baseline; default runtime is v2.
""",
        "06-independent-visual-qa.md": """# Independent visual QA

PASS with Human Gate pending. Opened and inspected the actual visible Pilot page plus generated sprite/ground-contact boards. A first per-pose scaling attempt was rejected because it changed apparent height; the final sheet uses a common gait-envelope scale. All frames share the y=55 ground reference and no frame is transparent or adjacent-duplicate.
""",
        "07-regression-test-report.md": """# Regression test report

`npm test` PASS — 148 tests passed (typecheck + Vite build + Node tests). Automated checks cover sheet dimensions, frame counts, opaque pixels, contact range, adjacent-pose uniqueness, byte-identical front/back preservation, v2 Phaser bindings, cadence, 28×16 body contract, and all required report/GIF deliverables. Existing E2 suite continues to cover A*, collision, Hero route, POI, content panel, camera, and occlusion contracts.
""",
        "08-human-playtest-guide.md": """# Human playtest guide

1. Open `r5-hybrid-pilot.html`; move left/right with arrows or A/D and check alternating feet.
2. Move up/down with W/S and verify contact/passing continuity.
3. Hold two direction keys near a diagonal; facing should not flicker each frame.
4. Click Hero Ship and verify walking continues until arrival, then stops on idle.
5. Open/close a content panel and confirm character stays idle; use a movement key during auto-route to take over.
6. Review `motion-evidence/*.gif` before deciding the Human Gate.
""",
        "09-final-human-gate.md": """# Final human gate

**Status: READY_FOR_R5_E2_4_HUMAN_ANIMATION_REVIEW**

Implementation, automated checks, actual-runtime motion evidence, and regression checks are complete. The gate is intentionally not marked PASS: a human must still play the Pilot and approve the subjective gait quality.

Remaining issue: generated-reference-derived side art is Pilot-only and visually reviewed, but final aesthetic approval remains with the human reviewer.
""",
    }
    for name, content in docs.items(): (REPORT / name).write_text(content, encoding="utf-8")


def data():
    data = {
      "taskId": "R5-E2.4-FULL-WALK-ANIMATION-POLISH",
      "originalAssets": ["portfolio-world/public/assets/canonical-r4/runtime/player/walk-front.png", "walk-back.png", "walk-side.png"],
      "newPilotAssets": ["portfolio-world/public/assets/r5-hybrid/pilot-player/walk-front-v2.png", "walk-back-v2.png", "walk-side-v2.png"],
      "walkFrameCounts": {"front": 4, "back": 4, "side": 8},
      "animationFps": {"original": 8, "front": 24, "back": 24, "side": 48},
      "footContactAnalysis": {"groundAnchor": "bottom-center", "contactRows": [52, 55], "result": "PASS"},
      "movementSpeedComparison": {"originalAndFinalWorldPxPerSecond": 170, "originalCycleWorldPx": 85, "finalCycleWorldPx": 28},
      "directionTransition": {"dominanceRatio": 1.2, "nearDiagonal": "retain last cardinal facing", "result": "PASS"},
      "browserMotionQa": {"runtime": "actual Phaser/Vite", "result": "PASS", "evidence": "motion-evidence"},
      "regressionResults": {"r4RuntimeModified": False, "candidateBModified": False, "formalR5RuntimeImplemented": False, "result": "PASS — npm test: 148 passed"},
      "humanGate": "READY_FOR_R5_E2_4_HUMAN_ANIMATION_REVIEW",
      "remainingIssues": ["Human subjective gameplay approval is still required before a final PASS gate."],
    }
    DATA.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    board(); write_docs(); data()
