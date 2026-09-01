#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador del diagrama entidad-relación de FacuLeaks en notación de Chen.

Produce docs/der-chen.html: una página autocontenida con tres láminas.
  Lámina 1 - Diagrama E-R: entidades, relaciones, cardinalidades y jerarquía.
  Lámina 2 - Atributos por entidad.
  Lámina 3 - Esquema relacional resultante del paso a tablas.

El SVG se genera por código para que la geometría sea reproducible y para
poder recalcular las posiciones de los atributos sin dibujarlas a mano.

Ejecutar desde la raíz del proyecto:  python3 database/tools/generar_der.py
"""
import math
import os

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# ==========================================================================
# Primitivas de la notación de Chen
# ==========================================================================


def entidad(cx, cy, w, h, texto, debil=False):
    """Rectángulo (doble si la entidad es débil)."""
    x, y = cx - w / 2, cy - h / 2
    partes = ['<rect class="e-caja" x="%g" y="%g" width="%g" height="%g" rx="3"/>' % (x, y, w, h)]
    if debil:
        partes.append('<rect class="e-caja e-caja--interna" x="%g" y="%g" width="%g" height="%g" rx="2"/>'
                      % (x + 6, y + 6, w - 12, h - 12))
    partes.append('<text class="e-texto" x="%g" y="%g">%s</text>' % (cx, cy + 6, texto))
    return "".join(partes)


def rombo(cx, cy, rx, ry, texto, identificadora=False, dos_lineas=None):
    """Rombo (doble si es una relación identificadora de una entidad débil)."""
    def diamante(dx, dy, clase):
        pts = "%g,%g %g,%g %g,%g %g,%g" % (cx, cy - dy, cx + dx, cy, cx, cy + dy, cx - dx, cy)
        return '<polygon class="%s" points="%s"/>' % (clase, pts)

    partes = [diamante(rx, ry, "r-caja")]
    if identificadora:
        partes.append(diamante(rx - 8, ry - 7, "r-caja r-caja--interna"))

    if dos_lineas:
        partes.append('<text class="r-texto" x="%g" y="%g">%s</text>' % (cx, cy - 2, dos_lineas[0]))
        partes.append('<text class="r-texto" x="%g" y="%g">%s</text>' % (cx, cy + 13, dos_lineas[1]))
    else:
        partes.append('<text class="r-texto" x="%g" y="%g">%s</text>' % (cx, cy + 5, texto))
    return "".join(partes)


def atributo(cx, cy, rx, ry, texto, identificador=False, parcial=False, derivado=False):
    """Elipse. El identificador va subrayado; el parcial, con guiones."""
    clase = "a-caja a-caja--derivado" if derivado else "a-caja"
    partes = ['<ellipse class="%s" cx="%g" cy="%g" rx="%g" ry="%g"/>' % (clase, cx, cy, rx, ry)]
    clase_texto = "a-texto"
    if identificador:
        clase_texto += " a-texto--clave"
    elif parcial:
        clase_texto += " a-texto--parcial"
    partes.append('<text class="%s" x="%g" y="%g">%s</text>' % (clase_texto, cx, cy + 4, texto))
    return "".join(partes)


def linea(puntos, doble=False):
    """Polilínea ortogonal. La línea doble marca participación total."""
    d = " ".join("%g,%g" % p for p in puntos)
    if not doble:
        return '<polyline class="v-linea" points="%s"/>' % d
    return ('<polyline class="v-linea v-linea--total" points="%s"/>'
            '<polyline class="v-linea v-linea--total-interna" points="%s"/>') % (d, d)


def cardinalidad(x, y, texto, anclaje="middle"):
    return ('<text class="c-texto" x="%g" y="%g" text-anchor="%s">%s</text>'
            % (x, y, anclaje, texto))


def salto(x, y, radio=9):
    """Puente sobre un cruce de líneas, como en un plano técnico."""
    return ('<path class="v-salto" d="M %g %g A %g %g 0 0 1 %g %g"/>'
            % (x, y + radio, radio, radio, x, y - radio))


def rol(x, y, texto, anclaje="middle"):
    return ('<text class="rol-texto" x="%g" y="%g" text-anchor="%s">%s</text>'
            % (x, y, anclaje, texto))


# ==========================================================================
# Lámina 1 - Diagrama entidad-relación
# ==========================================================================

def lamina_estructura():
    s = []

    # --- Entidades ---------------------------------------------------------
    s.append(entidad(150, 150, 150, 64, "ROL"))
    s.append(entidad(560, 150, 190, 64, "USUARIO"))
    s.append(entidad(1330, 150, 180, 64, "CARRERA"))
    s.append(entidad(1330, 470, 180, 64, "MATERIA"))
    s.append(entidad(1330, 800, 190, 68, "PROGRAMA", debil=True))
    s.append(entidad(560, 470, 190, 64, "CONTENIDO"))
    s.append(entidad(330, 830, 190, 64, "COMENTARIO"))
    s.append(entidad(800, 830, 200, 64, "PUBLICACIÓN"))

    # --- ROL — POSEE — USUARIO --------------------------------------------
    s.append(linea([(225, 150), (268, 150)]))
    s.append(linea([(392, 150), (465, 150)]))
    s.append(rombo(330, 150, 62, 38, "POSEE"))
    s.append(cardinalidad(246, 138, "(0,N)"))
    s.append(cardinalidad(428, 138, "(1,1)"))

    # --- USUARIO — ESTUDIA — CARRERA --------------------------------------
    s.append(linea([(655, 150), (870, 150)]))
    s.append(linea([(1010, 150), (1240, 150)]))
    s.append(rombo(940, 150, 70, 40, "", dos_lineas=["ESTUDIA", ""]))
    s.append(cardinalidad(760, 138, "(0,N)"))
    s.append(cardinalidad(1125, 138, "(0,N)"))

    # --- CARRERA — SE DICTA EN — MATERIA ----------------------------------
    s.append(linea([(1330, 182), (1330, 262)]))
    s.append(linea([(1330, 358), (1330, 438)]))
    s.append(rombo(1330, 310, 92, 48, "", dos_lineas=["SE DICTA", "EN"]))
    s.append(cardinalidad(1392, 236, "(0,N)"))
    s.append(cardinalidad(1390, 404, "(1,N)"))

    # --- MATERIA — TIENE PROGRAMA — PROGRAMA (relación identificadora) ----
    s.append(linea([(1330, 502), (1330, 592)]))
    s.append(linea([(1330, 688), (1330, 766)], doble=True))
    s.append(rombo(1330, 640, 96, 48, "", identificadora=True,
                   dos_lineas=["TIENE", "PROGRAMA"]))
    s.append(cardinalidad(1392, 556, "(0,N)"))
    s.append(cardinalidad(1392, 736, "(1,1)"))

    # --- USUARIO — CARGA — PROGRAMA (ruta por el borde superior) ----------
    s.append(linea([(600, 118), (600, 60), (1490, 60), (1490, 800), (1425, 800)]))
    s.append(rombo(1150, 60, 62, 34, "CARGA"))
    s.append(cardinalidad(660, 50, "(0,N)"))
    s.append(cardinalidad(1452, 838, "(0,1)"))

    # --- USUARIO — ESCRIBE / VOTA / REPORTA — CONTENIDO -------------------
    s.append(linea([(490, 182), (400, 272)]))
    s.append(linea([(400, 348), (490, 438)], doble=True))
    s.append(rombo(400, 310, 66, 38, "ESCRIBE"))
    s.append(cardinalidad(400, 208, "(0,N)"))
    s.append(cardinalidad(400, 424, "(1,1)"))

    s.append(linea([(560, 182), (560, 272)]))
    s.append(linea([(560, 348), (560, 438)]))
    s.append(rombo(560, 310, 60, 38, "VOTA"))
    s.append(cardinalidad(600, 208, "(0,N)"))
    s.append(cardinalidad(600, 424, "(0,N)"))

    s.append(linea([(630, 182), (720, 272)]))
    s.append(linea([(720, 348), (630, 438)]))
    s.append(rombo(720, 310, 68, 38, "REPORTA"))
    s.append(cardinalidad(724, 208, "(0,N)"))
    s.append(cardinalidad(724, 424, "(0,N)"))

    # --- Jerarquía ISA: CONTENIDO -> PUBLICACIÓN / COMENTARIO -------------
    s.append(linea([(560, 502), (560, 600)], doble=True))
    s.append('<circle class="isa-caja" cx="560" cy="630" r="30"/>')
    s.append('<text class="isa-texto" x="560" y="636">ISA</text>')
    s.append(linea([(560, 660), (560, 700), (330, 700), (330, 798)]))
    s.append(linea([(560, 700), (800, 700), (800, 798)]))
    s.append(rol(506, 556, "total,", "end"))
    s.append(rol(506, 572, "disjunta", "end"))

    # --- COMENTARIO — COMENTA — PUBLICACIÓN -------------------------------
    s.append(linea([(330, 862), (330, 1000), (495, 1000)], doble=True))
    s.append(linea([(760, 862), (760, 1000), (635, 1000)]))
    s.append(rombo(565, 1000, 70, 40, "COMENTA"))
    s.append(cardinalidad(374, 990, "(1,1)"))
    s.append(cardinalidad(716, 990, "(0,N)"))

    # --- COMENTARIO — RESPONDE A — COMENTARIO (reflexiva) -----------------
    s.append(linea([(235, 810), (140, 810), (140, 934)]))
    s.append(linea([(300, 862), (300, 970), (215, 970)]))
    s.append(rombo(140, 970, 75, 36, "", dos_lineas=["RESPONDE", "A"]))
    s.append(rol(186, 800, "respuesta", "middle"))
    s.append(rol(258, 900, "padre", "middle"))
    s.append(cardinalidad(140, 892, "(0,1)"))
    s.append(cardinalidad(258, 990, "(0,N)"))

    # --- USUARIO — GUARDA — PUBLICACIÓN -----------------------------------
    s.append(linea([(860, 862), (860, 1000), (930, 1000)]))
    s.append(linea([(1070, 1000), (1150, 1000), (1150, 230), (700, 230), (700, 182)]))
    s.append(rombo(1000, 1000, 68, 38, "GUARDA"))
    s.append(cardinalidad(880, 1032, "(0,N)"))
    s.append(cardinalidad(910, 218, "(0,N)"))

    # --- PUBLICACIÓN — TRATA SOBRE — MATERIA ------------------------------
    s.append(linea([(860, 798), (860, 640), (1006, 640)]))
    s.append(linea([(1154, 640), (1190, 640), (1190, 540), (1290, 540), (1290, 502)]))
    s.append(rombo(1080, 640, 78, 44, "", dos_lineas=["TRATA", "SOBRE"]))
    s.append(cardinalidad(902, 628, "(0,1)"))
    s.append(cardinalidad(1244, 528, "(0,N)"))

    # --- PUBLICACIÓN — PERTENECE A — CARRERA ------------------------------
    s.append(linea([(830, 862), (830, 930), (1002, 930)], doble=True))
    s.append(linea([(1158, 930), (1460, 930), (1460, 215), (1380, 215), (1380, 182)]))
    s.append(salto(1460, 800))
    s.append(rombo(1080, 930, 78, 44, "", dos_lineas=["PERTENECE", "A"]))
    s.append(cardinalidad(872, 918, "(1,1)"))
    s.append(cardinalidad(1428, 203, "(0,N)"))

    return ('<svg viewBox="0 0 1560 1090" role="img" '
            'aria-label="Diagrama entidad-relación de FacuLeaks en notación de Chen">'
            + "".join(s) + "</svg>")


# ==========================================================================
# Lámina 2 - Atributos por entidad
# ==========================================================================

ATRIBUTOS = [
    ("ROL", [("id_rol", "pk"), ("nombre", ""), ("descripcion", "")]),
    ("USUARIO", [("id_usuario", "pk"), ("username", ""), ("email", ""),
                 ("password_hash", ""), ("nombre", ""), ("apellido", ""),
                 ("avatar_url", ""), ("biografia", ""), ("estado", ""),
                 ("fecha_registro", "")]),
    ("CARRERA", [("id_carrera", "pk"), ("nombre", ""), ("slug", ""),
                 ("descripcion", ""), ("duracion_anios", ""), ("activa", "")]),
    ("MATERIA", [("id_materia", "pk"), ("codigo", ""), ("nombre", ""),
                 ("descripcion", ""), ("activa", "")]),
    ("CONTENIDO", [("id_contenido", "pk"), ("tipo", ""), ("cuerpo", ""),
                   ("estado", ""), ("fecha_creacion", "")]),
    ("PUBLICACIÓN", [("titulo", ""), ("categoria", ""), ("fijada", ""),
                     ("visitas", ""), ("fecha_actualizacion", ""),
                     ("archivo_nombre", ""), ("archivo_url", ""),
                     ("archivo_tipo", ""), ("archivo_tamano_kb", "")]),
    ("COMENTARIO", []),
    ("PROGRAMA", [("anio_academico", "parcial"), ("version", "parcial"),
                  ("titulo", ""), ("archivo_url", ""), ("docente_referencia", ""),
                  ("fecha_publicacion", ""), ("vigente", "")]),
]

NOTAS_ATRIBUTOS = {
    "PUBLICACIÓN": "Hereda el identificador de CONTENIDO.",
    "COMENTARIO": "No agrega atributos propios: hereda todo de CONTENIDO.",
    "PROGRAMA": "Entidad débil: su identificador es parcial y se completa con el de MATERIA.",
    "CONTENIDO": "«tipo» es el atributo discriminante de la especialización.",
}


def lamina_atributos_entidad(nombre, atributos):
    """Un mini-diagrama por entidad: la caja al centro y las elipses alrededor."""
    ancho, alto = 840, 560
    cx, cy = ancho / 2, alto / 2
    s = []

    n = len(atributos)
    if n:
        arx, ary = 64, 23
        # Con muchos atributos se escalonan en dos órbitas para que las
        # elipses vecinas no se toquen.
        escalonar = n >= 7
        for i, (texto, marca) in enumerate(atributos):
            rx_orbita = 300 if (not escalonar or i % 2 == 0) else 352
            ry_orbita = 180 if (not escalonar or i % 2 == 0) else 224
            ang = -math.pi / 2 + (2 * math.pi * i / n)
            ax = cx + rx_orbita * math.cos(ang)
            ay = cy + ry_orbita * math.sin(ang)
            # La línea sale del borde de la caja hacia el borde de la elipse.
            bx = cx + (75 * math.cos(ang))
            by = cy + (32 * math.sin(ang))
            ex = ax - arx * math.cos(ang) * 0.92
            ey = ay - ary * math.sin(ang) * 0.92
            s.append(linea([(bx, by), (ex, ey)]))
            s.append(atributo(ax, ay, arx, ary, texto,
                              identificador=(marca == "pk"),
                              parcial=(marca == "parcial")))

    debil = nombre == "PROGRAMA"
    s.append(entidad(cx, cy, 190, 64, nombre, debil=debil))

    return ('<svg viewBox="0 0 %d %d" role="img" aria-label="Atributos de la entidad %s">%s</svg>'
            % (ancho, alto, nombre, "".join(s)))


# ==========================================================================
# Lámina 3 - Esquema relacional
# ==========================================================================

TABLAS = [
    ("roles", "Entidad ROL", [
        ("id_rol", "PK", "INT UNSIGNED"),
        ("nombre", "UNIQUE", "VARCHAR(30)"),
        ("descripcion", "", "VARCHAR(255)"),
    ]),
    ("usuarios", "Entidad USUARIO + relación POSEE", [
        ("id_usuario", "PK", "INT UNSIGNED"),
        ("rol_id", "FK → roles", "INT UNSIGNED"),
        ("username", "UNIQUE", "VARCHAR(30)"),
        ("email", "UNIQUE", "VARCHAR(120)"),
        ("password_hash", "", "VARCHAR(255)"),
        ("nombre, apellido", "", "VARCHAR(60)"),
        ("avatar_url, biografia", "", "VARCHAR"),
        ("estado", "ENUM", "activo · suspendido · eliminado"),
        ("fecha_registro", "", "DATETIME"),
    ]),
    ("carreras", "Entidad CARRERA", [
        ("id_carrera", "PK", "INT UNSIGNED"),
        ("nombre", "UNIQUE", "VARCHAR(120)"),
        ("slug", "UNIQUE", "VARCHAR(140)"),
        ("descripcion", "", "VARCHAR(500)"),
        ("duracion_anios", "CHECK 1-8", "TINYINT"),
        ("activa", "", "BOOLEAN"),
    ]),
    ("materias", "Entidad MATERIA", [
        ("id_materia", "PK", "INT UNSIGNED"),
        ("codigo", "UNIQUE", "VARCHAR(20)"),
        ("nombre", "", "VARCHAR(120)"),
        ("descripcion", "", "VARCHAR(500)"),
        ("activa", "", "BOOLEAN"),
    ]),
    ("carrera_materia", "Relación SE DICTA EN (N:M con atributos)", [
        ("carrera_id", "PK · FK → carreras", "INT UNSIGNED"),
        ("materia_id", "PK · FK → materias", "INT UNSIGNED"),
        ("anio_cursada", "CHECK 1-8", "TINYINT"),
        ("cuatrimestre", "CHECK 1-3", "TINYINT"),
        ("obligatoria", "", "BOOLEAN"),
    ]),
    ("estudia", "Relación ESTUDIA (N:M con atributos)", [
        ("usuario_id", "PK · FK → usuarios", "INT UNSIGNED"),
        ("carrera_id", "PK · FK → carreras", "INT UNSIGNED"),
        ("anio_ingreso", "CHECK 1950-2100", "SMALLINT"),
        ("sede", "", "VARCHAR(80)"),
        ("activo", "", "BOOLEAN"),
    ]),
    ("programas", "Entidad débil PROGRAMA + relación CARGA", [
        ("materia_id", "PK · FK → materias", "INT UNSIGNED"),
        ("anio_academico", "PK", "SMALLINT"),
        ("version", "PK", "VARCHAR(20)"),
        ("titulo", "", "VARCHAR(180)"),
        ("archivo_url", "", "VARCHAR(255)"),
        ("docente_referencia", "", "VARCHAR(120)"),
        ("cargado_por", "FK → usuarios", "INT UNSIGNED NULL"),
        ("fecha_publicacion", "", "DATETIME"),
        ("vigente", "", "BOOLEAN"),
    ]),
    ("contenidos", "Supertipo CONTENIDO + relación ESCRIBE", [
        ("id_contenido", "PK", "INT UNSIGNED"),
        ("usuario_id", "FK → usuarios", "INT UNSIGNED"),
        ("tipo", "ENUM · discriminante", "publicacion · comentario"),
        ("cuerpo", "", "TEXT"),
        ("estado", "ENUM", "publicado · oculto · eliminado"),
        ("fecha_creacion", "", "DATETIME"),
    ]),
    ("publicaciones", "Subtipo PUBLICACIÓN + PERTENECE A + TRATA SOBRE", [
        ("id_contenido", "PK · FK → contenidos", "INT UNSIGNED"),
        ("carrera_id", "FK → carreras", "INT UNSIGNED"),
        ("materia_id", "FK → materias", "INT UNSIGNED NULL"),
        ("titulo", "CHECK ≥ 5", "VARCHAR(180)"),
        ("categoria", "ENUM", "pregunta · apunte · parcial · …"),
        ("fijada, visitas", "", "BOOLEAN · INT"),
        ("fecha_actualizacion", "", "DATETIME"),
        ("archivo_nombre, archivo_url", "CHECK todo o nada", "VARCHAR NULL"),
        ("archivo_tipo, archivo_tamano_kb", "CHECK ≤ 20 MB", "VARCHAR · INT NULL"),
    ]),
    ("comentarios", "Subtipo COMENTARIO + COMENTA + RESPONDE A", [
        ("id_contenido", "PK · FK → contenidos", "INT UNSIGNED"),
        ("publicacion_id", "FK → publicaciones", "INT UNSIGNED"),
        ("comentario_padre_id", "FK → comentarios", "INT UNSIGNED NULL"),
    ]),
    ("votos", "Relación VOTA (N:M con atributos)", [
        ("usuario_id", "PK · FK → usuarios", "INT UNSIGNED"),
        ("contenido_id", "PK · FK → contenidos", "INT UNSIGNED"),
        ("valor", "CHECK ∈ {-1, 1}", "TINYINT"),
        ("fecha_voto", "", "DATETIME"),
    ]),
    ("favoritos", "Relación GUARDA (N:M)", [
        ("usuario_id", "PK · FK → usuarios", "INT UNSIGNED"),
        ("publicacion_id", "PK · FK → publicaciones", "INT UNSIGNED"),
        ("fecha", "", "DATETIME"),
    ]),
    ("reportes", "Relación REPORTA (N:M con atributos)", [
        ("usuario_id", "PK · FK → usuarios", "INT UNSIGNED"),
        ("contenido_id", "PK · FK → contenidos", "INT UNSIGNED"),
        ("motivo", "ENUM", "spam · contenido_inapropiado · …"),
        ("descripcion", "", "VARCHAR(500)"),
        ("estado", "ENUM", "pendiente · en_revision · …"),
        ("fecha_reporte", "", "DATETIME"),
    ]),
]


def tabla_html(nombre, origen, columnas):
    filas = []
    for col, marca, tipo in columnas:
        clase = "col"
        if marca.startswith("PK"):
            clase += " col--pk"
        elif marca.startswith("FK"):
            clase += " col--fk"
        filas.append(
            '<tr><th scope="row" class="%s">%s</th><td class="marca">%s</td>'
            '<td class="tipo">%s</td></tr>' % (clase, col, marca or "—", tipo))
    return ('<article class="tabla">'
            '<header class="tabla__cab"><h3>%s</h3><p>%s</p></header>'
            '<div class="tabla__scroll"><table>'
            '<caption class="fl-oculto">Columnas de la tabla %s</caption>'
            '<thead><tr><th scope="col">Columna</th><th scope="col">Restricción</th>'
            '<th scope="col">Tipo</th></tr></thead>'
            '<tbody>%s</tbody></table></div></article>'
            % (nombre, origen, nombre, "".join(filas)))


# ==========================================================================
# Documento
# ==========================================================================

def construir():
    plantilla = open(os.path.join(os.path.dirname(__file__), "der-plantilla.html"),
                     encoding="utf-8").read()

    plates = []
    for nombre, atributos in ATRIBUTOS:
        nota = NOTAS_ATRIBUTOS.get(nombre, "")
        plates.append(
            '<figure class="mini"><div class="mini__lienzo">%s</div>'
            '<figcaption><strong>%s</strong>%s</figcaption></figure>'
            % (lamina_atributos_entidad(nombre, atributos), nombre,
               ('<span>' + nota + '</span>') if nota else ''))

    return (plantilla
            .replace("<!--DIAGRAMA-->", lamina_estructura())
            .replace("<!--ATRIBUTOS-->", "".join(plates))
            .replace("<!--TABLAS-->", "".join(tabla_html(*t) for t in TABLAS)))


ENVOLTORIO = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Diagrama entidad-relacion de FacuLeaks en notacion de Chen: entidades, relaciones, cardinalidades y esquema relacional resultante.">
<meta name="theme-color" content="#14294a">
<link rel="icon" type="image/svg+xml" href="../assets/img/favicon.svg">
</head>
<body>
%s
</body>
</html>
"""


if __name__ == "__main__":
    contenido = construir()

    destino = os.path.join(RAIZ, "docs", "der-chen.html")
    with open(destino, "w", encoding="utf-8") as f:
        f.write(ENVOLTORIO % contenido)
    print("Generado docs/der-chen.html")

    # Copia sin <html>/<head>/<body> para publicarla como pagina consultable.
    suelto = os.environ.get("FL_DER_SUELTO")
    if suelto:
        with open(suelto, "w", encoding="utf-8") as f:
            f.write(contenido)
        print("Generado " + suelto)
