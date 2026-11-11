"""EP03 hook: the leg-press clip, cleaned and focused on the moment (client, 11 Nov: «نحذف كل شي كلام على الفيديو الهوك»).
The news template is dropped by cropping: only the real footage band (426×376, the O TEMPO mark and the Spanish caption
box are outside it). It sits as a full-width cinema band on a dark, blurred, purple-tinted copy of itself; the hook words go
in the band above it, never on the picture. Speed: real time to the moment he gives way (src 4.70 s), 30% slow motion
(motion-interpolated, 120 fps source) through the collapse, back to real time as he grabs his knee. A slow push-in
(1.0 → 1.3) lands on his knee and face. Out: hook/out/NNNN.jpg, 30 fps."""
import cv2, numpy as np, os
D='/home/user/work/ep3/hook'; N=105; FPS=30; SRC0=112/30                 # mi2 frame k ↔ src time SRC0 + k/120
WY0, WW, WH = 450, 1080, 954; S = WW/426
def speed(t):
    if t<0.90: return 1.0
    if t<1.02: return 1.0-0.7*(t-0.90)/0.12
    if t<2.10: return 0.3
    if t<2.60: return 0.3+0.7*(t-2.10)/0.50
    return 1.0
src=[3.80]; 
for i in range(1,N*4): src.append(src[-1]+speed(i/120)/120)       # integrate at 120 Hz
src=src[::4]
ez=lambda u: u*u*(3-2*u)
def cam(t):
    u=ez(min(1,max(0,(t-0.85)/1.45))); z=1+0.30*u+0.04*min(1,max(0,(t-2.3)/1.2))
    return z, 213+(175-213)*u, 188+(172-188)*u
clahe=cv2.createCLAHE(clipLimit=1.6,tileGridSize=(4,4))
def grade(im):
    im=cv2.fastNlMeansDenoisingColored(im,None,3,3,5,15)
    lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB); L=lab[...,0]; L=0.62*L.astype(np.float32)+0.38*clahe.apply(L).astype(np.float32)
    L=np.interp(L,[0,30,128,210,255],[5,30,129,208,244]); lab[...,0]=L.clip(0,255).astype(np.uint8)
    o=cv2.cvtColor(lab,cv2.COLOR_LAB2BGR).astype(np.float32)/255; g=o.mean(2,keepdims=True); o=g+(o-g)*0.86
    sh=np.clip(1-g/0.35,0,1); o=o+sh*np.array([0.022,-0.004,0.012],np.float32)       # cool, slightly purple shadows
    return o.clip(0,1)
yy,xx=np.mgrid[0:WH,0:WW].astype(np.float32); vig=1-0.30*np.clip(((xx-540)/640)**2+((yy-WH/2)/600)**2-0.25,0,1)
GY=np.mgrid[0:1920,0:1080][0].astype(np.float32)
def rd(k): return cv2.imread(f'{D}/mi2/{k:04d}.png')
cache={}
def g(k):
    if k not in cache:
        if len(cache)>6: cache.pop(next(iter(cache)))
        cache[k]=grade(rd(k))
    return cache[k]
os.makedirs(D+'/out',exist_ok=True)
for i in range(N):
    t=i/FPS; kf=(src[i]-SRC0)*120; k0=int(np.floor(kf)); a=kf-k0; k0=min(k0,320); k1=min(k0+1,320)
    f=g(k0)*(1-a)+g(k1)*a
    z,cx,cy=cam(t); sc=S*z; M=np.float32([[sc,0,540-cx*sc],[0,sc,WH/2-cy*sc]])
    win=cv2.warpAffine(f,M,(WW,WH),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REPLICATE)
    win=np.clip(win+0.55*(win-cv2.GaussianBlur(win,(0,0),2.2)),0,1)*vig[...,None]
    bgs=1920/376*1.15; Mb=np.float32([[bgs,0,540-213*bgs],[0,bgs,960-188*bgs]])
    bg=cv2.warpAffine(f,Mb,(1080,1920),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE); bg=cv2.GaussianBlur(bg,(0,0),46)
    gl=bg.mean(2,keepdims=True); bg=(gl*0.55+bg*0.45)*0.26+np.array([0.050,0.008,0.040],np.float32)*(0.6+0.4*gl)   # dark, a touch of Nitron purple (BGR)
    bg=bg*(1-0.35*np.clip(np.abs(GY-960)/960,0,1)[...,None])
    out=bg.copy(); out[WY0:WY0+WH]=win
    for y,d in ((WY0,-1),(WY0+WH,1)):                                   # soft shadow outside the band + a lilac hairline on its edge
        for r in range(1,40):
            yy_=y+d*r-(1 if d<0 else 0)
            if 0<=yy_<1920: out[yy_]*= (1-0.45*(1-r/40)**2)
    out[WY0-2:WY0]=out[WY0-2:WY0]*0.4+np.array([0.86,0.49,0.78],np.float32)*0.6; out[WY0+WH:WY0+WH+2]=out[WY0+WH:WY0+WH+2]*0.4+np.array([0.86,0.49,0.78],np.float32)*0.6
    cv2.imwrite(f'{D}/out/{i:04d}.jpg',(out.clip(0,1)*255+0.5).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,96])
print('hook frames',N,'· src',round(src[0],3),'→',round(src[-1],3),'· collapse (src 4.70) at out',round(next(i for i,s in enumerate(src) if s>=4.70)/30,2),'s · knee grab (src 5.0) at',round(next(i for i,s in enumerate(src) if s>=5.0)/30,2))
