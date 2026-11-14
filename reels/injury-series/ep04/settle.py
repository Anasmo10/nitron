"""EP04: the one take change on screen (P3 → P4, Ahmad to Ahmad). His face is 38 px lower and 6% larger at the end of P3
than at the start of P4, so a plain cut jumps and a dissolve shows two faces. The last 6 frames of P3 move as one camera
(him and the gym together) until his face sits where and as large as it is in P4's first frame; then that frame fades
off the first 3 frames of P4 (bake.py). Reads ep/bt/person + vfr_src, rewrites ep/vfr 679–684."""
import cv2, numpy as np
W='/home/user/work/ep4/ep'; H_,W_=1920,1080; CUT=685; N=6
casc=cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_default.xml')
def faces(fr):
    out=[]
    for i in fr:
        g=cv2.cvtColor(cv2.resize(cv2.imread(f'{W}/vfr_src/{i:05d}.jpg'),(540,960)),cv2.COLOR_BGR2GRAY); r=casc.detectMultiScale(g,1.08,6,minSize=(120,120))
        if len(r): x,y,w,h=max(r,key=lambda q:q[2]); out.append((i,2*x+w,2*y+h,2*w))
    return np.array(out,float)
A=faces(range(CUT-10,CUT)); f3=np.median(A[-4:,1:],axis=0); f4=np.median(faces(range(CUT,CUT+3))[:,1:],axis=0); k=float(f4[2]/f3[2])
print('P3 end face',f3.round(),'· P4 first face',f4.round(),'· scale',round(k,3))
bg=cv2.imread('/home/user/work/ep2/bg/gym_k.png').astype(np.float32)/255
s=max(W_/bg.shape[1],H_/bg.shape[0]); bg=cv2.resize(bg,(round(bg.shape[1]*s),round(bg.shape[0]*s)),interpolation=cv2.INTER_AREA)
y0,x0=(bg.shape[0]-H_)//2,(bg.shape[1]-W_)//2; bg=cv2.GaussianBlur(bg[y0:y0+H_,x0:x0+W_],(0,0),5)
GRAIN=np.random.default_rng(7).normal(0,0.012,(H_,W_,1)).astype(np.float32)
for j,i in enumerate(range(CUT-N,CUT)):
    u=((j+1)/N); u=u*u*(3-2*u); z=1+(k-1)*u; c=f3[:2]+u*(f4[:2]-f3[:2])
    M=np.float32([[z,0,c[0]-z*f3[0]],[0,z,c[1]-z*f3[1]]])
    im=cv2.imread(f'{W}/bt/person/{i:05d}.png',cv2.IMREAD_UNCHANGED).astype(np.float32)/255
    pm=np.dstack([im[...,:3]*im[...,3:],im[...,3:]]); pm=cv2.warpAffine(pm,M,(W_,H_),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=0)
    Mb=np.float32([[z,0,540*(1-z)+(c[0]-f3[0])*0.4],[0,z,960*(1-z)+(c[1]-f3[1])*0.4]])        # the room moves less than he does: depth
    b=cv2.warpAffine(bg,Mb,(W_,H_),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_REFLECT)
    comp=b*(1-pm[...,3:])+pm[...,:3]
    cv2.imwrite(f'{W}/vfr/{i:05d}.jpg',(np.clip(comp+GRAIN,0,1)*255+0.5).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,95])
    al=pm[...,3:]; F=np.where(al>1e-4,pm[...,:3]/np.maximum(al,1e-4),0); cv2.imwrite(f'{W}/bt/person/{i:05d}.png',(np.dstack([F,al]).clip(0,1)*255+0.5).astype(np.uint8))   # the moved layer, for anything drawn behind him
print('settle on frames',CUT-N,'–',CUT-1)
