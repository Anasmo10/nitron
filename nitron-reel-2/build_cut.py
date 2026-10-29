# Cut timeline for the 4-clip Nitron reel: per-piece zoom (sub-pixel, Lanczos) + loudness-matched voice.
import json, os, subprocess, numpy as np, cv2
V=os.path.dirname(os.path.abspath(__file__)); W=V+"/work"
P=json.load(open(V+"/pieces.json")); F=json.load(open(V+"/faces.json"))
# zoom start/end, target face position on screen (None = keep where it is)
ZOOM={"P1":(1.00,1.05,(540,None)),"P2":(1.12,1.16,(540,700)),"P3a":(1.00,1.03,(540,None)),
      "P3b":(1.05,1.08,(540,None)),"P4a":(1.15,1.17,(560,600)),"P4b":(1.00,1.02,(540,None))}
TOPLOCK={"P3a","P3b"}   # info-panel pieces sit in the lower card: zoom from the top edge so the head is never cut
def place(cx,cy,z,tx,ty):
    tx=cx if tx is None else tx; ty=cy if ty is None else ty
    tx=min(max(tx,1080-(1080-cx)*z),cx*z); ty=min(max(ty,1920-(1920-cy)*z),cy*z)   # never uncover an edge
    return np.float32([[z,0,tx-cx*z],[0,z,ty-cy*z]])
k=0; segs=[]
for name,c,a,b in P:
    f=F[name]; n=f["n"]; z0,z1,(tx,ty)=ZOOM[name]
    for i in range(n):
        u=i/max(1,n-1); z=z0+(z1-z0)*u
        im=cv2.imread(f"{V}/pieces/{name}/{i+1:04d}.jpg")
        M=place(f["cx"],0,z,tx,0) if name in TOPLOCK else place(f["cx"],f["cy"],z,tx,ty)
        out=cv2.warpAffine(im,M,(1080,1920),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REFLECT)
        k+=1; cv2.imwrite(f"{W}/vfr/{k:05d}.jpg",out,[cv2.IMWRITE_JPEG_QUALITY,95])
    segs.append((name,c,a,n))
# voice: 48 kHz, exact piece lengths, 6 ms edge fades, speech RMS matched across clips
SR=48000; pcs=[]
for name,c,a,n in segs:
    raw=subprocess.run(["ffmpeg","-v","error","-ss",f"{a}","-i",f"{V}/{c}.mov","-t",f"{n/30:.5f}","-vn","-ac","1","-ar",str(SR),
        "-af","highpass=f=70","-f","f32le","-"],capture_output=True,check=True).stdout
    x=np.frombuffer(raw,np.float32).copy(); L=round(n/30*SR); x=np.pad(x,(0,max(0,L-len(x))))[:L]
    fr=x[:len(x)//480*480].reshape(-1,480); r=np.sqrt((fr**2).mean(1)); act=r[r>np.percentile(r,60)]
    x*= 0.08/ (act.mean()+1e-9)                       # same spoken level for every clip
    f=int(0.006*SR); ramp=np.linspace(0,1,f); x[:f]*=ramp; x[-f:]*=ramp[::-1]
    pcs.append(x); print(name, n, "frames", f"{n/30:.3f}s", "gain", round(0.08/(act.mean()+1e-9),2))
v=np.concatenate(pcs); v=np.clip(v,-0.98,0.98)
open(W+"/voice.f32","wb").write(v.astype(np.float32).tobytes())
subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac","1","-i",W+"/voice.f32",W+"/voice.wav"],check=True)
subprocess.run(["ffmpeg","-v","error","-y","-framerate","30","-i",W+"/vfr/%05d.jpg","-i",W+"/voice.wav","-c:v","libx264","-crf","14","-preset","medium",
    "-pix_fmt","yuv420p","-c:a","aac","-b:a","256k","-shortest","-movflags","+faststart",W+"/cutz.mp4"],check=True)
print("total frames",k, "dur", round(k/30,3))
