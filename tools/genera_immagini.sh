#!/bin/bash
# Genera le immagini di apertura degli atti con Z-Image Turbo (stable-diffusion.cpp) e le salva in assets/img/*.jpg
# Uso: bash tools/genera_immagini.sh
SOLO="$*"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SD=/d/Strumenti/sd_cpp/sd-cli.exe
M=/d/Modelli/immagini
OUT="$ROOT/assets/img"
STILE="cinematic dark luxury photograph, deep black background, warm gold highlights, soft volumetric light, shallow depth of field, photorealistic, no text, no letters, no people"

gen() {
  nome="$1"; prompt="$2"
  # con argomenti (nomi) genera solo quelle immagini
  if [ -n "$SOLO" ] && [[ " $SOLO " != *" $nome "* ]]; then return; fi
  "$SD" --diffusion-model $M/z_image_turbo-Q4_K.gguf --llm $M/Qwen3-4B-Instruct-2507-Q4_K_M.gguf --vae $M/ae.safetensors \
    -p "$prompt, $STILE" --cfg-scale 1.0 --steps 8 -W 768 -H 1024 --offload-to-cpu --diffusion-fa -o "/tmp/_hero_$nome.png" >/dev/null 2>&1
  /d/Strumenti/ffmpeg.exe -y -loglevel error -i "/tmp/_hero_$nome.png" -q:v 3 "$OUT/$nome.jpg" && rm "/tmp/_hero_$nome.png"
  echo "fatto $nome"
}

gen hero_trinai_luxury "an ivory invitation card with a deep gold wax seal on a dark walnut table, a tailor's golden thread and brass scissors beside it, warm candlelight"
gen slide4_intelligence "an elegant brass and gold two-lobed brain-like mechanism with five thin glowing threads of light converging into it"
gen slide3_architecture "a luxurious obsidian and gold strongbox with a heavy lock on a dark table, a city at night softly blurred behind a window"
gen slide2_daemon "antique golden clockwork gears turning quietly behind a frosted glass panel, a computer keyboard softly out of focus in front"
gen slide5_sterilization "a neatly arranged gold and steel instrument tray in a clean laboratory, precise tools in perfect order, a small round lens above it"
gen slide7_training "a round table with warm light and five empty elegant chairs around it, a golden tailor's measuring tape coiled on the table"
gen slide8_care "an old university library with arched windows and golden light, an open book and a small brass compass on a wooden desk"
gen slide6_marketing "a golden hourglass with golden coins falling like sand on dark marble, a faint line of light rising like a chart behind it"
gen slide1_problema "a dark ornate vault door left slightly ajar with golden light spilling out, a single glowing golden cable leading away across a dark ocean toward distant city lights, tense atmosphere"
echo "tutte fatte"
