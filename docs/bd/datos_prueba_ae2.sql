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
