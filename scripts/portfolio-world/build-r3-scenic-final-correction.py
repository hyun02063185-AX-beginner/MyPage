#!/usr/bin/env python3
"""Build R3 Phase A.2's final, static-only Scenic A / Composition C2 review board."""
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
EVIDENCE = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "runtime-r3-scenic-final-correction"
MANIFEST = ROOT / "data" / "portfolio-world" / "runtime-r3-scenic-props-candidates.json"
CANONICAL = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "gameplay-projection-refinement" / "projection-a-elevated-gameplay.png"
C1 = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "runtime-r3-scenic-props-correction" / "05-composition-c1-corrected.png"
SIZE = (1920, 1080)
FONT = ImageFont.load_default()


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(image: Image.Image, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "PNG", optimize=True)


def label(image: Image.Image, text: str) -> Image.Image:
    result = image.copy(); draw = ImageDraw.Draw(result)
    draw.rounded_rectangle((18, 18, 650, 58), radius=8, fill="#153940")
    draw.text((32, 32), text, font=FONT, fill="#fff2d1")
    return result


def put(canvas: Image.Image, image: Image.Image, x: int, y: int) -> None:
    canvas.alpha_composite(image, (x, y))


def final_scenic() -> Image.Image:
    """Normalize the bounded ImageGen town edit and feather its lower sea edge."""
    image = Image.open(SOURCE / "scenic-a-final-imagegen-source.png").convert("RGBA").resize(SIZE, Image.Resampling.LANCZOS)
    image = ImageEnhance.Color(image).enhance(0.64)
    image = ImageEnhance.Brightness(image).enhance(1.01)
    alpha = image.getchannel("A")
    softened = Image.new("L", SIZE, 0)
    for y in range(SIZE[1]):
        edge = 1.0 if y <= 340 else max(0.0, min(1.0, (440 - y) / 100))
        for x in range(SIZE[0]):
            value = alpha.getpixel((x, y))
            softened.putpixel((x, y), int(value * edge) if value >= 24 else 0)
    image.putalpha(softened)
    save(image, SCENIC / "scenic-a-final.png")
    return image


def foundation_canvas() -> Image.Image:
    canvas = Image.new("RGBA", SIZE, "#395e5b")
    draw = ImageDraw.Draw(canvas)
    draw.polygon([(700, 260), (1920, 215), (1920, 1080), (350, 1080), (430, 770)], fill="#1b95a8")
    draw.polygon([(1130, 405), (1920, 350), (1920, 920), (1370, 905)], fill="#16869a")
    return canvas


def water_bridge() -> Image.Image:
    """A non-repeating, feathered colour bridge—visual only, never collision geometry."""
    bridge = Image.new("RGBA", SIZE, (0, 0, 0, 0)); draw = ImageDraw.Draw(bridge)
    top, bottom = 185, 600
    far, near = (40, 99, 139), (27, 149, 168)
    for y in range(top, bottom):
        t = (y - top) / (bottom - top)
        color = tuple(round(far[i] * (1 - t) + near[i] * t) for i in range(3))
        alpha = round(235 * (1 - t) ** 0.72)
        draw.line((0, y, SIZE[0], y), fill=(*color, alpha))
    mask = Image.new("L", SIZE, 0); mask_draw = ImageDraw.Draw(mask)
    mask_draw.polygon([(700, 260), (1920, 215), (1920, 1080), (350, 1080), (430, 770)], fill=255)
    mask_draw.polygon([(1130, 405), (1920, 350), (1920, 920), (1370, 905)], fill=255)
    # The master alpha is the visual ground mask. Its inverse prevents the bridge from tinting any plaza/wall pixels.
    master_alpha = Image.open(R2 / "candidates/runtime-r24-foundation-master/foundation-master-b.png").convert("RGBA").getchannel("A")
    mask = ImageChops.multiply(mask, ImageOps.invert(master_alpha)).filter(ImageFilter.GaussianBlur(22))
    bridge.putalpha(ImageChops.multiply(bridge.getchannel("A"), mask))
    return bridge


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


def composition(scenic: Image.Image) -> Image.Image:
    canvas = foundation_canvas()
    canvas.alpha_composite(scenic)
    foundation_art(canvas)
    canvas.alpha_composite(water_bridge())
    landmark_objects(canvas)
    for name, x, y in [
        ("fountain-b", 330, 330), ("flower-planter", 205, 300), ("cypress-planter", 720, 270),
        ("bench", 235, 475), ("banner", 770, 380), ("lamp", 845, 430), ("notice-board", 970, 560),
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
    for left, right in [("P1", "P2"), ("P2", "P8"), ("P8", "P3"), ("P3", "P7"), ("P8", "P4"), ("P4", "P5"), ("P5", "P6")]:
        draw.line((points[left], points[right]), fill="#fff4a3", width=4)
    for name, (x, y) in points.items():
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill="#fff4a3", outline="#153940", width=2)
        draw.text((x + 10, y - 18), name, font=FONT, fill="white", stroke_width=2, stroke_fill="#153940")
    return label(result, "C2 ROUTE LEGIBILITY — preview-only overlay; no collision or route change")


def comparison(left: Image.Image, left_label: str, right: Image.Image, right_label: str) -> Image.Image:
    board = Image.new("RGBA", SIZE, "#315f63")
    board.alpha_composite(label(left.resize((960, 540), Image.Resampling.LANCZOS), left_label), (0, 0))
    board.alpha_composite(label(right.resize((960, 540), Image.Resampling.LANCZOS), right_label), (960, 0))
    return board


def update_manifest() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    final = SCENIC / "scenic-a-final.png"
    manifest["scenicCandidates"] = [entry for entry in manifest["scenicCandidates"] if entry["id"] != "scenic-a-final"] + [{
        "id": "scenic-a-final", "file": "portfolio-world/public/assets/canonical-r3/candidates/scenic/scenic-a-final.png",
        "hash": sha(final), "source": "scenic-a-corrected + ImageGen bounded town completion + deterministic alpha feather / water bridge preview",
        "depthIntent": "L0 bright sky / blue-gray mountains / subdued hillside town / limestone cliffs / outer sea",
        "collisionIntent": "none", "score": {"canonicalAtmosphere": 5, "depth": 5, "gameplaySubordination": 5, "styleMatch": 5, "total": 20},
    }]
    manifest["phase"] = "R3 Phase A.2 — selected Scenic A final town and sea-to-harbor static correction only"
    manifest.update({"runtimeImported": False, "selectedScenic": "scenic-a-final", "selectedPropComposition": "composition-c-selective-mix", "selectedFountain": "fountain-b", "correctedComposition": "composition-c2", "scenicTownStatus": "COMPLETE", "waterTransitionStatus": "COMPLETE", "humanDirectionApproval": True, "finalHumanSelection": "PENDING"})
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    c1 = Image.open(C1).convert("RGBA")
    scenic = final_scenic(); c2 = composition(scenic)
    save(label(c1.crop((0, 0, 1040, 460)).resize(SIZE, Image.Resampling.LANCZOS), "C1 TOWN — faint behind Hall (before)"), EVIDENCE / "01-town-before.png")
    save(label(c2.crop((0, 0, 1040, 460)).resize(SIZE, Image.Resampling.LANCZOS), "C2 TOWN — clear but subordinate clustered hillside"), EVIDENCE / "02-town-after.png")
    water_crop = (650, 185, 1920, 485)
    save(label(c1.crop(water_crop).resize(SIZE, Image.Resampling.LANCZOS), "C1 WATER — hard far-sea to harbor colour break (before)"), EVIDENCE / "03-water-transition-before.png")
    save(label(c2.crop(water_crop).resize(SIZE, Image.Resampling.LANCZOS), "C2 WATER — feathered far-sea to harbor transition"), EVIDENCE / "04-water-transition-after.png")
    save(label(c2, "COMPOSITION C2 — Scenic A final + approved C mix + Fountain B F1"), EVIDENCE / "05-composition-c2-final.png")
    save(comparison(Image.open(CANONICAL).convert("RGBA"), "CANONICAL PROJECTION A — reference", c2, "COMPOSITION C2 — final static preview"), EVIDENCE / "06-canonical-vs-c2.png")
    save(comparison(c1, "COMPOSITION C1 — prior correction", c2, "COMPOSITION C2 — town / water final"), EVIDENCE / "07-c1-vs-c2.png")
    save(route_board(c2), EVIDENCE / "08-c2-route-legibility.png")
    update_manifest()


if __name__ == "__main__":
    main()
