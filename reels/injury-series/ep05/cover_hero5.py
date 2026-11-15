"""EP05 cover hero: the lateral radiograph from the film at the moment the bar leaves the hand: the wrist folded back,
the thumb (lilac) beside the fingers instead of round the bar, the bar half out of the open side, a ring on the gap.
Alpha = brightness, so it glows on the cover's dark stage."""
import cv2, numpy as np, json
E='/home/user/work/ep5/ep/'; G=json.load(open(E+'x5_geom.json')); W,H=G['W'],G['H']; P=G['wrist']; B=G['bar']
def ld(n): im=cv2.imread(E+n,cv2.IMREAD_UNCHANGED).astype(np.float32)/255; return im[...,:3]*im[...,3:], im[...,3]
def rot(img,a):  # CCW by a (the wrist folding back), about the wrist
    M=cv2.getRotationMatrix2D((float(P[0]),float(P[1])),np.degrees(a),1.0); return cv2.warpAffine(img,M,(W,H),flags=cv2.INTER_LINEAR,borderValue=0)
fc,fa=ld('x5_fore.png'); hc,ha=ld('x5_hand.png'); tc,ta=ld('x5_thumb_off.png'); bc,ba=ld('x5_bar.png')
th=0.50; LIL=np.array([219,125,199],np.float32)/255     # BGR
tc=ta[...,None]*(0.35+0.65*LIL)                          # the thumb in lilac
hc2=rot(hc+tc,th); ha2=rot(np.clip(ha+ta,0,1),th)
def rp(p,a): dx,dy=p[0]-P[0],p[1]-P[1]; return (P[0]+dx*np.cos(a)+dy*np.sin(a), P[1]-dx*np.sin(a)+dy*np.cos(a))
bp=rp((B[0]+62,B[1]+48),th); M=np.float32([[1,0,bp[0]-B[0]],[0,1,bp[1]-B[1]]])
bc2=cv2.warpAffine(bc,M,(W,H)); ba2=cv2.warpAffine(ba,M,(W,H))
col=np.clip(fc+hc2+bc2,0,1); a=np.clip(1-(1-fa)*(1-ha2)*(1-ba2),0,1)
op=rp((B[0]+46,B[1]+40),th); ring=np.zeros((H,W),np.float32); cv2.circle(ring,(int(op[0]),int(op[1])),96,1.0,7,cv2.LINE_AA); cv2.circle(ring,(int(op[0]),int(op[1])),140,0.45,4,cv2.LINE_AA); ring=cv2.GaussianBlur(ring,(0,0),1.0)
rc=ring[...,None]*(0.55*LIL+0.45); col=np.clip(col*(1-ring[...,None])+rc,0,1); a=np.clip(np.maximum(a,ring),0,1)
yy=np.mgrid[0:H,0:W][0].astype(np.float32); a=a*np.clip((1060-yy)/140,0,1)          # the forearm fades out below the wrist
ys,xs=np.where(a>0.04); x0,x1,y0,y1=max(0,xs.min()-30),min(W,xs.max()+30),max(0,ys.min()-10),min(H,ys.max()+10)
rgb=np.where(a[...,None]>1e-4,col/np.maximum(a[...,None],1e-4),0); out=np.dstack([np.clip(rgb,0,1),a])[y0:y1,x0:x1]
cv2.imwrite('/home/user/work/ep5/cover/hero.png',(out*255+0.5).astype(np.uint8)); print('hero',out.shape)
