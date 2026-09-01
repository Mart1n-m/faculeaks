/**
 * components/pie.js - Pie de página reutilizable.
 *
 * Incluye el selector de rol simulado, que existe solo en TP1 para poder
 * demostrar las vistas de moderación y administración sin backend.
 */
window.FL = window.FL || {};

FL.pie = (function () {
  'use strict';

  function columna(titulo, enlaces) {
    return FL.dom.crear('div', null, [
      FL.dom.crear('h3', { texto: titulo }),
      FL.dom.crear('ul', null, enlaces.map(function (e) {
        return FL.dom.crear('li', null,
          FL.dom.crear('a', { href: e.href, texto: e.texto }));
      }))
    ]);
  }

  function selectorRol() {
    var actual = FL.sesionService.rol();
    var select = FL.dom.crear('select', {
      clase: 'fl-select',
      id: 'fl-selector-rol',
      'aria-describedby': 'fl-selector-rol-ayuda'
    });

    ['invitado', 'usuario', 'moderador', 'administrador'].forEach(function (rol) {
      select.appendChild(FL.dom.crear('option', {
        value: rol,
        texto: rol.charAt(0).toUpperCase() + rol.slice(1),
        selected: rol === actual
      }));
    });

    select.addEventListener('change', function () {
      FL.sesionService.simularRol(select.value)
        .then(function () { window.location.reload(); })
        .catch(function (error) { FL.avisos.error(error.message); });
    });

    return FL.dom.crear('div', null, [
      FL.dom.crear('h3', { texto: 'Rol de demostración' }),
      FL.dom.crear('label', {
        clase: 'fl-solo-lectores',
        for: 'fl-selector-rol',
        texto: 'Seleccionar rol simulado'
      }),
      select,
      FL.dom.crear('p', {
        id: 'fl-selector-rol-ayuda',
        clase: 'fl-mb0',
        texto: 'Cambia la sesión simulada para ver la interfaz de cada rol. En TP2 el rol lo determina el servidor.'
      })
    ]);
  }

  function montar() {
    var host = FL.dom.uno('[data-componente="pie"]');
    if (!host) return;
    host.className = 'fl-pie';

    var grilla = FL.dom.crear('div', { clase: 'fl-pie__grilla' }, [
      FL.dom.crear('div', null, [
        FL.dom.crear('h3', { texto: 'FacuLeaks' }),
        FL.dom.crear('p', {
          texto: 'Comunidad académica para consultar carreras, materias y programas ' +
                 'y para compartir material entre estudiantes.'
        }),
        FL.dom.crear('p', {
          clase: 'fl-mb0',
          texto: 'Proyecto académico. Todos los datos que se muestran son ficticios.'
        })
      ]),
      columna('Navegar', [
        { href: 'index.html', texto: 'Inicio' },
        { href: 'carreras.html', texto: 'Carreras' },
        { href: 'buscar.html', texto: 'Explorar publicaciones' },
        { href: 'crear-publicacion.html', texto: 'Publicar' }
      ]),
      columna('Cuenta', [
        { href: 'login.html', texto: 'Iniciar sesión' },
        { href: 'registro.html', texto: 'Crear cuenta' },
        { href: 'perfil.html', texto: 'Mi perfil' },
        { href: 'favoritos.html', texto: 'Favoritos' }
      ]),
      selectorRol()
    ]);

    var legal = FL.dom.crear('div', { clase: 'fl-pie__legal' }, [
      FL.dom.crear('span', { texto: '© ' + new Date().getFullYear() + ' FacuLeaks — TP1 Frontend' }),
      FL.dom.crear('span', { texto: 'HTML5 · CSS3 · JavaScript ES6+ · MySQL/MariaDB' })
    ]);

    FL.dom.renderizar(host,
      FL.dom.crear('div', { clase: 'fl-contenedor' }, [grilla, legal]));
  }

  return { montar: montar };
})();
