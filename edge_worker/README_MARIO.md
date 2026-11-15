# Istruzioni Deploy Edge Gate per Mario (`atelier.trinai.it`)

Questo Cloudflare Worker trasforma la presentazione statica in un sito **realmente protetto senza backend**:
- Finché l'utente non ha un cookie firmato `HttpOnly`, **nessun file HTML, JS, immagine o audio viene consegnato**.
- Supporta codici **Master** (permanenti), a **Scadenza** (es. 14 giorni) e **Usa-e-Getta** (bruciati al primo accesso).

## Setup rapido su Cloudflare
1. Crea un KV Namespace chiamato `ATELIER_CODES` e inserisci il suo `id` in `wrangler.toml`.
2. Imposta il secret per la firma dei cookie:
   ```bash
   wrangler secret put SESSION_SECRET
   ```
3. Aggiungi i codici su KV (esempi JSON):
   - **Master permanente:** chiavetta `code:TRINAI-MASTER-01` -> `{"role":"MASTER","singleUse":false,"sessionDays":30}`
   - **Scadenza 14 giorni:** chiavetta `code:OSPITE-14GG` -> `{"role":"OSPITE","singleUse":false,"sessionDays":14,"expiresAt":1796000000000}`
   - **Usa e getta:** chiavetta `code:ONESHOT-99` -> `{"role":"ONESHOT","singleUse":true,"sessionDays":1}`
4. Collega il Worker alla route `atelier.trinai.it/*` con `wrangler deploy`.

## Collegamento ai codici generati dal Portale Drive (opzionale)
Se vuoi che i codici generati da Giulia e dal Professore su Drive sblocchino automaticamente anche `atelier.trinai.it`:
1. In Google Apps Script (**Impostazioni progetto** -> **Proprietà script**), aggiungi `GAS_SYNC_SECRET` con una password segreta a tua scelta.
2. Su Cloudflare Worker imposta le stesse due variabili:
   ```bash
   wrangler secret put GAS_URL          # URL .../exec della Web App Google Apps Script
   wrangler secret put GAS_SYNC_SECRET  # Stesso segreto impostato su Google Apps Script
   ```
