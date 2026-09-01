/**
 * pages/moderacion.js - Panel de moderación: cola de reportes.
 *
 * REPORTA es una relación N:M entre USUARIO y CONTENIDO: cada reporte se
 * identifica por el par (quién reportó, qué contenido), sin clave subrogada.
 * Publicaciones y comentarios llegan por el mismo camino porque ambos son
 * contenidos.
 *
 * Las acciones cambian el estado en memoria. En TP2 cada botón hará una
 * llamada PATCH al servidor, que validará el rol.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.moderacion = (function () {
  'use strict';

  var ETIQUETAS_ESTADO = {
    pendiente: { texto: 'Pendiente', clase: 'fl-badge--acento' },
    en_revision: { texto: 'En revisión', clase: '' },
    resuelto: { texto: 'Resuelto', clase: 'fl-badge--exito' },
    rechazado: { texto: 'Rechazado', clase: 'fl-badge--neutro' }
  };

  var ETIQUETAS_MOTIVO = {
    spam: 'Spam',
    contenido_inapropiado: 'Contenido inapropiado',
    informacion_incorrecta: 'Información incorrecta',
    material_con_derechos: 'Material con derechos',
    duplicado: 'Duplicado',
    otro: 'Otro'
  };

  var filtroEstado = '';

  function sinPermisos() {
    FL.dom.renderizar(FL.dom.uno('#contenido-moderacion'), FL.dom.vacio(
      'Acceso restringido',
      'Esta sección es para moderadores y administradores. Podés cambiar el rol simulado desde el pie de página.',
      FL.dom.crear('a', { clase: 'fl-boton', href: 'index.html', texto: 'Volver al inicio' }),
      'h1'
    ));
  }

  function pintarResumen(reportes) {
    var conteo = { pendiente: 0, en_revision: 0, resuelto: 0, rechazado: 0 };
    reportes.forEach(function (r) { conteo[r.estado] = (conteo[r.estado] || 0) + 1; });

    FL.dom.renderizar(FL.dom.uno('#resumen-moderacion'), [
      tarjetaResumen(conteo.pendiente, 'pendientes'),
      tarjetaResumen(conteo.en_revision, 'en revisión'),
      tarjetaResumen(conteo.resuelto, 'resueltos'),
      tarjetaResumen(conteo.rechazado, 'rechazados')
    ]);
  }

  function tarjetaResumen(valor, etiqueta) {
    return FL.dom.crear('div', { clase: 'fl-estadistica' }, [
      FL.dom.crear('strong', { texto: FL.formato.numero(valor) }),
      FL.dom.crear('span', { texto: etiqueta })
    ]);
  }

  function botonAccion(reporte, estado, texto, clase) {
    var boton = FL.dom.crear('button', {
      type: 'button',
      clase: 'fl-boton ' + (clase || 'fl-boton--secundario') + ' fl-boton--sm',
      texto: texto,
      disabled: reporte.estado === estado || null
    });
    boton.addEventListener('click', function () {
      FL.interaccionesService
        .resolverReporte(reporte.usuarioId, reporte.contenidoId, estado)
        .then(function () {
          FL.avisos.exito('Reporte marcado como ' +
            ETIQUETAS_ESTADO[estado].texto.toLowerCase() + '.');
          cargar();
        })
        .catch(function (error) { FL.avisos.error(error.message); });
    });
    return boton;
  }

  function filaReporte(reporte) {
    var etiqueta = ETIQUETAS_ESTADO[reporte.estado] || ETIQUETAS_ESTADO.pendiente;
    var objetivo = reporte.objetivo;

    var celdaObjetivo = FL.dom.crear('td');
    if (objetivo) {
      var enlace = FL.dom.urlCon('publicacion.html', { id: objetivo.publicacionId });
      celdaObjetivo.appendChild(FL.dom.crear('a', { href: enlace, texto: objetivo.titulo }));
      celdaObjetivo.appendChild(FL.dom.crear('p', {
        clase: 'fl-tenue fl-mb0', texto: objetivo.extracto
      }));
    } else {
      celdaObjetivo.appendChild(FL.dom.crear('span', {
        clase: 'fl-tenue', texto: 'El contenido reportado ya no existe.'
      }));
    }

    return FL.dom.crear('tr', null, [
      FL.dom.crear('td', { texto: '#' + reporte.contenidoId }),
      FL.dom.crear('td', null, FL.dom.crear('span', {
        clase: 'fl-badge fl-badge--contorno',
        texto: reporte.tipo === 'publicacion' ? 'Publicación' : 'Comentario'
      })),
      celdaObjetivo,
      FL.dom.crear('td', null, [
        FL.dom.crear('strong', { texto: ETIQUETAS_MOTIVO[reporte.motivo] || reporte.motivo }),
        FL.dom.crear('p', { clase: 'fl-tenue fl-mb0', texto: reporte.descripcion || '' })
      ]),
      FL.dom.crear('td', null, [
        FL.dom.crear('span', { texto: '@' + reporte.reportadoPor }),
        FL.dom.crear('p', { clase: 'fl-tenue fl-mb0',
                            texto: FL.formato.fechaCorta(reporte.fechaReporte) })
      ]),
      FL.dom.crear('td', null, FL.dom.crear('span', {
        clase: 'fl-badge ' + etiqueta.clase, texto: etiqueta.texto
      })),
      FL.dom.crear('td', null, FL.dom.crear('div', { clase: 'fl-tabla__acciones' }, [
        botonAccion(reporte, 'en_revision', 'Revisar'),
        botonAccion(reporte, 'resuelto', 'Resolver', 'fl-boton'),
        botonAccion(reporte, 'rechazado', 'Rechazar', 'fl-boton--peligro')
      ]))
    ]);
  }

  function cargar() {
    var cuerpo = FL.dom.uno('#tabla-reportes tbody');
    FL.dom.renderizar(cuerpo, FL.dom.crear('tr', null,
      FL.dom.crear('td', { colspan: 7, texto: 'Cargando reportes…' })));

    return FL.interaccionesService.getReportes({}).then(function (reportes) {
      pintarResumen(reportes);

      var visibles = filtroEstado
        ? reportes.filter(function (r) { return r.estado === filtroEstado; })
        : reportes;

      if (!visibles.length) {
        FL.dom.renderizar(cuerpo, FL.dom.crear('tr', null,
          FL.dom.crear('td', { colspan: 7 },
            FL.dom.vacio('Sin reportes', 'No hay reportes con ese estado.'))));
        return;
      }

      FL.dom.renderizar(cuerpo, visibles.map(filaReporte));
    });
  }

  function conectarFiltros() {
    FL.dom.todos('[data-estado]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        filtroEstado = chip.dataset.estado === filtroEstado ? '' : chip.dataset.estado;
        FL.dom.todos('[data-estado]').forEach(function (otro) {
          otro.setAttribute('aria-pressed', String(otro.dataset.estado === filtroEstado));
        });
        cargar();
      });
    });
  }

  function init() {
    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: 'Moderación' }
    ]);

    if (!FL.sesionService.puede('moderar')) {
      sinPermisos();
      return Promise.resolve();
    }

    conectarFiltros();
    return cargar();
  }

  return { init: init };
})();
