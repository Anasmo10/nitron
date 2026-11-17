#!/bin/bash
# F8 reel v2 — beat-locked hard cuts with a zoom-through on every cut → frames → voice/sound → encode → master
set -eo pipefail
B=/home/user/work/f8; W=$B/w; K=/home/user/nitron/nitron-kit; S=/home/user/work/plugins/majed-video-6.5.1/video-ad-editor/scripts
export CHROME_PATH=/opt/pw-browsers/chromium PUPPETEER_PATH=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/node_modules/puppeteer-core
cd $B && python3 mkreel.py final >/dev/null && python3 mkcaps.py >/dev/null && python3 mksound.py >/dev/null
python3 $K/build_cut.py reel_final.json $W | tail -8
for f in $(python3 -c "import json;t=json.load(open('$W/timeline.json'));print(' '.join(str(p['frames'][0]) for p in t['pieces'][1:]))"); do
  if [ "$f" = "126" ]; then python3 $K/zoom_cut.py $W $f 4 1.16; else python3 $K/zoom_cut.py $W $f 3 1.10; fi; done
python3 $K/assemble.py $W >/dev/null
rm -rf $W/out; cd $W && node $S/04_render_frames.js $W all --force | tail -1
bash $K/voice_polish.sh $W && python3 $K/sound.py $W | tail -1
bash $S/06_encode.sh $W | tail -1
bash $K/finish.sh $W
node $S/08_safe_check.js $W 2>&1 | tail -6
echo FINAL_OK
