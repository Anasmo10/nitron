import sys, wave, json, numpy as np, onnxruntime as ort
D="/root/models/sherpa-onnx-omnilingual-asr-1600-languages-300M-ctc-int8-2025-11-12/"
toks=[l.rstrip("\n").rsplit(" ",1)[0] if not l.startswith("  ") else " " for l in open(D+"tokens.txt",encoding="utf-8")]
sess=ort.InferenceSession(D+"model.int8.onnx",providers=["CPUExecutionProvider"])
def logits(f):
    w=wave.open(f); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
    a=(a-a.mean())/(a.std()+1e-7)
    lg=sess.run(None,{"x":a[None]})[0][0]
    return lg, len(a)/16000/lg.shape[0]
if __name__=="__main__":
    for f in sys.argv[1:]:
        lg,fd=logits(f); am=lg.argmax(1)
        vals,cnt=np.unique(am,return_counts=True); print("frame",round(fd,4),"top ids",sorted(zip(cnt,vals))[-3:])
        out=[];prev=-1
        for i,t in enumerate(am):
            if t!=prev and t>3: out.append((round(i*fd,2),toks[t]))
            prev=t
        print(f,"|","".join(x[1] for x in out))
        np.save(f[:-4]+".lg.npy",lg)
