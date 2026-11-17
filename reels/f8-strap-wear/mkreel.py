"""F8 reel: reel.json for build_cut (draft = Lanczos 30 fps, final = Real-ESRGAN blend 30 fps)."""
import json, sys
mode=sys.argv[1]; D={"draft":"/home/user/work/f8/dr30","final":"/home/user/work/f8/sr30"}[mode]
R0={"c04":0.40,"c09":0.0,"c08":0.65,"c07":1.62,"c01":0.30,"c10":1.75,"c06":2.55}
clips={f"v{c[1:]}":{"file":f"{D}/{c}.mp4","gains":[1,1,1]} for c in R0}
for c in ("c04","c02","c01"): clips[f"a{c[1:]}"]={"file":f"/home/user/work/f8/src/{c}.mp4","gains":[1,1,1]}
# name, clip, raw start (source s), frames, vo take, vo raw start, extra
P=[("H","c04",0.48,125,"a04",0.48,{"zoom":[1.42,1.22],"snap":0.4}),
   ("S1","c09",0.10,34,"a02",0.36,{"zoom":[1.04,1.10],"anchor":[470,900],"target":[470,900]}),
   ("S2","c08",0.80,67,"a02",None,{"zoom":[1.02,1.08],"xfade":5,"anchor":[640,480],"target":[640,480]}),
   ("S3","c07",1.77,99,"a02",None,{"zoom":[1.02,1.09],"xfade":5,"anchor":[700,420],"target":[700,420]}),
   ("T","c01",0.46,109,"a01",0.46,{"zoom":[1.26,1.30],"xfade":3}),
   ("R1","c10",1.90,49,"a01",4.33,{"zoom":[1.03,1.09],"xfade":5,"anchor":[560,300],"target":[560,300]}),
   ("R2","c06",2.70,59,"a01",None,{"zoom":[1.02,1.07],"xfade":5,"anchor":[540,900],"target":[540,900]})]
pieces=[]; prev=None
for name,c,s,n,vt,va,ex in P:
    if va is None: va=round(prev[0]+prev[1]/30,4)
    a=round(s-R0[c],4); p={"name":name,"clip":"v"+c[1:],"a":a,"b":round(a+n/30,4),"vo":{"clip":vt,"a":va}}; p.update(ex); pieces.append(p); prev=(va,n)
    print(name,p["a"],p["b"],"vo",vt,va,"→",round(va+n/30,4))
json.dump({"clips":clips,"pieces":pieces,"hires":1620,"voice_gain":"clip",
  "look":"hqdn3d=1:1:2:2,curves=m='0/0 0.25/0.23 0.5/0.53 0.8/0.85 1/1',eq=saturation=1.10,unsharp=5:5:0.30:5:5:0"},
  open(f"/home/user/work/f8/reel_{mode}.json","w"),ensure_ascii=False,indent=1)
