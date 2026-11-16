#!/bin/bash
# EP05 v5: render the first 6 s of each hook option and make its preview (no option is placed in the reel until the client picks)
set -eo pipefail
P=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor
export CHROME_PATH=/home/user/work/bin/chrome PUPPETEER_PATH=$P/node_modules/puppeteer-core
cd /home/user/work/ep5; D=/home/user/nitron/deliver-v2
for O in A B C; do
  for i in $(seq 0 121); do s=$(printf %04d $i); d=$(printf %05d $((i+1))); cp hook/opt$O/$s.jpg ep/vfr/$d.jpg; cp hook/opt$O/$s.jpg ep/vfr_src/$d.jpg; done
  rm -f ep/vfr_cut/00121.jpg ep/vfr_cut/00122.jpg; python3 bake5.py >/dev/null
  HOOK_OPT=$O python3 gen5.py >/dev/null; python3 /home/user/nitron/nitron-kit/assemble.py ep >/dev/null
  (cd ep && node $P/scripts/04_render_frames.js /home/user/work/ep5/ep range 0 6.0 | tail -1)
  rm -rf prev_$O; mkdir -p prev_$O; for i in $(seq 0 179); do f=$(printf %05d $i); cp ep/out/$f.jpg prev_$O/; done
  python3 hook_preview.py $O prev_$O $D/nitron-ep05-hook-option-$O.mp4
done
echo HOOK OPTIONS DONE
