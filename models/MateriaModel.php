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
