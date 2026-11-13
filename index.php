<?php
/**
 * FacuLeaks - Punto de entrada
 *
 * La vista (SPA) vive en public/. Esta redireccion permite abrir el proyecto
 * en http://localhost/faculeaks/ sin escribir /public.
 */
header('Location: public/', true, 302);
exit;
