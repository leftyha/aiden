# Mi primer rugido

Experiencia web narrativa para el primer cumpleaños de **Aiden Leonardo Mora Molero**.

## Ejecutar

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

## Personalización por URL

```text
/?invitado=Ana%20Pérez&acompanante=si
/?invitado=Carlos%20Mora&acompanante=no
```

## Antes de publicar

1. Reemplazar el número de WhatsApp en `src/main.js`.
2. Completar hora, lugar y enlace de Google Maps.
3. Añadir audios/narración finales si se producen.
4. Revisar autorización familiar para publicar las fotos reales.

## Tecnología

- Vite
- GSAP + ScrollTrigger
- Lenis
- Howler.js
- HTML/CSS/JavaScript

## Assets

Los recursos visuales se guardan comprimidos en `assets-bundle/`. Los scripts `predev` y `prebuild` los extraen automáticamente antes de ejecutar o compilar el sitio.

## Privacidad

Las fotografías reales formarán parte del despliegue público. Considera cambiar el repositorio a privado o retirar las fotos antes de publicar si no deseas exposición pública.
