/**
 * components/migas.js - Ruta de navegación (breadcrumbs).
 */
window.FL = window.FL || {};

FL.migas = (function () {
  'use strict';

  /**
   * @param {Array<{texto: string, href?: string}>} pasos
   *        El último elemento se marca como página actual.
   * @param {HTMLElement} [host] - por defecto, [data-componente="migas"]
   */
  function montar(pasos, host) {
    var destino = host || FL.dom.uno('[data-componente="migas"]');
    if (!destino) return;

    destino.className = 'fl-migas';
    destino.setAttribute('aria-label', 'Ruta de navegación');

    var lista = FL.dom.crear('ol', null, pasos.map(function (paso, indice) {
      var ultimo = indice === pasos.length - 1;
      var contenido = (paso.href && !ultimo)
        ? FL.dom.crear('a', { href: paso.href, texto: paso.texto })
        : FL.dom.crear('span', { texto: paso.texto, 'aria-current': ultimo ? 'page' : null });
      return FL.dom.crear('li', null, contenido);
    }));

    FL.dom.renderizar(destino, FL.dom.crear('nav', { 'aria-label': 'Ruta de navegación' }, lista));
  }

  return { montar: montar };
})();
