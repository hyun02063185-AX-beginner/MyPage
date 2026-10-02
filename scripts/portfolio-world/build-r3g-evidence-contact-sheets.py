#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "reports" / "portfolio-world-rebuild" / "evidence"
BEFORE = EVIDENCE / "r3f-environment-art-batch-d"
AFTER = EVIDENCE / "r3g-final-look-convergence-pass-1"
FONT = ImageFont.load_default()

def labelled(source, title):
    image = Image.open(source).convert("RGB")
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, image.width, 28), fill=(17, 27, 33))
    draw.text((10, 9), title, fill=(244, 224, 179), font=FONT)
    return image

def make(name, pairs):
    images = [labelled(path, title) for path, title in pairs]
    canvas = Image.new("RGB", (1280, 720 * len(images)), (17, 27, 33))
    for index, image in enumerate(images):
        canvas.paste(image, (0, index * 720))
    canvas.save(AFTER / name, "PNG", optimize=True)

make("r3f-to-r3g-before-after-contact-sheet.png", [(BEFORE / "08-wide-scene-after-batch-d.png", "BEFORE — R3F dressing baseline"), (AFTER / "08-wide-final-look-pass1.png", "AFTER — R3G final-look convergence pass 1")])
make("water-before-after-contact-sheet.png", [(BEFORE / "01-overall-harbor.png", "BEFORE — R3F flat procedural water"), (AFTER / "05-quay-water-contact.png", "AFTER — R3G depth variation, calm shimmer and quay contact")])
