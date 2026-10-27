#!/bin/sh
# person layer for a custom «text on the wall behind him» scene: hook_range.sh <work> <key> <from> <to>
# re-run after any 11_behind_text call (it rebuilds behind.json ranges)
W=$1; K=$2; A=$3; B=$4
ffmpeg -v error -start_number $A -i $W/bt/src/%05d.jpg -start_number $A -i $W/bt/mask/%05d.png -frames:v $((B-A+1)) \
  -filter_complex "[1:v]format=gray,scale=1080:1920[a];[0:v][a]alphamerge,format=rgba" -start_number $A -y $W/bt/person/%05d.png
python3 - "$W" "$K" $A $B <<'P'
import json,sys
W,K,A,B=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4]); p=W+"/behind.json"; d=json.load(open(p))
d[K]=[A,B]; rs=sorted([list(r) for r in d.get("ranges",[])]+[[A,B]]); out=[]
for r in rs:
    if out and r[0]<=out[-1][1]+1: out[-1][1]=max(out[-1][1],r[1])
    else: out.append(r)
d["ranges"]=out; json.dump(d,open(p,"w"),ensure_ascii=False,indent=1); print(K,[A,B],"ranges",out)
P
