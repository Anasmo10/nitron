"""Nitron kit — make text-behind-the-speaker safe across cuts.  python3 behind_fix.py <work> [key from to ...]
1) clamps every «طبقات» (stack) line to the piece it starts in (timeline.json), and rebuilds its union mask
   from that piece's frames only — a line that spans a cut lays out around two different bodies.
2) optional key/from/to triples add person-layer ranges for kit wall words (e.g. wall 130 222)."""
import json, sys, subprocess
W=sys.argv[1].rstrip("/"); FPS=30
tl=json.load(open(W+"/timeline.json"))["pieces"]; d=json.load(open(W+"/behind.json"))
def piece(t): return next(p for p in tl if p["start"]-1e-6<=t<p["end"])
for l in d.get("lines",[]):
    if l.get("style")!="stack": continue
    p=piece(l["words"][0]["s"]); s=max(l["s"],p["start"]+0.001); e=min(l["e"],p["end"]-0.001)
    if (s,e)!=(l["s"],l["e"]): print(f"line {l['card']+1}: {l['s']:.2f}–{l['e']:.2f} → {s:.2f}–{e:.2f} ({p['name']})")
    l["s"],l["e"]=s,e; f0=int(s*FPS)+1; f1=int(e*FPS)+1
    subprocess.run(["ffmpeg","-v","error","-start_number",str(f0),"-i",W+"/bt/mask/%05d.png","-frames:v",str(f1-f0+1),
        "-vf",f"scale=270:480,format=gray,tmix=frames={f1-f0+1}","-update","1","-y",W+"/"+l["umask"]],check=True)
a=sys.argv[2:]; extra=[(a[i],int(a[i+1]),int(a[i+2])) for i in range(0,len(a),3)]
for k,f0,f1 in extra:
    subprocess.run(["ffmpeg","-v","error","-start_number",str(f0),"-i",W+"/bt/src/%05d.jpg","-start_number",str(f0),"-i",W+"/bt/mask/%05d.png",
        "-frames:v",str(f1-f0+1),"-filter_complex","[1:v]format=gray,scale=1080:1920[a];[0:v][a]alphamerge,format=rgba","-start_number",str(f0),"-y",W+"/bt/person/%05d.png"],check=True)
    d[k]=[f0,f1]
rs=[[int(l["s"]*FPS)+1,int(l["e"]*FPS)+1] for l in d.get("lines",[])]+[d[k] for k,_,_ in extra]
for k in ("hook","wall"):
    if k in d and d[k] not in rs: rs.append(d[k])
rs.sort(); out=[]
for r in rs:
    if out and r[0]<=out[-1][1]+1: out[-1][1]=max(out[-1][1],r[1])
    else: out.append(list(r))
d["ranges"]=out; json.dump(d,open(W+"/behind.json","w"),ensure_ascii=False,indent=1); print("ranges",out)
