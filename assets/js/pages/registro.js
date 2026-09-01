/**
 * pages/registro.js - Alta de cuenta simulada.
 *
 * Si la persona elige una carrera, además del usuario se registra la relación
 * ESTUDIA con su año de ingreso.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.registro = (function () {
  'use strict';

  var formulario = null;

  function llenarSelect(select, items, valorClave, textoClave, textoVacio) {
    FL.dom.limpiar(select);
    select.appendChild(FL.dom.crear('option', { value: '', texto: textoVacio }));
    items.forEach(function (item) {
      select.appendChild(FL.dom.crear('option', {
        value: item[valorClave], texto: item[textoClave]
      }));
    });
  }

  function leerDatos() {
    return {
      nombre: FL.dom.uno('#nombre').value,
      apellido: FL.dom.uno('#apellido').value,
      username: FL.dom.uno('#username').value,
      email: FL.dom.uno('#email').value,
      password: FL.dom.uno('#password').value,
      password2: FL.dom.uno('#password2').value,
      carreraId: FL.dom.uno('#carrera').value,
      anioIngreso: FL.dom.uno('#anio-ingreso').value,
      terminos: FL.dom.uno('#terminos').checked
    };
  }

  var ESQUEMA = {
    nombre: function (v) {
      return FL.validacion.requerido(v, 'El nombre') ||
             FL.validacion.longitud(v, FL.validacion.REGLAS.nombre, 'El nombre');
    },
    apellido: function (v) {
      return FL.validacion.requerido(v, 'El apellido') ||
             FL.validacion.longitud(v, FL.validacion.REGLAS.nombre, 'El apellido');
    },
    username: FL.validacion.username,
    email: FL.validacion.email,
    password: FL.validacion.password,
    password2: function (v, datos) {
      return FL.validacion.requerido(v, 'La repetición de la contraseña') ||
             FL.validacion.coinciden(datos.password, v);
    },
    anioIngreso: FL.validacion.anioIngreso,
    terminos: function (v) {
      return v ? null : 'Tenés que aceptar las normas de la comunidad para continuar.';
    }
  };

  function enviar(e) {
    e.preventDefault();
    var datos = leerDatos();
    var validacion = FL.validacion.validar(datos, ESQUEMA);

    if (!validacion.valido) {
      var primero = FL.validacion.mostrarErrores(formulario, validacion.errores);
      FL.avisos.error('Revisá los campos marcados.');
      if (primero) primero.focus();
      return;
    }
    FL.validacion.limpiarErrores(formulario);

    var boton = FL.dom.uno('#enviar-registro');
    boton.disabled = true;
    boton.textContent = 'Creando cuenta…';

    FL.sesionService.registrar(datos)
      .then(function (usuario) {
        FL.avisos.exito('¡Bienvenido a FacuLeaks, ' + usuario.nombre + '!');
        window.location.href = 'perfil.html';
      })
      .catch(function (error) {
        FL.avisos.error(error.message);
        boton.disabled = false;
        boton.textContent = 'Crear cuenta';
      });
  }

  /** Validación en vivo al salir de cada campo. */
  function conectarValidacionEnVivo() {
    FL.dom.todos('[data-campo]', formulario).forEach(function (control) {
      control.addEventListener('blur', function () {
        var campo = control.dataset.campo;
        if (!ESQUEMA[campo]) return;
        var datos = leerDatos();
        var mensaje = ESQUEMA[campo](datos[campo], datos);
        var caja = document.getElementById(control.id + '-error');
        if (mensaje) {
          control.setAttribute('aria-invalid', 'true');
          if (caja) caja.textContent = mensaje;
        } else {
          control.removeAttribute('aria-invalid');
          if (caja) caja.textContent = '';
        }
      });
    });
  }

  function init() {
    if (FL.sesionService.autenticado()) {
      window.location.href = 'perfil.html';
      return Promise.resolve();
    }

    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: 'Crear cuenta' }
    ]);

    formulario = FL.dom.uno('#form-registro');
    formulario.addEventListener('submit', enviar);
    conectarValidacionEnVivo();

    FL.dom.uno('#anio-ingreso').value = String(new Date().getFullYear());

    return FL.carrerasService.getCarreras({ soloActivas: true }).then(function (carreras) {
      llenarSelect(FL.dom.uno('#carrera'), carreras, 'idCarrera', 'nombre',
        'Elegí tu carrera (opcional)');
    });
  }

  return { init: init };
})();
