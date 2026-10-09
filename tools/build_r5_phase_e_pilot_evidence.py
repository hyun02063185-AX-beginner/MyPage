"""Render Phase E pilot evidence from separate RGBA prototype assets; no runtime files are touched."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
D=json.loads((ROOT/'data/portfolio-world/r5-production-art-feasibility-draft.json').read_text(encoding='utf8'))
OUT=ROOT/D['evidence']['folder']; FONT='C:/Windows/Fonts/segoeui.ttf'; BOLD='C:/Windows/Fonts/segoeuib.ttf'
BG=(10,27,37);INK=(239,245,240);MUTED=(180,208,212);GOLD=(244,194,75);CYAN=(59,218,230);GREEN=(130,214,113);VIOLET=(166,115,244);PINK=(245,105,165);ORANGE=(244,147,57);RED=(232,91,91)
def f(n,b=False):return ImageFont.truetype(BOLD if b else FONT,n)
def source():return Image.open(ROOT/D['sourceMaster']['path']).convert('RGBA')
def sprite():return Image.open(ROOT/'portfolio-world/public/assets/canonical-r4/runtime/player/idle-front.png').convert('RGBA')
def pilot(i):return Image.open(ROOT/D['actualPilotAssets'][i]['path']).convert('RGBA')
def board(t,s,size):
 im=Image.new('RGB',size,BG);d=ImageDraw.Draw(im);d.text((28,20),t,font=f(30,True),fill=(255,233,189));d.text((30,61),s,font=f(16),fill=MUTED);return im,d
def wrap(d,x,y,text,width,size=16,color=MUTED):
 words=text.split();line=''
 for word in words:
  trial=(line+' '+word).strip()
  if line and d.textlength(trial,font=f(size))>width:d.text((x,y),line,font=f(size),fill=color);y+=size+5;line=word
  else:line=trial
 if line:d.text((x,y),line,font=f(size),fill=color)
def clamp(x,a,b):return max(a,min(b,x))
def crop_world(center,zoom=1.25,size=(640,360)):
 im=source();vw,vh=1024/zoom,576/zoom;l=round(clamp(center[0]-vw/2,0,1280-vw));t=round(clamp(center[1]-vh/2,0,720-vh));raw=im.crop((l,t,l+round(vw),t+round(vh))).resize(size,Image.Resampling.LANCZOS);return raw,(l,t),(size[0]/round(vw),size[1]/round(vh))
def add_player(im,feet,camera,scale,front=False):
 sx,sy=scale;w=round(28*sx);h=round(56*sy);p=sprite().resize((max(1,w),max(1,h)),Image.Resampling.NEAREST);x=round((feet[0]-camera[0])*sx);y=round((feet[1]-camera[1])*sy);im.alpha_composite(p,(x-w//2,y-h));return x,y
def add_pilot(im,index,camera,scale):
 info=D['actualPilotAssets'][index];p=pilot(index).resize((round(info['placementWorld']['width']*scale[0]),round(info['placementWorld']['height']*scale[1])),Image.Resampling.LANCZOS);x=round((info['placementWorld']['x']-camera[0])*scale[0]);y=round((info['placementWorld']['y']-camera[1])*scale[1]);im.alpha_composite(p,(x,y));return x,y,p.size
def checker(w,h):
 im=Image.new('RGB',(w,h),(50,60,67));d=ImageDraw.Draw(im);s=22
 for y in range(0,h,s):
  for x in range(0,w,s):
   if (x//s+y//s)%2==0:d.rectangle((x,y,x+s,y+s),fill=(83,95,100))
 return im.convert('RGBA')
def layer_breakdown():
 src=source().convert('RGB');im,d=board('R5 Phase E — Candidate B Layer Breakdown','Classification is a production audit. It does not pretend that painted regions are already transparent game layers.',(1800,1030));im.paste(src.resize((1120,630),Image.Resampling.LANCZOS),(30,125));boxes=[('L01 DISTANT\nREUSABLE REF', (650,130,1120,280),GREEN),('L04 HALL\nREAUTHOR', (35,130,395,330),RED),('L03 TERRAIN\nREAUTHOR', (35,420,590,750),ORANGE),('L05 PIER/DOCK\nREAUTHOR', (510,360,935,540),ORANGE),('L06 HERO SHIP\nREAUTHOR', (900,290,1135,610),RED),('L07 FOREGROUND\nPILOTED', (30,640,560,750),VIOLET)]
 for text,(x1,y1,x2,y2),c in boxes:d.rectangle((x1,y1,x2,y2),outline=c,width=4);d.text((x1+8,y1+8),text,font=f(15,True),fill=INK)
 x=1200;d.text((x,140),'PRODUCTION READING',font=f(22,True),fill=(255,233,189));wrap(d,x,185,'The scenic source retains composition and color direction. Anything the moving player or camera can expose behind structures is reauthor-required.',540,18);d.text((x,420),'PILOT EVIDENCE',font=f(22,True),fill=VIOLET);wrap(d,x,465,'Two separate RGBA pilots prove alpha ordering. They do not solve hidden terrain, water, architecture, or static-person cleanup.',540,18);return im
def pilot_panel(index,title,anchor_id):
 a=D['groundAnchors'][anchor_id];base,cam,sc=crop_world(a,1.25,(640,360));comp=base.copy();add_player(comp,a,cam,sc);add_pilot(comp,index,cam,sc);asset=checker(520,300);p=pilot(index);p.thumbnail((500,280),Image.Resampling.LANCZOS);asset.alpha_composite(p,((520-p.width)//2,(300-p.height)//2));im,d=board(title,'Left: Candidate B camera crop. Center: actual transparent pilot on checkerboard. Right: player first, pilot foreground second.',(1980,650));im.paste(base.convert('RGB'),(30,125));im.paste(asset.convert('RGB'),(730,155));im.paste(comp.convert('RGB'),(1310,125));
 for x,label in [(30,'SOURCE SCENIC REFERENCE'),(730,'RGBA PILOT ASSET'),(1310,'LAYERED PILOT COMPOSITE')]:d.rectangle((x,125,x+(640 if x!=730 else 520),485 if x!=730 else 455),outline=GOLD,width=3);d.text((x,505),label,font=f(17,True),fill=INK)
 d.text((30,575),f'Anchor {anchor_id}: {a[0]},{a[1]} · 28×56 player · zoom 1.25 · candidate source remains unchanged',font=f(16),fill=CYAN);return im
def occlusion_compare():
 a=D['groundAnchors']['workshop'];base,cam,sc=crop_world(a,1.25,(760,428));wrong=base.copy();add_pilot(wrong,0,cam,sc);add_player(wrong,a,cam,sc);correct=base.copy();add_player(correct,a,cam,sc);add_pilot(correct,0,cam,sc);im,d=board('R5 Phase E — Player Occlusion Comparison','The same player and anchor demonstrate why foreground depth order matters.',(1650,650));im.paste(wrong.convert('RGB'),(30,125));im.paste(correct.convert('RGB'),(850,125));d.rectangle((30,125,790,553),outline=RED,width=3);d.rectangle((850,125,1610,553),outline=GREEN,width=3);d.text((30,575),'INCORRECT: foreground drawn first, player floats in front of rail/wall',font=f(18,True),fill=RED);d.text((850,575),'CORRECT PILOT: player drawn first, opaque foreground occludes naturally',font=f(18,True),fill=GREEN);return im
def five_locations():
 places=[('Hall approach','hallStairBase'),('Workshop','workshop'),('Harbor Archive','archive'),('Central Promenade','promenade'),('Hero threshold','heroThreshold')];im,d=board('R5 Phase E — Five-Location Gameplay Composition','Real C.2 anchor positions, 28×56 fixed player, zoom 1.25. Only Workshop and Hero have actual foreground pilot assets in this phase.',(2250,640))
 for i,(name,key) in enumerate(places):
  a=D['groundAnchors'][key];tile,cam,sc=crop_world(a,1.25,(400,225));add_player(tile,a,cam,sc);x=25+i*445;im.paste(tile.convert('RGB'),(x,130));d.rectangle((x,130,x+400,355),outline=GOLD,width=2);d.text((x,370),name,font=f(16,True),fill=INK);d.text((x,394),f'{a[0]},{a[1]}',font=f(14),fill=MUTED);d.text((x,420),'PILOT LAYER: YES' if key in ['workshop','heroThreshold'] else 'PILOT LAYER: NOT YET',font=f(13,True),fill=GREEN if key in ['workshop','heroThreshold'] else ORANGE)
 d.text((28,565),'This is a composition/readability review, not a claim that unpiloted locations have finished production layers.',font=f(17,True),fill=CYAN);return im
def beauty_compare():
 a=D['groundAnchors']['heroThreshold'];base,cam,sc=crop_world(a,1.25,(720,405));comp=base.copy();add_player(comp,a,cam,sc);add_pilot(comp,1,cam,sc);im,d=board('R5 Phase E — Beauty Master vs Production Pilot','Candidate B composition is retained as reference; the pilot exposes where independently authored layers diverge and need art direction.',(1600,670));im.paste(base.convert('RGB'),(30,125));im.paste(comp.convert('RGB'),(850,125));d.rectangle((30,125,750,530),outline=GOLD,width=3);d.rectangle((850,125,1570,530),outline=VIOLET,width=3);d.text((30,550),'BEAUTY MASTER CAMERA CROP',font=f(18,True),fill=INK);d.text((850,550),'SEPARATE RGBA DOCK/HULL PILOT',font=f(18,True),fill=INK);d.text((30,610),'QA: composition direction holds; exact dock/hull geometry, waterline and lighting still require a matched authored production pass.',font=f(16),fill=CYAN);return im
def final_board():
 im,d=board('R5 Phase E — Final Human Review Board','Actual RGBA pilots exist, but full production art remains conditional because the scenic source is not a complete playable layer kit.',(1600,900));im.paste(source().resize((650,366),Image.Resampling.LANCZOS).convert('RGB'),(30,130));cards=[('TWO RGBA PILOTS','CREATED / ALPHA-VALIDATED',GREEN),('LAYER MECHANIC','FEASIBLE',GREEN),('CANDIDATE B MATCH','REAUTHOR REQUIRED',ORANGE),('HIDDEN TERRAIN / WATER','BLOCKER',RED),('R4 / R5 RUNTIME','NOT MODIFIED / BLOCKED',PINK),('HUMAN DESIGN APPROVAL','PENDING',GOLD)]
 for i,(a,b,c) in enumerate(cards):
  x=750;y=130+i*88;d.rounded_rectangle((x,y,x+790,y+66),12,fill=(17,47,59),outline=c,width=3);d.text((x+16,y+9),a,font=f(14,True),fill=MUTED);d.text((x+16,y+33),b,font=f(18,True),fill=INK)
 d.text((30,810),'GATE: CONDITIONAL_REWORK_REQUIRED',font=f(26,True),fill=ORANGE);return im
def main():
 OUT.mkdir(parents=True,exist_ok=True)
 outputs=[('11-candidate-b-layer-breakdown.png',layer_breakdown),('12-workshop-hall-layer-pilot.png',lambda:pilot_panel(0,'R5 Phase E — Workshop / Hall Layer Pilot','workshop')),('13-hero-ship-water-layer-pilot.png',lambda:pilot_panel(1,'R5 Phase E — Hero Ship / Water Layer Pilot','heroThreshold')),('14-player-occlusion-comparison.png',occlusion_compare),('15-five-location-gameplay-composition.png',five_locations),('16-beauty-master-vs-production-pilot.png',beauty_compare),('17-final-human-review-board.png',final_board)]
 for name,fn in outputs:fn().save(OUT/name)
if __name__=='__main__':main()
