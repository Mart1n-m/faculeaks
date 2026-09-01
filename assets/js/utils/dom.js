/**
 * utils/dom.js - Utilidades de manipulación del DOM.
 *
 * Todas las funciones son puras respecto del dominio: no conocen entidades de
 * FacuLeaks, solo elementos. Se exponen bajo el espacio de nombres FL.dom.
 */
window.FL = window.FL || {};

FL.dom = (function () {
  'use strict';

  /** Primer elemento que coincide con el selector. */
  function uno(selector, contexto) {
    return (contexto || document).querySelector(selector);
  }

  /** Todos los elementos que coinciden, como Array real. */
  function todos(selector, contexto) {
    return Array.prototype.slice.call((contexto || document).querySelectorAll(selector));
  }

  /**
   * Crea un elemento.
   * @param {string} etiqueta
   * @param {Object} [atributos] - clave/valor; `clase`, `texto` y `html` son especiales.
   * @param {Array|Node|string} [hijos]
   */
  function crear(etiqueta, atributos, hijos) {
    var nodo = document.createElement(etiqueta);
    var attrs = atributos || {};

    Object.keys(attrs).forEach(function (clave) {
      var valor = attrs[clave];
      if (valor === null || valor === undefined || valor === false) return;
      if (clave === 'clase') nodo.className = valor;
      else if (clave === 'texto') nodo.textContent = valor;
      else if (clave === 'html') nodo.innerHTML = valor;
      else if (clave === 'dataset') Object.assign(nodo.dataset, valor);
      else if (clave.indexOf('on') === 0 && typeof valor === 'function') {
        nodo.addEventListener(clave.slice(2).toLowerCase(), valor);
      } else if (valor === true) nodo.setAttribute(clave, '');
      else nodo.setAttribute(clave, valor);
    });

    agregar(nodo, hijos);
    return nodo;
  }

  /** Agrega hijos (nodo, texto, array o null) a un elemento. */
  function agregar(padre, hijos) {
    if (hijos === null || hijos === undefined) return padre;
    var lista = Array.isArray(hijos) ? hijos : [hijos];
    lista.forEach(function (hijo) {
      if (hijo === null || hijo === undefined || hijo === false) return;
      padre.appendChild(typeof hijo === 'string' ? document.createTextNode(hijo) : hijo);
    });
    return padre;
  }

  /** Vacía un contenedor. */
  function limpiar(nodo) {
    while (nodo && nodo.firstChild) nodo.removeChild(nodo.firstChild);
    return nodo;
  }

  /** Reemplaza el contenido de un contenedor. */
  function renderizar(nodo, contenido) {
    if (!nodo) return null;
    limpiar(nodo);
    return agregar(nodo, contenido);
  }

  /**
   * Escapa texto para inserción segura en HTML.
   * Se usa en los pocos puntos donde se compone markup como cadena.
   */
  function escapar(texto) {
    return String(texto === null || texto === undefined ? '' : texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Escucha un evento y devuelve la función para desuscribirse. */
  function escuchar(nodo, evento, manejador, opciones) {
    if (!nodo) return function () {};
    nodo.addEventListener(evento, manejador, opciones);
    return function () { nodo.removeEventListener(evento, manejador, opciones); };
  }

  /**
   * Delegación de eventos: útil para listas que se re-renderizan.
   */
  function delegar(contenedor, evento, selector, manejador) {
    return escuchar(contenedor, evento, function (e) {
      var objetivo = e.target.closest(selector);
      if (objetivo && contenedor.contains(objetivo)) manejador(e, objetivo);
    });
  }

  /** Retrasa la ejecución hasta que pasen `ms` sin nuevas llamadas. */
  function retardar(fn, ms) {
    var temporizador = null;
    return function () {
      var args = arguments;
      var contexto = this;
      clearTimeout(temporizador);
      temporizador = setTimeout(function () { fn.apply(contexto, args); }, ms || 250);
    };
  }

  /** Parámetros de la query string como objeto plano. */
  function parametros() {
    var salida = {};
    new URLSearchParams(window.location.search).forEach(function (valor, clave) {
      salida[clave] = valor;
    });
    return salida;
  }

  /** Construye una URL relativa con query string a partir de un objeto. */
  function urlCon(pagina, params) {
    var qs = new URLSearchParams();
    Object.keys(params || {}).forEach(function (clave) {
      var valor = params[clave];
      if (valor !== null && valor !== undefined && valor !== '') qs.set(clave, valor);
    });
    var cadena = qs.toString();
    return cadena ? pagina + '?' + cadena : pagina;
  }

  /** Bloques de carga simulados mientras se resuelven los servicios. */
  function esqueletos(cantidad, lineas) {
    var total = cantidad || 3;
    var filas = lineas || 3;
    var fragmento = document.createDocumentFragment();
    for (var i = 0; i < total; i++) {
      var tarjeta = crear('div', { clase: 'fl-esqueleto-tarjeta', 'aria-hidden': 'true' });
      tarjeta.appendChild(crear('div', { clase: 'fl-esqueleto fl-esqueleto--titulo' }));
      for (var j = 0; j < filas; j++) {
        tarjeta.appendChild(crear('div', {
          clase: 'fl-esqueleto fl-esqueleto--' + (j === filas - 1 ? 'corta' : 'linea')
        }));
      }
      fragmento.appendChild(tarjeta);
    }
    return fragmento;
  }

  /**
   * Estado vacío reutilizable.
   * @param {string} nivel - etiqueta del encabezado ('h3' por defecto). Se usa
   *        'h1' cuando el estado vacío reemplaza el contenido completo de la
   *        página, para que el documento conserve un único encabezado de nivel 1.
   */
  function vacio(titulo, mensaje, accion, nivel) {
    return crear('div', { clase: 'fl-vacio', role: 'status' }, [
      crear('div', { clase: 'fl-vacio__icono', 'aria-hidden': 'true', texto: '◎' }),
      crear(nivel || 'h3', { texto: titulo }),
      crear('p', { clase: 'fl-mb0', texto: mensaje }),
      accion || null
    ]);
  }

  return {
    uno: uno,
    todos: todos,
    crear: crear,
    agregar: agregar,
    limpiar: limpiar,
    renderizar: renderizar,
    escapar: escapar,
    escuchar: escuchar,
    delegar: delegar,
    retardar: retardar,
    parametros: parametros,
    urlCon: urlCon,
    esqueletos: esqueletos,
    vacio: vacio
  };
})();
