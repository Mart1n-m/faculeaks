<?php
/**
 * POST api/login.php
 *
 * Cuerpo JSON:
 *   { "usuario": "<alias o email>", "password": "..." }
 *
 * Respuestas:
 *   200 OK           -> sesion iniciada; devuelve el alias
 *   400 Bad Request  -> faltan datos
 *   401 Unauthorized -> credenciales incorrectas
 *   403 Forbidden    -> la cuenta esta suspendida o dada de baja
 */

declare(strict_types=1);
require __DIR__ . '/conexion.php';

ejecutarEndpoint(function (): void {
    exigirMetodo('POST');
    $datos = leerJson();

    $usuario  = campoTexto($datos, 'usuario');
    $password = isset($datos['password']) && is_string($datos['password']) ? $datos['password'] : '';

    if ($usuario === '' || $password === '') {
        responderJson(400, ['error' => 'Ingresa tu usuario y tu contrasena.']);
    }

    $pdo = obtenerConexion();
    $consulta = $pdo->prepare(
        'SELECT id_usuario, alias_usuario, contrasena_cifrada, estado
         FROM usuarios
         WHERE alias_usuario = :alias OR email = :email
         LIMIT 1'
    );
    $consulta->execute([':alias' => $usuario, ':email' => $usuario]);
    $fila = $consulta->fetch();

    // password_verify() extrae la sal y el costo del propio hash, vuelve a
    // calcularlo con la contrasena recibida y compara en tiempo constante.
    // El mensaje es el mismo si el usuario no existe o si la contrasena es
    // incorrecta: asi no se revela que cuentas existen.
    if ($fila === false || !password_verify($password, $fila['contrasena_cifrada'])) {
        responderJson(401, ['error' => 'Usuario o contrasena incorrectos.']);
    }

    if ($fila['estado'] !== 'activo') {
        responderJson(403, ['error' => 'La cuenta no esta activa.']);
    }

    // Si el costo por defecto de PHP cambio desde que se creo el hash, se
    // aprovecha que tenemos la contrasena en claro para actualizarlo.
    if (password_needs_rehash($fila['contrasena_cifrada'], PASSWORD_BCRYPT)) {
        $actualizacion = $pdo->prepare(
            'UPDATE usuarios SET contrasena_cifrada = :hash WHERE id_usuario = :id'
        );
        $actualizacion->execute([
            ':hash' => password_hash($password, PASSWORD_BCRYPT),
            ':id'   => $fila['id_usuario'],
        ]);
    }

    iniciarSesion();

    // Se genera un identificador de sesion nuevo y se descarta el anterior
    // (true). Previene la fijacion de sesion: un atacante que hubiera
    // plantado un id conocido antes del login no puede reutilizarlo.
    session_regenerate_id(true);

    $_SESSION['usuario_id'] = (int) $fila['id_usuario'];

    responderJson(200, [
        'mensaje'       => 'Sesion iniciada.',
        'alias_usuario' => $fila['alias_usuario'],
    ]);
});
