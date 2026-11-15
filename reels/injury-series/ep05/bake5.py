"""EP05: the one soft join baked into ep/vfr: the hook → Ahmad (frame 123), a 4-frame dissolve (a long blend of the soft
footage with him read as blurred frames, EP04 v2). Every take change after it is under a canvas."""
import cv2, numpy as np, shutil, os
W='/home/user/work/ep5/ep/vfr'; BK='/home/user/work/ep5/ep/vfr_cut'; os.makedirs(BK,exist_ok=True)
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
for f in os.listdir(BK): shutil.copy(f'{BK}/{f}',f'{W}/{f}')
dissolve(123,2)
