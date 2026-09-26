"""Read-only raster/data QA. No artwork generation or editing."""
from pathlib import Path
import hashlib, json, subprocess
from collections import deque
import numpy as np
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
read = lambda name: np.array(Image.open(root / name).convert('RGBA'))
plate = read('environment-plate.png')
fg = read('foreground-occlusion.png')
walk = read('walkable-mask.png')[:,:,0] == 255
collision = read('collision-mask.png')[:,:,0] == 255
allowed = walk & ~collision
hotspots = json.loads((root/'interaction-hotspots.json').read_text(encoding='utf-8-sig'))
geo = json.loads((root/'evidence/geometry.json').read_text(encoding='utf-8-sig'))
sx, sy = hotspots['start']
seen = np.zeros_like(allowed)
queue=deque([(sx,sy)])
assert allowed[sy,sx], 'Start blocked'
seen[sy,sx]=True
h,w=allowed.shape
while queue:
    x,y=queue.popleft()
    for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
        if 0<=xx<w and 0<=yy<h and allowed[yy,xx] and not seen[yy,xx]:
            seen[yy,xx]=True; queue.append((xx,yy))
checks={}
for spot in hotspots['hotspots']:
    x,y=spot['approach_point']
    mask=Image.new('1',(w,h));ImageDraw.Draw(mask).polygon([tuple(p) for p in spot['polygon']],fill=1)
    region=np.array(mask,dtype=bool)
    checks[spot['id']]={'approach_reachable':bool(seen[y,x]),'accessible_region_fraction':float(seen[region].mean())}
    assert seen[y,x], f"Unreachable hotspot {spot['id']}"
    assert seen[region].all(), f"Hotspot contains inaccessible pixels {spot['id']}"
water=[(850,750),(1200,850),(1500,650),(450,570),(600,580)]
architecture=[(160,350),(320,300),(500,300),(700,350)]
assert all(not allowed[y,x] for x,y in water+architecture)
assert all(seen[y,x] for x,y in geo['placements'])
original=read('evidence/authored-repair.png')
proof=read('layer-reconstruction-proof.png')
assert np.array_equal(plate,original), 'Plate modified'
assert np.array_equal(plate,proof), 'Reconstruction seam'
assert set(np.unique(read('walkable-mask.png')[:,:,0])) <= {0,255}
assert set(np.unique(read('collision-mask.png')[:,:,0])) <= {0,255}
assert set(np.unique(fg[:,:,3])) == {0,255}
assert np.array_equal(fg[fg[:,:,3]>0],plate[fg[:,:,3]>0])
baseline='1774d5af6c513d2a01de0725987d8081e3245e88'
unchanged={}
for name in ['walkable-mask.png','collision-mask.png','interaction-hotspots.json']:
    rel='output/astra-scene-first-playable-harbor/'+name
    old=subprocess.check_output(['git','show',baseline+':'+rel],cwd=root)
    current=(root/name).read_bytes()
    if name.endswith('.json'):
        assert current.replace(b'\r\n',b'\n')==old.replace(b'\r\n',b'\n'), 'Hotspot data changed'
    else:
        assert current==old, 'Navigation data unexpectedly changed: '+name
    unchanged[name]=hashlib.sha256(current).hexdigest()
assert seen[880,720], 'Foreground scale-test placement inaccessible'
for name in ['director-review-1280x720.jpg','director-review-hero-crop.jpg']:
    assert (root/'evidence'/name).stat().st_size<1000000
assert Image.open(root/'evidence/director-review-1280x720.jpg').size==(1280,720)
files={p.relative_to(root).as_posix():{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in root.glob('*.png')}
result={'status':'PASS technical mask/recomposition checks only; visual gate remains NO-GO',
 'source_dimensions':[w,h],'logical_viewport':[1280,720],
 'walkable_pixels':int(walk.sum()),'allowed_pixels':int(allowed.sum()),'reachable_pixels':int(seen.sum()),
 'reachable_fraction_of_allowed':float(seen.sum()/allowed.sum()),
 'hotspots':checks,'placements_reachable':True,'water_and_architecture_sample_points_blocked':True,
 'water_samples':water,'architecture_samples':architecture,
 'reconstruction_max_pixel_error':int(np.abs(plate.astype(int)-proof.astype(int)).max()),
 'foreground_opaque_pixels':int((fg[:,:,3]>0).sum()),'foreground_is_exact_source_pixels':True,
 'navigation_unchanged_since':baseline,'unchanged_navigation_sha256':unchanged,
 'selected_player_height_source':84,'selected_player_height_logical':84*720/941,
 'foreground_scale_test_reachable':True,'director_review_jpegs_under_1mb':True,
 'limitations':['Static source-pixel QA, no moving-character runtime test','Collision boundary band samples cardinal directions at 10px; full swept-body collider deferred','Hand-authored navigable domain, not automated semantic segmentation','Foreground validation limited to lamp shaft corridor'],
 'files':files}
(root/'evidence/logic-validation.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k not in ['files']},indent=2))
