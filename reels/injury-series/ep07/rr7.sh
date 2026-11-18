#!/bin/bash
# render reel windows: ./rr7.sh "a b" ["a b" ...]
export CHROME_PATH=/opt/pw-browsers/chromium PUPPETEER_PATH=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/node_modules/puppeteer-core
R=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/scripts/04_render_frames.js
cd /home/user/work/ep7/ep
for r in "$@"; do nice -n 10 node $R /home/user/work/ep7/ep range $r 2>&1 | tail -1; done
echo "RR DONE $*"
