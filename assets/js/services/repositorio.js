/**
 * services/repositorio.js - Origen de datos de la aplicación.
 *
 * Es la ÚNICA pieza que sabe de dónde salen los datos. Hoy combina:
 *   1) el dataset embebido (assets/js/data/dataset.js), espejo de /data/*.json
 *      y de database/seed.sql, y
 *   2) las altas que el usuario genera durante la sesión, guardadas en
 *      localStorage a través de FL.almacenamiento.
 *
 * Las colecciones son las 12 tablas del modelo (docs/modelo-conceptual.md).
 * Las relaciones N:M (estudia, carreraMateria, votos, favoritos, reportes) no
 * tienen clave subrogada: se identifican por el par de participantes, igual
 * que en la base de datos.
 *
 * En TP2 este archivo se reemplaza por una implementación que haga
 * fetch('/api/...'). Los servicios de dominio (carrerasService,
 * publicacionesService, etc.) no cambian, porque solo consumen `obtener`,
 * `insertar`, `actualizar` y `eliminar`.
 *
 * Todas las operaciones devuelven Promesas, igual que hará fetch: así las
 * páginas ya están escritas de forma asincrónica y no habrá que reescribirlas.
 */
window.FL = window.FL || {};

FL.repositorio = (function () {
  'use strict';

  /** Colecciones cuyas altas locales se persisten en localStorage. */
  var COLECCIONES_LOCALES = {
    usuarios: 'usuarios',
    estudia: 'estudia',
    contenidos: 'contenidos',
    publicaciones: 'publicaciones',
    comentarios: 'comentarios',
    reportes: 'reportes'
  };

  /** Colecciones con clave subrogada: campo identificador de cada una. */
  var CLAVES = {
    roles: 'idRol',
    usuarios: 'idUsuario',
    carreras: 'idCarrera',
    materias: 'idMateria',
    contenidos: 'idContenido',
    publicaciones: 'idContenido',
    comentarios: 'idContenido'
  };

  /** Latencia simulada, en ms. Permite ver los estados de carga reales. */
  var LATENCIA = 120;

  var cache = null;

  function clonar(valor) {
    return JSON.parse(JSON.stringify(valor));
  }

  function maximoId(lista, campo) {
    return lista.reduce(function (max, item) {
      return Math.max(max, Number(item[campo]) || 0);
    }, 0);
  }

  /** Construye el estado en memoria: dataset base + altas locales. */
  function inicializar() {
    if (cache) return cache;

    if (!window.FL || !FL.dataset) {
      throw new Error(
        'FacuLeaks: no se cargó assets/js/data/dataset.js antes de repositorio.js.'
      );
    }

    cache = clonar(FL.dataset);

    Object.keys(COLECCIONES_LOCALES).forEach(function (coleccion) {
      var locales = FL.almacenamiento.leer(COLECCIONES_LOCALES[coleccion], []);
      if (Array.isArray(locales) && locales.length) {
        cache[coleccion] = cache[coleccion].concat(locales);
      }
    });

    // Los votos y favoritos del usuario son estado por usuario y no altas de
    // contenido: se guardan aparte y se fusionan sobre las colecciones.
    var sesion = FL.almacenamiento.leer('sesion', null);
    if (sesion && sesion.idUsuario) {
      fusionarVotos(sesion.idUsuario);
      fusionarFavoritos(sesion.idUsuario);
    }

    return cache;
  }

  /**
   * Aplica el mapa { idContenido: -1 | 0 | 1 } guardado en localStorage sobre
   * la colección `votos`. Una sola relación cubre publicaciones y comentarios.
   */
  function fusionarVotos(idUsuario) {
    var mapa = FL.almacenamiento.leer('votos', {});

    Object.keys(mapa).forEach(function (clave) {
      var idContenido = Number(clave);
      var valor = mapa[clave];
      var existente = cache.votos.find(function (v) {
        return v.usuarioId === idUsuario && v.contenidoId === idContenido;
      });

      if (valor === 0) {
        if (existente) cache.votos.splice(cache.votos.indexOf(existente), 1);
      } else if (existente) {
        existente.valor = valor;
      } else {
        cache.votos.push({
          usuarioId: idUsuario,
          contenidoId: idContenido,
          valor: valor,
          fechaVoto: ahora()
        });
      }
    });
  }

  function fusionarFavoritos(idUsuario) {
    var guardados = FL.almacenamiento.leer('favoritos', null);
    if (!Array.isArray(guardados)) return;

    // El listado local es la verdad para el usuario en sesión.
    cache.favoritos = cache.favoritos.filter(function (f) {
      return f.usuarioId !== idUsuario;
    });
    guardados.forEach(function (idPublicacion) {
      cache.favoritos.push({
        usuarioId: idUsuario,
        publicacionId: Number(idPublicacion),
        fecha: ahora()
      });
    });
  }

  /** Fecha actual en el mismo formato que usa la base de datos. */
  function ahora() {
    var f = new Date();
    var p = function (n) { return String(n).padStart(2, '0'); };
    return f.getFullYear() + '-' + p(f.getMonth() + 1) + '-' + p(f.getDate()) +
      ' ' + p(f.getHours()) + ':' + p(f.getMinutes()) + ':' + p(f.getSeconds());
  }

  /** Envuelve un valor en una promesa con latencia simulada. */
  function responder(valor) {
    return new Promise(function (resolver) {
      setTimeout(function () { resolver(valor); }, LATENCIA);
    });
  }

  /**
   * Devuelve una colección completa (copia defensiva).
   * @param {string} coleccion
   * @returns {Promise<Array>}
   */
  function obtener(coleccion) {
    var datos = inicializar();
    if (!datos[coleccion]) {
      return Promise.reject(new Error('Colección desconocida: ' + coleccion));
    }
    return responder(clonar(datos[coleccion]));
  }

  /** Versión sincrónica para uso interno de los servicios. */
  function obtenerSync(coleccion) {
    var datos = inicializar();
    return datos[coleccion] || [];
  }

  /**
   * Siguiente identificador disponible para una colección con clave subrogada.
   * Arranca por encima del máximo del dataset base para no colisionar nunca
   * con los IDs del mock ni con los de MySQL.
   */
  function siguienteId(coleccion) {
    var campo = CLAVES[coleccion];
    var base = maximoId(FL.dataset[coleccion] || [], campo);
    return FL.almacenamiento.siguienteId(coleccion, Math.max(base, 1000));
  }

  /**
   * Inserta un registro y devuelve el registro con su clave asignada.
   * Si la colección tiene clave subrogada y el registro no la trae, se genera.
   * @returns {Promise<Object>}
   */
  function insertar(coleccion, registro) {
    var datos = inicializar();
    if (!datos[coleccion]) {
      return Promise.reject(new Error('Colección desconocida: ' + coleccion));
    }

    var nuevo = clonar(registro);
    var campo = CLAVES[coleccion];
    if (campo && !nuevo[campo]) nuevo[campo] = siguienteId(coleccion);

    datos[coleccion].push(nuevo);
    persistirLocal(coleccion, nuevo);
    return responder(clonar(nuevo));
  }

  /** Guarda en localStorage solo las altas hechas por el usuario. */
  function persistirLocal(coleccion, registro) {
    var clave = COLECCIONES_LOCALES[coleccion];
    if (!clave) return;
    var locales = FL.almacenamiento.leer(clave, []);
    locales.push(registro);
    FL.almacenamiento.escribir(clave, locales);
  }

  /**
   * Actualiza un registro existente en memoria (no se persiste en TP1).
   * `criterio` puede ser un valor de clave subrogada o un objeto con los
   * campos que identifican la fila, para las relaciones de clave compuesta.
   */
  function actualizar(coleccion, criterio, cambios) {
    var datos = inicializar();
    var item = buscar(datos[coleccion] || [], coleccion, criterio);
    if (!item) {
      return Promise.reject(new Error('Registro inexistente en ' + coleccion));
    }
    Object.assign(item, cambios);
    return responder(clonar(item));
  }

  /** Elimina un registro de la memoria de trabajo. */
  function eliminar(coleccion, criterio) {
    var datos = inicializar();
    var lista = datos[coleccion] || [];
    var item = buscar(lista, coleccion, criterio);
    if (item) lista.splice(lista.indexOf(item), 1);
    return responder(!!item);
  }

  /** Resuelve un criterio de búsqueda contra una colección. */
  function buscar(lista, coleccion, criterio) {
    if (criterio !== null && typeof criterio === 'object') {
      return lista.find(function (r) {
        return Object.keys(criterio).every(function (k) {
          return Number(r[k]) === Number(criterio[k]) || r[k] === criterio[k];
        });
      }) || null;
    }
    var campo = CLAVES[coleccion];
    if (!campo) return null;
    return lista.find(function (r) {
      return Number(r[campo]) === Number(criterio);
    }) || null;
  }

  /** Reconstruye la caché (se usa al iniciar o cerrar sesión). */
  function reiniciar() {
    cache = null;
  }

  return {
    obtener: obtener,
    obtenerSync: obtenerSync,
    insertar: insertar,
    actualizar: actualizar,
    eliminar: eliminar,
    siguienteId: siguienteId,
    reiniciar: reiniciar,
    ahora: ahora
  };
})();
