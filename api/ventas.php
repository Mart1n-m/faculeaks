<?php
/**
 * api/ventas.php  -  ENDPOINT PRIVADO
 *
 * Controlador de los casos de uso Comprar material y Ver mis compras.
 * El SQL vive en VentaModel y ProductoModel.
 *
 *   GET  ventas.php   mis compras con total y detalle (200, 401)
 *   POST ventas.php   registra una compra (201, 400, 401, 404)
 *
 * Cuerpo JSON de POST:
 *   { "medio_pago": "mercado_pago" | "transferencia" | "efectivo",
 *     "items": [ { "id_producto": 1, "cantidad": 2 }, ... ] }
 *
 * El comprador es siempre el usuario de la sesion y los precios se leen de
 * la base: el cliente no puede comprar a nombre de otro ni fijar el precio.
 */

declare(strict_types=1);
require __DIR__ . '/utilidades.php';
require_once __DIR__ . '/../models/VentaModel.php';
require_once __DIR__ . '/../models/ProductoModel.php';

const MAX_CANTIDAD_POR_PRODUCTO = 99;

ejecutarEndpoint(function (): void {
    $usuario = exigirUsuarioActivo(exigirSesion());
    $ventas  = new VentaModel();

    switch (metodoActual()) {
        case 'GET':
            responderJson(200, $ventas->listarPorComprador($usuario['id_usuario']));

        case 'POST':
            $datos     = leerJson();
            $medioPago = campoTexto($datos, 'medio_pago');
            $items     = itemsDeLaCompra($datos['items'] ?? null);

            if (!in_array($medioPago, VentaModel::MEDIOS_PAGO, true)) {
                responderJson(400, ['error' => 'El medio de pago debe ser: ' . implode(', ', VentaModel::MEDIOS_PAGO) . '.']);
            }

            $productos = new ProductoModel();
            foreach (array_keys($items) as $idProducto) {
                $producto = $productos->obtener($idProducto);
                if ($producto === null) {
                    responderJson(404, ['error' => "El producto $idProducto no existe."]);
                }
                if ($producto['id_usuario'] === $usuario['id_usuario']) {
                    responderJson(400, ['error' => 'No podes comprar un producto que vos mismo publicaste.']);
                }
            }

            $idVenta = $ventas->crear($usuario['id_usuario'], $medioPago, $items);

            responderJson(201, $ventas->obtener($idVenta));

        default:
            responderMetodoNoPermitido(['GET', 'POST']);
    }
});

/**
 * Valida la lista de items y la devuelve como [id_producto => cantidad],
 * sumando las cantidades si un producto aparece repetido. 400 si es invalida.
 */
function itemsDeLaCompra(mixed $items): array
{
    if (!is_array($items) || $items === [] || !array_is_list($items)) {
        responderJson(400, ['error' => 'La compra debe incluir al menos un producto (items).']);
    }

    $resultado = [];
    foreach ($items as $item) {
        $idProducto = is_array($item) ? campoEntero($item, 'id_producto') : false;
        $cantidad   = is_array($item) ? campoEntero($item, 'cantidad') : false;

        if (!is_int($idProducto) || !is_int($cantidad)) {
            responderJson(400, ['error' => 'Cada item necesita id_producto y cantidad (enteros positivos).']);
        }

        $resultado[$idProducto] = ($resultado[$idProducto] ?? 0) + $cantidad;

        if ($resultado[$idProducto] > MAX_CANTIDAD_POR_PRODUCTO) {
            responderJson(400, ['error' => 'La cantidad maxima por producto es ' . MAX_CANTIDAD_POR_PRODUCTO . '.']);
        }
    }

    return $resultado;
}
