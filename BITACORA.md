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
| AE3 | `ae3-entrega` | Backend PHP: autenticación con BCRYPT, sesiones, 401 y prevención de XSS |

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

**Fecha:** 14 de octubre de 2026 · **Rama:** `Ae3-autenticacion` · **Tag:** `ae3-entrega`

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
