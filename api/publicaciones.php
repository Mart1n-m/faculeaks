<?php
/**
 * api/publicaciones.php  -  CRUD de publicaciones del foro
 *
 * Controlador de los casos de uso del foro. El SQL vive en PublicacionModel.
 *
 *   GET    publicaciones.php                    publico   listado (200)
 *          ?categoria=apunte&id_materia=5&id_carrera=1&q=texto&orden=votos|recientes
 *   GET    publicaciones.php?id=4               publico   detalle con comentarios (200, 404)
 *   POST   publicaciones.php                    sesion    alta (201, 400, 401)
 *   PUT    publicaciones.php?id=4               sesion    edicion (200, 400, 401, 403, 404)
 *   DELETE publicaciones.php?id=4               sesion    baja (200, 401, 403, 404)
 *
 * Cuerpo JSON de POST y PUT:
 *   { "titulo": "...", "cuerpo": "...", "categoria": "apunte", "id_materia": 5 }
 *
 * Solo el autor puede editar o borrar su publicacion; un moderador o un
 * administrador puede hacerlo con cualquiera (control de acceso, OWASP A01).
 */

declare(strict_types=1);
require __DIR__ . '/utilidades.php';
require_once __DIR__ . '/../models/PublicacionModel.php';
require_once __DIR__ . '/../models/ComentarioModel.php';

ejecutarEndpoint(function (): void {
    $publicaciones = new PublicacionModel();

    switch (metodoActual()) {
        case 'GET':
            $idUsuario = usuarioDeLaSesion();
            $id        = idDeLaUrl();

            if ($id !== null) {
                $publicacion = $publicaciones->obtener($id, $idUsuario);
                if ($publicacion === null) {
                    responderJson(404, ['error' => 'La publicacion no existe.']);
                }
                $publicacion['comentarios'] = (new ComentarioModel())->listarPorPublicacion($id, $idUsuario);
                responderJson(200, $publicacion);
            }

            responderJson(200, $publicaciones->listar(filtrosDelListado(), $idUsuario));

        case 'POST':
            $usuario = exigirUsuarioActivo(exigirSesion());
            $datos   = validarPublicacion(leerJson(), $publicaciones, $usuario['id_usuario']);

            $id = $publicaciones->crear(
                $usuario['id_usuario'],
                $datos['id_carrera'],
                $datos['id_materia'],
                $datos['categoria'],
                $datos['titulo'],
                $datos['cuerpo']
            );

            responderJson(201, $publicaciones->obtener($id, $usuario['id_usuario']));

        case 'PUT':
            $usuario     = exigirUsuarioActivo(exigirSesion());
            $id          = exigirIdDeLaUrl();
            $publicacion = publicacionModificable($publicaciones, $id, $usuario);
            $datos       = validarPublicacion(leerJson(), $publicaciones, $publicacion['id_usuario']);

            $publicaciones->actualizar(
                $id,
                $datos['id_carrera'],
                $datos['id_materia'],
                $datos['categoria'],
                $datos['titulo'],
                $datos['cuerpo']
            );

            responderJson(200, $publicaciones->obtener($id, $usuario['id_usuario']));

        case 'DELETE':
            $usuario = exigirUsuarioActivo(exigirSesion());
            $id      = exigirIdDeLaUrl();
            publicacionModificable($publicaciones, $id, $usuario);

            $publicaciones->eliminar($id);

            responderJson(200, ['mensaje' => 'Publicacion eliminada.', 'id_publicacion' => $id]);

        default:
            responderMetodoNoPermitido(['GET', 'POST', 'PUT', 'DELETE']);
    }
});

/** Filtros del listado tomados de la query string; 400 si alguno es invalido. */
function filtrosDelListado(): array
{
    $filtros = [];

    $categoria = isset($_GET['categoria']) && is_string($_GET['categoria']) ? trim($_GET['categoria']) : '';
    if ($categoria !== '') {
        if (!in_array($categoria, PublicacionModel::CATEGORIAS, true)) {
            responderJson(400, ['error' => 'Categoria invalida.']);
        }
        $filtros['categoria'] = $categoria;
    }

    foreach (['id_materia', 'id_carrera'] as $campo) {
        $valor = idDeLaUrl($campo);
        if ($valor !== null) {
            $filtros[$campo] = $valor;
        }
    }

    $texto = isset($_GET['q']) && is_string($_GET['q']) ? trim($_GET['q']) : '';
    if ($texto !== '') {
        $filtros['q'] = mb_substr($texto, 0, 100);
    }

    $orden = $_GET['orden'] ?? 'votos';
    if (!in_array($orden, ['votos', 'recientes'], true)) {
        responderJson(400, ['error' => "El orden debe ser 'votos' o 'recientes'."]);
    }
    $filtros['orden'] = $orden;

    return $filtros;
}

/**
 * Valida el cuerpo de POST/PUT en el servidor. Devuelve los datos limpios
 * (incluida la carrera que corresponde a la materia) o responde 400.
 */
function validarPublicacion(array $datos, PublicacionModel $publicaciones, int $idAutor): array
{
    // El titulo es la primera linea de cuerpo_texto: no puede tener saltos.
    $titulo    = preg_replace('/\s+/', ' ', campoTexto($datos, 'titulo'));
    $cuerpo    = campoTexto($datos, 'cuerpo');
    $categoria = campoTexto($datos, 'categoria');
    $idMateria = campoEntero($datos, 'id_materia');
    $errores   = [];

    if (mb_strlen($titulo) < 5 || mb_strlen($titulo) > 150) {
        $errores[] = 'El titulo debe tener entre 5 y 150 caracteres.';
    }
    if ($cuerpo === '' || mb_strlen($cuerpo) > 5000) {
        $errores[] = 'El cuerpo es obligatorio (hasta 5000 caracteres).';
    }
    if (!in_array($categoria, PublicacionModel::CATEGORIAS, true)) {
        $errores[] = 'La categoria debe ser: ' . implode(', ', PublicacionModel::CATEGORIAS) . '.';
    }
    if (!is_int($idMateria)) {
        $errores[] = 'La materia es obligatoria.';
    }

    $idCarrera = null;
    if (is_int($idMateria)) {
        $idCarrera = $publicaciones->carreraParaMateria($idMateria, $idAutor);
        if ($idCarrera === null) {
            $errores[] = 'La materia no existe o no pertenece a ninguna carrera.';
        }
    }

    if ($errores !== []) {
        responderJson(400, ['error' => 'Datos invalidos.', 'detalles' => $errores]);
    }

    return [
        'titulo'     => $titulo,
        'cuerpo'     => $cuerpo,
        'categoria'  => $categoria,
        'id_materia' => $idMateria,
        'id_carrera' => $idCarrera,
    ];
}

/**
 * Devuelve la publicacion si existe (404 si no) y el usuario puede
 * modificarla: es el autor o es moderador/administrador (403 si no).
 */
function publicacionModificable(PublicacionModel $publicaciones, int $id, array $usuario): array
{
    $publicacion = $publicaciones->obtener($id);
    if ($publicacion === null) {
        responderJson(404, ['error' => 'La publicacion no existe.']);
    }

    if ($publicacion['id_usuario'] !== $usuario['id_usuario'] && !puedeModerar($usuario['rol'])) {
        responderJson(403, ['error' => 'Solo el autor o un moderador puede modificar esta publicacion.']);
    }

    return $publicacion;
}
