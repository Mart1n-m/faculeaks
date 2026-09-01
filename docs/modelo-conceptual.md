# Modelo conceptual — Diagrama entidad-relación en notación de Chen

El diagrama dibujado está en [`der-chen.html`](der-chen.html) (abrilo en el navegador).
Este documento explica el modelo, justifica cada decisión y muestra el paso a tablas.

**Bibliografía de referencia:** Chen, P. P-S. (1976). *The Entity-Relationship Model —
Toward a Unified View of Data*. ACM Transactions on Database Systems, 1(1), 9-36.

---

## 1. Resumen

| | Modelo anterior | Modelo actual |
|---|---|---|
| Entidades del DER | 16 (todas tratadas como entidad) | **8** |
| Tablas | 16 | **12** |
| Tablas de votos | 2 (`votos_publicacion`, `votos_comentario`) | **1** (`votos`) |
| Restricción de exclusión (XOR) | 1, en `reportes` | **0** |
| Jerarquías de generalización | 0 | 1 (`CONTENIDO`) |
| Entidades débiles | 0 | 1 (`PROGRAMA`) |

**Entidades:** `ROL`, `USUARIO`, `CARRERA`, `MATERIA`, `CONTENIDO` (con sus
especializaciones `PUBLICACIÓN` y `COMENTARIO`) y `PROGRAMA` (débil).

**Relaciones:** `POSEE`, `ESTUDIA`, `SE DICTA EN`, `TIENE PROGRAMA`, `CARGA`, `ESCRIBE`,
`PERTENECE A`, `TRATA SOBRE`, `COMENTA`, `RESPONDE A`, `VOTA`, `GUARDA`, `REPORTA`.

---

## 2. Elementos de la notación de Chen empleados

| Símbolo | Significado | Dónde aparece |
|---|---|---|
| Rectángulo | Entidad | Las 7 entidades fuertes |
| Rectángulo doble | Entidad débil | `PROGRAMA` |
| Rombo | Relación | Las 13 relaciones |
| Rombo doble | Relación identificadora | `TIENE PROGRAMA` |
| Elipse | Atributo | Lámina 2 del diagrama |
| Texto subrayado | Identificador | `id_usuario`, `id_carrera`, … |
| Texto con subrayado discontinuo | Identificador parcial | `anio_academico`, `version` de `PROGRAMA` |
| Línea simple | Participación parcial (mínimo 0) | La mayoría |
| Línea doble | Participación total (mínimo 1) | `CONTENIDO` en `ESCRIBE`, `COMENTARIO` en `COMENTA`, `PUBLICACIÓN` en `PERTENECE A`, `PROGRAMA` en `TIENE PROGRAMA`, `CONTENIDO` en la jerarquía ISA |
| Círculo ISA | Generalización / especialización | `CONTENIDO` → `PUBLICACIÓN` / `COMENTARIO` |
| Etiqueta `(mín, máx)` | Cardinalidad | En cada arco |
| Rol junto al arco | Papel en una relación reflexiva | *respuesta* / *padre* en `RESPONDE A` |

Las cardinalidades se anotan como **(mínimo, máximo)** en el extremo de la entidad a la
que corresponden: `(0,N)` significa que una ocurrencia de esa entidad puede no participar
y, si participa, puede hacerlo con muchas ocurrencias de la otra.

---

## 3. Entidades

### 3.1 ROL

Catálogo de los cuatro perfiles de permisos: `invitado`, `usuario`, `moderador`,
`administrador`.

- Identificador: `id_rol`
- Atributos: `nombre` (único), `descripcion`

*Invitado* figura en la tabla para que el modelo sea completo, aunque en la práctica
corresponda a la ausencia de sesión.

### 3.2 USUARIO

- Identificador: `id_usuario`
- Atributos: `username` (único), `email` (único), `password_hash`, `nombre`, `apellido`,
  `avatar_url`, `biografia`, `estado`, `fecha_registro`

### 3.3 CARRERA

- Identificador: `id_carrera`
- Atributos: `nombre` (único), `slug` (único), `descripcion`, `duracion_anios`, `activa`

El `slug` no aporta información nueva pero permite URLs legibles en TP2
(`/carreras/ingenieria-en-sistemas`) sin exponer los identificadores internos.

### 3.4 MATERIA

- Identificador: `id_materia`
- Atributos: `codigo` (único), `nombre`, `descripcion`, `activa`

Catálogo **global**: una materia existe con independencia de la carrera que la dicte. Esa
independencia es la condición para que pueda compartirse entre carreras.

### 3.5 CONTENIDO, con sus especializaciones PUBLICACIÓN y COMENTARIO

`CONTENIDO` es la **generalización** de todo lo que un usuario escribe en el foro.

- Identificador: `id_contenido`
- Atributos comunes: `cuerpo`, `estado`, `fecha_creacion`, y `tipo` como **atributo
  discriminante**.

La especialización es **total y disjunta**:

- *total* (línea doble hacia el círculo ISA): todo contenido es publicación o comentario;
  no existe un contenido que no sea ninguno de los dos.
- *disjunta*: ninguno es las dos cosas a la vez.

`PUBLICACIÓN` agrega `titulo`, `categoria`, `fijada`, `visitas`, `fecha_actualizacion` y
los cuatro campos del adjunto opcional. `COMENTARIO` no agrega atributos propios: solo
las relaciones `COMENTA` y `RESPONDE A`.

### 3.6 PROGRAMA (entidad débil)

Un programa es el plan de contenidos de una materia para un ciclo lectivo.

- **Identificador parcial:** `anio_academico` + `version`
- Identificador completo: el parcial más `id_materia`, la clave de la entidad fuerte
- Atributos: `titulo`, `archivo_url`, `docente_referencia`, `fecha_publicacion`, `vigente`

Es débil porque **no tiene existencia propia**: un programa sin materia no significa nada,
y «v2.0 del ciclo 2026» solo identifica algo dentro de una materia concreta. Se conecta a
`MATERIA` mediante la relación identificadora `TIENE PROGRAMA` (rombo doble).

---

## 4. Relaciones

| Relación | Entidades y cardinalidad | Atributos propios | Regla que expresa |
|---|---|---|---|
| `POSEE` | ROL (0,N) — USUARIO (1,1) | — | Todo usuario tiene un rol |
| `ESTUDIA` | USUARIO (0,N) — CARRERA (0,N) | `anio_ingreso`, `sede`, `activo` | Un usuario puede estudiar varias carreras |
| `SE DICTA EN` | MATERIA (1,N) — CARRERA (0,N) | `anio_cursada`, `cuatrimestre`, `obligatoria` | Una materia se comparte entre carreras |
| `TIENE PROGRAMA` | MATERIA (0,N) — PROGRAMA (1,1) | — | Relación identificadora de la entidad débil |
| `CARGA` | USUARIO (0,N) — PROGRAMA (0,1) | — | Quién subió el programa |
| `ESCRIBE` | USUARIO (0,N) — CONTENIDO (1,1) | — | Todo contenido tiene autor |
| `PERTENECE A` | PUBLICACIÓN (1,1) — CARRERA (0,N) | — | Toda publicación está en el ámbito de una carrera |
| `TRATA SOBRE` | PUBLICACIÓN (0,1) — MATERIA (0,N) | — | La materia es opcional |
| `COMENTA` | COMENTARIO (1,1) — PUBLICACIÓN (0,N) | — | Todo comentario cuelga de una publicación |
| `RESPONDE A` | COMENTARIO (0,1) — COMENTARIO (0,N) | — | Respuestas anidadas (reflexiva) |
| `VOTA` | USUARIO (0,N) — CONTENIDO (0,N) | `valor`, `fecha_voto` | Un voto por usuario y contenido |
| `GUARDA` | USUARIO (0,N) — PUBLICACIÓN (0,N) | `fecha` | Favoritos |
| `REPORTA` | USUARIO (0,N) — CONTENIDO (0,N) | `motivo`, `descripcion`, `estado`, `fecha_reporte` | Un reporte por usuario y contenido |

### Sobre `SE DICTA EN`

Los tres atributos de la relación **dependen del par** (carrera, materia), no de la
materia sola: *Bases de Datos* es de 2.º año y obligatoria en Ingeniería en Sistemas, y de
2.º y obligatoria en el Analista Universitario, pero *Paradigmas de la Programación* es de
3.º y obligatoria en la primera y de 3.º y **optativa** en la segunda. Ponerlos en
`MATERIA` violaría la segunda forma normal. En el seed, **23 de las 43 materias** se
dictan en más de una carrera.

### Sobre `RESPONDE A`

Es la única relación **reflexiva** del modelo: asocia `COMENTARIO` consigo mismo. Los dos
extremos llevan rol para distinguir el papel de cada participante: *respuesta* (0,1) y
*padre* (0,N). Un comentario responde a lo sumo a otro; un comentario puede tener muchas
respuestas.

---

## 5. Las tres decisiones de fondo

### 5.1 Una sola relación de voto: la generalización CONTENIDO

Votar y reportar se aplican por igual a publicaciones y a comentarios. Sin una entidad que
los reúna hay tres caminos, y los tres tienen costo:

| Alternativa | Problema |
|---|---|
| Dos tablas gemelas (`votos_publicacion`, `votos_comentario`) | La misma relación modelada dos veces. Cada consulta de puntaje se escribe dos veces, y cualquier cambio hay que aplicarlo en los dos lados. |
| Una tabla con dos claves foráneas opcionales y un `CHECK` de exclusión | Funciona, pero el XOR es un parche del modelo relacional sin correlato conceptual: en el DER no existe «una relación que apunta a una cosa o a otra». |
| Una tabla polimórfica (`tipo_objeto` + `id_objeto`) | **No admite claves foráneas reales**: la integridad referencial se traslada al código de la aplicación. Inaceptable en un modelo de base de datos. |

`CONTENIDO` resuelve las tres cosas: `VOTA` y `REPORTA` tienen **un único extremo**, con
integridad referencial verificada por el motor. Como beneficio adicional, el `estado` de
moderación vive en el supertipo, así que ocultar o eliminar funciona igual para los dos
subtipos, y el autor (`ESCRIBE`) se declara una sola vez.

**Costo:** una unión más en cada consulta de publicaciones o comentarios. Se encapsula en
la vista `v_publicaciones_detalle` para que el resto del sistema no la repita.

### 5.2 La estructura académica se reduce a CARRERA — MATERIA

El modelo anterior interponía `PLAN_ESTUDIO` y `PLAN_MATERIA` entre carrera y materia. Esa
cadena solo aporta si el sistema necesita distinguir a los estudiantes por versión de plan
—correlatividades, equivalencias, planes en extinción—, y FacuLeaks no hace nada de eso:
el foro necesita saber qué materias tiene una carrera y en qué año se cursan.

La relación `SE DICTA EN` conserva **toda** la información que el sistema usaba (año,
cuatrimestre, obligatoriedad, materias compartidas) con dos entidades menos y una tabla
menos.

**Qué se pierde:** la posibilidad de mostrar dos versiones del plan de una misma carrera.
Si en TP3 hiciera falta, se recupera introduciendo `PLAN_ESTUDIO` entre `CARRERA` y la
relación, sin tocar el resto del modelo.

### 5.3 Lo que dejó de ser entidad

| Antes | Ahora | Motivo |
|---|---|---|
| `perfiles_academicos` | Relación `ESTUDIA` | Nunca fue una entidad: es la asociación N:M entre usuario y carrera, y `anio_ingreso` y `sede` son atributos de esa asociación. |
| `categorias_publicacion` | Atributo `categoria` de `PUBLICACIÓN` | Siete valores fijos que describen la publicación. Un catálogo cerrado es un dominio de atributo, no un objeto con existencia propia. |
| `adjuntos` | Atributos de `PUBLICACIÓN` | Como máximo un archivo por publicación, así que son atributos simples y no un grupo repetitivo: no vulnera la 1FN. |
| `planes_estudio`, `plan_materia` | Relación `SE DICTA EN` | Ver 5.2. |
| `votos_publicacion`, `votos_comentario` | Relación `VOTA` | Ver 5.1. |

---

## 6. Paso a tablas

Reglas aplicadas, en el orden en que se aplican:

**Regla 1 — Entidad fuerte.** Una tabla por entidad; su identificador es la clave
primaria.
→ `roles`, `usuarios`, `carreras`, `materias`, `contenidos`.

**Regla 2 — Relación 1:N.** No genera tabla: la clave de la entidad del lado *uno* se
propaga como clave foránea a la tabla del lado *muchos*, junto con los atributos de la
relación si los hubiera.
→ `POSEE` produce `usuarios.rol_id`; `ESCRIBE` produce `contenidos.usuario_id`;
`PERTENECE A` produce `publicaciones.carrera_id`; `TRATA SOBRE` produce
`publicaciones.materia_id`; `COMENTA` produce `comentarios.publicacion_id`; `CARGA`
produce `programas.cargado_por`.

**Regla 3 — Relación N:M.** Genera una tabla propia cuya clave primaria es la unión de las
claves de las entidades participantes, más los atributos de la relación.
→ `carrera_materia`, `estudia`, `votos`, `favoritos`, `reportes`.

> Consecuencia útil: como la clave primaria es el par de participantes, «un usuario vota
> una sola vez cada contenido» y «un usuario guarda una sola vez cada publicación» quedan
> garantizados **por la propia clave**, sin necesidad de una restricción `UNIQUE` extra.

**Regla 4 — Relación reflexiva 1:N.** Se propaga la clave a la misma tabla, con otro
nombre de columna.
→ `RESPONDE A` produce `comentarios.comentario_padre_id`.

**Regla 5 — Entidad débil.** La clave primaria es el identificador parcial más la clave de
la entidad fuerte de la que depende; la relación identificadora no genera tabla.
→ `programas` con clave primaria `(materia_id, anio_academico, version)`.

**Regla 6 — Jerarquía ISA total y disjunta.** Se elige entre tres estrategias:

| Estrategia | Descripción | Por qué se descartó / eligió |
|---|---|---|
| Una tabla por subtipo | Solo `publicaciones` y `comentarios` | ✗ `VOTA` y `REPORTA` no tendrían a dónde apuntar: vuelve el problema de las dos claves foráneas. |
| Una tabla única con discriminante | Todo en una tabla con columnas anulables | ✗ La mitad de las columnas quedan siempre nulas en los comentarios. |
| **Supertipo + un subtipo por tabla** | `contenidos` + `publicaciones` + `comentarios`, con la clave del subtipo siendo a la vez foránea al supertipo | ✓ **Elegida.** Es la única que permite que `VOTA` y `REPORTA` referencien un único extremo con clave foránea real. |

Resultado: **12 tablas**. El detalle columna por columna está en la lámina 3 de
[`der-chen.html`](der-chen.html) y en [`base-de-datos.md`](base-de-datos.md).

---

## 7. Normalización

El esquema cumple la **tercera forma normal**.

**1FN.** Todos los atributos son atómicos y monovaluados. No hay listas: las materias de
una carrera, los votos, los favoritos y los reportes viven en tablas propias. El adjunto
de una publicación es único por regla de negocio, de modo que sus cuatro campos son
atributos simples y no un grupo repetitivo.

**2FN.** Ninguna tabla con clave compuesta tiene atributos que dependan de parte de la
clave. El caso crítico es `carrera_materia`: `anio_cursada`, `cuatrimestre` y
`obligatoria` dependen del par completo, no de la carrera ni de la materia por separado.
Lo mismo en `estudia` con `anio_ingreso`.

**3FN.** No hay dependencias transitivas: el nombre del rol vive en `roles` y no se repite
en `usuarios`; el nombre de la carrera vive en `carreras` y `publicaciones` solo guarda su
clave foránea.

### Desnormalizaciones deliberadas

| Caso | Justificación |
|---|---|
| `publicaciones.visitas` | Contador acumulado. Derivarlo exigiría una tabla de visitas de altísimo volumen para un dato meramente informativo. |
| `publicaciones.carrera_id` cuando existe `materia_id` | La carrera **no** es derivable sin ambigüedad: una materia se dicta en varias carreras. Se guarda el ámbito que eligió el autor. |
| `contenidos.tipo` | Redundante con la presencia de la fila en `publicaciones` o en `comentarios`, pero evita dos `LEFT JOIN` solo para saber de qué tipo es un contenido. Es el atributo discriminante estándar de una jerarquía ISA. |

El puntaje de una publicación **no** está desnormalizado: se calcula con `SUM(valor)` sobre
`votos` y se expone en la vista `v_publicaciones_detalle`.

---

## 8. Diferencias con el diagrama original del TP

| Cambio | Motivo |
|---|---|
| Aparece `CONTENIDO` con especialización ISA | Unifica voto y reporte sobre publicaciones y comentarios |
| Desaparecen `PLAN_ESTUDIO` y `PLAN_MATERIA` | La cadena intermedia no aporta al caso de uso del foro |
| `perfiles_academicos` pasa a ser la relación `ESTUDIA` | No era una entidad |
| `categorias_publicacion` pasa a ser un atributo | Catálogo cerrado de siete valores |
| `adjuntos` pasa a ser atributos de `PUBLICACIÓN` | Un adjunto por publicación |
| `PROGRAMA` pasa a ser entidad débil de `MATERIA` | Refleja su dependencia real de existencia |
| `publicaciones.carrera_id` pasa a ser obligatoria | Toda publicación se hace en el ámbito de una carrera |
| Desaparece el `CHECK` de exclusión (XOR) de `reportes` | Ya no hacen falta dos claves foráneas opcionales |
| Se agregan las vistas `v_publicaciones_detalle`, `v_materias_por_carrera` y `v_reportes_pendientes` | Encapsulan las uniones entre supertipo y subtipos |
