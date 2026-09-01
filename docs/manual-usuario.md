# Manual de usuario

## ¿Qué es FacuLeaks?

FacuLeaks es una comunidad donde los estudiantes de una universidad se ayudan entre sí.
Sirve para dos cosas:

1. **Consultar** información académica: qué carreras hay, qué materias tiene cada una y
   cuál es el programa de cada materia.
2. **Participar**: preguntar dudas, compartir apuntes y parciales, contar cómo es
   cursar una materia y responder a otras personas.

Cualquiera puede leer todo el contenido sin registrarse. Para publicar, comentar,
votar o guardar hace falta una cuenta.

> **Importante:** en esta versión el contenido es de demostración. Los usuarios,
> publicaciones y programas son inventados, y todo lo que hagas se guarda solo en tu
> navegador.

---

## Cómo entrar al sitio

Abrí la carpeta del proyecto y hacé doble clic en `index.html`, o —mejor— pedile a
quien te lo compartió la dirección del servidor local (habitualmente
`http://localhost:8000`).

---

## Cómo está organizado

Arriba de todo, en la barra azul, siempre vas a encontrar:

- **FacuLeaks** (a la izquierda): te lleva a la portada.
- **Inicio · Carreras · Explorar**: las tres secciones principales.
- A la derecha: **Iniciar sesión** y **Crear cuenta**, o tu nombre de usuario si ya
  entraste.

En pantallas de celular, el menú se esconde detrás del botón **☰**.

Debajo del título de cada página hay una **ruta de navegación** del estilo
*Inicio / Carreras / Ingeniería en Sistemas*. Sirve para saber dónde estás y para
volver atrás con un clic.

---

## Buscar una carrera

1. Hacé clic en **Carreras**.
2. Vas a ver las 13 carreras en tarjetas. Cada una muestra su duración, cuántas materias
   tiene y cuántas publicaciones hay sobre ella.
3. Podés escribir en **Buscar carrera** para filtrar (por ejemplo, «sistemas» o
   «contable»).
4. Con **Ordenar por** cambiás el criterio: nombre, más publicaciones, más materias o
   menor duración.
5. Los botones **Ciclos cortos** y **Carreras largas** filtran por duración. Volvé a
   apretarlos para desactivarlos.

---

## Ver las materias de una carrera

Al entrar a una carrera vas a ver:

- Una descripción y los datos generales.
- Las **materias agrupadas por año**, indicando el cuatrimestre y si son obligatorias u
  optativas.
- Las publicaciones recientes de esa carrera.

Hacé clic en cualquier materia para entrar a su página.

---

## Consultar los programas de una materia

Dentro de una materia encontrás tres bloques:

**Programas.** Cada programa muestra el ciclo lectivo, la versión y el docente de
referencia. Los marcados como **Vigente** son los actuales; los **Históricos** son de años
anteriores. El botón **Descargar** todavía es una simulación: avisa que el archivo se
servirá cuando el sistema tenga servidor.

**Se dicta en** (en la columna derecha). Muestra en qué carreras aparece esa materia, con
el año y el cuatrimestre en que se cursa en cada una, y si es obligatoria u optativa. La
misma materia puede ser de 3.º año y obligatoria en una carrera y optativa en otra.

**Foro de la materia.** Todas las publicaciones asociadas. Podés filtrarlas por
categoría con los botones de arriba y cambiar el orden: más recientes, más votadas,
más comentadas o más vistas. Si hay muchas, aparecen los botones **Anterior** y
**Siguiente** al final.

---

## Buscar publicaciones

Hacé clic en **Explorar** en el menú de arriba.

En la columna izquierda tenés todos los filtros:

- **Buscar**: escribí una palabra y apretá **Ir**. Busca en el título, el contenido, la
  materia y la carrera.
- **Carrera**: al elegir una, el filtro de materias se completa con las materias de esa
  carrera.
- **Materia** y **Categoría**.
- **Ordenar por**: recientes, más votadas, más comentadas, más vistas o más antiguas.

Los filtros activos aparecen como etiquetas arriba de los resultados; hacé clic en una
para quitarla. **Limpiar filtros** devuelve todo al estado inicial.

La dirección del navegador se actualiza con tus filtros: podés copiarla y compartirla,
y quien la abra verá exactamente los mismos resultados.

---

## Crear una cuenta

1. Hacé clic en **Crear cuenta**.
2. Completá nombre, apellido, nombre de usuario, correo y contraseña. Los campos con
   asterisco son obligatorios.
   - El nombre de usuario lleva entre 3 y 30 caracteres, y admite letras, números,
     punto, guion y guion bajo.
   - La contraseña necesita al menos 8 caracteres, combinando letras y números.
3. Opcionalmente elegí tu **carrera** y tu **año de ingreso**. Esos datos aparecen en tu
   perfil, y podés sumar más carreras después.
4. Marcá la casilla de las normas de la comunidad.
5. **Crear cuenta**.

Si algo está mal, el campo se marca en rojo con el motivo debajo. Corregilo y volvé a
enviar.

---

## Iniciar sesión

Hacé clic en **Iniciar sesión**, escribí tu usuario o tu correo y tu contraseña.

En esta versión **la contraseña no se verifica**: alcanza con que el usuario exista.
Para probar rápido, la columna derecha de esa página ofrece tres cuentas de
demostración; hacé clic en cualquiera y entrás directamente.

---

## Crear una publicación

Con la sesión iniciada, hacé clic en **Publicar** (arriba a la derecha) o en
**Publicar en esta materia** desde la página de una materia.

1. **Carrera** (obligatoria). Toda publicación se hace dentro del ámbito de una carrera.
   Al elegirla se cargan sus materias. Si tenés carrera en tu perfil, viene preseleccionada.
2. **Materia** (opcional). Dejala vacía si tu consulta es general de la carrera.
3. **Categoría** (obligatoria). Elegí la que mejor describa tu publicación:

   | Categoría | Cuándo usarla |
   |-----------|---------------|
   | Pregunta | Tenés una duda concreta |
   | Apunte | Compartís un resumen o material propio |
   | Parcial | Compartís un modelo de parcial o final |
   | Profesor | Contás cómo trabaja una cátedra |
   | Experiencia | Relatás tu cursada |
   | Recomendación | Sugerís un orden de cursado o un consejo |
   | Material | Compartís bibliografía o recursos |

4. **Título** (obligatorio): entre 5 y 180 caracteres. Sé concreto: «Duda con el
   ejercicio 4 de derivadas» funciona mucho mejor que «ayuda urgente».
5. **Contenido** (obligatorio): al menos 20 caracteres. Contá el contexto —materia,
   cátedra, año— y qué necesitás o qué estás compartiendo.
6. **Archivo adjunto** (opcional): en esta versión se registra el nombre del archivo,
   pero todavía no se sube.
7. **Publicar**. Vas directo a tu publicación.

---

## Comentar y responder

Dentro de una publicación, abajo del contenido:

- **Comentar**: escribí en el cuadro «Tu comentario» y apretá **Publicar comentario**.
  Necesita al menos 5 caracteres.
- **Responder** a un comentario: hacé clic en **Responder** debajo de ese comentario,
  escribí tu texto y enviá. Tu respuesta aparece indentada, dentro del comentario al
  que contestaste.

---

## Votar

Las flechas **▲** y **▼** sirven para indicar si algo te resultó útil.

- **▲** suma un punto, **▼** resta uno.
- Solo podés votar una vez cada publicación o comentario.
- Si volvés a apretar la misma flecha, tu voto se anula.
- Si apretás la flecha contraria, tu voto cambia de signo.

El número entre las flechas es el puntaje total.

---

## Guardar en favoritos

El botón **★** guarda una publicación para leerla después. Aparece en cada tarjeta y en
la página de la publicación.

Encontrás todo lo guardado en **Favoritos**, en el menú de arriba. Ahí podés filtrar
por categoría y ordenar por fecha, votos o título. Para quitar algo de favoritos, volvé
a apretar el **★**.

---

## Reportar contenido

Si una publicación o un comentario tiene spam, información incorrecta o falta el
respeto:

1. Hacé clic en **Reportar**.
2. Elegí el motivo.
3. Agregá un detalle si querés (es opcional pero ayuda).
4. **Enviar reporte**.

El reporte va a la cola de moderación. No se avisa a la persona que publicó.

---

## Tu perfil

Entrá desde tu nombre de usuario → **Mi perfil**.

Vas a ver tu foto, tu rol, desde cuándo sos miembro y cuatro números: publicaciones,
comentarios, puntaje acumulado y favoritos.

Debajo hay tres pestañas:

- **Publicaciones**: todo lo que publicaste.
- **Comentarios**: tus comentarios, con un enlace a la publicación de origen.
- **Favoritos**: lo que guardaste (solo vos ves esta pestaña).

En la columna derecha aparece tu **perfil académico** —carrera, año de ingreso y sede—.
Si estás inscripto en más de una carrera, aparecen todas.

Haciendo clic en el nombre de cualquier persona ves su perfil público, sin la pestaña
de favoritos.

---

## Cerrar sesión

Hacé clic en tu nombre de usuario arriba a la derecha y elegí **Cerrar sesión**.
También está disponible en tu perfil, en el bloque **Acciones**.

Al cerrar sesión volvés a ver el sitio como invitado: podés leer todo, pero no
participar.

---

## Funciones de moderador

Los moderadores tienen todo lo anterior, más el enlace **Moderación** en el menú.

En ese panel:

- Arriba, cuatro contadores: reportes pendientes, en revisión, resueltos y rechazados.
- Los botones **Pendientes / En revisión / Resueltos / Rechazados** filtran la tabla.
  Volvé a apretar el mismo botón para ver todo de nuevo.
- La tabla muestra cada reporte con el contenido denunciado (con enlace para verlo en
  contexto), el motivo, quién lo reportó y su estado actual.

Tres acciones por reporte:

| Acción | Cuándo usarla |
|--------|---------------|
| **Revisar** | Lo estás analizando; queda marcado como *en revisión* |
| **Resolver** | El reporte era válido y ya actuaste |
| **Rechazar** | El reporte no correspondía |

Los moderadores también pueden eliminar publicaciones y comentarios de cualquier
persona: los botones **Eliminar** aparecen para ellos en todo el contenido.

---

## Funciones de administrador

Los administradores tienen todo lo del moderador, más el enlace **Administración**.

Ese panel abre con cuatro totales del sistema y seis pestañas:

| Pestaña | Qué muestra | Qué se puede hacer |
|---------|-------------|--------------------|
| **Usuarios** | Todas las cuentas | Cambiar el rol y suspender o reactivar cuentas |
| **Carreras** | Las 13 carreras con sus totales | Consultar |
| **Materias** | El catálogo completo, y en cuántas carreras se dicta cada materia | Consultar |
| **Programas** | Los programas por materia, ciclo y versión | Consultar |
| **Categorías** | Las categorías y cuánto se usa cada una | Consultar |

Para cambiar el rol de alguien, elegí el nuevo valor en el desplegable de su fila: se
aplica al instante. **Suspender** deja la cuenta sin acceso; **Reactivar** la restituye.

La creación y edición del catálogo académico (dar de alta una carrera o una materia) se
implementa en la próxima entrega, cuando el sistema tenga servidor.

---

## Probar los distintos roles

Al final de cada página, en el pie, hay un selector llamado **Rol de demostración**.
Elegí *Invitado*, *Usuario*, *Moderador* o *Administrador* y la página se recarga con
ese rol, sin necesidad de cerrar sesión.

Es una herramienta de demostración de esta entrega: en la versión final el rol lo
determina el sistema según tu cuenta.

---

## Preguntas frecuentes

**¿Se pierde lo que publico?**
Se guarda en tu navegador. Si borrás los datos del navegador o abrís el sitio en otro
equipo, no vas a verlo. La versión con servidor guardará todo de forma permanente.

**¿Por qué no me pide bien la contraseña?**
Porque todavía no hay servidor que la verifique. Es intencional en esta entrega.

**¿Puedo descargar los programas?**
Todavía no: el botón avisa que la descarga es simulada. Los archivos reales llegan con
el servidor.

**¿Puedo estar en más de una carrera?**
Sí. El sistema admite que una persona estudie varias carreras a la vez.

**¿Cómo vuelvo al estado inicial?**
Borrá los datos del sitio desde las opciones de tu navegador. Todo vuelve al contenido
de demostración original.
