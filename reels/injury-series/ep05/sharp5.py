"""EP05: per-frame sharpness scan of the delivered video (Laplacian variance of the luma against the 9 frames around),
so no frame is soft where the next is sharp (client, EP04: «كم فريم أكل هوا بالتغبيش»). Prints the dips."""
import sys, subprocess, numpy as np, cv2
f=sys.argv[1]; W,H=540,960
p=subprocess.Popen(['ffmpeg','-v','error','-i',f,'-vf',f'scale={W}:{H}','-f','rawvideo','-pix_fmt','gray','-'],stdout=subprocess.PIPE)
v=[]
while True:
    b=p.stdout.read(W*H)
    if len(b)<W*H: break
    g=np.frombuffer(b,np.uint8).reshape(H,W); v.append(cv2.Laplacian(g[200:900],cv2.CV_32F).var())
v=np.array(v); out=[]
for i in range(len(v)):
    nb=np.r_[v[max(0,i-4):i],v[i+1:i+5]]; r=v[i]/np.median(nb)
    if r<0.75: out.append((i,round(i/30,2),round(float(r),2)))
print(len(v),'frames · dips (frame, s, ratio to neighbours):',out if out else 'none')
