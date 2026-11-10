#!/bin/bash
# EP02: one Ahmad piece → matte (from key frames) → relight → cooler/cleaner colour → placed on the gym → vfr + bt/person
# usage: ahmad.sh <first> <last>
set -e; cd /home/user/work/ep2; W=ep; A=$1; B=$2; K=/home/user/nitron/nitron-kit; T=tmp_$A; rm -rf $T; mkdir -p $T/raw $T/lit $T/cc
python3 $K/propmatte.py $W $A $B | tail -1
for i in $(seq $A $B); do f=$(printf %05d $i); ln -sf $PWD/$W/bt/p_raw/$f.png $T/raw/$f.png; done
python3 $K/relight.py $T/raw $T/lit --no-rim | tail -1
python3 $K/cleancool.py $T/lit $T/cc --level A | tail -1
python3 $K/stage_composite.py $T/cc bg/gym_k.png $W/vfr --face_x 0.52 --face_y 0.30 --face_w 0.34 --blur 5 --person-out $W/bt/person | tail -2
rm -rf $T; echo "piece $A-$B done"
