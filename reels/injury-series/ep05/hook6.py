"""EP05 v4 hook (client, 15 Nov: «ليش عامل البداية بهالجودة السخيفة… مقرّب كتير… لازم تترك شوية وقت قبل ما تبدأ الإصابة، تعمل شوية
تشويق»). Source frames enhanced ×4 with Real-ESRGAN (sr/upscale.py), cropped just below the burnt-in caption (src y ≥ 190,
9:16 window src x 54–307), so the picture is shown at 1.07× of its enhanced size instead of 4.3× of the 360p original.
Suspense first: the lift before the failure runs at 0.40× with a slow push-in (~1.1 s); the bar rolls out of his hands
and lands on him at 0.30×; real time while the spotter lifts it off. The zoom stays gentle (1.0 → 1.12). 122 frames, as
before, so the cut after it does not move. Writes hook/full6/NNNN.jpg."""
import cv2, numpy as np, os, json
D='/home/user/work/ep5'; OUT=D+'/hook/full6'; os.makedirs(OUT,exist_ok=True); N_T=122
def speed(t):
    if t<0.40: return 0.40
    if t<0.47: return 0.40-0.10*(t-0.40)/0.07
    if t<0.80: return 0.30
    if t<0.95: return 0.30+0.70*(t-0.80)/0.15
    return 1.0
src=[0.0]
while len(src)<N_T:
    s=src[-1]
    for _ in range(4): s+=speed(s)/120
    src.append(s)
ez=lambda u: u*u*(3-2*u); cl=lambda x: min(1,max(0,x))
TX,TY=(184-54)/253*1080,(330-190)/450*1920          # his hands and the bar, in the cropped frame
def cam(s):
    z=1+0.05*ez(cl(s/0.45))+0.07*ez(cl((s-0.5)/0.4))
    u=ez(cl((s-0.3)/0.6)); return z, 540+(TX-540)*u*0.6, 960+(TY-960)*u*0.6
def grade(im):
    lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB); L=lab[...,0].astype(np.float32); L=np.interp(L,[0,30,128,210,255],[8,30,128,208,244]); lab[...,0]=L.clip(0,255).astype(np.uint8)
    o=cv2.cvtColor(lab,cv2.COLOR_LAB2BGR).astype(np.float32)/255; g=o.mean(2,keepdims=True); o=g+(o-g)*0.9
    sh=np.clip(1-g/0.35,0,1); return (o+sh*np.array([0.018,-0.004,0.010],np.float32)).clip(0,1)
yy,xx=np.mgrid[0:1920,0:1080].astype(np.float32); vig=1-0.30*np.clip(((xx-540)/640)**2+((yy-960)/1100)**2-0.25,0,1)
KMAX=len(os.listdir(D+'/sr/mi'))-1; cache={}
def g(k):
    if k not in cache:
        if len(cache)>6: cache.pop(next(iter(cache)))
        cache[k]=grade(cv2.imread(f'{D}/sr/mi/{k:04d}.jpg'))
    return cache[k]
for i,s_ in enumerate(src):
    kf=s_*120; k0=min(int(np.floor(kf)),KMAX); a=kf-k0; k1=min(k0+1,KMAX); f=g(k0)*(1-a)+g(k1)*a
    z,cx,cy=cam(s_); M=np.float32([[z,0,540-cx*z],[0,z,960-cy*z]])
    out=cv2.warpAffine(f,M,(1080,1920),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REFLECT)
    fade=cl(i/6)                                                     # 0.2 s up from black: the reel opens on the lift
    out=out*vig[...,None]*fade
    cv2.imwrite(f'{OUT}/{i:04d}.jpg',(out.clip(0,1)*255+0.5).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,96])
land=next(i for i,s in enumerate(src) if s>=0.75)/30; slip=next(i for i,s in enumerate(src) if s>=0.57)/30
json.dump({'slip':round(slip,3),'land':round(land,3),'src_end':round(src[-1],3)},open(D+'/hook/full6.json','w'))
print('hook v4',len(src),'frames · src end',round(src[-1],3),'· grip opens at',round(slip,2),'s · bar lands at',round(land,2),'s')
