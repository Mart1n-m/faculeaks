/* =====================================================================
   FacuLeaks - js/app.js
   Paradigmas de la Programacion 3 - AE2 "Startup Relampago"

   Unico archivo de comportamiento del sitio. Ningun HTML tiene
   atributos de evento (onclick, onsubmit, oninput...) ni <script>
   embebido: cada pagina solo declara <body data-pagina="..."> y carga
   este archivo con <script src="js/app.js" defer>.

   Requisito transversal de la consigna:
     - Desacoplamiento: los eventos se capturan con addEventListener().
     - Asincronia: los datos se obtienen con fetch() + async/await desde
       data/*.json, que son la exportacion de las tablas del esquema
       facuLeaks_ae2.sql (un archivo por tabla, mismas columnas).

   Organizacion del archivo:
     1. Constantes del modelo de datos
     2. Utilidades compartidas
     3. Acceso a datos (fetch)
     4. Modulos por pagina
     5. Arranque
   ===================================================================== */

'use strict';


/* ---------------------------------------------------------------------
   1. CONSTANTES DEL MODELO DE DATOS
   Dominios cerrados copiados de las restricciones CHECK del esquema.
   No se consultan por fetch porque no son tablas: son parte de la
   definicion de las columnas.
   --------------------------------------------------------------------- */

// chk_productos_tipo: valor almacenado -> etiqueta visible
const TIPOS_MATERIAL = {
  apunte: 'Apunte',
  libro: 'Libro',
  guia: 'Guia',
  pdf: 'PDF',
  otro: 'Otro'
};


/* ---------------------------------------------------------------------
   2. UTILIDADES COMPARTIDAS
   --------------------------------------------------------------------- */

// Formato de moneda argentino: punto de miles y sin decimales ("4.500").
const formatoMoneda = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 0
});

// 4500 -> "$4.500"
function formatearPrecio(importe) {
  return '$' + formatoMoneda.format(importe);
}

// El codigo visible del material no es una columna: se deriva de la
// clave primaria. id_producto = 4 -> "M-004".
function codigoProducto(idProducto) {
  return 'M-' + String(idProducto).padStart(3, '0');
}


/* ---------------------------------------------------------------------
   3. ACCESO A DATOS
   Cada tabla del esquema se obtiene con una peticion HTTP asincronica.
   El dia que exista backend, solo cambia la URL (por ejemplo
   "api/productos.php"): el resto del codigo no se entera.
   --------------------------------------------------------------------- */

// Devuelve una promesa con el arreglo de filas de la tabla pedida.
// Si el servidor responde con error (404, 500...), fetch() NO rechaza
// la promesa por si solo: por eso se controla respuesta.ok y se lanza
// el error a mano, para que lo capture el try/catch de quien llama.
async function obtenerTabla(nombreTabla) {
  const respuesta = await fetch(`data/${nombreTabla}.json`);

  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar ${nombreTabla}.json (HTTP ${respuesta.status})`);
  }

  return respuesta.json();
}


/* ---------------------------------------------------------------------
   4. MODULOS POR PAGINA
   Cada modulo es una funcion que se ejecuta solo en la pagina que le
   corresponde (ver la tabla MODULOS del punto 5).
   --------------------------------------------------------------------- */

/* 4.1 comprar.html - Subtotal y total del pedido (AA13, parte B)
   Captura el cambio de la cantidad de cada producto y recalcula, en
   tiempo real y sin recargar la pagina:
     - el subtotal de esa fila (precio unitario x cantidad)
     - el total del pedido (suma de los subtotales de los productos que
       siguen incluidos, es decir con el checkbox "Incluir" tildado)
   Este codigo estaba embebido al final de comprar.html y se traslado
   aca sin cambios de logica. */
function iniciarCompra() {

  // 1) Todas las filas de producto de la tabla del carrito.
  const filasProducto = document.querySelectorAll('.fila-producto');

  // 2) Nodo donde se inyecta el total del pedido (celda del tfoot).
  const spanTotalPedido = document.getElementById('total-pedido');

  // 3) Recalcula el subtotal de UNA fila de producto:
  //    - lee el precio unitario desde data-precio del <tr>
  //    - lee y valida la cantidad cargada por el usuario
  //    - actualiza el <span class="subtotal-producto"> de esa fila
  //    - devuelve el subtotal solo si el producto sigue incluido
  //      (checkbox tildado); si no, devuelve 0 para no sumarlo.
  function recalcularFila(fila) {
    const precioUnitario = Number(fila.dataset.precio);

    const inputCantidad = fila.querySelector('.input-cantidad');
    const spanSubtotal = fila.querySelector('.subtotal-producto');
    const checkboxIncluir = fila.querySelector('input[type="checkbox"]');

    // Limites declarados en el propio input (min/max del HTML). Si el
    // usuario borra el campo o carga un valor fuera de rango, se corrige
    // al limite mas cercano en vez de calcular con NaN.
    // detalla.cantidad es SMALLINT UNSIGNED con CHECK (cantidad > 0).
    const minimo = Number(inputCantidad.min) || 1;
    const maximo = inputCantidad.max ? Number(inputCantidad.max) : Infinity;

    let cantidad = Number(inputCantidad.value);
    if (Number.isNaN(cantidad) || cantidad < minimo) {
      cantidad = minimo;
    } else if (cantidad > maximo) {
      cantidad = maximo;
    }
    inputCantidad.value = cantidad;

    const subtotal = precioUnitario * cantidad;
    spanSubtotal.textContent = formatoMoneda.format(subtotal);

    return checkboxIncluir.checked ? subtotal : 0;
  }

  // 4) Recorre todas las filas, actualiza cada subtotal y escribe el
  //    total del pedido en la fila del tfoot.
  function recalcularTotalPedido() {
    let total = 0;

    filasProducto.forEach(function (fila) {
      total += recalcularFila(fila);
    });

    spanTotalPedido.textContent = formatoMoneda.format(total);
  }

  // 5) Captura de eventos, por cada fila:
  //    - "input" en la cantidad: recalculo mientras el usuario escribe.
  //    - "change" en el checkbox "Incluir": excluir o volver a incluir
  //      un producto tambien recalcula el total.
  filasProducto.forEach(function (fila) {
    const inputCantidad = fila.querySelector('.input-cantidad');
    const checkboxIncluir = fila.querySelector('input[type="checkbox"]');

    inputCantidad.addEventListener('input', recalcularTotalPedido);
    checkboxIncluir.addEventListener('change', recalcularTotalPedido);
  });

  // 6) Primer calculo, para que subtotales y total queden consistentes
  //    con los valores iniciales de los inputs.
  recalcularTotalPedido();
}


/* 4.2 listado_box.html - Buscador y filtro de catalogo en tiempo real
   AE2 - Opcion 3 (Martin Nahuel Mekekiuk)
   Escenario SOHDM "Explorar y buscar material de estudio":
     1. Al entrar, el catalogo completo se carga de forma asincronica
        con fetch() (tablas productos, usuarios y materias).
     2. Las tres tablas se combinan en memoria, igual que un SELECT con
        JOIN, y el resultado queda guardado en la variable "catalogo".
     3. Cada vez que el usuario escribe (evento "input") o cambia un
        selector (evento "change"), el catalogo se filtra con .filter()
        y las fichas se vuelven a generar en el DOM, sin recargar.  */
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

  // Valor especial del selector de materia para los productos cuya
  // id_materia es NULL (la columna lo admite: relacion CORRESPONDE
  // opcional del modelo).
  const SIN_MATERIA = 'sin-materia';

  // Catalogo completo en memoria. Se llena una unica vez con fetch();
  // despues, cada filtrado trabaja sobre este arreglo y no vuelve a
  // pedir nada al servidor.
  let catalogo = [];

  // --- Utilidades del modulo ---

  // Pasa a minusculas, quita tildes y espacios de los extremos, para
  // que "algebra", "Álgebra " y "ALGEBRA" coincidan entre si.
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

  // --- Paso 2: combinar las tablas (equivalente al JOIN) ---
  //   SELECT p.*, u.alias_usuario, m.nombre
  //   FROM productos p
  //        JOIN usuarios u      ON u.id_usuario = p.id_usuario
  //        LEFT JOIN materias m ON m.id_materia = p.id_materia
  // .map() produce una fila nueva por producto; .find() busca la fila
  // relacionada por clave foranea. Si la materia es NULL, find() no
  // encuentra nada y se usa el texto "Sin materia" (LEFT JOIN).
  function combinarTablas(productos, usuarios, materias) {
    return productos.map(function (producto) {
      const vendedor = usuarios.find(u => u.id_usuario === producto.id_usuario);
      const materia = materias.find(m => m.id_materia === producto.id_materia);

      return {
        ...producto,
        codigo: codigoProducto(producto.id_producto),
        alias_vendedor: vendedor ? vendedor.alias_usuario : '',
        nombre_materia: materia ? materia.nombre : 'Sin materia'
      };
    });
  }

  // --- Opciones de los selectores ---

  // Tipo de material: dominio del CHECK chk_productos_tipo.
  function cargarOpcionesTipo() {
    Object.entries(TIPOS_MATERIAL).forEach(function ([valor, etiqueta]) {
      selectTipo.add(new Option(etiqueta, valor));
    });
  }

  // Materia: solo las materias que tienen al menos un producto, en
  // orden alfabetico, mas "Sin materia" si algun producto no tiene.
  function cargarOpcionesMateria(materias) {
    materias
      .filter(m => catalogo.some(item => item.id_materia === m.id_materia))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
      .forEach(m => selectMateria.add(new Option(m.nombre, m.id_materia)));

    if (catalogo.some(item => item.id_materia === null)) {
      selectMateria.add(new Option('Sin materia', SIN_MATERIA));
    }
  }

  // --- Paso 3: filtrar ---

  // Devuelve true si el item cumple los TRES criterios a la vez (AND).
  // Un criterio vacio ("Todos", "Todas" o buscador en blanco) no filtra.
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

  // Lee los controles, filtra el catalogo en memoria y redibuja.
  function aplicarFiltros() {
    const criterios = {
      texto: normalizar(inputTexto.value),
      tipo: selectTipo.value,
      materia: selectMateria.value
    };

    const resultado = catalogo.filter(item => cumpleCriterios(item, criterios));

    mostrarResultado(resultado);
  }

  // --- Inyeccion en el DOM ---

  // Clona la <template> y completa sus nodos con textContent (nunca
  // con innerHTML, para no interpretar como HTML un dato del usuario).
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
      // Las tres peticiones salen en paralelo; Promise.all espera a que
      // terminen todas (o rechaza apenas una falla).
      const [productos, usuarios, materias] = await Promise.all([
        obtenerTabla('productos'),
        obtenerTabla('usuarios'),
        obtenerTabla('materias')
      ]);

      catalogo = combinarTablas(productos, usuarios, materias);
      cargarOpcionesMateria(materias);
      aplicarFiltros();
    } catch (error) {
      console.error(error);
      infoResultados.textContent = 'Catalogo no disponible';
      formFiltros.querySelectorAll('input, select, button')
        .forEach(control => { control.disabled = true; });
      mostrarMensaje('No se pudo cargar el catalogo. Verifica que el sitio se abra desde un servidor ' +
        '(XAMPP o Live Server) y no como archivo local.', true);
    }
  }

  // --- Captura de eventos (desacoplada del HTML) ---

  // "input": se dispara con cada tecla, pegado o borrado en el buscador.
  inputTexto.addEventListener('input', aplicarFiltros);

  // "change": se dispara al elegir otra opcion en un selector.
  selectTipo.addEventListener('change', aplicarFiltros);
  selectMateria.addEventListener('change', aplicarFiltros);

  // "reset": el navegador limpia los controles DESPUES de este evento,
  // por eso el filtrado se posterga al siguiente ciclo con setTimeout.
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


/* ---------------------------------------------------------------------
   5. ARRANQUE
   Cada HTML declara que pagina es con <body data-pagina="...">.
   La tabla MODULOS asocia ese nombre con la funcion que la inicializa;
   las paginas sin comportamiento propio simplemente no figuran.
   --------------------------------------------------------------------- */

const MODULOS = {
  catalogo: iniciarCatalogo,
  comprar: iniciarCompra
};

// Con el atributo defer el script se ejecuta cuando el HTML ya fue
// analizado, justo antes de DOMContentLoaded: todos los nodos existen.
document.addEventListener('DOMContentLoaded', function () {
  const pagina = document.body.dataset.pagina;
  const iniciarPagina = MODULOS[pagina];

  if (iniciarPagina) {
    iniciarPagina();
  }
});
