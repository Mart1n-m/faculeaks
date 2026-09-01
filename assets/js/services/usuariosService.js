/**
 * services/usuariosService.js - Usuarios, carreras que estudian y métricas.
 *
 * La antigua entidad `perfiles_academicos` no era una entidad: es la relación
 * N:M ESTUDIA entre USUARIO y CARRERA, con año de ingreso y sede como
 * atributos propios. `getPerfilAcademico` la consulta con ese nombre para no
 * romper el contrato que usan las páginas.
 *
 * Interfaz pública (estable para TP2):
 *   getUsuarios(filtros)
 *   getUsuarioById(id)
 *   getUsuarioByUsername(username)
 *   getPerfilAcademico(idUsuario)
 *   getEstadisticasUsuario(idUsuario)
 *   updateUsuario(id, cambios)
 *   cambiarEstado(id, estado)
 *   cambiarRol(id, idRol)
 *   getRoles()
 */
window.FL = window.FL || {};

FL.usuariosService = (function () {
  'use strict';

  var repo = function () { return FL.repositorio; };

  function decorar(usuario) {
    return FL.sesionService.proyectar(usuario);
  }

  function getRoles() {
    return repo().obtener('roles');
  }

  /**
   * @param {Object} [filtros] { texto, rolId, estado }
   */
  function getUsuarios(filtros) {
    var f = filtros || {};
    return repo().obtener('usuarios').then(function (lista) {
      var salida = lista.map(decorar);
      if (f.rolId) {
        salida = salida.filter(function (u) { return u.rolId === Number(f.rolId); });
      }
      if (f.estado) {
        salida = salida.filter(function (u) { return u.estado === f.estado; });
      }
      if (f.texto) {
        var t = FL.formato.normalizar(f.texto);
        salida = salida.filter(function (u) {
          return FL.formato.normalizar(u.username).indexOf(t) !== -1 ||
                 FL.formato.normalizar(u.nombreCompleto).indexOf(t) !== -1 ||
                 FL.formato.normalizar(u.email).indexOf(t) !== -1;
        });
      }
      return salida.sort(function (a, b) {
        return a.username.localeCompare(b.username, 'es');
      });
    });
  }

  function getUsuarioById(id) {
    return repo().obtener('usuarios').then(function (lista) {
      var usuario = lista.find(function (u) { return u.idUsuario === Number(id); });
      return usuario ? decorar(usuario) : null;
    });
  }

  function getUsuarioByUsername(username) {
    var buscado = String(username || '').toLowerCase();
    return repo().obtener('usuarios').then(function (lista) {
      var usuario = lista.find(function (u) { return u.username.toLowerCase() === buscado; });
      return usuario ? decorar(usuario) : null;
    });
  }

  /**
   * Carreras que estudia un usuario (relación ESTUDIA), con la carrera
   * resuelta. Un usuario puede estar inscripto en más de una.
   */
  function getPerfilAcademico(idUsuario) {
    return repo().obtener('estudia').then(function (lista) {
      var carreras = repo().obtenerSync('carreras');
      return lista
        .filter(function (e) { return e.usuarioId === Number(idUsuario); })
        .map(function (e) {
          return Object.assign({}, e, {
            carrera: carreras.find(function (c) { return c.idCarrera === e.carreraId; }) || null
          });
        })
        .sort(function (a, b) { return a.anioIngreso - b.anioIngreso; });
    });
  }

  /** Métricas de actividad que se muestran en el perfil. */
  function getEstadisticasUsuario(idUsuario) {
    var id = Number(idUsuario);
    var contenidos = repo().obtenerSync('contenidos').filter(function (c) {
      return c.usuarioId === id && c.estado === 'publicado';
    });

    var publicaciones = contenidos.filter(function (c) { return c.tipo === 'publicacion'; });
    var comentarios = contenidos.filter(function (c) { return c.tipo === 'comentario'; });
    var idsPublicacion = publicaciones.map(function (c) { return c.idContenido; });

    var puntaje = repo().obtenerSync('votos').reduce(function (suma, v) {
      return idsPublicacion.indexOf(v.contenidoId) !== -1 ? suma + Number(v.valor) : suma;
    }, 0);

    var favoritosLocales = FL.sesionService.usuarioActual().idUsuario === id
      ? FL.almacenamiento.leer('favoritos', null)
      : null;

    return Promise.resolve({
      publicaciones: publicaciones.length,
      comentarios: comentarios.length,
      puntaje: puntaje,
      favoritos: Array.isArray(favoritosLocales)
        ? favoritosLocales.length
        : repo().obtenerSync('favoritos').filter(function (f) {
            return f.usuarioId === id;
          }).length
    });
  }

  function updateUsuario(id, cambios) {
    var permitidos = ['nombre', 'apellido', 'biografia', 'avatarUrl', 'email'];
    var limpio = {};
    permitidos.forEach(function (campo) {
      if (Object.prototype.hasOwnProperty.call(cambios, campo)) limpio[campo] = cambios[campo];
    });
    return repo().actualizar('usuarios', id, limpio).then(decorar);
  }

  /** Suspensión o reactivación de cuentas (acción de administrador). */
  function cambiarEstado(id, estado) {
    if (!FL.sesionService.puede('administrar')) {
      return Promise.reject(new Error('No tenés permisos de administración.'));
    }
    if (['activo', 'suspendido', 'eliminado'].indexOf(estado) === -1) {
      return Promise.reject(new Error('Estado de usuario inválido.'));
    }
    return repo().actualizar('usuarios', id, { estado: estado }).then(decorar);
  }

  function cambiarRol(id, idRol) {
    if (!FL.sesionService.puede('administrar')) {
      return Promise.reject(new Error('No tenés permisos de administración.'));
    }
    var existe = repo().obtenerSync('roles').some(function (r) {
      return r.idRol === Number(idRol);
    });
    if (!existe) return Promise.reject(new Error('Rol inexistente.'));
    return repo().actualizar('usuarios', id, { rolId: Number(idRol) }).then(decorar);
  }

  return {
    getRoles: getRoles,
    getUsuarios: getUsuarios,
    getUsuarioById: getUsuarioById,
    getUsuarioByUsername: getUsuarioByUsername,
    getPerfilAcademico: getPerfilAcademico,
    getEstadisticasUsuario: getEstadisticasUsuario,
    updateUsuario: updateUsuario,
    cambiarEstado: cambiarEstado,
    cambiarRol: cambiarRol
  };
})();
