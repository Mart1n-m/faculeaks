# Base de datos

Motor: **MySQL 8.x / MariaDB 10.4+**, tablas **InnoDB**, juego de caracteres **utf8mb4**
con cotejamiento `utf8mb4_unicode_ci`.

El esquema es el resultado de aplicar las reglas de paso a tablas al DER en notación de
Chen. El modelo conceptual, con la justificación de cada decisión, está en
[`modelo-conceptual.md`](modelo-conceptual.md); el diagrama, en
[`der-chen.html`](der-chen.html).

Archivos:

- `database/schema.sql` — estructura (ejecutar primero)
- `database/seed.sql` — datos iniciales y de demostración
- `database/README.md` — instrucciones de ejecución

---

## 1. Mapa del esquema

12 tablas en cuatro bloques:

**Entidades fuertes** `roles`, `usuarios`, `carreras`, `materias`, `contenidos`
**Especialización ISA** `publicaciones`, `comentarios` (subtipos de `contenidos`)
**Entidad débil** `programas`
**Relaciones N:M** `carrera_materia`, `estudia`, `votos`, `favoritos`, `reportes`

```
roles ──1:N── usuarios
                 │
                 ├──N:M── estudia ──N:M── carreras
                 │                            │
                 │                     carrera_materia
                 │                            │
                 │                        materias ──1:N── programas  (débil)
                 │                            │                ▲
                 │                            │                └── cargado_por
                 │                            │
                 └──1:N── contenidos          │
                             │  ISA           │
                    ┌────────┴────────┐       │
              publicaciones      comentarios  │
                    │  │              │  └────┘ (autorreferencia: respuestas)
                    │  └── carrera_id / materia_id
                    │
                    └──1:N── comentarios.publicacion_id

usuarios ──N:M── votos ──N:M── contenidos      (publicaciones Y comentarios)
usuarios ──N:M── reportes ──N:M── contenidos   (publicaciones Y comentarios)
usuarios ──N:M── favoritos ──N:M── publicaciones
```

---

## 2. Tablas

### 2.1 `roles` — entidad ROL

| Columna | Tipo | Restricciones |
|---|---|---|
| `id_rol` | INT UNSIGNED | **PK**, AUTO_INCREMENT |
| `nombre` | VARCHAR(30) | NOT NULL, **UNIQUE** |
| `descripcion` | VARCHAR(255) | NULL |

Valores: `invitado`, `usuario`, `moderador`, `administrador`.

### 2.2 `usuarios` — entidad USUARIO + relación POSEE

| Columna | Tipo | Restricciones |
|---|---|---|
| `id_usuario` | INT UNSIGNED | **PK** |
| `rol_id` | INT UNSIGNED | **FK** → `roles`, NOT NULL, `ON DELETE RESTRICT` |
| `username` | VARCHAR(30) | NOT NULL, **UNIQUE**, `CHECK` longitud ≥ 3 |
| `email` | VARCHAR(120) | NOT NULL, **UNIQUE**, `CHECK` de formato |
| `password_hash` | VARCHAR(255) | NOT NULL |
| `nombre`, `apellido` | VARCHAR(60) | NOT NULL |
| `avatar_url`, `biografia` | VARCHAR | NULL |
| `estado` | ENUM | `activo` (DEFAULT) / `suspendido` / `eliminado` |
| `fecha_registro` | DATETIME | DEFAULT CURRENT_TIMESTAMP |

`ON DELETE RESTRICT` sobre `rol_id`: no se puede borrar un rol que tenga usuarios.

### 2.3 `carreras` — entidad CARRERA

`id_carrera` (PK), `nombre` (UNIQUE), `slug` (UNIQUE), `descripcion`,
`duracion_anios` (`CHECK BETWEEN 1 AND 8`), `activa`.

### 2.4 `materias` — entidad MATERIA

`id_materia` (PK), `codigo` (UNIQUE), `nombre`, `descripcion`, `activa`.

Catálogo global: la materia existe con independencia de la carrera, y esa es la condición
para que pueda compartirse entre varias.

### 2.5 `carrera_materia` — relación SE DICTA EN

| Columna | Tipo | Restricciones |
|---|---|---|
| `carrera_id` | INT UNSIGNED | **PK** · FK → `carreras`, CASCADE |
| `materia_id` | INT UNSIGNED | **PK** · FK → `materias`, CASCADE |
| `anio_cursada` | TINYINT | `CHECK BETWEEN 1 AND 8` |
| `cuatrimestre` | TINYINT | `CHECK IN (1, 2, 3)` — 3 = anual |
| `obligatoria` | BOOLEAN | DEFAULT TRUE |

La clave primaria compuesta implementa por sí sola la regla «una materia aparece una sola
vez en cada carrera». Los tres atributos dependen del par completo (ver
[normalización](#5-normalización)).

### 2.6 `estudia` — relación ESTUDIA

| Columna | Tipo | Restricciones |
|---|---|---|
| `usuario_id` | INT UNSIGNED | **PK** · FK → `usuarios`, CASCADE |
| `carrera_id` | INT UNSIGNED | **PK** · FK → `carreras`, CASCADE |
| `anio_ingreso` | SMALLINT | `CHECK BETWEEN 1950 AND 2100` |
| `sede` | VARCHAR(80) | NULL |
| `activo` | BOOLEAN | DEFAULT TRUE |

Reemplaza a la antigua tabla `perfiles_academicos`. La clave compuesta impide inscribirse
dos veces a la misma carrera, pero **admite varias carreras por usuario**, que es la
situación que refleja el seed.

### 2.7 `programas` — entidad débil PROGRAMA + relación CARGA

| Columna | Tipo | Restricciones |
|---|---|---|
| `materia_id` | INT UNSIGNED | **PK** · FK → `materias`, CASCADE |
| `anio_academico` | SMALLINT | **PK**, `CHECK BETWEEN 1950 AND 2100` |
| `version` | VARCHAR(20) | **PK** |
| `titulo` | VARCHAR(180) | NOT NULL |
| `archivo_url` | VARCHAR(255) | NULL |
| `docente_referencia` | VARCHAR(120) | NULL |
| `cargado_por` | INT UNSIGNED | FK → `usuarios`, NULL, `ON DELETE SET NULL` |
| `fecha_publicacion` | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| `vigente` | BOOLEAN | DEFAULT TRUE |

La clave primaria es el identificador parcial (`anio_academico`, `version`) más la clave
de la entidad fuerte (`materia_id`): es la traducción textual de la regla de paso a tablas
de una entidad débil. No hay clave subrogada porque el programa no tiene identidad propia
fuera de su materia.

### 2.8 `contenidos` — supertipo CONTENIDO + relación ESCRIBE

| Columna | Tipo | Restricciones |
|---|---|---|
| `id_contenido` | INT UNSIGNED | **PK** |
| `usuario_id` | INT UNSIGNED | FK → `usuarios`, NOT NULL, CASCADE |
| `tipo` | ENUM | `publicacion` / `comentario` — atributo discriminante |
| `cuerpo` | TEXT | NOT NULL |
| `estado` | ENUM | `publicado` (DEFAULT) / `oculto` / `eliminado` |
| `fecha_creacion` | DATETIME | DEFAULT CURRENT_TIMESTAMP |

Es el punto único al que apuntan `votos` y `reportes`, y donde vive el estado de
moderación.

### 2.9 `publicaciones` — subtipo PUBLICACIÓN

| Columna | Tipo | Restricciones |
|---|---|---|
| `id_contenido` | INT UNSIGNED | **PK** y **FK** → `contenidos`, CASCADE |
| `carrera_id` | INT UNSIGNED | FK → `carreras`, **NOT NULL** |
| `materia_id` | INT UNSIGNED | FK → `materias`, **NULL**, `ON DELETE SET NULL` |
| `titulo` | VARCHAR(180) | NOT NULL, `CHECK` longitud ≥ 5 |
| `categoria` | ENUM | `pregunta`, `apunte`, `parcial`, `profesor`, `experiencia`, `recomendacion`, `material` |
| `fijada` | BOOLEAN | DEFAULT FALSE |
| `visitas` | INT UNSIGNED | DEFAULT 0 |
| `fecha_actualizacion` | DATETIME | DEFAULT + ON UPDATE CURRENT_TIMESTAMP |
| `archivo_nombre`, `archivo_url` | VARCHAR | NULL, `CHECK` todo o nada |
| `archivo_tipo`, `archivo_tamano_kb` | VARCHAR · INT | NULL, `CHECK` ≤ 20 MB |

Que la clave primaria sea a la vez foránea al supertipo es lo que garantiza la
correspondencia uno a uno entre `contenidos` y su subtipo.

`carrera_id` es obligatoria y `materia_id` opcional: toda publicación se hace en el ámbito
de una carrera, pero puede no corresponder a ninguna materia (trámites, vida
universitaria). `ON DELETE SET NULL` conserva la publicación si se retira la materia del
catálogo.

El adjunto se controla con un `CHECK` de coherencia: o están el nombre y la ruta, o no
está ninguno de los dos.

### 2.10 `comentarios` — subtipo COMENTARIO

| Columna | Tipo | Restricciones |
|---|---|---|
| `id_contenido` | INT UNSIGNED | **PK** y **FK** → `contenidos`, CASCADE |
| `publicacion_id` | INT UNSIGNED | FK → `publicaciones`, NOT NULL, CASCADE |
| `comentario_padre_id` | INT UNSIGNED | FK → `comentarios`, NULL, CASCADE |

`comentario_padre_id` implementa la relación reflexiva `RESPONDE A`:
`comentario_padre_id IS NULL` identifica un comentario raíz. Un `CHECK` impide que un
comentario se responda a sí mismo. El borrado en cascada elimina el subárbol de respuestas
junto con su padre.

### 2.11 `votos` — relación VOTA

| Columna | Tipo | Restricciones |
|---|---|---|
| `usuario_id` | INT UNSIGNED | **PK** · FK → `usuarios`, CASCADE |
| `contenido_id` | INT UNSIGNED | **PK** · FK → `contenidos`, CASCADE |
| `valor` | TINYINT | `CHECK IN (-1, 1)` |
| `fecha_voto` | DATETIME | DEFAULT CURRENT_TIMESTAMP |

**Una sola tabla para publicaciones y comentarios.** La clave primaria compuesta
garantiza «un voto por usuario y contenido» sin necesidad de un `UNIQUE` adicional. El
valor 0 no se almacena: quitar el voto es eliminar la fila.

### 2.12 `favoritos` — relación GUARDA

`usuario_id` + `publicacion_id` como **PK compuesta**, más `fecha`. Ambas columnas son
claves foráneas con `ON DELETE CASCADE`.

A diferencia de `votos` y `reportes`, apunta al subtipo y no al supertipo: guardar un
comentario no tiene sentido en el producto.

### 2.13 `reportes` — relación REPORTA

| Columna | Tipo | Restricciones |
|---|---|---|
| `usuario_id` | INT UNSIGNED | **PK** · FK → `usuarios`, CASCADE |
| `contenido_id` | INT UNSIGNED | **PK** · FK → `contenidos`, CASCADE |
| `motivo` | ENUM | `spam`, `contenido_inapropiado`, `informacion_incorrecta`, `material_con_derechos`, `duplicado`, `otro` |
| `descripcion` | VARCHAR(500) | NULL |
| `estado` | ENUM | `pendiente` (DEFAULT), `en_revision`, `resuelto`, `rechazado` |
| `fecha_reporte` | DATETIME | DEFAULT CURRENT_TIMESTAMP |

Al apuntar al supertipo **desaparece la restricción `CHECK` de exclusión (XOR)** entre dos
claves foráneas opcionales que exigía el modelo anterior. La clave compuesta implica,
además, que cada persona puede reportar un contenido una sola vez.

---

## 3. Cardinalidades

| Relación | Cardinalidad | Lectura |
|---|---|---|
| ROL – USUARIO | (0,N) – (1,1) | Todo usuario tiene un rol |
| USUARIO – CARRERA (`estudia`) | (0,N) – (0,N) | Un usuario puede estudiar varias carreras |
| MATERIA – CARRERA (`carrera_materia`) | (1,N) – (0,N) | Una materia se dicta en al menos una carrera |
| MATERIA – PROGRAMA | (0,N) – (1,1) | Sin materia no hay programa |
| USUARIO – PROGRAMA (`carga`) | (0,N) – (0,1) | Quién lo subió, opcional |
| USUARIO – CONTENIDO (`escribe`) | (0,N) – (1,1) | Todo contenido tiene autor |
| CONTENIDO – PUBLICACIÓN / COMENTARIO | ISA total y disjunta | Cada contenido es exactamente uno de los dos |
| PUBLICACIÓN – CARRERA | (1,1) – (0,N) | Ámbito obligatorio |
| PUBLICACIÓN – MATERIA | (0,1) – (0,N) | Materia opcional |
| COMENTARIO – PUBLICACIÓN | (1,1) – (0,N) | |
| COMENTARIO – COMENTARIO | (0,1) – (0,N) | Reflexiva: respuestas anidadas |
| USUARIO – CONTENIDO (`vota`) | (0,N) – (0,N) | Un voto por par |
| USUARIO – PUBLICACIÓN (`guarda`) | (0,N) – (0,N) | Un favorito por par |
| USUARIO – CONTENIDO (`reporta`) | (0,N) – (0,N) | Un reporte por par |

---

## 4. Acciones referenciales

| Acción | Cuándo | Ejemplo |
|---|---|---|
| `CASCADE` | El hijo no tiene sentido sin el padre | Borrar un contenido borra sus votos, reportes y, si es publicación, sus comentarios y favoritos |
| `SET NULL` | El hijo sobrevive con la referencia vacía | Retirar una materia del catálogo no borra las publicaciones asociadas |
| `RESTRICT` | El padre no debe borrarse si está en uso | No se puede borrar un rol que tenga usuarios |

`ON UPDATE CASCADE` en general, con una excepción: las claves foráneas de `comentarios`
sobre `id_contenido` y `comentario_padre_id` usan `ON UPDATE RESTRICT`, porque **MariaDB
no admite restricciones `CHECK` sobre columnas sujetas a acciones referenciales en
cascada** y el `CHECK` que impide la autorreferencia es más valioso. Como las claves
primarias son subrogadas `AUTO_INCREMENT` y nunca se actualizan, no hay pérdida funcional.

---

## 5. Normalización

El esquema cumple la **tercera forma normal**. El desarrollo completo, con las
desnormalizaciones deliberadas y su justificación, está en la
[sección 7 del modelo conceptual](modelo-conceptual.md#7-normalización).

En síntesis:

- **1FN**: atributos atómicos; nada multivaluado.
- **2FN**: en las tablas de clave compuesta (`carrera_materia`, `estudia`) los atributos
  dependen del par completo, no de una parte.
- **3FN**: sin dependencias transitivas.

---

## 6. Índices

Además de los implícitos de claves primarias, únicas y foráneas:

| Índice | Tabla | Consulta que optimiza |
|---|---|---|
| `ix_usuarios_rol`, `ix_usuarios_estado` | `usuarios` | Filtros del panel de administración |
| `ix_materias_nombre` | `materias` | Búsqueda de materias por nombre |
| `ix_carmat_materia` | `carrera_materia` | «En qué carreras se dicta esta materia» (la PK ya resuelve el sentido inverso) |
| `ix_carmat_cursada` | `carrera_materia` | Malla curricular ordenada por año y cuatrimestre |
| `ix_estudia_carrera` | `estudia` | Estudiantes de una carrera |
| `ix_programas_vigente` | `programas` | Programas vigentes del ciclo actual |
| `ix_programas_usuario` | `programas` | Programas cargados por una persona |
| `ix_contenidos_usuario` | `contenidos` | Actividad del perfil |
| `ix_contenidos_tipo` | `contenidos` | Listados por tipo, estado y fecha |
| `ft_contenidos_cuerpo` (FULLTEXT) | `contenidos` | Búsqueda por texto en el cuerpo |
| `ix_pub_materia`, `ix_pub_carrera`, `ix_pub_categoria` | `publicaciones` | Foro de la materia y filtros de búsqueda |
| `ft_pub_titulo` (FULLTEXT) | `publicaciones` | Búsqueda por título |
| `ix_com_publicacion`, `ix_com_padre` | `comentarios` | Hilo de comentarios; respuestas de un comentario |
| `ix_votos_contenido` | `votos` | Cálculo del puntaje |
| `ix_favoritos_publicacion` | `favoritos` | Cuántas personas guardaron una publicación |
| `ix_reportes_estado`, `ix_reportes_contenido` | `reportes` | Cola de moderación |

Los índices `FULLTEXT` están divididos entre las dos tablas porque el título vive en el
subtipo y el cuerpo en el supertipo. En TP3 la búsqueda usa `MATCH … AGAINST` sobre ambos
en lugar del `LIKE '%texto%'` que no puede aprovechar índices.

---

## 7. Vistas

| Vista | Para qué |
|---|---|
| `v_publicaciones_detalle` | Publicación con la unión supertipo-subtipo ya resuelta, más autor, carrera, materia, puntaje, total de votos y total de comentarios. Es la contrapartida SQL de `publicacionesService.decorar()`. |
| `v_materias_por_carrera` | Malla curricular con carrera, materia y datos de cursada, más en cuántas carreras se dicta cada materia. |
| `v_reportes_pendientes` | Cola de moderación con el contenido reportado resuelto, sin que quien consulte tenga que saber si es publicación o comentario. |

---

## 8. Ejecución

```bash
mysql -u root -p --default-character-set=utf8mb4 < database/schema.sql
mysql -u root -p --default-character-set=utf8mb4 < database/seed.sql
```

`schema.sql` comienza con `DROP DATABASE IF EXISTS faculeaks`: **ejecutarlo borra la base
existente**.

Verificación rápida:

```sql
USE faculeaks;
SELECT COUNT(*) FROM carreras;         -- 13
SELECT COUNT(*) FROM materias;         -- 43
SELECT COUNT(*) FROM carrera_materia;  -- 74
SELECT COUNT(*) FROM contenidos;       -- 169
SELECT COUNT(*) FROM publicaciones;    -- 40
SELECT COUNT(*) FROM comentarios;      -- 129
SELECT COUNT(*) FROM votos;            -- 436

-- Materias compartidas: el caso que justifica la relación N:M
SELECT m.nombre, COUNT(*) AS carreras
FROM carrera_materia cm
JOIN materias m ON m.id_materia = cm.materia_id
GROUP BY m.id_materia
HAVING carreras > 1
ORDER BY carreras DESC;                -- 23 materias

-- Un único mecanismo de voto para los dos subtipos
SELECT c.tipo, COUNT(*) AS votos
FROM votos v
JOIN contenidos c ON c.id_contenido = v.contenido_id
GROUP BY c.tipo;
```

Las pruebas de restricciones y de borrado en cascada están en
[`database/README.md`](../database/README.md).

---

## 9. Coherencia con los datos del frontend

`database/seed.sql`, `data/*.json` y `assets/js/data/dataset.js` los emite un **único
generador** (`database/tools/generar_datos.py`) a partir de la misma estructura en memoria:
los identificadores, las relaciones y los textos son idénticos en los tres artefactos.
`id_contenido` es una secuencia compartida por publicaciones y comentarios, igual que en
la base.
