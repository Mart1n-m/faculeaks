# FacuLeaks — Foro académico universitario

Aplicación web que centraliza el material de estudio y las consultas académicas,
organizados por carrera y materia, con un Marketplace de material entre estudiantes.

Proyecto de **Paradigmas de la Programación 3** (UCP) — Martín Nahuel Mekekiuk y
Augusto Piedrafita. El avance entrega por entrega está en [`BITACORA.md`](BITACORA.md).

## Tecnologías

HTML5 + CSS3 + JavaScript sin frameworks · PHP 8 con PDO · MySQL 8 / MariaDB 10.4+ ·
XAMPP.

## Estructura

```
faculeaks/
├── *.html                 8 páginas (foro y Marketplace)
├── style.css              hoja de estilos única
├── js/app.js              comportamiento: sesión, catálogo, carrito
├── api/                   servicios PHP (respuestas JSON)
│   ├── conexion.php       PDO, sesión y utilidades comunes
│   ├── registro.php       POST  alta de cuenta (BCRYPT)
│   ├── login.php          POST  inicio de sesión
│   ├── logout.php         POST  cierre de sesión
│   ├── perfil.php         GET   PRIVADO: datos de la cuenta (401 sin sesión)
│   ├── productos.php      GET   catálogo del Marketplace
│   └── materias.php       GET   catálogo de materias
└── docs/bd/               esquema SQL, datos de prueba y diagrama lógico
```

## Cómo ejecutarlo con XAMPP

1. Copiar la carpeta del proyecto en `C:\xampp\htdocs\faculeaks`.
2. Iniciar **Apache** y **MySQL** desde el XAMPP Control Panel.
3. En phpMyAdmin (`http://localhost/phpmyadmin`), pestaña **Importar**, ejecutar en este
   orden:
   1. `docs/bd/facuLeaks_ae2.sql` — crea la base `facuLeaks` (**borra la existente**)
   2. `docs/bd/datos_prueba_ae2.sql` — datos de prueba
   3. `docs/bd/usuarios_bcrypt_ae3.sql` — contraseñas BCRYPT reales
4. Abrir `http://localhost/faculeaks/`.

> El sitio debe abrirse desde `http://localhost`, no con doble clic (`file://`): ni PHP
> ni `fetch()` funcionan sin servidor.

Si MySQL tiene usuario o contraseña distintos de los de XAMPP (`root` sin contraseña),
se cambian en las constantes de `api/conexion.php`.

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
