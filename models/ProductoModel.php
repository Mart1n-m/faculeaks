<?php
/**
 * FacuLeaks - Modelo de productos del Marketplace (AE4)
 *
 * Acceso a datos de la tabla productos (con usuarios y materias).
 * Toda consulta es una sentencia preparada (OWASP A03).
 *
 * Casos de uso: Ver catalogo del Marketplace, Ver producto, Comprar material.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class ProductoModel
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Conexion::obtener();
    }

    /**
     * Catalogo completo: productos ⋈ usuarios ⋈ materias.
     * LEFT JOIN con materias porque productos.id_materia admite NULL.
     */
    public function listar(): array
    {
        $consulta = $this->pdo->prepare(
            'SELECT p.id_producto, p.titulo, p.precio, p.tipo_material,
                    p.id_usuario, u.alias_usuario AS alias_vendedor,
                    p.id_materia, m.nombre AS nombre_materia
             FROM productos p
             JOIN usuarios u      ON u.id_usuario = p.id_usuario
             LEFT JOIN materias m ON m.id_materia = p.id_materia
             ORDER BY p.id_producto'
        );
        $consulta->execute();

        return array_map([self::class, 'normalizar'], $consulta->fetchAll());
    }

    /**
     * PDO devuelve los INT y DECIMAL de MySQL como texto en algunos drivers:
     * se convierten a numero para que el cliente reciba JSON tipado.
     */
    private static function normalizar(array $fila): array
    {
        $fila['id_producto'] = (int) $fila['id_producto'];
        $fila['id_usuario']  = (int) $fila['id_usuario'];
        $fila['id_materia']  = $fila['id_materia'] === null ? null : (int) $fila['id_materia'];
        $fila['precio']      = (float) $fila['precio'];
        return $fila;
    }
}
