<?php
/**
 * GET api/materias.php  -  endpoint publico
 *
 * Catalogo de materias, usado para cargar el filtro del Marketplace.
 *
 * Respuesta: 200 OK con un arreglo { id_materia, nombre }.
 */

declare(strict_types=1);
require __DIR__ . '/conexion.php';

ejecutarEndpoint(function (): void {
    exigirMetodo('GET');

    $filas = obtenerConexion()
        ->query('SELECT id_materia, nombre FROM materias ORDER BY nombre')
        ->fetchAll();

    $materias = array_map(function (array $fila): array {
        $fila['id_materia'] = (int) $fila['id_materia'];
        return $fila;
    }, $filas);

    responderJson(200, $materias);
});
