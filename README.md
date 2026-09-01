# FacuLeaks

Foro académico universitario. Los estudiantes navegan **carrera → materia → programa →
foro de la materia**, y publican preguntas, apuntes, parciales, experiencias y material de
estudio.

Este repositorio corresponde al **TP1 – Frontend**: interfaz completa y navegable,
datos simulados y el diseño íntegro de la base de datos. **No hay backend PHP ni
conexión real a la base de datos**: la arquitectura está preparada para incorporarlos
en TP2 y TP3 sin rehacer las vistas.

---

## 1. Objetivos de la entrega

| # | Objetivo | Estado |
|---|----------|--------|
| 1 | Modelo de datos en notación de Chen | Implementado |
| 2 | Frontend completo y navegable (13 vistas) | Implementado |
| 3 | Base de datos MySQL/MariaDB (`schema.sql` + `seed.sql`) | Implementado |
| 4 | Datos simulados coherentes con la base de datos | Implementado |
| 5 | Documentación técnica | Implementado |
| 6 | Manual de usuario | Implementado |
| 7 | Estructura preparada para incorporar PHP | Implementado |

### El modelo de datos

El diseño parte de un **diagrama entidad-relación en notación de Chen**
([`docs/der-chen.html`](docs/der-chen.html), abrilo en el navegador): 8 entidades,
13 relaciones y 12 tablas.

Tres decisiones lo definen:

- **`CONTENIDO` generaliza a `PUBLICACIÓN` y `COMENTARIO`** (jerarquía ISA total y
  disjunta). Gracias a eso, votar y reportar son **una sola relación** cada uno, con
  integridad referencial real, en lugar de dos tablas gemelas o claves foráneas opcionales
  con una restricción de exclusión.
- **`CARRERA` y `MATERIA` se relacionan N:M** con el año, el cuatrimestre y la
  obligatoriedad como atributos de la relación. 23 de las 43 materias se dictan en más de
  una carrera.
- **`PROGRAMA` es una entidad débil** de `MATERIA`: su clave es el ciclo lectivo y la
  versión, más la clave de la materia.

La justificación completa está en [`docs/modelo-conceptual.md`](docs/modelo-conceptual.md).

---

## 2. Tecnologías

**Entrega actual (TP1)**

- HTML5 semántico
- CSS3 propio, sin frameworks (variables CSS, Grid y Flexbox, *mobile first*)
- JavaScript vanilla ES6+, sin dependencias externas
- JSON como formato de los datos simulados
- MySQL 8 / MariaDB 10.4+ para el diseño de la base de datos

**Entregas siguientes**

```
HTML/CSS/JS  →  fetch()  →  API PHP  →  MySQL/MariaDB
   (TP1)                     (TP2)         (TP3)
```

---

## 3. Instalación y ejecución

### 3.1 Frontend

El proyecto es estático: no requiere compilación ni instalación de dependencias.

```bash
# Desde la raíz del proyecto
python3 -m http.server 8000
```

Luego abrir <http://localhost:8000> en el navegador.

> **Por qué un servidor local.** El proyecto funciona también abriendo `index.html`
> con doble clic, porque los datos se cargan desde un módulo JavaScript embebido
> (`assets/js/data/dataset.js`) y no mediante `fetch()`. Aun así se recomienda el
> servidor local: es el entorno en el que se trabajará a partir de TP2, y evita las
> restricciones del protocolo `file://`.

Cualquier servidor estático sirve igual: `npx serve`, `php -S localhost:8000`,
la extensión *Live Server* de VS Code o XAMPP/Apache.

### 3.2 Base de datos

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

`schema.sql` crea la base `faculeaks` desde cero y **debe ejecutarse antes** que
`seed.sql`. Detalles en [`database/README.md`](database/README.md) y en
[`docs/base-de-datos.md`](docs/base-de-datos.md).

---

## 4. Estructura de carpetas

```
FacuLeaks/
├── index.html                  Portada
├── carreras.html               Listado de carreras
├── carrera.html                Ficha de carrera y malla curricular
├── materia.html                Programas y foro de la materia
├── publicacion.html            Detalle, comentarios y respuestas
├── crear-publicacion.html      Alta de publicación
├── buscar.html                 Búsqueda con filtros
├── login.html                  Inicio de sesión
├── registro.html               Alta de cuenta
├── perfil.html                 Perfil propio y público
├── favoritos.html              Publicaciones guardadas
├── moderacion.html             Cola de reportes
├── admin.html                  Administración del catálogo
│
├── assets/
│   ├── css/
│   │   ├── main.css            Tokens de diseño, reset y estructura
│   │   ├── components.css      Componentes reutilizables
│   │   └── responsive.css      Puntos de corte (mobile first)
│   ├── js/
│   │   ├── data/dataset.js     Dataset embebido (espejo de /data)
│   │   ├── utils/              dom, formato, almacenamiento, validación
│   │   ├── services/           Capa de acceso a datos y dominio
│   │   ├── components/         Encabezado, pie, tarjetas, modal, avisos…
│   │   ├── pages/              Un módulo por vista
│   │   └── app.js              Punto de entrada
│   └── img/                    Logotipo y avatares (SVG)
│
├── data/                       Mocks en JSON, uno por tabla
├── database/
│   ├── schema.sql              Esquema relacional (12 tablas)
│   ├── seed.sql                Datos iniciales y de demostración
│   ├── README.md               Instrucciones de la base de datos
│   └── tools/                  Generadores de datos, páginas y diagrama
└── docs/
    ├── der-chen.html           Diagrama entidad-relación (abrir en el navegador)
    ├── modelo-conceptual.md    Entidades, relaciones y paso a tablas
    ├── base-de-datos.md        Esquema, restricciones, índices y vistas
    ├── documentacion-tecnica.md
    ├── arquitectura.md
    ├── roadmap-backend.md
    └── manual-usuario.md
```

---

## 5. Funcionalidades implementadas

**Navegación académica**

- 13 carreras iniciales.
- Materias agrupadas por año y cuatrimestre, con obligatorias y optativas.
- Una misma materia se dicta en varias carreras, con distinto año o régimen en cada una
  (por ejemplo, *Paradigmas de la Programación* es obligatoria en Ingeniería en Sistemas y
  optativa en el Analista Universitario).
- Programas por materia, con ciclo lectivo, versión y docente de referencia.

**Foro**

- Publicaciones clasificadas en 7 categorías: pregunta, apunte, parcial, profesor,
  experiencia, recomendación y material.
- Comentarios con respuestas anidadas.
- Votación positiva y negativa **con un único mecanismo** para publicaciones y comentarios
  (un voto por usuario y contenido; repetir el mismo voto lo anula).
- Favoritos, reportes de contenido y adjunto opcional por publicación.

**Búsqueda**

- Búsqueda por texto sobre título, contenido, materia y carrera.
- Filtros combinables por carrera, materia y categoría, más cinco criterios de orden.
- El estado de los filtros se refleja en la URL: los resultados son compartibles.

**Cuenta y roles**

- Registro y sesión simulados con validación de formularios en el cliente.
- Cuatro roles con capacidades acumulativas: invitado, usuario, moderador y administrador.
- Panel de moderación (cola de reportes) y panel de administración (usuarios, carreras,
  materias, programas y categorías).

**Interfaz**

- Diseño propio, responsive y *mobile first*, verificado entre 320 px y 1440 px.
- Modo claro y oscuro según la preferencia del sistema.
- Accesibilidad: HTML semántico, etiquetas asociadas, foco visible, navegación por
  teclado, `aria-*` donde corresponde y enlace de salto al contenido.
- Estados de carga (*skeletons*), estados vacíos, mensajes de error y de éxito.

---

## 6. Usuarios y roles simulados

La sesión es simulada: **no se verifican contraseñas**, porque la verificación
corresponde al backend de TP2. Alcanza con indicar un usuario existente y cualquier
contraseña.

| Usuario | Rol | Qué permite ver |
|---------|-----|-----------------|
| *(sin sesión)* | Invitado | Solo lectura: carreras, materias, programas y publicaciones |
| `mnahuel` | Usuario | Publicar, comentar, responder, votar, guardar y reportar |
| `mod_lucia` | Moderador | Lo anterior + panel de moderación de reportes |
| `admin` | Administrador | Lo anterior + panel de administración |

La página de login ofrece accesos directos a estas tres cuentas. También se puede
cambiar de rol sin cerrar sesión desde el selector **«Rol de demostración»** del pie
de página, pensado exclusivamente para la demostración de TP1.

> Todos los datos de la aplicación son **ficticios**. No hay datos personales reales
> ni contraseñas almacenadas.

---

## 7. Documentación

| Documento | Contenido |
|-----------|-----------|
| [`docs/der-chen.html`](docs/der-chen.html) | **Diagrama entidad-relación en notación de Chen**, atributos y esquema relacional |
| [`docs/modelo-conceptual.md`](docs/modelo-conceptual.md) | Entidades, relaciones, cardinalidades, reglas de paso a tablas y justificación de cada decisión |
| [`docs/documentacion-tecnica.md`](docs/documentacion-tecnica.md) | Arquitectura interna, módulos, mocks, `localStorage`, validaciones y convenciones |
| [`docs/base-de-datos.md`](docs/base-de-datos.md) | Entidades, claves, relaciones, cardinalidades, restricciones, normalización e índices |
| [`docs/arquitectura.md`](docs/arquitectura.md) | Arquitectura de TP1 y arquitectura objetivo de TP2/TP3 |
| [`docs/roadmap-backend.md`](docs/roadmap-backend.md) | Qué cambia exactamente al incorporar PHP y MySQL |
| [`docs/manual-usuario.md`](docs/manual-usuario.md) | Manual de uso en lenguaje sencillo |
| [`database/README.md`](database/README.md) | Ejecución de `schema.sql` y `seed.sql` |

---

## 8. Alcance de la entrega

**Incluido:** frontend completo y funcional, datos simulados, diseño y scripts de la
base de datos, documentación y manual de usuario.

**Deliberadamente fuera de alcance (TP2 y TP3):** backend PHP, autenticación real,
control de permisos en servidor, subida efectiva de archivos y persistencia en MySQL.
Las carpetas `api/`, `config/`, `controllers/`, `models/`, `services/` y `routes/`
todavía no existen; su incorporación está detallada en
[`docs/roadmap-backend.md`](docs/roadmap-backend.md).
