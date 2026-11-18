"""EP07: Real-ESRGAN x4 (ONNX) on the injury clip's useful ranges, blended 65/35 with Lanczos, 1080x1920 (478x850 source)."""
import onnxruntime as ort, numpy as np, cv2, glob, os, subprocess, sys
R={"m1":(0.0,1.30),"m2":(2.30,4.70),"demo":(9.0,13.0),"demo2":(15.9,18.9)}
B="/home/user/work/ep7"; so=ort.SessionOptions(); so.intra_op_num_threads=2
s=ort.InferenceSession('/home/user/work/models/realesr-general-x4v3.onnx',so,providers=['CPUExecutionProvider'])
for k in sys.argv[1].split(","):
    r0,r1=R[k]; d=f"{B}/sr/{k}"; os.makedirs(d+"/in",exist_ok=True); os.makedirs(d+"/up",exist_ok=True)
    if not glob.glob(d+"/in/*.png"):
        subprocess.run(["ffmpeg","-nostdin","-v","error","-y","-ss",str(r0),"-to",str(r1),"-i",f"{B}/src/inj.mp4","-an",d+"/in/%04d.png"],check=True)
    for f in sorted(glob.glob(d+"/in/*.png")):
        o=f.replace("/in/","/up/").replace(".png",".jpg")
        if os.path.exists(o): continue
        im=cv2.imread(f); x=cv2.cvtColor(im,cv2.COLOR_BGR2RGB).astype(np.float32)/255
        y=s.run(None,{'x':x.transpose(2,0,1)[None]})[0][0].transpose(1,2,0)
        su=cv2.resize(cv2.cvtColor((y.clip(0,1)*255).astype(np.float32),cv2.COLOR_RGB2BGR),(1080,1920),interpolation=cv2.INTER_AREA)
        la=cv2.resize(im,(1080,1920),interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
        cv2.imwrite(o,np.clip(0.65*su+0.35*la,0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,96])
    print("DONE",k,flush=True)
