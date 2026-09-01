-- =====================================================================
-- FacuLeaks - schema.sql
-- Esquema relacional para MySQL 8.x / MariaDB 10.4+
--
-- Obtenido por paso a tablas del DER en notación de Chen documentado en
-- docs/modelo-conceptual.md y dibujado en docs/der-chen.html.
--
-- Ejecutable sobre una base vacía. Debe correrse ANTES que seed.sql.
--   mysql -u root -p < database/schema.sql
--
-- Estructura (12 tablas):
--   Entidades fuertes .... roles, usuarios, carreras, materias, contenidos
--   Especialización ISA .. publicaciones, comentarios  (subtipos de contenidos)
--   Entidad débil ........ programas                   (depende de materias)
--   Relaciones N:M ....... estudia, carrera_materia, votos, favoritos, reportes
--
-- Convenciones:
--   * Motor InnoDB (integridad referencial y transacciones).
--   * Juego de caracteres utf8mb4 / utf8mb4_unicode_ci.
--   * Tablas de entidad en plural con PK subrogada id_<entidad>.
--   * Tablas de relación con PK compuesta por las claves que participan:
--     así la regla «una sola vez por par» queda garantizada por la propia PK.
--   * Modelo normalizado hasta 3FN (ver docs/base-de-datos.md).
-- =====================================================================

DROP DATABASE IF EXISTS faculeaks;
CREATE DATABASE faculeaks
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;
USE faculeaks;

-- =====================================================================
-- 1. ENTIDADES: seguridad y usuarios
-- =====================================================================

-- Entidad ROL.
CREATE TABLE roles (
    id_rol       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre       VARCHAR(30)  NOT NULL,
    descripcion  VARCHAR(255) NULL,
    CONSTRAINT pk_roles PRIMARY KEY (id_rol),
    CONSTRAINT uq_roles_nombre UNIQUE (nombre)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Entidad USUARIO. La relación POSEE (ROL 0,N — USUARIO 1,1) se propaga como
-- clave foránea al lado N, que es la regla de paso a tablas de una relación 1:N.
CREATE TABLE usuarios (
    id_usuario      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    rol_id          INT UNSIGNED NOT NULL,
    username        VARCHAR(30)  NOT NULL,
    email           VARCHAR(120) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    nombre          VARCHAR(60)  NOT NULL,
    apellido        VARCHAR(60)  NOT NULL,
    avatar_url      VARCHAR(255) NULL,
    biografia       VARCHAR(500) NULL,
    estado          ENUM('activo', 'suspendido', 'eliminado') NOT NULL DEFAULT 'activo',
    fecha_registro  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuarios PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuarios_username UNIQUE (username),
    CONSTRAINT uq_usuarios_email    UNIQUE (email),
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id)
        REFERENCES roles (id_rol)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_usuarios_username CHECK (CHAR_LENGTH(username) >= 3),
    CONSTRAINT ck_usuarios_email    CHECK (email LIKE '%_@_%._%')
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX ix_usuarios_rol    ON usuarios (rol_id);
CREATE INDEX ix_usuarios_estado ON usuarios (estado);

-- =====================================================================
-- 2. ENTIDADES: estructura académica
-- =====================================================================

-- Entidad CARRERA.
CREATE TABLE carreras (
    id_carrera      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(120) NOT NULL,
    slug            VARCHAR(140) NOT NULL,
    descripcion     VARCHAR(500) NULL,
    duracion_anios  TINYINT UNSIGNED NOT NULL DEFAULT 5,
    activa          BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_carreras PRIMARY KEY (id_carrera),
    CONSTRAINT uq_carreras_nombre UNIQUE (nombre),
    CONSTRAINT uq_carreras_slug   UNIQUE (slug),
    CONSTRAINT ck_carreras_duracion CHECK (duracion_anios BETWEEN 1 AND 8)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Entidad MATERIA. Catálogo global: una materia existe con independencia de la
-- carrera que la dicte, y esa es la condición para que pueda compartirse.
CREATE TABLE materias (
    id_materia   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    codigo       VARCHAR(20)  NOT NULL,
    nombre       VARCHAR(120) NOT NULL,
    descripcion  VARCHAR(500) NULL,
    activa       BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_materias PRIMARY KEY (id_materia),
    CONSTRAINT uq_materias_codigo UNIQUE (codigo)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX ix_materias_nombre ON materias (nombre);

-- =====================================================================
-- 3. RELACIONES N:M de la estructura académica
--    Regla de paso a tablas: una relación N:M genera una tabla propia cuya
--    clave primaria es la unión de las claves de las entidades participantes,
--    más los atributos propios de la relación.
-- =====================================================================

-- Relación SE_DICTA_EN (MATERIA 1,N — CARRERA 0,N).
-- Los atributos de cursada dependen del PAR carrera-materia, no de la materia
-- sola: la misma materia puede ser de 2.º año y obligatoria en una carrera, y
-- de 3.º y optativa en otra. Por eso viven aquí (2FN).
CREATE TABLE carrera_materia (
    carrera_id    INT UNSIGNED NOT NULL,
    materia_id    INT UNSIGNED NOT NULL,
    anio_cursada  TINYINT UNSIGNED NOT NULL,
    cuatrimestre  TINYINT UNSIGNED NOT NULL,
    obligatoria   BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_carrera_materia PRIMARY KEY (carrera_id, materia_id),
    CONSTRAINT fk_carmat_carrera FOREIGN KEY (carrera_id)
        REFERENCES carreras (id_carrera)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_carmat_materia FOREIGN KEY (materia_id)
        REFERENCES materias (id_materia)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT ck_carmat_anio CHECK (anio_cursada BETWEEN 1 AND 8),
    CONSTRAINT ck_carmat_cuat CHECK (cuatrimestre IN (1, 2, 3))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Índice inverso: la PK ya resuelve carrera -> materias; este resuelve
-- materia -> carreras (la consulta «en qué carreras se dicta esta materia»).
CREATE INDEX ix_carmat_materia ON carrera_materia (materia_id);
CREATE INDEX ix_carmat_cursada ON carrera_materia (carrera_id, anio_cursada, cuatrimestre);

-- Relación ESTUDIA (USUARIO 0,N — CARRERA 0,N) con atributos propios.
-- Reemplaza a la antigua entidad `perfiles_academicos`, que no era una entidad
-- sino esta relación. Un usuario puede estudiar varias carreras.
CREATE TABLE estudia (
    usuario_id    INT UNSIGNED NOT NULL,
    carrera_id    INT UNSIGNED NOT NULL,
    anio_ingreso  SMALLINT UNSIGNED NOT NULL,
    sede          VARCHAR(80) NULL,
    activo        BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_estudia PRIMARY KEY (usuario_id, carrera_id),
    CONSTRAINT fk_estudia_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_estudia_carrera FOREIGN KEY (carrera_id)
        REFERENCES carreras (id_carrera)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT ck_estudia_anio CHECK (anio_ingreso BETWEEN 1950 AND 2100)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX ix_estudia_carrera ON estudia (carrera_id);

-- =====================================================================
-- 4. ENTIDAD DÉBIL: programas
--    Regla de paso a tablas: la clave primaria es el identificador parcial de
--    la entidad débil (anio_academico, version) más la clave de la entidad
--    fuerte de la que depende en existencia (materia_id).
-- =====================================================================

CREATE TABLE programas (
    materia_id         INT UNSIGNED NOT NULL,
    anio_academico     SMALLINT UNSIGNED NOT NULL,
    version            VARCHAR(20)  NOT NULL,
    titulo             VARCHAR(180) NOT NULL,
    archivo_url        VARCHAR(255) NULL,
    docente_referencia VARCHAR(120) NULL,
    cargado_por        INT UNSIGNED NULL,
    fecha_publicacion  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vigente            BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_programas PRIMARY KEY (materia_id, anio_academico, version),
    -- Relación identificadora TIENE_PROGRAMA: sin materia no hay programa.
    CONSTRAINT fk_programas_materia FOREIGN KEY (materia_id)
        REFERENCES materias (id_materia)
        ON DELETE CASCADE ON UPDATE CASCADE,
    -- Relación CARGA (USUARIO 0,N — PROGRAMA 0,1): si el usuario se elimina,
    -- el programa sobrevive sin autor conocido.
    CONSTRAINT fk_programas_usuario FOREIGN KEY (cargado_por)
        REFERENCES usuarios (id_usuario)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT ck_programas_anio CHECK (anio_academico BETWEEN 1950 AND 2100)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX ix_programas_vigente ON programas (vigente, anio_academico);
CREATE INDEX ix_programas_usuario ON programas (cargado_por);

-- =====================================================================
-- 5. GENERALIZACIÓN: contenidos y sus dos especializaciones
--    Regla de paso a tablas para una jerarquía ISA total y disjunta: una tabla
--    para el supertipo y una por cada subtipo, cuya clave primaria es a la vez
--    clave foránea hacia el supertipo. Es la estrategia que permite que VOTA y
--    REPORTA apunten a un ÚNICO extremo con integridad referencial real.
-- =====================================================================

CREATE TABLE contenidos (
    id_contenido    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id      INT UNSIGNED NOT NULL,
    tipo            ENUM('publicacion', 'comentario') NOT NULL,
    cuerpo          TEXT NOT NULL,
    estado          ENUM('publicado', 'oculto', 'eliminado') NOT NULL DEFAULT 'publicado',
    fecha_creacion  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_contenidos PRIMARY KEY (id_contenido),
    -- Relación ESCRIBE (USUARIO 0,N — CONTENIDO 1,1).
    CONSTRAINT fk_contenidos_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX ix_contenidos_usuario ON contenidos (usuario_id);
CREATE INDEX ix_contenidos_tipo    ON contenidos (tipo, estado, fecha_creacion);
CREATE FULLTEXT INDEX ft_contenidos_cuerpo ON contenidos (cuerpo);

-- Subtipo PUBLICACIÓN.
-- carrera_id es obligatoria (relación PERTENECE_A con cardinalidad 1,1): toda
-- publicación se hace dentro del ámbito de una carrera.
-- materia_id es opcional (relación TRATA_SOBRE, 0,1): existen publicaciones
-- generales de la carrera que no corresponden a ninguna materia concreta.
CREATE TABLE publicaciones (
    id_contenido        INT UNSIGNED NOT NULL,
    carrera_id          INT UNSIGNED NOT NULL,
    materia_id          INT UNSIGNED NULL,
    titulo              VARCHAR(180) NOT NULL,
    categoria           ENUM('pregunta', 'apunte', 'parcial', 'profesor',
                             'experiencia', 'recomendacion', 'material') NOT NULL,
    fijada              BOOLEAN NOT NULL DEFAULT FALSE,
    visitas             INT UNSIGNED NOT NULL DEFAULT 0,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,
    -- Adjunto opcional: como máximo un archivo por publicación, de modo que
    -- los cuatro campos son atributos simples y no un grupo repetitivo.
    archivo_nombre      VARCHAR(180) NULL,
    archivo_url         VARCHAR(255) NULL,
    archivo_tipo        VARCHAR(20)  NULL,
    archivo_tamano_kb   INT UNSIGNED NULL,
    CONSTRAINT pk_publicaciones PRIMARY KEY (id_contenido),
    CONSTRAINT fk_publicaciones_contenido FOREIGN KEY (id_contenido)
        REFERENCES contenidos (id_contenido)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_publicaciones_carrera FOREIGN KEY (carrera_id)
        REFERENCES carreras (id_carrera)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_publicaciones_materia FOREIGN KEY (materia_id)
        REFERENCES materias (id_materia)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT ck_publicaciones_titulo CHECK (CHAR_LENGTH(titulo) >= 5),
    CONSTRAINT ck_publicaciones_tamano CHECK (archivo_tamano_kb IS NULL
                                           OR archivo_tamano_kb <= 20480),
    -- El adjunto es todo o nada: no se admite una ruta sin nombre de archivo.
    CONSTRAINT ck_publicaciones_adjunto CHECK (
        (archivo_nombre IS NULL     AND archivo_url IS NULL)
     OR (archivo_nombre IS NOT NULL AND archivo_url IS NOT NULL)
    )
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX ix_pub_materia   ON publicaciones (materia_id);
CREATE INDEX ix_pub_carrera   ON publicaciones (carrera_id);
CREATE INDEX ix_pub_categoria ON publicaciones (categoria);
CREATE FULLTEXT INDEX ft_pub_titulo ON publicaciones (titulo);

-- Subtipo COMENTARIO.
-- comentario_padre_id implementa la relación reflexiva RESPONDE_A con los roles
-- «respuesta» (0,1) y «padre» (0,N): un comentario responde como máximo a otro.
CREATE TABLE comentarios (
    id_contenido        INT UNSIGNED NOT NULL,
    publicacion_id      INT UNSIGNED NOT NULL,
    comentario_padre_id INT UNSIGNED NULL,
    CONSTRAINT pk_comentarios PRIMARY KEY (id_contenido),
    -- ON UPDATE RESTRICT (y no CASCADE) en las dos columnas que intervienen en
    -- ck_comentarios_padre: MariaDB no admite restricciones CHECK sobre columnas
    -- sujetas a acciones referenciales en cascada. Las claves primarias son
    -- subrogadas AUTO_INCREMENT y nunca se actualizan, así que no hay pérdida
    -- funcional. Ver docs/base-de-datos.md.
    CONSTRAINT fk_comentarios_contenido FOREIGN KEY (id_contenido)
        REFERENCES contenidos (id_contenido)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_comentarios_publicacion FOREIGN KEY (publicacion_id)
        REFERENCES publicaciones (id_contenido)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comentarios_padre FOREIGN KEY (comentario_padre_id)
        REFERENCES comentarios (id_contenido)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    -- Un comentario no puede responderse a sí mismo.
    CONSTRAINT ck_comentarios_padre CHECK (comentario_padre_id <> id_contenido)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX ix_com_publicacion ON comentarios (publicacion_id);
CREATE INDEX ix_com_padre       ON comentarios (comentario_padre_id);

-- =====================================================================
-- 6. RELACIONES N:M de interacción
--    Las tres apuntan al supertipo CONTENIDO (salvo favoritos, que por regla de
--    negocio solo aplica a publicaciones). Al ser la clave primaria compuesta
--    por el par de participantes, la regla «una sola vez por par» queda
--    garantizada por la propia PK: no hace falta un UNIQUE adicional.
-- =====================================================================

-- Relación VOTA (USUARIO 0,N — CONTENIDO 0,N).
-- Una única relación sirve a publicaciones y comentarios: eso es lo que
-- habilita la generalización. El valor 0 no se almacena: quitar el voto es
-- eliminar la fila.
CREATE TABLE votos (
    usuario_id    INT UNSIGNED NOT NULL,
    contenido_id  INT UNSIGNED NOT NULL,
    valor         TINYINT NOT NULL,
    fecha_voto    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_votos PRIMARY KEY (usuario_id, contenido_id),
    CONSTRAINT fk_votos_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_votos_contenido FOREIGN KEY (contenido_id)
        REFERENCES contenidos (id_contenido)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT ck_votos_valor CHECK (valor IN (-1, 1))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX ix_votos_contenido ON votos (contenido_id);

-- Relación GUARDA (USUARIO 0,N — PUBLICACIÓN 0,N).
CREATE TABLE favoritos (
    usuario_id     INT UNSIGNED NOT NULL,
    publicacion_id INT UNSIGNED NOT NULL,
    fecha          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_favoritos PRIMARY KEY (usuario_id, publicacion_id),
    CONSTRAINT fk_favoritos_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_favoritos_publicacion FOREIGN KEY (publicacion_id)
        REFERENCES publicaciones (id_contenido)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX ix_favoritos_publicacion ON favoritos (publicacion_id);

-- Relación REPORTA (USUARIO 0,N — CONTENIDO 0,N).
-- Al apuntar al supertipo desaparece el CHECK de exclusión (XOR) entre dos
-- claves foráneas nulables que exigía el modelo anterior.
CREATE TABLE reportes (
    usuario_id     INT UNSIGNED NOT NULL,
    contenido_id   INT UNSIGNED NOT NULL,
    motivo         ENUM('spam', 'contenido_inapropiado', 'informacion_incorrecta',
                        'material_con_derechos', 'duplicado', 'otro') NOT NULL DEFAULT 'otro',
    descripcion    VARCHAR(500) NULL,
    estado         ENUM('pendiente', 'en_revision', 'resuelto', 'rechazado')
                        NOT NULL DEFAULT 'pendiente',
    fecha_reporte  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_reportes PRIMARY KEY (usuario_id, contenido_id),
    CONSTRAINT fk_reportes_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reportes_contenido FOREIGN KEY (contenido_id)
        REFERENCES contenidos (id_contenido)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX ix_reportes_estado    ON reportes (estado, fecha_reporte);
CREATE INDEX ix_reportes_contenido ON reportes (contenido_id);

-- =====================================================================
-- 7. VISTAS DE APOYO
-- Encapsulan los JOIN entre supertipo y subtipo y los cálculos agregados que el
-- frontend resuelve hoy en memoria, y que en TP2/TP3 consumirá PHP con una
-- sola consulta.
-- =====================================================================

CREATE OR REPLACE VIEW v_publicaciones_detalle AS
SELECT
    p.id_contenido            AS id_publicacion,
    p.titulo,
    c.cuerpo                  AS contenido,
    p.categoria,
    c.estado,
    p.fijada,
    p.visitas,
    c.fecha_creacion,
    p.fecha_actualizacion,
    p.archivo_nombre,
    u.id_usuario,
    u.username,
    CONCAT(u.nombre, ' ', u.apellido) AS autor,
    car.id_carrera,
    car.nombre                AS carrera,
    m.id_materia,
    m.nombre                  AS materia,
    COALESCE(SUM(v.valor), 0) AS puntaje,
    COUNT(DISTINCT v.usuario_id) AS total_votos,
    (SELECT COUNT(*)
       FROM comentarios com
       JOIN contenidos cc ON cc.id_contenido = com.id_contenido
      WHERE com.publicacion_id = p.id_contenido
        AND cc.estado = 'publicado')   AS total_comentarios
FROM publicaciones p
JOIN contenidos c     ON c.id_contenido = p.id_contenido
JOIN usuarios u       ON u.id_usuario   = c.usuario_id
JOIN carreras car     ON car.id_carrera = p.carrera_id
LEFT JOIN materias m  ON m.id_materia   = p.materia_id
LEFT JOIN votos v     ON v.contenido_id = p.id_contenido
GROUP BY p.id_contenido, u.id_usuario, car.id_carrera, m.id_materia;

CREATE OR REPLACE VIEW v_materias_por_carrera AS
SELECT
    cm.carrera_id,
    car.nombre       AS carrera,
    cm.anio_cursada,
    cm.cuatrimestre,
    cm.obligatoria,
    m.id_materia,
    m.codigo,
    m.nombre         AS materia,
    (SELECT COUNT(*) FROM carrera_materia x WHERE x.materia_id = m.id_materia)
                     AS dictada_en_carreras
FROM carrera_materia cm
JOIN carreras car ON car.id_carrera = cm.carrera_id
JOIN materias m   ON m.id_materia   = cm.materia_id;

CREATE OR REPLACE VIEW v_reportes_pendientes AS
SELECT
    r.usuario_id,
    r.contenido_id,
    r.motivo,
    r.descripcion,
    r.estado,
    r.fecha_reporte,
    ur.username               AS reportado_por,
    c.tipo                    AS tipo_objetivo,
    COALESCE(p.titulo, CONCAT('Comentario en publicación #', com.publicacion_id)) AS objetivo,
    LEFT(c.cuerpo, 140)       AS extracto
FROM reportes r
JOIN usuarios ur          ON ur.id_usuario   = r.usuario_id
JOIN contenidos c         ON c.id_contenido  = r.contenido_id
LEFT JOIN publicaciones p ON p.id_contenido  = c.id_contenido
LEFT JOIN comentarios com ON com.id_contenido = c.id_contenido
WHERE r.estado IN ('pendiente', 'en_revision');
