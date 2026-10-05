"""Static Gate C art-upgrade compositor; no runtime files or approved geometry are changed."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import random, math, hashlib

ROOT=Path(r"C:\Users\hyun0\MyPage")
OUT=ROOT/'reports/portfolio-world-rebuild/evidence/fourth-visitable-point-foundation-upgrade'
ASSET=OUT/'upgraded-foundation'
OFFICE=OUT/'harbor-office'
OLD=ROOT/'reports/portfolio-world-rebuild/evidence/gate-c-foundation-fleet'
W,H=1920,1080
F=Path(r"C:\Windows\Fonts\segoeui.ttf"); FB=Path(r"C:\Windows\Fonts\segoeuib.ttf")
font=lambda n,b=False:ImageFont.truetype(str(FB if b else F),n)
P={
'workshop':[(185,705),(425,635),(675,690),(725,875),(545,1015),(250,975),(165,855)],
'lower':[(505,615),(835,570),(1015,650),(975,880),(755,990),(485,865)],
'central':[(875,490),(1115,465),(1245,560),(1205,700),(955,705),(850,620)],
'hero':[(1090,575),(1495,550),(1665,690),(1600,930),(1280,905),(1140,730)],
'hall':[(235,250),(735,235),(860,400),(795,555),(430,565),(235,460)],
'apron':[(405,115),(600,105),(655,245),(425,285)]}
WATER={'inner':[(1010,335),(1245,300),(1475,420),(1435,620),(1240,690),(1130,595)],'hero':[(1420,430),(1920,350),(1920,1035),(1615,1005),(1530,845),(1460,710)],'secondary':[(1015,220),(1325,235),(1400,440),(1240,520),(1060,445)],'small':[(1130,445),(1395,445),(1430,630),(1210,700),(1100,600)],'outer':[(1245,0),(1920,0),(1920,480),(1580,450),(1420,370)]}
ANCH={'P1':(430,763),'P2':(710,763),'P3':(1010,628),'P4':(905,663),'P5':(640,453),'P6':(505,213),'P7':(1435,718),'P8':(815,735)}

def mask(pts):
 m=Image.new('L',(W,H));ImageDraw.Draw(m).polygon(pts,fill=255);return m
def source(p): return Image.open(p).convert('RGBA')
def save(im,name):
 OUT.mkdir(parents=True,exist_ok=True);im.convert('RGB').save(OUT/name,'PNG',optimize=True)
 im.resize((1280,720),Image.Resampling.LANCZOS).convert('RGB').save(OUT/(Path(name).stem+'-review-1280x720.png'),'PNG',optimize=True)
def text(d,xy,s,n=22,b=True,c=(239,245,235,255)):d.text(xy,s,font=font(n,b),fill=c)
def tile(im,phase=(0,0)):
 out=Image.new('RGBA',(W,H));
 for y in range(-im.height,H+im.height,im.height):
  for x in range(-im.width,W+im.width,im.width):out.alpha_composite(im,(x+phase[0],y+phase[1]))
 return out
def apply(base,im,pts,phase=(0,0)):
 layer=tile(im,phase);clipped=Image.new('RGBA',(W,H));clipped.paste(layer,(0,0),mask(pts));base.alpha_composite(clipped)
def shadow(base,box,alpha=80,blur=16):
 s=Image.new('RGBA',(W,H));ImageDraw.Draw(s).ellipse(box,fill=(44,39,29,alpha));base.alpha_composite(s.filter(ImageFilter.GaussianBlur(blur)))

def paving(kind='plaza'):
 random.seed(18 if kind=='plaza' else 31); im=Image.new('RGBA',(512,256),(0,0,0,0));d=ImageDraw.Draw(im)
 d.rectangle((0,0,511,255),fill=(221,204,166,255) if kind=='plaza' else (199,182,146,255))
 # fine irregular dressed-stone courses; individual stones stay below player visual weight.
 h=16 if kind=='plaza' else 21
 for y in range(-h,270,h):
  x=-40+(int(y/h)%2)*13
  while x<530:
   ww=random.randint(24,46) if kind=='plaza' else random.randint(38,68)
   col=random.choice([(232,216,181,255),(218,200,159,255),(226,208,171,255),(210,192,153,255)])
   d.polygon([(x,y+2),(x+ww,y),(x+ww+7,y+h-4),(x+4,y+h)],fill=col,outline=(168,145,105,80))
   if random.random()<.17:d.line((x+7,y+h-4,x+ww-5,y+3),fill=(154,130,94,42),width=1)
   x+=ww+2
 # low-frequency wash breaks repeated tile cadence.
 d.ellipse((60,42,440,220),fill=(255,244,207,17));return im
def water():
 random.seed(62); im=Image.new('RGBA',(512,256),(27,156,181,255));d=ImageDraw.Draw(im)
 for y in range(256):
  t=y/255;d.line((0,y,512,y),fill=(28-int(8*t),166-int(40*t),188-int(28*t),255))
 for _ in range(28):
  x=random.randrange(-25,500);y=random.randrange(8,244);w=random.randrange(22,72)
  d.arc((x,y,x+w,y+random.randrange(5,12)),185,350,fill=(169,233,225,70),width=2)
 for _ in range(15):
  x=random.randrange(0,480);y=random.randrange(0,250)
  d.ellipse((x,y,x+random.randrange(12,38),y+random.randrange(4,11)),fill=(216,245,227,25))
 return im
def wall():
 im=Image.new('RGBA',(512,128),(0,0,0,0));d=ImageDraw.Draw(im);d.rectangle((0,10,511,118),fill=(159,135,96,255));d.rectangle((0,0,511,17),fill=(218,199,159,255));d.line((0,17,511,17),fill=(102,82,59,255),width=3)
 for y in range(25,118,25):
  d.line((0,y,511,y),fill=(106,86,62,150),width=2)
  for x in range((y//25%2)*45,512,90):d.line((x,y,x,y+24),fill=(106,86,62,130),width=2)
 d.rectangle((0,108,511,118),fill=(116,95,69,120));return im
def quay_edge():
 im=Image.new('RGBA',(512,96),(0,0,0,0));d=ImageDraw.Draw(im);d.rectangle((0,8,511,88),fill=(147,126,91,255));d.rectangle((0,0,511,17),fill=(230,211,170,255));d.line((0,17,511,17),fill=(103,84,58,255),width=3)
 for x in range(0,512,64):d.rectangle((x+5,30,x+58,80),outline=(104,84,60,140),width=2)
 return im
def stairs():
 im=Image.new('RGBA',(300,180),(0,0,0,0));d=ImageDraw.Draw(im)
 for i in range(7):
  y=15+i*21; inset=8+i*9; d.polygon([(inset,y),(300-inset,y),(300-inset-10,y+18),(inset+10,y+18)],fill=(220-i*5,201-i*5,160-i*5,255),outline=(133,109,77,200))
 return im
def norm_office(src,name,canvas):
 im=source(src);bbox=im.getbbox();im=im.crop(bbox);im.thumbnail(canvas,Image.Resampling.LANCZOS);out=Image.new('RGBA',canvas);out.alpha_composite(im,((canvas[0]-im.width)//2,canvas[1]-im.height));out.save(OFFICE/name)

def assets():
 ASSET.mkdir(parents=True,exist_ok=True);OFFICE.mkdir(parents=True,exist_ok=True)
 paving().save(ASSET/'f1-premium-limestone-paving.png');paving('quay').save(ASSET/'f2-continuous-quay-surface.png');quay_edge().save(ASSET/'f3-quay-wall-edge.png');stairs().save(ASSET/'f4-limestone-main-stairs.png');wall().save(ASSET/'f5-terrace-retaining-wall.png');water().save(ASSET/'w1-sheltered-turquoise-water.png')
 norm_office(OFFICE/'office-a-source.png','office-a.png',(310,230));norm_office(OFFICE/'office-b-source.png','office-b.png',(280,205))

def player(base,x,y):
 d=ImageDraw.Draw(base);l=x-14;t=y-56;d.ellipse((l+7,t,l+21,t+14),fill=(240,191,138),outline=(73,54,43));d.polygon([(l+5,t+17),(l+23,t+17),(l+25,t+39),(l+3,t+39)],fill=(34,110,146),outline=(23,56,73));d.rectangle((l+6,t+39,l+12,y-2),fill=(49,52,68));d.rectangle((l+16,t+39,l+22,y-2),fill=(49,52,68));d.ellipse((l+3,y-4,l+13,y+1),fill=(26,32,39));d.ellipse((l+15,y-4,l+25,y+1),fill=(26,32,39))
def place(base,p,xy,size=None):
 im=source(p);im=im.resize(size,Image.Resampling.LANCZOS) if size else im;base.alpha_composite(im,xy)
def board(office=None,pos=(700,505),candidate=False):
 base=Image.new('RGBA',(W,H),(207,191,151,255));d=ImageDraw.Draw(base)
 d.polygon([(0,0),(1245,0),(1420,370),(1150,640),(800,700),(0,1080)],fill=(220,207,174))
 wat=source(ASSET/'w1-sheltered-turquoise-water.png')
 for key,pts in WATER.items():
  layer=tile(wat,(23 if key in ('hero','outer') else 0,0));shade=Image.new('RGBA',(W,H),(7,63,88,30 if key in ('inner','small') else 58));layer=Image.alpha_composite(layer,shade);clip=Image.new('RGBA',(W,H));clip.paste(layer,(0,0),mask(pts));base.alpha_composite(clip)
 f1=source(ASSET/'f1-premium-limestone-paving.png');f2=source(ASSET/'f2-continuous-quay-surface.png')
 for k in ('hall','apron','lower','workshop'):apply(base,f1,P[k],(11,18))
 for k in ('central','hero'):apply(base,f2,P[k],(39,12))
 # architectural terrace thickness and integrated stairs, before buildings.
 wallim=source(ASSET/'f5-terrace-retaining-wall.png').resize((510,92),Image.Resampling.LANCZOS);base.alpha_composite(wallim,(325,510))
 st=source(ASSET/'f4-limestone-main-stairs.png').resize((200,120),Image.Resampling.LANCZOS);base.alpha_composite(st,(800,525))
 edge=source(ASSET/'f3-quay-wall-edge.png').resize((190,36),Image.Resampling.LANCZOS)
 for xy,a in [((925,505),-8),((1100,560),17),((1305,580),-3),((1480,792),19)]:base.alpha_composite(edge.rotate(a,expand=True,resample=Image.Resampling.BICUBIC),xy)
 # Soft, calm water contact beneath hulls.
 for b,a in [((1350,684,1900,770),105),((1050,432,1300,493),75),((1145,523,1284,560),48)]:shadow(base,b,a,9)
 # building/ship contact shadows precede transparent canvases.
 for b,a in [((150,270,750,335),70),((90,754,610,820),80),((1328,690,1910,806),95),((690,690,990,740),55)]:shadow(base,b,a,13)
 place(base,ROOT/'reports/portfolio-world-rebuild/evidence/canonical-landmark-assets/hall/hall-b.png',(135,0),(605,320));place(base,ROOT/'reports/portfolio-world-rebuild/evidence/canonical-landmark-assets/workshop/workshop-c.png',(85,520),(505,280));place(base,ROOT/'reports/portfolio-world-rebuild/evidence/canonical-landmark-assets/hero-ship/hero-b.png',(1325,115),(595,685));place(base,OLD/'fleet/secondary-b.png',(1045,240),(275,255));place(base,OLD/'workboats/workboat-a.png',(1140,470),(140,75))
 if office:
  shadow(base,(pos[0]+15,pos[1]+office.height-28,pos[0]+office.width-15,pos[1]+office.height+10),95,8);base.alpha_composite(office,pos)
 for k in ('P1','P5','P6','P7')+(('P8',) if office else ()):player(base,*ANCH[k])
 return base

def candidate_sheet():
 im=Image.new('RGBA',(W,H),(15,37,45,255));d=ImageDraw.Draw(im);text(d,(55,35),'HARBOR OFFICE CANDIDATES',38);text(d,(58,84),'Normalized transparent candidates · fixed 56px player and locked Workshop/Hall scale comparison',18,False,(161,210,211,255))
 a=source(OFFICE/'office-a.png');b=source(OFFICE/'office-b.png');hall=source(ROOT/'reports/portfolio-world-rebuild/evidence/canonical-landmark-assets/hall/hall-b.png').resize((300,159));work=source(ROOT/'reports/portfolio-world-rebuild/evidence/canonical-landmark-assets/workshop/workshop-c.png').resize((315,175))
 for x,label,o in [(90,'office-a',a),(655,'office-b',b)]:
  im.alpha_composite(o,(x+70,180));player(im,x+210,500);text(d,(x+50,545),label,27);text(d,(x+50,585),'Tier 2–3 · visitable',16,False,(183,212,209,255))
 im.alpha_composite(work,(1190,170));im.alpha_composite(hall,(1200,470));text(d,(1210,690),'locked scale references',18)
 return im
def placement_options():
 a=source(OFFICE/'office-a.png');b=source(OFFICE/'office-b.png');base=board();d=ImageDraw.Draw(base)
 for lab,o,pos,c in [('A',b,(700,505),(47,208,194,255)),('B',a,(760,410),(245,183,66,255)),('C',b,(1080,545),(215,114,104,255))]:
  ov=base.copy();shadow(ov,(pos[0],pos[1]+o.height-20,pos[0]+o.width,pos[1]+o.height+10),80,8);ov.alpha_composite(o,pos);od=ImageDraw.Draw(ov);od.rounded_rectangle((pos[0],pos[1]-34,pos[0]+100,pos[1]-3),8,fill=(10,39,48,220));text(od,(pos[0]+10,pos[1]-32),f'PLACE {lab}',15,True,c);ov.putalpha(115);base.alpha_composite(ov)
 d=ImageDraw.Draw(base);d.rounded_rectangle((35,35,790,120),12,fill=(9,34,43,220));text(d,(55,47),'FOURTH-POINT PLACEMENT OPTIONS',28);text(d,(55,84),'A: Lower Plaza/Central Quay join · B: Hall-side quay · C: waterfront edge',16,False,(209,232,224,255));return base
def comparison(b):
 im=Image.new('RGBA',(W,H),(12,30,38,255));can=source(ROOT/'reports/portfolio-world-rebuild/evidence/gameplay-projection-refinement/projection-a-elevated-gameplay.png');can.thumbnail((930,1015));r=b.copy();r.thumbnail((930,1015));im.alpha_composite(can,(15,55));im.alpha_composite(r,(975,55));d=ImageDraw.Draw(im);text(d,(30,12),'ORIGINAL APPROVED PROJECTION A',22);text(d,(992,12),'FOUR-POINT FOUNDATION CONVERGENCE',22);d.line((960,48,960,1065),fill=(74,179,181),width=3);return im
def nav(b):
 im=b.copy();d=ImageDraw.Draw(im);route=[ANCH[x] for x in ('P1','P2','P8','P4','P5')];r2=[ANCH[x] for x in ('P8','P3','P7')];d.line(route,fill=(245,183,67,245),width=6,joint='curve');d.line(r2,fill=(63,214,196,245),width=6,joint='curve')
 for key in ('P1','P5','P6','P7','P8'):
  x,y=ANCH[key];d.ellipse((x-10,y-10,x+10,y+10),fill=(248,248,234),outline=(28,62,68),width=2);text(d,(x+12,y-30),{'P1':'V2 Workshop','P5':'V1 Hall','P6':'V1 Hall entry','P7':'V3 Hero','P8':'V4 Office'}[key],15)
 d.rounded_rectangle((35,35,755,117),12,fill=(9,34,43,220));text(d,(55,47),'FOUR VISITABLE POINTS / ROUTE REVIEW',27);text(d,(55,82),'Workshop → Office → Hall    ·    Workshop → Office → Hero Ship',16,False,(231,221,159,255));return im
def detail(b):
 im=Image.new('RGBA',(W,H),(15,36,44,255));d=ImageDraw.Draw(im);text(d,(55,35),'UPGRADED FOUNDATION DETAIL REVIEW',36);text(d,(58,82),'Same-board crops: fine paving, terrace thickness, stairs, continuous quay, office grounding, and water edge',18,False,(161,210,211,255));regions=[('Hall Plaza',(220,230,850,570)),('Lower Plaza',(480,620,1040,1000)),('Terrace wall',(300,480,850,650)),('Main stairs',(770,500,1030,700)),('Central Quay',(870,470,1250,720)),('Hero Quay',(1150,590,1670,940)),('Office junction',(670,475,1010,760)),('Water edge',(1090,300,1570,700))];cells=[(35,140,480,500),(510,140,955,500),(985,140,1430,500),(1460,140,1885,500),(35,550,480,1035),(510,550,955,1035),(985,550,1430,1035),(1460,550,1885,1035)]
 for (lab,box),(x1,y1,x2,y2) in zip(regions,cells):
  crop=ImageOps.fit(b.crop(box),(x2-x1-16,y2-y1-48),Image.Resampling.LANCZOS);im.alpha_composite(crop,(x1+8,y1+38));d.rounded_rectangle((x1,y1,x2,y2),9,outline=(82,195,197),width=2);text(d,(x1+12,y1+9),lab,17)
 return im
def water_review(b):
 im=Image.new('RGBA',(W,H),(15,36,44,255));d=ImageDraw.Draw(im);text(d,(55,35),'UPGRADED WATER / BERTH REVIEW',36);regions=[('Hero contact',(1325,430,1920,930)),('Secondary contact',(1010,230,1400,525)),('Workboat contact',(1120,445,1400,620))];cells=[(35,150,635,1025),(665,150,1265,1025),(1295,150,1885,1025)]
 for (lab,box),(x1,y1,x2,y2) in zip(regions,cells):
  crop=ImageOps.fit(b.crop(box),(x2-x1-16,y2-y1-50),Image.Resampling.LANCZOS);im.alpha_composite(crop,(x1+8,y1+40));d.rounded_rectangle((x1,y1,x2,y2),9,outline=(82,195,197),width=2);text(d,(x1+12,y1+9),lab,18)
 return im
def main():
 assets();rec=board(source(OFFICE/'office-b.png'),(700,505));save(placement_options(),'01-fourth-point-placement-options.png');save(rec,'02-four-point-foundation-convergence.png');save(comparison(rec),'03-canonical-vs-four-point-convergence.png');save(nav(rec),'04-four-point-navigation-review.png');save(detail(rec),'05-upgraded-foundation-detail-review.png');save(water_review(rec),'06-upgraded-water-berth-review.png');save(candidate_sheet(),'07-harbor-office-candidate-sheet.png')
if __name__=='__main__':main()
