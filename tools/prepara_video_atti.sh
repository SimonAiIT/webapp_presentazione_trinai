#!/bin/bash
# Prepara i loop video di apertura degli atti (da Operazione Camice d'Oro e dalla presentazione Favero)
# Verticali 3:4, 8 secondi, senza audio, leggeri. Uso: bash tools/prepara_video_atti.sh
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FF=/d/Strumenti/ffmpeg.exe
B=/c/Users/garof/Desktop/TrinAi
OC="$B/TrinAi-Comunicazione/Operazione_Camice_d_Oro"
OUT="$ROOT/assets/video"

# atto | file sorgente | tipo (v = verticale 9:16 o 4:5, o = orizzontale)
fai() {
  atto="$1"; src="$2"
  larg=$("$FF" -i "$src" 2>&1 | grep -o "[0-9]\{3,4\}x[0-9]\{3,4\}" | head -1 | cut -d x -f1)
  alt=$("$FF" -i "$src" 2>&1 | grep -o "[0-9]\{3,4\}x[0-9]\{3,4\}" | head -1 | cut -d x -f2)
  # ritaglio centrale 3:4: se il sorgente e piu largo si taglia in larghezza, altrimenti in altezza
  if [ $((larg * 4)) -gt $((alt * 3)) ]; then vf="crop=ih*3/4:ih,scale=576:768"; else vf="crop=iw:iw*4/3:0:(ih-iw*4/3)/2,scale=576:768"; fi
  "$FF" -y -loglevel error -i "$src" -t 8 -vf "$vf" -an -c:v libx264 -crf 31 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/atto_$atto.mp4" && echo "fatto atto_$atto"
}

fai 01 "$OC/prequel01_l_invito/shot03_veo_INSTAGRAM_4_5.mp4"
fai 02 "$B/Clienti/Dr_Giovanni_Favero/webapp/assets/videos/minipc_video.mp4"
fai 03 "$OC/prequel02_victor_si_decide_solo_due_volte/shot04_raw_omni.mp4"
fai 04 "$OC/super_biglietto_da_visita/video/shot02.mp4"
fai 05 "$OC/prequel01_l_invito/shot04_veo_INSTAGRAM_4_5.mp4"
fai 06 "$OC/super_biglietto_da_visita/video/shot03.mp4"
fai 07 "$OC/prequel01_l_invito/shot02_veo_INSTAGRAM_4_5.mp4"
fai 08 "$OC/super_biglietto_da_visita/video/shot13.mp4"
fai 09 "$OC/super_biglietto_da_visita/video/shot04.mp4"
fai 10 "$OC/super_biglietto_da_visita/video/intro.mp4"
