#!/bin/bash
# re-render after a scenes.js change (cut, voice and sound unchanged)
set -eo pipefail
W=/home/user/work/f8/w; K=/home/user/nitron/nitron-kit; S=/home/user/work/plugins/majed-video-6.5.1/video-ad-editor/scripts
export CHROME_PATH=/opt/pw-browsers/chromium PUPPETEER_PATH=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/node_modules/puppeteer-core
python3 $K/assemble.py $W >/dev/null
cd $W && node $S/04_render_frames.js $W all --force | tail -1
bash $S/06_encode.sh $W | tail -1
bash $K/finish.sh $W
node $S/08_safe_check.js $W 2>&1 | tail -6
