"""EP05 v3 hook (client, 15 Nov: «بداية الفيديو غلط، إنك تحط مربع وتحط كلام… بدنا شي يشدّه، يركّز على الإصابة، يتقرّب على
الإصابة»): the bench press FULL SCREEN (no band, no words over it, no tags), slowed while the bar rolls out of his hands,
the camera pushing in on the hands and the bar as it lands on him. Only his voice, with the reel's glass captions.
The burnt-in «STITCH INCOMING…» (src y 150–182) is cropped away: the 9:16 window is src (54, 190)–(307, 640).
Same speed map as v1 (122 frames), so the cut after it does not move. Writes hook/full/NNNN.jpg (1080×1920)."""
import cv2, numpy as np, os
D='/home/user/work/ep5/hook'; os.makedirs(D+'/full',exist_ok=True); FPS=30; SRC_END=2.85
X0,Y0,CW,CH=54,190,253,450; S=1080/CW
def speed(t):
    if t<0.42: return 1.0
    if t<0.47: return 1.0-0.75*(t-0.42)/0.05
    if t<0.80: return 0.25
    if t<0.95: return 0.25+0.75*(t-0.80)/0.15
    return 1.0
src=[0.0]
while src[-1]<SRC_END:
    s=src[-1]
    for _ in range(4): s+=speed(s)/120
    src.append(s)
N=len(src); ez=lambda u: u*u*(3-2*u); cl=lambda x: min(1,max(0,x))
TX,TY=184-X0,300-Y0                        # push-in target in window coordinates: his hands and the bar as it lands
def cam(s):
    u=ez(cl((s-0.25)/0.6)); z=1+0.26*u+0.04*cl((s-1.2)/1.6)
    return z, CW/2+(TX-CW/2)*u, CH/2+(TY-CH/2)*u*0.85
def grade(im):
    im=cv2.fastNlMeansDenoisingColored(im,None,3,3,5,15)
    lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB); L=lab[...,0].astype(np.float32); L=np.interp(L,[0,30,128,210,255],[6,30,128,206,242]); lab[...,0]=L.clip(0,255).astype(np.uint8)
    o=cv2.cvtColor(lab,cv2.COLOR_LAB2BGR).astype(np.float32)/255; g=o.mean(2,keepdims=True); o=g+(o-g)*0.86
    sh=np.clip(1-g/0.35,0,1); return (o+sh*np.array([0.022,-0.004,0.012],np.float32)).clip(0,1)
yy,xx=np.mgrid[0:1920,0:1080].astype(np.float32); vig=1-0.38*np.clip(((xx-540)/620)**2+((yy-960)/1050)**2-0.2,0,1)
cache={}
def g(k):
    if k not in cache:
        if len(cache)>6: cache.pop(next(iter(cache)))
        cache[k]=grade(cv2.imread(f'{D}/mi/{k:04d}.png'))      # mi = src y 200–600, so window y is shifted by 10
    return cache[k]
KMAX=len(os.listdir(D+'/mi'))-1
for i in range(N):
    s_=src[i]; kf=s_*120; k0=min(int(np.floor(kf)),KMAX); a=kf-k0; k1=min(k0+1,KMAX); f=g(k0)*(1-a)+g(k1)*a
    z,cx,cy=cam(s_); sc=S*z; ox,oy=X0,Y0-200       # window → mi coordinates
    M=np.float32([[sc,0,540-(cx+ox)*sc],[0,sc,960-(cy+oy)*sc]])
    out=cv2.warpAffine(f,M,(1080,1920),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REPLICATE)
    out=np.clip(out+0.55*(out-cv2.GaussianBlur(out,(0,0),2.6)),0,1)*vig[...,None]
    cv2.imwrite(f'{D}/full/{i:04d}.jpg',(out*255+0.5).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,95])
print('hook full screen',N,'frames')
