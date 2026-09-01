/**
 * dataset.js - Dataset de demostracion de FacuLeaks.
 *
 * ARCHIVO GENERADO. No editar a mano.
 * Fuente: database/tools/generar_datos.py
 *
 * Espeja exactamente el contenido de /data/*.json y de database/seed.sql.
 * Se embebe como script clasico para que el prototipo funcione tambien
 * abierto con el protocolo file://, donde fetch() de archivos locales falla.
 */
window.FL = window.FL || {};
FL.dataset = {
  "roles": [
    {
      "idRol": 1,
      "nombre": "invitado",
      "descripcion": "Visitante sin sesión iniciada. Solo lectura."
    },
    {
      "idRol": 2,
      "nombre": "usuario",
      "descripcion": "Estudiante registrado. Publica, comenta, vota y reporta."
    },
    {
      "idRol": 3,
      "nombre": "moderador",
      "descripcion": "Gestiona reportes y modera contenido de la comunidad."
    },
    {
      "idRol": 4,
      "nombre": "administrador",
      "descripcion": "Administra usuarios y el catálogo académico completo."
    }
  ],
  "usuarios": [
    {
      "idUsuario": 1,
      "rolId": 4,
      "username": "admin",
      "email": "admin@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido01",
      "nombre": "Valeria",
      "apellido": "Ortiz",
      "avatarUrl": "assets/img/avatares/avatar-2.svg",
      "biografia": "Administradora de la plataforma.",
      "estado": "activo",
      "fechaRegistro": "2025-08-21 09:00:00"
    },
    {
      "idUsuario": 2,
      "rolId": 3,
      "username": "mod_lucia",
      "email": "lucia.mod@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido02",
      "nombre": "Lucía",
      "apellido": "Ferreyra",
      "avatarUrl": "assets/img/avatares/avatar-3.svg",
      "biografia": "Moderadora del área de Sistemas.",
      "estado": "activo",
      "fechaRegistro": "2025-08-28 09:00:00"
    },
    {
      "idUsuario": 3,
      "rolId": 3,
      "username": "mod_bruno",
      "email": "bruno.mod@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido03",
      "nombre": "Bruno",
      "apellido": "Alcaraz",
      "avatarUrl": "assets/img/avatares/avatar-4.svg",
      "biografia": "Moderador del área de Ciencias Sociales.",
      "estado": "activo",
      "fechaRegistro": "2025-09-04 09:00:00"
    },
    {
      "idUsuario": 4,
      "rolId": 2,
      "username": "mnahuel",
      "email": "mnahuel@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido04",
      "nombre": "Martin",
      "apellido": "Cabrera",
      "avatarUrl": "assets/img/avatares/avatar-5.svg",
      "biografia": "Estudiante de Ingeniería en Sistemas, 3er año.",
      "estado": "activo",
      "fechaRegistro": "2025-09-11 09:00:00"
    },
    {
      "idUsuario": 5,
      "rolId": 2,
      "username": "sofi.dg",
      "email": "sofia.dg@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido05",
      "nombre": "Sofía",
      "apellido": "Duarte",
      "avatarUrl": "assets/img/avatares/avatar-6.svg",
      "biografia": "Cursando Diseño Gráfico y Multimedia.",
      "estado": "activo",
      "fechaRegistro": "2025-09-18 09:00:00"
    },
    {
      "idUsuario": 6,
      "rolId": 2,
      "username": "jpcontable",
      "email": "juanp@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido06",
      "nombre": "Juan Pablo",
      "apellido": "Ríos",
      "avatarUrl": "assets/img/avatares/avatar-1.svg",
      "biografia": "Futuro contador público.",
      "estado": "activo",
      "fechaRegistro": "2025-09-25 09:00:00"
    },
    {
      "idUsuario": 7,
      "rolId": 2,
      "username": "cami.psi",
      "email": "camila.psi@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido07",
      "nombre": "Camila",
      "apellido": "Benítez",
      "avatarUrl": "assets/img/avatares/avatar-2.svg",
      "biografia": "Psicología, ciclo superior.",
      "estado": "activo",
      "fechaRegistro": "2025-10-02 09:00:00"
    },
    {
      "idUsuario": 8,
      "rolId": 2,
      "username": "nico_dev",
      "email": "nicolas.dev@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido08",
      "nombre": "Nicolás",
      "apellido": "Aguirre",
      "avatarUrl": "assets/img/avatares/avatar-3.svg",
      "biografia": "Analista en Sistemas, me gusta compartir apuntes.",
      "estado": "activo",
      "fechaRegistro": "2025-10-09 09:00:00"
    },
    {
      "idUsuario": 9,
      "rolId": 2,
      "username": "agus.leyes",
      "email": "agustina.abo@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido09",
      "nombre": "Agustina",
      "apellido": "Molina",
      "avatarUrl": "assets/img/avatares/avatar-4.svg",
      "biografia": "Abogacía, 3er año.",
      "estado": "activo",
      "fechaRegistro": "2025-10-16 09:00:00"
    },
    {
      "idUsuario": 10,
      "rolId": 2,
      "username": "flor.nut",
      "email": "florencia.nut@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido10",
      "nombre": "Florencia",
      "apellido": "Vega",
      "avatarUrl": "assets/img/avatares/avatar-5.svg",
      "biografia": "Nutrición, interesada en salud pública.",
      "estado": "activo",
      "fechaRegistro": "2025-10-23 09:00:00"
    },
    {
      "idUsuario": 11,
      "rolId": 2,
      "username": "mati.ali",
      "email": "matias.ali@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido11",
      "nombre": "Matías",
      "apellido": "Sosa",
      "avatarUrl": "assets/img/avatares/avatar-6.svg",
      "biografia": "Ingeniería en Alimentos.",
      "estado": "activo",
      "fechaRegistro": "2025-10-30 09:00:00"
    },
    {
      "idUsuario": 12,
      "rolId": 2,
      "username": "rocio.crim",
      "email": "rocio.crim@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido12",
      "nombre": "Rocío",
      "apellido": "Paredes",
      "avatarUrl": "assets/img/avatares/avatar-1.svg",
      "biografia": "Criminalística, apasionada por la balística.",
      "estado": "activo",
      "fechaRegistro": "2025-11-06 09:00:00"
    },
    {
      "idUsuario": 13,
      "rolId": 2,
      "username": "tomi.fono",
      "email": "tomas.fono@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido13",
      "nombre": "Tomás",
      "apellido": "Ledesma",
      "avatarUrl": "assets/img/avatares/avatar-2.svg",
      "biografia": "Fonoaudiología, 2do año.",
      "estado": "activo",
      "fechaRegistro": "2025-11-13 09:00:00"
    },
    {
      "idUsuario": 14,
      "rolId": 2,
      "username": "belu.psp",
      "email": "belen.psp@faculeaks.edu.ar",
      "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido14",
      "nombre": "Belén",
      "apellido": "Quiroga",
      "avatarUrl": "assets/img/avatares/avatar-3.svg",
      "biografia": "Psicopedagogía.",
      "estado": "activo",
      "fechaRegistro": "2025-11-20 09:00:00"
    }
  ],
  "carreras": [
    {
      "idCarrera": 1,
      "nombre": "Licenciatura en Diseño Gráfico y Multimedia",
      "slug": "licenciatura-en-diseno-grafico-y-multimedia",
      "descripcion": "Formación en comunicación visual, diseño editorial, audiovisual e interactivo.",
      "duracionAnios": 4,
      "activa": true
    },
    {
      "idCarrera": 2,
      "nombre": "Contador Público",
      "slug": "contador-publico",
      "descripcion": "Formación contable, impositiva y de auditoría para organizaciones públicas y privadas.",
      "duracionAnios": 5,
      "activa": true
    },
    {
      "idCarrera": 3,
      "nombre": "Ingeniería en Sistemas de Información",
      "slug": "ingenieria-en-sistemas-de-informacion",
      "descripcion": "Análisis, diseño, desarrollo e implantación de sistemas de información en las organizaciones.",
      "duracionAnios": 5,
      "activa": true
    },
    {
      "idCarrera": 4,
      "nombre": "Abogacía",
      "slug": "abogacia",
      "descripcion": "Formación jurídica integral en derecho público y privado.",
      "duracionAnios": 5,
      "activa": true
    },
    {
      "idCarrera": 5,
      "nombre": "Licenciatura en Criminalística",
      "slug": "licenciatura-en-criminalistica",
      "descripcion": "Investigación científica del delito, pericias y ciencias forenses.",
      "duracionAnios": 4,
      "activa": true
    },
    {
      "idCarrera": 6,
      "nombre": "Licenciatura en Psicología",
      "slug": "licenciatura-en-psicologia",
      "descripcion": "Estudio de los procesos psíquicos y de la conducta humana en sus distintos ámbitos.",
      "duracionAnios": 5,
      "activa": true
    },
    {
      "idCarrera": 7,
      "nombre": "Licenciatura en Fonoaudiología",
      "slug": "licenciatura-en-fonoaudiologia",
      "descripcion": "Prevención, diagnóstico y tratamiento de la comunicación humana.",
      "duracionAnios": 5,
      "activa": true
    },
    {
      "idCarrera": 8,
      "nombre": "Licenciatura en Psicopedagogía",
      "slug": "licenciatura-en-psicopedagogia",
      "descripcion": "Abordaje de los procesos de aprendizaje en contextos educativos y clínicos.",
      "duracionAnios": 4,
      "activa": true
    },
    {
      "idCarrera": 9,
      "nombre": "Licenciatura en Nutrición",
      "slug": "licenciatura-en-nutricion",
      "descripcion": "Alimentación humana, nutrición clínica y salud pública.",
      "duracionAnios": 5,
      "activa": true
    },
    {
      "idCarrera": 10,
      "nombre": "Analista Universitario en Sistemas de Información",
      "slug": "analista-universitario-en-sistemas-de-informacion",
      "descripcion": "Ciclo corto orientado al análisis y desarrollo de software.",
      "duracionAnios": 3,
      "activa": true
    },
    {
      "idCarrera": 11,
      "nombre": "Analista Universitario Contable",
      "slug": "analista-universitario-contable",
      "descripcion": "Ciclo corto orientado a la gestión contable y administrativa.",
      "duracionAnios": 3,
      "activa": true
    },
    {
      "idCarrera": 12,
      "nombre": "Ingeniería en Alimentos",
      "slug": "ingenieria-en-alimentos",
      "descripcion": "Procesos, calidad e industrialización de productos alimenticios.",
      "duracionAnios": 5,
      "activa": true
    },
    {
      "idCarrera": 13,
      "nombre": "Analista Universitario en Alimentos",
      "slug": "analista-universitario-en-alimentos",
      "descripcion": "Ciclo corto orientado al control de calidad y procesos alimentarios.",
      "duracionAnios": 3,
      "activa": true
    }
  ],
  "materias": [
    {
      "idMateria": 1,
      "codigo": "SIS-101",
      "nombre": "Algoritmos y Estructuras de Datos",
      "descripcion": "Resolución algorítmica, complejidad y estructuras fundamentales.",
      "activa": true
    },
    {
      "idMateria": 2,
      "codigo": "SIS-102",
      "nombre": "Arquitectura de Computadoras",
      "descripcion": "Organización del computador, memoria y conjunto de instrucciones.",
      "activa": true
    },
    {
      "idMateria": 3,
      "codigo": "SIS-103",
      "nombre": "Análisis Matemático I",
      "descripcion": "Límites, derivadas e integrales de una variable.",
      "activa": true
    },
    {
      "idMateria": 4,
      "codigo": "SIS-104",
      "nombre": "Álgebra y Geometría Analítica",
      "descripcion": "Matrices, sistemas lineales, vectores y conicas.",
      "activa": true
    },
    {
      "idMateria": 5,
      "codigo": "SIS-201",
      "nombre": "Programación Orientada a Objetos",
      "descripcion": "Abstracción, encapsulamiento, herencia y polimorfismo.",
      "activa": true
    },
    {
      "idMateria": 6,
      "codigo": "SIS-202",
      "nombre": "Bases de Datos",
      "descripcion": "Modelo relacional, normalización, SQL y transacciones.",
      "activa": true
    },
    {
      "idMateria": 7,
      "codigo": "SIS-203",
      "nombre": "Sistemas Operativos",
      "descripcion": "Procesos, concurrencia, memoria y sistemas de archivos.",
      "activa": true
    },
    {
      "idMateria": 8,
      "codigo": "SIS-204",
      "nombre": "Análisis de Sistemas",
      "descripcion": "Relevamiento, requerimientos y modelado UML.",
      "activa": true
    },
    {
      "idMateria": 9,
      "codigo": "SIS-301",
      "nombre": "Paradigmas de la Programación",
      "descripcion": "Paradigmas imperativo, funcional, lógico y orientado a objetos.",
      "activa": true
    },
    {
      "idMateria": 10,
      "codigo": "SIS-302",
      "nombre": "Redes de Datos",
      "descripcion": "Modelo OSI/TCP-IP, ruteo y servicios de red.",
      "activa": true
    },
    {
      "idMateria": 11,
      "codigo": "SIS-303",
      "nombre": "Ingeniería de Software",
      "descripcion": "Ciclo de vida, metodologías, calidad y gestión de proyectos.",
      "activa": true
    },
    {
      "idMateria": 12,
      "codigo": "SIS-304",
      "nombre": "Desarrollo Web",
      "descripcion": "HTML, CSS, JavaScript, arquitectura cliente-servidor.",
      "activa": true
    },
    {
      "idMateria": 13,
      "codigo": "SIS-401",
      "nombre": "Inteligencia Artificial",
      "descripcion": "Búsqueda, representación del conocimiento y aprendizaje automático.",
      "activa": true
    },
    {
      "idMateria": 14,
      "codigo": "SIS-402",
      "nombre": "Gestión de Proyectos Informaticos",
      "descripcion": "Alcance, cronograma, riesgos y costos de proyectos de TI.",
      "activa": true
    },
    {
      "idMateria": 15,
      "codigo": "CON-101",
      "nombre": "Contabilidad Básica",
      "descripcion": "Patrimonio, ecuación contable y registración.",
      "activa": true
    },
    {
      "idMateria": 16,
      "codigo": "CON-102",
      "nombre": "Derecho Privado",
      "descripcion": "Personas, obligaciones y contratos.",
      "activa": true
    },
    {
      "idMateria": 17,
      "codigo": "CON-201",
      "nombre": "Contabilidad Intermedia",
      "descripcion": "Valuación, exposición y estados contables.",
      "activa": true
    },
    {
      "idMateria": 18,
      "codigo": "CON-202",
      "nombre": "Impuestos I",
      "descripcion": "Sistema tributario argentino, IVA y ganancias.",
      "activa": true
    },
    {
      "idMateria": 19,
      "codigo": "CON-301",
      "nombre": "Auditoría",
      "descripcion": "Normas de auditoría, evidencia e informe del auditor.",
      "activa": true
    },
    {
      "idMateria": 20,
      "codigo": "CON-302",
      "nombre": "Costos y Gestión",
      "descripcion": "Sistemas de costeo y toma de decisiones.",
      "activa": true
    },
    {
      "idMateria": 21,
      "codigo": "ABO-101",
      "nombre": "Introducción al Derecho",
      "descripcion": "Teoría general del derecho y fuentes normativas.",
      "activa": true
    },
    {
      "idMateria": 22,
      "codigo": "ABO-201",
      "nombre": "Derecho Constitucional",
      "descripcion": "Poder constituyente, derechos y garantías.",
      "activa": true
    },
    {
      "idMateria": 23,
      "codigo": "ABO-301",
      "nombre": "Derecho Penal I",
      "descripcion": "Teoría del delito y parte general.",
      "activa": true
    },
    {
      "idMateria": 24,
      "codigo": "PSI-101",
      "nombre": "Psicología General",
      "descripcion": "Procesos basicos: percepción, memoria, aprendizaje.",
      "activa": true
    },
    {
      "idMateria": 25,
      "codigo": "PSI-201",
      "nombre": "Psicología del Desarrollo",
      "descripcion": "Desarrollo psíquico a lo largo del ciclo vital.",
      "activa": true
    },
    {
      "idMateria": 26,
      "codigo": "PSI-301",
      "nombre": "Psicopatología",
      "descripcion": "Clasificación y abordaje de los cuadros psicopatológicos.",
      "activa": true
    },
    {
      "idMateria": 27,
      "codigo": "DGM-101",
      "nombre": "Taller de Diseño I",
      "descripcion": "Fundamentos del lenguaje visual y composición.",
      "activa": true
    },
    {
      "idMateria": 28,
      "codigo": "DGM-201",
      "nombre": "Tipografía",
      "descripcion": "Anatomía tipográfica, familias y diagramación.",
      "activa": true
    },
    {
      "idMateria": 29,
      "codigo": "DGM-301",
      "nombre": "Diseño Multimedia",
      "descripcion": "Diseño de interfaces, animación y producción audiovisual.",
      "activa": true
    },
    {
      "idMateria": 30,
      "codigo": "CRI-101",
      "nombre": "Introducción a la Criminalística",
      "descripcion": "Escena del crimen, indicios y cadena de custodia.",
      "activa": true
    },
    {
      "idMateria": 31,
      "codigo": "CRI-201",
      "nombre": "Balística Forense",
      "descripcion": "Armas, proyectiles y pericias balísticas.",
      "activa": true
    },
    {
      "idMateria": 32,
      "codigo": "FON-101",
      "nombre": "Anatomofisiología de la Comunicación",
      "descripcion": "Bases anatómicas del habla, voz y audición.",
      "activa": true
    },
    {
      "idMateria": 33,
      "codigo": "FON-201",
      "nombre": "Audiología",
      "descripcion": "Evaluación audiológica y rehabilitación auditiva.",
      "activa": true
    },
    {
      "idMateria": 34,
      "codigo": "PSP-101",
      "nombre": "Aprendizaje y Cognición",
      "descripcion": "Teorias del aprendizaje y procesos cognitivos.",
      "activa": true
    },
    {
      "idMateria": 35,
      "codigo": "PSP-201",
      "nombre": "Diagnóstico Psicopedagógico",
      "descripcion": "Instrumentos y proceso diagnóstico.",
      "activa": true
    },
    {
      "idMateria": 36,
      "codigo": "NUT-101",
      "nombre": "Bromatología",
      "descripcion": "Higiene, conservación y seguridad alimentaria.",
      "activa": true
    },
    {
      "idMateria": 37,
      "codigo": "NUT-201",
      "nombre": "Nutrición Clínica",
      "descripcion": "Dietoterapia y abordaje nutricional del paciente.",
      "activa": true
    },
    {
      "idMateria": 38,
      "codigo": "ALI-101",
      "nombre": "Química General",
      "descripcion": "Estructura de la materia, estequiometría y soluciones.",
      "activa": true
    },
    {
      "idMateria": 39,
      "codigo": "ALI-201",
      "nombre": "Operaciones Unitarias",
      "descripcion": "Transferencia de calor, masa y cantidad de movimiento.",
      "activa": true
    },
    {
      "idMateria": 40,
      "codigo": "ALI-301",
      "nombre": "Control de Calidad de Alimentos",
      "descripcion": "Normas, muestreo y ensayos de calidad.",
      "activa": true
    },
    {
      "idMateria": 41,
      "codigo": "GEN-101",
      "nombre": "Inglés Técnico",
      "descripcion": "Comprensión lectora de textos técnicos en inglés.",
      "activa": true
    },
    {
      "idMateria": 42,
      "codigo": "GEN-102",
      "nombre": "Metodología de la Investigación",
      "descripcion": "Diseño de investigación, hipótesis y técnicas de recolección.",
      "activa": true
    },
    {
      "idMateria": 43,
      "codigo": "GEN-103",
      "nombre": "Estadística",
      "descripcion": "Estadística descriptiva, probabilidad e inferencia.",
      "activa": true
    }
  ],
  "carreraMateria": [
    {
      "carreraId": 4,
      "materiaId": 21,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 4,
      "materiaId": 16,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 4,
      "materiaId": 22,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 4,
      "materiaId": 23,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 4,
      "materiaId": 42,
      "anioCursada": 4,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 11,
      "materiaId": 15,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 11,
      "materiaId": 16,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 11,
      "materiaId": 17,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 11,
      "materiaId": 20,
      "anioCursada": 2,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 11,
      "materiaId": 18,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 13,
      "materiaId": 38,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 13,
      "materiaId": 36,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 13,
      "materiaId": 40,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 10,
      "materiaId": 1,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 10,
      "materiaId": 4,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 10,
      "materiaId": 2,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 10,
      "materiaId": 5,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 10,
      "materiaId": 6,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 10,
      "materiaId": 8,
      "anioCursada": 2,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 10,
      "materiaId": 12,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 10,
      "materiaId": 9,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": false
    },
    {
      "carreraId": 10,
      "materiaId": 41,
      "anioCursada": 3,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 2,
      "materiaId": 15,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 2,
      "materiaId": 16,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 2,
      "materiaId": 43,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 2,
      "materiaId": 17,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 2,
      "materiaId": 20,
      "anioCursada": 2,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 2,
      "materiaId": 18,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 2,
      "materiaId": 19,
      "anioCursada": 4,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 2,
      "materiaId": 42,
      "anioCursada": 5,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 12,
      "materiaId": 38,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 12,
      "materiaId": 3,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 12,
      "materiaId": 41,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 12,
      "materiaId": 39,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 12,
      "materiaId": 40,
      "anioCursada": 4,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 1,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 3,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 4,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 2,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 41,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 5,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 6,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 43,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 7,
      "anioCursada": 2,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 8,
      "anioCursada": 2,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 9,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 10,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 11,
      "anioCursada": 3,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 12,
      "anioCursada": 3,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 13,
      "anioCursada": 4,
      "cuatrimestre": 1,
      "obligatoria": false
    },
    {
      "carreraId": 3,
      "materiaId": 14,
      "anioCursada": 4,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 3,
      "materiaId": 42,
      "anioCursada": 4,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 5,
      "materiaId": 30,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 5,
      "materiaId": 21,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 5,
      "materiaId": 31,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 5,
      "materiaId": 43,
      "anioCursada": 2,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 1,
      "materiaId": 27,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 1,
      "materiaId": 28,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 1,
      "materiaId": 29,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 1,
      "materiaId": 12,
      "anioCursada": 3,
      "cuatrimestre": 2,
      "obligatoria": false
    },
    {
      "carreraId": 7,
      "materiaId": 32,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 7,
      "materiaId": 24,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 7,
      "materiaId": 33,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 9,
      "materiaId": 38,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 9,
      "materiaId": 36,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 9,
      "materiaId": 37,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 6,
      "materiaId": 24,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 6,
      "materiaId": 43,
      "anioCursada": 1,
      "cuatrimestre": 2,
      "obligatoria": true
    },
    {
      "carreraId": 6,
      "materiaId": 25,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 6,
      "materiaId": 26,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 6,
      "materiaId": 42,
      "anioCursada": 4,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 8,
      "materiaId": 34,
      "anioCursada": 1,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 8,
      "materiaId": 25,
      "anioCursada": 2,
      "cuatrimestre": 1,
      "obligatoria": true
    },
    {
      "carreraId": 8,
      "materiaId": 35,
      "anioCursada": 3,
      "cuatrimestre": 1,
      "obligatoria": true
    }
  ],
  "estudia": [
    {
      "usuarioId": 4,
      "carreraId": 3,
      "anioIngreso": 2024,
      "sede": "Sede Central",
      "activo": true
    },
    {
      "usuarioId": 8,
      "carreraId": 10,
      "anioIngreso": 2025,
      "sede": "Sede Central",
      "activo": true
    },
    {
      "usuarioId": 8,
      "carreraId": 3,
      "anioIngreso": 2026,
      "sede": "Sede Central",
      "activo": true
    },
    {
      "usuarioId": 5,
      "carreraId": 1,
      "anioIngreso": 2024,
      "sede": "Sede Norte",
      "activo": true
    },
    {
      "usuarioId": 6,
      "carreraId": 2,
      "anioIngreso": 2023,
      "sede": "Sede Central",
      "activo": true
    },
    {
      "usuarioId": 7,
      "carreraId": 6,
      "anioIngreso": 2022,
      "sede": "Sede Sur",
      "activo": true
    },
    {
      "usuarioId": 9,
      "carreraId": 4,
      "anioIngreso": 2024,
      "sede": "Sede Central",
      "activo": true
    },
    {
      "usuarioId": 10,
      "carreraId": 9,
      "anioIngreso": 2025,
      "sede": "Sede Norte",
      "activo": true
    },
    {
      "usuarioId": 11,
      "carreraId": 12,
      "anioIngreso": 2023,
      "sede": "Sede Sur",
      "activo": true
    },
    {
      "usuarioId": 12,
      "carreraId": 5,
      "anioIngreso": 2025,
      "sede": "Sede Central",
      "activo": true
    },
    {
      "usuarioId": 13,
      "carreraId": 7,
      "anioIngreso": 2025,
      "sede": "Sede Norte",
      "activo": true
    },
    {
      "usuarioId": 14,
      "carreraId": 8,
      "anioIngreso": 2024,
      "sede": "Sede Sur",
      "activo": true
    },
    {
      "usuarioId": 2,
      "carreraId": 3,
      "anioIngreso": 2019,
      "sede": "Sede Central",
      "activo": true
    },
    {
      "usuarioId": 3,
      "carreraId": 4,
      "anioIngreso": 2020,
      "sede": "Sede Central",
      "activo": true
    }
  ],
  "programas": [
    {
      "materiaId": 1,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Algoritmos y Estructuras de Datos - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-101-2026.pdf",
      "docenteReferencia": "Lic. M. Sánchez",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-04 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 1,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Algoritmos y Estructuras de Datos - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/sis-101-2025.pdf",
      "docenteReferencia": "Dr. A. Peralta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-05 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 2,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Arquitectura de Computadoras - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-102-2026.pdf",
      "docenteReferencia": "Mg. C. Zárate",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-06 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 2,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Arquitectura de Computadoras - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/sis-102-2025.pdf",
      "docenteReferencia": "Esp. L. Fernández",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-10-07 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 3,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Análisis Matemático I - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-103-2026.pdf",
      "docenteReferencia": "Ing. S. Coronel",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-08 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 4,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Álgebra y Geometría Analítica - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-104-2026.pdf",
      "docenteReferencia": "Lic. P. Arrieta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-09 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 4,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Álgebra y Geometría Analítica - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/sis-104-2025.pdf",
      "docenteReferencia": "Dra. N. Ojeda",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-10 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 5,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Programación Orientada a Objetos - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-201-2026.pdf",
      "docenteReferencia": "Ing. R. Villalba",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-10-11 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 5,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Programación Orientada a Objetos - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/sis-201-2025.pdf",
      "docenteReferencia": "Lic. M. Sánchez",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-12 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 6,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Bases de Datos - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-202-2026.pdf",
      "docenteReferencia": "Dr. A. Peralta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-13 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 7,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Sistemas Operativos - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-203-2026.pdf",
      "docenteReferencia": "Mg. C. Zárate",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-14 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 7,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Sistemas Operativos - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/sis-203-2025.pdf",
      "docenteReferencia": "Esp. L. Fernández",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-10-15 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 8,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Análisis de Sistemas - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-204-2026.pdf",
      "docenteReferencia": "Ing. S. Coronel",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-16 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 8,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Análisis de Sistemas - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/sis-204-2025.pdf",
      "docenteReferencia": "Lic. P. Arrieta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-17 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 9,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Paradigmas de la Programación - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-301-2026.pdf",
      "docenteReferencia": "Dra. N. Ojeda",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-18 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 10,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Redes de Datos - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-302-2026.pdf",
      "docenteReferencia": "Ing. R. Villalba",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-10-19 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 10,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Redes de Datos - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/sis-302-2025.pdf",
      "docenteReferencia": "Lic. M. Sánchez",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-20 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 11,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Ingeniería de Software - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-303-2026.pdf",
      "docenteReferencia": "Dr. A. Peralta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-21 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 11,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Ingeniería de Software - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/sis-303-2025.pdf",
      "docenteReferencia": "Mg. C. Zárate",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-22 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 12,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Desarrollo Web - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-304-2026.pdf",
      "docenteReferencia": "Esp. L. Fernández",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-10-23 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 13,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Inteligencia Artificial - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-401-2026.pdf",
      "docenteReferencia": "Ing. S. Coronel",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-24 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 13,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Inteligencia Artificial - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/sis-401-2025.pdf",
      "docenteReferencia": "Lic. P. Arrieta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-25 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 14,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Gestión de Proyectos Informaticos - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/sis-402-2026.pdf",
      "docenteReferencia": "Dra. N. Ojeda",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-26 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 14,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Gestión de Proyectos Informaticos - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/sis-402-2025.pdf",
      "docenteReferencia": "Ing. R. Villalba",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-10-27 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 15,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Contabilidad Básica - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/con-101-2026.pdf",
      "docenteReferencia": "Lic. M. Sánchez",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-28 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 16,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Derecho Privado - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/con-102-2026.pdf",
      "docenteReferencia": "Dr. A. Peralta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-29 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 16,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Derecho Privado - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/con-102-2025.pdf",
      "docenteReferencia": "Mg. C. Zárate",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-10-30 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 17,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Contabilidad Intermedia - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/con-201-2026.pdf",
      "docenteReferencia": "Esp. L. Fernández",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-10-31 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 17,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Contabilidad Intermedia - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/con-201-2025.pdf",
      "docenteReferencia": "Ing. S. Coronel",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-01 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 18,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Impuestos I - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/con-202-2026.pdf",
      "docenteReferencia": "Lic. P. Arrieta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-02 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 19,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Auditoría - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/con-301-2026.pdf",
      "docenteReferencia": "Dra. N. Ojeda",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-03 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 19,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Auditoría - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/con-301-2025.pdf",
      "docenteReferencia": "Ing. R. Villalba",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-11-04 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 20,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Costos y Gestión - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/con-302-2026.pdf",
      "docenteReferencia": "Lic. M. Sánchez",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-05 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 20,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Costos y Gestión - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/con-302-2025.pdf",
      "docenteReferencia": "Dr. A. Peralta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-06 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 21,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Introducción al Derecho - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/abo-101-2026.pdf",
      "docenteReferencia": "Mg. C. Zárate",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-07 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 22,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Derecho Constitucional - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/abo-201-2026.pdf",
      "docenteReferencia": "Esp. L. Fernández",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-11-08 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 22,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Derecho Constitucional - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/abo-201-2025.pdf",
      "docenteReferencia": "Ing. S. Coronel",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-09 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 23,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Derecho Penal I - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/abo-301-2026.pdf",
      "docenteReferencia": "Lic. P. Arrieta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-10 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 23,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Derecho Penal I - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/abo-301-2025.pdf",
      "docenteReferencia": "Dra. N. Ojeda",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-11 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 24,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Psicología General - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/psi-101-2026.pdf",
      "docenteReferencia": "Ing. R. Villalba",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-11-12 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 25,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Psicología del Desarrollo - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/psi-201-2026.pdf",
      "docenteReferencia": "Lic. M. Sánchez",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-13 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 25,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Psicología del Desarrollo - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/psi-201-2025.pdf",
      "docenteReferencia": "Dr. A. Peralta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-14 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 26,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Psicopatología - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/psi-301-2026.pdf",
      "docenteReferencia": "Mg. C. Zárate",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-15 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 26,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Psicopatología - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/psi-301-2025.pdf",
      "docenteReferencia": "Esp. L. Fernández",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-11-16 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 27,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Taller de Diseño I - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/dgm-101-2026.pdf",
      "docenteReferencia": "Ing. S. Coronel",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-17 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 28,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Tipografía - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/dgm-201-2026.pdf",
      "docenteReferencia": "Lic. P. Arrieta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-18 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 28,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Tipografía - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/dgm-201-2025.pdf",
      "docenteReferencia": "Dra. N. Ojeda",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-19 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 29,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Diseño Multimedia - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/dgm-301-2026.pdf",
      "docenteReferencia": "Ing. R. Villalba",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-11-20 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 29,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Diseño Multimedia - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/dgm-301-2025.pdf",
      "docenteReferencia": "Lic. M. Sánchez",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-21 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 30,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Introducción a la Criminalística - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/cri-101-2026.pdf",
      "docenteReferencia": "Dr. A. Peralta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-22 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 31,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Balística Forense - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/cri-201-2026.pdf",
      "docenteReferencia": "Mg. C. Zárate",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-23 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 31,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Balística Forense - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/cri-201-2025.pdf",
      "docenteReferencia": "Esp. L. Fernández",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-11-24 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 32,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Anatomofisiología de la Comunicación - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/fon-101-2026.pdf",
      "docenteReferencia": "Ing. S. Coronel",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-25 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 32,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Anatomofisiología de la Comunicación - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/fon-101-2025.pdf",
      "docenteReferencia": "Lic. P. Arrieta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-26 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 33,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Audiología - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/fon-201-2026.pdf",
      "docenteReferencia": "Dra. N. Ojeda",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-27 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 34,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Aprendizaje y Cognición - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/psp-101-2026.pdf",
      "docenteReferencia": "Ing. R. Villalba",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-11-28 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 34,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Aprendizaje y Cognición - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/psp-101-2025.pdf",
      "docenteReferencia": "Lic. M. Sánchez",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-29 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 35,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Diagnóstico Psicopedagógico - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/psp-201-2026.pdf",
      "docenteReferencia": "Dr. A. Peralta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-11-30 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 35,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Diagnóstico Psicopedagógico - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/psp-201-2025.pdf",
      "docenteReferencia": "Mg. C. Zárate",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-12-01 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 36,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Bromatología - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/nut-101-2026.pdf",
      "docenteReferencia": "Esp. L. Fernández",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-12-02 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 37,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Nutrición Clínica - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/nut-201-2026.pdf",
      "docenteReferencia": "Ing. S. Coronel",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-12-03 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 37,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Nutrición Clínica - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/nut-201-2025.pdf",
      "docenteReferencia": "Lic. P. Arrieta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-12-04 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 38,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Química General - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/ali-101-2026.pdf",
      "docenteReferencia": "Dra. N. Ojeda",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-12-05 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 38,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Química General - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/ali-101-2025.pdf",
      "docenteReferencia": "Ing. R. Villalba",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-12-06 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 39,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Operaciones Unitarias - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/ali-201-2026.pdf",
      "docenteReferencia": "Lic. M. Sánchez",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-12-07 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 40,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Control de Calidad de Alimentos - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/ali-301-2026.pdf",
      "docenteReferencia": "Dr. A. Peralta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-12-08 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 40,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Control de Calidad de Alimentos - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/ali-301-2025.pdf",
      "docenteReferencia": "Mg. C. Zárate",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-12-09 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 41,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Inglés Técnico - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/gen-101-2026.pdf",
      "docenteReferencia": "Esp. L. Fernández",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-12-10 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 41,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Inglés Técnico - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/gen-101-2025.pdf",
      "docenteReferencia": "Ing. S. Coronel",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-12-11 09:00:00",
      "vigente": false
    },
    {
      "materiaId": 42,
      "anioAcademico": 2026,
      "version": "v1.0",
      "titulo": "Programa de Metodología de la Investigación - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/gen-102-2026.pdf",
      "docenteReferencia": "Lic. P. Arrieta",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-12-12 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 43,
      "anioAcademico": 2026,
      "version": "v2.0",
      "titulo": "Programa de Estadística - Ciclo 2026",
      "archivoUrl": "assets/archivos/programas/gen-103-2026.pdf",
      "docenteReferencia": "Dra. N. Ojeda",
      "cargadoPor": 1,
      "fechaPublicacion": "2025-12-13 09:00:00",
      "vigente": true
    },
    {
      "materiaId": 43,
      "anioAcademico": 2025,
      "version": "v1.0",
      "titulo": "Programa de Estadística - Ciclo 2025",
      "archivoUrl": "assets/archivos/programas/gen-103-2025.pdf",
      "docenteReferencia": "Ing. R. Villalba",
      "cargadoPor": 2,
      "fechaPublicacion": "2025-12-14 09:00:00",
      "vigente": false
    }
  ],
  "contenidos": [
    {
      "idContenido": 1,
      "usuarioId": 4,
      "tipo": "publicacion",
      "cuerpo": "Estoy arrancando Paradigmas y me cuesta ver la diferencia real entre programar en Haskell y en Prolog.\n\nEntiendo que en el funcional describo transformaciones con funciones puras y en el lógico declaro hechos y reglas y el motor resuelve por unificación, pero no me queda claro cuando conviene cada uno en la práctica.\n\nAlguien que ya haya rendido puede dar un ejemplo concreto?",
      "estado": "publicado",
      "fechaCreacion": "2025-12-04 10:00:00"
    },
    {
      "idContenido": 2,
      "usuarioId": 8,
      "tipo": "publicacion",
      "cuerpo": "Subo un resumen de 8 páginas que armé para el primer parcial de Paradigmas.\n\nContenido:\n- Términos, hechos, reglas y consultas\n- Algoritmo de unificación paso a paso\n- Árbol de resolución y backtracking\n- Corte (!) y sus efectos\n- 12 ejercicios resueltos\n\nEstá basado en las clases teóricas y en el capítulo correspondiente de la bibliografía de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-06 11:00:00"
    },
    {
      "idContenido": 3,
      "usuarioId": 4,
      "tipo": "publicacion",
      "cuerpo": "Comparto el parcial que tomaron el año pasado. Tenía tres partes: normalización hasta 3FN, álgebra relacional y consultas SQL con subconsultas y agregación.\n\nLo que más pesaba era la parte de normalización, asi que practiquen dependencias funcionales.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-08 12:00:00"
    },
    {
      "idContenido": 4,
      "usuarioId": 8,
      "tipo": "publicacion",
      "cuerpo": "Cursando con la cátedra de la mañana: mucho énfasis en el modelo relacional formal antes de tocar SQL.\n\nLas prácticas son con MariaDB y piden un trabajo integrador de diseño de esquema. Toman coloquio oral al final. Muy exigentes con la justificación de las claves y las cardinalidades.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-10 13:00:00"
    },
    {
      "idContenido": 5,
      "usuarioId": 4,
      "tipo": "publicacion",
      "cuerpo": "Ambas caen en segundo año y tienen carga práctica fuerte. Yo las cursé juntas y fue pesado pero se puede si organizás los TPs con anticipación.\n\nSi trabajás más de 4 horas por día, yo dejaría Sistemas Operativos para el cuatrimestre siguiente.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-12 14:00:00"
    },
    {
      "idContenido": 6,
      "usuarioId": 8,
      "tipo": "publicacion",
      "cuerpo": "Lista de recursos que me sirvieron:\n- MDN Web Docs para referencia de HTML, CSS y JS\n- Especificación de WCAG para accesibilidad\n- Un simulador local con el servidor http de Python para probar fetch\n\nNo hace falta ningún framework para aprobar la materia.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-14 15:00:00"
    },
    {
      "idContenido": 7,
      "usuarioId": 5,
      "tipo": "publicacion",
      "cuerpo": "Es la materia que más me cambió la mirada. Se trabaja mucho con entregas semanales y correcciones en clase.\n\nConsejo: no dejen las entregas para el último día, la corrección iterativa es la mitad de la nota.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-16 16:00:00"
    },
    {
      "idContenido": 8,
      "usuarioId": 5,
      "tipo": "publicacion",
      "cuerpo": "Resumen de los principios de composición: equilibrio, ritmo, jerarquía, contraste y proporción, con ejemplos analizados de piezas editoriales.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-18 17:00:00"
    },
    {
      "idContenido": 9,
      "usuarioId": 6,
      "tipo": "publicacion",
      "cuerpo": "Cuando una compra tiene percepción, la percepción no forma parte del crédito fiscal, verdad? Me quedó la duda del práctico 4.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-20 18:00:00"
    },
    {
      "idContenido": 10,
      "usuarioId": 6,
      "tipo": "publicacion",
      "cuerpo": "Comparto el tema 2 del final de diciembre. Ocho asientos, un mayor y el armado de la ecuación patrimonial.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-22 19:00:00"
    },
    {
      "idContenido": 11,
      "usuarioId": 6,
      "tipo": "publicacion",
      "cuerpo": "Idealmente: Contabilidad Intermedia, después Costos y Gestión, después Impuestos I. Llegar a Auditoría sin Impuestos se puede pero se sufre.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-24 20:00:00"
    },
    {
      "idContenido": 12,
      "usuarioId": 7,
      "tipo": "publicacion",
      "cuerpo": "Armé un cuadro comparando los criterios de las principales clasificaciones diagnosticas trabajadas en la cátedra, con las críticas que se le hacen a cada una.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-26 09:00:00"
    },
    {
      "idContenido": 13,
      "usuarioId": 7,
      "tipo": "publicacion",
      "cuerpo": "Es una materia de mucha lectura. Lo que me funcionó fue hacer fichas por autor y por etapa del ciclo vital, y releer solo las fichas antes del parcial.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-28 10:00:00"
    },
    {
      "idContenido": 14,
      "usuarioId": 9,
      "tipo": "publicacion",
      "cuerpo": "Necesito una explicación clara con el ejemplo argentino. En el apunte de cátedra esta muy resumido.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-30 11:00:00"
    },
    {
      "idContenido": 15,
      "usuarioId": 9,
      "tipo": "publicacion",
      "cuerpo": "Dos parciales escritos con desarrollo y un final oral. Piden manejo de la teoría del delito con la estructura completa.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-01 12:00:00"
    },
    {
      "idContenido": 16,
      "usuarioId": 10,
      "tipo": "publicacion",
      "cuerpo": "Los cuadros del código alimentario que se piden en el TP estan disponibles públicamente. Recomiendo trabajar con la versión actualizada y no con fotocopias viejas.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-03 13:00:00"
    },
    {
      "idContenido": 17,
      "usuarioId": 10,
      "tipo": "publicacion",
      "cuerpo": "En el caso práctico 3 no me cierra el factor de actividad. Alguien lo resolvió?",
      "estado": "publicado",
      "fechaCreacion": "2026-01-05 14:00:00"
    },
    {
      "idContenido": 18,
      "usuarioId": 11,
      "tipo": "publicacion",
      "cuerpo": "Resumen con las ecuaciones de conducción, convección y radiación, más los números adimensionales que se usan en la práctica (Reynolds, Prandtl, Nusselt).",
      "estado": "publicado",
      "fechaCreacion": "2026-01-07 15:00:00"
    },
    {
      "idContenido": 19,
      "usuarioId": 11,
      "tipo": "publicacion",
      "cuerpo": "Modelo del primer parcial: planes de muestreo, cartas de control y un caso de análisis sensorial.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-09 16:00:00"
    },
    {
      "idContenido": 20,
      "usuarioId": 12,
      "tipo": "publicacion",
      "cuerpo": "Se trabaja con material inerte y simulaciones. La parte teórica de trayectorias es la que más cuesta, conviene repasar física de tiro oblicuo.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-11 17:00:00"
    },
    {
      "idContenido": 21,
      "usuarioId": 12,
      "tipo": "publicacion",
      "cuerpo": "Resumen de los pasos formales de resguardo de indicios, con el detalle de la documentación asociada a cada etapa.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-13 18:00:00"
    },
    {
      "idContenido": 22,
      "usuarioId": 13,
      "tipo": "publicacion",
      "cuerpo": "Cuando el umbral óseo esta normal y el aéreo descendido, es conductiva, no? Quiero confirmar antes del parcial.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-15 19:00:00"
    },
    {
      "idContenido": 23,
      "usuarioId": 14,
      "tipo": "publicacion",
      "cuerpo": "En la práctica de la cátedra se trabaja principalmente con entrevista, hora de juego y pruebas pedagógicas. Conviene leer antes el marco teórico de cada instrumento.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-17 20:00:00"
    },
    {
      "idContenido": 24,
      "usuarioId": 4,
      "tipo": "publicacion",
      "cuerpo": "Practicar todos los días media hora, aunque sea un ejercicio chico. Y entregar los TPs aunque estén incompletos, porque la devolución es lo que más enseña.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-19 09:00:00"
    },
    {
      "idContenido": 25,
      "usuarioId": 8,
      "tipo": "publicacion",
      "cuerpo": "Entiendo la definición pero no me queda claro cómo afecta al tiempo de respuesta promedio en el ejercicio de Round Robin.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-21 10:00:00"
    },
    {
      "idContenido": 26,
      "usuarioId": 4,
      "tipo": "publicacion",
      "cuerpo": "Si abren los archivos con doble clic, el navegador usa el protocolo file y algunas cosas fallan.\n\nDesde la carpeta del proyecto:\n\npython3 -m http.server 8000\n\nY entran a localhost en el puerto 8000.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-23 11:00:00"
    },
    {
      "idContenido": 27,
      "usuarioId": 5,
      "tipo": "publicacion",
      "cuerpo": "Yo lo intenté un cuatrimestre. Es posible si las cursadas no se superponen, pero hay que ser realista con la carga de trabajos prácticos.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-25 12:00:00"
    },
    {
      "idContenido": 28,
      "usuarioId": 7,
      "tipo": "publicacion",
      "cuerpo": "El trámite se presenta en Alumnado con la justificación. Conviene hacerlo con anticipación porque tarda.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-27 13:00:00"
    },
    {
      "idContenido": 29,
      "usuarioId": 6,
      "tipo": "publicacion",
      "cuerpo": "Una hoja con las fórmulas de medidas de posición, dispersión, distribuciones y los intervalos de confianza más usados.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-29 14:00:00"
    },
    {
      "idContenido": 30,
      "usuarioId": 8,
      "tipo": "publicacion",
      "cuerpo": "La comisión de la mañana trabaja con pseudocódigo y la de la tarde arranca directo con código. El parcial es el mismo, asi que elijan por horario y no por modalidad.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-31 15:00:00"
    },
    {
      "idContenido": 31,
      "usuarioId": 9,
      "tipo": "publicacion",
      "cuerpo": "La cátedra trabaja principalmente con el manual de teoría general y con selección de fallos. Los fallos son de acceso público.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-02 16:00:00"
    },
    {
      "idContenido": 32,
      "usuarioId": 11,
      "tipo": "publicacion",
      "cuerpo": "Es una redox en medio ácido. Me quedan mal los electrones y no encuentro el error.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-04 17:00:00"
    },
    {
      "idContenido": 33,
      "usuarioId": 10,
      "tipo": "publicacion",
      "cuerpo": "Que Química es filtro y que conviene no dejarla para el final del cuatrimestre. Y que el grupo de estudio hace mucha diferencia.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-06 18:00:00"
    },
    {
      "idContenido": 34,
      "usuarioId": 13,
      "tipo": "publicacion",
      "cuerpo": "Esquema con las tres partes del aparato fonador y su función, más un cuadro de los pares craneales implicados.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-08 19:00:00"
    },
    {
      "idContenido": 35,
      "usuarioId": 14,
      "tipo": "publicacion",
      "cuerpo": "Es teórica pero con muchos ejemplos de aula. Tomar nota de los ejemplos sirve más que subrayar el apunte.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-10 20:00:00"
    },
    {
      "idContenido": 36,
      "usuarioId": 12,
      "tipo": "publicacion",
      "cuerpo": "Los tres terminos aparecen en el apunte pero se usan casi como sinónimos y en el parcial los distinguen.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-12 09:00:00"
    },
    {
      "idContenido": 37,
      "usuarioId": 4,
      "tipo": "publicacion",
      "cuerpo": "Aunque la correlativa no lo exija en todos los planes, tener Análisis de Sistemas antes hace que Ingeniería de Software se entienda mucho mejor.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-14 10:00:00"
    },
    {
      "idContenido": 38,
      "usuarioId": 8,
      "tipo": "publicacion",
      "cuerpo": "Piden maquetar una página responsive con HTML semántico y CSS propio, y resolver una consigna de manipulación del DOM con JavaScript.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-16 11:00:00"
    },
    {
      "idContenido": 39,
      "usuarioId": 7,
      "tipo": "publicacion",
      "cuerpo": "Además de la bibliografía obligatoria, la cátedra sugiere textos de ampliación que ayudan mucho para el final.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-18 12:00:00"
    },
    {
      "idContenido": 40,
      "usuarioId": 6,
      "tipo": "publicacion",
      "cuerpo": "Es donde se junta todo lo contable con la toma de decisiones. Si la entendés bien, Auditoría se hace mucho más simple.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-20 13:00:00"
    },
    {
      "idContenido": 41,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Sumo un detalle: el criterio cambia si el caso es el excepcional.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-06 11:00:00"
    },
    {
      "idContenido": 42,
      "usuarioId": 2,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-06 12:00:00"
    },
    {
      "idContenido": 43,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Gracias por compartir, debería estar fijado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-08 11:00:00"
    },
    {
      "idContenido": 44,
      "usuarioId": 11,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-08 12:00:00"
    },
    {
      "idContenido": 45,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-08 13:00:00"
    },
    {
      "idContenido": 46,
      "usuarioId": 11,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-08 14:00:00"
    },
    {
      "idContenido": 47,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-09 14:00:00"
    },
    {
      "idContenido": 48,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-10 11:00:00"
    },
    {
      "idContenido": 49,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-11 14:00:00"
    },
    {
      "idContenido": 50,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-12 11:00:00"
    },
    {
      "idContenido": 51,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Gracias por compartir, debería estar fijado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-12 12:00:00"
    },
    {
      "idContenido": 52,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-12 13:00:00"
    },
    {
      "idContenido": 53,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-13 14:00:00"
    },
    {
      "idContenido": 54,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-14 11:00:00"
    },
    {
      "idContenido": 55,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Sumo un detalle: el criterio cambia si el caso es el excepcional.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-16 11:00:00"
    },
    {
      "idContenido": 56,
      "usuarioId": 3,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-16 12:00:00"
    },
    {
      "idContenido": 57,
      "usuarioId": 5,
      "tipo": "comentario",
      "cuerpo": "Gracias por compartir, debería estar fijado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-16 13:00:00"
    },
    {
      "idContenido": 58,
      "usuarioId": 5,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-17 14:00:00"
    },
    {
      "idContenido": 59,
      "usuarioId": 3,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-18 11:00:00"
    },
    {
      "idContenido": 60,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "A mí me tomaron algo muy parecido en el recuperatorio.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-18 12:00:00"
    },
    {
      "idContenido": 61,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Sumo un detalle: el criterio cambia si el caso es el excepcional.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-18 13:00:00"
    },
    {
      "idContenido": 62,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-18 14:00:00"
    },
    {
      "idContenido": 63,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-20 11:00:00"
    },
    {
      "idContenido": 64,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-20 12:00:00"
    },
    {
      "idContenido": 65,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-21 14:00:00"
    },
    {
      "idContenido": 66,
      "usuarioId": 5,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-22 11:00:00"
    },
    {
      "idContenido": 67,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-22 12:00:00"
    },
    {
      "idContenido": 68,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "Si necesitan más ejemplos, la guía de trabajos prácticos tiene tres resueltos.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-22 13:00:00"
    },
    {
      "idContenido": 69,
      "usuarioId": 4,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-22 14:00:00"
    },
    {
      "idContenido": 70,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Sumo un detalle: el criterio cambia si el caso es el excepcional.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-24 11:00:00"
    },
    {
      "idContenido": 71,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "En la teórica lo explicaron distinto, pero el resultado es el mismo.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-24 12:00:00"
    },
    {
      "idContenido": 72,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-24 13:00:00"
    },
    {
      "idContenido": 73,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-25 14:00:00"
    },
    {
      "idContenido": 74,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-26 11:00:00"
    },
    {
      "idContenido": 75,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-26 12:00:00"
    },
    {
      "idContenido": 76,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-27 14:00:00"
    },
    {
      "idContenido": 77,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "Gracias por compartir, debería estar fijado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-28 11:00:00"
    },
    {
      "idContenido": 78,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-28 12:00:00"
    },
    {
      "idContenido": 79,
      "usuarioId": 11,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-30 11:00:00"
    },
    {
      "idContenido": 80,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-30 12:00:00"
    },
    {
      "idContenido": 81,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "En la teórica lo explicaron distinto, pero el resultado es el mismo.",
      "estado": "publicado",
      "fechaCreacion": "2025-12-31 14:00:00"
    },
    {
      "idContenido": 82,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-01 11:00:00"
    },
    {
      "idContenido": 83,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-02 14:00:00"
    },
    {
      "idContenido": 84,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-03 11:00:00"
    },
    {
      "idContenido": 85,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "A mí me tomaron algo muy parecido en el recuperatorio.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-03 12:00:00"
    },
    {
      "idContenido": 86,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-03 13:00:00"
    },
    {
      "idContenido": 87,
      "usuarioId": 11,
      "tipo": "comentario",
      "cuerpo": "A mí me tomaron algo muy parecido en el recuperatorio.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-04 14:00:00"
    },
    {
      "idContenido": 88,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-05 11:00:00"
    },
    {
      "idContenido": 89,
      "usuarioId": 3,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-05 12:00:00"
    },
    {
      "idContenido": 90,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-05 13:00:00"
    },
    {
      "idContenido": 91,
      "usuarioId": 3,
      "tipo": "comentario",
      "cuerpo": "Gracias por compartir, debería estar fijado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-06 14:00:00"
    },
    {
      "idContenido": 92,
      "usuarioId": 5,
      "tipo": "comentario",
      "cuerpo": "En la teórica lo explicaron distinto, pero el resultado es el mismo.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-07 11:00:00"
    },
    {
      "idContenido": 93,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-07 12:00:00"
    },
    {
      "idContenido": 94,
      "usuarioId": 2,
      "tipo": "comentario",
      "cuerpo": "En la teórica lo explicaron distinto, pero el resultado es el mismo.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-08 14:00:00"
    },
    {
      "idContenido": 95,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-09 11:00:00"
    },
    {
      "idContenido": 96,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-09 12:00:00"
    },
    {
      "idContenido": 97,
      "usuarioId": 7,
      "tipo": "comentario",
      "cuerpo": "En la teórica lo explicaron distinto, pero el resultado es el mismo.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-09 13:00:00"
    },
    {
      "idContenido": 98,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Si necesitan más ejemplos, la guía de trabajos prácticos tiene tres resueltos.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-11 11:00:00"
    },
    {
      "idContenido": 99,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-12 14:00:00"
    },
    {
      "idContenido": 100,
      "usuarioId": 8,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-13 11:00:00"
    },
    {
      "idContenido": 101,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "En la teórica lo explicaron distinto, pero el resultado es el mismo.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-14 14:00:00"
    },
    {
      "idContenido": 102,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-15 11:00:00"
    },
    {
      "idContenido": 103,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "A mí me tomaron algo muy parecido en el recuperatorio.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-15 12:00:00"
    },
    {
      "idContenido": 104,
      "usuarioId": 5,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-15 13:00:00"
    },
    {
      "idContenido": 105,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-16 14:00:00"
    },
    {
      "idContenido": 106,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Sumo un detalle: el criterio cambia si el caso es el excepcional.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-17 11:00:00"
    },
    {
      "idContenido": 107,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "Gracias por compartir, debería estar fijado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-17 12:00:00"
    },
    {
      "idContenido": 108,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-17 13:00:00"
    },
    {
      "idContenido": 109,
      "usuarioId": 8,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-18 14:00:00"
    },
    {
      "idContenido": 110,
      "usuarioId": 7,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-19 11:00:00"
    },
    {
      "idContenido": 111,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-19 12:00:00"
    },
    {
      "idContenido": 112,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-20 14:00:00"
    },
    {
      "idContenido": 113,
      "usuarioId": 7,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-21 11:00:00"
    },
    {
      "idContenido": 114,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-21 12:00:00"
    },
    {
      "idContenido": 115,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-21 13:00:00"
    },
    {
      "idContenido": 116,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-21 14:00:00"
    },
    {
      "idContenido": 117,
      "usuarioId": 4,
      "tipo": "comentario",
      "cuerpo": "Si necesitan más ejemplos, la guía de trabajos prácticos tiene tres resueltos.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-23 11:00:00"
    },
    {
      "idContenido": 118,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "A mí me tomaron algo muy parecido en el recuperatorio.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-23 12:00:00"
    },
    {
      "idContenido": 119,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-24 14:00:00"
    },
    {
      "idContenido": 120,
      "usuarioId": 8,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-25 11:00:00"
    },
    {
      "idContenido": 121,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-25 12:00:00"
    },
    {
      "idContenido": 122,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-26 14:00:00"
    },
    {
      "idContenido": 123,
      "usuarioId": 3,
      "tipo": "comentario",
      "cuerpo": "Si necesitan más ejemplos, la guía de trabajos prácticos tiene tres resueltos.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-27 11:00:00"
    },
    {
      "idContenido": 124,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-27 12:00:00"
    },
    {
      "idContenido": 125,
      "usuarioId": 2,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-27 13:00:00"
    },
    {
      "idContenido": 126,
      "usuarioId": 7,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-27 14:00:00"
    },
    {
      "idContenido": 127,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-28 14:00:00"
    },
    {
      "idContenido": 128,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-29 11:00:00"
    },
    {
      "idContenido": 129,
      "usuarioId": 2,
      "tipo": "comentario",
      "cuerpo": "Si necesitan más ejemplos, la guía de trabajos prácticos tiene tres resueltos.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-29 12:00:00"
    },
    {
      "idContenido": 130,
      "usuarioId": 4,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-29 13:00:00"
    },
    {
      "idContenido": 131,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-29 14:00:00"
    },
    {
      "idContenido": 132,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Sumo un detalle: el criterio cambia si el caso es el excepcional.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-30 14:00:00"
    },
    {
      "idContenido": 133,
      "usuarioId": 4,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-01-31 11:00:00"
    },
    {
      "idContenido": 134,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-01 14:00:00"
    },
    {
      "idContenido": 135,
      "usuarioId": 11,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-02 11:00:00"
    },
    {
      "idContenido": 136,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-02 12:00:00"
    },
    {
      "idContenido": 137,
      "usuarioId": 6,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-02 13:00:00"
    },
    {
      "idContenido": 138,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-02 14:00:00"
    },
    {
      "idContenido": 139,
      "usuarioId": 5,
      "tipo": "comentario",
      "cuerpo": "A mí me tomaron algo muy parecido en el recuperatorio.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-04 11:00:00"
    },
    {
      "idContenido": 140,
      "usuarioId": 3,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-05 14:00:00"
    },
    {
      "idContenido": 141,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "A mí me tomaron algo muy parecido en el recuperatorio.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-06 11:00:00"
    },
    {
      "idContenido": 142,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-06 12:00:00"
    },
    {
      "idContenido": 143,
      "usuarioId": 7,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-06 13:00:00"
    },
    {
      "idContenido": 144,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Gracias por compartir, debería estar fijado.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-06 14:00:00"
    },
    {
      "idContenido": 145,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Sumo un detalle: el criterio cambia si el caso es el excepcional.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-07 14:00:00"
    },
    {
      "idContenido": 146,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-08 11:00:00"
    },
    {
      "idContenido": 147,
      "usuarioId": 3,
      "tipo": "comentario",
      "cuerpo": "Sumo un detalle: el criterio cambia si el caso es el excepcional.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-08 12:00:00"
    },
    {
      "idContenido": 148,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-08 13:00:00"
    },
    {
      "idContenido": 149,
      "usuarioId": 12,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-08 14:00:00"
    },
    {
      "idContenido": 150,
      "usuarioId": 4,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-09 14:00:00"
    },
    {
      "idContenido": 151,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-10 11:00:00"
    },
    {
      "idContenido": 152,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-10 12:00:00"
    },
    {
      "idContenido": 153,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-11 14:00:00"
    },
    {
      "idContenido": 154,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-12 11:00:00"
    },
    {
      "idContenido": 155,
      "usuarioId": 4,
      "tipo": "comentario",
      "cuerpo": "Sumo un detalle: el criterio cambia si el caso es el excepcional.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-12 12:00:00"
    },
    {
      "idContenido": 156,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "En la teórica lo explicaron distinto, pero el resultado es el mismo.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-14 11:00:00"
    },
    {
      "idContenido": 157,
      "usuarioId": 5,
      "tipo": "comentario",
      "cuerpo": "En la teórica lo explicaron distinto, pero el resultado es el mismo.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-14 12:00:00"
    },
    {
      "idContenido": 158,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Si necesitan más ejemplos, la guía de trabajos prácticos tiene tres resueltos.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-15 14:00:00"
    },
    {
      "idContenido": 159,
      "usuarioId": 5,
      "tipo": "comentario",
      "cuerpo": "Perfecto, con esto me destrabó el ejercicio. Gracias.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-16 11:00:00"
    },
    {
      "idContenido": 160,
      "usuarioId": 9,
      "tipo": "comentario",
      "cuerpo": "A mí me tomaron algo muy parecido en el recuperatorio.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-16 12:00:00"
    },
    {
      "idContenido": 161,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-16 13:00:00"
    },
    {
      "idContenido": 162,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-16 14:00:00"
    },
    {
      "idContenido": 163,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-17 14:00:00"
    },
    {
      "idContenido": 164,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Si necesitan más ejemplos, la guía de trabajos prácticos tiene tres resueltos.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-18 11:00:00"
    },
    {
      "idContenido": 165,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Ojo que este año cambió la modalidad de evaluación, conviene confirmarlo con la cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-18 12:00:00"
    },
    {
      "idContenido": 166,
      "usuarioId": 13,
      "tipo": "comentario",
      "cuerpo": "Buenísimo el aporte, justo lo estaba buscando.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-20 11:00:00"
    },
    {
      "idContenido": 167,
      "usuarioId": 14,
      "tipo": "comentario",
      "cuerpo": "Exacto, esa es la interpretación correcta según el apunte de cátedra.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-20 12:00:00"
    },
    {
      "idContenido": 168,
      "usuarioId": 1,
      "tipo": "comentario",
      "cuerpo": "Yo lo resolví armando primero el esquema y después las consultas. Me resultó más ordenado.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-22 11:00:00"
    },
    {
      "idContenido": 169,
      "usuarioId": 10,
      "tipo": "comentario",
      "cuerpo": "Coincido, a mí me pasó lo mismo el cuatrimestre pasado.",
      "estado": "publicado",
      "fechaCreacion": "2026-02-23 14:00:00"
    }
  ],
  "publicaciones": [
    {
      "idContenido": 1,
      "carreraId": 3,
      "materiaId": 9,
      "titulo": "Diferencia práctica entre paradigma funcional y lógico",
      "categoria": "pregunta",
      "fijada": true,
      "visitas": 410,
      "fechaActualizacion": "2025-12-04 10:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 2,
      "carreraId": 10,
      "materiaId": 9,
      "titulo": "Apunte propio: unificación y backtracking en Prolog",
      "categoria": "apunte",
      "fijada": true,
      "visitas": 372,
      "fechaActualizacion": "2025-12-06 11:00:00",
      "archivoNombre": "apunte-unificacion-backtracking.pdf",
      "archivoUrl": "assets/archivos/adjuntos/apunte-unificacion-backtracking.pdf",
      "archivoTipo": "pdf",
      "archivoTamanoKb": 1840
    },
    {
      "idContenido": 3,
      "carreraId": 3,
      "materiaId": 6,
      "titulo": "Modelo de parcial de Bases de Datos 2025",
      "categoria": "parcial",
      "fijada": false,
      "visitas": 247,
      "fechaActualizacion": "2025-12-08 12:00:00",
      "archivoNombre": "modelo-parcial-bd-2025.pdf",
      "archivoUrl": "assets/archivos/adjuntos/modelo-parcial-bd-2025.pdf",
      "archivoTipo": "pdf",
      "archivoTamanoKb": 620
    },
    {
      "idContenido": 4,
      "carreraId": 10,
      "materiaId": 6,
      "titulo": "Cómo es la cátedra de Bases de Datos",
      "categoria": "profesor",
      "fijada": false,
      "visitas": 316,
      "fechaActualizacion": "2025-12-10 13:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 5,
      "carreraId": 3,
      "materiaId": 6,
      "titulo": "Conviene cursar Bases de Datos junto con Sistemas Operativos?",
      "categoria": "recomendacion",
      "fijada": false,
      "visitas": 504,
      "fechaActualizacion": "2025-12-12 14:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 6,
      "carreraId": 10,
      "materiaId": 12,
      "titulo": "Recursos gratuitos para practicar Desarrollo Web",
      "categoria": "material",
      "fijada": false,
      "visitas": 719,
      "fechaActualizacion": "2025-12-14 15:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 7,
      "carreraId": 1,
      "materiaId": 28,
      "titulo": "Mi experiencia cursando Tipografía",
      "categoria": "experiencia",
      "fijada": false,
      "visitas": 821,
      "fechaActualizacion": "2025-12-16 16:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 8,
      "carreraId": 1,
      "materiaId": 27,
      "titulo": "Apuntes de composición visual - Taller de Diseño I",
      "categoria": "apunte",
      "fijada": false,
      "visitas": 623,
      "fechaActualizacion": "2025-12-18 17:00:00",
      "archivoNombre": "composicion-visual-taller1.pdf",
      "archivoUrl": "assets/archivos/adjuntos/composicion-visual-taller1.pdf",
      "archivoTipo": "pdf",
      "archivoTamanoKb": 2410
    },
    {
      "idContenido": 9,
      "carreraId": 2,
      "materiaId": 18,
      "titulo": "Duda con el cálculo del crédito fiscal en IVA",
      "categoria": "pregunta",
      "fijada": false,
      "visitas": 677,
      "fechaActualizacion": "2025-12-20 18:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 10,
      "carreraId": 2,
      "materiaId": 15,
      "titulo": "Final de Contabilidad Básica - tema 2",
      "categoria": "parcial",
      "fijada": false,
      "visitas": 866,
      "fechaActualizacion": "2025-12-22 19:00:00",
      "archivoNombre": "final-contabilidad-basica-tema2.pdf",
      "archivoUrl": "assets/archivos/adjuntos/final-contabilidad-basica-tema2.pdf",
      "archivoTipo": "pdf",
      "archivoTamanoKb": 480
    },
    {
      "idContenido": 11,
      "carreraId": 2,
      "materiaId": 19,
      "titulo": "Orden recomendado para llegar a Auditoría",
      "categoria": "recomendacion",
      "fijada": false,
      "visitas": 261,
      "fechaActualizacion": "2025-12-24 20:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 12,
      "carreraId": 6,
      "materiaId": 26,
      "titulo": "Cuadro comparativo de clasificaciones en Psicopatología",
      "categoria": "apunte",
      "fijada": false,
      "visitas": 64,
      "fechaActualizacion": "2025-12-26 09:00:00",
      "archivoNombre": "cuadro-clasificaciones-psicopatologia.pdf",
      "archivoUrl": "assets/archivos/adjuntos/cuadro-clasificaciones-psicopatologia.pdf",
      "archivoTipo": "pdf",
      "archivoTamanoKb": 760
    },
    {
      "idContenido": 13,
      "carreraId": 6,
      "materiaId": 25,
      "titulo": "Cómo me organicé para Psicología del Desarrollo",
      "categoria": "experiencia",
      "fijada": false,
      "visitas": 826,
      "fechaActualizacion": "2025-12-28 10:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 14,
      "carreraId": 4,
      "materiaId": 22,
      "titulo": "Diferencia entre control de constitucionalidad difuso y concentrado",
      "categoria": "pregunta",
      "fijada": false,
      "visitas": 862,
      "fechaActualizacion": "2025-12-30 11:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 15,
      "carreraId": 4,
      "materiaId": 23,
      "titulo": "Cátedra de Derecho Penal I - modalidad de evaluación",
      "categoria": "profesor",
      "fijada": false,
      "visitas": 540,
      "fechaActualizacion": "2026-01-01 12:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 16,
      "carreraId": 9,
      "materiaId": 36,
      "titulo": "Normativa alimentaria para consultar en Bromatología",
      "categoria": "material",
      "fijada": false,
      "visitas": 313,
      "fechaActualizacion": "2026-01-03 13:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 17,
      "carreraId": 9,
      "materiaId": 37,
      "titulo": "Cómo se calcula el requerimiento energético en el caso 3?",
      "categoria": "pregunta",
      "fijada": false,
      "visitas": 430,
      "fechaActualizacion": "2026-01-05 14:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 18,
      "carreraId": 12,
      "materiaId": 39,
      "titulo": "Resumen de transferencia de calor - Operaciones Unitarias",
      "categoria": "apunte",
      "fijada": false,
      "visitas": 416,
      "fechaActualizacion": "2026-01-07 15:00:00",
      "archivoNombre": "resumen-transferencia-calor.pdf",
      "archivoUrl": "assets/archivos/adjuntos/resumen-transferencia-calor.pdf",
      "archivoTipo": "pdf",
      "archivoTamanoKb": 1520
    },
    {
      "idContenido": 19,
      "carreraId": 12,
      "materiaId": 40,
      "titulo": "Parcial de Control de Calidad de Alimentos",
      "categoria": "parcial",
      "fijada": false,
      "visitas": 615,
      "fechaActualizacion": "2026-01-09 16:00:00",
      "archivoNombre": "parcial-control-calidad.pdf",
      "archivoUrl": "assets/archivos/adjuntos/parcial-control-calidad.pdf",
      "archivoTipo": "pdf",
      "archivoTamanoKb": 910
    },
    {
      "idContenido": 20,
      "carreraId": 5,
      "materiaId": 31,
      "titulo": "Prácticas de Balística Forense: qué esperar",
      "categoria": "experiencia",
      "fijada": false,
      "visitas": 155,
      "fechaActualizacion": "2026-01-11 17:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 21,
      "carreraId": 5,
      "materiaId": 30,
      "titulo": "Apunte de cadena de custodia",
      "categoria": "apunte",
      "fijada": false,
      "visitas": 627,
      "fechaActualizacion": "2026-01-13 18:00:00",
      "archivoNombre": "cadena-de-custodia.pdf",
      "archivoUrl": "assets/archivos/adjuntos/cadena-de-custodia.pdf",
      "archivoTipo": "pdf",
      "archivoTamanoKb": 540
    },
    {
      "idContenido": 22,
      "carreraId": 7,
      "materiaId": 33,
      "titulo": "Interpretación de audiometrías: umbral aéreo vs óseo",
      "categoria": "pregunta",
      "fijada": false,
      "visitas": 580,
      "fechaActualizacion": "2026-01-15 19:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 23,
      "carreraId": 8,
      "materiaId": 35,
      "titulo": "Instrumentos que más se usan en Diagnóstico Psicopedagógico",
      "categoria": "recomendacion",
      "fijada": false,
      "visitas": 123,
      "fechaActualizacion": "2026-01-17 20:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 24,
      "carreraId": 3,
      "materiaId": 1,
      "titulo": "Cómo aprobé Algoritmos en el primer intento",
      "categoria": "experiencia",
      "fijada": false,
      "visitas": 812,
      "fechaActualizacion": "2026-01-19 09:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 25,
      "carreraId": 3,
      "materiaId": 7,
      "titulo": "Diferencia entre planificación apropiativa y no apropiativa",
      "categoria": "pregunta",
      "fijada": false,
      "visitas": 632,
      "fechaActualizacion": "2026-01-21 10:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 26,
      "carreraId": 3,
      "materiaId": null,
      "titulo": "Cómo usar el servidor http de Python para probar el TP",
      "categoria": "material",
      "fijada": false,
      "visitas": 257,
      "fechaActualizacion": "2026-01-23 11:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 27,
      "carreraId": 1,
      "materiaId": null,
      "titulo": "¿Se puede cursar dos carreras a la vez?",
      "categoria": "experiencia",
      "fijada": false,
      "visitas": 877,
      "fechaActualizacion": "2026-01-25 12:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 28,
      "carreraId": 6,
      "materiaId": null,
      "titulo": "Cómo pedir una mesa especial de final",
      "categoria": "profesor",
      "fijada": false,
      "visitas": 614,
      "fechaActualizacion": "2026-01-27 13:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 29,
      "carreraId": 2,
      "materiaId": 43,
      "titulo": "Formulario de Estadística para el parcial",
      "categoria": "apunte",
      "fijada": false,
      "visitas": 733,
      "fechaActualizacion": "2026-01-29 14:00:00",
      "archivoNombre": "formulario-estadistica.pdf",
      "archivoUrl": "assets/archivos/adjuntos/formulario-estadistica.pdf",
      "archivoTipo": "pdf",
      "archivoTamanoKb": 320
    },
    {
      "idContenido": 30,
      "carreraId": 10,
      "materiaId": 1,
      "titulo": "Cátedra de Algoritmos: dos modalidades distintas",
      "categoria": "profesor",
      "fijada": false,
      "visitas": 145,
      "fechaActualizacion": "2026-01-31 15:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 31,
      "carreraId": 4,
      "materiaId": 21,
      "titulo": "Bibliografía básica de Introducción al Derecho",
      "categoria": "material",
      "fijada": false,
      "visitas": 667,
      "fechaActualizacion": "2026-02-02 16:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 32,
      "carreraId": 12,
      "materiaId": 38,
      "titulo": "Cómo balancear la ecuación del ejercicio 12 de Química General",
      "categoria": "pregunta",
      "fijada": false,
      "visitas": 476,
      "fechaActualizacion": "2026-02-04 17:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 33,
      "carreraId": 9,
      "materiaId": null,
      "titulo": "Primer año de Nutrición: lo que me hubiera gustado saber",
      "categoria": "experiencia",
      "fijada": false,
      "visitas": 846,
      "fechaActualizacion": "2026-02-06 18:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 34,
      "carreraId": 7,
      "materiaId": 32,
      "titulo": "Esquema de la anatomía del aparato fonador",
      "categoria": "apunte",
      "fijada": false,
      "visitas": 417,
      "fechaActualizacion": "2026-02-08 19:00:00",
      "archivoNombre": "esquema-aparato-fonador.png",
      "archivoUrl": "assets/archivos/adjuntos/esquema-aparato-fonador.png",
      "archivoTipo": "png",
      "archivoTamanoKb": 880
    },
    {
      "idContenido": 35,
      "carreraId": 8,
      "materiaId": 34,
      "titulo": "Aprendizaje y Cognición: consejos de cursada",
      "categoria": "experiencia",
      "fijada": false,
      "visitas": 285,
      "fechaActualizacion": "2026-02-10 20:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 36,
      "carreraId": 5,
      "materiaId": 30,
      "titulo": "Qué diferencia hay entre indicio, evidencia y prueba?",
      "categoria": "pregunta",
      "fijada": false,
      "visitas": 738,
      "fechaActualizacion": "2026-02-12 09:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 37,
      "carreraId": 3,
      "materiaId": 11,
      "titulo": "Ingeniería de Software conviene cursarla después de Análisis",
      "categoria": "recomendacion",
      "fijada": false,
      "visitas": 291,
      "fechaActualizacion": "2026-02-14 10:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 38,
      "carreraId": 10,
      "materiaId": 12,
      "titulo": "Parcial práctico de Desarrollo Web",
      "categoria": "parcial",
      "fijada": false,
      "visitas": 336,
      "fechaActualizacion": "2026-02-16 11:00:00",
      "archivoNombre": "consigna-parcial-desarrollo-web.pdf",
      "archivoUrl": "assets/archivos/adjuntos/consigna-parcial-desarrollo-web.pdf",
      "archivoTipo": "pdf",
      "archivoTamanoKb": 410
    },
    {
      "idContenido": 39,
      "carreraId": 6,
      "materiaId": 24,
      "titulo": "Lecturas complementarias de Psicología General",
      "categoria": "material",
      "fijada": false,
      "visitas": 763,
      "fechaActualizacion": "2026-02-18 12:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    },
    {
      "idContenido": 40,
      "carreraId": 2,
      "materiaId": 20,
      "titulo": "Costos y Gestión: la materia bisagra de la carrera",
      "categoria": "experiencia",
      "fijada": false,
      "visitas": 784,
      "fechaActualizacion": "2026-02-20 13:00:00",
      "archivoNombre": null,
      "archivoUrl": null,
      "archivoTipo": null,
      "archivoTamanoKb": null
    }
  ],
  "comentarios": [
    {
      "idContenido": 41,
      "publicacionId": 1,
      "comentarioPadreId": null
    },
    {
      "idContenido": 42,
      "publicacionId": 1,
      "comentarioPadreId": null
    },
    {
      "idContenido": 43,
      "publicacionId": 2,
      "comentarioPadreId": null
    },
    {
      "idContenido": 44,
      "publicacionId": 2,
      "comentarioPadreId": null
    },
    {
      "idContenido": 45,
      "publicacionId": 2,
      "comentarioPadreId": null
    },
    {
      "idContenido": 46,
      "publicacionId": 2,
      "comentarioPadreId": null
    },
    {
      "idContenido": 47,
      "publicacionId": 2,
      "comentarioPadreId": 43
    },
    {
      "idContenido": 48,
      "publicacionId": 3,
      "comentarioPadreId": null
    },
    {
      "idContenido": 49,
      "publicacionId": 3,
      "comentarioPadreId": 48
    },
    {
      "idContenido": 50,
      "publicacionId": 4,
      "comentarioPadreId": null
    },
    {
      "idContenido": 51,
      "publicacionId": 4,
      "comentarioPadreId": null
    },
    {
      "idContenido": 52,
      "publicacionId": 4,
      "comentarioPadreId": null
    },
    {
      "idContenido": 53,
      "publicacionId": 4,
      "comentarioPadreId": 52
    },
    {
      "idContenido": 54,
      "publicacionId": 5,
      "comentarioPadreId": null
    },
    {
      "idContenido": 55,
      "publicacionId": 6,
      "comentarioPadreId": null
    },
    {
      "idContenido": 56,
      "publicacionId": 6,
      "comentarioPadreId": null
    },
    {
      "idContenido": 57,
      "publicacionId": 6,
      "comentarioPadreId": null
    },
    {
      "idContenido": 58,
      "publicacionId": 6,
      "comentarioPadreId": 55
    },
    {
      "idContenido": 59,
      "publicacionId": 7,
      "comentarioPadreId": null
    },
    {
      "idContenido": 60,
      "publicacionId": 7,
      "comentarioPadreId": null
    },
    {
      "idContenido": 61,
      "publicacionId": 7,
      "comentarioPadreId": null
    },
    {
      "idContenido": 62,
      "publicacionId": 7,
      "comentarioPadreId": null
    },
    {
      "idContenido": 63,
      "publicacionId": 8,
      "comentarioPadreId": null
    },
    {
      "idContenido": 64,
      "publicacionId": 8,
      "comentarioPadreId": null
    },
    {
      "idContenido": 65,
      "publicacionId": 8,
      "comentarioPadreId": 63
    },
    {
      "idContenido": 66,
      "publicacionId": 9,
      "comentarioPadreId": null
    },
    {
      "idContenido": 67,
      "publicacionId": 9,
      "comentarioPadreId": null
    },
    {
      "idContenido": 68,
      "publicacionId": 9,
      "comentarioPadreId": null
    },
    {
      "idContenido": 69,
      "publicacionId": 9,
      "comentarioPadreId": null
    },
    {
      "idContenido": 70,
      "publicacionId": 10,
      "comentarioPadreId": null
    },
    {
      "idContenido": 71,
      "publicacionId": 10,
      "comentarioPadreId": null
    },
    {
      "idContenido": 72,
      "publicacionId": 10,
      "comentarioPadreId": null
    },
    {
      "idContenido": 73,
      "publicacionId": 10,
      "comentarioPadreId": 70
    },
    {
      "idContenido": 74,
      "publicacionId": 11,
      "comentarioPadreId": null
    },
    {
      "idContenido": 75,
      "publicacionId": 11,
      "comentarioPadreId": null
    },
    {
      "idContenido": 76,
      "publicacionId": 11,
      "comentarioPadreId": 75
    },
    {
      "idContenido": 77,
      "publicacionId": 12,
      "comentarioPadreId": null
    },
    {
      "idContenido": 78,
      "publicacionId": 12,
      "comentarioPadreId": null
    },
    {
      "idContenido": 79,
      "publicacionId": 13,
      "comentarioPadreId": null
    },
    {
      "idContenido": 80,
      "publicacionId": 13,
      "comentarioPadreId": null
    },
    {
      "idContenido": 81,
      "publicacionId": 13,
      "comentarioPadreId": 79
    },
    {
      "idContenido": 82,
      "publicacionId": 14,
      "comentarioPadreId": null
    },
    {
      "idContenido": 83,
      "publicacionId": 14,
      "comentarioPadreId": 82
    },
    {
      "idContenido": 84,
      "publicacionId": 15,
      "comentarioPadreId": null
    },
    {
      "idContenido": 85,
      "publicacionId": 15,
      "comentarioPadreId": null
    },
    {
      "idContenido": 86,
      "publicacionId": 15,
      "comentarioPadreId": null
    },
    {
      "idContenido": 87,
      "publicacionId": 15,
      "comentarioPadreId": 85
    },
    {
      "idContenido": 88,
      "publicacionId": 16,
      "comentarioPadreId": null
    },
    {
      "idContenido": 89,
      "publicacionId": 16,
      "comentarioPadreId": null
    },
    {
      "idContenido": 90,
      "publicacionId": 16,
      "comentarioPadreId": null
    },
    {
      "idContenido": 91,
      "publicacionId": 16,
      "comentarioPadreId": 89
    },
    {
      "idContenido": 92,
      "publicacionId": 17,
      "comentarioPadreId": null
    },
    {
      "idContenido": 93,
      "publicacionId": 17,
      "comentarioPadreId": null
    },
    {
      "idContenido": 94,
      "publicacionId": 17,
      "comentarioPadreId": 92
    },
    {
      "idContenido": 95,
      "publicacionId": 18,
      "comentarioPadreId": null
    },
    {
      "idContenido": 96,
      "publicacionId": 18,
      "comentarioPadreId": null
    },
    {
      "idContenido": 97,
      "publicacionId": 18,
      "comentarioPadreId": null
    },
    {
      "idContenido": 98,
      "publicacionId": 19,
      "comentarioPadreId": null
    },
    {
      "idContenido": 99,
      "publicacionId": 19,
      "comentarioPadreId": 98
    },
    {
      "idContenido": 100,
      "publicacionId": 20,
      "comentarioPadreId": null
    },
    {
      "idContenido": 101,
      "publicacionId": 20,
      "comentarioPadreId": 100
    },
    {
      "idContenido": 102,
      "publicacionId": 21,
      "comentarioPadreId": null
    },
    {
      "idContenido": 103,
      "publicacionId": 21,
      "comentarioPadreId": null
    },
    {
      "idContenido": 104,
      "publicacionId": 21,
      "comentarioPadreId": null
    },
    {
      "idContenido": 105,
      "publicacionId": 21,
      "comentarioPadreId": 102
    },
    {
      "idContenido": 106,
      "publicacionId": 22,
      "comentarioPadreId": null
    },
    {
      "idContenido": 107,
      "publicacionId": 22,
      "comentarioPadreId": null
    },
    {
      "idContenido": 108,
      "publicacionId": 22,
      "comentarioPadreId": null
    },
    {
      "idContenido": 109,
      "publicacionId": 22,
      "comentarioPadreId": 108
    },
    {
      "idContenido": 110,
      "publicacionId": 23,
      "comentarioPadreId": null
    },
    {
      "idContenido": 111,
      "publicacionId": 23,
      "comentarioPadreId": null
    },
    {
      "idContenido": 112,
      "publicacionId": 23,
      "comentarioPadreId": 111
    },
    {
      "idContenido": 113,
      "publicacionId": 24,
      "comentarioPadreId": null
    },
    {
      "idContenido": 114,
      "publicacionId": 24,
      "comentarioPadreId": null
    },
    {
      "idContenido": 115,
      "publicacionId": 24,
      "comentarioPadreId": null
    },
    {
      "idContenido": 116,
      "publicacionId": 24,
      "comentarioPadreId": null
    },
    {
      "idContenido": 117,
      "publicacionId": 25,
      "comentarioPadreId": null
    },
    {
      "idContenido": 118,
      "publicacionId": 25,
      "comentarioPadreId": null
    },
    {
      "idContenido": 119,
      "publicacionId": 25,
      "comentarioPadreId": 117
    },
    {
      "idContenido": 120,
      "publicacionId": 26,
      "comentarioPadreId": null
    },
    {
      "idContenido": 121,
      "publicacionId": 26,
      "comentarioPadreId": null
    },
    {
      "idContenido": 122,
      "publicacionId": 26,
      "comentarioPadreId": 121
    },
    {
      "idContenido": 123,
      "publicacionId": 27,
      "comentarioPadreId": null
    },
    {
      "idContenido": 124,
      "publicacionId": 27,
      "comentarioPadreId": null
    },
    {
      "idContenido": 125,
      "publicacionId": 27,
      "comentarioPadreId": null
    },
    {
      "idContenido": 126,
      "publicacionId": 27,
      "comentarioPadreId": null
    },
    {
      "idContenido": 127,
      "publicacionId": 27,
      "comentarioPadreId": 125
    },
    {
      "idContenido": 128,
      "publicacionId": 28,
      "comentarioPadreId": null
    },
    {
      "idContenido": 129,
      "publicacionId": 28,
      "comentarioPadreId": null
    },
    {
      "idContenido": 130,
      "publicacionId": 28,
      "comentarioPadreId": null
    },
    {
      "idContenido": 131,
      "publicacionId": 28,
      "comentarioPadreId": null
    },
    {
      "idContenido": 132,
      "publicacionId": 28,
      "comentarioPadreId": 128
    },
    {
      "idContenido": 133,
      "publicacionId": 29,
      "comentarioPadreId": null
    },
    {
      "idContenido": 134,
      "publicacionId": 29,
      "comentarioPadreId": 133
    },
    {
      "idContenido": 135,
      "publicacionId": 30,
      "comentarioPadreId": null
    },
    {
      "idContenido": 136,
      "publicacionId": 30,
      "comentarioPadreId": null
    },
    {
      "idContenido": 137,
      "publicacionId": 30,
      "comentarioPadreId": null
    },
    {
      "idContenido": 138,
      "publicacionId": 30,
      "comentarioPadreId": null
    },
    {
      "idContenido": 139,
      "publicacionId": 31,
      "comentarioPadreId": null
    },
    {
      "idContenido": 140,
      "publicacionId": 31,
      "comentarioPadreId": 139
    },
    {
      "idContenido": 141,
      "publicacionId": 32,
      "comentarioPadreId": null
    },
    {
      "idContenido": 142,
      "publicacionId": 32,
      "comentarioPadreId": null
    },
    {
      "idContenido": 143,
      "publicacionId": 32,
      "comentarioPadreId": null
    },
    {
      "idContenido": 144,
      "publicacionId": 32,
      "comentarioPadreId": null
    },
    {
      "idContenido": 145,
      "publicacionId": 32,
      "comentarioPadreId": 142
    },
    {
      "idContenido": 146,
      "publicacionId": 33,
      "comentarioPadreId": null
    },
    {
      "idContenido": 147,
      "publicacionId": 33,
      "comentarioPadreId": null
    },
    {
      "idContenido": 148,
      "publicacionId": 33,
      "comentarioPadreId": null
    },
    {
      "idContenido": 149,
      "publicacionId": 33,
      "comentarioPadreId": null
    },
    {
      "idContenido": 150,
      "publicacionId": 33,
      "comentarioPadreId": 146
    },
    {
      "idContenido": 151,
      "publicacionId": 34,
      "comentarioPadreId": null
    },
    {
      "idContenido": 152,
      "publicacionId": 34,
      "comentarioPadreId": null
    },
    {
      "idContenido": 153,
      "publicacionId": 34,
      "comentarioPadreId": 152
    },
    {
      "idContenido": 154,
      "publicacionId": 35,
      "comentarioPadreId": null
    },
    {
      "idContenido": 155,
      "publicacionId": 35,
      "comentarioPadreId": null
    },
    {
      "idContenido": 156,
      "publicacionId": 36,
      "comentarioPadreId": null
    },
    {
      "idContenido": 157,
      "publicacionId": 36,
      "comentarioPadreId": null
    },
    {
      "idContenido": 158,
      "publicacionId": 36,
      "comentarioPadreId": 156
    },
    {
      "idContenido": 159,
      "publicacionId": 37,
      "comentarioPadreId": null
    },
    {
      "idContenido": 160,
      "publicacionId": 37,
      "comentarioPadreId": null
    },
    {
      "idContenido": 161,
      "publicacionId": 37,
      "comentarioPadreId": null
    },
    {
      "idContenido": 162,
      "publicacionId": 37,
      "comentarioPadreId": null
    },
    {
      "idContenido": 163,
      "publicacionId": 37,
      "comentarioPadreId": 160
    },
    {
      "idContenido": 164,
      "publicacionId": 38,
      "comentarioPadreId": null
    },
    {
      "idContenido": 165,
      "publicacionId": 38,
      "comentarioPadreId": null
    },
    {
      "idContenido": 166,
      "publicacionId": 39,
      "comentarioPadreId": null
    },
    {
      "idContenido": 167,
      "publicacionId": 39,
      "comentarioPadreId": null
    },
    {
      "idContenido": 168,
      "publicacionId": 40,
      "comentarioPadreId": null
    },
    {
      "idContenido": 169,
      "publicacionId": 40,
      "comentarioPadreId": 168
    }
  ],
  "votos": [
    {
      "usuarioId": 9,
      "contenidoId": 1,
      "valor": 1,
      "fechaVoto": "2025-12-14 09:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 1,
      "valor": 1,
      "fechaVoto": "2025-12-14 10:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 1,
      "valor": -1,
      "fechaVoto": "2025-12-14 11:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 2,
      "valor": -1,
      "fechaVoto": "2025-12-16 12:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 2,
      "valor": 1,
      "fechaVoto": "2025-12-16 13:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 2,
      "valor": -1,
      "fechaVoto": "2025-12-16 14:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 3,
      "valor": 1,
      "fechaVoto": "2025-12-18 15:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 3,
      "valor": 1,
      "fechaVoto": "2025-12-18 16:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 3,
      "valor": 1,
      "fechaVoto": "2025-12-18 17:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 3,
      "valor": 1,
      "fechaVoto": "2025-12-18 18:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 3,
      "valor": 1,
      "fechaVoto": "2025-12-18 19:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 3,
      "valor": 1,
      "fechaVoto": "2025-12-18 20:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 3,
      "valor": 1,
      "fechaVoto": "2025-12-18 21:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 3,
      "valor": 1,
      "fechaVoto": "2025-12-18 22:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 3,
      "valor": 1,
      "fechaVoto": "2025-12-18 23:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 3,
      "valor": 1,
      "fechaVoto": "2025-12-19 00:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 3,
      "valor": -1,
      "fechaVoto": "2025-12-19 01:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 4,
      "valor": 1,
      "fechaVoto": "2025-12-21 02:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 4,
      "valor": -1,
      "fechaVoto": "2025-12-21 03:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 4,
      "valor": -1,
      "fechaVoto": "2025-12-21 04:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 4,
      "valor": -1,
      "fechaVoto": "2025-12-20 09:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 4,
      "valor": 1,
      "fechaVoto": "2025-12-20 10:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 4,
      "valor": 1,
      "fechaVoto": "2025-12-20 11:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 4,
      "valor": 1,
      "fechaVoto": "2025-12-20 12:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 4,
      "valor": 1,
      "fechaVoto": "2025-12-20 13:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 4,
      "valor": 1,
      "fechaVoto": "2025-12-20 14:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 4,
      "valor": 1,
      "fechaVoto": "2025-12-20 15:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 5,
      "valor": 1,
      "fechaVoto": "2025-12-22 16:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 5,
      "valor": 1,
      "fechaVoto": "2025-12-22 17:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 5,
      "valor": 1,
      "fechaVoto": "2025-12-22 18:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 5,
      "valor": 1,
      "fechaVoto": "2025-12-22 19:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 5,
      "valor": 1,
      "fechaVoto": "2025-12-22 20:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 5,
      "valor": 1,
      "fechaVoto": "2025-12-22 21:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 5,
      "valor": 1,
      "fechaVoto": "2025-12-22 22:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 6,
      "valor": 1,
      "fechaVoto": "2025-12-24 23:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 6,
      "valor": -1,
      "fechaVoto": "2025-12-25 00:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 6,
      "valor": 1,
      "fechaVoto": "2025-12-25 01:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 6,
      "valor": 1,
      "fechaVoto": "2025-12-25 02:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 6,
      "valor": 1,
      "fechaVoto": "2025-12-25 03:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 6,
      "valor": 1,
      "fechaVoto": "2025-12-25 04:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 6,
      "valor": 1,
      "fechaVoto": "2025-12-24 09:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 7,
      "valor": 1,
      "fechaVoto": "2025-12-26 10:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 7,
      "valor": 1,
      "fechaVoto": "2025-12-26 11:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 7,
      "valor": 1,
      "fechaVoto": "2025-12-26 12:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 7,
      "valor": 1,
      "fechaVoto": "2025-12-26 13:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 7,
      "valor": 1,
      "fechaVoto": "2025-12-26 14:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 7,
      "valor": 1,
      "fechaVoto": "2025-12-26 15:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 7,
      "valor": 1,
      "fechaVoto": "2025-12-26 16:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 7,
      "valor": 1,
      "fechaVoto": "2025-12-26 17:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 7,
      "valor": -1,
      "fechaVoto": "2025-12-26 18:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 7,
      "valor": -1,
      "fechaVoto": "2025-12-26 19:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 7,
      "valor": 1,
      "fechaVoto": "2025-12-26 20:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 8,
      "valor": 1,
      "fechaVoto": "2025-12-28 21:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 8,
      "valor": 1,
      "fechaVoto": "2025-12-28 22:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 8,
      "valor": 1,
      "fechaVoto": "2025-12-28 23:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 8,
      "valor": 1,
      "fechaVoto": "2025-12-29 00:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 9,
      "valor": 1,
      "fechaVoto": "2025-12-31 01:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 9,
      "valor": 1,
      "fechaVoto": "2025-12-31 02:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 9,
      "valor": 1,
      "fechaVoto": "2025-12-31 03:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 9,
      "valor": 1,
      "fechaVoto": "2025-12-31 04:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 9,
      "valor": -1,
      "fechaVoto": "2025-12-30 09:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 9,
      "valor": 1,
      "fechaVoto": "2025-12-30 10:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 9,
      "valor": 1,
      "fechaVoto": "2025-12-30 11:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 9,
      "valor": 1,
      "fechaVoto": "2025-12-30 12:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 9,
      "valor": 1,
      "fechaVoto": "2025-12-30 13:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 9,
      "valor": 1,
      "fechaVoto": "2025-12-30 14:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 9,
      "valor": 1,
      "fechaVoto": "2025-12-30 15:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 10,
      "valor": 1,
      "fechaVoto": "2026-01-01 16:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 10,
      "valor": 1,
      "fechaVoto": "2026-01-01 17:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 10,
      "valor": 1,
      "fechaVoto": "2026-01-01 18:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 10,
      "valor": 1,
      "fechaVoto": "2026-01-01 19:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 11,
      "valor": 1,
      "fechaVoto": "2026-01-03 20:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 11,
      "valor": 1,
      "fechaVoto": "2026-01-03 21:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 11,
      "valor": 1,
      "fechaVoto": "2026-01-03 22:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 11,
      "valor": 1,
      "fechaVoto": "2026-01-03 23:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 11,
      "valor": -1,
      "fechaVoto": "2026-01-04 00:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 11,
      "valor": 1,
      "fechaVoto": "2026-01-04 01:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 11,
      "valor": 1,
      "fechaVoto": "2026-01-04 02:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 11,
      "valor": 1,
      "fechaVoto": "2026-01-04 03:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 11,
      "valor": 1,
      "fechaVoto": "2026-01-04 04:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 11,
      "valor": -1,
      "fechaVoto": "2026-01-03 09:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 11,
      "valor": -1,
      "fechaVoto": "2026-01-03 10:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 12,
      "valor": 1,
      "fechaVoto": "2026-01-05 11:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 12,
      "valor": 1,
      "fechaVoto": "2026-01-05 12:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 12,
      "valor": 1,
      "fechaVoto": "2026-01-05 13:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 12,
      "valor": -1,
      "fechaVoto": "2026-01-05 14:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 12,
      "valor": 1,
      "fechaVoto": "2026-01-05 15:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 12,
      "valor": 1,
      "fechaVoto": "2026-01-05 16:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 12,
      "valor": 1,
      "fechaVoto": "2026-01-05 17:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 13,
      "valor": 1,
      "fechaVoto": "2026-01-07 18:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 13,
      "valor": 1,
      "fechaVoto": "2026-01-07 19:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 13,
      "valor": 1,
      "fechaVoto": "2026-01-07 20:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 13,
      "valor": 1,
      "fechaVoto": "2026-01-07 21:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 14,
      "valor": 1,
      "fechaVoto": "2026-01-09 22:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 14,
      "valor": 1,
      "fechaVoto": "2026-01-09 23:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 14,
      "valor": 1,
      "fechaVoto": "2026-01-10 00:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 15,
      "valor": 1,
      "fechaVoto": "2026-01-12 01:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 15,
      "valor": 1,
      "fechaVoto": "2026-01-12 02:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 15,
      "valor": 1,
      "fechaVoto": "2026-01-12 03:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 15,
      "valor": -1,
      "fechaVoto": "2026-01-12 04:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 16,
      "valor": -1,
      "fechaVoto": "2026-01-13 09:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 16,
      "valor": 1,
      "fechaVoto": "2026-01-13 10:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 16,
      "valor": 1,
      "fechaVoto": "2026-01-13 11:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 16,
      "valor": 1,
      "fechaVoto": "2026-01-13 12:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 16,
      "valor": 1,
      "fechaVoto": "2026-01-13 13:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 16,
      "valor": 1,
      "fechaVoto": "2026-01-13 14:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 16,
      "valor": -1,
      "fechaVoto": "2026-01-13 15:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 16,
      "valor": 1,
      "fechaVoto": "2026-01-13 16:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 16,
      "valor": 1,
      "fechaVoto": "2026-01-13 17:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 16,
      "valor": 1,
      "fechaVoto": "2026-01-13 18:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 16,
      "valor": 1,
      "fechaVoto": "2026-01-13 19:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 17,
      "valor": 1,
      "fechaVoto": "2026-01-15 20:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 17,
      "valor": 1,
      "fechaVoto": "2026-01-15 21:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 17,
      "valor": 1,
      "fechaVoto": "2026-01-15 22:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 17,
      "valor": 1,
      "fechaVoto": "2026-01-15 23:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 17,
      "valor": 1,
      "fechaVoto": "2026-01-16 00:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 18,
      "valor": 1,
      "fechaVoto": "2026-01-18 01:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 18,
      "valor": 1,
      "fechaVoto": "2026-01-18 02:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 18,
      "valor": 1,
      "fechaVoto": "2026-01-18 03:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 18,
      "valor": 1,
      "fechaVoto": "2026-01-18 04:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 18,
      "valor": 1,
      "fechaVoto": "2026-01-17 09:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 18,
      "valor": 1,
      "fechaVoto": "2026-01-17 10:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 19,
      "valor": 1,
      "fechaVoto": "2026-01-19 11:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 19,
      "valor": 1,
      "fechaVoto": "2026-01-19 12:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 19,
      "valor": 1,
      "fechaVoto": "2026-01-19 13:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 19,
      "valor": 1,
      "fechaVoto": "2026-01-19 14:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 19,
      "valor": 1,
      "fechaVoto": "2026-01-19 15:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 20,
      "valor": 1,
      "fechaVoto": "2026-01-21 16:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 20,
      "valor": 1,
      "fechaVoto": "2026-01-21 17:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 20,
      "valor": -1,
      "fechaVoto": "2026-01-21 18:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 20,
      "valor": 1,
      "fechaVoto": "2026-01-21 19:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 20,
      "valor": 1,
      "fechaVoto": "2026-01-21 20:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 20,
      "valor": 1,
      "fechaVoto": "2026-01-21 21:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 20,
      "valor": 1,
      "fechaVoto": "2026-01-21 22:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 20,
      "valor": 1,
      "fechaVoto": "2026-01-21 23:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 20,
      "valor": 1,
      "fechaVoto": "2026-01-22 00:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 20,
      "valor": 1,
      "fechaVoto": "2026-01-22 01:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 21,
      "valor": 1,
      "fechaVoto": "2026-01-24 02:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 21,
      "valor": -1,
      "fechaVoto": "2026-01-24 03:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 21,
      "valor": -1,
      "fechaVoto": "2026-01-24 04:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 21,
      "valor": -1,
      "fechaVoto": "2026-01-23 09:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 21,
      "valor": 1,
      "fechaVoto": "2026-01-23 10:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 21,
      "valor": 1,
      "fechaVoto": "2026-01-23 11:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 21,
      "valor": -1,
      "fechaVoto": "2026-01-23 12:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 21,
      "valor": 1,
      "fechaVoto": "2026-01-23 13:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 21,
      "valor": 1,
      "fechaVoto": "2026-01-23 14:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 21,
      "valor": 1,
      "fechaVoto": "2026-01-23 15:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 21,
      "valor": -1,
      "fechaVoto": "2026-01-23 16:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 22,
      "valor": 1,
      "fechaVoto": "2026-01-25 17:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 22,
      "valor": 1,
      "fechaVoto": "2026-01-25 18:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 22,
      "valor": -1,
      "fechaVoto": "2026-01-25 19:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 22,
      "valor": 1,
      "fechaVoto": "2026-01-25 20:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 22,
      "valor": 1,
      "fechaVoto": "2026-01-25 21:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 22,
      "valor": 1,
      "fechaVoto": "2026-01-25 22:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 22,
      "valor": -1,
      "fechaVoto": "2026-01-25 23:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 22,
      "valor": -1,
      "fechaVoto": "2026-01-26 00:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 22,
      "valor": 1,
      "fechaVoto": "2026-01-26 01:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 22,
      "valor": -1,
      "fechaVoto": "2026-01-26 02:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 23,
      "valor": 1,
      "fechaVoto": "2026-01-28 03:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 23,
      "valor": 1,
      "fechaVoto": "2026-01-28 04:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 23,
      "valor": 1,
      "fechaVoto": "2026-01-27 09:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 23,
      "valor": 1,
      "fechaVoto": "2026-01-27 10:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 23,
      "valor": 1,
      "fechaVoto": "2026-01-27 11:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 23,
      "valor": 1,
      "fechaVoto": "2026-01-27 12:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 23,
      "valor": 1,
      "fechaVoto": "2026-01-27 13:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 23,
      "valor": 1,
      "fechaVoto": "2026-01-27 14:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 24,
      "valor": 1,
      "fechaVoto": "2026-01-29 15:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 24,
      "valor": 1,
      "fechaVoto": "2026-01-29 16:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 24,
      "valor": 1,
      "fechaVoto": "2026-01-29 17:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 24,
      "valor": 1,
      "fechaVoto": "2026-01-29 18:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 24,
      "valor": 1,
      "fechaVoto": "2026-01-29 19:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 24,
      "valor": 1,
      "fechaVoto": "2026-01-29 20:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 25,
      "valor": 1,
      "fechaVoto": "2026-01-31 21:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 25,
      "valor": 1,
      "fechaVoto": "2026-01-31 22:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 25,
      "valor": -1,
      "fechaVoto": "2026-01-31 23:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 25,
      "valor": -1,
      "fechaVoto": "2026-02-01 00:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 25,
      "valor": 1,
      "fechaVoto": "2026-02-01 01:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 25,
      "valor": 1,
      "fechaVoto": "2026-02-01 02:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 25,
      "valor": 1,
      "fechaVoto": "2026-02-01 03:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 26,
      "valor": 1,
      "fechaVoto": "2026-02-03 04:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 26,
      "valor": 1,
      "fechaVoto": "2026-02-02 09:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 26,
      "valor": 1,
      "fechaVoto": "2026-02-02 10:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 26,
      "valor": 1,
      "fechaVoto": "2026-02-02 11:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 26,
      "valor": 1,
      "fechaVoto": "2026-02-02 12:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 26,
      "valor": 1,
      "fechaVoto": "2026-02-02 13:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 26,
      "valor": -1,
      "fechaVoto": "2026-02-02 14:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 27,
      "valor": -1,
      "fechaVoto": "2026-02-04 15:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 27,
      "valor": 1,
      "fechaVoto": "2026-02-04 16:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 27,
      "valor": 1,
      "fechaVoto": "2026-02-04 17:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 27,
      "valor": 1,
      "fechaVoto": "2026-02-04 18:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 28,
      "valor": 1,
      "fechaVoto": "2026-02-06 19:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 28,
      "valor": -1,
      "fechaVoto": "2026-02-06 20:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 28,
      "valor": 1,
      "fechaVoto": "2026-02-06 21:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 28,
      "valor": -1,
      "fechaVoto": "2026-02-06 22:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 28,
      "valor": 1,
      "fechaVoto": "2026-02-06 23:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 29,
      "valor": 1,
      "fechaVoto": "2026-02-09 00:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 29,
      "valor": 1,
      "fechaVoto": "2026-02-09 01:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 29,
      "valor": 1,
      "fechaVoto": "2026-02-09 02:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 29,
      "valor": -1,
      "fechaVoto": "2026-02-09 03:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 29,
      "valor": -1,
      "fechaVoto": "2026-02-09 04:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 29,
      "valor": 1,
      "fechaVoto": "2026-02-08 09:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 29,
      "valor": 1,
      "fechaVoto": "2026-02-08 10:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 30,
      "valor": -1,
      "fechaVoto": "2026-02-10 11:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 30,
      "valor": 1,
      "fechaVoto": "2026-02-10 12:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 30,
      "valor": 1,
      "fechaVoto": "2026-02-10 13:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 30,
      "valor": 1,
      "fechaVoto": "2026-02-10 14:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 30,
      "valor": 1,
      "fechaVoto": "2026-02-10 15:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 30,
      "valor": 1,
      "fechaVoto": "2026-02-10 16:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 31,
      "valor": 1,
      "fechaVoto": "2026-02-12 17:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 31,
      "valor": 1,
      "fechaVoto": "2026-02-12 18:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 31,
      "valor": 1,
      "fechaVoto": "2026-02-12 19:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 31,
      "valor": 1,
      "fechaVoto": "2026-02-12 20:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 32,
      "valor": 1,
      "fechaVoto": "2026-02-14 21:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 32,
      "valor": 1,
      "fechaVoto": "2026-02-14 22:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 32,
      "valor": -1,
      "fechaVoto": "2026-02-14 23:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 32,
      "valor": 1,
      "fechaVoto": "2026-02-15 00:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 32,
      "valor": -1,
      "fechaVoto": "2026-02-15 01:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 32,
      "valor": 1,
      "fechaVoto": "2026-02-15 02:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 32,
      "valor": 1,
      "fechaVoto": "2026-02-15 03:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 32,
      "valor": 1,
      "fechaVoto": "2026-02-15 04:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 32,
      "valor": 1,
      "fechaVoto": "2026-02-14 09:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 32,
      "valor": 1,
      "fechaVoto": "2026-02-14 10:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 33,
      "valor": -1,
      "fechaVoto": "2026-02-16 11:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 33,
      "valor": 1,
      "fechaVoto": "2026-02-16 12:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 33,
      "valor": 1,
      "fechaVoto": "2026-02-16 13:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 33,
      "valor": -1,
      "fechaVoto": "2026-02-16 14:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 33,
      "valor": 1,
      "fechaVoto": "2026-02-16 15:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 33,
      "valor": -1,
      "fechaVoto": "2026-02-16 16:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 33,
      "valor": 1,
      "fechaVoto": "2026-02-16 17:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 33,
      "valor": 1,
      "fechaVoto": "2026-02-16 18:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 33,
      "valor": 1,
      "fechaVoto": "2026-02-16 19:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 33,
      "valor": -1,
      "fechaVoto": "2026-02-16 20:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 34,
      "valor": -1,
      "fechaVoto": "2026-02-18 21:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 34,
      "valor": -1,
      "fechaVoto": "2026-02-18 22:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 34,
      "valor": 1,
      "fechaVoto": "2026-02-18 23:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 34,
      "valor": -1,
      "fechaVoto": "2026-02-19 00:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 34,
      "valor": 1,
      "fechaVoto": "2026-02-19 01:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 34,
      "valor": -1,
      "fechaVoto": "2026-02-19 02:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 34,
      "valor": 1,
      "fechaVoto": "2026-02-19 03:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 34,
      "valor": 1,
      "fechaVoto": "2026-02-19 04:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 34,
      "valor": 1,
      "fechaVoto": "2026-02-18 09:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 35,
      "valor": 1,
      "fechaVoto": "2026-02-20 10:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 35,
      "valor": 1,
      "fechaVoto": "2026-02-20 11:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 35,
      "valor": 1,
      "fechaVoto": "2026-02-20 12:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 35,
      "valor": 1,
      "fechaVoto": "2026-02-20 13:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 35,
      "valor": 1,
      "fechaVoto": "2026-02-20 14:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 35,
      "valor": -1,
      "fechaVoto": "2026-02-20 15:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 35,
      "valor": 1,
      "fechaVoto": "2026-02-20 16:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 35,
      "valor": 1,
      "fechaVoto": "2026-02-20 17:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 35,
      "valor": 1,
      "fechaVoto": "2026-02-20 18:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 36,
      "valor": 1,
      "fechaVoto": "2026-02-22 19:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 36,
      "valor": -1,
      "fechaVoto": "2026-02-22 20:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 36,
      "valor": -1,
      "fechaVoto": "2026-02-22 21:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 36,
      "valor": -1,
      "fechaVoto": "2026-02-22 22:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 37,
      "valor": 1,
      "fechaVoto": "2026-02-24 23:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 37,
      "valor": -1,
      "fechaVoto": "2026-02-25 00:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 37,
      "valor": 1,
      "fechaVoto": "2026-02-25 01:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 38,
      "valor": 1,
      "fechaVoto": "2026-02-27 02:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 38,
      "valor": 1,
      "fechaVoto": "2026-02-27 03:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 38,
      "valor": 1,
      "fechaVoto": "2026-02-27 04:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 38,
      "valor": 1,
      "fechaVoto": "2026-02-26 09:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 38,
      "valor": 1,
      "fechaVoto": "2026-02-26 10:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 38,
      "valor": 1,
      "fechaVoto": "2026-02-26 11:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 38,
      "valor": 1,
      "fechaVoto": "2026-02-26 12:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 38,
      "valor": 1,
      "fechaVoto": "2026-02-26 13:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 38,
      "valor": 1,
      "fechaVoto": "2026-02-26 14:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 39,
      "valor": -1,
      "fechaVoto": "2026-02-28 15:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 39,
      "valor": 1,
      "fechaVoto": "2026-02-28 16:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 39,
      "valor": 1,
      "fechaVoto": "2026-02-28 17:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 39,
      "valor": 1,
      "fechaVoto": "2026-02-28 18:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 39,
      "valor": -1,
      "fechaVoto": "2026-02-28 19:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 39,
      "valor": 1,
      "fechaVoto": "2026-02-28 20:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 39,
      "valor": 1,
      "fechaVoto": "2026-02-28 21:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 39,
      "valor": 1,
      "fechaVoto": "2026-02-28 22:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 40,
      "valor": 1,
      "fechaVoto": "2026-03-02 23:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 40,
      "valor": 1,
      "fechaVoto": "2026-03-03 00:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 40,
      "valor": 1,
      "fechaVoto": "2026-03-03 01:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 40,
      "valor": 1,
      "fechaVoto": "2026-03-03 02:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 40,
      "valor": 1,
      "fechaVoto": "2026-03-03 03:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 41,
      "valor": 1,
      "fechaVoto": "2025-12-17 12:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 41,
      "valor": 1,
      "fechaVoto": "2025-12-17 13:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 41,
      "valor": 1,
      "fechaVoto": "2025-12-17 14:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 44,
      "valor": 1,
      "fechaVoto": "2025-12-17 15:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 44,
      "valor": 1,
      "fechaVoto": "2025-12-17 16:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 45,
      "valor": 1,
      "fechaVoto": "2025-12-17 17:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 45,
      "valor": 1,
      "fechaVoto": "2025-12-17 18:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 45,
      "valor": 1,
      "fechaVoto": "2025-12-17 19:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 45,
      "valor": 1,
      "fechaVoto": "2025-12-17 20:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 46,
      "valor": 1,
      "fechaVoto": "2025-12-17 21:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 46,
      "valor": 1,
      "fechaVoto": "2025-12-17 22:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 46,
      "valor": 1,
      "fechaVoto": "2025-12-17 23:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 46,
      "valor": 1,
      "fechaVoto": "2025-12-18 00:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 51,
      "valor": 1,
      "fechaVoto": "2025-12-18 01:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 51,
      "valor": 1,
      "fechaVoto": "2025-12-18 02:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 51,
      "valor": 1,
      "fechaVoto": "2025-12-18 03:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 51,
      "valor": 1,
      "fechaVoto": "2025-12-18 04:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 52,
      "valor": 1,
      "fechaVoto": "2025-12-18 05:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 52,
      "valor": 1,
      "fechaVoto": "2025-12-18 06:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 52,
      "valor": 1,
      "fechaVoto": "2025-12-18 07:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 53,
      "valor": 1,
      "fechaVoto": "2025-12-17 09:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 53,
      "valor": 1,
      "fechaVoto": "2025-12-17 10:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 55,
      "valor": 1,
      "fechaVoto": "2025-12-17 11:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 56,
      "valor": 1,
      "fechaVoto": "2025-12-17 12:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 57,
      "valor": 1,
      "fechaVoto": "2025-12-17 13:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 60,
      "valor": -1,
      "fechaVoto": "2025-12-17 14:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 60,
      "valor": 1,
      "fechaVoto": "2025-12-17 15:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 66,
      "valor": 1,
      "fechaVoto": "2025-12-17 16:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 66,
      "valor": 1,
      "fechaVoto": "2025-12-17 17:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 66,
      "valor": -1,
      "fechaVoto": "2025-12-17 18:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 68,
      "valor": -1,
      "fechaVoto": "2025-12-17 19:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 68,
      "valor": 1,
      "fechaVoto": "2025-12-17 20:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 68,
      "valor": -1,
      "fechaVoto": "2025-12-17 21:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 69,
      "valor": 1,
      "fechaVoto": "2025-12-17 22:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 69,
      "valor": 1,
      "fechaVoto": "2025-12-17 23:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 69,
      "valor": 1,
      "fechaVoto": "2025-12-18 00:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 70,
      "valor": 1,
      "fechaVoto": "2025-12-18 01:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 70,
      "valor": 1,
      "fechaVoto": "2025-12-18 02:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 70,
      "valor": -1,
      "fechaVoto": "2025-12-18 03:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 70,
      "valor": 1,
      "fechaVoto": "2025-12-18 04:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 71,
      "valor": 1,
      "fechaVoto": "2025-12-18 05:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 72,
      "valor": 1,
      "fechaVoto": "2025-12-18 06:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 73,
      "valor": 1,
      "fechaVoto": "2025-12-18 07:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 73,
      "valor": 1,
      "fechaVoto": "2025-12-17 09:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 73,
      "valor": -1,
      "fechaVoto": "2025-12-17 10:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 73,
      "valor": 1,
      "fechaVoto": "2025-12-17 11:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 75,
      "valor": 1,
      "fechaVoto": "2025-12-17 12:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 75,
      "valor": 1,
      "fechaVoto": "2025-12-17 13:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 75,
      "valor": -1,
      "fechaVoto": "2025-12-17 14:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 75,
      "valor": 1,
      "fechaVoto": "2025-12-17 15:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 78,
      "valor": 1,
      "fechaVoto": "2025-12-17 16:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 78,
      "valor": 1,
      "fechaVoto": "2025-12-17 17:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 78,
      "valor": 1,
      "fechaVoto": "2025-12-17 18:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 79,
      "valor": 1,
      "fechaVoto": "2025-12-17 19:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 79,
      "valor": 1,
      "fechaVoto": "2025-12-17 20:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 79,
      "valor": 1,
      "fechaVoto": "2025-12-17 21:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 79,
      "valor": 1,
      "fechaVoto": "2025-12-17 22:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 80,
      "valor": 1,
      "fechaVoto": "2025-12-17 23:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 84,
      "valor": 1,
      "fechaVoto": "2025-12-18 00:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 85,
      "valor": 1,
      "fechaVoto": "2025-12-18 01:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 87,
      "valor": 1,
      "fechaVoto": "2025-12-18 02:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 87,
      "valor": 1,
      "fechaVoto": "2025-12-18 03:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 92,
      "valor": 1,
      "fechaVoto": "2025-12-18 04:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 92,
      "valor": 1,
      "fechaVoto": "2025-12-18 05:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 92,
      "valor": 1,
      "fechaVoto": "2025-12-18 06:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 92,
      "valor": 1,
      "fechaVoto": "2025-12-18 07:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 93,
      "valor": 1,
      "fechaVoto": "2025-12-17 09:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 93,
      "valor": 1,
      "fechaVoto": "2025-12-17 10:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 93,
      "valor": -1,
      "fechaVoto": "2025-12-17 11:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 93,
      "valor": 1,
      "fechaVoto": "2025-12-17 12:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 95,
      "valor": 1,
      "fechaVoto": "2025-12-17 13:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 97,
      "valor": 1,
      "fechaVoto": "2025-12-17 14:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 103,
      "valor": 1,
      "fechaVoto": "2025-12-17 15:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 103,
      "valor": -1,
      "fechaVoto": "2025-12-17 16:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 103,
      "valor": 1,
      "fechaVoto": "2025-12-17 17:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 104,
      "valor": 1,
      "fechaVoto": "2025-12-17 18:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 104,
      "valor": 1,
      "fechaVoto": "2025-12-17 19:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 105,
      "valor": 1,
      "fechaVoto": "2025-12-17 20:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 107,
      "valor": 1,
      "fechaVoto": "2025-12-17 21:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 109,
      "valor": 1,
      "fechaVoto": "2025-12-17 22:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 110,
      "valor": 1,
      "fechaVoto": "2025-12-17 23:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 110,
      "valor": -1,
      "fechaVoto": "2025-12-18 00:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 111,
      "valor": 1,
      "fechaVoto": "2025-12-18 01:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 113,
      "valor": 1,
      "fechaVoto": "2025-12-18 02:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 113,
      "valor": 1,
      "fechaVoto": "2025-12-18 03:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 113,
      "valor": 1,
      "fechaVoto": "2025-12-18 04:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 116,
      "valor": 1,
      "fechaVoto": "2025-12-18 05:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 116,
      "valor": 1,
      "fechaVoto": "2025-12-18 06:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 116,
      "valor": 1,
      "fechaVoto": "2025-12-18 07:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 116,
      "valor": 1,
      "fechaVoto": "2025-12-17 09:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 117,
      "valor": -1,
      "fechaVoto": "2025-12-17 10:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 117,
      "valor": 1,
      "fechaVoto": "2025-12-17 11:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 117,
      "valor": -1,
      "fechaVoto": "2025-12-17 12:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 117,
      "valor": 1,
      "fechaVoto": "2025-12-17 13:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 119,
      "valor": 1,
      "fechaVoto": "2025-12-17 14:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 119,
      "valor": 1,
      "fechaVoto": "2025-12-17 15:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 119,
      "valor": 1,
      "fechaVoto": "2025-12-17 16:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 123,
      "valor": 1,
      "fechaVoto": "2025-12-17 17:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 127,
      "valor": 1,
      "fechaVoto": "2025-12-17 18:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 127,
      "valor": 1,
      "fechaVoto": "2025-12-17 19:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 127,
      "valor": 1,
      "fechaVoto": "2025-12-17 20:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 127,
      "valor": -1,
      "fechaVoto": "2025-12-17 21:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 129,
      "valor": 1,
      "fechaVoto": "2025-12-17 22:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 130,
      "valor": 1,
      "fechaVoto": "2025-12-17 23:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 130,
      "valor": 1,
      "fechaVoto": "2025-12-18 00:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 130,
      "valor": 1,
      "fechaVoto": "2025-12-18 01:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 130,
      "valor": 1,
      "fechaVoto": "2025-12-18 02:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 131,
      "valor": 1,
      "fechaVoto": "2025-12-18 03:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 131,
      "valor": -1,
      "fechaVoto": "2025-12-18 04:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 131,
      "valor": 1,
      "fechaVoto": "2025-12-18 05:00:00"
    },
    {
      "usuarioId": 14,
      "contenidoId": 134,
      "valor": 1,
      "fechaVoto": "2025-12-18 06:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 134,
      "valor": 1,
      "fechaVoto": "2025-12-18 07:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 137,
      "valor": 1,
      "fechaVoto": "2025-12-17 09:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 138,
      "valor": 1,
      "fechaVoto": "2025-12-17 10:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 138,
      "valor": 1,
      "fechaVoto": "2025-12-17 11:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 139,
      "valor": 1,
      "fechaVoto": "2025-12-17 12:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 139,
      "valor": 1,
      "fechaVoto": "2025-12-17 13:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 139,
      "valor": 1,
      "fechaVoto": "2025-12-17 14:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 141,
      "valor": 1,
      "fechaVoto": "2025-12-17 15:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 141,
      "valor": 1,
      "fechaVoto": "2025-12-17 16:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 141,
      "valor": 1,
      "fechaVoto": "2025-12-17 17:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 141,
      "valor": 1,
      "fechaVoto": "2025-12-17 18:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 146,
      "valor": 1,
      "fechaVoto": "2025-12-17 19:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 146,
      "valor": 1,
      "fechaVoto": "2025-12-17 20:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 146,
      "valor": 1,
      "fechaVoto": "2025-12-17 21:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 148,
      "valor": -1,
      "fechaVoto": "2025-12-17 22:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 148,
      "valor": 1,
      "fechaVoto": "2025-12-17 23:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 148,
      "valor": 1,
      "fechaVoto": "2025-12-18 00:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 151,
      "valor": 1,
      "fechaVoto": "2025-12-18 01:00:00"
    },
    {
      "usuarioId": 13,
      "contenidoId": 151,
      "valor": 1,
      "fechaVoto": "2025-12-18 02:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 151,
      "valor": 1,
      "fechaVoto": "2025-12-18 03:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 156,
      "valor": 1,
      "fechaVoto": "2025-12-18 04:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 156,
      "valor": 1,
      "fechaVoto": "2025-12-18 05:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 158,
      "valor": 1,
      "fechaVoto": "2025-12-18 06:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 160,
      "valor": 1,
      "fechaVoto": "2025-12-18 07:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 160,
      "valor": 1,
      "fechaVoto": "2025-12-17 09:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 161,
      "valor": 1,
      "fechaVoto": "2025-12-17 10:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 161,
      "valor": 1,
      "fechaVoto": "2025-12-17 11:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 161,
      "valor": 1,
      "fechaVoto": "2025-12-17 12:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 161,
      "valor": 1,
      "fechaVoto": "2025-12-17 13:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 162,
      "valor": 1,
      "fechaVoto": "2025-12-17 14:00:00"
    },
    {
      "usuarioId": 1,
      "contenidoId": 162,
      "valor": 1,
      "fechaVoto": "2025-12-17 15:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 163,
      "valor": -1,
      "fechaVoto": "2025-12-17 16:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 163,
      "valor": 1,
      "fechaVoto": "2025-12-17 17:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 163,
      "valor": 1,
      "fechaVoto": "2025-12-17 18:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 163,
      "valor": 1,
      "fechaVoto": "2025-12-17 19:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 164,
      "valor": 1,
      "fechaVoto": "2025-12-17 20:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 165,
      "valor": 1,
      "fechaVoto": "2025-12-17 21:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 165,
      "valor": 1,
      "fechaVoto": "2025-12-17 22:00:00"
    },
    {
      "usuarioId": 6,
      "contenidoId": 165,
      "valor": 1,
      "fechaVoto": "2025-12-17 23:00:00"
    },
    {
      "usuarioId": 12,
      "contenidoId": 166,
      "valor": 1,
      "fechaVoto": "2025-12-18 00:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 166,
      "valor": -1,
      "fechaVoto": "2025-12-18 01:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 166,
      "valor": -1,
      "fechaVoto": "2025-12-18 02:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 166,
      "valor": 1,
      "fechaVoto": "2025-12-18 03:00:00"
    },
    {
      "usuarioId": 11,
      "contenidoId": 167,
      "valor": 1,
      "fechaVoto": "2025-12-18 04:00:00"
    },
    {
      "usuarioId": 2,
      "contenidoId": 169,
      "valor": 1,
      "fechaVoto": "2025-12-18 05:00:00"
    },
    {
      "usuarioId": 3,
      "contenidoId": 169,
      "valor": 1,
      "fechaVoto": "2025-12-18 06:00:00"
    }
  ],
  "favoritos": [
    {
      "usuarioId": 1,
      "publicacionId": 7,
      "fecha": "2026-01-01 09:00:00"
    },
    {
      "usuarioId": 1,
      "publicacionId": 19,
      "fecha": "2026-01-01 10:00:00"
    },
    {
      "usuarioId": 1,
      "publicacionId": 22,
      "fecha": "2026-01-01 11:00:00"
    },
    {
      "usuarioId": 1,
      "publicacionId": 38,
      "fecha": "2026-01-01 12:00:00"
    },
    {
      "usuarioId": 1,
      "publicacionId": 10,
      "fecha": "2026-01-01 13:00:00"
    },
    {
      "usuarioId": 2,
      "publicacionId": 16,
      "fecha": "2026-01-01 14:00:00"
    },
    {
      "usuarioId": 2,
      "publicacionId": 4,
      "fecha": "2026-01-01 15:00:00"
    },
    {
      "usuarioId": 2,
      "publicacionId": 9,
      "fecha": "2026-01-01 16:00:00"
    },
    {
      "usuarioId": 2,
      "publicacionId": 33,
      "fecha": "2026-01-01 17:00:00"
    },
    {
      "usuarioId": 3,
      "publicacionId": 32,
      "fecha": "2026-01-01 18:00:00"
    },
    {
      "usuarioId": 3,
      "publicacionId": 29,
      "fecha": "2026-01-01 19:00:00"
    },
    {
      "usuarioId": 3,
      "publicacionId": 16,
      "fecha": "2026-01-01 20:00:00"
    },
    {
      "usuarioId": 3,
      "publicacionId": 5,
      "fecha": "2026-01-01 21:00:00"
    },
    {
      "usuarioId": 3,
      "publicacionId": 8,
      "fecha": "2026-01-01 22:00:00"
    },
    {
      "usuarioId": 4,
      "publicacionId": 36,
      "fecha": "2026-01-01 23:00:00"
    },
    {
      "usuarioId": 4,
      "publicacionId": 25,
      "fecha": "2026-01-02 00:00:00"
    },
    {
      "usuarioId": 4,
      "publicacionId": 10,
      "fecha": "2026-01-02 01:00:00"
    },
    {
      "usuarioId": 4,
      "publicacionId": 28,
      "fecha": "2026-01-02 02:00:00"
    },
    {
      "usuarioId": 5,
      "publicacionId": 24,
      "fecha": "2026-01-02 03:00:00"
    },
    {
      "usuarioId": 5,
      "publicacionId": 23,
      "fecha": "2026-01-02 04:00:00"
    },
    {
      "usuarioId": 5,
      "publicacionId": 4,
      "fecha": "2026-01-01 09:00:00"
    },
    {
      "usuarioId": 5,
      "publicacionId": 36,
      "fecha": "2026-01-01 10:00:00"
    },
    {
      "usuarioId": 5,
      "publicacionId": 21,
      "fecha": "2026-01-01 11:00:00"
    },
    {
      "usuarioId": 6,
      "publicacionId": 1,
      "fecha": "2026-01-01 12:00:00"
    },
    {
      "usuarioId": 6,
      "publicacionId": 10,
      "fecha": "2026-01-01 13:00:00"
    },
    {
      "usuarioId": 6,
      "publicacionId": 30,
      "fecha": "2026-01-01 14:00:00"
    },
    {
      "usuarioId": 6,
      "publicacionId": 32,
      "fecha": "2026-01-01 15:00:00"
    },
    {
      "usuarioId": 6,
      "publicacionId": 5,
      "fecha": "2026-01-01 16:00:00"
    },
    {
      "usuarioId": 6,
      "publicacionId": 36,
      "fecha": "2026-01-01 17:00:00"
    },
    {
      "usuarioId": 7,
      "publicacionId": 30,
      "fecha": "2026-01-01 18:00:00"
    },
    {
      "usuarioId": 7,
      "publicacionId": 17,
      "fecha": "2026-01-01 19:00:00"
    },
    {
      "usuarioId": 7,
      "publicacionId": 34,
      "fecha": "2026-01-01 20:00:00"
    },
    {
      "usuarioId": 8,
      "publicacionId": 2,
      "fecha": "2026-01-01 21:00:00"
    },
    {
      "usuarioId": 8,
      "publicacionId": 26,
      "fecha": "2026-01-01 22:00:00"
    },
    {
      "usuarioId": 9,
      "publicacionId": 37,
      "fecha": "2026-01-01 23:00:00"
    },
    {
      "usuarioId": 9,
      "publicacionId": 3,
      "fecha": "2026-01-02 00:00:00"
    },
    {
      "usuarioId": 9,
      "publicacionId": 18,
      "fecha": "2026-01-02 01:00:00"
    },
    {
      "usuarioId": 9,
      "publicacionId": 12,
      "fecha": "2026-01-02 02:00:00"
    },
    {
      "usuarioId": 10,
      "publicacionId": 12,
      "fecha": "2026-01-02 03:00:00"
    },
    {
      "usuarioId": 10,
      "publicacionId": 14,
      "fecha": "2026-01-02 04:00:00"
    },
    {
      "usuarioId": 11,
      "publicacionId": 19,
      "fecha": "2026-01-01 09:00:00"
    },
    {
      "usuarioId": 11,
      "publicacionId": 33,
      "fecha": "2026-01-01 10:00:00"
    },
    {
      "usuarioId": 11,
      "publicacionId": 15,
      "fecha": "2026-01-01 11:00:00"
    },
    {
      "usuarioId": 11,
      "publicacionId": 38,
      "fecha": "2026-01-01 12:00:00"
    },
    {
      "usuarioId": 11,
      "publicacionId": 29,
      "fecha": "2026-01-01 13:00:00"
    },
    {
      "usuarioId": 12,
      "publicacionId": 37,
      "fecha": "2026-01-01 14:00:00"
    },
    {
      "usuarioId": 12,
      "publicacionId": 22,
      "fecha": "2026-01-01 15:00:00"
    },
    {
      "usuarioId": 12,
      "publicacionId": 39,
      "fecha": "2026-01-01 16:00:00"
    },
    {
      "usuarioId": 13,
      "publicacionId": 38,
      "fecha": "2026-01-01 17:00:00"
    },
    {
      "usuarioId": 13,
      "publicacionId": 32,
      "fecha": "2026-01-01 18:00:00"
    },
    {
      "usuarioId": 13,
      "publicacionId": 5,
      "fecha": "2026-01-01 19:00:00"
    },
    {
      "usuarioId": 14,
      "publicacionId": 38,
      "fecha": "2026-01-01 20:00:00"
    },
    {
      "usuarioId": 14,
      "publicacionId": 12,
      "fecha": "2026-01-01 21:00:00"
    },
    {
      "usuarioId": 14,
      "publicacionId": 11,
      "fecha": "2026-01-01 22:00:00"
    },
    {
      "usuarioId": 14,
      "publicacionId": 10,
      "fecha": "2026-01-01 23:00:00"
    }
  ],
  "reportes": [
    {
      "usuarioId": 6,
      "contenidoId": 26,
      "motivo": "duplicado",
      "descripcion": "Ya existe una publicación con el mismo contenido en la sección de ayuda.",
      "estado": "pendiente",
      "fechaReporte": "2026-02-10 09:00:00"
    },
    {
      "usuarioId": 7,
      "contenidoId": 45,
      "motivo": "contenido_inapropiado",
      "descripcion": "El comentario descalifica a un docente sin argumentos.",
      "estado": "pendiente",
      "fechaReporte": "2026-02-12 09:00:00"
    },
    {
      "usuarioId": 4,
      "contenidoId": 15,
      "motivo": "informacion_incorrecta",
      "descripcion": "La modalidad de evaluación que se indica no es la vigente.",
      "estado": "en_revision",
      "fechaReporte": "2026-02-15 09:00:00"
    },
    {
      "usuarioId": 5,
      "contenidoId": 52,
      "motivo": "spam",
      "descripcion": "Publica un enlace comercial sin relación con la materia.",
      "estado": "resuelto",
      "fechaReporte": "2026-02-18 09:00:00"
    },
    {
      "usuarioId": 8,
      "contenidoId": 9,
      "motivo": "material_con_derechos",
      "descripcion": "Podría estar compartiendo material protegido de la editorial.",
      "estado": "pendiente",
      "fechaReporte": "2026-02-21 09:00:00"
    },
    {
      "usuarioId": 9,
      "contenidoId": 60,
      "motivo": "contenido_inapropiado",
      "descripcion": "Trato descortés hacia otro estudiante.",
      "estado": "rechazado",
      "fechaReporte": "2026-02-24 09:00:00"
    },
    {
      "usuarioId": 10,
      "contenidoId": 33,
      "motivo": "spam",
      "descripcion": "Repite el mismo texto en varias materias.",
      "estado": "pendiente",
      "fechaReporte": "2026-02-27 09:00:00"
    }
  ],
  "categorias": [
    {
      "valor": "pregunta",
      "nombre": "Pregunta",
      "descripcion": "Dudas concretas sobre una materia o trámite."
    },
    {
      "valor": "apunte",
      "nombre": "Apunte",
      "descripcion": "Resúmenes y material de estudio propio."
    },
    {
      "valor": "parcial",
      "nombre": "Parcial",
      "descripcion": "Modelos de parcial, finales y recuperatorios."
    },
    {
      "valor": "profesor",
      "nombre": "Profesor",
      "descripcion": "Información sobre cátedras y modalidades de cursado."
    },
    {
      "valor": "experiencia",
      "nombre": "Experiencia",
      "descripcion": "Relatos de cursado y consejos personales."
    },
    {
      "valor": "recomendacion",
      "nombre": "Recomendación",
      "descripcion": "Sugerencias de correlativas, orden de cursado y horarios."
    },
    {
      "valor": "material",
      "nombre": "Material",
      "descripcion": "Bibliografía, links y recursos externos."
    }
  ]
};
