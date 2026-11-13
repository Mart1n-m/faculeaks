<?php
/**
 * POST api/registro.php
 *
 * Controlador del caso de uso Registrarse. El SQL vive en UsuarioModel.
 *
 * Cuerpo JSON:
 *   { "alias_usuario", "email", "nombre", "apellido", "password" }
 *
 * Respuestas:
 *   201 Created   -> cuenta creada
 *   400 Bad Req.  -> faltan datos o no tienen el formato correcto
 *   409 Conflict  -> el alias o el email ya estan registrados
 */

declare(strict_types=1);
require __DIR__ . '/utilidades.php';
require __DIR__ . '/../models/UsuarioModel.php';

ejecutarEndpoint(function (): void {
    exigirMetodo('POST');
    $datos = leerJson();

    $alias    = campoTexto($datos, 'alias_usuario');
    $email    = campoTexto($datos, 'email');
    $nombre   = campoTexto($datos, 'nombre');
    $apellido = campoTexto($datos, 'apellido');
    // La contrasena NO se recorta: los espacios forman parte de ella.
    $password = isset($datos['password']) && is_string($datos['password']) ? $datos['password'] : '';

    // --- Validacion en el servidor (RNF-02: toda validacion del cliente
    //     se repite aca, porque el cliente se puede saltear) -------------
    $errores = [];

    if (!preg_match('/^[A-Za-z0-9_]{3,30}$/', $alias)) {
        $errores[] = 'El usuario debe tener entre 3 y 30 caracteres: letras, numeros o guion bajo.';
    }
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false || mb_strlen($email) > 120) {
        $errores[] = 'El e-mail no es valido.';
    }
    if ($nombre === '' || mb_strlen($nombre) > 60) {
        $errores[] = 'El nombre es obligatorio (hasta 60 caracteres).';
    }
    if ($apellido === '' || mb_strlen($apellido) > 60) {
        $errores[] = 'El apellido es obligatorio (hasta 60 caracteres).';
    }
    // BCRYPT solo considera los primeros 72 bytes: se rechaza lo que exceda.
    if (strlen($password) < 8 || strlen($password) > 72) {
        $errores[] = 'La contrasena debe tener entre 8 y 72 caracteres.';
    }

    if ($errores !== []) {
        responderJson(400, ['error' => 'Datos invalidos.', 'detalles' => $errores]);
    }

    $usuarios = new UsuarioModel();

    // --- Unicidad de alias y email (uq_usuarios_alias, uq_usuarios_email)
    if ($usuarios->existeAliasOEmail($alias, $email)) {
        responderJson(409, ['error' => 'El usuario o el e-mail ya estan registrados.']);
    }

    // --- Hash BCRYPT: la contrasena en texto plano nunca se guarda ------
    $hash = password_hash($password, PASSWORD_BCRYPT);

    // --- INSERT con sentencia preparada (UsuarioModel::crear). Toda cuenta
    //     nueva nace con el rol 'estudiante' (RN-01).
    try {
        $idUsuario = $usuarios->crear($alias, $email, $nombre, $apellido, $hash, 'estudiante');
    } catch (PDOException $error) {
        // 23000 = violacion de restriccion: otra peticion registro el mismo
        // alias o email entre la verificacion y el INSERT.
        if ($error->getCode() === '23000') {
            responderJson(409, ['error' => 'El usuario o el e-mail ya estan registrados.']);
        }
        throw $error;
    }

    responderJson(201, [
        'mensaje'    => 'Cuenta creada. Ya podes iniciar sesion.',
        'id_usuario' => $idUsuario,
    ]);
});
