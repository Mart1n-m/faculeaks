/**
 * pages/carreras.js - Listado de carreras con búsqueda y ordenamiento.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.carreras = (function () {
  'use strict';

  var estado = { texto: '', orden: 'nombre', duracion: '' };
  var todas = [];

  function ordenar(lista) {
    var copia = lista.slice();
    if (estado.orden === 'publicaciones') {
      copia.sort(function (a, b) { return b.resumen.publicaciones - a.resumen.publicaciones; });
    } else if (estado.orden === 'materias') {
      copia.sort(function (a, b) { return b.resumen.materias - a.resumen.materias; });
    } else if (estado.orden === 'duracion') {
      copia.sort(function (a, b) { return a.duracionAnios - b.duracionAnios; });
    } else {
      copia.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });
    }
    return copia;
  }

  function filtrar() {
    var texto = FL.formato.normalizar(estado.texto);
    return todas.filter(function (carrera) {
      if (estado.duracion === 'corta' && carrera.duracionAnios > 3) return false;
      if (estado.duracion === 'larga' && carrera.duracionAnios <= 3) return false;
      if (!texto) return true;
      return FL.formato.normalizar(carrera.nombre).indexOf(texto) !== -1 ||
             FL.formato.normalizar(carrera.descripcion || '').indexOf(texto) !== -1;
    });
  }

  function pintar() {
    var lista = ordenar(filtrar());
    FL.tarjetaCarrera.renderizarLista(FL.dom.uno('#lista-carreras'), lista);
    var contador = FL.dom.uno('#contador-carreras');
    if (contador) {
      contador.textContent = FL.formato.pluralizar(lista.length, 'carrera') +
        (estado.texto || estado.duracion ? ' que coinciden con el filtro' : ' disponibles');
    }
  }

  function conectarControles() {
    var buscador = FL.dom.uno('#buscar-carrera');
    if (buscador) {
      buscador.addEventListener('input', FL.dom.retardar(function () {
        estado.texto = buscador.value;
        pintar();
      }, 200));
    }

    var orden = FL.dom.uno('#orden-carreras');
    if (orden) {
      orden.addEventListener('change', function () {
        estado.orden = orden.value;
        pintar();
      });
    }

    FL.dom.todos('[data-duracion]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var valor = chip.dataset.duracion;
        estado.duracion = estado.duracion === valor ? '' : valor;
        FL.dom.todos('[data-duracion]').forEach(function (otro) {
          otro.setAttribute('aria-pressed', String(otro.dataset.duracion === estado.duracion));
        });
        pintar();
      });
    });

    var formulario = FL.dom.uno('#form-carreras');
    if (formulario) formulario.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  function init() {
    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: 'Carreras' }
    ]);

    var host = FL.dom.uno('#lista-carreras');
    FL.dom.renderizar(host, FL.dom.esqueletos(6, 2));
    conectarControles();

    return FL.carrerasService.getCarreras({ soloActivas: true }).then(function (carreras) {
      todas = carreras;
      pintar();
    });
  }

  return { init: init };
})();
