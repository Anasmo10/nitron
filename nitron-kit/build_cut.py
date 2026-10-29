"""Nitron kit — cut timeline builder.  python3 build_cut.py <reel.json> <workdir>

Every Nitron reel starts here: pieces of the raw clips → one graded, zoomed 1080×1920 / 30 fps
frame sequence (<work>/vfr) + a loudness-matched voice track (<work>/voice.wav, voice.f32) +
<work>/cutz.mp4, and <work>/timeline.json (where each piece starts in the cut).

reel.json
  "clips":  {"<id>": {"file": "<path>.mov", "wall": [x0,y0,x1,y1]}}   wall = a patch of plain wall
            (fractions of the frame) used to match white balance across clips
  "pieces": [{"name","clip","a","b","zoom":[z0,z1],"target":[x|null,y|null],"toplock":false}]
            a/b = raw seconds · zoom drifts z0→z1 across the piece · target = where the face lands
            · toplock = zoom from the top edge (pieces shown in the lower card: the head never gets cut)
"""
import json, os, subprocess, sys, numpy as np, cv2
FPS=30; WALL=np.array([212,204,193.])       # house cream-wall target (R,G,B)
LOOK=("hqdn3d=1.5:1.5:3:3,curves=m='0/0 0.25/0.23 0.5/0.53 0.8/0.85 1/1',"
      "eq=saturation=1.12,unsharp=5:5:0.55:5:5:0")
cfg=json.load(open(sys.argv[1])); W=os.path.abspath(sys.argv[2]); os.makedirs(W+"/vfr",exist_ok=True)
P=W+"/_pieces"; os.makedirs(P,exist_ok=True)
casc=cv2.CascadeClassifier(cv2.data.haarcascades+"haarcascade_frontalface_default.xml")
def frame_at(f,t):
    raw=subprocess.run(["ffmpeg","-v","error","-ss",f"{t}","-i",f,"-frames:v","1","-f","image2pipe","-vcodec","png","-"],capture_output=True).stdout
    return cv2.imdecode(np.frombuffer(raw,np.uint8),cv2.IMREAD_COLOR)
# 1) white balance per clip from its wall patch
gains={}
for cid,c in cfg["clips"].items():
    dur=float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",c["file"]],capture_output=True,text=True).stdout)
    x0,y0,x1,y1=c.get("wall",[0.55,0.05,0.95,0.25]); vals=[]
    for t in np.linspace(0.2,dur-0.2,5):
        im=frame_at(c["file"],t); h,w=im.shape[:2]; p=im[int(h*y0):int(h*y1),int(w*x0):int(w*x1)].reshape(-1,3)
        vals.append(np.median(p,axis=0)[::-1])
    g=WALL/np.median(vals,axis=0); gains[cid]=[round(float(v),3) for v in g]
    print(f"{cid}: wall RGB {np.round(np.median(vals,axis=0)).astype(int).tolist()} → gains {gains[cid]}")
# 2) grade + scale each piece to frames, exact frame count
info={}
for p in cfg["pieces"]:
    n=round((p["b"]-p["a"])*FPS); d=f"{P}/{p['name']}"; os.makedirs(d,exist_ok=True)
    for f in os.listdir(d): os.remove(os.path.join(d,f))
    r,g,b=gains[p["clip"]]
    vf=f"fps={FPS},colorchannelmixer=rr={r}:gg={g}:bb={b},{LOOK},scale=1080:1920:flags=lanczos"
    subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{p['a']}","-i",cfg["clips"][p["clip"]]["file"],"-vf",vf,"-frames:v",str(n),"-q:v","1",f"{d}/%04d.jpg"],check=True)
    have=len(os.listdir(d))
    while have<n:   # pad a short tail by repeating the last frame
        subprocess.run(["cp",f"{d}/{have:04d}.jpg",f"{d}/{have+1:04d}.jpg"]); have+=1
    fc=[]
    for k in np.linspace(0,n-1,9).astype(int):
        gr=cv2.cvtColor(cv2.imread(f"{d}/{k+1:04d}.jpg"),cv2.COLOR_BGR2GRAY); r_=casc.detectMultiScale(cv2.resize(gr,(540,960)),1.1,5,minSize=(50,50))
        if len(r_): x,y,w,h=[v*2 for v in max(r_,key=lambda q:q[2])]; fc.append((x+w/2,y+h/2,w,y-0.35*h))
    fc=np.median(np.array(fc),axis=0) if fc else np.array([540,700,300,400])
    info[p["name"]]={"n":n,"cx":float(fc[0]),"cy":float(fc[1]),"fw":float(fc[2]),"headtop":float(fc[3])}
# 3) zoom (sub-pixel Lanczos), never uncovering an edge
def place(cx,cy,z,tx,ty):
    tx=cx if tx is None else tx; ty=cy if ty is None else ty
    tx=min(max(tx,1080-(1080-cx)*z),cx*z); ty=min(max(ty,1920-(1920-cy)*z),cy*z)
    return np.float32([[z,0,tx-cx*z],[0,z,ty-cy*z]])
for f in os.listdir(W+"/vfr"): os.remove(os.path.join(W+"/vfr",f))
k=0; start=0.0; tl=[]
for p in cfg["pieces"]:
    f=info[p["name"]]; n=f["n"]; z0,z1=p.get("zoom",[1,1]); tx,ty=p.get("target",[None,None])
    for i in range(n):
        z=z0+(z1-z0)*i/max(1,n-1); im=cv2.imread(f"{P}/{p['name']}/{i+1:04d}.jpg")
        M=place(f["cx"],0,z,tx,0) if p.get("toplock") else place(f["cx"],f["cy"],z,tx,ty)
        k+=1; cv2.imwrite(f"{W}/vfr/{k:05d}.jpg",cv2.warpAffine(im,M,(1080,1920),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REFLECT),[cv2.IMWRITE_JPEG_QUALITY,95])
    tl.append({"name":p["name"],"start":round(start,4),"end":round(start+n/FPS,4),"frames":[k-n+1,k],"face":f}); start+=n/FPS
# 4) voice: 48 kHz, exact lengths, 6 ms edge fades, spoken level matched across clips
SR=48000; pcs=[]
for p,t in zip(cfg["pieces"],tl):
    n=t["frames"][1]-t["frames"][0]+1
    raw=subprocess.run(["ffmpeg","-v","error","-ss",f"{p['a']}","-i",cfg["clips"][p["clip"]]["file"],"-t",f"{n/FPS:.5f}","-vn","-ac","1","-ar",str(SR),
        "-af","highpass=f=70","-f","f32le","-"],capture_output=True,check=True).stdout
    x=np.frombuffer(raw,np.float32).copy(); L=round(n/FPS*SR); x=np.pad(x,(0,max(0,L-len(x))))[:L]
    fr=x[:len(x)//480*480].reshape(-1,480); r=np.sqrt((fr**2).mean(1)); act=r[r>np.percentile(r,60)]
    x*=0.08/(act.mean()+1e-9); e=int(0.006*SR); ramp=np.linspace(0,1,e); x[:e]*=ramp; x[-e:]*=ramp[::-1]; pcs.append(x)
v=np.clip(np.concatenate(pcs),-0.98,0.98).astype(np.float32); v.tofile(W+"/voice.f32")
subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac","1","-i",W+"/voice.f32",W+"/voice.wav"],check=True)
subprocess.run(["ffmpeg","-v","error","-y","-framerate",str(FPS),"-i",W+"/vfr/%05d.jpg","-i",W+"/voice.wav","-c:v","libx264","-crf","14","-preset","medium",
    "-pix_fmt","yuv420p","-c:a","aac","-b:a","256k","-shortest","-movflags","+faststart",W+"/cutz.mp4"],check=True)
json.dump({"pieces":tl,"total":round(start,4),"gains":gains},open(W+"/timeline.json","w"),indent=1)
for t in tl: print(f"{t['name']:4s} {t['start']:6.3f}–{t['end']:6.3f}  frames {t['frames']}  headtop {t['face']['headtop']:.0f}")
print("total", round(start,3), "s ·", k, "frames")
