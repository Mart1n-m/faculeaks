<?php
/**
 * FacuLeaks - Modelo de publicaciones del foro (AE4)
 *
 * Una publicacion ocupa dos tablas (jerarquia ISA del esquema):
 *   contenidos     -> texto, fecha, autor y carrera (supertipo)
 *   publicaciones  -> categoria, adjunto y materia   (subtipo)
 * Por eso el alta, la edicion y la baja se hacen dentro de una transaccion.
 *
 * Convencion del esquema (docs/bd/README.md): la primera linea de
 * contenidos.cuerpo_texto es el titulo y el resto es el cuerpo.
 *
 * Todas las consultas son sentencias preparadas con marcadores nombrados.
 *
 * Casos de uso: Ver publicaciones, Buscar/filtrar material, Ver publicacion,
 * Publicar material, Editar publicacion, Eliminar publicacion.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class PublicacionModel
{
    public const CATEGORIAS = ['apunte', 'parcial', 'final', 'consulta', 'recurso'];

    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Conexion::obtener();
    }

    /**
     * Listado del foro con autor, materia, carrera, puntaje y cantidad de
     * comentarios. Filtros opcionales: categoria, id_materia, id_carrera y q
     * (texto). Orden: 'votos' (por defecto) o 'recientes'.
     * Si se indica $idUsuarioActual, incluye su voto en 'mi_voto'.
     */
    public function listar(array $filtros = [], ?int $idUsuarioActual = null): array
    {
        $condiciones = [];
        $parametros  = [':usuario_actual' => $idUsuarioActual ?? 0];

        if (isset($filtros['categoria'])) {
            $condiciones[]           = 'p.categoria = :categoria';
            $parametros[':categoria'] = $filtros['categoria'];
        }
        if (isset($filtros['id_materia'])) {
            $condiciones[]            = 'p.id_materia = :id_materia';
            $parametros[':id_materia'] = $filtros['id_materia'];
        }
        if (isset($filtros['id_carrera'])) {
            $condiciones[]            = 'c.id_carrera = :id_carrera';
            $parametros[':id_carrera'] = $filtros['id_carrera'];
        }
        if (isset($filtros['q'])) {
            // El comodin % se agrega al VALOR, no al SQL: sigue siendo un
            // parametro y no puede alterar la consulta.
            $condiciones[]   = 'c.cuerpo_texto LIKE :q';
            $parametros[':q'] = '%' . $filtros['q'] . '%';
        }

        $donde = $condiciones === [] ? '' : 'WHERE ' . implode(' AND ', $condiciones);
        $orden = ($filtros['orden'] ?? 'votos') === 'recientes'
            ? 'c.fecha_creacion DESC'
            : 'puntaje DESC, c.fecha_creacion DESC';

        // $donde y $orden solo contienen texto fijo escrito aca; los valores
        // del usuario viajan siempre como parametros.
        $consulta = $this->pdo->prepare(
            self::SELECT_BASE . " $donde ORDER BY $orden"
        );
        $consulta->execute($parametros);

        return array_map([self::class, 'normalizar'], $consulta->fetchAll());
    }

    /** Una publicacion por id, o null si no existe. */
    public function obtener(int $idPublicacion, ?int $idUsuarioActual = null): ?array
    {
        $consulta = $this->pdo->prepare(self::SELECT_BASE . ' WHERE c.id_contenido = :id');
        $consulta->execute([':id' => $idPublicacion, ':usuario_actual' => $idUsuarioActual ?? 0]);
        $fila = $consulta->fetch();

        return $fila === false ? null : self::normalizar($fila);
    }

    /**
     * Carrera a la que se asocia una publicacion de la materia indicada:
     * una carrera que dicte la materia, priorizando las que cursa el autor.
     * Devuelve null si la materia no existe o ninguna carrera la dicta.
     */
    public function carreraParaMateria(int $idMateria, int $idUsuario): ?int
    {
        $consulta = $this->pdo->prepare(
            'SELECT d.id_carrera
             FROM dicta d
             LEFT JOIN estudia e ON e.id_carrera = d.id_carrera AND e.id_usuario = :usuario
             WHERE d.id_materia = :materia
             ORDER BY (e.id_usuario IS NULL), d.id_carrera
             LIMIT 1'
        );
        $consulta->execute([':usuario' => $idUsuario, ':materia' => $idMateria]);
        $idCarrera = $consulta->fetchColumn();

        return $idCarrera === false ? null : (int) $idCarrera;
    }

    /** Alta: inserta el supertipo y el subtipo en una transaccion. Devuelve el id. */
    public function crear(
        int $idUsuario,
        int $idCarrera,
        int $idMateria,
        string $categoria,
        string $titulo,
        string $cuerpo
    ): int {
        $this->pdo->beginTransaction();
        try {
            $contenido = $this->pdo->prepare(
                "INSERT INTO contenidos (tipo, cuerpo_texto, id_usuario, id_carrera)
                 VALUES ('publicacion', :texto, :usuario, :carrera)"
            );
            $contenido->execute([
                ':texto'   => self::unirTexto($titulo, $cuerpo),
                ':usuario' => $idUsuario,
                ':carrera' => $idCarrera,
            ]);
            $idPublicacion = (int) $this->pdo->lastInsertId();

            $publicacion = $this->pdo->prepare(
                'INSERT INTO publicaciones (id_contenido, categoria, id_materia)
                 VALUES (:id, :categoria, :materia)'
            );
            $publicacion->execute([
                ':id'        => $idPublicacion,
                ':categoria' => $categoria,
                ':materia'   => $idMateria,
            ]);

            $this->pdo->commit();
            return $idPublicacion;
        } catch (Throwable $error) {
            $this->pdo->rollBack();
            throw $error;
        }
    }

    /** Edicion del texto, la categoria y la materia (y su carrera). */
    public function actualizar(
        int $idPublicacion,
        int $idCarrera,
        int $idMateria,
        string $categoria,
        string $titulo,
        string $cuerpo
    ): void {
        $this->pdo->beginTransaction();
        try {
            $contenido = $this->pdo->prepare(
                'UPDATE contenidos SET cuerpo_texto = :texto, id_carrera = :carrera
                 WHERE id_contenido = :id'
            );
            $contenido->execute([
                ':texto'   => self::unirTexto($titulo, $cuerpo),
                ':carrera' => $idCarrera,
                ':id'      => $idPublicacion,
            ]);

            $publicacion = $this->pdo->prepare(
                'UPDATE publicaciones SET categoria = :categoria, id_materia = :materia
                 WHERE id_contenido = :id'
            );
            $publicacion->execute([
                ':categoria' => $categoria,
                ':materia'   => $idMateria,
                ':id'        => $idPublicacion,
            ]);

            $this->pdo->commit();
        } catch (Throwable $error) {
            $this->pdo->rollBack();
            throw $error;
        }
    }

    /**
     * Baja: comentarios.id_publicacion tiene ON DELETE RESTRICT, asi que
     * primero se borran los contenidos de sus comentarios y despues el de la
     * publicacion. Los votos, reportes y filas de subtipo caen por CASCADE.
     */
    public function eliminar(int $idPublicacion): void
    {
        $this->pdo->beginTransaction();
        try {
            $comentarios = $this->pdo->prepare(
                'DELETE c FROM contenidos c
                 JOIN comentarios co ON co.id_contenido = c.id_contenido
                 WHERE co.id_publicacion = :id'
            );
            $comentarios->execute([':id' => $idPublicacion]);

            $publicacion = $this->pdo->prepare(
                "DELETE FROM contenidos WHERE id_contenido = :id AND tipo = 'publicacion'"
            );
            $publicacion->execute([':id' => $idPublicacion]);

            $this->pdo->commit();
        } catch (Throwable $error) {
            $this->pdo->rollBack();
            throw $error;
        }
    }

    private const SELECT_BASE =
        'SELECT c.id_contenido AS id_publicacion, c.cuerpo_texto, c.fecha_creacion,
                c.id_usuario, u.alias_usuario AS alias_autor,
                p.categoria, p.adjunto, p.archivo_nombre,
                p.id_materia, m.nombre AS nombre_materia,
                c.id_carrera, ca.nombre AS nombre_carrera,
                (SELECT COALESCE(SUM(v.valor), 0) FROM vota v
                  WHERE v.id_contenido = c.id_contenido) AS puntaje,
                (SELECT COUNT(*) FROM comentarios co
                  WHERE co.id_publicacion = c.id_contenido) AS cantidad_comentarios,
                (SELECT v2.valor FROM vota v2
                  WHERE v2.id_contenido = c.id_contenido
                    AND v2.id_usuario = :usuario_actual) AS mi_voto
         FROM contenidos c
         JOIN publicaciones p ON p.id_contenido = c.id_contenido
         JOIN usuarios u      ON u.id_usuario   = c.id_usuario
         JOIN materias m      ON m.id_materia   = p.id_materia
         JOIN carreras ca     ON ca.id_carrera  = c.id_carrera';

    /** Guarda titulo y cuerpo en cuerpo_texto: la primera linea es el titulo. */
    private static function unirTexto(string $titulo, string $cuerpo): string
    {
        return $titulo . "\n" . $cuerpo;
    }

    /** Separa titulo y cuerpo y convierte los numeros que PDO devuelve como texto. */
    private static function normalizar(array $fila): array
    {
        $partes = explode("\n", $fila['cuerpo_texto'], 2);
        unset($fila['cuerpo_texto']);

        $fila['titulo']               = $partes[0];
        $fila['cuerpo']               = $partes[1] ?? '';
        $fila['id_publicacion']       = (int) $fila['id_publicacion'];
        $fila['id_usuario']           = (int) $fila['id_usuario'];
        $fila['id_materia']           = (int) $fila['id_materia'];
        $fila['id_carrera']           = (int) $fila['id_carrera'];
        $fila['puntaje']              = (int) $fila['puntaje'];
        $fila['cantidad_comentarios'] = (int) $fila['cantidad_comentarios'];
        $fila['mi_voto']              = $fila['mi_voto'] === null ? 0 : (int) $fila['mi_voto'];

        return $fila;
    }
}
