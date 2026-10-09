"""Render Phase D content/world/camera review boards from draft contracts only."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[1]; DATA=json.loads((ROOT/'data/portfolio-world/r5-world-content-camera-draft.json').read_text(encoding='utf8')); C1=json.loads((ROOT/'data/portfolio-world/r5-spatial-blueprint-c1-draft.json').read_text(encoding='utf8')); C2=json.loads((ROOT/'data/portfolio-world/r5-spatial-blueprint-c2-draft.json').read_text(encoding='utf8')); RES=json.loads((ROOT/'data/portfolio-world/r5-future-expansion-reserve-draft.json').read_text(encoding='utf8')); OUT=ROOT/'reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-d'
FONT='C:/Windows/Fonts/segoeui.ttf';BOLD='C:/Windows/Fonts/segoeuib.ttf';BG=(10,27,37);INK=(239,245,240);MUTED=(185,212,213);GOLD=(244,194,75);CYAN=(59,218,230);GREEN=(130,214,113);ORANGE=(244,147,57);PINK=(245,105,165);VIOLET=(166,115,244);RED=(232,91,91)
def f(n,b=False):return ImageFont.truetype(BOLD if b else FONT,n)
def overlay(base,patch):d={x['id']:x for x in base};d.update({x['id']:x for x in patch});return list(d.values())
NODES={x['id']:x for x in overlay(C1['navigationNodes'],C2['geometryOverrides']['navigationNodes'])};WALK=overlay(C1['walkableZones'],C2['geometryOverrides']['walkableZones'])
def source():return Image.open(ROOT/DATA['referenceMaster']['path']).convert('RGB')
def lay(im):return Image.new('RGBA',im.size,(0,0,0,0))
def comp(im,l):return Image.alpha_composite(im.convert('RGBA'),l).convert('RGB')
def header(b,t,s):d=ImageDraw.Draw(b);d.text((28,19),t,font=f(30,True),fill=(255,234,190));d.text((30,58),s,font=f(17),fill=MUTED);return d
def box(d,p,t,c=GOLD,s=15):
 x,y=p;bb=d.textbbox((x,y),t,font=f(s,True));d.rounded_rectangle((x-5,y-4,bb[2]+5,bb[3]+4),6,fill=(7,23,31,235),outline=c+(255,),width=2);d.text((x,y),t,font=f(s,True),fill=INK)
def legend(d,items,origin=(28,95),cols=4):
 x0,y0=origin
 for i,(t,c) in enumerate(items):
  x=x0+(i%cols)*300;y=y0+(i//cols)*28;d.rounded_rectangle((x,y+4,x+18,y+22),3,fill=c);d.text((x+27,y),t,font=f(15,True),fill=INK)
def board(t,s,w=1280,h=845):b=Image.new('RGB',(w,h),BG);return b,header(b,t,s)
def destination_map():
 im=source();l=lay(im);d=ImageDraw.Draw(l,'RGBA');positions={'hall':(175,190),'workshop':(245,440),'archive':(180,560),'hero_ship':(1028,355)}
 for m in DATA['poiContentMappingOptions']['recommended']['mapping']:
  x,y=positions[m['poiId']];d.ellipse((x-10,y-10,x+10,y+10),fill=GREEN+(255,),outline=(7,22,29,255),width=3);box(d,(x+14,y-34),m['displayName'],GREEN,14);box(d,(x+14,y-12),m['targetPath'].replace('../',''),CYAN,13)
 b,d2=board('R5 Phase D — Four-POI content destination map','Recommended mapping only: no R5 interaction is implemented. Labels identify existing static content pages.')
 b.paste(comp(im,l),(0,120));legend(d2,[('active POI (4)',GREEN),('existing page target',CYAN),('recommended pending Human',GOLD)],(28,94),3);return b
def boundary_comparison():
 b,d=board('R5 Phase D — World-boundary comparison','Technical world plans, not enlarged/pasted Beauty Masters. Every area outside the current art-directed core needs authored scenery/terrain. ',w=2560,h=1000)
 opts=DATA['worldExtentOptions']
 for index,opt in enumerate(opts):
  x0=index*1280+55;y0=145;scale=.53;ww=int(opt['world'][0]*scale);hh=int(opt['world'][1]*scale);cw=int(opt['coreEnvelope'][0]*scale);ch=int(opt['coreEnvelope'][1]*scale)
  d.rounded_rectangle((x0,y0,x0+ww,y0+hh),18,fill=(25,66,79),outline=CYAN,width=4);d.rectangle((x0,y0,x0+cw,y0+ch),fill=(53,108,89),outline=GREEN,width=4);d.rectangle((x0+cw,y0,x0+ww,y0+hh),fill=(75,57,110),outline=VIOLET,width=3)
  d.text((x0,y0-48),('A — Compact Exploration' if index==0 else 'B — Expandable Continuous Harbor'),font=f(28,True),fill=(255,232,184));d.text((x0+18,y0+18),'CURRENT FOUR-POI CORE',font=f(19,True),fill=INK);d.text((x0+cw+18,y0+46),'SCENIC / RESERVE',font=f(17,True),fill=INK)
  vieww=int(1024*scale);viewh=int(576*scale);d.rectangle((x0+cw//2-vieww//2,y0+ch//2-viewh//2,x0+cw//2+vieww//2,y0+ch//2+viewh//2),outline=GOLD,width=4);d.text((x0+18,y0+hh+22),f"World {opt['world'][0]}×{opt['world'][1]} · travel at z1: {opt['cameraTravelAtZoom1'][0]}×{opt['cameraTravelAtZoom1'][1]}",font=f(18,True),fill=INK);d.text((x0+18,y0+hh+52),opt['artRequirement'],font=f(15),fill=MUTED,spacing=4)
 legend(d,[('current core (requires authored R5 terrain)',GREEN),('scenic / future reserve, not walkable',VIOLET),('1024×576 gameplay viewport',GOLD),('world boundary',CYAN)],(40,920),4);return b
def crop(im,center,extent):
 w,h=extent;x,y=center;left=max(0,min(im.width-w,int(x-w/2)));top=max(0,min(im.height-h,int(y-h/2)));return im.crop((left,top,left+w,top+h)),(left,top)
def camera_board():
 im=source();player=Image.open(ROOT/'portfolio-world/public/assets/canonical-r4/runtime/player/idle-front.png').convert('RGBA');views=[('Hall stair',NODES['N_HALL']['point']),('Workshop',NODES['N_WORKSHOP']['point']),('Hero approach',NODES['N_HERO']['point'])];cams=DATA['cameraOptions'];b=Image.new('RGB',(2560,1220),BG);d=header(b,'R5 Phase D — Camera / player-scale conceptual comparison','Player and scenery use the same world-to-screen transform in each crop. These are concept simulations, not Phaser captures.')
 for row,cam in enumerate(cams):
  y=105+row*350;d.text((22,y),cam['id'].replace('_',' '),font=f(21,True),fill=(255,232,184));d.text((22,y+28),f"screen player {cam['screenHeight']}px · visible {cam['visibleWorld'][0]:.1f}×{cam['visibleWorld'][1]:.1f}",font=f(15),fill=MUTED)
  for col,(name,pos) in enumerate(views):
   ext=(round(cam['visibleWorld'][0]),round(cam['visibleWorld'][1]));raw,(left,top)=crop(im,pos,ext);tile=raw.resize((480,270),Image.Resampling.LANCZOS).convert('RGBA');sx=480/ext[0];sy=270/ext[1];visual=cam['playerVisual'];spr=player.resize((max(1,round(visual[0]*cam['zoom']*sx)),max(1,round(visual[1]*cam['zoom']*sy))),Image.Resampling.NEAREST);px=round((pos[0]-left)*sx);py=round((pos[1]-top)*sy);td=ImageDraw.Draw(tile,'RGBA');td.ellipse((px-4,py-4,px+4,py+4),fill=GOLD+(255,));tile.alpha_composite(spr,(px-spr.width//2,py-spr.height));x=620+col*635;b.paste(tile.convert('RGB'),(x,y));d.rectangle((x,y,x+480,y+270),outline=GOLD,width=2);d.text((x,y+278),name,font=f(17,True),fill=INK)
 d.text((30,1168),'Read: use 28×56 / 1.25 as the first gameplay-camera test; offer a separate overview affordance rather than shrinking the normal player view.',font=f(18),fill=MUTED);return b
def seams():
 im=source();l=lay(im);d=ImageDraw.Draw(l,'RGBA')
 for z in WALK:d.polygon(z['polygon'],fill=GREEN+(65,),outline=GREEN+(170,),width=2)
 for z in RES['futureExpansionReserve']['zones']:d.polygon(z['polygon'],fill=VIOLET+(105,),outline=VIOLET+(255,),width=3)
 places={'SEAM_HERO_INTERIOR_HOOK':((1050,300),'HERO INTERIOR\nFUTURE ONLY'),'SEAM_EAST_AUXILIARY_BERTH':((900,485),'AUXILIARY BERTH\nFUTURE ONLY'),'SEAM_OFFSHORE_ROUTE':((1080,205),'OFFSHORE ROUTE\nFUTURE ONLY')}
 reserve_seams={seam['id']:seam for seam in RES['futureConnectionSeams']}
 for seam in DATA['futureConnectionSeams']:
  anchor=reserve_seams[seam['id']]['anchor'];p=NODES[anchor]['point'] if isinstance(anchor,str) else anchor;d.ellipse((p[0]-10,p[1]-10,p[0]+10,p[1]+10),fill=PINK+(255,),outline=(7,22,29,255),width=3);box(d,places[seam['id']][0],places[seam['id']][1],PINK,12)
 b,d2=board('R5 Phase D — Future-expansion seams','Current core stays active. Reserve and seams are non-walkable / inactive until their distinct authored requirements are approved.')
 b.paste(comp(im,l),(0,120));legend(d2,[('CORE_WORLD walkable now',GREEN),('FUTURE_EXPANSION_RESERVE visual-only',VIOLET),('FUTURE_CONNECTION_SEAM inactive',PINK)],(28,94),3);return b
def decision():
 im=source().crop((400,100,1280,600)).resize((900,510),Image.Resampling.LANCZOS);b=Image.new('RGB',(1600,900),BG);d=header(b,'R5 Phase D — Content / World Human decision board','Approve a content mapping and planning direction, not a final Candidate B master or Runtime implementation.')
 b.paste(im,(30,125));d.rectangle((30,125,930,635),outline=GOLD,width=3);cards=[('FOUR ACTIVE POI','PRESERVED',GREEN),('CONTENT INVENTORY','VERIFIED',GREEN),('POI CONTENT MAPPING','RECOMMENDED / PENDING HUMAN',GOLD),('WORLD EXTENTS','OPTIONS PREPARED',CYAN),('CAMERA / PLAYER SCALE','OPTIONS PREPARED / PENDING HUMAN',CYAN),('RUNTIME','BLOCKED',PINK)]
 for i,(a,v,c) in enumerate(cards):
  x=980;y=130+i*92;d.rounded_rectangle((x,y,x+570,y+70),12,fill=(16,46,58),outline=c,width=3);d.text((x+16,y+10),a,font=f(14,True),fill=MUTED);d.text((x+16,y+34),v,font=f(18,True),fill=INK)
 d.text((30,690),'Recommended planning: Content mapping as shown; Expandable Continuous Harbor (B); 28×56 player at 1.25 gameplay zoom plus later overview.',font=f(17,True),fill=(255,232,184));d.text((30,825),'READY_FOR_R5_PHASE_D_CONTENT_WORLD_HUMAN_GATE',font=f(22,True),fill=CYAN);return b
def main():
 OUT.mkdir(parents=True,exist_ok=True);destination_map().save(OUT/'06-content-destination-map.png');boundary_comparison().save(OUT/'07-world-boundary-comparison.png');camera_board().save(OUT/'08-camera-scale-comparison.png');seams().save(OUT/'09-future-expansion-seams.png');decision().save(OUT/'10-final-design-decision-board.png')
if __name__=='__main__':main()
