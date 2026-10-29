#!/bin/bash
# Nitron kit — final stereo mix: video from ad-final.mp4 + (voice + sfx.wav bed) → loudnorm −14 LUFS / −1.5 dBTP → ad-master.mp4
set -e; W="$1"; DUR=$(python3 -c "import json;c=json.load(open('$W/caps.json'));s=json.load(open('$W/sfx.json'));print(round(c['total']+s['outro'],3))")
FO=$(python3 -c "print(round($DUR-0.6,3))"); cd "$W"
ffmpeg -v error -y -i voice.wav -i sfx.wav -filter_complex "[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0,apad=pad_dur=8[v];[1:a]aresample=48000,aformat=channel_layouts=stereo[b];[v][b]amix=inputs=2:duration=first:normalize=0,atrim=0:$DUR,asetpts=PTS-STARTPTS,afade=t=out:st=$FO:d=0.6[m]" -map "[m]" -ac 2 mix_st.wav
J=$(ffmpeg -hide_banner -nostats -i mix_st.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | python3 -c "import sys,json,re;s=sys.stdin.read();print(json.dumps(json.loads(re.findall(r'\{[^{}]*input_i[^{}]*\}',s,re.S)[-1])))")
read II TP LRA TH < <(python3 -c "import json;d=json.loads('$J');print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'])")
ffmpeg -v error -y -i mix_st.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$II:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:linear=true" -ar 48000 mix_norm.wav
ffmpeg -v error -y -i ad-final.mp4 -i mix_norm.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest ad-master.mp4
ffmpeg -hide_banner -nostats -i ad-master.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tr -s ' ' | tr '\n' ' '; echo
