# Portfolio de Ico — versión para publicar

Esta carpeta contiene el portfolio completo con recursos separados. No se ha publicado ni conectado a ningún dominio. Conserva los nueve proyectos, Refraction Proyect y los banners ASCII reducidos.

## Antes de publicar

1. Ejecuta `python configurar_publicacion.py "https://TU-DOMINIO/RUTA/"` con la URL real del portfolio. El ejemplo NO es una dirección para copiar literalmente.
2. El script añade al HTML la URL canónica, `og:url`, la URL absoluta de la imagen social y los enlaces absolutos de los datos estructurados. Genera `sitemap.xml` y completa `robots.txt` y el enlace de regreso de la página 404.
3. Sube `index.html`, `404.html`, `robots.txt`, `llms.txt`, `sitemap.xml`, `assets/` y `projects/` al alojamiento. Los scripts Python y este documento son herramientas locales; no es necesario publicarlos.
4. Configura el alojamiento para responder con estado HTTP **404** cuando no exista una ruta, mostrando `404.html`. No redirijas todas las rutas inexistentes a `index.html` con estado 200.
5. Si el portfolio está en una subcarpeta de un dominio compartido, el `robots.txt` que controla el rastreo debe estar en la raíz del dominio. Un archivo dentro de la subcarpeta no sustituye al de la raíz. El sitemap sí puede residir en la subcarpeta.

Para probar en tu ordenador: `python -m http.server 8000` dentro de esta carpeta y abre `http://localhost:8000/`. Este servidor simple permite probar los archivos, pero no configura el 404 personalizado del futuro alojamiento.

## Qué contiene

- HTML principal de aproximadamente 38 KB y tres archivos JavaScript pequeños, sin React, Vite ni dependencias de producción externas en el portfolio principal.
- Vídeo MP4 original de Refraction, imágenes y PDF separados del documento principal.
- Experiencias de Brockmann y Campo Gaussiano en documentos independientes, cargados al desplegar el proyecto. Llevan `noindex` para que no compitan como páginas incompletas con el portfolio principal.
- Portada social `assets/og-image.jpg`: un fotograma existente de Refraction Proyect. Su URL pública se añade con el configurador; la vista previa al compartir solo puede verificarse después de publicar.
- Favicon personalizado, metadatos, datos estructurados y página 404.
- `llms.txt` como resumen opcional para agentes. No sustituye al sitemap ni garantiza visibilidad en buscadores o sistemas de IA.

## Qué falta decidir

- La URL pública definitiva.
- Correo y enlaces sociales reales para activar contacto y CTA de contacto.
- Si se quiere una segunda versión de idioma y qué textos traducir.
- Si el modo oscuro encaja con la dirección visual del portfolio.
- Testimonios reales con autorización de publicación, si se decide incluirlos.

La versión HTML única entregada por separado conserva sus medios incrustados para abrirse como un solo archivo. La reducción de transferencia inicial corresponde a esta carpeta de publicación.

## Verificación pendiente en el alojamiento

Comprueba en un navegador real: reproducción y sonido, WebGL, teclado, móvil, consola y pestaña de red; estado 404 real; respuesta de robots y sitemap; URL canónica e imagen social pública. No se han medido Core Web Vitals ni Lighthouse, ni se ha hecho una revisión visual móvil de esta versión.
