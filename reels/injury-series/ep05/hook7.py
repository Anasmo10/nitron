"""EP05 v5 hook options (client, 16 Nov: Instagram limited the reel to 18+ «لأنه الإصابة كتير قوية… اعمل أكتر من حالة ورجيني
الحلول»). The footage never shows the bar touching him: it stops at src 0.64 s, while the bar is still falling.
  A  suspense → the slip in slow motion → a quick flip into the motion graphic at the cut
  B  suspense → the slip → the frame freezes and turns into an ink tracing → the motion graphic
  C  no footage at all: the whole hook is motion graphics
Same speed map as v4 up to the cut (0.40× before the failure, 0.30× as the bar rolls out). 122 frames each.
Writes hook/opt{A,B,C}/NNNN.jpg, ep/hk_trace.png (the tracing of the frozen frame) and hook/opts.json (times)."""
import cv2, numpy as np, os, json, shutil
D='/home/user/work/ep5'; N_T=122; CUT=0.64
def speed(t):
    if t<0.40: return 0.40
    if t<0.47: return 0.40-0.10*(t-0.40)/0.07
    return 0.30
src=[0.0]
while len(src)<N_T:
    s=src[-1]
    for _ in range(4): s+=speed(s)/120
    src.append(s)
icut=next(i for i,s in enumerate(src) if s>=CUT); tcut=icut/30
ez=lambda u: u*u*(3-2*u); cl=lambda x: min(1,max(0,x))
TX,TY=(184-54)/253*1080,(330-190)/450*1920
def cam(s):
    z=1+0.05*ez(cl(s/0.45))+0.07*ez(cl((s-0.5)/0.4)); u=ez(cl((s-0.3)/0.6)); return z, 540+(TX-540)*u*0.6, 960+(TY-960)*u*0.6
def grade(im):
    lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB); L=lab[...,0].astype(np.float32); L=np.interp(L,[0,30,128,210,255],[8,30,128,208,244]); lab[...,0]=L.clip(0,255).astype(np.uint8)
    o=cv2.cvtColor(lab,cv2.COLOR_LAB2BGR).astype(np.float32)/255; g=o.mean(2,keepdims=True); o=g+(o-g)*0.9
    sh=np.clip(1-g/0.35,0,1); return (o+sh*np.array([0.018,-0.004,0.010],np.float32)).clip(0,1)
yy,xx=np.mgrid[0:1920,0:1080].astype(np.float32); vig=1-0.30*np.clip(((xx-540)/640)**2+((yy-960)/1100)**2-0.25,0,1)
def frame(i):
    s_=min(src[i],CUT); kf=s_*120; k0=int(np.floor(kf)); a=kf-k0
    f=grade(cv2.imread(f'{D}/sr/mi/{k0:04d}.jpg'))*(1-a)+grade(cv2.imread(f'{D}/sr/mi/{k0+1:04d}.jpg'))*a
    z,cx,cy=cam(s_); M=np.float32([[z,0,540-cx*z],[0,z,960-cy*z]])
    out=cv2.warpAffine(f,M,(1080,1920),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REFLECT)*vig[...,None]*cl(i/6)
    return (out.clip(0,1)*255+0.5).astype(np.uint8)
black=np.zeros((1920,1080,3),np.uint8)
foot=[frame(i) for i in range(icut+1)]
for opt in 'ABC':
    o=f'{D}/hook/opt{opt}'; shutil.rmtree(o,ignore_errors=True); os.makedirs(o)
    for i in range(N_T):
        if opt=='C': im=black
        elif i<=icut: im=foot[i]
        elif opt=='A': im=foot[icut] if i<=icut+3 else black          # the flip squeezes the last footage frame
        else: im=foot[icut] if i<=icut+14 else black                   # B: held while it turns into a tracing
        cv2.imwrite(f'{o}/{i:04d}.jpg',im,[cv2.IMWRITE_JPEG_QUALITY,96])
# the tracing of the frozen frame (B): lilac ink lines on the dark canvas
g=cv2.cvtColor(foot[icut],cv2.COLOR_BGR2GRAY); g=cv2.bilateralFilter(g,9,40,9); e=cv2.Canny(g,40,110); e=cv2.dilate(e,np.ones((2,2),np.uint8))
tr=np.zeros((1920,1080,4),np.uint8); tr[...,0]=219; tr[...,1]=125; tr[...,2]=199; tr[...,3]=e
cv2.imwrite(f'{D}/ep/hk_trace.png',tr)
json.dump({'cut':round(tcut,3),'icut':icut},open(f'{D}/hook/opts.json','w'))
print('cut at frame',icut,'=',round(tcut,3),'s (src',round(src[icut],3),')')
