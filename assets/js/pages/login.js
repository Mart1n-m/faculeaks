/**
 * pages/login.js - Inicio de sesión simulado.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.login = (function () {
  'use strict';

  /** Cuentas de demostración que se ofrecen para probar cada rol. */
  var DEMO = [
    { usuario: 'mnahuel', rol: 'usuario', detalle: 'Estudiante de Ingeniería en Sistemas' },
    { usuario: 'mod_lucia', rol: 'moderador', detalle: 'Gestiona reportes' },
    { usuario: 'admin', rol: 'administrador', detalle: 'Administra el catálogo académico' }
  ];

  function pintarCuentasDemo() {
    var host = FL.dom.uno('#cuentas-demo');
    if (!host) return;

    FL.dom.renderizar(host, DEMO.map(function (cuenta) {
      var boton = FL.dom.crear('button', {
        type: 'button',
        clase: 'fl-materia-item fl-materia-item--boton'
      }, [
        FL.dom.crear('span', { clase: 'fl-materia-item__nombre', texto: '@' + cuenta.usuario }),
        FL.dom.crear('span', { clase: 'fl-rol', dataset: { rol: cuenta.rol }, texto: cuenta.rol }),
        FL.dom.crear('span', { clase: 'fl-tenue', texto: cuenta.detalle })
      ]);
      boton.addEventListener('click', function () {
        FL.dom.uno('#identificador').value = cuenta.usuario;
        FL.dom.uno('#clave').value = 'demo1234';
        FL.dom.uno('#form-login').requestSubmit();
      });
      return FL.dom.crear('li', null, boton);
    }));
  }

  function init() {
    if (FL.sesionService.autenticado()) {
      window.location.href = 'perfil.html';
      return Promise.resolve();
    }

    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: 'Iniciar sesión' }
    ]);

    pintarCuentasDemo();

    var formulario = FL.dom.uno('#form-login');
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();

      var datos = {
        identificador: FL.dom.uno('#identificador').value,
        clave: FL.dom.uno('#clave').value
      };

      var validacion = FL.validacion.validar(datos, {
        identificador: function (v) { return FL.validacion.requerido(v, 'El usuario o correo'); },
        clave: function (v) { return FL.validacion.requerido(v, 'La contraseña'); }
      });

      if (!validacion.valido) {
        var primero = FL.validacion.mostrarErrores(formulario, validacion.errores);
        if (primero) primero.focus();
        return;
      }
      FL.validacion.limpiarErrores(formulario);

      var boton = FL.dom.uno('#enviar-login');
      boton.disabled = true;
      boton.textContent = 'Ingresando…';

      FL.sesionService.iniciarSesion(datos.identificador, datos.clave)
        .then(function (usuario) {
          FL.avisos.exito('Hola de nuevo, ' + usuario.nombre + '.');
          var destino = FL.dom.parametros().destino || 'index.html';
          window.location.href = destino;
        })
        .catch(function (error) {
          FL.dom.uno('#error-login').textContent = error.message;
          FL.dom.uno('#error-login').hidden = false;
          boton.disabled = false;
          boton.textContent = 'Ingresar';
        });
    });

    return Promise.resolve();
  }

  return { init: init };
})();
