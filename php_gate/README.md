# PHP Security Gate (equivalente di `edge_worker/` per hosting Apache/LiteSpeed + PHP)

Replica la protezione di `edge_worker/worker.js` su hosting tradizionali senza Cloudflare Workers.

## Deploy via FTP nella root del sito
1. Copia `.htaccess` e `gate.php` nella root web (`/`).
2. Copia `.gate_config.example.php` come `.gate_config.php` e imposta:
   - `GATE_SESSION_SECRET`: stringa casuale lunga (es. 64 caratteri hex).
   - `GATE_GAS_URL` e `GATE_GAS_SYNC_SECRET` (opzionali, per validare i codici generati dal Portale Drive).
3. Copia `.gate_codes.example.json` come `.gate_codes.json` con i codici locali attivi.

> **Nota di sicurezza:** `.gate_config.php` e `.gate_codes.json` contengono segreti e codici attivi: non committarli mai nella repository. `.htaccess` ne blocca l'accesso HTTP diretto (`403`).
