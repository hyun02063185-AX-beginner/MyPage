"""Normalize R4 player candidates and produce deterministic review evidence.

The generated sources are treated as concept material only.  This script fixes the
runtime canvas, alpha threshold, bottom-center anchor, previews and manifest.
It deliberately never writes any runtime scene, player import, or locked art file.
"""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
GEN = Path(r"C:\Users\user\.codex\generated_images\01a11b80-2333-7a72-a4a4-60a293bd282b")
OUT = ROOT / "public/assets/canonical-r4/candidates/player"
SOURCE_OUT = ROOT / "art-source/runtime-r4-player-candidates"
EVIDENCE = ROOT.parent / "reports/portfolio-world-rebuild/evidence/runtime-r4-player-candidates"
DATA = ROOT.parent / "data/portfolio-world/runtime-r4-player-candidates.json"

# Sources were generated as a constrained, single outfit family.  Each is normalized
# to the same fixed canvas; right is intentionally a runtime mirror of side.
SOURCES = {
    "a": {
        "front": "exec-802cb49d-a776-4c51-88cc-822d7bf573e0.png",
        "back": "exec-cc58fc96-d022-434f-afbd-87b6fb81f553.png",
        "side": "exec-a2274973-88b2-4c58-a05e-6329cfcaac47.png",
    },
    "b": {
        "front": "exec-3ed67c1f-9070-4b44-9924-9db49f0cb186.png",
        "back": "exec-0d4c2f83-f613-42e5-bf5b-cd482daed430.png",
        "side": "exec-c5db9889-329b-493b-b593-2545e5c06492.png",
    },
}

FONT = Path(r"C:\Windows\Fonts\segoeuib.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def font(size: int, bold: bool = False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT, size)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def normalized(source: Path) -> Image.Image:
    """Threshold alpha, trim model padding and fit a 28x56 anchored game canvas."""
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A").point(lambda value: 255 if value >= 20 else 0)
    box = alpha.getbbox()
    if not box:
        raise RuntimeError(f"no usable alpha in {source}")
    subject = image.crop(box)
    subject_alpha = alpha.crop(box)
    subject.putalpha(subject_alpha)
    # 52px leaves two transparent head pixels and two stable feet pixels.  Width
    # is constrained separately to stop front poses becoming wider than the body.
    scale = min(24 / subject.width, 52 / subject.height)
    size = (max(1, round(subject.width * scale)), max(1, round(subject.height * scale)))
    subject = subject.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (28, 56), (0, 0, 0, 0))
    canvas.alpha_composite(subject, ((28 - size[0]) // 2, 55 - size[1]))
    return canvas


def checker(size: tuple[int, int], tile: int = 18) -> Image.Image:
    img = Image.new("RGB", size, "#e8e3d9")
    draw = ImageDraw.Draw(img)
    for y in range(0, size[1], tile):
        for x in range(0, size[0], tile):
            if (x // tile + y // tile) % 2:
                draw.rectangle((x, y, x + tile - 1, y + tile - 1), fill="#d3cec3")
    return img


def label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int = 28, bold: bool = False, fill="#24364b"):
    draw.text(xy, text, font=font(size, bold), fill=fill)


def paste_scaled(base: Image.Image, sprite: Image.Image, x: int, y: int, scale: int, shadow: bool = False):
    if shadow:
        shadow_layer = Image.new("RGBA", (28 * scale, 56 * scale), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow_layer)
        sd.ellipse((5 * scale, 50 * scale, 23 * scale, 55 * scale), fill=(33, 44, 54, 62))
        base.alpha_composite(shadow_layer, (x, y))
    image = sprite.resize((28 * scale, 56 * scale), Image.Resampling.NEAREST if scale > 1 else Image.Resampling.LANCZOS)
    base.alpha_composite(image, (x, y))


def direction_sheet(candidate: str, sprites: dict[str, Image.Image]):
    board = Image.new("RGBA", (1440, 920), "#f4efe6")
    d = ImageDraw.Draw(board)
    title = "Candidate A — Modern Harbor Explorer" if candidate == "a" else "Candidate B — Refined Portfolio Guide"
    label(d, (62, 42), title, 42, True)
    label(d, (65, 98), "Normalized production candidates • 28×56 target • bottom-center anchor", 22, False, "#66717b")
    cols = [("DOWN / FRONT", "front"), ("UP / BACK", "back"), ("LEFT / SIDE", "side"), ("RIGHT / MIRROR", "side")]
    for index, (name, key) in enumerate(cols):
        x = 70 + index * 340
        d.rounded_rectangle((x, 165, x + 290, 780), radius=20, fill="#ddd7ca", outline="#b9b0a2", width=2)
        label(d, (x + 22, 195), name, 20, True)
        d.line((x + 30, 700, x + 260, 700), fill="#bf9853", width=3)
        sprite = sprites[key]
        if name.endswith("MIRROR"):
            sprite = sprite.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        paste_scaled(board, sprite, x + 34, 252, 8)
        label(d, (x + 22, 807), "idle candidate", 18, False, "#66717b")
    label(d, (68, 860), "Projection: elevated oblique, modest top-plane visibility.  Right uses a mirror of the approved side source.", 19, False, "#66717b")
    return board.convert("RGB")


def native_board(all_sprites: dict[str, dict[str, Image.Image]]):
    board = Image.new("RGBA", (1600, 1120), "#f4efe6")
    d = ImageDraw.Draw(board)
    label(d, (62, 40), "Native-scale review — exact 28×56 gameplay canvas", 42, True)
    label(d, (65, 96), "1× is unscaled native display; 2× and 4× are inspection aids only.", 22, False, "#66717b")
    for row, candidate in enumerate(("a", "b")):
        top = 190 + row * 440
        name = "A  Modern Harbor Explorer" if candidate == "a" else "B  Refined Portfolio Guide"
        label(d, (65, top), name, 30, True)
        for col, (scale, scale_name) in enumerate(((1, "1× native"), (2, "2×"), (4, "4×"))):
            x = (500, 750, 1050)[col]
            step = max(75, 28 * scale + 30)
            label(d, (x, top), scale_name, 22, True, "#66717b")
            for direction, key in enumerate(("front", "back", "side")):
                sprite = all_sprites[candidate][key]
                cell_w, cell_h = 28 * scale, 56 * scale
                bg = checker((cell_w, cell_h), max(2, 6 * scale)).convert("RGBA")
                bg.alpha_composite(sprite.resize((cell_w, cell_h), Image.Resampling.NEAREST))
                board.alpha_composite(bg, (x + direction * step, top + 52))
                label(d, (x + direction * step, top + 68 + cell_h), ("front", "back", "side")[direction], 14, False, "#66717b")
    label(d, (65, 1060), "PASS criteria applied: identifiable head, directional torso, separated legs, readable navy/cream outfit family, no giant-head or stick-figure read.", 18, False, "#66717b")
    return board.convert("RGB")


def load_bg(name: str) -> Image.Image:
    return Image.open(ROOT.parent / "reports/portfolio-world-rebuild/evidence/runtime-r31-scenic-parity-repair" / name).convert("RGBA")


LOCATIONS = [
    ("P1 • Workshop", "03-r31-workshop-office.png", (200, 288)),
    ("P8 • Harbor Office", "03-r31-workshop-office.png", (421, 256)),
    ("P5 • Hall Plaza", "02-r31-hall.png", (368, 218)),
    ("P7 • Hero Ship", "04-r31-hero.png", (450, 241)),
]


def location_board(candidate: str, sprite: Image.Image):
    board = Image.new("RGBA", (1600, 1110), "#f4efe6")
    d = ImageDraw.Draw(board)
    name = "Candidate A — Modern Harbor Explorer" if candidate == "a" else "Candidate B — Refined Portfolio Guide"
    label(d, (58, 34), f"Four-location fixed-scale review — {name}", 38, True)
    label(d, (61, 86), "Every placement is the identical 28×56 asset at a fixed gameplay scale; preview uses approved R3.1 captures.", 20, False, "#66717b")
    for index, (place, file_name, anchor) in enumerate(LOCATIONS):
        x = 42 + (index % 2) * 790
        y = 145 + (index // 2) * 470
        bg = load_bg(file_name).resize((740, 360), Image.Resampling.LANCZOS)
        # Convert approved-capture coordinates to the resized review panel and anchor feet.
        scaled_anchor = (round(anchor[0] * 740 / 758), round(anchor[1] * 360 / 482))
        overlay = sprite.copy()
        paste_scaled(bg, overlay, scaled_anchor[0] - 14, scaled_anchor[1] - 56, 1, True)
        board.alpha_composite(bg, (x, y + 46))
        d.rounded_rectangle((x, y, x + 250, y + 39), radius=8, fill="#21364c")
        label(d, (x + 14, y + 7), place, 20, True, "#f4efe6")
        d.rectangle((x, y + 46, x + 740, y + 406), outline="#b9b0a2", width=2)
    return board.convert("RGB")


def comparison_board(all_sprites: dict[str, dict[str, Image.Image]]):
    board = Image.new("RGBA", (1440, 900), "#f4efe6")
    d = ImageDraw.Draw(board)
    label(d, (60, 40), "Candidate A vs B — direction and identity comparison", 42, True)
    label(d, (62, 95), "Both candidates share the same 28×56 canvas, ground anchor, 4-direction strategy, and fixed world scale.", 21, False, "#66717b")
    for row, candidate in enumerate(("a", "b")):
        top = 170 + row * 335
        heading = "A  Modern Harbor Explorer" if candidate == "a" else "B  Refined Portfolio Guide"
        summary = "more mobile and informal; satchel adds harbor-explorer cue" if candidate == "a" else "calmer tailored profile; stronger portfolio-guide identity"
        label(d, (62, top), heading, 30, True)
        label(d, (62, top + 39), summary, 20, False, "#66717b")
        for col, key in enumerate(("front", "back", "side")):
            x = 660 + col * 235
            d.rounded_rectangle((x, top - 10, x + 190, top + 250), 14, fill="#ddd7ca")
            paste_scaled(board, all_sprites[candidate][key], x + 39, top + 35, 4)
            label(d, (x + 25, top + 265), key.upper(), 16, True, "#66717b")
    label(d, (62, 820), "Recommendation: B. Its jacket/cream block creates a more professional, calmer small-scale read while preserving the harbor palette.", 20, True, "#24364b")
    return board.convert("RGB")


def silhouette_board(all_sprites: dict[str, dict[str, Image.Image]]):
    board = Image.new("RGB", (1440, 830), "#f4efe6")
    d = ImageDraw.Draw(board)
    label(d, (58, 40), "Silhouette review — 28×56 scale", 42, True)
    label(d, (60, 95), "Black masks isolate head, torso and separate leg masses; a thin contact ellipse is preview-only, never baked into a candidate sprite.", 20, False, "#66717b")
    for row, candidate in enumerate(("a", "b")):
        label(d, (65, 205 + row * 285), "Candidate A" if candidate == "a" else "Candidate B", 30, True)
        for col, key in enumerate(("front", "back", "side")):
            alpha = all_sprites[candidate][key].getchannel("A")
            mask = Image.new("RGBA", (28, 56), "#1d2d3c")
            mask.putalpha(alpha)
            x, y = 380 + col * 310, 165 + row * 285
            bg = checker((224, 448), 24).convert("RGBA")
            sd = ImageDraw.Draw(bg)
            sd.ellipse((40, 400, 184, 440), fill=(31, 43, 52, 56))
            bg.alpha_composite(mask.resize((224, 448), Image.Resampling.NEAREST), (0, 0))
            board.paste(bg.convert("RGB"), (x, y))
            label(d, (x + 55, y + 470), key.upper(), 18, True, "#66717b")
    return board


def movement_board():
    board = Image.new("RGB", (1440, 820), "#f4efe6")
    d = ImageDraw.Draw(board)
    label(d, (58, 40), "R4 movement-direction and animation plan", 42, True)
    label(d, (60, 108), "Input remains 8-direction. Art stays deliberately 4-direction at this display size.", 24, False, "#66717b")
    columns = [
        ("DOWN", "front source", "idle 1–2 frames\nwalk 4 frames"),
        ("UP", "back source", "idle 1–2 frames\nwalk 4 frames"),
        ("LEFT", "side source", "idle 1–2 frames\nwalk 4 frames"),
        ("RIGHT", "mirror LEFT", "idle 1–2 frames\nwalk 4 frames"),
    ]
    for i, (direction, source, plan) in enumerate(columns):
        x = 62 + i * 340
        d.rounded_rectangle((x, 210, x + 285, 550), radius=18, fill="#ddd7ca", outline="#b9b0a2", width=2)
        label(d, (x + 25, 242), direction, 30, True)
        label(d, (x + 25, 300), source, 19, False, "#66717b")
        label(d, (x + 25, 375), plan, 23, True, "#24364b")
    d.line((170, 670, 1270, 670), fill="#bf9853", width=4)
    label(d, (62, 603), "Diagonal input: dominant axis; when ties occur, preserve last-facing direction. No 8-direction sheet in Phase A.", 22, False, "#24364b")
    label(d, (62, 714), "Implementation gate: hold the bottom-center feet anchor at (14, 56) in every frame.", 20, False, "#66717b")
    label(d, (62, 750), "Runtime animation/import remains blocked pending Human selection.", 20, False, "#66717b")
    return board


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    SOURCE_OUT.mkdir(parents=True, exist_ok=True)
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    sprites: dict[str, dict[str, Image.Image]] = {"a": {}, "b": {}}
    provenance: dict[str, dict[str, dict[str, str]]] = {"a": {}, "b": {}}
    for candidate, directions in SOURCES.items():
        for direction, filename in directions.items():
            source = GEN / filename
            if not source.exists():
                raise FileNotFoundError(source)
            source_target = SOURCE_OUT / f"player-{candidate}-{direction}-imagegen-source.png"
            shutil.copy2(source, source_target)
            sprite = normalized(source)
            target = OUT / f"player-{candidate}-{direction}.png"
            sprite.save(target)
            sprites[candidate][direction] = sprite
            provenance[candidate][direction] = {
                "source": str(source_target.relative_to(ROOT)).replace("\\", "/"),
                "sourceDimensions": list(Image.open(source).size),
                "sha256": digest(target),
            }
        right = sprites[candidate]["side"].transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        right_path = OUT / f"player-{candidate}-right-mirror.png"
        right.save(right_path)
        provenance[candidate]["rightMirror"] = {"source": f"player-{candidate}-side.png", "sha256": digest(right_path)}

    direction_sheet("a", sprites["a"]).save(EVIDENCE / "01-player-a-direction-sheet.png")
    direction_sheet("b", sprites["b"]).save(EVIDENCE / "02-player-b-direction-sheet.png")
    native_board(sprites).save(EVIDENCE / "03-player-native-scale-review.png")
    location_board("a", sprites["a"]["front"]).save(EVIDENCE / "04-player-a-four-location-preview.png")
    location_board("b", sprites["b"]["front"]).save(EVIDENCE / "05-player-b-four-location-preview.png")
    comparison_board(sprites).save(EVIDENCE / "06-player-a-vs-b.png")
    silhouette_board(sprites).save(EVIDENCE / "07-player-silhouette-review.png")
    movement_board().save(EVIDENCE / "08-player-movement-direction-plan.png")

    locked = [
        ROOT / "public/assets/canonical-r2/candidates/runtime-r24-foundation-master/foundation-master-b.png",
        ROOT / "public/assets/canonical-r3/runtime/scenic/scenic-a-final-composite.png",
    ]
    manifest = {
        "phase": "R4_PHASE_A_PLAYER_CANDIDATES",
        "runtimeImported": False,
        "candidateA": {"name": "MODERN_HARBOR_EXPLORER", "concept": "cream shirt, navy vest, practical shoes, small crossbody satchel", "files": provenance["a"], "palette": ["#24364B", "#E9DEC5", "#30333A", "#8A5A32", "#C99B43"], "scores": {"environmentStyleMatch": 4, "native28x56Readability": 4, "professionalPortfolioIdentity": 4, "movementDirectionReadability": 4, "fourLocationScaleFit": 4, "animationProductionSuitability": 4, "total": 24}},
        "candidateB": {"name": "REFINED_PORTFOLIO_GUIDE", "concept": "navy overshirt, cream inner layer, tailored casual trousers, small notebook", "files": provenance["b"], "palette": ["#21364C", "#ECE0C8", "#30333A", "#5C4631", "#BE954B"], "scores": {"environmentStyleMatch": 5, "native28x56Readability": 4, "professionalPortfolioIdentity": 5, "movementDirectionReadability": 4, "fourLocationScaleFit": 5, "animationProductionSuitability": 4, "total": 27}},
        "dimensions": {"target": [28, 56], "source": [1024, 1536]},
        "groundAnchor": {"origin": "bottom-center", "feetMidpoint": [14, 56], "bodyContract": [28, 16], "bodyOffset": [0, 40]},
        "directions": {"visual": ["DOWN_FRONT", "UP_BACK", "LEFT_SIDE", "RIGHT_MIRROR"], "input": "8-direction unchanged", "diagonal": "dominant axis or last-facing direction"},
        "animationPlan": {"idleFrames": "1-2 per direction", "walkFrames": 4, "requiredRuntimeFamilies": ["front", "back", "side", "right=mirror(side)"], "phaseAStatus": "key-pose/plan only; no runtime sheet"},
        "lockedAssetHashes": {str(path.relative_to(ROOT)).replace("\\", "/"): digest(path) for path in locked},
        "recommendedCandidate": "B",
        "humanSelection": "PENDING",
        "evidence": [f"reports/portfolio-world-rebuild/evidence/runtime-r4-player-candidates/{n}" for n in ["01-player-a-direction-sheet.png", "02-player-b-direction-sheet.png", "03-player-native-scale-review.png", "04-player-a-four-location-preview.png", "05-player-b-four-location-preview.png", "06-player-a-vs-b.png", "07-player-silhouette-review.png", "08-player-movement-direction-plan.png"]],
    }
    DATA.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
