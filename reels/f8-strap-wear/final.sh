#!/bin/bash
# F8 reel — full build on the upscaled clips: cut → zoom-through on the first cut → frames → voice/sound → encode → master → cover-first
set -eo pipefail
B=/home/user/work/f8; W=$B/w; K=/home/user/nitron/nitron-kit; S=/home/user/work/plugins/majed-video-6.5.1/video-ad-editor/scripts
export CHROME_PATH=/opt/pw-browsers/chromium PUPPETEER_PATH=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/node_modules/puppeteer-core
cd $B && python3 mkreel.py final >/dev/null && python3 mkcaps.py >/dev/null && python3 mksound.py >/dev/null
python3 $K/build_cut.py reel_final.json $W | tail -9
C1=$(python3 -c "import json;t=json.load(open('$W/timeline.json'));print([p for p in t['pieces'] if p['name']=='S1'][0]['frames'][0])")
python3 $K/zoom_cut.py $W $C1 4 1.14
python3 $K/assemble.py $W
rm -rf $W/out; cd $W && node $S/04_render_frames.js $W all --force | tail -2
bash $K/voice_polish.sh $W && python3 $K/sound.py $W | tail -2
bash $S/06_encode.sh $W | tail -2
bash $K/finish.sh $W
echo FINAL_OK
