"""EP05: a lateral radiograph of a hand pressing a barbell, rendered the way an X-ray forms (EP04's method: brightness =
1 − exp(−k·Σ μ·path); a long bone is a hollow tube, its ends spongy; steel saturates). Seen from the side, along the
bar: the bar is a bright disc in the hand. Layers (1000×1400 RGBA, alpha = brightness) so the scene can move them:
  x5_fore       radius and ulna (overlapping, as on a lateral film) + forearm soft tissue
  x5_hand       carpals, metacarpals, the four fingers hooked over the bar + hand soft tissue (no thumb)
  x5_thumb_off  the thumb beside the index: the «suicide» (thumbless) grip, the ring round the bar is open
  x5_thumb_on   the thumb wrapped under the bar to meet the fingers: the closed grip, the ring is shut
  x5_bar        the barbell's shaft end-on
plus x5_geom.json (wrist pivot, bar centre, the opening of the grip) for the scene."""
import numpy as np, cv2, json, sys
sys.argv=[sys.argv[0]]
exec(open('/home/user/work/ep4/xray.py').read().split('TB = (0.93')[0].replace('W, H = 1000, 1700','W, H = 1000, 1400'))
TB=(0.93,0.95,1.0); TM=(1.0,1.0,1.0); OUT='/home/user/work/ep5/ep/'
def save(name,L):
    out=np.dstack([L[..., :3][..., ::-1],L[..., 3:]])*255; cv2.imwrite(OUT+name+'.png',out.clip(0,255).astype(np.uint8)); print(name,'max',round(float(L[...,3].max()),2))
P=(500,800); B=(548,636); BR=42
# ---- forearm: radius and ulna overlap on a lateral film ----------------------------------------------------------------
RAD=np.concatenate([curve((515,812),(520,880),(524,960),12)[:-1],curve((524,960),(536,1200),(528,1460),36)])
r_R=np.interp(np.linspace(0,1,len(RAD)),[0,0.05,0.16,0.3,1],[46,42,28,22,19]).astype(np.float32)
ULN=np.concatenate([curve((474,826),(470,880),(468,960),10)[:-1],curve((468,960),(456,1200),(466,1460),36)])
u_R=np.interp(np.linspace(0,1,len(ULN)),[0,0.06,0.2,1],[24,21,16,18]).astype(np.float32)
A_f=tube(RAD,r_R)+tube(ULN,u_R)*0.9
def limb(cxs,ys,half,depth=0.8,mu=0.0026,fade=(70,70)):
    hw=np.interp(yy,ys,half); cx=np.interp(yy,ys,cxs); q=1-((xx-cx)/np.maximum(hw,1))**2
    end=np.clip((yy-ys[0])/fade[0],0,1)*np.clip((ys[-1]-yy)/fade[1],0,1); end=end*end*(3-2*end)
    return cv2.GaussianBlur(2*depth*hw*np.sqrt(np.clip(q,0,None))*end*mu,(0,0),2.5)
A_fs=limb([498,500,500,498],[760,900,1150,1440],[92,104,118,124],fade=(60,10))
fore=to_layer(A_f*0.05+A_fs,1.0,TB); save('x5_fore',fore)
# ---- hand (no thumb) ---------------------------------------------------------------------------------------------------
A_h=np.zeros((H,W),np.float32)
for cx,cy,a,b,ang in [(470,776,26,22,0.3),(506,782,24,22,0),(540,774,20,18,-0.3),(482,740,22,19,0.4),(516,744,22,20,0),(548,742,18,16,-0.2),(498,716,16,14,0)]:
    A_h+=blob(cx,cy,a,b,ang,0.30)
K=[]
for (bx,by),(tx,ty),r in [((486,722),(452,548),16),((500,720),(466,552),17),((512,726),(480,560),15)]:     # metacarpals, overlapping on the side view
    A_h+=tube(curve((bx,by),((bx+tx)/2-6,(by+ty)/2),(tx,ty),24),np.interp(np.linspace(0,1,24),[0,0.12,0.85,1],[r+5,r-2,r-3,r+7]).astype(np.float32),trab_ends=0.22); K.append((tx,ty))
for (kx,ky),(dx,dy) in zip(K,[(0,0),(8,6),(14,14)]):    # fingers hooked over the bar: proximal over the top, middle down the far side, distal under it
    p1=(kx+6,ky-4); a1=(570+dx,552+dy); a2=(622+dx*0.6,604+dy*0.4); a3=(616+dx*0.3,660+dy*0.2)
    A_h+=tube(curve(p1,((p1[0]+a1[0])/2,min(p1[1],a1[1])-14),a1,20),np.interp(np.linspace(0,1,20),[0,0.15,0.85,1],[16,12,11,15]).astype(np.float32),trab_ends=0.25)
    A_h+=tube(curve(a1,((a1[0]+a2[0])/2+10,(a1[1]+a2[1])/2-10),a2,14),np.interp(np.linspace(0,1,14),[0,0.2,0.8,1],[14,10,10,13]).astype(np.float32),trab_ends=0.3)
    A_h+=tube(curve(a2,((a2[0]+a3[0])/2+8,(a2[1]+a3[1])/2),a3,10),np.interp(np.linspace(0,1,10),[0,0.3,1],[12,9,7]).astype(np.float32),trab_ends=0.35)
    A_h+=blob(a3[0],a3[1]+4,9,8,0,0.4)
hand_poly=[(420,560),(452,522),(520,512),(590,520),(648,560),(664,620),(656,682),(626,704),(596,690),(604,640),(586,600),(548,592),(512,604),(500,660),(560,712),(586,760),(580,812),(424,812),(430,700)]
A_hs=soft(hand_poly,7,0.042)
hand=to_layer(A_h*0.05+A_hs,1.0,TB); save('x5_hand',hand)
# ---- thumb, two ways ---------------------------------------------------------------------------------------------------
def thumb(pts,rads,poly):
    A=np.zeros((H,W),np.float32)
    for (p0,p1),r in zip(zip(pts[:-1],pts[1:]),rads):
        A+=tube(curve(p0,((p0[0]+p1[0])/2,(p0[1]+p1[1])/2-4),p1,16),np.interp(np.linspace(0,1,16),[0,0.15,0.85,1],[r+4,r-1,r-2,r+3]).astype(np.float32),trab_ends=0.28)
    return to_layer(A*0.05+soft(poly,7,0.040),1.0,TB)
off=thumb([(536,764),(474,694),(446,632),(452,584)],[16,13,11],[(470,790),(556,786),(500,700),(476,630),(476,572),(430,572),(420,640),(450,716)])
save('x5_thumb_off',off)
on=thumb([(532,768),(516,704),(574,708),(612,674)],[16,13,11],[(500,784),(560,782),(548,736),(600,728),(640,690),(626,656),(596,680),(560,690),(530,688),(498,690)])
save('x5_thumb_on',on)
# ---- the bar, end-on ---------------------------------------------------------------------------------------------------
d=np.sqrt((xx-B[0])**2+(yy-B[1])**2); A_b=np.clip((BR-d)/1.6,0,1)*(1.0+0.08*np.clip(1-np.abs(d-BR+5)/4,0,1))*90
bar=to_layer(A_b*0.05,1.0,TM,grain=0.03,blur=0.8); save('x5_bar',bar)
json.dump({'W':W,'H':H,'wrist':list(P),'bar':list(B),'barR':BR,'open':[586,676],'thumb':[500,640],'elbow':[500,1440]},open(OUT+'x5_geom.json','w'))
def comp(layers):
    acc=np.zeros((H,W,3),np.float32)
    for L in layers: acc=acc+L[..., :3]*L[..., 3:]
    return np.clip(np.zeros((H,W,3),np.float32)+np.array([0.04,0.02,0.05])+acc,0,1)
cv2.imwrite('/home/user/work/ep5/samp/x5_preview.jpg',(np.hstack([comp([fore,hand,off,bar]),comp([fore,hand,on,bar])])[..., ::-1]*255).astype(np.uint8))
