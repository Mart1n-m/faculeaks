<?php
/**
 * GET api/productos.php  -  endpoint publico
 *
 * Catalogo del Marketplace: productos ⋈ usuarios ⋈ materias.
 * LEFT JOIN con materias porque productos.id_materia admite NULL.
 * Reemplaza a los antiguos data/productos.json, usuarios.json y materias.json
 * que el frontend combinaba en JavaScript.
 *
 * Respuesta: 200 OK con un arreglo de productos.
 */

declare(strict_types=1);
require __DIR__ . '/conexion.php';

ejecutarEndpoint(function (): void {
    exigirMetodo('GET');

    $filas = obtenerConexion()->query(
        'SELECT p.id_producto, p.titulo, p.precio, p.tipo_material,
                p.id_usuario, u.alias_usuario AS alias_vendedor,
                p.id_materia, m.nombre AS nombre_materia
         FROM productos p
         JOIN usuarios u      ON u.id_usuario = p.id_usuario
         LEFT JOIN materias m ON m.id_materia = p.id_materia
         ORDER BY p.id_producto'
    )->fetchAll();

    // DECIMAL llega de PDO como texto: se convierte a numero para el cliente.
    $productos = array_map(function (array $fila): array {
        $fila['id_producto'] = (int) $fila['id_producto'];
        $fila['id_usuario']  = (int) $fila['id_usuario'];
        $fila['id_materia']  = $fila['id_materia'] === null ? null : (int) $fila['id_materia'];
        $fila['precio']      = (float) $fila['precio'];
        return $fila;
    }, $filas);

    responderJson(200, $productos);
});
