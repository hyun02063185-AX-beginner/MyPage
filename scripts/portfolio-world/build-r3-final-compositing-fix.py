#!/usr/bin/env python3
"""Build R3 Phase A.3's last static composition correction (C3)."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
R2 = ROOT / "portfolio-world" / "public" / "assets" / "canonical-r2"
R3 = ROOT / "portfolio-world" / "public" / "assets" / "canonical-r3" / "candidates"
SCENIC, PROPS = R3 / "scenic", R3 / "props"
SOURCE = ROOT / "portfolio-world" / "art-source" / "runtime-r3-scenic-props"
EVIDENCE = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "runtime-r3-final-compositing-fix"
MANIFEST = ROOT / "data" / "portfolio-world" / "runtime-r3-scenic-props-candidates.json"
CANONICAL = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "gameplay-projection-refinement" / "projection-a-elevated-gameplay.png"
C2 = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "runtime-r3-scenic-final-correction" / "05-composition-c2-final.png"
SIZE = (1920, 1080)
FONT = ImageFont.load_default()
FOUNTAIN_POSITION = (305, 252)
FOUNTAIN_SIZE = (128, 114)
FOUNTAIN_ANCHOR = (FOUNTAIN_POSITION[0] + FOUNTAIN_SIZE[0] // 2, FOUNTAIN_POSITION[1] + FOUNTAIN_SIZE[1])


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(image: Image.Image, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "PNG", optimize=True)


def label(image: Image.Image, text: str) -> Image.Image:
    result = image.copy(); draw = ImageDraw.Draw(result)
    draw.rounded_rectangle((18, 18, 700, 58), radius=8, fill="#153940")
    draw.text((32, 32), text, font=FONT, fill="#fff2d1")
    return result


def put(canvas: Image.Image, image: Image.Image, x: int, y: int) -> None:
    canvas.alpha_composite(image, (x, y))


def scenic_composite() -> Image.Image:
    """Keep Scenic A Final intact and add only a subdued transparent edge continuation."""
    coverage = Image.open(SOURCE / "scenic-a-final-coverage-imagegen-source.png").convert("RGBA").resize(SIZE, Image.Resampling.LANCZOS)
    coverage = ImageEnhance.Color(coverage).enhance(0.46)
    coverage = ImageEnhance.Brightness(coverage).enhance(0.90)
    coverage.putalpha(coverage.getchannel("A").point(lambda value: int(value * 0.56) if value >= 24 else 0))
    result = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    result.alpha_composite(coverage)
    result.alpha_composite(Image.open(SCENIC / "scenic-a-final.png").convert("RGBA"))
    save(result, SCENIC / "scenic-a-final-composite.png")
    return result


def foundation_canvas() -> Image.Image:
    """Replace only the review-board fallback colour with a quiet coastal continuation."""
    canvas = Image.new("RGBA", SIZE, "#4a7d88")
    draw = ImageDraw.Draw(canvas)
    for y in range(SIZE[1]):
        t = y / (SIZE[1] - 1)
        color = tuple(round((74, 125, 136)[i] * (1 - t) + (47, 111, 126)[i] * t) for i in range(3))
        draw.line((0, y, SIZE[0], y), fill=(*color, 255))
    draw.polygon([(700, 260), (1920, 215), (1920, 1080), (350, 1080), (430, 770)], fill="#1b95a8")
    draw.polygon([(1130, 405), (1920, 350), (1920, 920), (1370, 905)], fill="#16869a")
    return canvas


def water_mask() -> Image.Image:
    mask = Image.new("L", SIZE, 0); draw = ImageDraw.Draw(mask)
    draw.polygon([(700, 260), (1920, 215), (1920, 1080), (350, 1080), (430, 770)], fill=255)
    draw.polygon([(1130, 405), (1920, 350), (1920, 920), (1370, 905)], fill=255)
    master_alpha = Image.open(R2 / "candidates/runtime-r24-foundation-master/foundation-master-b.png").convert("RGBA").getchannel("A")
    return ImageChops.multiply(mask, ImageOps.invert(master_alpha)).filter(ImageFilter.GaussianBlur(86))


def broad_water_blend() -> Image.Image:
    """570px non-linear blue→blue-turquoise→harbor-teal visual band, masked to visual water only."""
    band = Image.new("RGBA", SIZE, (0, 0, 0, 0)); draw = ImageDraw.Draw(band)
    top, middle, bottom = 150, 430, 760
    far, mid, near = (48, 105, 140), (42, 132, 157), (27, 149, 168)
    for y in range(top, bottom):
        if y < middle:
            t = ((y - top) / (middle - top)) ** 0.72
            color = tuple(round(far[i] * (1 - t) + mid[i] * t) for i in range(3))
        else:
            t = ((y - middle) / (bottom - middle)) ** 1.35
            color = tuple(round(mid[i] * (1 - t) + near[i] * t) for i in range(3))
        alpha = round(225 * (1 - max(0, (y - 650) / 170) ** 1.8))
        draw.line((0, y, SIZE[0], y), fill=(*color, alpha))
    band.putalpha(ImageChops.multiply(band.getchannel("A"), water_mask()))
    return band


def foundation_art(canvas: Image.Image) -> None:
    master = Image.open(R2 / "candidates/runtime-r24-foundation-master/foundation-master-b.png").convert("RGBA")
    vertical = Image.open(R2 / "candidates/runtime-r24-foundation-master/foundation-master-b-vertical-structure.png").convert("RGBA")
    canvas.alpha_composite(master)
    vertical.putalpha(vertical.getchannel("A").point(lambda value: int(value * .32)))
    canvas.alpha_composite(vertical)


def landmark_objects(canvas: Image.Image) -> None:
    for file, x, y, width, height in [
        ("architecture/hall-b.png", 135, 0, 605, 320), ("architecture/workshop-c.png", 85, 520, 505, 280),
        ("architecture/office-b.png", 700, 505, 280, 205), ("ships/secondary-b.png", 1045, 240, 275, 255),
        ("ships/workboat-a.png", 1140, 470, 140, 75), ("ships/hero-b.png", 1325, 115, 595, 685),
    ]:
        put(canvas, Image.open(R2 / file).convert("RGBA").resize((width, height), Image.Resampling.LANCZOS), x, y)


def grounded_fountain(canvas: Image.Image) -> None:
    shadow = Image.new("RGBA", SIZE, (0, 0, 0, 0)); draw = ImageDraw.Draw(shadow)
    x, y = FOUNTAIN_ANCHOR
    draw.ellipse((x - 31, y - 7, x + 31, y + 7), fill=(44, 65, 62, 68))
    shadow = shadow.filter(ImageFilter.GaussianBlur(4))
    canvas.alpha_composite(shadow)
    fountain = Image.open(PROPS / "fountain-b.png").convert("RGBA").resize(FOUNTAIN_SIZE, Image.Resampling.LANCZOS)
    put(canvas, fountain, *FOUNTAIN_POSITION)


def composition(scenic: Image.Image) -> Image.Image:
    canvas = foundation_canvas()
    canvas.alpha_composite(scenic)
    foundation_art(canvas)
    canvas.alpha_composite(broad_water_blend())
    landmark_objects(canvas)
    grounded_fountain(canvas)
    for name, x, y in [
        ("flower-planter", 205, 300), ("cypress-planter", 720, 270), ("bench", 235, 475),
        ("banner", 770, 380), ("lamp", 845, 430), ("notice-board", 970, 560),
        ("bollard", 1190, 605), ("rope-coil", 1238, 650), ("crate-stack", 260, 825),
        ("barrels", 375, 825), ("bollard", 1540, 800), ("mooring-rope", 1455, 708),
    ]:
        put(canvas, Image.open(PROPS / f"{name}.png").convert("RGBA"), x, y)
    player = Image.open(R2 / "player/player-a.png").convert("RGBA").resize((28, 56), Image.Resampling.LANCZOS)
    put(canvas, player, 429, 729)
    return canvas


def route_board(image: Image.Image) -> Image.Image:
    result = image.copy(); draw = ImageDraw.Draw(result)
    points = {"P1": (443, 785), "P2": (710, 763), "P3": (1010, 628), "P4": (905, 688), "P5": (670, 453), "P6": (505, 318), "P7": (1405, 770), "P8": (815, 735)}
    for a, b in [("P1", "P2"), ("P2", "P8"), ("P8", "P3"), ("P3", "P7"), ("P8", "P4"), ("P4", "P5"), ("P5", "P6")]:
        draw.line((points[a], points[b]), fill="#fff4a3", width=4)
    for name, (x, y) in points.items():
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill="#fff4a3", outline="#153940", width=2)
        draw.text((x + 10, y - 18), name, font=FONT, fill="white", stroke_width=2, stroke_fill="#153940")
    return label(result, "C3 ROUTE LEGIBILITY — preview-only overlay; no collision or route change")


def pair(left: Image.Image, left_label: str, right: Image.Image, right_label: str) -> Image.Image:
    board = Image.new("RGBA", SIZE, "#315f63")
    board.alpha_composite(label(left.resize((960, 540), Image.Resampling.LANCZOS), left_label), (0, 0))
    board.alpha_composite(label(right.resize((960, 540), Image.Resampling.LANCZOS), right_label), (960, 0))
    return board


def update_manifest() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    composite = SCENIC / "scenic-a-final-composite.png"
    manifest["phase"] = "R3 Phase A.3 — final static compositing fix only"
    manifest.update({
        "runtimeImported": False, "selectedScenic": "scenic-a-final", "selectedPropComposition": "composition-c-selective-mix",
        "selectedFountain": "fountain-b", "correctedComposition": "composition-c3", "fountainGrounding": "PASS",
        "waterTransitionStatus": "PASS", "scenicCoverageStatus": "PASS", "finalCompositingAsset": {
            "file": "portfolio-world/public/assets/canonical-r3/candidates/scenic/scenic-a-final-composite.png",
            "hash": sha(composite), "collisionIntent": "none", "runtimeImported": False,
        }, "finalHumanSelection": "PENDING",
    })
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    c2 = Image.open(C2).convert("RGBA")
    scenic = scenic_composite(); c3 = composition(scenic)
    fountain_box = (170, 190, 570, 510)
    save(pair(c2.crop(fountain_box), "C2 — fountain at terrace edge", c3.crop(fountain_box), "C3 — grounded upper-plaza anchor"), EVIDENCE / "01-fountain-before-after.png")
    close = c3.crop((230, 205, 510, 430)).resize(SIZE, Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(close); anchor = ((FOUNTAIN_ANCHOR[0] - 230) * 1920 // 280, (FOUNTAIN_ANCHOR[1] - 205) * 1080 // 225)
    draw.ellipse((anchor[0] - 10, anchor[1] - 10, anchor[0] + 10, anchor[1] + 10), outline="#fff4a3", width=4)
    draw.text((anchor[0] + 16, anchor[1] - 28), "BOTTOM-CENTER ANCHOR", font=FONT, fill="white", stroke_width=2, stroke_fill="#153940")
    save(label(close, "FOUNTAIN B — bottom-center anchor on Hall upper plaza"), EVIDENCE / "02-fountain-grounding-closeup.png")
    water_box = (650, 160, 1920, 600)
    save(pair(c2.crop(water_box), "C2 — narrow visible far-sea seam", c3.crop(water_box), "C3 — broad non-linear blue-to-turquoise band"), EVIDENCE / "03-water-blend-before-after.png")
    squint = c3.filter(ImageFilter.GaussianBlur(18)).resize((960, 540), Image.Resampling.LANCZOS).resize(SIZE, Image.Resampling.LANCZOS)
    save(label(squint, "C3 WATER SQUINT TEST — no narrow seam read"), EVIDENCE / "04-water-blend-squint-test.png")
    save(pair(c2, "C2 — dark-green fallback exposed", c3, "C3 — coastal continuation covers visible fallback"), EVIDENCE / "05-scenic-coverage-before-after.png")
    save(label(c3, "COMPOSITION C3 — grounded Fountain B + broad water blend + scenic coverage"), EVIDENCE / "06-composition-c3-final.png")
    save(pair(Image.open(CANONICAL).convert("RGBA"), "CANONICAL PROJECTION A — reference", c3, "COMPOSITION C3 — final static preview"), EVIDENCE / "07-canonical-vs-c3.png")
    save(pair(c2, "COMPOSITION C2 — previous static preview", c3, "COMPOSITION C3 — final compositing fix"), EVIDENCE / "08-c2-vs-c3.png")
    save(route_board(c3), EVIDENCE / "09-c3-route-legibility.png")
    update_manifest()


if __name__ == "__main__":
    main()
