<?php
/**
 * GET api/perfil.php  -  ENDPOINT PRIVADO
 *
 * Devuelve los datos de la cuenta que inicio sesion y las carreras que
 * cursa (relacion ESTUDIA). El frontend lo consulta al cargar cada pagina
 * para saber si hay una sesion activa.
 *
 * Respuestas:
 *   200 OK           -> datos del usuario de la sesion
 *   401 Unauthorized -> no hay sesion iniciada
 */

declare(strict_types=1);
require __DIR__ . '/conexion.php';

iniciarSesion();

// --- Guardian de sesion -----------------------------------------------
// Sin $_SESSION['usuario_id'] no hay usuario autenticado: se responde 401
// de inmediato, antes de ejecutar cualquier consulta.
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'No autorizado: inicia sesion.'], JSON_UNESCAPED_UNICODE);
    exit;
}

ejecutarEndpoint(function (): void {
    exigirMetodo('GET');
    $pdo = obtenerConexion();

    $consulta = $pdo->prepare(
        'SELECT u.id_usuario, u.alias_usuario, u.email, u.nombre, u.apellido,
                u.biografia, u.fecha_registro, u.estado, r.nombre AS rol
         FROM usuarios u
         JOIN roles r ON r.id_rol = u.id_rol
         WHERE u.id_usuario = :id'
    );
    $consulta->execute([':id' => $_SESSION['usuario_id']]);
    $usuario = $consulta->fetch();

    // La sesion apunta a una cuenta que ya no existe o que fue suspendida
    // despues del login: se cierra la sesion y se trata como no autorizado.
    if ($usuario === false || $usuario['estado'] !== 'activo') {
        $_SESSION = [];
        session_destroy();
        responderJson(401, ['error' => 'No autorizado: inicia sesion.']);
    }

    $carreras = $pdo->prepare(
        'SELECT c.id_carrera, c.nombre, e.sede
         FROM estudia e
         JOIN carreras c ON c.id_carrera = e.id_carrera
         WHERE e.id_usuario = :id
         ORDER BY c.nombre'
    );
    $carreras->execute([':id' => $_SESSION['usuario_id']]);

    unset($usuario['estado']);
    $usuario['id_usuario'] = (int) $usuario['id_usuario'];
    $usuario['carreras']   = $carreras->fetchAll();

    responderJson(200, $usuario);
});
