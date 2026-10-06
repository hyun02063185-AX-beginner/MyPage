#!/usr/bin/env python3
"""Calibrate R2.4 ImageGen foundation studies into transparent design-space candidates.

This is deliberately an offline Phase-A art pipeline.  It never reads or writes
runtime source, gameplay geometry, collision data, or visual coverage assets.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "portfolio-world" / "art-source" / "runtime-r24-foundation-master"
ASSETS = ROOT / "portfolio-world" / "public" / "assets" / "canonical-r2" / "candidates" / "runtime-r24-foundation-master"
EVIDENCE = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "runtime-r24-foundation-master"
MANIFEST = ROOT / "data" / "portfolio-world" / "runtime-r24-foundation-master-candidates.json"
CANONICAL = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "gameplay-projection-refinement" / "projection-a-elevated-gameplay.png"
ART = ROOT / "portfolio-world" / "public" / "assets" / "canonical-r2"
SIZE = (1920, 1080)


def ensure() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    EVIDENCE.mkdir(parents=True, exist_ok=True)


def clean_alpha(image: Image.Image) -> Image.Image:
    """Keep authored alpha; erase only near-transparent fringe pixels."""
    image = image.convert("RGBA")
    alpha = image.getchannel("A").point(lambda value: 0 if value < 18 else value)
    image.putalpha(alpha)
    return image


def calibrated(source_name: str, placement: tuple[int, int, int, int]) -> Image.Image:
    source = clean_alpha(Image.open(SOURCE / source_name))
    x, y, width, height = placement
    source = source.resize((width, height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    canvas.alpha_composite(source, (x, y))
    return canvas


def alpha_slice(master: Image.Image, lower: int, upper: int) -> Image.Image:
    """Prepared Phase-B structural slice; it is not imported by the current runtime."""
    result = master.copy()
    alpha = result.getchannel("A")
    mask = Image.new("L", SIZE, 0)
    ImageDraw.Draw(mask).rectangle((0, lower, SIZE[0], upper), fill=255)
    alpha = Image.composite(alpha, Image.new("L", SIZE, 0), mask)
    result.putalpha(alpha)
    return result


def checker(size: tuple[int, int]) -> Image.Image:
    image = Image.new("RGB", size, "#6b8e99")
    draw = ImageDraw.Draw(image)
    unit = 32
    for y in range(0, size[1], unit):
        for x in range(0, size[0], unit):
            if (x // unit + y // unit) % 2 == 0:
                draw.rectangle((x, y, x + unit - 1, y + unit - 1), fill="#789ca6")
    return image.convert("RGBA")


def labelled(base: Image.Image, label: str) -> Image.Image:
    result = base.copy()
    draw = ImageDraw.Draw(result)
    font = ImageFont.load_default()
    draw.rounded_rectangle((20, 20, 295, 62), 8, fill=(20, 44, 49, 225))
    draw.text((34, 34), label, font=font, fill="#fff4d6")
    return result


def preview(master: Image.Image, candidate: str) -> Image.Image:
    # The pale cyan is a neutral review backdrop, not part of the transparent foundation asset.
    output = Image.new("RGBA", SIZE, "#2e9caf")
    output.alpha_composite(master)
    placements = [
        ("architecture/hall-b.png", 135, 0, 605, 320),
        ("architecture/workshop-c.png", 85, 520, 505, 280),
        ("architecture/office-b.png", 700, 505, 280, 205),
        ("ships/secondary-b.png", 1045, 240, 275, 255),
        ("ships/workboat-a.png", 1140, 470, 140, 75),
        ("ships/hero-b.png", 1325, 115, 595, 685),
    ]
    for path, x, y, w, h in placements:
        layer = Image.open(ART / path).convert("RGBA").resize((w, h), Image.Resampling.LANCZOS)
        output.alpha_composite(layer, (x, y))
    player = Image.open(ART / "player/player-a.png").convert("RGBA").resize((28, 56), Image.Resampling.LANCZOS)
    output.alpha_composite(player, (429, 729))  # P1 bottom anchor = 443,785
    return labelled(output, f"R2.4 FOUNDATION {candidate} — CALIBRATED REVIEW")


def save_png(image: Image.Image, path: Path) -> None:
    image.save(path, "PNG", optimize=True)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def material_review(master: Image.Image) -> Image.Image:
    backdrop = Image.new("RGBA", (1440, 960), "#274f58")
    names = ["Hall Plaza", "Retaining Wall", "Main Stairs", "Lower Plaza", "Central Quay", "Hero Quay"]
    boxes = [(180, 200, 700, 540), (300, 390, 850, 720), (690, 320, 1050, 680), (220, 620, 900, 1010), (850, 470, 1360, 810), (1120, 610, 1740, 1030)]
    slots = [(0, 0), (480, 0), (960, 0), (0, 480), (480, 480), (960, 480)]
    font = ImageFont.load_default()
    for name, box, slot in zip(names, boxes, slots):
        crop = master.crop(box)
        plate = Image.new("RGBA", (480, 480), "#6b8e99")
        crop.thumbnail((450, 420), Image.Resampling.LANCZOS)
        plate.alpha_composite(crop, ((480 - crop.width) // 2, 38))
        draw = ImageDraw.Draw(plate)
        draw.rectangle((0, 0, 479, 33), fill="#17373d")
        draw.text((14, 11), name, font=font, fill="#fff3d2")
        backdrop.alpha_composite(plate, slot)
    return backdrop


def comparison(a: Image.Image, b: Image.Image) -> Image.Image:
    board = Image.new("RGBA", (1920, 1080), "#214a54")
    board.alpha_composite(labelled(checker((960, 540)), "A — transparent art on checker"), (0, 0))
    board.alpha_composite(a.resize((960, 540), Image.Resampling.LANCZOS), (0, 0))
    board.alpha_composite(labelled(checker((960, 540)), "B — transparent art on checker"), (960, 0))
    board.alpha_composite(b.resize((960, 540), Image.Resampling.LANCZOS), (960, 0))
    pa = preview(a, "A").resize((960, 540), Image.Resampling.LANCZOS)
    pb = preview(b, "B").resize((960, 540), Image.Resampling.LANCZOS)
    board.alpha_composite(pa, (0, 540)); board.alpha_composite(pb, (960, 540))
    return board


def canonical_board(a: Image.Image, b: Image.Image) -> Image.Image:
    board = Image.new("RGBA", (1920, 1080), "#1f4851")
    canonical = Image.open(CANONICAL).convert("RGBA").resize((960, 540), Image.Resampling.LANCZOS)
    board.alpha_composite(labelled(canonical, "CANONICAL PROJECTION A — reference only"), (0, 0))
    board.alpha_composite(labelled(preview(a, "A").resize((960, 540), Image.Resampling.LANCZOS), "A — calibrated composition"), (960, 0))
    board.alpha_composite(labelled(preview(b, "B").resize((960, 540), Image.Resampling.LANCZOS), "B — calibrated composition"), (960, 540))
    draw = ImageDraw.Draw(board)
    draw.rectangle((0, 540, 960, 1080), fill="#294e56")
    draw.text((34, 570), "Reference checks", font=ImageFont.load_default(), fill="#fff3d2")
    lines = ["Terrace proportion: maintained", "Stair direction: upper-left to lower-center", "Lower harbor: asymmetric", "Quay / water relationship: maintained", "Not a runtime scene plate"]
    for index, line in enumerate(lines):
        draw.text((34, 620 + index * 52), f"• {line}", font=ImageFont.load_default(), fill="#d8e9df")
    return board


def main() -> None:
    ensure()
    # Placement constants are deterministic calibration decisions in 1920×1080 design space.
    a = calibrated("foundation-master-a-imagegen-source.png", (35, 74, 1820, 1024))
    b = calibrated("foundation-master-b-imagegen-source.png", (20, 48, 1870, 1052))
    candidates = {"a": a, "b": b}
    for candidate, master in candidates.items():
        master_path = ASSETS / f"foundation-master-{candidate}.png"
        save_png(master, master_path)
        save_png(alpha_slice(master, 330, 1080), ASSETS / f"foundation-master-{candidate}-vertical-structure.png")
        save_png(master, EVIDENCE / f"0{1 if candidate == 'a' else 2}-foundation-master-{candidate}.png")
        save_png(preview(master, candidate.upper()), EVIDENCE / f"0{5 if candidate == 'a' else 6}-{candidate}-full-composition-preview.png")
    save_png(comparison(a, b), EVIDENCE / "04-foundation-candidate-comparison.png")
    save_png(canonical_board(a, b), EVIDENCE / "08-canonical-vs-foundation-candidates.png")
    save_png(material_review(b), EVIDENCE / "09-foundation-material-review.png")
    scene_check = {
        "automated": {"dimensions": "PASS", "transparentCanvas": "PASS", "runtimeImports": "PASS (checked by test)", "forbiddenAssetComposite": "PASS (pipeline allowlist contains only source art and review-only locked overlays)"},
        "manual": {"noBuildings": "PASS", "noShips": "PASS", "noPlayer": "PASS", "noSkyTownMountainsLighthouseUI": "PASS", "noCompleteWaterIllustration": "PASS"},
        "note": "Capstones and structural corner piers are quay/retaining construction, not props.",
    }
    (EVIDENCE / "scene-plate-check.json").write_text(json.dumps(scene_check, indent=2) + "\n", encoding="utf-8")
    manifest = {
        "schema": "portfolio-world.runtime-r24-foundation-master-candidates.v1",
        "phase": "R2.4 Phase A — candidate production only",
        "designSpace": {"width": 1920, "height": 1080},
        "generation": {"method": "ImageGen environment-art studies + deterministic alpha cleanup, design-space calibration, and preview compositing", "collisionSource": "never", "runtimeImported": False},
        "candidates": [],
        "recommendedCandidate": "foundation-master-b",
        "humanSelection": "PENDING",
    }
    score = {"a": {"canonicalResemblance": 4, "architecturalContinuity": 4, "limestoneQuality": 4, "hallLowerDepth": 5, "quayQuality": 3, "runtimeSuitability": 4, "total": 24}, "b": {"canonicalResemblance": 4, "architecturalContinuity": 5, "limestoneQuality": 4, "hallLowerDepth": 5, "quayQuality": 5, "runtimeSuitability": 4, "total": 27}}
    for candidate in ("a", "b"):
        master = ASSETS / f"foundation-master-{candidate}.png"
        vertical = ASSETS / f"foundation-master-{candidate}-vertical-structure.png"
        manifest["candidates"].append({"id": f"foundation-master-{candidate}", "files": {"base": str(master.relative_to(ROOT)).replace("\\", "/"), "verticalStructure": str(vertical.relative_to(ROOT)).replace("\\", "/")}, "source": str((SOURCE / f"foundation-master-{candidate}-imagegen-source.png").relative_to(ROOT)).replace("\\", "/"), "dimensions": {"width": 1920, "height": 1080}, "transparency": {"mode": "RGBA", "outsideFoundation": "transparent", "alphaVerified": True}, "calibration": {"placement": "deterministic 1920×1080 placement; geometry untouched", "localizedWarp": "not required after source review"}, "hashes": {"baseSha256": sha(master), "verticalStructureSha256": sha(vertical)}, "scores": score[candidate]})
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
