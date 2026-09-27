# CertiGO — web lista para GitHub Pages

Versión estática de la portada de CertiGO, con secciones de equipo, contacto, servicios, preguntas frecuentes y blog. Incluye calculadora de precios, menú móvil y una página informativa de privacidad. No necesita instalación, compilación ni dependencias: los archivos se publican tal cual.

Puedes abrir `index.html` directamente en el navegador para verla antes de publicar.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube el contenido de esta carpeta a la raiz del repositorio. Deben quedar en la raiz `index.html`, `config.js`, `assets/` y la carpeta `.github/`.
2. Comprueba que la rama se llama `main` o `master`. El workflow escucha push en ambas.
3. En el repositorio entra en **Settings > Pages**.
4. En **Build and deployment**, selecciona **Source: GitHub Actions**.
5. Haz push a `main` o `master`, o lanza el workflow manualmente desde la pestana **Actions** con **Run workflow**.

Cuando termine el workflow, la web queda publicada en la URL que GitHub muestra en **Settings > Pages**.

## Configuracion de contacto

El archivo `config.js` concentra los datos de contacto y las integraciones. Edita estos campos:

- `siteConfig.phone`: número de teléfono para llamar (con prefijo internacional).
- `siteConfig.phoneLabel`: texto del teléfono que se muestra en pantalla. Actualízalo junto con `phone`.
- `siteConfig.whatsapp`: numero de WhatsApp para el enlace de contacto.
- `siteConfig.email`: correo de contacto.
- `siteConfig.address`: direccion postal.
- `siteConfig.mapUrl`: enlace al mapa.
- `siteConfig.bookingUrl`: enlace externo de reserva de cita.
- `siteConfig.formEndpoint`: endpoint opcional que recibe el formulario.

### WhatsApp

El boton de WhatsApp solo abre la aplicacion o la version web de WhatsApp con una conversacion hacia el numero configurado. El usuario tiene que pulsar enviar dentro de WhatsApp. La web no envia ningun mensaje de forma automatica.

### Formulario de contacto

Por defecto, «Preparar email» valida el formulario y muestra un enlace «Abrir mi correo y revisar la solicitud». Ese enlace abre la aplicación de correo del visitante con el mensaje rellenado. La web no confirma que se haya enviado: el envío real depende del visitante y de su cliente de correo. No se transmiten datos al preparar el mensaje.

Si prefieres recibir el formulario sin depender del correo del visitante, puedes configurar `siteConfig.formEndpoint` con un endpoint de Formspree u otro servicio equivalente. Con un endpoint configurado, el formulario hace una peticion HTTP a ese servicio.

## Tarifas de la calculadora

Los precios de `tarifas.js` son una copia fija de la [calculadora original](https://certi-go.com/widgets/calculadora_madrid_metros_CP_6_AB.html), consultada el 27-09-2026. Incluye 298 códigos postales. No se sincronizan ni se actualizan solos: modifica `tarifas.js` cuando cambien. La función de cálculo está en `app.js`.

Ejemplos comprobados: piso de 80 m² en 28001 → 70,20 €; piso de 80 m² en 28901 → 78,65 €, IVA incluido. Edificios completos y superficies de más de 350 m² muestran «Precio a consultar». Las superficies vacías, cero o negativas no producen presupuesto.

## Agenda

La web no incluye backend ni sistema de agenda propia. La reserva de citas se delega en el enlace externo configurado en `siteConfig.bookingUrl`.

## Enlaces al blog

Los enlaces al blog apuntan a los articulos originales. Se pueden sustituir por enlaces propios editando el HTML correspondiente.

## Contenido y marca

Se han conservado la marca, imágenes y datos públicos de CertiGO como referencia solicitada. Los teléfonos, WhatsApp, correo, reservas y blog apuntan actualmente a CertiGO. Si la web es para otro negocio, sustituye esos datos, los testimonios, los textos, las imágenes y el logotipo antes de publicarla.

Las imágenes y la fuente están incluidas en `assets/`: no se descargan desde WordPress cuando alguien visita esta web. La estructura se ha reconstruido en HTML/CSS/JavaScript; no es una exportación del WordPress ni de su base de datos. El mapa abre un enlace externo, y los artículos completos y el sistema de citas permanecen en la web original.

`privacidad.html` describe el funcionamiento de esta entrega. Adáptala a la identidad del responsable y al tratamiento real de tu negocio si modificas las integraciones. Esta versión no carga analítica ni establece cookies propias.

## Archivos principales

- `index.html`: contenido y enlaces.
- `styles.css`: colores, tipografía y adaptación a móvil.
- `config.js`: contacto e integraciones.
- `tarifas.js`: importes de la calculadora.
- `app.js`: calculadora, navegación y formularios.
- `privacidad.html`: información de privacidad.
- `assets/`: imágenes y fuente locales.
- `.github/workflows/deploy.yml`: publicación automática.

## Publicación alternativa sin Actions

También puedes publicar desde **Settings > Pages > Source: Deploy from a branch**, seleccionando `main` y `/(root)`. En ese caso no es necesario subir `.github/`. Para una cuenta gratuita, utiliza un repositorio público.

Las rutas de los archivos son relativas: sirven tanto para `usuario.github.io` como para `usuario.github.io/nombre-repositorio/`.

Configuración contrastada con la [documentación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
