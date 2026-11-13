# FacuLeaks — Foro académico universitario

Aplicación web que centraliza el material de estudio y las consultas académicas,
organizados por carrera y materia, con un Marketplace de material entre estudiantes.

Proyecto de **Paradigmas de la Programación 3** (UCP) — Martín Nahuel Mekekiuk y
Augusto Piedrafita. El avance entrega por entrega está en [`BITACORA.md`](BITACORA.md).

## Tecnologías

HTML5 + CSS3 + JavaScript sin frameworks · PHP 8 con PDO · MySQL 8 / MariaDB 10.4+ ·
XAMPP.

## Estructura (MVC desacoplado)

```
faculeaks/
├── index.php              redirige a public/
├── config/
│   └── conexion.php       clase Conexion: PDO Singleton (no accesible por HTTP)
├── models/                MODELO: acceso a datos con PDO Prepared Statements
│   ├── UsuarioModel.php
│   ├── PublicacionModel.php
│   ├── ComentarioModel.php
│   ├── VotoModel.php
│   ├── ProductoModel.php
│   ├── VentaModel.php
│   └── MateriaModel.php
├── api/                   CONTROLADOR: endpoints REST que responden JSON
│   ├── utilidades.php     sesión, respuestas JSON, guardián 401, manejo de 500
│   ├── registro.php       POST  alta de cuenta (BCRYPT)
│   ├── login.php          POST  inicio de sesión
│   ├── logout.php         POST  cierre de sesión
│   ├── perfil.php         GET   PRIVADO: datos de la cuenta (401 sin sesión)
│   ├── publicaciones.php  CRUD  foro
│   ├── comentarios.php    CRUD  comentarios y respuestas
│   ├── votos.php          POST  votar contenido
│   ├── productos.php      CRUD  Marketplace
│   ├── ventas.php         GET/POST  compras
│   └── materias.php       GET   catálogo de materias
├── public/                VISTA: Single Page Application
│   ├── index.html         única página: layout + plantillas <template> de cada vista
│   ├── css/estilos.css
│   └── js/app.js          router por hash, fetch() + async/await contra ../api/
└── docs/bd/               esquema SQL, datos de prueba y diagrama lógico
```

La vista y el servidor se comunican solo por HTTP con JSON. Los controladores de
`api/` no contienen SQL: lo delegan en `models/`, que obtienen la conexión de
`config/conexion.php`.

## Rutas de la SPA

`public/index.html` es la única página. `js/app.js` lee la ruta del *hash* de la URL,
clona la plantilla de la vista, la completa con datos de la API y la inserta sin
recargar. Los botones Atrás/Adelante del navegador funcionan.

| Ruta | Vista | Sesión |
|---|---|---|
| `#/` | Lo más votado (todas las categorías) | — |
| `#/apuntes`, `#/parciales`, `#/consultas` | Foro por categoría, con búsqueda, filtro por materia y orden | — |
| `#/publicacion/4` | Publicación con comentarios, respuestas y votos | para comentar y votar |
| `#/publicar`, `#/publicacion/4/editar` | Alta y edición de publicaciones | sí |
| `#/marketplace` | Catálogo en fichas con buscador en tiempo real | — |
| `#/marketplace/tabla` | Catálogo en tabla | — |
| `#/producto/3` | Ficha del material | para comprar |
| `#/vender`, `#/producto/3/editar` | Alta y edición de material | sí |
| `#/carrito` | Carrito y formulario de compra | sí |
| `#/mis-compras` | Historial de compras | sí |

## API REST

Todas las respuestas son JSON (`Content-Type: application/json; charset=utf-8`).
Los cuerpos de POST y PUT se envían como JSON. Los recursos individuales se indican con
`?id=` en la URL. 🔒 = requiere sesión (sin ella responde **401**).

| Método | URL (`/api/...`) | Entrada | Respuesta | Códigos |
|---|---|---|---|---|
| POST | `registro.php` | `alias_usuario, email, nombre, apellido, password` | `{mensaje, id_usuario}` | 201, 400, 409 |
| POST | `login.php` | `usuario` (alias o e-mail), `password` | `{mensaje, alias_usuario}` | 200, 400, 401, 403 |
| POST | `logout.php` | — | `{mensaje}` | 200 |
| GET 🔒 | `perfil.php` | — | usuario + `carreras` | 200, 401 |
| GET | `publicaciones.php` | query: `categoria, id_materia, id_carrera, q, orden=votos\|recientes` | lista de publicaciones | 200, 400 |
| GET | `publicaciones.php?id=4` | — | publicación + `comentarios` | 200, 404 |
| POST 🔒 | `publicaciones.php` | `titulo, cuerpo, categoria, id_materia` | publicación creada | 201, 400, 401 |
| PUT 🔒 | `publicaciones.php?id=4` | `titulo, cuerpo, categoria, id_materia` | publicación editada | 200, 400, 401, 403, 404 |
| DELETE 🔒 | `publicaciones.php?id=4` | — | `{mensaje, id_publicacion}` | 200, 401, 403, 404 |
| GET | `comentarios.php?id_publicacion=4` | — | lista de comentarios | 200, 400, 404 |
| POST 🔒 | `comentarios.php` | `id_publicacion, texto, id_comentario_padre?` | comentario creado | 201, 400, 401, 404 |
| PUT 🔒 | `comentarios.php?id=13` | `texto` | comentario editado | 200, 400, 401, 403, 404 |
| DELETE 🔒 | `comentarios.php?id=13` | — | `{mensaje, id_comentario}` | 200, 401, 403, 404 |
| POST 🔒 | `votos.php` | `id_contenido, valor` (1, -1 o 0 para quitar) | `{id_contenido, mi_voto, puntaje}` | 200, 400, 401, 404 |
| GET | `productos.php` | — | catálogo | 200 |
| GET | `productos.php?id=3` | — | producto | 200, 404 |
| POST 🔒 | `productos.php` | `titulo, precio, tipo_material, id_materia?` | producto creado | 201, 400, 401 |
| PUT 🔒 | `productos.php?id=3` | `titulo, precio, tipo_material, id_materia?` | producto editado | 200, 400, 401, 403, 404 |
| DELETE 🔒 | `productos.php?id=3` | — | `{mensaje, id_producto}` | 200, 401, 403, 404, 409 |
| GET 🔒 | `ventas.php` | — | mis compras con `total` y `detalle` | 200, 401 |
| POST 🔒 | `ventas.php` | `medio_pago, items: [{id_producto, cantidad}]` | venta con `total` y `detalle` | 201, 400, 401, 404 |
| GET | `materias.php` | — | materias | 200 |

Además, cualquier endpoint responde **405** ante un método no admitido y **500** (sin
detalles técnicos) si falla la base de datos.

**Control de acceso:** editar o borrar una publicación, un comentario o un producto
solo lo puede hacer su autor/vendedor o un usuario con rol `moderador` o
`administrador` (si no, **403**). En una compra, el comprador es siempre el usuario de
la sesión y los precios se leen de la base, no del cliente.

## Accesibilidad (WCAG 2.1 AA)

- **Teclado:** todo el sitio se opera con Tab y Enter. El primer Tab muestra
  "Saltar al contenido"; al cambiar de vista el foco pasa al título (`h1`); Enter
  también marca casillas y opciones; Escape cierra el panel de acceso y el foco vuelve
  al botón que lo abrió. En los `<select>` se usan las flechas, como en cualquier sitio.
- **Foco visible:** `:focus-visible` con contorno de 3 px (azul en el contenido,
  amarillo sobre el header oscuro).
- **Lectores de pantalla:** regiones `aria-live="polite"` / `role="status"` para los
  resultados de cada `fetch()`, anuncio de cada cambio de vista, botones de voto con
  `aria-pressed` y `aria-label` descriptivo, tablas con `caption` y `scope`.
- **Contraste:** paleta con relación mínima 4.5:1 en todo el texto.

### Cómo verificar el 100/100 de Lighthouse

1. Abrir `http://localhost/faculeaks/` en Chrome (o Edge).
2. F12 → pestaña **Lighthouse** → categoría **Accessibility** → **Analyze page load**.
3. Repetir en otras vistas cambiando el *hash* (`#/marketplace`, `#/publicacion/4`,
   `#/carrito` con sesión iniciada, etc.).

## Cómo ejecutarlo con XAMPP

1. Copiar la carpeta del proyecto en `C:\xampp\htdocs\faculeaks`.
2. Iniciar **Apache** y **MySQL** desde el XAMPP Control Panel.
3. En phpMyAdmin (`http://localhost/phpmyadmin`), pestaña **Importar**, ejecutar en este
   orden:
   1. `docs/bd/facuLeaks_ae2.sql` — crea la base `facuLeaks` (**borra la existente**)
   2. `docs/bd/datos_prueba_ae2.sql` — datos de prueba
   3. `docs/bd/usuarios_bcrypt_ae3.sql` — contraseñas BCRYPT reales
4. Abrir `http://localhost/faculeaks/` (redirige a `public/`).

> El sitio debe abrirse desde `http://localhost`, no con doble clic (`file://`): ni PHP
> ni `fetch()` funcionan sin servidor.

Si MySQL tiene usuario o contraseña distintos de los de XAMPP (`root` sin contraseña),
se cambian en las constantes de la clase `Conexion` en `config/conexion.php`.

## Usuarios de prueba

Todos los usuarios cargados por los scripts tienen la contraseña **`faculeaks123`**.
Se puede iniciar sesión con el alias o con el e-mail, por ejemplo:

| Alias | E-mail | Rol |
|---|---|---|
| `mmekekiuk` | martin@faculeaks.com | estudiante |
| `apiedrafita` | augusto@faculeaks.com | estudiante |
| `modsoft` | mod@faculeaks.com | moderador |

## Seguridad (AE3)

| Riesgo | Medida |
|---|---|
| Contraseñas expuestas | `password_hash(..., PASSWORD_BCRYPT)`; nunca se guarda ni se devuelve la contraseña |
| Inyección SQL | PDO con *prepared statements* y `EMULATE_PREPARES = false` |
| Acceso no autorizado | Guardián en `api/perfil.php`: sin `$_SESSION['usuario_id']` responde **401** |
| Fijación de sesión | `session_regenerate_id(true)` al iniciar sesión |
| Robo de la cookie por XSS | Cookie de sesión `HttpOnly` |
| CSRF | Cookie `SameSite=Strict` |
| XSS almacenado | Los datos se renderizan con `.textContent` / `.value`, nunca con `innerHTML` |
| Enumeración de cuentas | El login responde el mismo mensaje si el usuario no existe o la contraseña es incorrecta |
| Validación salteable | Toda validación del formulario se repite en el servidor |

## Probar la API sin el frontend

```bash
# Sin sesión: 401
curl -i http://localhost/faculeaks/api/perfil.php

# Login (guarda la cookie de sesión en cookies.txt)
curl -i -c cookies.txt -H "Content-Type: application/json" \
     -d '{"usuario":"apiedrafita","password":"faculeaks123"}' \
     http://localhost/faculeaks/api/login.php

# Con sesión: 200
curl -i -b cookies.txt http://localhost/faculeaks/api/perfil.php
```
