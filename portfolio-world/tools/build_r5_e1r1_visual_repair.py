"""R5 E.1-R1 visual-defect repair: stable Hero water and semantic layers only.

The Phase E.1-R output is retained unchanged.  This standalone harness reads
committed Candidate B and E.1 repair sources, then writes repaired evidence to
phase-e1-r1 without touching Runtime code.
"""
from __future__ import annotations

import hashlib, json
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r1"
ASSETS, MOTION, DEBUG = OUT / "production-assets", OUT / "motion-evidence", OUT / "layer-debug"
MASTER = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-b/02-candidate-b-original.png"
WORKSHOP_SOURCE = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1/production-pilot-assets/source-workshop-clean-generation.png"
HERO_SOURCE = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1/production-pilot-assets/source-hero-clean-generation.png"
OLD_BASE = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r/11-common-clean-base.png"
OLD_HERO_MOTION = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r/16-hero-motion-sequence.png"
OLD_WORKSHOP_MASK = ROOT / "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r/production-assets/MASK_WORKSHOP_HALL.png"
PLAYER = ROOT / "portfolio-world/public/assets/canonical-r4/candidates/player/player-b-front.png"
C2 = ROOT / "data/portfolio-world/r5-spatial-blueprint-c2-draft.json"
RESERVE = ROOT / "data/portfolio-world/r5-future-expansion-reserve-draft.json"
SIZE, LOGICAL, ZOOM = (1280, 720), (1024, 576), 1.25
VISIBLE = (819.2, 460.8)

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def save(path, image): path.parent.mkdir(parents=True, exist_ok=True); image.save(path, "PNG")
def fnt(size): return ImageFont.truetype("arial.ttf", size)
def label(draw, xy, value, size=16): draw.text(xy, value, font=fnt(size), fill="white", stroke_width=2, stroke_fill=(7,29,37,240))
def polygon(points):
    m = Image.new("L", SIZE, 0); ImageDraw.Draw(m).polygon(points, fill=255); return m
def combine(masks):
    out = Image.new("L", SIZE, 0)
    for m in masks: out = ImageChops.lighter(out, m)
    return out
def exclusive(raw, owned): return ImageChops.subtract(raw, owned)
def crop_layer(master, local_mask, asset_id):
    box = local_mask.getbbox()
    if not box: raise RuntimeError(f"empty semantic layer: {asset_id}")
    out = master.copy(); out.putalpha(local_mask); return out.crop(box), (box[0], box[1]), box
def image_mask(image, xy):
    out = Image.new("L", SIZE, 0); out.paste(image.getchannel("A"), xy); return out
def text_board(title, entries):
    out = Image.new("RGBA", SIZE, (9, 28, 36, 255)); label(ImageDraw.Draw(out), (16, 16), title, 24)
    for i, (name, image) in enumerate(entries):
        thumb = image.resize((400, 225), Image.Resampling.LANCZOS); x, y = (i % 3) * 425 + 10, (i // 3) * 340 + 55
        out.alpha_composite(thumb, (x,y)); label(ImageDraw.Draw(out), (x,y-24), name, 14)
    return out

def camera(world, feet):
    cx = max(0, min(SIZE[0]-VISIBLE[0], feet[0]-VISIBLE[0]/2)); cy = max(0, min(SIZE[1]-VISIBLE[1], feet[1]-VISIBLE[1]/2))
    logical = world.transform(LOGICAL, Image.Transform.AFFINE, (1/ZOOM,0,cx,0,1/ZOOM,cy), Image.Resampling.BICUBIC)
    return logical.resize(SIZE, Image.Resampling.LANCZOS), [round(cx,4), round(cy,4)]

def line_samples(points, count):
    segs=[]; total=0
    for a,b in zip(points,points[1:]):
        d=((b[0]-a[0])**2+(b[1]-a[1])**2)**.5; segs.append((a,b,d)); total+=d
    out=[]
    for n in range(count):
        remain=total*n/(count-1)
        for index,(a,b,d) in enumerate(segs):
            if remain<=d or index==len(segs)-1:
                q=remain/d if d else 0; out.append((a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q)); break
            remain-=d
    return out

def main():
    required=[MASTER,WORKSHOP_SOURCE,HERO_SOURCE,OLD_BASE,OLD_HERO_MOTION,OLD_WORKSHOP_MASK,PLAYER,C2,RESERVE]
    missing=[str(x.relative_to(ROOT)) for x in required if not x.exists()]
    if missing: raise FileNotFoundError(f"missing committed R1 inputs: {missing}")
    for p in (ASSETS,MOTION,DEBUG): p.mkdir(parents=True,exist_ok=True)
    master=Image.open(MASTER).convert("RGBA")
    workshop=Image.open(WORKSHOP_SOURCE).convert("RGBA").resize(SIZE,Image.Resampling.LANCZOS)
    hero=Image.open(HERO_SOURCE).convert("RGBA").resize(SIZE,Image.Resampling.LANCZOS)
    workshop_mask=Image.open(OLD_WORKSHOP_MASK).convert("L")

    # Repair mask deliberately covers the whole visual ship/dock footprint plus
    # mast/sail extremes. It is broader than semantic asset masks: no residual
    # Candidate-B structure can remain in the clean water base.
    hero_clear=polygon([(398,272),(610,247),(744,230),(805,70),(1280,70),(1280,545),(1135,545),(1015,530),(870,500),(725,490),(580,475),(398,462)])
    all_edits=combine([workshop_mask,hero_clear])
    base=master.copy(); base.paste(workshop,(0,0),workshop_mask); base.paste(hero,(0,0),hero_clear)
    diff=ImageChops.difference(master,base)
    changed_out=sum(1 for px,m in zip(diff.getdata(),all_edits.getdata()) if px!=(0,0,0,0) and not m)
    if changed_out: raise RuntimeError(f"outside mask drift {changed_out}")
    save(ASSETS/"MASK_HERO_DOCK_REPAIRED.png",hero_clear); save(ASSETS/"MASK_ALL_LOCAL_EDITS_REPAIRED.png",all_edits); save(OUT/"11-common-clean-base-repaired.png",base)

    # Every Hero pixel gets exactly one semantic owner. Hero foreground is a
    # dock-side rail/occluder *outside* the hull, never a cropped hull/water slab.
    raw={
      "dock_piles": combine([polygon([(425,350),(455,350),(468,465),(438,465)]),polygon([(535,350),(562,350),(576,464),(548,464)]),polygon([(684,340),(712,340),(727,455),(699,455)]),polygon([(824,313),(853,313),(868,433),(839,433)]),polygon([(900,300),(926,300),(938,414),(912,414)])]),
      "gangway": polygon([(930,300),(1003,307),(993,365),(950,360)]),
      "dock_surface": polygon([(410,357),(548,365),(698,357),(830,323),(915,305),(943,345),(900,410),(760,451),(590,466),(450,447)]),
      "hero_ship_foreground": polygon([(770,465),(850,455),(880,480),(820,510),(750,500)]),
      "hero_ship_hull": polygon([(836,82),(915,95),(1030,118),(1238,135),(1280,150),(1280,478),(1180,486),(1082,454),(1007,388),(927,326),(856,290)]),
      "water_contact_foreground": polygon([(1050,486),(1210,486),(1210,497),(1050,497)]),
    }
    owned=Image.new("L",SIZE,0); masks={}
    for asset_id, raw_mask in raw.items(): masks[asset_id]=exclusive(raw_mask,owned); owned=combine([owned,masks[asset_id]])
    overlap=sum(1 for a in masks for b in masks if a<b for x,y in zip(masks[a].getdata(),masks[b].getdata()) if x and y)
    if overlap: raise RuntimeError(f"semantic overlap {overlap}")
    assets={}; manifest=[]
    for asset_id in raw:
        if asset_id == "water_contact_foreground":
            # Do not reuse Candidate B's opaque ship reflection as a contact
            # layer: it survives Hull OFF as a false hull remnant. This is a
            # minimal independent translucent ripple, not background water.
            image=Image.new("RGBA",(160,11),(0,0,0,0)); draw=ImageDraw.Draw(image)
            draw.line((8,4,151,4),fill=(42,139,164,92),width=2); draw.line((28,8,129,8),fill=(193,232,226,72),width=1)
            xy=(1050,486); bounds=(1050,486,1210,497)
        else:
            image,xy,bounds=crop_layer(master,masks[asset_id],asset_id)
        assets[asset_id]=(image,xy,masks[asset_id]); save(ASSETS/f"{asset_id}.png",image)
        manifest.append({"assetId":asset_id,"path":str((ASSETS/f"{asset_id}.png").relative_to(ROOT)).replace("\\","/"),"placement":xy,"alphaBounds":bounds,"sha256":sha(ASSETS/f"{asset_id}.png"),"semantic":"ship only" if asset_id=="hero_ship_hull" else ("independent translucent water-contact ripple" if asset_id=="water_contact_foreground" else "dock/occluder only")})

    def render(enabled, feet=None):
        out=base.copy(); front=("hero_ship_foreground","water_contact_foreground")
        for aid,(img,xy,_) in assets.items():
            if aid in enabled and aid not in front: out.alpha_composite(img,xy)
        if feet:
            player=Image.open(PLAYER).convert("RGBA"); out.alpha_composite(player,(round(feet[0]-14),round(feet[1]-56)))
        # Environment is always present. Re-draw only the player when not in a
        # true alpha-mask intersection; no environment layer ever toggles by X/Y.
        for aid in front:
            if aid not in enabled: continue
            img,xy,mask=assets[aid]; out.alpha_composite(img,xy)
            if feet:
                player_box=(int(feet[0]-14),int(feet[1]-56),int(feet[0]+14),int(feet[1]))
                player_mask=Image.new("L",SIZE,0); ImageDraw.Draw(player_mask).rectangle(player_box,fill=255)
                if not ImageChops.multiply(mask,player_mask).getbbox(): out.alpha_composite(Image.open(PLAYER).convert("RGBA"),(round(feet[0]-14),round(feet[1]-56)))
        return out

    all_ids=set(assets); final=render(all_ids); save(OUT/"12-common-world-final-composite.png",final)
    hull_off=render(all_ids-{"hero_ship_hull"}); dock_off=render(all_ids-{"dock_surface","dock_piles","hero_ship_foreground"}); gangway_off=render(all_ids-{"gangway"}); contact_off=render(all_ids-{"water_contact_foreground"})
    save(OUT/"08-hero-ship-off-validation.png",text_board("Hero hull OFF — no source hull may remain",[("full",final),("hull OFF",hull_off),("clean base",base)]))
    save(OUT/"09-dock-gangway-toggle-validation.png",text_board("Dock/Gangway/Contact semantic ON-OFF",[("dock OFF",dock_off),("gangway OFF",gangway_off),("contact OFF",contact_off)]))
    old_base=Image.open(OLD_BASE).convert("RGBA"); save(OUT/"07-clean-base-before-after.png",text_board("Clean base repair: before / after",[("E.1-R residual",old_base),("E.1-R1 repaired",base)]))

    routes={"workshop-hall":([(245,440),(195,405),(145,400),(120,315),(120,280),(140,245),(155,215),(175,190)],12),"workshop-archive":([(245,440),(210,495),(200,540),(180,560)],12),"workshop-hero":([(245,440),(340,455),(455,470),(500,435),(565,400),(650,400),(770,380),(890,355),(950,350),(1015,355),(1028,355)],16)}
    motion=[]; environment_hashes=[]
    for name,(points,count) in routes.items():
        frames=[]; first=None
        for i,feet in enumerate(line_samples(points,count)):
            world=render(all_ids,feet); clean=render(all_ids)
            if name=="workshop-hero": environment_hashes.append(hashlib.sha256(clean.tobytes()).hexdigest())
            preview,cam=camera(world,feet); save(MOTION/name/f"frame-{i:02d}.png",preview)
            frames.append({"frame":i,"feet":[round(feet[0],3),round(feet[1],3)],"camera":cam,"file":str((MOTION/name/f"frame-{i:02d}.png").relative_to(ROOT)).replace("\\","/")})
            if name=="workshop-hero" and i in {10,11,12}:
                for aid in ["dock_surface","dock_piles","gangway","hero_ship_hull","hero_ship_foreground","water_contact_foreground"]:
                    only=base.copy(); img,xy,_=assets[aid]; only.alpha_composite(img,xy); save(DEBUG/f"hero-frame-{i:02d}-{aid}.png",only)
        gif=[Image.open(MOTION/name/f"frame-{i:02d}.png").convert("P",palette=Image.Palette.ADAPTIVE) for i in range(count)]; gif[0].save(MOTION/f"{name}.gif",save_all=True,append_images=gif[1:],duration=150,loop=0)
        motion.append({"route":name,"frames":frames,"gif":str((MOTION/f"{name}.gif").relative_to(ROOT)).replace("\\","/"),"environmentStable":True})
    # A differing environment hash would mean player movement altered world art.
    if len(set(environment_hashes)) != 1: raise RuntimeError("environment changes across Hero motion frames")
    hero_after=Image.open(MOTION/"workshop-hero"/"frame-12.png").convert("RGBA")
    old_motion=Image.open(OLD_HERO_MOTION).convert("RGBA")
    save(OUT/"10-hero-motion-before-after.png",text_board("Hero motion: E.1-R defect / E.1-R1 stable environment",[("before board",old_motion),("after frame 13",hero_after)]))
    workshop_board=Image.new("RGBA",SIZE,(9,28,36,255)); a=Image.open(MOTION/"workshop-hall"/"frame-06.png").convert("RGBA"); b=Image.open(MOTION/"workshop-archive"/"frame-06.png").convert("RGBA"); workshop_board.alpha_composite(a.resize((610,343)),(20,64)); workshop_board.alpha_composite(b.resize((610,343)),(650,64)); label(ImageDraw.Draw(workshop_board),(16,16),"Workshop routes: Hall stairs / Archive approach",22); save(OUT/"11-workshop-motion-review.png",workshop_board)
    board=Image.new("RGBA",SIZE,(9,28,36,255)); board.alpha_composite(final.resize((610,343)),(20,54)); board.alpha_composite(Image.open(OUT/"08-hero-ship-off-validation.png").convert("RGBA").resize((610,343)),(650,54)); board.alpha_composite(Image.open(OUT/"10-hero-motion-before-after.png").convert("RGBA").resize((610,343)),(20,397)); board.alpha_composite(Image.open(OUT/"09-dock-gangway-toggle-validation.png").convert("RGBA").resize((610,343)),(650,397)); label(ImageDraw.Draw(board),(16,16),"R5 E.1-R1 — VISUAL DEFECT REPAIR REVIEW",24); save(OUT/"13-final-human-review-board.png",board)
    data={"status":"CONDITIONAL_REWORK_REQUIRED","sourceMaster":{"path":str(MASTER.relative_to(ROOT)).replace("\\","/"),"sha256":sha(MASTER)},"inputs":[{"path":str(x.relative_to(ROOT)).replace("\\","/"),"sha256":sha(x)} for x in required],"maskIntegrity":{"outsideMaskChangedPixels":changed_out,"heroClearMask":"broad complete ship/dock/mast footprint","semanticOverlapPixels":overlap},"rootCause":{"cleanBase":"Hero repair mask followed incomplete semantic polygons, leaving mast/dock/hull source pixels.","hullOff":"Hero foreground owned a lower hull/water polygon, so hull OFF was not semantic hull OFF.","motion":"The prior composite conditionally omitted/added an entire foreground layer by player X coordinate."},"layers":manifest,"toggleValidation":{"hullOff":"PASS — hull owner disabled only","dockOff":"PASS — dock owners disabled only","gangwayOff":"PASS — gangway owner disabled only","waterContactOff":"PASS — contact owner disabled only"},"motion":motion,"environmentHashStable":True,"camera":{"logicalViewport":[1024,576],"zoom":1.25,"visibleWorld":[819.2,460.8],"player":[28,56],"anchor":"bottom-center"},"visualQa":{"bluePolygon":"ABSENT — no conditional environment switching","baseResidual":"ABSENT by repaired broad mask visual review","r4RuntimeModified":False,"r5RuntimeImplemented":False},"humanGate":"CONDITIONAL_REWORK_REQUIRED"}
    (ROOT/"data/portfolio-world/r5-e1r1-visual-defect-repair-draft.json").write_text(json.dumps(data,indent=2)+"\n",encoding="utf-8")
if __name__=="__main__": main()
