"""EP07 hook footage (series rules EP05 v3–v5): full screen, nothing over it, suspense in slow motion, and the footage stops
before his arm reaches full extension (the tear itself is shown only as the motion graphic, never on the real person).
Source: the injury clip src 0–1.3 s (man in a cap, barbell preacher curl), Real-ESRGAN ×4 → 1080×1920, interpolated to 120 fps.
0.40× from the first frame, a slow push-in towards his right elbow and biceps, open from black in 0.2 s; at CUT the frame
is held 3 frames for the card flip into the motion graphic (scenes: hookFlip / hookArm)."""
import cv2, numpy as np, os, json, glob
D='/home/user/work/ep7'; N_T=118; TCUT=2.0
MI=sorted(glob.glob(f'{D}/sr/mi/m1_mi_*.jpg')); icut=round(TCUT*30)
ez=lambda u: u*u*(3-2*u); cl=lambda x: min(1,max(0,x))
TX,TY=640,1240                                          # his right elbow / lower biceps (gridded frame)
def cam(i):
    u=ez(cl(i/icut)); z=1+0.16*u; return z, 540+(TX-540)*u*0.55, 960+(TY-960)*u*0.55
def grade(im):
    lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB); L=lab[...,0].astype(np.float32); L=np.interp(L,[0,30,128,210,255],[8,30,126,204,238]); lab[...,0]=L.clip(0,255).astype(np.uint8)
    o=cv2.cvtColor(lab,cv2.COLOR_LAB2BGR).astype(np.float32)/255; g=o.mean(2,keepdims=True); o=g+(o-g)*0.86
    sh=np.clip(1-g/0.35,0,1); return (o+sh*np.array([0.018,-0.004,0.010],np.float32)).clip(0,1)
yy,xx=np.mgrid[0:1920,0:1080].astype(np.float32); vig=1-0.34*np.clip(((xx-540)/640)**2+((yy-960)/1100)**2-0.25,0,1)
def frame(i):
    kf=i/30*0.40*120; k0=int(np.floor(kf)); a=kf-k0; k1=min(k0+1,len(MI)-1)
    f=grade(cv2.imread(MI[k0]))*(1-a)+grade(cv2.imread(MI[k1]))*a
    z,cx,cy=cam(i); M=np.float32([[z,0,540-cx*z],[0,z,960-cy*z]])
    out=cv2.warpAffine(f,M,(1080,1920),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REFLECT)*vig[...,None]*cl(i/6)
    return (out.clip(0,1)*255+0.5).astype(np.uint8)
os.makedirs(f'{D}/hook/fr',exist_ok=True); black=np.zeros((1920,1080,3),np.uint8); last=None
for i in range(N_T):
    if i<=icut: im=frame(i); last=im
    elif i<=icut+3: im=last
    else: im=black
    cv2.imwrite(f'{D}/hook/fr/{i:04d}.jpg',im,[cv2.IMWRITE_JPEG_QUALITY,96])
os.system(f"ffmpeg -nostdin -v error -y -framerate 30 -i {D}/hook/fr/%04d.jpg -c:v libx264 -crf 10 -preset slow -pix_fmt yuv420p {D}/hook/hook.mp4")
json.dump({'cut':round(icut/30,3),'icut':icut,'src_at_cut':round(icut/30*0.40,3)},open(f'{D}/hook/opts.json','w'))
print('cut frame',icut,'t',round(icut/30,3),'src',round(icut/30*0.4,3))
