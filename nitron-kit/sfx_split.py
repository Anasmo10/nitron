"""Nitron kit — the client's own sound-effect pack → one wav per effect.
python3 nitron-kit/sfx_split.py <sound_effect_.mp4>   (the pack Anas sent, 114.7 s, effects separated by silence)

Writes nitron-kit/sfx/<name>.wav (48 kHz stereo, 8 ms fades, peak −3 dBFS) and nitron-kit/sfx/catalog.json.
The wavs stay out of git (public repo); this script and the cut list are the record, so a new session
re-creates the library from the same upload.  sound.py plays them with the event kind "lib":
  ["lib", t, gain, "<name>", pan]
Names describe how each one looks and sounds on analysis (attack, length, spectrum); rename after a listen if needed.
"""
import json, os, subprocess, sys, numpy as np
SR=48000; D=os.path.join(os.path.dirname(os.path.abspath(__file__)),"sfx"); os.makedirs(D,exist_ok=True)
CUTS=[("tick",0.0,0.224,"very short bright tick"),("hit_a",0.488,1.033,"punchy hit, low body"),
 ("whoosh_in",1.516,2.533,"whoosh swelling into a hit"),("pop",2.851,3.118,"short mid pop"),
 ("ding",3.452,4.544,"bell tone ~2.3 kHz, instant attack"),("rip",6.909,8.439,"crackly rip, velcro-like"),
 ("hit_b",10.008,10.661,"punchy hit, low body"),("boom_a",12.393,13.689,"low boom with tail"),
 ("thud_a",15.578,16.893,"soft low thud"),("whoosh_a",19.413,20.294,"short whoosh"),
 ("thud_b",21.917,22.299,"short thud"),("whoosh_big",25.876,28.563,"big transition whoosh"),
 ("boom_sub",30.0,31.886,"sub drop / cinematic boom"),("riser",35.395,40.297,"long swell riser"),
 ("hit_c",44.892,45.87,"hit with bright edge"),("click",47.758,47.876,"tiny click"),
 ("soft_whoosh",49.132,50.409,"quiet airy whoosh"),("typing_fast",53.415,59.214,"fast dense typing / clicks"),
 ("typing_a",60.587,75.286,"soft typing bed"),("typing_b",75.663,82.987,"soft typing bed"),
 ("typing_c",83.306,94.29,"soft typing bed"),("typing_d",102.619,106.226,"soft typing bed"),
 ("flash",113.132,114.683,"sparkle / flash hit, very bright")]
raw=subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],"-vn","-ac","2","-ar",str(SR),"-f","f32le","-"],capture_output=True,check=True).stdout
a=np.frombuffer(raw,np.float32).reshape(-1,2); cat={}
for name,s,e,desc in CUTS:
    x=a[int(s*SR):int(e*SR)].copy(); f=int(0.008*SR); r=np.linspace(0,1,f)[:,None]
    x[:f]*=r; x[-f:]*=r[::-1]; x*=0.708/max(1e-6,np.abs(x).max())
    pk=np.convolve(np.abs(x.mean(1)),np.ones(480)/480,'same').argmax()/SR
    subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac","2","-i","-",f"{D}/{name}.wav"],input=x.astype(np.float32).tobytes(),check=True)
    cat[name]={"src":[s,e],"dur":round(e-s,3),"peak_at":round(pk,3),"desc":desc}
json.dump(cat,open(D+"/catalog.json","w"),indent=1,ensure_ascii=False); print(len(cat),"effects →",D)
