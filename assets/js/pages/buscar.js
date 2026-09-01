/**
 * pages/buscar.js - Búsqueda de publicaciones con filtros combinables.
 *
 * El estado de los filtros se refleja en la query string, de modo que los
 * resultados se pueden compartir y el botón Atrás del navegador funciona.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.buscar = (function () {
  'use strict';

  var POR_PAGINA = 10;
  // `categoria` guarda el valor del ENUM (por ejemplo 'apunte'), no un id:
  // la categoría es un atributo de la publicación, no una entidad.
  var estado = {
    q: '', carrera: '', materia: '', categoria: '', orden: 'recientes', pagina: 1
  };

  function leerEstadoDeUrl() {
    var p = FL.dom.parametros();
    estado.q = p.q || '';
    estado.carrera = p.carrera || '';
    estado.materia = p.materia || '';
    estado.categoria = p.categoria || '';
    estado.orden = p.orden || 'recientes';
    estado.pagina = Number(p.pagina) || 1;
  }

  function escribirEstadoEnUrl() {
    var url = FL.dom.urlCon('buscar.html', {
      q: estado.q,
      carrera: estado.carrera,
      materia: estado.materia,
      categoria: estado.categoria,
      orden: estado.orden === 'recientes' ? '' : estado.orden,
      pagina: estado.pagina === 1 ? '' : estado.pagina
    });
    window.history.replaceState(null, '', url);
  }

  function llenarSelect(select, items, valorClave, textoClave, textoVacio, valorActual) {
    FL.dom.limpiar(select);
    select.appendChild(FL.dom.crear('option', { value: '', texto: textoVacio }));
    items.forEach(function (item) {
      select.appendChild(FL.dom.crear('option', {
        value: item[valorClave],
        texto: item[textoClave],
        selected: String(item[valorClave]) === String(valorActual)
      }));
    });
  }

  function cargarMaterias(idCarrera) {
    var select = FL.dom.uno('#filtro-materia');
    if (!idCarrera) {
      llenarSelect(select, [], 'idMateria', 'nombre', 'Todas las materias', '');
      select.disabled = true;
      estado.materia = '';
      return Promise.resolve();
    }
    return FL.carrerasService.getMateriasByCarrera(idCarrera).then(function (materias) {
      llenarSelect(select, materias, 'idMateria', 'nombre', 'Todas las materias', estado.materia);
      select.disabled = false;
    });
  }

  function buscar() {
    var host = FL.dom.uno('#resultados-busqueda');
    FL.dom.renderizar(host, FL.dom.esqueletos(4, 2));
    escribirEstadoEnUrl();

    return FL.publicacionesService.getPublicaciones({
      texto: estado.q,
      carreraId: estado.carrera || null,
      materiaId: estado.materia || null,
      categoria: estado.categoria || null,
      orden: estado.orden,
      respetarFijadas: false,
      limite: POR_PAGINA,
      pagina: estado.pagina
    }).then(function (resultado) {
      var resumen = FL.dom.uno('#resumen-busqueda');
      resumen.textContent = estado.q
        ? FL.formato.pluralizar(resultado.total, 'resultado') + ' para «' + estado.q + '»'
        : FL.formato.pluralizar(resultado.total, 'publicación', 'publicaciones') + ' encontradas';

      FL.tarjetaPublicacion.renderizarLista(host, resultado.items, {
        tituloVacio: 'Sin resultados',
        mensajeVacio: 'Probá con otras palabras o quitá alguno de los filtros.',
        accionVacio: FL.dom.crear('button', {
          clase: 'fl-boton fl-boton--secundario',
          type: 'button',
          texto: 'Limpiar filtros',
          onClick: limpiar
        })
      });

      FL.paginacion.montar(FL.dom.uno('#paginacion-busqueda'), resultado, function (destino) {
        estado.pagina = destino;
        buscar().then(function () { host.scrollIntoView({ block: 'start' }); });
      });

      pintarFiltrosActivos();
    });
  }

  function pintarFiltrosActivos() {
    var host = FL.dom.uno('#filtros-activos');
    var activos = [];

    if (estado.q) activos.push({ clave: 'q', texto: '“' + estado.q + '”' });
    if (estado.carrera) {
      var opcionCarrera = FL.dom.uno('#filtro-carrera option[value="' + estado.carrera + '"]');
      if (opcionCarrera) activos.push({ clave: 'carrera', texto: opcionCarrera.textContent });
    }
    if (estado.materia) {
      var opcionMateria = FL.dom.uno('#filtro-materia option[value="' + estado.materia + '"]');
      if (opcionMateria) activos.push({ clave: 'materia', texto: opcionMateria.textContent });
    }
    if (estado.categoria) {
      var opcionCategoria = FL.dom.uno('#filtro-categoria option[value="' + estado.categoria + '"]');
      if (opcionCategoria) activos.push({ clave: 'categoria', texto: opcionCategoria.textContent });
    }

    FL.dom.renderizar(host, activos.map(function (filtro) {
      var chip = FL.dom.crear('button', {
        type: 'button',
        clase: 'fl-chip',
        'aria-pressed': 'true',
        texto: filtro.texto + ' ×',
        'aria-label': 'Quitar filtro ' + filtro.texto
      });
      chip.addEventListener('click', function () {
        estado[filtro.clave] = '';
        estado.pagina = 1;
        if (filtro.clave === 'carrera') {
          cargarMaterias('').then(sincronizarControles).then(buscar);
        } else {
          sincronizarControles();
          buscar();
        }
      });
      return chip;
    }));
  }

  function sincronizarControles() {
    FL.dom.uno('#busqueda-texto').value = estado.q;
    FL.dom.uno('#filtro-carrera').value = estado.carrera;
    FL.dom.uno('#filtro-categoria').value = estado.categoria;
    FL.dom.uno('#filtro-materia').value = estado.materia;
    FL.dom.uno('#filtro-orden').value = estado.orden;
  }

  function limpiar() {
    estado.q = '';
    estado.carrera = '';
    estado.materia = '';
    estado.categoria = '';
    estado.orden = 'recientes';
    estado.pagina = 1;
    cargarMaterias('').then(function () {
      sincronizarControles();
      buscar();
    });
  }

  function conectarControles() {
    var formulario = FL.dom.uno('#form-busqueda');
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      estado.q = FL.dom.uno('#busqueda-texto').value.trim();
      estado.pagina = 1;
      buscar();
    });

    FL.dom.uno('#filtro-carrera').addEventListener('change', function (e) {
      estado.carrera = e.target.value;
      estado.materia = '';
      estado.pagina = 1;
      cargarMaterias(estado.carrera).then(buscar);
    });

    ['#filtro-materia', '#filtro-categoria', '#filtro-orden'].forEach(function (selector) {
      FL.dom.uno(selector).addEventListener('change', function (e) {
        var clave = selector.replace('#filtro-', '');
        estado[clave] = e.target.value;
        estado.pagina = 1;
        buscar();
      });
    });

    FL.dom.uno('#limpiar-filtros').addEventListener('click', limpiar);
  }

  function init() {
    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: 'Explorar' }
    ]);

    leerEstadoDeUrl();
    conectarControles();

    return Promise.all([
      FL.carrerasService.getCarreras({ soloActivas: true }).then(function (carreras) {
        llenarSelect(FL.dom.uno('#filtro-carrera'), carreras, 'idCarrera', 'nombre',
          'Todas las carreras', estado.carrera);
      }),
      FL.publicacionesService.getCategorias().then(function (categorias) {
        llenarSelect(FL.dom.uno('#filtro-categoria'), categorias, 'valor', 'nombre',
          'Todas las categorías', estado.categoria);
      })
    ])
      .then(function () { return cargarMaterias(estado.carrera); })
      .then(function () {
        sincronizarControles();
        return buscar();
      });
  }

  return { init: init };
})();
