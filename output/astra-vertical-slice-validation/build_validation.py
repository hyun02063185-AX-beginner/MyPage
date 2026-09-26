"""Reproducible asset normalization and compositing. Never loads the master as scene art."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps, ImageChops
import numpy as np
import json, shutil, math, hashlib

ROOT = Path(__file__).resolve().parent
W, H = 1920, 1080
RESAMPLE = Image.Resampling.LANCZOS
MANIFEST = json.loads((ROOT/'source-manifest.json').read_text(encoding='utf-8'))
ASSETS, META = {}, {}
for folder in ['sources', 'evidence', 'assets/ships', 'assets/buildings', 'assets/environment', 'assets/props']:
    (ROOT/folder).mkdir(parents=True, exist_ok=True)

def periodic_tile(im):
    # Reflection tiling makes opposite pixel boundaries identical without painting new art.
    im = im.convert('RGB').resize((256,256),RESAMPLE)
    out = Image.new('RGB',(512,512))
    out.paste(im,(0,0)); out.paste(ImageOps.mirror(im),(256,0))
    out.paste(ImageOps.flip(im),(0,256)); out.paste(ImageOps.flip(ImageOps.mirror(im)),(256,256))
    return out

def prepare():
    for e in MANIFEST:
        raw=ROOT/'sources'/f"{e['id']}.png"
        if not raw.exists():
            shutil.copy2(e['source'], raw)
        im=Image.open(raw).convert('RGBA')
        source_size=im.size
        if e['transparent']:
            box=im.getchannel('A').point(lambda p:255 if p>32 else 0).getbbox()
            box=(max(0,box[0]-3),max(0,box[1]-3),min(im.width,box[2]+3),min(im.height,box[3]+3))
            im=im.crop(box)
        else:
            box=None; im=periodic_tile(im)
        path=ROOT/'assets'/e['dir']/f"{e['id']}.png"
        im.save(path)
        ASSETS[e['id']]=im.convert('RGBA')
        a=np.array(im.convert('RGBA'))[:,:,3]
        META[e['id']]={'path':path.relative_to(ROOT).as_posix(),'source':e['source'],'source_size':source_size,'trim_box':box,'size':im.size,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'transparent_fraction':round(float((a==0).mean()),4),'anchor':[0.5,1.0],'repeat':not e['transparent'],'normalization':'alpha-bounds trim; source alpha retained' if e['transparent'] else '2x2 mirrored edge-compatible periodic tile; no generated repaint'}
    (ROOT/'asset-manifest.json').write_text(json.dumps(META,indent=2),encoding='utf-8')

def sized(id,width=None,height=None):
    a=ASSETS[id]
    if height is None: height=round(a.height*width/a.width)
    if width is None: width=round(a.width*height/a.height)
    return a.resize((int(width),int(height)),RESAMPLE)

def tile(id,size,phase=0):
    t=ASSETS[id].resize(size,RESAMPLE)
    out=Image.new('RGBA',(W,H))
    for y in range(-size[1],H,size[1]):
        for x in range(-size[0],W,size[0]): out.alpha_composite(t,(x+phase,y))
    return out

PLACEMENTS=[]
def place(scene,id,x,y,width=None,height=None,shadow=False,record=True):
    im=sized(id,width,height)
    if shadow:
        shh=max(8,int(im.height*.30))
        a=ImageOps.flip(im.getchannel('A')).resize((im.width,shh),RESAMPLE)
        a=a.transform((im.width+shh,shh),Image.Transform.AFFINE,(1,-.8,0,0,1,0),Image.Resampling.BICUBIC)
        a=a.point(lambda p:int(p*.24)).filter(ImageFilter.GaussianBlur(5))
        sh=Image.new('RGBA',a.size,(69,57,35,0)); sh.putalpha(a)
        scene.alpha_composite(sh,(int(x),int(y+im.height-5)))
    scene.alpha_composite(im,(int(x),int(y)))
    if record: PLACEMENTS.append({'asset':id,'x':x,'y':y,'width':im.width,'height':im.height,'anchor':'top-left','ground_shadow':shadow})
    return im

def draw_wall(scene,p1,p2,height=70):
    # Repeating front-facing module mapped onto a wall plane; verticals stay vertical.
    x1,y1=p1; x2,y2=p2; dx=x2-x1; dy=y2-y1
    length=math.hypot(dx,dy); count=max(1,round(length/420))
    for k in range(count):
        xa=x1+dx*k/count; xb=x1+dx*(k+1)/count
        ya=y1+dy*k/count; yb=y1+dy*(k+1)/count
        ww=math.ceil(xb-xa)+2; hh=height+math.ceil(abs(yb-ya))+2
        src=sized('quay-wall',width=max(10,ww),height=height)
        slope=(yb-ya)/(xb-xa)
        offset=max(0,-(yb-ya))
        warped=src.transform((ww,hh),Image.Transform.AFFINE,(1,0,0,-slope,1,-offset),Image.Resampling.BICUBIC)
        scene.alpha_composite(warped,(round(xa),round(min(ya,yb))))
        PLACEMENTS.append({'asset':'quay-wall','segment':[xa,ya,xb,yb],'wall_height':height})

def reflection(scene,im,x,y,strength=.20,stretch=.45,phase=0):
    # Object-derived reflection, horizontally displaced scanlines, fades into water.
    rh=max(1,round(im.height*stretch))
    refl=ImageOps.flip(im).resize((im.width,rh),RESAMPLE).filter(ImageFilter.GaussianBlur(1.6))
    arr=np.array(refl).copy()
    for j in range(rh):
        shift=round(math.sin(j*.16+phase)*3+math.sin(j*.047+phase)*2)
        arr[j]=np.roll(arr[j],shift,axis=0)
        fade=(1-j/rh)**1.8*strength*(.65+.35*math.sin(j*.8)**2)
        arr[j,:,3]=(arr[j,:,3]*fade).astype('uint8')
    scene.alpha_composite(Image.fromarray(arr),(int(x),int(y)))

def person(scene,x,y,scale=1):
    # Explicit neutral scale marker, not an additional generated asset family.
    s=scale; d=ImageDraw.Draw(scene)
    d.ellipse((x-4*s,y-2*s,x+12*s,y+3*s),fill=(75,64,43,55))
    d.line((x-2*s,y-13*s,x-3*s,y),fill=(62,62,54),width=max(1,round(3*s)))
    d.line((x+2*s,y-13*s,x+3*s,y),fill=(65,62,49),width=max(1,round(3*s)))
    d.polygon([(x-5*s,y-25*s),(x+4*s,y-25*s),(x+5*s,y-12*s),(x-4*s,y-12*s)],fill=(83,108,113))
    d.ellipse((x-3*s,y-33*s,x+3*s,y-26*s),fill=(196,154,108))
    d.line((x-4*s,y-23*s,x-7*s,y-14*s),fill=(202,170,127),width=max(1,round(2*s)))
    d.line((x+4*s,y-23*s,x+7*s,y-16*s),fill=(202,170,127),width=max(1,round(2*s)))

def rope(scene,start,end):
    d=ImageDraw.Draw(scene)
    # Wall-mounted metal mooring ring, attached to masonry rather than floating rope ends.
    ex,ey=end
    d.ellipse((ex-4,ey-5,ex+4,ey+5),fill=(91,91,75),outline=(46,56,52),width=2)
    d.ellipse((ex-2,ey-3,ex+2,ey+3),fill=(143,137,104))
    pts=[]
    for k in range(50):
        t=k/49; pts.append((start[0]*(1-t)+end[0]*t,start[1]*(1-t)+end[1]*t+12*math.sin(math.pi*t)))
    d.line(pts,fill=(71,57,34),width=3); d.line([(x,y-1) for x,y in pts],fill=(190,161,105),width=1)

def render(phase=0,record=True):
    if record: PLACEMENTS.clear()
    scene=tile('water-tile',(600,390),phase)
    # Broad color variation, procedural and reusable, not a painted scene background.
    yy,xx=np.mgrid[0:H,0:W]; arr=np.array(scene).astype(float)
    mean=arr[:,:,:3].mean(axis=(0,1)); arr[:,:,:3]=mean+(arr[:,:,:3]-mean)*.42
    mul=.82+.13*np.sin(xx/740+yy/470)+.06*np.cos(xx/310-yy/450)
    arr[:,:,:3]*=mul[:,:,None]; arr[:,:,0]*=1.13; arr[:,:,2]*=.94
    scene=Image.fromarray(np.clip(arr,0,255).astype('uint8'))
    coast=[(0,744),(370,744),(680,524),(1920,524)]
    landmask=Image.new('L',(W,H)); d=ImageDraw.Draw(landmask)
    d.polygon([(0,0),(W,0),*reversed(coast)],fill=255)
    paving=tile('paving-tile',(224,116))
    ground=np.array(paving).astype(float)
    # Reusable broad weathering/noise modulation; paver structure remains in the tile.
    rng=np.random.default_rng(81)
    noise=Image.fromarray(rng.integers(60,190,(9,13),dtype='uint8')).resize((W,H),Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(45))
    mod=(np.array(noise).astype(float)-128)/1800
    avg=ground[:,:,:3].mean(axis=(0,1))
    ground[:,:,:3]=avg+(ground[:,:,:3]-avg)*.65
    ground[:,:,:3]*=(.99+mod)[:,:,None]
    ground[:,:,2]*=1.045
    paving=Image.fromarray(np.clip(ground,0,255).astype('uint8'))
    scene.paste(paving,(0,0),landmask)
    # Selected frontage and open promenade.
    place(scene,'warehouse',530,-75,width=690,shadow=True,record=record)
    place(scene,'warehouse',1100,135,width=780,shadow=True,record=record)
    place(scene,'tree-planter',-70,-60,height=310,shadow=True,record=record)
    place(scene,'tree-planter',245,-90,height=300,shadow=True,record=record)
    place(scene,'tree-planter',60,260,height=295,shadow=True,record=record)
    place(scene,'tree-planter',1695,-120,height=290,shadow=True,record=record)
    place(scene,'harbor-banner',370,264,height=180,shadow=True,record=record)
    place(scene,'harbor-banner',1770,356,height=175,shadow=True,record=record)
    for p1,p2 in zip(coast,coast[1:]): draw_wall(scene,p1,p2,58)
    # Repeated timber platform beside the projecting working quay.
    place(scene,'timber-dock',285,727,width=270,record=record)
    place(scene,'timber-dock',548,727,width=270,record=record)
    # Hero and secondary occupy different berths, with clear water between them.
    hero=sized('hero-ship',width=950); hx=420; hy=905-hero.height
    cutter=sized('secondary-vessel',width=315); cx=1535; cy=745-cutter.height
    reflection(scene,hero,hx,905,strength=.17,phase=phase*.1)
    reflection(scene,cutter,cx,745,strength=.16,phase=phase*.1)
    scene.alpha_composite(hero,(hx,hy)); scene.alpha_composite(cutter,(cx,cy))
    if record:
        PLACEMENTS.extend([{'asset':'hero-ship','x':hx,'y':hy,'width':hero.width,'height':hero.height,'waterline_y':905},{'asset':'secondary-vessel','x':cx,'y':cy,'width':cutter.width,'height':cutter.height,'waterline_y':745}])
    # Thin hull-contact ripples, not a floating ellipse or foam halo.
    contact=Image.new('RGBA',(W,H)); cd=ImageDraw.Draw(contact)
    for vessel,vx,vy in [(hero,hx,hy),(cutter,cx,cy)]:
        va=np.array(vessel.getchannel('A'))
        points=[]
        for col in range(vessel.width):
            rows=np.where(va[:,col]>100)[0]
            if len(rows) and rows[-1]>vessel.height*.84:
                points.append((vx+col,vy+int(rows[-1])))
        if points:
            cd.line(points,fill=(27,71,73,135),width=4)
            cd.line([(x,y+2) for x,y in points],fill=(100,152,146,100),width=1)
    scene.alpha_composite(contact.filter(ImageFilter.GaussianBlur(.6)))
    rope(scene,(475,766),(359,744)); rope(scene,(1195,801),(1425,548))
    rope(scene,(1588,683),(1550,550)); rope(scene,(1814,706),(1866,550))
    for x,y in [(345,670),(1475,459),(1720,468),(335,250),(1090,445)]:
        worker=sized('scale-worker',height=44)
        place(scene,'scale-worker',x-worker.width//2,y-44,height=44,shadow=True,record=record)
    return scene.convert('RGB')

def font(sz):
    return ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',sz)

def sheet():
    out=Image.new('RGB',(1800,1320),(236,232,221)); d=ImageDraw.Draw(out)
    d.text((45,25),'REPRESENTATIVE ASSET FAMILY',font=font(29),fill=(35,55,57))
    d.text((45,65),'Nine reusable categories · source-normalized production inspection · display sizes differ by category',font=font(18),fill=(80,89,83))
    order=['hero-ship','secondary-vessel','warehouse','quay-wall','timber-dock','water-tile','paving-tile','tree-planter','harbor-banner']
    for i,id in enumerate(order):
        x=35+(i%3)*590; y=110+(i//3)*397
        d.rounded_rectangle((x,y,x+565,y+373),radius=8,fill=(221,226,214))
        d.text((x+18,y+14),f'{i+1:02d}  {id.replace("-"," ").title()}',font=font(22),fill=(37,61,61))
        a=ASSETS[id].copy()
        if id in ['water-tile','paving-tile']:
            a=a.resize((520,270),RESAMPLE)
        else: a.thumbnail((525,280),RESAMPLE)
        out.paste(a,(x+(565-a.width)//2,y+55+(285-a.height)//2),a if a.mode=='RGBA' else None)
        d.text((x+18,y+344),f"{META[id]['size'][0]} × {META[id]['size'][1]} px · "+('repeatable surface' if META[id]['repeat'] else 'transparent PNG'),font=font(15),fill=(77,90,85))
    out.save(ROOT/'representative-asset-sheet.png')

def qa():
    # 3x3 repeat test with scale figure, plus native 960px overview.
    out=Image.new('RGB',(1536,850),(235,232,220)); d=ImageDraw.Draw(out)
    for k,id in enumerate(['water-tile','paving-tile']):
        t=ASSETS[id].convert('RGB').resize((240,200),RESAMPLE)
        for iy in range(3):
            for ix in range(3): out.paste(t,(k*768+24+ix*240,65+iy*200))
        d.text((k*768+24,20),id+' · 3 × 3 repeat',font=font(24),fill=(38,58,61))
    d.text((24,710),'Surface repetition is inspected separately from the composite. Paving is substantially smaller in the actual scene.',font=font(20),fill=(38,58,61))
    out.save(ROOT/'evidence'/'surface-repeat-check.png')
    checks={}
    for id in ['water-tile','paving-tile']:
        a=np.array(ASSETS[id]).astype(float)
        checks[id]={'opposite_edge_mean_absolute_error_x':float(abs(a[:,0]-a[:,-1]).mean()),'opposite_edge_mean_absolute_error_y':float(abs(a[0]-a[-1]).mean())}
    (ROOT/'evidence'/'technical-checks.json').write_text(json.dumps(checks,indent=2))

if __name__=='__main__':
    prepare()
    im=render()
    im.save(ROOT/'vertical-slice-reconstruction-final.png')
    im.resize((960,540),RESAMPLE).save(ROOT/'evidence'/'native-scale-overview.png')
    (ROOT/'scene-manifest.json').write_text(json.dumps({'canvas':[W,H],'master_used_as_background':False,'source_of_scene':'Only assets in assets/ plus procedural contact, reflections, shadows, scale people and mooring lines','surface_layers':[{'asset':'water-tile','repeat_size':[600,390],'mask':'full canvas beneath land and objects'},{'asset':'paving-tile','repeat_size':[224,116],'mask':'land polygon above quay'}],'placements':PLACEMENTS},indent=2),encoding='utf-8')
    sheet(); qa()
    # Optional isolated motion evidence, created from the same treatment and sprites.
    palette=im.resize((768,432),RESAMPLE).quantize(colors=256)
    frames=[]
    for n in range(16):
        phase=round(3*math.sin(n*math.tau/16))
        f=render(phase,record=False).resize((768,432),RESAMPLE)
        frames.append(f.quantize(palette=palette,dither=Image.Dither.NONE))
    frames[0].save(ROOT/'evidence'/'calm-water-motion.gif',save_all=True,append_images=frames[1:],duration=160,loop=0,optimize=False)
    print('Built normalized assets, reproducible reconstruction, sheet and QA evidence.')
