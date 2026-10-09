"""Render R5 right-side Future Expansion Reserve evidence without altering runtime art."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[1]; C1=json.loads((ROOT/'data/portfolio-world/r5-spatial-blueprint-c1-draft.json').read_text(encoding='utf8')); C2=json.loads((ROOT/'data/portfolio-world/r5-spatial-blueprint-c2-draft.json').read_text(encoding='utf8')); R=json.loads((ROOT/'data/portfolio-world/r5-future-expansion-reserve-draft.json').read_text(encoding='utf8')); OUT=ROOT/'reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-c2-reserve'
FONT='C:/Windows/Fonts/segoeui.ttf';BOLD='C:/Windows/Fonts/segoeuib.ttf';BG=(10,27,37);INK=(239,245,240);MUTED=(185,212,213);GOLD=(244,194,75);CYAN=(59,218,230);GREEN=(130,214,113);ORANGE=(244,147,57);PINK=(245,105,165);VIOLET=(166,115,244)
def f(n,b=False):return ImageFont.truetype(BOLD if b else FONT,n)
def overlay(base,patch):
 d={x['id']:x for x in base};d.update({x['id']:x for x in patch});return list(d.values())
NODES={x['id']:x for x in overlay(C1['navigationNodes'],C2['geometryOverrides']['navigationNodes'])};WALK=overlay(C1['walkableZones'],C2['geometryOverrides']['walkableZones'])
def source():return Image.open(ROOT/R['referenceMaster']['path']).convert('RGB')
def layer(im):return Image.new('RGBA',im.size,(0,0,0,0))
def composite(im,l):return Image.alpha_composite(im.convert('RGBA'),l).convert('RGB')
def header(b,t,s):d=ImageDraw.Draw(b);d.text((28,19),t,font=f(30,True),fill=(255,234,190));d.text((30,58),s,font=f(17),fill=MUTED);return d
def box(d,p,t,c=GOLD,s=15):
 x,y=p;bb=d.textbbox((x,y),t,font=f(s,True));d.rounded_rectangle((x-5,y-4,bb[2]+5,bb[3]+4),6,fill=(7,23,31,235),outline=c+(255,),width=2);d.text((x,y),t,font=f(s,True),fill=INK)
def legend(d,items,origin=(28,95),cols=4):
 x0,y0=origin
 for i,(t,c) in enumerate(items):
  x=x0+(i%cols)*290;y=y0+(i//cols)*28;d.rounded_rectangle((x,y+4,x+18,y+22),3,fill=c);d.text((x+27,y),t,font=f(15,True),fill=INK)
def board(t,s,h=845):b=Image.new('RGB',(1280,h),BG);return b,header(b,t,s)
def poi_labels(d):
 at={'hall':(180,158),'workshop':(253,440),'archive':(180,560),'hero_ship':(1028,355)}
 for poi in R['currentCore']['active_poi']:
  x,y=at[poi['id']];d.ellipse((x-8,y-8,x+8,y+8),fill=GREEN+(255,),outline=(7,22,29,255),width=3);box(d,(x+10,y-28),poi['id'].upper(),GREEN,14)
def emphasis():
 im=source();l=layer(im);d=ImageDraw.Draw(l,'RGBA')
 d.polygon([(0,0),(790,0),(790,720),(0,720)],fill=(15,35,33,40))
 for z in R['futureExpansionReserve']['zones']:d.polygon(z['polygon'],fill=VIOLET+(115,),outline=VIOLET+(255,),width=3)
 poi_labels(d);box(d,(1155,120),'FUTURE',VIOLET,17);box(d,(1155,145),'EXPANSION',VIOLET,17);box(d,(1155,170),'RESERVE',VIOLET,17);box(d,(1035,225),'KEEP OPEN WATER VIEW',CYAN,14);box(d,(1035,560),'NO CURRENT POI / NO NEW GROUND',VIOLET,14)
 b,d2=board('R5 — Right-side Future Expansion Reserve','Right water is intentionally visual-only now: it gives the Hero Ship room and preserves an asymmetric harbor outlook.')
 b.paste(composite(im,l),(0,120));legend(d2,[('4 active POI',GREEN),('future expansion reserve',VIOLET),('open-water view',CYAN)],(28,94),3);return b
def soft():
 im=source();l=layer(im);d=ImageDraw.Draw(l,'RGBA')
 for z in R['futureExpansionReserve']['zones']:d.line(z['polygon']+[z['polygon'][0]],fill=VIOLET+(180,),width=2,joint='curve')
 d.line([(225,180),(250,440),(1028,355),(225,180)],fill=GOLD+(220,),width=3,joint='curve');poi_labels(d);box(d,(930,110),'INTENTIONAL HARBOR OUTLOOK',VIOLET,16)
 b,d2=board('R5 — Reserve-soft composition review','Hall → Workshop → Hero Ship remains the readable asymmetric triangle; the reserve is a view, not a missing destination.')
 b.paste(composite(im,l),(0,120));legend(d2,[('landmark triangle',GOLD),('4 active POI',GREEN),('reserve boundary',VIOLET)],(28,94),3);return b
def core_seams():
 im=source();l=layer(im);d=ImageDraw.Draw(l,'RGBA')
 for z in WALK:d.polygon(z['polygon'],fill=GREEN+(75,),outline=GREEN+(185,),width=2)
 for z in R['futureExpansionReserve']['zones']:d.polygon(z['polygon'],fill=VIOLET+(100,),outline=VIOLET+(255,),width=3)
 seam_labels={'SEAM_HERO_INTERIOR_HOOK':((1055,300),'HERO INTERIOR (FUTURE)'), 'SEAM_EAST_AUXILIARY_BERTH':((890,480),'AUXILIARY BERTH (FUTURE)'), 'SEAM_OFFSHORE_ROUTE':((1080,205),'OFFSHORE ROUTE (FUTURE)')}
 for seam in R['futureConnectionSeams']:
  p=NODES[seam['anchor']]['point'] if isinstance(seam['anchor'],str) else seam['anchor'];d.ellipse((p[0]-10,p[1]-10,p[0]+10,p[1]+10),fill=PINK+(255,),outline=(7,22,29,255),width=3);box(d,seam_labels[seam['id']][0],seam_labels[seam['id']][1],PINK,12)
 poi_labels(d)
 b,d2=board('R5 — Active core, reserve, and future seams','Green: walkable now. Purple: non-walkable visual reserve. Pink: named seams with no current route, POI, or water exception.')
 b.paste(composite(im,l),(0,120));legend(d2,[('walkable_now',GREEN),('future_expansion_reserve',VIOLET),('future_connection_seam',PINK),('active_poi',CYAN)],(28,94),4);return b
def camera():
 im=source();b=Image.new('RGB',(2560,900),BG);d=header(b,'R5 — Camera / reserve composition board','The reserve is visual framing at current scale, not unused walkable acreage. No runtime camera policy is approved.')
 full=im.copy();l=layer(full);ld=ImageDraw.Draw(l,'RGBA')
 for z in R['futureExpansionReserve']['zones']:ld.polygon(z['polygon'],fill=VIOLET+(95,),outline=VIOLET+(255,),width=3)
 b.paste(composite(full,l),(0,105));d.rectangle((0,105,1280,825),outline=GOLD,width=3);d.text((25,835),'Current draft view — whole world; reserve reads as sea/horizon beside Hero Ship.',font=f(18,True),fill=INK)
 crop=im.crop((256,72,1280,648)).resize((1280,720),Image.Resampling.LANCZOS);l2=layer(crop);ld=ImageDraw.Draw(l2,'RGBA');ld.polygon([(1020,45),(1280,35),(1280,180),(1070,155)],fill=VIOLET+(100,),outline=VIOLET+(255,),width=3);b.paste(composite(crop,l2),(1280,105));d.rectangle((1280,105,2560,825),outline=GOLD,width=3);d.text((1305,835),'Closer conceptual crop — Hero Ship and water still justify right-side visual space.',font=f(18,True),fill=INK);return b
def gate():
 im=source().crop((550,80,1280,620)).resize((900,540),Image.Resampling.LANCZOS);b=Image.new('RGB',(1600,900),BG);d=header(b,'R5 — Future Expansion Reserve Human gate','Decide whether the right-side space remains intentionally reserved while the current four-point world is completed.')
 b.paste(im,(30,125));d.rectangle((30,125,930,665),outline=GOLD,width=3)
 cards=[('ACTIVE POI NOW','4 — Hall / Workshop / Archive / Hero Ship',GREEN),('RIGHT SIDE NOW','VISUAL ONLY / NON-WALKABLE',VIOLET),('CURRENT IMPLEMENTATION','NO NEW POI OR BUILDING',CYAN),('FUTURE OPTIONS','INTERIOR HOOK / BERTH / OFFSHORE ROUTE',PINK),('RUNTIME','BLOCKED',PINK)]
 for i,(a,v,c) in enumerate(cards):
  x=980;y=130+i*100;d.rounded_rectangle((x,y,x+570,y+76),12,fill=(16,46,58),outline=c,width=3);d.text((x+16,y+10),a,font=f(14,True),fill=MUTED);d.text((x+16,y+36),v,font=f(18,True),fill=INK)
 d.text((30,725),'Deliberately not done: new building, fifth POI, water walkability, Hero deck, or a central fill object.',font=f(18),fill=MUTED);d.text((30,825),'READY_FOR_R5_FUTURE_EXPANSION_RESERVE_HUMAN_REVIEW',font=f(22,True),fill=CYAN);return b
def main():
 OUT.mkdir(parents=True,exist_ok=True);emphasis().save(OUT/'03-reserve-emphasis.png');soft().save(OUT/'04-reserve-soft-composition.png');core_seams().save(OUT/'05-active-core-reserve-seams.png');camera().save(OUT/'06-camera-reserve-board.png');gate().save(OUT/'08-human-gate-board.png')
if __name__=='__main__':main()
