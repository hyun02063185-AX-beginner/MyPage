from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[2]; src=root/'output/codyssey-image-benchmark/r3e-hero-ship/hero-a.gpt-image-2.original.png'; out=root/'portfolio-world-v2/public/assets/world/ships/hero/r3e'; out.mkdir(parents=True,exist_ok=True)
im=Image.open(src).convert('RGBA'); p=im.load()
for y in range(im.height):
 for x in range(im.width):
  r,g,b,a=p[x,y]
  if r>150 and b>150 and g<155: p[x,y]=(r,g,b,0)
box=im.getchannel('A').getbbox(); im=im.crop(box).resize((325,315),Image.Resampling.LANCZOS)
# Hull uses only the lower ship; mast and sparse rigging are foreground overlays.
h=Image.new('RGBA',(300,335)); crop=im.crop((12,160,312,315)); h.alpha_composite(crop,(0,180)); h.save(out/'hero-ship-hull.png')
m=Image.new('RGBA',(325,300)); m.alpha_composite(im,(0,0)); m.save(out/'hero-ship-mast-foreground.png')
r=Image.new('RGBA',(325,200)); r.alpha_composite(im.crop((0,0,325,200))); r.save(out/'ship-rigging-foreground.png')
