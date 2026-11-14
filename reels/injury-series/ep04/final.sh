#!/bin/bash
# EP04: encode → mix → grain → cover-first, into deliver-v2 (git-ignored: the repo is public, no media in it)
set -e; W=/home/user/work/ep4/ep; P=/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor
D=/home/user/nitron/deliver-v2; V=${1:-v1}; C=/home/user/work/ep4/cover/cover_ep04.jpg; cd $W
bash $P/scripts/06_encode.sh $W 2>&1 | tail -1
bash /home/user/nitron/nitron-kit/finish.sh $W 2>&1 | tail -1
ffmpeg -v error -y -i ad-master.mp4 -vf "noise=alls=4:allf=t,format=yuv420p" -c:v libx264 -crf 19 -preset slow -r 30 -c:a copy -movflags +faststart ad-master-grain.mp4
# the cover as the first 0.1 s (3 frames), so Instagram offers it as the thumbnail
ffmpeg -v error -y -loop 1 -framerate 30 -t 0.1 -i $C -i ad-master.mp4 -filter_complex "[0:v]scale=1080:1920,format=yuv420p,setsar=1[c];[1:v]noise=alls=4:allf=t,format=yuv420p,setsar=1[v];[c][v]concat=n=2:v=1:a=0[o];[1:a]adelay=100|100[a]" -map "[o]" -map "[a]" -c:v libx264 -crf 19 -preset slow -r 30 -c:a aac -b:a 192k -movflags +faststart ad-master-cover.mp4
cp ad-master-grain.mp4 $D/nitron-injury-breakdown-ep04-$V.mp4; cp ad-master-cover.mp4 $D/nitron-injury-breakdown-ep04-$V-with-cover.mp4; cp $C $D/nitron-injury-breakdown-ep04-cover.jpg
for f in $D/nitron-injury-breakdown-ep04-$V.mp4 $D/nitron-injury-breakdown-ep04-$V-with-cover.mp4; do ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,r_frame_rate,width,height:format=duration -of csv=p=0 $f | tr '\n' ' '; echo; done
