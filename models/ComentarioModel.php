<?php
/**
 * FacuLeaks - Modelo de comentarios (AE4)
 *
 * Un comentario ocupa dos tablas (jerarquia ISA del esquema):
 *   contenidos   -> texto, fecha, autor y carrera
 *   comentarios  -> publicacion comentada y comentario padre (respuestas)
 *
 * Todas las consultas son sentencias preparadas con marcadores nombrados.
 *
 * Casos de uso: Comentar publicacion, Responder comentario,
 * Editar comentario, Eliminar comentario.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class ComentarioModel
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Conexion::obtener();
    }

    /** Comentarios de una publicacion en orden cronologico. */
    public function listarPorPublicacion(int $idPublicacion, ?int $idUsuarioActual = null): array
    {
        $consulta = $this->pdo->prepare(
            self::SELECT_BASE . ' WHERE co.id_publicacion = :publicacion ORDER BY c.fecha_creacion, c.id_contenido'
        );
        $consulta->execute([
            ':publicacion'    => $idPublicacion,
            ':usuario_actual' => $idUsuarioActual ?? 0,
        ]);

        return array_map([self::class, 'normalizar'], $consulta->fetchAll());
    }

    /** Un comentario por id, o null si no existe. */
    public function obtener(int $idComentario, ?int $idUsuarioActual = null): ?array
    {
        $consulta = $this->pdo->prepare(self::SELECT_BASE . ' WHERE c.id_contenido = :id');
        $consulta->execute([':id' => $idComentario, ':usuario_actual' => $idUsuarioActual ?? 0]);
        $fila = $consulta->fetch();

        return $fila === false ? null : self::normalizar($fila);
    }

    /**
     * Alta en una transaccion. El comentario hereda la carrera de la
     * publicacion que comenta. Devuelve el id del comentario.
     */
    public function crear(int $idUsuario, int $idPublicacion, int $idCarrera, string $texto, ?int $idPadre): int
    {
        $this->pdo->beginTransaction();
        try {
            $contenido = $this->pdo->prepare(
                "INSERT INTO contenidos (tipo, cuerpo_texto, id_usuario, id_carrera)
                 VALUES ('comentario', :texto, :usuario, :carrera)"
            );
            $contenido->execute([
                ':texto'   => $texto,
                ':usuario' => $idUsuario,
                ':carrera' => $idCarrera,
            ]);
            $idComentario = (int) $this->pdo->lastInsertId();

            $comentario = $this->pdo->prepare(
                'INSERT INTO comentarios (id_contenido, id_publicacion, id_comentario_padre)
                 VALUES (:id, :publicacion, :padre)'
            );
            $comentario->execute([
                ':id'          => $idComentario,
                ':publicacion' => $idPublicacion,
                ':padre'       => $idPadre,
            ]);

            $this->pdo->commit();
            return $idComentario;
        } catch (Throwable $error) {
            $this->pdo->rollBack();
            throw $error;
        }
    }

    /** Edicion del texto del comentario. */
    public function actualizar(int $idComentario, string $texto): void
    {
        $consulta = $this->pdo->prepare(
            "UPDATE contenidos SET cuerpo_texto = :texto
             WHERE id_contenido = :id AND tipo = 'comentario'"
        );
        $consulta->execute([':texto' => $texto, ':id' => $idComentario]);
    }

    /**
     * Baja: al borrar el contenido caen por CASCADE la fila de comentarios,
     * sus votos y reportes. Las respuestas quedan con padre NULL (SET NULL).
     */
    public function eliminar(int $idComentario): void
    {
        $consulta = $this->pdo->prepare(
            "DELETE FROM contenidos WHERE id_contenido = :id AND tipo = 'comentario'"
        );
        $consulta->execute([':id' => $idComentario]);
    }

    private const SELECT_BASE =
        'SELECT c.id_contenido AS id_comentario, c.cuerpo_texto AS texto, c.fecha_creacion,
                c.id_usuario, u.alias_usuario AS alias_autor,
                co.id_publicacion, co.id_comentario_padre,
                (SELECT COALESCE(SUM(v.valor), 0) FROM vota v
                  WHERE v.id_contenido = c.id_contenido) AS puntaje,
                (SELECT v2.valor FROM vota v2
                  WHERE v2.id_contenido = c.id_contenido
                    AND v2.id_usuario = :usuario_actual) AS mi_voto
         FROM contenidos c
         JOIN comentarios co ON co.id_contenido = c.id_contenido
         JOIN usuarios u     ON u.id_usuario    = c.id_usuario';

    private static function normalizar(array $fila): array
    {
        $fila['id_comentario']       = (int) $fila['id_comentario'];
        $fila['id_usuario']          = (int) $fila['id_usuario'];
        $fila['id_publicacion']      = (int) $fila['id_publicacion'];
        $fila['id_comentario_padre'] = $fila['id_comentario_padre'] === null ? null : (int) $fila['id_comentario_padre'];
        $fila['puntaje']             = (int) $fila['puntaje'];
        $fila['mi_voto']             = $fila['mi_voto'] === null ? 0 : (int) $fila['mi_voto'];

        return $fila;
    }
}
