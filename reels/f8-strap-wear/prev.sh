#!/bin/bash
# usage: prev.sh <work> t1 t2 ...  → <work>/prev_sheet.jpg
W=$1; shift
export CHROME_PATH=/opt/pw-browsers/chromium PUPPETEER_PATH=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/node_modules/puppeteer-core
rm -rf $W/prev; cd $W && timeout 900 nice -n 5 node /home/user/work/plugins/majed-video-6.5.1/video-ad-editor/scripts/04_render_frames.js $W preview "$@" >/dev/null 2>&1
python3 - "$W" "$@" <<'PY'
import cv2,numpy as np,sys,os
W=sys.argv[1]; ts=sys.argv[2:]
ims=[]
for t in ts:
    f=f"{W}/prev/t{float(t):.2f}.jpg"
    im=cv2.resize(cv2.imread(f),(360,640)) if os.path.exists(f) else np.zeros((640,360,3),np.uint8)
    cv2.putText(im,t,(6,24),0,0.7,(0,255,255),2); ims.append(im)
while len(ims)%6: ims.append(np.zeros_like(ims[0]))
cv2.imwrite(f"{W}/prev_sheet.jpg",np.vstack([np.hstack(ims[i:i+6]) for i in range(0,len(ims),6)]),[cv2.IMWRITE_JPEG_QUALITY,88])
PY
