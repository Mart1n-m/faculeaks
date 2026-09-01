/**
 * components/tarjetaCarrera.js - Tarjeta de carrera y lista de materias.
 */
window.FL = window.FL || {};

FL.tarjetaCarrera = (function () {
  'use strict';

  /** Tarjeta enlazada a la ficha de la carrera. */
  function crear(carrera) {
    var resumen = carrera.resumen || { materias: 0, publicaciones: 0 };

    return FL.dom.crear('a', {
      clase: 'fl-tarjeta fl-tarjeta-enlace',
      href: FL.dom.urlCon('carrera.html', { id: carrera.idCarrera })
    }, [
      FL.dom.crear('h3', { clase: 'fl-carrera__nombre', texto: carrera.nombre }),
      FL.dom.crear('p', { clase: 'fl-carrera__desc', texto: carrera.descripcion || '' }),
      FL.dom.crear('div', { clase: 'fl-carrera__pie' }, [
        FL.dom.crear('span', { texto: carrera.duracionAnios + ' años' }),
        FL.dom.crear('span', { texto: FL.formato.pluralizar(resumen.materias, 'materia') }),
        FL.dom.crear('span', { texto: FL.formato.pluralizar(resumen.publicaciones, 'publicación', 'publicaciones') })
      ])
    ]);
  }

  /** Renderiza una grilla de carreras con estado vacío. */
  function renderizarLista(contenedor, carreras) {
    if (!contenedor) return;
    FL.dom.limpiar(contenedor);
    if (!carreras.length) {
      contenedor.appendChild(FL.dom.vacio(
        'Sin resultados',
        'No encontramos carreras que coincidan con la búsqueda.'
      ));
      return;
    }
    carreras.forEach(function (carrera) { contenedor.appendChild(crear(carrera)); });
  }

  /**
   * Materias agrupadas por año y cuatrimestre: la malla curricular.
   * @param {HTMLElement} contenedor
   * @param {Array} materias - resultado de getMateriasByCarrera
   */
  function renderizarMallaCurricular(contenedor, materias) {
    if (!contenedor) return;
    FL.dom.limpiar(contenedor);

    if (!materias.length) {
      contenedor.appendChild(FL.dom.vacio(
        'Carrera sin materias cargadas',
        'Esta carrera todavía no tiene materias asociadas en el catálogo.'
      ));
      return;
    }

    var porAnio = {};
    materias.forEach(function (materia) {
      porAnio[materia.anioCursada] = porAnio[materia.anioCursada] || [];
      porAnio[materia.anioCursada].push(materia);
    });

    Object.keys(porAnio)
      .map(Number)
      .sort(function (a, b) { return a - b; })
      .forEach(function (anio) {
        var bloque = FL.dom.crear('section', { clase: 'fl-anio-bloque' });
        bloque.appendChild(FL.dom.crear('h3', { clase: 'fl-anio-bloque__titulo' }, [
          document.createTextNode(FL.formato.anioCursada(anio)),
          FL.dom.crear('span', {
            clase: 'fl-badge fl-badge--neutro',
            texto: FL.formato.pluralizar(porAnio[anio].length, 'materia')
          })
        ]));

        var lista = FL.dom.crear('ul', { clase: 'fl-lista-materias' });
        porAnio[anio].forEach(function (materia) {
          lista.appendChild(FL.dom.crear('li', null,
            FL.dom.crear('a', {
              clase: 'fl-materia-item',
              href: FL.dom.urlCon('materia.html', { id: materia.idMateria })
            }, [
              FL.dom.crear('span', { clase: 'fl-materia-item__codigo', texto: materia.codigo }),
              FL.dom.crear('span', { clase: 'fl-materia-item__nombre', texto: materia.nombre }),
              FL.dom.crear('span', {
                clase: 'fl-badge fl-badge--neutro',
                texto: FL.formato.cuatrimestre(materia.cuatrimestre)
              }),
              materia.obligatoria
                ? null
                : FL.dom.crear('span', { clase: 'fl-badge fl-badge--acento', texto: 'Optativa' })
            ])
          ));
        });

        bloque.appendChild(lista);
        contenedor.appendChild(bloque);
      });
  }

  return {
    crear: crear,
    renderizarLista: renderizarLista,
    renderizarMallaCurricular: renderizarMallaCurricular
  };
})();
