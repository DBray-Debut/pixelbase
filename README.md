# Pixelbase

Herramientas de imagen 100% en el navegador: Base64, compresión, redimensionado y conversión de formato. Sin subir archivos a ningún servidor.

## Herramientas disponibles

- Imagen a Base64 (ES / EN) — public/es/base64.html · public/en/base64.html
- Base64 a Imagen (ES) — public/es/base64-a-imagen.html
- Texto a Base64 (ES) — public/es/texto-a-base64.html

## Estructura

public/
  index.html          # Hub principal
  robots.txt
  sitemap.xml
  css/styles.css
  js/common.js        # Utilidades compartidas (window.PB)
  js/base64.js        # Imagen a Base64
  js/base64-a-imagen.js
  js/texto-a-base64.js
  es/base64.html
  es/base64-a-imagen.html
  es/texto-a-base64.html
  en/base64.html

## Desarrollo local

    npm install
    npm run dev
    # http://localhost:3000

## Deploy

Proyecto estático listo para Cloudflare Pages (directorio de salida: public).

## Roadmap

- [ ] Comprimir imagen (JPG, PNG, WebP)
- [ ] Redimensionar imagen
- [ ] Convertir formato (PNG ↔ JPG ↔ WebP)