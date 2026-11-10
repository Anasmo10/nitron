"""EP02: bake the soft dissolves into ep/vfr (client: «لا تعملها كت قوي، اعملها سموز»).
Each cut becomes a short dissolve made from the last frame of the outgoing shot and the first of the incoming one
(no overlap footage needed, and with Ahmad placed by his face in every take it reads as a soft settle, not a jump)."""
import cv2, numpy as np, shutil, os
W='/home/user/work/ep2/ep/vfr'; BK='/home/user/work/ep2/ep/vfr_cut'; os.makedirs(BK,exist_ok=True)
def rd(i):
    p=f'{BK}/{i:05d}.jpg'
    if not os.path.exists(p): shutil.copy(f'{W}/{i:05d}.jpg',p)       # keep the hard-cut original once
    return cv2.imread(p).astype(np.float32)
def dissolve(c,n):          # c = first frame of the incoming shot, n = frames each side
    last,first=rd(c-1),rd(c); tot=2*n+1
    for f in range(c-n,c+n):
        w=(f-(c-n)+1)/tot; cur=rd(f)
        out=(1-w)*cur+w*first if f<c else (1-w)*last+w*cur
        cv2.imwrite(f'{W}/{f:05d}.jpg',out.clip(0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,95])
    print('dissolve at frame',c,'±',n)
for f in os.listdir(BK): shutil.copy(f'{BK}/{f}',f'{W}/{f}')    # start from the hard-cut originals every time
dissolve(145,6)                     # footage → Ahmad
dissolve(230,2)                     # the one take → take cut that is on screen (his head is 17 px apart there): a 4-frame settle
# the other two take changes (P7→P8, P8→P9) are hidden under the prevention canvas: his head is 120–140 px apart at those cuts,
# and a dissolve there showed two faces
