from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[2]
before = root / "reports/portfolio-world-rebuild/evidence/r3d-architecture/A-hall-overview.png"
after = root / "reports/portfolio-world-rebuild/evidence/r3d1-architecture-integration"
cards = [("R3D failed runtime", before), ("R3D.1 repaired Hall", after / "A-hall-overview.png"), ("R3D.1 repaired Workshop", after / "D-workshop-overview.png")]
canvas = Image.new("RGB", (1440, 360), "#17272c"); draw = ImageDraw.Draw(canvas); font = ImageFont.load_default()
for index, (label, path) in enumerate(cards):
    image = Image.open(path).convert("RGB"); image.thumbnail((456, 300), Image.Resampling.LANCZOS)
    x = 12 + index * 476; draw.text((x, 14), label, fill="white", font=font); canvas.paste(image, (x, 40))
canvas.save(after / "architecture-before-after-contact-sheet.png", "PNG", optimize=True)
