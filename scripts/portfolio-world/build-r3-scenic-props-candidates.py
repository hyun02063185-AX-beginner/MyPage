#!/usr/bin/env python3
"""Normalize R3 Phase-A generated art and assemble static, non-runtime review boards."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "portfolio-world" / "art-source" / "runtime-r3-scenic-props"
SCENIC = ROOT / "portfolio-world" / "public" / "assets" / "canonical-r3" / "candidates" / "scenic"
PROPS = ROOT / "portfolio-world" / "public" / "assets" / "canonical-r3" / "candidates" / "props"
EVIDENCE = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "runtime-r3-scenic-props-candidates"
MANIFEST = ROOT / "data" / "portfolio-world" / "runtime-r3-scenic-props-candidates.json"
R2 = ROOT / "portfolio-world" / "public" / "assets" / "canonical-r2"
CANONICAL = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "gameplay-projection-refinement" / "projection-a-elevated-gameplay.png"
SIZE = (1920, 1080)
FONT = ImageFont.load_default()


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def clean(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    alpha = image.getchannel("A").point(lambda a: 0 if a < 16 else a)
    image.putalpha(alpha)
    return image


def crop_alpha(image: Image.Image) -> Image.Image:
    image = clean(image)
    box = image.getchannel("A").getbbox()
    return image.crop(box) if box else image


def fit(image: Image.Image, dimensions: tuple[int, int]) -> Image.Image:
    image = crop_alpha(image)
    image.thumbnail(dimensions, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", dimensions, (0, 0, 0, 0))
    canvas.alpha_composite(image, ((dimensions[0] - image.width) // 2, dimensions[1] - image.height))
    return canvas


def save(image: Image.Image, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "PNG", optimize=True)


def checker(size: tuple[int, int]) -> Image.Image:
    image = Image.new("RGBA", size, "#6f9199")
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], 32):
        for x in range(0, size[0], 32):
            if (x // 32 + y // 32) % 2 == 0:
                draw.rectangle((x, y, x + 31, y + 31), fill="#83a5ac")
    return image


def label(image: Image.Image, text: str) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    draw.rounded_rectangle((18, 18, 410, 58), radius=8, fill="#153940")
    draw.text((32, 32), text, font=FONT, fill="#fff2d1")
    return result


def scenic_layers() -> dict[str, Image.Image]:
    a = clean(Image.open(SOURCE / "scenic-a-imagegen-source.png"))
    b = clean(Image.open(SOURCE / "scenic-b-imagegen-source.png"))
    output_a = Image.new("RGBA", SIZE, (0, 0, 0, 0)); a.thumbnail((1920, 710), Image.Resampling.LANCZOS); output_a.alpha_composite(a, (0, 0))
    output_b = Image.new("RGBA", SIZE, (0, 0, 0, 0)); b = b.crop((0, 0, b.width, 620)); b.thumbnail((1920, 640), Image.Resampling.LANCZOS); output_b.alpha_composite(b, (0, 0))
    save(output_a, SCENIC / "scenic-a.png"); save(output_b, SCENIC / "scenic-b.png")
    return {"a": output_a, "b": output_b}


def prop_assets() -> dict[str, Image.Image]:
    sheet = clean(Image.open(SOURCE / "prop-family-imagegen-source.png"))
    crops = {
        "lamp": ((0, 0, 205, 475), (128, 192)), "bench": ((155, 130, 655, 425), (185, 75)),
        "flower-planter": ((635, 75, 1110, 445), (132, 92)), "cypress-planter": ((1090, 0, 1270, 470), (88, 164)),
        "urn": ((1245, 100, 1536, 480), (82, 130)), "notice-board": ((155, 405, 485, 750), (108, 140)),
        "crate-stack": ((435, 405, 855, 735), (120, 92)), "barrels": ((850, 450, 1210, 765), (94, 92)),
        "rope-coil": ((1190, 465, 1536, 735), (102, 48)), "bollard": ((0, 710, 300, 1024), (52, 72)),
        "mooring-rope": ((250, 750, 710, 1005), (138, 52)), "handcart": ((690, 720, 1205, 1024), (128, 86)),
        "banner": ((1200, 670, 1536, 1024), (82, 128)),
    }
    result: dict[str, Image.Image] = {}
    for name, (box, dimensions) in crops.items():
        result[name] = fit(sheet.crop(box), dimensions)
        save(result[name], PROPS / f"{name}.png")
    for name in ("a", "b"):
        fountain = fit(Image.open(SOURCE / f"fountain-{name}-imagegen-source.png"), (168, 150))
        result[f"fountain-{name}"] = fountain
        save(fountain, PROPS / f"fountain-{name}.png")
    return result


def foundation_canvas() -> Image.Image:
    canvas = Image.new("RGBA", SIZE, "#395e5b")
    draw = ImageDraw.Draw(canvas)
    draw.polygon([(700, 260), (1920, 215), (1920, 1080), (350, 1080), (430, 770)], fill="#1b95a8")
    draw.polygon([(1130, 405), (1920, 350), (1920, 920), (1370, 905)], fill="#16869a")
    return canvas


def place(canvas: Image.Image, image: Image.Image, x: int, y: int) -> None:
    canvas.alpha_composite(image, (x, y))


def composition(scenic: Image.Image, props: dict[str, Image.Image], layout: str) -> Image.Image:
    canvas = foundation_canvas(); canvas.alpha_composite(scenic)
    master = Image.open(R2 / "candidates/runtime-r24-foundation-master/foundation-master-b.png").convert("RGBA")
    vertical = Image.open(R2 / "candidates/runtime-r24-foundation-master/foundation-master-b-vertical-structure.png").convert("RGBA")
    canvas.alpha_composite(master); vertical.putalpha(vertical.getchannel("A").point(lambda a: int(a * .32))); canvas.alpha_composite(vertical)
    landmarks = [("architecture/hall-b.png",135,0,605,320),("architecture/workshop-c.png",85,520,505,280),("architecture/office-b.png",700,505,280,205),("ships/secondary-b.png",1045,240,275,255),("ships/workboat-a.png",1140,470,140,75),("ships/hero-b.png",1325,115,595,685)]
    for file, x, y, w, h in landmarks:
        layer = Image.open(R2 / file).convert("RGBA").resize((w, h), Image.Resampling.LANCZOS); place(canvas, layer, x, y)
    # Layouts use only visually safe apron/edge positions; no position changes any locked object or route.
    common = [("fountain-b", 500, 360), ("flower-planter", 275, 315), ("cypress-planter", 720, 270), ("lamp", 845, 430), ("notice-board", 970, 560), ("bollard", 1190, 605), ("rope-coil", 1238, 650), ("bollard", 1540, 800)]
    rich = common + [("bench", 425, 492), ("urn", 315, 405), ("crate-stack", 260, 825), ("barrels", 375, 825), ("handcart", 1060, 710), ("banner", 735, 390), ("mooring-rope", 1455, 708), ("flower-planter", 935, 740)]
    restrained = [("fountain-b", 500, 360), ("cypress-planter", 720, 270), ("notice-board", 970, 560), ("bollard", 1190, 605), ("rope-coil", 1238, 650), ("bollard", 1540, 800), ("crate-stack", 260, 825)]
    recommended = [("fountain-b", 500, 360), ("flower-planter", 275, 315), ("cypress-planter", 720, 270), ("lamp", 845, 430), ("notice-board", 970, 560), ("bollard", 1190, 605), ("rope-coil", 1238, 650), ("crate-stack", 260, 825), ("barrels", 375, 825), ("bollard", 1540, 800), ("mooring-rope", 1455, 708)]
    chosen = rich if layout == "a" else restrained if layout == "b" else recommended
    for name, x, y in chosen: place(canvas, props[name], x, y)
    player = Image.open(R2 / "player/player-a.png").convert("RGBA").resize((28, 56), Image.Resampling.LANCZOS); place(canvas, player, 429, 729)
    return canvas


def prop_sheet(props: dict[str, Image.Image]) -> Image.Image:
    names = ["lamp", "bench", "flower-planter", "cypress-planter", "urn", "notice-board", "crate-stack", "barrels", "rope-coil", "bollard", "mooring-rope", "handcart", "banner"]
    board = checker((1280, 720))
    for index, name in enumerate(names):
        x = (index % 5) * 256 + 30; y = (index // 5) * 230 + 48
        board.alpha_composite(props[name], (x + (180 - props[name].width) // 2, y + (145 - props[name].height) // 2))
        ImageDraw.Draw(board).text((x, y + 162), name, font=FONT, fill="#17373d")
    return label(board, "R3 PROP FAMILY — transparent normalized candidates")


def fountains(props: dict[str, Image.Image]) -> Image.Image:
    board = checker((960, 480)); board.alpha_composite(props["fountain-a"], (180, 150)); board.alpha_composite(props["fountain-b"], (620, 150))
    draw = ImageDraw.Draw(board); draw.text((215, 355), "FOUNTAIN A — ornate", font=FONT, fill="#153940"); draw.text((645, 355), "FOUNTAIN B — restrained", font=FONT, fill="#153940")
    return label(board, "FOUNTAIN CANDIDATES — game-scale preview")


def route_board(image: Image.Image) -> Image.Image:
    result = image.copy(); draw = ImageDraw.Draw(result)
    points = {"P1":(443,785),"P2":(710,763),"P3":(1010,628),"P4":(905,688),"P5":(670,453),"P6":(505,318),"P7":(1405,770),"P8":(815,735)}
    routes = [("P1","P2"),("P2","P8"),("P8","P4"),("P4","P5"),("P5","P6"),("P8","P3"),("P3","P7")]
    for left, right in routes: draw.line((points[left], points[right]), fill="#fff4a3", width=4)
    for name, point in points.items(): draw.ellipse((point[0]-8,point[1]-8,point[0]+8,point[1]+8), fill="#fff4a3", outline="#153940", width=2); draw.text((point[0]+10,point[1]-18), name, font=FONT, fill="#ffffff", stroke_width=2, stroke_fill="#153940")
    return label(result, "ROUTE LEGIBILITY — preview-only overlay; no collision change")


def scale_board(props: dict[str, Image.Image]) -> Image.Image:
    board = Image.new("RGBA", (1280, 480), "#315f63"); player = Image.open(R2 / "player/player-a.png").convert("RGBA").resize((56, 112), Image.Resampling.LANCZOS)
    samples = [("PLAYER 56px",player),("BENCH 42px",props["bench"]),("BOLLARD 52px",props["bollard"]),("LAMP 128px",props["lamp"]),("CRATES 92px",props["crate-stack"]),("FOUNTAIN B",props["fountain-b"])]
    for i,(name,image) in enumerate(samples):
        x=30+i*205; board.alpha_composite(image,(x+(145-image.width)//2,300-image.height)); ImageDraw.Draw(board).text((x,335),name,font=FONT,fill="#fff2d1")
    return label(board,"PROP SCALE — player is fixed 28×56 in runtime")


def main() -> None:
    SCENIC.mkdir(parents=True, exist_ok=True); PROPS.mkdir(parents=True, exist_ok=True); EVIDENCE.mkdir(parents=True, exist_ok=True)
    scenery = scenic_layers(); props = prop_assets()
    save(label(checker(SIZE), "SCENIC A — transparent candidate") , EVIDENCE / "01-scenic-a.png")
    a_board = checker(SIZE); a_board.alpha_composite(scenery["a"]); save(label(a_board,"SCENIC A — transparent candidate"), EVIDENCE / "01-scenic-a.png")
    b_board = checker(SIZE); b_board.alpha_composite(scenery["b"]); save(label(b_board,"SCENIC B — transparent candidate"), EVIDENCE / "02-scenic-b.png")
    save(prop_sheet(props), EVIDENCE / "03-prop-family-sheet.png"); save(fountains(props), EVIDENCE / "04-fountain-candidates.png")
    a = composition(scenery["a"], props, "a"); b = composition(scenery["b"], props, "b"); c = composition(scenery["a"], props, "c")
    save(label(a,"COMPOSITION A — Scenic A + rich props"), EVIDENCE / "05-composition-a.png")
    save(label(b,"COMPOSITION B — Scenic B + restrained props"), EVIDENCE / "06-composition-b.png")
    save(label(c,"COMPOSITION C — recommended Scenic A + gameplay-first props"), EVIDENCE / "07-composition-c-recommended.png")
    compare = Image.new("RGBA", (1920,1080), "#214c54"); compare.alpha_composite(label(Image.open(CANONICAL).convert("RGBA").resize((960,540),Image.Resampling.LANCZOS),"CANONICAL PROJECTION A — reference"),(0,0)); compare.alpha_composite(label(a.resize((960,540),Image.Resampling.LANCZOS),"A — rich"),(960,0)); compare.alpha_composite(label(b.resize((960,540),Image.Resampling.LANCZOS),"B — restrained"),(0,540)); compare.alpha_composite(label(c.resize((960,540),Image.Resampling.LANCZOS),"C — recommended"),(960,540)); save(compare,EVIDENCE / "08-canonical-vs-r3-candidates.png")
    save(route_board(c), EVIDENCE / "09-player-route-legibility.png"); save(scale_board(props), EVIDENCE / "10-prop-scale-review.png")
    files = list(SCENIC.glob("*.png")) + list(PROPS.glob("*.png"))
    posix = lambda path: str(path.relative_to(ROOT)).replace("\\", "/")
    manifest = {"schema":"portfolio-world.runtime-r3-scenic-props-candidates.v1","phase":"R3 Phase A — art direction and static composition candidates only","runtimeImported":False,"generationMethod":"ImageGen source studies + deterministic alpha cleanup, crop, scale normalization, and static compositing","dimensions":{"world":[1920,1080],"player":[28,56]},"scenicCandidates":[{"id":"scenic-a","file":posix(SCENIC/'scenic-a.png'),"hash":sha(SCENIC/'scenic-a.png'),"depthIntent":"L0 distant mountains/town/outer sea","collisionIntent":"none","score":{"canonicalAtmosphere":5,"depth":5,"gameplaySubordination":4,"styleMatch":4,"total":18}},{"id":"scenic-b","file":posix(SCENIC/'scenic-b.png'),"hash":sha(SCENIC/'scenic-b.png'),"depthIntent":"L0 distant mountains/town/outer sea","collisionIntent":"none","score":{"canonicalAtmosphere":3,"depth":4,"gameplaySubordination":4,"styleMatch":3,"total":14}}],"fountainCandidates":[{"id":"fountain-a","file":posix(PROPS/'fountain-a.png'),"hash":sha(PROPS/'fountain-a.png'),"scale":"168×150 candidate canvas; display target 120–150px","collisionIntent":"future-small-obstacle","occlusionIntent":"grounded-prop"},{"id":"fountain-b","file":posix(PROPS/'fountain-b.png'),"hash":sha(PROPS/'fountain-b.png'),"scale":"168×150 candidate canvas; display target 110–145px","collisionIntent":"future-small-obstacle","occlusionIntent":"grounded-prop"}],"propFamilies":[{"id":path.stem,"file":posix(path),"hash":sha(path),"collisionIntent":"decorative-no-collision" if path.stem not in {"lamp","bollard","notice-board"} else "future-small-obstacle","occlusionIntent":"foreground-candidate" if path.stem in {"lamp","bollard","flower-planter","cypress-planter"} else "grounded-dressing"} for path in sorted(PROPS.glob('*.png')) if not path.stem.startswith('fountain')],"compositionCandidates":[{"id":"composition-a","scenic":"scenic-a","props":"rich-canonical-inspired","score":{"canonicalConvergence":5,"attractiveness":5,"gameplayReadability":3,"asymmetry":4,"runtimeSuitability":3,"total":20}},{"id":"composition-b","scenic":"scenic-b","props":"restrained-gameplay-first","score":{"canonicalConvergence":3,"attractiveness":3,"gameplayReadability":5,"asymmetry":4,"runtimeSuitability":5,"total":20}},{"id":"composition-c","scenic":"scenic-a","props":"selective-mix","score":{"canonicalConvergence":5,"attractiveness":5,"gameplayReadability":5,"asymmetry":5,"runtimeSuitability":5,"total":25}}],"recommendedComposition":"composition-c","recommendedFountain":"fountain-b","humanSelection":"PENDING","selectionStatus":"PENDING"}
    MANIFEST.write_text(json.dumps(manifest,indent=2)+"\n",encoding="utf-8")


if __name__ == "__main__": main()
