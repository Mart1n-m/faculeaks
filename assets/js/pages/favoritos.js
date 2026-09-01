/**
 * pages/favoritos.js - Publicaciones guardadas por el usuario en sesión.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.favoritos = (function () {
  'use strict';

  var estado = { categoria: '', orden: 'recientes' };

  function sinSesion() {
    FL.dom.renderizar(FL.dom.uno('#contenido-favoritos'), FL.dom.vacio(
      'Necesitás iniciar sesión',
      'Los favoritos se guardan por cuenta. Iniciá sesión para verlos.',
      FL.dom.crear('a', { clase: 'fl-boton', href: 'login.html', texto: 'Iniciar sesión' }),
      'h1'
    ));
  }

  function aplicarFiltros(items) {
    var salida = items.slice();
    if (estado.categoria) {
      salida = salida.filter(function (p) {
        return p.categoria && p.categoria.valor === estado.categoria;
      });
    }
    if (estado.orden === 'populares') {
      salida.sort(function (a, b) { return b.puntaje - a.puntaje; });
    } else if (estado.orden === 'titulo') {
      salida.sort(function (a, b) { return a.titulo.localeCompare(b.titulo, 'es'); });
    } else {
      salida.sort(function (a, b) {
        return String(b.fechaCreacion).localeCompare(String(a.fechaCreacion));
      });
    }
    return salida;
  }

  function cargar() {
    var host = FL.dom.uno('#lista-favoritos');
    FL.dom.renderizar(host, FL.dom.esqueletos(3, 2));

    return FL.interaccionesService.getFavoritos().then(function (resultado) {
      var items = aplicarFiltros(resultado.items);

      FL.dom.uno('#contador-favoritos').textContent =
        FL.formato.pluralizar(items.length, 'publicación guardada', 'publicaciones guardadas');

      FL.tarjetaPublicacion.renderizarLista(host, items, {
        tituloVacio: 'Todavía no guardaste nada',
        mensajeVacio: 'Usá el botón ★ en cualquier publicación para guardarla y encontrarla acá.',
        accionVacio: FL.dom.crear('a', { clase: 'fl-boton', href: 'buscar.html',
                                         texto: 'Explorar publicaciones' })
      });
    });
  }

  function conectarControles() {
    return FL.publicacionesService.getCategorias().then(function (categorias) {
      var select = FL.dom.uno('#filtro-categoria-fav');
      categorias.forEach(function (categoria) {
        select.appendChild(FL.dom.crear('option', {
          value: categoria.valor, texto: categoria.nombre
        }));
      });
      select.addEventListener('change', function () {
        estado.categoria = select.value;
        cargar();
      });

      FL.dom.uno('#orden-favoritos').addEventListener('change', function (e) {
        estado.orden = e.target.value;
        cargar();
      });
    });
  }

  function init() {
    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: 'Favoritos' }
    ]);

    if (!FL.sesionService.autenticado()) {
      sinSesion();
      return Promise.resolve();
    }

    // Si el usuario quita un favorito desde la tarjeta, la lista se refresca.
    document.addEventListener('fl:favoritos-cambiaron', function () { cargar(); });

    return conectarControles().then(cargar);
  }

  return { init: init };
})();
