#!/bin/bash
# Nitron kit — voice polish before sound.py: keeps voice_raw.wav, writes voice.wav + voice.f32 (48 kHz mono)
#   high-pass 75 Hz · −2 dB at 280 Hz (boxiness) · +2 dB at 3.6 kHz (presence) · gentle de-ess · 2.5:1 compression
set -e; W="$1"; cd "$W"; [ -f voice_raw.wav ] || cp voice.wav voice_raw.wav
ffmpeg -v error -y -i voice_raw.wav -af "highpass=f=75,equalizer=f=280:t=q:w=1.2:g=-2,equalizer=f=3600:t=q:w=1.0:g=2,deesser=i=0.35,acompressor=threshold=-22dB:ratio=2.5:attack=6:release=120:makeup=1.6,alimiter=limit=0.89:level=false" -ar 48000 -ac 1 voice.wav
ffmpeg -v error -y -i voice.wav -f f32le -ac 1 -ar 48000 voice.f32
echo "voice polished → $W/voice.wav"
