<?php
/**
 * FacuLeaks - Utilidades comunes de la API (AE3)
 *
 * Todos los endpoints de api/ incluyen este archivo. Reune tres cosas:
 *   1. La conexion PDO a MySQL/MariaDB.
 *   2. La configuracion e inicio de la sesion PHP.
 *   3. Funciones para leer el cuerpo JSON y responder en JSON.
 */

declare(strict_types=1);

// --- Configuracion de la base (valores por defecto de XAMPP) ---------
const DB_HOST    = '127.0.0.1';
const DB_NOMBRE  = 'facuLeaks';
const DB_USUARIO = 'root';
const DB_CLAVE   = '';

/**
 * Devuelve una unica conexion PDO por peticion.
 *
 * - ERRMODE_EXCEPTION: cualquier error SQL lanza PDOException en lugar de
 *   fallar en silencio.
 * - EMULATE_PREPARES = false: las sentencias preparadas las resuelve el
 *   propio motor. La consulta y los datos viajan por separado, de modo que
 *   un valor del usuario nunca se interpreta como SQL (proteccion contra
 *   inyeccion SQL).
 */
function obtenerConexion(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NOMBRE . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USUARIO, DB_CLAVE, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }

    return $pdo;
}

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
function responderJson(int $codigo, array $datos): void
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
