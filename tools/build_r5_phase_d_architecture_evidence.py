"""Render Phase D architecture boards from draft data; no runtime assets are changed."""
from pathlib import Path
import hashlib, json
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'data/portfolio-world/r5-destination-world-architecture-draft.json').read_text(encoding='utf8'))
C1 = json.loads((ROOT / 'data/portfolio-world/r5-spatial-blueprint-c1-draft.json').read_text(encoding='utf8'))
C2 = json.loads((ROOT / 'data/portfolio-world/r5-spatial-blueprint-c2-draft.json').read_text(encoding='utf8'))
RES = json.loads((ROOT / 'data/portfolio-world/r5-future-expansion-reserve-draft.json').read_text(encoding='utf8'))
OUT = ROOT / DATA['evidence']['folder']
FONT = 'C:/Windows/Fonts/segoeui.ttf'; BOLD = 'C:/Windows/Fonts/segoeuib.ttf'
BG=(10,27,37); INK=(239,245,240); MUTED=(180,208,212); GOLD=(244,194,75); CYAN=(59,218,230); GREEN=(130,214,113); VIOLET=(166,115,244); PINK=(245,105,165); ORANGE=(244,147,57)
def ft(n,b=False): return ImageFont.truetype(BOLD if b else FONT,n)
def master(): return Image.open(ROOT / DATA['referenceMaster']['path']).convert('RGB')
def board(title, subtitle, size):
    im=Image.new('RGB',size,BG); d=ImageDraw.Draw(im); d.text((28,20),title,font=ft(30,True),fill=(255,233,189)); d.text((30,61),subtitle,font=ft(16),fill=MUTED); return im,d
def label(d, xy, text, color=GOLD, size=15):
    x,y=xy; bbox=d.textbbox((x,y),text,font=ft(size,True)); d.rounded_rectangle((x-6,y-4,bbox[2]+6,bbox[3]+4),6,fill=(7,23,31),outline=color,width=2);d.text((x,y),text,font=ft(size,True),fill=INK)
def wrap(d, xy, text, width, color=MUTED, size=16, gap=4):
    words=text.split(); line=''; x,y=xy
    for word in words:
        trial=(line+' '+word).strip()
        if d.textlength(trial,font=ft(size))>width and line:
            d.text((x,y),line,font=ft(size),fill=color);y+=size+gap;line=word
        else: line=trial
    if line:d.text((x,y),line,font=ft(size),fill=color)
def getnodes():
    by={x['id']:x for x in C1['navigationNodes']};by.update({x['id']:x for x in C2['geometryOverrides']['navigationNodes']});return by
def content_map():
    src=master(); im,d=board('R5 Phase D — Content Destination Alternatives','Both alternatives use the same four active POI. Green is Option A; violet is Option B. Neither is approved.',(1600,1020)); im.paste(src.resize((960,540),Image.Resampling.LANCZOS),(30,125));
    points={'hall':(165,145),'workshop':(235,350),'archive':(170,445),'hero_ship':(790,285)}
    a=DATA['mappingOptions'][0]['mapping']; b=DATA['mappingOptions'][1]['mapping']
    for poi,(x,y) in points.items():
        x=30+x*.75;y=125+y*.75;d.ellipse((x-8,y-8,x+8,y+8),fill=GREEN,outline=BG,width=3);label(d,(x+14,y-26),f"{poi.upper()} → {a[poi]}",GREEN,13);label(d,(x+14,y-4),f"Option B → {b[poi]}",VIOLET,12)
    x=1040; d.text((x,140),'OPTION A — STORYTELLING',font=ft(22,True),fill=GREEN); wrap(d,(x,178),'Hall / teaching · Workshop / making · Archive / gallery · Hero Ship / career',510,INK,18)
    d.text((x,330),'OPTION B — SEMANTIC',font=ft(22,True),fill=VIOLET); wrap(d,(x,368),'Hall / gallery · Workshop / making · Archive / teaching · Hero Ship / career',510,INK,18)
    d.text((x,540),'REVIEW',font=ft(18,True),fill=GOLD); wrap(d,(x,572),DATA['preferredMapping']['reason'],510,MUTED,17)
    d.text((30,910),'CURRENT HTML TARGETS ONLY · NO R5 ROUTING IMPLEMENTED · ACTIVE POI = 4',font=ft(19,True),fill=CYAN); return im
def world_size():
    im,d=board('R5 Phase D — World Scale and Camera Travel','Logical world options; color beyond the core is a requirement for future authored work, not claimed playable land.',(1800,940))
    for i,opt in enumerate(DATA['worldScaleOptions']):
        x=40+i*590;y=150;scale=.30; ww=int(opt['world'][0]*scale);hh=int(opt['world'][1]*scale);corew=int(min(opt['world'][0],1280)*scale);coreh=int(min(opt['world'][1],720)*scale)
        d.rounded_rectangle((x,y,x+ww,y+hh),18,fill=(28,66,80),outline=CYAN,width=3);d.rectangle((x,y,x+corew,y+coreh),fill=(48,104,85),outline=GREEN,width=3)
        if ww>corew or hh>coreh:d.rectangle((x+corew,y,x+ww,y+hh),fill=(74,57,109),outline=VIOLET,width=2)
        vw=int(1024*scale);vh=int(576*scale);d.rectangle((x+max(0,(corew-vw)//2),y+max(0,(coreh-vh)//2),x+max(0,(corew-vw)//2)+vw,y+max(0,(coreh-vh)//2)+vh),outline=GOLD,width=3)
        d.text((x,y-42),opt['id'].replace('_',' '),font=ft(20,True),fill=(255,233,189));d.text((x,y+hh+22),f"{opt['world'][0]}×{opt['world'][1]} · z1 travel {opt['cameraTravelAtZoom1'][0]}×{opt['cameraTravelAtZoom1'][1]}",font=ft(15,True),fill=INK);wrap(d,(x,y+hh+52),opt['description'],530,MUTED,15)
    d.text((45,840),'GREEN: composed/active core     VIOLET: separately authored future work     GOLD: 1024×576 gameplay viewport     CYAN: logical boundary',font=ft(17,True),fill=INK); return im
def gameplay():
    nodes=getnodes(); src=master(); player=Image.open(ROOT/'portfolio-world/public/assets/canonical-r4/runtime/player/idle-front.png').convert('RGBA'); views=[('Hall stairs','N_HALL'),('Workshop','N_WORKSHOP'),('Archive','N_ARCHIVE'),('Hero threshold','N_HERO')]
    im,d=board('R5 Phase D — Gameplay Camera / Player Comparison','Each crop centers the player on a declared navigation node; water is never used as a player placement.',(2100,1160))
    for r,cam in enumerate(DATA['cameraOptions']):
        y=120+r*330;d.text((25,y),cam['id'].replace('_',' '),font=ft(20,True),fill=(255,233,189));d.text((25,y+30),f"player {cam['playerVisual'][0]}×{cam['playerVisual'][1]} · zoom {cam['zoom']} · visible {cam['visibleWorld'][0]:.1f}×{cam['visibleWorld'][1]:.1f} · on-screen {cam['screenPlayerHeight']}px",font=ft(14),fill=MUTED)
        for c,(name,nid) in enumerate(views):
            p=nodes[nid]['point']; vw,vh=map(round,cam['visibleWorld']);left=max(0,min(src.width-vw,round(p[0]-vw/2)));top=max(0,min(src.height-vh,round(p[1]-vh/2)));tile=src.crop((left,top,left+vw,top+vh)).resize((400,225),Image.Resampling.LANCZOS).convert('RGBA');sx=400/vw;sy=225/vh;sw=max(1,round(cam['playerVisual'][0]*cam['zoom']*sx));sh=max(1,round(cam['playerVisual'][1]*cam['zoom']*sy));sprite=player.resize((sw,sh),Image.Resampling.NEAREST);px=round((p[0]-left)*sx);py=round((p[1]-top)*sy);ImageDraw.Draw(tile).ellipse((px-4,py-4,px+4,py+4),fill=GOLD);tile.alpha_composite(sprite,(px-sw//2,py-sh));x=390+c*425;im.paste(tile.convert('RGB'),(x,y));d.rectangle((x,y,x+400,y+225),outline=GOLD,width=2);d.text((x,y+234),name,font=ft(15,True),fill=INK)
    d.text((30,1120),'Read: 28×56 at 1.25 is proposed for first gameplay test. Overview must remain a separate affordance; it is not the normal play view.',font=ft(17,True),fill=CYAN);return im
def expansion():
    src=master(); im,d=board('R5 Phase D — Future Expansion Models','Current right-side reserve stays water/horizon and non-walkable. These diagrams compare future production choices.',(1700,980)); im.paste(src.resize((760,428),Image.Resampling.LANCZOS),(35,135));d.rectangle((35+570,135,795,563),outline=VIOLET,width=4);d.text((58,582),'ACTIVE HARBOR CORE',font=ft(16,True),fill=GREEN);d.text((610,582),'VISUAL RESERVE ONLY',font=ft(16,True),fill=VIOLET)
    cards=[('A — WORLD EXTENSION',DATA['futureExpansionModels'][0]['description'],DATA['futureExpansionModels'][0]['risk'],ORANGE),('B — SCENE TRANSITION',DATA['futureExpansionModels'][1]['description'],DATA['futureExpansionModels'][1]['risk'],CYAN)]
    for i,(title,desc,risk,color) in enumerate(cards):
        x=850+i*405;y=145;d.rounded_rectangle((x,y,x+370,y+610),18,fill=(17,47,59),outline=color,width=3);d.text((x+20,y+22),title,font=ft(19,True),fill=color);d.text((x+20,y+98),'MODEL',font=ft(14,True),fill=INK);wrap(d,(x+20,y+125),desc,330,MUTED,16);d.text((x+20,y+345),'RISK / REQUIRED WORK',font=ft(14,True),fill=INK);wrap(d,(x+20,y+372),risk,330,MUTED,16)
    d.text((40,750),'INACTIVE SEAMS',font=ft(20,True),fill=(255,233,189));
    for i,seam in enumerate(DATA['expansionSeams']):d.text((60,792+i*44),f"{seam['id']}: {seam['current']}",font=ft(16),fill=INK)
    return im
def decisions():
    im,d=board('R5 Phase D — Human Decision Board','A planning package only. No candidate, mapping, UX, world size, camera value, or runtime has been approved.',(1600,940)); src=master().resize((650,366),Image.Resampling.LANCZOS);im.paste(src,(30,130));d.rectangle((30,130,680,496),outline=GOLD,width=3)
    decisions=[('A · CONTENT MAPPING','Option A storytelling / Option B semantic'),('B · CONTENT ENTRY UX','HTML page / overlay panel / content scene'),('C · WORLD AND CAMERA','single-screen / larger exploration / connected areas'),('D · EXPANSION MODEL','World Extension / Scene Transition')]
    for i,(a,b) in enumerate(decisions):
        x=750;y=130+i*125;d.rounded_rectangle((x,y,x+790,y+94),14,fill=(17,47,59),outline=CYAN,width=3);d.text((x+20,y+13),a,font=ft(19,True),fill=(255,233,189));d.text((x+20,y+47),b,font=ft(17),fill=INK)
    checks=['FOUR ACTIVE POI — PRESERVED','C.2 GEOMETRY — PRESERVED','RIGHT RESERVE — VISUAL ONLY','CANDIDATE B — PENDING HUMAN','R4/R5 RUNTIME — NOT MODIFIED / BLOCKED']
    for i,text in enumerate(checks):d.text((40,570+i*42),text,font=ft(18,True),fill=GREEN if i<3 else GOLD)
    d.text((40,830),DATA['gate'],font=ft(22,True),fill=CYAN);return im
def main():
    OUT.mkdir(parents=True,exist_ok=True)
    for name,func in [('10-content-destination-map.png',content_map),('11-world-size-camera-comparison.png',world_size),('12-gameplay-view-comparison.png',gameplay),('13-future-expansion-models.png',expansion),('14-human-decision-board.png',decisions)]: func().save(OUT/name)
if __name__=='__main__': main()
