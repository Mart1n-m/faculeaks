<?php
/**
 * GET api/materias.php  -  endpoint publico
 *
 * Controlador del catalogo de materias (filtro del Marketplace).
 * El SQL vive en MateriaModel.
 *
 * Respuesta: 200 OK con un arreglo { id_materia, nombre }.
 */

declare(strict_types=1);
require __DIR__ . '/utilidades.php';
require __DIR__ . '/../models/MateriaModel.php';

ejecutarEndpoint(function (): void {
    exigirMetodo('GET');

    responderJson(200, (new MateriaModel())->listar());
});
