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

--b) CHECK: el valor del voto solo puede ser -1 o 1
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