'use strict';

/* =====================================================================
   FacuLeaks - Cliente SPA (AE4)

   Single Page Application en JavaScript Vanilla. index.html es la unica
   pagina: cada ruta (#/...) clona una plantilla <template>, la completa con
   datos que pide a la API REST de PHP mediante fetch() + async/await y la
   inserta en <main id="vista"> sin recargar.

   Secciones de este archivo:
     1. Configuracion y utilidades
     2. Cliente de la API REST
     3. Estado de la aplicacion (sesion y carrito)
     4. Sesion: login, registro y logout
     5. Router por hash
     6. Vistas del foro
     7. Vistas del Marketplace
     8. Votos
     9. Arranque

   SEGURIDAD (OWASP A03 - XSS): todo dato que proviene del usuario o de la
   base se escribe con .textContent (o .value en los input), nunca con
   innerHTML. Un titulo como <img src=x onerror=alert(1)> se muestra como
   texto literal: el navegador no lo interpreta como HTML.

   ACCESIBILIDAD (WCAG 2.1): al cambiar de vista se mueve el foco al titulo
   y se anuncia el cambio en una region aria-live="polite"; los resultados
   que llegan por fetch() se escriben en regiones aria-live o role="status".
   ===================================================================== */


/* =====================================================================
   1. CONFIGURACION Y UTILIDADES
   ===================================================================== */

// La vista vive en public/ y la API en api/, un nivel arriba (MVC desacoplado):
// el cliente solo se comunica con el servidor por HTTP + JSON.
const API = '../api/';

const TIPOS_MATERIAL = {
  apunte: 'Apunte',
  libro: 'Libro',
  guia: 'Guia',
  pdf: 'PDF',
  otro: 'Otro'
};

const CATEGORIAS = {
  apunte: 'Apunte',
  parcial: 'Parcial',
  final: 'Final',
  consulta: 'Consulta',
  recurso: 'Recurso'
};

// Secciones del foro: cada una filtra por una o mas categorias de la API.
const SECCIONES_FORO = {
  inicio: { titulo: 'Lo mas votado', categorias: [], publicar: '' },
  apuntes: { titulo: 'Apuntes', categorias: ['apunte'], publicar: 'apunte' },
  parciales: { titulo: 'Parciales y finales', categorias: ['parcial', 'final'], publicar: 'parcial' },
  consultas: { titulo: 'Consultas', categorias: ['consulta'], publicar: 'consulta' }
};

const MEDIOS_PAGO = {
  mercado_pago: 'Mercado Pago',
  transferencia: 'Transferencia bancaria',
  efectivo: 'Efectivo'
};

const MAX_CANTIDAD = 99;

const formatoEntero = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
const formatoDecimal = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// 4500 -> "$4.500" ; 1500.5 -> "$1.500,50"
function formatearPrecio(importe) {
  return '$' + (Number.isInteger(importe) ? formatoEntero : formatoDecimal).format(importe);
}

function codigoProducto(idProducto) {
  return 'M-' + String(idProducto).padStart(3, '0');
}

// "2026-09-27 18:10:00" (MySQL) -> { iso: "2026-09-27T18:10:00", texto: "27/09/2026" }
function formatearFecha(fechaMysql) {
  const [fecha, hora = '00:00:00'] = fechaMysql.split(' ');
  const [anio, mes, dia] = fecha.split('-');
  return { iso: `${fecha}T${hora}`, texto: `${dia}/${mes}/${anio}` };
}

// Minusculas y sin tildes, para comparar textos en el buscador.
function normalizar(texto) {
  return String(texto)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function resumir(texto, largo) {
  return texto.length > largo ? texto.slice(0, largo).trimEnd() + '...' : texto;
}

// Clona una plantilla de vista completa (DocumentFragment).
function clonarVista(idPlantilla) {
  return document.getElementById(idPlantilla).content.cloneNode(true);
}

// Clona una plantilla de un solo elemento (una ficha, una fila, un post).
function clonarElemento(idPlantilla) {
  return document.getElementById(idPlantilla).content.firstElementChild.cloneNode(true);
}

// Escribe un mensaje en un contenedor de estado. Los detalles (errores de
// validacion del servidor) se agregan como <li> creados con textContent.
function mostrarMensaje(nodo, texto, tipo = 'info', detalles = []) {
  if (!nodo) {
    return;
  }
  nodo.replaceChildren(document.createTextNode(texto));
  nodo.classList.toggle('error', tipo === 'error');
  nodo.classList.toggle('exito', tipo === 'exito');

  if (detalles.length > 0) {
    const lista = document.createElement('ul');
    detalles.forEach(function (detalle) {
      const item = document.createElement('li');
      item.textContent = detalle;
      lista.append(item);
    });
    nodo.append(lista);
  }
  nodo.hidden = false;
}

function ocultarMensaje(nodo) {
  if (nodo) {
    nodo.hidden = true;
    nodo.replaceChildren();
  }
}

// Agrega al final de un mensaje un enlace interno de la SPA.
function agregarEnlace(nodo, texto, href) {
  const enlace = document.createElement('a');
  enlace.href = href;
  enlace.textContent = texto;
  nodo.append(' ', enlace);
}

// Anuncio breve para lectores de pantalla (region aria-live="polite").
function anunciar(texto) {
  const region = document.getElementById('anuncio-vista');
  region.textContent = '';
  // El cambio en el siguiente ciclo garantiza que se lea aunque el texto se repita.
  setTimeout(function () { region.textContent = texto; }, 50);
}

// Completa un <select> con opciones creadas con new Option (sin innerHTML).
function cargarOpciones(select, opciones) {
  opciones.forEach(function ([valor, texto]) {
    select.add(new Option(texto, valor));
  });
}

// Mensaje generico ante un error de red o un 500.
const MENSAJE_SIN_SERVIDOR =
  'No se pudo conectar con el servidor. Verifica que XAMPP (Apache y MySQL) este iniciado.';


/* =====================================================================
   2. CLIENTE DE LA API REST
   Todas las peticiones pasan por llamarApi(): usa fetch() con async/await,
   envia y recibe JSON y devuelve el codigo HTTP junto con el cuerpo,
   porque 400, 401, 403, 404 o 409 no son fallas de red sino respuestas que
   la interfaz tiene que mostrar.
   ===================================================================== */

async function llamarApi(metodo, recurso, datos) {
  const opciones = {
    method: metodo,
    headers: { Accept: 'application/json' },
    credentials: 'same-origin'
  };

  if (datos !== undefined) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(datos);
  }

  const respuesta = await fetch(API + recurso, opciones);

  let cuerpo = {};
  try {
    cuerpo = await respuesta.json();
  } catch (error) {
    // Respuesta sin JSON (por ejemplo, un error fatal de PHP): se deja vacia.
  }

  // Si una operacion privada responde 401, la sesion vencio o se cerro en
  // el servidor: la interfaz vuelve al estado de invitado.
  if (respuesta.status === 401 && estado.usuario !== null && recurso !== 'login.php') {
    estado.usuario = null;
    aplicarEstadoSesion();
  }

  return { estado: respuesta.status, cuerpo };
}

// GET que exige 200: ante cualquier otro codigo lanza un error.
async function obtenerJson(recurso) {
  const { estado: codigo, cuerpo } = await llamarApi('GET', recurso);
  if (codigo !== 200) {
    const error = new Error(cuerpo.error || `HTTP ${codigo}`);
    error.codigo = codigo;
    throw error;
  }
  return cuerpo;
}

// Las materias casi no cambian: se piden una sola vez por carga de la SPA.
let materiasEnCache = null;
async function obtenerMaterias() {
  if (materiasEnCache === null) {
    materiasEnCache = await obtenerJson('materias.php');
  }
  return materiasEnCache;
}

function opcionesDeMaterias(materias) {
  return materias.map(m => [String(m.id_materia), m.nombre]);
}


/* =====================================================================
   3. ESTADO DE LA APLICACION
   ===================================================================== */

const estado = {
  usuario: null,      // perfil de api/perfil.php, o null si es invitado
  avisoPendiente: null // mensaje para mostrar en la proxima vista
};

function esModerador() {
  return estado.usuario !== null &&
    ['moderador', 'administrador'].includes(estado.usuario.rol);
}

// El usuario puede editar o borrar un contenido propio, o cualquiera si modera.
function puedeModificar(idAutor) {
  return estado.usuario !== null &&
    (estado.usuario.id_usuario === idAutor || esModerador());
}

// Deja un mensaje para la vista a la que se navega a continuacion.
function avisarEnLaProximaVista(texto, tipo = 'exito') {
  estado.avisoPendiente = { texto, tipo };
}

function mostrarAvisoPendiente(raiz) {
  if (estado.avisoPendiente === null) {
    return;
  }
  const nodo = raiz.querySelector('[data-mensaje]');
  mostrarMensaje(nodo, estado.avisoPendiente.texto, estado.avisoPendiente.tipo);
  anunciar(estado.avisoPendiente.texto);
  estado.avisoPendiente = null;
}

/* --- Carrito ---------------------------------------------------------
   El carrito es estado del cliente: un Map id_producto -> cantidad que se
   guarda en sessionStorage para no perderlo al recargar. Los precios no se
   guardan: se consultan a la API al mostrar el carrito y el servidor los
   vuelve a leer de la base al registrar la venta.
   -------------------------------------------------------------------- */

const CLAVE_CARRITO = 'faculeaks.carrito';

const carrito = {
  items: new Map(),

  cargar() {
    try {
      const guardado = JSON.parse(sessionStorage.getItem(CLAVE_CARRITO) || '[]');
      this.items = new Map(guardado.filter(([id, cantidad]) =>
        Number.isInteger(id) && Number.isInteger(cantidad) && cantidad > 0));
    } catch (error) {
      this.items = new Map();
    }
  },

  guardar() {
    try {
      sessionStorage.setItem(CLAVE_CARRITO, JSON.stringify([...this.items]));
    } catch (error) {
      // Sin almacenamiento (modo privado): el carrito vive solo en memoria.
    }
    actualizarContadorCarrito();
  },

  agregar(idProducto) {
    const actual = this.items.get(idProducto) || 0;
    this.items.set(idProducto, Math.min(actual + 1, MAX_CANTIDAD));
    this.guardar();
    return this.items.get(idProducto);
  },

  fijar(idProducto, cantidad) {
    this.items.set(idProducto, cantidad);
    this.guardar();
  },

  quitar(idProducto) {
    this.items.delete(idProducto);
    this.guardar();
  },

  vaciar() {
    this.items.clear();
    this.guardar();
  },

  unidades() {
    return [...this.items.values()].reduce((suma, cantidad) => suma + cantidad, 0);
  }
};

function actualizarContadorCarrito() {
  document.querySelectorAll('[data-cantidad-carrito]').forEach(function (nodo) {
    nodo.textContent = String(carrito.unidades());
  });
}


/* =====================================================================
   4. SESION (AE3, adaptado a la SPA)
   Al arrancar se consulta el endpoint privado api/perfil.php: 200 = hay
   sesion; 401 = invitado. Con esa respuesta se alterna el DOM.

   Marcado que usa este modulo:
     data-requiere-sesion  -> visible solo con sesion iniciada
     data-solo-invitado    -> visible solo sin sesion
     data-campo-sesion="x" -> recibe el campo x del perfil
     data-abrir-acceso     -> abre el panel en "login" o "registro"
     data-cerrar-sesion    -> boton de logout
   ===================================================================== */

// Devuelve el perfil del usuario de la sesion, o null si es un invitado.
async function consultarSesion() {
  try {
    const { estado: codigo, cuerpo } = await llamarApi('GET', 'perfil.php');
    return codigo === 200 ? cuerpo : null;
  } catch (error) {
    // Sin servidor o con la base caida, la interfaz se comporta como para
    // un invitado: nunca se muestran acciones privadas por error.
    console.error(error);
    return null;
  }
}

function valorCampoSesion(usuario, campo) {
  if (campo === 'nombre_completo') {
    return `${usuario.nombre} ${usuario.apellido}`;
  }
  return usuario[campo] ?? '';
}

function aplicarEstadoSesion() {
  const usuario = estado.usuario;
  const haySesion = usuario !== null;

  document.querySelectorAll('[data-requiere-sesion]').forEach(function (nodo) {
    nodo.hidden = !haySesion;
  });
  document.querySelectorAll('[data-solo-invitado]').forEach(function (nodo) {
    nodo.hidden = haySesion;
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
}

async function actualizarSesion() {
  estado.usuario = await consultarSesion();
  aplicarEstadoSesion();
  return estado.usuario;
}

// Abre el panel de login/registro desde cualquier modulo (se asigna al iniciarlo).
let abrirPanelAcceso = function () {};

function iniciarPanelAcceso() {
  const panel = document.getElementById('panel-acceso');
  const mensaje = document.getElementById('mensaje-acceso');
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');
  const passwordRegistro = document.getElementById('registro-password');
  const confirmacion = document.getElementById('registro-confirmacion');
  const pestanas = panel.querySelectorAll('[data-pestana]');
  const formularios = { login: formLogin, registro: formRegistro };

  // Elemento que abrio el panel: al cerrarlo, el foco vuelve ahi.
  let origenDelFoco = null;

  function mostrarPestana(nombre) {
    pestanas.forEach(function (pestana) {
      pestana.setAttribute('aria-selected', String(pestana.dataset.pestana === nombre));
    });
    // Se muestra el tabpanel que contiene al formulario de la pestana elegida.
    Object.entries(formularios).forEach(function ([clave, formulario]) {
      formulario.closest('[role="tabpanel"]').hidden = clave !== nombre;
    });
    formularios[nombre].querySelector('input').focus();
  }

  function abrirPanel(nombre, origen) {
    origenDelFoco = origen || null;
    ocultarMensaje(mensaje);
    panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    mostrarPestana(nombre);
  }

  function cerrarPanel() {
    panel.hidden = true;
    ocultarMensaje(mensaje);
    if (origenDelFoco && document.body.contains(origenDelFoco) && !origenDelFoco.hidden) {
      origenDelFoco.focus();
    } else {
      document.getElementById('vista').focus();
    }
  }

  // Deshabilita el boton de envio mientras la peticion esta en curso.
  async function conBotonOcupado(formulario, tarea) {
    const boton = formulario.querySelector('button[type="submit"]');
    boton.disabled = true;
    try {
      await tarea();
    } catch (error) {
      console.error(error);
      mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
    } finally {
      boton.disabled = false;
    }
  }

  async function enviarLogin() {
    const datos = Object.fromEntries(new FormData(formLogin));
    const { estado: codigo, cuerpo } = await llamarApi('POST', 'login.php', datos);

    if (codigo === 200) {
      formLogin.reset();
      panel.hidden = true;
      ocultarMensaje(mensaje);
      await actualizarSesion();
      anunciar(`Sesion iniciada como ${cuerpo.alias_usuario}.`);
      // La vista actual se vuelve a dibujar con las acciones del usuario.
      router.recargar();
      return;
    }

    mostrarMensaje(mensaje, cuerpo.error || `Error inesperado (HTTP ${codigo}).`, 'error');
  }

  async function enviarRegistro() {
    const datos = Object.fromEntries(new FormData(formRegistro));
    delete datos.confirmacion; // solo se usa para validar en el cliente

    const { estado: codigo, cuerpo } = await llamarApi('POST', 'registro.php', datos);

    if (codigo === 201) {
      formRegistro.reset();
      mostrarPestana('login');
      document.getElementById('login-usuario').value = datos.alias_usuario;
      document.getElementById('login-password').focus();
      mostrarMensaje(mensaje, cuerpo.mensaje, 'exito');
      return;
    }

    mostrarMensaje(mensaje, cuerpo.error || `Error inesperado (HTTP ${codigo}).`, 'error', cuerpo.detalles || []);
  }

  async function cerrarSesion(boton) {
    boton.disabled = true;
    try {
      await llamarApi('POST', 'logout.php', {});
    } catch (error) {
      console.error(error);
    } finally {
      boton.disabled = false;
    }
    estado.usuario = null;
    carrito.vaciar();
    aplicarEstadoSesion();
    anunciar('Sesion cerrada.');
    router.recargar();
  }

  // Delegacion en document: los botones que abren el panel estan en el
  // header y tambien dentro de las vistas que se dibujan despues.
  document.addEventListener('click', function (evento) {
    const abrir = evento.target.closest('[data-abrir-acceso]');
    if (abrir) {
      abrirPanel(abrir.dataset.abrirAcceso, abrir);
      return;
    }

    const salir = evento.target.closest('[data-cerrar-sesion]');
    if (salir) {
      cerrarSesion(salir);
    }
  });

  abrirPanelAcceso = abrirPanel;
  panel.querySelector('[data-cerrar-acceso]').addEventListener('click', cerrarPanel);

  pestanas.forEach(function (pestana) {
    pestana.addEventListener('click', function () {
      ocultarMensaje(mensaje);
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

  // Los formularios llevan novalidate: el submit siempre llega aca, que
  // muestra los avisos nativos con reportValidity().
  formLogin.addEventListener('submit', function (evento) {
    evento.preventDefault();
    ocultarMensaje(mensaje);
    if (formLogin.reportValidity()) {
      conBotonOcupado(formLogin, enviarLogin);
    }
  });

  formRegistro.addEventListener('submit', function (evento) {
    evento.preventDefault();
    ocultarMensaje(mensaje);
    validarConfirmacion();
    if (formRegistro.reportValidity()) {
      conBotonOcupado(formRegistro, enviarRegistro);
    }
  });
}


/* =====================================================================
   5. ROUTER POR HASH
   La ruta vive en location.hash (#/marketplace, #/publicacion/4...). Al
   cambiar, se busca la vista que corresponde, se dibuja en <main> y se
   mueve el foco a su titulo. Como solo cambia el hash, el navegador no
   recarga la pagina y los botones Atras/Adelante funcionan.
   ===================================================================== */

const RUTAS = [
  { patron: /^\/$/, vista: params => vistaForo('inicio', params) },
  { patron: /^\/apuntes$/, vista: params => vistaForo('apuntes', params) },
  { patron: /^\/parciales$/, vista: params => vistaForo('parciales', params) },
  { patron: /^\/consultas$/, vista: params => vistaForo('consultas', params) },
  { patron: /^\/publicacion\/(\d+)$/, vista: params => vistaPublicacion(params) },
  { patron: /^\/publicar$/, vista: params => vistaFormPublicacion(params) },
  { patron: /^\/publicacion\/(\d+)\/editar$/, vista: params => vistaFormPublicacion(params) },
  { patron: /^\/marketplace$/, vista: params => vistaMarketplace(params) },
  { patron: /^\/marketplace\/tabla$/, vista: params => vistaMarketplaceTabla(params) },
  { patron: /^\/producto\/(\d+)$/, vista: params => vistaProducto(params) },
  { patron: /^\/vender$/, vista: params => vistaFormProducto(params) },
  { patron: /^\/producto\/(\d+)\/editar$/, vista: params => vistaFormProducto(params) },
  { patron: /^\/carrito$/, vista: params => vistaCarrito(params) },
  { patron: /^\/mis-compras$/, vista: params => vistaMisCompras(params) }
];

// Seccion del menu principal que se marca como actual para cada ruta.
function seccionDeLaRuta(ruta) {
  if (ruta === '/') return 'inicio';
  const primera = ruta.split('/')[1];
  if (['apuntes', 'parciales', 'consultas'].includes(primera)) return primera;
  if (['marketplace', 'producto', 'vender', 'carrito', 'mis-compras'].includes(primera)) return 'marketplace';
  return '';
}

const router = {
  // Cada navegacion incrementa el turno. Una vista asincronica solo escribe
  // si su turno sigue vigente: si el usuario ya navego a otra ruta mientras
  // esperaba la respuesta del servidor, el resultado se descarta.
  turno: 0,
  primeraVez: true,

  leerRuta() {
    const hash = location.hash.replace(/^#/, '') || '/';
    const [ruta, consulta = ''] = hash.split('?');
    return { ruta: ruta || '/', query: new URLSearchParams(consulta) };
  },

  async navegar() {
    // Un hash que no empieza con "#/" es un ancla de la pagina (por ejemplo,
    // el enlace "Saltar al contenido"), no una ruta de la SPA.
    if (location.hash !== '' && !location.hash.startsWith('#/')) {
      return;
    }
    const turno = ++this.turno;
    const { ruta, query } = this.leerRuta();
    const coincidencia = RUTAS
      .map(r => ({ r, m: ruta.match(r.patron) }))
      .find(x => x.m !== null);

    const params = {
      id: coincidencia && coincidencia.m[1] ? Number(coincidencia.m[1]) : null,
      query,
      vigente: () => turno === this.turno
    };

    marcarSeccionActual(seccionDeLaRuta(ruta));
    document.getElementById('panel-acceso').hidden = true;

    try {
      if (coincidencia) {
        await coincidencia.r.vista(params);
      } else {
        vistaNoEncontrada('La direccion que abriste no existe en FacuLeaks.');
      }
    } catch (error) {
      console.error(error);
      if (params.vigente()) {
        vistaNoEncontrada(MENSAJE_SIN_SERVIDOR, 'No se pudo cargar la seccion');
      }
    }
  },

  recargar() {
    this.navegar();
  },

  ir(hash) {
    if (location.hash === hash) {
      this.recargar();
    } else {
      location.hash = hash;
    }
  }
};

function marcarSeccionActual(seccion) {
  document.querySelectorAll('.nav a[data-seccion]').forEach(function (enlace) {
    const actual = enlace.dataset.seccion === seccion;
    enlace.classList.toggle('activo', actual);
    if (actual) {
      enlace.setAttribute('aria-current', 'page');
    } else {
      enlace.removeAttribute('aria-current');
    }
  });
}

// Inserta la vista en <main>, actualiza el titulo del documento, mueve el
// foco al titulo de la vista y anuncia el cambio.
function montarVista(fragmento, titulo) {
  const main = document.getElementById('vista');
  main.replaceChildren(fragmento);
  document.title = `${titulo} - FacuLeaks`;
  aplicarEstadoSesion();
  actualizarContadorCarrito();
  mostrarAvisoPendiente(main);

  if (router.primeraVez) {
    // En la carga inicial no se roba el foco: el primer Tab llega al enlace
    // "Saltar al contenido", como en cualquier pagina.
    router.primeraVez = false;
    return main;
  }

  window.scrollTo(0, 0);
  const encabezado = main.querySelector('[data-titulo-vista]') || main;
  encabezado.focus();
  anunciar(`Pagina: ${titulo}`);
  return main;
}

// Si la vista exige sesion y no la hay, reemplaza su contenido por el aviso.
function exigirSesionEnVista(raiz) {
  if (estado.usuario !== null) {
    return true;
  }
  const contenedor = raiz.querySelector('[data-requiere-sesion-vista]');
  contenedor.replaceChildren(clonarVista('plantilla-requiere-sesion'));
  return false;
}

function vistaNoEncontrada(texto, titulo = 'Pagina no encontrada') {
  const vista = clonarVista('plantilla-no-encontrado');
  vista.querySelector('[data-titulo-vista]').textContent = titulo;
  mostrarMensaje(vista.querySelector('[data-mensaje]'), texto, 'error');
  montarVista(vista, titulo);
}


/* =====================================================================
   6. VISTAS DEL FORO
   ===================================================================== */

function rutaDeCategoria(categoria) {
  if (categoria === 'apunte') return '#/apuntes';
  if (categoria === 'parcial' || categoria === 'final') return '#/parciales';
  if (categoria === 'consulta') return '#/consultas';
  return '#/';
}

function tituloDeCategoria(categoria) {
  if (categoria === 'apunte') return 'Apuntes';
  if (categoria === 'parcial' || categoria === 'final') return 'Parciales y finales';
  if (categoria === 'consulta') return 'Consultas';
  return 'Inicio';
}

// Completa los botones de voto de una publicacion o un comentario.
function prepararVotos(contenedor, idContenido, puntaje, miVoto, descripcion) {
  contenedor.dataset.idContenido = String(idContenido);
  contenedor.querySelector('[data-puntaje]').textContent = String(puntaje);
  contenedor.querySelector('[data-puntaje]').setAttribute('aria-label', `Puntaje: ${puntaje}`);

  contenedor.querySelectorAll('[data-voto]').forEach(function (boton) {
    const valor = Number(boton.dataset.voto);
    boton.setAttribute('aria-label',
      `${valor === 1 ? 'Votar a favor de' : 'Votar en contra de'} ${descripcion}`);
    boton.setAttribute('aria-pressed', String(miVoto === valor));
  });
}

// Arma el <article class="post"> de una publicacion.
function crearPost(publicacion, enListado) {
  const post = clonarElemento('plantilla-post');

  prepararVotos(post.querySelector('[data-votos]'), publicacion.id_publicacion,
    publicacion.puntaje, publicacion.mi_voto, `"${publicacion.titulo}"`);

  const categoria = post.querySelector('[data-categoria]');
  categoria.classList.add(publicacion.categoria);
  categoria.textContent = CATEGORIAS[publicacion.categoria] ?? publicacion.categoria;

  const titulo = post.querySelector('[data-enlace-post]');
  titulo.textContent = publicacion.titulo;
  if (enListado) {
    titulo.href = `#/publicacion/${publicacion.id_publicacion}`;
  } else {
    // En el detalle el titulo no es un enlace a si mismo.
    titulo.replaceWith(document.createTextNode(publicacion.titulo));
  }

  const cuerpo = post.querySelector('[data-cuerpo]');
  cuerpo.textContent = enListado ? resumir(publicacion.cuerpo, 220) : publicacion.cuerpo;
  cuerpo.hidden = publicacion.cuerpo === '';
  if (!enListado) {
    cuerpo.classList.add('post-descripcion-completa');
  }

  post.querySelector('[data-autor]').textContent = publicacion.alias_autor;
  post.querySelector('[data-materia]').textContent = publicacion.nombre_materia;

  const cantidad = publicacion.cantidad_comentarios;
  post.querySelector('[data-comentarios]').textContent =
    cantidad === 1 ? '1 comentario' : `${cantidad} comentarios`;

  if (publicacion.archivo_nombre) {
    const adjunto = post.querySelector('[data-adjunto]');
    adjunto.textContent = `Adjunto: ${publicacion.archivo_nombre}`;
    adjunto.hidden = false;
  }

  const fecha = formatearFecha(publicacion.fecha_creacion);
  const time = post.querySelector('[data-fecha]');
  time.dateTime = fecha.iso;
  time.textContent = fecha.texto;

  return post;
}

// Inicio, Apuntes, Parciales y finales, Consultas.
async function vistaForo(clave, params) {
  const seccion = SECCIONES_FORO[clave];
  const vista = clonarVista('plantilla-foro');

  vista.querySelector('[data-titulo-vista]').textContent = seccion.titulo;
  vista.querySelector('[data-enlace-publicar]').href =
    seccion.publicar ? `#/publicar?categoria=${seccion.publicar}` : '#/publicar';

  const main = montarVista(vista, seccion.titulo);
  const form = main.querySelector('[data-filtros-foro]');
  const lista = main.querySelector('[data-lista-posts]');
  const info = main.querySelector('[data-info-resultados]');
  const mensaje = main.querySelector('[data-mensaje]');
  const selectMateria = form.elements.id_materia;

  async function cargarPublicaciones() {
    const filtros = new URLSearchParams();
    const texto = form.elements.q.value.trim();
    if (texto !== '') filtros.set('q', texto);
    if (selectMateria.value !== '') filtros.set('id_materia', selectMateria.value);
    filtros.set('orden', form.elements.orden.value);

    info.textContent = 'Cargando publicaciones...';

    // "Parciales y finales" agrupa dos categorias: se piden en paralelo.
    const categorias = seccion.categorias.length > 0 ? seccion.categorias : [''];
    const respuestas = await Promise.all(categorias.map(function (categoria) {
      const consulta = new URLSearchParams(filtros);
      if (categoria !== '') consulta.set('categoria', categoria);
      return obtenerJson(`publicaciones.php?${consulta}`);
    }));

    if (!params.vigente()) {
      return;
    }

    let publicaciones = respuestas.flat();
    if (respuestas.length > 1) {
      publicaciones.sort(form.elements.orden.value === 'recientes'
        ? (a, b) => b.fecha_creacion.localeCompare(a.fecha_creacion)
        : (a, b) => b.puntaje - a.puntaje || b.fecha_creacion.localeCompare(a.fecha_creacion));
    }

    lista.replaceChildren(...publicaciones.map(p => crearPost(p, true)));
    info.textContent = publicaciones.length === 1
      ? '1 publicacion'
      : `${publicaciones.length} publicaciones`;

    if (publicaciones.length === 0) {
      mostrarMensaje(mensaje, 'No hay publicaciones que coincidan con la busqueda.');
    } else if (!mensaje.classList.contains('exito')) {
      ocultarMensaje(mensaje);
    }
  }

  async function cargarConManejoDeErrores() {
    try {
      await cargarPublicaciones();
    } catch (error) {
      console.error(error);
      info.textContent = 'Publicaciones no disponibles';
      mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
    }
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    mensaje.classList.remove('exito');
    cargarConManejoDeErrores();
  });
  form.addEventListener('reset', function () {
    mensaje.classList.remove('exito');
    setTimeout(cargarConManejoDeErrores, 0);
  });
  form.elements.orden.addEventListener('change', cargarConManejoDeErrores);
  selectMateria.addEventListener('change', cargarConManejoDeErrores);

  try {
    cargarOpciones(selectMateria, opcionesDeMaterias(await obtenerMaterias()));
  } catch (error) {
    console.error(error);
  }
  await cargarConManejoDeErrores();
}

// Detalle de una publicacion con sus comentarios.
async function vistaPublicacion(params) {
  let publicacion;
  try {
    publicacion = await obtenerJson(`publicaciones.php?id=${params.id}`);
  } catch (error) {
    if (!params.vigente()) return;
    if (error.codigo === 404) {
      vistaNoEncontrada('La publicacion no existe o fue eliminada.', 'Publicacion no encontrada');
      return;
    }
    throw error;
  }
  if (!params.vigente()) return;

  const vista = clonarVista('plantilla-publicacion');
  const enlaceCategoria = vista.querySelector('[data-enlace-categoria]');
  enlaceCategoria.href = rutaDeCategoria(publicacion.categoria);
  enlaceCategoria.textContent = tituloDeCategoria(publicacion.categoria);
  vista.querySelector('[data-miga-actual]').textContent = resumir(publicacion.titulo, 40);
  vista.querySelector('[data-titulo-vista]').textContent = publicacion.titulo;
  vista.querySelector('[data-contenedor-post]').append(crearPost(publicacion, false));

  if (puedeModificar(publicacion.id_usuario)) {
    vista.querySelector('[data-acciones-autor]').hidden = false;
    vista.querySelector('[data-enlace-editar]').href = `#/publicacion/${publicacion.id_publicacion}/editar`;
  }

  const main = montarVista(vista, publicacion.titulo);
  const mensaje = main.querySelector('[data-mensaje]');

  // --- Eliminar la publicacion ---
  main.querySelector('[data-eliminar-publicacion]').addEventListener('click', async function (evento) {
    if (!confirm('¿Eliminar esta publicacion y todos sus comentarios? No se puede deshacer.')) {
      return;
    }
    const boton = evento.currentTarget;
    boton.disabled = true;
    try {
      const { estado: codigo, cuerpo } = await llamarApi('DELETE', `publicaciones.php?id=${publicacion.id_publicacion}`);
      if (codigo === 200) {
        avisarEnLaProximaVista('La publicacion se elimino.');
        router.ir(rutaDeCategoria(publicacion.categoria));
        return;
      }
      mostrarMensaje(mensaje, cuerpo.error || `Error inesperado (HTTP ${codigo}).`, 'error');
    } catch (error) {
      console.error(error);
      mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
    }
    boton.disabled = false;
  });

  iniciarComentarios(main, publicacion);
}

/* --- Comentarios --------------------------------------------------------
   El formulario tiene tres modos: comentario nuevo, respuesta a otro
   comentario (id_comentario_padre) o edicion de un comentario propio.
   ------------------------------------------------------------------------ */
function iniciarComentarios(main, publicacion) {
  const lista = main.querySelector('[data-lista-comentarios]');
  const sinComentarios = main.querySelector('[data-sin-comentarios]');
  const form = main.querySelector('[data-form-comentario]');
  const textarea = form.elements.texto;
  const etiqueta = main.querySelector('[data-etiqueta-comentario]');
  const respondiendo = main.querySelector('[data-respondiendo]');
  const respondiendoTexto = main.querySelector('[data-respondiendo-texto]');
  const botonEnviar = main.querySelector('[data-enviar-comentario]');
  const mensaje = main.querySelector('[data-mensaje-comentario]');

  let comentarios = publicacion.comentarios;
  let modo = { tipo: 'nuevo', id: null };

  function fijarModo(nuevoModo, comentario) {
    modo = nuevoModo;
    ocultarMensaje(mensaje);

    if (modo.tipo === 'nuevo') {
      respondiendo.hidden = true;
      etiqueta.textContent = 'Tu comentario';
      botonEnviar.textContent = 'Comentar';
      return;
    }

    respondiendo.hidden = false;
    if (modo.tipo === 'respuesta') {
      respondiendoTexto.textContent = `Respondiendo a ${comentario.alias_autor}.`;
      etiqueta.textContent = 'Tu respuesta';
      botonEnviar.textContent = 'Responder';
    } else {
      respondiendoTexto.textContent = 'Editando tu comentario.';
      etiqueta.textContent = 'Texto del comentario';
      botonEnviar.textContent = 'Guardar cambios';
      textarea.value = comentario.texto;
    }
    textarea.focus();
  }

  function crearComentario(comentario) {
    const item = clonarElemento('plantilla-comentario');
    item.querySelector('[data-autor]').textContent = comentario.alias_autor;
    item.querySelector('[data-texto]').textContent = comentario.texto;

    const fecha = formatearFecha(comentario.fecha_creacion);
    const time = item.querySelector('[data-fecha]');
    time.dateTime = fecha.iso;
    time.textContent = fecha.texto;

    if (comentario.id_comentario_padre !== null) {
      const padre = comentarios.find(c => c.id_comentario === comentario.id_comentario_padre);
      if (padre) {
        const enRespuesta = item.querySelector('[data-en-respuesta]');
        enRespuesta.textContent = `en respuesta a ${padre.alias_autor}`;
        enRespuesta.hidden = false;
        item.classList.add('comentario-respuesta');
      }
    }

    prepararVotos(item.querySelector('[data-votos]'), comentario.id_comentario,
      comentario.puntaje, comentario.mi_voto, `el comentario de ${comentario.alias_autor}`);

    const descripcion = `el comentario de ${comentario.alias_autor}`;
    const responder = item.querySelector('[data-responder]');
    responder.setAttribute('aria-label', `Responder ${descripcion}`);
    responder.addEventListener('click', () => fijarModo({ tipo: 'respuesta', id: comentario.id_comentario }, comentario));

    if (puedeModificar(comentario.id_usuario)) {
      const editar = item.querySelector('[data-editar-comentario]');
      const eliminar = item.querySelector('[data-eliminar-comentario]');
      editar.hidden = false;
      eliminar.hidden = false;
      editar.setAttribute('aria-label', `Editar ${descripcion}`);
      eliminar.setAttribute('aria-label', `Eliminar ${descripcion}`);
      editar.addEventListener('click', () => fijarModo({ tipo: 'edicion', id: comentario.id_comentario }, comentario));
      eliminar.addEventListener('click', () => eliminarComentario(comentario));
    }

    return item;
  }

  function dibujarComentarios() {
    lista.replaceChildren(...comentarios.map(crearComentario));
    sinComentarios.hidden = comentarios.length > 0;
    aplicarEstadoSesion();
  }

  async function recargarComentarios() {
    comentarios = await obtenerJson(`comentarios.php?id_publicacion=${publicacion.id_publicacion}`);
    dibujarComentarios();
  }

  async function eliminarComentario(comentario) {
    if (!confirm('¿Eliminar este comentario?')) {
      return;
    }
    try {
      const { estado: codigo, cuerpo } = await llamarApi('DELETE', `comentarios.php?id=${comentario.id_comentario}`);
      if (codigo === 200) {
        fijarModo({ tipo: 'nuevo', id: null });
        await recargarComentarios();
        anunciar('Comentario eliminado.');
        textarea.focus();
        return;
      }
      mostrarMensaje(mensaje, cuerpo.error || `Error inesperado (HTTP ${codigo}).`, 'error');
    } catch (error) {
      console.error(error);
      mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
    }
  }

  main.querySelector('[data-cancelar-respuesta]').addEventListener('click', function () {
    textarea.value = '';
    fijarModo({ tipo: 'nuevo', id: null });
    textarea.focus();
  });

  form.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    ocultarMensaje(mensaje);
    if (!form.reportValidity()) {
      return;
    }

    const texto = textarea.value.trim();
    let peticion;
    if (modo.tipo === 'edicion') {
      peticion = llamarApi('PUT', `comentarios.php?id=${modo.id}`, { texto });
    } else {
      const datos = { id_publicacion: publicacion.id_publicacion, texto };
      if (modo.tipo === 'respuesta') datos.id_comentario_padre = modo.id;
      peticion = llamarApi('POST', 'comentarios.php', datos);
    }

    botonEnviar.disabled = true;
    try {
      const { estado: codigo, cuerpo } = await peticion;
      if (codigo === 200 || codigo === 201) {
        const anuncio = codigo === 201 ? 'Comentario publicado.' : 'Comentario actualizado.';
        textarea.value = '';
        fijarModo({ tipo: 'nuevo', id: null });
        await recargarComentarios();
        mostrarMensaje(mensaje, anuncio, 'exito');
        return;
      }
      if (codigo === 401) {
        mostrarMensaje(mensaje, 'Tu sesion vencio. Volve a iniciar sesion para comentar.', 'error');
        return;
      }
      mostrarMensaje(mensaje, cuerpo.error || `Error inesperado (HTTP ${codigo}).`, 'error');
    } catch (error) {
      console.error(error);
      mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
    } finally {
      botonEnviar.disabled = false;
    }
  });

  fijarModo({ tipo: 'nuevo', id: null });
  dibujarComentarios();
}

// Alta (#/publicar) y edicion (#/publicacion/4/editar) de una publicacion.
async function vistaFormPublicacion(params) {
  const esEdicion = params.id !== null;
  const titulo = esEdicion ? 'Editar publicacion' : 'Nueva publicacion';
  const vista = clonarVista('plantilla-form-publicacion');

  vista.querySelector('[data-titulo-vista]').textContent = titulo;
  vista.querySelector('[data-miga-actual]').textContent = titulo;
  vista.querySelector('[data-enviar]').textContent = esEdicion ? 'Guardar cambios' : 'Publicar';

  if (!exigirSesionEnVista(vista)) {
    montarVista(vista, titulo);
    return;
  }

  const main = montarVista(vista, titulo);
  const form = main.querySelector('[data-form-publicacion]');
  const mensaje = main.querySelector('[data-mensaje]');
  const cancelar = main.querySelector('[data-enlace-cancelar]');

  cargarOpciones(form.elements.id_materia, opcionesDeMaterias(await obtenerMaterias()));
  if (!params.vigente()) return;

  if (esEdicion) {
    let publicacion;
    try {
      publicacion = await obtenerJson(`publicaciones.php?id=${params.id}`);
    } catch (error) {
      if (error.codigo === 404) {
        vistaNoEncontrada('La publicacion no existe o fue eliminada.', 'Publicacion no encontrada');
        return;
      }
      throw error;
    }
    if (!params.vigente()) return;

    if (!puedeModificar(publicacion.id_usuario)) {
      form.hidden = true;
      mostrarMensaje(main.querySelector('[data-requiere-sesion-vista]').appendChild(document.createElement('p')),
        'Solo el autor o un moderador puede editar esta publicacion.', 'error');
      return;
    }

    form.elements.titulo.value = publicacion.titulo;
    form.elements.cuerpo.value = publicacion.cuerpo;
    form.elements.categoria.value = publicacion.categoria;
    form.elements.id_materia.value = String(publicacion.id_materia);
    cancelar.href = `#/publicacion/${publicacion.id_publicacion}`;
  } else {
    const categoria = params.query.get('categoria');
    if (categoria && CATEGORIAS[categoria]) {
      form.elements.categoria.value = categoria;
      cancelar.href = rutaDeCategoria(categoria);
    }
  }

  form.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    ocultarMensaje(mensaje);
    if (!form.reportValidity()) {
      return;
    }

    const datos = {
      titulo: form.elements.titulo.value.trim(),
      cuerpo: form.elements.cuerpo.value.trim(),
      categoria: form.elements.categoria.value,
      id_materia: Number(form.elements.id_materia.value)
    };

    const boton = form.querySelector('[data-enviar]');
    boton.disabled = true;
    try {
      const { estado: codigo, cuerpo } = esEdicion
        ? await llamarApi('PUT', `publicaciones.php?id=${params.id}`, datos)
        : await llamarApi('POST', 'publicaciones.php', datos);

      if (codigo === 200 || codigo === 201) {
        avisarEnLaProximaVista(codigo === 201 ? 'Publicacion creada.' : 'Cambios guardados.');
        router.ir(`#/publicacion/${cuerpo.id_publicacion}`);
        return;
      }
      if (codigo === 401) {
        mostrarMensaje(mensaje, 'Tu sesion vencio. Volve a iniciar sesion para publicar.', 'error');
        return;
      }
      mostrarMensaje(mensaje, cuerpo.error || `Error inesperado (HTTP ${codigo}).`, 'error', cuerpo.detalles || []);
    } catch (error) {
      console.error(error);
      mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
    } finally {
      boton.disabled = false;
    }
  });
}


/* =====================================================================
   7. VISTAS DEL MARKETPLACE
   ===================================================================== */

// Agrega los campos de presentacion a un producto de la API.
function prepararProducto(producto) {
  return {
    ...producto,
    codigo: codigoProducto(producto.id_producto),
    nombre_materia: producto.nombre_materia ?? 'Sin materia'
  };
}

function crearFicha(item, idPlantilla) {
  const ficha = clonarElemento(idPlantilla);
  const href = `#/producto/${item.id_producto}`;

  const portada = ficha.querySelector('.card-portada');
  if (portada) {
    portada.classList.add('portada-' + item.tipo_material);
    ficha.querySelector('.card-portada-texto').textContent = item.codigo;
  }

  const etiqueta = ficha.querySelector('.etiqueta');
  etiqueta.classList.add(item.tipo_material);
  etiqueta.textContent = TIPOS_MATERIAL[item.tipo_material];

  const enlace = ficha.querySelector('[data-enlace-producto]');
  enlace.href = href;
  enlace.textContent = item.titulo;

  const boton = ficha.querySelector('[data-enlace-producto-boton]');
  boton.href = href;
  boton.setAttribute('aria-label', `Ver ficha de ${item.titulo}`);

  const materia = ficha.querySelector('.dato-materia');
  if (materia) {
    materia.textContent = item.nombre_materia;
    ficha.querySelector('.dato-vendedor').textContent = item.alias_vendedor;
  }
  ficha.querySelector('.precio').textContent = formatearPrecio(item.precio);

  return ficha;
}

/* --- Marketplace en fichas: AE2 Opcion 3 (Martin Mekekiuk) -------------
   Buscador y filtro del catalogo en tiempo real: el catalogo completo se
   pide una vez a la API y se filtra en memoria con .filter() cada vez que
   cambia un criterio.
   ------------------------------------------------------------------------ */
async function vistaMarketplace(params) {
  const vista = clonarVista('plantilla-marketplace');
  const main = montarVista(vista, 'Marketplace');

  const form = main.querySelector('[data-filtros-catalogo]');
  const inputTexto = form.elements.texto;
  const selectTipo = form.elements.tipo;
  const selectMateria = form.elements.materia;
  const grilla = main.querySelector('[data-grilla]');
  const info = main.querySelector('[data-info-resultados]');
  const mensaje = main.querySelector('[data-mensaje]');
  const SIN_MATERIA = 'sin-materia';
  let catalogo = [];

  function cumpleCriterios(item, criterios) {
    const cumpleTexto = criterios.texto === '' ||
      [item.titulo, item.nombre_materia, item.alias_vendedor]
        .some(campo => normalizar(campo).includes(criterios.texto));
    const cumpleTipo = criterios.tipo === '' || item.tipo_material === criterios.tipo;

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

    grilla.replaceChildren(...resultado.map(item => crearFicha(item, 'plantilla-ficha')));
    info.textContent = `${resultado.length} de ${catalogo.length} materiales publicados`;

    if (resultado.length === 0) {
      mostrarMensaje(mensaje, 'No hay material que coincida con la busqueda. Proba con otro texto o limpia los filtros.');
    } else if (!mensaje.classList.contains('exito')) {
      ocultarMensaje(mensaje);
    }
  }

  cargarOpciones(selectTipo, Object.entries(TIPOS_MATERIAL));
  inputTexto.addEventListener('input', aplicarFiltros);
  selectTipo.addEventListener('change', aplicarFiltros);
  selectMateria.addEventListener('change', aplicarFiltros);
  form.addEventListener('reset', () => setTimeout(aplicarFiltros, 0));
  form.addEventListener('submit', evento => evento.preventDefault());

  try {
    const [productos, materias] = await Promise.all([
      obtenerJson('productos.php'),
      obtenerMaterias()
    ]);
    if (!params.vigente()) return;

    catalogo = productos.map(prepararProducto);
    cargarOpciones(selectMateria, materias
      .filter(m => catalogo.some(item => item.id_materia === m.id_materia))
      .map(m => [String(m.id_materia), m.nombre]));
    if (catalogo.some(item => item.id_materia === null)) {
      selectMateria.add(new Option('Sin materia', SIN_MATERIA));
    }
    aplicarFiltros();
  } catch (error) {
    console.error(error);
    info.textContent = 'Catalogo no disponible';
    form.querySelectorAll('input, select, button').forEach(control => { control.disabled = true; });
    mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
  }
}

// Marketplace en tabla.
async function vistaMarketplaceTabla(params) {
  const vista = clonarVista('plantilla-marketplace-tabla');
  const main = montarVista(vista, 'Marketplace en tabla');
  const info = main.querySelector('[data-info-resultados]');
  const filas = main.querySelector('[data-filas]');

  try {
    const productos = (await obtenerJson('productos.php')).map(prepararProducto);
    if (!params.vigente()) return;

    filas.replaceChildren(...productos.map(function (item) {
      const fila = clonarElemento('plantilla-fila-producto');
      fila.querySelector('[data-codigo]').textContent = item.codigo;
      fila.querySelector('[data-titulo]').textContent = item.titulo;
      const tipo = fila.querySelector('[data-tipo]');
      tipo.classList.add(item.tipo_material);
      tipo.textContent = TIPOS_MATERIAL[item.tipo_material];
      fila.querySelector('[data-materia]').textContent = item.nombre_materia;
      fila.querySelector('[data-vendedor]').textContent = item.alias_vendedor;
      fila.querySelector('[data-precio]').textContent = formatearPrecio(item.precio);
      const enlace = fila.querySelector('[data-enlace-producto]');
      enlace.href = `#/producto/${item.id_producto}`;
      enlace.setAttribute('aria-label', `Ver ficha de ${item.titulo}`);
      return fila;
    }));
    info.textContent = productos.length === 1 ? '1 material publicado' : `${productos.length} materiales publicados`;
  } catch (error) {
    console.error(error);
    info.textContent = 'Catalogo no disponible';
    mostrarMensaje(main.querySelector('[data-mensaje]'), MENSAJE_SIN_SERVIDOR, 'error');
  }
}

// Ficha de un producto.
async function vistaProducto(params) {
  let producto;
  let catalogo;
  try {
    [producto, catalogo] = await Promise.all([
      obtenerJson(`productos.php?id=${params.id}`),
      obtenerJson('productos.php')
    ]);
  } catch (error) {
    if (!params.vigente()) return;
    if (error.codigo === 404) {
      vistaNoEncontrada('El material no existe o fue eliminado.', 'Material no encontrado');
      return;
    }
    throw error;
  }
  if (!params.vigente()) return;

  const item = prepararProducto(producto);
  const vista = clonarVista('plantilla-producto');

  vista.querySelector('[data-miga-actual]').textContent = item.codigo;
  vista.querySelector('[data-titulo-vista]').textContent = item.titulo;
  vista.querySelector('[data-portada]').classList.add('portada-' + item.tipo_material);
  vista.querySelectorAll('[data-codigo]').forEach(n => { n.textContent = item.codigo; });
  vista.querySelectorAll('[data-vendedor]').forEach(n => { n.textContent = item.alias_vendedor; });
  vista.querySelectorAll('[data-precio]').forEach(n => { n.textContent = formatearPrecio(item.precio); });
  vista.querySelector('[data-materia]').textContent = item.nombre_materia;
  vista.querySelector('[data-tipo-texto]').textContent = TIPOS_MATERIAL[item.tipo_material];
  const etiqueta = vista.querySelector('[data-tipo]');
  etiqueta.classList.add(item.tipo_material);
  etiqueta.textContent = TIPOS_MATERIAL[item.tipo_material];

  const esPropio = estado.usuario !== null && estado.usuario.id_usuario === item.id_usuario;
  vista.querySelector('[data-agregar-carrito]').hidden = estado.usuario === null || esPropio;
  vista.querySelector('[data-propio]').hidden = !esPropio;
  if (puedeModificar(item.id_usuario)) {
    vista.querySelector('[data-acciones-autor]').hidden = false;
    vista.querySelector('[data-enlace-editar]').href = `#/producto/${item.id_producto}/editar`;
  }

  const relacionados = catalogo
    .map(prepararProducto)
    .filter(p => p.tipo_material === item.tipo_material && p.id_producto !== item.id_producto)
    .slice(0, 3);
  if (relacionados.length > 0) {
    vista.querySelector('[data-bloque-relacionados]').hidden = false;
    vista.querySelector('[data-relacionados]')
      .replaceChildren(...relacionados.map(p => crearFicha(p, 'plantilla-ficha-mini')));
  }

  const main = montarVista(vista, item.titulo);
  const mensaje = main.querySelector('[data-mensaje]');

  main.querySelector('[data-agregar-carrito]').addEventListener('click', function () {
    const cantidad = carrito.agregar(item.id_producto);
    mostrarMensaje(mensaje, `Agregado al carrito (${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'}).`, 'exito');
    agregarEnlace(mensaje, 'Ir al carrito', '#/carrito');
  });

  main.querySelector('[data-eliminar-producto]').addEventListener('click', async function (evento) {
    if (!confirm('¿Eliminar este material del Marketplace? No se puede deshacer.')) {
      return;
    }
    const boton = evento.currentTarget;
    boton.disabled = true;
    try {
      const { estado: codigo, cuerpo } = await llamarApi('DELETE', `productos.php?id=${item.id_producto}`);
      if (codigo === 200) {
        carrito.quitar(item.id_producto);
        avisarEnLaProximaVista('El material se elimino del Marketplace.');
        router.ir('#/marketplace');
        return;
      }
      mostrarMensaje(mensaje, cuerpo.error || `Error inesperado (HTTP ${codigo}).`, 'error');
    } catch (error) {
      console.error(error);
      mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
    }
    boton.disabled = false;
  });
}

// Alta (#/vender) y edicion (#/producto/3/editar) de un producto.
async function vistaFormProducto(params) {
  const esEdicion = params.id !== null;
  const titulo = esEdicion ? 'Editar material' : 'Vender material';
  const vista = clonarVista('plantilla-form-producto');

  vista.querySelector('[data-titulo-vista]').textContent = titulo;
  vista.querySelector('[data-miga-actual]').textContent = titulo;
  vista.querySelector('[data-enviar]').textContent = esEdicion ? 'Guardar cambios' : 'Publicar en el Marketplace';

  if (!exigirSesionEnVista(vista)) {
    montarVista(vista, titulo);
    return;
  }

  const main = montarVista(vista, titulo);
  const form = main.querySelector('[data-form-producto]');
  const mensaje = main.querySelector('[data-mensaje]');

  cargarOpciones(form.elements.tipo_material, Object.entries(TIPOS_MATERIAL));
  cargarOpciones(form.elements.id_materia, opcionesDeMaterias(await obtenerMaterias()));
  if (!params.vigente()) return;

  if (esEdicion) {
    let producto;
    try {
      producto = await obtenerJson(`productos.php?id=${params.id}`);
    } catch (error) {
      if (error.codigo === 404) {
        vistaNoEncontrada('El material no existe o fue eliminado.', 'Material no encontrado');
        return;
      }
      throw error;
    }
    if (!params.vigente()) return;

    if (!puedeModificar(producto.id_usuario)) {
      form.hidden = true;
      mostrarMensaje(main.querySelector('[data-requiere-sesion-vista]').appendChild(document.createElement('p')),
        'Solo el vendedor o un moderador puede editar este material.', 'error');
      return;
    }

    form.elements.titulo.value = producto.titulo;
    form.elements.tipo_material.value = producto.tipo_material;
    form.elements.precio.value = String(producto.precio);
    form.elements.id_materia.value = producto.id_materia === null ? '' : String(producto.id_materia);
    main.querySelector('[data-enlace-cancelar]').href = `#/producto/${producto.id_producto}`;
  }

  form.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    ocultarMensaje(mensaje);
    if (!form.reportValidity()) {
      return;
    }

    const datos = {
      titulo: form.elements.titulo.value.trim(),
      precio: Number(form.elements.precio.value),
      tipo_material: form.elements.tipo_material.value,
      id_materia: form.elements.id_materia.value === '' ? null : Number(form.elements.id_materia.value)
    };

    const boton = form.querySelector('[data-enviar]');
    boton.disabled = true;
    try {
      const { estado: codigo, cuerpo } = esEdicion
        ? await llamarApi('PUT', `productos.php?id=${params.id}`, datos)
        : await llamarApi('POST', 'productos.php', datos);

      if (codigo === 200 || codigo === 201) {
        avisarEnLaProximaVista(codigo === 201 ? 'Material publicado en el Marketplace.' : 'Cambios guardados.');
        router.ir(`#/producto/${cuerpo.id_producto}`);
        return;
      }
      if (codigo === 401) {
        mostrarMensaje(mensaje, 'Tu sesion vencio. Volve a iniciar sesion.', 'error');
        return;
      }
      mostrarMensaje(mensaje, cuerpo.error || `Error inesperado (HTTP ${codigo}).`, 'error', cuerpo.detalles || []);
    } catch (error) {
      console.error(error);
      mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
    } finally {
      boton.disabled = false;
    }
  });
}

/* --- Carrito y compra: AE2 Opcion 7 (Augusto Piedrafita) ---------------
   Contador +/- de cantidades con subtotal por producto y total del pedido
   recalculados en el momento. Al confirmar, la compra se envia a
   api/ventas.php, que la registra en ventas + detalla.
   ------------------------------------------------------------------------ */
async function vistaCarrito(params) {
  const vista = clonarVista('plantilla-carrito');

  if (!exigirSesionEnVista(vista)) {
    montarVista(vista, 'Carrito');
    return;
  }

  const main = montarVista(vista, 'Carrito');
  const form = main.querySelector('[data-form-compra]');
  const vacio = main.querySelector('[data-carrito-vacio]');
  const cuerpoTabla = main.querySelector('[data-filas-carrito]');
  const celdaTotal = main.querySelector('[data-total]');
  const estadoPrecios = main.querySelector('[data-estado-precios]');
  const mensaje = main.querySelector('[data-mensaje]');
  let precios = new Map();

  function mostrarVacio() {
    form.hidden = true;
    vacio.hidden = false;
  }

  function recalcularFila(fila) {
    const idProducto = Number(fila.dataset.idProducto);
    const input = fila.querySelector('.input-cantidad');

    let cantidad = Math.trunc(Number(input.value));
    if (Number.isNaN(cantidad) || cantidad < 1) {
      cantidad = 1;
    } else if (cantidad > MAX_CANTIDAD) {
      cantidad = MAX_CANTIDAD;
    }
    input.value = String(cantidad);

    fila.querySelector('[data-accion="restar"]').disabled = cantidad <= 1;
    fila.querySelector('[data-accion="sumar"]').disabled = cantidad >= MAX_CANTIDAD;

    const subtotal = precios.get(idProducto) * cantidad;
    fila.querySelector('[data-subtotal]').textContent = formatearPrecio(subtotal);
    carrito.fijar(idProducto, cantidad);
    return subtotal;
  }

  function recalcularTotal() {
    const total = [...cuerpoTabla.querySelectorAll('.fila-producto')]
      .reduce((suma, fila) => suma + recalcularFila(fila), 0);
    celdaTotal.textContent = formatearPrecio(total);
  }

  function crearFila(item) {
    const fila = clonarElemento('plantilla-fila-carrito');
    fila.dataset.idProducto = String(item.id_producto);
    fila.querySelector('[data-codigo]').textContent = item.codigo;
    const enlace = fila.querySelector('[data-enlace-producto]');
    enlace.href = `#/producto/${item.id_producto}`;
    enlace.textContent = item.titulo;
    fila.querySelector('[data-precio]').textContent = formatearPrecio(item.precio);

    const input = fila.querySelector('.input-cantidad');
    input.id = `cantidad-${item.id_producto}`;
    input.value = String(carrito.items.get(item.id_producto));
    input.setAttribute('aria-label', `Cantidad de ${item.titulo}`);
    fila.querySelector('[data-accion="restar"]').setAttribute('aria-label', `Restar una unidad de ${item.titulo}`);
    fila.querySelector('[data-accion="sumar"]').setAttribute('aria-label', `Sumar una unidad de ${item.titulo}`);
    fila.querySelector('[data-quitar]').setAttribute('aria-label', `Quitar ${item.titulo} del carrito`);
    input.addEventListener('input', recalcularTotal);
    return fila;
  }

  if (carrito.items.size === 0) {
    mostrarVacio();
    return;
  }

  // Los precios vigentes se consultan a la API: el carrito solo guarda ids.
  estadoPrecios.textContent = 'Consultando precios actualizados...';
  let catalogo;
  try {
    catalogo = (await obtenerJson('productos.php')).map(prepararProducto);
  } catch (error) {
    console.error(error);
    estadoPrecios.classList.add('error');
    estadoPrecios.textContent = MENSAJE_SIN_SERVIDOR;
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }
  if (!params.vigente()) return;

  // Se descartan productos que ya no existen o que son del propio usuario.
  const items = catalogo.filter(p => carrito.items.has(p.id_producto) &&
    p.id_usuario !== estado.usuario.id_usuario);
  const descartados = carrito.items.size - items.length;
  [...carrito.items.keys()]
    .filter(id => !items.some(p => p.id_producto === id))
    .forEach(id => carrito.quitar(id));

  if (items.length === 0) {
    mostrarVacio();
    return;
  }

  precios = new Map(items.map(p => [p.id_producto, p.precio]));
  cuerpoTabla.replaceChildren(...items.map(crearFila));
  recalcularTotal();
  estadoPrecios.textContent = descartados === 0
    ? 'Precios verificados: son los vigentes.'
    : `Precios verificados. Se quitaron ${descartados} producto(s) que ya no estan disponibles.`;

  cuerpoTabla.addEventListener('click', function (evento) {
    const fila = evento.target.closest('.fila-producto');
    if (!fila) return;

    const botonCantidad = evento.target.closest('.btn-cantidad');
    if (botonCantidad) {
      const input = fila.querySelector('.input-cantidad');
      input.value = String(Number(input.value) + (botonCantidad.dataset.accion === 'sumar' ? 1 : -1));
      recalcularTotal();
      // Si el boton quedo deshabilitado (minimo o maximo), el foco pasa al input.
      if (botonCantidad.disabled) input.focus();
      return;
    }

    if (evento.target.closest('[data-quitar]')) {
      const titulo = fila.querySelector('[data-enlace-producto]').textContent;
      carrito.quitar(Number(fila.dataset.idProducto));
      fila.remove();
      anunciar(`Se quito ${titulo} del carrito.`);
      if (cuerpoTabla.children.length === 0) {
        mostrarVacio();
        vacio.querySelector('a').focus();
      } else {
        recalcularTotal();
        cuerpoTabla.querySelector('[data-quitar]').focus();
      }
    }
  });

  form.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    ocultarMensaje(mensaje);
    if (!form.reportValidity()) {
      return;
    }

    const datos = {
      medio_pago: form.elements.medio_pago.value,
      items: [...carrito.items].map(([id_producto, cantidad]) => ({ id_producto, cantidad }))
    };

    const boton = form.querySelector('button[type="submit"]');
    boton.disabled = true;
    try {
      const { estado: codigo, cuerpo } = await llamarApi('POST', 'ventas.php', datos);
      if (codigo === 201) {
        carrito.vaciar();
        avisarEnLaProximaVista(`Compra N.° ${cuerpo.id_venta} registrada por ${formatearPrecio(cuerpo.total)}.`);
        router.ir('#/mis-compras');
        return;
      }
      if (codigo === 401) {
        mostrarMensaje(mensaje, 'Tu sesion vencio. Volve a iniciar sesion para comprar.', 'error');
        return;
      }
      mostrarMensaje(mensaje, cuerpo.error || `Error inesperado (HTTP ${codigo}).`, 'error');
    } catch (error) {
      console.error(error);
      mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
    } finally {
      boton.disabled = false;
    }
  });
}

// Historial de compras del usuario.
async function vistaMisCompras(params) {
  const vista = clonarVista('plantilla-mis-compras');

  if (!exigirSesionEnVista(vista)) {
    montarVista(vista, 'Mis compras');
    return;
  }

  const main = montarVista(vista, 'Mis compras');
  const lista = main.querySelector('[data-lista-compras]');
  const mensaje = main.querySelector('[data-mensaje]');

  let compras;
  try {
    compras = await obtenerJson('ventas.php');
  } catch (error) {
    console.error(error);
    mostrarMensaje(mensaje, MENSAJE_SIN_SERVIDOR, 'error');
    return;
  }
  if (!params.vigente()) return;

  if (compras.length === 0 && mensaje.hidden) {
    mostrarMensaje(mensaje, 'Todavia no hiciste compras en el Marketplace.');
    agregarEnlace(mensaje, 'Ver el Marketplace', '#/marketplace');
    return;
  }

  lista.replaceChildren(...compras.map(function (venta) {
    const bloque = clonarElemento('plantilla-compra');
    const fecha = formatearFecha(venta.fecha);
    bloque.querySelector('[data-titulo-compra]').textContent = `Compra N.° ${venta.id_venta}`;
    bloque.querySelector('[data-datos-compra]').textContent =
      `${fecha.texto} · ${MEDIOS_PAGO[venta.medio_pago] ?? venta.medio_pago}`;
    bloque.querySelector('[data-caption]').textContent = `Detalle de la compra ${venta.id_venta}`;
    bloque.querySelector('[data-total]').textContent = formatearPrecio(venta.total);
    bloque.querySelector('[data-filas]').replaceChildren(...venta.detalle.map(function (renglon) {
      const fila = document.createElement('tr');
      const material = document.createElement('th');
      material.scope = 'row';
      const enlace = document.createElement('a');
      enlace.href = `#/producto/${renglon.id_producto}`;
      enlace.textContent = renglon.titulo;
      material.append(enlace);
      fila.append(material);
      [formatearPrecio(renglon.precio_unitario), String(renglon.cantidad), formatearPrecio(renglon.subtotal)]
        .forEach(function (texto) {
          const celda = document.createElement('td');
          celda.className = 'col-numerica';
          celda.textContent = texto;
          fila.append(celda);
        });
      return fila;
    }));
    return bloque;
  }));
}


/* =====================================================================
   8. VOTOS
   Un solo manejador para los botones de voto de publicaciones y
   comentarios (delegacion de eventos en <main>). Volver a pulsar el voto
   actual lo quita (valor 0).
   ===================================================================== */

function iniciarVotos() {
  document.getElementById('vista').addEventListener('click', async function (evento) {
    const boton = evento.target.closest('[data-voto]');
    if (!boton) {
      return;
    }

    if (estado.usuario === null) {
      // Los invitados no votan: se les ofrece iniciar sesion y, al cerrar
      // el panel, el foco vuelve al boton de voto.
      abrirPanelAcceso('login', boton);
      return;
    }

    const contenedor = boton.closest('[data-votos]');
    const yaVotado = boton.getAttribute('aria-pressed') === 'true';
    const valor = yaVotado ? 0 : Number(boton.dataset.voto);

    contenedor.querySelectorAll('[data-voto]').forEach(b => { b.disabled = true; });
    try {
      const { estado: codigo, cuerpo } = await llamarApi('POST', 'votos.php', {
        id_contenido: Number(contenedor.dataset.idContenido),
        valor
      });

      if (codigo === 200) {
        const puntaje = contenedor.querySelector('[data-puntaje]');
        puntaje.textContent = String(cuerpo.puntaje);
        puntaje.setAttribute('aria-label', `Puntaje: ${cuerpo.puntaje}`);
        contenedor.querySelectorAll('[data-voto]').forEach(function (b) {
          b.setAttribute('aria-pressed', String(Number(b.dataset.voto) === cuerpo.mi_voto));
        });
        anunciar(valor === 0
          ? `Voto quitado. Puntaje: ${cuerpo.puntaje}.`
          : `Voto registrado. Puntaje: ${cuerpo.puntaje}.`);
      } else if (codigo === 401) {
        anunciar('Tu sesion vencio. Volve a iniciar sesion para votar.');
      } else {
        anunciar(cuerpo.error || 'No se pudo registrar el voto.');
      }
    } catch (error) {
      console.error(error);
      anunciar(MENSAJE_SIN_SERVIDOR);
    } finally {
      contenedor.querySelectorAll('[data-voto]').forEach(b => { b.disabled = false; });
      boton.focus();
    }
  });
}


/* =====================================================================
   9. ARRANQUE
   ===================================================================== */

document.addEventListener('DOMContentLoaded', async function () {
  carrito.cargar();
  iniciarPanelAcceso();
  iniciarVotos();

  // "Saltar al contenido": mueve el foco a <main> sin cambiar la ruta.
  document.querySelector('.saltar-contenido').addEventListener('click', function (evento) {
    evento.preventDefault();
    document.getElementById('vista').focus();
  });

  // Primero se conoce la sesion, despues se dibuja la primera vista.
  await actualizarSesion();
  window.addEventListener('hashchange', () => router.navegar());
  router.navegar();
});
