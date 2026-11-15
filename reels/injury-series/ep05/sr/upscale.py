"""Real-ESRGAN (general x4v3, ONNX) on every source frame of the hook (360×640 → 1440×2560)."""
import onnxruntime as ort, numpy as np, cv2, glob, os
so=ort.SessionOptions(); so.intra_op_num_threads=4
s=ort.InferenceSession('/home/user/work/models/realesr-general-x4v3.onnx',so,providers=['CPUExecutionProvider'])
for f in sorted(glob.glob('/home/user/work/ep5/sr/src/*.png')):
    o=f.replace('/src/','/up/')
    if os.path.exists(o): continue
    x=cv2.cvtColor(cv2.imread(f),cv2.COLOR_BGR2RGB).astype(np.float32)/255
    y=s.run(None,{'x':x.transpose(2,0,1)[None]})[0][0].transpose(1,2,0)
    cv2.imwrite(o,cv2.cvtColor((y.clip(0,1)*255+0.5).astype(np.uint8),cv2.COLOR_RGB2BGR))
print('upscaled',len(glob.glob('/home/user/work/ep5/sr/up/*.png')))
