<?php
/**
 * FacuLeaks - Conexion a la base de datos (AE4)
 *
 * Patron Singleton: durante una peticion existe una unica instancia de PDO,
 * compartida por todos los modelos. El constructor es privado, de modo que
 * la unica forma de obtener la conexion es Conexion::obtener().
 *
 * Este archivo no es accesible desde el navegador: config/.htaccess deniega
 * cualquier peticion HTTP a la carpeta.
 */

declare(strict_types=1);

final class Conexion
{
    // Valores por defecto de XAMPP. Si MySQL usa otro puerto, usuario o clave,
    // se cambian solo aca.
    private const HOST    = '127.0.0.1';
    private const PUERTO  = 3306;
    private const NOMBRE  = 'facuLeaks';
    private const USUARIO = 'root';
    private const CLAVE   = '';

    private static ?PDO $instancia = null;

    /** Impide crear instancias con new: hay una sola conexion. */
    private function __construct()
    {
    }

    /** Impide duplicar la instancia con clone. */
    private function __clone()
    {
    }

    /**
     * Devuelve la conexion PDO, creandola en el primer uso.
     *
     * - ERRMODE_EXCEPTION: cualquier error SQL lanza PDOException en lugar de
     *   fallar en silencio; los endpoints la capturan y responden 500.
     * - EMULATE_PREPARES = false: las sentencias preparadas las resuelve el
     *   propio motor. La consulta y los datos viajan por separado, de modo que
     *   un valor del usuario nunca se interpreta como SQL (OWASP A03).
     *
     * @throws PDOException si no se puede conectar.
     */
    public static function obtener(): PDO
    {
        if (self::$instancia === null) {
            $dsn = 'mysql:host=' . self::HOST . ';port=' . self::PUERTO . ';dbname=' . self::NOMBRE . ';charset=utf8mb4';

            self::$instancia = new PDO($dsn, self::USUARIO, self::CLAVE, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        }

        return self::$instancia;
    }
}
