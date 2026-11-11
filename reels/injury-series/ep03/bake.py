"""EP03: the two soft dissolves baked into ep/vfr (no hard cut anywhere in the film):
  frame 106  the leg-press footage → Ahmad, ±6 frames
  frame 531  P3 → P4, ±3 frames, on top of the push-in made by camera.py (his face is already matched there)
Every other take change is hidden under a canvas. Run after camera.py; safe to run again (it keeps the un-dissolved frames)."""
import cv2, numpy as np, shutil, os, sys
W='/home/user/work/ep3/ep/vfr'; BK='/home/user/work/ep3/ep/vfr_cut'; os.makedirs(BK,exist_ok=True)
if '--fresh' in sys.argv:
    for f in os.listdir(BK): os.remove(f'{BK}/{f}')
def rd(i):
    p=f'{BK}/{i:05d}.jpg'
    if not os.path.exists(p): shutil.copy(f'{W}/{i:05d}.jpg',p)
    return cv2.imread(p).astype(np.float32)
def dissolve(c,n):
    last,first=rd(c-1),rd(c); tot=2*n+1
    for f in range(c-n,c+n):
        w=(f-(c-n)+1)/tot; cur=rd(f)
        out=(1-w)*cur+w*first if f<c else (1-w)*last+w*cur
        cv2.imwrite(f'{W}/{f:05d}.jpg',out.clip(0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,95])
    print('dissolve at frame',c,'±',n)
for f in os.listdir(BK): shutil.copy(f'{BK}/{f}',f'{W}/{f}')
dissolve(106,6); dissolve(531,3)
