"""Build Phase B's deterministic R4 player spritesheets and pre-import QA boards."""
from __future__ import annotations

import hashlib
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
import numpy as np
from scipy.ndimage import find_objects, label as connected_components


WORLD = Path(__file__).resolve().parents[1]
REPO = WORLD.parent
GENERATED = Path(r"C:\Users\user\.codex\generated_images\01a11b80-2333-7a72-a4a4-60a293bd282b")
SOURCE = WORLD / "art-source/runtime-r4-player-integration"
OUT = WORLD / "public/assets/canonical-r4/runtime/player"
EVIDENCE = REPO / "reports/portfolio-world-rebuild/evidence/runtime-r4-player-integration"
SHEETS = {
    "front": "exec-368e6d6e-0463-4a1c-a1f9-4734d7b2d7f1.png",
    "back": "exec-38cee8e7-8cd9-480f-802c-a9fd8f89970c.png",
    "side": "exec-02f67179-3c0d-41d3-9354-7c160ec3e8ec.png",
}
FONT = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def f(size: int): return ImageFont.truetype(FONT, size)
def label(draw, xy, text, size=24, color="#24364b"): draw.text(xy, text, font=f(size), fill=color)
def sha(path: Path): return hashlib.sha256(path.read_bytes()).hexdigest()


def normalize_cells(path: Path) -> list[Image.Image]:
    """Extract four alpha components, then normalize to one scale/baseline.

    Generated strips may put an arm a few pixels over an equal-width cell edge.
    Connected-component extraction prevents an adjacent pose from being sliced into
    the wrong frame, while retaining all of the selected character's silhouette.
    """
    source = Image.open(path).convert("RGBA")
    mask = np.asarray(source.getchannel("A")) >= 20
    labels, count = connected_components(mask)
    slices = find_objects(labels)
    components = []
    for index, area in enumerate(np.bincount(labels.ravel())[1:], start=1):
        if area < 1000: continue
        sl = slices[index - 1]
        box = (sl[1].start, sl[0].start, sl[1].stop, sl[0].stop)
        components.append((box, int(area)))
    components.sort(key=lambda item: item[0][0])
    if len(components) != 4:
        raise ValueError(f"expected four source poses in {path.name}, found {len(components)} of {count} alpha components")
    boxes = [box for box, _ in components]
    crops = [source.crop(box) for box in boxes]
    max_w = max(box[2] - box[0] for box in boxes)
    max_h = max(box[3] - box[1] for box in boxes)
    scale = min(24 / max_w, 52 / max_h)
    frames = []
    for crop in crops:
        alpha = crop.getchannel("A").point(lambda v: 255 if v >= 20 else 0)
        crop.putalpha(alpha)
        size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
        crop = crop.resize(size, Image.Resampling.LANCZOS)
        frame = Image.new("RGBA", (28, 56), (0, 0, 0, 0))
        frame.alpha_composite(crop, ((28 - size[0]) // 2, 55 - size[1]))
        frames.append(frame)
    return frames


def paste_scaled(canvas: Image.Image, sprite: Image.Image, x: int, y: int, scale: int):
    canvas.alpha_composite(sprite.resize((28 * scale, 56 * scale), Image.Resampling.NEAREST), (x, y))


def checker(size, tile=16):
    out = Image.new("RGBA", size, "#e8e3d9"); d = ImageDraw.Draw(out)
    for y in range(0, size[1], tile):
        for x in range(0, size[0], tile):
            if (x // tile + y // tile) % 2: d.rectangle((x, y, x + tile - 1, y + tile - 1), fill="#d5cfc3")
    return out


def direction_sheet(frames):
    board = Image.new("RGBA", (1440, 920), "#f4efe6"); d = ImageDraw.Draw(board)
    label(d, (55, 40), "R4 final player — Refined Portfolio Guide", 42)
    label(d, (58, 94), "Selected B identity preserved: navy jacket, cream inner block, charcoal trousers, brown shoes, gold accent.", 21, "#66717b")
    for i, direction in enumerate(("FRONT / DOWN", "BACK / UP", "LEFT / SIDE")):
        x = 65 + i * 450; d.rounded_rectangle((x, 170, x + 375, 780), 18, fill="#ddd7ca", outline="#b9b0a2", width=2)
        label(d, (x + 24, 200), direction, 25)
        key = "side" if direction.startswith("LEFT") else direction.split()[0].lower()
        paste_scaled(board, frames[key][1], x + 76, 270, 8)
        label(d, (x + 25, 745), "idle: passing-neutral source", 18, "#66717b")
    label(d, (58, 850), "Right movement is a runtime flipX of LEFT/SIDE; no independent right-facing generated asset exists.", 20, "#66717b")
    return board.convert("RGB")


def walk_board(frames):
    board = Image.new("RGBA", (1600, 1120), "#f4efe6"); d = ImageDraw.Draw(board)
    label(d, (55, 35), "R4 walk-cycle review — actual 28×56 frame order", 40)
    label(d, (57, 86), "Frame 0: contact • Frame 1: passing • Frame 2: opposite contact • Frame 3: opposite passing", 20, "#66717b")
    for row, direction in enumerate(("front", "back", "side")):
        top = 160 + row * 305; label(d, (60, top), direction.upper(), 27)
        for i, frame in enumerate(frames[direction]):
            x = 340 + i * 290; panel = checker((224, 448), 28); panel.alpha_composite(frame.resize((224, 448), Image.Resampling.NEAREST))
            board.alpha_composite(panel, (x, top)); label(d, (x + 35, top + 470), f"{i}  " + ("contact" if i in (0, 2) else "passing"), 17, "#66717b")
    return board.convert("RGB")


def native_board(frames):
    board = Image.new("RGBA", (1500, 900), "#f4efe6"); d = ImageDraw.Draw(board)
    label(d, (54, 38), "R4 native 28×56 animation review", 42)
    label(d, (56, 91), "1× left is the literal gameplay canvas. 4× right is nearest-neighbor inspection only.", 21, "#66717b")
    for row, direction in enumerate(("front", "back", "side")):
        top = 180 + row * 225; label(d, (55, top), direction.upper(), 24)
        for i, frame in enumerate(frames[direction]):
            one = checker((28, 56), 4); one.alpha_composite(frame); board.alpha_composite(one, (305 + i * 68, top))
            four = checker((112, 224), 16); four.alpha_composite(frame.resize((112, 224), Image.Resampling.NEAREST)); board.alpha_composite(four, (650 + i * 180, top))
        label(d, (305, top + 72), "1× actual", 16, "#66717b"); label(d, (650, top + 240), "4× inspection", 16, "#66717b")
    return board.convert("RGB")


def main():
    SOURCE.mkdir(parents=True, exist_ok=True); OUT.mkdir(parents=True, exist_ok=True); EVIDENCE.mkdir(parents=True, exist_ok=True)
    frames = {}
    for direction, filename in SHEETS.items():
        origin = GENERATED / filename
        if not origin.exists(): raise FileNotFoundError(origin)
        shutil.copy2(origin, SOURCE / f"player-b-walk-{direction}-imagegen-source.png")
        frames[direction] = normalize_cells(origin)
        sheet = Image.new("RGBA", (112, 56), (0, 0, 0, 0))
        for i, frame in enumerate(frames[direction]): sheet.alpha_composite(frame, (28 * i, 0))
        sheet.save(OUT / f"walk-{direction}.png")
        frames[direction][1].save(OUT / f"idle-{direction}.png")
    direction_sheet(frames).save(EVIDENCE / "01-final-player-direction-sheet.png")
    walk_board(frames).save(EVIDENCE / "02-final-player-walk-cycle-review.png")
    native_board(frames).save(EVIDENCE / "03-native-28x56-animation-review.png")
    print("\n".join(f"{p.name} {p.stat().st_size} {sha(p)}" for p in sorted(OUT.glob("*.png"))))


if __name__ == "__main__": main()
