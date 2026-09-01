/**
 * components/tarjetaPublicacion.js - Tarjeta de publicación con votación.
 *
 * Componente central del foro: aparece en la portada, en la materia, en la
 * búsqueda, en favoritos y en el perfil. Encapsula el control de votos y el
 * botón de favorito para que ninguna página duplique esa lógica.
 */
window.FL = window.FL || {};

FL.tarjetaPublicacion = (function () {
  'use strict';

  /** Control de votos reutilizable (también lo usa la vista de publicación). */
  function controlVotos(publicacion, opciones) {
    var config = opciones || {};
    var votoActual = FL.interaccionesService.getVotoUsuario(publicacion.idPublicacion);
    var puntaje = publicacion.puntaje;

    var valor = FL.dom.crear('span', {
      clase: 'fl-votos__valor',
      texto: FL.formato.puntaje(puntaje),
      'aria-live': 'polite'
    });

    function boton(direccion, simbolo, etiqueta) {
      return FL.dom.crear('button', {
        type: 'button',
        clase: 'fl-votos__boton fl-votos__boton--' + (direccion === 1 ? 'positivo' : 'negativo'),
        'aria-pressed': String(votoActual === direccion),
        'aria-label': etiqueta,
        title: etiqueta,
        texto: simbolo
      });
    }

    var arriba = boton(1, '▲', 'Votar a favor de "' + publicacion.titulo + '"');
    var abajo = boton(-1, '▼', 'Votar en contra de "' + publicacion.titulo + '"');

    function alVotar(direccion) {
      FL.interaccionesService.votePublicacion(publicacion.idPublicacion, direccion)
        .then(function (resultado) {
          votoActual = resultado.valor;
          valor.textContent = FL.formato.puntaje(resultado.puntaje);
          arriba.setAttribute('aria-pressed', String(votoActual === 1));
          abajo.setAttribute('aria-pressed', String(votoActual === -1));
          if (config.alCambiar) config.alCambiar(resultado);
        })
        .catch(function (error) { FL.avisos.error(error.message); });
    }

    arriba.addEventListener('click', function () { alVotar(1); });
    abajo.addEventListener('click', function () { alVotar(-1); });

    return FL.dom.crear('div', {
      clase: 'fl-votos',
      role: 'group',
      'aria-label': 'Votación de la publicación'
    }, [arriba, valor, abajo]);
  }

  /** Botón de guardar en favoritos, con estado alternable. */
  function botonFavorito(publicacion) {
    var guardado = FL.interaccionesService.esFavorito(publicacion.idPublicacion);
    var boton = FL.dom.crear('button', {
      type: 'button',
      clase: 'fl-boton-icono',
      'aria-pressed': String(guardado),
      'aria-label': 'Guardar en favoritos',
      title: 'Guardar en favoritos',
      texto: '★'
    });

    boton.addEventListener('click', function () {
      FL.interaccionesService.toggleFavorito(publicacion.idPublicacion)
        .then(function (activo) {
          boton.setAttribute('aria-pressed', String(activo));
          FL.avisos.exito(activo ? 'Guardada en favoritos.' : 'Quitada de favoritos.');
          document.dispatchEvent(new CustomEvent('fl:favoritos-cambiaron', {
            detail: { idPublicacion: publicacion.idPublicacion, guardado: activo }
          }));
        })
        .catch(function (error) { FL.avisos.error(error.message); });
    });

    return boton;
  }

  function metaDe(publicacion) {
    var nodos = [];

    if (publicacion.categoria) {
      nodos.push(FL.dom.crear('span', {
        clase: 'fl-badge',
        dataset: { categoria: publicacion.categoria.valor },
        texto: publicacion.categoria.nombre
      }));
    }
    if (publicacion.materia) {
      nodos.push(FL.dom.crear('a', {
        clase: 'fl-badge fl-badge--contorno',
        href: FL.dom.urlCon('materia.html', { id: publicacion.materia.idMateria }),
        texto: publicacion.materia.nombre
      }));
    } else if (publicacion.carrera) {
      nodos.push(FL.dom.crear('a', {
        clase: 'fl-badge fl-badge--contorno',
        href: FL.dom.urlCon('carrera.html', { id: publicacion.carrera.idCarrera }),
        texto: publicacion.carrera.nombre
      }));
    }
    if (publicacion.fijada) {
      nodos.push(FL.dom.crear('span', { clase: 'fl-badge fl-badge--acento', texto: '📌 Destacada' }));
    }
    if (publicacion.estado !== 'publicado') {
      nodos.push(FL.dom.crear('span', { clase: 'fl-badge fl-badge--peligro', texto: publicacion.estado }));
    }
    return nodos;
  }

  /**
   * @param {Object} publicacion - publicación decorada por publicacionesService
   * @param {Object} [opciones] { compacta: boolean, mostrarFavorito: boolean }
   * @returns {HTMLElement} <article>
   */
  function crear(publicacion, opciones) {
    var config = opciones || {};
    var autor = publicacion.autor || { username: 'usuario eliminado', rol: 'usuario' };

    var cuerpo = FL.dom.crear('div', { clase: 'fl-publicacion__cuerpo' });

    cuerpo.appendChild(FL.dom.crear('div', { clase: 'fl-publicacion__meta' }, metaDe(publicacion)));

    cuerpo.appendChild(FL.dom.crear('h3', { clase: 'fl-publicacion__titulo' },
      FL.dom.crear('a', {
        href: FL.dom.urlCon('publicacion.html', { id: publicacion.idPublicacion }),
        texto: publicacion.titulo
      })));

    if (!config.compacta) {
      cuerpo.appendChild(FL.dom.crear('p', {
        clase: 'fl-publicacion__extracto',
        texto: FL.formato.truncar(publicacion.contenido, 190)
      }));
    }

    var pie = FL.dom.crear('div', { clase: 'fl-publicacion__pie' }, [
      FL.dom.crear('a', {
        href: FL.dom.urlCon('perfil.html', { usuario: autor.username }),
        texto: '@' + autor.username
      }),
      FL.dom.crear('span', { clase: 'fl-rol', dataset: { rol: autor.rol }, texto: autor.rol }),
      FL.dom.crear('time', {
        datetime: FL.formato.iso(publicacion.fechaCreacion),
        title: FL.formato.fechaHora(publicacion.fechaCreacion),
        texto: FL.formato.relativa(publicacion.fechaCreacion)
      }),
      FL.dom.crear('span', {
        texto: '💬 ' + FL.formato.pluralizar(publicacion.totalComentarios, 'comentario')
      }),
      FL.dom.crear('span', { texto: '👁 ' + FL.formato.numero(publicacion.visitas) }),
      publicacion.adjuntos && publicacion.adjuntos.length
        ? FL.dom.crear('span', {
            texto: '📎 ' + FL.formato.pluralizar(publicacion.adjuntos.length, 'adjunto')
          })
        : null
    ]);

    if (config.mostrarFavorito !== false && FL.sesionService.autenticado()) {
      pie.appendChild(botonFavorito(publicacion));
    }

    cuerpo.appendChild(pie);

    var clases = 'fl-publicacion' + (publicacion.fijada ? ' fl-publicacion--fijada' : '');
    return FL.dom.crear('article', {
      clase: clases,
      dataset: { publicacion: publicacion.idPublicacion }
    }, [controlVotos(publicacion), cuerpo]);
  }

  /**
   * Renderiza una lista completa con estado vacío incluido.
   * @param {HTMLElement} contenedor
   * @param {Array} publicaciones
   * @param {Object} [opciones]
   */
  function renderizarLista(contenedor, publicaciones, opciones) {
    var config = opciones || {};
    if (!contenedor) return;
    FL.dom.limpiar(contenedor);

    if (!publicaciones.length) {
      contenedor.appendChild(FL.dom.vacio(
        config.tituloVacio || 'Todavía no hay publicaciones',
        config.mensajeVacio || 'Sé la primera persona en compartir algo en esta sección.',
        config.accionVacio || null
      ));
      return;
    }

    publicaciones.forEach(function (publicacion) {
      contenedor.appendChild(crear(publicacion, config));
    });
  }

  return {
    crear: crear,
    renderizarLista: renderizarLista,
    controlVotos: controlVotos,
    botonFavorito: botonFavorito
  };
})();
