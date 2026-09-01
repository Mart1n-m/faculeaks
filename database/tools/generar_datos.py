#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador único de datos de demostración de FacuLeaks.

Emite, a partir de una única fuente en memoria:
  - /data/*.json                      -> mocks consumidos por el frontend
  - /assets/js/data/dataset.js        -> mismo dataset embebido (funciona sin servidor)
  - /database/seed.sql                -> INSERTs coherentes con los mocks

El modelo es el del DER en notación de Chen (docs/modelo-conceptual.md):
12 colecciones, con CONTENIDO como generalización de PUBLICACIÓN y COMENTARIO,
y con las relaciones N:M (estudia, carrera_materia, votos, favoritos, reportes)
identificadas por la clave compuesta de sus participantes.

Ejecutar desde la raíz del proyecto:  python3 database/tools/generar_datos.py
"""
import json
import os
import random
import unicodedata
from datetime import datetime, timedelta

random.seed(20260828)

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BASE_FECHA = datetime(2026, 3, 2, 9, 0, 0)


def slug(texto):
    s = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    s = "".join(c.lower() if c.isalnum() else "-" for c in s)
    while "--" in s:
        s = s.replace("--", "-")
    return s.strip("-")


def fecha(dias, horas=0):
    return (BASE_FECHA + timedelta(days=dias, hours=horas)).strftime("%Y-%m-%d %H:%M:%S")


# --------------------------------------------------------------------------
# 1. Entidad ROL
# --------------------------------------------------------------------------
roles = [
    {"idRol": 1, "nombre": "invitado", "descripcion": "Visitante sin sesion iniciada. Solo lectura."},
    {"idRol": 2, "nombre": "usuario", "descripcion": "Estudiante registrado. Publica, comenta, vota y reporta."},
    {"idRol": 3, "nombre": "moderador", "descripcion": "Gestiona reportes y modera contenido de la comunidad."},
    {"idRol": 4, "nombre": "administrador", "descripcion": "Administra usuarios y el catalogo academico completo."},
]

# Categorias: dominio cerrado del atributo `categoria` de PUBLICACION.
# No es una entidad: es el conjunto de valores admitidos por el ENUM.
CATEGORIAS = [
    ("pregunta", "Pregunta", "Dudas concretas sobre una materia o tramite."),
    ("apunte", "Apunte", "Resumenes y material de estudio propio."),
    ("parcial", "Parcial", "Modelos de parcial, finales y recuperatorios."),
    ("profesor", "Profesor", "Informacion sobre catedras y modalidades de cursado."),
    ("experiencia", "Experiencia", "Relatos de cursado y consejos personales."),
    ("recomendacion", "Recomendacion", "Sugerencias de correlativas, orden de cursado y horarios."),
    ("material", "Material", "Bibliografia, links y recursos externos."),
]
categorias = [{"valor": v, "nombre": n, "descripcion": d} for v, n, d in CATEGORIAS]

# --------------------------------------------------------------------------
# 2. Entidad CARRERA
# --------------------------------------------------------------------------
CARRERAS_INICIALES = [
    ("Licenciatura en Diseno Grafico y Multimedia", 4,
     "Formacion en comunicacion visual, diseno editorial, audiovisual e interactivo."),
    ("Contador Publico", 5,
     "Formacion contable, impositiva y de auditoria para organizaciones publicas y privadas."),
    ("Ingenieria en Sistemas de Informacion", 5,
     "Analisis, diseno, desarrollo e implantacion de sistemas de informacion en las organizaciones."),
    ("Abogacia", 5,
     "Formacion juridica integral en derecho publico y privado."),
    ("Licenciatura en Criminalistica", 4,
     "Investigacion cientifica del delito, pericias y ciencias forenses."),
    ("Licenciatura en Psicologia", 5,
     "Estudio de los procesos psiquicos y de la conducta humana en sus distintos ambitos."),
    ("Licenciatura en Fonoaudiologia", 5,
     "Prevencion, diagnostico y tratamiento de la comunicacion humana."),
    ("Licenciatura en Psicopedagogia", 4,
     "Abordaje de los procesos de aprendizaje en contextos educativos y clinicos."),
    ("Licenciatura en Nutricion", 5,
     "Alimentacion humana, nutricion clinica y salud publica."),
    ("Analista Universitario en Sistemas de Informacion", 3,
     "Ciclo corto orientado al analisis y desarrollo de software."),
    ("Analista Universitario Contable", 3,
     "Ciclo corto orientado a la gestion contable y administrativa."),
    ("Ingenieria en Alimentos", 5,
     "Procesos, calidad e industrializacion de productos alimenticios."),
    ("Analista Universitario en Alimentos", 3,
     "Ciclo corto orientado al control de calidad y procesos alimentarios."),
]

carreras = []
for i, (nombre, dur, desc) in enumerate(CARRERAS_INICIALES, start=1):
    carreras.append({
        "idCarrera": i, "nombre": nombre, "slug": slug(nombre),
        "descripcion": desc, "duracionAnios": dur, "activa": True,
    })

CAR = {c["nombre"]: c["idCarrera"] for c in carreras}

# --------------------------------------------------------------------------
# 3. Entidad MATERIA
# --------------------------------------------------------------------------
MATERIAS_DEF = [
    ("SIS-101", "Algoritmos y Estructuras de Datos", "Resolucion algoritmica, complejidad y estructuras fundamentales."),
    ("SIS-102", "Arquitectura de Computadoras", "Organizacion del computador, memoria y conjunto de instrucciones."),
    ("SIS-103", "Analisis Matematico I", "Limites, derivadas e integrales de una variable."),
    ("SIS-104", "Algebra y Geometria Analitica", "Matrices, sistemas lineales, vectores y conicas."),
    ("SIS-201", "Programacion Orientada a Objetos", "Abstraccion, encapsulamiento, herencia y polimorfismo."),
    ("SIS-202", "Bases de Datos", "Modelo relacional, normalizacion, SQL y transacciones."),
    ("SIS-203", "Sistemas Operativos", "Procesos, concurrencia, memoria y sistemas de archivos."),
    ("SIS-204", "Analisis de Sistemas", "Relevamiento, requerimientos y modelado UML."),
    ("SIS-301", "Paradigmas de la Programacion", "Paradigmas imperativo, funcional, logico y orientado a objetos."),
    ("SIS-302", "Redes de Datos", "Modelo OSI/TCP-IP, ruteo y servicios de red."),
    ("SIS-303", "Ingenieria de Software", "Ciclo de vida, metodologias, calidad y gestion de proyectos."),
    ("SIS-304", "Desarrollo Web", "HTML, CSS, JavaScript, arquitectura cliente-servidor."),
    ("SIS-401", "Inteligencia Artificial", "Busqueda, representacion del conocimiento y aprendizaje automatico."),
    ("SIS-402", "Gestion de Proyectos Informaticos", "Alcance, cronograma, riesgos y costos de proyectos de TI."),
    ("CON-101", "Contabilidad Basica", "Patrimonio, ecuacion contable y registracion."),
    ("CON-102", "Derecho Privado", "Personas, obligaciones y contratos."),
    ("CON-201", "Contabilidad Intermedia", "Valuacion, exposicion y estados contables."),
    ("CON-202", "Impuestos I", "Sistema tributario argentino, IVA y ganancias."),
    ("CON-301", "Auditoria", "Normas de auditoria, evidencia e informe del auditor."),
    ("CON-302", "Costos y Gestion", "Sistemas de costeo y toma de decisiones."),
    ("ABO-101", "Introduccion al Derecho", "Teoria general del derecho y fuentes normativas."),
    ("ABO-201", "Derecho Constitucional", "Poder constituyente, derechos y garantias."),
    ("ABO-301", "Derecho Penal I", "Teoria del delito y parte general."),
    ("PSI-101", "Psicologia General", "Procesos basicos: percepcion, memoria, aprendizaje."),
    ("PSI-201", "Psicologia del Desarrollo", "Desarrollo psiquico a lo largo del ciclo vital."),
    ("PSI-301", "Psicopatologia", "Clasificacion y abordaje de los cuadros psicopatologicos."),
    ("DGM-101", "Taller de Diseno I", "Fundamentos del lenguaje visual y composicion."),
    ("DGM-201", "Tipografia", "Anatomia tipografica, familias y diagramacion."),
    ("DGM-301", "Diseno Multimedia", "Diseno de interfaces, animacion y produccion audiovisual."),
    ("CRI-101", "Introduccion a la Criminalistica", "Escena del crimen, indicios y cadena de custodia."),
    ("CRI-201", "Balistica Forense", "Armas, proyectiles y pericias balisticas."),
    ("FON-101", "Anatomofisiologia de la Comunicacion", "Bases anatomicas del habla, voz y audicion."),
    ("FON-201", "Audiologia", "Evaluacion audiologica y rehabilitacion auditiva."),
    ("PSP-101", "Aprendizaje y Cognicion", "Teorias del aprendizaje y procesos cognitivos."),
    ("PSP-201", "Diagnostico Psicopedagogico", "Instrumentos y proceso diagnostico."),
    ("NUT-101", "Bromatologia", "Higiene, conservacion y seguridad alimentaria."),
    ("NUT-201", "Nutricion Clinica", "Dietoterapia y abordaje nutricional del paciente."),
    ("ALI-101", "Quimica General", "Estructura de la materia, estequiometria y soluciones."),
    ("ALI-201", "Operaciones Unitarias", "Transferencia de calor, masa y cantidad de movimiento."),
    ("ALI-301", "Control de Calidad de Alimentos", "Normas, muestreo y ensayos de calidad."),
    ("GEN-101", "Ingles Tecnico", "Comprension lectora de textos tecnicos en ingles."),
    ("GEN-102", "Metodologia de la Investigacion", "Diseno de investigacion, hipotesis y tecnicas de recoleccion."),
    ("GEN-103", "Estadistica", "Estadistica descriptiva, probabilidad e inferencia."),
]

materias = []
for i, (codigo, nombre, desc) in enumerate(MATERIAS_DEF, start=1):
    materias.append({
        "idMateria": i, "codigo": codigo, "nombre": nombre,
        "descripcion": desc, "activa": True,
    })
MAT = {m["codigo"]: m["idMateria"] for m in materias}

# --------------------------------------------------------------------------
# 4. Relacion SE_DICTA_EN (carrera_materia)
#    Los atributos anio_cursada, cuatrimestre y obligatoria dependen del PAR
#    carrera-materia: la misma materia puede cursarse en distinto anio segun la
#    carrera. Por eso son atributos de la relacion y no de la materia.
# --------------------------------------------------------------------------
MALLAS = {
    "Ingenieria en Sistemas de Informacion": [
        ("SIS-101", 1, 1, True), ("SIS-103", 1, 1, True), ("SIS-104", 1, 1, True),
        ("SIS-102", 1, 2, True), ("GEN-101", 1, 2, True),
        ("SIS-201", 2, 1, True), ("SIS-202", 2, 1, True), ("GEN-103", 2, 1, True),
        ("SIS-203", 2, 2, True), ("SIS-204", 2, 2, True),
        ("SIS-301", 3, 1, True), ("SIS-302", 3, 1, True),
        ("SIS-303", 3, 2, True), ("SIS-304", 3, 2, True),
        ("SIS-401", 4, 1, False), ("SIS-402", 4, 2, True), ("GEN-102", 4, 2, True),
    ],
    "Analista Universitario en Sistemas de Informacion": [
        ("SIS-101", 1, 1, True), ("SIS-104", 1, 1, True), ("SIS-102", 1, 2, True),
        ("SIS-201", 2, 1, True), ("SIS-202", 2, 1, True), ("SIS-204", 2, 2, True),
        ("SIS-304", 3, 1, True), ("SIS-301", 3, 1, False), ("GEN-101", 3, 2, True),
    ],
    "Contador Publico": [
        ("CON-101", 1, 1, True), ("CON-102", 1, 2, True), ("GEN-103", 1, 2, True),
        ("CON-201", 2, 1, True), ("CON-302", 2, 2, True),
        ("CON-202", 3, 1, True), ("CON-301", 4, 1, True), ("GEN-102", 5, 1, True),
    ],
    "Analista Universitario Contable": [
        ("CON-101", 1, 1, True), ("CON-102", 1, 2, True),
        ("CON-201", 2, 1, True), ("CON-302", 2, 2, True), ("CON-202", 3, 1, True),
    ],
    "Abogacia": [
        ("ABO-101", 1, 1, True), ("CON-102", 1, 2, True),
        ("ABO-201", 2, 1, True), ("ABO-301", 3, 1, True), ("GEN-102", 4, 2, True),
    ],
    "Licenciatura en Psicologia": [
        ("PSI-101", 1, 1, True), ("GEN-103", 1, 2, True),
        ("PSI-201", 2, 1, True), ("PSI-301", 3, 1, True), ("GEN-102", 4, 1, True),
    ],
    "Licenciatura en Diseno Grafico y Multimedia": [
        ("DGM-101", 1, 1, True), ("DGM-201", 2, 1, True),
        ("DGM-301", 3, 1, True), ("SIS-304", 3, 2, False),
    ],
    "Licenciatura en Criminalistica": [
        ("CRI-101", 1, 1, True), ("ABO-101", 1, 2, True),
        ("CRI-201", 2, 1, True), ("GEN-103", 2, 2, True),
    ],
    "Licenciatura en Fonoaudiologia": [
        ("FON-101", 1, 1, True), ("PSI-101", 1, 2, True), ("FON-201", 3, 1, True),
    ],
    "Licenciatura en Psicopedagogia": [
        ("PSP-101", 1, 1, True), ("PSI-201", 2, 1, True), ("PSP-201", 3, 1, True),
    ],
    "Licenciatura en Nutricion": [
        ("ALI-101", 1, 1, True), ("NUT-101", 2, 1, True), ("NUT-201", 3, 1, True),
    ],
    "Ingenieria en Alimentos": [
        ("ALI-101", 1, 1, True), ("SIS-103", 1, 1, True), ("GEN-101", 1, 2, True),
        ("ALI-201", 3, 1, True), ("ALI-301", 4, 1, True),
    ],
    "Analista Universitario en Alimentos": [
        ("ALI-101", 1, 1, True), ("NUT-101", 1, 2, True), ("ALI-301", 3, 1, True),
    ],
}

carrera_materia = []
for carrera_nombre in sorted(MALLAS):
    for codigo, anio, cuat, oblig in MALLAS[carrera_nombre]:
        carrera_materia.append({
            "carreraId": CAR[carrera_nombre],
            "materiaId": MAT[codigo],
            "anioCursada": anio,
            "cuatrimestre": cuat,
            "obligatoria": oblig,
        })

# Indice inverso: en que carreras se dicta cada materia.
CARRERAS_DE_MATERIA = {}
for cm in carrera_materia:
    CARRERAS_DE_MATERIA.setdefault(cm["materiaId"], []).append(cm["carreraId"])

# --------------------------------------------------------------------------
# 5. Entidad USUARIO y relacion ESTUDIA
# --------------------------------------------------------------------------
USUARIOS_DEF = [
    ("admin", "admin@faculeaks.edu.ar", 4, "Valeria", "Ortiz", "Administradora de la plataforma."),
    ("mod_lucia", "lucia.mod@faculeaks.edu.ar", 3, "Lucia", "Ferreyra", "Moderadora del area de Sistemas."),
    ("mod_bruno", "bruno.mod@faculeaks.edu.ar", 3, "Bruno", "Alcaraz", "Moderador del area de Ciencias Sociales."),
    ("mnahuel", "mnahuel@faculeaks.edu.ar", 2, "Martin", "Cabrera", "Estudiante de Ingenieria en Sistemas, 3er ano."),
    ("sofi.dg", "sofia.dg@faculeaks.edu.ar", 2, "Sofia", "Duarte", "Cursando Diseno Grafico y Multimedia."),
    ("jpcontable", "juanp@faculeaks.edu.ar", 2, "Juan Pablo", "Rios", "Futuro contador publico."),
    ("cami.psi", "camila.psi@faculeaks.edu.ar", 2, "Camila", "Benitez", "Psicologia, ciclo superior."),
    ("nico_dev", "nicolas.dev@faculeaks.edu.ar", 2, "Nicolas", "Aguirre", "Analista en Sistemas, me gusta compartir apuntes."),
    ("agus.leyes", "agustina.abo@faculeaks.edu.ar", 2, "Agustina", "Molina", "Abogacia, 3er ano."),
    ("flor.nut", "florencia.nut@faculeaks.edu.ar", 2, "Florencia", "Vega", "Nutricion, interesada en salud publica."),
    ("mati.ali", "matias.ali@faculeaks.edu.ar", 2, "Matias", "Sosa", "Ingenieria en Alimentos."),
    ("rocio.crim", "rocio.crim@faculeaks.edu.ar", 2, "Rocio", "Paredes", "Criminalistica, apasionada por la balistica."),
    ("tomi.fono", "tomas.fono@faculeaks.edu.ar", 2, "Tomas", "Ledesma", "Fonoaudiologia, 2do ano."),
    ("belu.psp", "belen.psp@faculeaks.edu.ar", 2, "Belen", "Quiroga", "Psicopedagogia."),
]

usuarios = []
for i, (u, mail, rol, nom, ape, bio) in enumerate(USUARIOS_DEF, start=1):
    usuarios.append({
        "idUsuario": i, "rolId": rol, "username": u, "email": mail,
        # Hash bcrypt ficticio: no corresponde a ninguna contrasena real.
        "passwordHash": "$2y$10$FacuLeaksDemoHashNoValido{:02d}".format(i),
        "nombre": nom, "apellido": ape,
        "avatarUrl": "assets/img/avatares/avatar-{}.svg".format((i % 6) + 1),
        "biografia": bio, "estado": "activo", "fechaRegistro": fecha(-200 + i * 7),
    })
USR = {u["username"]: u["idUsuario"] for u in usuarios}

ESTUDIA_DEF = [
    ("mnahuel", "Ingenieria en Sistemas de Informacion", 2024, "Sede Central"),
    ("nico_dev", "Analista Universitario en Sistemas de Informacion", 2025, "Sede Central"),
    ("nico_dev", "Ingenieria en Sistemas de Informacion", 2026, "Sede Central"),
    ("sofi.dg", "Licenciatura en Diseno Grafico y Multimedia", 2024, "Sede Norte"),
    ("jpcontable", "Contador Publico", 2023, "Sede Central"),
    ("cami.psi", "Licenciatura en Psicologia", 2022, "Sede Sur"),
    ("agus.leyes", "Abogacia", 2024, "Sede Central"),
    ("flor.nut", "Licenciatura en Nutricion", 2025, "Sede Norte"),
    ("mati.ali", "Ingenieria en Alimentos", 2023, "Sede Sur"),
    ("rocio.crim", "Licenciatura en Criminalistica", 2025, "Sede Central"),
    ("tomi.fono", "Licenciatura en Fonoaudiologia", 2025, "Sede Norte"),
    ("belu.psp", "Licenciatura en Psicopedagogia", 2024, "Sede Sur"),
    ("mod_lucia", "Ingenieria en Sistemas de Informacion", 2019, "Sede Central"),
    ("mod_bruno", "Abogacia", 2020, "Sede Central"),
]
estudia = [{
    "usuarioId": USR[u], "carreraId": CAR[carrera],
    "anioIngreso": anio, "sede": sede, "activo": True,
} for u, carrera, anio, sede in ESTUDIA_DEF]

CARRERA_POR_USUARIO = {}
for e in estudia:
    CARRERA_POR_USUARIO.setdefault(e["usuarioId"], e["carreraId"])

# --------------------------------------------------------------------------
# 6. Entidad debil PROGRAMA (identificada por materia + anio + version)
# --------------------------------------------------------------------------
DOCENTES = ["Ing. R. Villalba", "Lic. M. Sanchez", "Dr. A. Peralta", "Mg. C. Zarate",
            "Esp. L. Fernandez", "Ing. S. Coronel", "Lic. P. Arrieta", "Dra. N. Ojeda"]

programas = []
contador = 0
for materia in materias:
    if materia["idMateria"] not in CARRERAS_DE_MATERIA:
        continue
    # Entre uno y dos programas por materia: el vigente y, a veces, el anterior.
    cantidad = 2 if materia["idMateria"] % 3 else 1
    for k in range(cantidad):
        contador += 1
        anio = 2026 - k
        programas.append({
            "materiaId": materia["idMateria"],
            "anioAcademico": anio,
            "version": "v{}.0".format(cantidad - k),
            "titulo": "Programa de {} - Ciclo {}".format(materia["nombre"], anio),
            "archivoUrl": "assets/archivos/programas/{}-{}.pdf".format(slug(materia["codigo"]), anio),
            "docenteReferencia": DOCENTES[contador % len(DOCENTES)],
            "cargadoPor": USR["admin"] if contador % 4 else USR["mod_lucia"],
            "fechaPublicacion": fecha(-150 + contador),
            "vigente": (k == 0),
        })

# --------------------------------------------------------------------------
# 7. Generalizacion CONTENIDO -> PUBLICACION / COMENTARIO
#    id_contenido es una secuencia unica compartida por ambos subtipos.
# --------------------------------------------------------------------------
PUBLICACIONES_DEF = [
    # username, categoria, codigo de materia (o None), titulo, cuerpo
    ("mnahuel", "pregunta", "SIS-301", "Diferencia practica entre paradigma funcional y logico",
     "Estoy arrancando Paradigmas y me cuesta ver la diferencia real entre programar en Haskell y en Prolog.\n\nEntiendo que en el funcional describo transformaciones con funciones puras y en el logico declaro hechos y reglas y el motor resuelve por unificacion, pero no me queda claro cuando conviene cada uno en la practica.\n\nAlguien que ya haya rendido puede dar un ejemplo concreto?"),
    ("nico_dev", "apunte", "SIS-301", "Apunte propio: unificacion y backtracking en Prolog",
     "Subo un resumen de 8 paginas que arme para el primer parcial de Paradigmas.\n\nContenido:\n- Terminos, hechos, reglas y consultas\n- Algoritmo de unificacion paso a paso\n- Arbol de resolucion y backtracking\n- Corte (!) y sus efectos\n- 12 ejercicios resueltos\n\nEsta basado en las clases teoricas y en el capitulo correspondiente de la bibliografia de catedra."),
    ("mnahuel", "parcial", "SIS-202", "Modelo de parcial de Bases de Datos 2025",
     "Comparto el parcial que tomaron el ano pasado. Tenia tres partes: normalizacion hasta 3FN, algebra relacional y consultas SQL con subconsultas y agregacion.\n\nLo que mas pesaba era la parte de normalizacion, asi que practiquen dependencias funcionales."),
    ("nico_dev", "profesor", "SIS-202", "Como es la catedra de Bases de Datos",
     "Cursando con la catedra de la manana: mucho enfasis en el modelo relacional formal antes de tocar SQL.\n\nLas practicas son con MariaDB y piden un trabajo integrador de diseno de esquema. Toman coloquio oral al final. Muy exigentes con la justificacion de las claves y las cardinalidades."),
    ("mnahuel", "recomendacion", "SIS-202", "Conviene cursar Bases de Datos junto con Sistemas Operativos?",
     "Ambas caen en segundo ano y tienen carga practica fuerte. Yo las curse juntas y fue pesado pero se puede si organizas los TPs con anticipacion.\n\nSi trabajas mas de 4 horas por dia, yo dejaria Sistemas Operativos para el cuatrimestre siguiente."),
    ("nico_dev", "material", "SIS-304", "Recursos gratuitos para practicar Desarrollo Web",
     "Lista de recursos que me sirvieron:\n- MDN Web Docs para referencia de HTML, CSS y JS\n- Especificacion de WCAG para accesibilidad\n- Un simulador local con el servidor http de Python para probar fetch\n\nNo hace falta ningun framework para aprobar la materia."),
    ("sofi.dg", "experiencia", "DGM-201", "Mi experiencia cursando Tipografia",
     "Es la materia que mas me cambio la mirada. Se trabaja mucho con entregas semanales y correcciones en clase.\n\nConsejo: no dejen las entregas para el ultimo dia, la correccion iterativa es la mitad de la nota."),
    ("sofi.dg", "apunte", "DGM-101", "Apuntes de composicion visual - Taller de Diseno I",
     "Resumen de los principios de composicion: equilibrio, ritmo, jerarquia, contraste y proporcion, con ejemplos analizados de piezas editoriales."),
    ("jpcontable", "pregunta", "CON-202", "Duda con el calculo del credito fiscal en IVA",
     "Cuando una compra tiene percepcion, la percepcion no forma parte del credito fiscal, verdad? Me quedo la duda del practico 4."),
    ("jpcontable", "parcial", "CON-101", "Final de Contabilidad Basica - tema 2",
     "Comparto el tema 2 del final de diciembre. Ocho asientos, un mayor y el armado de la ecuacion patrimonial."),
    ("jpcontable", "recomendacion", "CON-301", "Orden recomendado para llegar a Auditoria",
     "Idealmente: Contabilidad Intermedia, despues Costos y Gestion, despues Impuestos I. Llegar a Auditoria sin Impuestos se puede pero se sufre."),
    ("cami.psi", "apunte", "PSI-301", "Cuadro comparativo de clasificaciones en Psicopatologia",
     "Arme un cuadro comparando los criterios de las principales clasificaciones diagnosticas trabajadas en la catedra, con las criticas que se le hacen a cada una."),
    ("cami.psi", "experiencia", "PSI-201", "Como me organice para Psicologia del Desarrollo",
     "Es una materia de mucha lectura. Lo que me funciono fue hacer fichas por autor y por etapa del ciclo vital, y releer solo las fichas antes del parcial."),
    ("agus.leyes", "pregunta", "ABO-201", "Diferencia entre control de constitucionalidad difuso y concentrado",
     "Necesito una explicacion clara con el ejemplo argentino. En el apunte de catedra esta muy resumido."),
    ("agus.leyes", "profesor", "ABO-301", "Catedra de Derecho Penal I - modalidad de evaluacion",
     "Dos parciales escritos con desarrollo y un final oral. Piden manejo de la teoria del delito con la estructura completa."),
    ("flor.nut", "material", "NUT-101", "Normativa alimentaria para consultar en Bromatologia",
     "Los cuadros del codigo alimentario que se piden en el TP estan disponibles publicamente. Recomiendo trabajar con la version actualizada y no con fotocopias viejas."),
    ("flor.nut", "pregunta", "NUT-201", "Como se calcula el requerimiento energetico en el caso 3?",
     "En el caso practico 3 no me cierra el factor de actividad. Alguien lo resolvio?"),
    ("mati.ali", "apunte", "ALI-201", "Resumen de transferencia de calor - Operaciones Unitarias",
     "Resumen con las ecuaciones de conduccion, conveccion y radiacion, mas los numeros adimensionales que se usan en la practica (Reynolds, Prandtl, Nusselt)."),
    ("mati.ali", "parcial", "ALI-301", "Parcial de Control de Calidad de Alimentos",
     "Modelo del primer parcial: planes de muestreo, cartas de control y un caso de analisis sensorial."),
    ("rocio.crim", "experiencia", "CRI-201", "Practicas de Balistica Forense: que esperar",
     "Se trabaja con material inerte y simulaciones. La parte teorica de trayectorias es la que mas cuesta, conviene repasar fisica de tiro oblicuo."),
    ("rocio.crim", "apunte", "CRI-101", "Apunte de cadena de custodia",
     "Resumen de los pasos formales de resguardo de indicios, con el detalle de la documentacion asociada a cada etapa."),
    ("tomi.fono", "pregunta", "FON-201", "Interpretacion de audiometrias: umbral aereo vs oseo",
     "Cuando el umbral oseo esta normal y el aereo descendido, es conductiva, no? Quiero confirmar antes del parcial."),
    ("belu.psp", "recomendacion", "PSP-201", "Instrumentos que mas se usan en Diagnostico Psicopedagogico",
     "En la practica de la catedra se trabaja principalmente con entrevista, hora de juego y pruebas pedagogicas. Conviene leer antes el marco teorico de cada instrumento."),
    ("mnahuel", "experiencia", "SIS-101", "Como aprobe Algoritmos en el primer intento",
     "Practicar todos los dias media hora, aunque sea un ejercicio chico. Y entregar los TPs aunque esten incompletos, porque la devolucion es lo que mas ensena."),
    ("nico_dev", "pregunta", "SIS-203", "Diferencia entre planificacion apropiativa y no apropiativa",
     "Entiendo la definicion pero no me queda claro como afecta al tiempo de respuesta promedio en el ejercicio de Round Robin."),
    ("mnahuel", "material", None, "Como usar el servidor http de Python para probar el TP",
     "Si abren los archivos con doble clic, el navegador usa el protocolo file y algunas cosas fallan.\n\nDesde la carpeta del proyecto:\n\npython3 -m http.server 8000\n\nY entran a localhost en el puerto 8000."),
    ("sofi.dg", "experiencia", None, "Se puede cursar dos carreras a la vez?",
     "Yo lo intente un cuatrimestre. Es posible si las cursadas no se superponen, pero hay que ser realista con la carga de trabajos practicos."),
    ("cami.psi", "profesor", None, "Como pedir una mesa especial de final",
     "El tramite se presenta en Alumnado con la justificacion. Conviene hacerlo con anticipacion porque tarda."),
    ("jpcontable", "apunte", "GEN-103", "Formulario de Estadistica para el parcial",
     "Una hoja con las formulas de medidas de posicion, dispersion, distribuciones y los intervalos de confianza mas usados."),
    ("nico_dev", "profesor", "SIS-101", "Catedra de Algoritmos: dos modalidades distintas",
     "La comision de la manana trabaja con pseudocodigo y la de la tarde arranca directo con codigo. El parcial es el mismo, asi que elijan por horario y no por modalidad."),
    ("agus.leyes", "material", "ABO-101", "Bibliografia basica de Introduccion al Derecho",
     "La catedra trabaja principalmente con el manual de teoria general y con seleccion de fallos. Los fallos son de acceso publico."),
    ("mati.ali", "pregunta", "ALI-101", "Como balancear la ecuacion del ejercicio 12 de Quimica General",
     "Es una redox en medio acido. Me quedan mal los electrones y no encuentro el error."),
    ("flor.nut", "experiencia", None, "Primer ano de Nutricion: lo que me hubiera gustado saber",
     "Que Quimica es filtro y que conviene no dejarla para el final del cuatrimestre. Y que el grupo de estudio hace mucha diferencia."),
    ("tomi.fono", "apunte", "FON-101", "Esquema de la anatomia del aparato fonador",
     "Esquema con las tres partes del aparato fonador y su funcion, mas un cuadro de los pares craneales implicados."),
    ("belu.psp", "experiencia", "PSP-101", "Aprendizaje y Cognicion: consejos de cursada",
     "Es teorica pero con muchos ejemplos de aula. Tomar nota de los ejemplos sirve mas que subrayar el apunte."),
    ("rocio.crim", "pregunta", "CRI-101", "Que diferencia hay entre indicio, evidencia y prueba?",
     "Los tres terminos aparecen en el apunte pero se usan casi como sinonimos y en el parcial los distinguen."),
    ("mnahuel", "recomendacion", "SIS-303", "Ingenieria de Software conviene cursarla despues de Analisis",
     "Aunque la correlativa no lo exija en todos los planes, tener Analisis de Sistemas antes hace que Ingenieria de Software se entienda mucho mejor."),
    ("nico_dev", "parcial", "SIS-304", "Parcial practico de Desarrollo Web",
     "Piden maquetar una pagina responsive con HTML semantico y CSS propio, y resolver una consigna de manipulacion del DOM con JavaScript."),
    ("cami.psi", "material", "PSI-101", "Lecturas complementarias de Psicologia General",
     "Ademas de la bibliografia obligatoria, la catedra sugiere textos de ampliacion que ayudan mucho para el final."),
    ("jpcontable", "experiencia", "CON-302", "Costos y Gestion: la materia bisagra de la carrera",
     "Es donde se junta todo lo contable con la toma de decisiones. Si la entendes bien, Auditoria se hace mucho mas simple."),
]

# Adjuntos: como maximo uno por publicacion, por eso son columnas y no entidad.
ADJUNTOS_DEF = {
    2: ("apunte-unificacion-backtracking.pdf", "pdf", 1840),
    3: ("modelo-parcial-bd-2025.pdf", "pdf", 620),
    8: ("composicion-visual-taller1.pdf", "pdf", 2410),
    10: ("final-contabilidad-basica-tema2.pdf", "pdf", 480),
    12: ("cuadro-clasificaciones-psicopatologia.pdf", "pdf", 760),
    18: ("resumen-transferencia-calor.pdf", "pdf", 1520),
    19: ("parcial-control-calidad.pdf", "pdf", 910),
    21: ("cadena-de-custodia.pdf", "pdf", 540),
    29: ("formulario-estadistica.pdf", "pdf", 320),
    34: ("esquema-aparato-fonador.png", "png", 880),
    38: ("consigna-parcial-desarrollo-web.pdf", "pdf", 410),
}

contenidos = []
publicaciones = []
siguiente_id = 1

for i, (u, categoria, codigo_mat, titulo, cuerpo) in enumerate(PUBLICACIONES_DEF, start=1):
    usuario_id = USR[u]
    materia_id = MAT[codigo_mat] if codigo_mat else None

    # La carrera es obligatoria. Si la publicacion trata sobre una materia, se
    # toma la carrera del autor cuando esa materia se dicta alli; si no, la
    # primera carrera que la dicta. Sin materia, la carrera del autor.
    carrera_autor = CARRERA_POR_USUARIO.get(usuario_id)
    if materia_id:
        posibles = CARRERAS_DE_MATERIA.get(materia_id, [])
        carrera_id = carrera_autor if carrera_autor in posibles else posibles[0]
    else:
        carrera_id = carrera_autor

    id_contenido = siguiente_id
    siguiente_id += 1
    creacion = fecha(-90 + i * 2, i % 12)

    contenidos.append({
        "idContenido": id_contenido,
        "usuarioId": usuario_id,
        "tipo": "publicacion",
        "cuerpo": cuerpo,
        "estado": "publicado",
        "fechaCreacion": creacion,
    })

    adjunto = ADJUNTOS_DEF.get(i)
    publicaciones.append({
        "idContenido": id_contenido,
        "carreraId": carrera_id,
        "materiaId": materia_id,
        "titulo": titulo,
        "categoria": categoria,
        "fijada": i in (1, 2),
        "visitas": random.randint(35, 940),
        "fechaActualizacion": creacion,
        "archivoNombre": adjunto[0] if adjunto else None,
        "archivoUrl": "assets/archivos/adjuntos/" + adjunto[0] if adjunto else None,
        "archivoTipo": adjunto[1] if adjunto else None,
        "archivoTamanoKb": adjunto[2] if adjunto else None,
    })

IDS_PUBLICACION = [p["idContenido"] for p in publicaciones]

# --------------------------------------------------------------------------
# 8. Comentarios (subtipo de CONTENIDO) con respuestas anidadas
# --------------------------------------------------------------------------
RESPUESTAS = [
    "Coincido, a mi me paso lo mismo el cuatrimestre pasado.",
    "Buenisimo el aporte, justo lo estaba buscando.",
    "Ojo que este ano cambio la modalidad de evaluacion, conviene confirmarlo con la catedra.",
    "Yo lo resolvi armando primero el esquema y despues las consultas. Me resulto mas ordenado.",
    "Gracias por compartir, deberia estar fijado.",
    "En la teorica lo explicaron distinto, pero el resultado es el mismo.",
    "Si necesitan mas ejemplos, la guia de trabajos practicos tiene tres resueltos.",
    "Exacto, esa es la interpretacion correcta segun el apunte de catedra.",
    "A mi me tomaron algo muy parecido en el recuperatorio.",
    "Recomiendo repasar la unidad anterior antes, si no queda colgado.",
    "Sumo un detalle: el criterio cambia si el caso es el excepcional.",
    "Perfecto, con esto me destrabo el ejercicio. Gracias.",
]

comentarios = []
usuarios_ids = [u["idUsuario"] for u in usuarios if u["rolId"] != 1]

for indice, publicacion in enumerate(publicaciones, start=1):
    id_publicacion = publicacion["idContenido"]
    raices = []
    for k in range(random.randint(1, 4)):
        autor = random.choice([x for x in usuarios_ids
                               if x != contenidos[id_publicacion - 1]["usuarioId"]])
        id_contenido = siguiente_id
        siguiente_id += 1
        contenidos.append({
            "idContenido": id_contenido, "usuarioId": autor, "tipo": "comentario",
            "cuerpo": random.choice(RESPUESTAS), "estado": "publicado",
            "fechaCreacion": fecha(-88 + indice * 2, k + 2),
        })
        comentarios.append({
            "idContenido": id_contenido,
            "publicacionId": id_publicacion,
            "comentarioPadreId": None,
        })
        raices.append(id_contenido)

    if raices and random.random() < 0.6:
        id_contenido = siguiente_id
        siguiente_id += 1
        contenidos.append({
            "idContenido": id_contenido, "usuarioId": random.choice(usuarios_ids),
            "tipo": "comentario", "cuerpo": random.choice(RESPUESTAS),
            "estado": "publicado", "fechaCreacion": fecha(-87 + indice * 2, 5),
        })
        comentarios.append({
            "idContenido": id_contenido,
            "publicacionId": id_publicacion,
            "comentarioPadreId": random.choice(raices),
        })

IDS_COMENTARIO = [c["idContenido"] for c in comentarios]

# --------------------------------------------------------------------------
# 9. Relaciones de interaccion: VOTA, GUARDA, REPORTA
#    Una sola coleccion de votos para publicaciones y comentarios: es lo que
#    habilita la generalizacion CONTENIDO.
# --------------------------------------------------------------------------
votos = []
for id_publicacion in IDS_PUBLICACION:
    for uid in random.sample(usuarios_ids, random.randint(3, min(11, len(usuarios_ids)))):
        votos.append({
            "usuarioId": uid, "contenidoId": id_publicacion,
            "valor": 1 if random.random() < 0.82 else -1,
            "fechaVoto": fecha(-80 + id_publicacion * 2, len(votos) % 20),
        })

for id_comentario in IDS_COMENTARIO:
    if random.random() < 0.55:
        for uid in random.sample(usuarios_ids, random.randint(1, 4)):
            votos.append({
                "usuarioId": uid, "contenidoId": id_comentario,
                "valor": 1 if random.random() < 0.85 else -1,
                "fechaVoto": fecha(-75, len(votos) % 23),
            })

favoritos = []
for uid in usuarios_ids:
    for id_publicacion in random.sample(IDS_PUBLICACION, random.randint(2, 6)):
        favoritos.append({
            "usuarioId": uid, "publicacionId": id_publicacion,
            "fecha": fecha(-60, len(favoritos) % 20),
        })

# La clave primaria (usuario, contenido) implica un reporte por par.
reportes = [
    {"usuarioId": USR["jpcontable"], "contenidoId": IDS_PUBLICACION[25],
     "motivo": "duplicado", "descripcion": "Ya existe una publicacion con el mismo contenido en la seccion de ayuda.",
     "estado": "pendiente", "fechaReporte": fecha(-20)},
    {"usuarioId": USR["cami.psi"], "contenidoId": IDS_COMENTARIO[4],
     "motivo": "contenido_inapropiado", "descripcion": "El comentario descalifica a un docente sin argumentos.",
     "estado": "pendiente", "fechaReporte": fecha(-18)},
    {"usuarioId": USR["mnahuel"], "contenidoId": IDS_PUBLICACION[14],
     "motivo": "informacion_incorrecta", "descripcion": "La modalidad de evaluacion que se indica no es la vigente.",
     "estado": "en_revision", "fechaReporte": fecha(-15)},
    {"usuarioId": USR["sofi.dg"], "contenidoId": IDS_COMENTARIO[11],
     "motivo": "spam", "descripcion": "Publica un enlace comercial sin relacion con la materia.",
     "estado": "resuelto", "fechaReporte": fecha(-12)},
    {"usuarioId": USR["nico_dev"], "contenidoId": IDS_PUBLICACION[8],
     "motivo": "material_con_derechos", "descripcion": "Podria estar compartiendo material protegido de la editorial.",
     "estado": "pendiente", "fechaReporte": fecha(-9)},
    {"usuarioId": USR["agus.leyes"], "contenidoId": IDS_COMENTARIO[19],
     "motivo": "contenido_inapropiado", "descripcion": "Trato descortes hacia otro estudiante.",
     "estado": "rechazado", "fechaReporte": fecha(-6)},
    {"usuarioId": USR["flor.nut"], "contenidoId": IDS_PUBLICACION[32],
     "motivo": "spam", "descripcion": "Repite el mismo texto en varias materias.",
     "estado": "pendiente", "fechaReporte": fecha(-3)},
]

# --------------------------------------------------------------------------
# 10. Acentuacion del contenido visible
#
# Las cadenas se declaran arriba sin tildes para que los identificadores y las
# claves de los diccionarios internos sean ASCII puro. Antes de emitir los
# archivos se restituye la ortografia correcta unicamente sobre los campos de
# texto que ve el usuario final. La base es utf8mb4, de modo que el SQL, el
# JSON y el HTML comparten exactamente las mismas cadenas.
# --------------------------------------------------------------------------
ACENTOS = {
    "Informacion": "Información", "informacion": "información",
    "Diseno": "Diseño", "diseno": "diseño",
    "Grafico": "Gráfico", "grafico": "gráfico", "graficos": "gráficos",
    "Publico": "Público", "publico": "público", "publica": "pública",
    "publicas": "públicas", "publicamente": "públicamente",
    "Ingenieria": "Ingeniería", "ingenieria": "ingeniería",
    "Criminalistica": "Criminalística", "criminalistica": "criminalística",
    "Psicologia": "Psicología", "psicologia": "psicología",
    "Fonoaudiologia": "Fonoaudiología", "Psicopedagogia": "Psicopedagogía",
    "Nutricion": "Nutrición", "nutricion": "nutrición", "nutricional": "nutricional",
    "Abogacia": "Abogacía",
    "Analisis": "Análisis", "analisis": "análisis",
    "Matematico": "Matemático", "Algebra": "Álgebra",
    "Analitica": "Analítica", "analitica": "analítica",
    "Geometria": "Geometría", "Limites": "Límites",
    "algoritmica": "algorítmica",
    "Programacion": "Programación", "programacion": "programación",
    "Basicos": "básicos", "basicas": "básicas", "basica": "básica", "Basica": "Básica",
    "practica": "práctica", "practicas": "prácticas", "Practicas": "Prácticas",
    "practico": "práctico", "practicos": "prácticos", "Practico": "Práctico",
    "teorica": "teórica", "teoricas": "teóricas", "teorico": "teórico",
    "Teoria": "Teoría", "teoria": "teoría",
    "Organizacion": "Organización",
    "instruccion": "instrucción", "instrucciones": "instrucciones",
    "abstraccion": "abstracción", "Abstraccion": "Abstracción",
    "Resolucion": "Resolución", "Anatomia": "Anatomía",
    "evaluacion": "evaluación", "Evaluacion": "Evaluación",
    "normalizacion": "normalización", "Normalizacion": "Normalización",
    "logico": "lógico",
    "metodologias": "metodologías", "gestion": "gestión", "Gestion": "Gestión",
    "Busqueda": "Búsqueda", "busqueda": "búsqueda",
    "representacion": "representación", "automatico": "automático",
    "ecuacion": "ecuación", "registracion": "registración",
    "Valuacion": "Valuación", "exposicion": "exposición",
    "Auditoria": "Auditoría", "auditoria": "auditoría",
    "Introduccion": "Introducción", "introduccion": "introducción",
    "garantias": "garantías",
    "percepcion": "percepción", "psiquico": "psíquico", "psiquicos": "psíquicos",
    "Psicopatologia": "Psicopatología", "psicopatologicos": "psicopatológicos",
    "Clasificacion": "Clasificación",
    "composicion": "composición", "Composicion": "Composición",
    "Tipografia": "Tipografía", "tipografica": "tipográfica",
    "diagramacion": "diagramación", "animacion": "animación",
    "produccion": "producción",
    "Balistica": "Balística", "balistica": "balística", "balisticas": "balísticas",
    "Anatomofisiologia": "Anatomofisiología",
    "Comunicacion": "Comunicación", "comunicacion": "comunicación",
    "anatomicas": "anatómicas", "audicion": "audición",
    "Audiologia": "Audiología", "Evaluacion": "Evaluación",
    "audiologica": "audiológica", "rehabilitacion": "rehabilitación",
    "Cognicion": "Cognición", "Diagnostico": "Diagnóstico",
    "diagnostico": "diagnóstico", "Psicopedagogico": "Psicopedagógico",
    "Bromatologia": "Bromatología", "conservacion": "conservación",
    "Clinica": "Clínica", "clinica": "clínica", "clinicos": "clínicos",
    "Quimica": "Química", "Estequiometria": "Estequiometría",
    "estequiometria": "estequiometría",
    "Ingles": "Inglés", "ingles": "inglés",
    "Tecnico": "Técnico", "tecnico": "técnico", "tecnicos": "técnicos",
    "Comprension": "Comprensión", "comprension": "comprensión",
    "Metodologia": "Metodología", "metodologia": "metodología",
    "Investigacion": "Investigación", "investigacion": "investigación",
    "hipotesis": "hipótesis", "tecnicas": "técnicas",
    "recoleccion": "recolección", "Estadistica": "Estadística",
    "estadistica": "estadística", "descriptiva": "descriptiva",
    "extincion": "extinción", "orientacion": "orientación",
    "area": "área", "ano": "año", "anos": "años",
    "catalogo": "catálogo", "academico": "académico", "academica": "académica",
    "Formacion": "Formación", "formacion": "formación",
    "implantacion": "implantación", "juridica": "jurídica",
    "cientifica": "científica", "ambitos": "ámbitos",
    "Prevencion": "Prevención", "Alimentacion": "Alimentación",
    "industrializacion": "industrialización",
    "Dudas": "Dudas", "Resumenes": "Resúmenes", "catedras": "cátedras",
    "Recomendacion": "Recomendación", "Sugerencias": "Sugerencias",
    "correlativas": "correlativas", "Bibliografia": "Bibliografía",
    "bibliografia": "bibliografía",
    "sesion": "sesión", "iniciada": "iniciada",
    # Nombres propios de las personas ficticias y de los docentes de referencia
    "Lucia": "Lucía", "Sofia": "Sofía", "Nicolas": "Nicolás", "Belen": "Belén",
    "Rocio": "Rocío", "Tomas": "Tomás", "Matias": "Matías", "Benitez": "Benítez",
    "Rios": "Ríos", "Sanchez": "Sánchez", "Zarate": "Zárate",
    "Fernandez": "Fernández",
    # Vocabulario de las publicaciones y los comentarios
    "diferencia": "diferencia", "Diferencia": "Diferencia",
    "unificacion": "unificación", "Unificacion": "Unificación",
    "paginas": "páginas", "arme": "armé", "Arme": "Armé",
    "Terminos": "Términos", "arbol": "árbol", "Arbol": "Árbol",
    "resolucion": "resolución", "Esta": "Está",
    "capitulo": "capítulo", "catedra": "cátedra", "Catedra": "Cátedra",
    "Tenia": "Tenía", "algebra": "álgebra", "agregacion": "agregación",
    "mas": "más", "manana": "mañana", "enfasis": "énfasis",
    "justificacion": "justificación", "curse": "cursé",
    "organizas": "organizás", "anticipacion": "anticipación",
    "trabajas": "trabajás", "dia": "día", "dias": "días", "dejaria": "dejaría",
    "Especificacion": "Especificación", "ningun": "ningún",
    "cambio": "cambió", "ultimo": "último", "correccion": "corrección",
    "jerarquia": "jerarquía", "proporcion": "proporción",
    "credito": "crédito", "quedo": "quedó", "calculo": "cálculo",
    "despues": "después", "criticas": "críticas",
    "organice": "organicé", "funciono": "funcionó",
    "explicacion": "explicación", "codigo": "código",
    "version": "versión", "energetico": "energético", "resolvio": "resolvió",
    "ecuaciones": "ecuaciones", "conduccion": "conducción",
    "conveccion": "convección", "radiacion": "radiación",
    "numeros": "números", "fisica": "física",
    "documentacion": "documentación", "Interpretacion": "Interpretación",
    "audiometrias": "audiometrías", "aereo": "aéreo", "oseo": "óseo",
    "pedagogicas": "pedagógicas", "aprobe": "aprobé",
    "esten": "estén", "devolucion": "devolución", "ensena": "enseña",
    "planificacion": "planificación", "definicion": "definición",
    "intente": "intenté", "tramite": "trámite",
    "formulas": "fórmulas", "posicion": "posición", "dispersion": "dispersión",
    "comision": "comisión", "pseudocodigo": "pseudocódigo",
    "seleccion": "selección", "acido": "ácido",
    "anatomia": "anatomía", "funcion": "función",
    "sinonimos": "sinónimos", "pagina": "página", "semantico": "semántico",
    "manipulacion": "manipulación", "Ademas": "Además",
    "ampliacion": "ampliación", "entendes": "entendés",
    "Buenisimo": "Buenísimo", "resolvi": "resolví", "resulto": "resultó",
    "deberia": "debería", "guia": "guía", "interpretacion": "interpretación",
    "segun": "según", "destrabo": "destrabó",
    "publicacion": "publicación", "Publicacion": "Publicación",
    "seccion": "sección", "descortes": "descortés",
    "relacion": "relación", "Podria": "Podría",
}

# Correcciones de frase completa: casos donde la tilde depende del contexto
# (interrogativos, mayormente) y no puede resolverse palabra por palabra.
PARCHES = [
    ("Como usar", "Cómo usar"),
    ("Como me organicé", "Cómo me organicé"),
    ("Como aprobé", "Cómo aprobé"),
    ("Como es la cátedra", "Cómo es la cátedra"),
    ("Como se calcula", "Cómo se calcula"),
    ("Como pedir", "Cómo pedir"),
    ("Como balancear", "Cómo balancear"),
    ("Que diferencia hay", "Qué diferencia hay"),
    ("que esperar", "qué esperar"),
    ("Que esperar", "Qué esperar"),
    ("no me queda claro como", "no me queda claro cómo"),
    ("Se puede cursar", "¿Se puede cursar"),
    ("Lo que mas", "Lo que más"),
    ("mas pesaba", "más pesaba"),
    ("a mi me paso lo mismo", "a mí me pasó lo mismo"),
    ("A mi me tomaron", "A mí me tomaron"),
    ("a mi me resulto", "a mí me resultó"),
]


def acentuar_texto(txt):
    salida, palabra = [], []
    for ch in txt:
        if ch.isalpha():
            palabra.append(ch)
        else:
            if palabra:
                w = "".join(palabra)
                salida.append(ACENTOS.get(w, w))
                palabra = []
            salida.append(ch)
    if palabra:
        w = "".join(palabra)
        salida.append(ACENTOS.get(w, w))
    resultado = "".join(salida)
    for buscar, reemplazar in PARCHES:
        resultado = resultado.replace(buscar, reemplazar)
    return resultado


CAMPOS_TEXTO = {"nombre", "apellido", "descripcion", "titulo", "cuerpo",
                "biografia", "sede", "docenteReferencia"}
CLAVES_ASCII = {"invitado", "usuario", "moderador", "administrador"}


def acentuar_coleccion(items):
    for it in items:
        for k, v in it.items():
            if k in CAMPOS_TEXTO and isinstance(v, str) and v not in CLAVES_ASCII:
                it[k] = acentuar_texto(v)


# --------------------------------------------------------------------------
# 11. Emision de los tres artefactos
# --------------------------------------------------------------------------
DATASET = {
    "roles": roles,
    "usuarios": usuarios,
    "carreras": carreras,
    "materias": materias,
    "carreraMateria": carrera_materia,
    "estudia": estudia,
    "programas": programas,
    "contenidos": contenidos,
    "publicaciones": publicaciones,
    "comentarios": comentarios,
    "votos": votos,
    "favoritos": favoritos,
    "reportes": reportes,
    # No es una tabla: es el dominio del atributo `categoria` de PUBLICACION.
    # Se emite para que la interfaz pueda mostrar nombre y descripcion.
    "categorias": categorias,
}

for _coleccion in DATASET.values():
    acentuar_coleccion(_coleccion)

ARCHIVOS_JSON = {
    "roles.json": "roles",
    "usuarios.json": "usuarios",
    "carreras.json": "carreras",
    "materias.json": "materias",
    "carrera-materia.json": "carreraMateria",
    "estudia.json": "estudia",
    "programas.json": "programas",
    "contenidos.json": "contenidos",
    "publicaciones.json": "publicaciones",
    "comentarios.json": "comentarios",
    "votos.json": "votos",
    "favoritos.json": "favoritos",
    "reportes.json": "reportes",
    "categorias.json": "categorias",
}

# Se limpian los JSON del modelo anterior para no dejar archivos huerfanos.
OBSOLETOS = ["planes.json", "plan-materia.json", "perfiles.json", "adjuntos.json",
             "votos-publicacion.json", "votos-comentario.json"]
for obsoleto in OBSOLETOS:
    ruta = os.path.join(RAIZ, "data", obsoleto)
    if os.path.exists(ruta):
        os.remove(ruta)

for archivo, clave in ARCHIVOS_JSON.items():
    with open(os.path.join(RAIZ, "data", archivo), "w", encoding="utf-8") as f:
        json.dump(DATASET[clave], f, ensure_ascii=False, indent=2)
        f.write("\n")

js = [
    "/**",
    " * dataset.js - Dataset de demostracion de FacuLeaks.",
    " *",
    " * ARCHIVO GENERADO. No editar a mano.",
    " * Fuente: database/tools/generar_datos.py",
    " *",
    " * Espeja exactamente el contenido de /data/*.json y de database/seed.sql.",
    " * Se embebe como script clasico para que el prototipo funcione tambien",
    " * abierto con el protocolo file://, donde fetch() de archivos locales falla.",
    " */",
    "window.FL = window.FL || {};",
    "FL.dataset = " + json.dumps(DATASET, ensure_ascii=False, indent=2) + ";",
    "",
]
with open(os.path.join(RAIZ, "assets", "js", "data", "dataset.js"), "w", encoding="utf-8") as f:
    f.write("\n".join(js))


def sql(v):
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "1" if v else "0"
    if isinstance(v, (int, float)):
        return str(v)
    return "'" + str(v).replace("\\", "\\\\").replace("'", "''") + "'"


def insert(tabla, columnas, filas):
    if not filas:
        return ""
    out = ["-- {} ({} registros)".format(tabla, len(filas)),
           "INSERT INTO {} ({}) VALUES".format(tabla, ", ".join(columnas))]
    out.append(",\n".join(" ({})".format(", ".join(sql(v) for v in fila)) for fila in filas) + ";")
    return "\n".join(out) + "\n"


bloques = [
    "-- =====================================================================",
    "-- FacuLeaks - seed.sql",
    "-- Datos iniciales y de demostracion.",
    "-- Requiere haber ejecutado previamente schema.sql.",
    "-- ARCHIVO GENERADO por database/tools/generar_datos.py",
    "-- =====================================================================",
    "",
    "USE faculeaks;",
    "",
    "SET FOREIGN_KEY_CHECKS = 0;",
    "TRUNCATE TABLE reportes;",
    "TRUNCATE TABLE favoritos;",
    "TRUNCATE TABLE votos;",
    "TRUNCATE TABLE comentarios;",
    "TRUNCATE TABLE publicaciones;",
    "TRUNCATE TABLE contenidos;",
    "TRUNCATE TABLE programas;",
    "TRUNCATE TABLE estudia;",
    "TRUNCATE TABLE carrera_materia;",
    "TRUNCATE TABLE materias;",
    "TRUNCATE TABLE carreras;",
    "TRUNCATE TABLE usuarios;",
    "TRUNCATE TABLE roles;",
    "SET FOREIGN_KEY_CHECKS = 1;",
    "",
    "START TRANSACTION;",
    "",
    insert("roles", ["id_rol", "nombre", "descripcion"],
           [(r["idRol"], r["nombre"], r["descripcion"]) for r in roles]),
    insert("usuarios",
           ["id_usuario", "rol_id", "username", "email", "password_hash", "nombre", "apellido",
            "avatar_url", "biografia", "estado", "fecha_registro"],
           [(u["idUsuario"], u["rolId"], u["username"], u["email"], u["passwordHash"], u["nombre"],
             u["apellido"], u["avatarUrl"], u["biografia"], u["estado"], u["fechaRegistro"])
            for u in usuarios]),
    insert("carreras", ["id_carrera", "nombre", "slug", "descripcion", "duracion_anios", "activa"],
           [(c["idCarrera"], c["nombre"], c["slug"], c["descripcion"], c["duracionAnios"], c["activa"])
            for c in carreras]),
    insert("materias", ["id_materia", "codigo", "nombre", "descripcion", "activa"],
           [(m["idMateria"], m["codigo"], m["nombre"], m["descripcion"], m["activa"])
            for m in materias]),
    insert("carrera_materia",
           ["carrera_id", "materia_id", "anio_cursada", "cuatrimestre", "obligatoria"],
           [(x["carreraId"], x["materiaId"], x["anioCursada"], x["cuatrimestre"], x["obligatoria"])
            for x in carrera_materia]),
    insert("estudia", ["usuario_id", "carrera_id", "anio_ingreso", "sede", "activo"],
           [(e["usuarioId"], e["carreraId"], e["anioIngreso"], e["sede"], e["activo"])
            for e in estudia]),
    insert("programas",
           ["materia_id", "anio_academico", "version", "titulo", "archivo_url",
            "docente_referencia", "cargado_por", "fecha_publicacion", "vigente"],
           [(p["materiaId"], p["anioAcademico"], p["version"], p["titulo"], p["archivoUrl"],
             p["docenteReferencia"], p["cargadoPor"], p["fechaPublicacion"], p["vigente"])
            for p in programas]),
    insert("contenidos",
           ["id_contenido", "usuario_id", "tipo", "cuerpo", "estado", "fecha_creacion"],
           [(c["idContenido"], c["usuarioId"], c["tipo"], c["cuerpo"], c["estado"],
             c["fechaCreacion"]) for c in contenidos]),
    insert("publicaciones",
           ["id_contenido", "carrera_id", "materia_id", "titulo", "categoria", "fijada",
            "visitas", "fecha_actualizacion", "archivo_nombre", "archivo_url",
            "archivo_tipo", "archivo_tamano_kb"],
           [(p["idContenido"], p["carreraId"], p["materiaId"], p["titulo"], p["categoria"],
             p["fijada"], p["visitas"], p["fechaActualizacion"], p["archivoNombre"],
             p["archivoUrl"], p["archivoTipo"], p["archivoTamanoKb"]) for p in publicaciones]),
    insert("comentarios", ["id_contenido", "publicacion_id", "comentario_padre_id"],
           [(c["idContenido"], c["publicacionId"], c["comentarioPadreId"]) for c in comentarios]),
    insert("votos", ["usuario_id", "contenido_id", "valor", "fecha_voto"],
           [(v["usuarioId"], v["contenidoId"], v["valor"], v["fechaVoto"]) for v in votos]),
    insert("favoritos", ["usuario_id", "publicacion_id", "fecha"],
           [(f["usuarioId"], f["publicacionId"], f["fecha"]) for f in favoritos]),
    insert("reportes", ["usuario_id", "contenido_id", "motivo", "descripcion", "estado", "fecha_reporte"],
           [(r["usuarioId"], r["contenidoId"], r["motivo"], r["descripcion"], r["estado"],
             r["fechaReporte"]) for r in reportes]),
    "COMMIT;",
    "",
]

with open(os.path.join(RAIZ, "database", "seed.sql"), "w", encoding="utf-8") as f:
    f.write("\n".join(bloques))

print("Generado OK")
for k, v in DATASET.items():
    print("  {:18s} {:5d}".format(k, len(v)))
print("  {:18s} {:5d}".format("materias en +1 carrera",
      sum(1 for ids in CARRERAS_DE_MATERIA.values() if len(ids) > 1)))
