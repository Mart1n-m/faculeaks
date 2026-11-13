<?php
/**
 * FacuLeaks - Modelo de productos del Marketplace (AE4)
 *
 * Acceso a datos de la tabla productos (con usuarios y materias).
 * Toda consulta es una sentencia preparada (OWASP A03).
 *
 * Casos de uso: Ver catalogo del Marketplace, Ver producto, Publicar producto,
 * Editar producto, Eliminar producto, Comprar material.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class ProductoModel
{
    public const TIPOS = ['apunte', 'libro', 'guia', 'pdf', 'otro'];

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

    /** Un producto por id (con vendedor y materia), o null si no existe. */
    public function obtener(int $idProducto): ?array
    {
        $consulta = $this->pdo->prepare(
            'SELECT p.id_producto, p.titulo, p.precio, p.tipo_material,
                    p.id_usuario, u.alias_usuario AS alias_vendedor,
                    p.id_materia, m.nombre AS nombre_materia
             FROM productos p
             JOIN usuarios u      ON u.id_usuario = p.id_usuario
             LEFT JOIN materias m ON m.id_materia = p.id_materia
             WHERE p.id_producto = :id'
        );
        $consulta->execute([':id' => $idProducto]);
        $fila = $consulta->fetch();

        return $fila === false ? null : self::normalizar($fila);
    }

    /** Publica un producto a nombre del vendedor y devuelve su id. */
    public function crear(int $idVendedor, string $titulo, float $precio, string $tipo, ?int $idMateria): int
    {
        $consulta = $this->pdo->prepare(
            'INSERT INTO productos (titulo, precio, tipo_material, id_usuario, id_materia)
             VALUES (:titulo, :precio, :tipo, :vendedor, :materia)'
        );
        $consulta->execute([
            ':titulo'   => $titulo,
            ':precio'   => $precio,
            ':tipo'     => $tipo,
            ':vendedor' => $idVendedor,
            ':materia'  => $idMateria,
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    /** Modifica titulo, precio, tipo y materia (las ventas ya hechas conservan su precio). */
    public function actualizar(int $idProducto, string $titulo, float $precio, string $tipo, ?int $idMateria): void
    {
        $consulta = $this->pdo->prepare(
            'UPDATE productos
             SET titulo = :titulo, precio = :precio, tipo_material = :tipo, id_materia = :materia
             WHERE id_producto = :id'
        );
        $consulta->execute([
            ':titulo'  => $titulo,
            ':precio'  => $precio,
            ':tipo'    => $tipo,
            ':materia' => $idMateria,
            ':id'      => $idProducto,
        ]);
    }

    /** Indica si el producto figura en alguna venta (detalla tiene ON DELETE RESTRICT). */
    public function tieneVentas(int $idProducto): bool
    {
        $consulta = $this->pdo->prepare('SELECT 1 FROM detalla WHERE id_producto = :id LIMIT 1');
        $consulta->execute([':id' => $idProducto]);

        return $consulta->fetchColumn() !== false;
    }

    /** Elimina el producto. Solo se llama si no tiene ventas. */
    public function eliminar(int $idProducto): void
    {
        $consulta = $this->pdo->prepare('DELETE FROM productos WHERE id_producto = :id');
        $consulta->execute([':id' => $idProducto]);
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
