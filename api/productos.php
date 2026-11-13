<?php
/**
 * GET api/productos.php  -  endpoint publico
 *
 * Controlador del catalogo del Marketplace. El SQL vive en ProductoModel.
 * Caso de uso: Ver catalogo del Marketplace.
 *
 * Respuesta: 200 OK con un arreglo de productos.
 */

declare(strict_types=1);
require __DIR__ . '/utilidades.php';
require_once __DIR__ . '/../models/ProductoModel.php';

ejecutarEndpoint(function (): void {
    exigirMetodo('GET');

    responderJson(200, (new ProductoModel())->listar());
});
