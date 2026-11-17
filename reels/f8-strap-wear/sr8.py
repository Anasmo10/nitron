"""F8 reel: Real-ESRGAN general-x4v3 (ONNX) on the used ranges, blended 60/40 with Lanczos, 1620x2880, then minterpolate to 30 fps."""
import onnxruntime as ort, numpy as np, cv2, glob, os, subprocess, sys
R={"c04":(0.40,4.80),"c09":(0.0,1.30),"c08":(0.65,3.10),"c07":(1.62,5.17),"c01":(0.30,4.25),"c10":(1.75,3.70),"c06":(2.55,4.70)}
todo=sys.argv[1].split(",") ; thr=int(sys.argv[2])
B="/home/user/work/f8"; W,H=1620,2880
so=ort.SessionOptions(); so.intra_op_num_threads=thr
s=ort.InferenceSession('/home/user/work/models/realesr-general-x4v3.onnx',so,providers=['CPUExecutionProvider'])
for c in todo:
    r0,r1=R[c]; d=f"{B}/sr/{c}"; os.makedirs(d+"/in",exist_ok=True); os.makedirs(d+"/up",exist_ok=True)
    if not glob.glob(d+"/in/*.png"):
        subprocess.run(["ffmpeg","-nostdin","-v","error","-y","-ss",str(r0),"-to",str(r1),"-i",f"{B}/src/{c}.mp4","-an",d+"/in/%04d.png"],check=True)
    fps=subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries","stream=r_frame_rate","-of","csv=p=0",f"{B}/src/{c}.mp4"],capture_output=True,text=True).stdout.strip().rstrip(',')
    for f in sorted(glob.glob(d+"/in/*.png")):
        o=f.replace("/in/","/up/").replace(".png",".jpg")
        if os.path.exists(o): continue
        im=cv2.imread(f); x=cv2.cvtColor(im,cv2.COLOR_BGR2RGB).astype(np.float32)/255
        y=s.run(None,{'x':x.transpose(2,0,1)[None]})[0][0].transpose(1,2,0)
        su=cv2.resize(cv2.cvtColor((y.clip(0,1)*255).astype(np.float32),cv2.COLOR_RGB2BGR),(W,H),interpolation=cv2.INTER_AREA)
        la=cv2.resize(im,(W,H),interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
        cv2.imwrite(o,np.clip(0.6*su+0.4*la,0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,96])
        print(c,os.path.basename(o),flush=True)
    subprocess.run(["ffmpeg","-nostdin","-v","error","-y","-framerate",fps,"-i",d+"/up/%04d.jpg","-c:v","libx264","-crf","10","-preset","slow","-pix_fmt","yuv420p",d+"/native.mp4"],check=True)
    os.makedirs(B+"/sr30",exist_ok=True)
    subprocess.run(["ffmpeg","-nostdin","-v","error","-y","-i",d+"/native.mp4","-vf","minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1",
        "-c:v","libx264","-crf","10","-preset","slow","-pix_fmt","yuv420p",f"{B}/sr30/{c}.mp4"],check=True)
    print("DONE",c,flush=True)
