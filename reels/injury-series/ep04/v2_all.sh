#!/bin/bash
# EP04 v2: after the wide-frame cut-out pass, rebuild every on-camera frame, the joins, and the rendered frames
cd /home/user/work/ep4
until grep -q "ML DONE" ml.log; do sleep 15; done
./ahmad4v2.sh 135 276 && ./ahmad4v2.sh 588 684 && ./ahmad4v2.sh 685 854
python3 settle.py
for i in $(seq 129 134); do cp hook/out/$(printf %04d $((i-1))).jpg ep/vfr/$(printf %05d $i).jpg; done
python3 bake.py --fresh
P=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor
export CHROME_PATH=/home/user/work/bin/chrome PUPPETEER_PATH=$P/node_modules/puppeteer-core
node $P/scripts/04_render_frames.js ep range 4.2 9.25 | tail -1
node $P/scripts/04_render_frames.js ep range 19.55 31.07 | tail -1
echo V2-ALL-DONE $(date +%T)
