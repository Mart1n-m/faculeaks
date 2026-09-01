/**
 * pages/inicio.js - Portada: métricas, buscador, carreras y publicaciones.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.inicio = (function () {
  'use strict';

  function montarMetricas(resumen) {
    var host = FL.dom.uno('#metricas');
    if (!host) return;
    var datos = [
      { valor: resumen.carreras, etiqueta: 'carreras' },
      { valor: resumen.materias, etiqueta: 'materias' },
      { valor: resumen.programas, etiqueta: 'programas' },
      { valor: resumen.publicaciones, etiqueta: 'publicaciones' }
    ];
    FL.dom.renderizar(host, datos.map(function (d) {
      return FL.dom.crear('div', { clase: 'fl-metrica' }, [
        FL.dom.crear('strong', { texto: FL.formato.numero(d.valor) }),
        FL.dom.crear('span', { texto: d.etiqueta })
      ]);
    }));
  }

  function montarBuscador() {
    var formulario = FL.dom.uno('#form-busqueda-portada');
    if (!formulario) return;
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      var texto = FL.dom.uno('#busqueda-portada').value.trim();
      window.location.href = FL.dom.urlCon('buscar.html', { q: texto });
    });
  }

  function montarCarreras() {
    var host = FL.dom.uno('#carreras-destacadas');
    if (!host) return Promise.resolve();
    FL.dom.renderizar(host, FL.dom.esqueletos(6, 2));

    return FL.carrerasService.getCarreras({ soloActivas: true }).then(function (carreras) {
      var destacadas = carreras.slice().sort(function (a, b) {
        return b.resumen.publicaciones - a.resumen.publicaciones;
      }).slice(0, 6);
      FL.tarjetaCarrera.renderizarLista(host, destacadas);
    });
  }

  function montarListado(selector, filtros, textoVacio) {
    var host = FL.dom.uno(selector);
    if (!host) return Promise.resolve();
    FL.dom.renderizar(host, FL.dom.esqueletos(3, 2));

    return FL.publicacionesService.getPublicaciones(filtros).then(function (resultado) {
      FL.tarjetaPublicacion.renderizarLista(host, resultado.items, {
        tituloVacio: 'Sin publicaciones todavía',
        mensajeVacio: textoVacio
      });
    });
  }

  function montarCategorias() {
    var host = FL.dom.uno('#categorias-portada');
    if (!host) return Promise.resolve();

    return FL.publicacionesService.getCategorias().then(function (categorias) {
      FL.dom.renderizar(host, categorias.map(function (categoria) {
        return FL.dom.crear('a', {
          clase: 'fl-badge',
          dataset: { categoria: categoria.valor },
          href: FL.dom.urlCon('buscar.html', { categoria: categoria.valor }),
          texto: categoria.nombre
        });
      }));
    });
  }

  function montarCtaSesion() {
    var host = FL.dom.uno('#cta-sesion');
    if (!host) return;
    if (FL.sesionService.autenticado()) {
      var usuario = FL.sesionService.usuarioActual();
      FL.dom.renderizar(host, [
        FL.dom.crear('h3', { clase: 'fl-tarjeta__titulo', texto: 'Hola, ' + usuario.nombre }),
        FL.dom.crear('p', {
          clase: 'fl-suave',
          texto: 'Compartí un apunte, una duda o tu experiencia de cursada con la comunidad.'
        }),
        FL.dom.crear('a', {
          clase: 'fl-boton fl-boton--bloque',
          href: 'crear-publicacion.html',
          texto: 'Crear publicación'
        })
      ]);
      return;
    }
    FL.dom.renderizar(host, [
      FL.dom.crear('h3', { clase: 'fl-tarjeta__titulo', texto: 'Sumate a FacuLeaks' }),
      FL.dom.crear('p', {
        clase: 'fl-suave',
        texto: 'Creá una cuenta para publicar, comentar, votar y guardar el material que te sirve.'
      }),
      FL.dom.crear('a', { clase: 'fl-boton fl-boton--bloque', href: 'registro.html', texto: 'Crear cuenta' }),
      FL.dom.crear('p', { clase: 'fl-centrado fl-tenue fl-mb0' }, [
        document.createTextNode('¿Ya tenés cuenta? '),
        FL.dom.crear('a', { href: 'login.html', texto: 'Iniciar sesión' })
      ])
    ]);
  }

  function init() {
    montarBuscador();
    montarCtaSesion();

    return Promise.all([
      FL.carrerasService.getResumenGlobal().then(montarMetricas),
      montarCarreras(),
      montarCategorias(),
      montarListado('#publicaciones-recientes', { orden: 'recientes', limite: 5 },
        'Cuando la comunidad publique, lo verás acá.'),
      montarListado('#publicaciones-populares',
        { orden: 'populares', limite: 5, respetarFijadas: false },
        'Todavía no hay publicaciones votadas.')
    ]);
  }

  return { init: init };
})();
