"""EP05 hook (client, 14 Nov: «بس بدي الهوك… هو عم يوقّع البار عليه وبس، أما كل شي بعده ما بدي إياه… تقيم كل شي كلام على الشاشة»).
Only the bench press where the bar falls on him: src 0 → 2.85 s (the clip cuts to another lifter at 3.00 s, never shown).
The burnt-in «STITCH INCOMING…» (src y 150–182) is cropped away, not inpainted: the band is src y 200–600 (360×400),
shown full width (1080×1200) on a dark, blurred, purple-tinted copy of itself. Speed: real time until his wrists fold
back (src 0.42 s), 25% while the bar rolls out of his hands and drops onto him (120 fps motion-interpolated), back to
real time while the spotter pulls it off. Push-in to 1.28 between his hand and his chest. A lilac ring follows his
hand from the moment the grip opens until the bar lands. Out: hook/out/NNNN.jpg (30 fps) + hook/ring.json."""
import cv2, numpy as np, os, json
D='/home/user/work/ep5/hook'; FPS=30; SRC_END=2.85
WY0,WW,WH=420,1080,1200; S=WW/360
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
N=len(src)
ez=lambda u: u*u*(3-2*u)
cl=lambda x: min(1,max(0,x))
TX,TY=185,150                                     # push-in target, crop coordinates (between his hand and his chest)
def cam(s):
    u=ez(cl((s-0.30)/0.55)); z=1+0.28*u+0.03*cl((s-1.2)/1.6)
    return z, 180+(TX-180)*u, 200+(TY-200)*u
HAND=[(0.40,181,75),(0.50,175,81),(0.57,169,90),(0.63,169,108),(0.67,178,178),(0.72,190,196),(0.85,192,200)]
def hand(s):
    ts=[h[0] for h in HAND]; return float(np.interp(s,ts,[h[1] for h in HAND])), float(np.interp(s,ts,[h[2] for h in HAND]))
def grade(im):
    im=cv2.fastNlMeansDenoisingColored(im,None,3,3,5,15)
    lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB); L=lab[...,0].astype(np.float32); L=np.interp(L,[0,30,128,210,255],[6,30,128,206,242]); lab[...,0]=L.clip(0,255).astype(np.uint8)
    o=cv2.cvtColor(lab,cv2.COLOR_LAB2BGR).astype(np.float32)/255; g=o.mean(2,keepdims=True); o=g+(o-g)*0.86
    sh=np.clip(1-g/0.35,0,1); o=o+sh*np.array([0.022,-0.004,0.012],np.float32)
    return o.clip(0,1)
yy,xx=np.mgrid[0:WH,0:WW].astype(np.float32); vig=1-0.30*np.clip(((xx-540)/640)**2+((yy-WH/2)/620)**2-0.25,0,1)
GY=np.mgrid[0:1920,0:1080][0].astype(np.float32)
cache={}
def g(k):
    if k not in cache:
        if len(cache)>6: cache.pop(next(iter(cache)))
        cache[k]=grade(cv2.imread(f'{D}/mi/{k:04d}.png'))
    return cache[k]
KMAX=len(os.listdir(D+'/mi'))-1; ring=[]; LIL=np.array([0.86,0.49,0.78],np.float32)
for i in range(N):
    t=i/FPS; s_=src[i]; kf=s_*120; k0=min(int(np.floor(kf)),KMAX); a=kf-k0; k1=min(k0+1,KMAX)
    f=g(k0)*(1-a)+g(k1)*a
    z,cx,cy=cam(s_); sc=S*z; M=np.float32([[sc,0,540-cx*sc],[0,sc,WH/2-cy*sc]])
    win=cv2.warpAffine(f,M,(WW,WH),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REPLICATE)
    win=np.clip(win+0.45*(win-cv2.GaussianBlur(win,(0,0),2.4)),0,1)
    kr=cl((s_-0.44)/0.05)*(1-cl((s_-0.76)/0.08))
    hx,hy=hand(s_); rx,ry=hx*sc+540-cx*sc, hy*sc+WH/2-cy*sc; rr_=40*sc*(1.18-0.18*ez(cl((s_-0.44)/0.10)))
    if kr>0:
        ov=np.zeros_like(win); cv2.circle(ov,(int(rx),int(ry)),int(rr_),(1,1,1),9,cv2.LINE_AA); ov=cv2.GaussianBlur(ov,(0,0),1.2)
        glow=cv2.GaussianBlur(ov,(0,0),14)
        win=win*(1-0.25*kr*glow.mean(2,keepdims=True))+(LIL*ov*0.95+LIL*glow*1.4)*kr
        ring.append([round(t,3),int(rx),int(ry+WY0),int(rr_),round(kr,2)])
    win=win*vig[...,None]
    bgs=1920/400*1.12; Mb=np.float32([[bgs,0,540-180*bgs],[0,bgs,960-200*bgs]])
    bg=cv2.warpAffine(f,Mb,(1080,1920),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE); bg=cv2.GaussianBlur(bg,(0,0),46)
    gl=bg.mean(2,keepdims=True); bg=(gl*0.55+bg*0.45)*0.26+np.array([0.050,0.008,0.040],np.float32)*(0.6+0.4*gl)
    bg=bg*(1-0.35*np.clip(np.abs(GY-960)/960,0,1)[...,None])
    out=bg.copy(); out[WY0:WY0+WH]=win
    for y,d in ((WY0,-1),(WY0+WH,1)):
        for r in range(1,40):
            yy_=y+d*r-(1 if d<0 else 0)
            if 0<=yy_<1920: out[yy_]*=(1-0.45*(1-r/40)**2)
    out[WY0-2:WY0]=out[WY0-2:WY0]*0.4+LIL*0.6; out[WY0+WH:WY0+WH+2]=out[WY0+WH:WY0+WH+2]*0.4+LIL*0.6
    cv2.imwrite(f'{D}/out/{i:04d}.jpg',(out.clip(0,1)*255+0.5).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,96])
json.dump(ring,open(D+'/ring.json','w'))
print('hook',N,'frames',round(N/30,3),'s · src',round(src[-1],3),'· slow-mo from out',round(next(i for i,s in enumerate(src) if s>=0.42)/30,2),'s to',round(next(i for i,s in enumerate(src) if s>=0.95)/30,2),'· ring',ring[0][:4],'→',ring[-1][:4])
