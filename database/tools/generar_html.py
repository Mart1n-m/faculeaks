#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de las páginas HTML de FacuLeaks.

Todas las vistas comparten la misma cabecera <head>, el mismo esqueleto
semántico (skip link, <header>, <main>, <footer>) y la misma lista de scripts.
Este script mantiene esa estructura sincronizada en los 13 documentos en lugar
de duplicarla a mano.

Ejecutar desde la raíz del proyecto:  python3 database/tools/generar_html.py
"""
import os

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

SCRIPTS = [
    # Datos (espejo de /data/*.json). Debe cargarse antes que el repositorio.
    "assets/js/data/dataset.js",
    # Utilidades
    "assets/js/utils/dom.js",
    "assets/js/utils/formato.js",
    "assets/js/utils/almacenamiento.js",
    "assets/js/utils/validacion.js",
    # Capa de acceso a datos y servicios de dominio
    "assets/js/services/repositorio.js",
    "assets/js/services/sesionService.js",
    "assets/js/services/carrerasService.js",
    "assets/js/services/publicacionesService.js",
    "assets/js/services/comentariosService.js",
    "assets/js/services/interaccionesService.js",
    "assets/js/services/usuariosService.js",
    # Componentes reutilizables
    "assets/js/components/avisos.js",
    "assets/js/components/modal.js",
    "assets/js/components/encabezado.js",
    "assets/js/components/pie.js",
    "assets/js/components/migas.js",
    "assets/js/components/tarjetaPublicacion.js",
    "assets/js/components/tarjetaCarrera.js",
    "assets/js/components/paginacion.js",
]

PLANTILLA = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{descripcion}">
  <meta name="theme-color" content="#14294a">
  <title>{titulo}</title>
  <link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg">
  <link rel="stylesheet" href="assets/css/main.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body data-pagina="{pagina}" data-nav="{nav}">

  <a class="fl-saltar" href="#contenido-principal">Saltar al contenido principal</a>

  <header data-componente="encabezado"></header>

  <main id="contenido-principal" class="fl-principal">
{contenido}
  </main>

  <footer data-componente="pie"></footer>

{scripts}
</body>
</html>
"""


def bloque_scripts(modulo):
    rutas = SCRIPTS + ["assets/js/pages/%s.js" % modulo, "assets/js/app.js"]
    return "\n".join('  <script src="%s"></script>' % r for r in rutas)


PAGINAS = {}

# --------------------------------------------------------------------------
# index.html
# --------------------------------------------------------------------------
PAGINAS["index"] = dict(
    archivo="index.html", pagina="inicio", nav="inicio",
    titulo="FacuLeaks · Comunidad académica universitaria",
    descripcion="Consultá carreras, materias, programas y compartí apuntes, "
                "parciales y experiencias con otros estudiantes.",
    modulo="inicio",
    contenido="""
    <section class="fl-portada">
      <div class="fl-contenedor">
        <h1>Todo lo que se dice de tu carrera, <em>en un solo lugar</em></h1>
        <p>
          Explorá carreras, materias y programas. Preguntá, compartí apuntes,
          parciales y experiencias de cursada con el resto de la comunidad.
        </p>

        <form class="fl-portada__buscador" id="form-busqueda-portada" role="search" novalidate>
          <label class="fl-solo-lectores" for="busqueda-portada">Buscar en FacuLeaks</label>
          <div class="fl-buscador">
            <input class="fl-entrada" type="search" id="busqueda-portada"
                   placeholder="Buscar una materia, un tema o una duda…"
                   autocomplete="off">
            <button class="fl-boton fl-boton--acento" type="submit">Buscar</button>
          </div>
        </form>

        <div class="fl-portada__metricas" id="metricas"></div>
      </div>
    </section>

    <div class="fl-contenedor">
      <div class="fl-disposicion fl-disposicion--con-lateral">

        <div class="fl-columna-principal">
          <section class="fl-seccion" aria-labelledby="titulo-recientes">
            <div class="fl-seccion__cabecera">
              <h2 id="titulo-recientes">Publicaciones recientes</h2>
              <a href="buscar.html">Ver todas</a>
            </div>
            <div class="fl-cuadricula" id="publicaciones-recientes"></div>
          </section>

          <section class="fl-seccion" aria-labelledby="titulo-populares">
            <div class="fl-seccion__cabecera">
              <h2 id="titulo-populares">Lo más valorado</h2>
              <a href="buscar.html?orden=populares">Ver ranking</a>
            </div>
            <div class="fl-cuadricula" id="publicaciones-populares"></div>
          </section>

          <section class="fl-seccion" aria-labelledby="titulo-carreras">
            <div class="fl-seccion__cabecera">
              <h2 id="titulo-carreras">Carreras con más actividad</h2>
              <a href="carreras.html">Ver las 13 carreras</a>
            </div>
            <div class="fl-cuadricula fl-cuadricula--2 fl-cuadricula--3" id="carreras-destacadas"></div>
          </section>
        </div>

        <aside class="fl-barra-lateral" aria-label="Accesos rápidos">
          <div class="fl-tarjeta fl-panel-lateral" id="cta-sesion"></div>

          <div class="fl-tarjeta">
            <h3 class="fl-tarjeta__titulo">Categorías</h3>
            <div class="fl-chips" id="categorias-portada"></div>
          </div>

          <div class="fl-tarjeta">
            <h3 class="fl-tarjeta__titulo">Cómo funciona</h3>
            <ol class="fl-suave">
              <li>Elegí tu carrera y recorré su malla curricular.</li>
              <li>Entrá a una materia y consultá su programa.</li>
              <li>Preguntá, compartí material y votá lo que te sirvió.</li>
            </ol>
            <a class="fl-boton fl-boton--secundario fl-boton--bloque" href="carreras.html">
              Empezar por las carreras
            </a>
          </div>
        </aside>

      </div>
    </div>
""")

# --------------------------------------------------------------------------
# carreras.html
# --------------------------------------------------------------------------
PAGINAS["carreras"] = dict(
    archivo="carreras.html", pagina="carreras", nav="carreras",
    titulo="Carreras · FacuLeaks",
    descripcion="Listado completo de las carreras disponibles en FacuLeaks, "
                "con sus materias por año y cuatrimestre.",
    modulo="carreras",
    contenido="""
    <div class="fl-contenedor">
      <nav data-componente="migas"></nav>

      <div class="fl-seccion__cabecera">
        <div>
          <h1>Carreras</h1>
          <p class="fl-suave fl-mb0" id="contador-carreras">Cargando…</p>
        </div>
      </div>

      <form class="fl-tarjeta fl-seccion" id="form-carreras" role="search" novalidate>
        <div class="fl-fila-campos fl-fila-campos--2">
          <div class="fl-campo fl-mb0">
            <label for="buscar-carrera">Buscar carrera</label>
            <input class="fl-entrada" type="search" id="buscar-carrera"
                   placeholder="Por ejemplo: sistemas, contable, psicología"
                   autocomplete="off">
          </div>
          <div class="fl-campo fl-mb0">
            <label for="orden-carreras">Ordenar por</label>
            <select class="fl-select" id="orden-carreras">
              <option value="nombre">Nombre (A-Z)</option>
              <option value="publicaciones">Más publicaciones</option>
              <option value="materias">Más materias</option>
              <option value="duracion">Menor duración</option>
            </select>
          </div>
        </div>

        <fieldset class="fl-filtros__grupo">
          <legend class="fl-etiqueta">Duración</legend>
          <div class="fl-chips">
            <button class="fl-chip" type="button" data-duracion="corta" aria-pressed="false">
              Ciclos cortos (hasta 3 años)
            </button>
            <button class="fl-chip" type="button" data-duracion="larga" aria-pressed="false">
              Carreras largas (4 años o más)
            </button>
          </div>
        </fieldset>
      </form>

      <div class="fl-cuadricula fl-cuadricula--2 fl-cuadricula--3" id="lista-carreras"></div>
    </div>
""")

# --------------------------------------------------------------------------
# carrera.html
# --------------------------------------------------------------------------
PAGINAS["carrera"] = dict(
    archivo="carrera.html", pagina="carrera", nav="carreras",
    titulo="Carrera · FacuLeaks",
    descripcion="Ficha de la carrera: materias por año de cursada y "
                "publicaciones de la comunidad.",
    modulo="carrera",
    contenido="""
    <div class="fl-contenedor" id="contenido-carrera">
      <nav data-componente="migas"></nav>

      <header class="fl-seccion">
        <h1 id="nombre-carrera">Cargando…</h1>
        <p class="fl-suave" id="descripcion-carrera"></p>
        <div class="fl-chips" id="datos-carrera"></div>
      </header>

      <div class="fl-disposicion fl-disposicion--con-lateral">

        <div class="fl-columna-principal">
          <section class="fl-seccion" aria-labelledby="titulo-malla">
            <div class="fl-seccion__cabecera">
              <h2 id="titulo-malla">Materias por año</h2>
              <p class="fl-suave fl-mb0" id="contador-materias"></p>
            </div>
            <div id="malla-curricular"></div>
          </section>

          <section class="fl-seccion" aria-labelledby="titulo-pub-carrera">
            <div class="fl-seccion__cabecera">
              <h2 id="titulo-pub-carrera">Publicaciones de la carrera</h2>
            </div>
            <div class="fl-cuadricula" id="publicaciones-carrera"></div>
          </section>
        </div>

        <aside class="fl-barra-lateral" aria-label="Acciones de la carrera">
          <div class="fl-tarjeta fl-panel-lateral">
            <h3 class="fl-tarjeta__titulo">Participar</h3>
            <div class="fl-cuadricula" id="acciones-carrera"></div>
          </div>
        </aside>

      </div>
    </div>
""")

# --------------------------------------------------------------------------
# materia.html
# --------------------------------------------------------------------------
PAGINAS["materia"] = dict(
    archivo="materia.html", pagina="materia", nav="carreras",
    titulo="Materia · FacuLeaks",
    descripcion="Programas disponibles y foro de la materia: preguntas, apuntes, "
                "parciales y experiencias.",
    modulo="materia",
    contenido="""
    <div class="fl-contenedor" id="contenido-materia">
      <nav data-componente="migas"></nav>

      <header class="fl-seccion">
        <p class="fl-mb0"><span class="fl-codigo-materia" id="codigo-materia"></span></p>
        <h1 id="nombre-materia">Cargando…</h1>
        <p class="fl-suave" id="descripcion-materia"></p>
      </header>

      <div class="fl-disposicion fl-disposicion--con-lateral">

        <div class="fl-columna-principal">
          <section class="fl-seccion" aria-labelledby="titulo-programas">
            <div class="fl-seccion__cabecera">
              <h2 id="titulo-programas">Programas</h2>
            </div>
            <div id="lista-programas"></div>
          </section>

          <section class="fl-seccion" aria-labelledby="titulo-foro">
            <div class="fl-seccion__cabecera">
              <h2 id="titulo-foro">Foro de la materia</h2>
              <p class="fl-suave fl-mb0" id="contador-publicaciones"></p>
            </div>

            <div class="fl-tarjeta fl-seccion">
              <fieldset class="fl-filtros__grupo">
                <legend class="fl-etiqueta">Filtrar por categoría</legend>
                <div class="fl-chips" id="filtros-categoria"></div>
              </fieldset>
              <div class="fl-campo fl-mb0">
                <label for="orden-publicaciones">Ordenar por</label>
                <select class="fl-select" id="orden-publicaciones">
                  <option value="recientes">Más recientes</option>
                  <option value="populares">Más votadas</option>
                  <option value="comentadas">Más comentadas</option>
                  <option value="vistas">Más vistas</option>
                </select>
              </div>
            </div>

            <div class="fl-cuadricula" id="publicaciones-materia"></div>
            <div id="paginacion-materia"></div>
          </section>
        </div>

        <aside class="fl-barra-lateral" aria-label="Información de la materia">
          <div class="fl-tarjeta fl-panel-lateral">
            <h3 class="fl-tarjeta__titulo">Participar</h3>
            <div class="fl-cuadricula" id="acciones-materia"></div>
          </div>

          <div class="fl-tarjeta">
            <h3 class="fl-tarjeta__titulo">Se dicta en</h3>
            <div id="carreras-materia"></div>
          </div>
        </aside>

      </div>
    </div>
""")

# --------------------------------------------------------------------------
# publicacion.html
# --------------------------------------------------------------------------
PAGINAS["publicacion"] = dict(
    archivo="publicacion.html", pagina="publicacion", nav="buscar",
    titulo="Publicación · FacuLeaks",
    descripcion="Detalle de la publicación, con comentarios, respuestas anidadas, "
                "votación y adjuntos.",
    modulo="publicacion",
    contenido="""
    <div class="fl-contenedor" id="contenido-publicacion">
      <nav data-componente="migas"></nav>

      <div class="fl-disposicion fl-disposicion--con-lateral">

        <div class="fl-columna-principal">
          <article class="fl-tarjeta fl-seccion">
            <div class="fl-detalle-publicacion">
              <div id="votos-publicacion"></div>

              <div>
                <div class="fl-publicacion__meta" id="meta-publicacion"></div>
                <h1 id="titulo-publicacion">Cargando…</h1>
                <div class="fl-autor-publicacion fl-seccion" id="autor-publicacion"></div>
                <div class="fl-contenido-publicacion" id="cuerpo-publicacion"></div>

                <section id="seccion-adjuntos" class="fl-seccion fl-seccion--separada" hidden
                         aria-labelledby="titulo-adjuntos">
                  <h2 id="titulo-adjuntos">Archivos adjuntos</h2>
                  <ul class="fl-adjuntos" id="adjuntos-publicacion"></ul>
                </section>

                <div class="fl-acciones-fila" id="acciones-publicacion"></div>
              </div>
            </div>
          </article>

          <section class="fl-seccion" aria-labelledby="titulo-comentarios">
            <div class="fl-seccion__cabecera">
              <h2 id="titulo-comentarios">Comentarios</h2>
              <p class="fl-suave fl-mb0" id="contador-comentarios"></p>
            </div>

            <div class="fl-tarjeta fl-seccion" id="form-comentario-host"></div>

            <div class="fl-comentarios" id="lista-comentarios"></div>
          </section>
        </div>

        <aside class="fl-barra-lateral" aria-label="Normas de la comunidad">
          <div class="fl-tarjeta fl-panel-lateral">
            <h3 class="fl-tarjeta__titulo">Normas de la comunidad</h3>
            <ul class="fl-suave">
              <li>Compartí material propio o de acceso libre.</li>
              <li>Citá la cátedra y el año cuando corresponda.</li>
              <li>Criticá la propuesta académica, no a las personas.</li>
              <li>Usá el botón «Reportar» ante contenido inadecuado.</li>
            </ul>
            <a class="fl-boton fl-boton--secundario fl-boton--bloque" href="buscar.html">
              Explorar más publicaciones
            </a>
          </div>
        </aside>

      </div>
    </div>
""")

# --------------------------------------------------------------------------
# crear-publicacion.html
# --------------------------------------------------------------------------
PAGINAS["crear"] = dict(
    archivo="crear-publicacion.html", pagina="crearPublicacion", nav="crear",
    titulo="Nueva publicación · FacuLeaks",
    descripcion="Creá una publicación: elegí carrera, materia y categoría, y "
                "compartí tu contenido con la comunidad.",
    modulo="crearPublicacion",
    contenido="""
    <div class="fl-contenedor" id="contenido-crear">
      <nav data-componente="migas"></nav>

      <div class="fl-disposicion fl-disposicion--con-lateral">

        <div class="fl-columna-principal">
          <h1>Nueva publicación</h1>
          <p class="fl-suave">
            Los campos marcados con <span class="fl-requerido" aria-hidden="true">*</span>
            son obligatorios.
          </p>

          <form class="fl-tarjeta" id="form-publicacion" novalidate>

            <div class="fl-fila-campos fl-fila-campos--2">
              <div class="fl-campo">
                <label for="carrera">
                  Carrera <span class="fl-requerido" aria-hidden="true">*</span>
                </label>
                <select class="fl-select" id="carrera" data-campo="carreraId" required
                        aria-describedby="carrera-ayuda carrera-error">
                  <option value="">Cargando…</option>
                </select>
                <span class="fl-campo__ayuda" id="carrera-ayuda">
                  Toda publicación pertenece al ámbito de una carrera.
                </span>
                <span class="fl-error-campo" id="carrera-error"></span>
              </div>

              <div class="fl-campo">
                <label for="materia">Materia</label>
                <select class="fl-select" id="materia" data-campo="materiaId" disabled>
                  <option value="">Elegí primero una carrera</option>
                </select>
                <span class="fl-campo__ayuda">
                  Opcional: dejala vacía si tu consulta es general de la carrera.
                </span>
                <span class="fl-error-campo" id="materia-error"></span>
              </div>
            </div>

            <div class="fl-campo">
              <label for="categoria">
                Categoría <span class="fl-requerido" aria-hidden="true">*</span>
              </label>
              <select class="fl-select" id="categoria" data-campo="categoria" required
                      aria-describedby="categoria-error">
                <option value="">Cargando…</option>
              </select>
              <span class="fl-error-campo" id="categoria-error"></span>
            </div>

            <div class="fl-campo">
              <label for="titulo">
                Título <span class="fl-requerido" aria-hidden="true">*</span>
              </label>
              <input class="fl-entrada" type="text" id="titulo" data-campo="titulo"
                     maxlength="180" required aria-describedby="titulo-ayuda titulo-error"
                     placeholder="Resumí tu consulta o el material que compartís">
              <span class="fl-campo__ayuda" id="titulo-ayuda">Entre 5 y 180 caracteres.</span>
              <span class="fl-error-campo" id="titulo-error"></span>
            </div>

            <div class="fl-campo">
              <label for="contenido">
                Contenido <span class="fl-requerido" aria-hidden="true">*</span>
              </label>
              <textarea class="fl-area" id="contenido" data-campo="contenido" rows="12"
                        required aria-describedby="contador-contenido contenido-error"
                        placeholder="Contá el contexto: materia, cátedra, año, y qué necesitás o qué estás compartiendo."></textarea>
              <span class="fl-contador" id="contador-contenido"></span>
              <span class="fl-error-campo" id="contenido-error"></span>
            </div>

            <div class="fl-campo">
              <span class="fl-etiqueta" id="etiqueta-adjunto">Archivo adjunto</span>
              <div class="fl-zona-archivo">
                <p class="fl-mb0">Adjuntá un apunte, un modelo de parcial o material de estudio.</p>
                <label class="fl-solo-lectores" for="adjunto">Seleccionar archivo</label>
                <input type="file" id="adjunto" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.zip"
                       aria-describedby="adjunto-info">
                <p class="fl-tenue fl-mb0" id="adjunto-info">Ningún archivo seleccionado.</p>
              </div>
              <span class="fl-campo__ayuda">
                En esta entrega solo se registra la referencia al archivo: la subida real
                se implementa con el backend.
              </span>
            </div>

            <div class="fl-modal__acciones">
              <a class="fl-boton fl-boton--secundario" href="index.html">Cancelar</a>
              <button class="fl-boton" type="submit" id="enviar-publicacion">Publicar</button>
            </div>
          </form>
        </div>

        <aside class="fl-barra-lateral" aria-label="Consejos para publicar">
          <div class="fl-tarjeta fl-panel-lateral">
            <h3 class="fl-tarjeta__titulo">Para que te respondan rápido</h3>
            <ul class="fl-suave">
              <li>Elegí la materia exacta: la publicación aparece en su foro.</li>
              <li>Usá un título concreto en vez de «ayuda urgente».</li>
              <li>Contá qué intentaste y dónde te trabaste.</li>
              <li>Si compartís un parcial, indicá el año y la cátedra.</li>
            </ul>
          </div>
        </aside>

      </div>
    </div>
""")

# --------------------------------------------------------------------------
# buscar.html
# --------------------------------------------------------------------------
PAGINAS["buscar"] = dict(
    archivo="buscar.html", pagina="buscar", nav="buscar",
    titulo="Explorar publicaciones · FacuLeaks",
    descripcion="Buscá publicaciones por texto y filtrá por carrera, materia y categoría.",
    modulo="buscar",
    contenido="""
    <div class="fl-contenedor">
      <nav data-componente="migas"></nav>

      <h1>Explorar publicaciones</h1>

      <div class="fl-disposicion fl-disposicion--lateral-izq">

        <aside class="fl-barra-lateral" aria-label="Filtros de búsqueda">
          <form class="fl-tarjeta fl-panel-lateral" id="form-busqueda" role="search" novalidate>
            <div class="fl-campo">
              <label for="busqueda-texto">Buscar</label>
              <div class="fl-buscador">
                <input class="fl-entrada" type="search" id="busqueda-texto"
                       placeholder="Palabra clave" autocomplete="off">
                <button class="fl-boton" type="submit">Ir</button>
              </div>
            </div>

            <div class="fl-campo">
              <label for="filtro-carrera">Carrera</label>
              <select class="fl-select" id="filtro-carrera">
                <option value="">Todas las carreras</option>
              </select>
            </div>

            <div class="fl-campo">
              <label for="filtro-materia">Materia</label>
              <select class="fl-select" id="filtro-materia" disabled>
                <option value="">Todas las materias</option>
              </select>
            </div>

            <div class="fl-campo">
              <label for="filtro-categoria">Categoría</label>
              <select class="fl-select" id="filtro-categoria">
                <option value="">Todas las categorías</option>
              </select>
            </div>

            <div class="fl-campo">
              <label for="filtro-orden">Ordenar por</label>
              <select class="fl-select" id="filtro-orden">
                <option value="recientes">Más recientes</option>
                <option value="populares">Más votadas</option>
                <option value="comentadas">Más comentadas</option>
                <option value="vistas">Más vistas</option>
                <option value="antiguas">Más antiguas</option>
              </select>
            </div>

            <button class="fl-boton fl-boton--secundario fl-boton--bloque" type="button"
                    id="limpiar-filtros">Limpiar filtros</button>
          </form>
        </aside>

        <div class="fl-columna-principal">
          <div class="fl-seccion__cabecera">
            <p class="fl-suave fl-mb0" id="resumen-busqueda" aria-live="polite">Cargando…</p>
          </div>

          <div class="fl-chips fl-seccion" id="filtros-activos"></div>

          <div class="fl-cuadricula" id="resultados-busqueda"></div>
          <div id="paginacion-busqueda"></div>
        </div>

      </div>
    </div>
""")

# --------------------------------------------------------------------------
# login.html
# --------------------------------------------------------------------------
PAGINAS["login"] = dict(
    archivo="login.html", pagina="login", nav="login",
    titulo="Iniciar sesión · FacuLeaks",
    descripcion="Ingresá a tu cuenta de FacuLeaks para publicar, comentar y votar.",
    modulo="login",
    contenido="""
    <div class="fl-contenedor">
      <nav data-componente="migas"></nav>

      <div class="fl-disposicion fl-disposicion--con-lateral">

        <div class="fl-columna-principal">
          <h1>Iniciar sesión</h1>
          <p class="fl-suave">Ingresá con tu usuario o tu correo institucional.</p>

          <form class="fl-tarjeta" id="form-login" novalidate>
            <p class="fl-aviso fl-aviso--error" id="error-login" role="alert" hidden></p>

            <div class="fl-campo">
              <label for="identificador">Usuario o correo</label>
              <input class="fl-entrada" type="text" id="identificador" data-campo="identificador"
                     autocomplete="username" required aria-describedby="identificador-error">
              <span class="fl-error-campo" id="identificador-error"></span>
            </div>

            <div class="fl-campo">
              <label for="clave">Contraseña</label>
              <input class="fl-entrada" type="password" id="clave" data-campo="clave"
                     autocomplete="current-password" required aria-describedby="clave-ayuda clave-error">
              <span class="fl-campo__ayuda" id="clave-ayuda">
                Esta entrega no valida contraseñas: la verificación se implementa con el backend.
              </span>
              <span class="fl-error-campo" id="clave-error"></span>
            </div>

            <button class="fl-boton fl-boton--bloque" type="submit" id="enviar-login">Ingresar</button>

            <p class="fl-centrado fl-suave fl-mb0">
              ¿No tenés cuenta? <a href="registro.html">Creá una</a>.
            </p>
          </form>
        </div>

        <aside class="fl-barra-lateral" aria-label="Cuentas de demostración">
          <div class="fl-tarjeta fl-panel-lateral">
            <h3 class="fl-tarjeta__titulo">Cuentas de demostración</h3>
            <p class="fl-suave">
              Elegí una cuenta para entrar directamente y ver la interfaz de cada rol.
            </p>
            <ul class="fl-lista-materias" id="cuentas-demo"></ul>
          </div>
        </aside>

      </div>
    </div>
""")

# --------------------------------------------------------------------------
# registro.html
# --------------------------------------------------------------------------
PAGINAS["registro"] = dict(
    archivo="registro.html", pagina="registro", nav="registro",
    titulo="Crear cuenta · FacuLeaks",
    descripcion="Registrate en FacuLeaks y asociá la carrera que estás cursando.",
    modulo="registro",
    contenido="""
    <div class="fl-contenedor">
      <nav data-componente="migas"></nav>

      <div class="fl-disposicion fl-disposicion--con-lateral">

        <div class="fl-columna-principal">
          <h1>Crear cuenta</h1>
          <p class="fl-suave">
            Los campos marcados con <span class="fl-requerido" aria-hidden="true">*</span>
            son obligatorios.
          </p>

          <form class="fl-tarjeta" id="form-registro" novalidate>

            <fieldset>
              <legend class="fl-etiqueta">Datos personales</legend>

              <div class="fl-fila-campos fl-fila-campos--2">
                <div class="fl-campo">
                  <label for="nombre">Nombre <span class="fl-requerido" aria-hidden="true">*</span></label>
                  <input class="fl-entrada" type="text" id="nombre" data-campo="nombre"
                         autocomplete="given-name" required aria-describedby="nombre-error">
                  <span class="fl-error-campo" id="nombre-error"></span>
                </div>

                <div class="fl-campo">
                  <label for="apellido">Apellido <span class="fl-requerido" aria-hidden="true">*</span></label>
                  <input class="fl-entrada" type="text" id="apellido" data-campo="apellido"
                         autocomplete="family-name" required aria-describedby="apellido-error">
                  <span class="fl-error-campo" id="apellido-error"></span>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend class="fl-etiqueta">Datos de la cuenta</legend>

              <div class="fl-campo">
                <label for="username">Nombre de usuario <span class="fl-requerido" aria-hidden="true">*</span></label>
                <input class="fl-entrada" type="text" id="username" data-campo="username"
                       autocomplete="username" required aria-describedby="username-ayuda username-error">
                <span class="fl-campo__ayuda" id="username-ayuda">
                  Entre 3 y 30 caracteres. Solo letras, números, punto, guion y guion bajo.
                </span>
                <span class="fl-error-campo" id="username-error"></span>
              </div>

              <div class="fl-campo">
                <label for="email">Correo electrónico <span class="fl-requerido" aria-hidden="true">*</span></label>
                <input class="fl-entrada" type="email" id="email" data-campo="email"
                       autocomplete="email" required aria-describedby="email-error">
                <span class="fl-error-campo" id="email-error"></span>
              </div>

              <div class="fl-fila-campos fl-fila-campos--2">
                <div class="fl-campo">
                  <label for="password">Contraseña <span class="fl-requerido" aria-hidden="true">*</span></label>
                  <input class="fl-entrada" type="password" id="password" data-campo="password"
                         autocomplete="new-password" required aria-describedby="password-ayuda password-error">
                  <span class="fl-campo__ayuda" id="password-ayuda">
                    Mínimo 8 caracteres, combinando letras y números.
                  </span>
                  <span class="fl-error-campo" id="password-error"></span>
                </div>

                <div class="fl-campo">
                  <label for="password2">Repetir contraseña <span class="fl-requerido" aria-hidden="true">*</span></label>
                  <input class="fl-entrada" type="password" id="password2" data-campo="password2"
                         autocomplete="new-password" required aria-describedby="password2-error">
                  <span class="fl-error-campo" id="password2-error"></span>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend class="fl-etiqueta">Perfil académico (opcional)</legend>

              <div class="fl-fila-campos fl-fila-campos--2">
                <div class="fl-campo">
                  <label for="carrera">Carrera</label>
                  <select class="fl-select" id="carrera" data-campo="carreraId">
                    <option value="">Cargando…</option>
                  </select>
                  <span class="fl-campo__ayuda">
                    Podés sumar otras carreras más adelante desde tu perfil.
                  </span>
                  <span class="fl-error-campo" id="carrera-error"></span>
                </div>

                <div class="fl-campo">
                  <label for="anio-ingreso">Año de ingreso</label>
                  <input class="fl-entrada" type="number" id="anio-ingreso" data-campo="anioIngreso"
                         min="1950" max="2100" step="1" aria-describedby="anio-ingreso-error">
                  <span class="fl-error-campo" id="anio-ingreso-error"></span>
                </div>
              </div>
            </fieldset>

            <div class="fl-campo">
              <label class="fl-check" for="terminos">
                <input type="checkbox" id="terminos" data-campo="terminos"
                       aria-describedby="terminos-error">
                <span>
                  Acepto las normas de la comunidad: compartir material propio o de acceso
                  libre y mantener un trato respetuoso.
                  <span class="fl-requerido" aria-hidden="true">*</span>
                </span>
              </label>
              <span class="fl-error-campo" id="terminos-error"></span>
            </div>

            <button class="fl-boton fl-boton--bloque" type="submit" id="enviar-registro">
              Crear cuenta
            </button>

            <p class="fl-centrado fl-suave fl-mb0">
              ¿Ya tenés cuenta? <a href="login.html">Iniciá sesión</a>.
            </p>
          </form>
        </div>

        <aside class="fl-barra-lateral" aria-label="Sobre el registro">
          <div class="fl-tarjeta fl-panel-lateral">
            <h3 class="fl-tarjeta__titulo">Qué habilita tu cuenta</h3>
            <ul class="fl-suave">
              <li>Publicar preguntas, apuntes y parciales.</li>
              <li>Comentar y responder a otras personas.</li>
              <li>Votar el contenido que te resultó útil.</li>
              <li>Guardar publicaciones en favoritos.</li>
              <li>Reportar contenido inadecuado.</li>
            </ul>
            <p class="fl-tenue fl-mb0">
              En esta entrega los datos se guardan solo en tu navegador.
            </p>
          </div>
        </aside>

      </div>
    </div>
""")

# --------------------------------------------------------------------------
# perfil.html
# --------------------------------------------------------------------------
PAGINAS["perfil"] = dict(
    archivo="perfil.html", pagina="perfil", nav="perfil",
    titulo="Perfil · FacuLeaks",
    descripcion="Perfil de usuario: carrera, plan, publicaciones, comentarios y favoritos.",
    modulo="perfil",
    contenido="""
    <div class="fl-contenedor" id="contenido-perfil">
      <nav data-componente="migas"></nav>

      <div class="fl-disposicion fl-disposicion--con-lateral">

        <div class="fl-columna-principal">
          <header class="fl-tarjeta fl-seccion">
            <div class="fl-perfil-cabecera" id="cabecera-perfil"></div>
          </header>

          <div class="fl-estadisticas fl-seccion" id="estadisticas-perfil"></div>

          <div class="fl-tabs" id="tabs-perfil" role="tablist" aria-label="Actividad del usuario">
            <button class="fl-tabs__boton" type="button" role="tab" id="tab-publicaciones"
                    aria-selected="true" aria-controls="panel-publicaciones">Publicaciones</button>
            <button class="fl-tabs__boton" type="button" role="tab" id="tab-comentarios"
                    aria-selected="false" aria-controls="panel-comentarios">Comentarios</button>
            <button class="fl-tabs__boton" type="button" role="tab" id="tab-favoritos"
                    aria-selected="false" aria-controls="panel-favoritos">Favoritos</button>
          </div>

          <section class="fl-panel" id="panel-publicaciones" role="tabpanel"
                   aria-labelledby="tab-publicaciones" tabindex="0">
            <div class="fl-cuadricula" id="publicaciones-perfil"></div>
          </section>

          <section class="fl-panel" id="panel-comentarios" role="tabpanel"
                   aria-labelledby="tab-comentarios" tabindex="0" hidden>
            <div class="fl-comentarios" id="comentarios-perfil"></div>
          </section>

          <section class="fl-panel" id="panel-favoritos" role="tabpanel"
                   aria-labelledby="tab-favoritos" tabindex="0" hidden>
            <div class="fl-cuadricula" id="favoritos-perfil"></div>
          </section>
        </div>

        <aside class="fl-barra-lateral" aria-label="Datos académicos">
          <div class="fl-tarjeta fl-panel-lateral">
            <h3 class="fl-tarjeta__titulo">Perfil académico</h3>
            <div id="academico-perfil"></div>
          </div>

          <div class="fl-tarjeta">
            <h3 class="fl-tarjeta__titulo">Acciones</h3>
            <div class="fl-cuadricula" id="acciones-perfil"></div>
          </div>
        </aside>

      </div>
    </div>
""")

# --------------------------------------------------------------------------
# favoritos.html
# --------------------------------------------------------------------------
PAGINAS["favoritos"] = dict(
    archivo="favoritos.html", pagina="favoritos", nav="favoritos",
    titulo="Favoritos · FacuLeaks",
    descripcion="Publicaciones que guardaste para consultar más tarde.",
    modulo="favoritos",
    contenido="""
    <div class="fl-contenedor" id="contenido-favoritos">
      <nav data-componente="migas"></nav>

      <div class="fl-seccion__cabecera">
        <div>
          <h1>Favoritos</h1>
          <p class="fl-suave fl-mb0" id="contador-favoritos" aria-live="polite"></p>
        </div>
      </div>

      <div class="fl-tarjeta fl-seccion">
        <div class="fl-fila-campos fl-fila-campos--2">
          <div class="fl-campo fl-mb0">
            <label for="filtro-categoria-fav">Categoría</label>
            <select class="fl-select" id="filtro-categoria-fav">
              <option value="">Todas las categorías</option>
            </select>
          </div>
          <div class="fl-campo fl-mb0">
            <label for="orden-favoritos">Ordenar por</label>
            <select class="fl-select" id="orden-favoritos">
              <option value="recientes">Más recientes</option>
              <option value="populares">Más votadas</option>
              <option value="titulo">Título (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="fl-cuadricula" id="lista-favoritos"></div>
    </div>
""")

# --------------------------------------------------------------------------
# moderacion.html
# --------------------------------------------------------------------------
PAGINAS["moderacion"] = dict(
    archivo="moderacion.html", pagina="moderacion", nav="moderacion",
    titulo="Moderación · FacuLeaks",
    descripcion="Panel de moderación: cola de reportes de publicaciones y comentarios.",
    modulo="moderacion",
    contenido="""
    <div class="fl-contenedor" id="contenido-moderacion">
      <nav data-componente="migas"></nav>

      <h1>Panel de moderación</h1>
      <p class="fl-suave">
        Cola de reportes enviados por la comunidad. Cada reporte apunta a una
        publicación o a un comentario, nunca a ambos.
      </p>

      <div class="fl-estadisticas fl-seccion" id="resumen-moderacion"></div>

      <div class="fl-tarjeta fl-seccion">
        <fieldset class="fl-filtros__grupo">
          <legend class="fl-etiqueta">Filtrar por estado</legend>
          <div class="fl-chips">
            <button class="fl-chip" type="button" data-estado="pendiente" aria-pressed="false">Pendientes</button>
            <button class="fl-chip" type="button" data-estado="en_revision" aria-pressed="false">En revisión</button>
            <button class="fl-chip" type="button" data-estado="resuelto" aria-pressed="false">Resueltos</button>
            <button class="fl-chip" type="button" data-estado="rechazado" aria-pressed="false">Rechazados</button>
          </div>
        </fieldset>
      </div>

      <div class="fl-tabla-contenedor">
        <table class="fl-tabla" id="tabla-reportes">
          <caption>Reportes recibidos, del más reciente al más antiguo.</caption>
          <thead>
            <tr>
              <th scope="col">Reporte</th>
              <th scope="col">Tipo</th>
              <th scope="col">Contenido reportado</th>
              <th scope="col">Motivo</th>
              <th scope="col">Reportado por</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
""")

# --------------------------------------------------------------------------
# admin.html
# --------------------------------------------------------------------------
PAGINAS["admin"] = dict(
    archivo="admin.html", pagina="admin", nav="admin",
    titulo="Administración · FacuLeaks",
    descripcion="Administración de usuarios, carreras, materias, programas y "
                "categorías de publicación.",
    modulo="admin",
    contenido="""
    <div class="fl-contenedor" id="contenido-admin">
      <nav data-componente="migas"></nav>

      <h1>Administración</h1>
      <p class="fl-suave">
        Gestión del catálogo académico y de las cuentas de la comunidad.
      </p>

      <div class="fl-estadisticas fl-seccion" id="resumen-admin"></div>

      <div class="fl-tabs" id="tabs-admin" role="tablist" aria-label="Secciones de administración">
        <button class="fl-tabs__boton" type="button" role="tab" id="tab-usuarios"
                aria-selected="true" aria-controls="panel-usuarios">Usuarios</button>
        <button class="fl-tabs__boton" type="button" role="tab" id="tab-carreras"
                aria-selected="false" aria-controls="panel-carreras">Carreras</button>
        <button class="fl-tabs__boton" type="button" role="tab" id="tab-materias"
                aria-selected="false" aria-controls="panel-materias">Materias</button>
        <button class="fl-tabs__boton" type="button" role="tab" id="tab-programas"
                aria-selected="false" aria-controls="panel-programas">Programas</button>
        <button class="fl-tabs__boton" type="button" role="tab" id="tab-categorias"
                aria-selected="false" aria-controls="panel-categorias">Categorías</button>
      </div>

      <section class="fl-panel" id="panel-usuarios" role="tabpanel"
               aria-labelledby="tab-usuarios" tabindex="0">
        <div class="fl-campo">
          <label for="buscar-usuario">Buscar usuario</label>
          <input class="fl-entrada" type="search" id="buscar-usuario"
                 placeholder="Usuario, nombre o correo" autocomplete="off">
        </div>
        <div class="fl-tabla-contenedor">
          <table class="fl-tabla" id="tabla-usuarios">
            <caption>Cuentas registradas en la plataforma.</caption>
            <thead>
              <tr>
                <th scope="col">Usuario</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col">Alta</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </section>

      <section class="fl-panel" id="panel-carreras" role="tabpanel"
               aria-labelledby="tab-carreras" tabindex="0" hidden>
        <div class="fl-tabla-contenedor">
          <table class="fl-tabla" id="tabla-carreras">
            <caption>Carreras del catálogo académico.</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Duración</th>
                <th scope="col">Materias</th>
                <th scope="col">Publicaciones</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </section>

      <section class="fl-panel" id="panel-materias" role="tabpanel"
               aria-labelledby="tab-materias" tabindex="0" hidden>
        <div class="fl-tabla-contenedor">
          <table class="fl-tabla" id="tabla-materias">
            <caption>
              Catálogo global de materias. Una misma materia puede dictarse en varias carreras.
            </caption>
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Nombre</th>
                <th scope="col">En carreras</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </section>

      <section class="fl-panel" id="panel-programas" role="tabpanel"
               aria-labelledby="tab-programas" tabindex="0" hidden>
        <div class="fl-tabla-contenedor">
          <table class="fl-tabla" id="tabla-programas">
            <caption>
              Programas por materia. Cada uno se identifica por su materia, su ciclo lectivo
              y su versión: es una entidad débil.
            </caption>
            <thead>
              <tr>
                <th scope="col">Materia</th>
                <th scope="col">Ciclo</th>
                <th scope="col">Versión</th>
                <th scope="col">Docente</th>
                <th scope="col">Publicado</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </section>

      <section class="fl-panel" id="panel-categorias" role="tabpanel"
               aria-labelledby="tab-categorias" tabindex="0" hidden>
        <div class="fl-tabla-contenedor">
          <table class="fl-tabla" id="tabla-categorias">
            <caption>
              Valores admitidos para la categoría de una publicación.
            </caption>
            <thead>
              <tr>
                <th scope="col">Categoría</th>
                <th scope="col">Valor</th>
                <th scope="col">Descripción</th>
                <th scope="col">Publicaciones</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </section>
    </div>
""")


def main():
    for clave, pagina in PAGINAS.items():
        html = PLANTILLA.format(
            titulo=pagina["titulo"],
            descripcion=pagina["descripcion"],
            pagina=pagina["pagina"],
            nav=pagina["nav"],
            contenido=pagina["contenido"].rstrip("\n"),
            scripts=bloque_scripts(pagina["modulo"])
        )
        destino = os.path.join(RAIZ, pagina["archivo"])
        with open(destino, "w", encoding="utf-8") as f:
            f.write(html)
        print("  " + pagina["archivo"])
    print("%d páginas generadas." % len(PAGINAS))


if __name__ == "__main__":
    main()
