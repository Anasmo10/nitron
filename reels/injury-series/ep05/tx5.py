"""EP05: transcribe each take in short chunks cut at silences (whisper-turbo truncates past ~5 s)."""
import sys, wave, subprocess, re, numpy as np, sherpa_onnx, json
d="/root/models/sherpa-onnx-whisper-turbo/"
rec=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d+"turbo-encoder.int8.onnx", decoder=d+"turbo-decoder.int8.onnx",
    tokens=d+"turbo-tokens.txt", language="ar", num_threads=4)
for f in sys.argv[1:]:
    w=wave.open(f); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768; dur=len(a)/16000
    o=subprocess.run(['ffmpeg','-i',f,'-af','silencedetect=n=-32dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
    sil=[(s,e) for s,e in zip(st,en+[dur]*(len(st)-len(en)))]
    # speech runs between silences, merged up to 4.5 s
    cuts=[0.0]+[(s+e)/2 for s,e in sil if 0.3<(s+e)/2<dur-0.3]+[dur]
    segs=[]; cur=cuts[0]
    for c in cuts[1:]:
        if c-cur>4.5 and segs is not None and c!=cuts[-1]: pass
        segs.append((cur,c)); cur=c
    out=[]
    for s,e in segs:
        x=a[int(s*16000):int(e*16000)]
        if len(x)<1600: continue
        sm=rec.create_stream(); sm.accept_waveform(16000,np.concatenate([np.zeros(3200,np.float32),x,np.zeros(3200,np.float32)])); rec.decode_stream(sm)
        out.append((round(s,2),round(e,2),sm.result.text)); 
    print('==',f,round(dur,2),'sil',[(round(s,2),round(e,2)) for s,e in sil])
    for s,e,t in out: print(f'  {s:5.2f}-{e:5.2f} {t}')
    json.dump(out,open(f[:-4]+'.chunks.json','w'),ensure_ascii=False)
