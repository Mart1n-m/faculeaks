<?php
/**
 * GET api/perfil.php  -  ENDPOINT PRIVADO
 *
 * Devuelve los datos de la cuenta que inicio sesion y las carreras que
 * cursa (relacion ESTUDIA). El frontend lo consulta al cargar para saber si
 * hay una sesion activa. Caso de uso: Ver perfil.
 *
 * Respuestas:
 *   200 OK           -> datos del usuario de la sesion
 *   401 Unauthorized -> no hay sesion iniciada
 */

declare(strict_types=1);
require __DIR__ . '/utilidades.php';
require __DIR__ . '/../models/UsuarioModel.php';

// Guardian de sesion: sin $_SESSION['usuario_id'] responde 401 de inmediato,
// antes de ejecutar cualquier consulta.
$idUsuario = exigirSesion();

ejecutarEndpoint(function () use ($idUsuario): void {
    exigirMetodo('GET');
    $usuarios = new UsuarioModel();
    $usuario  = $usuarios->obtenerPerfil($idUsuario);

    // La sesion apunta a una cuenta que ya no existe o que fue suspendida
    // despues del login: se cierra la sesion y se trata como no autorizado.
    if ($usuario === null || $usuario['estado'] !== 'activo') {
        $_SESSION = [];
        session_destroy();
        responderJson(401, ['error' => 'No autorizado: inicia sesion.']);
    }

    unset($usuario['estado']);
    $usuario['carreras'] = $usuarios->obtenerCarreras($idUsuario);

    responderJson(200, $usuario);
});
