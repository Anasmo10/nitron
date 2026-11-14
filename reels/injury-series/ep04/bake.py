"""EP04: the soft joins baked into ep/vfr: the replay → Ahmad (frame 135, ±6) and, after the settle made by settle.py,
P3's last frame fading off P4's first 3 frames (685). Every other take change is under the X-ray canvas."""
import cv2, numpy as np, shutil, os, sys
W='/home/user/work/ep4/ep/vfr'; BK='/home/user/work/ep4/ep/vfr_cut'; os.makedirs(BK,exist_ok=True)
if '--fresh' in sys.argv:
    for f in os.listdir(BK): os.remove(f'{BK}/{f}')
def rd(i):
    p=f'{BK}/{i:05d}.jpg'
    if not os.path.exists(p): shutil.copy(f'{W}/{i:05d}.jpg',p)
    return cv2.imread(p).astype(np.float32)
def dissolve(c,n):
    last,first=rd(c-1),rd(c); tot=2*n+1
    for f in range(c-n,c+n):
        w=(f-(c-n)+1)/tot; cur=rd(f); out=(1-w)*cur+w*first if f<c else (1-w)*last+w*cur
        cv2.imwrite(f'{W}/{f:05d}.jpg',out.clip(0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,95])
    print('dissolve at frame',c,'±',n)
def settle(c,n):
    last=rd(c-1)
    for j,f in enumerate(range(c,c+n)):
        w=(n-j)/(n+1); cv2.imwrite(f'{W}/{f:05d}.jpg',(w*last+(1-w)*rd(f)).clip(0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,95])
    print('settle after frame',c,'over',n)
for f in os.listdir(BK): shutil.copy(f'{BK}/{f}',f'{W}/{f}')
dissolve(135,2)   # 4 frames: a long blend of the soft replay with him read as blurred frames (client, EP04 v2)
# no fade at 685: the faces are matched by settle.py, a fade there only blurred 3 frames
