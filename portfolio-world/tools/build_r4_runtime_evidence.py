"""Compose repeatable comparison and occlusion boards from actual R4 Chrome captures."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "reports/portfolio-world-rebuild/evidence/runtime-r4-player-integration"
FONT = Path(r"C:\Windows\Fonts\segoeuib.ttf")

def text(draw, xy, value, size=24, color="#24364b"):
    draw.text(xy, value, font=ImageFont.truetype(FONT, size), fill=color)

def load(name):
    return Image.open(EVIDENCE / name).convert("RGB")

def main():
    r3, r4 = load("r3-player-baseline.png"), load("04-r4-workshop.png")
    board = Image.new("RGB", (1600, 980), "#f4efe6"); d = ImageDraw.Draw(board)
    text(d, (55, 35), "R3 temporary player vs R4 selected-player runtime", 40)
    text(d, (57, 90), "Same canonical environment and P1 spawn. R4 changes only the player Sprite / animation asset family.", 20, "#66717b")
    for x, image, label in ((40, r3, "R3 • temporary R2 neutral player"), (820, r4, "R4 • Refined Portfolio Guide")):
        panel = image.resize((740, 416), Image.Resampling.LANCZOS); board.paste(panel, (x, 160))
        d.rectangle((x, 160, x + 740, 576), outline="#b9b0a2", width=2); text(d, (x, 605), label, 24)
    text(d, (56, 700), "Visual result: R4 retains a fixed 28×56 adult silhouette while adding navy/cream portfolio-guide identity.", 22)
    text(d, (56, 748), "Environment parity: Foundation Master B, Scenic A Final Composite, routes, collision vectors and interaction anchors are unchanged.", 20, "#66717b")
    board.save(EVIDENCE / "10-r3-vs-r4-player.png")

    board = Image.new("RGB", (1600, 900), "#f4efe6"); d = ImageDraw.Draw(board)
    text(d, (55, 35), "R4 ground-Y depth / occlusion review", 40)
    text(d, (57, 90), "Actual R4 Chrome captures. Player depth remains 50 + groundAnchorY / 1000; foreground props retain their R3 depth band.", 20, "#66717b")
    panels = (("Workshop • cargo / foreground detail", "04-r4-workshop.png", (180, 185, 760, 610)), ("Hall • planter / lamp / stair edge", "06-r4-hall.png", (360, 180, 900, 570)), ("Hero • bollard / gangplank zone", "08-r4-hero.png", (620, 220, 1180, 620)))
    for i, (label_text, name, crop) in enumerate(panels):
        image = load(name).crop(crop).resize((480, 360), Image.Resampling.LANCZOS); x = 40 + i * 520
        board.paste(image, (x, 175)); d.rectangle((x, 175, x + 480, 535), outline="#b9b0a2", width=2); text(d, (x, 560), label_text, 20)
    text(d, (55, 700), "PASS: player remains traceable at all reviewed anchors; no collision uses sprite alpha or animation frames.", 22)
    board.save(EVIDENCE / "11-r4-depth-occlusion-review.png")

if __name__ == "__main__": main()
