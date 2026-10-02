from pathlib import Path
import json
from PIL import Image
root=Path(__file__).resolve().parents[2]; selected=json.loads((root/'data/portfolio-world/r3e-hero-selection.json').read_text())['selected']; src=root/'output/codyssey-image-benchmark/r3e-hero-ship'/selected; out=root/'portfolio-world-v2/public/assets/world/ships/hero/r3e'; out.mkdir(parents=True,exist_ok=True)
im=Image.open(src).convert('RGBA'); p=im.load()
for y in range(im.height):
 for x in range(im.width):
  r,g,b,a=p[x,y]
  d=((r-255)**2+g*g+(b-255)**2)**.5
  if r>130 and b>130 and g<180:
   na=max(0,min(255,int((d-20)*4)))
   # despill semi-transparent chroma while preserving anti-aliased rope edges
   if na<245: r=max(0,r-int((255-na)*.55)); b=max(0,b-int((255-na)*.55)); g=min(255,g+int((255-na)*.2))
   p[x,y]=(r,g,b,min(a,na))
box=im.getchannel('A').getbbox(); im=im.crop(box).resize((325,315),Image.Resampling.LANCZOS)
# Shared source-space origin is world (1190,500). Hull origin (1215,610)
# maps source (25,110), so no arbitrary canvas offset/rebase is introduced.
h=Image.new('RGBA',(300,335)); hull=im.crop((25,110,325,315)); hp=hull.load()
for y in range(hull.height):
 for x in range(hull.width):
  if y<48: hp[x,y]=(0,0,0,0)
h.alpha_composite(hull,(0,0)); h.save(out/'hero-ship-hull.png')
m=Image.new('RGBA',(325,300)); mast=im.crop((0,0,325,300)); mp=mast.load()
for y in range(mast.height):
 for x in range(mast.width):
  if y>190: mp[x,y]=(0,0,0,0)
m.alpha_composite(mast,(0,0)); m.save(out/'hero-ship-mast-foreground.png')
r=Image.new('RGBA',(325,200)); rig=im.crop((0,20,325,200)); rp=rig.load()
for y in range(rig.height):
 for x in range(rig.width):
  if not (x<45 or x>280): rp[x,y]=(0,0,0,0)
r.alpha_composite(rig,(0,0)); r.save(out/'ship-rigging-foreground.png')
