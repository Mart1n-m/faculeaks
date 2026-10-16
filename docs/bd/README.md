# Modelo de datos de FacuLeaks y su correspondencia con el frontend

## Archivos

| Archivo | Qué es |
|---|---|
| `facuLeaks_ae2.sql` | Esquema relacional en 3FN entregado en Base de Datos (AE2). **Es la fuente de verdad y no se modifica.** |
| `diagrama_logico_ae2.png` | Diagrama lógico del esquema relacional (15 tablas + 2 vistas). |
| `datos_prueba_ae2.sql` | Datos de prueba: solo `UPDATE` de fechas de la carga mínima e `INSERT` de filas nuevas. No altera la estructura. |
| `usuarios_bcrypt_ae3.sql` | AE3: reemplaza los hashes ficticios de la carga de prueba por un hash BCRYPT real (contraseña `faculeaks123`). No altera la estructura. |

Orden de ejecución en MySQL Workbench o phpMyAdmin (XAMPP):

1. `facuLeaks_ae2.sql`
2. `datos_prueba_ae2.sql`
3. `usuarios_bcrypt_ae3.sql`

Desde el AE3 el frontend ya no lee archivos JSON: consulta la base a través de los
servicios PHP de `api/` (ver el `README.md` de la raíz). `data/*.json` y
`exportar_json.py` se eliminaron.

## Columna de contraseña (AE3)

`usuarios.contrasena_cifrada` es `VARCHAR(255)`. Un hash BCRYPT mide hoy 60 caracteres,
pero PHP recomienda reservar 255 porque `PASSWORD_DEFAULT` puede pasar a un algoritmo que
produzca cadenas más largas. Por eso el esquema cumple el Paso 1 de la consigna sin
ningún `ALTER TABLE`.

## Regla de equiparación

Todo dato visible en un HTML tiene respaldo en el esquema: una columna, una vista o un cálculo
derivable de ellas. Lo que no cumple la regla se quitó del frontend.

## Página ↔ tablas

| Página | Tablas y vistas que respaldan lo que muestra |
|---|---|
| `index.html`, `apuntes.html`, `parciales.html`, `consultas.html` | `contenidos` ⋈ `publicaciones` ⋈ `usuarios` ⋈ `materias`; puntaje = `vw_puntaje_contenido`; cantidad de comentarios = `COUNT(*)` de `comentarios` |
| `listado_tabla.html`, `listado_box.html` | `productos` ⋈ `usuarios` ⋈ `materias` (`LEFT JOIN`, porque `id_materia` admite `NULL`) |
| `producto.html` | `productos` ⋈ `usuarios` ⋈ `materias` ⋈ `dicta` ⋈ `carreras`; votos del vendedor = suma del puntaje de sus contenidos |
| `comprar.html` | Comprador = usuario de la sesión (`api/perfil.php`); precios desde `api/productos.php`. La compra genera una fila de `ventas` y una de `detalla` por producto |

## Decisiones de equiparación

| Tema | HTML del AE1 | Esquema | Resolución |
|---|---|---|---|
| Título de publicación | Título propio | Solo `contenidos.cuerpo_texto` | Convención: la primera línea de `cuerpo_texto` es el título |
| Categoría Debates | Sección propia | `CHECK categoria IN ('apunte','parcial','final','consulta','recurso')` | `debates.html` pasa a `parciales.html` (parcial + final); Apuntes agrupa apunte + recurso |
| Votos, comentarios | Números fijos | Derivados | Calculados desde `vota` y `comentarios` |
| "hace 2 horas" | Texto fijo | `fecha_creacion` | Se muestra la fecha (`<time datetime>`) |
| Materia y adjunto | No se mostraban | `publicaciones.id_materia`, `archivo_nombre` | Se muestran en el pie de cada publicación |
| Stock, estado, descripción, especificaciones, consultas al vendedor | Presentes | Sin columna | Se quitaron |
| Código M-001 | Texto fijo | — | Se deriva de `id_producto` (`M-` + 3 dígitos) |
| Tipo "Digital" | Etiqueta | `CHECK tipo_material IN ('apunte','libro','guia','pdf','otro')` | Etiquetas y clases CSS con los valores del `CHECK` |
| Fecha del producto | "hace 2 horas" | `productos` no tiene fecha | Se quitó |
| Medio de pago | tarjeta / transferencia / billetera / efectivo | `mercado_pago`, `transferencia`, `efectivo` | Radios con los valores del `CHECK`; se quitaron cuotas |
| Datos del cliente | Formulario libre | `ventas.id_usuario` (FK a `usuarios`) | Comprador = usuario de la sesión real (AE3); datos de solo lectura |
| Dirección de envío | Formulario | Sin columna | Se conserva porque la exigía la consigna del AE1; se aclara que no se registra en la venta |
| Teléfono, entrega, comentarios, novedades | Formulario | Sin columna | Se quitaron |
| Materias Química General, Derecho Comercial | Publicaciones y productos | Sin carrera que las dicte | Reemplazadas por materias de Ingeniería en Sistemas de Información |

## Formato de las respuestas de la API

- `api/productos.php` devuelve el `JOIN` `productos ⋈ usuarios ⋈ materias` (`LEFT JOIN` con
  materias, porque `id_materia` admite `NULL`), con las columnas de `productos` más
  `alias_vendedor` y `nombre_materia`.
- `api/materias.php` devuelve `id_materia` y `nombre`.
- `api/perfil.php` nunca incluye `contrasena_cifrada`.
- `DECIMAL` → número; `DATETIME` → texto `AAAA-MM-DD HH:MM:SS`; `NULL` → `null`.
