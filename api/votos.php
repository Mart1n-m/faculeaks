<?php
/**
 * POST api/votos.php  -  ENDPOINT PRIVADO
 *
 * Controlador del caso de uso Votar. El SQL vive en VotoModel.
 *
 * Cuerpo JSON:
 *   { "id_contenido": 4, "valor": 1 }    1 = a favor, -1 = en contra, 0 = quitar voto
 *
 * Respuestas:
 *   200 OK           -> { id_contenido, mi_voto, puntaje }
 *   400 Bad Request  -> datos invalidos
 *   401 Unauthorized -> sin sesion
 *   404 Not Found    -> el contenido no existe
 */

declare(strict_types=1);
require __DIR__ . '/utilidades.php';
require_once __DIR__ . '/../models/VotoModel.php';

ejecutarEndpoint(function (): void {
    exigirMetodo('POST');
    $usuario = exigirUsuarioActivo(exigirSesion());
    $datos   = leerJson();

    $idContenido = campoEntero($datos, 'id_contenido');
    $valor       = $datos['valor'] ?? null;

    if (!is_int($idContenido)) {
        responderJson(400, ['error' => 'Falta el contenido a votar (id_contenido).']);
    }
    if (!in_array($valor, [1, -1, 0], true)) {
        responderJson(400, ['error' => 'El valor del voto debe ser 1, -1 o 0.']);
    }

    $votos = new VotoModel();
    if (!$votos->existeContenido($idContenido)) {
        responderJson(404, ['error' => 'El contenido no existe.']);
    }

    $votos->votar($usuario['id_usuario'], $idContenido, $valor);

    responderJson(200, [
        'id_contenido' => $idContenido,
        'mi_voto'      => $valor,
        'puntaje'      => $votos->puntaje($idContenido),
    ]);
});
