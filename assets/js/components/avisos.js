/**
 * components/avisos.js - Notificaciones flotantes (toasts) accesibles.
 *
 * Se anuncian mediante una región aria-live para que los lectores de pantalla
 * informen los resultados de las acciones (votar, guardar, publicar).
 */
window.FL = window.FL || {};

FL.avisos = (function () {
  'use strict';

  var contenedor = null;

  function asegurarContenedor() {
    if (contenedor && document.body.contains(contenedor)) return contenedor;
    contenedor = FL.dom.crear('div', {
      clase: 'fl-avisos-flotantes',
      id: 'fl-avisos',
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'false'
    });
    document.body.appendChild(contenedor);
    return contenedor;
  }

  /**
   * @param {string} mensaje
   * @param {'info'|'exito'|'error'} [tipo]
   * @param {number} [duracion] ms
   */
  function mostrar(mensaje, tipo, duracion) {
    var caja = asegurarContenedor();
    var clase = 'fl-toast fl-toast--' + (tipo || 'info');
    var toast = FL.dom.crear('div', { clase: clase }, [
      FL.dom.crear('span', { texto: mensaje }),
      FL.dom.crear('button', {
        clase: 'fl-toast__cerrar',
        type: 'button',
        'aria-label': 'Cerrar notificación',
        texto: '×',
        onClick: function () { quitar(toast); }
      })
    ]);
    caja.appendChild(toast);
    setTimeout(function () { quitar(toast); }, duracion || 4000);
    return toast;
  }

  function quitar(toast) {
    if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
  }

  return {
    mostrar: mostrar,
    exito: function (m, d) { return mostrar(m, 'exito', d); },
    error: function (m, d) { return mostrar(m, 'error', d); },
    info: function (m, d) { return mostrar(m, 'info', d); }
  };
})();
