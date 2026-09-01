/**
 * pages/materia.js - Ficha de materia: programas y foro de la materia.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.materia = (function () {
  'use strict';

  var materiaActual = null;
  var dictadaEn = [];
  var filtros = { categoria: '', orden: 'recientes', pagina: 1 };
  var POR_PAGINA = 8;

  function noEncontrada() {
    FL.dom.renderizar(FL.dom.uno('#contenido-materia'), FL.dom.vacio(
      'Materia no encontrada',
      'El identificador solicitado no corresponde a ninguna materia del catálogo.',
      FL.dom.crear('a', { clase: 'fl-boton', href: 'carreras.html', texto: 'Explorar carreras' }),
      'h1'
    ));
  }

  function pintarCabecera() {
    document.title = materiaActual.nombre + ' · FacuLeaks';
    FL.dom.uno('#nombre-materia').textContent = materiaActual.nombre;
    FL.dom.uno('#codigo-materia').textContent = materiaActual.codigo;
    FL.dom.uno('#descripcion-materia').textContent = materiaActual.descripcion || '';

    var principal = dictadaEn.length ? dictadaEn[0].carrera : null;
    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: 'Carreras', href: 'carreras.html' },
      principal
        ? { texto: principal.nombre, href: FL.dom.urlCon('carrera.html', { id: principal.idCarrera }) }
        : { texto: 'Materias' },
      { texto: materiaActual.nombre }
    ]);
  }

  /**
   * Una materia puede dictarse en varias carreras, y con distinto año o
   * régimen en cada una: eso es lo que resuelve la relación N:M SE_DICTA_EN.
   */
  function pintarCarreras() {
    var host = FL.dom.uno('#carreras-materia');
    if (!dictadaEn.length) {
      FL.dom.renderizar(host, FL.dom.crear('p', {
        clase: 'fl-tenue fl-mb0',
        texto: 'Esta materia todavía no está asociada a ninguna carrera.'
      }));
      return;
    }

    FL.dom.renderizar(host, FL.dom.crear('ul', { clase: 'fl-lista-materias' },
      dictadaEn.map(function (v) {
        return FL.dom.crear('li', null, FL.dom.crear('a', {
          clase: 'fl-materia-item',
          href: FL.dom.urlCon('carrera.html', { id: v.carrera.idCarrera })
        }, [
          FL.dom.crear('span', { clase: 'fl-materia-item__nombre', texto: v.carrera.nombre }),
          FL.dom.crear('span', { clase: 'fl-badge fl-badge--contorno',
                                 texto: FL.formato.anioCursada(v.anioCursada) }),
          FL.dom.crear('span', { clase: 'fl-badge fl-badge--neutro',
                                 texto: FL.formato.cuatrimestre(v.cuatrimestre) }),
          v.obligatoria ? null : FL.dom.crear('span', { clase: 'fl-badge fl-badge--acento', texto: 'Optativa' })
        ]));
      })));
  }

  function pintarProgramas() {
    var host = FL.dom.uno('#lista-programas');
    FL.dom.renderizar(host, FL.dom.esqueletos(2, 2));

    return FL.carrerasService.getProgramasByMateria(materiaActual.idMateria)
      .then(function (programas) {
        if (!programas.length) {
          FL.dom.renderizar(host, FL.dom.vacio(
            'Sin programas disponibles',
            'Todavía no se cargaron programas para esta materia.'
          ));
          return;
        }

        FL.dom.renderizar(host, FL.dom.crear('ul', { clase: 'fl-lista-programas' },
          programas.map(function (programa) {
            return FL.dom.crear('li', null, FL.dom.crear('div', { clase: 'fl-programa' }, [
              FL.dom.crear('span', { clase: 'fl-adjunto__tipo', 'aria-hidden': 'true', texto: 'PDF' }),
              FL.dom.crear('div', { clase: 'fl-programa__datos' }, [
                FL.dom.crear('p', { clase: 'fl-programa__titulo fl-mb0', texto: programa.titulo }),
                FL.dom.crear('p', { clase: 'fl-tenue fl-mb0',
                  texto: 'Ciclo ' + programa.anioAcademico + ' · ' + programa.version +
                         (programa.docenteReferencia ? ' · ' + programa.docenteReferencia : '') })
              ]),
              FL.dom.crear('span', {
                clase: 'fl-badge ' + (programa.vigente ? 'fl-badge--exito' : 'fl-badge--neutro'),
                texto: programa.vigente ? 'Vigente' : 'Histórico'
              }),
              botonDescarga(programa)
            ]));
          })));
      });
  }

  /**
   * La descarga es simulada: en TP1 no hay archivos reales en el servidor.
   * En TP3 este botón apuntará a la ruta almacenada en programas.archivo_url.
   */
  function botonDescarga(programa) {
    var boton = FL.dom.crear('button', {
      clase: 'fl-boton fl-boton--secundario fl-boton--sm',
      type: 'button',
      texto: 'Descargar'
    });
    boton.addEventListener('click', function () {
      FL.avisos.info('Descarga simulada de "' + programa.titulo + '". ' +
        'El archivo real se servirá desde el backend.');
    });
    return boton;
  }

  function pintarPublicaciones() {
    var host = FL.dom.uno('#publicaciones-materia');
    FL.dom.renderizar(host, FL.dom.esqueletos(4, 2));

    return FL.publicacionesService.getPublicaciones({
      materiaId: materiaActual.idMateria,
      categoria: filtros.categoria || null,
      orden: filtros.orden,
      limite: POR_PAGINA,
      pagina: filtros.pagina
    }).then(function (resultado) {
      FL.tarjetaPublicacion.renderizarLista(host, resultado.items, {
        tituloVacio: 'Sin publicaciones',
        mensajeVacio: 'Todavía no hay publicaciones en esta materia con los filtros elegidos.',
        accionVacio: FL.dom.crear('a', {
          clase: 'fl-boton',
          href: FL.dom.urlCon('crear-publicacion.html', { materia: materiaActual.idMateria }),
          texto: 'Crear la primera publicación'
        })
      });

      FL.paginacion.montar(FL.dom.uno('#paginacion-materia'), resultado, function (destino) {
        filtros.pagina = destino;
        pintarPublicaciones();
        host.scrollIntoView({ block: 'start' });
      });

      var contador = FL.dom.uno('#contador-publicaciones');
      if (contador) {
        contador.textContent = FL.formato.pluralizar(resultado.total, 'publicación', 'publicaciones');
      }
    });
  }

  function conectarFiltros() {
    return FL.publicacionesService.getCategorias().then(function (categorias) {
      var host = FL.dom.uno('#filtros-categoria');
      var chips = [{ valor: '', nombre: 'Todas' }].concat(categorias);

      FL.dom.renderizar(host, chips.map(function (categoria) {
        var chip = FL.dom.crear('button', {
          type: 'button',
          clase: 'fl-chip',
          'aria-pressed': String(categoria.valor === filtros.categoria),
          dataset: { categoria: categoria.valor },
          texto: categoria.nombre
        });
        chip.addEventListener('click', function () {
          filtros.categoria = categoria.valor;
          filtros.pagina = 1;
          FL.dom.todos('#filtros-categoria .fl-chip').forEach(function (otro) {
            otro.setAttribute('aria-pressed', String(otro.dataset.categoria === categoria.valor));
          });
          pintarPublicaciones();
        });
        return chip;
      }));

      var orden = FL.dom.uno('#orden-publicaciones');
      if (orden) {
        orden.addEventListener('change', function () {
          filtros.orden = orden.value;
          filtros.pagina = 1;
          pintarPublicaciones();
        });
      }
    });
  }

  function pintarAcciones() {
    FL.dom.renderizar(FL.dom.uno('#acciones-materia'), [
      FL.dom.crear('a', {
        clase: 'fl-boton fl-boton--bloque',
        href: FL.dom.urlCon('crear-publicacion.html', { materia: materiaActual.idMateria }),
        texto: 'Publicar en esta materia'
      })
    ]);
  }

  function init() {
    var id = Number(FL.dom.parametros().id);
    if (!id) {
      noEncontrada();
      return Promise.resolve();
    }

    return FL.carrerasService.getMateriaById(id).then(function (materia) {
      if (!materia) {
        noEncontrada();
        return null;
      }
      materiaActual = materia;

      return FL.carrerasService.getCarrerasDeMateria(id).then(function (lista) {
        dictadaEn = lista;
        pintarCabecera();
        pintarCarreras();
        pintarAcciones();
        return Promise.all([pintarProgramas(), conectarFiltros().then(pintarPublicaciones)]);
      });
    });
  }

  return { init: init };
})();
