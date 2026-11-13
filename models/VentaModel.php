<?php
/**
 * FacuLeaks - Modelo de ventas del Marketplace (AE4)
 *
 *   ventas   -> cabecera: fecha, medio de pago y comprador
 *   detalla  -> renglones: producto, cantidad y precio unitario congelado
 * El total no se almacena: se calcula con la vista vw_venta_total.
 *
 * Sentencias preparadas con marcadores nombrados.
 *
 * Casos de uso: Comprar material, Ver mis compras.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class VentaModel
{
    public const MEDIOS_PAGO = ['mercado_pago', 'transferencia', 'efectivo'];

    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Conexion::obtener();
    }

    /**
     * Registra la compra en una transaccion: si falla un renglon, no queda
     * ninguna parte de la venta. El precio unitario se toma de la tabla
     * productos, nunca del cliente.
     *
     * @param array<int,int> $items id_producto => cantidad
     * @return int id de la venta
     */
    public function crear(int $idComprador, string $medioPago, array $items): int
    {
        $this->pdo->beginTransaction();
        try {
            $venta = $this->pdo->prepare(
                'INSERT INTO ventas (medio_pago, id_usuario) VALUES (:medio, :comprador)'
            );
            $venta->execute([':medio' => $medioPago, ':comprador' => $idComprador]);
            $idVenta = (int) $this->pdo->lastInsertId();

            $renglon = $this->pdo->prepare(
                'INSERT INTO detalla (id_venta, id_producto, cantidad, precio_unitario)
                 SELECT :venta, id_producto, :cantidad, precio
                 FROM productos WHERE id_producto = :producto'
            );
            foreach ($items as $idProducto => $cantidad) {
                $renglon->execute([
                    ':venta'    => $idVenta,
                    ':cantidad' => $cantidad,
                    ':producto' => $idProducto,
                ]);
            }

            $this->pdo->commit();
            return $idVenta;
        } catch (Throwable $error) {
            $this->pdo->rollBack();
            throw $error;
        }
    }

    /** Una venta con su total y sus renglones, o null si no existe. */
    public function obtener(int $idVenta): ?array
    {
        $consulta = $this->pdo->prepare(
            'SELECT id_venta, fecha, medio_pago, id_usuario, total
             FROM vw_venta_total WHERE id_venta = :id'
        );
        $consulta->execute([':id' => $idVenta]);
        $venta = $consulta->fetch();

        if ($venta === false) {
            return null;
        }

        $venta = self::normalizarVenta($venta);
        $venta['detalle'] = $this->detalle($idVenta);
        return $venta;
    }

    /** Compras del usuario, de la mas reciente a la mas antigua. */
    public function listarPorComprador(int $idComprador): array
    {
        $consulta = $this->pdo->prepare(
            'SELECT id_venta, fecha, medio_pago, id_usuario, total
             FROM vw_venta_total
             WHERE id_usuario = :comprador
             ORDER BY fecha DESC, id_venta DESC'
        );
        $consulta->execute([':comprador' => $idComprador]);

        return array_map(function (array $venta): array {
            $venta = self::normalizarVenta($venta);
            $venta['detalle'] = $this->detalle($venta['id_venta']);
            return $venta;
        }, $consulta->fetchAll());
    }

    /** Renglones de la venta con el titulo del producto y su subtotal. */
    private function detalle(int $idVenta): array
    {
        $consulta = $this->pdo->prepare(
            'SELECT d.id_producto, p.titulo, d.cantidad, d.precio_unitario
             FROM detalla d
             JOIN productos p ON p.id_producto = d.id_producto
             WHERE d.id_venta = :venta
             ORDER BY d.id_producto'
        );
        $consulta->execute([':venta' => $idVenta]);

        return array_map(function (array $fila): array {
            $fila['id_producto']     = (int) $fila['id_producto'];
            $fila['cantidad']        = (int) $fila['cantidad'];
            $fila['precio_unitario'] = (float) $fila['precio_unitario'];
            $fila['subtotal']        = $fila['cantidad'] * $fila['precio_unitario'];
            return $fila;
        }, $consulta->fetchAll());
    }

    private static function normalizarVenta(array $fila): array
    {
        $fila['id_venta']   = (int) $fila['id_venta'];
        $fila['id_usuario'] = (int) $fila['id_usuario'];
        $fila['total']      = (float) $fila['total'];
        return $fila;
    }
}
