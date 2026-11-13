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
│   ├── ProductoModel.php
│   └── MateriaModel.php
├── api/                   CONTROLADOR: endpoints REST que responden JSON
│   ├── utilidades.php     sesión, respuestas JSON, guardián 401, manejo de 500
│   ├── registro.php       POST  alta de cuenta (BCRYPT)
│   ├── login.php          POST  inicio de sesión
│   ├── logout.php         POST  cierre de sesión
│   ├── perfil.php         GET   PRIVADO: datos de la cuenta (401 sin sesión)
│   ├── productos.php      GET   catálogo del Marketplace
│   └── materias.php       GET   catálogo de materias
├── public/                VISTA: HTML5 + CSS + JavaScript Vanilla
│   ├── *.html
│   ├── css/estilos.css
│   └── js/app.js          fetch() + async/await contra ../api/
└── docs/bd/               esquema SQL, datos de prueba y diagrama lógico
```

La vista y el servidor se comunican solo por HTTP con JSON. Los controladores de
`api/` no contienen SQL: lo delegan en `models/`, que obtienen la conexión de
`config/conexion.php`.

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
