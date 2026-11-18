<?php
/**
 * TRINAI ATELIER // PHP SECURITY GATE (equivalente di edge_worker/worker.js)
 * - Blocca tutti i file statici a monte finche il cookie firmato HttpOnly non e valido.
 * - Supporta codici MASTER, a SCADENZA (expiresAt ms) e USA-E-GETTA (singleUse).
 * - Supporta fallback opzionale su Google Apps Script (GAS_URL + GAS_SYNC_SECRET).
 */

declare(strict_types=1);

require_once __DIR__ . '/.gate_config.php';

function b64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function b64url_decode(string $data): ?string {
    $pad = strlen($data) % 4;
    if ($pad > 0) {
        $data .= str_repeat('=', 4 - $pad);
    }
    $decoded = base64_decode(strtr($data, '-_', '+/'), true);
    return $decoded === false ? null : $decoded;
}

function sign_hmac(string $payloadB64, string $secret): string {
    return b64url_encode(hash_hmac('sha256', $payloadB64, $secret, true));
}

function verify_session_cookie(string $secret): ?array {
    $raw = $_COOKIE[GATE_COOKIE_NAME] ?? '';
    if ($raw === '') {
        return null;
    }
    $parts = explode('.', $raw, 2);
    if (count($parts) !== 2) {
        return null;
    }
    [$payloadB64, $sigB64] = $parts;
    $expectedSig = sign_hmac($payloadB64, $secret);
    if (!hash_equals($expectedSig, $sigB64)) {
        return null;
    }
    $json = b64url_decode($payloadB64);
    if ($json === null) {
        return null;
    }
    $data = json_decode($json, true);
    if (!is_array($data)) {
        return null;
    }
    $nowMs = (int) round(microtime(true) * 1000);
    if (!empty($data['exp']) && $nowMs > (int) $data['exp']) {
        return null;
    }
    return $data;
}

function render_gate_html(string $err = ''): string {
    $errHtml = $err !== '' ? '<div class="err">' . htmlspecialchars($err, ENT_QUOTES, 'UTF-8') . '</div>' : '';
    return '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<title>TrinAI Atelier</title>'
        . '<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#06070b;color:#f1f5f9;font-family:system-ui,sans-serif;padding:20px}'
        . 'form{width:100%;max-width:380px;background:#0e111a;border:1px solid rgba(212,175,55,.3);border-radius:16px;padding:26px}'
        . 'h1{margin:0 0 8px;font-size:20px;color:#fff}p{margin:0 0 18px;font-size:13px;color:#94a3b8}'
        . 'input,button{width:100%;box-sizing:border-box;min-height:46px;border-radius:10px;font-size:14px}'
        . 'input{background:#050609;border:1px solid rgba(255,255,255,.15);color:#fff;padding:0 12px;margin-bottom:10px}'
        . 'button{background:#d4af37;color:#06070b;border:0;font-weight:700;cursor:pointer}'
        . '.err{color:#ef4444;font-size:12px;margin-top:10px}</style></head>'
        . '<body><form method="POST" action="/_auth">'
        . '<h1>TrinAI Atelier</h1>'
        . '<p>Accesso riservato. Inserisci il codice personale.</p>'
        . '<input name="code" type="password" placeholder="CODICE" required autofocus>'
        . '<button type="submit">Sblocca</button>'
        . $errHtml
        . '</form></body></html>';
}

function verify_code_local(string $rawCode, int $nowMs, ?string &$errorMsg): ?array {
    if (!file_exists(GATE_CODES_FILE)) {
        return null;
    }
    $fp = fopen(GATE_CODES_FILE, 'c+');
    if (!$fp) {
        return null;
    }
    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return null;
    }

    $content = stream_get_contents($fp);
    $codes = json_decode($content ?: '{}', true);
    if (!is_array($codes)) {
        $codes = [];
    }

    $record = $codes[$rawCode] ?? null;
    if (!is_array($record)) {
        flock($fp, LOCK_UN);
        fclose($fp);
        return null;
    }

    if (!empty($record['expiresAt']) && $nowMs > (int) $record['expiresAt']) {
        unset($codes[$rawCode]);
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($codes, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
        $errorMsg = 'Codice scaduto.';
        return null;
    }

    if (!empty($record['singleUse'])) {
        unset($codes[$rawCode]);
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($codes, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        fflush($fp);
    }

    flock($fp, LOCK_UN);
    fclose($fp);
    return $record;
}

function verify_code_gas(string $rawCodeExact): ?array {
    if (GATE_GAS_URL === '' || GATE_GAS_SYNC_SECRET === '') {
        return null;
    }
    $payload = json_encode([
        'action' => 'verifica_codice',
        'code'   => $rawCodeExact,
        'secret' => GATE_GAS_SYNC_SECRET,
    ]);
    if ($payload === false) {
        return null;
    }

    $body = null;
    if (function_exists('curl_init')) {
        $ch = curl_init(GATE_GAS_URL);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 15,
        ]);
        $res = curl_exec($ch);
        if (is_string($res)) {
            $body = $res;
        }
        curl_close($ch);
    } else {
        $ctx = stream_context_create([
            'http' => [
                'method'  => 'POST',
                'header'  => "Content-Type: application/json\r\n",
                'content' => $payload,
                'timeout' => 15,
            ],
        ]);
        $res = @file_get_contents(GATE_GAS_URL, false, $ctx);
        if (is_string($res)) {
            $body = $res;
        }
    }

    if ($body === null) {
        return null;
    }
    $gasData = json_decode($body, true);
    if (is_array($gasData) && !empty($gasData['ok'])) {
        return [
            'role'        => $gasData['role'] ?? 'OSPITE',
            'sessionDays' => (int) ($gasData['sessionDays'] ?? 14),
        ];
    }
    return null;
}

function get_mime_type(string $path): string {
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $map = [
        'html'  => 'text/html; charset=utf-8',
        'htm'   => 'text/html; charset=utf-8',
        'css'   => 'text/css; charset=utf-8',
        'js'    => 'application/javascript; charset=utf-8',
        'mjs'   => 'application/javascript; charset=utf-8',
        'json'  => 'application/json; charset=utf-8',
        'svg'   => 'image/svg+xml',
        'png'   => 'image/png',
        'jpg'   => 'image/jpeg',
        'jpeg'  => 'image/jpeg',
        'gif'   => 'image/gif',
        'webp'  => 'image/webp',
        'ico'   => 'image/x-icon',
        'woff'  => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf'   => 'font/ttf',
        'otf'   => 'font/otf',
        'mp3'   => 'audio/mpeg',
        'wav'   => 'audio/wav',
        'ogg'   => 'audio/ogg',
        'm4a'   => 'audio/mp4',
        'mp4'   => 'video/mp4',
        'webm'  => 'video/webm',
        'vtt'   => 'text/vtt; charset=utf-8',
        'srt'   => 'text/plain; charset=utf-8',
        'txt'   => 'text/plain; charset=utf-8',
        'md'    => 'text/markdown; charset=utf-8',
        'pdf'   => 'application/pdf',
    ];
    return $map[$ext] ?? 'application/octet-stream';
}

function serve_file_with_ranges(string $filePath): void {
    $size = filesize($filePath);
    if ($size === false) {
        http_response_code(404);
        exit('Not found');
    }

    $mime = get_mime_type($filePath);
    header('Content-Type: ' . $mime);
    header('Accept-Ranges: bytes');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-Robots-Tag: noindex, nofollow');

    $start = 0;
    $end = $size - 1;
    $isRange = false;

    if (isset($_SERVER['HTTP_RANGE']) && preg_match('/bytes=(\d*)-(\d*)/i', $_SERVER['HTTP_RANGE'], $m)) {
        $isRange = true;
        if ($m[1] !== '') {
            $start = (int) $m[1];
        }
        if ($m[2] !== '') {
            $end = (int) $m[2];
        } elseif ($m[1] === '') {
            $start = max(0, $size - (int) $m[2]);
            $end = $size - 1;
        }
        if ($start > $end || $start >= $size || $end >= $size) {
            http_response_code(416);
            header("Content-Range: bytes */$size");
            exit;
        }
    }

    $length = $end - $start + 1;
    if ($isRange) {
        http_response_code(206);
        header("Content-Range: bytes $start-$end/$size");
    } else {
        http_response_code(200);
    }
    header("Content-Length: $length");

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'HEAD') {
        exit;
    }

    $fp = fopen($filePath, 'rb');
    if (!$fp) {
        http_response_code(500);
        exit;
    }
    if ($start > 0) {
        fseek($fp, $start);
    }
    $remaining = $length;
    while ($remaining > 0 && !feof($fp)) {
        $chunk = fread($fp, min(65536, $remaining));
        if ($chunk === false) {
            break;
        }
        echo $chunk;
        $remaining -= strlen($chunk);
    }
    fclose($fp);
    exit;
}

$reqPath = rawurldecode((string) (parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/'));
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// 1. Endpoint di verifica codice
if ($reqPath === '/_auth' && $method === 'POST') {
    $rawCodeExact = trim((string) ($_POST['code'] ?? ''));
    $rawCode = strtoupper($rawCodeExact);
    $nowMs = (int) round(microtime(true) * 1000);
    $errorMsg = null;

    $record = $rawCode !== '' ? verify_code_local($rawCode, $nowMs, $errorMsg) : null;
    if ($errorMsg !== null) {
        http_response_code(403);
        header('Content-Type: text/html; charset=utf-8');
        header('Cache-Control: no-store');
        echo render_gate_html($errorMsg);
        exit;
    }

    if ($record === null && $rawCodeExact !== '') {
        $record = verify_code_gas($rawCodeExact);
    }

    if ($record === null) {
        http_response_code(403);
        header('Content-Type: text/html; charset=utf-8');
        header('Cache-Control: no-store');
        echo render_gate_html('Codice non valido o scaduto.');
        exit;
    }

    $sessionDays = max(1, (int) ($record['sessionDays'] ?? 14));
    $ttlSec = $sessionDays * 86400;
    $expMs = $nowMs + ($ttlSec * 1000);

    $payloadB64 = b64url_encode(json_encode([
        'role' => $record['role'] ?? 'OSPITE',
        'exp'  => $expMs,
    ]));
    $sigB64 = sign_hmac($payloadB64, GATE_SESSION_SECRET);
    $cookieVal = $payloadB64 . '.' . $sigB64;

    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
        || ((int) ($_SERVER['SERVER_PORT'] ?? 80) === 443);

    setcookie(GATE_COOKIE_NAME, $cookieVal, [
        'expires'  => time() + $ttlSec,
        'path'     => '/',
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);

    header('Location: /', true, 302);
    exit;
}

// 2. Verifica cookie firmato su ogni richiesta
$session = verify_session_cookie(GATE_SESSION_SECRET);
if ($session === null) {
    http_response_code(401);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    echo render_gate_html();
    exit;
}

// 3. Servi file statico in sicurezza
$baseReal = realpath(__DIR__);
if ($baseReal === false) {
    http_response_code(500);
    exit;
}

if ($reqPath === '/gate.php') {
    $reqPath = '/';
}

// Blocca file nascosti e di sistema
foreach (explode('/', trim($reqPath, '/')) as $seg) {
    if ($seg !== '' && ($seg[0] === '.' || $seg === '..')) {
        http_response_code(403);
        exit('Forbidden');
    }
}

$target = $baseReal . DIRECTORY_SEPARATOR . ltrim(str_replace('/', DIRECTORY_SEPARATOR, $reqPath), DIRECTORY_SEPARATOR);
$realTarget = realpath($target);

if ($realTarget === false || ($realTarget !== $baseReal && strpos($realTarget, $baseReal . DIRECTORY_SEPARATOR) !== 0)) {
    http_response_code(404);
    exit('Not found');
}

if (is_dir($realTarget)) {
    if (substr($reqPath, -1) !== '/') {
        header('Location: ' . $reqPath . '/', true, 302);
        exit;
    }
    $indexFile = $realTarget . DIRECTORY_SEPARATOR . 'index.html';
    if (!is_file($indexFile)) {
        http_response_code(404);
        exit('Not found');
    }
    $realTarget = $indexFile;
}

if (!is_file($realTarget) || basename($realTarget) === 'gate.php') {
    http_response_code(404);
    exit('Not found');
}

serve_file_with_ranges($realTarget);
