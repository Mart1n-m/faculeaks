# Roadmap de incorporación del backend

Qué hay que cambiar exactamente para pasar de TP1 (frontend con datos simulados) a
TP2 (API PHP) y TP3 (persistencia en MySQL), **sin modificar las vistas**.

---

## 1. La regla

> Las páginas (`*.html` y `assets/js/pages/*.js`) consumen únicamente la interfaz
> pública de los servicios. Mientras esa interfaz no cambie, las vistas no cambian.

El trabajo de integración se concentra en **un solo archivo del cliente**:
`assets/js/services/repositorio.js`.

```
            HOY (TP1)                        TP2/TP3
  pages/  ──▶ services/  ──▶ repositorio  ──▶ dataset.js + localStorage
  pages/  ──▶ services/  ──▶ apiService   ──▶ fetch() ──▶ PHP ──▶ MySQL
  ▲ sin cambios          ▲ sin cambios     ▲ se reemplaza
```

---

## 2. Estructura del servidor a crear

```
FacuLeaks/
├── api/
│   └── index.php            Punto de entrada único
├── config/
│   ├── database.php         Credenciales y conexión PDO
│   └── config.php           Constantes de la aplicación
├── routes/
│   └── api.php              Tabla de rutas → controlador
├── controllers/
│   ├── AuthController.php
│   ├── CarrerasController.php
│   ├── MateriasController.php
│   ├── PublicacionesController.php
│   ├── ComentariosController.php
│   ├── InteraccionesController.php
│   ├── UsuariosController.php
│   └── ReportesController.php
├── services/
│   ├── PublicacionService.php
│   ├── ComentarioService.php
│   └── AuthService.php
├── models/
│   ├── Usuario.php
│   ├── Carrera.php
│   ├── Materia.php
│   ├── Programa.php
│   ├── Contenido.php        Supertipo
│   ├── Publicacion.php      Subtipo
│   ├── Comentario.php       Subtipo
│   └── Reporte.php
└── (frontend de TP1, sin cambios)
```

Ninguna de estas carpetas existe todavía: crearlas es parte de TP2.

---

## 3. Endpoints y su correspondencia con los servicios actuales

| Método actual (TP1) | Endpoint (TP2) | Controlador |
|---------------------|----------------|-------------|
| `sesionService.iniciarSesion()` | `POST /api/auth/login` | `AuthController@login` |
| `sesionService.cerrarSesion()` | `POST /api/auth/logout` | `AuthController@logout` |
| `sesionService.registrar()` | `POST /api/auth/registro` | `AuthController@registro` |
| `sesionService.usuarioActual()` | `GET /api/auth/sesion` | `AuthController@sesion` |
| `carrerasService.getCarreras()` | `GET /api/carreras` | `CarrerasController@index` |
| `carrerasService.getCarreraById(id)` | `GET /api/carreras/{id}` | `CarrerasController@show` |
| `carrerasService.getMateriasByCarrera(id)` | `GET /api/carreras/{id}/materias` | `CarrerasController@materias` |
| `carrerasService.getMateriaById(id)` | `GET /api/materias/{id}` | `MateriasController@show` |
| `carrerasService.getCarrerasDeMateria(id)` | `GET /api/materias/{id}/carreras` | `MateriasController@carreras` |
| `carrerasService.getProgramasByMateria(id)` | `GET /api/materias/{id}/programas` | `MateriasController@programas` |
| `publicacionesService.getPublicaciones(f)` | `GET /api/publicaciones?carrera=&materia=&categoria=&q=&orden=&pagina=` | `PublicacionesController@index` |
| | `categoria` viaja como valor del ENUM (`apunte`), no como identificador | |
| `publicacionesService.getPublicacionById(id)` | `GET /api/publicaciones/{id}` | `PublicacionesController@show` |
| `publicacionesService.createPublicacion(d)` | `POST /api/publicaciones` | `PublicacionesController@store` |
| `publicacionesService.updatePublicacion(id, d)` | `PUT /api/publicaciones/{id}` | `PublicacionesController@update` |
| `publicacionesService.deletePublicacion(id)` | `DELETE /api/publicaciones/{id}` | `PublicacionesController@destroy` |
| `comentariosService.getComentarios(id)` | `GET /api/publicaciones/{id}/comentarios` | `ComentariosController@index` |
| `comentariosService.createComentario(d)` | `POST /api/comentarios` | `ComentariosController@store` |
| `interaccionesService.voteContenido(id, v)` | `POST /api/contenidos/{id}/votos` | `InteraccionesController@votar` |
| `interaccionesService.toggleFavorito(id)` | `POST /api/publicaciones/{id}/favorito` | `InteraccionesController@favorito` |
| `interaccionesService.getFavoritos()` | `GET /api/favoritos` | `InteraccionesController@favoritos` |
| `interaccionesService.createReporte(d)` | `POST /api/reportes` | `ReportesController@store` |
| `interaccionesService.getReportes(f)` | `GET /api/reportes?estado=` | `ReportesController@index` |
| `interaccionesService.resolverReporte(u, c, e)` | `PATCH /api/reportes/{usuario}/{contenido}` | `ReportesController@update` |
| `usuariosService.getUsuarios(f)` | `GET /api/usuarios` | `UsuariosController@index` |
| `usuariosService.cambiarRol(id, rol)` | `PATCH /api/usuarios/{id}/rol` | `UsuariosController@rol` |
| `usuariosService.cambiarEstado(id, e)` | `PATCH /api/usuarios/{id}/estado` | `UsuariosController@estado` |

---

## 4. Paso 1 — Reemplazar el repositorio por `apiService`

Se crea `assets/js/services/apiService.js` con **la misma interfaz** que
`repositorio.js`:

```js
window.FL = window.FL || {};

FL.apiService = (function () {
  'use strict';

  var BASE = '/api';

  function pedir(ruta, opciones) {
    var config = Object.assign({
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin'      // la cookie de sesión de PHP
    }, opciones || {});

    return fetch(BASE + ruta, config).then(function (respuesta) {
      if (respuesta.status === 204) return null;
      return respuesta.json().then(function (cuerpo) {
        if (!respuesta.ok) {
          throw new Error(cuerpo && cuerpo.mensaje
            ? cuerpo.mensaje
            : 'Error ' + respuesta.status);
        }
        return cuerpo.datos;
      });
    });
  }

  return {
    obtener:  function (ruta)        { return pedir(ruta); },
    crear:    function (ruta, datos) { return pedir(ruta, { method: 'POST',  body: JSON.stringify(datos) }); },
    modificar:function (ruta, datos) { return pedir(ruta, { method: 'PATCH', body: JSON.stringify(datos) }); },
    borrar:   function (ruta)        { return pedir(ruta, { method: 'DELETE' }); }
  };
})();
```

Después, cada servicio de dominio sustituye su llamada al repositorio por la llamada
al API. El cambio en `carrerasService` es representativo:

```js
// TP1
function getCarreras(filtros) {
  return FL.repositorio.obtener('carreras').then(function (lista) {
    /* filtrado y decoración en el cliente */
  });
}

// TP2
function getCarreras(filtros) {
  return FL.apiService.obtener(FL.dom.urlCon('/carreras', filtros));
}
```

La firma, el tipo de retorno (`Promise<Array>`) y la forma de los objetos no cambian:
**las páginas no se tocan**.

---

## 5. Paso 2 — Formato de respuesta del servidor

Contrato único para toda la API:

```json
{
  "ok": true,
  "datos": { },
  "mensaje": null
}
```

```json
{
  "ok": false,
  "datos": null,
  "mensaje": "El título debe tener al menos 5 caracteres.",
  "errores": { "titulo": "El título debe tener al menos 5 caracteres." }
}
```

El objeto `errores` usa **las mismas claves** que el esquema de validación del cliente,
de modo que `FL.validacion.mostrarErrores(formulario, respuesta.errores)` funciona sin
adaptaciones.

El listado paginado conserva la forma que ya devuelve `getPublicaciones`:

```json
{ "items": [], "total": 40, "pagina": 1, "paginas": 4 }
```

El servidor debe devolver los campos en **`camelCase`** (`idPublicacion`,
`fechaCreacion`) para que coincidan con los mocks; si se prefiere devolver
`snake_case`, la conversión se hace en un único punto dentro de `apiService`.

---

## 6. Paso 3 — Autenticación y permisos

| Aspecto | TP1 | TP2 |
|---------|-----|-----|
| Verificación de contraseña | No existe | `password_verify()` contra `usuarios.password_hash` |
| Alta de contraseña | No se almacena | `password_hash($clave, PASSWORD_DEFAULT)` |
| Sesión | `localStorage['faculeaks:sesion']` | `session_start()` + cookie `HttpOnly` |
| Permisos | `sesionService.PERMISOS` en el cliente | Middleware en el servidor, sobre `usuarios.rol_id` |
| Selector de rol de demostración | Presente en el pie | **Se elimina** |

**El control de permisos del cliente es solo interfaz.** Ocultar el enlace a
`admin.html` evita mostrar una opción inútil, pero no protege nada: cualquiera puede
escribir la URL. En TP2, cada endpoint sensible debe verificar el rol en el servidor:

```php
// controllers/ReportesController.php
public function update($id) {
    $this->requiereRol(['moderador', 'administrador']);
    // …
}
```

La matriz `PERMISOS` de `sesionService.js` se traduce directamente a ese middleware.

---

## 7. Paso 4 — Retirar `localStorage`

| Clave | Reemplazo en TP2 |
|-------|------------------|
| `sesion` | Sesión de PHP |
| `usuarios`, `estudia` | `INSERT` en `usuarios` y `estudia` |
| `contenidos`, `publicaciones`, `comentarios`, `reportes` | `INSERT` en las tablas correspondientes, dentro de una transacción |
| `votos` | `INSERT`/`UPDATE`/`DELETE` en `votos` |
| `favoritos` | `INSERT`/`DELETE` en `favoritos` |
| `secuencias` | `AUTO_INCREMENT` de MySQL |

Como ningún archivo fuera de `utils/almacenamiento.js` toca `localStorage`, basta con
dejar de invocarlo desde los servicios. El módulo puede conservarse para preferencias
de interfaz (por ejemplo, el último orden elegido), que son legítimamente locales.

---

## 8. Paso 5 — Consultas SQL

El esquema y las vistas de TP1 están pensados para esto. Ejemplos:

**Listado del foro de una materia** (reemplaza el filtrado en memoria de
`getPublicaciones`, y aprovecha `ix_pub_materia_fecha`):

```sql
SELECT * FROM v_publicaciones_detalle
WHERE id_materia = :materia AND estado = 'publicado'
ORDER BY fijada DESC, fecha_creacion DESC
LIMIT :limite OFFSET :offset;
```

La vista ya resuelve la unión entre `contenidos` y `publicaciones`, de modo que el
controlador no necesita conocer la jerarquía.

**Búsqueda por texto** (reemplaza `FL.formato.normalizar` + `indexOf`; el título está en
el subtipo y el cuerpo en el supertipo, así que hay un índice `FULLTEXT` en cada uno):

```sql
SELECT p.id_contenido
FROM publicaciones p
JOIN contenidos c ON c.id_contenido = p.id_contenido
WHERE (MATCH(p.titulo) AGAINST (:texto IN NATURAL LANGUAGE MODE)
    OR MATCH(c.cuerpo) AGAINST (:texto IN NATURAL LANGUAGE MODE))
  AND c.estado = 'publicado';
```

**Voto alternable** (misma semántica que `interaccionesService.voteContenido`, y la
misma consulta para publicaciones y para comentarios):

```sql
INSERT INTO votos (usuario_id, contenido_id, valor)
VALUES (:usuario, :contenido, :valor)
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- Si la persona repite el mismo valor, se elimina la fila:
DELETE FROM votos
WHERE usuario_id = :usuario AND contenido_id = :contenido AND valor = :valor;
```

**Alta de publicación** (transacción obligatoria: son dos filas, supertipo y subtipo):

```php
$pdo->beginTransaction();
$pdo->prepare('INSERT INTO contenidos (usuario_id, tipo, cuerpo)
               VALUES (:usuario, "publicacion", :cuerpo)')->execute($datos);
$idContenido = $pdo->lastInsertId();
$pdo->prepare('INSERT INTO publicaciones (id_contenido, carrera_id, materia_id,
                                          titulo, categoria)
               VALUES (:id, :carrera, :materia, :titulo, :categoria)')
    ->execute(['id' => $idContenido] + $datos);
$pdo->commit();
```

Es la traducción directa de lo que ya hace `publicacionesService.createPublicacion()` en
el cliente: dos inserciones encadenadas con la misma clave.

Todas las consultas deben usar **sentencias preparadas** con PDO. Nunca concatenar
valores en el SQL.

---

## 9. Paso 6 — Subida real de archivos

En TP1 el formulario registra el nombre, el tipo y el tamaño del archivo, pero no lo
sube. En TP2:

1. Cambiar el envío de `crear-publicacion.html` a `FormData` (sin `Content-Type`
   manual: el navegador arma el `boundary`).
2. Validar en el servidor el tipo MIME real y el tamaño (el esquema ya limita a 20 MB
   con `CHECK (archivo_tamano_kb <= 20480)`).
3. Guardar el archivo con un nombre generado, fuera de la raíz web, y registrar la
   ruta en `publicaciones.archivo_url`.
4. Servir las descargas mediante un endpoint que verifique permisos, no por enlace
   directo.

Los botones «Descargar» de programas y del adjunto de una publicación, que hoy muestran
un aviso de descarga simulada, pasan a apuntar a ese endpoint.

---

## 10. Orden de trabajo sugerido

| Etapa | Tarea | Verificación |
|-------|-------|--------------|
| 1 | `config/database.php` con PDO y `api/index.php` que responda `GET /api/ping` | Devuelve JSON |
| 2 | `CarrerasController` completo (solo lectura) | `carreras.html` y `carrera.html` funcionan contra la API |
| 3 | `apiService.js` y migración de `carrerasService` | Las vistas académicas no se tocaron |
| 4 | `AuthController` con sesión real | Login, registro y cierre de sesión |
| 5 | `PublicacionesController` y `ComentariosController` (lectura y escritura, con la transacción supertipo-subtipo) | Alta de publicación y de comentario persisten en MySQL |
| 6 | `InteraccionesController` (votos, favoritos, reportes) | Se retira `localStorage` de los servicios |
| 7 | Middleware de roles + `UsuariosController` y `ReportesController` | Moderación y administración protegidas en servidor |
| 8 | Subida de archivos | Adjuntos reales |
| 9 | Retirar el selector de rol de demostración del pie | — |

Después de cada etapa el sitio debe seguir navegándose completo: la migración es
incremental, servicio por servicio.

---

## 11. Qué no debe cambiar

- Los 13 documentos HTML.
- Los módulos de `assets/js/pages/`.
- Las hojas de estilo.
- Los componentes de `assets/js/components/`.
- La firma pública de los servicios de dominio.
- El esquema de la base de datos (`schema.sql`), que ya está diseñado para TP3.

Si al integrar el backend aparece la necesidad de tocar una vista, casi siempre indica
que la responsabilidad quedó del lado equivocado: conviene revisar si esa lógica
debería estar en el servicio y no en la página.
