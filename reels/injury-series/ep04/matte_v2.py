"""EP04 v2 cut-out, pass 2 (client, 14 Nov: «التفريغ أبداً مو نضيف، عم تروح وتجي الخلفية البيضاء… أنا ليش عامل لك إياها على
خلفية بيضاء؟ مشان يكون القص نضيف»).
python3 matte_v2.py <first> <last> [--test i,j]      one take at a time (the camera is fixed within a take)

  1. alpha     BiRefNet on every second frame of the wide original (ml_raw.py); the frame between is the average of
               its two neighbours warped onto it by optical flow; then a 3-frame median, the neighbours moved onto the
               frame by optical flow first (a fast hand keeps its fingers).
  2. plate     the white backdrop itself, per pixel: the median of that pixel over the frames where he is clearly
               not there. This is what the white cloth is for.
  3. clean     (only with --plate-cut: on EP04 it bit notches out of the cream hoodie, and the wide-frame cut had already
               left the cloth out) wherever a frame is the same as the plate (within the cloth's own noise), it is backdrop, whatever the
               model said. Only regions that touch the known backdrop are removed, so a spot of the cream hoodie that
               happens to match the cloth (their colours are within 1%) is never cut out of his body.
  3b. decide   a wide region the model is unsure of (alpha 0.12–0.88 over more than a thin edge) is decided by the
               backdrop: unlike the cloth → him, like it → backdrop (the hood's grey lining came and went)
  3c. steady   where he moves slowly, each pixel takes the majority of the 31 frames around it (moved onto this frame by
               optical flow): a part of him is in or out for a run of frames, never flickering (the hood's lining)
  4. colour    in the soft edge, the cloth's own colour is taken out of the pixel (F = (I − (1−a)·B)/a, with B = the
               plate), so no white fringe is left on the dark gym.
Writes ep/bt/p_raw/NNNNN.png (RGBA) for relight.py → cleancool.py → stage_composite.py."""
import sys, os, numpy as np, cv2
W='/home/user/work/ep4/ep'; A0,A1=int(sys.argv[1]),int(sys.argv[2]); OUT=W+'/bt/p_raw'; os.makedirs(OUT,exist_ok=True)
TEST=[int(x) for x in sys.argv[sys.argv.index('--test')+1].split(',')] if '--test' in sys.argv else None
ML=os.environ.get('MLDIR',W+'/bt/ml'); ids=list(range(A0,A1+1))
src=lambda i: cv2.imread(f'{W}/vfr_src/{i:05d}.jpg')
small=lambda im: cv2.cvtColor(cv2.resize(im,(540,960),interpolation=cv2.INTER_AREA),cv2.COLOR_BGR2GRAY)
dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
gx,gy=np.meshgrid(np.arange(1080,dtype=np.float32),np.arange(1920,dtype=np.float32))
def ml(i):
    p=f'{ML}/{i:05d}.png'
    return cv2.imread(p,0).astype(np.float32)/255 if os.path.exists(p) else None
def warp(a,fr,to):          # alpha of frame `fr` moved onto frame `to`
    f=dis.calc(small(src(to)),small(src(fr)),None); f=cv2.resize(f,(1080,1920))*2
    return cv2.remap(a,gx+f[...,0],gy+f[...,1],cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
# 1) alpha for every frame
AL={}
for i in ids:
    a=ml(i)
    if a is None:
        nb=[(j,ml(j)) for j in (i-1,i+1) if A0<=j<=A1 and ml(j) is not None]
        a=np.mean([warp(x,j,i) for j,x in nb],axis=0) if nb else None
    AL[i]=a
AL={i:a for i,a in AL.items() if a is not None}; ids=sorted(AL)
AM={}
for k,i in enumerate(ids):      # 3-frame median, each neighbour first moved onto this frame by optical flow (a fast hand keeps its fingers)
    nb=[AL[i]]+[warp(AL[j],j,i) for j in (ids[k-1] if k>0 else None, ids[k+1] if k+1<len(ids) else None) if j is not None]
    AM[i]=np.median(np.stack(nb),axis=0) if len(nb)==3 else AL[i]
print(len(ids),'alphas', flush=True)
# 2) the backdrop plate of this take
samp=ids[::max(1,len(ids)//40)]; stack=[]; cnt=np.zeros((1920,1080),np.float32)
for i in samp:
    fg=cv2.dilate((AM[i]>0.03).astype(np.uint8),cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(41,41)))
    im=src(i).astype(np.float16); im[fg>0]=np.nan; stack.append(im); cnt+=(fg==0)
plate=np.nanmedian(np.stack(stack),axis=0).astype(np.float32); del stack
REL=(cnt>=3)&np.isfinite(plate).all(2); plate=np.where(np.isfinite(plate),plate,0)
noise=float(np.median([np.abs(cv2.GaussianBlur(src(i).astype(np.float32),(0,0),1.2)-plate)[REL&(AM[i]<0.01)].max(1).mean() for i in samp[:6]]))
T_same,T_diff=max(5.0,2.2*noise),max(13.0,4.5*noise)
print(f'plate: reliable {REL.mean()*100:.0f}% of the frame · cloth noise {noise:.1f} → same < {T_same:.1f}, different > {T_diff:.1f}',flush=True)
cv2.imwrite(f'{W}/bt/plate_{A0}.jpg',plate.astype(np.uint8))
# extended backdrop where the plate is unknown (inside his silhouette all take long): the cloth colour pushed inward
def extend(I,a):
    bg=((a<0.02)&REL).astype(np.float32); num=cv2.GaussianBlur(np.where(REL[...,None],plate,I)*bg[...,None],(0,0),25); den=cv2.GaussianBlur(bg,(0,0),25)[...,None]
    return np.where(REL[...,None],plate,np.where(den>0.02,num/np.maximum(den,1e-4),np.median(plate[REL],axis=0)))
K3=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7))
def decide(i):
    I=src(i).astype(np.float32); a=AM[i].copy()
    # 3) backdrop wherever the frame equals the plate, in regions that touch the known backdrop (off by default, see above)
    if '--plate-cut' in sys.argv:
        d=np.abs(cv2.GaussianBlur(I,(0,0),1.2)-plate).max(2); same=np.clip((T_diff-d)/(T_diff-T_same),0,1)*REL
        S=cv2.morphologyEx((same>0.5).astype(np.uint8),cv2.MORPH_OPEN,K3); n,lab=cv2.connectedComponents(S,connectivity=8)
        known=cv2.dilate(((a<0.08)&REL).astype(np.uint8),K3); touch=np.unique(lab[(known>0)&(S>0)]); keep=np.isin(lab,touch[touch>0])
        a=a*(1-cv2.GaussianBlur((keep*same).astype(np.float32),(0,0),1.0))
    # 3b) where the model hesitates over a wide area (not a thin edge like hair), decide it by the backdrop, area by area:
    #     unlike the cloth → him (the hood's grey lining behind his neck), like the cloth → backdrop
    B0=extend(I,a); d0=np.abs(cv2.GaussianBlur(I,(0,0),1.5)-B0).max(2)
    unc=((a>0.12)&(a<0.88)).astype(np.uint8); plat=cv2.morphologyEx(unc,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))
    plat=cv2.GaussianBlur(cv2.dilate(plat,K3).astype(np.float32),(0,0),2.0)
    dec=cv2.GaussianBlur(np.clip((d0-T_same)/(T_diff-T_same),0,1),(0,0),5)
    db=(np.clip((dec-0.35)/0.3,0,1)>0.5).astype(np.uint8); K9=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9))
    db=cv2.morphologyEx(cv2.morphologyEx(db,cv2.MORPH_OPEN,K9),cv2.MORPH_CLOSE,K9); dec=cv2.GaussianBlur(db.astype(np.float32),(0,0),1.5)
    return (a*(1-plat)+dec*plat).astype(np.float16)
AD={i:decide(i) for i in ids}; print('decided',len(AD),flush=True)
# 3c) the same part of him must not come and go: a region that most of the 12 frames around this one have (each moved
#     onto it by optical flow) is kept on this frame too (the hood's lining was in on most frames, out on a few)
N=int(os.environ.get('VOTE','0'))               # long vote off by default: with conflicting runs it left ragged partial edges
for k,i in enumerate(TEST or ids):
    I=src(i).astype(np.float32); kk=ids.index(i)
    nb=[warp(AD[j].astype(np.float32),j,i) for j in ids[max(0,kk-N):kk+N+1] if j!=i]
    a=AD[i].astype(np.float32)
    if N and len(nb)>=4:
        j2=ids[min(len(ids)-1,kk+1)] if kk+1<len(ids) else ids[kk-1]
        f=dis.calc(small(src(i)),small(src(j2)),None); mag=cv2.resize(np.hypot(f[...,0],f[...,1]),(1080,1920))*2
        slow=cv2.GaussianBlur((mag<3).astype(np.float32),(0,0),6)          # the long vote only where he moves slowly (hood, head); a fast hand keeps the short window
        a=a*(1-slow)+np.median(np.stack(nb+[a]),axis=0)*slow
    a=np.clip((a-0.03)/0.94,0,1)
    # 4) take the cloth's colour out of the soft edge
    B=extend(I,a); A=a[...,None]
    F=np.clip((I-(1-A)*B)/np.maximum(A,0.12),0,255)
    edge=cv2.GaussianBlur(((a>0.01)&(a<0.985)).astype(np.float32),(0,0),1.0)[...,None]
    F=I*(1-edge)+F*edge
    out=np.dstack([F.clip(0,255),a*255]).astype(np.uint8)
    cv2.imwrite(f'{OUT}/{i:05d}.png' if not TEST else f'/home/user/work/ep4/samp/v2_{i}.png',out,[cv2.IMWRITE_PNG_COMPRESSION,3])
    if TEST or k%40==0: print(i,'written',flush=True)
print('v2 matte',A0,A1,'done',flush=True)
