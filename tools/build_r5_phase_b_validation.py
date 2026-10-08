"""Build R5 Phase B Human Gate validation boards without changing the Phaser runtime."""
from pathlib import Path
from shutil import copy2
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
R5 = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery"
OUT = R5 / "phase-b"
FONT = "C:/Windows/Fonts/segoeui.ttf"
BOLD = "C:/Windows/Fonts/segoeuib.ttf"

def f(n, bold=False): return ImageFont.truetype(BOLD if bold else FONT, n)

def label(draw, x, y, text, outline=(248, 210, 84, 255)):
    box = draw.textbbox((x, y), text, font=f(19, True))
    draw.rounded_rectangle((x - 8, y - 5, box[2] + 8, box[3] + 5), 8, fill=(10, 30, 40, 230), outline=outline, width=3)
    draw.text((x, y), text, font=f(19, True), fill=(255, 248, 225))

def composite(base, paint): return Image.alpha_composite(base.convert("RGBA"), paint).convert("RGB")

def route_overlay(base, kind):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer, "RGBA")
    routes = (
        {
            "Workshop → Hall": ([(260, 400), (225, 340), (250, 245), (285, 160)], (255, 214, 70, 255)),
            "Workshop → Hero Ship": ([(260, 400), (445, 470), (610, 445), (700, 385), (820, 340)], (70, 222, 222, 255)),
            "Workshop → Archive": ([(260, 400), (145, 405)], (246, 112, 170, 255)),
            "Hall → Hero Ship": ([(285, 160), (250, 245), (445, 470), (610, 445), (700, 385), (820, 340)], (151, 211, 103, 255)),
        } if kind == "a" else {
            "Workshop → Hall": ([(365, 350), (285, 375), (175, 300), (180, 140)], (255, 214, 70, 255)),
            "Workshop → Hero Ship": ([(365, 350), (500, 382), (635, 395), (755, 382), (875, 355)], (70, 222, 222, 255)),
            "Workshop → Archive": ([(365, 350), (250, 430), (135, 510)], (246, 112, 170, 255)),
            "Hall → Hero Ship": ([(180, 140), (175, 300), (365, 350), (500, 382), (635, 395), (755, 382), (875, 355)], (151, 211, 103, 255)),
        }
    )
    for name, (pts, color) in routes.items():
        d.line(pts, fill=(8, 28, 38, 235), width=11, joint="curve")
        d.line(pts, fill=color, width=6, joint="curve")
        x, y = pts[-1]; d.ellipse((x-8, y-8, x+8, y+8), fill=color, outline=(10, 30, 40, 255), width=2)
    # Legend, not a claim of collision geometry.
    for i, (name, (_, color)) in enumerate(routes.items()):
        x = 22 + (i % 2) * 290; y = 22 + (i // 2) * 38
        d.rectangle((x, y + 7, x + 20, y + 27), fill=color); d.text((x + 30, y), name, font=f(17, True), fill=(255, 248, 225))
    return composite(base, layer)

def full_comparison(a, b):
    board = Image.new("RGB", (2560, 800), (12, 29, 39)); d = ImageDraw.Draw(board)
    board.paste(a, (0, 80)); board.paste(b, (1280, 80))
    d.text((32, 23), "Candidate A — Three-Landmark Open Harbor", font=f(30, True), fill=(255, 238, 196))
    d.text((1312, 23), "Candidate B — Organic Coastal Harbor", font=f(30, True), fill=(255, 238, 196))
    return board

def ship_review(b):
    crop = b.crop((650, 120, 1280, 570)).resize((1260, 900), Image.Resampling.LANCZOS)
    board = Image.new("RGB", (1280, 1010), (12, 29, 39)); board.paste(crop, (10, 90)); d = ImageDraw.Draw(board, "RGBA")
    d.text((28, 25), "Candidate B — Hero Ship water / dock verification", font=f(30, True), fill=(255, 238, 196))
    for x, y, text, color in [(780, 550, "Hull surrounded by calm water", (65, 215, 236, 255)), (540, 470, "Side dock; not under hull", (255, 214, 70, 255)), (415, 420, "Shore-connected pier", (151, 211, 103, 255))]:
        d.ellipse((x-12, y-12, x+12, y+12), fill=color, outline=(12, 29, 39, 255), width=3); label(d, x+20, y-42, text, color)
    d.text((28, 965), "Concept-only visual validation: waterline, berth direction, and shore-to-dock continuity read; runtime remains blocked.", font=f(18), fill=(192, 222, 225))
    return board

def fourth_options(b):
    board = Image.new("RGB", (1920, 790), (12, 29, 39)); d = ImageDraw.Draw(board)
    options = [
        ("A — Workshop-linked Archive", (250, 320, 460, 510), (70, 222, 222, 110)),
        ("B — Edge Office", (35, 420, 200, 620), (246, 112, 170, 110)),
        ("C — Existing Structure Interaction", (390, 300, 560, 430), (151, 211, 103, 110)),
    ]
    for i, (title, rect, color) in enumerate(options):
        image = b.copy(); layer = Image.new("RGBA", image.size, (0, 0, 0, 0)); ld = ImageDraw.Draw(layer, "RGBA")
        ld.rounded_rectangle(rect, radius=14, fill=color, outline=color[:3] + (255,), width=5)
        image = composite(image, layer).resize((640, 360), Image.Resampling.LANCZOS)
        x = i * 640; board.paste(image, (x, 100)); d.text((x + 20, 45), title, font=f(22, True), fill=(255, 238, 196))
    d.text((28, 505), "A: connected to Workshop and does not add central mass — recommended pending Human choice.", font=f(21, True), fill=(70, 222, 222))
    d.text((28, 550), "B: peripheral but can detach from the journey.  C: low visual cost but weaker destination read.", font=f(20), fill=(211, 232, 234))
    d.text((28, 710), "All three are placement illustrations on the same Beauty Master; none is a runtime asset or a Human selection.", font=f(19), fill=(192, 222, 225))
    return board

def crop(base, center, extent):
    w, h = extent; x, y = center; left = max(0, min(base.width - w, x - w // 2)); top = max(0, min(base.height - h, y - h // 2))
    return base.crop((left, top, left + w, top + h))

def player_scale_board(b):
    player = Image.open(ROOT / "portfolio-world/public/assets/canonical-r4/runtime/player/idle-front.png").convert("RGBA")
    places = [("Workshop", (365, 350)), ("Central route", (560, 470)), ("Hall plaza", (200, 210)), ("Main stairs", (155, 305)), ("Hero dock", (840, 360))]
    modes = [("A 28×56 / current FOV", (720, 405), (28, 56)), ("B 28×56 / closer camera", (512, 288), (40, 80)), ("C 32×64 / current FOV", (720, 405), (32, 64))]
    board = Image.new("RGB", (2560, 1230), (12, 29, 39)); d = ImageDraw.Draw(board)
    d.text((30, 18), "Candidate B — player / camera comparison (concept camera simulation, not runtime)", font=f(30, True), fill=(255, 238, 196))
    for row, (mode, extent, sprite_size) in enumerate(modes):
        y0 = 72 + row * 380; d.text((24, y0), mode, font=f(22, True), fill=(192, 222, 225))
        for col, (place, centre) in enumerate(places):
            tile = crop(b, centre, extent).resize((480, 270), Image.Resampling.LANCZOS).convert("RGBA")
            sprite = player.resize(sprite_size, Image.Resampling.NEAREST)
            px = 240 - sprite.width // 2; py = 230 - sprite.height
            tile.alpha_composite(sprite, (px, py))
            x = 80 + col * 495; board.paste(tile.convert("RGB"), (x, y0 + 34)); d.rectangle((x, y0 + 34, x + 480, y0 + 304), outline=(231, 184, 81), width=2)
            d.text((x, y0 + 310), place, font=f(18, True), fill=(230, 239, 238))
    d.text((30, 1185), "B changes field of view and on-screen player size together; C changes only the proposed player contract. Both require later Blueprint and runtime QA.", font=f(19), fill=(192, 222, 225))
    return board

def gameplay_comparison(a, b):
    places = [("Workshop", (300, 385)), ("Central movement", (600, 470)), ("Hall approach", (240, 210)), ("Main stairs", (190, 290)), ("Hero Ship", (850, 345))]
    board = Image.new("RGB", (2560, 750), (12, 29, 39)); d = ImageDraw.Draw(board)
    d.text((28, 16), "Pre-runtime gameplay-view comparison — same named viewpoints", font=f(29, True), fill=(255, 238, 196))
    for row, (name, image) in enumerate([("A", a), ("B", b)]):
        y = 70 + row * 330; d.text((12, y + 128), name, font=f(30, True), fill=(255, 238, 196))
        for col, (place, centre) in enumerate(places):
            panel = crop(image, centre, (640, 360)).resize((480, 270), Image.Resampling.LANCZOS)
            x = 55 + col * 500; board.paste(panel, (x, y)); d.rectangle((x, y, x + 480, y + 270), outline=(231, 184, 81), width=2)
            if row == 0: d.text((x, y - 26), place, font=f(18, True), fill=(203, 229, 230))
    d.text((28, 720), "Source: Phase A Beauty Masters. These crops expose composition trade-offs; they are not Phaser captures.", font=f(18), fill=(192, 222, 225))
    return board

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    a = Image.open(R5 / "03-layout-candidate-a.png").convert("RGB")
    b = Image.open(R5 / "04-layout-candidate-b.png").convert("RGB")
    copy2(R5 / "03-layout-candidate-a.png", OUT / "01-candidate-a-original.png")
    copy2(R5 / "04-layout-candidate-b.png", OUT / "02-candidate-b-original.png")
    full_comparison(a, b).save(OUT / "04-full-world-design-comparison.png")
    routes_a, routes_b = route_overlay(a, "a"), route_overlay(b, "b")
    full_comparison(routes_a, routes_b).save(OUT / "05-navigation-routes-review.png")
    ship_review(b).save(OUT / "06-hero-ship-water-dock-review.png")
    fourth_options(b).save(OUT / "07-fourth-point-layout-comparison.png")
    player_scale_board(b).save(OUT / "08-player-camera-scale-comparison.png")
    gameplay_comparison(a, b).save(OUT / "09-gameplay-view-comparison.png")

if __name__ == "__main__": main()
