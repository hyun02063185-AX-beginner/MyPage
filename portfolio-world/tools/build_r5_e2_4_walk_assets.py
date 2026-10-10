"""Build Pilot-only R5 E2.4 walk assets and the sprite-review boards.

The approved R4 front/back walks are deliberately copied byte-for-byte into the
Pilot namespace.  The only new art is the side eight-pose cycle, made from the
reviewed generated walk reference after component extraction, palette reduction,
and fixed 28 x 56 bottom-centre anchoring.
"""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import find_objects, label


WORLD = Path(__file__).resolve().parents[1]
REPO = WORLD.parent
PLAYER = WORLD / "public/assets/canonical-r4/runtime/player"
PILOT = WORLD / "public/assets/r5-hybrid/pilot-player"
REPORT = REPO / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4"
# The selected built-in ImageGen reference is copied into the project so the
# Pilot sheet can be regenerated without relying on an account-local cache.
GENERATED = WORLD / "art-source/r5-e2-4-walk-animation/side-walk-imagegen-reference.png"
FONT = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def font(size: int):
    return ImageFont.truetype(FONT, size)


def text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, size=22, fill="#26384d"):
    draw.text(xy, value, font=font(size), fill=fill)


def checker(size: tuple[int, int], unit=16) -> Image.Image:
    image = Image.new("RGBA", size, "#f1eee7")
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], unit):
        for x in range(0, size[0], unit):
            if (x // unit + y // unit) % 2:
                draw.rectangle((x, y, x + unit - 1, y + unit - 1), fill="#d7d2c7")
    return image


def read_frames(path: Path) -> list[Image.Image]:
    image = Image.open(path).convert("RGBA")
    if image.height != 56 or image.width % 28:
        raise ValueError(f"invalid 28x56 sheet: {path}")
    return [image.crop((index * 28, 0, (index + 1) * 28, 56)) for index in range(image.width // 28)]


def load_side_poses() -> list[Image.Image]:
    """Extract all eight separately-drawn reference poses and normalize them.

    The source has transparent background. Components are thresholded only to
    identify the eight figures; their original alpha is retained in the crop.
    """
    source = Image.open(GENERATED).convert("RGBA")
    alpha = np.asarray(source.getchannel("A")) >= 32
    labels, count = label(alpha)
    components = []
    for ident, area in enumerate(np.bincount(labels.ravel())[1:], start=1):
        if area < 500:
            continue
        area_slice = find_objects(labels)[ident - 1]
        if area_slice is None:
            continue
        box = (area_slice[1].start, area_slice[0].start, area_slice[1].stop, area_slice[0].stop)
        components.append((box, int(area)))
    components.sort(key=lambda entry: entry[0][0])
    if len(components) != 8:
        raise ValueError(f"expected 8 side poses; found {len(components)} from {count} components")
    # A single scale is essential: wide contact poses must not shrink while a
    # narrow passing pose grows.  The stance envelope, not each pose, owns size.
    max_width = max(box[2] - box[0] for box, _ in components)
    max_height = max(box[3] - box[1] for box, _ in components)
    scale = min(26 / max_width, 52 / max_height)
    # The source reference has an intentionally very wide contact stance. Its
    # common width scale would otherwise make every side pose shorter than the
    # accepted 52px front/back silhouette. One shared vertical correction keeps
    # the body proportion stable across *all* side frames and direction changes.
    vertical_scale = 52 / (max_height * scale)
    frames = []
    for box, _ in components:
        crop = source.crop(box)
        # 23×52 gives the arms room without changing the 28×56 logical cell.
        size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale * vertical_scale)))
        crop = crop.resize(size, Image.Resampling.LANCZOS).convert("RGBA")
        # A compact adaptive palette removes the high-resolution reference's
        # anti-aliased noise while preserving the established navy/brown/cream read.
        crop = crop.quantize(colors=24, method=Image.Quantize.FASTOCTREE).convert("RGBA")
        frame = Image.new("RGBA", (28, 56), (0, 0, 0, 0))
        frame.alpha_composite(crop, ((28 - size[0]) // 2, 55 - size[1]))
        frames.append(frame)
    return frames


def save_sheet(frames: list[Image.Image], path: Path):
    sheet = Image.new("RGBA", (28 * len(frames), 56), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        sheet.alpha_composite(frame, (28 * index, 0))
    sheet.save(path)


def draw_strip(board: Image.Image, frames: list[Image.Image], x: int, y: int, scale: int, title: str, labels: list[str]):
    draw = ImageDraw.Draw(board)
    text(draw, (x, y - 48), title, 26)
    for index, frame in enumerate(frames):
        px = x + index * (28 * scale + 24)
        panel = checker((28 * scale, 56 * scale), scale * 2)
        panel.alpha_composite(frame.resize((28 * scale, 56 * scale), Image.Resampling.NEAREST))
        board.alpha_composite(panel, (px, y))
        text(draw, (px, y + 56 * scale + 10), labels[index], 15, "#5d6875")


def boards(original: dict[str, list[Image.Image]], improved: dict[str, list[Image.Image]]):
    REPORT.mkdir(parents=True, exist_ok=True)
    before = Image.new("RGBA", (1500, 760), "#f8f4eb")
    text(ImageDraw.Draw(before), (46, 34), "R5 E2.4 — Original walk sprite audit", 38)
    text(ImageDraw.Draw(before), (48, 84), "Literal R4 source frames. Side frame 1 has a narrow silhouette; all cells remain 28×56.", 20, "#65717d")
    draw_strip(before, original["front"], 55, 170, 5, "FRONT · 4 frames", ["contact L", "passing", "contact R", "passing"])
    draw_strip(before, original["back"], 55, 450, 5, "BACK · 4 frames", ["contact L", "passing", "contact R", "passing"])
    draw_strip(before, original["side"], 780, 170, 5, "SIDE · 4 frames", ["contact", "narrow passing", "contact", "passing"])
    before.convert("RGB").save(REPORT / "10-original-walk-sprite-comparison.png")

    after = Image.new("RGBA", (1900, 780), "#f8f4eb")
    text(ImageDraw.Draw(after), (46, 34), "R5 E2.4 — Improved Pilot walk sheets", 38)
    text(ImageDraw.Draw(after), (48, 84), "Front/back preserve the approved poses; side has eight distinct alternating-foot poses, baseline locked.", 20, "#65717d")
    draw_strip(after, improved["front"], 55, 170, 5, "FRONT v2 · approved 4-pose cycle", ["contact L", "passing", "contact R", "passing"])
    draw_strip(after, improved["back"], 55, 460, 5, "BACK v2 · approved 4-pose cycle", ["contact L", "passing", "contact R", "passing"])
    draw_strip(after, improved["side"], 800, 190, 4, "SIDE v2 · 8-pose alternating gait", ["L contact", "recoil", "L pass", "R contact", "R recoil", "R pass", "L contact", "recover"])
    after.convert("RGB").save(REPORT / "11-improved-walk-sprite-comparison.png")

    turn = Image.new("RGBA", (1480, 760), "#f8f4eb")
    text(ImageDraw.Draw(turn), (46, 34), "R5 E2.4 — Direction turnaround and appearance lock", 38)
    text(ImageDraw.Draw(turn), (48, 84), "Same navy jacket, cream shirt, brown trousers and bottom-centre ground anchor in every direction.", 20, "#65717d")
    draw_strip(turn, [original["front"][1]], 80, 180, 7, "FRONT idle", ["idle"])
    draw_strip(turn, [original["back"][1]], 430, 180, 7, "BACK idle", ["idle"])
    draw_strip(turn, [read_frames(PILOT / "side-idle-normalized.png")[0]], 780, 180, 7, "SIDE idle", ["idle"])
    draw_strip(turn, [improved["side"][0], improved["side"][3], improved["side"][6]], 80, 530, 4, "SIDE gait contacts", ["L contact", "R contact", "repeat L"])
    turn.convert("RGB").save(REPORT / "12-front-back-side-turnaround.png")

    ground = Image.new("RGBA", (1700, 650), "#f8f4eb")
    draw = ImageDraw.Draw(ground)
    text(draw, (46, 34), "R5 E2.4 — Ground-contact analysis", 38)
    text(draw, (48, 84), "Red rule is y=55 (logical ground). All 8 side frames retain opaque foot pixels within y=52–55.", 20, "#65717d")
    for index, frame in enumerate(improved["side"]):
        x, y, scale = 55 + index * 200, 165, 5
        panel = checker((140, 280), 20); panel.alpha_composite(frame.resize((140, 280), Image.Resampling.NEAREST)); ground.alpha_composite(panel, (x, y))
        draw.line((x, y + 55 * scale, x + 140, y + 55 * scale), fill="#ca4e4e", width=3)
        bbox = frame.getchannel("A").getbbox()
        contact = any(frame.getchannel("A").getpixel((px, py)) > 10 for px in range(28) for py in range(52, 56))
        text(draw, (x, 470), f"{index}: y {bbox[1]}–{bbox[3]-1}", 15, "#5d6875")
        text(draw, (x, 500), "contact PASS" if contact else "contact FAIL", 15, "#2b7a58" if contact else "#b33939")
    ground.convert("RGB").save(REPORT / "13-ground-contact-analysis.png")


def main():
    if not GENERATED.exists():
        raise FileNotFoundError(f"missing reviewed ImageGen reference: {GENERATED}")
    PILOT.mkdir(parents=True, exist_ok=True)
    original = {direction: read_frames(PLAYER / f"walk-{direction}.png") for direction in ("front", "back", "side")}
    # Copying is explicit preservation, not a rewrite of the accepted art.
    shutil.copy2(PLAYER / "walk-front.png", PILOT / "walk-front-v2.png")
    shutil.copy2(PLAYER / "walk-back.png", PILOT / "walk-back-v2.png")
    side = load_side_poses()
    save_sheet(side, PILOT / "walk-side-v2.png")
    improved = {"front": read_frames(PILOT / "walk-front-v2.png"), "back": read_frames(PILOT / "walk-back-v2.png"), "side": side}
    boards(original, improved)
    manifest = {
        "generatedReference": str(GENERATED),
        "generatedReferenceSha256": sha(GENERATED),
        "assets": {name: {"sha256": sha(PILOT / name), "size": Image.open(PILOT / name).size} for name in ("walk-front-v2.png", "walk-back-v2.png", "walk-side-v2.png")},
        "frames": {"front": 4, "back": 4, "side": 8},
        "sideFrameRoles": ["left-contact", "left-recoil", "left-passing", "right-contact", "right-recoil", "right-passing", "left-contact-repeat", "recovery"],
    }
    (REPORT / "asset-build-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
