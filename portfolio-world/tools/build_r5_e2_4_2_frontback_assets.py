"""Build the R5 E2.4.2 front/back Pilot sheets from the retained ImageGen reference.

The source board is only a high-resolution pose reference.  This script extracts
the sixteen opaque figures, applies one uniform scale per row, and packs them on
the established 28 x 56 bottom-contact logical frame.  It deliberately never
touches the canonical R4 sheets or the approved Side V2/V3 assets.
"""
from __future__ import annotations

from pathlib import Path
import shutil

import numpy as np
from PIL import Image
from scipy import ndimage


ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path(r"C:\Users\user\.codex\generated_images\01a125af-6fdf-7590-b659-83d112faeb57\exec-d198772c-ce14-493d-a236-e35284fa9895.png")
SOURCE = ROOT / "art-source" / "r5-e2-4-2-frontback" / "front-back-walk-imagegen-reference.png"
OUT = ROOT / "public" / "assets" / "r5-hybrid" / "pilot-player"
FRAME_W, FRAME_H, CONTACT_BOTTOM, TARGET_H = 28, 56, 54, 52


def components(image: Image.Image) -> list[tuple[int, int, int, int]]:
    alpha = np.asarray(image.getchannel("A")) > 12
    labels, count = ndimage.label(alpha)
    boxes: list[tuple[int, int, int, int]] = []
    for index in range(1, count + 1):
        ys, xs = np.where(labels == index)
        if len(xs) > 500:
            boxes.append((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))
    if len(boxes) != 16:
        raise RuntimeError(f"Expected 16 full-body components, found {len(boxes)}")
    # The board has two rows.  Sorting each row by centre yields the authored gait order.
    boxes.sort(key=lambda box: (box[1] > 450, (box[0] + box[2]) / 2))
    return boxes


def pack_row(source: Image.Image, boxes: list[tuple[int, int, int, int]]) -> Image.Image:
    sheet = Image.new("RGBA", (FRAME_W * 8, FRAME_H), (0, 0, 0, 0))
    # A row-wide uniform scale is the body-standard: no per-pose stretching and
    # no horizontal-only widening.  The 52px silhouette preserves the R5 foot line.
    max_height = max(bottom - top for _, top, _, bottom in boxes)
    scale = TARGET_H / max_height
    for frame, (left, top, right, bottom) in enumerate(boxes):
        crop = source.crop((left, top, right, bottom))
        width = max(1, round(crop.width * scale))
        height = max(1, round(crop.height * scale))
        crop = crop.resize((width, height), Image.Resampling.LANCZOS)
        x = frame * FRAME_W + (FRAME_W - width) // 2
        y = CONTACT_BOTTOM - height + 1
        sheet.alpha_composite(crop, (x, y))
    return sheet


def idle_from(sheet: Image.Image, frame: int) -> Image.Image:
    idle = Image.new("RGBA", (FRAME_W, FRAME_H), (0, 0, 0, 0))
    idle.alpha_composite(sheet.crop((frame * FRAME_W, 0, (frame + 1) * FRAME_W, FRAME_H)))
    return idle


def main() -> None:
    if not GENERATED.exists():
        raise FileNotFoundError(GENERATED)
    SOURCE.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(GENERATED, SOURCE)
    OUT.mkdir(parents=True, exist_ok=True)
    image = Image.open(SOURCE).convert("RGBA")
    boxes = components(image)
    front, back = pack_row(image, boxes[:8]), pack_row(image, boxes[8:])
    front.save(OUT / "walk-front-v3.png")
    back.save(OUT / "walk-back-v3.png")
    # Frame 3 is the least extended passing pose in the authored cycle, so the
    # idle-to-walk change starts without a scale or baseline jump.
    idle_from(front, 3).save(OUT / "idle-front-v3.png")
    idle_from(back, 3).save(OUT / "idle-back-v3.png")
    print(f"reference={SOURCE}")
    for name in ("walk-front-v3.png", "walk-back-v3.png", "idle-front-v3.png", "idle-back-v3.png"):
        print(f"{name}={Image.open(OUT / name).size}")


if __name__ == "__main__":
    main()
