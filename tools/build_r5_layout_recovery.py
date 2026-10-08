"""Build non-runtime R5 layout-recovery Human Gate boards from approved candidate sources."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery"
SRC = OUT / "source"
SIZE = (1280, 720)
FONT = "C:/Windows/Fonts/segoeui.ttf"
BOLD = "C:/Windows/Fonts/segoeuib.ttf"

def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)

def label(draw, xy, text, color):
    x, y = xy
    box = draw.textbbox((x, y), text, font=font(20, True))
    draw.rounded_rectangle((x - 10, y - 7, box[2] + 10, box[3] + 7), radius=8, fill=(15, 31, 42, 225), outline=color, width=3)
    draw.text((x, y), text, font=font(20, True), fill=(255, 255, 255))

def master(name):
    filename = "candidate-b-berth-repair-imagegen-source.png" if name == "b" else "candidate-a-imagegen-source.png"
    source = Image.open(SRC / filename).convert("RGB")
    return source.resize(SIZE, Image.Resampling.LANCZOS)

def navigation(image, kind):
    result = image.convert("RGBA")
    overlay = Image.new("RGBA", result.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    if kind == "a":
        points = {"1  Hall": (285, 163), "2  Workshop": (260, 407), "3  Hero Ship (dock)": (820, 340), "4  Archive wing": (145, 403)}
        route = [(628, 575), (510, 510), (355, 350), (285, 225), (260, 440), (530, 510), (690, 460), (820, 340)]
        branches = [[(260, 440), (145, 403)]]
        water = [(810, 145), (1280, 100), (1280, 720), (840, 720), (890, 590), (830, 470), (900, 380)]
    else:
        points = {"1  Hall": (180, 135), "2  Workshop": (295, 340), "3  Hero Ship (dock)": (845, 365), "4  Archive alcove": (115, 570)}
        route = [(535, 625), (415, 560), (305, 470), (240, 280), (300, 360), (440, 445), (590, 460), (705, 415), (845, 365)]
        branches = [[(330, 465), (170, 540)]]
        water = [(590, 150), (1280, 120), (1280, 720), (820, 720), (750, 600), (660, 470), (600, 420)]
    draw.polygon(water, fill=(44, 185, 215, 42))
    draw.line(route, fill=(255, 220, 86, 240), width=10, joint="curve")
    draw.line(route, fill=(44, 75, 74, 220), width=3, joint="curve")
    for branch in branches:
        draw.line(branch, fill=(255, 220, 86, 240), width=10)
        draw.line(branch, fill=(44, 75, 74, 220), width=3)
    for text, (x, y) in points.items():
        draw.ellipse((x - 12, y - 12, x + 12, y + 12), fill=(255, 220, 86, 255), outline=(26, 45, 54, 255), width=3)
        label(draw, (x + 18, y + 25 if text.startswith("4") and kind == "a" else y - 38), text, (255, 220, 86, 255))
    label(draw, (28, 28), "Navigation Overlay — walkable promenade", (255, 220, 86, 255))
    label(draw, (28, 67), "Blue tint = non-walkable harbor water", (74, 212, 235, 255))
    return Image.alpha_composite(result, overlay).convert("RGB")

def titled_pair(left, right, title_left, title_right):
    board = Image.new("RGB", (2560, 790), (13, 30, 40))
    board.paste(left, (0, 70)); board.paste(right, (1280, 70))
    draw = ImageDraw.Draw(board)
    draw.text((36, 17), title_left, font=font(30, True), fill=(255, 238, 196))
    draw.text((1316, 17), title_right, font=font(30, True), fill=(255, 238, 196))
    return board

def player_scale_board(a, b):
    board = titled_pair(a, b, "A — current 28×56 reference", "B — closer camera / 32×64 exploration")
    player = Image.open(ROOT / "portfolio-world/public/assets/canonical-r4/runtime/player/idle-front.png").convert("RGBA")
    board.paste(player, (630, 570), player)
    larger = player.resize((32, 64), Image.Resampling.NEAREST)
    board.paste(larger, (1810, 625), larger)
    draw = ImageDraw.Draw(board, "RGBA")
    for x, y, text in [(630, 640, "28×56: readable only near foreground"), (1810, 695, "32×64 / closer-camera test")]:
        draw.line((x + 14, y - 65, x + 14, y - 14), fill=(255, 221, 92, 255), width=3)
        label(draw, (x + 26, y - 34), text, (255, 221, 92, 255))
    return board

def ship_board(a, b):
    ac = a.crop((760, 120, 1280, 720)).resize((1000, 650), Image.Resampling.LANCZOS)
    bc = b.crop((760, 130, 1280, 720)).resize((1000, 650), Image.Resampling.LANCZOS)
    board = Image.new("RGB", (2000, 730), (13, 30, 40)); board.paste(ac, (0, 80)); board.paste(bc, (1000, 80))
    draw = ImageDraw.Draw(board, "RGBA")
    draw.text((30, 20), "A — side dock, hull surrounded by water", font=font(28, True), fill=(255, 238, 196))
    draw.text((1030, 20), "B — curved-basin berth, gangway to shore", font=font(28, True), fill=(255, 238, 196))
    for offset, hull, dock in [(0, (655, 375), (470, 395)), (1000, (750, 390), (530, 390))]:
        draw.ellipse((offset + hull[0] - 18, hull[1] - 18, offset + hull[0] + 18, hull[1] + 18), fill=(69, 210, 234, 230))
        draw.line((offset + hull[0] - 20, hull[1] + 22, offset + dock[0], dock[1] + 22), fill=(255, 221, 92, 255), width=5)
        label(draw, (offset + hull[0] - 120, hull[1] - 70), "Hull: WATER", (69, 210, 234, 255))
        label(draw, (offset + dock[0] - 130, dock[1] + 40), "Dock beside hull", (255, 221, 92, 255))
    return board

def fourth_point_board():
    board = Image.new("RGB", SIZE, (20, 42, 53)); draw = ImageDraw.Draw(board)
    draw.text((50, 42), "Fourth visitable point — design alternatives", font=font(38, True), fill=(255, 239, 199))
    cards = [
        ("A", "Workshop-linked\nHarbor Archive", "Attached consultation / records point.\nClear portfolio purpose, zero central\nlandmark pressure."),
        ("B", "Harbor-edge\nOffice", "Peripheral seawall office. Center stays\nopen, but it can feel detached from\nthe core journey."),
        ("C", "Embedded\nContent Point", "Content point inside an existing\nlandmark. Lowest visual cost, weaker\nfirst-time destination read."),
    ]
    for i, (letter, title, body) in enumerate(cards):
        x = 45 + i * 410
        draw.rounded_rectangle((x, 140, x + 370, 620), radius=22, fill=(238, 225, 190), outline=(231, 184, 81), width=4)
        draw.ellipse((x + 30, 175, x + 102, 247), fill=(39, 104, 120))
        draw.text((x + 54, 183), letter, font=font(38, True), fill=(255, 244, 214))
        draw.multiline_text((x + 30, 280), title, font=font(23, True), spacing=5, fill=(27, 54, 65))
        draw.multiline_text((x + 30, 355), body, font=font(18), spacing=8, fill=(40, 64, 70))
        if letter == "A":
            draw.rounded_rectangle((x + 30, 530, x + 238, 575), radius=10, fill=(39, 104, 120))
            draw.text((x + 47, 540), "RECOMMENDED", font=font(19, True), fill=(255, 244, 214))
    draw.text((50, 665), "All options remain CANDIDATE until explicit Human selection; no runtime decision is implied.", font=font(21), fill=(185, 220, 224))
    return board

def gameplay_views(image, kind):
    title = "Candidate A" if kind == "a" else "Candidate B"
    crops = [
        ("Overview", None),
        ("Workshop start", (0, 220, 640, 580)),
        ("Central movement", (300, 250, 1020, 655)),
        ("Hall approach", (0, 0, 720, 405)),
        ("Hero Ship approach", (630, 140, 1280, 505)),
    ]
    board = Image.new("RGB", (1600, 810), (13, 30, 40)); draw = ImageDraw.Draw(board)
    draw.text((36, 18), f"{title} — pre-runtime gameplay camera review", font=font(32, True), fill=(255, 238, 196))
    for i, (name, box) in enumerate(crops):
        view = image if box is None else image.crop(box)
        view = view.resize((512, 288), Image.Resampling.LANCZOS)
        x, y = 32 + (i % 3) * 528, 75 + (i // 3) * 365
        board.paste(view, (x, y + 38)); draw.text((x, y), name, font=font(23, True), fill=(202, 228, 229))
        draw.rectangle((x, y + 38, x + 512, y + 326), outline=(232, 186, 84), width=2)
    draw.text((32, 775), "Concept-camera crop review only — not a Phaser runtime capture or an approval.", font=font(20), fill=(185, 220, 224))
    return board

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    a, b = master("a"), master("b")
    a.save(OUT / "03-layout-candidate-a.png"); b.save(OUT / "04-layout-candidate-b.png")
    titled_pair(a, b, "Candidate A — Three-Landmark Open Harbor", "Candidate B — Organic Coastal Harbor").save(OUT / "05-layout-beauty-comparison.png")
    an, bn = navigation(a, "a"), navigation(b, "b")
    titled_pair(an, bn, "Candidate A — Navigation", "Candidate B — Navigation").save(OUT / "06-navigation-comparison.png")
    player_scale_board(a, b).save(OUT / "07-player-camera-scale-review.png")
    ship_board(a, b).save(OUT / "08-ship-water-berth-review.png")
    fourth_point_board().save(OUT / "09-fourth-visitable-point-options.png")
    gameplay_views(a, "a").save(OUT / "11-candidate-a-gameplay-views.png")
    gameplay_views(b, "b").save(OUT / "12-candidate-b-gameplay-views.png")
    for name in ["03-layout-candidate-a.png", "04-layout-candidate-b.png"]:
        assert Image.open(OUT / name).size == SIZE, name

if __name__ == "__main__": main()
