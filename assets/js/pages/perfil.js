/**
 * pages/perfil.js - Perfil público y propio del usuario.
 *
 * Sin parámetros muestra el perfil del usuario en sesión; con ?usuario=<user>
 * muestra el perfil público de otra persona.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.perfil = (function () {
  'use strict';

  var usuario = null;
  var esPropio = false;

  function sinSesion() {
    FL.dom.renderizar(FL.dom.uno('#contenido-perfil'), FL.dom.vacio(
      'No hay una sesión iniciada',
      'Iniciá sesión para ver tu perfil, tus publicaciones y tus favoritos.',
      FL.dom.crear('a', { clase: 'fl-boton', href: 'login.html', texto: 'Iniciar sesión' }),
      'h1'
    ));
  }

  function noEncontrado() {
    FL.dom.renderizar(FL.dom.uno('#contenido-perfil'), FL.dom.vacio(
      'Usuario no encontrado',
      'No existe ninguna cuenta con ese nombre de usuario.',
      null,
      'h1'
    ));
  }

  function pintarCabecera(perfiles, estadisticas) {
    document.title = '@' + usuario.username + ' · FacuLeaks';

    FL.dom.renderizar(FL.dom.uno('#cabecera-perfil'), [
      FL.encabezado.avatarDe(usuario, 'fl-avatar fl-avatar--lg'),
      FL.dom.crear('div', null, [
        FL.dom.crear('h1', { texto: usuario.nombreCompleto }),
        FL.dom.crear('p', { clase: 'fl-suave' }, [
          FL.dom.crear('strong', { texto: '@' + usuario.username }),
          document.createTextNode(' '),
          FL.dom.crear('span', { clase: 'fl-rol', dataset: { rol: usuario.rol }, texto: usuario.rol })
        ]),
        FL.dom.crear('p', { clase: 'fl-tenue fl-mb0',
          texto: 'Miembro desde ' + FL.formato.fechaCorta(usuario.fechaRegistro) }),
        usuario.biografia ? FL.dom.crear('p', { clase: 'fl-suave', texto: usuario.biografia }) : null
      ])
    ]);

    FL.dom.renderizar(FL.dom.uno('#estadisticas-perfil'), [
      estadistica(estadisticas.publicaciones, 'publicaciones'),
      estadistica(estadisticas.comentarios, 'comentarios'),
      estadistica(FL.formato.puntaje(estadisticas.puntaje), 'puntaje'),
      estadistica(estadisticas.favoritos, 'favoritos')
    ]);

    pintarPerfilesAcademicos(perfiles);

    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: esPropio ? 'Mi perfil' : '@' + usuario.username }
    ]);
  }

  function estadistica(valor, etiqueta) {
    return FL.dom.crear('div', { clase: 'fl-estadistica' }, [
      FL.dom.crear('strong', { texto: typeof valor === 'number' ? FL.formato.numero(valor) : valor }),
      FL.dom.crear('span', { texto: etiqueta })
    ]);
  }

  function pintarPerfilesAcademicos(perfiles) {
    var host = FL.dom.uno('#academico-perfil');
    if (!perfiles.length) {
      FL.dom.renderizar(host, FL.dom.crear('p', {
        clase: 'fl-tenue fl-mb0',
        texto: 'Esta persona todavía no asoció una carrera a su cuenta.'
      }));
      return;
    }

    FL.dom.renderizar(host, FL.dom.crear('ul', { clase: 'fl-lista-materias' },
      perfiles.map(function (perfil) {
        return FL.dom.crear('li', null, FL.dom.crear('a', {
          clase: 'fl-materia-item',
          href: FL.dom.urlCon('carrera.html', { id: perfil.carreraId })
        }, [
          FL.dom.crear('span', { clase: 'fl-materia-item__nombre',
                                 texto: perfil.carrera ? perfil.carrera.nombre : 'Carrera' }),
          FL.dom.crear('span', { clase: 'fl-badge fl-badge--contorno',
                                 texto: 'Ingreso ' + perfil.anioIngreso }),
          perfil.sede ? FL.dom.crear('span', { clase: 'fl-badge fl-badge--contorno', texto: perfil.sede }) : null
        ]));
      })));
  }

  function pintarPublicaciones() {
    var host = FL.dom.uno('#publicaciones-perfil');
    FL.dom.renderizar(host, FL.dom.esqueletos(3, 2));

    return FL.publicacionesService.getPublicaciones({
      usuarioId: usuario.idUsuario,
      orden: 'recientes',
      respetarFijadas: false
    }).then(function (resultado) {
      FL.tarjetaPublicacion.renderizarLista(host, resultado.items, {
        tituloVacio: esPropio ? 'Todavía no publicaste nada' : 'Sin publicaciones',
        mensajeVacio: esPropio
          ? 'Compartí un apunte, una duda o tu experiencia de cursada.'
          : 'Esta persona todavía no publicó contenido.',
        accionVacio: esPropio
          ? FL.dom.crear('a', { clase: 'fl-boton', href: 'crear-publicacion.html',
                                texto: 'Crear publicación' })
          : null
      });
    });
  }

  function pintarComentarios() {
    var host = FL.dom.uno('#comentarios-perfil');
    FL.dom.renderizar(host, FL.dom.esqueletos(3, 2));

    return FL.comentariosService.getComentariosPlanos({ usuarioId: usuario.idUsuario })
      .then(function (comentarios) {
        if (!comentarios.length) {
          FL.dom.renderizar(host, FL.dom.vacio(
            'Sin comentarios',
            esPropio ? 'Cuando comentes en una publicación, va a aparecer acá.'
                     : 'Esta persona todavía no comentó.'
          ));
          return;
        }

        FL.dom.renderizar(host, comentarios.slice(0, 20).map(function (comentario) {
          return FL.dom.crear('article', { clase: 'fl-comentario' }, [
            FL.dom.crear('div', { clase: 'fl-comentario__cabecera' }, [
              FL.dom.crear('time', {
                datetime: FL.formato.iso(comentario.fechaCreacion),
                texto: FL.formato.relativa(comentario.fechaCreacion)
              }),
              FL.dom.crear('span', { clase: 'fl-badge fl-badge--neutro',
                                     texto: FL.formato.puntaje(comentario.puntaje) })
            ]),
            FL.dom.crear('p', { clase: 'fl-comentario__cuerpo',
                                texto: FL.formato.truncar(comentario.contenido, 220) }),
            comentario.publicacion
              ? FL.dom.crear('a', {
                  clase: 'fl-boton fl-boton--fantasma fl-boton--sm',
                  href: FL.dom.urlCon('publicacion.html', { id: comentario.publicacionId }),
                  texto: 'Ver en «' + FL.formato.truncar(comentario.publicacion.titulo, 60) + '»'
                })
              : null
          ]);
        }));
      });
  }

  function pintarFavoritos() {
    var seccion = FL.dom.uno('#panel-favoritos');
    var boton = FL.dom.uno('#tab-favoritos');
    if (!esPropio) {
      if (seccion) seccion.remove();
      if (boton) boton.remove();
      return Promise.resolve();
    }

    var host = FL.dom.uno('#favoritos-perfil');
    FL.dom.renderizar(host, FL.dom.esqueletos(2, 2));

    return FL.interaccionesService.getFavoritos().then(function (resultado) {
      FL.tarjetaPublicacion.renderizarLista(host, resultado.items, {
        tituloVacio: 'Sin favoritos',
        mensajeVacio: 'Guardá publicaciones con el botón ★ para encontrarlas rápido.'
      });
    });
  }

  function conectarTabs() {
    var botones = FL.dom.todos('#tabs-perfil [role="tab"]');
    botones.forEach(function (boton) {
      boton.addEventListener('click', function () {
        botones.forEach(function (otro) {
          var activo = otro === boton;
          otro.setAttribute('aria-selected', String(activo));
          var panel = document.getElementById(otro.getAttribute('aria-controls'));
          if (panel) panel.hidden = !activo;
        });
      });
    });
  }

  function pintarAccionesPropias() {
    var host = FL.dom.uno('#acciones-perfil');
    if (!esPropio) {
      FL.dom.limpiar(host);
      return;
    }
    FL.dom.renderizar(host, [
      FL.dom.crear('a', { clase: 'fl-boton fl-boton--bloque', href: 'crear-publicacion.html',
                          texto: 'Nueva publicación' }),
      FL.dom.crear('a', { clase: 'fl-boton fl-boton--secundario fl-boton--bloque',
                          href: 'favoritos.html', texto: 'Ver favoritos' }),
      FL.dom.crear('button', {
        clase: 'fl-boton fl-boton--secundario fl-boton--bloque',
        type: 'button',
        texto: 'Cerrar sesión',
        onClick: function () {
          FL.sesionService.cerrarSesion().then(function () {
            window.location.href = 'index.html';
          });
        }
      })
    ]);
  }

  function init() {
    var params = FL.dom.parametros();
    conectarTabs();

    var promesa = params.usuario
      ? FL.usuariosService.getUsuarioByUsername(params.usuario)
      : Promise.resolve(FL.sesionService.autenticado()
          ? FL.sesionService.usuarioActual()
          : null);

    return promesa.then(function (encontrado) {
      if (!encontrado) {
        if (params.usuario) noEncontrado();
        else sinSesion();
        return null;
      }
      usuario = encontrado;
      esPropio = FL.sesionService.esAutor(usuario.idUsuario);
      pintarAccionesPropias();

      return Promise.all([
        FL.usuariosService.getPerfilAcademico(usuario.idUsuario),
        FL.usuariosService.getEstadisticasUsuario(usuario.idUsuario)
      ]).then(function (resultados) {
        pintarCabecera(resultados[0], resultados[1]);
        return Promise.all([pintarPublicaciones(), pintarComentarios(), pintarFavoritos()]);
      });
    });
  }

  return { init: init };
})();
