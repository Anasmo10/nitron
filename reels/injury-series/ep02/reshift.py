"""EP02: put Ahmad's face at the same height in every take (centre y = 0.38·H = 730 px, the reel's eye zone).
The takes were framed differently, so with the body anchored to the bottom edge his face sat at 0.30, 0.35 and 0.41 of
the frame: the soft dissolves between takes would have shown him jump. The placed presenter layers are moved down
(whole pixels, nothing resampled); P8, which has the least body below the face, is enlarged 5% about the bottom edge.
Reads ep/bt/person (placed RGBA), writes ep/bt/person_new + ep/vfr composites over the same blurred gym plate."""
import cv2, numpy as np, os
W='/home/user/work/ep2/ep'; H_,W_=1920,1080; OUT=W+'/bt/person_new'; os.makedirs(OUT,exist_ok=True)
bg=cv2.imread('/home/user/work/ep2/bg/gym_k.png').astype(np.float32)/255
s=max(W_/bg.shape[1],H_/bg.shape[0]); bg=cv2.resize(bg,(round(bg.shape[1]*s),round(bg.shape[0]*s)),interpolation=cv2.INTER_AREA)
y0,x0=(bg.shape[0]-H_)//2,(bg.shape[1]-W_)//2; bg=cv2.GaussianBlur(bg[y0:y0+H_,x0:x0+W_],(0,0),5)
GRAIN=np.random.default_rng(7).normal(0,0.012,(H_,W_,1)).astype(np.float32)
TARGET=730
PIECES={'P2':(145,229,576,1.0),'P3':(230,306,572,1.0),'P7':(657,726,670,1.0),'P8':(727,879,790,0.9015/0.856),'P9':(880,1077,575,1.0)}
for name,(a,b,fy,sc) in PIECES.items():
    dy=0 if sc!=1.0 else int(round(TARGET-fy))
    for i in range(a,b+1):
        im=cv2.imread(f'{W}/bt/person/{i:05d}.png',cv2.IMREAD_UNCHANGED).astype(np.float32)/255
        if sc!=1.0:   # enlarge about the bottom edge under his face, premultiplied so the edge stays clean
            pm=np.dstack([im[...,:3]*im[...,3:],im[...,3:]]); M=np.float32([[sc,0,562*(1-sc)],[0,sc,H_*(1-sc)]])
            pm=cv2.warpAffine(pm,M,(W_,H_),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_CONSTANT,borderValue=0)
            al=pm[...,3:].clip(0,1); im=np.dstack([np.where(al>1e-4,pm[...,:3]/np.maximum(al,1e-4),0).clip(0,1),al])
        elif dy>0:
            sh=np.zeros_like(im); sh[dy:]=im[:H_-dy]; im=sh
        F,al=im[...,:3],im[...,3:]
        comp=bg*(1-al)+F*al
        cv2.imwrite(f'{W}/vfr/{i:05d}.jpg',(np.clip(comp+GRAIN,0,1)*255+0.5).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,95])
        cv2.imwrite(f'{OUT}/{i:05d}.png',(im*255+0.5).astype(np.uint8),[cv2.IMWRITE_PNG_COMPRESSION,3])
    print(name,'moved' if sc==1.0 else 'scaled %.3f'%sc,dy if sc==1.0 else '',flush=True)
