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


/* ---------------------------------------------------------------------
   5. ARRANQUE
   Cada HTML declara que pagina es con <body data-pagina="...">.
   La tabla MODULOS asocia ese nombre con la funcion que la inicializa;
   las paginas sin comportamiento propio simplemente no figuran.
   --------------------------------------------------------------------- */

const MODULOS = {
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
