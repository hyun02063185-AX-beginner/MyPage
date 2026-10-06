#!/usr/bin/env python3
"""Build the R3 Phase A.1 Scenic A correction review assets (static only)."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parents[2]
R2 = ROOT / "portfolio-world" / "public" / "assets" / "canonical-r2"
R3 = ROOT / "portfolio-world" / "public" / "assets" / "canonical-r3" / "candidates"
SCENIC = R3 / "scenic"
PROPS = R3 / "props"
SOURCE = ROOT / "portfolio-world" / "art-source" / "runtime-r3-scenic-props"
EVIDENCE = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "runtime-r3-scenic-props-correction"
MANIFEST = ROOT / "data" / "portfolio-world" / "runtime-r3-scenic-props-candidates.json"
CANONICAL = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "gameplay-projection-refinement" / "projection-a-elevated-gameplay.png"
SIZE = (1920, 1080)
FONT = ImageFont.load_default()


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(image: Image.Image, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "PNG", optimize=True)


def clean(image: Image.Image) -> Image.Image:
    result = image.convert("RGBA")
    alpha = result.getchannel("A").point(lambda value: 0 if value < 16 else value)
    result.putalpha(alpha)
    return result


def checker(size: tuple[int, int]) -> Image.Image:
    image = Image.new("RGBA", size, "#78979b")
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], 32):
        for x in range(0, size[0], 32):
            if (x // 32 + y // 32) % 2 == 0:
                draw.rectangle((x, y, x + 31, y + 31), fill="#91afb1")
    return image


def label(image: Image.Image, text: str) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    draw.rounded_rectangle((18, 18, 590, 58), radius=8, fill="#153940")
    draw.text((32, 32), text, font=FONT, fill="#fff2d1")
    return result


def put(canvas: Image.Image, image: Image.Image, x: int, y: int) -> None:
    canvas.alpha_composite(image, (x, y))


def corrected_scenic() -> Image.Image:
    """Normalize the selected Scenic A edit without altering collision/runtime assets."""
    source = clean(Image.open(SOURCE / "scenic-a-corrected-imagegen-source.png"))
    source = source.resize(SIZE, Image.Resampling.LANCZOS)
    # The generation has the desired upper atmosphere; restraint keeps it below landmark contrast.
    source = ImageEnhance.Color(source).enhance(0.72)
    source = ImageEnhance.Brightness(source).enhance(1.03)
    alpha = source.getchannel("A")
    # Remove isolated alpha fringe below the coastal plate, leaving lower harbor art fully independent.
    alpha = alpha.point(lambda value: 0 if value < 24 else value)
    source.putalpha(alpha)
    save(source, SCENIC / "scenic-a-corrected.png")
    return source


def foundation_canvas() -> Image.Image:
    canvas = Image.new("RGBA", SIZE, "#395e5b")
    draw = ImageDraw.Draw(canvas)
    draw.polygon([(700, 260), (1920, 215), (1920, 1080), (350, 1080), (430, 770)], fill="#1b95a8")
    draw.polygon([(1130, 405), (1920, 350), (1920, 920), (1370, 905)], fill="#16869a")
    return canvas


def landmarks(canvas: Image.Image) -> None:
    master = Image.open(R2 / "candidates/runtime-r24-foundation-master/foundation-master-b.png").convert("RGBA")
    vertical = Image.open(R2 / "candidates/runtime-r24-foundation-master/foundation-master-b-vertical-structure.png").convert("RGBA")
    canvas.alpha_composite(master)
    vertical.putalpha(vertical.getchannel("A").point(lambda value: int(value * .32)))
    canvas.alpha_composite(vertical)
    assets = [
        ("architecture/hall-b.png", 135, 0, 605, 320), ("architecture/workshop-c.png", 85, 520, 505, 280),
        ("architecture/office-b.png", 700, 505, 280, 205), ("ships/secondary-b.png", 1045, 240, 275, 255),
        ("ships/workboat-a.png", 1140, 470, 140, 75), ("ships/hero-b.png", 1325, 115, 595, 685),
    ]
    for file, x, y, width, height in assets:
        put(canvas, Image.open(R2 / file).convert("RGBA").resize((width, height), Image.Resampling.LANCZOS), x, y)


def prop(name: str) -> Image.Image:
    return Image.open(PROPS / f"{name}.png").convert("RGBA")


def composition(scenic: Image.Image, fountain_position: tuple[int, int]) -> Image.Image:
    canvas = foundation_canvas()
    canvas.alpha_composite(scenic)
    landmarks(canvas)
    # The C selective-mix asset list is unchanged; these two Hall props were part of the approved C direction.
    layout = [
        ("fountain-b", *fountain_position), ("flower-planter", 205, 300), ("cypress-planter", 720, 270),
        ("bench", 235, 475), ("banner", 770, 380), ("lamp", 845, 430), ("notice-board", 970, 560),
        ("bollard", 1190, 605), ("rope-coil", 1238, 650), ("crate-stack", 260, 825),
        ("barrels", 375, 825), ("bollard", 1540, 800), ("mooring-rope", 1455, 708),
    ]
    for name, x, y in layout:
        put(canvas, prop(name), x, y)
    player = Image.open(R2 / "player/player-a.png").convert("RGBA").resize((28, 56), Image.Resampling.LANCZOS)
    put(canvas, player, 429, 729)
    return canvas


def placement_review(scenic: Image.Image, old: Image.Image, chosen: Image.Image, alternative: Image.Image) -> Image.Image:
    board = Image.new("RGBA", SIZE, "#315f63")
    panels = [(old, "OLD — stair approach (rejected)"), (alternative, "F2 — center / south-east (not selected)"), (chosen, "F1 — center-left (selected)")]
    for index, (image, text) in enumerate(panels):
        panel = image.crop((130, 180, 1050, 800)).resize((640, 575), Image.Resampling.LANCZOS)
        draw = ImageDraw.Draw(panel)
        for name, point in {"P4": (905, 688), "P5": (670, 453), "P6": (505, 318)}.items():
            x = int((point[0] - 130) * 640 / 920); y = int((point[1] - 180) * 575 / 620)
            draw.ellipse((x - 7, y - 7, x + 7, y + 7), fill="#fff4a3", outline="#153940", width=2)
            draw.text((x + 9, y - 16), name, font=FONT, fill="white", stroke_width=2, stroke_fill="#153940")
        board.alpha_composite(label(panel, text), (index * 640, 80))
    return label(board, "FOUNTAIN B PLACEMENT REVIEW — static preview; F1 preserves P4→P5→P6 visual corridor")


def route_board(image: Image.Image) -> Image.Image:
    result = image.copy(); draw = ImageDraw.Draw(result)
    points = {"P1": (443, 785), "P2": (710, 763), "P3": (1010, 628), "P4": (905, 688), "P5": (670, 453), "P6": (505, 318), "P7": (1405, 770), "P8": (815, 735)}
    for left, right in [("P1", "P2"), ("P2", "P8"), ("P8", "P3"), ("P3", "P7"), ("P8", "P4"), ("P4", "P5"), ("P5", "P6")]:
        draw.line((points[left], points[right]), fill="#fff4a3", width=4)
    for name, (x, y) in points.items():
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill="#fff4a3", outline="#153940", width=2)
        draw.text((x + 10, y - 18), name, font=FONT, fill="white", stroke_width=2, stroke_fill="#153940")
    return label(result, "C1 ROUTE LEGIBILITY — preview-only overlay; no collision or route change")


def update_manifest() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    scenic = [entry for entry in manifest["scenicCandidates"] if entry["id"] != "scenic-a-corrected"]
    asset = SCENIC / "scenic-a-corrected.png"
    scenic.append({
        "id": "scenic-a-corrected", "file": "portfolio-world/public/assets/canonical-r3/candidates/scenic/scenic-a-corrected.png",
        "hash": sha(asset), "source": "scenic-a + ImageGen bounded correction + deterministic color/alpha normalization",
        "depthIntent": "L0 pale sky / distant mountains / hillside town / cliffs / outer sea", "collisionIntent": "none",
        "score": {"canonicalAtmosphere": 5, "depth": 5, "gameplaySubordination": 5, "styleMatch": 5, "total": 20},
    })
    manifest["phase"] = "R3 Phase A.1 — selected Scenic A bounded correction and static Composition C.1 preview only"
    manifest["runtimeImported"] = False
    manifest["scenicCandidates"] = scenic
    manifest["selectedScenic"] = "scenic-a-corrected"
    manifest["selectedPropComposition"] = "composition-c-selective-mix"
    manifest["selectedFountain"] = "fountain-b"
    manifest["correctedComposition"] = "composition-c1"
    manifest["humanDirectionApproval"] = True
    manifest["finalHumanSelection"] = "PENDING"
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    original = Image.open(SCENIC / "scenic-a.png").convert("RGBA")
    corrected = corrected_scenic()
    original_board = checker(SIZE); original_board.alpha_composite(original)
    corrected_board = checker(SIZE); corrected_board.alpha_composite(corrected)
    save(label(original_board, "SCENIC A — original transparent candidate"), EVIDENCE / "01-scenic-a-original.png")
    save(label(corrected_board, "SCENIC A CORRECTED — bright coastal atmosphere"), EVIDENCE / "02-scenic-a-corrected.png")
    before_after = Image.new("RGBA", SIZE, "#315f63")
    before_after.alpha_composite(label(original_board.resize((960, 540), Image.Resampling.LANCZOS), "ORIGINAL — upper void remains"), (0, 0))
    before_after.alpha_composite(label(corrected_board.resize((960, 540), Image.Resampling.LANCZOS), "CORRECTED — sky / town / cliffs complete"), (960, 0))
    save(before_after, EVIDENCE / "03-scenic-before-after.png")
    old = composition(corrected, (500, 360))
    f2 = composition(corrected, (470, 330))
    c1 = composition(corrected, (330, 330))
    save(placement_review(corrected, old, c1, f2), EVIDENCE / "04-fountain-placement-review.png")
    save(label(c1, "COMPOSITION C.1 — selected Scenic A correction + C selective mix + Fountain B F1"), EVIDENCE / "05-composition-c1-corrected.png")
    compare = Image.new("RGBA", SIZE, "#315f63")
    compare.alpha_composite(label(Image.open(CANONICAL).convert("RGBA").resize((960, 540), Image.Resampling.LANCZOS), "CANONICAL PROJECTION A — reference"), (0, 0))
    compare.alpha_composite(label(c1.resize((960, 540), Image.Resampling.LANCZOS), "COMPOSITION C.1 — corrected preview"), (960, 0))
    save(compare, EVIDENCE / "06-canonical-vs-c1.png")
    save(route_board(c1), EVIDENCE / "07-c1-route-legibility.png")
    update_manifest()


if __name__ == "__main__":
    main()
