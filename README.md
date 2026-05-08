# Invitación Isabela & Benjamin

Sitio estático estilo luxury wedding, listo para publicar en Netlify.

## Publicación en Netlify

1. Conecta este repositorio en Netlify.
2. No uses comando de build.
3. Directorio de publicación: `.`.

## RSVP con Google Sheets

El archivo `google-apps-script.js` incluye el template para crear un Web App en Google Apps Script.

1. Crea una hoja en Google Sheets con una pestaña llamada `RSVP`.
2. En Apps Script, pega el contenido de `google-apps-script.js`.
3. Cambia `SPREADSHEET_ID`.
4. Despliega como Web App con acceso para cualquiera que tenga el enlace.
5. Pega la URL final en `CONFIG.googleSheetsWebAppUrl` dentro de `app.js`.

Si no configuras Google Sheets, el formulario conserva el fallback de Netlify Forms.

## Invitaciones individuales

Comparte URLs con nombre:

```text
https://tu-dominio.netlify.app/?invitado=Nombre%20Apellido
```

La página personaliza el saludo, prellena el RSVP y genera un QR con esa URL.

## Ediciones rápidas

- Fecha del contador: `CONFIG.weddingDate` en `app.js`.
- Spotify / Apple Music: `CONFIG.spotifyUrl` y `CONFIG.appleMusicUrl` en `app.js`.
- Lugar exacto del mapa: sección `#mapa` en `index.html`.
- Imágenes principales: carpeta `assets/`.
