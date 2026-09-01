/**
 * pages/publicacion.js - Detalle de publicación, comentarios y respuestas.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.publicacion = (function () {
  'use strict';

  var MOTIVOS = [
    { valor: 'spam', texto: 'Spam o publicidad' },
    { valor: 'contenido_inapropiado', texto: 'Contenido inapropiado' },
    { valor: 'informacion_incorrecta', texto: 'Información incorrecta' },
    { valor: 'material_con_derechos', texto: 'Material protegido por derechos de autor' },
    { valor: 'duplicado', texto: 'Contenido duplicado' },
    { valor: 'otro', texto: 'Otro motivo' }
  ];

  var publicacionActual = null;

  function noEncontrada() {
    FL.dom.renderizar(FL.dom.uno('#contenido-publicacion'), FL.dom.vacio(
      'Publicación no encontrada',
      'La publicación solicitada no existe o fue eliminada.',
      FL.dom.crear('a', { clase: 'fl-boton', href: 'buscar.html', texto: 'Explorar publicaciones' }),
      'h1'
    ));
  }

  function pintarCabecera() {
    var p = publicacionActual;
    document.title = p.titulo + ' · FacuLeaks';
    FL.dom.uno('#titulo-publicacion').textContent = p.titulo;

    FL.dom.renderizar(FL.dom.uno('#meta-publicacion'), [
      p.categoria ? FL.dom.crear('span', {
        clase: 'fl-badge', dataset: { categoria: p.categoria.valor }, texto: p.categoria.nombre
      }) : null,
      p.carrera ? FL.dom.crear('a', {
        clase: 'fl-badge fl-badge--contorno',
        href: FL.dom.urlCon('carrera.html', { id: p.carrera.idCarrera }),
        texto: p.carrera.nombre
      }) : null,
      p.materia ? FL.dom.crear('a', {
        clase: 'fl-badge fl-badge--contorno',
        href: FL.dom.urlCon('materia.html', { id: p.materia.idMateria }),
        texto: p.materia.nombre
      }) : null,
      p.fijada ? FL.dom.crear('span', { clase: 'fl-badge fl-badge--acento', texto: '📌 Destacada' }) : null
    ]);

    var autor = p.autor || { username: 'usuario eliminado', nombreCompleto: 'Usuario eliminado', rol: 'usuario' };
    FL.dom.renderizar(FL.dom.uno('#autor-publicacion'), [
      FL.encabezado.avatarDe(autor, 'fl-avatar fl-avatar--md'),
      FL.dom.crear('div', null, [
        FL.dom.crear('a', {
          href: FL.dom.urlCon('perfil.html', { usuario: autor.username }),
          texto: autor.nombreCompleto
        }),
        FL.dom.crear('span', { clase: 'fl-rol', dataset: { rol: autor.rol }, texto: autor.rol }),
        FL.dom.crear('p', { clase: 'fl-tenue fl-mb0' }, [
          FL.dom.crear('time', {
            datetime: FL.formato.iso(p.fechaCreacion),
            texto: FL.formato.fechaHora(p.fechaCreacion)
          }),
          document.createTextNode(' · ' + FL.formato.numero(p.visitas) + ' visitas')
        ])
      ])
    ]);

    FL.dom.renderizar(FL.dom.uno('#cuerpo-publicacion'), FL.formato.parrafos(p.contenido));
    FL.dom.renderizar(FL.dom.uno('#votos-publicacion'), FL.tarjetaPublicacion.controlVotos(p));

    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      p.carrera ? { texto: p.carrera.nombre, href: FL.dom.urlCon('carrera.html', { id: p.carrera.idCarrera }) }
                : { texto: 'Publicaciones', href: 'buscar.html' },
      p.materia ? { texto: p.materia.nombre, href: FL.dom.urlCon('materia.html', { id: p.materia.idMateria }) } : null,
      { texto: FL.formato.truncar(p.titulo, 60) }
    ].filter(Boolean));
  }

  function pintarAdjuntos() {
    var host = FL.dom.uno('#adjuntos-publicacion');
    var seccion = FL.dom.uno('#seccion-adjuntos');
    var adjuntos = publicacionActual.adjuntos || [];

    if (!adjuntos.length) {
      if (seccion) seccion.hidden = true;
      return;
    }
    if (seccion) seccion.hidden = false;

    FL.dom.renderizar(host, adjuntos.map(function (adjunto) {
      var boton = FL.dom.crear('button', {
        clase: 'fl-boton fl-boton--secundario fl-boton--sm',
        type: 'button',
        texto: 'Descargar'
      });
      boton.addEventListener('click', function () {
        FL.avisos.info('Descarga simulada de "' + adjunto.nombreArchivo + '".');
      });

      return FL.dom.crear('li', { clase: 'fl-adjunto' }, [
        FL.dom.crear('span', { clase: 'fl-adjunto__tipo', 'aria-hidden': 'true',
                               texto: String(adjunto.tipoArchivo).toUpperCase() }),
        FL.dom.crear('div', { clase: 'fl-programa__datos' }, [
          FL.dom.crear('p', { clase: 'fl-programa__titulo fl-mb0', texto: adjunto.nombreArchivo }),
          FL.dom.crear('p', { clase: 'fl-tenue fl-mb0', texto: FL.formato.tamano(adjunto.tamanoKb) })
        ]),
        boton
      ]);
    }));
  }

  function pintarAcciones() {
    var host = FL.dom.uno('#acciones-publicacion');
    var acciones = [];

    if (FL.sesionService.autenticado()) {
      acciones.push(FL.tarjetaPublicacion.botonFavorito(publicacionActual));

      var reportar = FL.dom.crear('button', {
        clase: 'fl-boton fl-boton--secundario fl-boton--sm',
        type: 'button',
        texto: 'Reportar'
      });
      reportar.addEventListener('click', function () {
        abrirModalReporte(publicacionActual.idPublicacion, 'Reportar publicación');
      });
      acciones.push(reportar);
    } else {
      acciones.push(FL.dom.crear('a', {
        clase: 'fl-boton fl-boton--secundario fl-boton--sm',
        href: 'login.html',
        texto: 'Iniciá sesión para interactuar'
      }));
    }

    if (FL.sesionService.esAutor(publicacionActual.usuarioId) || FL.sesionService.puede('moderar')) {
      var eliminar = FL.dom.crear('button', {
        clase: 'fl-boton fl-boton--peligro fl-boton--sm',
        type: 'button',
        texto: 'Eliminar'
      });
      eliminar.addEventListener('click', function () {
        FL.modal.confirmar('Eliminar publicación',
          '¿Seguro que querés eliminar esta publicación? La acción marca el contenido como eliminado.',
          'Eliminar').then(function (confirmado) {
            if (!confirmado) return;
            FL.publicacionesService.deletePublicacion(publicacionActual.idPublicacion)
              .then(function () {
                FL.avisos.exito('Publicación eliminada.');
                window.location.href = 'index.html';
              })
              .catch(function (error) { FL.avisos.error(error.message); });
          });
      });
      acciones.push(eliminar);
    }

    FL.dom.renderizar(host, acciones);
  }

  /**
   * Modal de reporte. Publicaciones y comentarios comparten el mismo camino
   * porque REPORTA apunta al supertipo CONTENIDO: basta con el identificador.
   */
  function abrirModalReporte(idContenido, titulo) {
    var selectMotivo = FL.dom.crear('select', { clase: 'fl-select', id: 'motivo-reporte' },
      MOTIVOS.map(function (m) {
        return FL.dom.crear('option', { value: m.valor, texto: m.texto });
      }));

    var descripcion = FL.dom.crear('textarea', {
      clase: 'fl-area',
      id: 'descripcion-reporte',
      rows: 4,
      maxlength: 500,
      placeholder: 'Contanos brevemente qué problema encontraste (opcional).'
    });

    FL.modal.abrir({
      titulo: titulo,
      cuerpo: [
        FL.dom.crear('div', { clase: 'fl-campo' }, [
          FL.dom.crear('label', { for: 'motivo-reporte', texto: 'Motivo del reporte' }),
          selectMotivo
        ]),
        FL.dom.crear('div', { clase: 'fl-campo' }, [
          FL.dom.crear('label', { for: 'descripcion-reporte', texto: 'Detalle' }),
          descripcion
        ])
      ],
      acciones: [
        { texto: 'Cancelar', clase: 'fl-boton fl-boton--secundario' },
        {
          texto: 'Enviar reporte',
          clase: 'fl-boton',
          onClick: function () {
            FL.interaccionesService.createReporte({
              contenidoId: idContenido,
              motivo: selectMotivo.value,
              descripcion: descripcion.value
            })
              .then(function () {
                FL.avisos.exito('Reporte enviado. Un moderador lo va a revisar.');
              })
              .catch(function (error) { FL.avisos.error(error.message); });
          }
        }
      ]
    });
  }

  /** Construye el nodo de un comentario, con sus respuestas anidadas. */
  function nodoComentario(comentario, esRespuesta) {
    var autor = comentario.autor || { username: 'usuario eliminado', nombreCompleto: 'Usuario eliminado', rol: 'usuario' };

    var cabecera = FL.dom.crear('div', { clase: 'fl-comentario__cabecera' }, [
      FL.encabezado.avatarDe(autor),
      FL.dom.crear('a', {
        clase: 'fl-comentario__autor',
        href: FL.dom.urlCon('perfil.html', { usuario: autor.username }),
        texto: autor.nombreCompleto
      }),
      FL.dom.crear('span', { clase: 'fl-rol', dataset: { rol: autor.rol }, texto: autor.rol }),
      FL.dom.crear('time', {
        datetime: FL.formato.iso(comentario.fechaCreacion),
        title: FL.formato.fechaHora(comentario.fechaCreacion),
        texto: FL.formato.relativa(comentario.fechaCreacion)
      })
    ]);

    var acciones = FL.dom.crear('div', { clase: 'fl-comentario__acciones' });

    // Votación del comentario
    var votoActual = FL.interaccionesService.getVotoUsuario(comentario.idComentario);
    var marcador = FL.dom.crear('span', {
      clase: 'fl-badge fl-badge--neutro',
      'aria-live': 'polite',
      texto: FL.formato.puntaje(comentario.puntaje)
    });

    function botonVoto(direccion, simbolo, etiqueta) {
      var b = FL.dom.crear('button', {
        type: 'button',
        clase: 'fl-boton fl-boton--fantasma fl-boton--sm',
        'aria-pressed': String(votoActual === direccion),
        'aria-label': etiqueta,
        texto: simbolo
      });
      b.addEventListener('click', function () {
        FL.interaccionesService.voteComentario(comentario.idComentario, direccion)
          .then(function (resultado) {
            votoActual = resultado.valor;
            marcador.textContent = FL.formato.puntaje(resultado.puntaje);
            FL.dom.todos('button', acciones).forEach(function (otro) {
              if (otro.dataset.direccion) {
                otro.setAttribute('aria-pressed',
                  String(Number(otro.dataset.direccion) === votoActual));
              }
            });
          })
          .catch(function (error) { FL.avisos.error(error.message); });
      });
      b.dataset.direccion = direccion;
      return b;
    }

    acciones.appendChild(botonVoto(1, '▲', 'Votar a favor del comentario'));
    acciones.appendChild(marcador);
    acciones.appendChild(botonVoto(-1, '▼', 'Votar en contra del comentario'));

    var formularioRespuesta = null;

    if (FL.sesionService.autenticado() && !esRespuesta) {
      var responder = FL.dom.crear('button', {
        type: 'button',
        clase: 'fl-boton fl-boton--fantasma fl-boton--sm',
        texto: 'Responder'
      });
      acciones.appendChild(responder);

      formularioRespuesta = construirFormularioRespuesta(comentario.idComentario);
      responder.addEventListener('click', function () {
        formularioRespuesta.hidden = !formularioRespuesta.hidden;
        if (!formularioRespuesta.hidden) FL.dom.uno('textarea', formularioRespuesta).focus();
      });
    }

    if (FL.sesionService.autenticado()) {
      var reportar = FL.dom.crear('button', {
        type: 'button',
        clase: 'fl-boton fl-boton--fantasma fl-boton--sm',
        texto: 'Reportar'
      });
      reportar.addEventListener('click', function () {
        abrirModalReporte(comentario.idComentario, 'Reportar comentario');
      });
      acciones.appendChild(reportar);
    }

    if (FL.sesionService.esAutor(comentario.usuarioId) || FL.sesionService.puede('moderar')) {
      var eliminar = FL.dom.crear('button', {
        type: 'button',
        clase: 'fl-boton fl-boton--fantasma fl-boton--sm',
        texto: 'Eliminar'
      });
      eliminar.addEventListener('click', function () {
        FL.modal.confirmar('Eliminar comentario', '¿Querés eliminar este comentario?', 'Eliminar')
          .then(function (ok) {
            if (!ok) return;
            FL.comentariosService.deleteComentario(comentario.idComentario).then(function () {
              FL.avisos.exito('Comentario eliminado.');
              cargarComentarios();
            });
          });
      });
      acciones.appendChild(eliminar);
    }

    var nodo = FL.dom.crear('article', {
      clase: 'fl-comentario' + (esRespuesta ? ' fl-comentario--respuesta' : ''),
      dataset: { comentario: comentario.idComentario }
    }, [
      cabecera,
      FL.dom.crear('div', { clase: 'fl-comentario__cuerpo' }, FL.formato.parrafos(comentario.contenido)),
      acciones
    ]);

    if (formularioRespuesta) nodo.appendChild(formularioRespuesta);

    if (comentario.respuestas && comentario.respuestas.length) {
      nodo.appendChild(FL.dom.crear('div', { clase: 'fl-comentario__respuestas' },
        comentario.respuestas.map(function (r) { return nodoComentario(r, true); })));
    }

    return nodo;
  }

  function construirFormularioRespuesta(idPadre) {
    var area = FL.dom.crear('textarea', {
      rows: 3,
      maxlength: FL.validacion.REGLAS.comentario.max,
      'aria-label': 'Escribir una respuesta',
      clase: 'fl-area fl-area--compacta',
      placeholder: 'Escribí tu respuesta…'
    });

    var formulario = FL.dom.crear('form', { clase: 'fl-form-respuesta', hidden: true }, [
      area,
      FL.dom.crear('div', { clase: 'fl-modal__acciones' }, [
        FL.dom.crear('button', { type: 'submit', clase: 'fl-boton fl-boton--sm', texto: 'Responder' })
      ])
    ]);

    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      FL.comentariosService.createComentario({
        publicacionId: publicacionActual.idPublicacion,
        comentarioPadreId: idPadre,
        contenido: area.value
      })
        .then(function () {
          FL.avisos.exito('Respuesta publicada.');
          cargarComentarios();
        })
        .catch(function (error) { FL.avisos.error(error.message); });
    });

    return formulario;
  }

  function cargarComentarios() {
    var host = FL.dom.uno('#lista-comentarios');
    FL.dom.renderizar(host, FL.dom.esqueletos(3, 2));

    return FL.comentariosService.getComentarios(publicacionActual.idPublicacion)
      .then(function (comentarios) {
        var total = comentarios.reduce(function (suma, c) {
          return suma + 1 + c.respuestas.length;
        }, 0);
        FL.dom.uno('#contador-comentarios').textContent =
          FL.formato.pluralizar(total, 'comentario');

        if (!comentarios.length) {
          FL.dom.renderizar(host, FL.dom.vacio(
            'Sin comentarios',
            'Todavía nadie respondió. Podés ser la primera persona en hacerlo.'
          ));
          return;
        }
        FL.dom.renderizar(host, comentarios.map(function (c) { return nodoComentario(c, false); }));
      });
  }

  function montarFormularioComentario() {
    var host = FL.dom.uno('#form-comentario-host');
    if (!FL.sesionService.autenticado()) {
      FL.dom.renderizar(host, FL.dom.crear('div', { clase: 'fl-aviso' }, [
        FL.dom.crear('p', { clase: 'fl-mb0' }, [
          document.createTextNode('Para comentar necesitás una cuenta. '),
          FL.dom.crear('a', { href: 'login.html', texto: 'Iniciar sesión' }),
          document.createTextNode(' o '),
          FL.dom.crear('a', { href: 'registro.html', texto: 'registrarte' }),
          document.createTextNode('.')
        ])
      ]));
      return;
    }

    var area = FL.dom.crear('textarea', {
      clase: 'fl-area fl-area--media',
      id: 'nuevo-comentario',
      rows: 4,
      maxlength: FL.validacion.REGLAS.comentario.max,
      'data-campo': 'contenido',
      placeholder: 'Compartí tu respuesta, un dato o una corrección…'
    });

    var error = FL.dom.crear('span', { clase: 'fl-error-campo', id: 'nuevo-comentario-error' });

    var formulario = FL.dom.crear('form', { id: 'form-comentario', novalidate: true }, [
      FL.dom.crear('div', { clase: 'fl-campo' }, [
        FL.dom.crear('label', { for: 'nuevo-comentario', texto: 'Tu comentario' }),
        area,
        error
      ]),
      FL.dom.crear('button', { type: 'submit', clase: 'fl-boton', texto: 'Publicar comentario' })
    ]);

    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      var validacion = FL.validacion.validar({ contenido: area.value }, {
        contenido: function (v) {
          return FL.validacion.requerido(v, 'El comentario') ||
                 FL.validacion.longitud(v, FL.validacion.REGLAS.comentario, 'El comentario');
        }
      });
      if (!validacion.valido) {
        FL.validacion.mostrarErrores(formulario, validacion.errores);
        area.focus();
        return;
      }
      FL.validacion.limpiarErrores(formulario);

      FL.comentariosService.createComentario({
        publicacionId: publicacionActual.idPublicacion,
        contenido: area.value
      })
        .then(function () {
          area.value = '';
          FL.avisos.exito('Comentario publicado.');
          cargarComentarios();
        })
        .catch(function (err) { FL.avisos.error(err.message); });
    });

    FL.dom.renderizar(host, formulario);
  }

  function init() {
    var params = FL.dom.parametros();
    var id = Number(params.id);
    if (!id) {
      noEncontrada();
      return Promise.resolve();
    }

    return FL.publicacionesService.getPublicacionById(id).then(function (publicacion) {
      if (!publicacion || publicacion.estado === 'eliminado') {
        noEncontrada();
        return null;
      }
      publicacionActual = publicacion;
      FL.publicacionesService.registrarVisita(id);

      pintarCabecera();
      pintarAdjuntos();
      pintarAcciones();
      montarFormularioComentario();
      return cargarComentarios();
    });
  }

  return { init: init };
})();
