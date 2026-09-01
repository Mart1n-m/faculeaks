# Base de datos de FacuLeaks

Scripts SQL para MySQL 8.x / MariaDB 10.4+. El esquema es la traducción a tablas del DER
en notación de Chen documentado en [`../docs/modelo-conceptual.md`](../docs/modelo-conceptual.md)
y dibujado en [`../docs/der-chen.html`](../docs/der-chen.html).

| Archivo | Contenido |
|---|---|
| `schema.sql` | Estructura: 12 tablas, restricciones, índices y 3 vistas |
| `seed.sql` | Datos iniciales y de demostración |
| `tools/generar_datos.py` | Generador de `seed.sql`, `data/*.json` y `assets/js/data/dataset.js` |
| `tools/generar_html.py` | Generador de los 13 documentos HTML del frontend |
| `tools/generar_der.py` | Generador del diagrama `docs/der-chen.html` |

---

## Requisitos

- MySQL 8.0 o superior, o MariaDB 10.4 o superior (por las restricciones `CHECK`).
- Un usuario con permiso para crear bases de datos.
- Motor InnoDB disponible (es el predeterminado).

---

## Instalación

Desde la raíz del proyecto:

```bash
mysql -u root -p --default-character-set=utf8mb4 < database/schema.sql
mysql -u root -p --default-character-set=utf8mb4 < database/seed.sql
```

**El orden importa:** `schema.sql` crea la base y las tablas; `seed.sql` solo inserta
datos. La opción `--default-character-set=utf8mb4` evita que los acentos se guarden mal.

### Desde el cliente de MySQL

```sql
SOURCE /ruta/al/proyecto/database/schema.sql;
SOURCE /ruta/al/proyecto/database/seed.sql;
```

### Desde phpMyAdmin (XAMPP, WAMP, Laragon)

1. Pestaña **Importar** → seleccionar `schema.sql` → **Continuar**.
2. Elegir la base `faculeaks` en el panel izquierdo.
3. Pestaña **Importar** → seleccionar `seed.sql` → **Continuar**.

---

## Advertencia

`schema.sql` empieza con:

```sql
DROP DATABASE IF EXISTS faculeaks;
```

**Ejecutarlo borra por completo la base `faculeaks` existente.** Es el comportamiento
buscado en desarrollo, pero conviene tenerlo presente.

`seed.sql` es idempotente: hace `TRUNCATE` antes de insertar, de modo que puede ejecutarse
varias veces sin duplicar datos.

---

## Verificación

```sql
USE faculeaks;

SELECT 'roles',           COUNT(*) FROM roles                   -- 4
UNION ALL SELECT 'usuarios',        COUNT(*) FROM usuarios        -- 14
UNION ALL SELECT 'carreras',        COUNT(*) FROM carreras        -- 13
UNION ALL SELECT 'materias',        COUNT(*) FROM materias        -- 43
UNION ALL SELECT 'carrera_materia', COUNT(*) FROM carrera_materia -- 74
UNION ALL SELECT 'estudia',         COUNT(*) FROM estudia         -- 14
UNION ALL SELECT 'programas',       COUNT(*) FROM programas       -- 72
UNION ALL SELECT 'contenidos',      COUNT(*) FROM contenidos      -- 169
UNION ALL SELECT 'publicaciones',   COUNT(*) FROM publicaciones   -- 40
UNION ALL SELECT 'comentarios',     COUNT(*) FROM comentarios     -- 129
UNION ALL SELECT 'votos',           COUNT(*) FROM votos           -- 436
UNION ALL SELECT 'favoritos',       COUNT(*) FROM favoritos       -- 55
UNION ALL SELECT 'reportes',        COUNT(*) FROM reportes;       -- 7
```

Las tres vistas de apoyo:

```sql
SELECT titulo, categoria, carrera, materia, puntaje, total_comentarios
FROM v_publicaciones_detalle ORDER BY puntaje DESC LIMIT 5;

SELECT carrera, anio_cursada, cuatrimestre, materia, dictada_en_carreras
FROM v_materias_por_carrera
WHERE carrera LIKE 'Ingeniería en Sistemas%'
ORDER BY anio_cursada, cuatrimestre;

SELECT tipo_objetivo, objetivo, motivo, estado FROM v_reportes_pendientes;
```

Las dos consultas que muestran el modelo en acción:

```sql
-- Una materia se dicta en varias carreras (relación N:M)
SELECT m.nombre, COUNT(*) AS carreras
FROM carrera_materia cm
JOIN materias m ON m.id_materia = cm.materia_id
GROUP BY m.id_materia HAVING carreras > 1
ORDER BY carreras DESC, m.nombre;      -- 23 materias

-- Un único mecanismo de voto cubre los dos subtipos de CONTENIDO
SELECT c.tipo, COUNT(*) AS votos, SUM(v.valor) AS puntaje_total
FROM votos v JOIN contenidos c ON c.id_contenido = v.contenido_id
GROUP BY c.tipo;
```

---

## Restricciones que conviene probar

```sql
-- 1. Un usuario no puede votar dos veces el mismo contenido (PK compuesta)
INSERT INTO votos (usuario_id, contenido_id, valor)
SELECT usuario_id, contenido_id, -1 FROM votos LIMIT 1;
-- ERROR 1062: Duplicate entry para PRIMARY

-- 2. El voto solo admite -1 y 1
INSERT INTO votos (usuario_id, contenido_id, valor) VALUES (2, 5, 3);
-- ERROR 4025: CONSTRAINT `ck_votos_valor` failed

-- 3. Un favorito no se repite
INSERT INTO favoritos (usuario_id, publicacion_id)
SELECT usuario_id, publicacion_id FROM favoritos LIMIT 1;
-- ERROR 1062: Duplicate entry para PRIMARY

-- 4. Una materia no se repite dentro de la misma carrera
INSERT INTO carrera_materia (carrera_id, materia_id, anio_cursada, cuatrimestre)
SELECT carrera_id, materia_id, 1, 1 FROM carrera_materia LIMIT 1;
-- ERROR 1062: Duplicate entry para PRIMARY

-- 5. Username y email son únicos
INSERT INTO usuarios (rol_id, username, email, password_hash, nombre, apellido)
VALUES (2, 'admin', 'otro@test.com', 'x', 'Test', 'Test');
-- ERROR 1062: Duplicate entry 'admin' para uq_usuarios_username

-- 6. El título de una publicación necesita al menos 5 caracteres
INSERT INTO contenidos (usuario_id, tipo, cuerpo) VALUES (1, 'publicacion', 'x');
INSERT INTO publicaciones (id_contenido, carrera_id, titulo, categoria)
VALUES (LAST_INSERT_ID(), 1, 'abc', 'apunte');
-- ERROR 4025: CONSTRAINT `ck_publicaciones_titulo` failed

-- 7. El adjunto es todo o nada
INSERT INTO contenidos (usuario_id, tipo, cuerpo) VALUES (1, 'publicacion', 'cuerpo');
SET @c = LAST_INSERT_ID();
INSERT INTO publicaciones (id_contenido, carrera_id, titulo, categoria, archivo_nombre)
VALUES (@c, 1, 'Titulo valido', 'apunte', 'suelto.pdf');
-- ERROR 4025: CONSTRAINT `ck_publicaciones_adjunto` failed

-- 8. Un comentario no puede responderse a sí mismo
UPDATE comentarios SET comentario_padre_id = id_contenido LIMIT 1;
-- ERROR 4025: CONSTRAINT `ck_comentarios_padre` failed

-- 9. No se puede borrar un rol que tenga usuarios
DELETE FROM roles WHERE id_rol = 2;
-- ERROR 1451: Cannot delete or update a parent row

-- 10. Una versión de programa no se repite en la misma materia y ciclo
INSERT INTO programas (materia_id, anio_academico, version, titulo)
SELECT materia_id, anio_academico, version, 'Duplicado' FROM programas LIMIT 1;
-- ERROR 1062: Duplicate entry para PRIMARY
```

Y el borrado en cascada a través de la jerarquía:

```sql
START TRANSACTION;
-- Al borrar el CONTENIDO desaparecen su subtipo y todo lo que cuelga de él.
DELETE FROM contenidos WHERE id_contenido = 1;
SELECT (SELECT COUNT(*) FROM publicaciones WHERE id_contenido = 1)  AS subtipo,
       (SELECT COUNT(*) FROM comentarios  WHERE publicacion_id = 1) AS comentarios,
       (SELECT COUNT(*) FROM votos        WHERE contenido_id = 1)   AS votos,
       (SELECT COUNT(*) FROM favoritos    WHERE publicacion_id = 1) AS favoritos,
       (SELECT COUNT(*) FROM reportes     WHERE contenido_id = 1)   AS reportes;
-- 0 0 0 0 0
ROLLBACK;
```

---

## Regenerar los datos

Los datos de demostración no se editan a mano: se generan.

```bash
python3 database/tools/generar_datos.py
```

Ese comando reescribe **tres artefactos a la vez** desde una única fuente:

- `database/seed.sql`
- `data/*.json` (14 archivos)
- `assets/js/data/dataset.js`

Así el frontend y la base de datos no pueden quedar desincronizados. Para cambiar los
datos se edita `database/tools/generar_datos.py` y se vuelve a ejecutar.

---

## Problemas frecuentes

**`ERROR 1064` cerca de `CHECK`**
Motor anterior a MySQL 8.0.16 o MariaDB 10.2. Actualizá el motor.

**`ERROR 1901: Function or expression cannot be used in the CHECK clause`**
MariaDB no admite `CHECK` sobre columnas con acciones referenciales en cascada. El esquema
ya evita ese caso usando `ON UPDATE RESTRICT` en las claves foráneas de `comentarios`.

**Los acentos se ven mal**
Faltó el juego de caracteres en la conexión: agregá `--default-character-set=utf8mb4`.

**`ERROR 1452` al ejecutar `seed.sql`**
No se ejecutó `schema.sql` antes. Volvé a correrlo (recrea la base) y luego `seed.sql`.

---

## Conexión desde PHP (TP2)

```php
<?php
// config/database.php
return [
    'dsn'      => 'mysql:host=localhost;dbname=faculeaks;charset=utf8mb4',
    'usuario'  => 'faculeaks_app',
    'clave'    => '',
    'opciones' => [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ],
];
```

Conviene crear un usuario de aplicación con permisos acotados en lugar de usar `root`:

```sql
CREATE USER 'faculeaks_app'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT SELECT, INSERT, UPDATE, DELETE ON faculeaks.* TO 'faculeaks_app'@'localhost';
FLUSH PRIVILEGES;
```
