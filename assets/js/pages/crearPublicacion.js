/**
 * pages/crearPublicacion.js - Formulario de alta de publicación.
 *
 * La carrera es obligatoria (relación PERTENECE_A con cardinalidad 1,1) y la
 * materia opcional (TRATA_SOBRE, 0..1). Los dos selectores están encadenados:
 * al elegir carrera se cargan las materias que esa carrera dicta.
 */
window.FL = window.FL || {};
FL.paginas = FL.paginas || {};

FL.paginas.crearPublicacion = (function () {
  'use strict';

  var formulario = null;

  function exigirSesion() {
    if (FL.sesionService.autenticado()) return true;
    FL.dom.renderizar(FL.dom.uno('#contenido-crear'), FL.dom.vacio(
      'Necesitás una cuenta',
      'Para publicar en FacuLeaks tenés que iniciar sesión.',
      FL.dom.crear('a', { clase: 'fl-boton', href: 'login.html', texto: 'Iniciar sesión' }),
      'h1'
    ));
    return false;
  }

  function llenarSelect(select, items, valorClave, textoClave, textoVacio) {
    FL.dom.limpiar(select);
    select.appendChild(FL.dom.crear('option', { value: '', texto: textoVacio }));
    items.forEach(function (item) {
      select.appendChild(FL.dom.crear('option', {
        value: item[valorClave],
        texto: item[textoClave]
      }));
    });
  }

  function cargarMaterias(idCarrera, idSeleccionada) {
    var select = FL.dom.uno('#materia');
    if (!idCarrera) {
      llenarSelect(select, [], 'idMateria', 'nombre', 'Elegí primero una carrera');
      select.disabled = true;
      return Promise.resolve();
    }
    select.disabled = true;
    llenarSelect(select, [], 'idMateria', 'nombre', 'Cargando materias…');

    return FL.carrerasService.getMateriasByCarrera(idCarrera).then(function (materias) {
      llenarSelect(select, materias, 'idMateria', 'nombre', 'Sin materia específica');
      select.disabled = false;
      if (idSeleccionada) select.value = String(idSeleccionada);
    });
  }

  function conectarContador() {
    var area = FL.dom.uno('#contenido');
    var contador = FL.dom.uno('#contador-contenido');
    var maximo = FL.validacion.REGLAS.contenido.max;

    function actualizar() {
      var largo = area.value.length;
      contador.textContent = largo + ' / ' + maximo + ' caracteres';
      contador.classList.toggle('fl-contador--excedido', largo > maximo);
    }
    area.addEventListener('input', actualizar);
    actualizar();
  }

  function conectarAdjunto() {
    var input = FL.dom.uno('#adjunto');
    var salida = FL.dom.uno('#adjunto-info');

    input.addEventListener('change', function () {
      if (!input.files || !input.files.length) {
        salida.textContent = 'Ningún archivo seleccionado.';
        return;
      }
      var archivo = input.files[0];
      var kb = Math.round(archivo.size / 1024);
      if (kb > 20480) {
        salida.textContent = 'El archivo supera el límite de 20 MB y no se adjuntará.';
        input.value = '';
        return;
      }
      salida.textContent = archivo.name + ' · ' + FL.formato.tamano(kb) +
        ' (se registra la referencia; la subida real se implementa en TP2).';
    });
  }

  function datosAdjunto() {
    var input = FL.dom.uno('#adjunto');
    if (!input.files || !input.files.length) return null;
    var archivo = input.files[0];
    var partes = archivo.name.split('.');
    return {
      nombreArchivo: archivo.name,
      tipoArchivo: partes.length > 1 ? partes.pop().toLowerCase() : 'bin',
      tamanoKb: Math.round(archivo.size / 1024)
    };
  }

  function esquemaValidacion() {
    return {
      carreraId: function (v) { return FL.validacion.requerido(v, 'La carrera'); },
      categoria: function (v) { return FL.validacion.requerido(v, 'La categoría'); },
      titulo: function (v) {
        return FL.validacion.requerido(v, 'El título') ||
               FL.validacion.longitud(v, FL.validacion.REGLAS.titulo, 'El título');
      },
      contenido: function (v) {
        return FL.validacion.requerido(v, 'El contenido') ||
               FL.validacion.longitud(v, FL.validacion.REGLAS.contenido, 'El contenido');
      }
    };
  }

  function enviar(e) {
    e.preventDefault();

    var datos = {
      carreraId: FL.dom.uno('#carrera').value,
      materiaId: FL.dom.uno('#materia').value,
      categoria: FL.dom.uno('#categoria').value,
      titulo: FL.dom.uno('#titulo').value,
      contenido: FL.dom.uno('#contenido').value,
      adjunto: datosAdjunto()
    };

    var validacion = FL.validacion.validar(datos, esquemaValidacion());
    if (!validacion.valido) {
      var primero = FL.validacion.mostrarErrores(formulario, validacion.errores);
      FL.avisos.error('Revisá los campos marcados.');
      if (primero) primero.focus();
      return;
    }
    FL.validacion.limpiarErrores(formulario);

    var boton = FL.dom.uno('#enviar-publicacion');
    boton.disabled = true;
    boton.textContent = 'Publicando…';

    FL.publicacionesService.createPublicacion(datos)
      .then(function (creada) {
        FL.avisos.exito('¡Publicación creada!');
        window.location.href = FL.dom.urlCon('publicacion.html', { id: creada.idPublicacion });
      })
      .catch(function (error) {
        FL.avisos.error(error.message);
        boton.disabled = false;
        boton.textContent = 'Publicar';
      });
  }

  function init() {
    FL.migas.montar([
      { texto: 'Inicio', href: 'index.html' },
      { texto: 'Nueva publicación' }
    ]);

    if (!exigirSesion()) return Promise.resolve();

    formulario = FL.dom.uno('#form-publicacion');
    var params = FL.dom.parametros();

    conectarContador();
    conectarAdjunto();
    formulario.addEventListener('submit', enviar);

    var selectCarrera = FL.dom.uno('#carrera');
    selectCarrera.addEventListener('change', function () {
      cargarMaterias(selectCarrera.value, null);
    });

    return Promise.all([
      FL.carrerasService.getCarreras({ soloActivas: true }).then(function (carreras) {
        llenarSelect(selectCarrera, carreras, 'idCarrera', 'nombre', 'Elegí una carrera');
      }),
      FL.publicacionesService.getCategorias().then(function (categorias) {
        llenarSelect(FL.dom.uno('#categoria'), categorias, 'valor', 'nombre',
          'Elegí una categoría');
      })
    ]).then(function () {
      // Precarga desde la URL: crear-publicacion.html?materia=9 o ?carrera=3
      if (params.materia) {
        return FL.carrerasService.getCarrerasDeMateria(params.materia).then(function (vinculos) {
          var carrera = vinculos.length ? vinculos[0].carrera : null;
          if (carrera) selectCarrera.value = String(carrera.idCarrera);
          return cargarMaterias(carrera ? carrera.idCarrera : null, params.materia);
        });
      }
      if (params.carrera) {
        selectCarrera.value = String(params.carrera);
        return cargarMaterias(params.carrera, null);
      }
      // Sin parámetros: se propone la primera carrera que estudia el usuario.
      var usuario = FL.sesionService.usuarioActual();
      return FL.usuariosService.getPerfilAcademico(usuario.idUsuario).then(function (perfiles) {
        if (!perfiles.length) return cargarMaterias(null, null);
        selectCarrera.value = String(perfiles[0].carreraId);
        return cargarMaterias(perfiles[0].carreraId, null);
      });
    });
  }

  return { init: init };
})();
