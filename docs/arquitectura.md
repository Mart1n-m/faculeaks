# Arquitectura del proyecto

## 1. Principio rector

El frontend construido en TP1 **no debe rehacerse** cuando se incorporen PHP y MySQL.
Para que eso sea posible, el proyecto separa tres responsabilidades y prohíbe que se
mezclen:

| Capa | Responsabilidad | Qué NO hace |
|------|-----------------|-------------|
| **Vistas** (`*.html`, `assets/js/pages/`) | Presentar información y capturar la interacción | No sabe de dónde vienen los datos |
| **Servicios** (`assets/js/services/*Service.js`) | Reglas de dominio y contrato de datos | No manipula el DOM |
| **Origen de datos** (`assets/js/services/repositorio.js`) | Obtener y guardar registros | No conoce la interfaz |

La única pieza que sabe *de dónde salen los datos* es `repositorio.js`. Cambiarla por
una implementación basada en `fetch()` es la totalidad del trabajo de integración de
TP2 en el lado del cliente.

---

## 2. Arquitectura actual (TP1)

```
┌─────────────────────────────────────────────────────────────┐
│  NAVEGADOR                                                  │
│                                                             │
│  ┌───────────────┐   ┌──────────────────┐                   │
│  │  Documento    │   │  app.js          │                   │
│  │  HTML         │──▶│  arranque        │                   │
│  │  data-pagina  │   └────────┬─────────┘                   │
│  └───────────────┘            │                             │
│                               ▼                             │
│                   ┌────────────────────────┐                │
│                   │  components/           │                │
│                   │  encabezado, pie,      │                │
│                   │  tarjetas, modal…      │                │
│                   └───────────┬────────────┘                │
│                               │                             │
│                   ┌───────────▼────────────┐                │
│                   │  pages/<vista>.js      │                │
│                   │  orquesta la vista     │                │
│                   └───────────┬────────────┘                │
│                               │  Promesas                   │
│                   ┌───────────▼────────────┐                │
│                   │  services/             │                │
│                   │  carreras, publicac.,  │                │
│                   │  comentarios, sesión…  │                │
│                   └───────────┬────────────┘                │
│                               │                             │
│                   ┌───────────▼────────────┐                │
│                   │  services/repositorio  │                │
│                   └──────┬──────────┬──────┘                │
│                          │          │                       │
│              ┌───────────▼──┐   ┌───▼──────────────┐        │
│              │ dataset.js   │   │ localStorage     │        │
│              │ (solo lect.) │   │ (altas, sesión,  │        │
│              │ 12 colecc.   │   │  votos, favor.)  │        │
│              └──────────────┘   └──────────────────┘        │
└─────────────────────────────────────────────────────────────┘

Las 12 colecciones del dataset son exactamente las 12 tablas del modelo
(docs/modelo-conceptual.md): el mock no inventa una estructura propia.
```

**Flujo de una acción típica** (crear un comentario):

1. `pages/publicacion.js` captura el `submit` y valida con `utils/validacion.js`.
2. Llama a `FL.comentariosService.createComentario({...})`, que devuelve una promesa.
3. El servicio aplica las reglas de dominio (sesión iniciada, longitud del texto) y
   delega en `FL.repositorio.insertar('comentarios', …)`.
4. El repositorio guarda el registro en memoria y, a través de
   `FL.almacenamiento`, en `localStorage`.
5. La vista vuelve a pedir el árbol de comentarios y lo repinta.

El paso 2 es el contrato. Los pasos 3 a 4 son la implementación intercambiable.

---

## 3. Arquitectura objetivo (TP2 y TP3)

```
┌───────────────────────┐        ┌──────────────────────────────┐
│  NAVEGADOR            │        │  SERVIDOR                    │
│                       │        │                              │
│  pages/               │        │  routes/     enrutamiento    │
│    │                  │        │     │                        │
│  services/  ─── HTTP ─┼───────▶│  controllers/  validación,   │
│    │        JSON      │        │     │          sesión        │
│  apiService           │◀───────┼──   │                        │
│    (fetch)            │        │  services/   reglas de       │
│                       │        │     │        negocio         │
└───────────────────────┘        │  models/     acceso a datos  │
                                 │     │        (PDO)           │
                                 │  ┌──▼──────────────────────┐ │
                                 │  │  MySQL / MariaDB        │ │
                                 │  │  esquema de TP1         │ │
                                 │  └─────────────────────────┘ │
                                 └──────────────────────────────┘
```

Correspondencias directas entre lo construido y lo que viene:

| TP1 (cliente) | TP2/TP3 (servidor) |
|---------------|--------------------|
| `repositorio.js` sobre `dataset.js` | `apiService.js` con `fetch()` → `controllers/` |
| `sesionService.iniciarSesion()` | `POST /api/auth/login` con `password_verify()` |
| `sesionService.PERMISOS` (matriz de roles) | Middleware de autorización sobre `roles`/`usuarios` |
| Validaciones de `utils/validacion.js` | Revalidación en `controllers/` (la del cliente no es seguridad) |
| Agregados calculados en JavaScript | Vista `v_publicaciones_detalle` y consultas SQL |
| Unión supertipo-subtipo en `decorar()` | `JOIN contenidos … publicaciones` en el servidor |
| Altas guardadas en `localStorage` | `INSERT` en MySQL dentro de una transacción |

Las vistas HTML y los módulos de `pages/` no aparecen en esa tabla: **no cambian**.

---

## 4. Decisiones de arquitectura y su justificación

### 4.1 Servicios asincrónicos desde el primer día

Todos los servicios devuelven `Promise`, aunque hoy los datos estén en memoria y la
respuesta sea inmediata. Si devolvieran valores sincrónicos, cada página tendría que
reescribirse al pasar a `fetch()`. El repositorio incluso simula una latencia de
120 ms, lo que permite ver los estados de carga reales de la interfaz.

### 4.2 Scripts clásicos con espacio de nombres, no módulos ES

Los módulos ES (`import`/`export`) fallan bajo el protocolo `file://` por política de
CORS. Se optó por scripts clásicos que registran su API en un único objeto global
`FL`, con una IIFE por archivo para no contaminar el ámbito global. Se conserva la
separación en archivos y responsabilidades, y el proyecto funciona tanto con servidor
como abierto directamente. La migración a módulos ES en TP2, si se decide, es
mecánica: cada IIFE ya expone exactamente su interfaz pública.

### 4.3 Dataset embebido en lugar de `fetch()` a los JSON

Los mocks existen en dos formas: los archivos de `/data` (uno por tabla, más el catálogo
de categorías) y `assets/js/data/dataset.js` (el mismo contenido como objeto JavaScript). Ambos los emite un único generador, de modo que no pueden
divergir. La aplicación consume el segundo para no depender de `fetch()` en TP1; los
JSON son la referencia documental y el insumo de las pruebas de coherencia.

### 4.4 Un único punto de acceso a `localStorage`

Ninguna vista ni servicio llama a `localStorage` directamente: todo pasa por
`utils/almacenamiento.js`, que centraliza el prefijo de claves (`faculeaks:`), el
serializado, el manejo de errores y una reserva en memoria para el modo privado.
Cuando el estado migre al servidor, se retira ese módulo de la capa de servicios sin
tocar una sola vista.

### 4.5 Baja lógica en lugar de borrado físico

El campo `estado` (`publicado`/`oculto`/`eliminado`) vive en el supertipo `CONTENIDO`.
Eliminar cambia el estado; no borra la fila. Así se preservan los comentarios asociados y
el historial de moderación, y —al estar en el supertipo— el mismo mecanismo sirve para
publicaciones y para comentarios.

### 4.6 Una sola relación para votar y reportar

`VOTA` y `REPORTA` apuntan a `CONTENIDO`, no a cada subtipo. En el frontend eso se traduce
en un único `voteContenido(idContenido, valor)` y un único mapa de votos en
`localStorage`; `votePublicacion` y `voteComentario` quedan como envoltorios de una línea
para no romper el contrato que ya usaban las páginas. La justificación del modelo está en
[`modelo-conceptual.md`](modelo-conceptual.md#51-una-sola-relación-de-voto-la-generalización-contenido).

---

## 5. Convenciones transversales

| Ámbito | Convención | Ejemplo |
|--------|------------|---------|
| Base de datos | `snake_case`, tablas en plural | `carrera_materia.anio_cursada` |
| Claves | Subrogada `id_<entidad>` en las entidades; compuesta en las relaciones N:M | `id_contenido` · `(usuario_id, contenido_id)` |
| JavaScript | `camelCase` | `carreraMateria`, `idContenido` |
| CSS | Prefijo `fl-` con notación BEM | `.fl-publicacion__titulo` |
| Archivos HTML | `kebab-case` | `crear-publicacion.html` |
| Módulos JS | `camelCase` | `crearPublicacion.js` |

La traducción entre `snake_case` y `camelCase` está hoy resuelta en el generador de
datos. En TP2 corresponderá al backend devolver el JSON ya en `camelCase`, o al
`apiService` mapear los nombres en un único punto.
