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
