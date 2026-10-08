"""Render R5 Phase C draft spatial-feasibility boards from declared JSON geometry only."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data/portfolio-world/r5-spatial-blueprint-draft.json"
OUT = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-c"
FONT = "C:/Windows/Fonts/segoeui.ttf"
BOLD = "C:/Windows/Fonts/segoeuib.ttf"
BG = (10, 27, 37)
INK = (238, 245, 239)
MUTED = (186, 213, 214)
GOLD = (243, 194, 74)
CYAN = (65, 219, 229)
PINK = (244, 108, 164)
GREEN = (131, 214, 115)
ORANGE = (244, 146, 58)
RED = (228, 91, 91)

def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)

def data():
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))

def base(bp):
    return Image.open(ROOT / bp["referenceMaster"]["path"]).convert("RGB")

def overlay(image):
    return Image.new("RGBA", image.size, (0, 0, 0, 0))

def merge(image, layer):
    return Image.alpha_composite(image.convert("RGBA"), layer).convert("RGB")

def text_box(draw, xy, text, color=GOLD, size=18):
    x, y = xy
    bounds = draw.textbbox((x, y), text, font=font(size, True))
    draw.rounded_rectangle((x - 6, y - 4, bounds[2] + 6, bounds[3] + 4), 6,
                           fill=(8, 25, 34, 232), outline=color + (255,), width=2)
    draw.text((x, y), text, font=font(size, True), fill=INK)

def header(board, title, subtitle):
    d = ImageDraw.Draw(board)
    d.text((28, 19), title, font=font(30, True), fill=(255, 234, 190))
    d.text((30, 57), subtitle, font=font(17), fill=MUTED)
    return d

def legend(draw, items, origin=(25, 25), columns=2):
    x0, y0 = origin
    for idx, (name, colour) in enumerate(items):
        col, row = idx % columns, idx // columns
        x, y = x0 + col * 260, y0 + row * 29
        draw.rounded_rectangle((x, y + 4, x + 18, y + 22), 3, fill=colour)
        draw.text((x + 27, y), name, font=font(15, True), fill=INK)

def zones_by_id(bp, key):
    return {z["id"]: z for z in bp[key]}

def draw_zones(image, bp, title, subtitle, include_blocked=True):
    layer = overlay(image); d = ImageDraw.Draw(layer, "RGBA")
    walk_colours = {"GROUND": (GREEN, 108), "STAIR": (GOLD, 125), "PIER": (ORANGE, 138),
                    "DOCK": (CYAN, 125), "GANGWAY": ((244, 239, 211), 175)}
    for z in bp["walkableZones"]:
        colour, alpha = walk_colours[z["kind"]]
        d.polygon(z["polygon"], fill=colour + (alpha,), outline=colour + (255,), width=3)
    if include_blocked:
        for z in bp["blockedZones"]:
            if z["id"] == "B_SEA":
                d.polygon(z["polygon"], fill=(35, 87, 135, 74), outline=(91, 174, 211, 170), width=2)
            else:
                d.polygon(z["polygon"], fill=RED + (65,), outline=RED + (170,), width=2)
    result = merge(image, layer)
    board = Image.new("RGB", (1280, 830), BG); board.paste(result, (0, 95)); d2 = header(board, title, subtitle)
    legend(d2, [("ground", GREEN), ("stairs", GOLD), ("pier", ORANGE), ("dock", CYAN),
                ("gangway", (244,239,211)), ("blocked building/cliff", RED), ("blocked sea", (91,174,211))], (28, 98), 4)
    return board

def route_board(bp):
    image = base(bp); layer = overlay(image); d = ImageDraw.Draw(layer, "RGBA")
    node = {n["id"]: n for n in bp["navigationNodes"]}
    colours = {"GROUND": GREEN, "STAIR": GOLD, "PIER": ORANGE, "GANGWAY": CYAN}
    for e in bp["navigationEdges"]:
        pts = [tuple(p) for p in e["polyline"]]; colour = colours[e["type"]]
        d.line(pts, fill=(4, 18, 25, 235), width=12, joint="curve")
        d.line(pts, fill=colour + (255,), width=6, joint="curve")
    for n in bp["navigationNodes"]:
        x, y = n["point"]; d.ellipse((x-9,y-9,x+9,y+9), fill=(8,24,31,255), outline=(255,250,225,255), width=3)
        d.ellipse((x-3,y-3,x+3,y+3), fill=CYAN + (255,))
        text_box(d, (x+13, y-28), n["id"].replace("N_", ""), CYAN, 15)
    result = merge(image, layer)
    board = Image.new("RGB", (1280, 820), BG); board.paste(result, (0, 110)); d2 = header(board, "R5 Phase C — Draft navigation graph", "Edges are declared polylines in the DRAFT coordinate contract; diagram is not a collision export.")
    legend(d2, [("ground", GREEN), ("stair", GOLD), ("pier", ORANGE), ("gangway / ship threshold", CYAN)], (28, 92), 4)
    return board

def elevation_board(bp):
    image = base(bp); layer = overlay(image); d = ImageDraw.Draw(layer, "RGBA")
    colours = {"L0": CYAN, "L1": GREEN, "L2": GOLD, "L0_TO_L2": PINK, "L0_TO_SHIP": (245,239,210)}
    for z in bp["walkableZones"]:
        c = colours[z["elevation"]]
        d.polygon(z["polygon"], fill=c + (105,), outline=c + (255,), width=3)
        xs = [p[0] for p in z["polygon"]]; ys = [p[1] for p in z["polygon"]]
        text_box(d, ((min(xs)+max(xs))//2-28, (min(ys)+max(ys))//2-11), z["elevation"], c, 16)
    for s in bp["stairConnectors"]:
        a = next(n for n in bp["navigationNodes"] if n["id"] == s["from"])["point"]
        b = next(n for n in bp["navigationNodes"] if n["id"] == s["to"])["point"]
        d.line([a,b], fill=(8,24,31,245), width=11); d.line([a,b], fill=PINK + (255,), width=5)
        text_box(d, (a[0]+14,a[1]+13), s["id"] + " ↑", PINK, 15)
    result = merge(image, layer)
    board = Image.new("RGB", (1280, 820), BG); board.paste(result, (0, 110)); d2 = header(board, "R5 Phase C — Draft elevation and stairs", "L0/L1/L2 are relative design levels. Ship deck interior remains explicitly UNRESOLVED.")
    legend(d2, [("L0 harbor", CYAN), ("L1 approaches", GREEN), ("L2 Hall terrace", GOLD), ("vertical connection", PINK), ("boarding threshold", (245,239,210))], (28,92), 5)
    return board

def width_board(bp):
    image = base(bp); layer = overlay(image); d = ImageDraw.Draw(layer, "RGBA")
    placements = [("W_HALL_STAIRS", (211,260), (178,224)), ("W_WORKSHOP_HALL", (230,355), (260,375)),
                  ("W_LOWER_PROMENADE", (465,455), (465,500)), ("W_SHORE_PIER", (650,395), (650,420)),
                  ("W_SIDE_DOCK", (905,320), (905,390)), ("W_GANGWAY", (1024,342), (1024,375)),
                  ("W_ARCHIVE_SPUR", (180,467), (180,515))]
    check = {x["id"]: x for x in bp["widthChecks"]}
    for ident, a, b in placements:
        item = check[ident]; c = GREEN if item["width"] >= 64 else GOLD
        d.line([a,b], fill=(7,20,28,255), width=8); d.line([a,b], fill=c + (255,), width=4)
        for x,y in (a,b): d.line([(x-7,y),(x+7,y)], fill=c+(255,), width=3)
        text_box(d, (a[0]+10,a[1]-23), f"{item['width']}u", c, 15)
    result = merge(image, layer)
    board = Image.new("RGB", (1280, 845), BG); board.paste(result, (0, 115)); d2 = header(board, "R5 Phase C — Draft path widths and bottlenecks", "Minimum: 42u (28×56) / 48u (32×64). Gold is pass-minimum but below the 64u recommended width.")
    legend(d2, [("≥ 64u recommended", GREEN), ("48–63u: pass minimum / Human review", GOLD)], (28,94), 2)
    d2.text((28, 805), "Bottlenecks: Workshop–Hall 62u; Archive approach 54u; Hero gangway 54u. No declared route is below 48u.", font=font(17, True), fill=(255,232,184))
    return board

def berth_board(bp):
    image = base(bp); layer = overlay(image); d = ImageDraw.Draw(layer, "RGBA")
    node = {n["id"]: n["point"] for n in bp["navigationNodes"]}
    route = [node[x] for x in bp["heroShipBerth"]["sequence"]]
    d.line(route, fill=(5,19,26,245), width=14, joint="curve"); d.line(route, fill=CYAN+(255,), width=7, joint="curve")
    labels = [("1 PROMENADE", node["N_PROMENADE"]), ("2 PIER ENTRY", node["N_PIER_ENTRY"]), ("3 SIDE DOCK", node["N_SIDE_DOCK"]), ("4 GANGWAY", node["N_GANGWAY"]), ("5 HERO THRESHOLD", node["N_HERO"])]
    label_positions = [(425, 428), (480, 366), (898, 306), (940, 260), (1080, 495)]
    for i,(name,p) in enumerate(labels):
        d.ellipse((p[0]-10,p[1]-10,p[0]+10,p[1]+10), fill=CYAN+(255,), outline=(7,22,29,255), width=3)
        text_box(d, label_positions[i], name, CYAN, 14)
    hull = zones_by_id(bp,"blockedZones")["B_HERO_HULL"]["polygon"]
    d.polygon(hull, fill=RED+(48,), outline=RED+(220,), width=3)
    result = merge(image, layer)
    board = Image.new("RGB", (1280, 830), BG); board.paste(result, (0, 105)); d2 = header(board, "R5 Phase C — Hero Ship berth and boarding access", "Explicit chain: promenade → shore pier → side dock → gangway → ship-side visit threshold. Deck interior is not inferred.")
    legend(d2, [("declared access route", CYAN), ("blocked hull", RED), ("water remains blocked except named bridges", (91,174,211))], (28,89), 3)
    return board

def player_overlay(image, player, point, visual_size, label_text):
    layer = overlay(image); d = ImageDraw.Draw(layer, "RGBA")
    x,y = point; d.ellipse((x-8,y-8,x+8,y+8), fill=GOLD+(255,), outline=(8,23,30,255), width=2)
    spr = player.resize(tuple(visual_size), Image.Resampling.NEAREST)
    layer.alpha_composite(spr, (x-spr.width//2, y-spr.height))
    text_box(d, (x+13,y+13), label_text, GOLD, 14)
    return merge(image, layer)

def ground_contact_board(bp):
    original = base(bp); player = Image.open(ROOT / "portfolio-world/public/assets/canonical-r4/runtime/player/idle-front.png").convert("RGBA")
    board = Image.new("RGB", (2560, 870), BG); d = header(board, "R5 Phase C — Player ground-contact review", "All markers are feet anchors from declared geometry. Hero position is on G_SIDE_DOCK, not on the sea or under the ship.")
    for i, spot in enumerate(bp["groundContactReview"]):
        tile = player_overlay(original, player, spot["feetAnchor"], (28,56), spot["place"]).crop((max(0,spot["feetAnchor"][0]-300), max(0,spot["feetAnchor"][1]-180), min(1280,spot["feetAnchor"][0]+300), min(720,spot["feetAnchor"][1]+180))).resize((500,300), Image.Resampling.LANCZOS)
        x = 20 + i*508; board.paste(tile, (x,120)); d.rectangle((x,120,x+500,420), outline=GOLD, width=2)
        d.text((x,442), spot["place"], font=font(20,True), fill=INK)
        d.text((x,473), spot["zone"], font=font(16,True), fill=CYAN)
        d.text((x,500), spot["status"].replace("_", " "), font=font(14), fill=MUTED)
    d.text((28, 820), "This is a coordinate-overlay check, not a Phaser render. Final collision must be authored after Human spatial approval.", font=font(18), fill=MUTED)
    return board

def crop_for_camera(image, center, size):
    w,h=size; x,y=center; left=max(0,min(image.width-w,x-w//2)); top=max(0,min(image.height-h,y-h//2)); return image.crop((left,top,left+w,top+h)), (left,top)

def camera_board(bp):
    image = base(bp); player=Image.open(ROOT / "portfolio-world/public/assets/canonical-r4/runtime/player/idle-front.png").convert("RGBA")
    modes=[("28×56 current",(720,405),(28,56)),("28×56 closer",(576,324),(28,56)),("32×64 current",(720,405),(32,64))]
    board=Image.new("RGB",(2560,1210),BG); d=header(board,"R5 Phase C — Camera and player-scale comparison","Same feet anchors; closer camera reduces visible world to 1024×576 at full canvas. This is a crop simulation, not runtime approval.")
    for row,(name,extent,sprite_size) in enumerate(modes):
        y=105+row*345; d.text((20,y),name,font=font(21,True),fill=(255,232,184))
        for col,spot in enumerate(bp["groundContactReview"]):
            raw,(left,top)=crop_for_camera(image,spot["feetAnchor"],extent); tile=raw.resize((480,270),Image.Resampling.LANCZOS).convert("RGBA")
            sx=480/extent[0]; sy=270/extent[1]; spr=player.resize((round(sprite_size[0]*sx),round(sprite_size[1]*sy)),Image.Resampling.NEAREST)
            px=round((spot["feetAnchor"][0]-left)*sx); py=round((spot["feetAnchor"][1]-top)*sy)
            td=ImageDraw.Draw(tile,"RGBA"); td.ellipse((px-4,py-4,px+4,py+4),fill=GOLD+(255,)); tile.alpha_composite(spr,(px-spr.width//2,py-spr.height))
            x=80+col*495; board.paste(tile.convert("RGB"),(x,y+32)); d.rectangle((x,y+32,x+480,y+302),outline=GOLD,width=2); d.text((x,y+307),spot["place"],font=font(16,True),fill=INK)
    d.text((28,1165),"Draft read: 28×56 closer is the first recommended runtime test; 32×64 changes clearance pressure at 54u/62u bottlenecks.",font=font(18),fill=MUTED)
    return board

def layer_board(bp):
    image=base(bp); layer=overlay(image); d=ImageDraw.Draw(layer,"RGBA")
    layers=[("L0 water/backdrop", [(0,0),(1280,0),(1280,720),(0,720)], (53,128,179),36),
            ("L1 playable foundations", [p for z in bp["walkableZones"] for p in []], GREEN,0)]
    sea=zones_by_id(bp,"blockedZones")["B_SEA"]["polygon"]; d.polygon(sea,fill=(49,132,184,84))
    for z in bp["walkableZones"]: d.polygon(z["polygon"],fill=GREEN+(80,),outline=GREEN+(220,),width=2)
    for z in bp["blockedZones"]:
        if z["id"] not in ("B_SEA",): d.polygon(z["polygon"],fill=ORANGE+(72,),outline=ORANGE+(220,),width=2)
    d.rectangle((0,570,1280,720),fill=(30,78,55,88),outline=GREEN+(150,),width=2)
    for text,p,c in [("WATER / BACKDROP",(760,585),(91,174,211)),("PLAYABLE FOUNDATIONS",(410,470),GREEN),("STRUCTURE / HERO",(905,230),ORANGE),("FOREGROUND OCCLUSION BAND",(480,650),PINK)]: text_box(d,p,text,c,16)
    result=merge(image,layer); board=Image.new("RGB",(1280,840),BG); board.paste(result,(0,120)); d2=header(board,"R5 Phase C — Runtime layer decomposition feasibility","Conceptual decomposition only: compose authored layers; do not extract collision, seams, or occluded surfaces from the painted reference.")
    legend(d2,[("water / backdrop",(91,174,211)),("walkable foundation",GREEN),("structure / hero art",ORANGE),("foreground occlusion candidate",PINK)],(28,96),4)
    d2.text((28,808),"Feasible only as a new authored scene: water, terrain, structures, pier/dock/gangway, and foreground must be separate assets. Exact seams remain UNRESOLVED.",font=font(16),fill=MUTED)
    return board

def human_gate_board(bp):
    image=base(bp).resize((1024,576),Image.Resampling.LANCZOS); board=Image.new("RGB",(1600,900),BG); d=header(board,"R5 Phase C — Human spatial feasibility gate","Candidate B is a PROVISIONAL working reference. This board requests a decision; it does not approve design or runtime.")
    board.paste(image,(28,110)); d.rectangle((28,110,1052,686),outline=GOLD,width=3)
    cards=[("REFERENCE MASTER","Candidate B — PROVISIONAL",GOLD),("GEOMETRY","DRAFT / feasible with listed issues",GREEN),("RUNTIME","BLOCKED — not modified",PINK),("HUMAN DESIGN SELECTION","PENDING",CYAN),("FINAL SPATIAL BLUEPRINT","NOT APPROVED",RED)]
    for i,(head,value,c) in enumerate(cards):
        x=1090; y=120+i*128; d.rounded_rectangle((x,y,x+470,y+100),14,fill=(16,46,58),outline=c,width=3); d.text((x+18,y+15),head,font=font(15,True),fill=MUTED); d.text((x+18,y+45),value,font=font(20,True),fill=INK)
    d.text((30,742),"Decision requested: confirm Candidate B as design direction; select Archive cue; select player/camera test; approve or revise bottlenecks.",font=font(19,True),fill=(255,232,184))
    d.text((30,787),"Open issues: 62u Workshop–Hall threshold; 54u Archive spur and Hero gangway; ship deck interior; authored-layer decomposition.",font=font(17),fill=MUTED)
    d.text((30,846),"READY_FOR_R5_SPATIAL_FEASIBILITY_HUMAN_GATE",font=font(22,True),fill=CYAN)
    return board

def main():
    OUT.mkdir(parents=True, exist_ok=True); bp=data()
    draw_zones(base(bp),bp,"R5 Phase C — Draft playable ground map","Walkable and blocked polygons are explicit DRAFT design geometry; they are not sampled from source pixels.").save(OUT/"02-playable-ground-map.png")
    elevation_board(bp).save(OUT/"03-elevation-and-stair-map.png")
    route_board(bp).save(OUT/"04-navigation-graph.png")
    width_board(bp).save(OUT/"05-path-width-and-bottlenecks.png")
    berth_board(bp).save(OUT/"06-hero-berth-access.png")
    ground_contact_board(bp).save(OUT/"07-player-ground-contact-review.png")
    camera_board(bp).save(OUT/"08-camera-and-player-scale.png")
    layer_board(bp).save(OUT/"09-runtime-layer-feasibility.png")
    human_gate_board(bp).save(OUT/"11-human-gate-board.png")

if __name__ == "__main__": main()
