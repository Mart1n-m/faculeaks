<?php
/**
 * POST api/logout.php
 *
 * Cierra la sesion: vacia $_SESSION, invalida la cookie en el navegador y
 * destruye los datos de sesion en el servidor.
 *
 * Respuesta: 200 OK
 */

declare(strict_types=1);
require __DIR__ . '/conexion.php';

exigirMetodo('POST');
iniciarSesion();

$_SESSION = [];

$parametros = session_get_cookie_params();
setcookie(session_name(), '', [
    'expires'  => time() - 3600,
    'path'     => $parametros['path'],
    'httponly' => $parametros['httponly'],
    'samesite' => $parametros['samesite'],
]);

session_destroy();

responderJson(200, ['mensaje' => 'Sesion cerrada.']);
