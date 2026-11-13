<?php
/**
 * FacuLeaks - Modelo de materias (AE4)
 *
 * Acceso a datos de la tabla materias. Sentencias preparadas (OWASP A03).
 *
 * Casos de uso: Filtrar el catalogo por materia, Publicar material.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class MateriaModel
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Conexion::obtener();
    }

    /** Indica si existe la materia. */
    public function existe(int $idMateria): bool
    {
        $consulta = $this->pdo->prepare('SELECT 1 FROM materias WHERE id_materia = :id');
        $consulta->execute([':id' => $idMateria]);

        return $consulta->fetchColumn() !== false;
    }

    /** Todas las materias ordenadas por nombre: { id_materia, nombre }. */
    public function listar(): array
    {
        $consulta = $this->pdo->prepare(
            'SELECT id_materia, nombre FROM materias ORDER BY nombre'
        );
        $consulta->execute();

        return array_map(function (array $fila): array {
            $fila['id_materia'] = (int) $fila['id_materia'];
            return $fila;
        }, $consulta->fetchAll());
    }
}
