/**
 * pages/admin.js - Panel de administración del catálogo académico.
 *
 * Cinco pestañas, una por cada entidad del modelo que el administrador
 * gestiona: usuarios, carreras, materias, programas y categorías. Las acciones
 * de escritura implementadas en TP1 son las que el modelo permite simular sin
 * backend: cambio de rol y de estado de usuarios.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.admin = (function () {
  'use strict';

  var roles = [];

  function sinPermisos() {
    FL.dom.renderizar(FL.dom.uno('#contenido-admin'), FL.dom.vacio(
      'Acceso restringido',
      'Esta sección es exclusiva de administradores. Podés cambiar el rol simulado desde el pie de página.',
      FL.dom.crear('a', { clase: 'fl-boton', href: 'index.html', texto: 'Volver al inicio' }),
      'h1'
    ));
  }

  function celda(texto) { return FL.dom.crear('td', { texto: texto }); }

  function pintarTabla(selector, filas, mensajeVacio) {
    var cuerpo = FL.dom.uno(selector + ' tbody');
    if (!cuerpo) return;
    if (!filas.length) {
      var columnas = FL.dom.todos(selector + ' thead th').length || 1;
      FL.dom.renderizar(cuerpo, FL.dom.crear('tr', null,
        FL.dom.crear('td', { colspan: columnas, texto: mensajeVacio })));
      return;
    }
    FL.dom.renderizar(cuerpo, filas);
  }

  // --- Usuarios -------------------------------------------------------
  function selectorRol(usuario) {
    var select = FL.dom.crear('select', {
      clase: 'fl-select',
      'aria-label': 'Rol de ' + usuario.username
    }, roles.map(function (rol) {
      return FL.dom.crear('option', {
        value: rol.idRol, texto: rol.nombre, selected: rol.idRol === usuario.rolId
      });
    }));

    select.addEventListener('change', function () {
      FL.usuariosService.cambiarRol(usuario.idUsuario, select.value)
        .then(function () { FL.avisos.exito('Rol de @' + usuario.username + ' actualizado.'); })
        .catch(function (error) {
          FL.avisos.error(error.message);
          select.value = String(usuario.rolId);
        });
    });
    return select;
  }

  function botonEstado(usuario) {
    var suspendido = usuario.estado === 'suspendido';
    var boton = FL.dom.crear('button', {
      type: 'button',
      clase: 'fl-boton fl-boton--sm ' + (suspendido ? '' : 'fl-boton--peligro'),
      texto: suspendido ? 'Reactivar' : 'Suspender'
    });
    boton.addEventListener('click', function () {
      var destino = suspendido ? 'activo' : 'suspendido';
      FL.usuariosService.cambiarEstado(usuario.idUsuario, destino)
        .then(function () {
          FL.avisos.exito('@' + usuario.username + ' ahora está ' + destino + '.');
          cargarUsuarios();
        })
        .catch(function (error) { FL.avisos.error(error.message); });
    });
    return boton;
  }

  function cargarUsuarios() {
    var texto = FL.dom.uno('#buscar-usuario') ? FL.dom.uno('#buscar-usuario').value : '';
    return FL.usuariosService.getUsuarios({ texto: texto }).then(function (usuarios) {
      pintarTabla('#tabla-usuarios', usuarios.map(function (usuario) {
        return FL.dom.crear('tr', null, [
          FL.dom.crear('td', null, [
            FL.dom.crear('a', {
              href: FL.dom.urlCon('perfil.html', { usuario: usuario.username }),
              texto: '@' + usuario.username
            }),
            FL.dom.crear('p', { clase: 'fl-tenue fl-mb0', texto: usuario.nombreCompleto })
          ]),
          celda(usuario.email),
          FL.dom.crear('td', null, selectorRol(usuario)),
          FL.dom.crear('td', null, FL.dom.crear('span', {
            clase: 'fl-badge ' + (usuario.estado === 'activo' ? 'fl-badge--exito' : 'fl-badge--peligro'),
            texto: usuario.estado
          })),
          celda(FL.formato.fechaCorta(usuario.fechaRegistro)),
          FL.dom.crear('td', null, FL.dom.crear('div', { clase: 'fl-tabla__acciones' },
            botonEstado(usuario)))
        ]);
      }), 'No hay usuarios que coincidan con la búsqueda.');
    });
  }

  // --- Catálogo académico ---------------------------------------------
  function cargarCarreras() {
    return FL.carrerasService.getCarreras({}).then(function (carreras) {
      pintarTabla('#tabla-carreras', carreras.map(function (carrera) {
        return FL.dom.crear('tr', null, [
          celda('#' + carrera.idCarrera),
          FL.dom.crear('td', null, FL.dom.crear('a', {
            href: FL.dom.urlCon('carrera.html', { id: carrera.idCarrera }),
            texto: carrera.nombre
          })),
          celda(carrera.duracionAnios + ' años'),
          celda(String(carrera.resumen.materias)),
          celda(String(carrera.resumen.publicaciones)),
          FL.dom.crear('td', null, FL.dom.crear('span', {
            clase: 'fl-badge ' + (carrera.activa ? 'fl-badge--exito' : 'fl-badge--neutro'),
            texto: carrera.activa ? 'activa' : 'inactiva'
          }))
        ]);
      }), 'No hay carreras cargadas.');
    });
  }

  /**
   * La columna «en N carreras» hace visible la relación N:M: una misma materia
   * puede dictarse en varias carreras sin duplicar la fila.
   */
  function cargarMaterias() {
    return FL.repositorio.obtener('materias').then(function (materias) {
      var vinculos = FL.repositorio.obtenerSync('carreraMateria');
      var filas = materias
        .sort(function (a, b) { return a.codigo.localeCompare(b.codigo, 'es'); })
        .map(function (materia) {
          var enCarreras = vinculos.filter(function (cm) {
            return cm.materiaId === materia.idMateria;
          }).length;
          return FL.dom.crear('tr', null, [
            celda(materia.codigo),
            FL.dom.crear('td', null, FL.dom.crear('a', {
              href: FL.dom.urlCon('materia.html', { id: materia.idMateria }),
              texto: materia.nombre
            })),
            celda(String(enCarreras)),
            FL.dom.crear('td', null, FL.dom.crear('span', {
              clase: 'fl-badge ' + (materia.activa ? 'fl-badge--exito' : 'fl-badge--neutro'),
              texto: materia.activa ? 'activa' : 'inactiva'
            }))
          ]);
        });
      pintarTabla('#tabla-materias', filas, 'No hay materias cargadas.');
    });
  }

  /**
   * PROGRAMA es una entidad débil: no tiene identificador propio, se lo dan su
   * materia más el año académico y la versión. La tabla muestra ese trío.
   */
  function cargarProgramas() {
    return FL.carrerasService.getProgramas().then(function (programas) {
      var filas = programas.map(function (programa) {
        return FL.dom.crear('tr', null, [
          FL.dom.crear('td', null, programa.materia
            ? FL.dom.crear('a', {
                href: FL.dom.urlCon('materia.html', { id: programa.materiaId }),
                texto: programa.materia.nombre
              })
            : document.createTextNode('—')),
          celda(String(programa.anioAcademico)),
          celda(programa.version),
          celda(programa.docenteReferencia || '—'),
          celda(FL.formato.fechaCorta(programa.fechaPublicacion)),
          FL.dom.crear('td', null, FL.dom.crear('span', {
            clase: 'fl-badge ' + (programa.vigente ? 'fl-badge--exito' : 'fl-badge--neutro'),
            texto: programa.vigente ? 'vigente' : 'histórico'
          }))
        ]);
      });
      pintarTabla('#tabla-programas', filas, 'No hay programas cargados.');
    });
  }

  /**
   * Las categorías no son una entidad sino el dominio cerrado del atributo
   * `categoria` de PUBLICACIÓN: por eso la tabla es de consulta.
   */
  function cargarCategorias() {
    return FL.publicacionesService.getCategorias().then(function (categorias) {
      var publicaciones = FL.repositorio.obtenerSync('publicaciones');
      var filas = categorias.map(function (categoria) {
        var usos = publicaciones.filter(function (p) {
          return p.categoria === categoria.valor;
        }).length;
        return FL.dom.crear('tr', null, [
          FL.dom.crear('td', null, FL.dom.crear('span', {
            clase: 'fl-badge', dataset: { categoria: categoria.valor }, texto: categoria.nombre
          })),
          celda(categoria.valor),
          celda(categoria.descripcion || '—'),
          celda(String(usos))
        ]);
      });
      pintarTabla('#tabla-categorias', filas, 'No hay categorías definidas.');
    });
  }

  function pintarResumen() {
    return FL.carrerasService.getResumenGlobal().then(function (resumen) {
      return FL.usuariosService.getUsuarios({}).then(function (usuarios) {
        FL.dom.renderizar(FL.dom.uno('#resumen-admin'), [
          tarjeta(usuarios.length, 'usuarios'),
          tarjeta(resumen.carreras, 'carreras'),
          tarjeta(resumen.materias, 'materias'),
          tarjeta(resumen.publicaciones, 'publicaciones')
        ]);
      });
    });
  }

  function tarjeta(valor, etiqueta) {
    return FL.dom.crear('div', { clase: 'fl-estadistica' }, [
      FL.dom.crear('strong', { texto: FL.formato.numero(valor) }),
      FL.dom.crear('span', { texto: etiqueta })
    ]);
  }

  function conectarTabs() {
    var botones = FL.dom.todos('#tabs-admin [role="tab"]');
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

  function init() {
    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: 'Administración' }
    ]);

    if (!FL.sesionService.puede('administrar')) {
      sinPermisos();
      return Promise.resolve();
    }

    conectarTabs();

    var buscador = FL.dom.uno('#buscar-usuario');
    if (buscador) {
      buscador.addEventListener('input', FL.dom.retardar(cargarUsuarios, 220));
    }

    return FL.usuariosService.getRoles().then(function (lista) {
      roles = lista;
      return Promise.all([
        pintarResumen(),
        cargarUsuarios(),
        cargarCarreras(),
        cargarMaterias(),
        cargarProgramas(),
        cargarCategorias()
      ]);
    });
  }

  return { init: init };
})();
