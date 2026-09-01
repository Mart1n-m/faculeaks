/**
 * utils/validacion.js - Reglas de validación de formularios.
 *
 * Las reglas replican las restricciones de la base de datos (longitudes,
 * formato de email, unicidad de username) para que el usuario reciba el error
 * antes de que exista backend. En TP2 el servidor volverá a validarlas: la
 * validación de cliente es de conveniencia, no de seguridad.
 */
window.FL = window.FL || {};

FL.validacion = (function () {
  'use strict';

  var REGLAS = {
    username: { min: 3, max: 30, patron: /^[a-zA-Z0-9._-]+$/ },
    email:    { max: 120, patron: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ },
    password: { min: 8, max: 64 },
    nombre:   { min: 2, max: 60 },
    titulo:   { min: 5, max: 180 },
    contenido:{ min: 20, max: 5000 },
    comentario:{ min: 5, max: 2000 }
  };

  function vacio(valor) {
    return String(valor === null || valor === undefined ? '' : valor).trim() === '';
  }

  function requerido(valor, etiqueta) {
    return vacio(valor) ? (etiqueta || 'Este campo') + ' es obligatorio.' : null;
  }

  function longitud(valor, regla, etiqueta) {
    var v = String(valor || '').trim();
    var nombre = etiqueta || 'El campo';
    if (regla.min && v.length < regla.min) {
      return nombre + ' debe tener al menos ' + regla.min + ' caracteres.';
    }
    if (regla.max && v.length > regla.max) {
      return nombre + ' no puede superar los ' + regla.max + ' caracteres.';
    }
    return null;
  }

  function email(valor) {
    if (vacio(valor)) return 'El correo electrónico es obligatorio.';
    if (!REGLAS.email.patron.test(String(valor).trim())) {
      return 'Ingresá un correo electrónico válido (por ejemplo, nombre@dominio.com).';
    }
    if (String(valor).length > REGLAS.email.max) {
      return 'El correo no puede superar los ' + REGLAS.email.max + ' caracteres.';
    }
    return null;
  }

  function username(valor) {
    var error = requerido(valor, 'El nombre de usuario');
    if (error) return error;
    error = longitud(valor, REGLAS.username, 'El nombre de usuario');
    if (error) return error;
    if (!REGLAS.username.patron.test(String(valor).trim())) {
      return 'El nombre de usuario solo admite letras, números, punto, guion y guion bajo.';
    }
    return null;
  }

  function password(valor) {
    var error = requerido(valor, 'La contraseña');
    if (error) return error;
    error = longitud(valor, REGLAS.password, 'La contraseña');
    if (error) return error;
    if (!/[A-Za-z]/.test(valor) || !/[0-9]/.test(valor)) {
      return 'La contraseña debe combinar letras y números.';
    }
    return null;
  }

  function coinciden(a, b) {
    return a === b ? null : 'Las contraseñas no coinciden.';
  }

  function anioIngreso(valor) {
    var n = Number(valor);
    var actual = new Date().getFullYear();
    if (!valor) return null;
    if (!Number.isInteger(n) || n < 1950 || n > actual + 1) {
      return 'El año de ingreso debe estar entre 1950 y ' + (actual + 1) + '.';
    }
    return null;
  }

  /**
   * Aplica un conjunto de validadores y devuelve { valido, errores }.
   * `esquema` es un objeto { campo: funcion(valor, datos) -> mensaje|null }.
   */
  function validar(datos, esquema) {
    var errores = {};
    Object.keys(esquema).forEach(function (campo) {
      var mensaje = esquema[campo](datos[campo], datos);
      if (mensaje) errores[campo] = mensaje;
    });
    return { valido: Object.keys(errores).length === 0, errores: errores };
  }

  /**
   * Pinta los errores en el formulario y devuelve el primer campo inválido.
   * Cada control debe tener un elemento hermano con id "<idDelCampo>-error".
   */
  function mostrarErrores(formulario, errores) {
    var primero = null;
    FL.dom.todos('[data-campo]', formulario).forEach(function (control) {
      var campo = control.dataset.campo;
      var caja = document.getElementById(control.id + '-error');
      var mensaje = errores[campo];
      if (mensaje) {
        control.setAttribute('aria-invalid', 'true');
        if (caja) caja.textContent = mensaje;
        if (!primero) primero = control;
      } else {
        control.removeAttribute('aria-invalid');
        if (caja) caja.textContent = '';
      }
    });
    return primero;
  }

  /** Limpia los mensajes de error de un formulario. */
  function limpiarErrores(formulario) {
    mostrarErrores(formulario, {});
  }

  return {
    REGLAS: REGLAS,
    vacio: vacio,
    requerido: requerido,
    longitud: longitud,
    email: email,
    username: username,
    password: password,
    coinciden: coinciden,
    anioIngreso: anioIngreso,
    validar: validar,
    mostrarErrores: mostrarErrores,
    limpiarErrores: limpiarErrores
  };
})();
