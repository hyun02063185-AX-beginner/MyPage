"""Build deterministic, transparent R2.1 foundation and water zone assets.

Each output is a cropped asset with the exact approved polygon silhouette.  This
is deliberately an offline compositor: Phaser receives images only and never
uses a bounding-box TileSprite or a geometry mask for the foundation.
"""
from __future__ import annotations

import json
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
ASSET_ROOT = ROOT / "portfolio-world" / "public" / "assets" / "canonical-r2"
SOURCE = ASSET_ROOT / "environment"
OUT_FOUNDATION = ASSET_ROOT / "foundation"
OUT_WATER = ASSET_ROOT / "water"
OUT_ARCH = ASSET_ROOT / "architecture"
MANIFEST = ASSET_ROOT / "r21-zone-bounds.json"

WALKABLE = {
    "workshop-forecourt": [(185,705),(425,635),(675,690),(725,875),(545,1015),(250,975),(165,855)],
    "lower-plaza": [(505,615),(835,570),(1015,650),(975,880),(755,990),(485,865)],
    "central-quay": [(875,490),(1115,465),(1245,560),(1205,700),(955,705),(850,620)],
    "hero-quay": [(1090,575),(1495,550),(1665,690),(1600,930),(1280,905),(1140,730)],
    "hall-plaza": [(235,250),(735,235),(860,400),(795,555),(430,565),(235,460)],
    "hall-entrance-apron": [(405,115),(600,105),(655,245),(425,285)],
    "hero-gangway-access": [(1340,620),(1455,610),(1525,700),(1420,770),(1325,700)],
    "stair-entry": [(850,610),(995,580),(1020,680),(885,720)],
    "stair-exit": [(790,470),(930,455),(980,555),(845,595)],
    "harbor-office-apron": [(750,700),(925,700),(950,775),(770,790)],
}
WATER = {
    "inner-harbor": [(1010,335),(1245,300),(1475,420),(1435,620),(1240,690),(1130,595)],
    "hero-berth": [(1420,430),(1920,350),(1920,1035),(1615,1005),(1530,845),(1460,710)],
    "secondary-berth": [(1015,220),(1325,235),(1400,440),(1240,520),(1060,445)],
    "workboat-water": [(1130,445),(1395,445),(1430,630),(1210,700),(1100,600)],
    "outer-scenic-water": [(1245,0),(1920,0),(1920,480),(1580,450),(1420,370)],
}
ARCHITECTURE = {
    # The wall has a deliberate stair opening instead of one full rectangular bar.
    "retaining-wall": [[(235,505),(790,505),(790,565),(235,565)], [(975,505),(1085,505),(1085,565),(975,565)]],
    "main-stairs": [[(790,470),(930,455),(980,555),(1020,680),(885,720),(845,595)]],
    "quay-edge-central": [[(1005,334),(1245,300),(1475,420),(1467,435),(1242,316),(1013,349)]],
    "quay-edge-hero": [[(1415,429),(1920,349),(1920,385),(1425,465)]],
}

def bounds(polygons):
    points = [point for polygon in polygons for point in polygon]
    xs, ys = zip(*points)
    return min(xs), min(ys), max(xs), max(ys)

def mask_for(polygons, box):
    x0, y0, x1, y1 = box
    mask = Image.new("L", (x1 - x0 + 1, y1 - y0 + 1), 0)
    draw = ImageDraw.Draw(mask)
    for polygon in polygons:
        draw.polygon([(x - x0, y - y0) for x, y in polygon], fill=255)
    return mask

def tiled(source, size, phase):
    output = Image.new("RGBA", size)
    width, height = source.size
    offset_x, offset_y = phase[0] % width, phase[1] % height
    for y in range(-offset_y, size[1], height):
        for x in range(-offset_x, size[0], width):
            output.alpha_composite(source, (x, y))
    return output

def variation(size, seed, water=False):
    randomizer = random.Random(seed)
    overlay = Image.new("RGBA", size)
    draw = ImageDraw.Draw(overlay)
    count = max(6, (size[0] * size[1]) // 26000)
    for _ in range(count):
        x = randomizer.randrange(-40, max(1, size[0]))
        y = randomizer.randrange(-24, max(1, size[1]))
        width = randomizer.randrange(35, 130)
        height = randomizer.randrange(8, 34)
        if water:
            color = randomizer.choice([(190,244,232,18), (12,92,122,20), (240,255,240,13)])
            draw.arc((x, y, x + width, y + height), 185, 352, fill=color, width=2)
        else:
            color = randomizer.choice([(255,244,213,15), (111,85,54,12), (246,225,183,14)])
            draw.ellipse((x, y, x + width, y + height), fill=color)
    return overlay

def stone_material(quay=False):
    """A non-repeating-looking 512px material with no broad decorative ovals."""
    randomizer = random.Random(81 if quay else 43)
    image = Image.new("RGBA", (512, 256), (191, 173, 135, 255) if quay else (219, 202, 165, 255))
    draw = ImageDraw.Draw(image)
    course = 22 if quay else 17
    palette = ([(211, 194, 155, 255), (197, 177, 137, 255), (222, 204, 165, 255), (187, 167, 128, 255)] if quay
               else [(232, 217, 184, 255), (222, 204, 166, 255), (213, 195, 157, 255), (239, 224, 193, 255)])
    for y in range(-course, 270, course):
        x = -60 + ((y // course) % 2) * (21 if quay else 13)
        while x < 540:
            width = randomizer.randint(42, 77) if quay else randomizer.randint(28, 53)
            color = randomizer.choice(palette)
            draw.polygon([(x + 2, y + 2), (x + width - 2, y), (x + width, y + course - 4), (x, y + course - 2)], fill=color, outline=(122, 104, 76, 85))
            if randomizer.random() < .18:
                draw.line((x + 7, y + course - 5, x + width - 7, y + 4), fill=(126, 106, 79, 34), width=1)
            x += width + 2
    return image

def water_material():
    randomizer = random.Random(62)
    image = Image.new("RGBA", (512, 256))
    draw = ImageDraw.Draw(image)
    for y in range(256):
        blend = y / 255
        draw.line((0, y, 512, y), fill=(24 - int(blend * 5), 154 - int(blend * 25), 177 - int(blend * 19), 255))
    for _ in range(30):
        x, y = randomizer.randrange(-30, 500), randomizer.randrange(5, 248)
        width = randomizer.randrange(24, 68)
        draw.arc((x, y, x + width, y + randomizer.randrange(5, 11)), 188, 348, fill=(177, 228, 220, 88), width=1)
    for _ in range(18):
        x, y = randomizer.randrange(0, 490), randomizer.randrange(0, 250)
        draw.ellipse((x, y, x + randomizer.randrange(10, 28), y + randomizer.randrange(2, 6)), fill=(118, 207, 207, 30))
    return image

def build_zone(name, polygons, material, output_dir, seed, water=False):
    box = bounds(polygons)
    mask = mask_for(polygons, box)
    base = tiled(material, mask.size, box[:2])
    base.alpha_composite(variation(mask.size, seed, water))
    output = Image.new("RGBA", mask.size)
    output.paste(base, (0, 0), mask)
    destination = output_dir / f"{name}.png"
    destination.parent.mkdir(parents=True, exist_ok=True)
    output.save(destination, "PNG", optimize=True)
    alpha = output.getchannel("A")
    assert alpha.getextrema() == (0, 255), f"{name} must retain transparent and opaque pixels"
    return {"file": str(destination.relative_to(ASSET_ROOT)).replace("\\", "/"), "x": box[0], "y": box[1], "width": output.width, "height": output.height}

def main():
    # F1/F2/W1 establish the approved material family. The derived zone material
    # keeps their limestone/turquoise palette while omitting their old broad oval
    # overlays, which became visible when repeated across exact polygon assets.
    paving = stone_material()
    quay = stone_material(quay=True)
    water = water_material()
    # Architecture zones likewise receive opaque material inside their vector
    # silhouette; forcing alpha on the old cutout source tiles created black holes.
    wall = stone_material(quay=True)
    stairs = stone_material()
    edge = stone_material(quay=True)
    zones = {"foundation": {}, "water": {}, "architecture": {}}
    for name, polygon in WALKABLE.items():
        material = quay if name in {"central-quay", "hero-quay", "hero-gangway-access"} else paving
        zones["foundation"][name] = build_zone(name, [polygon], material, OUT_FOUNDATION, 210 + len(name))
    for name, polygon in WATER.items():
        zones["water"][name] = build_zone(name, [polygon], water, OUT_WATER, 610 + len(name), water=True)
    architecture_materials = {"retaining-wall": wall, "main-stairs": stairs, "quay-edge-central": edge, "quay-edge-hero": edge}
    for name, polygons in ARCHITECTURE.items():
        zones["architecture"][name] = build_zone(name, polygons, architecture_materials[name], OUT_ARCH, 910 + len(name))
    MANIFEST.write_text(json.dumps({"schema": "r2.1-zone-assets", "zones": zones}, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
