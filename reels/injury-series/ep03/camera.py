"""EP03: the one take change that is on screen (P3 → P4, his question close to the lens) becomes a camera push-in.
Client: «الانتقالات ضروري تكون سموز وخفيفة». A cut between a medium shot and a close-up of the same man jumps; a dissolve
shows two faces. So the last 8 frames of P3 (after his last word) move as one camera: he and the gym scale up until his
face is exactly where and as large as it is in the first frame of P4, blurred along the move; P4's gym is
scaled by the same factor, so the room is continuous across the cut. bake.py then lays a 6-frame dissolve on the cut.
A linear blur along the move stands in for the shutter. Reads ep/bt/person (placed RGBA) and the gym plate; rewrites ep/vfr for frames Z0..CUT-1 (P3 tail) and CUT..P4END."""
import cv2, numpy as np, sys
W='/home/user/work/ep3/ep'; H_,W_=1920,1080; CUT=531; Z0=523; P4END=573
casc=cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_default.xml')
def faces(fr):
    out=[]
    for i in fr:
        g=cv2.cvtColor(cv2.resize(cv2.imread(f'{W}/vfr_src/{i:05d}.jpg'),(540,960)),cv2.COLOR_BGR2GRAY); r=casc.detectMultiScale(g,1.08,6,minSize=(120,120))
        if len(r): x,y,w,h=max(r,key=lambda q:q[2]); out.append((i,2*x+w,2*y+h,2*w))
    return np.array(out,float)
A3=faces(range(CUT-10,CUT)); px=np.polyfit(A3[:,0],A3[:,1],1); py=np.polyfit(A3[:,0],A3[:,2],1); w3=float(np.median(A3[:,3]))   # he drifts right as he finishes: follow him frame by frame
f3at=lambda i: np.array([np.polyval(px,i),np.polyval(py,i)]); f4=np.median(faces(range(CUT,CUT+3))[:,1:],axis=0); k=float(f4[2]/w3)
print('P3 face at the cut',f3at(CUT-1).round(),'w',w3,'· P4 first face',f4.round(),'· scale',round(k,3))
bg=cv2.imread('/home/user/work/ep2/bg/gym_k.png').astype(np.float32)/255
s=max(W_/bg.shape[1],H_/bg.shape[0]); bg=cv2.resize(bg,(round(bg.shape[1]*s),round(bg.shape[0]*s)),interpolation=cv2.INTER_AREA)
y0,x0=(bg.shape[0]-H_)//2,(bg.shape[1]-W_)//2; bg=cv2.GaussianBlur(bg[y0:y0+H_,x0:x0+W_],(0,0),5)
GRAIN=np.random.default_rng(7).normal(0,0.012,(H_,W_,1)).astype(np.float32)
def person(i): return cv2.imread(f'{W}/bt/person/{i:05d}.png',cv2.IMREAD_UNCHANGED).astype(np.float32)/255
def bgz(z): return bg if z==1 else cv2.warpAffine(bg,np.float32([[z,0,540*(1-z)],[0,z,960*(1-z)]]),(W_,H_),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_REFLECT)
xx=np.arange(W_,dtype=np.float32)[None,:]
def put(i,comp): cv2.imwrite(f'{W}/vfr/{i:05d}.jpg',(np.clip(comp+GRAIN,0,1)*255+0.5).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,95])
n=CUT-Z0; prev=None
for j,i in enumerate(range(Z0,CUT)):
    u=((j+1)/n)**1.8; z=1+(k-1)*u; f3=f3at(i); c=f3+u*(f4[:2]-f3); im=person(i)
    edge=np.clip((W_-xx)/90,0,1)[...,None]                       # the raw frame's right edge slides into view: his cut shoulder fades instead of ending
    pm=np.dstack([im[...,:3]*im[...,3:],im[...,3:]])*edge
    M=np.float32([[z,0,c[0]-z*f3[0]],[0,z,c[1]-z*f3[1]]]); pm=cv2.warpAffine(pm,M,(W_,H_),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=0)
    comp=bgz(z)*(1-pm[...,3:])+pm[...,:3]
    if prev is not None:                                          # motion blur along the move (about a 180° shutter): it reads as a camera move, not as steps
        d=c-prev; L=int(np.hypot(*d)*0.55)|1
        if L>=5:
            kern=np.zeros((L,L),np.float32); h=L//2; ux,uy=d/max(np.hypot(*d),1e-6)
            for t_ in np.linspace(-h,h,2*L): kern[int(round(h+uy*t_)),int(round(h+ux*t_))]=1
            comp=cv2.filter2D(comp,-1,kern/kern.sum(),borderType=cv2.BORDER_REPLICATE)
    prev=c.copy(); put(i,comp)
for i in range(CUT,P4END+1):
    im=person(i); put(i,bgz(k)*(1-im[...,3:])+im[...,:3]*im[...,3:])
print('push-in on frames',Z0,'–',CUT-1,'· P4 gym scaled',round(k,3))
