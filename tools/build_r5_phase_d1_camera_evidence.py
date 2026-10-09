"""Render R5 D.1 calibration boards using merged C.2 anchors and one camera transform."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
D=json.loads((ROOT/'data/portfolio-world/r5-camera-viewport-calibration-draft.json').read_text(encoding='utf8'))
OUT=ROOT/D['evidence']['folder']; FONT='C:/Windows/Fonts/segoeui.ttf'; BOLD='C:/Windows/Fonts/segoeuib.ttf'
BG=(10,27,37);INK=(239,245,240);MUTED=(180,208,212);GOLD=(244,194,75);CYAN=(59,218,230);GREEN=(130,214,113);VIOLET=(166,115,244);PINK=(245,105,165);ORANGE=(244,147,57)
def f(n,b=False):return ImageFont.truetype(BOLD if b else FONT,n)
def src():return Image.open(ROOT/D['referenceMaster']['path']).convert('RGB')
def player():return Image.open(ROOT/'portfolio-world/public/assets/canonical-r4/runtime/player/idle-front.png').convert('RGBA')
def board(title,sub,size):
 im=Image.new('RGB',size,BG);d=ImageDraw.Draw(im);d.text((28,20),title,font=f(30,True),fill=(255,233,189));d.text((30,61),sub,font=f(16),fill=MUTED);return im,d
def textwrap(d,x,y,text,width,size=16,color=MUTED):
 words=text.split();line=''
 for word in words:
  trial=(line+' '+word).strip()
  if d.textlength(trial,font=f(size))>width and line:d.text((x,y),line,font=f(size),fill=color);y+=size+5;line=word
  else:line=trial
 if line:d.text((x,y),line,font=f(size),fill=color)
def anchors():return {a['id']:a for a in D['groundAnchors']}
def clamp(n,low,high):return max(low,min(high,n))
def camera_crop(image, feet, viewport, zoom, target_size):
 """One transform: crop visible world then resize; player is scaled only by crop scale."""
 vw,vh=viewport[0]/zoom,viewport[1]/zoom; left=clamp(feet[0]-vw/2,0,1280-vw);top=clamp(feet[1]-vh/2,0,720-vh)
 # image crop accepts integral source pixels; computation is retained for the formula and diagram values.
 left_i=round(left);top_i=round(top);vw_i=round(vw);vh_i=round(vh);tile=image.crop((left_i,top_i,left_i+vw_i,top_i+vh_i)).resize(target_size,Image.Resampling.LANCZOS).convert('RGBA')
 sx=target_size[0]/vw_i;sy=target_size[1]/vh_i;return tile,(left_i,top_i),(sx,sy)
def place(tile, feet, crop_pos, scale, world_size):
 """Bottom-center foot anchor: no additional zoom beyond the crop scale."""
 sx,sy=scale;w=max(1,round(world_size[0]*sx));h=max(1,round(world_size[1]*sy));spr=player().resize((w,h),Image.Resampling.NEAREST);x=round((feet[0]-crop_pos[0])*sx);y=round((feet[1]-crop_pos[1])*sy);ImageDraw.Draw(tile).ellipse((x-4,y-4,x+4,y+4),fill=GOLD);tile.alpha_composite(spr,(x-w//2,y-h));return (x,y,w,h)
def corrected_comparison():
 image=src();a=anchors()['N_WORKSHOP'];im,d=board('R5 D.1 — Corrected Camera Transform','Same Workshop ground anchor, same crop transform. The old player-only duplicate zoom is removed.',(1800,910));opts=D['playerScaleOptions']
 for i,opt in enumerate(opts):
  x=35+i*585;y=130;tile,cpos,scale=camera_crop(image,a['point'],[1024,576],opt['zoom'],(540,304));x0,y0,w,h=place(tile,a['point'],cpos,scale,opt['worldSize']);im.paste(tile.convert('RGB'),(x,y));d.rectangle((x,y,x+540,y+304),outline=GOLD,width=2);d.text((x,y+320),opt['id'].replace('_',' '),font=f(18,True),fill=INK);d.text((x,y+350),f"logical player {opt['logicalScreenSize'][0]}×{opt['logicalScreenSize'][1]} px",font=f(16),fill=CYAN);d.text((x,y+378),f"preview sprite {w}×{h}px · feet ({x0},{y0})",font=f(15),fill=MUTED)
 d.text((35,800),'Correct rule: player preview size = player-world size × (thumbnail size / visible world area). Zoom appears once through visible world area.',font=f(18,True),fill=CYAN);return im
def native_scale():
 im,d=board('R5 D.1 — Player Native Logical Scale','Logical screen sizes are independent of CSS display size. Rectangles are true-size representations on a 1024×576 logical canvas.',(1600,920));x0,y0=55,135;scale=.9;d.rectangle((x0,y0,x0+1024*scale,y0+576*scale),outline=CYAN,width=3);d.text((x0,y0-32),'1024×576 LOGICAL VIEWPORT',font=f(18,True),fill=INK)
 colors=[GREEN,GOLD,VIOLET]
 for i,opt in enumerate(D['playerScaleOptions']):
  x=x0+140+i*285;y=y0+280;w,h=opt['logicalScreenSize'];d.rectangle((x,y-h*scale,x+w*scale,y),fill=colors[i],outline=INK,width=2);d.line((x-25,y,x+max(55,w*scale)+25,y),fill=colors[i],width=2);d.text((x-40,y+18),opt['id'].replace('_',' '),font=f(16,True),fill=INK);d.text((x-40,y+44),f"{w}×{h} logical px",font=f(15),fill=MUTED)
 d.text((1020,180),'INTERPRETATION',font=f(20,True),fill=(255,233,189));textwrap(d,1020,220,'28×56 at zoom 1.25 becomes 35×70 logical pixels. It is not a new character asset and it is not multiplied again by preview scale.',520,18);d.text((1020,410),'GROUND CONTACT',font=f(20,True),fill=(255,233,189));textwrap(d,1020,450,'Every sprite uses bottom-center feet at a merged C.2 ground anchor. The colored baseline is the contact point, not water or a hull.',520,18);return im
def five_locations():
 image=src(); places=[('Hall / Main Stairs','N_HALL_STAIR_BASE'),('Workshop','N_WORKSHOP'),('Harbor Archive','N_ARCHIVE'),('Central Promenade','N_PROMENADE'),('Hero Boarding Threshold','N_HERO')];im,d=board('R5 D.1 — Five-Location Gameplay Review','All rows use the exact same C.2 merged point for each location; only player scale / camera zoom changes.',(2450,1250))
 for r,opt in enumerate(D['playerScaleOptions']):
  y=115+r*360;d.text((24,y),opt['id'].replace('_',' '),font=f(19,True),fill=(255,233,189));d.text((24,y+28),f"player {opt['worldSize'][0]}×{opt['worldSize'][1]}, zoom {opt['zoom']}; logical {opt['logicalScreenSize'][0]}×{opt['logicalScreenSize'][1]}",font=f(14),fill=MUTED)
  for c,(name,nid) in enumerate(places):
   anchor=anchors()[nid];tile,cpos,scale=camera_crop(image,anchor['point'],[1024,576],opt['zoom'],(390,219));place(tile,anchor['point'],cpos,scale,opt['worldSize']);x=315+c*420;im.paste(tile.convert('RGB'),(x,y));d.rectangle((x,y,x+390,y+219),outline=GOLD,width=2);d.text((x,y+228),name,font=f(14,True),fill=INK);d.text((x,y+249),f"{nid}: {anchor['point'][0]},{anchor['point'][1]} · {anchor['surface']}",font=f(12),fill=MUTED)
 d.text((28,1210),'Ground checks: every anchor is on its named merged C.2 surface and outside solid building/cliff/hull collision; sea overlap is allowed only on named Pier/Dock/Gangway surfaces. Hero remains a threshold only.',font=f(17,True),fill=CYAN);return im
def boundaries():
 image=src();im,d=board('R5 D.1 — Camera Boundary and Travel Review','Camera rectangles are clamped to 1280×720 review bounds. They illustrate view coverage, not a final world-size decision.',(2050,1050));configs=D['viewportConfigurations']
 for i,cfg in enumerate(configs):
  x=35+(i%2)*1000;y=135+(i//2)*430;tile=image.resize((820,461),Image.Resampling.LANCZOS);im.paste(tile,(x,y));scale=820/1280;vw,vh=cfg['visibleWorld'];rect=(x+(820-vw*scale)/2,y+(461-vh*scale)/2,x+(820+vw*scale)/2,y+(461+vh*scale)/2);d.rectangle(rect,outline=GOLD,width=4);d.rectangle((x,y,x+820,y+461),outline=CYAN,width=3);d.text((x,y+475),cfg['id'].replace('_',' '),font=f(18,True),fill=INK);d.text((x,y+504),f"visible {vw:.1f}×{vh:.1f} · travel {cfg['cameraTravel'][0]:.1f}×{cfg['cameraTravel'][1]:.1f}",font=f(15),fill=MUTED)
 d.text((35,1010),'CYAN: 1280×720 candidate review bounds · GOLD: visible world area when camera targets a central location · clamp prevents blank edge exposure.',font=f(16,True),fill=CYAN);return im
def decision_board():
 image=src();im,d=board('R5 D.1 — Approved Mapping / Pending Camera Decision','One Human decision is recorded; camera and world selections remain review choices.',(1600,910));im.paste(image.resize((700,394),Image.Resampling.LANCZOS),(30,130));d.rectangle((30,130,730,524),outline=GOLD,width=3)
 cards=[('CONTENT MAPPING','A_STORYTELLING · HUMAN APPROVED',GREEN),('IMPLEMENTATION','NOT IMPLEMENTED',PINK),('RIGHT RESERVE','APPROVED · VISUAL ONLY',GREEN),('CAMERA / VIEWPORT','PENDING HUMAN',GOLD),('WORLD BOUNDS','PENDING HUMAN',GOLD),('R5 RUNTIME','BLOCKED',PINK)]
 for i,(a,b,c) in enumerate(cards):
  x=790;y=130+i*88;d.rounded_rectangle((x,y,x+760,y+66),12,fill=(17,47,59),outline=c,width=3);d.text((x+16,y+9),a,font=f(14,True),fill=MUTED);d.text((x+16,y+33),b,font=f(18,True),fill=INK)
 d.text((30,770),'Recommendation for Human review: compare 1024×576 at 1.25 with the separate overview pattern before changing player art or final world bounds.',font=f(17,True),fill=(255,233,189));d.text((30,840),D['humanGate']['gate'],font=f(22,True),fill=CYAN);return im
def main():
 OUT.mkdir(parents=True,exist_ok=True)
 for name,fn in [('04-corrected-camera-comparison.png',corrected_comparison),('05-player-native-scale-review.png',native_scale),('06-five-location-gameplay-review.png',five_locations),('07-camera-boundary-and-travel.png',boundaries),('11-human-decision-board.png',decision_board)]:fn().save(OUT/name)
if __name__=='__main__':main()
