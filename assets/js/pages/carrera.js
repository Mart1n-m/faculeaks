/**
 * pages/carrera.js - Ficha de carrera y malla curricular.
 *
 * La malla se arma directamente sobre la relación SE_DICTA_EN, que ya lleva el
 * año y el cuatrimestre de cursada de cada materia dentro de esta carrera.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.carrera = (function () {
  'use strict';

  var carreraActual = null;

  function mostrarNoEncontrada() {
    FL.dom.renderizar(FL.dom.uno('#contenido-carrera'), FL.dom.vacio(
      'Carrera no encontrada',
      'El identificador solicitado no corresponde a ninguna carrera del catálogo.',
      FL.dom.crear('a', { clase: 'fl-boton', href: 'carreras.html', texto: 'Ver todas las carreras' }),
      'h1'
    ));
  }

  function pintarCabecera() {
    FL.dom.uno('#nombre-carrera').textContent = carreraActual.nombre;
    document.title = carreraActual.nombre + ' · FacuLeaks';
    FL.dom.uno('#descripcion-carrera').textContent = carreraActual.descripcion || '';

    var resumen = carreraActual.resumen;
    FL.dom.renderizar(FL.dom.uno('#datos-carrera'), [
      FL.dom.crear('span', { clase: 'fl-badge', texto: carreraActual.duracionAnios + ' años de duración' }),
      FL.dom.crear('span', { clase: 'fl-badge fl-badge--neutro',
                             texto: FL.formato.pluralizar(resumen.materias, 'materia') }),
      FL.dom.crear('span', { clase: 'fl-badge fl-badge--acento',
                             texto: FL.formato.pluralizar(resumen.publicaciones, 'publicación', 'publicaciones') })
    ]);

    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: 'Carreras', href: 'carreras.html' },
      { texto: carreraActual.nombre }
    ]);
  }

  function pintarMalla() {
    var host = FL.dom.uno('#malla-curricular');
    FL.dom.renderizar(host, FL.dom.esqueletos(3, 4));

    return FL.carrerasService.getMateriasByCarrera(carreraActual.idCarrera)
      .then(function (materias) {
        FL.tarjetaCarrera.renderizarMallaCurricular(host, materias);
        var contador = FL.dom.uno('#contador-materias');
        if (contador) {
          contador.textContent = FL.formato.pluralizar(materias.length, 'materia');
        }
      });
  }

  function pintarPublicaciones() {
    var host = FL.dom.uno('#publicaciones-carrera');
    FL.dom.renderizar(host, FL.dom.esqueletos(3, 2));

    return FL.publicacionesService.getPublicaciones({
      carreraId: carreraActual.idCarrera,
      orden: 'recientes',
      limite: 6
    }).then(function (resultado) {
      FL.tarjetaPublicacion.renderizarLista(host, resultado.items, {
        tituloVacio: 'Sin publicaciones en esta carrera',
        mensajeVacio: 'Todavía nadie publicó algo asociado a esta carrera.',
        accionVacio: FL.dom.crear('a', {
          clase: 'fl-boton',
          href: FL.dom.urlCon('crear-publicacion.html', { carrera: carreraActual.idCarrera }),
          texto: 'Crear la primera publicación'
        })
      });
    });
  }

  function pintarAcciones() {
    var host = FL.dom.uno('#acciones-carrera');
    if (!host) return;
    FL.dom.renderizar(host, [
      FL.dom.crear('a', {
        clase: 'fl-boton fl-boton--bloque',
        href: FL.dom.urlCon('crear-publicacion.html', { carrera: carreraActual.idCarrera }),
        texto: 'Publicar en esta carrera'
      }),
      FL.dom.crear('a', {
        clase: 'fl-boton fl-boton--secundario fl-boton--bloque',
        href: FL.dom.urlCon('buscar.html', { carrera: carreraActual.idCarrera }),
        texto: 'Ver todas las publicaciones'
      })
    ]);
  }

  function init() {
    var id = Number(FL.dom.parametros().id);
    if (!id) {
      mostrarNoEncontrada();
      return Promise.resolve();
    }

    return FL.carrerasService.getCarreraById(id).then(function (carrera) {
      if (!carrera) {
        mostrarNoEncontrada();
        return null;
      }
      carreraActual = carrera;
      pintarCabecera();
      pintarAcciones();
      return Promise.all([pintarMalla(), pintarPublicaciones()]);
    });
  }

  return { init: init };
})();
