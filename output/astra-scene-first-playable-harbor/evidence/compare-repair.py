"""Read-only quantification of the generated localized edit, without masking away drift."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1]
a=np.array(Image.open(root/'evidence/authored-initial.png').convert('RGB')).astype(float)
b=np.array(Image.open(root/'evidence/authored-repair.png').convert('RGB')).astype(float)
assert a.shape==b.shape==(941,1672,3)
d=np.abs(a-b)
regions={'exhibition_hall':[0,0,650,480],'foreground_planter_paving':[0,600,550,941],
 'open_water':[1120,720,1672,941],'hero_hull':[720,535,1400,690],
 'removed_mast_and_restored_background':[1240,125,1470,550]}
data={'baseline':'1774d5af6c513d2a01de0725987d8081e3245e88',
 'source_dimensions':[1672,941],'regions':{},
 'interpretation':'Localized structural change: fourth mast removed. Unmasked non-target texture drift remains; the output is not pixel-identical outside the ship. Visual inspection found preserved composition and architecture, but sail-furling requirement still fails.'}
for key,(x,y,X,Y) in regions.items():
    region=d[y:Y,x:X]
    data['regions'][key]={'bounds':[x,y,X,Y],'mean_absolute_channel_delta_0_255':round(float(region.mean()),4),
     'fraction_pixels_mean_rgb_delta_gt_20':round(float((region.mean(2)>20).mean()),6)}
(root/'evidence/repair-comparison.json').write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
print(json.dumps(data,indent=2))
