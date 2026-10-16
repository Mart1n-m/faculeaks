<?php
/**
 * POST api/registro.php
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
require __DIR__ . '/conexion.php';

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

    $pdo = obtenerConexion();

    // --- Unicidad de alias y email (uq_usuarios_alias, uq_usuarios_email)
    $consulta = $pdo->prepare(
        'SELECT 1 FROM usuarios WHERE alias_usuario = :alias OR email = :email LIMIT 1'
    );
    $consulta->execute([':alias' => $alias, ':email' => $email]);

    if ($consulta->fetchColumn() !== false) {
        responderJson(409, ['error' => 'El usuario o el e-mail ya estan registrados.']);
    }

    // --- Hash BCRYPT: la contrasena en texto plano nunca se guarda ------
    $hash = password_hash($password, PASSWORD_BCRYPT);

    // --- INSERT con sentencia preparada. El rol se resuelve por nombre:
    //     toda cuenta nueva nace como 'estudiante' (RN-01).
    $insercion = $pdo->prepare(
        'INSERT INTO usuarios (alias_usuario, email, nombre, apellido, contrasena_cifrada, id_rol)
         SELECT :alias, :email, :nombre, :apellido, :hash, id_rol
         FROM roles WHERE nombre = :rol'
    );

    try {
        $insercion->execute([
            ':alias'    => $alias,
            ':email'    => $email,
            ':nombre'   => $nombre,
            ':apellido' => $apellido,
            ':hash'     => $hash,
            ':rol'      => 'estudiante',
        ]);
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
        'id_usuario' => (int) $pdo->lastInsertId(),
    ]);
});
