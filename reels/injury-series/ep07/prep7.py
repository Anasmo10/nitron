"""EP07 (copy of ep5/prep5.py): frame each on-camera take bigger, shoulders to the frame edge (series rule since EP03/EP04).
Face width 0.40·W (Haar box), scale capped at 1.20 (sources are 1080×1920: more would soften him), face centre at
(540, 730). The scaled raw frame always covers the output on the left, right and bottom; above his head the cloth is
smeared upward (it is cut away by the matte). One fixed transform per take (median face over its on-camera window)."""
import json, numpy as np
WIN={"7521": (3.85, 6.42), "7523": (1.2, 4.08), "7529": (1.02, 2.42), "7531": (1.6, 4.9), "7534": (0.8, 4.72)}
out={}
for n,(a,b) in WIN.items():
    d=np.array([o[1:] for o in json.load(open(f'samp/face_{n}.json')) if a<=o[0]<=b and o[1] is not None],float)
    cx,cy,w=np.median(d,axis=0); s=min(1.20,max(1.0,0.40/w)); Ws=int(round(1080*s/2))*2; Hs=int(round(1920*s/2))*2
    xl=min(0,max(1080-Ws,round(540-cx*Ws))); yt=max(round(730-cy*Hs),1920-Hs)
    pt=max(0,yt); pt+=pt%2; yoff=max(0,-yt); yoff-=yoff%2; xoff=-xl; xoff-=xoff%2
    out[n]=dict(s=round(Ws/1080,4),Ws=Ws,Hs=Hs,pt=pt,xoff=xoff,yoff=yoff,face=[round(-xoff+cx*Ws),round((pt if pt else -yoff)+cy*Hs),round(w*Ws)])
    print(n,out[n])
json.dump(out,open('frames.json','w'),indent=1)
