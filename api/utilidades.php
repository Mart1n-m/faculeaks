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
require_once __DIR__ . '/../models/UsuarioModel.php';

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
        responderMetodoNoPermitido([$metodo]);
    }
}

/** Responde 405 informando en la cabecera Allow los metodos aceptados. */
function responderMetodoNoPermitido(array $permitidos): never
{
    header('Allow: ' . implode(', ', $permitidos));
    responderJson(405, ['error' => 'Metodo no permitido.']);
}

/** Metodo HTTP de la peticion (GET, POST, PUT, DELETE...). */
function metodoActual(): string
{
    return $_SERVER['REQUEST_METHOD'];
}

/**
 * Lee un identificador positivo de la query string (?id=5).
 * Devuelve null si no vino; responde 400 si vino con un valor invalido.
 */
function idDeLaUrl(string $parametro = 'id'): ?int
{
    if (!isset($_GET[$parametro]) || $_GET[$parametro] === '') {
        return null;
    }

    $id = filter_var($_GET[$parametro], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($id === false) {
        responderJson(400, ['error' => "El parametro '$parametro' debe ser un entero positivo."]);
    }

    return $id;
}

/** Como idDeLaUrl(), pero el identificador es obligatorio (400 si falta). */
function exigirIdDeLaUrl(string $parametro = 'id'): int
{
    $id = idDeLaUrl($parametro);
    if ($id === null) {
        responderJson(400, ['error' => "Falta el parametro '$parametro' en la URL."]);
    }

    return $id;
}

/**
 * Devuelve el campo del JSON como entero positivo, null si no vino,
 * o false si vino con un valor que no es un entero positivo.
 */
function campoEntero(array $datos, string $campo): int|false|null
{
    if (!array_key_exists($campo, $datos) || $datos[$campo] === null || $datos[$campo] === '') {
        return null;
    }

    return filter_var($datos[$campo], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
}

/** Id del usuario de la sesion, o null si es un visitante anonimo. */
function usuarioDeLaSesion(): ?int
{
    iniciarSesion();

    return isset($_SESSION['usuario_id']) ? (int) $_SESSION['usuario_id'] : null;
}

/** Los moderadores y administradores pueden editar o borrar contenido ajeno. */
function puedeModerar(string $rol): bool
{
    return in_array($rol, ['moderador', 'administrador'], true);
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
 * Para las operaciones de escritura: ademas de la sesion, verifica en la
 * base que la cuenta siga existiendo y activa (pudo ser suspendida despues
 * del login). Devuelve ['id_usuario' => int, 'rol' => string] o responde 401.
 *
 * Se llama dentro de ejecutarEndpoint() porque consulta la base.
 */
function exigirUsuarioActivo(int $idUsuario): array
{
    $perfil = (new UsuarioModel())->obtenerPerfil($idUsuario);

    if ($perfil === null || $perfil['estado'] !== 'activo') {
        $_SESSION = [];
        session_destroy();
        responderJson(401, ['error' => 'No autorizado: inicia sesion.']);
    }

    return ['id_usuario' => $idUsuario, 'rol' => $perfil['rol']];
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
