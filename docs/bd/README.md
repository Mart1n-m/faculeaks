# Modelo de datos de FacuLeaks y su correspondencia con el frontend

## Archivos

| Archivo | Qué es |
|---|---|
| `facuLeaks_ae2.sql` | Esquema relacional en 3FN entregado en Base de Datos (AE2). **Es la fuente de verdad y no se modifica.** |
| `diagrama_logico_ae2.png` | Diagrama lógico del esquema relacional (15 tablas + 2 vistas). |
| `datos_prueba_ae2.sql` | Datos de prueba: solo `UPDATE` de fechas de la carga mínima e `INSERT` de filas nuevas. No altera la estructura. |
| `exportar_json.py` | Exporta cada tabla a `data/<tabla>.json` (equivale a `SELECT * ... ORDER BY <PK>`). |

Orden de ejecución en MySQL Workbench o phpMyAdmin (XAMPP):

1. `facuLeaks_ae2.sql`
2. `datos_prueba_ae2.sql`
3. `python docs/bd/exportar_json.py` (solo si se quieren regenerar los JSON)

## Regla de equiparación

Todo dato visible en un HTML tiene respaldo en el esquema: una columna, una vista o un cálculo
derivable de ellas. Lo que no cumple la regla se quitó del frontend.

## Página ↔ tablas

| Página | Tablas y vistas que respaldan lo que muestra |
|---|---|
| `index.html`, `apuntes.html`, `parciales.html`, `consultas.html` | `contenidos` ⋈ `publicaciones` ⋈ `usuarios` ⋈ `materias`; puntaje = `vw_puntaje_contenido`; cantidad de comentarios = `COUNT(*)` de `comentarios` |
| `listado_tabla.html`, `listado_box.html` | `productos` ⋈ `usuarios` ⋈ `materias` (`LEFT JOIN`, porque `id_materia` admite `NULL`) |
| `producto.html` | `productos` ⋈ `usuarios` ⋈ `materias` ⋈ `dicta` ⋈ `carreras`; votos del vendedor = suma del puntaje de sus contenidos |
| `comprar.html` | Lee `usuarios` (comprador) y `productos` (precios); la compra genera una fila de `ventas` y una de `detalla` por producto |

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
| Datos del cliente | Formulario libre | `ventas.id_usuario` (FK a `usuarios`) | Comprador = usuario de sesión simulada (`apiedrafita`, id 2), datos de solo lectura |
| Dirección de envío | Formulario | Sin columna | Se conserva porque la exigía la consigna del AE1; se aclara que no se registra en la venta |
| Teléfono, entrega, comentarios, novedades | Formulario | Sin columna | Se quitaron |
| Materias Química General, Derecho Comercial | Publicaciones y productos | Sin carrera que las dicte | Reemplazadas por materias de Ingeniería en Sistemas de Información |

## Formato de los JSON

- Un archivo por tabla, con las mismas claves que las columnas.
- `usuarios.json` no incluye `contrasena_cifrada`.
- `DECIMAL` → número; `DATETIME` → texto ISO 8601 (`AAAA-MM-DDTHH:MM:SS`); `NULL` → `null`.
- Las vistas no se exportan: sus valores se calculan en JavaScript a partir de las tablas.
