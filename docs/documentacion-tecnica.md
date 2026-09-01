# Documentación técnica

## 1. Panorama general

FacuLeaks es una aplicación web estática de múltiples páginas (MPA). Cada vista es un
documento HTML independiente que comparte encabezado, pie, hojas de estilo y la misma
pila de scripts. No hay enrutador de cliente ni proceso de compilación: los archivos
se sirven tal cual.

La separación de capas y su justificación están en [`arquitectura.md`](arquitectura.md);
el modelo de datos, en [`modelo-conceptual.md`](modelo-conceptual.md). Este documento
describe **cómo está hecho cada módulo**.

---

## 2. Arranque de una página

Cada documento declara qué módulo debe ejecutarse:

```html
<body data-pagina="materia" data-nav="carreras">
```

`assets/js/app.js` es lo último que se carga y hace tres cosas:

1. Monta el encabezado (`FL.encabezado.montar(data-nav)`) y el pie (`FL.pie.montar()`).
2. Busca `FL.paginas[data-pagina]` y ejecuta su `init()`.
3. Captura cualquier excepción o promesa rechazada y muestra un aviso de error en
   pantalla en lugar de dejar la vista en blanco.

Ese atributo es **el único acoplamiento entre el HTML y el JavaScript**: no hay
manejadores en línea (`onclick=`) ni lógica dentro de los documentos.

### Orden de carga de scripts

El orden es significativo y es idéntico en las 13 páginas:

```
data/dataset.js        → debe existir antes que repositorio.js
utils/*.js             → dom, formato, almacenamiento, validacion
services/repositorio   → origen de datos
services/*Service.js   → dominio (dependen del repositorio)
components/*.js        → dependen de utils y de los servicios
pages/<vista>.js       → registra FL.paginas.<vista>
app.js                 → arranca
```

Si se agrega un archivo hay que añadirlo a la lista `SCRIPTS` de
`database/tools/generar_html.py` y regenerar las páginas, para que las 13 queden
sincronizadas.

---

## 3. Módulos

### 3.1 Utilidades (`assets/js/utils/`)

| Archivo | API principal | Notas |
|---------|---------------|-------|
| `dom.js` | `uno`, `todos`, `crear`, `renderizar`, `escapar`, `delegar`, `retardar`, `parametros`, `urlCon`, `esqueletos`, `vacio` | `crear(etiqueta, atributos, hijos)` construye nodos: `clase`, `texto`, `html`, `dataset` y `onEvento` son claves especiales |
| `formato.js` | `fechaCorta`, `fechaHora`, `relativa`, `numero`, `puntaje`, `pluralizar`, `truncar`, `tamano`, `parrafos`, `normalizar`, `iniciales` | `aFecha` interpreta el formato `YYYY-MM-DD HH:MM:SS` de MySQL |
| `almacenamiento.js` | `leer`, `escribir`, `borrar`, `limpiarTodo`, `siguienteId` | Único acceso a `localStorage` |
| `validacion.js` | `REGLAS`, `validar`, `mostrarErrores`, `email`, `username`, `password`… | Reglas espejo de las restricciones de la base de datos |

Todo texto que proviene de datos se inserta con `textContent` (a través de la clave
`texto` de `dom.crear`), nunca con `innerHTML`. Es la razón por la que la aplicación
no es vulnerable a inyección de HTML aunque el contenido lo escriban los usuarios.

### 3.2 Capa de datos (`assets/js/services/repositorio.js`)

Expone cinco operaciones y ninguna regla de negocio:

```js
FL.repositorio.obtener(coleccion)                    // Promise<Array>
FL.repositorio.obtenerSync(coleccion)                // Array (uso interno)
FL.repositorio.insertar(coleccion, registro)         // Promise<Object>
FL.repositorio.actualizar(coleccion, criterio, cambios)
FL.repositorio.eliminar(coleccion, criterio)
```

Al inicializarse construye el estado combinando:

1. `FL.dataset` (dataset embebido, de solo lectura), y
2. las altas del usuario guardadas en `localStorage` (usuarios, relación `estudia`,
   contenidos, publicaciones, comentarios y reportes),
3. más los votos y favoritos del usuario en sesión, que se fusionan sobre las
   colecciones correspondientes.

Las colecciones son exactamente las 12 tablas del modelo. Las que corresponden a
relaciones N:M (`estudia`, `carreraMateria`, `votos`, `favoritos`, `reportes`) **no tienen
clave subrogada**: se identifican por el par de participantes, igual que en la base. Por
eso `actualizar` y `eliminar` aceptan como criterio tanto un identificador simple como un
objeto con los campos que forman la clave:

```js
FL.repositorio.actualizar('publicaciones', 12, { titulo: 'Nuevo' });
FL.repositorio.actualizar('reportes', { usuarioId: 4, contenidoId: 26 }, { estado: 'resuelto' });
```

Los identificadores generados en el navegador arrancan en 1001, por encima del máximo
del dataset, para que nunca colisionen ni con los mocks ni con los IDs de MySQL.

### 3.3 Servicios de dominio

| Servicio | Interfaz pública |
|----------|------------------|
| `sesionService` | `usuarioActual`, `autenticado`, `rol`, `puede`, `esAutor`, `iniciarSesion`, `cerrarSesion`, `registrar`, `simularRol` |
| `carrerasService` | `getCarreras`, `getCarreraById`, `getMateriasByCarrera`, `getMateriaById`, `getCarrerasDeMateria`, `getProgramasByMateria`, `getProgramas`, `getResumenGlobal` |
| `publicacionesService` | `getCategorias`, `getPublicaciones`, `getPublicacionById`, `createPublicacion`, `updatePublicacion`, `deletePublicacion`, `registrarVisita` |
| `comentariosService` | `getComentarios`, `getComentariosPlanos`, `createComentario`, `deleteComentario` |
| `interaccionesService` | `voteContenido`, `votePublicacion`, `voteComentario`, `getVotoUsuario`, `toggleFavorito`, `esFavorito`, `getFavoritos`, `createReporte`, `getReportes`, `resolverReporte` |
| `usuariosService` | `getUsuarios`, `getUsuarioById`, `getUsuarioByUsername`, `getPerfilAcademico`, `getEstadisticasUsuario`, `updateUsuario`, `cambiarEstado`, `cambiarRol`, `getRoles` |

**Esta interfaz es el contrato con TP2 y debe permanecer estable.** Los detalles del
cambio están en [`roadmap-backend.md`](roadmap-backend.md).

Tres funciones concentran la lógica no trivial:

- `publicacionesService.decorar()` **une la fila del supertipo `CONTENIDO` con la del
  subtipo `PUBLICACIÓN`** y resuelve autor, categoría, carrera, materia, puntaje, cantidad
  de comentarios y adjunto. Es la contrapartida en JavaScript de la vista SQL
  `v_publicaciones_detalle`; en TP3 la reemplaza esa vista y el método desaparece.
  `comentariosService.decorar()` hace lo propio con el subtipo `COMENTARIO`.
- `comentariosService.getComentarios()` convierte la lista plana en un árbol de dos
  niveles resolviendo la autorreferencia `comentario_padre_id`.
- `interaccionesService.voteContenido()` es el único camino de votación: publicaciones y
  comentarios pasan por él porque `VOTA` apunta al supertipo. `votePublicacion` y
  `voteComentario` son envoltorios de una línea que se conservan para no romper el
  contrato que ya usaban las páginas.

### 3.4 Componentes (`assets/js/components/`)

| Componente | Qué encapsula |
|------------|---------------|
| `encabezado.js` | Marca, navegación (filtrada por permisos), menú de usuario y botón de menú móvil |
| `pie.js` | Pie de página y selector de rol de demostración |
| `migas.js` | Ruta de navegación (`breadcrumbs`) con `aria-current="page"` |
| `tarjetaPublicacion.js` | Tarjeta de publicación, control de votos y botón de favorito |
| `tarjetaCarrera.js` | Tarjeta de carrera y malla curricular agrupada por año |
| `paginacion.js` | Control de paginación accesible |
| `modal.js` | Diálogo modal con foco atrapado, cierre con Escape y retorno del foco |
| `avisos.js` | Notificaciones flotantes sobre una región `aria-live` |

El control de votos y el botón de favorito viven en `tarjetaPublicacion` y se reutilizan
tal cual en la vista de detalle: ninguna página duplica esa lógica.

### 3.5 Páginas (`assets/js/pages/`)

Un módulo por vista, todos con la misma forma:

```js
FL.paginas.<nombre> = (function () {
  'use strict';
  var estado = { … };          // filtros, paginación, entidad actual
  function pintarX() { … }     // render de una sección
  function conectarY() { … }   // suscripción de eventos
  function init() { … }        // devuelve una promesa
  return { init: init };
})();
```

---

## 4. Datos simulados

### 4.1 Contenido

| Colección | Registros | Colección | Registros |
|-----------|-----------|-----------|-----------|
| roles | 4 | contenidos | 169 |
| usuarios | 14 | · publicaciones | 40 |
| estudia | 14 | · comentarios | 129 |
| carreras | 13 | votos | 436 |
| materias | 43 | favoritos | 55 |
| carrera_materia | 74 | reportes | 7 |
| programas | 72 | categorías (catálogo) | 7 |

`contenidos` es la suma de los dos subtipos, con `id_contenido` como secuencia compartida:
las publicaciones ocupan 1-40 y los comentarios 41-169.

23 de las 43 materias se dictan en más de una carrera, que es el caso que justifica que la
relación `SE DICTA EN` sea N:M.

### 4.2 Fuente única

`database/tools/generar_datos.py` emite, a partir de una misma estructura en memoria:

- `data/*.json` — un archivo por colección, más el catálogo de categorías;
- `assets/js/data/dataset.js` — el mismo contenido como objeto JavaScript;
- `database/seed.sql` — los `INSERT` equivalentes.

Los tres artefactos no pueden divergir porque se generan juntos. Para modificar los
datos se edita el generador y se ejecuta:

```bash
python3 database/tools/generar_datos.py
```

Las cadenas se declaran en el generador sin tildes para que las claves internas sean
ASCII, y se acentúan en un paso final que actúa solo sobre los campos de texto
visibles. La base es `utf8mb4`, de modo que SQL, JSON y HTML comparten exactamente las
mismas cadenas.

### 4.3 Datos ficticios

Todos los usuarios, publicaciones, comentarios y programas son inventados. El campo
`password_hash` contiene una cadena de relleno con formato de hash pero sin valor
criptográfico: **en TP1 no se almacenan contraseñas**. En TP2 lo generará
`password_hash()` de PHP.

`categorias.json` no es una tabla: es el dominio del atributo `categoria` de
`PUBLICACIÓN`. Se emite para que la interfaz pueda mostrar el nombre y la descripción de
cada valor del ENUM.

---

## 5. Uso de `localStorage`

Todas las claves llevan el prefijo `faculeaks:` y se leen y escriben únicamente a
través de `FL.almacenamiento`.

| Clave | Contenido | Escrita por |
|-------|-----------|-------------|
| `sesion` | `{ idUsuario, fecha }` | `sesionService` |
| `usuarios` | Cuentas creadas desde el registro | `repositorio` |
| `estudia` | Carreras asociadas a esas cuentas | `repositorio` |
| `contenidos` | Filas del supertipo creadas en el navegador | `repositorio` |
| `publicaciones` | Filas del subtipo `PUBLICACIÓN` | `repositorio` |
| `comentarios` | Filas del subtipo `COMENTARIO` | `repositorio` |
| `reportes` | Reportes enviados | `repositorio` |
| `votos` | `{ idContenido: -1 \| 0 \| 1 }` — una sola estructura | `interaccionesService` |
| `favoritos` | `[idPublicacion, …]` | `interaccionesService` |
| `secuencias` | Contadores de IDs locales | `almacenamiento` |

`FL.almacenamiento.limpiarTodo()` restablece la demostración al estado del seed.

El módulo degrada con elegancia: si `localStorage` no está disponible (modo privado,
cuota agotada), guarda en memoria y la aplicación sigue funcionando durante la sesión.

---

## 6. Validaciones

Reglas definidas en `utils/validacion.js`, alineadas con las restricciones SQL:

| Campo | Regla | Restricción equivalente en la base |
|-------|-------|------------------------------------|
| `username` | 3–30 caracteres, `[a-zA-Z0-9._-]`, único | `VARCHAR(30)`, `UNIQUE`, `CHECK` de longitud |
| `email` | Formato válido, ≤120, único | `VARCHAR(120)`, `UNIQUE`, `CHECK` de formato |
| `password` | ≥8 caracteres, letras y números | Se valida en el servidor en TP2 |
| Título de publicación | 5–180 caracteres | `VARCHAR(180)`, `CHECK (CHAR_LENGTH(titulo) >= 5)` |
| Contenido | 20–5000 caracteres | `TEXT NOT NULL` |
| Comentario | 5–2000 caracteres | `TEXT NOT NULL` |
| Año de ingreso | 1950 – año actual + 1 | `CHECK (anio_ingreso BETWEEN 1950 AND 2100)` |
| Categoría | Obligatoria, valor del dominio cerrado | `categoria` ENUM NOT NULL |
| Carrera de la publicación | Obligatoria | `carrera_id NOT NULL` |
| Voto | Solo `1` o `-1`, uno por usuario y contenido | `CHECK (valor IN (-1,1))` + clave primaria `(usuario_id, contenido_id)` |
| Reporte | Uno por usuario y contenido | Clave primaria `(usuario_id, contenido_id)` |

Mecánica de presentación de errores: cada control lleva `data-campo="<nombre>"` y un
elemento hermano con `id="<idDelControl>-error"`. `FL.validacion.mostrarErrores()`
marca `aria-invalid="true"`, escribe el mensaje y devuelve el primer control inválido
para llevarle el foco.

**La validación de cliente es de conveniencia, no de seguridad.** El servidor de TP2
debe revalidar todo.

---

## 7. Navegación

| Vista | Parámetros | Origen habitual |
|-------|-----------|-----------------|
| `index.html` | — | Marca del encabezado |
| `carreras.html` | — | Navegación |
| `carrera.html` | `id` | Tarjeta de carrera |
| `materia.html` | `id` | Malla curricular |
| `publicacion.html` | `id` | Cualquier tarjeta de publicación |
| `crear-publicacion.html` | `carrera`, `materia` (opcionales, precargan el formulario) | Botón «Publicar» |
| `buscar.html` | `q`, `carrera`, `materia`, `categoria`, `orden`, `pagina` | Buscador y filtros |
| | `categoria` lleva el valor del ENUM (`apunte`, `parcial`…), no un identificador | |
| `perfil.html` | `usuario` (ausente = perfil propio) | Menú de usuario o autoría |
| `login.html` | `destino` (a dónde volver tras ingresar) | Encabezado |

`buscar.html` sincroniza su estado con la URL mediante `history.replaceState`: los
resultados filtrados son enlazables y compartibles.

---

## 8. Interfaz y accesibilidad

### Sistema de diseño

`main.css` define los tokens (color, tipografía, espaciado, radios, sombras) como
variables CSS. Ningún componente usa un color literal fuera de esa paleta, salvo los
colores por categoría de publicación. El modo oscuro redefine únicamente los tokens
bajo `prefers-color-scheme: dark`.

### Responsive

Estrategia *mobile first* con tres puntos de corte: 600 px, 900 px y 1100 px, más
ajustes en 420 px y 360 px. Verificado sin desbordes horizontales entre 320 px y
1440 px.

Las columnas de grilla usan `minmax(0, 1fr)` y no `1fr`: sin eso, el tamaño mínimo
automático de los ítems de grid impide que una columna se encoja por debajo del ancho
de su contenido y aparece scroll horizontal.

### Accesibilidad

- HTML semántico: `header`, `nav`, `main`, `aside`, `article`, `section`, `time`, `table`.
- Enlace «Saltar al contenido principal» como primer elemento focalizable.
- Todo control de formulario tiene `label` asociado o `aria-label`.
- Foco visible propio (`:focus-visible`) en toda la aplicación.
- Botones de estado con `aria-pressed`; pestañas con `role="tab"` y `aria-selected`;
  modales con `role="dialog"`, `aria-modal` y foco atrapado.
- Resultados de acciones anunciados en regiones `aria-live`.
- Imágenes con `alt`; los iconos decorativos llevan `aria-hidden="true"`.
- `prefers-reduced-motion` desactiva animaciones y transiciones.

### Estados de interfaz

Carga (*skeletons* animados), vacío (`FL.dom.vacio`, con acción sugerida), error
(avisos en línea y notificaciones flotantes) y éxito (notificaciones flotantes).

---

## 9. Calidad de código

- Sin dependencias externas ni frameworks; sin `TODO` ni código muerto.
- Sin estilos en línea: la presentación vive íntegramente en las hojas de estilo.
- Sin `innerHTML` sobre datos de usuario.
- Nombres en español, coherentes con el dominio; comentarios solo donde explican una
  decisión y no lo que ya dice el código.
- Ningún archivo supera las ~500 líneas.

---

## 10. Herramientas del repositorio

| Script | Función |
|--------|---------|
| `database/tools/generar_datos.py` | Genera `data/*.json`, `assets/js/data/dataset.js` y `database/seed.sql` |
| `database/tools/generar_html.py` | Genera los 13 documentos HTML con cabecera, esqueleto y scripts sincronizados |
| `database/tools/generar_der.py` | Genera `docs/der-chen.html`, el diagrama entidad-relación |

Ambos son herramientas de desarrollo: el proyecto entregado funciona sin ejecutarlos.
