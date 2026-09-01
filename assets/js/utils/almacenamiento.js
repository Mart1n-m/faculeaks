/**
 * utils/almacenamiento.js - Único punto de acceso a localStorage.
 *
 * Ninguna vista ni servicio toca localStorage directamente: todo pasa por
 * aquí. Eso permite que en TP2, cuando el estado pase a vivir en el servidor,
 * baste con dejar de usar este módulo desde la capa de servicios sin tocar
 * las páginas.
 *
 * Claves usadas (todas con prefijo `faculeaks:`):
 *   sesion         -> { idUsuario, fecha }
 *   usuarios       -> cuentas creadas desde el formulario de registro
 *   estudia        -> carreras asociadas a esas cuentas (relación ESTUDIA)
 *   contenidos     -> filas del supertipo CONTENIDO creadas en esta sesión
 *   publicaciones  -> filas del subtipo PUBLICACIÓN
 *   comentarios    -> filas del subtipo COMENTARIO
 *   reportes       -> reportes enviados
 *   votos          -> { idContenido: -1 | 0 | 1 }  (una sola relación VOTA)
 *   favoritos      -> [idPublicacion, ...]
 *   secuencias     -> contadores para generar IDs locales
 */
window.FL = window.FL || {};

FL.almacenamiento = (function () {
  'use strict';

  var PREFIJO = 'faculeaks:';
  var memoria = {};          // reserva cuando localStorage no está disponible
  var disponible = (function () {
    try {
      var prueba = PREFIJO + '__prueba__';
      window.localStorage.setItem(prueba, '1');
      window.localStorage.removeItem(prueba);
      return true;
    } catch (e) {
      return false;
    }
  })();

  function leer(clave, porDefecto) {
    var completa = PREFIJO + clave;
    try {
      var crudo = disponible ? window.localStorage.getItem(completa) : memoria[completa];
      if (crudo === null || crudo === undefined) return porDefecto;
      return JSON.parse(crudo);
    } catch (e) {
      return porDefecto;
    }
  }

  function escribir(clave, valor) {
    var completa = PREFIJO + clave;
    var serializado;
    try {
      serializado = JSON.stringify(valor);
    } catch (e) {
      return false;
    }
    try {
      if (disponible) window.localStorage.setItem(completa, serializado);
      else memoria[completa] = serializado;
      return true;
    } catch (e) {
      // Cuota agotada o modo privado: se degrada a memoria para no romper la UI.
      memoria[completa] = serializado;
      return false;
    }
  }

  function borrar(clave) {
    var completa = PREFIJO + clave;
    try {
      if (disponible) window.localStorage.removeItem(completa);
    } catch (e) { /* sin efecto */ }
    delete memoria[completa];
  }

  /** Elimina todo el estado simulado de FacuLeaks. */
  function limpiarTodo() {
    ['sesion', 'votos', 'favoritos', 'usuarios', 'estudia', 'contenidos',
     'publicaciones', 'comentarios', 'reportes', 'secuencias'].forEach(borrar);
  }

  /**
   * Genera un identificador local por encima del máximo del dataset base,
   * de modo que nunca colisione con los IDs del mock ni con los de la BD.
   */
  function siguienteId(entidad, base) {
    var secuencias = leer('secuencias', {});
    var actual = secuencias[entidad];
    if (typeof actual !== 'number' || actual < base) actual = base;
    actual += 1;
    secuencias[entidad] = actual;
    escribir('secuencias', secuencias);
    return actual;
  }

  return {
    leer: leer,
    escribir: escribir,
    borrar: borrar,
    limpiarTodo: limpiarTodo,
    siguienteId: siguienteId,
    esPersistente: function () { return disponible; }
  };
})();
