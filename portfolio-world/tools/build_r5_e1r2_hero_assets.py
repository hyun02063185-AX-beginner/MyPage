"""R5 E.1-R2: source-led Hero group and Gangway reconstruction pilot.

The only generated ship image in this phase is retained as an explicitly
unapproved Option-B comparison; final composites use Candidate-B pixels plus a
small documented hidden-hull continuity patch, never a generated redesign.
"""
from __future__ import annotations
import hashlib, json
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r2"
MASTER=ROOT/"reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-b/02-candidate-b-original.png"
BASE=ROOT/"reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r1/11-common-clean-base-repaired.png"
PLAYER=ROOT/"portfolio-world/public/assets/canonical-r4/candidates/player/player-b-front.png"
C2=ROOT/"data/portfolio-world/r5-spatial-blueprint-c2-draft.json"; RESERVE=ROOT/"data/portfolio-world/r5-future-expansion-reserve-draft.json"
OPTION_B=ROOT/"reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r2/production-assets/option-b-unapproved/generated-hero-reference.png"
SIZE=(1280,720); LOGICAL=(1024,576); ZOOM=1.25; VISIBLE=(819.2,460.8)
ASSETS=OUT/"production-assets"; MOTION=OUT/"motion-evidence"
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,i): p.parent.mkdir(parents=True,exist_ok=True); i.save(p,"PNG")
def font(n): return ImageFont.truetype("arial.ttf",n)
def label(d,xy,s,n=16): d.text(xy,s,font=font(n),fill="white",stroke_width=2,stroke_fill=(6,27,35,240))
def blank(): return Image.new("L",SIZE,0)
def poly(points):
    m=blank(); ImageDraw.Draw(m).polygon(points,fill=255); return m
def lines(spec):
    m=blank(); d=ImageDraw.Draw(m)
    for points,width in spec: d.line(points,fill=255,width=width)
    return m
def union(*ms):
    o=blank()
    for m in ms:o=ImageChops.lighter(o,m)
    return o
def crop(master,m):
    b=m.getbbox(); assert b
    x=master.copy(); x.putalpha(m); return x.crop(b),(b[0],b[1]),b
def fullmask(image,xy):
    m=blank();m.paste(image.getchannel("A"),xy);return m
def board(title,items):
    out=Image.new("RGBA",SIZE,(8,27,35,255));label(ImageDraw.Draw(out),(16,16),title,24)
    for i,(name,im) in enumerate(items):
        th=im.resize((400,225),Image.Resampling.LANCZOS);x,y=(i%3)*425+10,(i//3)*340+55;out.alpha_composite(th,(x,y));label(ImageDraw.Draw(out),(x,y-23),name,14)
    return out
def camera(im,feet):
    x=max(0,min(SIZE[0]-VISIBLE[0],feet[0]-VISIBLE[0]/2)); y=max(0,min(SIZE[1]-VISIBLE[1],feet[1]-VISIBLE[1]/2))
    z=im.transform(LOGICAL,Image.Transform.AFFINE,(1/ZOOM,0,x,0,1/ZOOM,y),Image.Resampling.BICUBIC)
    return z.resize(SIZE,Image.Resampling.LANCZOS),[round(x,3),round(y,3)]
def samples(points,count):
    seg=[];total=0
    for a,b in zip(points,points[1:]):d=((b[0]-a[0])**2+(b[1]-a[1])**2)**.5;seg.append((a,b,d));total+=d
    out=[]
    for n in range(count):
        left=total*n/(count-1)
        for j,(a,b,d) in enumerate(seg):
            if left<=d or j==len(seg)-1:
                q=left/d if d else 0;out.append((a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q));break
            left-=d
    return out
def main():
    needed=[MASTER,BASE,PLAYER,C2,RESERVE,OPTION_B]
    if missing:=[str(x.relative_to(ROOT)) for x in needed if not x.exists()]:raise FileNotFoundError(missing)
    for p in [ASSETS/"hero_ship",ASSETS/"gangway",ASSETS/"dock",ASSETS/"water-contact",MOTION]:p.mkdir(parents=True,exist_ok=True)
    master=Image.open(MASTER).convert("RGBA");base=Image.open(BASE).convert("RGBA")
    # Explicit artist-style masks, composed from narrow hull planes, sail planes,
    # mast/rigging strokes, and deck. They are not ownership-order subtraction.
    hull_body=poly([(893,278),(1000,285),(1110,304),(1242,326),(1280,348),(1280,462),(1200,478),(1120,462),(1052,430),(1005,385),(949,350)])
    deck=poly([(885,264),(948,250),(1050,266),(1160,289),(1260,308),(1280,336),(1238,350),(1120,331),(1010,308),(930,291)])
    sails=union(poly([(920,178),(968,185),(1007,212),(985,245),(932,232)]),poly([(1040,205),(1125,210),(1205,240),(1190,275),(1090,260)]),poly([(965,132),(991,138),(1002,177),(973,180)]))
    mast_rig=lines([([(954,92),(954,302)],5), ([(1062,130),(1062,332)],5), ([(1212,193),(1212,345)],4), ([(850,216),(954,135)],2), ([(954,132),(1062,130)],2), ([(1062,132),(1212,195)],2), ([(900,270),(1062,130)],2), ([(1002,270),(1212,195)],2), ([(955,93),(900,275)],2), ([(1062,132),(1245,315)],2)],)
    # Exact plank shape; its final 8px joins the reconstructed hull patch below.
    gangway_mask=poly([(912,302),(1007,314),(998,351),(928,344)])
    ship_source_mask=union(hull_body,deck,sails,mast_rig)
    ship_source_mask=ImageChops.subtract(ship_source_mask,gangway_mask)
    ship,ship_xy,ship_bounds=crop(master,ship_source_mask)
    gangway,gangway_xy,gangway_bounds=crop(master,gangway_mask)
    # Hidden by the original gangway: documented, hand-authored continuity only.
    patch=Image.new("RGBA",(94,42),(0,0,0,0));d=ImageDraw.Draw(patch);d.polygon([(2,8),(88,3),(92,33),(8,40)],fill=(34,69,95,255));d.line([(4,11),(89,6)],fill=(214,157,55,235),width=2);d.line([(7,29),(91,23)],fill=(18,44,68,230),width=2)
    patch_xy=(922,309);patch_mask=fullmask(patch,patch_xy)
    # Ship group is a controlled composed asset: source ship + continuity patch.
    group=Image.new("RGBA",SIZE,(0,0,0,0));group.alpha_composite(ship,ship_xy);group.alpha_composite(patch,patch_xy);group_box=group.getbbox();group_bounds=group_box;group_crop=group.crop(group_box);group_xy=(group_box[0],group_box[1]);group_mask=fullmask(group_crop,group_xy)
    # Dock remains source-led and excludes every ship group alpha pixel.
    dock_raw=union(poly([(420,358),(548,365),(698,357),(830,323),(910,304),(927,343),(890,405),(760,451),(590,466),(450,447)]),lines([([(435,350),(440,465)],10), ([(548,350),(553,464)],10), ([(700,340),(705,455)],10), ([(835,314),(843,430)],10)]))
    dock_mask=ImageChops.subtract(dock_raw,group_mask);dock,dock_xy,dock_bounds=crop(master,dock_mask)
    contact=Image.new("RGBA",(165,11),(0,0,0,0));cd=ImageDraw.Draw(contact);cd.line((7,4,156,4),fill=(37,135,164,92),width=2);cd.line((30,8,132,8),fill=(202,235,226,75));contact_xy=(1050,486);contact_mask=fullmask(contact,contact_xy)
    files=[("hero_ship/group.png",group,group_xy,group_bounds,"hero_ship_group"),("hero_ship/hidden_hull_patch.png",patch,patch_xy,(922,309,1016,351),"group-internal continuity patch"),("gangway/gangway.png",gangway,gangway_xy,gangway_bounds,"gangway"),("dock/dock_surface_piles.png",dock,dock_xy,dock_bounds,"dock"),("water-contact/contact.png",contact,contact_xy,(1050,486,1215,497),"contact")]
    manifest=[]
    for rel,im,xy,bounds,role in files:
        p=ASSETS/rel;save(p,im);manifest.append({"role":role,"path":str(p.relative_to(ROOT)).replace("\\","/"),"placement":xy,"alphaBounds":bounds,"sha256":sha(p),"source":"Candidate B extraction" if "patch" not in rel and "contact" not in rel else ("hand-authored local hull continuity" if "patch" in rel else "hand-authored translucent ripple")})
    def render(ship_on=True,gangway_on=True,dock_on=True,contact_on=True,feet=None):
        out=base.copy()
        if dock_on:out.alpha_composite(dock,dock_xy)
        if ship_on:out.alpha_composite(group_crop,group_xy)
        if gangway_on:out.alpha_composite(gangway,gangway_xy)
        if contact_on:out.alpha_composite(contact,contact_xy)
        if feet:
            pl=Image.open(PLAYER).convert("RGBA");out.alpha_composite(pl,(round(feet[0]-14),round(feet[1]-56)))
        return out
    all_on=render();ship_off=render(ship_on=False);gangway_off=render(gangway_on=False);dock_off=render(dock_on=False)
    # Toggle differences must be bounded by their intended alpha masks. Gangway
    # may overlap the documented 8px hull continuity connection, nothing else.
    def bounded(before,after,allowed):
        diff=ImageChops.difference(before,after);return sum(1 for a,b in zip(diff.getdata(),allowed.getdata()) if a!=(0,0,0,0) and not b)
    group_off_drift=bounded(all_on,ship_off,group_mask); gangway_allowed=union(fullmask(gangway,gangway_xy),patch_mask); gangway_off_drift=bounded(all_on,gangway_off,gangway_allowed); dock_off_drift=bounded(all_on,dock_off,dock_mask)
    if group_off_drift or gangway_off_drift or dock_off_drift:raise RuntimeError("toggle affects outside semantic bounds")
    save(OUT/"09-ship-group-off.png",ship_off);save(OUT/"10-gangway-off.png",gangway_off);save(OUT/"11-all-on-full-world.png",all_on)
    # Alpha masks are rendered against checkerboard-like transparent preview.
    alpha_ship=Image.new("RGBA",group_crop.size,(25,48,60,255));alpha_ship.alpha_composite(group_crop);save(OUT/"07-hero-ship-alpha-mask.png",alpha_ship)
    alpha_g=Image.new("RGBA",gangway.size,(25,48,60,255));alpha_g.alpha_composite(gangway);save(OUT/"08-gangway-alpha-mask.png",alpha_g)
    cropbox=(880,245,1100,390); detail=Image.new("RGBA",(1280,720),(8,27,35,255));items=[("all ON",all_on.crop(cropbox)),("ship group OFF",ship_off.crop(cropbox)),("gangway OFF",gangway_off.crop(cropbox))]
    for i,(name,im) in enumerate(items):detail.alpha_composite(im.resize((400,400),Image.Resampling.NEAREST),((i*425)+10,80));label(ImageDraw.Draw(detail),(i*425+10,52),name,16)
    label(ImageDraw.Draw(detail),(16,16),"Ship–gangway connection at 200%",24);save(OUT/"12-ship-gangway-contact-detail.png",detail)
    comparison=board("Candidate B vs R2 source-led group",[("Candidate B",master),("All ON",all_on),("ship group OFF",ship_off)]);save(OUT/"13-beauty-master-comparison.png",comparison)
    # Fixed environment, 16 boarding frames. Player changes only.
    route=[(565,400),(650,400),(770,380),(890,355),(950,350),(1015,355),(1028,355)];frames=[];env_hash=hashlib.sha256(all_on.tobytes()).hexdigest()
    for i,feet in enumerate(samples(route,16)):
        frame,cam=camera(render(feet=feet),feet);p=MOTION/"hero-boarding-frames"/f"frame-{i:02d}.png";save(p,frame);frames.append({"frame":i,"feet":[round(feet[0],2),round(feet[1],2)],"camera":cam,"file":str(p.relative_to(ROOT)).replace("\\","/")})
    gif=[Image.open(MOTION/"hero-boarding-frames"/f"frame-{i:02d}.png").convert("P",palette=Image.Palette.ADAPTIVE) for i in range(16)];gif[0].save(MOTION/"hero-boarding-sequence.gif",save_all=True,append_images=gif[1:],duration=150,loop=0)
    review=board("R5 E.1-R2 Hero semantic reconstruction",[("all ON",all_on),("ship group OFF",ship_off),("gangway OFF",gangway_off),("dock OFF",dock_off),("contact detail",detail),("alpha source",alpha_ship.resize(SIZE))]);save(OUT/"14-final-human-review-board.png",review)
    data={"status":"CONDITIONAL_REWORK_REQUIRED","sourceMaster":{"path":str(MASTER.relative_to(ROOT)).replace("\\","/"),"sha256":sha(MASTER)},"inputs":[{"path":str(x.relative_to(ROOT)).replace("\\","/"),"sha256":sha(x)} for x in needed],"segmentation":{"method":"manually authored component masks (hull planes, deck, sails, mast/rigging strokes), not ownership-order subtraction","hiddenHull":"small documented continuity patch behind gangway","optionBGeneratedReference":{"path":str(OPTION_B.relative_to(ROOT)).replace("\\","/"),"usedInFinal":False,"reason":"orientation/proportion diverges from Candidate B"}},"assets":manifest,"toggleIntegrity":{"shipGroupOffOutsideGroupPixels":group_off_drift,"gangwayOffOutsideGangwayAndContactPixels":gangway_off_drift,"dockOffOutsideDockPixels":dock_off_drift,"result":"PASS"},"camera":{"logicalViewport":[1024,576],"zoom":1.25,"visibleWorld":[819.2,460.8],"player":[28,56],"anchor":"bottom-center"},"motion":{"route":route,"frames":frames,"gif":str((MOTION/'hero-boarding-sequence.gif').relative_to(ROOT)).replace("\\","/"),"environmentHash":env_hash,"environmentStable":True},"visualQa":{"groupOff":"PASS — no group pixels are rendered","gangwayOff":"CONDITIONAL — local continuity patch is visible by design, no source gangway remains","straightWaterCut":"CONDITIONAL — source extraction is close but final art retouch is needed","r4RuntimeModified":False,"r5RuntimeImplemented":False},"productionDecision":{"recommended":"Option A — source-led hand mask plus artist retouch","optionB":"Not approved; generated reference is not Candidate-B-faithful enough"},"humanGate":"CONDITIONAL_REWORK_REQUIRED"}
    (ROOT/"data/portfolio-world/r5-e1r2-hero-asset-reconstruction-draft.json").write_text(json.dumps(data,indent=2)+"\n",encoding="utf-8")
if __name__=="__main__":main()
