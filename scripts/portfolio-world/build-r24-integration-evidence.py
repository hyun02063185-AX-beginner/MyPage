#!/usr/bin/env python3
"""Assemble review boards from actual browser captures without changing runtime art."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "runtime-r24-foundation-master-integration"
CANONICAL = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "gameplay-projection-refinement" / "projection-a-elevated-gameplay.png"
R23 = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "runtime-r23-visual-cleanup" / "01-r23-overview.png"


def label(image: Image.Image, text: str) -> Image.Image:
    image = image.convert("RGBA")
    draw = ImageDraw.Draw(image)
    draw.rectangle((12, 12, 500, 48), fill="#12343b")
    draw.text((24, 24), text, font=ImageFont.load_default(), fill="#fff2d1")
    return image


def pair(left: Image.Image, left_label: str, right: Image.Image, right_label: str, destination: str) -> None:
    size = (960, 540)
    board = Image.new("RGBA", (1920, 540), "#183f47")
    board.alpha_composite(label(left.resize(size, Image.Resampling.LANCZOS), left_label), (0, 0))
    board.alpha_composite(label(right.resize(size, Image.Resampling.LANCZOS), right_label), (960, 0))
    board.save(EVIDENCE / destination, "PNG", optimize=True)


def main() -> None:
    actual = Image.open(EVIDENCE / "01-r24-runtime-overview.png")
    pair(Image.open(CANONICAL), "CANONICAL PROJECTION A — reference", actual, "ACTUAL BROWSER R2.4 — Master B", "07-canonical-vs-r24.png")
    pair(Image.open(R23), "ACTUAL BROWSER R2.3 — zone assembly", actual, "ACTUAL BROWSER R2.4 — Master B", "08-r23-vs-r24.png")
    # No geometry-safe alpha trim was required after actual-runtime review; both panels are actual browser captures.
    pair(actual, "BEFORE — Master B candidate integration", actual, "AFTER — no silhouette refinement required", "09-b-before-after-minor-refinement.png")


if __name__ == "__main__":
    main()
