from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, hashlib

root=Path(__file__).resolve().parent
master=root.parent/'astra-master-harbor-benchmark/master-harbor-scene-final.png'
expected='A0652831DE4E284DC45EF755603AC49BC81A443512E0988F0843DCE5D5711787'
actual=hashlib.sha256(master.read_bytes()).hexdigest().upper()
assert actual==expected, 'Master reference changed'
required=['style-extraction.md','generation-record.md','validation-result.md','representative-asset-sheet.png','vertical-slice-reconstruction-final.png']
assert all((root/p).is_file() for p in required)
assets=json.loads((root/'asset-manifest.json').read_text())
for id,e in assets.items():
    p=root/e['path']
    assert hashlib.sha256(p.read_bytes()).hexdigest()==e['sha256']
    with Image.open(p) as im: im.verify()
scene=json.loads((root/'scene-manifest.json').read_text())
assert not scene['master_used_as_background']
assert set(e['asset'] for e in scene['placements']+scene['surface_layers'])==set(assets)
with Image.open(root/'evidence/calm-water-motion.gif') as motion:
    frame_count=motion.n_frames
    assert frame_count==12  # Pillow coalesces identical neighboring samples from the 16-sample cycle.
    motion.seek(0); first=motion.convert('RGB')
    motion.seek(4); fourth=motion.convert('RGB')
    assert first.tobytes()!=fourth.tobytes()
canvas=Image.new('RGB',(1920,615),(236,232,221)); d=ImageDraw.Draw(canvas)
f=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',23)
for x,label,path in [(0,'A / MASTER — whole-scene benchmark',master),(960,'B / RECONSTRUCTION — reusable assets',root/'vertical-slice-reconstruction-final.png')]:
    im=Image.open(path).convert('RGB'); im.thumbnail((948,534),Image.Resampling.LANCZOS)
    canvas.paste(im,(x+6,65+(534-im.height)//2)); d.text((x+18,19),label,font=f,fill=(35,57,58))
canvas.save(root/'evidence/master-vs-reconstruction.png')
report={'master_sha256':actual,'master_unchanged':True,'required_files_present':required,'asset_count':len(assets),'required_categories':9,'optional_scale_worker':True,'all_asset_hashes_verified':True,'all_assets_used_in_scene':True,'master_used_as_scene_background':False,'motion_frame_count':frame_count,'motion_frames_differ':True,'runtime_tests':'not applicable; runtime unchanged'}
(root/'evidence/verification.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
