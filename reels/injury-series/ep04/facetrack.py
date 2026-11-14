"""face track per clip on 540x960 proxies @ 10 fps → samp/face_<n>.json  (cx, cy, w as fractions of frame W/H/W)"""
import sys, json, subprocess, numpy as np, cv2
casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
for n in sys.argv[1:]:
    p = subprocess.Popen(["ffmpeg","-v","error","-i",f"src/IMG_{n}.MOV","-vf","fps=10,scale=540:960","-f","rawvideo","-pix_fmt","gray","-"], stdout=subprocess.PIPE)
    out=[]; i=0
    while True:
        b = p.stdout.read(540*960)
        if len(b) < 540*960: break
        g = np.frombuffer(b, np.uint8).reshape(960,540)
        r = casc.detectMultiScale(g, 1.08, 6, minSize=(60,60))
        if len(r):
            x,y,w,h = max(r, key=lambda q:q[2]); out.append([round(i/10,2), round((x+w/2)/540,4), round((y+h/2)/960,4), round(w/540,4)])
        else: out.append([round(i/10,2), None, None, None])
        i+=1
    json.dump(out, open(f"samp/face_{n}.json","w"))
    a = np.array([o[1:] for o in out if o[1] is not None], float)
    print(n, "frames", len(out), "seen", len(a), "cx %.3f..%.3f cy %.3f..%.3f w %.3f..%.3f (med %.3f %.3f %.3f)" % (a[:,0].min(),a[:,0].max(),a[:,1].min(),a[:,1].max(),a[:,2].min(),a[:,2].max(),*np.median(a,axis=0)))
