"""
Genera le 9 tracce narrate (assets/audio/act_XX.mp3) con Kokoro (voce im_nicola)
partendo da tools/testi_estesi.json, e scrive assets/audio/punti.json con
l'istante di inizio di ogni punto chiave (per il carosello 3D sincronizzato).

Si lancia con il Python dell'ambiente TTS:
  D:\\Strumenti\\venv_tts\\Scripts\\python.exe -I tools\\genera_audio_nicola.py [codice ...]
"""
import json, os, re, subprocess, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TESTI = os.path.join(ROOT, "tools", "testi_estesi.json")
AUDIO = os.path.join(ROOT, "assets", "audio")
FF = r"D:\Strumenti\ffmpeg.exe"
VOCE = "im_nicola"
SR = 24000
VELOCITA_FINALE = 1.2   # accelerazione di tutta la traccia a fine lavorazione (max 1.2)

k = Kokoro(r"D:\Modelli\kokoro\kokoro-v1.0.onnx", r"D:\Modelli\kokoro\voices-v1.0.bin")


def silenzio(sec):
    return np.zeros(int(SR * sec), dtype=np.float32)


def spezza(frase):
    """Divide dopo i due punti (etichetta del punto) e le frasi molto lunghe alla virgola centrale."""
    blocchi = []
    parole = frase.split()
    if len(parole) > 24 and "," in frase:
        virgole = [i for i, c in enumerate(frase) if c == ","]
        meta = len(frase) / 2
        i = min(virgole, key=lambda p: abs(p - meta))
        blocchi.append((frase[: i + 1], "testa"))
        blocchi.append((frase[i + 1 :].strip(), "coda"))
    else:
        blocchi.append((frase, "intera"))
    return blocchi


def parla(testo, ruolo, pos_par, tot_par, idx_fr, tot_fr):
    """Sintetizza una frase con ritmo variabile. Ritorna audio + pausa che segue."""
    parole = len(testo.split())
    speed, pausa = 0.94, 0.3
    # ondulazione leggera e ripetibile, contro la monotonia
    speed += ((idx_fr * 7 + pos_par * 3) % 5 - 2) * 0.012
    if ruolo == "testa":
        pausa = 0.1
    elif testo.endswith("?"):
        speed, pausa = 0.90, 0.5
    elif parole <= 6:
        speed, pausa = 0.86, 0.45           # frase breve = enfasi
    elif testo.endswith("!"):
        speed, pausa = 0.9, 0.45
    if idx_fr == 0 and pos_par == 0:
        speed = min(speed, 0.88)            # apertura piu lenta
    if idx_fr == tot_fr - 1:
        pausa = 0.4                          # ultima frase del paragrafo: nessun rallentamento
    s, _ = k.create(testo, voice=VOCE, speed=speed, lang="it")
    return s, pausa


def paragrafo(testo, pos_par):
    """Voce naturale: ogni paragrafo letto d'un fiato, velocita costante, nessun effetto."""
    s, _ = k.create(testo, voice=VOCE, speed=1.0, lang="it")
    return s


def genera(codice, dati, tutti_i_punti):
    segmenti = [dati["intro"]] + dati["punti"] + [dati["chiusura"]]
    audio = [silenzio(0.3)]
    t = 0.3
    inizi = []
    for pos, seg in enumerate(segmenti):
        a = paragrafo(seg, pos)
        # i punti chiave cominciano qui (indice 1..n-1 sono i punti)
        if 1 <= pos <= len(dati["punti"]):
            inizi.append(round(t, 2))
        audio.append(a)
        audio.append(silenzio(0.55))
        t += len(a) / SR + 0.55
    totale = np.concatenate(audio)
    wav = os.path.join(AUDIO, f"_tmp_act_{codice}.wav")
    mp3 = os.path.join(AUDIO, f"act_{codice}.mp3")
    sf.write(wav, totale, SR)
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", wav, "-af",
                    f"atempo={VELOCITA_FINALE},highpass=f=70,equalizer=f=220:t=q:w=1:g=1.8,equalizer=f=3200:t=q:w=1:g=1.2,"
                    "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "24000", "-b:a", "96k", mp3], check=True)
    os.remove(wav)
    tutti_i_punti["stazione_" + codice] = {
        "durata": round(len(totale) / SR / VELOCITA_FINALE, 2),
        "inizi": [round(x / VELOCITA_FINALE, 2) for x in inizi],
    }
    print(codice, "durata", tutti_i_punti["stazione_" + codice], flush=True)


if __name__ == "__main__":
    testi = json.load(open(TESTI, encoding="utf-8"))
    scelti = sys.argv[1:] or sorted(testi)
    pj = os.path.join(AUDIO, "punti.json")
    punti = json.load(open(pj, encoding="utf-8")) if os.path.exists(pj) else {}
    for c in scelti:
        genera(c, testi[c], punti)
        json.dump(punti, open(pj, "w", encoding="utf-8"), indent=1)
    print("fatto", flush=True)
