"""EP04 cover hero: the radiograph from the film, at the moment of the fracture (both bones broken, the hand and the
dumbbell tilted out), with a ring on the break. Alpha = brightness, so it glows on the cover's dark stage."""
import cv2, numpy as np, json
E='/home/user/work/ep4/ep/'; G=json.load(open(E+'xr_geom.json')); W,H=G['W'],G['H']
def ld(n): im=cv2.imread(E+n,cv2.IMREAD_UNCHANGED).astype(np.float32)/255; return im[...,:3]*im[...,3:], im[...,3]   # premultiplied colour, alpha
FR=G['fracture']; FC=np.array([(FR['radius'][0]+FR['ulna'][0])/2,(FR['radius'][1]+FR['ulna'][1])/2],np.float32)
jag=[]
for i in range(25):
    x=300+(720-300)*i/24; f=(x-FR['ulna'][0])/(FR['radius'][0]-FR['ulna'][0]); yb=FR['ulna'][1]+(FR['radius'][1]-FR['ulna'][1])*min(1.4,max(-0.4,f))
    jag.append([x,yb+(11 if i%2 else -9)+(6 if i%5==0 else 0)])
above=np.zeros((H,W),np.float32); cv2.fillPoly(above,[np.array([[-10,-10],[1010,-10],[1010,jag[-1][1]]]+jag[::-1]+[[-10,jag[0][1]]],np.int32)],1.0); above=cv2.GaussianBlur(above,(0,0),0.6)
def rot(img,c,a):
    M=cv2.getRotationMatrix2D((float(c[0]),float(c[1])),-np.degrees(a),1.0)
    return cv2.warpAffine(img,M,(W,H),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=0)
fc,fa=ld('xr_forearm.png'); hc,ha=ld('xr_hand.png'); bc,ba=ld('xr_bell.png')
tilt,phi=0.30,0.17
lowc,lowa=fc*(1-above[...,None]),fa*(1-above); upc,upa=fc*above[...,None],fa*above
hb_c=rot(hc+bc,G['wrist'],tilt); hb_a=rot(np.clip(ha+ba,0,1),G['wrist'],tilt)
dc=rot(upc+hb_c,FC,phi); da=rot(np.clip(upa+hb_a,0,1),FC,phi)
col=np.clip(lowc+dc,0,1); a=np.clip(1-(1-lowa)*(1-da),0,1)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32); LIL=np.array([219,125,199],np.float32)/255     # BGR
for p in (FR['ulna'],FR['radius']):
    g=np.exp(-((xx-p[0])**2+(yy-p[1])**2)/(2*55**2))[...,None]; col=np.clip(col+g*(0.55*LIL+0.35),0,1); a=np.clip(a+g[...,0]*0.8,0,1)
ring=np.zeros((H,W),np.float32); cv2.circle(ring,(int(FC[0]),int(FC[1])),118,1.0,7,cv2.LINE_AA); cv2.circle(ring,(int(FC[0]),int(FC[1])),168,0.45,4,cv2.LINE_AA); ring=cv2.GaussianBlur(ring,(0,0),1.0)
col=np.clip(col*(1-ring[...,None])+ring[...,None]*1.0,0,1); a=np.clip(np.maximum(a,ring),0,1)
a[:330]=0; a[int(FC[1])+250:]=0                                                   # the cover keeps the hand, the tilt and the break; the elbow and the plates' tops go
fadeT=np.clip((yy-330)/90,0,1); fadeB=np.clip((int(FC[1])+250-yy)/120,0,1); a=a*fadeT*fadeB
ys,xs=np.where(a>0.04); x0,x1,y0,y1=max(0,xs.min()-30),min(W,xs.max()+30),max(0,ys.min()-10),min(H,ys.max()+10)
rgb=np.where(a[...,None]>1e-4,col/np.maximum(a[...,None],1e-4),0); out=np.dstack([np.clip(rgb,0,1),a])[y0:y1,x0:x1]
cv2.imwrite('/home/user/work/ep4/cover/hero.png',(out*255+0.5).astype(np.uint8)); print('hero',out.shape)
