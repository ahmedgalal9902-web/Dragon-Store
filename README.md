# DRAGON Store

3D streetwear storefront: cinematic intro, 3D collection carousel, product viewer and cart.

**Stack:** Three.js r128 · GSAP 3.12.5 + ScrollTrigger · Lenis 1.1.13 (all loaded from CDN, no npm or build step).

## Run locally
```
python3 -m http.server 8000
```
Open http://localhost:8000 (a server is required so images can load into WebGL).

## Deploy on GitHub Pages
Settings → Pages → Deploy from branch → `main` / root.

## Files
- `index.html` page markup
- `style.css` styles
- `app.js` logic (intro, carousel, scroll, product viewer, cart)
- `shaders.js` GLSL shaders
- `img/` the 23 product photos (p01.jpg … p23.jpg)
