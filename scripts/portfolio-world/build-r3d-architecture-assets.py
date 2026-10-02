"""Deterministically extract R3D runtime art from the immutable Codyssey PNGs."""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "output" / "codyssey-image-benchmark" / "r3d-environment-art-batch-b"
RUNTIME = ROOT / "portfolio-world-v2" / "public" / "assets" / "world" / "architecture" / "r3d"
EVIDENCE = ROOT / "reports" / "portfolio-world-rebuild" / "evidence" / "r3d-architecture"

def remove_chroma(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            # The request's #ff00ff backdrop is removed analytically. The soft
            # threshold retains limestone, terracotta, blue and gold detail.
            distance = ((r - 255) ** 2 + g ** 2 + (b - 255) ** 2) ** 0.5
            if r > 150 and b > 150 and g < 155:
                alpha = int(max(0, min(255, (distance - 16) * 4)))
                pixels[x, y] = (r, g, b, min(a, alpha))
    box = image.getchannel("A").getbbox()
    if box is None:
        raise RuntimeError("chroma cleanup removed every pixel")
    return image.crop(box)

def scaled(source_name: str, size: tuple[int, int]) -> Image.Image:
    return remove_chroma(Image.open(SOURCE / source_name)).resize(size, Image.Resampling.LANCZOS)

def save(image: Image.Image, name: str) -> None:
    RUNTIME.mkdir(parents=True, exist_ok=True)
    image.save(RUNTIME / name, "PNG", optimize=True)

def contact_sheet(hall_a: Image.Image, hall_b: Image.Image, workshop_a: Image.Image, workshop_b: Image.Image, runtime_hall: Image.Image, runtime_workshop: Image.Image) -> None:
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    cards = [("Hall A", hall_a), ("Hall B", hall_b), ("Selected / runtime Hall", runtime_hall), ("Workshop A", workshop_a), ("Workshop B", workshop_b), ("Selected / runtime Workshop", runtime_workshop)]
    canvas = Image.new("RGBA", (1440, 760), "#17272c")
    draw = ImageDraw.Draw(canvas); font = ImageFont.load_default()
    for index, (label, image) in enumerate(cards):
        col, row = index % 3, index // 3
        x, y = 24 + col * 472, 24 + row * 372
        frame = image.copy(); frame.thumbnail((440, 300), Image.Resampling.LANCZOS)
        backdrop = Image.new("RGBA", (440, 300), "#e8d3aa")
        backdrop.alpha_composite(frame, ((440 - frame.width) // 2, (300 - frame.height) // 2))
        canvas.alpha_composite(backdrop, (x, y + 28)); draw.text((x, y), label, fill="white", font=font)
    canvas.convert("RGB").save(EVIDENCE / "architecture-contact-sheet.png", "PNG", optimize=True)

def main() -> None:
    hall_a = remove_chroma(Image.open(SOURCE / "hall-a.gpt-image-2.original.png"))
    hall_b = remove_chroma(Image.open(SOURCE / "hall-b.gpt-image-2.original.png"))
    workshop_a = remove_chroma(Image.open(SOURCE / "workshop-a.gpt-image-2.original.png"))
    workshop_b = remove_chroma(Image.open(SOURCE / "workshop-b.gpt-image-2.original.png"))
    # R3D.1: collision rectangles are not sprite bounds. Keep the sources at
    # near-native proportions and anchor their bases to the existing land edge.
    # Hall B remains the civic landmark; Workshop A's broad open bay reads more
    # clearly as a practical maker space at the repaired visual scale.
    hall_full = hall_b.resize((470, 260), Image.Resampling.LANCZOS)
    workshop_runtime = workshop_a.resize((205, 300), Image.Resampling.LANCZOS)
    save(hall_full, "exhibition-hall-assembly-r3d1.png")
    save(workshop_runtime, "workshop-shell-r3d1.png")
    contact_sheet(hall_a, hall_b, workshop_a, workshop_b, hall_full, workshop_runtime)

if __name__ == "__main__":
    main()
