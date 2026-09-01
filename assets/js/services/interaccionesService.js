/**
 * services/interaccionesService.js - Votos, favoritos y reportes.
 *
 * Las tres son relaciones N:M cuya clave primaria es el par de participantes,
 * de modo que la regla «una sola vez por par» está garantizada por el propio
 * modelo, sin restricciones adicionales.
 *
 * VOTA y REPORTA apuntan al supertipo CONTENIDO: **un único mecanismo sirve
 * para publicaciones y comentarios**. Esa es la razón de ser de la
 * generalización, y por eso no hay dos tablas de votos ni el CHECK de
 * exclusión (XOR) que exigía el modelo anterior en los reportes.
 *
 * Interfaz pública (estable para TP2):
 *   voteContenido(idContenido, valor)
 *   votePublicacion(id, valor) / voteComentario(id, valor)   [envoltorios]
 *   getVotoUsuario(idContenido)
 *   toggleFavorito(idPublicacion)
 *   esFavorito(idPublicacion)
 *   getFavoritos(idUsuario)
 *   createReporte(datos)
 *   getReportes(filtros)
 *   resolverReporte(idUsuario, idContenido, estado)
 */
window.FL = window.FL || {};

FL.interaccionesService = (function () {
  'use strict';

  var repo = function () { return FL.repositorio; };
  var sesion = function () { return FL.sesionService; };

  function exigirSesion() {
    if (!sesion().autenticado()) {
      return new Error('Iniciá sesión para realizar esta acción.');
    }
    return null;
  }

  /** Mapa { idContenido: -1 | 0 | 1 } del usuario en sesión. */
  function mapaVotos() {
    return FL.almacenamiento.leer('votos', {});
  }

  /**
   * Registra o alterna un voto sobre cualquier contenido.
   * Repetir el mismo valor anula el voto (equivale a borrar la fila).
   * @param {number} idContenido
   * @param {-1|1} valor
   * @returns {Promise<{valor: number, puntaje: number}>}
   */
  function voteContenido(idContenido, valor) {
    var error = exigirSesion();
    if (error) return Promise.reject(error);
    if (valor !== 1 && valor !== -1) {
      return Promise.reject(new Error('Valor de voto inválido: solo se admite 1 o -1.'));
    }

    var id = Number(idContenido);
    var usuarioId = sesion().usuarioActual().idUsuario;

    var mapa = mapaVotos();
    var previo = mapa[id] || 0;
    var nuevo = previo === valor ? 0 : valor;
    mapa[id] = nuevo;
    FL.almacenamiento.escribir('votos', mapa);

    // Se refleja de inmediato en la colección en memoria.
    var votos = repo().obtenerSync('votos');
    var existente = votos.find(function (v) {
      return v.usuarioId === usuarioId && v.contenidoId === id;
    });

    if (nuevo === 0) {
      if (existente) votos.splice(votos.indexOf(existente), 1);
    } else if (existente) {
      existente.valor = nuevo;
    } else {
      votos.push({
        usuarioId: usuarioId,
        contenidoId: id,
        valor: nuevo,
        fechaVoto: repo().ahora()
      });
    }

    var puntaje = votos.reduce(function (suma, v) {
      return v.contenidoId === id ? suma + Number(v.valor) : suma;
    }, 0);

    return Promise.resolve({ valor: nuevo, puntaje: puntaje });
  }

  // Envoltorios: la interfaz pública de TP1 se mantiene aunque por dentro
  // publicaciones y comentarios usen el mismo camino.
  function votePublicacion(id, valor) { return voteContenido(id, valor); }
  function voteComentario(id, valor) { return voteContenido(id, valor); }

  /** Voto actual del usuario en sesión sobre un contenido (0 si no votó). */
  function getVotoUsuario(idContenido) {
    if (!sesion().autenticado()) return 0;
    return mapaVotos()[Number(idContenido)] || 0;
  }

  function listaFavoritos() {
    var guardados = FL.almacenamiento.leer('favoritos', null);
    if (Array.isArray(guardados)) return guardados.map(Number);

    // Primera vez en la sesión: se toma lo que el seed asigna al usuario.
    var idUsuario = sesion().usuarioActual().idUsuario;
    var iniciales = repo().obtenerSync('favoritos')
      .filter(function (f) { return f.usuarioId === idUsuario; })
      .map(function (f) { return Number(f.publicacionId); });
    FL.almacenamiento.escribir('favoritos', iniciales);
    return iniciales;
  }

  /**
   * Guarda o quita una publicación de favoritos.
   * @returns {Promise<boolean>} true si quedó guardada
   */
  function toggleFavorito(idPublicacion) {
    var error = exigirSesion();
    if (error) return Promise.reject(error);

    var id = Number(idPublicacion);
    var lista = listaFavoritos();
    var indice = lista.indexOf(id);
    if (indice >= 0) lista.splice(indice, 1);
    else lista.push(id);

    FL.almacenamiento.escribir('favoritos', lista);
    repo().reiniciar();
    return Promise.resolve(indice < 0);
  }

  function esFavorito(idPublicacion) {
    if (!sesion().autenticado()) return false;
    return listaFavoritos().indexOf(Number(idPublicacion)) !== -1;
  }

  /** Publicaciones guardadas por un usuario. */
  function getFavoritos(idUsuario) {
    var actual = sesion().usuarioActual();
    var id = Number(idUsuario || actual.idUsuario);
    var ids = (id === actual.idUsuario)
      ? listaFavoritos()
      : repo().obtenerSync('favoritos')
          .filter(function (f) { return f.usuarioId === id; })
          .map(function (f) { return Number(f.publicacionId); });

    if (!ids.length) return Promise.resolve({ items: [], total: 0, pagina: 1, paginas: 1 });
    return FL.publicacionesService.getPublicaciones({ ids: ids, respetarFijadas: false });
  }

  /**
   * Alta de reporte sobre cualquier contenido.
   * @param {Object} datos { contenidoId, motivo, descripcion? }
   */
  function createReporte(datos) {
    var error = exigirSesion();
    if (error) return Promise.reject(error);

    var contenidoId = Number(datos.contenidoId);
    if (!contenidoId) {
      return Promise.reject(new Error('Falta indicar el contenido reportado.'));
    }
    if (!datos.motivo) {
      return Promise.reject(new Error('Seleccioná un motivo para el reporte.'));
    }

    var usuarioId = sesion().usuarioActual().idUsuario;
    var yaReportado = repo().obtenerSync('reportes').some(function (r) {
      return r.usuarioId === usuarioId && r.contenidoId === contenidoId;
    });
    if (yaReportado) {
      return Promise.reject(new Error('Ya reportaste este contenido.'));
    }

    return repo().insertar('reportes', {
      usuarioId: usuarioId,
      contenidoId: contenidoId,
      motivo: datos.motivo,
      descripcion: String(datos.descripcion || '').trim() || null,
      estado: 'pendiente',
      fechaReporte: repo().ahora()
    });
  }

  /** Reportes con el contenido reportado resuelto, para la moderación. */
  function getReportes(filtros) {
    var f = filtros || {};
    return repo().obtener('reportes').then(function (lista) {
      var usuarios = repo().obtenerSync('usuarios');
      var contenidos = repo().obtenerSync('contenidos');
      var publicaciones = repo().obtenerSync('publicaciones');
      var comentarios = repo().obtenerSync('comentarios');

      return lista
        .filter(function (r) { return !f.estado || r.estado === f.estado; })
        .map(function (r) {
          var autor = usuarios.find(function (u) { return u.idUsuario === r.usuarioId; });
          var contenido = contenidos.find(function (c) { return c.idContenido === r.contenidoId; });
          var objetivo = null;
          var tipo = contenido ? contenido.tipo : 'desconocido';

          if (contenido && contenido.tipo === 'publicacion') {
            var pub = publicaciones.find(function (p) { return p.idContenido === r.contenidoId; });
            if (pub) {
              objetivo = {
                id: r.contenidoId,
                publicacionId: r.contenidoId,
                titulo: pub.titulo,
                extracto: FL.formato.truncar(contenido.cuerpo, 140),
                estado: contenido.estado
              };
            }
          } else if (contenido) {
            var com = comentarios.find(function (c) { return c.idContenido === r.contenidoId; });
            if (com) {
              objetivo = {
                id: r.contenidoId,
                publicacionId: com.publicacionId,
                titulo: 'Comentario en publicación #' + com.publicacionId,
                extracto: FL.formato.truncar(contenido.cuerpo, 140),
                estado: contenido.estado
              };
            }
          }

          return Object.assign({}, r, {
            tipo: tipo,
            reportadoPor: autor ? autor.username : 'desconocido',
            objetivo: objetivo
          });
        })
        .sort(function (a, b) {
          return String(b.fechaReporte).localeCompare(String(a.fechaReporte));
        });
    });
  }

  /**
   * Cambia el estado de un reporte. Al no haber clave subrogada, el reporte se
   * identifica por el par (usuario que reportó, contenido reportado).
   */
  function resolverReporte(idUsuario, idContenido, estado) {
    if (!sesion().puede('moderar')) {
      return Promise.reject(new Error('No tenés permisos de moderación.'));
    }
    var validos = ['pendiente', 'en_revision', 'resuelto', 'rechazado'];
    if (validos.indexOf(estado) === -1) {
      return Promise.reject(new Error('Estado de reporte inválido.'));
    }
    return repo().actualizar('reportes',
      { usuarioId: Number(idUsuario), contenidoId: Number(idContenido) },
      { estado: estado });
  }

  return {
    voteContenido: voteContenido,
    votePublicacion: votePublicacion,
    voteComentario: voteComentario,
    getVotoUsuario: getVotoUsuario,
    toggleFavorito: toggleFavorito,
    esFavorito: esFavorito,
    getFavoritos: getFavoritos,
    createReporte: createReporte,
    getReportes: getReportes,
    resolverReporte: resolverReporte
  };
})();
