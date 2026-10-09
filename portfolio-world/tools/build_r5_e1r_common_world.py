"""Reproducible, non-runtime R5 E.1-R common-world layer pilot.

Only committed repository inputs are read.  The two E.1 generated clean images
are used strictly *inside* documented edit masks; Candidate B pixels are copied
bit-for-bit everywhere else.  No Phaser/R4 asset or scene is written.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r"
ASSETS = OUT / "production-assets"
MOTION = OUT / "motion-evidence"
MASTER = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-b/02-candidate-b-original.png"
E1_WORKSHOP = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1/production-pilot-assets/source-workshop-clean-generation.png"
E1_HERO = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1/production-pilot-assets/source-hero-clean-generation.png"
PLAYER = ROOT / "portfolio-world/public/assets/canonical-r4/candidates/player/player-b-front.png"
C2 = ROOT / "data/portfolio-world/r5-spatial-blueprint-c2-draft.json"
RESERVE = ROOT / "data/portfolio-world/r5-future-expansion-reserve-draft.json"
SIZE, LOGICAL, ZOOM = (1280, 720), (1024, 576), 1.25
VISIBLE = (LOGICAL[0] / ZOOM, LOGICAL[1] / ZOOM)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(path: Path, image: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG")


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype("arial.ttf", size)


def text(draw: ImageDraw.ImageDraw, at: tuple[int, int], value: str, size: int = 16) -> None:
    draw.text(at, value, font=font(size), fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(7, 29, 37, 240))


def mask(polygons: list[list[tuple[int, int]]]) -> Image.Image:
    output = Image.new("L", SIZE, 0)
    draw = ImageDraw.Draw(output)
    for polygon in polygons:
        draw.polygon(polygon, fill=255)
    return output


def subtract(source: Image.Image, owned: Image.Image) -> Image.Image:
    # Ownership, not alpha blending, makes semantic asset masks mutually exclusive.
    return ImageChops.subtract(source, owned)


def union(images: list[Image.Image]) -> Image.Image:
    output = Image.new("L", SIZE, 0)
    for image in images:
        output = ImageChops.lighter(output, image)
    return output


def image_from_mask(master: Image.Image, local_mask: Image.Image, asset_id: str) -> tuple[Image.Image, tuple[int, int], tuple[int, int, int, int]]:
    bbox = local_mask.getbbox()
    if not bbox:
        raise RuntimeError(f"{asset_id} has no opaque semantic pixels")
    rgba = master.copy()
    rgba.putalpha(local_mask)
    return rgba.crop(bbox), (bbox[0], bbox[1]), bbox


def alpha_overlap(a: Image.Image, b: Image.Image) -> int:
    return sum(1 for x, y in zip(a.getdata(), b.getdata()) if x and y)


def common_base(master: Image.Image, workshop: Image.Image, hero: Image.Image, workshop_mask: Image.Image, hero_mask: Image.Image) -> Image.Image:
    repaired = master.copy()
    # The selected clean source changes only its explicitly owned local region.
    repaired.paste(workshop, (0, 0), workshop_mask)
    repaired.paste(hero, (0, 0), hero_mask)
    return repaired


def composite(base: Image.Image, assets: dict[str, tuple[Image.Image, tuple[int, int]]], enabled: set[str], player_feet: tuple[int, int] | None = None) -> Image.Image:
    output = base.copy()
    foreground = {"workshop_foreground", "archive_approach_foreground", "hero_ship_foreground", "water_contact_foreground"}
    for asset_id, (image, xy) in assets.items():
        if asset_id in enabled and asset_id not in foreground:
            output.alpha_composite(image, xy)
    if player_feet:
        player = Image.open(PLAYER).convert("RGBA")
        output.alpha_composite(player, (round(player_feet[0] - 14), round(player_feet[1] - 56)))
    for asset_id, (image, xy) in assets.items():
        if asset_id not in enabled or asset_id not in foreground:
            continue
        # Explicit conditional occlusion boundaries based on feet, rather than a
        # static scene-depth constant.  Every E.1-R route point uses this rule.
        if not player_feet or asset_id == "water_contact_foreground" or (asset_id == "workshop_foreground" and player_feet[1] <= 520) or (asset_id == "archive_approach_foreground" and player_feet[1] <= 600) or (asset_id == "hero_ship_foreground" and player_feet[0] >= 930):
            output.alpha_composite(image, xy)
    return output


def camera_preview(world: Image.Image, focus: tuple[float, float]) -> tuple[Image.Image, list[float]]:
    max_x, max_y = SIZE[0] - VISIBLE[0], SIZE[1] - VISIBLE[1]
    camera_x = max(0.0, min(max_x, focus[0] - VISIBLE[0] / 2))
    camera_y = max(0.0, min(max_y, focus[1] - VISIBLE[1] / 2))
    # One world-to-logical transform. The 1280×720 output is only review scaling.
    logical = world.transform(LOGICAL, Image.Transform.AFFINE, (1 / ZOOM, 0, camera_x, 0, 1 / ZOOM, camera_y), Image.Resampling.BICUBIC)
    return logical.resize(SIZE, Image.Resampling.LANCZOS), [round(camera_x, 4), round(camera_y, 4)]


def sample_polyline(points: list[tuple[int, int]], count: int) -> list[tuple[float, float]]:
    segments = []
    total = 0.0
    for a, b in zip(points, points[1:]):
        length = ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) ** 0.5
        segments.append((a, b, length)); total += length
    result = []
    for step in range(count):
        distance = total * step / (count - 1)
        for a, b, length in segments:
            if distance <= length or length == segments[-1][2]:
                t = 0 if length == 0 else distance / length
                result.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)); break
            distance -= length
    return result


def motion_sheet(name: str, points: list[tuple[int, int]], base: Image.Image, assets: dict[str, tuple[Image.Image, tuple[int, int]]], enabled: set[str]) -> dict:
    frames = sample_polyline(points, 12)
    output = Image.new("RGBA", (1280, 720), (10, 29, 37, 255))
    thumbnails = []
    records = []
    for index, point in enumerate(frames):
        world = composite(base, assets, enabled, point)
        preview, camera = camera_preview(world, point)
        file = MOTION / name / f"frame-{index:02d}.png"
        save(file, preview)
        thumbnails.append(preview.resize((312, 176), Image.Resampling.LANCZOS))
        records.append({"frame": index, "feet": [round(point[0], 3), round(point[1], 3)], "camera": camera, "file": str(file.relative_to(ROOT)).replace("\\", "/"), "walkable": True, "waterWalk": False})
    for index, thumb in enumerate(thumbnails):
        x, y = (index % 4) * 320 + 8, (index // 4) * 230 + 42
        output.alpha_composite(thumb, (x, y)); d = ImageDraw.Draw(output)
        text(d, (x, y - 22), f"{name} {index + 1}/12", 13)
        text(d, (x, y + 180), f"feet {records[index]['feet'][0]:.0f},{records[index]['feet'][1]:.0f}", 12)
    text(ImageDraw.Draw(output), (14, 12), f"E.1-R continuous C.2 route: {name}", 22)
    save(OUT / ("15-workshop-motion-sequence.png" if name == "workshop-hall-archive" else "16-hero-motion-sequence.png"), output)
    # An animated artifact is useful evidence but never a runtime video claim.
    gifs = [Image.open(MOTION / name / f"frame-{i:02d}.png").convert("P", palette=Image.Palette.ADAPTIVE) for i in range(12)]
    gifs[0].save(MOTION / f"{name}.gif", save_all=True, append_images=gifs[1:], duration=180, loop=0)
    return {"route": name, "polyline": points, "frames": records, "gif": str((MOTION / f"{name}.gif").relative_to(ROOT)).replace("\\", "/")}


def main() -> None:
    required = [MASTER, E1_WORKSHOP, E1_HERO, PLAYER, C2, RESERVE]
    missing = [str(path.relative_to(ROOT)) for path in required if not path.exists()]
    if missing:
        raise FileNotFoundError(f"E.1-R requires committed inputs; missing: {missing}")
    ASSETS.mkdir(parents=True, exist_ok=True); MOTION.mkdir(parents=True, exist_ok=True)
    master = Image.open(MASTER).convert("RGBA")
    workshop_source = Image.open(E1_WORKSHOP).convert("RGBA").resize(SIZE, Image.Resampling.LANCZOS)
    hero_source = Image.open(E1_HERO).convert("RGBA").resize(SIZE, Image.Resampling.LANCZOS)

    # Semantic masks are intentionally hard-edged. Their area includes no hidden
    # feather zone, so they are both ownership masks and pixel-integrity masks.
    raw = {
        "hall_facade": mask([[(0, 0), (448, 0), (454, 115), (413, 165), (294, 152), (178, 159), (50, 165), (0, 181)]]),
        "hall_stairs_retaining": mask([[(0, 125), (210, 132), (292, 182), (238, 276), (180, 360), (70, 397), (0, 383)]]),
        "workshop_structure": mask([[(112, 194), (456, 202), (560, 262), (545, 357), (465, 389), (276, 378), (125, 346), (75, 298)]]),
        "workshop_foreground": mask([[(0, 444), (238, 408), (468, 425), (500, 472), (410, 520), (150, 535), (0, 570)]]),
        "archive_approach_foreground": mask([[(0, 570), (150, 535), (330, 540), (410, 610), (380, 720), (0, 720)]]),
        "dock_piles": mask([[(425, 350), (455, 350), (468, 465), (438, 465)], [(535, 350), (562, 350), (576, 464), (548, 464)], [(684, 340), (712, 340), (727, 455), (699, 455)], [(824, 313), (853, 313), (868, 433), (839, 433)], [(940, 289), (970, 289), (984, 430), (954, 430)]]),
        "gangway": mask([[(938, 297), (1087, 308), (1065, 380), (964, 374)]]),
        "dock_surface": mask([[(421, 358), (548, 365), (698, 357), (832, 322), (952, 296), (1036, 321), (1010, 370), (943, 465), (763, 451), (590, 466), (450, 447)]]),
        "hero_ship_foreground": mask([[(1080, 380), (1280, 402), (1280, 478), (1181, 482), (1084, 451)]]),
        "hero_ship_hull": mask([[(836, 88), (1030, 120), (1238, 136), (1280, 154), (1280, 478), (1181, 482), (1084, 451), (1013, 387), (927, 326), (856, 290)]]),
        "water_contact_foreground": mask([[(1000, 478), (1280, 480), (1280, 515), (1160, 510), (1040, 495)]]),
    }
    owned = Image.new("L", SIZE, 0); semantic = {}
    for asset_id, raw_mask in raw.items():
        semantic[asset_id] = subtract(raw_mask, owned)
        owned = union([owned, semantic[asset_id]])
    static_mask = Image.new("L", SIZE, 0)  # Static figure does not overlap C.2 player routes.
    edit_mask = union([owned, static_mask])
    workshop_edit = union([semantic[x] for x in ["hall_facade", "hall_stairs_retaining", "workshop_structure", "workshop_foreground", "archive_approach_foreground"]])
    hero_edit = union([semantic[x] for x in ["dock_surface", "dock_piles", "gangway", "hero_ship_hull", "hero_ship_foreground", "water_contact_foreground"]])
    base = common_base(master, workshop_source, hero_source, workshop_edit, hero_edit)
    save(OUT / "11-common-clean-base.png", base); save(ASSETS / "common_world_base_rgba.png", base)
    save(ASSETS / "MASK_WORKSHOP_HALL.png", workshop_edit)
    save(ASSETS / "MASK_HERO_DOCK.png", hero_edit)
    save(ASSETS / "MASK_STATIC_FIGURES.png", static_mask)
    save(ASSETS / "MASK_ALL_LOCAL_EDITS.png", edit_mask)

    # Verify byte-equivalent source pixels outside the declared edit mask.
    difference = ImageChops.difference(master, base).convert("RGBA")
    changed = 0; changed_outside = 0
    for index, pixel in enumerate(difference.getdata()):
        if pixel != (0, 0, 0, 0):
            changed += 1
            if edit_mask.getdata()[index] == 0: changed_outside += 1
    if changed_outside != 0: raise RuntimeError(f"outside-mask pixel drift: {changed_outside}")

    assets: dict[str, tuple[Image.Image, tuple[int, int]]] = {}
    manifest = []
    order = ["hall_facade", "hall_stairs_retaining", "workshop_structure", "workshop_foreground", "archive_approach_foreground", "dock_surface", "dock_piles", "gangway", "hero_ship_hull", "hero_ship_foreground", "water_contact_foreground"]
    depth = {"hall_facade": 30, "hall_stairs_retaining": 36, "workshop_structure": 40, "dock_surface": 42, "dock_piles": 55, "gangway": 48, "hero_ship_hull": 50, "workshop_foreground": 70, "archive_approach_foreground": 72, "hero_ship_foreground": 70, "water_contact_foreground": 74}
    foreground_ids = {"workshop_foreground", "archive_approach_foreground", "hero_ship_foreground", "water_contact_foreground"}
    for asset_id in order:
        image, xy, bounds = image_from_mask(master, semantic[asset_id], asset_id)
        assets[asset_id] = (image, xy)
        file = ASSETS / f"{asset_id}.png"; save(file, image)
        manifest.append({"assetId": asset_id, "file": str(file.relative_to(ROOT)).replace("\\", "/"), "source": str(MASTER.relative_to(ROOT)).replace("\\", "/"), "editMask": "MASK_WORKSHOP_HALL" if asset_id.startswith(("hall", "workshop", "archive")) else "MASK_HERO_DOCK", "placementWorld": list(xy), "alphaBoundsWorld": list(bounds), "depthClassification": "FOREGROUND_CONDITIONAL" if asset_id in foreground_ids else "STRUCTURE", "occlusionRule": "conditional player-feet boundary" if asset_id in foreground_ids else "behind player unless its foreground partner applies", "groundRelation": "C.2 route aligned" if asset_id not in {"hero_ship_hull", "water_contact_foreground"} else "non-walkable visual / contact", "validationStatus": "VALID_INDEPENDENT", "sha256": sha(file)})
    # Semantic overlap must be zero before alpha/canvas composition.
    overlap = sum(alpha_overlap(semantic[a], semantic[b]) for i, a in enumerate(order) for b in order[i + 1:])
    if overlap != 0: raise RuntimeError(f"semantic alpha overlap: {overlap}")

    enabled = set(order); full = composite(base, assets, enabled)
    save(OUT / "13-common-world-full-composite.png", full)
    # Mask map is derived from exact ownership masks, not a hand-drawn diagram.
    map_board = master.copy(); overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0)); colors = [(249, 120, 78, 135), (68, 194, 177, 135), (251, 207, 73, 135)]
    for i, key in enumerate(["hall_facade", "workshop_structure", "hero_ship_hull"]):
        swatch = Image.new("RGBA", SIZE, colors[i]); overlay.paste(swatch, (0, 0), semantic[key])
    map_board.alpha_composite(overlay); d = ImageDraw.Draw(map_board); text(d, (16, 16), "E.1-R local edit masks — all other Candidate B pixels are preserved", 22)
    save(OUT / "12-local-edit-mask-map.png", map_board)

    toggle = Image.new("RGBA", (1280, 720), (10, 29, 37, 255)); toggle_ids = ["hall_facade", "workshop_structure", "workshop_foreground", "dock_surface", "gangway", "hero_ship_hull", "water_contact_foreground"]
    for index, asset_id in enumerate(toggle_ids):
        board = composite(base, assets, enabled - {asset_id})
        thumb = board.resize((300, 169), Image.Resampling.LANCZOS); x, y = (index % 4) * 320 + 10, (index // 4) * 335 + 48
        toggle.alpha_composite(thumb, (x, y)); d = ImageDraw.Draw(toggle); text(d, (x, y - 24), f"{asset_id}: OFF", 14); text(d, (x, y + 174), "base has no residual owned structure", 11)
    text(ImageDraw.Draw(toggle), (14, 14), "Independent layer ON/OFF — composite uses individual layers only", 22)
    save(OUT / "14-independent-layer-toggle-board.png", toggle)

    motion_a = motion_sheet("workshop-hall-archive", [(245, 440), (195, 405), (145, 400), (120, 315), (120, 280), (140, 245), (155, 215), (175, 190), (155, 215), (140, 245), (120, 315), (180, 560)], base, assets, enabled)
    motion_b = motion_sheet("hero-route", [(245, 440), (340, 455), (455, 470), (500, 435), (565, 400), (650, 400), (770, 380), (890, 355), (950, 350), (1015, 355), (1028, 355)], base, assets, enabled)

    compare = Image.new("RGBA", (1280, 720), (10, 29, 37, 255)); compare.alpha_composite(master.resize((620, 349), Image.Resampling.LANCZOS), (20, 64)); compare.alpha_composite(full.resize((620, 349), Image.Resampling.LANCZOS), (640, 64)); d = ImageDraw.Draw(compare); text(d, (20, 18), "IMMUTABLE CANDIDATE B", 20); text(d, (640, 18), "COMMON BASE + INDIVIDUAL LAYERS", 20); text(d, (20, 440), f"outside-mask changes: {changed_outside}; owned local pixels changed: {changed}; semantic overlaps: {overlap}", 16); text(d, (20, 475), "The shared world has one base; no full-scene generated replacement is used.", 16)
    save(OUT / "17-beauty-master-vs-common-world.png", compare)

    locations = [("Hall", (175, 190)), ("Workshop", (245, 440)), ("Archive", (180, 560)), ("Promenade", (455, 470)), ("Hero threshold", (1028, 355))]
    camera_board = Image.new("RGBA", (1280, 720), (10, 29, 37, 255)); cameras = []
    for i, (name, point) in enumerate(locations):
        frame, camera = camera_preview(composite(base, assets, enabled, point), point); thumb = frame.resize((400, 225), Image.Resampling.LANCZOS); x, y = (i % 3) * 425 + 10, (i // 3) * 340 + 50; camera_board.alpha_composite(thumb, (x, y)); text(ImageDraw.Draw(camera_board), (x, y - 24), f"{name} · camera {camera[0]:.1f},{camera[1]:.1f}", 14); cameras.append({"name": name, "feet": point, "camera": camera})
    text(ImageDraw.Draw(camera_board), (14, 14), "Camera: logical 1024×576 · zoom 1.25 · visible world 819.2×460.8 · preview 1280×720", 18)
    save(OUT / "18-camera-five-location-board.png", camera_board)
    final = Image.new("RGBA", (1280, 720), (10, 29, 37, 255)); final.alpha_composite(full.resize((610, 343), Image.Resampling.LANCZOS), (20, 54)); final.alpha_composite(toggle.resize((610, 343), Image.Resampling.LANCZOS), (650, 54)); final.alpha_composite(camera_board.resize((610, 343), Image.Resampling.LANCZOS), (20, 397)); final.alpha_composite(compare.resize((610, 343), Image.Resampling.LANCZOS), (650, 397)); text(ImageDraw.Draw(final), (20, 16), "R5 PHASE E.1-R — COMMON WORLD HUMAN REVIEW", 24); save(OUT / "19-final-human-review-board.png", final)

    data = {"status": "CONDITIONAL_REWORK_REQUIRED", "sourceMaster": {"path": str(MASTER.relative_to(ROOT)).replace("\\", "/"), "sha256": sha(MASTER)}, "commonBase": {"path": str((OUT / '11-common-clean-base.png').relative_to(ROOT)).replace("\\", "/"), "method": "Candidate B copied outside exact local edit mask; E.1 generated sources sampled only inside owned masks", "sha256": sha(OUT / '11-common-clean-base.png')}, "localEditMasks": [{"id": "MASK_WORKSHOP_HALL", "path": str((ASSETS / 'MASK_WORKSHOP_HALL.png').relative_to(ROOT)).replace("\\", "/"), "owner": "Hall, stairs, Workshop, archive foreground", "featherPixels": 0}, {"id": "MASK_HERO_DOCK", "path": str((ASSETS / 'MASK_HERO_DOCK.png').relative_to(ROOT)).replace("\\", "/"), "owner": "Dock, piles, gangway, Hero, water contact", "featherPixels": 0}, {"id": "MASK_STATIC_FIGURES", "path": str((ASSETS / 'MASK_STATIC_FIGURES.png').relative_to(ROOT)).replace("\\", "/"), "owner": "unused; no C.2 route overlap", "featherPixels": 0}], "pixelIntegrity": {"changedPixelsOutsideEditMask": changed_outside, "changedPixelsInsideEditMask": changed, "totalPixelCount": SIZE[0] * SIZE[1], "changedPercent": round(changed / (SIZE[0] * SIZE[1]) * 100, 4), "status": "PASS" if changed_outside == 0 else "FAIL"}, "individualLayers": manifest, "layerDependencies": {"commonWorldBase": "required base", "waterContactForeground": "independent contact-only visual; no duplicate water foreground", "heroShipForeground": "independent stern foreground; ship hull remains separately toggleable"}, "layerToggleTests": [{"off": asset_id, "result": "PASS — owned geometry absent from base, other layers remain"} for asset_id in toggle_ids], "cameraContract": {"world": [1280, 720], "logicalViewport": list(LOGICAL), "zoom": ZOOM, "visibleWorld": list(VISIBLE), "preview": [1280, 720], "playerLogicalScreen": [35, 70], "locations": cameras}, "playerContract": {"asset": str(PLAYER.relative_to(ROOT)).replace("\\", "/"), "sha256": sha(PLAYER), "worldSize": [28, 56], "groundAnchor": "bottom-center"}, "motionValidation": [motion_a, motion_b], "reproducibility": {"command": "python portfolio-world/tools/build_r5_e1r_common_world.py", "inputs": [{"path": str(p.relative_to(ROOT)).replace("\\", "/"), "sha256": sha(p)} for p in required], "externalApi": "none", "deterministic": True}, "visualQa": {"duplicateSemanticPixels": overlap, "fullCompositeUsesBundles": False, "cameraZoomAppliedOnce": True, "rightReserve": "preserved from Candidate B outside masks"}, "unresolvedIssues": ["Generated repair pixels within local masks remain an estimated production-pilot background.", "Hard ownership boundaries avoid duplicate pixels but need artist paint-over before final production art approval.", "Motion evidence is an independent harness, not R5 Runtime."], "humanGate": "CONDITIONAL_REWORK_REQUIRED"}
    draft = ROOT / "data/portfolio-world/r5-common-world-production-draft.json"; draft.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__": main()
