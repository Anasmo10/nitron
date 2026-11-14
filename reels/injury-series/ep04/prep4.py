"""EP04: frame each on-camera take bigger (client, 14 Nov: «تخلي كتافه على قد الفريم لأنه أحمد بيطلع من الكادر كتير»).
The sources are 1080×1920 (not 4K as in EP03), so the scale is kept modest (face width 0.40·W, about ×1.15) to stay sharp.
The scaled raw frame always covers the output on the left, right and bottom: the raw frame's edges never show.
Face (cx, cy, w) = median over the part of the take that is on screen."""
import json, numpy as np
WIN={'7455':(0.9,2.9),'7460':(5.4,8.9),'7461':(0.6,6.5)}
out={}
for n,(a,b) in WIN.items():
    d=np.array([o[1:] for o in json.load(open(f'samp/face_{n}.json')) if a<=o[0]<=b and o[1] is not None],float)
    cx,cy,w=np.median(d,axis=0); s=max(1.0,0.40/w); Ws=int(round(1080*s/2))*2; Hs=int(round(1920*s/2))*2
    xl=min(0,max(1080-Ws,round(540-cx*Ws))); yt=max(round(730-cy*Hs),1920-Hs)
    pt=max(0,yt); pt+=pt%2; yoff=max(0,-yt); yoff-=yoff%2; xoff=-xl; xoff-=xoff%2
    vf=f"scale={Ws}:{Hs}:flags=lanczos"
    if pt: vf+=f",pad={Ws}:{Hs+pt}:0:{pt}:color=white,fillborders=top={pt}:mode=smear"
    vf+=f",crop=1080:1920:{xoff}:{yoff},fps=30"
    out[n]=dict(s=round(Ws/1080,4),face=[round(-xoff+cx*Ws),round((pt if pt else -yoff)+cy*Hs),round(w*Ws)],vf=vf); print(n,out[n])
json.dump(out,open('frames.json','w'),indent=1)
