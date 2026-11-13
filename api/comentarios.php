<?php
/**
 * api/comentarios.php  -  CRUD de comentarios
 *
 * Controlador de los casos de uso Comentar y Responder. El SQL vive en
 * ComentarioModel.
 *
 *   GET    comentarios.php?id_publicacion=4   publico  comentarios de la publicacion (200, 400, 404)
 *   POST   comentarios.php                    sesion   alta (201, 400, 401, 404)
 *   PUT    comentarios.php?id=13              sesion   edicion (200, 400, 401, 403, 404)
 *   DELETE comentarios.php?id=13              sesion   baja (200, 401, 403, 404)
 *
 * Cuerpo JSON:
 *   POST { "id_publicacion": 4, "texto": "...", "id_comentario_padre": 14 (opcional) }
 *   PUT  { "texto": "..." }
 *
 * Solo el autor, o un moderador/administrador, puede editar o borrar.
 */

declare(strict_types=1);
require __DIR__ . '/utilidades.php';
require_once __DIR__ . '/../models/ComentarioModel.php';
require_once __DIR__ . '/../models/PublicacionModel.php';

ejecutarEndpoint(function (): void {
    $comentarios = new ComentarioModel();

    switch (metodoActual()) {
        case 'GET':
            $idPublicacion = exigirIdDeLaUrl('id_publicacion');
            if ((new PublicacionModel())->obtener($idPublicacion) === null) {
                responderJson(404, ['error' => 'La publicacion no existe.']);
            }

            responderJson(200, $comentarios->listarPorPublicacion($idPublicacion, usuarioDeLaSesion()));

        case 'POST':
            $usuario       = exigirUsuarioActivo(exigirSesion());
            $datos         = leerJson();
            $texto         = validarTextoComentario($datos);
            $idPublicacion = campoEntero($datos, 'id_publicacion');
            $idPadre       = campoEntero($datos, 'id_comentario_padre');

            if (!is_int($idPublicacion)) {
                responderJson(400, ['error' => 'Falta la publicacion a comentar (id_publicacion).']);
            }
            if ($idPadre === false) {
                responderJson(400, ['error' => 'id_comentario_padre debe ser un entero positivo.']);
            }

            $publicacion = (new PublicacionModel())->obtener($idPublicacion);
            if ($publicacion === null) {
                responderJson(404, ['error' => 'La publicacion no existe.']);
            }

            // Una respuesta solo puede apuntar a un comentario de la misma publicacion.
            if ($idPadre !== null) {
                $padre = $comentarios->obtener($idPadre);
                if ($padre === null || $padre['id_publicacion'] !== $idPublicacion) {
                    responderJson(400, ['error' => 'El comentario al que respondes no pertenece a esta publicacion.']);
                }
            }

            $id = $comentarios->crear(
                $usuario['id_usuario'],
                $idPublicacion,
                $publicacion['id_carrera'],
                $texto,
                $idPadre
            );

            responderJson(201, $comentarios->obtener($id, $usuario['id_usuario']));

        case 'PUT':
            $usuario = exigirUsuarioActivo(exigirSesion());
            $id      = exigirIdDeLaUrl();
            comentarioModificable($comentarios, $id, $usuario);
            $texto = validarTextoComentario(leerJson());

            $comentarios->actualizar($id, $texto);

            responderJson(200, $comentarios->obtener($id, $usuario['id_usuario']));

        case 'DELETE':
            $usuario = exigirUsuarioActivo(exigirSesion());
            $id      = exigirIdDeLaUrl();
            comentarioModificable($comentarios, $id, $usuario);

            $comentarios->eliminar($id);

            responderJson(200, ['mensaje' => 'Comentario eliminado.', 'id_comentario' => $id]);

        default:
            responderMetodoNoPermitido(['GET', 'POST', 'PUT', 'DELETE']);
    }
});

/** Texto del comentario validado en el servidor (400 si es invalido). */
function validarTextoComentario(array $datos): string
{
    $texto = campoTexto($datos, 'texto');

    if ($texto === '' || mb_strlen($texto) > 2000) {
        responderJson(400, ['error' => 'El comentario es obligatorio (hasta 2000 caracteres).']);
    }

    return $texto;
}

/** 404 si el comentario no existe; 403 si no es del usuario ni es moderador. */
function comentarioModificable(ComentarioModel $comentarios, int $id, array $usuario): array
{
    $comentario = $comentarios->obtener($id);
    if ($comentario === null) {
        responderJson(404, ['error' => 'El comentario no existe.']);
    }

    if ($comentario['id_usuario'] !== $usuario['id_usuario'] && !puedeModerar($usuario['rol'])) {
        responderJson(403, ['error' => 'Solo el autor o un moderador puede modificar este comentario.']);
    }

    return $comentario;
}
