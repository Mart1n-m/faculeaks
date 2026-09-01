/**
 * services/comentariosService.js - Comentarios y respuestas anidadas.
 *
 * Igual que las publicaciones, un comentario es la unión de la fila del
 * supertipo CONTENIDO con la del subtipo COMENTARIO. La relación reflexiva
 * RESPONDE_A (comentarioPadreId) se materializa aquí como árbol.
 *
 * Interfaz pública (estable para TP2):
 *   getComentarios(idPublicacion)      -> árbol de comentarios
 *   getComentariosPlanos(filtros)
 *   createComentario(datos)
 *   deleteComentario(id)
 *   contarPorUsuario(idUsuario)
 */
window.FL = window.FL || {};

FL.comentariosService = (function () {
  'use strict';

  var repo = function () { return FL.repositorio; };

  function indexar(lista, campo) {
    var mapa = {};
    lista.forEach(function (item) { mapa[item[campo]] = item; });
    return mapa;
  }

  function puntajes() {
    var mapa = {};
    repo().obtenerSync('votos').forEach(function (v) {
      mapa[v.contenidoId] = (mapa[v.contenidoId] || 0) + Number(v.valor);
    });
    return mapa;
  }

  function contexto() {
    return {
      contenidos: indexar(repo().obtenerSync('contenidos'), 'idContenido'),
      usuarios: indexar(repo().obtenerSync('usuarios'), 'idUsuario'),
      roles: indexar(repo().obtenerSync('roles'), 'idRol'),
      votos: puntajes()
    };
  }

  /** Une COMENTARIO con su CONTENIDO y resuelve autor y puntaje. */
  function decorar(comentario, ctx) {
    var contenido = ctx.contenidos[comentario.idContenido];
    if (!contenido) return null;
    var autor = ctx.usuarios[contenido.usuarioId];

    return Object.assign({}, comentario, {
      idComentario: comentario.idContenido,
      usuarioId: contenido.usuarioId,
      contenido: contenido.cuerpo,
      estado: contenido.estado,
      fechaCreacion: contenido.fechaCreacion,
      autor: autor ? {
        idUsuario: autor.idUsuario,
        username: autor.username,
        nombreCompleto: autor.nombre + ' ' + autor.apellido,
        avatarUrl: autor.avatarUrl,
        rol: ctx.roles[autor.rolId] ? ctx.roles[autor.rolId].nombre : 'usuario'
      } : null,
      puntaje: ctx.votos[comentario.idContenido] || 0,
      respuestas: []
    });
  }

  /**
   * Árbol de comentarios de una publicación: cada comentario raíz lleva
   * anidadas sus respuestas directas.
   * @returns {Promise<Array>}
   */
  function getComentarios(idPublicacion) {
    return repo().obtener('comentarios').then(function (lista) {
      var ctx = contexto();

      var propios = lista
        .filter(function (c) { return c.publicacionId === Number(idPublicacion); })
        .map(function (c) { return decorar(c, ctx); })
        .filter(function (c) { return c && c.estado === 'publicado'; });

      var porId = indexar(propios, 'idComentario');
      var raices = [];

      propios.forEach(function (c) {
        if (c.comentarioPadreId && porId[c.comentarioPadreId]) {
          porId[c.comentarioPadreId].respuestas.push(c);
        } else {
          raices.push(c);
        }
      });

      var porFecha = function (a, b) {
        return String(a.fechaCreacion).localeCompare(String(b.fechaCreacion));
      };
      raices.sort(porFecha);
      raices.forEach(function (c) { c.respuestas.sort(porFecha); });

      return raices;
    });
  }

  /** Listado plano, útil para el perfil y la moderación. */
  function getComentariosPlanos(filtros) {
    var f = filtros || {};
    return repo().obtener('comentarios').then(function (lista) {
      var ctx = contexto();
      var publicaciones = indexar(repo().obtenerSync('publicaciones'), 'idContenido');

      return lista
        .map(function (c) { return decorar(c, ctx); })
        .filter(function (c) {
          if (!c) return false;
          if (!f.incluirOcultos && c.estado !== 'publicado') return false;
          if (f.usuarioId && c.usuarioId !== Number(f.usuarioId)) return false;
          if (f.publicacionId && c.publicacionId !== Number(f.publicacionId)) return false;
          return true;
        })
        .map(function (c) {
          c.publicacion = publicaciones[c.publicacionId] || null;
          return c;
        })
        .sort(function (a, b) {
          return String(b.fechaCreacion).localeCompare(String(a.fechaCreacion));
        });
    });
  }

  /**
   * Alta de comentario o respuesta: dos inserciones, supertipo y subtipo.
   * @param {Object} datos { publicacionId, contenido, comentarioPadreId? }
   */
  function createComentario(datos) {
    var usuario = FL.sesionService.usuarioActual();
    if (!usuario.idUsuario) {
      return Promise.reject(new Error('Necesitás iniciar sesión para comentar.'));
    }

    var texto = String(datos.contenido || '').trim();
    var error = FL.validacion.longitud(texto, FL.validacion.REGLAS.comentario, 'El comentario');
    if (error) return Promise.reject(new Error(error));

    return repo().insertar('contenidos', {
      usuarioId: usuario.idUsuario,
      tipo: 'comentario',
      cuerpo: texto,
      estado: 'publicado',
      fechaCreacion: repo().ahora()
    }).then(function (contenido) {
      return repo().insertar('comentarios', {
        idContenido: contenido.idContenido,
        publicacionId: Number(datos.publicacionId),
        comentarioPadreId: datos.comentarioPadreId ? Number(datos.comentarioPadreId) : null
      });
    });
  }

  /** Baja lógica sobre el supertipo, igual que en las publicaciones. */
  function deleteComentario(id) {
    return repo().actualizar('contenidos', id, { estado: 'eliminado' })
      .then(function () { return true; });
  }

  function contarPorUsuario(idUsuario) {
    var contenidos = repo().obtenerSync('contenidos');
    return Promise.resolve(contenidos.filter(function (c) {
      return c.tipo === 'comentario' &&
             c.usuarioId === Number(idUsuario) &&
             c.estado === 'publicado';
    }).length);
  }

  return {
    getComentarios: getComentarios,
    getComentariosPlanos: getComentariosPlanos,
    createComentario: createComentario,
    deleteComentario: deleteComentario,
    contarPorUsuario: contarPorUsuario
  };
})();
