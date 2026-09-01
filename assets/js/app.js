/**
 * app.js - Punto de entrada de FacuLeaks.
 *
 * Cada página declara en <body> qué módulo debe ejecutarse:
 *   <body data-pagina="inicio" data-nav="inicio">
 *
 * app.js monta el encabezado y el pie (comunes a todas las vistas) y delega en
 * FL.paginas[nombre].init(). Ese es el único acoplamiento entre el HTML y el
 * JavaScript: no hay handlers en línea ni lógica dentro de los documentos.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.app = (function () {
  'use strict';

  /** Muestra un error de inicialización sin dejar la pantalla en blanco. */
  function reportarFallo(error, nombrePagina) {
    if (window.console && console.error) {
      console.error('[FacuLeaks] Error al inicializar la página "' + nombrePagina + '":', error);
    }
    var principal = FL.dom.uno('main');
    if (!principal) return;
    var aviso = FL.dom.crear('div', { clase: 'fl-contenedor' },
      FL.dom.crear('div', { clase: 'fl-aviso fl-aviso--error', role: 'alert' },
        FL.dom.crear('p', {
          clase: 'fl-mb0',
          texto: 'No pudimos cargar esta sección: ' + (error && error.message ? error.message : error)
        })));
    principal.insertBefore(aviso, principal.firstChild);
  }

  function iniciar() {
    var cuerpo = document.body;
    var nombrePagina = cuerpo.dataset.pagina || '';
    var navActiva = cuerpo.dataset.nav || nombrePagina;

    try {
      FL.encabezado.montar(navActiva);
      FL.pie.montar();
    } catch (error) {
      reportarFallo(error, 'estructura común');
    }

    var modulo = FL.paginas[nombrePagina];
    if (!modulo || typeof modulo.init !== 'function') return;

    try {
      var resultado = modulo.init();
      if (resultado && typeof resultado.catch === 'function') {
        resultado.catch(function (error) { reportarFallo(error, nombrePagina); });
      }
    } catch (error) {
      reportarFallo(error, nombrePagina);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

  return { iniciar: iniciar };
})();
