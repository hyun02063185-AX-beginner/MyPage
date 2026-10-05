"""Build static, modular Gate C foundation convergence evidence.

This is intentionally an evidence compositor, not a scene exporter.  It reads
the approved Blueprint polygons and independently layers F1--F6/W1 plus the
locked transparent landmark/fleet canvases.  No canonical raster pixels are
sampled by the integration board.
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps
import math

ROOT = Path(r"C:\Users\hyun0\MyPage")
SRC = ROOT / "reports/portfolio-world-rebuild/evidence/gate-c-foundation-fleet"
OUT = ROOT / "reports/portfolio-world-rebuild/evidence/gate-c-foundation-convergence"
FOUNDATION = SRC / "foundation"
CANONICAL = ROOT / "reports/portfolio-world-rebuild/evidence/gameplay-projection-refinement/projection-a-elevated-gameplay.png"
W, H = 1920, 1080

FONT = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")

POLYS = {
    "workshop": [(185,705),(425,635),(675,690),(725,875),(545,1015),(250,975),(165,855)],
    "lower": [(505,615),(835,570),(1015,650),(975,880),(755,990),(485,865)],
    "central": [(875,490),(1115,465),(1245,560),(1205,700),(955,705),(850,620)],
    "hero_quay": [(1090,575),(1495,550),(1665,690),(1600,930),(1280,905),(1140,730)],
    "hall": [(235,250),(735,235),(860,400),(795,555),(430,565),(235,460)],
    "apron": [(405,115),(600,105),(655,245),(425,285)],
    "gangway": [(1340,620),(1455,610),(1525,700),(1420,770),(1325,700)],
}
WATER = {
    "inner": [(1010,335),(1245,300),(1475,420),(1435,620),(1240,690),(1130,595)],
    "hero": [(1420,430),(1920,350),(1920,1035),(1615,1005),(1530,845),(1460,710)],
    "secondary": [(1015,220),(1325,235),(1400,440),(1240,520),(1060,445)],
    "small": [(1130,445),(1395,445),(1430,630),(1210,700),(1100,600)],
    "outer": [(1245,0),(1920,0),(1920,480),(1580,450),(1420,370)],
}
ANCHORS = {"P1":(430,763), "P2":(710,763), "P3":(1010,628), "P4":(905,663), "P5":(640,453), "P6":(505,213), "P7":(1435,718)}

def fnt(size, bold=False):
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT), size)

def rgba(path): return Image.open(path).convert("RGBA")

def polygon_mask(points):
    m = Image.new("L", (W,H), 0); ImageDraw.Draw(m).polygon(points, fill=255); return m

def tiled(asset, xy=(0,0), variation=False):
    """Tile an RGBA module over a full-size transparent canvas with deterministic variations."""
    source = asset.convert("RGBA")
    layer = Image.new("RGBA", (W,H), (0,0,0,0))
    for row, y in enumerate(range(-source.height, H + source.height, source.height)):
        for col, x in enumerate(range(-source.width, W + source.width, source.width)):
            piece = source
            # A low-frequency, deterministic 2--5% tonal cycle breaks stamped repetition.
            if variation:
                factor = (0.97, 1.00, 1.035, 0.985)[(row * 3 + col * 5) % 4]
                piece = ImageEnhance.Brightness(source).enhance(factor)
                if (row + col) % 3 == 0: piece = piece.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
            layer.alpha_composite(piece, (x + xy[0], y + xy[1]))
    return layer

def apply_tiled(base, name, points, phase=(0,0), variation=True, tint=None):
    layer = tiled(rgba(FOUNDATION/name), phase, variation)
    if tint:
        colored = Image.new("RGBA", (W,H), tint)
        layer = Image.alpha_composite(layer, colored)
    # Preserve the source alpha inside the polygon mask.  A paste using only
    # the geometry mask would overwrite the ground with the transparent pixels
    # that surround each independently authored module.
    masked = Image.new("RGBA", (W,H), (0,0,0,0))
    masked.paste(layer, (0,0), polygon_mask(points))
    base.alpha_composite(masked)

def poly_overlay(base, points, fill, outline=None, width=1):
    over=Image.new("RGBA", (W,H),(0,0,0,0)); d=ImageDraw.Draw(over); d.polygon(points,fill=fill)
    if outline: d.line(points+[points[0]], fill=outline, width=width, joint="curve")
    base.alpha_composite(over)

def create_board():
    # A restrained sky/harbor backdrop deliberately leaves the scenic-background area open.
    # Neutral sandstone is deliberately broad: later scenic/background assets
    # occupy the open negative space, but this evidence must not borrow them
    # from the canonical raster.
    base=Image.new("RGBA",(W,H),(206,186,143,255))
    poly_overlay(base, [(0,0),(1245,0),(1420,370),(1130,595),(850,620),(725,875),(545,1015),(0,1080)], (221,205,166,68))
    # W1 water first; distinct broad depth fields keep the water calm and sheltered.
    for key, pts in WATER.items():
        layer=tiled(rgba(FOUNDATION/'water-direction.png'), (18 if key in ('hero','outer') else 0, 0), True)
        shade={'outer':(9,88,127,100),'inner':(8,125,147,55),'hero':(10,99,135,80),'secondary':(16,133,151,45),'small':(12,145,162,32)}[key]
        layer=Image.alpha_composite(layer, Image.new('RGBA',(W,H),shade))
        m=polygon_mask(pts); base.paste(layer,(0,0),m)
        # Quay-contact shadow is a static visual layer, not a physics/collision cue.
        edge=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(edge).line(pts+[pts[0]],fill=(18,61,74,105),width=10,joint='curve'); edge=edge.filter(ImageFilter.GaussianBlur(5)); base.alpha_composite(edge)
    # F1: Hall and lower harbor plaza. F2: quiet quays.
    apply_tiled(base,'limestone-paving.png',POLYS['hall'],(15,7),True)
    apply_tiled(base,'limestone-paving.png',POLYS['apron'],(31,19),True)
    apply_tiled(base,'limestone-paving.png',POLYS['lower'],(60,14),True)
    apply_tiled(base,'limestone-paving.png',POLYS['workshop'],(9,54),True)
    apply_tiled(base,'quay-surface.png',POLYS['central'],(12,12),True)
    apply_tiled(base,'quay-surface.png',POLYS['hero_quay'],(50,20),True)
    apply_tiled(base,'quay-surface.png',POLYS['gangway'],(21,8),True)
    # Macro tonal variation, masked separately so it stays a material layer rather than a new module.
    wash=Image.new('RGBA',(W,H),(0,0,0,0)); wd=ImageDraw.Draw(wash)
    wd.ellipse((255,240,865,605), fill=(255,239,201,23)); wd.ellipse((300,600,1000,1020), fill=(129,101,67,18))
    base.alpha_composite(wash)
    # F5 retaining wall visually describes upper Hall Plaza's elevation.
    wall=rgba(FOUNDATION/'retaining-wall.png').resize((330,54),Image.Resampling.LANCZOS)
    base.alpha_composite(wall,(405,520))
    # F4 stairs overlay, short and centered on the approved entry/exit regions.
    stairs=rgba(FOUNDATION/'main-stairs.png').resize((175,113),Image.Resampling.LANCZOS)
    base.alpha_composite(stairs,(825,525))
    # F3 quay edge is repeated as explicit heavy edge language around water-facing boundaries.
    edge_asset=rgba(FOUNDATION/'quay-edge.png').resize((108,26),Image.Resampling.LANCZOS)
    for x,y,angle in [(945,510,-8),(1110,562,18),(1290,575,-4),(1430,674,28),(1515,850,20)]:
        e=edge_asset.rotate(angle,expand=True,resample=Image.Resampling.BICUBIC); base.alpha_composite(e,(x,y))
    # F6 gangway foundation follows the locked Hero gangway direction.
    gang=rgba(FOUNDATION/'gangway-foundation.png').resize((175,96),Image.Resampling.LANCZOS).rotate(31,expand=True,resample=Image.Resampling.BICUBIC)
    base.alpha_composite(gang,(1355,655))
    # Gentle static contacts (separate visual contact layer).
    contacts=Image.new('RGBA',(W,H),(0,0,0,0)); cd=ImageDraw.Draw(contacts)
    for box,width in [((1360,690,1885,758),9),((1064,430,1295,490),5),((1150,526,1268,556),3)]:
        cd.arc(box,180,354,fill=(210,251,247,190),width=width)
    contacts=contacts.filter(ImageFilter.GaussianBlur(1)); base.alpha_composite(contacts)
    # Locked landmarks and fleet at exact Blueprint canvases.
    def place(path, xy, size):
        im=rgba(path)
        if im.size != size: im=im.resize(size,Image.Resampling.LANCZOS)
        base.alpha_composite(im,xy)
    place(ROOT/'reports/portfolio-world-rebuild/evidence/canonical-landmark-assets/hall/hall-b.png',(135,0),(605,320))
    place(ROOT/'reports/portfolio-world-rebuild/evidence/canonical-landmark-assets/workshop/workshop-c.png',(85,520),(505,280))
    place(ROOT/'reports/portfolio-world-rebuild/evidence/canonical-landmark-assets/hero-ship/hero-b.png',(1325,115),(595,685))
    place(SRC/'fleet/secondary-b.png',(1045,240),(275,255))
    place(SRC/'workboats/workboat-a.png',(1140,470),(140,75))
    # Fixed 28x56 characters, rendered as simple in-world markers, no QA glyphs on main board.
    for key in ('P1','P5','P6','P7'): draw_player(base,*ANCHORS[key])
    return base

def draw_player(base,x,ground_y):
    d=ImageDraw.Draw(base)
    left=x-14; top=ground_y-56
    d.ellipse((left+7,top,left+21,top+14),fill=(241,191,134,255),outline=(77,55,45,255),width=1)
    d.polygon([(left+5,top+17),(left+23,top+17),(left+25,top+39),(left+3,top+39)],fill=(40,114,151,255),outline=(24,60,79,255))
    d.rectangle((left+6,top+39,left+12,ground_y-2),fill=(57,58,75,255)); d.rectangle((left+16,top+39,left+22,ground_y-2),fill=(57,58,75,255))
    d.ellipse((left+3,ground_y-4,left+13,ground_y+1),fill=(31,36,44,255)); d.ellipse((left+15,ground_y-4,left+25,ground_y+1),fill=(31,36,44,255))

def text(draw,xy,s,size=28,bold=False,fill=(237,246,247,255)):
    draw.text(xy,s,font=fnt(size,bold),fill=fill)

def board_with_header(title,subtitle):
    im=Image.new('RGBA',(W,H),(17,37,47,255)); d=ImageDraw.Draw(im)
    text(d,(64,46),title,42,True); text(d,(66,98),subtitle,20,False,(163,207,213,255)); return im

def fit(img,size):
    copy=img.copy(); copy.thumbnail(size,Image.Resampling.LANCZOS); return copy

def make_material_application(board):
    im=board.copy(); shade=Image.new('RGBA',(W,H),(6,24,31,115)); im.alpha_composite(shade)
    d=ImageDraw.Draw(im); text(d,(62,46),'FOUNDATION MATERIAL APPLICATION',36,True); text(d,(64,93),'F1/F2/F3/F4/F5/F6 applied through Blueprint masks; no scene plate',19,False,(214,237,230,255))
    for label,pos in [('F1 Hall Plaza',(440,405)),('F1 Lower Plaza',(680,760)),('F2 Central Quay',(1030,570)),('F2 Hero Quay',(1450,760)),('F4 Main Stairs',(900,555)),('F5 Retaining Wall',(460,545)),('F6 Gangway',(1435,700))]:
        x,y=pos; d.rounded_rectangle((x-85,y-30,x+85,y+4),7,fill=(10,38,47,215)); text(d,(x-76,y-27),label,14,True,(240,244,229,255))
    return im

def make_water_application(board):
    im=board.copy(); shade=Image.new('RGBA',(W,H),(3,29,39,95)); im.alpha_composite(shade); d=ImageDraw.Draw(im)
    text(d,(62,46),'SHELTERED WATER MATERIAL APPLICATION',36,True); text(d,(64,93),'W1 tiled inside fixed water exclusions · tonal depth + contact shadow are separate layers',19,False,(214,237,230,255))
    for label,pos in [('Inner Harbor',(1225,500)),('Secondary Berth',(1180,328)),('Hero Berth',(1700,595)),('Workboat Berth',(1240,575))]:
        x,y=pos; d.rounded_rectangle((x-70,y-25,x+70,y+5),7,fill=(8,61,76,205)); text(d,(x-61,y-23),label,14,True)
    return im

def make_comparison(board):
    im=Image.new('RGBA',(W,H),(13,29,37,255)); c=rgba(CANONICAL)
    left=fit(c,(930,1015)); right=fit(board,(930,1015)); im.alpha_composite(left,(15,54)); im.alpha_composite(right,(975,54)); d=ImageDraw.Draw(im)
    text(d,(30,12),'CANONICAL PROJECTION A',23,True); text(d,(990,12),'FOUNDATION VISUAL CONVERGENCE',23,True)
    d.line((960,44,960,1065),fill=(79,170,177,230),width=3)
    return im

def crop_box(board, box, target):
    return ImageOps.fit(board.crop(box), target, Image.Resampling.LANCZOS, centering=(0.5,0.5))

def make_detail(board):
    im=board_with_header('FOUNDATION DETAIL REVIEW','Native-scale inspection: surface hierarchy, stairs, elevation, gangway, and water-edge contact')
    regions=[('A  Hall Plaza paving',(220,260,860,590)),('B  Lower Plaza',(460,610,1030,1020)),('C  Quay edge',(900,460,1320,720)),('D  Main stairs',(760,430,1040,690)),('E  Retaining wall',(220,480,820,670)),('F  Gangway foundation',(1260,580,1600,840)),('G  Water edge',(1200,350,1720,700))]
    cells=[(35,150,570,470),(650,150,1185,470),(1265,150,1885,470),(35,560,455,1015),(495,560,915,1015),(955,560,1375,1015),(1415,560,1885,1015)]
    d=ImageDraw.Draw(im)
    for (label,box),(x1,y1,x2,y2) in zip(regions,cells):
        crop=crop_box(board,box,(x2-x1-20,y2-y1-58)); im.alpha_composite(crop,(x1+10,y1+40)); d.rounded_rectangle((x1,y1,x2,y2),10,outline=(101,197,200,255),width=2); text(d,(x1+12,y1+9),label,18,True)
    return im

def make_route(board):
    im=board.copy(); over=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(over)
    route=[ANCHORS[k] for k in ('P1','P2','P3','P4','P5','P6')]; branch=[ANCHORS[k] for k in ('P3','P7')]
    d.line(route,fill=(238,89,92,230),width=5,joint='curve'); d.line(branch,fill=(255,192,72,230),width=5,joint='curve')
    for k,(x,y) in ANCHORS.items(): d.ellipse((x-9,y-9,x+9,y+9),fill=(250,250,243,255),outline=(38,71,83,255),width=2); text(d,(x+12,y-29),k,18,True,(245,250,245,255))
    im.alpha_composite(over); d=ImageDraw.Draw(im); d.rounded_rectangle((38,36,658,122),12,fill=(11,35,43,220)); text(d,(60,50),'PLAYER ROUTE / FOUNDATION REVIEW',27,True); text(d,(60,84),'P1→P2→P3→P4→P5→P6  ·  P3→P7',17,False,(233,219,163,255)); return im

def make_water_review(board):
    im=board_with_header('WATER / BERTH REVIEW','Hero, secondary, workboat, and quay edge — static contact layer shown at inspectable scale')
    regions=[('HERO BERTH',(1325,350,1920,1000)),('SECONDARY BERTH',(1000,200,1410,520)),('WORKBOAT AREA',(1090,430,1450,690)),('QUAY EDGE',(1050,490,1510,740))]
    cells=[(35,150,945,600),(975,150,1885,600),(35,630,945,1040),(975,630,1885,1040)]
    d=ImageDraw.Draw(im)
    for (label,box),(x1,y1,x2,y2) in zip(regions,cells):
        crop=crop_box(board,box,(x2-x1-20,y2-y1-60)); im.alpha_composite(crop,(x1+10,y1+44)); d.rounded_rectangle((x1,y1,x2,y2),10,outline=(80,183,190,255),width=2); text(d,(x1+14,y1+11),label,21,True)
    return im

def save_master_and_review(image,name):
    OUT.mkdir(parents=True,exist_ok=True); image.convert('RGB').save(OUT/name,'PNG',optimize=True)
    review=image.resize((1280,720),Image.Resampling.LANCZOS); review.convert('RGB').save(OUT/(Path(name).stem+'-review-1280x720.png'),'PNG',optimize=True)

def main():
    board=create_board()
    save_master_and_review(make_material_application(board),'01-foundation-material-application.png')
    save_master_and_review(make_water_application(board),'02-water-material-application.png')
    save_master_and_review(board,'03-full-visual-integration-board.png')
    save_master_and_review(make_comparison(board),'04-canonical-vs-foundation-convergence.png')
    save_master_and_review(make_detail(board),'05-foundation-detail-review.png')
    save_master_and_review(make_route(board),'06-player-route-foundation-review.png')
    save_master_and_review(make_water_review(board),'07-water-berth-review.png')

if __name__ == '__main__': main()
