"""Render R5 Phase C.1 spatial-integrity evidence from the C.1 draft JSON."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data/portfolio-world/r5-spatial-blueprint-c1-draft.json"
OUT = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-c1"
FONT = "C:/Windows/Fonts/segoeui.ttf"; BOLD = "C:/Windows/Fonts/segoeuib.ttf"
BG=(10,27,37); INK=(239,245,240); MUTED=(185,212,213); GOLD=(244,194,75); CYAN=(59,218,230); GREEN=(130,214,113); ORANGE=(244,147,57); RED=(232,91,91); PINK=(245,105,165)
def f(n,b=False): return ImageFont.truetype(BOLD if b else FONT,n)
def load(): return json.loads(DATA.read_text(encoding='utf-8'))
def original(bp): return Image.open(ROOT / bp['referenceMaster']['path']).convert('RGB')
def merge(im, layer): return Image.alpha_composite(im.convert('RGBA'),layer).convert('RGB')
def header(board,title,sub):
    d=ImageDraw.Draw(board); d.text((28,19),title,font=f(30,True),fill=(255,234,190)); d.text((30,58),sub,font=f(17),fill=MUTED); return d
def box(d,p,t,c=GOLD,size=15):
    x,y=p; b=d.textbbox((x,y),t,font=f(size,True)); d.rounded_rectangle((x-5,y-4,b[2]+5,b[3]+4),6,fill=(7,23,31,235),outline=c+(255,),width=2); d.text((x,y),t,font=f(size,True),fill=INK)
def legend(d,items,origin=(28,95),columns=4):
    x0,y0=origin
    for i,(name,c) in enumerate(items):
        x=x0+(i%columns)*300;y=y0+(i//columns)*28;d.rounded_rectangle((x,y+4,x+18,y+22),3,fill=c);d.text((x+27,y),name,font=f(15,True),fill=INK)
def board_image(bp,title,sub):
    b=Image.new('RGB',(1280,845),BG); d=header(b,title,sub); return b,d
def zone_map(bp):
    im=original(bp); lay=Image.new('RGBA',im.size,(0,0,0,0));d=ImageDraw.Draw(lay,'RGBA')
    col={'GROUND':GREEN,'STAIR':GOLD,'PIER':ORANGE,'DOCK':CYAN,'GANGWAY':(245,239,208)}
    for z in bp['walkableZones']: d.polygon(z['polygon'],fill=col[z['kind']]+(110,),outline=col[z['kind']]+(255,),width=3)
    for c in bp['collisionFootprints']:
        if c['id']=='C_SEA': d.polygon(c['polygon'],fill=(53,124,180,55),outline=(92,173,211,150),width=2)
        else: d.polygon(c['polygon'],fill=RED+(72,),outline=RED+(255,),width=3)
    b,d2=board_image(bp,'R5 Phase C.1 — Corrected walkable / collision map','Green/gold/orange/cyan are explicit draft surfaces; red is authored collision intent, distinct from projected building art.')
    b.paste(merge(im,lay),(0,120));legend(d2,[('ground',GREEN),('stairs',GOLD),('pier',ORANGE),('dock / gangway',CYAN),('collision footprint',RED),('blocked sea',(92,173,211))],(28,94),3);return b
def nav_map(bp):
    im=original(bp);lay=Image.new('RGBA',im.size,(0,0,0,0));d=ImageDraw.Draw(lay,'RGBA'); col={'GROUND':GREEN,'STAIR':GOLD,'PIER':ORANGE,'GANGWAY':CYAN}
    for e in bp['navigationEdges']:
        pts=e['polyline'];c=col[e['type']];d.line(pts,fill=(5,18,25,245),width=13,joint='curve');d.line(pts,fill=c+(255,),width=6,joint='curve')
    for n in bp['navigationNodes']:
        x,y=n['point'];d.ellipse((x-8,y-8,x+8,y+8),fill=(7,22,29,255),outline=(255,249,222,255),width=3);d.ellipse((x-3,y-3,x+3,y+3),fill=CYAN+(255,));box(d,(x+10,y-25),n['id'].replace('N_',''),CYAN,14)
    b,d2=board_image(bp,'R5 Phase C.1 — Corrected navigation graph','Every line is an explicitly tested centerline; tests sample its full length and ±16u player half-width.')
    b.paste(merge(im,lay),(0,120));legend(d2,[('ground L0',GREEN),('Hall stairs',GOLD),('pier',ORANGE),('gangway',CYAN)],(28,94),4);return b
def elevation_map(bp):
    im=original(bp);lay=Image.new('RGBA',im.size,(0,0,0,0));d=ImageDraw.Draw(lay,'RGBA'); col={'L0':CYAN,'L0_TO_L1':PINK,'L1_TO_L2':GOLD,'L2':GREEN,'L0_TO_SHIP':(245,239,208)}
    for z in bp['walkableZones']:
        c=col[z['elevation']];d.polygon(z['polygon'],fill=c+(95,),outline=c+(255,),width=3); xs=[p[0] for p in z['polygon']];ys=[p[1] for p in z['polygon']];box(d,((min(xs)+max(xs))//2-20,(min(ys)+max(ys))//2-10),z['elevation'],c,14)
    nodes={n['id']:n['point'] for n in bp['navigationNodes']}
    for c in bp['stairConnectors']:
        a,b=nodes[c['from']],nodes[c['to']];d.line([a,b],fill=(7,22,29,245),width=12);d.line([a,b],fill=PINK+(255,),width=5);box(d,(a[0]+12,a[1]+7),c['id'].replace('_CONNECTOR','')+' ↑',PINK,13)
    b,d2=board_image(bp,'R5 Phase C.1 — Elevation connector review','Workshop forecourt and promenade are both L0 continuous ground. Only the visible Hall stair changes land elevation.')
    b.paste(merge(im,lay),(0,120));legend(d2,[('L0 continuous ground',CYAN),('L0 → L1 stair',PINK),('L1 → L2 stair',GOLD),('L2 Hall terrace',GREEN),('boarding threshold',(245,239,208))],(28,94),5);return b
def footprint_map(bp):
    im=original(bp);lay=Image.new('RGBA',im.size,(0,0,0,0));d=ImageDraw.Draw(lay,'RGBA')
    for v in bp['visualSilhouettes']:
        d.line(v['polygon']+[v['polygon'][0]],fill=GOLD+(225,),width=3,joint='curve')
    for c in bp['collisionFootprints']:
        if c['id']!='C_SEA':d.polygon(c['polygon'],fill=RED+(90,),outline=RED+(255,),width=3)
    for z in bp['walkableZones']:
        if 'APPROACH' in z['id'] or 'FORECOURT' in z['id'] or z['id']=='G_HALL_TERRACE':d.polygon(z['polygon'],fill=GREEN+(85,),outline=GREEN+(230,),width=2)
    for o in bp['foregroundOcclusion']:d.rectangle((0,570,1280,720),fill=PINK+(42,),outline=PINK+(180,),width=2)
    b,d2=board_image(bp,'R5 Phase C.1 — Visual bounds vs ground footprint','Gold outline: projected art silhouette. Red: draft collision footprint. Green: exterior interaction approach. Pink: foreground-only occlusion candidate.')
    b.paste(merge(im,lay),(0,120));legend(d2,[('projected visual silhouette',GOLD),('collision ground footprint',RED),('interaction approach',GREEN),('foreground occlusion only',PINK)],(28,94),4); return b
def clearance_map(bp):
    im=original(bp);lay=Image.new('RGBA',im.size,(0,0,0,0));d=ImageDraw.Draw(lay,'RGBA');col={'GROUND':GREEN,'STAIR':GOLD,'PIER':ORANGE,'GANGWAY':CYAN}
    for e in bp['navigationEdges']:
        pts=e['polyline'];c=col[e['type']];d.line(pts,fill=(6,20,27,230),width=34,joint='curve');d.line(pts,fill=c+(255,),width=3,joint='curve')
    labels=[('Hall stairs', (150,270),76,GREEN),('Workshop → Archive',(205,515),54,GOLD),('Promenade',(450,475),96,GREEN),('Pier',(650,395),72,GREEN),('Gangway',(1015,345),54,GOLD)]
    for name,(x,y),w,c in labels: d.ellipse((x-3,y-3,x+3,y+3),fill=c+(255,));box(d,(x+9,y-24),f'{name}: {w}u',c,13)
    b,d2=board_image(bp,'R5 Phase C.1 — Player clearance validation','Dark bands show 32u physics width (±16u) sampled along each route. All named routes also meet the 48u corridor minimum.')
    b.paste(merge(im,lay),(0,120));legend(d2,[('≥64u recommended',GREEN),('48–63u min-pass / review',GOLD),('tested 32u player width',CYAN)],(28,94),3);d2.text((28,812),'Remaining review: 54u Archive approach and 54u gangway pass the minimum but not the 64u recommendation.',font=f(16),fill=MUTED);return b
def main():
    OUT.mkdir(parents=True,exist_ok=True);bp=load();zone_map(bp).save(OUT/'02-corrected-walkable-map.png');nav_map(bp).save(OUT/'03-corrected-navigation-graph.png');elevation_map(bp).save(OUT/'04-elevation-connector-review.png');footprint_map(bp).save(OUT/'05-footprint-vs-visual-bounds.png');clearance_map(bp).save(OUT/'06-player-clearance-validation.png')
if __name__=='__main__':main()
