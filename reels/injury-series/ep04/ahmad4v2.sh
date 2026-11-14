#!/bin/bash
# EP04 v2: one take → clean matte (matte_v2.py: wide-frame BiRefNet + backdrop plate) → relight → cooler/cleaner colour →
# on the gym as framed, with a thin edge wrap (--wrap 0.15) → ep/vfr + ep/bt/person.   usage: ahmad4v2.sh <first> <last>
set -e; cd /home/user/work/ep4; W=ep; A=$1; B=$2; K=/home/user/nitron/nitron-kit; T=tmpv2_$A; rm -rf $T; mkdir -p $T/raw $T/lit $T/cc
python3 matte_v2.py $A $B | tail -2
for i in $(seq $A $B); do f=$(printf %05d $i); [ -f $W/bt/p_raw/$f.png ] && ln -sf $PWD/$W/bt/p_raw/$f.png $T/raw/$f.png; done
python3 $K/relight.py $T/raw $T/lit --no-rim | tail -1
python3 $K/cleancool.py $T/lit $T/cc --level A | tail -1
python3 $K/stage_composite.py $T/cc /home/user/work/ep2/bg/gym_k.png $W/vfr --scale 1 --dy 0 --dx 0 --blur 5 --wrap 0.15 --person-out $W/bt/person | tail -2
rm -rf $T; echo "v2 range $A-$B done $(date +%T)"
