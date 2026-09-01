/**
 * services/publicacionesService.js - Publicaciones.
 *
 * Una publicación es la unión de dos filas del modelo: la del supertipo
 * CONTENIDO (autor, cuerpo, estado, fecha) y la del subtipo PUBLICACIÓN
 * (título, categoría, carrera, materia, adjunto). `decorar()` hace ese JOIN,
 * que es exactamente lo que resuelve la vista SQL `v_publicaciones_detalle`.
 *
 * La categoría es un atributo de dominio cerrado, no una entidad: el catálogo
 * de valores admitidos viaja en el dataset solo para poder mostrar el nombre
 * y la descripción de cada uno.
 *
 * Interfaz pública (estable para TP2):
 *   getCategorias()
 *   getPublicaciones(filtros)      filtros: { carreraId, materiaId, categoria,
 *                                             usuarioId, texto, orden, limite, pagina }
 *   getPublicacionById(id)
 *   createPublicacion(datos)
 *   updatePublicacion(id, cambios)
 *   deletePublicacion(id)
 *   registrarVisita(id)
 */
window.FL = window.FL || {};

FL.publicacionesService = (function () {
  'use strict';

  var repo = function () { return FL.repositorio; };

  function indexar(lista, campo) {
    var mapa = {};
    lista.forEach(function (item) { mapa[item[campo]] = item; });
    return mapa;
  }

  /** Puntaje y cantidad de comentarios por publicación. */
  function agregados() {
    var puntajes = {};
    repo().obtenerSync('votos').forEach(function (v) {
      puntajes[v.contenidoId] = (puntajes[v.contenidoId] || 0) + Number(v.valor);
    });

    var estados = {};
    repo().obtenerSync('contenidos').forEach(function (c) {
      estados[c.idContenido] = c.estado;
    });

    var comentarios = {};
    repo().obtenerSync('comentarios').forEach(function (c) {
      if (estados[c.idContenido] !== 'publicado') return;
      comentarios[c.publicacionId] = (comentarios[c.publicacionId] || 0) + 1;
    });

    return { puntajes: puntajes, comentarios: comentarios, estados: estados };
  }

  function construirContexto() {
    return {
      contenidos: indexar(repo().obtenerSync('contenidos'), 'idContenido'),
      usuarios: indexar(repo().obtenerSync('usuarios'), 'idUsuario'),
      roles: indexar(repo().obtenerSync('roles'), 'idRol'),
      carreras: indexar(repo().obtenerSync('carreras'), 'idCarrera'),
      materias: indexar(repo().obtenerSync('materias'), 'idMateria'),
      categorias: indexar(repo().obtenerSync('categorias'), 'valor'),
      agregados: agregados()
    };
  }

  /**
   * Une la fila de PUBLICACIÓN con la de CONTENIDO y resuelve autor, categoría,
   * carrera, materia, puntaje, comentarios y adjunto.
   */
  function decorar(publicacion, contexto) {
    var ctx = contexto || construirContexto();
    var contenido = ctx.contenidos[publicacion.idContenido];
    if (!contenido) return null;

    var autor = ctx.usuarios[contenido.usuarioId];
    var categoria = ctx.categorias[publicacion.categoria] || null;

    return Object.assign({}, publicacion, {
      // Campos heredados del supertipo CONTENIDO.
      usuarioId: contenido.usuarioId,
      contenido: contenido.cuerpo,
      estado: contenido.estado,
      fechaCreacion: contenido.fechaCreacion,
      // Alias: la interfaz y las URLs siguen hablando de "publicación".
      idPublicacion: publicacion.idContenido,
      autor: autor ? {
        idUsuario: autor.idUsuario,
        username: autor.username,
        nombreCompleto: autor.nombre + ' ' + autor.apellido,
        avatarUrl: autor.avatarUrl,
        rol: ctx.roles[autor.rolId] ? ctx.roles[autor.rolId].nombre : 'usuario'
      } : null,
      categoria: categoria,
      carrera: ctx.carreras[publicacion.carreraId] || null,
      materia: publicacion.materiaId ? ctx.materias[publicacion.materiaId] || null : null,
      puntaje: ctx.agregados.puntajes[publicacion.idContenido] || 0,
      totalComentarios: ctx.agregados.comentarios[publicacion.idContenido] || 0,
      // El adjunto es opcional y como máximo uno: se expone como lista para
      // que la interfaz no tenga que distinguir el caso vacío.
      adjuntos: publicacion.archivoNombre ? [{
        nombreArchivo: publicacion.archivoNombre,
        rutaArchivo: publicacion.archivoUrl,
        tipoArchivo: publicacion.archivoTipo,
        tamanoKb: publicacion.archivoTamanoKb
      }] : []
    });
  }

  var ORDENES = {
    recientes: function (a, b) {
      return String(b.fechaCreacion).localeCompare(String(a.fechaCreacion));
    },
    antiguas: function (a, b) {
      return String(a.fechaCreacion).localeCompare(String(b.fechaCreacion));
    },
    populares: function (a, b) {
      if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
      return b.totalComentarios - a.totalComentarios;
    },
    comentadas: function (a, b) { return b.totalComentarios - a.totalComentarios; },
    vistas: function (a, b) { return b.visitas - a.visitas; }
  };

  /** Catálogo de categorías: dominio del atributo, no una entidad. */
  function getCategorias() {
    return repo().obtener('categorias');
  }

  /**
   * Listado filtrado, ordenado y opcionalmente paginado.
   * @returns {Promise<{items: Array, total: number, pagina: number, paginas: number}>}
   */
  function getPublicaciones(filtros) {
    var f = filtros || {};
    return repo().obtener('publicaciones').then(function (lista) {
      var ctx = construirContexto();
      var items = lista
        .map(function (p) { return decorar(p, ctx); })
        .filter(function (p) {
          if (!p) return false;
          return f.incluirOcultas ? true : p.estado === 'publicado';
        });

      if (f.carreraId) {
        items = items.filter(function (p) { return p.carreraId === Number(f.carreraId); });
      }
      if (f.materiaId) {
        items = items.filter(function (p) { return p.materiaId === Number(f.materiaId); });
      }
      if (f.categoria) {
        items = items.filter(function (p) { return p.categoria && p.categoria.valor === f.categoria; });
      }
      if (f.usuarioId) {
        items = items.filter(function (p) { return p.usuarioId === Number(f.usuarioId); });
      }
      if (f.ids) {
        items = items.filter(function (p) { return f.ids.indexOf(p.idPublicacion) !== -1; });
      }
      if (f.texto) {
        var t = FL.formato.normalizar(f.texto);
        items = items.filter(function (p) {
          return FL.formato.normalizar(p.titulo).indexOf(t) !== -1 ||
                 FL.formato.normalizar(p.contenido).indexOf(t) !== -1 ||
                 (p.materia && FL.formato.normalizar(p.materia.nombre).indexOf(t) !== -1) ||
                 (p.carrera && FL.formato.normalizar(p.carrera.nombre).indexOf(t) !== -1);
        });
      }

      var comparador = ORDENES[f.orden] || ORDENES.recientes;
      items.sort(function (a, b) {
        if (f.respetarFijadas !== false && a.fijada !== b.fijada) return a.fijada ? -1 : 1;
        return comparador(a, b);
      });

      var total = items.length;
      var porPagina = Number(f.limite) || 0;
      var pagina = Number(f.pagina) || 1;
      var paginas = porPagina ? Math.max(1, Math.ceil(total / porPagina)) : 1;
      if (porPagina) {
        pagina = Math.min(Math.max(1, pagina), paginas);
        items = items.slice((pagina - 1) * porPagina, pagina * porPagina);
      }

      return { items: items, total: total, pagina: pagina, paginas: paginas };
    });
  }

  function getPublicacionById(id) {
    return repo().obtener('publicaciones').then(function (lista) {
      var publicacion = lista.find(function (p) { return p.idContenido === Number(id); });
      return publicacion ? decorar(publicacion) : null;
    });
  }

  /**
   * Alta de publicación. Se insertan dos filas, como en la base: primero el
   * supertipo CONTENIDO y después el subtipo PUBLICACIÓN con la misma clave.
   */
  function createPublicacion(datos) {
    var usuario = FL.sesionService.usuarioActual();
    if (!usuario.idUsuario) {
      return Promise.reject(new Error('Necesitás iniciar sesión para publicar.'));
    }
    if (!datos.categoria) {
      return Promise.reject(new Error('Elegí una categoría para la publicación.'));
    }
    if (!datos.carreraId) {
      return Promise.reject(new Error('Elegí la carrera a la que corresponde la publicación.'));
    }
    if (String(datos.titulo || '').trim().length < 5) {
      return Promise.reject(new Error('El título debe tener al menos 5 caracteres.'));
    }

    var ahora = repo().ahora();

    return repo().insertar('contenidos', {
      usuarioId: usuario.idUsuario,
      tipo: 'publicacion',
      cuerpo: String(datos.contenido || '').trim(),
      estado: 'publicado',
      fechaCreacion: ahora
    }).then(function (contenido) {
      var adjunto = datos.adjunto || null;
      return repo().insertar('publicaciones', {
        idContenido: contenido.idContenido,
        carreraId: Number(datos.carreraId),
        materiaId: datos.materiaId ? Number(datos.materiaId) : null,
        titulo: String(datos.titulo).trim(),
        categoria: datos.categoria,
        fijada: false,
        visitas: 0,
        fechaActualizacion: ahora,
        archivoNombre: adjunto ? adjunto.nombreArchivo : null,
        archivoUrl: adjunto ? 'assets/archivos/adjuntos/' + adjunto.nombreArchivo : null,
        archivoTipo: adjunto ? adjunto.tipoArchivo : null,
        archivoTamanoKb: adjunto ? Number(adjunto.tamanoKb) || 0 : null
      });
    }).then(function (publicacion) {
      return decorar(publicacion);
    });
  }

  /** Los cambios se reparten entre el supertipo y el subtipo. */
  function updatePublicacion(id, cambios) {
    var enPublicacion = {};
    ['titulo', 'categoria', 'carreraId', 'materiaId', 'fijada'].forEach(function (campo) {
      if (Object.prototype.hasOwnProperty.call(cambios, campo)) {
        enPublicacion[campo] = cambios[campo];
      }
    });
    enPublicacion.fechaActualizacion = repo().ahora();

    var previo = Object.prototype.hasOwnProperty.call(cambios, 'contenido') ||
                 Object.prototype.hasOwnProperty.call(cambios, 'estado')
      ? repo().actualizar('contenidos', id, {
          cuerpo: cambios.contenido,
          estado: cambios.estado
        })
      : Promise.resolve(null);

    return previo
      .then(function () { return repo().actualizar('publicaciones', id, enPublicacion); })
      .then(function (p) { return decorar(p); });
  }

  /**
   * Baja lógica: el estado vive en CONTENIDO, así que se marca allí y sirve
   * igual para publicaciones y comentarios.
   */
  function deletePublicacion(id) {
    return repo().actualizar('contenidos', id, { estado: 'eliminado' })
      .then(function () { return true; });
  }

  /** Incrementa el contador de visitas en memoria. */
  function registrarVisita(id) {
    var publicacion = repo().obtenerSync('publicaciones').find(function (p) {
      return p.idContenido === Number(id);
    });
    if (publicacion) publicacion.visitas += 1;
    return Promise.resolve(publicacion ? publicacion.visitas : 0);
  }

  return {
    getCategorias: getCategorias,
    getPublicaciones: getPublicaciones,
    getPublicacionById: getPublicacionById,
    createPublicacion: createPublicacion,
    updatePublicacion: updatePublicacion,
    deletePublicacion: deletePublicacion,
    registrarVisita: registrarVisita,
    ORDENES: Object.keys(ORDENES)
  };
})();
