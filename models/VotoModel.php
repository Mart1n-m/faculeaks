<?php
/**
 * FacuLeaks - Modelo de votos (AE4)
 *
 * Tabla vota: relacion N:M usuarios - contenidos con atributo valor (+1/-1).
 * La PK (id_usuario, id_contenido) garantiza un voto por usuario y contenido.
 * Sentencias preparadas con marcadores nombrados.
 *
 * Caso de uso: Votar publicacion o comentario.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class VotoModel
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Conexion::obtener();
    }

    /** Indica si existe el contenido (publicacion o comentario). */
    public function existeContenido(int $idContenido): bool
    {
        $consulta = $this->pdo->prepare('SELECT 1 FROM contenidos WHERE id_contenido = :id');
        $consulta->execute([':id' => $idContenido]);

        return $consulta->fetchColumn() !== false;
    }

    /**
     * Registra o cambia el voto (+1 / -1) del usuario. Con valor 0 lo quita.
     * El "upsert" usa la PK compuesta: si el voto ya existe, se actualiza.
     */
    public function votar(int $idUsuario, int $idContenido, int $valor): void
    {
        if ($valor === 0) {
            $consulta = $this->pdo->prepare(
                'DELETE FROM vota WHERE id_usuario = :usuario AND id_contenido = :contenido'
            );
            $consulta->execute([':usuario' => $idUsuario, ':contenido' => $idContenido]);
            return;
        }

        $consulta = $this->pdo->prepare(
            'INSERT INTO vota (id_usuario, id_contenido, valor)
             VALUES (:usuario, :contenido, :valor)
             ON DUPLICATE KEY UPDATE valor = :valor_nuevo'
        );
        $consulta->execute([
            ':usuario'     => $idUsuario,
            ':contenido'   => $idContenido,
            ':valor'       => $valor,
            ':valor_nuevo' => $valor,
        ]);
    }

    /** Puntaje del contenido: suma de sus votos (vw_puntaje_contenido). */
    public function puntaje(int $idContenido): int
    {
        $consulta = $this->pdo->prepare(
            'SELECT puntaje FROM vw_puntaje_contenido WHERE id_contenido = :id'
        );
        $consulta->execute([':id' => $idContenido]);

        return (int) $consulta->fetchColumn();
    }
}
