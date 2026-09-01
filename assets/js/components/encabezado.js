/**
 * components/encabezado.js - Encabezado y navegación reutilizables.
 *
 * Se monta sobre <header data-componente="encabezado"> en cada página, de modo
 * que la marca, la navegación y el menú de usuario existen una sola vez en el
 * código. La página declara cuál es su sección activa con data-activo.
 */
window.FL = window.FL || {};

FL.encabezado = (function () {
  'use strict';

  var ENLACES = [
    { clave: 'inicio',   texto: 'Inicio',    href: 'index.html' },
    { clave: 'carreras', texto: 'Carreras',  href: 'carreras.html' },
    { clave: 'buscar',   texto: 'Explorar',  href: 'buscar.html' },
    { clave: 'favoritos', texto: 'Favoritos', href: 'favoritos.html', requiere: 'favoritos' },
    { clave: 'moderacion', texto: 'Moderación', href: 'moderacion.html', requiere: 'moderar' },
    { clave: 'admin',    texto: 'Administración', href: 'admin.html', requiere: 'administrar' }
  ];

  function avatarDe(usuario, clase) {
    var url = usuario && usuario.avatarUrl;
    if (url) {
      return FL.dom.crear('img', {
        src: url,
        alt: '',
        clase: clase || 'fl-avatar fl-avatar--sm',
        width: 28,
        height: 28
      });
    }
    return FL.dom.crear('span', {
      clase: (clase || 'fl-avatar fl-avatar--sm') + ' fl-avatar-iniciales',
      'aria-hidden': 'true',
      texto: FL.formato.iniciales(usuario ? usuario.nombre : 'I', usuario ? usuario.apellido : '')
    });
  }

  function construirNav(activo) {
    var nav = FL.dom.crear('nav', {
      clase: 'fl-nav',
      id: 'fl-nav-principal',
      'aria-label': 'Navegación principal'
    });

    ENLACES.forEach(function (enlace) {
      if (enlace.requiere && !FL.sesionService.puede(enlace.requiere)) return;
      nav.appendChild(FL.dom.crear('a', {
        clase: 'fl-nav__enlace',
        href: enlace.href,
        texto: enlace.texto,
        'aria-current': enlace.clave === activo ? 'page' : null
      }));
    });

    return nav;
  }

  function menuUsuario(usuario) {
    var panelId = 'fl-menu-usuario-panel';

    var disparador = FL.dom.crear('button', {
      clase: 'fl-usuario-chip',
      type: 'button',
      id: 'fl-menu-usuario-boton',
      'aria-haspopup': 'true',
      'aria-expanded': 'false',
      'aria-controls': panelId
    }, [
      avatarDe(usuario),
      FL.dom.crear('span', { clase: 'fl-usuario-chip__nombre', texto: usuario.username }),
      FL.dom.crear('span', { 'aria-hidden': 'true', texto: '▾' })
    ]);

    var panel = FL.dom.crear('div', { clase: 'fl-menu-usuario__panel', id: panelId, hidden: true });

    panel.appendChild(FL.dom.crear('div', { clase: 'fl-menu-usuario__cabecera' }, [
      FL.dom.crear('strong', { texto: usuario.nombreCompleto || usuario.nombre }),
      FL.dom.crear('span', { clase: 'fl-rol', dataset: { rol: usuario.rol }, texto: usuario.rol })
    ]));

    panel.appendChild(FL.dom.crear('a', { href: 'perfil.html', texto: 'Mi perfil' }));
    panel.appendChild(FL.dom.crear('a', { href: 'favoritos.html', texto: 'Mis favoritos' }));
    panel.appendChild(FL.dom.crear('a', { href: 'crear-publicacion.html', texto: 'Nueva publicación' }));
    if (FL.sesionService.puede('moderar')) {
      panel.appendChild(FL.dom.crear('a', { href: 'moderacion.html', texto: 'Panel de moderación' }));
    }
    if (FL.sesionService.puede('administrar')) {
      panel.appendChild(FL.dom.crear('a', { href: 'admin.html', texto: 'Administración' }));
    }
    panel.appendChild(FL.dom.crear('button', {
      type: 'button',
      texto: 'Cerrar sesión',
      onClick: function () {
        FL.sesionService.cerrarSesion().then(function () {
          FL.avisos.exito('Sesión cerrada.');
          window.location.href = 'index.html';
        });
      }
    }));

    var contenedor = FL.dom.crear('div', { clase: 'fl-menu-usuario' }, [disparador, panel]);

    function alternar(forzar) {
      var abierto = typeof forzar === 'boolean' ? forzar : panel.hidden;
      panel.hidden = !abierto;
      disparador.setAttribute('aria-expanded', String(abierto));
    }

    disparador.addEventListener('click', function (e) {
      e.stopPropagation();
      alternar();
    });
    document.addEventListener('click', function (e) {
      if (!contenedor.contains(e.target)) alternar(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        alternar(false);
        disparador.focus();
      }
    });

    return contenedor;
  }

  function accionesInvitado() {
    return FL.dom.crear('div', { clase: 'fl-encabezado__acciones' }, [
      FL.dom.crear('a', { clase: 'fl-boton fl-boton--secundario fl-boton--sm', href: 'login.html',
                          texto: 'Iniciar sesión' }),
      FL.dom.crear('a', { clase: 'fl-boton fl-boton--acento fl-boton--sm fl-encabezado__registro',
                          href: 'registro.html', texto: 'Crear cuenta' })
    ]);
  }

  /**
   * Monta el encabezado.
   * @param {string} activo - clave de la sección actual
   */
  function montar(activo) {
    var host = FL.dom.uno('[data-componente="encabezado"]');
    if (!host) return;

    var usuario = FL.sesionService.usuarioActual();
    host.className = 'fl-encabezado';

    var marca = FL.dom.crear('a', { clase: 'fl-marca', href: 'index.html' }, [
      FL.dom.crear('span', { clase: 'fl-marca__icono', 'aria-hidden': 'true', texto: 'FL' }),
      FL.dom.crear('span', { clase: 'fl-marca__texto' }, [
        document.createTextNode('Facu'),
        FL.dom.crear('span', { texto: 'Leaks' })
      ])
    ]);

    var alternar = FL.dom.crear('button', {
      clase: 'fl-encabezado__alternar',
      type: 'button',
      'aria-expanded': 'false',
      'aria-controls': 'fl-nav-principal'
    }, [
      FL.dom.crear('span', { 'aria-hidden': 'true', texto: '☰' }),
      FL.dom.crear('span', { clase: 'fl-solo-lectores', texto: 'Abrir menú de navegación' })
    ]);

    var nav = construirNav(activo);

    alternar.addEventListener('click', function () {
      var abierta = nav.classList.toggle('fl-nav--abierta');
      alternar.setAttribute('aria-expanded', String(abierta));
    });

    var acciones = FL.sesionService.autenticado()
      ? FL.dom.crear('div', { clase: 'fl-encabezado__acciones' }, [
          FL.dom.crear('a', {
            clase: 'fl-boton fl-boton--acento fl-boton--sm fl-encabezado__publicar',
            href: 'crear-publicacion.html',
            texto: 'Publicar'
          }),
          menuUsuario(usuario)
        ])
      : accionesInvitado();

    FL.dom.renderizar(host, FL.dom.crear('div', { clase: 'fl-contenedor fl-encabezado__barra' },
      [marca, nav, alternar, acciones]));
  }

  return { montar: montar, avatarDe: avatarDe };
})();
