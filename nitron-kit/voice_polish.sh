#!/bin/bash
# Nitron kit — voice polish before sound.py: writes voice.wav + voice.f32 (48 kHz mono) from the CURRENT build's voice
#   high-pass 75 Hz · −2 dB at 280 Hz (boxiness) · +2 dB at 3.6 kHz (presence) · gentle de-ess · 2.5:1 compression
# Safe to run twice: .voice_polished holds the checksum of the polished file, so a polished voice is never processed
# again, and a fresh build_cut voice (different checksum) always replaces voice_raw.wav (it never reuses an old take).
set -e; W="$1"; cd "$W"
cur=$(md5sum voice.wav | cut -d' ' -f1)
if [ -f .voice_polished ] && [ "$(cat .voice_polished)" = "$cur" ]; then echo "voice already polished"; exit 0; fi
cp voice.wav voice_raw.wav
ffmpeg -v error -y -i voice_raw.wav -af "highpass=f=75,equalizer=f=280:t=q:w=1.2:g=-2,equalizer=f=3600:t=q:w=1.0:g=2,deesser=i=0.35,acompressor=threshold=-22dB:ratio=2.5:attack=6:release=120:makeup=1.6,alimiter=limit=0.89:level=false" -ar 48000 -ac 1 voice.wav
ffmpeg -v error -y -i voice.wav -f f32le -ac 1 -ar 48000 voice.f32
md5sum voice.wav | cut -d' ' -f1 > .voice_polished
echo "voice polished → $W/voice.wav"
