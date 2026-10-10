"""Machine checks for the R5 E2.4 Pilot walk assets."""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
PILOT = ROOT / "public/assets/r5-hybrid/pilot-player"
R4 = ROOT / "public/assets/canonical-r4/runtime/player"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def frames(path: Path):
    image = Image.open(path).convert("RGBA")
    assert image.height == 56 and image.width % 28 == 0, f"{path.name}: expected N×28 by 56"
    return [image.crop((i * 28, 0, (i + 1) * 28, 56)) for i in range(image.width // 28)]


def main():
    result = {"assets": {}, "frontBackPreserved": True, "allPass": True}
    expected = {"walk-front-v2.png": 4, "walk-back-v2.png": 4, "walk-side-v2.png": 8}
    for name, count in expected.items():
        cells = frames(PILOT / name)
        assert len(cells) == count, f"{name}: expected {count} frames"
        alpha = [cell.getchannel("A") for cell in cells]
        assert all(mask.getbbox() for mask in alpha), f"{name}: transparent frame"
        contacts = [any(mask.getpixel((x, y)) >= 10 for x in range(28) for y in range(52, 56)) for mask in alpha]
        assert all(contacts), f"{name}: missing y=52..55 foot contact"
        # Each pose must differ from its successor. This rejects repeated images
        # padded out solely to claim an eight-frame animation.
        changes = [ImageChops.difference(cells[i], cells[(i + 1) % count]).getbbox() is not None for i in range(count)]
        assert all(changes), f"{name}: duplicate adjacent pose"
        result["assets"][name] = {"frames": count, "size": Image.open(PILOT / name).size, "contacts": contacts, "adjacentPosesDiffer": changes, "sha256": sha(PILOT / name)}
    for direction in ("front", "back"):
        actual = PILOT / f"walk-{direction}-v2.png"
        original = R4 / f"walk-{direction}.png"
        assert sha(actual) == sha(original), f"{direction}: approved source must remain byte-identical"
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"R5 E2.4 walk asset validation failed: {error}", file=sys.stderr)
        raise
