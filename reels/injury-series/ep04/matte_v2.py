"""EP04 v2 cut-out, pass 2 (client, 14 Nov: «التفريغ أبداً مو نضيف، عم تروح وتجي الخلفية البيضاء… أنا ليش عامل لك إياها على
خلفية بيضاء؟ مشان يكون القص نضيف»).
python3 matte_v2.py <first> <last> [--test i,j]      one take at a time (the camera is fixed within a take)

  1. alpha     BiRefNet on every second frame of the wide original (ml_raw.py); the frame between is the average of
               its two neighbours warped onto it by optical flow; then a 3-frame median, the neighbours moved onto the
               frame by optical flow first (a fast hand keeps its fingers).
  2. plate     the white backdrop itself, per pixel: the median of that pixel over the frames where he is clearly
               not there. This is what the white cloth is for.
  3. clean     wherever a frame is the same as the plate (within the cloth's own noise), it is backdrop, whatever the
               model said. Only regions that touch the known backdrop are removed, so a spot of the cream hoodie that
               happens to match the cloth (their colours are within 1%) is never cut out of his body.
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
for i in (TEST or ids):
    I=src(i).astype(np.float32); a=AM[i].copy()
    # 3) backdrop wherever the frame equals the plate, in regions that touch the known backdrop
    d=np.abs(cv2.GaussianBlur(I,(0,0),1.2)-plate).max(2); same=np.clip((T_diff-d)/(T_diff-T_same),0,1)*REL
    S=(same>0.5).astype(np.uint8); S=cv2.morphologyEx(S,cv2.MORPH_OPEN,K3)
    n,lab=cv2.connectedComponents(S,connectivity=8)
    known=cv2.dilate(((a<0.08)&REL).astype(np.uint8),K3)
    touch=np.unique(lab[(known>0)&(S>0)]); keep=np.isin(lab,touch[touch>0])
    cut=cv2.GaussianBlur((keep*same).astype(np.float32),(0,0),1.0)
    removed=float(((a>0.5)&(cut>0.5)).sum())
    a=a*(1-cut)
    a=np.clip((a-0.03)/0.94,0,1)
    # 4) take the cloth's colour out of the soft edge
    B=extend(I,a); A=a[...,None]
    F=np.clip((I-(1-A)*B)/np.maximum(A,0.12),0,255)
    edge=cv2.GaussianBlur(((a>0.01)&(a<0.985)).astype(np.float32),(0,0),1.0)[...,None]
    F=I*(1-edge)+F*edge
    out=np.dstack([F.clip(0,255),a*255]).astype(np.uint8)
    cv2.imwrite(f'{OUT}/{i:05d}.png' if not TEST else f'/home/user/work/ep4/samp/v2_{i}.png',out,[cv2.IMWRITE_PNG_COMPRESSION,3])
    if TEST or i%40==0: print(i,'backdrop pixels the model had kept and the plate removed:',int(removed),flush=True)
print('v2 matte',A0,A1,'done',flush=True)
