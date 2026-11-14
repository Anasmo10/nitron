#!/bin/bash
# EP04: one on-camera range → matte (key frames) → relight → cooler/cleaner colour → on the gym as framed (prep4.py) → ep/vfr + ep/bt/person
# the take was framed from the 4K original in prep3.py) → ep/vfr + ep/bt/person.   usage: ahmad3.sh <first> <last>
set -e; cd /home/user/work/ep4; W=ep; A=$1; B=$2; K=/home/user/nitron/nitron-kit; T=tmp_$A; mkdir -p $T/raw $T/lit $T/cc
python3 $K/propmatte.py $W $A $B | tail -1
for i in $(seq $A $B); do f=$(printf %05d $i); ln -sf $PWD/$W/bt/p_raw/$f.png $T/raw/$f.png; done
python3 $K/relight.py $T/raw $T/lit --no-rim | tail -1
python3 $K/cleancool.py $T/lit $T/cc --level A | tail -1
python3 $K/stage_composite.py $T/cc /home/user/work/ep2/bg/gym_k.png $W/vfr --scale 1 --dy 0 --dx 0 --blur 5 --person-out $W/bt/person | tail -2
echo "range $A-$B done $(date +%T)"
