"""EP07 cut-out, pass 1 (copy of ep5/ml5.py) (the EP04 v4 method): BiRefNet-portrait on the WIDE original frames (1080×1920 as shot),
every second frame of each on-camera range. Alpha is stored in the raw frame (ml5/<take>/NNNN.png); it is enlarged
and cropped exactly like the picture later (frames.json). Order: the takes surely on camera first."""
import os, sys, time, numpy as np, cv2, onnxruntime as ort
B='/home/user/work/ep7'
RANGES=[('7529',1.02,2.62)]   # P3 (restart after the OOM kill)
so=ort.SessionOptions(); so.intra_op_num_threads=4; so.enable_cpu_mem_arena=False; so.enable_mem_pattern=False
s=ort.InferenceSession('/root/.rembg/models/birefnet-portrait/birefnet-portrait.onnx',so,providers=['CPUExecutionProvider']); inp=s.get_inputs()[0].name
mean,std=np.array([0.485,0.456,0.406],np.float32),np.array([0.229,0.224,0.225],np.float32)
T=time.time(); done=0
for n,t0,t1 in RANGES:
    os.makedirs(f'{B}/ml7/{n}',exist_ok=True); last=len(os.listdir(f'{B}/raw/{n}'))-1
    k0,k1=int(t0*30)//2*2,min(last,int(t1*30)); ids=sorted(set(list(range(k0,k1+1,2))+[k1]))
    for k in ids:
        o=f'{B}/ml7/{n}/{k:04d}.png'
        if os.path.exists(o): continue
        im=cv2.imread(f'{B}/raw/{n}/{k:04d}.jpg'); h,w=im.shape[:2]
        x=cv2.resize(cv2.cvtColor(im,cv2.COLOR_BGR2RGB),(1024,1024),interpolation=cv2.INTER_AREA).astype(np.float32)/255
        p=s.run(None,{inp:((x-mean)/std).transpose(2,0,1)[None]})[0][0,0]; p=1/(1+np.exp(-p)) if p.min()<0 or p.max()>1 else p
        al=cv2.resize(p.astype(np.float32),(w,h),interpolation=cv2.INTER_CUBIC).clip(0,1)
        cv2.imwrite(o+'.tmp.png',(al*255+0.5).astype(np.uint8)); os.replace(o+'.tmp.png',o); done+=1
        if done%10==1: print(f'{n} {k}: {done} done, {(time.time()-T)/done:.1f}s/frame',flush=True)
    print(n,'done',flush=True)
print('ML DONE',flush=True)
