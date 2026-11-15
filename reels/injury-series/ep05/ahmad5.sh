#!/bin/bash
# EP05: one take's on-camera reel frames → clean matte (matte5.py) → relight → cooler/cleaner colour → on the gym as framed,
# thin edge wrap (--wrap 0.15) → ep/vfr + ep/bt/person.   usage: ahmad5.sh <take> <first> <last>
set -e; cd /home/user/work/ep5; W=ep; N=$1; A=$2; B=$3; K=/home/user/nitron/nitron-kit; T=tmp5_$A; rm -rf $T; mkdir -p $T/raw $T/lit $T/cc
python3 matte5.py $N $A $B | tail -1
for i in $(seq $A $B); do f=$(printf %05d $i); ln -sf $PWD/$W/bt/p_raw/$f.png $T/raw/$f.png; done
python3 $K/relight.py $T/raw $T/lit --no-rim | tail -1
python3 $K/cleancool.py $T/lit $T/cc --level A | tail -1
python3 $K/stage_composite.py $T/cc /home/user/work/ep2/bg/gym_k.png $W/vfr --scale 1 --dy 0 --dx 0 --blur 5 --wrap 0.15 --person-out $W/bt/person | tail -2
rm -rf $T; echo "take $N frames $A-$B done $(date +%T)"
