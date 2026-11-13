# Bitácora del proyecto FacuLeaks

Paradigmas de la Programación 3 — Universidad de la Cuenca del Plata,
Facultad de Ingeniería y Tecnología.

**Equipo:** Martín Nahuel Mekekiuk ([@Mart1n-m](https://github.com/Mart1n-m)) y
Augusto Piedrafita.

Registro del avance del proyecto entrega por entrega. Cada actividad evaluable queda
marcada con un *tag* de Git, de modo que el estado del código en cada entrega se puede
recuperar con `git checkout <tag>`.

| Entrega | Tag | Tema |
|---|---|---|
| AE1 | `ae1` | Frontend HTML + CSS: foro y Marketplace de material de estudio |
| AE2 | `ae2-entrega` | JavaScript desacoplado, `fetch()` y equiparación con la base de datos |
| AE3 | `ae3` | Backend PHP: autenticación con BCRYPT, sesiones, 401 y prevención de XSS |
| AE4 | `ae4-entrega` | SPA + API REST en MVC desacoplado, OWASP, ISO/IEC 25010 y WCAG 2.1 |

---

## AE1 — Frontend HTML + CSS

**Fecha:** 4 de septiembre de 2026 · **Tag:** `ae1`

- Ocho páginas HTML5 semánticas con una hoja de estilos única (`style.css`), sin frameworks.
- Adaptación de la consigna de comercio electrónico al dominio del foro: se incorpora
  un **Marketplace de material de estudio** en el que los propios usuarios ofrecen
  apuntes, libros y guías.
- Vistas pedidas: portada (`index.html`), listado en tabla (`listado_tabla.html`),
  listado en fichas (`listado_box.html`), ficha de producto (`producto.html`) y
  formulario de compra (`comprar.html`).
- Validación nativa del formulario (`required`, `pattern`, `type="email"`) y diseño
  adaptable con Grid y Flexbox.
- 25 de septiembre: cálculo dinámico de subtotales en el formulario de compra.

## AE2 — Integración JavaScript y metodologías web

**Fecha:** 29 y 30 de septiembre de 2026 · **Tag:** `ae2-entrega`

- **Modelo de datos:** se incorpora el esquema relacional en 3FN de la materia Base de
  Datos (`docs/bd/facuLeaks_ae2.sql`), que queda congelado como fuente de verdad. Los
  datos se exportaron a `data/*.json`, un archivo por tabla.
- **Equiparación:** el HTML y el CSS se ajustan al esquema; todo dato visible tiene
  respaldo en una columna, una vista o un cálculo derivable (ver `docs/bd/README.md`).
- **JavaScript desacoplado:** todo el comportamiento pasa a `js/app.js` con
  `addEventListener`, sin atributos `onclick` ni `onsubmit` en el HTML.
- **Opción 3 (Martín Mekekiuk):** buscador y filtro del catálogo en tiempo real sobre
  `listado_box.html`, alimentado por `fetch()`.
- **Opción 7 (Augusto Piedrafita):** contador +/− de cantidades y subtotal por producto
  en `comprar.html`.
- Integración de ambas opciones en la rama `ae2` y luego en `main`.

## AE3 — Autenticación segura, sesiones y protección de endpoints

**Fecha:** 14 de octubre de 2026 · **Rama:** `Ae3-autenticacion` · **Tag:** `ae3`

**Autores:** Martín Nahuel Mekekiuk y Augusto Piedrafita. Los archivos de ambos
integrantes se integraron y se subieron al repositorio desde la cuenta de Martín.

### Paso 1 — Capa de datos

- La tabla `usuarios` ya existía en el esquema. Su columna de contraseña,
  `contrasena_cifrada`, es `VARCHAR(255)`, el largo recomendado por PHP para el
  resultado de `password_hash()`, así que no hizo falta modificar la estructura.
- `docs/bd/usuarios_bcrypt_ae3.sql` reemplaza los hashes ficticios de la carga de prueba
  (`$2y$10$hashDePrueba…`), que `password_verify()` nunca acepta, por un hash BCRYPT
  real. Contraseña de prueba de todos los usuarios cargados: `faculeaks123`.

### Paso 2 — Servicios de autenticación (`api/`)

| Archivo | Método | Qué hace | Respuestas |
|---|---|---|---|
| `conexion.php` | — | Conexión PDO (`EMULATE_PREPARES = false`), sesión con cookie `HttpOnly` y `SameSite=Strict`, utilidades JSON | — |
| `registro.php` | POST | Recibe JSON, valida en el servidor, `password_hash($pass, PASSWORD_BCRYPT)` e `INSERT` con *prepared statement* | 201, 400, 409 |
| `login.php` | POST | `password_verify()`, `session_start()`, `session_regenerate_id(true)` y `$_SESSION['usuario_id']` | 200, 400, 401, 403 |
| `logout.php` | POST | Vacía la sesión, invalida la cookie y destruye la sesión | 200 |

### Paso 3 — Endpoint privado del dominio

- `api/perfil.php` devuelve los datos de la cuenta y las carreras que cursa (`estudia`).
- Guardián de sesión: si `!isset($_SESSION['usuario_id'])`, responde de inmediato
  `http_response_code(401)`, antes de ejecutar cualquier consulta.

### Paso 4 — Frontend SPA y sanitización

- Al cargar cada página, `js/app.js` hace `fetch('api/perfil.php')`. Con 200 muestra el
  saludo, «Cerrar sesión», el cuadro «Publicar», los votos y el formulario de compra.
  Con 401 los oculta y ofrece «Iniciar sesión / Registrarse».
- El login y el registro se alternan en un panel dentro de la misma página, sin recargar.
- `comprar.html` toma el comprador de la sesión, en lugar de los datos fijos de
  `apiedrafita`.
- Todo dato del usuario o de la base se escribe con `.textContent` (o `.value` en los
  `input`), nunca con `innerHTML`. Se verificó registrando un usuario cuyo nombre es
  `<img src=x onerror=alert("XSS")>`: se muestra como texto literal y no se ejecuta.

### Cambios complementarios

- Se eliminaron `data/*.json` y `docs/bd/exportar_json.py`. El catálogo y los precios
  ahora se leen desde MySQL mediante dos endpoints públicos: `api/productos.php` y
  `api/materias.php`.
- Se eliminaron las ramas `ae2`, `ae2-martin-opcion3` y `AugustoAE2`: su contenido está en
  `main` y preservado por el tag `ae2-entrega`.

### Verificación

- Pruebas de la API con `curl`: 401 sin sesión, 405 por método incorrecto, 400 por JSON
  inválido o datos incompletos, 409 por alias o e-mail duplicado, 201 en el alta, login
  por alias y por e-mail, y 401 nuevamente después del logout.
- Prueba de punta a punta en navegador (Chromium): registro, login, alternancia del DOM
  sin recarga, compra con sesión, catálogo desde la API, logout e intento de XSS sin
  ejecución de código. Vista de escritorio y móvil (390 px).

## AE4 — SPA, API REST en MVC desacoplado, calidad y accesibilidad (en curso)

**Rama:** `ae4` · **Tag:** `ae4-entrega` (al integrar en `main`)

**Autores:** Martín Nahuel Mekekiuk y Augusto Piedrafita. Los cambios de ambos
integrantes se suben desde la cuenta de Martín con Augusto como coautor
(`Co-authored-by`).

### Fase 1 — Arquitectura en capas (MVC)

- `config/conexion.php`: clase `Conexion` con patrón Singleton (una sola instancia de
  PDO por petición, constructor privado, `ERRMODE_EXCEPTION`,
  `EMULATE_PREPARES = false`).
- `models/`: `UsuarioModel`, `ProductoModel` y `MateriaModel` concentran todo el SQL.
  Cada consulta usa `prepare()` con marcadores nombrados (`:campo`), incluidas las
  que no reciben parámetros, que antes usaban `query()`.
- `api/`: los controladores validan la entrada, llaman al modelo y responden JSON con
  el código HTTP correspondiente. `api/conexion.php` pasó a `api/utilidades.php`
  (sesión, `responderJson`, guardián `exigirSesion()` con 401 y `ejecutarEndpoint()`
  con 500 sin exponer el detalle del error).
- `public/`: la vista (HTML, `css/estilos.css` y `js/app.js`) se separa del servidor.
  `app.js` consume la API con la ruta relativa `../api/`. `index.php` en la raíz
  redirige a `public/`.
- `config/` y `models/` tienen un `.htaccess` con `Require all denied`: solo PHP los
  incluye; el navegador no puede pedirlos.
- Verificación: 15 pruebas con `curl` (200, 201, 400, 401, 405, 409 y 500 con la base
  caída) y prueba en el navegador de login, catálogo y formulario de compra desde
  `public/`.

### Fase 2 — API REST con CRUD completo

Cada endpoint responde a un caso de uso del AE1 y persiste en MySQL a través de un
modelo. El inventario completo de métodos, parámetros y códigos HTTP está en el
README.

| Endpoint | Casos de uso | Tablas |
|---|---|---|
| `publicaciones.php` (GET, POST, PUT, DELETE) | Ver y filtrar publicaciones, Publicar, Editar y Eliminar publicación | `contenidos`, `publicaciones` |
| `comentarios.php` (GET, POST, PUT, DELETE) | Comentar, Responder, Editar y Eliminar comentario | `contenidos`, `comentarios` |
| `votos.php` (POST) | Votar publicación o comentario | `vota`, `vw_puntaje_contenido` |
| `productos.php` (GET, POST, PUT, DELETE) | Ver catálogo y producto, Publicar, Editar y Eliminar producto | `productos` |
| `ventas.php` (GET, POST) | Comprar material, Ver mis compras | `ventas`, `detalla`, `vw_venta_total` |

- **Control de acceso (OWASP A01):** solo el autor o un moderador/administrador puede
  editar o borrar (403). Las operaciones de escritura verifican además que la cuenta
  siga activa (`exigirUsuarioActivo()`).
- **Transacciones:** el alta y la baja de publicaciones y comentarios (supertipo
  `contenidos` + subtipo) y el registro de una venta con sus renglones se hacen en una
  transacción: si falla una parte, no queda nada a medias.
- **Integridad del negocio:** el precio de cada renglón se copia de `productos` (el
  cliente no puede fijarlo); no se puede comprar un producto propio; un producto con
  ventas no se elimina (409); al borrar una publicación se borran antes sus
  comentarios porque la FK es `ON DELETE RESTRICT`.
- **Inyección SQL:** los filtros del listado (`q`, `categoria`, etc.) viajan como
  parámetros; el comodín `%` del `LIKE` se agrega al valor, no al SQL. Se probó
  `q=' OR 1=1 --` y devuelve una lista vacía.
- Verificación: 71 pruebas con `curl` sobre los cinco endpoints (200, 201, 400, 401,
  403, 404, 405 y 409), incluidas las de autoría y rol de moderador.

### Fase 3 — De la maqueta del AE1 a la SPA

- **Una sola página.** Las ocho páginas HTML de la maqueta se convirtieron en plantillas
  `<template>` dentro de `public/index.html`. Se conservó su marcado semántico y sus
  clases CSS, de modo que el diseño responsive del AE1 sigue vigente.
- **Router por hash.** `app.js` asocia cada ruta (`#/apuntes`, `#/producto/3`...) a una
  vista. Cada vista clona su plantilla, pide los datos con `fetch()` + `async/await` y
  los escribe con `.textContent`. Un contador de turnos descarta las respuestas de
  vistas que el usuario ya abandonó.
- **Del contenido fijo a la base.** Las publicaciones del foro, que en la maqueta
  estaban escritas a mano en el HTML, ahora salen de `api/publicaciones.php`. El
  carrito, que tenía tres productos fijos, ahora se arma desde la ficha de cada
  producto y la compra se registra en `ventas` y `detalla`.
- **Trazabilidad con el AE2.** El buscador en tiempo real (Opción 3, Martín) sigue en
  `#/marketplace` y el contador +/− con subtotales (Opción 7, Augusto) sigue en
  `#/carrito`.
- **Accesibilidad.** Un `h1` por vista que recibe el foco al navegar, anuncio del
  cambio de vista en una región `aria-live="polite"`, enlace "Saltar al contenido",
  botones de voto con `aria-pressed` y `aria-label` descriptivo, y el foco vuelve al
  control que abrió el panel de acceso al cerrarlo.
- **XSS.** Se publicó un título `<img src=x onerror=alert(1)>`: se ve como texto y el
  DOM no contiene ningún `<img>`.
- Verificación en el navegador: todas las rutas como invitado y con sesión; alta,
  edición y baja de publicaciones, comentarios, respuestas y productos; votos;
  carrito con +/− y compra; recorrido solo con Tab y Enter; sin desborde horizontal a
  375 px.
