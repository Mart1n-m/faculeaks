'use strict';
const TIPOS_MATERIAL = {
  apunte: 'Apunte',
  libro: 'Libro',
  guia: 'Guia',
  pdf: 'PDF',
  otro: 'Otro'
};

const formatoMoneda = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 0
});

// 4500 -> "$4.500"
function formatearPrecio(importe) {
  return '$' + formatoMoneda.format(importe);
}

function codigoProducto(idProducto) {
  return 'M-' + String(idProducto).padStart(3, '0');
}

// GET a un endpoint publico de api/ que devuelve JSON.
// Desde el AE3 los datos salen de MySQL a traves de PHP: los antiguos
// data/*.json se reemplazaron por api/productos.php y api/materias.php.
async function obtenerJson(url) {
  const respuesta = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!respuesta.ok) {
    throw new Error(`No se pudo consultar ${url} (HTTP ${respuesta.status})`);
  }

  return respuesta.json();
}

// POST con cuerpo JSON. Devuelve el codigo HTTP junto con el cuerpo de la
// respuesta, porque 400, 401 o 409 no son fallas de red sino respuestas
// que la interfaz tiene que mostrar.
async function enviarJson(url, datos) {
  const respuesta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(datos)
  });

  let cuerpo = {};
  try {
    cuerpo = await respuesta.json();
  } catch (error) {
    // Respuesta sin JSON (por ejemplo, un error de PHP): se deja vacia.
  }

  return { estado: respuesta.status, cuerpo };
}

/* =====================================================================
   SESION (AE3)
   Al cargar cualquier pagina se consulta el endpoint privado
   api/perfil.php: 200 = hay sesion; 401 = invitado. Con esa respuesta se
   alterna el DOM sin recargar la pagina.

   Marcado que usa este modulo:
     data-requiere-sesion  -> visible solo con sesion iniciada
     data-solo-invitado    -> visible solo sin sesion
     data-campo-sesion="x" -> recibe el campo x del perfil
     data-abrir-acceso     -> abre el panel en "login" o "registro"
     data-cerrar-sesion    -> boton de logout

   SEGURIDAD (XSS): todo dato que proviene del usuario o de la base se
   escribe con .textContent (o .value en los input), nunca con innerHTML.
   Asi, un alias o un nombre como <img src=x onerror=alert(1)> se muestra
   como texto literal: el navegador no lo interpreta como HTML.
   ===================================================================== */

// Devuelve el perfil del usuario de la sesion, o null si es un invitado.
async function consultarSesion() {
  try {
    const respuesta = await fetch('api/perfil.php', { headers: { Accept: 'application/json' } });

    if (respuesta.status === 401) {
      return null;
    }
    if (!respuesta.ok) {
      throw new Error(`api/perfil.php respondio HTTP ${respuesta.status}`);
    }
    return await respuesta.json();
  } catch (error) {
    // Sin servidor (file://) o con la base caida, la pagina se comporta
    // como para un invitado: nunca se muestran acciones privadas por error.
    console.error(error);
    return null;
  }
}

// Valor de un campo del perfil; nombre_completo es un campo derivado.
function valorCampoSesion(usuario, campo) {
  if (campo === 'nombre_completo') {
    return `${usuario.nombre} ${usuario.apellido}`;
  }
  return usuario[campo] ?? '';
}

function aplicarEstadoSesion(usuario) {
  const haySesion = usuario !== null;

  document.querySelectorAll('[data-requiere-sesion]').forEach(function (nodo) {
    nodo.hidden = !haySesion;
  });
  document.querySelectorAll('[data-solo-invitado]').forEach(function (nodo) {
    nodo.hidden = haySesion;
  });

  // Votar es una accion de usuario registrado (RN-03).
  document.querySelectorAll('.voto-btn').forEach(function (boton) {
    boton.disabled = !haySesion;
    boton.title = haySesion ? '' : 'Inicia sesion para votar';
  });

  // Renderizado seguro: textContent / value, nunca innerHTML.
  document.querySelectorAll('[data-campo-sesion]').forEach(function (nodo) {
    const valor = haySesion ? valorCampoSesion(usuario, nodo.dataset.campoSesion) : '';

    if (nodo instanceof HTMLInputElement) {
      nodo.value = valor;
    } else {
      nodo.textContent = valor;
    }
  });

  // El nombre completo como tooltip del saludo, por si el alias se recorta.
  document.querySelectorAll('.sesion-saludo').forEach(function (saludo) {
    saludo.title = haySesion ? valorCampoSesion(usuario, 'nombre_completo') : '';
  });
}

async function actualizarSesion() {
  const usuario = await consultarSesion();
  aplicarEstadoSesion(usuario);
  return usuario;
}

function iniciarSesionUsuario() {

  // --- Nodos de la pagina (se resuelven una sola vez) ---
  const panel = document.getElementById('panel-acceso');
  const mensaje = document.getElementById('mensaje-acceso');
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');
  const passwordRegistro = document.getElementById('registro-password');
  const confirmacion = document.getElementById('registro-confirmacion');
  const pestanas = panel.querySelectorAll('[data-pestana]');

  const formularios = { login: formLogin, registro: formRegistro };

  // Mensaje del panel. Los detalles (errores de validacion del servidor)
  // se agregan como <li> creados uno por uno con textContent.
  function mostrarMensaje(texto, tipo, detalles = []) {
    mensaje.textContent = texto;
    mensaje.classList.toggle('error', tipo === 'error');
    mensaje.classList.toggle('exito', tipo === 'exito');

    if (detalles.length > 0) {
      const lista = document.createElement('ul');
      detalles.forEach(function (detalle) {
        const item = document.createElement('li');
        item.textContent = detalle;
        lista.append(item);
      });
      mensaje.append(lista);
    }

    mensaje.hidden = false;
  }

  function ocultarMensaje() {
    mensaje.hidden = true;
    mensaje.replaceChildren();
  }

  function mostrarPestana(nombre) {
    pestanas.forEach(function (pestana) {
      pestana.setAttribute('aria-selected', String(pestana.dataset.pestana === nombre));
    });
    Object.entries(formularios).forEach(function ([clave, formulario]) {
      formulario.hidden = clave !== nombre;
    });
    formularios[nombre].querySelector('input').focus();
  }

  function abrirPanel(nombre) {
    ocultarMensaje();
    panel.hidden = false;
    mostrarPestana(nombre);
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cerrarPanel() {
    panel.hidden = true;
    ocultarMensaje();
  }

  // Deshabilita el boton de envio mientras la peticion esta en curso
  // para evitar envios duplicados.
  async function conBotonOcupado(formulario, tarea) {
    const boton = formulario.querySelector('button[type="submit"]');
    boton.disabled = true;
    try {
      await tarea();
    } catch (error) {
      console.error(error);
      mostrarMensaje('No se pudo conectar con el servidor. Verifica que XAMPP este iniciado.', 'error');
    } finally {
      boton.disabled = false;
    }
  }

  async function enviarLogin() {
    const datos = Object.fromEntries(new FormData(formLogin));
    const { estado, cuerpo } = await enviarJson('api/login.php', datos);

    if (estado === 200) {
      formLogin.reset();
      cerrarPanel();
      await actualizarSesion();
      return;
    }

    mostrarMensaje(cuerpo.error || `Error inesperado (HTTP ${estado}).`, 'error');
  }

  async function enviarRegistro() {
    const datos = Object.fromEntries(new FormData(formRegistro));
    delete datos.confirmacion; // solo se usa para validar en el cliente

    const { estado, cuerpo } = await enviarJson('api/registro.php', datos);

    if (estado === 201) {
      formRegistro.reset();
      mostrarPestana('login');
      document.getElementById('login-usuario').value = datos.alias_usuario;
      document.getElementById('login-password').focus();
      mostrarMensaje(cuerpo.mensaje, 'exito');
      return;
    }

    mostrarMensaje(cuerpo.error || `Error inesperado (HTTP ${estado}).`, 'error', cuerpo.detalles || []);
  }

  // --- Eventos ---

  // Delegacion en document: los botones que abren el panel estan en el
  // header y tambien dentro del contenido de algunas paginas.
  document.addEventListener('click', function (evento) {
    const abrir = evento.target.closest('[data-abrir-acceso]');
    if (abrir) {
      abrirPanel(abrir.dataset.abrirAcceso);
      return;
    }

    const cerrarSesion = evento.target.closest('[data-cerrar-sesion]');
    if (cerrarSesion) {
      cerrarSesion.disabled = true;
      enviarJson('api/logout.php', {})
        .catch(console.error)
        .finally(function () {
          cerrarSesion.disabled = false;
          actualizarSesion();
        });
    }
  });

  panel.querySelector('[data-cerrar-acceso]').addEventListener('click', cerrarPanel);

  pestanas.forEach(function (pestana) {
    pestana.addEventListener('click', function () {
      ocultarMensaje();
      mostrarPestana(pestana.dataset.pestana);
    });
  });

  panel.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      cerrarPanel();
    }
  });

  // La confirmacion de contrasena es una validacion solo de cliente.
  function validarConfirmacion() {
    confirmacion.setCustomValidity(
      confirmacion.value === passwordRegistro.value ? '' : 'Las contrasenas no coinciden.'
    );
  }
  passwordRegistro.addEventListener('input', validarConfirmacion);
  confirmacion.addEventListener('input', validarConfirmacion);

  // Los formularios llevan novalidate: el submit siempre llega a este
  // manejador, que muestra los avisos nativos con reportValidity().
  formLogin.addEventListener('submit', function (evento) {
    evento.preventDefault();
    ocultarMensaje();
    if (!formLogin.reportValidity()) {
      return;
    }
    conBotonOcupado(formLogin, enviarLogin);
  });

  formRegistro.addEventListener('submit', function (evento) {
    evento.preventDefault();
    ocultarMensaje();
    validarConfirmacion();
    if (!formRegistro.reportValidity()) {
      return;
    }
    conBotonOcupado(formRegistro, enviarRegistro);
  });

  actualizarSesion();
}
function iniciarCompra() {

  // --- Nodos de la pagina (se resuelven una sola vez) ---
  const formCompra = document.querySelector('.form-compra');
  const cuerpoCarrito = document.querySelector('.tabla-carrito tbody');
  const filasProducto = document.querySelectorAll('.fila-producto');
  const spanTotalPedido = document.getElementById('total-pedido');
  const estadoPrecios = document.getElementById('estado-precios');

  function recalcularFila(fila) {
    const precioUnitario = Number(fila.dataset.precio);

    const inputCantidad = fila.querySelector('.input-cantidad');
    const spanSubtotal = fila.querySelector('.subtotal-producto');
    const checkboxIncluir = fila.querySelector('input[type="checkbox"]');
    const botonRestar = fila.querySelector('[data-accion="restar"]');
    const botonSumar = fila.querySelector('[data-accion="sumar"]');
    const minimo = Number(inputCantidad.min) || 1;
    const maximo = inputCantidad.max ? Number(inputCantidad.max) : Infinity;

    let cantidad = Number(inputCantidad.value);
    if (Number.isNaN(cantidad) || cantidad < minimo) {
      cantidad = minimo;
    } else if (cantidad > maximo) {
      cantidad = maximo;
    }
    inputCantidad.value = cantidad;

    botonRestar.disabled = cantidad <= minimo;
    botonSumar.disabled = cantidad >= maximo;

    const subtotal = precioUnitario * cantidad;
    spanSubtotal.textContent = formatoMoneda.format(subtotal);

    return checkboxIncluir.checked ? subtotal : 0;
  }

  function recalcularTotalPedido() {
    const total = Array.from(filasProducto)
      .reduce((acumulado, fila) => acumulado + recalcularFila(fila), 0);

    spanTotalPedido.textContent = formatoMoneda.format(total);
  }

  function cambiarCantidad(fila, paso) {
    const inputCantidad = fila.querySelector('.input-cantidad');
    inputCantidad.value = Number(inputCantidad.value) + paso;
    recalcularTotalPedido();
  }

  async function actualizarPrecios() {
    try {
      const productos = await obtenerJson('api/productos.php');
      let cambios = 0;

      filasProducto.forEach(function (fila) {
        const idProducto = Number(fila.dataset.idProducto);
        const producto = productos.find(p => p.id_producto === idProducto);
        if (!producto) {
          return;
        }

        const spanPrecio = fila.querySelector('.precio-unitario');
        if (Number(fila.dataset.precio) !== producto.precio) {
          cambios++;
          spanPrecio.classList.add('precio-actualizado');
        }
        fila.dataset.precio = producto.precio;
        spanPrecio.textContent = formatearPrecio(producto.precio);
      });

      recalcularTotalPedido();
      estadoPrecios.classList.remove('error');
      estadoPrecios.textContent = cambios === 0
        ? 'Precios verificados: coinciden con los vigentes.'
        : `Se actualizaron ${cambios} precio(s) al valor vigente.`;
    } catch (error) {
      console.error(error);
      estadoPrecios.classList.add('error');
      estadoPrecios.textContent =
        'No se pudieron consultar los precios actualizados: se muestran los del listado.';
    }
  }
  cuerpoCarrito.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.btn-cantidad');
    if (!boton) {
      return;
    }
    const fila = boton.closest('.fila-producto');
    const paso = boton.dataset.accion === 'sumar' ? 1 : -1;
    cambiarCantidad(fila, paso);
  });

  // "input" en la cantidad y "change" en "Incluir" (AA13).
  filasProducto.forEach(function (fila) {
    const inputCantidad = fila.querySelector('.input-cantidad');
    const checkboxIncluir = fila.querySelector('input[type="checkbox"]');

    inputCantidad.addEventListener('input', recalcularTotalPedido);
    checkboxIncluir.addEventListener('change', recalcularTotalPedido);
  });

  
  formCompra.addEventListener('reset', function () {
    setTimeout(recalcularTotalPedido, 0);
  });

  recalcularTotalPedido();
  actualizarPrecios();
}
function iniciarCatalogo() {

  // --- Nodos de la pagina (se resuelven una sola vez) ---
  const formFiltros = document.getElementById('form-filtros');
  const inputTexto = document.getElementById('filtro-texto');
  const selectTipo = document.getElementById('filtro-tipo');
  const selectMateria = document.getElementById('filtro-materia');
  const grilla = document.getElementById('grid-materiales');
  const infoResultados = document.getElementById('info-resultados');
  const mensaje = document.getElementById('mensaje-catalogo');
  const plantilla = document.getElementById('plantilla-ficha');

  const SIN_MATERIA = 'sin-materia';


  let catalogo = [];

  function normalizar(texto) {
    return texto
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function mostrarMensaje(texto, esError) {
    mensaje.textContent = texto;
    mensaje.classList.toggle('error', esError);
    mensaje.hidden = false;
  }

  function ocultarMensaje() {
    mensaje.hidden = true;
  }

  // El JOIN productos ⋈ usuarios ⋈ materias ahora lo resuelve MySQL en
  // api/productos.php; aca solo se agregan los campos de presentacion.
  function prepararCatalogo(productos) {
    return productos.map(function (producto) {
      return {
        ...producto,
        codigo: codigoProducto(producto.id_producto),
        nombre_materia: producto.nombre_materia ?? 'Sin materia'
      };
    });
  }

  function cargarOpcionesTipo() {
    Object.entries(TIPOS_MATERIAL).forEach(function ([valor, etiqueta]) {
      selectTipo.add(new Option(etiqueta, valor));
    });
  }

  function cargarOpcionesMateria(materias) {
    materias
      .filter(m => catalogo.some(item => item.id_materia === m.id_materia))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
      .forEach(m => selectMateria.add(new Option(m.nombre, m.id_materia)));

    if (catalogo.some(item => item.id_materia === null)) {
      selectMateria.add(new Option('Sin materia', SIN_MATERIA));
    }
  }

  function cumpleCriterios(item, criterios) {
    const cumpleTexto = criterios.texto === '' ||
      [item.titulo, item.nombre_materia, item.alias_vendedor]
        .some(campo => normalizar(campo).includes(criterios.texto));

    const cumpleTipo = criterios.tipo === '' ||
      item.tipo_material === criterios.tipo;

    let cumpleMateria = true;
    if (criterios.materia === SIN_MATERIA) {
      cumpleMateria = item.id_materia === null;
    } else if (criterios.materia !== '') {
      cumpleMateria = item.id_materia === Number(criterios.materia);
    }

    return cumpleTexto && cumpleTipo && cumpleMateria;
  }

  function aplicarFiltros() {
    const criterios = {
      texto: normalizar(inputTexto.value),
      tipo: selectTipo.value,
      materia: selectMateria.value
    };

    const resultado = catalogo.filter(item => cumpleCriterios(item, criterios));

    mostrarResultado(resultado);
  }

  function crearFicha(item) {
    const ficha = plantilla.content.firstElementChild.cloneNode(true);

    ficha.querySelector('.card-portada').classList.add('portada-' + item.tipo_material);
    ficha.querySelector('.card-portada-texto').textContent = item.codigo;

    const etiqueta = ficha.querySelector('.etiqueta');
    etiqueta.classList.add(item.tipo_material);
    etiqueta.textContent = TIPOS_MATERIAL[item.tipo_material];

    ficha.querySelector('.card-titulo a').textContent = item.titulo;
    ficha.querySelector('.dato-materia').textContent = item.nombre_materia;
    ficha.querySelector('.dato-vendedor').textContent = item.alias_vendedor;
    ficha.querySelector('.precio').textContent = formatearPrecio(item.precio);

    return ficha;
  }

  function mostrarResultado(resultado) {
    // replaceChildren() borra las fichas anteriores e inserta las nuevas
    // en una sola operacion.
    grilla.replaceChildren(...resultado.map(crearFicha));

    infoResultados.textContent =
      `${resultado.length} de ${catalogo.length} materiales publicados`;

    if (resultado.length === 0) {
      mostrarMensaje('No hay material que coincida con la busqueda. Proba con otro texto o limpia los filtros.', false);
    } else {
      ocultarMensaje();
    }
  }

  // --- Paso 1: carga asincronica del catalogo completo ---
  async function cargarCatalogo() {
    try {
      const [productos, materias] = await Promise.all([
        obtenerJson('api/productos.php'),
        obtenerJson('api/materias.php')
      ]);

      catalogo = prepararCatalogo(productos);
      cargarOpcionesMateria(materias);
      aplicarFiltros();
    } catch (error) {
      console.error(error);
      infoResultados.textContent = 'Catalogo no disponible';
      formFiltros.querySelectorAll('input, select, button')
        .forEach(control => { control.disabled = true; });
      mostrarMensaje('No se pudo cargar el catalogo. Verifica que el sitio se abra desde XAMPP ' +
        '(Apache y MySQL iniciados) y no como archivo local.', true);
    }
  }


  inputTexto.addEventListener('input', aplicarFiltros);

 
  selectTipo.addEventListener('change', aplicarFiltros);
  selectMateria.addEventListener('change', aplicarFiltros);
  formFiltros.addEventListener('reset', function () {
    setTimeout(aplicarFiltros, 0);
  });

  // "submit": Enter dentro del buscador no debe recargar la pagina.
  formFiltros.addEventListener('submit', function (evento) {
    evento.preventDefault();
  });

  cargarOpcionesTipo();
  cargarCatalogo();
}
const MODULOS = {
  catalogo: iniciarCatalogo,
  comprar: iniciarCompra
};
document.addEventListener('DOMContentLoaded', function () {
  // La sesion se verifica en todas las paginas (AE3).
  iniciarSesionUsuario();

  const pagina = document.body.dataset.pagina;
  const iniciarPagina = MODULOS[pagina];

  if (iniciarPagina) {
    iniciarPagina();
  }
});
