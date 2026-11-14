"""EP04 hook: the clean slow-motion replay at the end of the injury clip (client, 14 Nov: «ركّز على لحظة الإصابة ومحل ما
انكسر الساعد… شيل كل الصور والكتابات»). The wide shot under the replay carries a large skeleton graphic over the lifter, so
it is not used. The replay band is cropped above the outlet's caption box (360×400 of 360×640) and shown as a full-width
band on a dark, blurred, purple-tinted copy of itself. Speed: real time until just before his forearm gives way (src 5.95 s),
25% through the collapse (120 fps motion-interpolated), back to real time after. A push-in to 1.32 lands on the forearm,
and a lilac ring marks where it breaks. Out: hook/out/NNNN.jpg, 30 fps, and hook/ring.json (where the ring is, for the label)."""
import cv2, numpy as np, os, json
D='/home/user/work/ep4/hook'; N=134; FPS=30; SRC0=154/30; CY0=20                 # mi frame k ↔ src time SRC0 + k/120 ; crop starts at src y 20
WY0,WW,WH=420,1080,1200; S=WW/360
def speed(t):   # t = src time
    if t<5.95: return 1.0
    if t<6.00: return 1.0-0.75*(t-5.95)/0.05
    if t<6.40: return 0.25
    if t<6.60: return 0.25+0.75*(t-6.40)/0.20
    return 1.0
src=[SRC0]
for i in range(1,N*4): src.append(src[-1]+speed(src[-1])/120)
src=src[::4]
ez=lambda u: u*u*(3-2*u)
FX,FY=195,335-CY0                                                               # the forearm at the break, crop coordinates
def cam(t):
    u=ez(min(1,max(0,(t-0.55)/1.5))); z=1+0.32*u+0.03*min(1,max(0,(t-2.2)/1.8))
    return z, 180+(FX-180)*u, 200+(FY-200)*u
def grade(im):
    im=cv2.fastNlMeansDenoisingColored(im,None,3,3,5,15)
    lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB); L=lab[...,0].astype(np.float32); L=np.interp(L,[0,30,128,210,255],[6,30,128,206,242]); lab[...,0]=L.clip(0,255).astype(np.uint8)
    o=cv2.cvtColor(lab,cv2.COLOR_LAB2BGR).astype(np.float32)/255; g=o.mean(2,keepdims=True); o=g+(o-g)*0.88
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
KMAX=len(os.listdir(D+'/mi'))-1; ring=[]
LIL=np.array([0.86,0.49,0.78],np.float32)
for i in range(N):
    t=i/FPS; kf=(src[i]-SRC0)*120; k0=min(int(np.floor(kf)),KMAX); a=kf-k0; k1=min(k0+1,KMAX)
    f=g(k0)*(1-a)+g(k1)*a
    z,cx,cy=cam(t); sc=S*z; M=np.float32([[sc,0,540-cx*sc],[0,sc,WH/2-cy*sc]])
    win=cv2.warpAffine(f,M,(WW,WH),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REPLICATE)
    win=np.clip(win+0.5*(win-cv2.GaussianBlur(win,(0,0),2.4)),0,1)
    # the ring on the forearm, from just before it gives way until the dumbbell has dropped (src 6.02–6.45)
    s_=src[i]; kr=min(1,max(0,(s_-6.02)/0.06))*(1-min(1,max(0,(s_-6.44)/0.08)))
    u_=min(1,max(0,(s_-6.02)/0.40)); px_,py_=190-6*u_, 330-CY0+28*u_                       # it follows the forearm down as it gives way
    rx,ry=px_*sc+540-cx*sc, py_*sc+WH/2-cy*sc; rr_=56*sc*(1.18-0.18*ez(min(1,max(0,(s_-6.02)/0.10))))
    if kr>0:
        ov=np.zeros_like(win); cv2.circle(ov,(int(rx),int(ry)),int(rr_),(1,1,1),9,cv2.LINE_AA); ov=cv2.GaussianBlur(ov,(0,0),1.2)
        glow=cv2.GaussianBlur(ov,(0,0),14)
        win=win*(1-0.25*kr*glow.mean(2,keepdims=True))+(LIL*ov*0.95+LIL*glow*1.4)*kr
        win=win*vig[...,None]; ring.append([round(t,3),int(rx),int(ry+WY0),int(rr_),round(kr,2)])
    else: win=win*vig[...,None]
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
print('hook',N,'frames · src',round(src[0],3),'→',round(src[-1],3),'· slow-mo starts at out',round(next(i for i,s in enumerate(src) if s>=5.95)/30,2),'s · ring',ring[0][:4] if ring else None,'→',ring[-1][:4] if ring else None)
