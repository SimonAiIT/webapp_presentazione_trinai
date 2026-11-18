<?php
// Configurazione TrinAI Atelier Gate (copiare come .gate_config.php nella root del sito)
define("GATE_SESSION_SECRET", "SOSTITUIRE_CON_STRINGA_CASUALE_64_HEX");
define("GATE_COOKIE_NAME", "trinai_atelier_auth");
define("GATE_CODES_FILE", __DIR__ . "/.gate_codes.json");

// Collegamento opzionale a Google Apps Script (Portali Drive)
define("GATE_GAS_URL", "");
define("GATE_GAS_SYNC_SECRET", "");
