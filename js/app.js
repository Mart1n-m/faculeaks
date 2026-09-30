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

async function obtenerTabla(nombreTabla) {
  const respuesta = await fetch(`data/${nombreTabla}.json`);

  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar ${nombreTabla}.json (HTTP ${respuesta.status})`);
  }

  return respuesta.json();
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
      const productos = await obtenerTabla('productos');
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
  const pagina = document.body.dataset.pagina;
  const iniciarPagina = MODULOS[pagina];

  if (iniciarPagina) {
    iniciarPagina();
  }
});
