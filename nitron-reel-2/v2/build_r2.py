# Reel #2 v2.1 frames: same pieces/timeline as v1, every piece full frame (no card, no lower panel).
import json, os, numpy as np, cv2
V="/home/user/work/v4"; R="/home/user/work/r2"
P=json.load(open(V+"/pieces.json")); F=json.load(open(V+"/faces.json"))
# zoom start→end, snap (s), face target y (None = as high as the zoom allows without uncovering an edge)
ZOOM={"P1":(1.30,1.20,0.4,None),"P2":(1.12,1.16,0,700),"P3a":(1.06,1.12,0,None),
      "P3b":(1.00,1.00,0,None),"P4a":(1.15,1.17,0,600),"P4b":(1.00,1.02,0,None)}
TX={"P4a":560}
def place(cx,cy,z,tx,ty):
    ty=cy*z if ty is None else ty
    tx=min(max(tx,1080-(1080-cx)*z),cx*z); ty=min(max(ty,1920-(1920-cy)*z),cy*z)
    return np.float32([[z,0,tx-cx*z],[0,z,ty-cy*z]])
k=0; tl=[]
for name,c,a,b in P:
    f=F[name]; n=f["n"]; z0,z1,snap,ty=ZOOM[name]; s0=k
    for i in range(n):
        if snap: u=min(1,(i/30)/snap); z=z0+(z1-z0)*(1-(1-u)**3)
        else: z=z0+(z1-z0)*i/max(1,n-1)
        im=cv2.imread(f"{V}/pieces/{name}/{i+1:04d}.jpg")
        M=place(f["cx"],f["cy"],z,TX.get(name,540),ty)
        out=cv2.warpAffine(im,M,(1080,1920),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REFLECT)
        k+=1; cv2.imwrite(f"{R}/vfr/{k:05d}.jpg",out,[cv2.IMWRITE_JPEG_QUALITY,95])
    zm=(z0+z1)/2; M=place(f["cx"],f["cy"],zm,TX.get(name,540),ty)
    tl.append({"piece":name,"f0":s0+1,"f1":k,"s":round(s0/30,3),"e":round(k/30,3),"face_y":round(float(M[1,1]*f["cy"]+M[1,2])),"headtop":round(float(M[1,1]*f["headtop"]+M[1,2]))})
json.dump(tl,open(R+"/timeline.json","w"),indent=1); print(json.dumps(tl,indent=0)); print("frames",k)
