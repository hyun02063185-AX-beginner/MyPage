from pathlib import Path
from PIL import Image
import json, shutil
root=Path(r'C:/Users/hyun0/MyPage/output/astra-vertical-slice-validation')
entries=json.loads(r'''[{"id":"hero-ship","dir":"ships","source":"C:\\Users\\user\\.codex\\generated_images\\01a0dcae-5479-76f3-aaf6-1dc708eb65cb\\exec-b5c42783-b1fd-489f-95e5-0f03dcf9200a.png"},{"id":"secondary-vessel","dir":"ships","source":"C:\\Users\\user\\.codex\\generated_images\\01a0dcae-5479-76f3-aaf6-1dc708eb65cb\\exec-8f631e3f-123b-4ffd-add2-2d73c2f81ba8.png"},{"id":"warehouse","dir":"buildings","source":"C:\\Users\\user\\.codex\\generated_images\\01a0dcae-5479-76f3-aaf6-1dc708eb65cb\\exec-55f7b83a-f681-4c79-8c5e-7dbe4209453d.png"}]''')
for e in entries:
 p=root/'sources'/f"{e['id']}.png"
 p.parent.mkdir(parents=True,exist_ok=True)
 shutil.copy2(e['source'],p)
 im=Image.open(p).convert('RGBA'); a=im.getchannel('A'); hist=a.histogram()
 print(e['id'], im.size,'alpha minmax',a.getextrema(),'zero',round(hist[0]/(im.width*im.height),3),'opaque',round(hist[255]/(im.width*im.height),3),'bbox',a.getbbox())

