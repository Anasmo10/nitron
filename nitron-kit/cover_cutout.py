"""Nitron kit — clean person cutout for the cover.  python3 cover_cutout.py <frame.jpg> <mask.png> <out.png>
Pick a frame from a medium shot (chest visible: the title sits on the chest, never the face), eyes on camera, mouth closed.
Hardens the mask, drops thin background slivers, and replaces edge colour with the nearest interior colour (no curtain halo)."""
import sys, numpy as np, cv2
from PIL import Image
src=cv2.imread(sys.argv[1]); m=cv2.imread(sys.argv[2],0).astype(np.float32)/255
b=(m>0.45).astype(np.uint8); b=cv2.morphologyEx(b,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(15,15)))
k,lab,st,_=cv2.connectedComponentsWithStats(b,8); keep=(lab==1+int(np.argmax(st[1:,cv2.CC_STAT_AREA]))).astype(np.uint8)
keep=cv2.erode(keep,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5))); a=cv2.GaussianBlur(keep.astype(np.float32),(0,0),1.2)
inner=cv2.erode(keep,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9))); fill=cv2.inpaint(src,(1-inner).astype(np.uint8)*255,5,cv2.INPAINT_TELEA)
rgb=np.where((a>0.02)[...,None]&(inner==0)[...,None],fill,src)
out=np.dstack([cv2.cvtColor(rgb,cv2.COLOR_BGR2RGB),(a*255).astype(np.uint8)]); ys,xs=np.where(a>0.15)
Image.fromarray(out[ys.min():ys.max()+1,xs.min():xs.max()+1]).save(sys.argv[3]); print("→",sys.argv[3])
