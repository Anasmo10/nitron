#!/bin/bash
B=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/motion
cd $B
for r in "0 11.2" "11.2 22.4" "22.4 33.6" "33.6 44.75"; do set -- $r
  CHROME=/home/user/work/bin/chrome-gl node render.js /home/user/work/mdl range $1 $2 --workers 1 > /home/user/work/mdl/range_$1.log 2>&1 &
done
wait
CHROME=/home/user/work/bin/chrome-gl node render.js /home/user/work/mdl all --workers 1 > /home/user/work/mdl/encode.log 2>&1
echo ALL_DONE
