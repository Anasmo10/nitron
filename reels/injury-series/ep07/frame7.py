"""EP07: each take framed bigger (frames.json from prep7.py: ×s, the cloth smeared upward by pt rows, cropped at xoff/yoff)
→ sdr/f<take>.mp4, so the cut (build_cut, zoom 1.0) and the matte (matte7.py to_reel) place him identically.
v0 cut the takes as shot while the matte assumed this framing: the cut-out sat ~80 px low and showed the cloth."""
import json, subprocess
B='/home/user/work/ep7'; FR=json.load(open(B+'/frames.json'))
for n,f in FR.items():
    vf=f"scale={f['Ws']}:{f['Hs']}:flags=lanczos"
    if f['pt']: vf+=f",pad={f['Ws']}:{f['Hs']+f['pt']}:0:{f['pt']},fillborders=top={f['pt']}:mode=smear"
    vf+=f",crop=1080:1920:{f['xoff']}:{f['yoff']},format=yuv420p"
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-framerate','30','-i',f'{B}/raw/{n}/%04d.jpg','-vf',vf,'-c:v','libx264','-crf','12','-preset','fast',f'{B}/sdr/f{n}.mp4'],check=True)
    print(n,vf)
r=json.load(open(B+'/ep/reel.json'))
for n in FR: r['clips']['c'+n]['file']=f'{B}/sdr/f{n}.mp4'
json.dump(r,open(B+'/ep/reel.json','w'),indent=1,ensure_ascii=False)
