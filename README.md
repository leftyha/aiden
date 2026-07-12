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

1. Copiar el paquete visual completo dentro de `public/assets/`.
2. Reemplazar el número de WhatsApp en `src/main.js`.
3. Completar hora, lugar y enlace de Google Maps.
4. Añadir audios o narración finales cuando estén producidos.
5. Revisar autorización familiar para publicar las fotos reales.

## Tecnología

- Vite
- GSAP + ScrollTrigger
- Lenis
- Howler.js
- HTML/CSS/JavaScript

## Estructura visual esperada

```text
public/assets/
  animals/
  backgrounds/
  characters/
  decor/
  photos/
```

## Privacidad

Las fotografías reales formarán parte del despliegue público. Considera cambiar el repositorio a privado o retirar las fotos antes de publicar si no deseas exposición pública.
