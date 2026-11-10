"""Nitron kit — BiRefNet-portrait matte on key frames only.  python3 kf_matte.py <work> <frame numbers...>

The clean hair-edge cut from the plugin update (majed-video 6.5, 44_matte.py) is BiRefNet-portrait. On a cloud CPU it takes
~22–30 s a frame and, through rembg, runs out of memory after one frame. Here it runs in one onnxruntime session with the
memory arena off (flat ~3 GB), on every 6th frame of the shots where the presenter is on screen; propmatte.py carries
those mattes to the frames in between. Reads <work>/vfr_src/NNNNN.jpg, writes <work>/bt/kf/NNNNN.png (alpha).
Model: ~/.rembg/models/birefnet-portrait/ (rembg downloads it once: python3 -c "from rembg import new_session; new_session('birefnet-portrait')")."""
import sys, os, time, glob, numpy as np, cv2, onnxruntime as ort
W=sys.argv[1]; ids=[int(x) for x in sys.argv[2:]]; KF=W+'/bt/kf'; os.makedirs(KF,exist_ok=True)
M=[p for p in glob.glob('/root/.u2net/birefnet-portrait*.onnx')+glob.glob('/root/.rembg/models/birefnet-portrait/*.onnx')][0]
todo=[i for i in ids if not os.path.exists(f'{KF}/{i:05d}.png')]; print(len(todo),'key frames to matte',flush=True)
if todo:
    so=ort.SessionOptions(); so.intra_op_num_threads=4; so.enable_cpu_mem_arena=False; so.enable_mem_pattern=False
    s=ort.InferenceSession(M,so,providers=['CPUExecutionProvider']); inp=s.get_inputs()[0].name
    mean,std=np.array([0.485,0.456,0.406],np.float32),np.array([0.229,0.224,0.225],np.float32); T=time.time()
    for k,i in enumerate(todo):
        im=cv2.imread(f'{W}/vfr_src/{i:05d}.jpg'); h,w=im.shape[:2]
        x=cv2.resize(cv2.cvtColor(im,cv2.COLOR_BGR2RGB),(1024,1024),interpolation=cv2.INTER_LANCZOS4).astype(np.float32)/255
        x=((x-mean)/std).transpose(2,0,1)[None]
        p=s.run(None,{inp:x})[0][0,0]; p=1/(1+np.exp(-p)); p=(p-p.min())/(p.max()-p.min()+1e-8)
        a=cv2.resize(p,(w,h),interpolation=cv2.INTER_LANCZOS4).clip(0,1)
        cv2.imwrite(f'{KF}/{i:05d}.tmp.png',(a*255+0.5).astype(np.uint8)); os.replace(f'{KF}/{i:05d}.tmp.png',f'{KF}/{i:05d}.png')
        el=(time.time()-T)/(k+1); print(f'{k+1}/{len(todo)} {el:.1f}s/frame, left {el*(len(todo)-k-1)/60:.0f} min',flush=True)
print('KF DONE',flush=True)
