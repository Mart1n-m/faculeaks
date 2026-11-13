<?php
/**
 * FacuLeaks - Utilidades comunes de los controladores de api/ (AE4)
 *
 * Todos los endpoints incluyen este archivo. Reune:
 *   1. La configuracion e inicio de la sesion PHP.
 *   2. Funciones para leer el cuerpo JSON y responder en JSON con su
 *      codigo HTTP.
 *   3. El guardian de sesion (401) y el manejo de excepciones (500).
 *
 * La conexion a MySQL vive en config/conexion.php y el acceso a datos en
 * models/: los controladores no escriben SQL.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

/**
 * Inicia (o retoma) la sesion con una cookie endurecida.
 *
 * - httponly: el JavaScript de la pagina no puede leer la cookie de sesion,
 *   asi que un XSS no podria robarla con document.cookie.
 * - samesite=Strict: el navegador no envia la cookie en peticiones que se
 *   originan en otro sitio (mitiga CSRF).
 */
function iniciarSesion(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_name('FACULEAKS_SESION');
    session_start();
}

/** Envia una respuesta JSON con su codigo de estado HTTP y termina. */
function responderJson(int $codigo, array $datos): never
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Corta la peticion con 405 si no llego con el metodo HTTP esperado. */
function exigirMetodo(string $metodo): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $metodo) {
        header('Allow: ' . $metodo);
        responderJson(405, ['error' => 'Metodo no permitido.']);
    }
}

/**
 * Guardian de sesion (OWASP A01): si no hay usuario autenticado responde
 * 401 y termina antes de ejecutar cualquier consulta. Devuelve el id del
 * usuario de la sesion.
 */
function exigirSesion(): int
{
    iniciarSesion();

    if (!isset($_SESSION['usuario_id'])) {
        responderJson(401, ['error' => 'No autorizado: inicia sesion.']);
    }

    return (int) $_SESSION['usuario_id'];
}

/**
 * Lee el cuerpo de la peticion como JSON y lo devuelve como arreglo.
 * Si el cuerpo no es un objeto JSON valido, responde 400.
 */
function leerJson(): array
{
    $datos = json_decode(file_get_contents('php://input'), true);

    if (!is_array($datos)) {
        responderJson(400, ['error' => 'El cuerpo de la peticion debe ser un objeto JSON.']);
    }

    return $datos;
}

/** Devuelve el campo como texto sin espacios en los extremos ('' si falta). */
function campoTexto(array $datos, string $campo): string
{
    return isset($datos[$campo]) && is_string($datos[$campo]) ? trim($datos[$campo]) : '';
}

/**
 * Ejecuta el endpoint y convierte cualquier error de base en un 500
 * generico: el detalle tecnico va al log del servidor, nunca al cliente.
 */
function ejecutarEndpoint(callable $endpoint): void
{
    try {
        $endpoint();
    } catch (PDOException $error) {
        error_log('FacuLeaks API: ' . $error->getMessage());
        responderJson(500, ['error' => 'Error interno del servidor.']);
    }
}
