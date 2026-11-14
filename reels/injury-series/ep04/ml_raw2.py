"""EP04 v2 cut-out, pass 1: BiRefNet (lite) on the WIDE original frames, before they are enlarged and cropped.
On the enlarged frame the cloth beside his arm touches the frame edge and the model takes it for his body; on the
original frame the cloth there is a clear strip of backdrop and it is cut away. The alpha is then enlarged and
cropped exactly like the picture (frames.json). Every second frame; the rest is filled by matte_v2.py.
Writes ep/bt/ml/NNNNN.png (alpha, in the reel's frame)."""
import os, json, subprocess, time, numpy as np, cv2, onnxruntime as ort
B='/home/user/work/ep4'; W=B+'/ep'; OUT=W+'/bt/ml'; os.makedirs(OUT,exist_ok=True)
FR=json.load(open(B+'/frames.json')); TL={p['name']:p for p in json.load(open(W+'/timeline.json'))['pieces']}
RE={p['name']:p for p in json.load(open(W+'/reel.json'))['pieces']}
TAKES=[t for t in [('P2','7455',135,276),('P3','7460',588,684),('P4','7461',685,854)] if t[0] in os.environ.get('TAKES','P2,P3,P4').split(',')]
so=ort.SessionOptions(); so.intra_op_num_threads=4; so.enable_cpu_mem_arena=False; so.enable_mem_pattern=False
s=ort.InferenceSession(os.environ.get('MODEL','/root/models/seg/birefnet-lite.onnx'),so,providers=['CPUExecutionProvider']); inp=s.get_inputs()[0].name
mean,std=np.array([0.485,0.456,0.406],np.float32),np.array([0.229,0.224,0.225],np.float32)
def to_reel(a,n):     # the same enlargement, padding and crop as prep4.py
    f=FR[n]; vf=f['vf']; import re
    Ws,Hs=map(int,re.search(r'scale=(\d+):(\d+)',vf).groups()); a=cv2.resize(a,(Ws,Hs),interpolation=cv2.INTER_CUBIC)
    m=re.search(r'pad=\d+:\d+:0:(\d+)',vf)
    if m: pt=int(m.group(1)); a=np.vstack([np.repeat(a[:1],pt,axis=0),a])
    cx,cy=map(int,re.search(r'crop=1080:1920:(\d+):(\d+)',vf).groups()); return a[cy:cy+1920,cx:cx+1080]
T=time.time(); done=0
for piece,n,a0,a1 in TAKES:
    st=TL[piece]['frames'][0]; a=RE[piece]['a']; ids=sorted(set(list(range(a0,a1+1,2))+[a1]))
    k0,k1=ids[0]-st,ids[-1]-st; tmp=f'{B}/rawfr_{n}'; os.makedirs(tmp,exist_ok=True)
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{a+k0/30:.4f}','-i',f'{B}/rawsdr/c{n}.mov','-vf','fps=30','-frames:v',str(k1-k0+1),'-q:v','1','-start_number',str(ids[0]),f'{tmp}/%05d.jpg'],check=True)
    for i in ids:
        if os.path.exists(f'{OUT}/{i:05d}.png') and not os.environ.get('REDO'): continue
        im=cv2.imread(f'{tmp}/{i:05d}.jpg'); h,w=im.shape[:2]
        x=cv2.resize(cv2.cvtColor(im,cv2.COLOR_BGR2RGB),(1024,1024),interpolation=cv2.INTER_AREA).astype(np.float32)/255
        p=s.run(None,{inp:((x-mean)/std).transpose(2,0,1)[None]}); p=(p[0] if 'portrait' in os.environ.get('MODEL','') else p[-1])[0,0]; p=1/(1+np.exp(-p)) if p.min()<0 or p.max()>1 else p
        al=to_reel(cv2.resize(p.astype(np.float32),(w,h),interpolation=cv2.INTER_CUBIC).clip(0,1),n)
        cv2.imwrite(f'{OUT}/{i:05d}.tmp.png',(al*255+0.5).astype(np.uint8)); os.replace(f'{OUT}/{i:05d}.tmp.png',f'{OUT}/{i:05d}.png'); done+=1
        if done%10==1: el=(time.time()-T)/done; print(f'{piece} {i}: {done} done, {el:.1f}s/frame',flush=True)
print('ML DONE',flush=True)
