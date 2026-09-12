# Auditoría del portfolio de Ico

Revisión del 12 de septiembre de 2026. Se ha usado la última copia editada en esta conversación: Refraction Proyect integrado y banners ASCII reducidos un 30 %. El nuevo adjunto no estuvo disponible. No se ha auditado ni modificado un sitio público.

**Resultado:** la web ya tenía una base funcional en HTML, CSS y JavaScript. No era un documento vacío ni una plantilla «Vite + React». Las carencias principales estaban en la semántica, el acceso con teclado, la preparación para publicar y el peso del HTML.

Se entregan dos formatos: el HTML único actualizado, que conserva los medios incrustados, y un ZIP con una versión para publicar que separa los recursos y los carga al abrir cada experiencia.

## Los 20 puntos de experiencia

| Punto | Estado encontrado | Corrección aplicada o manera de completarlo |
| --- | --- | --- |
| 1. Animaciones al hacer scroll | Había desplazamiento suave, pero no aparición gradual de secciones. | Añadida una entrada discreta de proyectos al entrar en pantalla. Se respeta la preferencia de movimiento reducido. |
| 2. Microinteracciones en botones | Había respuestas de cursor, apertura y cambios de color. | Añadidos estados de pulsación y foco visible; se mantiene la interacción original. |
| 3. Estados hover | Sí: títulos, botones y banners ASCII. | Conservados; el teclado tiene ahora una indicación equivalente de foco. |
| 4. Adaptación móvil | Sí en código: media queries, tamaños fluidos y vídeo adaptable. | Ajustados los objetivos táctiles, la cabecera y los títulos largos. El contenedor del perfil permite scroll vertical; solo la esfera captura el arrastre. Pendiente revisión visual en móvil real. |
| 5. Navegación móvil | Dos enlaces visibles: perfil y proyectos. | Se conservan y se mejoran sus zonas táctiles. Con solo dos destinos no hace falta añadir un menú hamburguesa. |
| 6. Favicon propio | No. | Añadido un icono «ico» en SVG. |
| 7. Volver arriba | Había enlace al final de la página. | Conservado y añadido un botón flotante que aparece tras desplazarse. |
| 8. Loading / skeleton | No había un estado de carga explícito para los visores. | Añadidos mensajes de carga y fondo animado de espera en visores; mensajes para el vídeo. No se introduce una pantalla inicial que retrase la entrada. |
| 9. Transiciones | Sí en acordeones y ventanas de proyectos. | Conservadas, con gestión de foco y contenido cerrado fuera del recorrido del teclado. |
| 10. Animación del hero | Sí, campo ASCII. | Conservada. Se reduce su frecuencia de dibujo y se evita recalcularla fuera de pantalla. Con movimiento reducido queda estática. |
| 11. CTA repetido | Había acceso a proyectos y botones de cada caso. | Añadido «ver proyectos» en el hero. Un CTA de contacto necesita un destino real. |
| 12. Contacto | No hay correo, formulario ni destino de contacto en este archivo. | Falta tu correo profesional. La opción más sencilla es un enlace de correo en cabecera y al final. Si prefieres formulario, requiere un servicio de recepción. |
| 13. Validación | No existe formulario de contacto. La experiencia gaussiana sí valida formatos PLY. | No hay envío que validar en la portada. Para un futuro formulario: campos requeridos, tipo email, errores por campo y validación también en el servidor. |
| 14. Éxito / error | No había mensajes de carga de medios; el experimento gaussiano ya contemplaba fallos WebGL. | Añadidos mensajes de error del vídeo y los visores. Un futuro formulario deberá mostrar confirmación solo cuando el servidor confirme la recepción. |
| 15. Modo oscuro | No hay selector; el diseño combina secciones claras y oscuras. | Opcional. Puede implementarse con variables CSS, `prefers-color-scheme` y un selector que recuerde la elección. No se ha cambiado la dirección visual. |
| 16. Idioma | `lang="es"`; interfaz española con categorías técnicas en inglés. | Correcto para la versión actual. Un segundo idioma requiere traducción completa, selector y páginas diferenciadas con `hreflang`. No se ha añadido un selector sin traducciones. |
| 17. Botones de redes | No hay enlaces a cuentas reales. | Facilitar los perfiles que quieras mostrar. Se pueden añadir dos o tres enlaces de texto junto al contacto, con nombres claros. |
| 18. Testimonios | No hay. | Opcionales en un portfolio. Solo incluir comentarios reales con atribución y autorización, sin inventar clientes ni citas. |
| 19. Optimización de velocidad | El HTML pesaba 27.839.239 bytes: casi 28 MB. | El paquete separa vídeo, PDF, imágenes y experiencias. El HTML principal pasa a 37.058 bytes; el JS de la portada suma aproximadamente 44 KB. No equivale a una medición de velocidad ni de Core Web Vitals. |
| 20. Autolayout | Ya usa CSS Grid, Flexbox, `clamp()` y media queries. | En una web, estos son los equivalentes funcionales al Auto Layout de Figma. No necesita Figma para adaptarse. La revisión visual sigue pendiente. |

## Código, SEO y publicación

| Comprobación | Resultado y acción |
| --- | --- |
| View source vacío | No. Los nombres, descripciones y estructura de los proyectos ya están en el HTML de origen. El perfil animado y algunos efectos se generan con JS. Añadido un fallback básico para leer proyectos sin JS. |
| Vite + React | No se usan y el título no era «Vite + React». Migrar a React no es una corrección necesaria para este portfolio. |
| Mismo título en todas las páginas | La portada es una sola página, con proyectos desplegables; no son nueve rutas. Se ha mejorado su título. Las experiencias independientes y la 404 tienen títulos propios. Si se crean páginas indexables para cada proyecto, cada una necesitará metadatos propios. |
| Meta description | Ya había una descripción genérica. Se ha sustituido por una específica de Ico y su trabajo. Las experiencias del paquete tienen descripción. |
| Open Graph | Faltaba. Añadidos tipo, título, descripción, idioma y datos para tarjeta social. El paquete incluye un fotograma existente de Refraction como imagen; el configurador añadirá su URL absoluta al conocer el dominio. No está verificada una tarjeta social publicada. |
| Datos estructurados | No había JSON-LD. Añadidos `ProfilePage`, `Person` e inventario de nueve trabajos, utilizando datos presentes en el portfolio. No se promete un resultado enriquecido en Google. |
| H1 ausente o repetido | La portada no tenía H1. Ahora tiene uno visible: «ico — diseño e interacción». Se añadieron encabezados de proyecto. Campo Gaussiano también tiene su H1 accesible en su documento independiente. Los H1 de iframes pertenecen a documentos distintos. |
| Canonical | Faltaba. No se ha inventado una URL. `configurar_publicacion.py` lo añade de forma estática al HTML cuando se proporciona la dirección pública. |
| llm.txt | La convención es **llms.txt**, con «s». Añadido como resumen opcional en el paquete. No es un requisito de indexación ni una garantía de aparecer en respuestas de IA. |
| robots.txt | No formaba parte del HTML entregado. Preparado en el paquete. Debe publicarse en la raíz del dominio para regular el rastreo. Si usas una subcarpeta compartida, hay que revisar el archivo de la raíz. |
| Sitemap | No se podía comprobar en un archivo HTML aislado. El configurador genera `sitemap.xml` con la URL real de la portada. No incluye anclas como páginas independientes ni las experiencias marcadas `noindex`. |
| Página 404 | No venía en el archivo. Se ha creado `404.html`, con título propio, `noindex` y enlace de regreso. Falta configurar y verificar el **estado HTTP 404** en el alojamiento; que exista el archivo no basta para demostrarlo. |
| Atributo de idioma | Ya existía: `lang="es"`. Conservado. |
| Texto alternativo | Las cuatro imágenes HTML de la portada ya tenían `alt`. Se conservan. Los visores tienen título y el vídeo tiene nombre accesible. Los gráficos decorativos ASCII están ocultos a lectores de pantalla. |
| Source maps expuestos | No se han encontrado archivos `.map` ni referencias `sourceMappingURL` en el paquete revisado. Esto no comprueba otros archivos que pueda tener un servidor público. Los mapas de código no son, por sí solos, prueba de una filtración de secretos. |
| Errores de consola | No verificables en un navegador real en esta sesión. Pasaron la comprobación de sintaxis y las pruebas de DOM descritas abajo. No se afirma «consola limpia en producción». |
| Bundle JS gigante | El JS principal original sumaba unos 38 KB. El volumen principal era multimedia codificada en base64 dentro del HTML, no React. En publicación, los medios son archivos separados y las experiencias se solicitan bajo demanda. |

Google recomienda títulos y descripciones descriptivos y una canonical consistente; no exige usar un framework concreto. Véase [SEO con JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) y [URLs canónicas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

La configuración del rastreo se debe revisar en el servidor: [ubicación de robots.txt](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview). `llms.txt` es una propuesta independiente: [especificación](https://llmstxt.org/).

## Qué se ha comprobado

- Análisis del HTML original y del actualizado, y de las dos experiencias incluidas.
- Un H1 principal, nueve encabezados de proyecto, identificadores únicos, idioma, metadatos y JSON-LD válido.
- Texto alternativo y dimensiones explícitas de imágenes; títulos de iframes.
- Pruebas de DOM con JSDOM: apertura y cierre de acordeones, regiones cerradas no interactivas, foco al abrir una ventana, cierre con Escape y retorno al botón de origen.
- Pruebas de activación del vídeo y pausa al cerrar el proyecto con métodos multimedia simulados. No equivalen a decodificar y reproducir el MP4 en un navegador.
- Sintaxis de los cinco scripts ejecutables del paquete y existencia de todas las rutas locales de recursos.
- Configurador: repetición sin duplicar canonical, cambio de dominio/ruta, imagen social con URL absoluta, XML de sitemap válido y enlace de regreso 404 actualizado.

La política del navegador bloqueó el acceso al archivo local y la conexión HTTP de prueba no estuvo disponible. No se han verificado renderizado, móvil real, WebGL, consola de Chrome/Safari, reproducción audiovisual, Lighthouse ni Core Web Vitals. Tampoco se ha comprobado una web publicada. Los estados de carga de iframe indican eventos del visor, no validan el contenido de un servidor externo.

## Siguiente paso

Para completar la publicación hacen falta la **URL pública definitiva**, el **correo profesional** y los **enlaces sociales** que quieras incluir. El ZIP incluye instrucciones para configurar URL canónica, imagen social y sitemap sin añadir direcciones ficticias al archivo final. Los cambios no están publicados.
