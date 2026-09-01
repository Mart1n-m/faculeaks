/**
 * components/paginacion.js - Control de paginación accesible.
 */
window.FL = window.FL || {};

FL.paginacion = (function () {
  'use strict';

  /**
   * @param {HTMLElement} contenedor
   * @param {{pagina:number, paginas:number, total:number}} estado
   * @param {Function} alCambiar - recibe el número de página destino
   */
  function montar(contenedor, estado, alCambiar) {
    if (!contenedor) return;
    FL.dom.limpiar(contenedor);
    if (estado.paginas <= 1) return;

    contenedor.className = 'fl-paginacion';
    contenedor.setAttribute('role', 'navigation');
    contenedor.setAttribute('aria-label', 'Paginación de resultados');

    function boton(texto, destino, deshabilitado, etiqueta) {
      var b = FL.dom.crear('button', {
        type: 'button',
        clase: 'fl-boton fl-boton--secundario fl-boton--sm',
        texto: texto,
        'aria-label': etiqueta || null,
        disabled: deshabilitado || null
      });
      if (!deshabilitado) b.addEventListener('click', function () { alCambiar(destino); });
      return b;
    }

    contenedor.appendChild(boton('‹ Anterior', estado.pagina - 1, estado.pagina <= 1,
      'Página anterior'));
    contenedor.appendChild(FL.dom.crear('span', {
      clase: 'fl-paginacion__info',
      'aria-live': 'polite',
      texto: 'Página ' + estado.pagina + ' de ' + estado.paginas +
             ' · ' + FL.formato.pluralizar(estado.total, 'resultado')
    }));
    contenedor.appendChild(boton('Siguiente ›', estado.pagina + 1,
      estado.pagina >= estado.paginas, 'Página siguiente'));
  }

  return { montar: montar };
})();
