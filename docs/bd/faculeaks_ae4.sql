-- =====================================================================
--  FacuLeaks - Script SQL consolidado de la entrega AE4 / TIFAS
--  Paradigmas y Lenguajes de Programacion III
--  Universidad de la Cuenca del Plata - Facultad de Ingenieria y Tecnologia
--  Autores: Martin Nahuel Mekekiuk y Augusto Piedrafita
-- ---------------------------------------------------------------------
--  Un solo archivo para importar en phpMyAdmin (XAMPP) o MySQL Workbench.
--  Reune, sin cambios, los tres scripts de docs/bd/ en este orden:
--    Parte 1. facuLeaks_ae2.sql        esquema 3FN (14 tablas + 2 vistas)
--    Parte 2. datos_prueba_ae2.sql     datos de prueba
--    Parte 3. usuarios_bcrypt_ae3.sql  contrasenas BCRYPT reales
--
--  ATENCION: la Parte 1 hace DROP DATABASE IF EXISTS facuLeaks.
--  Importarlo borra la base anterior y la vuelve a crear desde cero.
--
--  Usuarios de prueba (contrasena de todos: faculeaks123):
--    mmekekiuk, apiedrafita (estudiantes), modsoft (moderador)
--
--  La API (config/conexion.php) se conecta a 127.0.0.1:3306,
--  base facuLeaks, usuario root sin contrasena (XAMPP por defecto).
-- =====================================================================


-- #####################################################################
-- PARTE 1 - ESQUEMA (facuLeaks_ae2.sql)
-- #####################################################################

-- =====================================================================
--  FacuLeaks - Implementacion del esquema relacional normalizado (3FN)
--  Actividad de Evaluacion 2 | Base de Datos
--  Universidad de la Cuenca del Plata - Facultad de Ingenieria y Tecnologia
--  Alumno: Martin Nahuel Mekekiuk
--  Docente: Mgst. Ing. Gonzalo Pallotta
--  SGBD: MySQL 8.0 (InnoDB) - probado con MySQL Workbench
--  Fecha: septiembre de 2026
-- ---------------------------------------------------------------------
--  Notas de implementacion:
--   * Las restricciones CHECK son verificadas por el motor a partir de
--     MySQL 8.0.16. En versiones anteriores se analizan pero se ignoran.
--   * MySQL no conserva el nombre de las restricciones PRIMARY KEY (las
--     llama siempre PRIMARY), por eso solo se nombran UNIQUE, FOREIGN KEY
--     y CHECK, con los prefijos uq_, fk_ y chk_.
--   * Las tablas se crean en orden de dependencia para que ninguna clave
--     foranea apunte a una tabla todavia inexistente.
-- =====================================================================

DROP DATABASE IF EXISTS facuLeaks;
CREATE DATABASE facuLeaks
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE facuLeaks;


-- =====================================================================
-- 1. MODULO USUARIOS Y ACCESO
-- =====================================================================

-- roles <- entidad ROLES
CREATE TABLE roles (
    id_rol  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre  VARCHAR(30)  NOT NULL,
    PRIMARY KEY (id_rol),
    CONSTRAINT uq_roles_nombre UNIQUE (nombre)
) ENGINE = InnoDB;


-- usuarios <- entidad USUARIOS + relacion POSEE (1:N, la FK va del lado N)
CREATE TABLE usuarios (
    id_usuario          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    alias_usuario       VARCHAR(30)  NOT NULL,
    email               VARCHAR(120) NOT NULL,
    nombre              VARCHAR(60)  NOT NULL,
    apellido            VARCHAR(60)  NOT NULL,
    contrasena_cifrada  VARCHAR(255) NOT NULL,
    enlace_foto_perfil  VARCHAR(255)     NULL,
    biografia           VARCHAR(500)     NULL,
    estado              VARCHAR(12)  NOT NULL DEFAULT 'activo',
    fecha_registro      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_rol              INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuarios_alias UNIQUE (alias_usuario),
    CONSTRAINT uq_usuarios_email UNIQUE (email),
    CONSTRAINT chk_usuarios_estado
        CHECK (estado IN ('activo', 'suspendido', 'baja')),
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (id_rol)
        REFERENCES roles (id_rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- =====================================================================
-- 2. MODULO ACADEMICO
-- =====================================================================

-- carreras <- entidad CARRERAS
CREATE TABLE carreras (
    id_carrera  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(80)  NOT NULL,
    PRIMARY KEY (id_carrera),
    CONSTRAINT uq_carreras_nombre UNIQUE (nombre)
) ENGINE = InnoDB;


-- materias <- entidad MATERIAS
CREATE TABLE materias (
    id_materia  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(80)  NOT NULL,
    PRIMARY KEY (id_materia),
    CONSTRAINT uq_materias_nombre UNIQUE (nombre)
) ENGINE = InnoDB;


-- estudia <- relacion N:M ESTUDIA (usuarios - carreras), con atributo propio 'sede'
CREATE TABLE estudia (
    id_usuario  INT UNSIGNED NOT NULL,
    id_carrera  INT UNSIGNED NOT NULL,
    sede        VARCHAR(40)  NOT NULL,
    PRIMARY KEY (id_usuario, id_carrera),
    CONSTRAINT fk_estudia_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_estudia_carrera FOREIGN KEY (id_carrera)
        REFERENCES carreras (id_carrera)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- dicta <- relacion N:M DICTA (carreras - materias), sin atributos propios
CREATE TABLE dicta (
    id_carrera  INT UNSIGNED NOT NULL,
    id_materia  INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_carrera, id_materia),
    CONSTRAINT fk_dicta_carrera FOREIGN KEY (id_carrera)
        REFERENCES carreras (id_carrera)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_dicta_materia FOREIGN KEY (id_materia)
        REFERENCES materias (id_materia)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- =====================================================================
-- 3. MODULO CONTENIDOS (jerarquia ISA: supertipo + subtipos)
-- =====================================================================

-- contenidos <- supertipo CONTENIDOS + ESCRIBE (1:N) + PERTENECE (1:N)
-- 'tipo' es el atributo discriminante de la especializacion.
CREATE TABLE contenidos (
    id_contenido    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tipo            VARCHAR(12)  NOT NULL,
    cuerpo_texto    TEXT         NOT NULL,
    fecha_creacion  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario      INT UNSIGNED NOT NULL,
    id_carrera      INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_contenido),
    CONSTRAINT chk_contenidos_tipo
        CHECK (tipo IN ('publicacion', 'comentario')),
    CONSTRAINT fk_contenidos_autor FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_contenidos_carrera FOREIGN KEY (id_carrera)
        REFERENCES carreras (id_carrera)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- publicaciones <- subtipo PUBLICACIONES + TRATA (1:N)
-- La PK es la misma del supertipo y a la vez FK hacia el: relacion 1:1.
CREATE TABLE publicaciones (
    id_contenido    INT UNSIGNED NOT NULL,
    categoria       VARCHAR(20)  NOT NULL,
    adjunto         VARCHAR(255)     NULL,
    archivo_nombre  VARCHAR(150)     NULL,
    id_materia      INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_contenido),
    CONSTRAINT chk_publicaciones_categoria
        CHECK (categoria IN ('apunte', 'parcial', 'final', 'consulta', 'recurso')),
    CONSTRAINT chk_publicaciones_adjunto
        CHECK ((adjunto IS NULL     AND archivo_nombre IS NULL)
            OR (adjunto IS NOT NULL AND archivo_nombre IS NOT NULL)),
    CONSTRAINT fk_publicaciones_contenido FOREIGN KEY (id_contenido)
        REFERENCES contenidos (id_contenido)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_publicaciones_materia FOREIGN KEY (id_materia)
        REFERENCES materias (id_materia)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- comentarios <- subtipo COMENTARIOS + COMENTA (1:N) + RESPONDE (1:N reflexiva)
CREATE TABLE comentarios (
    id_contenido         INT UNSIGNED NOT NULL,
    id_publicacion       INT UNSIGNED NOT NULL,
    id_comentario_padre  INT UNSIGNED     NULL,
    PRIMARY KEY (id_contenido),

    CONSTRAINT fk_comentarios_contenido FOREIGN KEY (id_contenido)
        REFERENCES contenidos (id_contenido)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_comentarios_publicacion FOREIGN KEY (id_publicacion)
        REFERENCES publicaciones (id_contenido)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_comentarios_padre FOREIGN KEY (id_comentario_padre)
        REFERENCES comentarios (id_contenido)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE = InnoDB;


-- vota <- relacion N:M VOTA (usuarios - contenidos), con atributo propio 'valor'
-- La PK compuesta impide que un mismo usuario vote dos veces el mismo contenido.
CREATE TABLE vota (
    id_usuario    INT UNSIGNED NOT NULL,
    id_contenido  INT UNSIGNED NOT NULL,
    valor         TINYINT      NOT NULL,
    PRIMARY KEY (id_usuario, id_contenido),
    CONSTRAINT chk_vota_valor CHECK (valor IN (-1, 1)),
    CONSTRAINT fk_vota_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_vota_contenido FOREIGN KEY (id_contenido)
        REFERENCES contenidos (id_contenido)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


-- reporta <- relacion N:M REPORTA (usuarios - contenidos)
-- Atributos propios de la relacion: motivo, estado y fecha_reporte.
CREATE TABLE reporta (
    id_usuario     INT UNSIGNED NOT NULL,
    id_contenido   INT UNSIGNED NOT NULL,
    motivo         VARCHAR(60)  NOT NULL,
    estado         VARCHAR(12)  NOT NULL DEFAULT 'pendiente',
    fecha_reporte  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_contenido),
    CONSTRAINT chk_reporta_estado
        CHECK (estado IN ('pendiente', 'revisado', 'desestimado')),
    CONSTRAINT fk_reporta_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_reporta_contenido FOREIGN KEY (id_contenido)
        REFERENCES contenidos (id_contenido)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


-- =====================================================================
-- 4. MODULO MARKETPLACE
-- =====================================================================

-- productos <- entidad PRODUCTOS + VENDE (1:N) + CORRESPONDE (1:N opcional)
CREATE TABLE productos (
    id_producto    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    titulo         VARCHAR(120)  NOT NULL,
    precio         DECIMAL(10,2) NOT NULL,
    tipo_material  VARCHAR(20)   NOT NULL,
    id_usuario     INT UNSIGNED  NOT NULL,
    id_materia     INT UNSIGNED      NULL,
    PRIMARY KEY (id_producto),
    CONSTRAINT chk_productos_precio CHECK (precio >= 0),
    CONSTRAINT chk_productos_tipo
        CHECK (tipo_material IN ('apunte', 'libro', 'guia', 'pdf', 'otro')),
    CONSTRAINT fk_productos_vendedor FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_productos_materia FOREIGN KEY (id_materia)
        REFERENCES materias (id_materia)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE = InnoDB;


-- ventas <- entidad VENTAS + COMPRA (1:N)
-- El atributo 'total' figuraba en el DER; en el modelo relacional se decidió
-- no almacenarlo y calcularlo a partir del detalle mediante vw_venta_total.
CREATE TABLE ventas (
    id_venta    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    fecha       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    medio_pago  VARCHAR(20)  NOT NULL,
    id_usuario  INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_venta),
    CONSTRAINT chk_ventas_medio_pago
        CHECK (medio_pago IN ('mercado_pago', 'transferencia', 'efectivo')),
    CONSTRAINT fk_ventas_comprador FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- detalla <- relacion N:M DETALLA (ventas - productos), con atributo propio 'cantidad'
-- 'precio_unitario' congela el precio del producto en el momento de la venta.
CREATE TABLE detalla (
    id_venta         INT UNSIGNED      NOT NULL,
    id_producto      INT UNSIGNED      NOT NULL,
    cantidad         SMALLINT UNSIGNED NOT NULL,
    precio_unitario  DECIMAL(10,2)     NOT NULL,
    PRIMARY KEY (id_venta, id_producto),
    CONSTRAINT chk_detalla_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_detalla_precio   CHECK (precio_unitario >= 0),
    CONSTRAINT fk_detalla_venta FOREIGN KEY (id_venta)
        REFERENCES ventas (id_venta)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_detalla_producto FOREIGN KEY (id_producto)
        REFERENCES productos (id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- =====================================================================
-- 5. VISTAS PARA VALORES CALCULADOS
--    Se utilizan vistas para obtener valores que pueden calcularse a
--    partir de los datos almacenados, evitando redundancia y anomalias
--    de actualizacion.
-- =====================================================================

-- total de VENTAS = suma de cantidad * precio_unitario de su detalle
CREATE OR REPLACE VIEW vw_venta_total AS
SELECT  v.id_venta,
        v.fecha,
        v.medio_pago,
        v.id_usuario,
        COALESCE(SUM(d.cantidad * d.precio_unitario), 0) AS total
FROM    ventas v
        LEFT JOIN detalla d ON d.id_venta = v.id_venta
GROUP BY v.id_venta, v.fecha, v.medio_pago, v.id_usuario;

-- puntaje de un CONTENIDO = suma algebraica de los votos recibidos
CREATE OR REPLACE VIEW vw_puntaje_contenido AS
SELECT  c.id_contenido,
        c.tipo,
        COALESCE(SUM(v.valor), 0) AS puntaje
FROM    contenidos c
        LEFT JOIN vota v ON v.id_contenido = c.id_contenido
GROUP BY c.id_contenido, c.tipo;


-- =====================================================================
-- 6. CARGA MINIMA DE PRUEBA
--    Sirve para comprobar que el esquema es consistente y que las
--    restricciones funcionan. No forma parte del modelo.
-- =====================================================================

INSERT INTO roles (nombre) VALUES
    ('estudiante'), ('moderador'), ('administrador');

INSERT INTO usuarios (alias_usuario, email, nombre, apellido, contrasena_cifrada, estado, id_rol) VALUES
    ('mmekekiuk', 'martin@faculeaks.com', 'Martin',  'Mekekiuk',   '$2y$10$hashDePrueba1', 'activo', 1),
    ('apiedrafita','augusto@faculeaks.com','Augusto', 'Piedrafita', '$2y$10$hashDePrueba2', 'activo', 1),
    ('modsoft',   'mod@faculeaks.com',    'Lucia',   'Ramirez',    '$2y$10$hashDePrueba3', 'activo', 2);

INSERT INTO carreras (nombre) VALUES
    ('Ingenieria en Sistemas de Informacion'), ('Licenciatura en Nutricion');

INSERT INTO materias (nombre) VALUES
    ('Base de Datos'), ('Analisis Numerico'), ('Anatomia');

INSERT INTO dicta (id_carrera, id_materia) VALUES
    (1, 1), (1, 2), (2, 3);

INSERT INTO estudia (id_usuario, id_carrera, sede) VALUES
    (1, 1, 'Posadas'), (2, 1, 'Posadas'), (3, 2, 'Corrientes');

-- una publicacion: primero el supertipo, despues el subtipo
INSERT INTO contenidos (tipo, cuerpo_texto, id_usuario, id_carrera) VALUES
    ('publicacion', 'Resumen de normalizacion hasta 3FN con ejemplos resueltos.', 1, 1);
INSERT INTO publicaciones (id_contenido, categoria, adjunto, archivo_nombre, id_materia) VALUES
    (1, 'apunte', '/archivos/bd/normalizacion.pdf', 'normalizacion.pdf', 1);

-- un comentario sobre esa publicacion y una respuesta a ese comentario
INSERT INTO contenidos (tipo, cuerpo_texto, id_usuario, id_carrera) VALUES
    ('comentario', 'Muy buen resumen, me sirvio para el parcial.', 2, 1);
INSERT INTO comentarios (id_contenido, id_publicacion, id_comentario_padre) VALUES
    (2, 1, NULL);

INSERT INTO contenidos (tipo, cuerpo_texto, id_usuario, id_carrera) VALUES
    ('comentario', 'Gracias, la semana que viene subo la parte de BCNF.', 1, 1);
INSERT INTO comentarios (id_contenido, id_publicacion, id_comentario_padre) VALUES
    (3, 1, 2);

INSERT INTO vota (id_usuario, id_contenido, valor) VALUES
    (2, 1, 1), (3, 1, 1), (3, 2, -1);

INSERT INTO reporta (id_usuario, id_contenido, motivo, estado) VALUES
    (3, 2, 'Contenido fuera de tema', 'pendiente');

INSERT INTO productos (titulo, precio, tipo_material, id_usuario, id_materia) VALUES
    ('Apuntes completos de Base de Datos 2026', 8500.00, 'apunte', 1, 1),
    ('Guia de ejercicios de Analisis Numerico', 4200.00, 'guia',   1, 2),
    ('Libro Fundamentos de bases de datos',    15000.00, 'libro',  2, NULL);

INSERT INTO ventas (medio_pago, id_usuario) VALUES
    ('mercado_pago', 2), ('transferencia', 3);

INSERT INTO detalla (id_venta, id_producto, cantidad, precio_unitario) VALUES
    (1, 1, 1, 8500.00),
    (1, 2, 2, 4200.00),
    (2, 3, 1, 15000.00);


-- =====================================================================
-- 7. CONSULTAS DE VERIFICACION
-- =====================================================================

-- 7.1 Tablas creadas
SHOW TABLES;

-- 7.2 Total de cada venta (atributo derivado calculado por la vista)
SELECT * FROM vw_venta_total;

-- 7.3 Puntaje de cada contenido (atributo derivado calculado por la vista)
SELECT * FROM vw_puntaje_contenido;

-- 7.4 Hilo de comentarios de una publicacion, con su autor
SELECT  co.id_contenido,
        u.alias_usuario            AS autor,
        co.cuerpo_texto,
        cm.id_comentario_padre     AS responde_a
FROM    comentarios cm
        JOIN contenidos co ON co.id_contenido = cm.id_contenido
        JOIN usuarios   u  ON u.id_usuario    = co.id_usuario
WHERE   cm.id_publicacion = 1
ORDER BY co.id_contenido;

-- 7.5 Materias de cada carrera (resolucion de la relacion N:M DICTA)
SELECT  ca.nombre AS carrera,
        ma.nombre AS materia
FROM    dicta d
        JOIN carreras ca ON ca.id_carrera = d.id_carrera
        JOIN materias ma ON ma.id_materia = d.id_materia
ORDER BY carrera, materia;


-- =====================================================================
-- 8. PRUEBAS DE LAS RESTRICCIONES
--    Todas estas sentencias deben ejecutarse sin error. Se dejan comentadas para que
--    el script se ejecute completo de una sola vez; para probarlas hay
--    que descomentarlas de a una.
-- =====================================================================

-- a) UNIQUE: el email ya existe
-- INSERT INTO usuarios (alias_usuario, email, nombre, apellido, contrasena_cifrada, id_rol)
--   VALUES ('otro', 'martin@faculeaks.com', 'Otro', 'Usuario', 'hash', 1);

-- b) CHECK: el valor del voto solo puede ser -1 o 1
-- INSERT INTO vota (id_usuario, id_contenido, valor) VALUES (1, 2, 5); 

-- c) CHECK: el precio no puede ser negativo
-- INSERT INTO productos (titulo, precio, tipo_material, id_usuario)
--   VALUES ('Producto invalido', -100.00, 'apunte', 1);

-- d) Integridad referencial: la carrera 99 no existe
-- INSERT INTO contenidos (tipo, cuerpo_texto, id_usuario, id_carrera)
--   VALUES ('publicacion', 'Prueba', 1, 99);

-- e) Integridad referencial (ON DELETE RESTRICT): no se puede borrar una
--    carrera que tiene contenidos asociados
-- DELETE FROM carreras WHERE id_carrera = 1;

-- f) PK compuesta: un usuario no puede votar dos veces el mismo contenido
-- INSERT INTO vota (id_usuario, id_contenido, valor) VALUES (2, 1, -1);

-- g) Eliminación de una publicacion
-- delete from publicaciones where id_contenido = 1;

-- h) Responde SET NULL. Solo borrar el comentario padre, el hijo queda con id_comentario_padre = NULL
-- START TRANSACTION;

-- SELECT
  --  id_contenido,
  --  id_publicacion,
  --  id_comentario_padre
-- FROM comentarios;

-- DELETE FROM contenidos 
-- WHERE id_contenido = 2;

-- SELECT
  --  id_contenido,
  --  id_publicacion,
  --  id_comentario_padre
-- FROM comentarios;

-- ROLLBACK;
-- #####################################################################
-- PARTE 2 - DATOS DE PRUEBA (datos_prueba_ae2.sql)
-- #####################################################################

-- =====================================================================
--  FacuLeaks - Datos de prueba para el AE2 de Paradigmas de la Programacion 3
--  Autor: Martin Nahuel Mekekiuk
-- ---------------------------------------------------------------------
--  Este script NO modifica la estructura de la base de datos.
--  Se ejecuta DESPUES de facuLeaks_ae2.sql (que queda intacto) y solo:
--    1. fija fechas deterministicas a las filas de la carga minima de
--       prueba (que el esquema completa con CURRENT_TIMESTAMP), para que
--       los datos exportados no dependan del dia en que se ejecuta;
--    2. agrega filas nuevas con INSERT, respetando todas las
--       restricciones del esquema (PK, FK, UNIQUE y CHECK).
--  Las filas nuevas son datos ficticios de prueba: reproducen los
--  alias, materias y materiales que ya mostraban los HTML del AE1.
--  A partir de esta base se exportan los archivos data/*.json que
--  consume el frontend mediante fetch().
-- =====================================================================

USE facuLeaks;

-- ---------------------------------------------------------------------
-- 1. Fechas deterministicas para la carga minima de prueba
-- ---------------------------------------------------------------------
UPDATE usuarios   SET fecha_registro = '2026-03-02 10:00:00' WHERE id_usuario = 1;
UPDATE usuarios   SET fecha_registro = '2026-03-02 10:05:00' WHERE id_usuario = 2;
UPDATE usuarios   SET fecha_registro = '2026-03-05 09:00:00' WHERE id_usuario = 3;
UPDATE contenidos SET fecha_creacion = '2026-09-20 17:00:00' WHERE id_contenido = 1;
UPDATE contenidos SET fecha_creacion = '2026-09-21 09:15:00' WHERE id_contenido = 2;
UPDATE contenidos SET fecha_creacion = '2026-09-21 12:40:00' WHERE id_contenido = 3;
UPDATE reporta    SET fecha_reporte  = '2026-09-21 13:00:00' WHERE id_usuario = 3 AND id_contenido = 2;
UPDATE ventas     SET fecha          = '2026-09-10 15:30:00' WHERE id_venta = 1;
UPDATE ventas     SET fecha          = '2026-09-15 11:20:00' WHERE id_venta = 2;


-- ---------------------------------------------------------------------
-- 2. MODULO USUARIOS Y ACCESO
--    Los alias son los que ya figuraban en los HTML del AE1.
--    La contrasena es un hash ficticio (nunca se exporta a JSON).
-- ---------------------------------------------------------------------
INSERT INTO usuarios (id_usuario, alias_usuario, email, nombre, apellido, contrasena_cifrada, estado, fecha_registro, id_rol) VALUES
    (4,  'matias_tp',        'matias_tp@faculeaks.com',        'Matias',    'Torres',    '$2y$10$hashDePrueba4',  'activo', '2026-03-10 18:00:00', 1),
    (5,  'caro_ing',         'caro_ing@faculeaks.com',         'Carolina',  'Ibarra',    '$2y$10$hashDePrueba5',  'activo', '2026-03-11 20:30:00', 1),
    (6,  'juanma_dev',       'juanma_dev@faculeaks.com',       'Juan Manuel','Duarte',   '$2y$10$hashDePrueba6',  'activo', '2026-03-15 08:45:00', 1),
    (7,  'sistemas_2do',     'sistemas_2do@faculeaks.com',     'Sofia',     'Benitez',   '$2y$10$hashDePrueba7',  'activo', '2026-04-01 14:10:00', 1),
    (8,  'tomi_rta',         'tomi_rta@faculeaks.com',         'Tomas',     'Rolon',     '$2y$10$hashDePrueba8',  'activo', '2026-04-03 19:25:00', 1),
    (9,  'nueva_estudiante', 'nueva_estudiante@faculeaks.com', 'Valentina', 'Gomez',     '$2y$10$hashDePrueba9',  'activo', '2026-08-04 10:00:00', 1),
    (10, 'ingresante2025',   'ingresante2025@faculeaks.com',   'Lucas',     'Fernandez', '$2y$10$hashDePrueba10', 'activo', '2026-08-05 11:30:00', 1);


-- ---------------------------------------------------------------------
-- 3. MODULO ACADEMICO
--    Materias de Ingenieria en Sistemas de Informacion (id_carrera = 1).
-- ---------------------------------------------------------------------
INSERT INTO materias (id_materia, nombre) VALUES
    (4,  'Analisis Matematico I'),
    (5,  'Analisis Matematico II'),
    (6,  'Algebra y Geometria Analitica'),
    (7,  'Fisica I'),
    (8,  'Programacion I'),
    (9,  'Probabilidad y Estadistica'),
    (10, 'Paradigmas de la Programacion 3'),
    (11, 'Ingenieria de Software II'),
    (12, 'Sistemas Operativos');

INSERT INTO dicta (id_carrera, id_materia) VALUES
    (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12);

INSERT INTO estudia (id_usuario, id_carrera, sede) VALUES
    (4, 1, 'Posadas'), (5, 1, 'Posadas'), (6, 1, 'Posadas'), (7, 1, 'Posadas'),
    (8, 1, 'Posadas'), (9, 1, 'Posadas'), (10, 1, 'Posadas');


-- ---------------------------------------------------------------------
-- 4. MODULO CONTENIDOS
--    Convencion de presentacion: la primera linea de cuerpo_texto es el
--    titulo de la publicacion; el resto es la descripcion.
--    Cada publicacion se inserta primero en el supertipo (contenidos) y
--    despues en el subtipo (publicaciones), igual que en la carga minima.
-- ---------------------------------------------------------------------
INSERT INTO contenidos (id_contenido, tipo, cuerpo_texto, fecha_creacion, id_usuario, id_carrera) VALUES
    (4,  'publicacion', 'Resumen completo de Analisis Matematico II - Unidad 3\nLes comparto el resumen que arme para el parcial de la semana pasada. Incluye limites, derivadas parciales y ejercicios resueltos.', '2026-09-27 18:10:00', 4, 1),
    (5,  'publicacion', 'Apuntes de Programacion I - Toda la cursada\nSubi todos mis apuntes de Programacion I del año pasado, organizados por unidad. Me fueron muy utiles para el final, espero que sirvan.', '2026-09-26 21:40:00', 5, 1),
    (6,  'publicacion', 'Resumen de Sistemas Operativos - Unidades 1 a 4\nArme un resumen bastante completo con los conceptos clave de cada unidad. Tiene ejemplos y algunos cuadros comparativos que me ayudaron mucho.', '2026-09-24 10:15:00', 7, 1),
    (7,  'publicacion', 'Parcial 1 de Algebra y Geometria Analitica - Tema A\nSubo el enunciado del primer parcial con los ejercicios que resolvimos en la clase de consulta. Faltan los de la parte de conicas.', '2026-09-27 12:30:00', 5, 1),
    (8,  'publicacion', 'Final de Analisis Numerico - mesa de julio\nEste es el final que tomaron en la mesa de julio. Pregunten si alguno no les sale, sobre todo el de interpolacion.', '2026-09-25 16:05:00', 8, 1),
    (9,  'publicacion', 'Parcial 2 de Fisica I resuelto\nResolucion completa del segundo parcial, con los diagramas de cuerpo libre de cada ejercicio.', '2026-09-22 09:50:00', 6, 1),
    (10, 'publicacion', 'Alguien sabe si el TP de Programacion I se entrega por el campus?\nNo encuentro informacion clara en el campus sobre como entregar el TP final. El profe no contesto el mail todavia. Alguien sabe algo?', '2026-09-28 08:20:00', 6, 1),
    (11, 'publicacion', 'Conviene rendir libre Probabilidad y Estadistica?\nQuiero anotarme a 5 materias este cuatrimestre y no se si conviene cursar Probabilidad y Estadistica o rendirla libre. Alguien sabe como funciona el regimen?', '2026-09-27 19:45:00', 9, 1),
    (12, 'publicacion', 'Donde consigo la guia de practicos de Analisis Matematico I?\nSoy de primer año y no encuentro la guia. Fui a bedelia pero me mandaron a la fotocopiadora y ahi no la tienen. Alguien que ya la tenga?', '2026-09-26 11:00:00', 10, 1);

INSERT INTO publicaciones (id_contenido, categoria, adjunto, archivo_nombre, id_materia) VALUES
    (4,  'apunte',   '/archivos/am2/resumen-unidad3.pdf',     'resumen-unidad3.pdf',     5),
    (5,  'apunte',   '/archivos/prog1/apuntes-cursada.pdf',   'apuntes-cursada.pdf',     8),
    (6,  'apunte',   NULL,                                    NULL,                      12),
    (7,  'parcial',  '/archivos/alg/parcial1-tema-a.pdf',     'parcial1-tema-a.pdf',     6),
    (8,  'final',    '/archivos/an/final-julio.pdf',          'final-julio.pdf',         2),
    (9,  'parcial',  '/archivos/fis1/parcial2-resuelto.pdf',  'parcial2-resuelto.pdf',   7),
    (10, 'consulta', NULL,                                    NULL,                      8),
    (11, 'consulta', NULL,                                    NULL,                      9),
    (12, 'consulta', NULL,                                    NULL,                      4);

-- Comentarios: supertipo + subtipo; id_comentario_padre indica respuesta
INSERT INTO contenidos (id_contenido, tipo, cuerpo_texto, fecha_creacion, id_usuario, id_carrera) VALUES
    (13, 'comentario', 'Gracias! Justo lo necesitaba para el recuperatorio.',          '2026-09-27 19:00:00', 2, 1),
    (14, 'comentario', 'Tenes tambien la unidad 4?',                                   '2026-09-27 20:10:00', 6, 1),
    (15, 'comentario', 'Todavia no, la subo cuando la termine.',                       '2026-09-27 21:05:00', 4, 1),
    (16, 'comentario', 'Muy completos, sobre todo la parte de punteros.',              '2026-09-27 08:30:00', 7, 1),
    (17, 'comentario', 'Los de conicas los resolvimos en la practica 6.',              '2026-09-27 14:00:00', 1, 1),
    (18, 'comentario', 'Buenisimo, los agrego al archivo.',                            '2026-09-27 15:20:00', 5, 1),
    (19, 'comentario', 'El de interpolacion de Lagrange me dio distinto, lo revisamos?', '2026-09-25 18:40:00', 2, 1),
    (20, 'comentario', 'Si, se sube en la seccion Entregas del campus.',               '2026-09-28 09:00:00', 1, 1),
    (21, 'comentario', 'Gracias, ahi lo encontre.',                                    '2026-09-28 09:30:00', 6, 1),
    (22, 'comentario', 'Yo la rendi libre y el examen tiene una parte practica larga.', '2026-09-27 21:15:00', 7, 1),
    (23, 'comentario', 'La tiene el centro de estudiantes en PDF.',                    '2026-09-26 12:10:00', 5, 1);

INSERT INTO comentarios (id_contenido, id_publicacion, id_comentario_padre) VALUES
    (13, 4, NULL), (14, 4, NULL), (15, 4, 14),
    (16, 5, NULL),
    (17, 7, NULL), (18, 7, 17),
    (19, 8, NULL),
    (20, 10, NULL), (21, 10, 20),
    (22, 11, NULL),
    (23, 12, NULL);

-- Votos: la PK compuesta impide votar dos veces el mismo contenido
INSERT INTO vota (id_usuario, id_contenido, valor) VALUES
    -- publicacion 1 (carga minima: ya tiene los votos de 2 y 3)
    (4, 1, 1), (5, 1, 1), (7, 1, 1),
    -- publicacion 4: Analisis Matematico II
    (1, 4, 1), (2, 4, 1), (3, 4, 1), (5, 4, 1), (6, 4, 1), (7, 4, 1), (8, 4, 1), (9, 4, 1),
    -- publicacion 5: Programacion I
    (1, 5, 1), (4, 5, 1), (6, 5, 1), (8, 5, -1),
    -- publicacion 6: Sistemas Operativos
    (1, 6, 1), (4, 6, 1), (5, 6, -1),
    -- publicacion 7: parcial de Algebra
    (1, 7, 1), (2, 7, 1), (4, 7, 1), (6, 7, 1), (7, 7, 1), (8, 7, 1),
    -- publicacion 8: final de Analisis Numerico
    (1, 8, 1), (2, 8, 1), (4, 8, 1), (5, 8, 1), (9, 8, 1),
    -- publicacion 9: parcial de Fisica I
    (4, 9, 1), (5, 9, 1),
    -- publicacion 10: consulta TP de Programacion I
    (1, 10, 1), (2, 10, 1), (4, 10, 1), (5, 10, 1),
    -- publicacion 11: consulta Probabilidad y Estadistica
    (1, 11, 1), (10, 11, 1),
    -- publicacion 12: consulta Analisis Matematico I
    (9, 12, 1),
    -- comentarios
    (4, 13, 1), (7, 17, 1);


-- ---------------------------------------------------------------------
-- 5. MODULO MARKETPLACE
--    Materiales que ya mostraban los listados del AE1.
-- ---------------------------------------------------------------------
INSERT INTO productos (id_producto, titulo, precio, tipo_material, id_usuario, id_materia) VALUES
    (4,  'Resumen completo de Analisis Matematico II - Unidad 3', 4500.00,  'apunte', 4, 5),
    (5,  'Apuntes de Programacion I - cursada completa',          7800.00,  'apunte', 5, 8),
    (6,  'Algebra y Geometria Analitica - Kozak / Pastorelli',    12000.00, 'libro',  5, 6),
    (7,  'Guia de ejercicios resueltos de Fisica I',              3200.00,  'guia',   6, 7),
    (8,  'Resumen de Sistemas Operativos - Unidades 1 a 4',       2500.00,  'pdf',    7, 12),
    (9,  'Base de Datos - parciales resueltos 2020 a 2025',       3900.00,  'guia',   7, 1),
    (10, 'Calculadora cientifica Casio fx-570',                   18000.00, 'otro',   8, NULL);

-- #####################################################################
-- PARTE 3 - CONTRASENAS BCRYPT (usuarios_bcrypt_ae3.sql)
-- #####################################################################

-- =====================================================================
--  FacuLeaks - Contrasenas BCRYPT para los usuarios de prueba (AE3)
--  Paradigmas de la Programacion 3
--  Autores: Martin Nahuel Mekekiuk y Augusto Piedrafita
-- ---------------------------------------------------------------------
--  Este script NO modifica la estructura de la base de datos.
--  Se ejecuta DESPUES de facuLeaks_ae2.sql y datos_prueba_ae2.sql.
--
--  Paso 1 de la consigna (capa de datos):
--    La tabla usuarios ya existe y su columna de contrasena,
--    usuarios.contrasena_cifrada, es VARCHAR(255): el largo que
--    recomienda PHP para guardar el resultado de password_hash(),
--    porque un hash BCRYPT ocupa 60 caracteres hoy pero el algoritmo
--    por defecto puede cambiar en versiones futuras y producir
--    cadenas mas largas. Por eso no hace falta ningun ALTER TABLE.
--
--  Lo que corrige este script:
--    La carga de prueba del AE2 guardaba hashes ficticios
--    ('$2y$10$hashDePrueba1', ...). password_verify() nunca los
--    acepta, asi que ningun usuario podia iniciar sesion. Se los
--    reemplaza por un hash BCRYPT real, generado con:
--
--        php -r 'echo password_hash("faculeaks123", PASSWORD_BCRYPT);'
--
--    Contrasena de prueba de TODOS los usuarios cargados: faculeaks123
--
--  Estructura del hash ($2y$10$...):
--    $2y$   -> algoritmo BCRYPT
--    10$    -> costo: 2^10 iteraciones de la funcion de derivacion
--    22 caracteres de sal aleatoria + 31 del hash propiamente dicho.
--    La sal viaja dentro del hash, por eso password_verify() no
--    necesita ningun otro dato para comparar.
-- =====================================================================

USE facuLeaks;

UPDATE usuarios
SET    contrasena_cifrada = '$2y$10$d/a34w9eIEPIDC3c5Yhil.2i7rsNtG3YL6Jz4g.mqK2tb2qgwTs86'
WHERE  contrasena_cifrada LIKE '$2y$10$hashDePrueba%';

-- Verificacion: todos los hashes deben medir 60 caracteres.
SELECT id_usuario, alias_usuario, CHAR_LENGTH(contrasena_cifrada) AS largo_hash
FROM   usuarios
ORDER BY id_usuario;
