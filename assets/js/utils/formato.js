/**
 * utils/formato.js - Formateo de fechas, números y texto.
 */
window.FL = window.FL || {};

FL.formato = (function () {
  'use strict';

  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
               'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  /** Convierte 'YYYY-MM-DD HH:MM:SS' (formato de la BD) en Date. */
  function aFecha(valor) {
    if (valor instanceof Date) return valor;
    if (!valor) return null;
    var partes = String(valor).trim().split(/[- :T]/);
    if (partes.length < 3) return null;
    return new Date(
      Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]),
      Number(partes[3] || 0), Number(partes[4] || 0), Number(partes[5] || 0)
    );
  }

  /** '12 mar 2026' */
  function fechaCorta(valor) {
    var f = aFecha(valor);
    if (!f) return '';
    return f.getDate() + ' ' + MESES[f.getMonth()] + ' ' + f.getFullYear();
  }

  /** '12 mar 2026, 14:05' */
  function fechaHora(valor) {
    var f = aFecha(valor);
    if (!f) return '';
    var hh = String(f.getHours()).padStart(2, '0');
    var mm = String(f.getMinutes()).padStart(2, '0');
    return fechaCorta(f) + ', ' + hh + ':' + mm;
  }

  /** 'hace 3 días' — con reserva a fecha corta si la distancia es grande. */
  function relativa(valor) {
    var f = aFecha(valor);
    if (!f) return '';
    var segundos = Math.floor((Date.now() - f.getTime()) / 1000);
    if (segundos < 0) return fechaCorta(f);
    if (segundos < 60) return 'hace instantes';
    var minutos = Math.floor(segundos / 60);
    if (minutos < 60) return 'hace ' + minutos + (minutos === 1 ? ' minuto' : ' minutos');
    var horas = Math.floor(minutos / 60);
    if (horas < 24) return 'hace ' + horas + (horas === 1 ? ' hora' : ' horas');
    var dias = Math.floor(horas / 24);
    if (dias < 30) return 'hace ' + dias + (dias === 1 ? ' día' : ' días');
    return fechaCorta(f);
  }

  /** Valor ISO apto para el atributo datetime de <time>. */
  function iso(valor) {
    var f = aFecha(valor);
    return f ? f.toISOString() : '';
  }

  /** Separador de miles con formato local. */
  function numero(valor) {
    return Number(valor || 0).toLocaleString('es-AR');
  }

  /** Puntaje con signo explícito para los votos. */
  function puntaje(valor) {
    var n = Number(valor || 0);
    return n > 0 ? '+' + n : String(n);
  }

  /** Singular/plural: pluralizar(1,'comentario') -> '1 comentario'. */
  function pluralizar(cantidad, singular, plural) {
    var n = Number(cantidad || 0);
    return n + ' ' + (n === 1 ? singular : (plural || singular + 's'));
  }

  /** Recorta un texto en el último espacio antes del límite. */
  function truncar(texto, limite) {
    var t = String(texto || '').trim();
    var max = limite || 160;
    if (t.length <= max) return t;
    var corte = t.lastIndexOf(' ', max);
    return t.slice(0, corte > 40 ? corte : max).trim() + '…';
  }

  /** 'PDF · 1,8 MB' a partir de kilobytes. */
  function tamano(kb) {
    var n = Number(kb || 0);
    if (n < 1024) return n + ' KB';
    return (n / 1024).toFixed(1).replace('.', ',') + ' MB';
  }

  /** Etiqueta del cuatrimestre. */
  function cuatrimestre(n) {
    if (Number(n) === 3) return 'Anual';
    return Number(n) + '.º cuatrimestre';
  }

  /** Etiqueta del año de cursada. */
  function anioCursada(n) {
    return Number(n) + '.º año';
  }

  /** Convierte texto plano con saltos de línea en párrafos (nodos, no HTML). */
  function parrafos(texto) {
    return String(texto || '')
      .split(/\n{2,}/)
      .map(function (bloque) { return bloque.trim(); })
      .filter(Boolean)
      .map(function (bloque) {
        var p = document.createElement('p');
        bloque.split('\n').forEach(function (linea, i) {
          if (i > 0) p.appendChild(document.createElement('br'));
          p.appendChild(document.createTextNode(linea));
        });
        return p;
      });
  }

  /** Normaliza para búsquedas: minúsculas y sin tildes. */
  function normalizar(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /** Iniciales para el avatar de reserva. */
  function iniciales(nombre, apellido) {
    return ((nombre || '?').charAt(0) + (apellido || '').charAt(0)).toUpperCase();
  }

  return {
    aFecha: aFecha,
    fechaCorta: fechaCorta,
    fechaHora: fechaHora,
    relativa: relativa,
    iso: iso,
    numero: numero,
    puntaje: puntaje,
    pluralizar: pluralizar,
    truncar: truncar,
    tamano: tamano,
    cuatrimestre: cuatrimestre,
    anioCursada: anioCursada,
    parrafos: parrafos,
    normalizar: normalizar,
    iniciales: iniciales
  };
})();
