#!/bin/bash
# Prepara per il web le 15 clip situazionali generate con Omni (video_atti_atelier/S01..S15.mp4)
# Verticali 3:4, 8 secondi, senza audio, leggere. Uso: bash tools/prepara_clip_situazioni.sh
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FF=/d/Strumenti/ffmpeg.exe
SRC=/c/Users/garof/Desktop/TrinAi/TrinAi-Comunicazione/video_atti_atelier
OUT="$ROOT/assets/video"
for n in 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15; do
  "$FF" -y -loglevel error -i "$SRC/S$n.mp4" -t 8 \
    -vf "crop=iw:iw*4/3:0:(ih-iw*4/3)/2,scale=576:768" \
    -an -c:v libx264 -crf 31 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/s$n.mp4" && echo "fatto s$n"
done
