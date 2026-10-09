"""Build non-runtime Phase E.1 layer-reconstruction evidence.

Inputs are immutable Candidate B plus two separately generated clean plates.  The
script makes local RGBA extraction layers, static composite checks, and review
boards; it never writes inside the R4 runtime directories.
"""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1"
ASSETS = REPORT / "production-pilot-assets"
MASTER = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-b/02-candidate-b-original.png"
WORKSHOP_CLEAN_SOURCE = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-workshop-clean-source.png"
HERO_CLEAN_SOURCE = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-hero-clean-source.png"
PLAYER = ROOT / "world/assets/canonical-r4/candidates/player/player-b-front.png"
SIZE = (1280, 720)


def png(path: Path, image: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG")


def resize_clean(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA").resize(SIZE, Image.Resampling.LANCZOS)


def layer_from_polygons(master: Image.Image, polygons: list[list[tuple[int, int]]], crop: tuple[int, int, int, int], feather: int = 1) -> Image.Image:
    mask = Image.new("L", SIZE, 0)
    draw = ImageDraw.Draw(mask)
    for polygon in polygons:
        draw.polygon(polygon, fill=255)
    if feather:
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
    rgba = master.copy()
    rgba.putalpha(mask)
    return rgba.crop(crop)


def paste_crop(canvas: Image.Image, layer: Image.Image, xy: tuple[int, int]) -> None:
    canvas.alpha_composite(layer, xy)


def label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fill=(255, 255, 255, 255), size=20) -> None:
    font = ImageFont.truetype("arial.ttf", size)
    draw.text(xy, text, font=font, fill=fill, stroke_width=2, stroke_fill=(7, 31, 39, 230))


def player_at(canvas: Image.Image, feet: tuple[int, int]) -> None:
    player = Image.open(PLAYER).convert("RGBA")
    canvas.alpha_composite(player, (feet[0] - 14, feet[1] - 56))


def camera_frame(canvas: Image.Image, focus: tuple[int, int]) -> Image.Image:
    # 1024×576 world region shown at zoom 1.25, rendered to 1280×720.
    left = max(0, min(SIZE[0] - 1024, focus[0] - 512))
    top = max(0, min(SIZE[1] - 576, focus[1] - 288))
    return canvas.crop((left, top, left + 1024, top + 576)).resize(SIZE, Image.Resampling.LANCZOS)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    REPORT.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    master = Image.open(MASTER).convert("RGBA")
    workshop_clean = resize_clean(WORKSHOP_CLEAN_SOURCE)
    hero_clean = resize_clean(HERO_CLEAN_SOURCE)
    png(REPORT / "11-workshop-clean-background.png", workshop_clean)
    png(REPORT / "12-hero-water-clean-background.png", hero_clean)
    png(ASSETS / "workshop_clean_plate_rgba.png", workshop_clean)
    png(ASSETS / "hero_water_base.png", hero_clean)

    # Exact Candidate-B pixels, isolated with feathered masks.  These are not
    # inferred new architecture: the independently restored plate is beneath.
    hall = layer_from_polygons(master, [[(0, 0), (447, 0), (453, 115), (412, 164), (294, 151), (178, 158), (51, 163), (0, 180)]], (0, 0, 470, 190), 1)
    stairs = layer_from_polygons(master, [[(0, 125), (208, 132), (292, 182), (238, 276), (180, 360), (70, 397), (0, 383)]], (0, 120, 310, 405), 1)
    workshop = layer_from_polygons(master, [[(112, 194), (456, 202), (560, 262), (545, 357), (465, 389), (276, 378), (125, 346), (75, 298)]], (70, 185, 570, 398), 1)
    foreground = layer_from_polygons(master, [[(0, 444), (238, 408), (467, 425), (608, 489), (693, 598), (678, 720), (0, 720)]], (0, 400, 710, 720), 1)
    hall_bundle = layer_from_polygons(master, [
        [(0, 0), (447, 0), (453, 115), (412, 164), (294, 151), (178, 158), (51, 163), (0, 180)],
        [(0, 125), (208, 132), (292, 182), (238, 276), (180, 360), (70, 397), (0, 383)],
        [(112, 194), (456, 202), (560, 262), (545, 357), (465, 389), (276, 378), (125, 346), (75, 298)],
        [(0, 444), (238, 408), (467, 425), (608, 489), (693, 598), (678, 720), (0, 720)],
    ], (0, 0, 710, 720), 1)
    png(ASSETS / "hall_facade_rgba.png", hall)
    png(ASSETS / "hall_stairs_retaining_rgba.png", stairs)
    png(ASSETS / "workshop_front_rgba.png", workshop)
    png(ASSETS / "workshop_foreground_rail_planters_rgba.png", foreground)
    png(ASSETS / "workshop_hall_reconstruction_bundle_rgba.png", hall_bundle)

    ship = layer_from_polygons(master, [[(836, 88), (1030, 120), (1238, 136), (1280, 154), (1280, 478), (1181, 482), (1084, 451), (1013, 387), (927, 326), (856, 290)]], (820, 80, 1280, 500), 1)
    dock = layer_from_polygons(master, [[(421, 358), (548, 365), (698, 357), (832, 322), (952, 296), (1036, 321), (1080, 411), (943, 465), (763, 451), (590, 466), (450, 447)]], (410, 285, 1100, 475), 1)
    gangway = layer_from_polygons(master, [[(938, 297), (1087, 308), (1065, 380), (964, 374)]], (925, 285, 1100, 395), 1)
    piles = layer_from_polygons(master, [[(429, 364), (985, 296), (1085, 418), (931, 468), (503, 465)]], (420, 285, 1100, 475), 1)
    # A compact contact layer captures source-matched dark water/shadow only.
    contact = layer_from_polygons(master, [[(1000, 416), (1280, 444), (1280, 500), (1160, 505), (1040, 465)]], (985, 405, 1280, 515), 3)
    hero_bundle = layer_from_polygons(master, [
        [(836, 88), (1030, 120), (1238, 136), (1280, 154), (1280, 478), (1181, 482), (1084, 451), (1013, 387), (927, 326), (856, 290)],
        [(421, 358), (548, 365), (698, 357), (832, 322), (952, 296), (1036, 321), (1080, 411), (943, 465), (763, 451), (590, 466), (450, 447)],
        [(1000, 416), (1280, 444), (1280, 500), (1160, 505), (1040, 465)],
    ], (410, 80, 1280, 515), 1)
    png(ASSETS / "hero_ship_hull_rgba.png", ship)
    png(ASSETS / "hero_side_dock_rgba.png", dock)
    png(ASSETS / "hero_gangway_rgba.png", gangway)
    png(ASSETS / "hero_dock_piles_rgba.png", piles)
    png(ASSETS / "hero_water_contact_rgba.png", contact)
    png(ASSETS / "hero_water_foreground_rgba.png", contact)
    png(ASSETS / "hero_foreground_rgba.png", piles)
    png(ASSETS / "hero_ship_dock_reconstruction_bundle_rgba.png", hero_bundle)

    workshop_composite = workshop_clean.copy()
    paste_crop(workshop_composite, hall_bundle, (0, 0))
    png(REPORT / "13-workshop-reconstructed-composite.png", workshop_composite)
    hero_composite = hero_clean.copy()
    paste_crop(hero_composite, hero_bundle, (410, 80))
    png(REPORT / "14-hero-reconstructed-composite.png", hero_composite)

    # Occlusion frames place a real 28×56 R4 candidate sprite at C.2 anchors.
    occlusion = Image.new("RGBA", (1280, 720), (11, 29, 37, 255))
    panels = [
        ("RAIL FRONT — player behind foreground", workshop_composite, (245, 440), True),
        ("RAIL BACK — player in front of foreground", workshop_composite, (340, 455), False),
        ("WORKSHOP APPROACH", workshop_composite, (245, 440), True),
        ("HALL STAIR BASE", workshop_composite, (120, 315), True),
        ("DOCK / GANGWAY", hero_composite, (1015, 355), True),
        ("HERO THRESHOLD", hero_composite, (1028, 355), True),
    ]
    for i, (title, base, feet, front) in enumerate(panels):
        x, y = (i % 3) * 426, (i // 3) * 360
        panel = base.copy()
        player_at(panel, feet)
        if front:
            if i < 4:
                paste_crop(panel, foreground, (0, 400))
            else:
                paste_crop(panel, hero_bundle, (410, 80))
        frame = camera_frame(panel, feet).resize((416, 234), Image.Resampling.LANCZOS)
        occlusion.alpha_composite(frame, (x + 5, y + 42))
        d = ImageDraw.Draw(occlusion)
        label(d, (x + 10, y + 10), title, size=14)
        label(d, (x + 10, y + 288), f"feet {feet[0]},{feet[1]} · 28×56 · zoom 1.25", size=12)
    png(REPORT / "15-player-front-back-occlusion.png", occlusion)

    compare = Image.new("RGBA", (1280, 760), (10, 28, 37, 255))
    compare.alpha_composite(master.resize((620, 349), Image.Resampling.LANCZOS), (20, 50))
    combined = Image.new("RGBA", SIZE)
    combined.alpha_composite(workshop_composite)
    # Hero uses its clean/water replacement only in the hero domain.
    combined.alpha_composite(hero_composite.crop((710, 0, 1280, 720)), (710, 0))
    compare.alpha_composite(combined.resize((620, 349), Image.Resampling.LANCZOS), (640, 50))
    d = ImageDraw.Draw(compare)
    label(d, (20, 14), "BEAUTY MASTER — CANDIDATE B (immutable)", size=18)
    label(d, (640, 14), "E.1 RECONSTRUCTION — clean plates + separate RGBA", size=18)
    label(d, (20, 425), "Left / Hall–Workshop: original pixels reconstructed above generated clean ground. Right / Hero: source-matched ship/dock above generated water.", size=15)
    label(d, (20, 462), "Comparison finding: no doubled Hero or Workshop structure; clean-plate perspective and painterly texture still require human art-direction review.", size=15)
    png(REPORT / "16-beauty-master-vs-reconstruction.png", compare)

    board = Image.new("RGBA", (1280, 720), (12, 31, 39, 255))
    board.alpha_composite(workshop_composite.resize((610, 343), Image.Resampling.LANCZOS), (20, 64))
    board.alpha_composite(hero_composite.resize((610, 343), Image.Resampling.LANCZOS), (650, 64))
    board.alpha_composite(occlusion.resize((610, 343), Image.Resampling.LANCZOS), (20, 357))
    board.alpha_composite(compare.resize((610, 362), Image.Resampling.LANCZOS), (650, 357))
    d = ImageDraw.Draw(board)
    label(d, (20, 18), "R5 PHASE E.1 — HUMAN VISUAL REVIEW BOARD", size=24)
    label(d, (20, 42), "Workshop / Hall — structural replacement check", size=14)
    label(d, (650, 42), "Hero Ship / Dock — water and contact check", size=14)
    png(REPORT / "17-final-human-review-board.png", board)

    # Preserve the generator outputs as RGBA provenance records before hashing
    # the asset manifest, so every item in this pilot folder has alpha support.
    png(ASSETS / "source-workshop-clean-generation.png", Image.open(WORKSHOP_CLEAN_SOURCE).convert("RGBA"))
    png(ASSETS / "source-hero-clean-generation.png", Image.open(HERO_CLEAN_SOURCE).convert("RGBA"))
    placement = {
        "hall_facade_rgba.png": ([0, 0], [175, 190], 30),
        "hall_stairs_retaining_rgba.png": ([0, 120], [120, 315], 70),
        "workshop_front_rgba.png": ([70, 185], [245, 440], 40),
        "workshop_foreground_rail_planters_rgba.png": ([0, 400], [245, 440], 70),
        "workshop_hall_reconstruction_bundle_rgba.png": ([0, 0], [245, 440], 40),
        "workshop_clean_plate_rgba.png": ([0, 0], [245, 440], 0),
        "hero_ship_hull_rgba.png": ([820, 80], [1028, 355], 50),
        "hero_side_dock_rgba.png": ([410, 285], [890, 355], 35),
        "hero_gangway_rgba.png": ([925, 285], [1015, 355], 45),
        "hero_dock_piles_rgba.png": ([420, 285], [890, 355], 55),
        "hero_foreground_rgba.png": ([420, 285], [1028, 355], 70),
        "hero_water_base.png": ([0, 0], [1028, 355], 0),
        "hero_water_contact_rgba.png": ([985, 405], [1028, 355], 45),
        "hero_water_foreground_rgba.png": ([985, 405], [1028, 355], 70),
        "hero_ship_dock_reconstruction_bundle_rgba.png": ([410, 80], [1028, 355], 50),
    }
    records = []
    for file in sorted(ASSETS.glob("*.png")):
        im = Image.open(file)
        xy, anchor, depth = placement.get(file.name, ([0, 0], None, 0))
        records.append({
            "file": str(file.relative_to(ROOT)).replace("\\\\", "/"),
            "sourcePath": str(MASTER.relative_to(ROOT)).replace("\\\\", "/") if file.name not in {"hero_water_base.png", "workshop_clean_plate_rgba.png"} else "generated clean-plate edit source",
            "method": "generated clean plate" if "clean" in file.name or "water_base" in file.name else "Candidate B pixel extraction with feathered alpha segmentation",
            "size": [im.width, im.height], "alphaChannel": im.mode == "RGBA", "placementWorld": xy,
            "groundAnchor": anchor, "depthOrder": depth, "visualValidation": "CONDITIONAL — visible in independent E.1 composite; requires Human art-direction review", "sha256": sha(file)})
    data = {
        "status": "CONDITIONAL_REWORK_REQUIRED",
        "scope": "E.1 independent visual-production pilot only; no R4/R5 runtime integration",
        "referenceMaster": {"path": str(MASTER.relative_to(ROOT)).replace("\\\\", "/"), "sha256": sha(MASTER), "preserved": True},
        "cleanPlateMethod": "Image-generation edit, normalized to 1280×720. Generated/estimated areas are clean bases, not source truth.",
        "coordinateContract": {"worldSize": [1280, 720], "player": [28, 56], "cameraZoom": 1.25, "groundAnchor": "bottom-center", "heroThreshold": [1028, 355], "workshopAnchor": [245, 440]},
        "assets": records,
        "depthOrder": ["clean base/water", "structure bundle", "player ground anchor", "foreground rail/hull as applicable"],
        "verdict": {"workshopHall": "CONDITIONAL", "heroShip": "CONDITIONAL", "productionArtGate": "CONDITIONAL_REWORK_REQUIRED"},
        "limitations": ["Clean plates are generated estimates where Candidate B concealed source information.", "Extraction masks are a production-pilot segmentation, not approved final source art.", "Generated clean plates have style/perspective drift under inspection and cannot be promoted without human art-direction approval."]
    }
    draft = ROOT / "data/portfolio-world/r5-production-layer-reconstruction-draft.json"
    draft.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
