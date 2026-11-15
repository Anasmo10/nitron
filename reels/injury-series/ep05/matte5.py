"""EP05 cut-out, pass 2 (EP04 v4 method, client 14 Nov: «فريم فريم، لقطة لقطة… ما بدي ولا تغبيشة… ما بدي الخلفية أبداً تبان»).
python3 matte5.py <take> <first reel frame> <last reel frame>
  1. alpha   BiRefNet-portrait ran on every second frame of the WIDE original (ml5.py, raw 1080×1920 as shot); the frame
             between is the average of its two neighbours moved onto it by optical flow (on the raw frames); then a
             3-frame median, the neighbours moved onto the frame by flow first (a fast hand keeps its fingers).
  2. frame   the alpha is enlarged, padded and cropped exactly like the picture (frames.json, prep5.py).
  3. colour  in the soft edge the cloth's own colour is taken out of the pixel (F = (I − (1−a)·B)/a, B = the cloth pushed
             inward from the clear backdrop), so no white fringe is left on the dark gym.
  No plate cut and no area decision (EP04: they bit notches out of a hoodie and turned hair wisps into a white cap).
Writes ep/bt/p_raw/NNNNN.png (RGBA, reel frame numbers) for relight.py → cleancool.py → stage_composite.py."""
import sys, os, json, math, numpy as np, cv2
B='/home/user/work/ep5'; W=B+'/ep'; n=sys.argv[1]; F0,F1=int(sys.argv[2]),int(sys.argv[3]); OUT=W+'/bt/p_raw'; os.makedirs(OUT,exist_ok=True)
FR=json.load(open(B+'/frames.json'))[n]
TL={p['name']:p for p in json.load(open(W+'/timeline.json'))['pieces']}; RE={p['name']:p for p in json.load(open(W+'/reel.json'))['pieces']}
piece=[k for k,p in RE.items() if p['clip']=='c'+n][0]; fs0=TL[piece]['frames'][0]; k0=math.ceil(RE[piece]['a']*30-1e-6)
K=lambda f: k0+(f-fs0)                                            # reel frame → raw frame (checked against the pictures)
raw=lambda k: cv2.imread(f'{B}/raw/{n}/{k:04d}.jpg')
small=lambda im: cv2.cvtColor(cv2.resize(im,(540,960),interpolation=cv2.INTER_AREA),cv2.COLOR_BGR2GRAY)
dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
gx,gy=np.meshgrid(np.arange(1080,dtype=np.float32),np.arange(1920,dtype=np.float32))
def ml(k):
    p=f'{B}/ml5/{n}/{k:04d}.png'
    return cv2.imread(p,0).astype(np.float32)/255 if os.path.exists(p) else None
FL={}
def warp(a,fr,to):
    if (fr,to) not in FL:
        f=dis.calc(small(raw(to)),small(raw(fr)),None); FL[(fr,to)]=cv2.resize(f,(1080,1920))*2
    f=FL[(fr,to)]; return cv2.remap(a,gx+f[...,0],gy+f[...,1],cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
ks=list(range(K(F0)-1,K(F1)+2)); AL={}
for k in ks:
    a=ml(k)
    if a is None:
        nb=[(j,ml(j)) for j in (k-1,k+1) if ml(j) is not None]
        a=np.mean([warp(x,j,k) for j,x in nb],axis=0) if nb else None
    if a is not None: AL[k]=a
miss=[K(f) for f in range(F0,F1+1) if K(f) not in AL]
if miss: sys.exit(f'no alpha for raw frames {miss[:5]}… (ml5.py not done there)')
def to_reel(a):
    a=cv2.resize(a,(FR['Ws'],FR['Hs']),interpolation=cv2.INTER_CUBIC)
    if FR['pt']: a=np.vstack([np.repeat(a[:1],FR['pt'],axis=0),a])
    return a[FR['yoff']:FR['yoff']+1920,FR['xoff']:FR['xoff']+1080]
def extend(I,a):
    bg=(a<0.02).astype(np.float32); num=cv2.GaussianBlur(I*bg[...,None],(0,0),25); den=cv2.GaussianBlur(bg,(0,0),25)[...,None]
    med=np.median(I[bg>0],axis=0) if bg.sum()>1000 else np.array([200,200,200],np.float32)
    return np.where(den>0.02,num/np.maximum(den,1e-4),med)
for f in range(F0,F1+1):
    k=K(f); nb=[AL[k]]+[warp(AL[j],j,k) for j in (k-1,k+1) if j in AL]
    a=np.median(np.stack(nb),axis=0) if len(nb)==3 else AL[k]
    a=np.clip((to_reel(a).clip(0,1)-0.03)/0.94,0,1)
    I=cv2.imread(f'{W}/vfr_src/{f:05d}.jpg').astype(np.float32)
    Bk=extend(I,a); A=a[...,None]
    Fc=np.clip((I-(1-A)*Bk)/np.maximum(A,0.12),0,255)
    edge=cv2.GaussianBlur(((a>0.01)&(a<0.985)).astype(np.float32),(0,0),1.0)[...,None]
    Fc=I*(1-edge)+Fc*edge
    cv2.imwrite(f'{OUT}/{f:05d}.png',np.dstack([Fc.clip(0,255),a*255]).astype(np.uint8),[cv2.IMWRITE_PNG_COMPRESSION,3])
    if (f-F0)%30==0: print(n,f,'(raw',k,') written',flush=True)
print('matte5',n,F0,F1,'done',flush=True)
