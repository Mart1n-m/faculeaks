/**
 * services/carrerasService.js - Estructura académica.
 *
 * Refleja el modelo conceptual: CARRERA y MATERIA son entidades, y la relación
 * SE_DICTA_EN (N:M) lleva los atributos de cursada (año, cuatrimestre,
 * obligatoriedad). PROGRAMA es una entidad débil identificada por su materia.
 *
 * Interfaz pública (estable para TP2):
 *   getCarreras(filtros)
 *   getCarreraById(id)
 *   getMateriasByCarrera(idCarrera)
 *   getMateriaById(idMateria)
 *   getCarrerasDeMateria(idMateria)
 *   getProgramasByMateria(idMateria)
 *   getEstadisticasCarrera(idCarrera)
 *   getResumenGlobal()
 */
window.FL = window.FL || {};

FL.carrerasService = (function () {
  'use strict';

  var repo = function () { return FL.repositorio; };
  var norm = function (t) { return FL.formato.normalizar(t); };

  function carrerasBase() { return repo().obtenerSync('carreras'); }
  function materiasBase() { return repo().obtenerSync('materias'); }
  function vinculosBase() { return repo().obtenerSync('carreraMateria'); }
  function programasBase() { return repo().obtenerSync('programas'); }
  function publicacionesBase() { return repo().obtenerSync('publicaciones'); }
  function contenidosBase() { return repo().obtenerSync('contenidos'); }

  /** Publicaciones visibles: el estado vive en el supertipo CONTENIDO. */
  function publicacionesVisibles() {
    var estados = {};
    contenidosBase().forEach(function (c) { estados[c.idContenido] = c.estado; });
    return publicacionesBase().filter(function (p) {
      return estados[p.idContenido] === 'publicado';
    });
  }

  /** Materias distintas y publicaciones de una carrera. */
  function resumirCarrera(idCarrera) {
    return {
      materias: vinculosBase().filter(function (cm) {
        return cm.carreraId === idCarrera;
      }).length,
      publicaciones: publicacionesVisibles().filter(function (p) {
        return p.carreraId === idCarrera;
      }).length
    };
  }

  function decorarCarrera(carrera) {
    return Object.assign({}, carrera, { resumen: resumirCarrera(carrera.idCarrera) });
  }

  /**
   * @param {Object} [filtros] { texto, soloActivas }
   * @returns {Promise<Array>}
   */
  function getCarreras(filtros) {
    var f = filtros || {};
    return repo().obtener('carreras').then(function (lista) {
      var salida = lista;
      if (f.soloActivas) {
        salida = salida.filter(function (c) { return c.activa; });
      }
      if (f.texto) {
        var t = norm(f.texto);
        salida = salida.filter(function (c) {
          return norm(c.nombre).indexOf(t) !== -1 || norm(c.descripcion).indexOf(t) !== -1;
        });
      }
      return salida
        .map(decorarCarrera)
        .sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });
    });
  }

  function getCarreraById(id) {
    return repo().obtener('carreras').then(function (lista) {
      var carrera = lista.find(function (c) { return c.idCarrera === Number(id); });
      return carrera ? decorarCarrera(carrera) : null;
    });
  }

  /**
   * Materias de una carrera con los atributos de la relación SE_DICTA_EN,
   * ordenadas por año y cuatrimestre: es la malla curricular.
   * @returns {Promise<Array>} { ...materia, anioCursada, cuatrimestre, obligatoria }
   */
  function getMateriasByCarrera(idCarrera) {
    return repo().obtener('carreraMateria').then(function (vinculos) {
      var materias = materiasBase();
      return vinculos
        .filter(function (cm) { return cm.carreraId === Number(idCarrera); })
        .map(function (cm) {
          var materia = materias.find(function (m) { return m.idMateria === cm.materiaId; });
          if (!materia) return null;
          return Object.assign({}, materia, {
            carreraId: cm.carreraId,
            anioCursada: cm.anioCursada,
            cuatrimestre: cm.cuatrimestre,
            obligatoria: cm.obligatoria
          });
        })
        .filter(Boolean)
        .sort(function (a, b) {
          if (a.anioCursada !== b.anioCursada) return a.anioCursada - b.anioCursada;
          if (a.cuatrimestre !== b.cuatrimestre) return a.cuatrimestre - b.cuatrimestre;
          return a.nombre.localeCompare(b.nombre, 'es');
        });
    });
  }

  function getMateriaById(idMateria) {
    return repo().obtener('materias').then(function (lista) {
      return lista.find(function (m) { return m.idMateria === Number(idMateria); }) || null;
    });
  }

  /**
   * En qué carreras se dicta una materia. Es el caso que justifica que la
   * relación CARRERA–MATERIA sea N:M: 23 de las 43 materias se comparten.
   * @returns {Promise<Array>} { carrera, anioCursada, cuatrimestre, obligatoria }
   */
  function getCarrerasDeMateria(idMateria) {
    return repo().obtener('carreraMateria').then(function (vinculos) {
      var carreras = carrerasBase();
      return vinculos
        .filter(function (cm) { return cm.materiaId === Number(idMateria); })
        .map(function (cm) {
          var carrera = carreras.find(function (c) { return c.idCarrera === cm.carreraId; });
          if (!carrera) return null;
          return {
            carrera: carrera,
            anioCursada: cm.anioCursada,
            cuatrimestre: cm.cuatrimestre,
            obligatoria: cm.obligatoria
          };
        })
        .filter(Boolean)
        .sort(function (a, b) {
          return a.carrera.nombre.localeCompare(b.carrera.nombre, 'es');
        });
    });
  }

  /**
   * Programas de una materia. Al ser entidad débil, cada uno se identifica por
   * (materia, año académico, versión); `clave` compone ese identificador para
   * que la interfaz pueda referenciarlo.
   * @returns {Promise<Array>}
   */
  function getProgramasByMateria(idMateria) {
    return repo().obtener('programas').then(function (lista) {
      var usuarios = repo().obtenerSync('usuarios');
      var materias = materiasBase();

      return lista
        .filter(function (pr) { return pr.materiaId === Number(idMateria); })
        .map(function (pr) {
          var autor = usuarios.find(function (u) { return u.idUsuario === pr.cargadoPor; });
          var materia = materias.find(function (m) { return m.idMateria === pr.materiaId; });
          return Object.assign({}, pr, {
            clave: pr.materiaId + '-' + pr.anioAcademico + '-' + pr.version,
            materia: materia || null,
            cargadoPorNombre: autor ? autor.username : 'sistema'
          });
        })
        .sort(function (a, b) {
          if (a.vigente !== b.vigente) return a.vigente ? -1 : 1;
          return b.anioAcademico - a.anioAcademico;
        });
    });
  }

  /** Todos los programas, con su materia resuelta (panel de administración). */
  function getProgramas() {
    return repo().obtener('programas').then(function (lista) {
      var materias = materiasBase();
      return lista
        .map(function (pr) {
          return Object.assign({}, pr, {
            clave: pr.materiaId + '-' + pr.anioAcademico + '-' + pr.version,
            materia: materias.find(function (m) { return m.idMateria === pr.materiaId; }) || null
          });
        })
        .sort(function (a, b) {
          var na = a.materia ? a.materia.nombre : '';
          var nb = b.materia ? b.materia.nombre : '';
          if (na !== nb) return na.localeCompare(nb, 'es');
          return b.anioAcademico - a.anioAcademico;
        });
    });
  }

  function getEstadisticasCarrera(idCarrera) {
    return Promise.resolve(resumirCarrera(Number(idCarrera)));
  }

  /** Totales globales para la portada. */
  function getResumenGlobal() {
    return repo().obtener('carreras').then(function (carreras) {
      return {
        carreras: carreras.length,
        materias: materiasBase().length,
        programas: programasBase().length,
        publicaciones: publicacionesVisibles().length
      };
    });
  }

  return {
    getCarreras: getCarreras,
    getCarreraById: getCarreraById,
    getMateriasByCarrera: getMateriasByCarrera,
    getMateriaById: getMateriaById,
    getCarrerasDeMateria: getCarrerasDeMateria,
    getProgramasByMateria: getProgramasByMateria,
    getProgramas: getProgramas,
    getEstadisticasCarrera: getEstadisticasCarrera,
    getResumenGlobal: getResumenGlobal
  };
})();
