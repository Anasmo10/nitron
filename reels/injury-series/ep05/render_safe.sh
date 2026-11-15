#!/bin/bash
# EP05: render the frames that do not show Ahmad's cut-out yet (hook, full canvases, P5 + end card) while the matte runs
export CHROME_PATH=/home/user/work/bin/chrome PUPPETEER_PATH=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/node_modules/puppeteer-core
cd /home/user/work/ep5/ep
nice -n 10 node /root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/scripts/04_render_frames.js /home/user/work/ep5/ep range 0 3.95
nice -n 10 node /root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/scripts/04_render_frames.js /home/user/work/ep5/ep range 5.80 13.26
nice -n 10 node /root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/scripts/04_render_frames.js /home/user/work/ep5/ep range 16.84 27.93
echo RENDER SAFE DONE
