"""EP07: the right movement on C3's film card. Real footage (the injury clip src 15.9–18.9 s: a clean EZ-bar preacher curl,
before the creator's overlay lines start at ~19 s), Real-ESRGAN ×4, interpolated to 60 fps and shown at 0.5×:
first the lowering (the lift played backwards, 18.8 → 16.0 s: «نزّل بهدوء»), then the lift (16.0 → …: «بالطلوع والنزول»).
Baked into ep/vfr inside the film window (FILM in scenes_body7.js); the scene shows the frame through it."""
import cv2, numpy as np, glob, json, os, subprocess
B='/home/user/work/ep7'; W=B+'/ep'
FILM=(170,470,740,700); CROP=(40,500,1000,946)
d=f'{B}/sr/demo2'; mi=f'{d}/mi'
if not os.path.isdir(mi):
    os.makedirs(mi); subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-framerate','30','-i',f'{d}/up/%04d.jpg','-vf','minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1','-q:v','2','-start_number','0',f'{mi}/%04d.jpg'],check=True)
MI=sorted(glob.glob(f'{mi}/*.jpg')); print('mi frames',len(MI))
hdr=open(W+'/scenes.js').read().split('\n')[0]
T={k:float(v) for k,v in [x.strip().split('=') for x in hdr.replace('const ','').rstrip(';').split(',')]}
t0,t1=T['T_C3IN'],T['T_C3OUT']+0.25
def grade(im):
    o=im.astype(np.float32)/255; g=o.mean(2,keepdims=True); o=g+(o-g)*0.88; o=np.clip((o-0.5)*1.06+0.49,0,1)
    sh=np.clip(1-g/0.35,0,1); return (o+sh*np.array([0.018,-0.004,0.010],np.float32)).clip(0,1)
n=0
for f in range(int(t0*30)+1,int(t1*30)+2):
    t=(f-1)/30; tr=max(0,t-t0); s=18.8-0.5*tr if tr<5.6 else 16.0+0.5*(tr-5.6)
    k=min(len(MI)-1,max(0,round((s-15.9)*60)))
    im=cv2.imread(MI[k]); x,y,w,h=CROP; c=cv2.resize(im[y:y+h,x:x+w],(FILM[2],FILM[3]),interpolation=cv2.INTER_AREA)
    c=(grade(c)*255+0.5).astype(np.uint8)
    p=f'{W}/vfr/{f:05d}.jpg'; v=cv2.imread(p); X0,Y0,FW,FH=FILM; v[Y0:Y0+FH,X0:X0+FW]=c; cv2.imwrite(p,v,[cv2.IMWRITE_JPEG_QUALITY,95]); n+=1
print('baked',n,'frames',int(t0*30)+1,'→',int(t1*30)+1)
