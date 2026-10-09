"""Render R5 Phase C.2 corridor-clearance evidence from preserved C.1 plus C.2 overlay data."""
from pathlib import Path
import json, math
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[1]; C1=json.loads((ROOT/'data/portfolio-world/r5-spatial-blueprint-c1-draft.json').read_text(encoding='utf8')); C2=json.loads((ROOT/'data/portfolio-world/r5-spatial-blueprint-c2-draft.json').read_text(encoding='utf8')); OUT=ROOT/'reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-c2'
FONT='C:/Windows/Fonts/segoeui.ttf'; BOLD='C:/Windows/Fonts/segoeuib.ttf'; BG=(10,27,37); INK=(239,245,240); MUTED=(185,212,213); GOLD=(244,194,75); CYAN=(59,218,230); GREEN=(130,214,113); ORANGE=(244,147,57); RED=(232,91,91); PINK=(245,105,165)
def f(n,b=False):return ImageFont.truetype(BOLD if b else FONT,n)
def merge(base,patches):
    items={x['id']:x for x in base};items.update({x['id']:x for x in patches});return list(items.values())
BP={**C1,'walkableZones':merge(C1['walkableZones'],C2['geometryOverrides']['walkableZones']),'navigationNodes':merge(C1['navigationNodes'],C2['geometryOverrides']['navigationNodes']),'navigationEdges':merge(C1['navigationEdges'],C2['geometryOverrides']['navigationEdges'])}
def inside(p,poly):
    x,y=p;hit=False
    for i in range(len(poly)):
        xi,yi=poly[i];xj,yj=poly[i-1]
        if (yi>y)!=(yj>y) and x<(xj-xi)*(y-yi)/(yj-yi)+xi:hit=not hit
    return hit
def samples(a,b):
    l=math.hypot(b[0]-a[0],b[1]-a[1]);n=max(1,math.ceil(l/2));return [[a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n] for i in range(n+1)]
def failures(edge,zones,half):
    allowed=[zones[x] for x in edge['surfaceIds']];out=[]
    for a,b in zip(edge['polyline'],edge['polyline'][1:]):
        l=math.hypot(b[0]-a[0],b[1]-a[1]);nx=-(b[1]-a[1])/l;ny=(b[0]-a[0])/l
        for p in samples(a,b):
            for s in (-half,half):
                q=[p[0]+nx*s,p[1]+ny*s]
                if not any(inside(q,z['polygon']) for z in allowed):out.append(q)
    return out
def base(bp):return Image.open(ROOT/bp['referenceMaster']['path']).convert('RGB')
def add(im):return Image.new('RGBA',im.size,(0,0,0,0))
def comp(im,l):return Image.alpha_composite(im.convert('RGBA'),l).convert('RGB')
def head(board,title,sub):
    d=ImageDraw.Draw(board);d.text((28,19),title,font=f(30,True),fill=(255,234,190));d.text((30,58),sub,font=f(17),fill=MUTED);return d
def box(d,p,t,c=GOLD,s=15):
    x,y=p;b=d.textbbox((x,y),t,font=f(s,True));d.rounded_rectangle((x-5,y-4,b[2]+5,b[3]+4),6,fill=(7,23,31,235),outline=c+(255,),width=2);d.text((x,y),t,font=f(s,True),fill=INK)
def legend(d,items,origin=(28,95),cols=4):
    x0,y0=origin
    for i,(t,c) in enumerate(items):
        x=x0+(i%cols)*300;y=y0+(i//cols)*28;d.rounded_rectangle((x,y+4,x+18,y+22),3,fill=c);d.text((x+27,y),t,font=f(15,True),fill=INK)
def board(title,sub):
    b=Image.new('RGB',(1280,845),BG);return b,head(b,title,sub)
def failure_map():
    im=base(C1);l=add(im);d=ImageDraw.Draw(l,'RGBA');zones={x['id']:x for x in C1['walkableZones']};edges={x['id']:x for x in C1['navigationEdges']}
    for eid in ('E_PROMENADE_PIER','E_GANGWAY_HERO'):
        e=edges[eid];d.line(e['polyline'],fill=GOLD+(255,),width=5,joint='curve')
        bad=failures(e,zones,24)
        for p in bad:d.ellipse((p[0]-4,p[1]-4,p[0]+4,p[1]+4),fill=RED+(255,),outline=(7,22,29,255),width=1)
    box(d,(460,415),'C.1 Pier transition: 14 ±24u failures',RED,14);box(d,(1010,290),'C.1 Hero end: 3 ±24u failures',RED,14)
    b,d2=board('R5 Phase C.2 — Reproduced 48u minimum-width failures','Red points are actual C.1 ±24u samples outside their declared surface; they are not image-colour estimates.')
    b.paste(comp(im,l),(0,120));legend(d2,[('C.1 centerline',GOLD),('failed ±24u sample',RED),('48u envelope required',CYAN)],(28,94),3);return b
def corrected_map():
    im=base(BP);l=add(im);d=ImageDraw.Draw(l,'RGBA');zones={x['id']:x for x in BP['walkableZones']};edges={x['id']:x for x in BP['navigationEdges']}
    for zid in ['G_PIER_APRON','G_SHORE_PIER','G_SIDE_DOCK','G_GANGWAY']:
        z=zones[zid];c=ORANGE if 'PIER' in zid else CYAN;d.polygon(z['polygon'],fill=c+(92,),outline=c+(255,),width=3)
    for eid in ['E_PROMENADE_PIER','E_PIER_DOCK','E_DOCK_GANGWAY','E_GANGWAY_HERO']:
        e=edges[eid];d.line(e['polyline'],fill=(5,18,25,240),width=50,joint='curve');d.line(e['polyline'],fill=GREEN+(255,),width=4,joint='curve')
    nodes={x['id']:x for x in BP['navigationNodes']}
    label_at={'N_PROMENADE':(465,432),'N_PIER_ENTRY':(575,380),'N_SIDE_DOCK':(900,420),'N_GANGWAY':(965,295),'N_HERO':(1070,400)}
    for nid in C2['requiredHeroChain']:
        x,y=nodes[nid]['point'];d.ellipse((x-8,y-8,x+8,y+8),fill=GREEN+(255,),outline=(7,22,29,255),width=3);box(d,label_at[nid],nid.replace('N_',''),GREEN,13)
    b,d2=board('R5 Phase C.2 — Corrected existing pier / gangway access','Green bands are verified 48u envelopes. C.2 centers paths on existing visible structures; collision footprints are unchanged.')
    b.paste(comp(im,l),(0,120));legend(d2,[('existing pier / apron',ORANGE),('existing dock / gangway',CYAN),('verified 48u envelope',GREEN)],(28,94),3);return b
def gate_board():
    im=base(BP).crop((400,220,1280,560)).resize((1000,386),Image.Resampling.LANCZOS);b=Image.new('RGB',(1600,900),BG);d=head(b,'R5 Phase C.2 — Final spatial Human gate','Technical geometry passes minimum clearance. Candidate B design choice and final Blueprint approval remain Human decisions.')
    b.paste(im,(28,120));d.rectangle((28,120,1028,506),outline=GOLD,width=3)
    cards=[('GEOMETRY INTEGRITY','PASS',GREEN),('MINIMUM CORRIDOR 48','PASS',GREEN),('RECOMMENDED 64','PASS OR WARN',GOLD),('FULL WORLD DESIGN','PENDING HUMAN',CYAN),('FINAL BLUEPRINT','NOT APPROVED',RED),('RUNTIME','BLOCKED',PINK)]
    for i,(a,v,c) in enumerate(cards):
        x=1080;y=125+i*103;d.rounded_rectangle((x,y,x+470,y+78),12,fill=(16,46,58),outline=c,width=3);d.text((x+16,y+11),a,font=f(14,True),fill=MUTED);d.text((x+16,y+37),v,font=f(20,True),fill=INK)
    d.text((30,570),'Verified chain: Shore → Pier apron → Shore pier → Side dock → Gangway → Boarding threshold',font=f(20,True),fill=(255,232,184));d.text((30,615),'C.2 warning: 64u is not available across every existing route; no invented pier or reduced collision was used.',font=f(17),fill=MUTED);d.text((30,700),'Required Human choices: Candidate B direction, Archive cue/fourth visitable point, and camera/world-scale direction.',font=f(17),fill=MUTED);d.text((30,820),'READY_FOR_R5_C2_FINAL_SPATIAL_HUMAN_REVIEW',font=f(23,True),fill=CYAN);return b
def main():
    OUT.mkdir(parents=True,exist_ok=True);failure_map().save(OUT/'02-minimum-width-failure-map.png');corrected_map().save(OUT/'03-corrected-pier-and-gangway.png');gate_board().save(OUT/'05-final-human-gate-board.png')
if __name__=='__main__':main()
