<?php
/**
 * api/productos.php  -  CRUD de productos del Marketplace
 *
 * Controlador de los casos de uso del Marketplace. El SQL vive en
 * ProductoModel.
 *
 *   GET    productos.php          publico  catalogo completo (200)
 *   GET    productos.php?id=3     publico  un producto (200, 404)
 *   POST   productos.php          sesion   publicar producto (201, 400, 401)
 *   PUT    productos.php?id=3     sesion   editar (200, 400, 401, 403, 404)
 *   DELETE productos.php?id=3     sesion   eliminar (200, 401, 403, 404, 409)
 *
 * Cuerpo JSON de POST y PUT:
 *   { "titulo": "...", "precio": 4500, "tipo_material": "apunte", "id_materia": 5 | null }
 *
 * Solo el vendedor, o un moderador/administrador, puede editar o eliminar.
 * Un producto que ya se vendio no se elimina (409): las ventas lo referencian.
 */

declare(strict_types=1);
require __DIR__ . '/utilidades.php';
require_once __DIR__ . '/../models/ProductoModel.php';
require_once __DIR__ . '/../models/MateriaModel.php';

const PRECIO_MAXIMO = 99999999.99;

ejecutarEndpoint(function (): void {
    $productos = new ProductoModel();

    switch (metodoActual()) {
        case 'GET':
            $id = idDeLaUrl();
            if ($id === null) {
                responderJson(200, $productos->listar());
            }

            $producto = $productos->obtener($id);
            if ($producto === null) {
                responderJson(404, ['error' => 'El producto no existe.']);
            }
            responderJson(200, $producto);

        case 'POST':
            $usuario = exigirUsuarioActivo(exigirSesion());
            $datos   = validarProducto(leerJson());

            $id = $productos->crear(
                $usuario['id_usuario'],
                $datos['titulo'],
                $datos['precio'],
                $datos['tipo_material'],
                $datos['id_materia']
            );

            responderJson(201, $productos->obtener($id));

        case 'PUT':
            $usuario = exigirUsuarioActivo(exigirSesion());
            $id      = exigirIdDeLaUrl();
            productoModificable($productos, $id, $usuario);
            $datos = validarProducto(leerJson());

            $productos->actualizar($id, $datos['titulo'], $datos['precio'], $datos['tipo_material'], $datos['id_materia']);

            responderJson(200, $productos->obtener($id));

        case 'DELETE':
            $usuario = exigirUsuarioActivo(exigirSesion());
            $id      = exigirIdDeLaUrl();
            productoModificable($productos, $id, $usuario);

            if ($productos->tieneVentas($id)) {
                responderJson(409, ['error' => 'El producto ya tiene ventas registradas y no se puede eliminar.']);
            }

            $productos->eliminar($id);

            responderJson(200, ['mensaje' => 'Producto eliminado.', 'id_producto' => $id]);

        default:
            responderMetodoNoPermitido(['GET', 'POST', 'PUT', 'DELETE']);
    }
});

/** Valida el producto en el servidor; devuelve los datos limpios o responde 400. */
function validarProducto(array $datos): array
{
    $titulo    = preg_replace('/\s+/', ' ', campoTexto($datos, 'titulo'));
    $tipo      = campoTexto($datos, 'tipo_material');
    $precio    = $datos['precio'] ?? null;
    $idMateria = campoEntero($datos, 'id_materia');
    $errores   = [];

    if (mb_strlen($titulo) < 5 || mb_strlen($titulo) > 120) {
        $errores[] = 'El titulo debe tener entre 5 y 120 caracteres.';
    }
    $esNumero = is_int($precio) || is_float($precio);
    if (!$esNumero || $precio < 0 || $precio > PRECIO_MAXIMO) {
        $errores[] = 'El precio debe ser un numero entre 0 y ' . PRECIO_MAXIMO . '.';
    }
    if (!in_array($tipo, ProductoModel::TIPOS, true)) {
        $errores[] = 'El tipo de material debe ser: ' . implode(', ', ProductoModel::TIPOS) . '.';
    }
    if ($idMateria === false) {
        $errores[] = 'id_materia debe ser un entero positivo o null.';
    } elseif ($idMateria !== null && !(new MateriaModel())->existe($idMateria)) {
        $errores[] = 'La materia no existe.';
    }

    if ($errores !== []) {
        responderJson(400, ['error' => 'Datos invalidos.', 'detalles' => $errores]);
    }

    return [
        'titulo'        => $titulo,
        'precio'        => round((float) $precio, 2),
        'tipo_material' => $tipo,
        'id_materia'    => $idMateria,
    ];
}

/** 404 si el producto no existe; 403 si no es del usuario ni es moderador. */
function productoModificable(ProductoModel $productos, int $id, array $usuario): array
{
    $producto = $productos->obtener($id);
    if ($producto === null) {
        responderJson(404, ['error' => 'El producto no existe.']);
    }

    if ($producto['id_usuario'] !== $usuario['id_usuario'] && !puedeModerar($usuario['rol'])) {
        responderJson(403, ['error' => 'Solo el vendedor o un moderador puede modificar este producto.']);
    }

    return $producto;
}
