<?php
/**
 * FacuLeaks - Modelo de usuarios (AE4)
 *
 * Acceso a datos de las tablas usuarios, roles, estudia y carreras.
 * Toda consulta es una sentencia preparada con marcadores nombrados (:campo):
 * los valores nunca se concatenan al SQL (OWASP A03).
 *
 * Casos de uso: Registrarse, Iniciar sesion, Ver perfil.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class UsuarioModel
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Conexion::obtener();
    }

    /**
     * Busca la cuenta por alias o e-mail para el login.
     * Devuelve id_usuario, alias_usuario, contrasena_cifrada y estado, o null.
     */
    public function buscarParaLogin(string $aliasOEmail): ?array
    {
        $consulta = $this->pdo->prepare(
            'SELECT id_usuario, alias_usuario, contrasena_cifrada, estado
             FROM usuarios
             WHERE alias_usuario = :alias OR email = :email
             LIMIT 1'
        );
        $consulta->execute([':alias' => $aliasOEmail, ':email' => $aliasOEmail]);
        $fila = $consulta->fetch();

        return $fila === false ? null : $fila;
    }

    /** Reemplaza el hash BCRYPT de la cuenta (rehash tras un login correcto). */
    public function actualizarHash(int $idUsuario, string $hash): void
    {
        $consulta = $this->pdo->prepare(
            'UPDATE usuarios SET contrasena_cifrada = :hash WHERE id_usuario = :id'
        );
        $consulta->execute([':hash' => $hash, ':id' => $idUsuario]);
    }

    /** Indica si el alias o el e-mail ya pertenecen a otra cuenta. */
    public function existeAliasOEmail(string $alias, string $email): bool
    {
        $consulta = $this->pdo->prepare(
            'SELECT 1 FROM usuarios WHERE alias_usuario = :alias OR email = :email LIMIT 1'
        );
        $consulta->execute([':alias' => $alias, ':email' => $email]);

        return $consulta->fetchColumn() !== false;
    }

    /**
     * Inserta una cuenta nueva con el rol indicado y devuelve su id.
     * Recibe el hash ya calculado: la contrasena en claro nunca llega al modelo.
     *
     * @throws PDOException 23000 si el alias o el e-mail ya existen.
     */
    public function crear(
        string $alias,
        string $email,
        string $nombre,
        string $apellido,
        string $hash,
        string $rol = 'estudiante'
    ): int {
        $consulta = $this->pdo->prepare(
            'INSERT INTO usuarios (alias_usuario, email, nombre, apellido, contrasena_cifrada, id_rol)
             SELECT :alias, :email, :nombre, :apellido, :hash, id_rol
             FROM roles WHERE nombre = :rol'
        );
        $consulta->execute([
            ':alias'    => $alias,
            ':email'    => $email,
            ':nombre'   => $nombre,
            ':apellido' => $apellido,
            ':hash'     => $hash,
            ':rol'      => $rol,
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    /** Datos publicos de la cuenta (sin la contrasena) junto con su rol, o null. */
    public function obtenerPerfil(int $idUsuario): ?array
    {
        $consulta = $this->pdo->prepare(
            'SELECT u.id_usuario, u.alias_usuario, u.email, u.nombre, u.apellido,
                    u.biografia, u.fecha_registro, u.estado, r.nombre AS rol
             FROM usuarios u
             JOIN roles r ON r.id_rol = u.id_rol
             WHERE u.id_usuario = :id'
        );
        $consulta->execute([':id' => $idUsuario]);
        $fila = $consulta->fetch();

        if ($fila === false) {
            return null;
        }

        $fila['id_usuario'] = (int) $fila['id_usuario'];
        return $fila;
    }

    /** Carreras que cursa el usuario (relacion ESTUDIA). */
    public function obtenerCarreras(int $idUsuario): array
    {
        $consulta = $this->pdo->prepare(
            'SELECT c.id_carrera, c.nombre, e.sede
             FROM estudia e
             JOIN carreras c ON c.id_carrera = e.id_carrera
             WHERE e.id_usuario = :id
             ORDER BY c.nombre'
        );
        $consulta->execute([':id' => $idUsuario]);

        return array_map(function (array $fila): array {
            $fila['id_carrera'] = (int) $fila['id_carrera'];
            return $fila;
        }, $consulta->fetchAll());
    }
}
