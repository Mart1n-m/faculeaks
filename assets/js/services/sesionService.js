/**
 * services/sesionService.js - Sesión simulada y permisos por rol.
 *
 * TP1: la "autenticación" solo comprueba que el usuario exista en el mock; la
 * contraseña no se verifica contra ningún hash porque no hay backend. El
 * usuario en sesión se guarda en localStorage.
 *
 * TP2: iniciarSesion() pasará a hacer POST /api/auth/login y el resto de la
 * aplicación no cambia, porque todos consultan `usuarioActual()` y `puede()`.
 */
window.FL = window.FL || {};

FL.sesionService = (function () {
  'use strict';

  /**
   * Matriz de permisos por rol. Cada rol hereda los del anterior, tal como
   * indica la generalización de actores del diagrama de casos de uso.
   */
  var PERMISOS = {
    invitado: ['ver'],
    usuario: ['ver', 'publicar', 'comentar', 'votar', 'favoritos', 'reportar', 'perfil'],
    moderador: ['ver', 'publicar', 'comentar', 'votar', 'favoritos', 'reportar', 'perfil',
                'moderar'],
    administrador: ['ver', 'publicar', 'comentar', 'votar', 'favoritos', 'reportar', 'perfil',
                    'moderar', 'administrar']
  };

  var INVITADO = {
    idUsuario: null,
    username: 'invitado',
    nombre: 'Invitado',
    apellido: '',
    rol: 'invitado',
    avatarUrl: null
  };

  var enMemoria = null;

  function buscarUsuario(predicado) {
    return FL.repositorio.obtenerSync('usuarios').find(predicado) || null;
  }

  function nombreRol(rolId) {
    var rol = FL.repositorio.obtenerSync('roles').find(function (r) {
      return r.idRol === Number(rolId);
    });
    return rol ? rol.nombre : 'usuario';
  }

  /** Proyección pública del usuario: nunca expone el hash de contraseña. */
  function proyectar(usuario) {
    if (!usuario) return null;
    return {
      idUsuario: usuario.idUsuario,
      username: usuario.username,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      nombreCompleto: usuario.nombre + ' ' + usuario.apellido,
      avatarUrl: usuario.avatarUrl,
      biografia: usuario.biografia,
      estado: usuario.estado,
      rolId: usuario.rolId,
      rol: nombreRol(usuario.rolId),
      fechaRegistro: usuario.fechaRegistro
    };
  }

  /** Usuario en sesión, o el pseudo-usuario Invitado. */
  function usuarioActual() {
    if (enMemoria) return enMemoria;
    var sesion = FL.almacenamiento.leer('sesion', null);
    if (!sesion || !sesion.idUsuario) return INVITADO;
    var usuario = buscarUsuario(function (u) { return u.idUsuario === sesion.idUsuario; });
    if (!usuario) {
      FL.almacenamiento.borrar('sesion');
      return INVITADO;
    }
    enMemoria = proyectar(usuario);
    return enMemoria;
  }

  function autenticado() {
    return usuarioActual().idUsuario !== null;
  }

  function rol() {
    return usuarioActual().rol;
  }

  /** ¿El rol actual tiene la capacidad indicada? */
  function puede(capacidad) {
    var lista = PERMISOS[rol()] || PERMISOS.invitado;
    return lista.indexOf(capacidad) !== -1;
  }

  /** ¿El usuario en sesión es el autor del recurso? */
  function esAutor(idUsuarioRecurso) {
    var actual = usuarioActual();
    return actual.idUsuario !== null && actual.idUsuario === Number(idUsuarioRecurso);
  }

  /**
   * Inicia sesión simulada.
   * @param {string} identificador - username o email
   * @param {string} clave
   * @returns {Promise<Object>} usuario proyectado
   */
  function iniciarSesion(identificador, clave) {
    var id = String(identificador || '').trim().toLowerCase();
    return new Promise(function (resolver, rechazar) {
      if (!id || !clave) {
        rechazar(new Error('Completá usuario y contraseña.'));
        return;
      }
      var usuario = buscarUsuario(function (u) {
        return u.username.toLowerCase() === id || u.email.toLowerCase() === id;
      });
      if (!usuario) {
        rechazar(new Error('No existe una cuenta con ese usuario o correo.'));
        return;
      }
      if (usuario.estado !== 'activo') {
        rechazar(new Error('La cuenta está suspendida. Contactá a un administrador.'));
        return;
      }
      FL.almacenamiento.escribir('sesion', {
        idUsuario: usuario.idUsuario,
        fecha: FL.repositorio.ahora()
      });
      enMemoria = null;
      FL.repositorio.reiniciar();
      resolver(usuarioActual());
    });
  }

  /** Cierra la sesión y descarta el estado por usuario en memoria. */
  function cerrarSesion() {
    FL.almacenamiento.borrar('sesion');
    enMemoria = null;
    FL.repositorio.reiniciar();
    return Promise.resolve(true);
  }

  /**
   * Alta de usuario simulada. Verifica unicidad de username y email igual que
   * las restricciones UNIQUE de la tabla `usuarios`.
   */
  function registrar(datos) {
    return new Promise(function (resolver, rechazar) {
      var usuarios = FL.repositorio.obtenerSync('usuarios');
      var username = String(datos.username || '').trim();
      var email = String(datos.email || '').trim().toLowerCase();

      if (usuarios.some(function (u) { return u.username.toLowerCase() === username.toLowerCase(); })) {
        rechazar(new Error('Ese nombre de usuario ya está en uso.'));
        return;
      }
      if (usuarios.some(function (u) { return u.email.toLowerCase() === email; })) {
        rechazar(new Error('Ese correo ya está registrado.'));
        return;
      }

      var nuevo = {
        rolId: 2,
        username: username,
        email: email,
        // TP1 no almacena contraseñas: el backend de TP2 hará password_hash().
        passwordHash: '(sin backend: no se almacena)',
        nombre: String(datos.nombre || '').trim(),
        apellido: String(datos.apellido || '').trim(),
        avatarUrl: null,
        biografia: null,
        estado: 'activo',
        fechaRegistro: FL.repositorio.ahora()
      };

      FL.repositorio.insertar('usuarios', nuevo)
        .then(function (creado) {
          // La carrera es opcional en el alta: si se indicó, se registra la
          // relación ESTUDIA con su año de ingreso.
          if (datos.carreraId) {
            return FL.repositorio.insertar('estudia', {
              usuarioId: creado.idUsuario,
              carreraId: Number(datos.carreraId),
              anioIngreso: Number(datos.anioIngreso) || new Date().getFullYear(),
              sede: datos.sede || null,
              activo: true
            }).then(function () { return creado; });
          }
          return creado;
        })
        .then(function (creado) {
          FL.almacenamiento.escribir('sesion', {
            idUsuario: creado.idUsuario,
            fecha: FL.repositorio.ahora()
          });
          enMemoria = null;
          resolver(usuarioActual());
        })
        .catch(rechazar);
    });
  }

  /**
   * Cambia el rol simulado sin cerrar sesión. Existe únicamente para poder
   * demostrar en TP1 las vistas de moderación y administración; en TP2 el rol
   * lo determina el servidor y este método desaparece.
   */
  function simularRol(nombreRolDestino) {
    var usuarios = FL.repositorio.obtenerSync('usuarios');
    var roles = FL.repositorio.obtenerSync('roles');
    var rolDestino = roles.find(function (r) { return r.nombre === nombreRolDestino; });
    if (!rolDestino) return Promise.reject(new Error('Rol desconocido.'));

    if (nombreRolDestino === 'invitado') return cerrarSesion();

    var candidato = usuarios.find(function (u) {
      return u.rolId === rolDestino.idRol && u.estado === 'activo';
    });
    if (!candidato) return Promise.reject(new Error('No hay usuarios de demostración con ese rol.'));

    FL.almacenamiento.escribir('sesion', {
      idUsuario: candidato.idUsuario,
      fecha: FL.repositorio.ahora()
    });
    enMemoria = null;
    FL.repositorio.reiniciar();
    return Promise.resolve(usuarioActual());
  }

  return {
    PERMISOS: PERMISOS,
    usuarioActual: usuarioActual,
    autenticado: autenticado,
    rol: rol,
    puede: puede,
    esAutor: esAutor,
    iniciarSesion: iniciarSesion,
    cerrarSesion: cerrarSesion,
    registrar: registrar,
    simularRol: simularRol,
    proyectar: proyectar
  };
})();
