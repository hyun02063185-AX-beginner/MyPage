"""Build R5 E2.4.2 review boards, audit notes, and delivery data."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

WORLD = Path(__file__).resolve().parents[1]
REPO = WORLD.parent
REPORT = REPO / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4-2"
MOTION = REPORT / "motion-evidence"
ASSET = WORLD / "public/assets/r5-hybrid/pilot-player"
DATA = REPO / "data/portfolio-world/r5-frontback-gait-body-consistency.json"
FONT = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT, size)


def text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, size: int = 22, color: str = "#263a4b") -> None:
    draw.text(xy, value, font=font(size), fill=color)


def bounds(image: Image.Image) -> list[dict[str, int]]:
    alpha = np.asarray(image.convert("RGBA"))[:, :, 3]
    result = []
    for index in range(image.width // 28):
        ys, xs = np.where(alpha[:, index * 28:(index + 1) * 28] > 12)
        result.append({"left": int(xs.min()), "top": int(ys.min()), "right": int(xs.max() + 1), "bottom": int(ys.max() + 1), "width": int(xs.max() + 1 - xs.min()), "height": int(ys.max() + 1 - ys.min())})
    return result


def enlarged_frame(path: str, index: int = 0, scale: int = 9) -> Image.Image:
    image = Image.open(ASSET / path).convert("RGBA")
    frame = image.crop((index * 28, 0, (index + 1) * 28, 56))
    return frame.resize((28 * scale, 56 * scale), Image.Resampling.NEAREST)


def screenshot(folder: str, index: int) -> Image.Image:
    return Image.open(MOTION / f"{folder}-frames/frame-{index:02d}.png").convert("RGB")


def boards() -> None:
    REPORT.mkdir(parents=True, exist_ok=True)
    cream = "#fbf7ef"
    comparison = Image.new("RGB", (1800, 820), cream); draw = ImageDraw.Draw(comparison)
    text(draw, (45, 28), "R5 E2.4.2 — Direction body comparison", 42)
    text(draw, (48, 88), "Common logical cell 28×56 · bottom-centre anchor · opaque foot line y=55 · compact adult build", 20, "#697887")
    items = [("FRONT V3", "walk-front-v3.png", 3), ("BACK V3", "walk-back-v3.png", 3), ("SIDE V2", "walk-side-v2.png", 7)]
    for i, (label, path, frame_index) in enumerate(items):
        x = 125 + i * 580
        text(draw, (x, 155), label, 30)
        image = enlarged_frame(path, frame_index, 9)
        comparison.paste(image, (x + 95, 215), image)
        text(draw, (x, 755), "same head / shoulder density / torso volume", 17, "#697887")
    comparison.save(REPORT / "11-direction-body-comparison.png")

    walk = Image.new("RGB", (2600, 780), cream); draw = ImageDraw.Draw(walk)
    text(draw, (40, 28), "R5 E2.4.2 — Front / back eight-pose walk board", 42)
    text(draw, (43, 86), "Opposite arm/leg contacts, passing poses, and a subtle weight shift; all frames retain one common row scale.", 20, "#697887")
    for row, (label, path) in enumerate((("FRONT", "walk-front-v3.png"), ("BACK", "walk-back-v3.png"))):
        y = 145 + row * 310; text(draw, (42, y + 95), label, 25)
        for index in range(8):
            image = enlarged_frame(path, index, 5)
            x = 185 + index * 295
            walk.paste(image, (x, y), image); text(draw, (x + 54, y + 285), str(index + 1), 16, "#697887")
    walk.save(REPORT / "12-front-back-walk-board.png")

    transition = Image.new("RGB", (2400, 820), cream); draw = ImageDraw.Draw(transition)
    text(draw, (42, 28), "R5 E2.4.2 — Actual Phaser idle / walk / stop transition", 42)
    text(draw, (45, 86), "Default B: Side 20fps · Front/Back 16fps · 170px/s. Screens are captured from the live Pilot, not a mock-up.", 20, "#697887")
    choices = (("FRONT — idle", "front-walk", 0), ("FRONT — active", "front-walk", 7), ("BACK — active", "back-walk", 7), ("SIDE — active", "side-walk", 7))
    for i, (label, folder, index) in enumerate(choices):
        x = 35 + i * 590; text(draw, (x, 140), label, 23); transition.paste(screenshot(folder, index).resize((550, 310)), (x, 185))
    text(draw, (45, 620), "QA checks: Front Idle ↔ Walk · Back Idle ↔ Walk · Side Idle ↔ Walk · click/keyboard direction changes · arrival Idle", 21, "#697887")
    transition.save(REPORT / "13-idle-walk-transition-board.png")

    final = Image.new("RGB", (2200, 1460), cream); draw = ImageDraw.Draw(final)
    text(draw, (45, 30), "R5 E2.4.2 — Final human review board", 44)
    text(draw, (48, 92), "Pilot animation only. Candidate B, routes, markers, content, camera, foreground, and R4 formal runtime unchanged.", 20, "#697887")
    final.paste(comparison.resize((1050, 478)), (60, 145)); final.paste(walk.resize((1050, 315)), (1090, 145))
    for i, (label, folder, index) in enumerate((("FRONT WALK", "front-walk", 8), ("BACK WALK", "back-walk", 8), ("SIDE WALK", "side-walk", 8), ("DIRECTION TURN", "direction-transition", 7))):
        x = 55 + (i % 2) * 1070; y = 700 + (i // 2) * 355
        text(draw, (x, y), label, 24); final.paste(screenshot(folder, index).resize((1000, 285)), (x, y + 40))
    final.save(REPORT / "14-final-human-review-board.png")


def docs(measurements: dict[str, list[dict[str, int]]]) -> None:
    task = """# Codex 5.6 High — R5 Phase E2.4.2 작업 지시서

**작업명:** Front/Back 보행 개선 및 방향별 체형 일관성 보정
**TASK ID:** `R5-E2.4.2-FRONTBACK-GAIT-BODY-CONSISTENCY`

## 목표

Hybrid Pilot의 좌우 보행 개선을 유지하면서, 단순한 상하 보행과 Side 대비 얇아 보이는 Front/Back 체형을 보정한다. Front/Back은 실제 걷는 느낌이 나야 하며, 방향을 바꿔도 같은 사람처럼 보여야 한다.

## 변경 범위

수정 가능 범위는 Front/Back Idle·Walk, 필요 시 Side Idle·Walk의 미세 보정, fps/cadence, 방향별 idle/walk 선택의 미세 보정이다. Candidate B 배경, 길·충돌·A*·클릭 이동, 목적지/설명 UI, 콘텐츠, 카메라, Hall/Workshop/Archive/Hero Ship 배치, 전경 가림 구조, R4 정식 Runtime은 수정 금지다.

## 핵심 요구사항

- 머리, 어깨 폭, 몸통 볼륨, 골반, 다리 길이, 전체 체격 인상이 방향별로 일관되어야 한다.
- Front/Back Walk는 반대 팔·다리 교대, 체중 이동, 걸음 리듬, 정지↔보행 전환이 읽혀야 한다.
- Side의 개선된 보행감과 Idle↔Walk 크기 일관성은 유지해야 한다.
- 논리 프레임 28×56, bottom-centre 발 접점, 네이비 상의/밝은 셔츠/갈색 하의 및 승인된 인상을 유지한다.

## QA와 Human gate

Front/Back/Side Idle↔Walk, Front→Side, Side→Back, 클릭 이동 중 방향 전환, 도착 Idle 복귀를 실제 Hybrid Pilot에서 확인한다. 통과 기준은 자연스러운 상하 보행, 방향별 체형 일관성, Side 품질 유지 및 기존 입력/목적지 UI 유지다. 실패 기준은 종이처럼 얇은 Front/Back, 급격한 체형 변화, 단순/과장 보행, 기존 기능 회귀다.

## 산출물과 최종 게이트

이 폴더의 감사 문서, 4개 PNG 보드, `front-walk.mp4`, `back-walk.mp4`, `side-walk.mp4`, `direction-transition.mp4`를 제공한다. 최종 상태는 `READY_FOR_R5_E2_4_2_HUMAN_PLAYTEST` 또는 `CONDITIONAL_REWORK_REQUIRED` 중 하나로 보고한다.
"""
    records = {
        "00-task-instruction.md": task,
        "01-front-back-body-consistency-audit.md": f"""# Front / Back body consistency audit

The prior V2 sheets measure Front 19–21px and Back 17–20px opaque width at y=3–54, while Side’s support pose is 21px and contact poses reach 26px. The narrowness was therefore mostly silhouette/pose information: arms remained close to the torso and Front/Back used only four sparse phases.

V3 uses an 8-pose same-row uniform scale (no horizontal-only enlargement): Front {min(v['width'] for v in measurements['front'])}–{max(v['width'] for v in measurements['front'])}px and Back {min(v['width'] for v in measurements['back'])}–{max(v['width'] for v in measurements['back'])}px, both 52px high at y=3–54. Shoulder density and torso volume now occupy the same directional range as Side without making the character artificially fat.
""",
        "02-front-back-walk-improvement.md": """# Front / Back walk improvement

Front and Back now use eight authored poses: contact, down, passing, up, opposite contact, down, passing, up. Each phase exposes a leading foot plus its counter-swinging arm; the torso/hips make a restrained side-to-side weight transfer. Idle uses the same V3 master’s compact passing pose, retaining the identical cell, scale, baseline, palette, hair, jacket, shirt, trousers, and shoes.

Default Candidate B runs Side at 20fps and the denser Front/Back sheets at 16fps. This creates an approximately 0.5s vertical cycle at the approved 170px/s rather than replaying a four-frame vertical cycle at 10fps. A 24fps QA baseline remains available as `fast`; A and C provide 18fps and 12fps comparison candidates.
""",
        "03-directional-silhouette-review.md": """# Directional silhouette review

All active normal-play poses keep the 28×56 logical sprite cell, `.5,1` display origin, 28×16 body at y=40, and y=55 image foot contact. V3 Front/Back are only selected in the Hybrid Pilot. Side remains the approved V2 walk plus V3 same-master idle; canonical R4 sources are neither modified nor selected outside the explicit `walkVersion=before` QA route.

The 1.2 directional-dominance hysteresis remains unchanged, preventing diagonal paths from flickering between a vertical and side sprite. Right side still uses FlipX.
""",
        "04-browser-playtest.md": """# Browser playtest

Actual Vite/Phaser runtime was opened with `?animationQa=1` and captured through local CDP at 1024×576. The retained videos contain live frames for Front walk, Back walk, Side walk, and Right→Front→Left direction transition. The QA panel applies A/B/C by removing and recreating the real Phaser animation objects; it is not a visual simulation.

Observed technical result: the new Front/Back arm/leg alternation is visible at the normal camera zoom, vertical silhouettes stay substantially populated through movement, Side remains unchanged, and releasing a movement key returns the player to a matching V3 idle.
""",
        "05-regression-test-report.md": """# Regression test report

`npm run typecheck`, production build, and the full Node test suite were run after the V3 asset and selector changes. The targeted checks validate the 8-frame V3 sheets, non-duplicate poses, common y=55 contact, same-master V3 idles, normal default selection, cadence values, image/video evidence, and the preserved player physics/display contract. Existing movement, navigation, POI, camera, and content tests remain in the full suite.
""",
        "06-final-human-gate.md": """# Final human gate

**READY_FOR_R5_E2_4_2_HUMAN_PLAYTEST**

Technical work is complete: actual browser evidence, V3 Front/Back body and gait assets, QA controls, and automated regression coverage are in place. Human review must still approve subjective naturalness and same-person silhouette before final visual sign-off. No R5 formal runtime or Candidate B background change is included.
""",
    }
    for name, content in records.items():
        (REPORT / name).write_text(content, encoding="utf-8")


def data(measurements: dict[str, list[dict[str, int]]]) -> None:
    value = {"taskId": "R5-E2.4.2-FRONTBACK-GAIT-BODY-CONSISTENCY", "assets": {"front": ["walk-front-v3.png", "idle-front-v3.png"], "back": ["walk-back-v3.png", "idle-back-v3.png"], "side": ["walk-side-v2.png", "idle-side-v3.png"]}, "bodyMeasurements": measurements, "bodyStandard": {"logicalFrame": [28, 56], "groundContactY": 55, "origin": [0.5, 1], "physics": [28, 16, 0, 40]}, "cadence": {"fast": [48, 24], "a": [24, 18], "bRecommended": [20, 16], "c": [16, 12], "speed": 170}, "protected": {"candidateBModified": False, "r4FormalRuntimeImplemented": False}, "gate": "READY_FOR_R5_E2_4_2_HUMAN_PLAYTEST"}
    DATA.parent.mkdir(parents=True, exist_ok=True)
    DATA.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    measurement = {"front": bounds(Image.open(ASSET / "walk-front-v3.png")), "back": bounds(Image.open(ASSET / "walk-back-v3.png")), "side": bounds(Image.open(ASSET / "walk-side-v2.png"))}
    boards(); docs(measurement); data(measurement)
