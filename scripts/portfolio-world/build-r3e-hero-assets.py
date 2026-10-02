from pathlib import Path
import json
from PIL import Image
root=Path(__file__).resolve().parents[2]; selected=json.loads((root/'data/portfolio-world/r3e-hero-selection.json').read_text())['selected']; src=root/'output/codyssey-image-benchmark/r3e-hero-ship'/selected; out=root/'portfolio-world-v2/public/assets/world/ships/hero/r3e'; out.mkdir(parents=True,exist_ok=True)
im=Image.open(src).convert('RGBA'); p=im.load()
for y in range(im.height):
 for x in range(im.width):
  r,g,b,a=p[x,y]
  if r>150 and b>150 and g<155: p[x,y]=(r,g,b,0)
box=im.getchannel('A').getbbox(); im=im.crop(box).resize((325,315),Image.Resampling.LANCZOS)
# Hull uses only lower vessel mass; foreground layers never duplicate it.
h=Image.new('RGBA',(300,335)); crop=im.crop((12,160,312,315)); h.alpha_composite(crop,(0,180)); h.save(out/'hero-ship-hull.png')
m=Image.new('RGBA',(325,300)); upper=im.crop((0,0,325,190)); m.alpha_composite(upper,(0,0)); m.save(out/'hero-ship-mast-foreground.png')
r=Image.new('RGBA',(325,200)); rig=im.crop((0,0,325,135)); r.alpha_composite(rig,(0,0)); r.save(out/'ship-rigging-foreground.png')
