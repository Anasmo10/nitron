#!/bin/bash
# EP04 v2: first take re-cut with BiRefNet-portrait → composite → redo the footage→Ahmad dissolve → render → encode v2
cd /home/user/work/ep4
until grep -q "ML DONE" mlp.log; do sleep 15; done
./ahmad4v2.sh 135 276
rm -f ep/vfr_cut/00135.jpg ep/vfr_cut/00136.jpg ep/vfr_cut/00137.jpg ep/vfr_cut/00138.jpg ep/vfr_cut/00139.jpg ep/vfr_cut/00140.jpg ep/vfr_cut/00141.jpg
python3 bake.py
P=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor
export CHROME_PATH=/home/user/work/bin/chrome PUPPETEER_PATH=$P/node_modules/puppeteer-core
node $P/scripts/04_render_frames.js ep range 4.2 9.25 | tail -1
echo V2C-DONE $(date +%T)
