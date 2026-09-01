/**
 * components/modal.js - Diálogo modal accesible.
 *
 * Implementa: rol dialog, foco atrapado dentro del diálogo, cierre con Escape
 * y con clic en el fondo, y devolución del foco al elemento que lo abrió.
 */
window.FL = window.FL || {};

FL.modal = (function () {
  'use strict';

  var SELECTOR_FOCO = 'a[href], button:not([disabled]), input:not([disabled]),' +
                      ' select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var abierto = null;
  var contador = 0;

  /**
   * @param {Object} opciones
   * @param {string} opciones.titulo
   * @param {Node|Array} opciones.cuerpo
   * @param {Array<{texto:string, clase?:string, onClick?:Function, cerrar?:boolean}>} [opciones.acciones]
   * @returns {{elemento: HTMLElement, cerrar: Function}}
   */
  function abrir(opciones) {
    if (abierto) abierto.cerrar();

    var origen = document.activeElement;
    var id = 'fl-modal-' + (++contador);
    var caja = FL.dom.crear('div', {
      clase: 'fl-modal__caja',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': id + '-titulo'
    });

    var botonCerrar = FL.dom.crear('button', {
      clase: 'fl-boton-icono',
      type: 'button',
      'aria-label': 'Cerrar',
      texto: '×'
    });

    caja.appendChild(FL.dom.crear('div', { clase: 'fl-modal__cabecera' }, [
      FL.dom.crear('h2', { id: id + '-titulo', texto: opciones.titulo }),
      botonCerrar
    ]));

    var cuerpo = FL.dom.crear('div', { clase: 'fl-modal__cuerpo' });
    FL.dom.agregar(cuerpo, opciones.cuerpo);
    caja.appendChild(cuerpo);

    var fondo = FL.dom.crear('div', { clase: 'fl-modal', id: id }, caja);

    function cerrar() {
      document.removeEventListener('keydown', alPresionar, true);
      if (fondo.parentNode) fondo.parentNode.removeChild(fondo);
      abierto = null;
      if (origen && typeof origen.focus === 'function') origen.focus();
    }

    if (opciones.acciones && opciones.acciones.length) {
      var pie = FL.dom.crear('div', { clase: 'fl-modal__acciones' });
      opciones.acciones.forEach(function (accion) {
        pie.appendChild(FL.dom.crear('button', {
          type: 'button',
          clase: accion.clase || 'fl-boton fl-boton--secundario',
          texto: accion.texto,
          onClick: function (e) {
            var resultado = accion.onClick ? accion.onClick(e, cerrar) : undefined;
            if (accion.cerrar !== false && resultado !== false) cerrar();
          }
        }));
      });
      caja.appendChild(pie);
    }

    botonCerrar.addEventListener('click', cerrar);
    fondo.addEventListener('mousedown', function (e) {
      if (e.target === fondo) cerrar();
    });

    function alPresionar(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        cerrar();
        return;
      }
      if (e.key !== 'Tab') return;
      var focalizables = FL.dom.todos(SELECTOR_FOCO, caja).filter(function (n) {
        return n.offsetParent !== null;
      });
      if (!focalizables.length) return;
      var primero = focalizables[0];
      var ultimo = focalizables[focalizables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener('keydown', alPresionar, true);
    document.body.appendChild(fondo);

    var inicial = FL.dom.uno(SELECTOR_FOCO, cuerpo) || botonCerrar;
    inicial.focus();

    abierto = { elemento: fondo, cerrar: cerrar };
    return abierto;
  }

  /** Confirmación simple. Devuelve una promesa que resuelve a boolean. */
  function confirmar(titulo, mensaje, textoConfirmar) {
    return new Promise(function (resolver) {
      var decidido = false;
      abrir({
        titulo: titulo,
        cuerpo: FL.dom.crear('p', { clase: 'fl-mb0', texto: mensaje }),
        acciones: [
          {
            texto: 'Cancelar',
            clase: 'fl-boton fl-boton--secundario',
            onClick: function () { decidido = true; resolver(false); }
          },
          {
            texto: textoConfirmar || 'Confirmar',
            clase: 'fl-boton fl-boton--peligro',
            onClick: function () { decidido = true; resolver(true); }
          }
        ]
      });
      // Si se cierra con Escape o con el fondo, se resuelve como cancelación.
      var observador = setInterval(function () {
        if (!abierto) {
          clearInterval(observador);
          if (!decidido) resolver(false);
        }
      }, 120);
    });
  }

  return { abrir: abrir, confirmar: confirmar };
})();
