"""Build the E2.4.1 side idle from the same proportional gait master as v2."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WORLD = Path(__file__).resolve().parents[1]
REPO = WORLD.parent
PLAYER = WORLD / "public/assets/canonical-r4/runtime/player"
PILOT = WORLD / "public/assets/r5-hybrid/pilot-player"
REPORT = REPO / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4-1"
FONT = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def sha(path: Path) -> str: return hashlib.sha256(path.read_bytes()).hexdigest()
def f(size): return ImageFont.truetype(FONT, size)
def text(draw, xy, value, size=20, color="#283a50"): draw.text(xy, value, font=f(size), fill=color)
def frames(path: Path):
    image = Image.open(path).convert("RGBA")
    return [image.crop((i * 28, 0, (i + 1) * 28, 56)) for i in range(image.width // 28)]
def bounds(image: Image.Image):
    box = image.getchannel("A").getbbox()
    return {"left": box[0], "top": box[1], "right": box[2] - 1, "bottom": box[3] - 1, "width": box[2] - box[0], "height": box[3] - box[1]}
def checker(size, tile=16):
    out = Image.new("RGBA", size, "#eeeae1"); draw = ImageDraw.Draw(out)
    for y in range(0, size[1], tile):
        for x in range(0, size[0], tile):
            if (x // tile + y // tile) % 2: draw.rectangle((x, y, x + tile - 1, y + tile - 1), fill="#d7d1c5")
    return out
def card(canvas, x, y, label, image):
    draw = ImageDraw.Draw(canvas); scale = 7
    text(draw, (x, y), label, 22)
    panel = checker((196, 392), 28); panel.alpha_composite(image.resize((196, 392), Image.Resampling.NEAREST)); canvas.alpha_composite(panel, (x, y + 35))
    box = bounds(image); draw.rectangle((x + box["left"] * scale, y + 35 + box["top"] * scale, x + (box["right"] + 1) * scale - 1, y + 35 + (box["bottom"] + 1) * scale - 1), outline="#cf5252", width=2)
    draw.line((x, y + 35 + 55 * scale, x + 196, y + 35 + 55 * scale), fill="#cf5252", width=2)
    text(draw, (x, y + 440), f"{box['width']}×{box['height']} · y {box['top']}–{box['bottom']}", 15, "#5c6875")


def main():
    REPORT.mkdir(parents=True, exist_ok=True)
    walk = frames(PILOT / "walk-side-v2.png")
    # Frame 7 is the recovery/support pose: it preserves the v2 head, jacket,
    # torso, trousers, ground line, and native 28×56 cell while retaining a
    # shoulder/foot envelope close to the front-facing idle.
    # It is selected as a static idle rather than resizing a separate E2.2 body.
    idle = walk[7].copy()
    idle.save(PILOT / "idle-side-v3.png")
    canonical = {"frontIdle": frames(PLAYER / "idle-front.png")[0], "frontWalk": frames(PILOT / "walk-front-v2.png")[1], "backIdle": frames(PLAYER / "idle-back.png")[0], "backWalk": frames(PILOT / "walk-back-v2.png")[1], "sideIdleBefore": frames(PILOT / "side-idle-normalized.png")[0], "sideIdleAfter": idle, "sideWalk": walk[1]}
    board = Image.new("RGBA", (1500, 720), "#f8f4eb")
    draw = ImageDraw.Draw(board); text(draw, (42, 30), "R5 E2.4.1 — Idle / Walk common-body proportion audit", 38)
    text(draw, (44, 82), "Red: opaque silhouette bounds · baseline: y=55. Side v3 idle is an unscaled support pose from the active v2 gait.", 18, "#627181")
    card(board, 45, 140, "FRONT idle", canonical["frontIdle"]); card(board, 285, 140, "FRONT walk", canonical["frontWalk"])
    card(board, 525, 140, "BACK idle", canonical["backIdle"]); card(board, 765, 140, "BACK walk", canonical["backWalk"])
    card(board, 1005, 140, "SIDE idle (E2.2)", canonical["sideIdleBefore"]); card(board, 1245, 140, "SIDE idle v3 / walk support", idle)
    board.convert("RGB").save(REPORT / "11-idle-walk-before-after.png")
    data = {"idleSideV3": {"source": "walk-side-v2.png frame 7", "sha256": sha(PILOT / "idle-side-v3.png"), "size": [28, 56], "bounds": bounds(idle)}, "measurements": {name: bounds(image) for name, image in canonical.items()}}
    (REPORT / "asset-proportion-manifest.json").write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(data, indent=2))


if __name__ == "__main__": main()
