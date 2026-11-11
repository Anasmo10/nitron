"""EP03: the two soft dissolves baked into ep/vfr (no hard cut anywhere in the film):
  frame 106  the leg-press footage → Ahmad, ±6 frames
  frame 531  P3 → P4: the push-in made by camera.py ends with his face matched, then its last frame fades off the next 3 frames
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
def settle(c,n):          # one-sided: the outgoing shot's last frame (already matched to the incoming face by camera.py) fades off the first n frames
    last=rd(c-1)
    for j,f in enumerate(range(c,c+n)):
        w=(n-j)/(n+1); cv2.imwrite(f'{W}/{f:05d}.jpg',(w*last+(1-w)*rd(f)).clip(0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,95])
    print('settle after frame',c,'over',n)
for f in os.listdir(BK): shutil.copy(f'{BK}/{f}',f'{W}/{f}')
dissolve(106,6); settle(531,3)   # a two-sided dissolve at 531 showed the next take's face early, off to one side of the moving one
