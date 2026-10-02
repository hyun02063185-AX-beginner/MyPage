#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
E = ROOT / "reports" / "portfolio-world-rebuild" / "evidence"
OUT = E / "r3f-environment-art-batch-d"
FONT = ImageFont.load_default()
def label(im, text):
    d = ImageDraw.Draw(im); d.rectangle((0, 0, im.width, 28), fill=(20, 29, 34)); d.text((10, 9), text, fill=(244, 224, 179), font=FONT)
def sheet(pairs, name):
    images=[]
    for path,title in pairs:
        im=Image.open(path).convert("RGB"); label(im,title); images.append(im)
    canvas=Image.new("RGB", (1280, 720*len(images)), (16,23,27))
    for i,im in enumerate(images): canvas.paste(im,(0,i*720))
    canvas.save(OUT/name,"PNG",optimize=True)
sheet([(E/"r3e-hero-ship"/"07-hall-workshop-ship-wide.png", "BEFORE — R3E.1, no Batch D dressing"),(OUT/"08-wide-scene-after-batch-d.png", "AFTER — R3F selected lived-in working harbor")],"batch-d-before-after-contact-sheet.png")
sheet([(OUT/"study-a-restrained.png", "STUDY A — restrained premium harbor"),(OUT/"study-b-lived-in.png", "STUDY B — lived-in working harbor (selected)")],"batch-d-study-contact-sheet.png")
