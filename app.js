/* DRAGON store — Three.js · GSAP + ScrollTrigger · Lenis */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const hasT = !!window.THREE, hasG = !!window.gsap, hasST = !!window.ScrollTrigger, hasL = !!window.Lenis;
const SH = window.DRG_SHADERS;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fmt = n => 'EGP ' + n.toLocaleString('en-US');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd = (a, b) => a + Math.random() * (b - a);
const CAT = { hoodie: 'Hoodies', pants: 'Pants', tee: 'Tees', jacket: 'Jackets', set: 'Sets' };

/* ---------------------------------------------------------------- DATA */
const PRODUCTS = [
  { id: 1,  img: 'img/p01.jpg', name: 'ABYSS ZIP HOODIE',   cat: 'hoodie', price: 1850, badge: 'Best seller', desc: 'Grey zip hoodie with a black gothic graphic across the chest. Oversized fit with front pockets.' },
  { id: 2,  img: 'img/p02.jpg', name: 'ASH FADE HOODIE',    cat: 'hoodie', price: 1650, old: 1950, badge: 'New', desc: 'Black hoodie with a smoky grey fade, kangaroo pocket and a relaxed, wide fit.' },
  { id: 3,  img: 'img/p03.jpg', name: 'NOIR CARRIAGE TEE',  cat: 'tee',    price: 1000, desc: 'Oversized black tee with a classic white graphic on the chest.' },
  { id: 4,  img: 'img/p04.jpg', name: 'FALLEN ANGEL PANTS', cat: 'pants',  price: 2150, badge: 'Limited', desc: 'Wide black pants with a fallen-angel graphic in white and red down the leg.' },
  { id: 5,  img: 'img/p05.jpg', name: 'WHITE THORN PANTS',  cat: 'pants',  price: 1950, desc: 'White sweatpants with black gothic thorn graphics down both sides.' },
  { id: 6,  img: 'img/p06.jpg', name: 'NAVY THORN PANTS',   cat: 'pants',  price: 1950, desc: 'The thorn design on deep navy. Wide cut with a drawstring waist.' },
  { id: 7,  img: 'img/p07.jpg', name: 'ARCH LOGO TEE',      cat: 'tee',    price: 1090, desc: 'Oversized black tee with an arched graphic across the chest.' },
  { id: 8,  img: 'img/p08.jpg', name: 'STORM PARACHUTE',    cat: 'pants',  price: 1750, old: 2100, badge: 'New', desc: 'Wide black parachute pants with white side piping and a light, crisp fabric.' },
  { id: 9,  img: 'img/p09.jpg', name: 'BLACKOUT PUFFER',    cat: 'jacket', price: 2655, badge: 'Limited', desc: 'Black puffer jacket with a high collar and front pockets. Winter warmth, street attitude.' },
  { id: 10, img: 'img/p10.jpg', name: 'STONE COLLEGE TEE',  cat: 'tee',    price: 1150, desc: 'Oversized grey tee with a collegiate graphic in burgundy detail.' },
  { id: 11, img: 'img/p11.jpg', name: 'SMOKE THORN PANTS',  cat: 'pants',  price: 1950, desc: 'Grey sweatpants with black gothic thorn graphics.' },
  { id: 12, img: 'img/p12.jpg', name: 'SHADOW CARGO JEANS', cat: 'pants',  price: 2250, badge: 'Best seller', desc: 'Washed black cargo jeans with large side pockets and a wide cut.' },
  { id: 13, img: 'img/p13.jpg', name: 'DRAGON KATAKANA',    cat: 'hoodie', price: 1890, badge: 'Best seller', desc: 'Charcoal hoodie with Japanese katakana on the chest. Oversized with a kangaroo pocket.' },
  { id: 14, img: 'img/p14.jpg', name: 'MILANO RACING',      cat: 'jacket', price: 2450, badge: 'Limited', desc: 'Black and white racing jacket with a zip collar and printed sleeves.' },
  { id: 15, img: 'img/p15.jpg', name: 'CLOUD WIDE PANTS',   cat: 'pants',  price: 1690, desc: 'Wide grey sweatpants with a raised puff print down the leg.' },
  { id: 16, img: 'img/p16.jpg', name: 'BAT TRACKSUIT SET',  cat: 'set',    price: 2400, badge: 'New', desc: 'Black two-piece tracksuit with white piping and a bat emblem. Jacket and pants.' },
  { id: 17, img: 'img/p17.jpg', name: 'CHICAGO LEATHER',    cat: 'jacket', price: 2550, badge: 'Limited', desc: 'Burgundy faux-leather varsity jacket with script embroidery and a ribbed hem.' },
  { id: 18, img: 'img/p18.jpg', name: 'DARK ROSE TEE',      cat: 'tee',    price: 1250, desc: 'Oversized white tee with a blackletter rose graphic and tribal sleeve prints.' },
  { id: 19, img: 'img/p19.jpg', name: 'RELIC LAYERED TEE',  cat: 'tee',    price: 1350, badge: 'New', desc: 'Black layered long-sleeve tee with an all-over distressed gothic collage print.' },
  { id: 20, img: 'img/p20.jpg', name: 'DEMON HOODIE',       cat: 'hoodie', price: 1950, badge: 'Best seller', desc: 'Light grey oversized hoodie with a red-eyed fanged demon across the front.' },
  { id: 21, img: 'img/p21.jpg', name: 'BLUSH ZIP HOODIE',   cat: 'hoodie', price: 1790, desc: 'Pink full-zip hoodie with a face-covering hood and a small embroidered star.' },
  { id: 22, img: 'img/p22.jpg', name: 'ICE ZIP HOODIE',     cat: 'hoodie', price: 1790, desc: 'Pale blue full-zip hoodie with a face-covering hood and chest embroidery.' },
  { id: 23, img: 'img/p23.jpg', name: 'PUFF ZIP HOODIE',    cat: 'hoodie', price: 2050, badge: 'New', desc: 'Black zip hoodie with raised white puff-print lettering down the sleeve.' },
];
const FEATURED = [13, 9, 4, 14, 12];
const byId = id => PRODUCTS.find(p => p.id === id);
const N = PRODUCTS.length;

/* ---------------------------------------------------------------- IMAGE PRELOAD (also drives intro loader) */
const IMGS = {};
let loaded = 0;
const imgReady = Promise.all(PRODUCTS.map(p => new Promise(res => {
  const im = new Image();
  const done = () => {
    loaded++;
    const pct = Math.round(loaded / N * 100);
    const n = $('#ldNum'), b = $('#ldBar');
    if (n) n.textContent = pct;
    if (b) b.style.width = pct + '%';
    res();
  };
  im.onload = done; im.onerror = done;
  im.src = p.img; IMGS[p.id] = im;
})));

/* ---------------------------------------------------------------- SMOOTH SCROLL (Lenis ↔ ScrollTrigger) */
let lenis = null;
function initSmooth() {
  if (hasST && hasG) gsap.registerPlugin(ScrollTrigger);
  if (!hasL) return;
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  if (hasG && hasST) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  lenis.stop();
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    lenis.scrollTo(t, { duration: 1.6, offset: a.getAttribute('href') === '#hero' ? 0 : -10 });
  }));
}
const lockScroll = on => {
  document.body.style.overflow = on ? 'hidden' : '';
  if (lenis) on ? lenis.stop() : lenis.start();
};

/* ---------------------------------------------------------------- INTRO */
function playIntro() {
  return new Promise(resolve => {
    const root = $('#intro');
    if (!hasG || matchMedia('(prefers-reduced-motion: reduce)').matches) { root.remove(); return resolve(); }

    // iris fibres
    let f = '';
    for (let i = 0; i < 72; i++) {
      const a = i / 72 * Math.PI * 2, r1 = 14 + Math.random() * 8, r2 = 58 + Math.random() * 20;
      f += `<line x1="${200 + Math.cos(a) * r1}" y1="${100 + Math.sin(a) * r1}" x2="${200 + Math.cos(a) * r2}" y2="${100 + Math.sin(a) * r2}" stroke="rgba(255,${120 + (Math.random() * 100 | 0)},30,${0.15 + Math.random() * 0.3})" stroke-width="${0.5 + Math.random() * 1.2}"/>`;
    }
    $('#fibers').innerHTML = f;

    let renderer = null, scene, cam, mat, tl;
    const U = { conv: 0, burst: 0 }, CZ = { z: 15 };
    let imgsOk = false, waiting = false, skipped = false, finished = false;

    if (hasT) {
      try { renderer = new THREE.WebGLRenderer({ canvas: $('#introCv'), antialias: false, alpha: false }); } catch (e) { renderer = null; }
    }

    const size = () => {
      if (!renderer) return;
      const w = innerWidth, h = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
      if (mat) mat.uniforms.uPx.value = h * dpr / (2 * Math.tan(cam.fov * Math.PI / 360));
    };

    const build = () => {
      if (!renderer || finished) return;
      scene = new THREE.Scene();
      cam = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
      cam.position.z = 15;
      renderer.setClearColor(0x000000, 1);

      // sample the word DRAGON from a 2D canvas
      const cw = 1000, ch = 300, c = document.createElement('canvas');
      c.width = cw; c.height = ch;
      const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = '400 250px Anton, Impact, "Arial Black", sans-serif';
      x.fillText('DRAGON', cw / 2, ch / 2 + 10);
      const tw = x.measureText('DRAGON').width || 640;
      const d = x.getImageData(0, 0, cw, ch).data, pts = [];
      for (let y = 0; y < ch; y += 2) for (let xx = 0; xx < cw; xx += 2) if (d[(y * cw + xx) * 4 + 3] > 128) pts.push(xx, y);

      const visW = 2 * 12 * Math.tan(25 * Math.PI / 180) * cam.aspect;
      const worldW = Math.min(10.5, visW * 0.86), sc = worldW / tw;
      const COUNT = 14000;
      const pos = new Float32Array(COUNT * 3), tgt = new Float32Array(COUNT * 3), rnd4 = new Float32Array(COUNT * 4), col = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const j = (Math.random() * pts.length / 2 | 0) * 2;
        tgt[i * 3] = (pts[j] - cw / 2) * sc + rnd(-0.01, 0.01);
        tgt[i * 3 + 1] = -(pts[j + 1] - ch / 2 - 10) * sc;
        tgt[i * 3 + 2] = rnd(-0.05, 0.05);
        const r = rnd(7, 22), th = Math.random() * Math.PI * 2, ph = Math.acos(rnd(-1, 1));
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
        pos[i * 3 + 2] = r * Math.cos(ph);
        rnd4.set([Math.random(), rnd(0.4, 1.4), Math.random(), Math.random()], i * 4);
        const v = clamp((pts[j + 1] - 40) / 200, 0, 1), b = rnd(0.8, 1.2);
        const cc = v < 0.5 ? [1, 0.8 - v * 0.8, 0.35 - v * 0.56] : [1 - (v - 0.5) * 0.3, 0.4 - (v - 0.5) * 0.7, 0.07 - (v - 0.5) * 0.1];
        col.set([cc[0] * b, Math.max(0, cc[1]) * b, Math.max(0, cc[2]) * b], i * 3);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('aTarget', new THREE.BufferAttribute(tgt, 3));
      g.setAttribute('aRand', new THREE.BufferAttribute(rnd4, 4));
      g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
      mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uConv: { value: 0 }, uBurst: { value: 0 }, uPx: { value: 1 } },
        vertexShader: SH.intro.vs, fragmentShader: SH.intro.fs,
        transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending
      });
      const pts3 = new THREE.Points(g, mat);
      pts3.frustumCulled = false;
      scene.add(pts3);
      size();
    };

    const tick = () => {
      if (!renderer || !mat) return;
      mat.uniforms.uTime.value = performance.now() / 1000;
      mat.uniforms.uConv.value = U.conv;
      mat.uniforms.uBurst.value = U.burst;
      cam.position.z = CZ.z;
      renderer.render(scene, cam);
    };
    gsap.ticker.add(tick);
    addEventListener('resize', size);

    const finish = () => {
      if (finished) return;
      finished = true;
      gsap.ticker.remove(tick);
      removeEventListener('resize', size);
      if (renderer) { try { renderer.dispose(); renderer.forceContextLoss(); } catch (e) { /* noop */ } }
      root.remove();
      resolve();
    };

    Promise.race([
      (document.fonts && document.fonts.load) ? document.fonts.load('250px Anton') : Promise.resolve(),
      sleep(1500)
    ]).catch(() => {}).then(build);

    imgReady.then(() => { imgsOk = true; if (waiting) { waiting = false; tl.resume(); } });

    tl = gsap.timeline({ onComplete: finish });
    // 1 · the eye opens
    tl.fromTo('#eyeG', { scaleY: 0.02 }, { scaleY: 1, duration: 1.3, ease: 'expo.out' }, 0.4)
      .to('#fibers', { rotation: 40, svgOrigin: '200 100', duration: 2.4, ease: 'none' }, 0.6)
      .to('#pupil', { scaleX: 0.5, duration: 0.9, ease: 'power2.inOut' }, 1.8)
    // 2 · dive into the pupil
      .to('#eye', { scale: 60, duration: 1.0, ease: 'power3.in' }, 2.5)
      .to('#eye', { autoAlpha: 0, duration: 0.25 }, 3.25)
    // 3 · embers swirl and lock into the word
      .to(U, { conv: 1, duration: 2.7, ease: 'power2.inOut' }, 2.7)
      .to(CZ, { z: 11.5, duration: 4, ease: 'power1.inOut' }, 2.7)
      .fromTo('.intro-sub', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 5.0)
      .call(() => { if (!imgsOk && !skipped) { waiting = true; tl.pause(); } }, null, 6.0)
    // 4 · detonate
      .to('#flash', { autoAlpha: 1, duration: 0.12 }, 6.1)
      .to('#flash', { autoAlpha: 0, duration: 0.7 }, 6.25)
      .to(U, { burst: 1, duration: 1.4, ease: 'power2.in' }, 6.1)
      .to('.intro-sub', { autoAlpha: 0, duration: 0.4 }, 6.2)
      .to('#intro', { autoAlpha: 0, duration: 0.8, ease: 'power1.in' }, 6.6);

    // camera shake on detonation
    tl.call(() => { if (cam) gsap.fromTo(cam.position, { x: -0.18 }, { x: 0, duration: 0.6, ease: 'elastic.out(1,.15)' }); }, null, 6.1);

    $('#skip').addEventListener('click', () => {
      skipped = true;
      if (waiting) waiting = false;
      tl.timeScale(7).resume();
    });
  });
}

/* ---------------------------------------------------------------- THREE helpers */
const PREM = () => ({
  transparent: true, depthTest: false, depthWrite: false,
  blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
  blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor
});
function makeRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true });
  r.setClearColor(0x000000, 0);
  return r;
}
function makePortal(R, ints) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uAsp: { value: 1 }, uR: { value: R }, uInt: { value: ints }, uC: { value: new THREE.Vector2(0, 0) } },
      vertexShader: SH.portal.vs, fragmentShader: SH.portal.fs, ...PREM()
    })
  );
  m.frustumCulled = false; m.renderOrder = 0;
  return m;
}
function makeEmbers(count, spread) {
  const pos = new Float32Array(count * 3), seed = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    pos.set([rnd(-spread.x, spread.x), rnd(-8, 8), rnd(spread.z0, spread.z1)], i * 3);
    seed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
  const m = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPx: { value: 1 } },
    vertexShader: SH.ember.vs, fragmentShader: SH.ember.fs, ...PREM()
  });
  const p = new THREE.Points(g, m);
  p.frustumCulled = false; p.renderOrder = 5;
  return p;
}
const texFrom = img => {
  const t = new THREE.Texture(img);
  t.needsUpdate = true;
  t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.anisotropy = 8;
  return t;
};

/* ---------------------------------------------------------------- HERO (3D ring carousel) */
const H = { rot: 0, vel: 0, intro: 0, scroll: 0, drag: false, target: null, autoAt: 0, hover: -1, mx: 0, my: 0, k: -1, on: true, ready: false };
let modalOpen = false;
const STEP = Math.PI * 2 / N, CW = 1.5, CH = 2, RING = Math.max(4.9, N * 1.5 * 1.22 / (Math.PI * 2));

function setSel(k, animate = true) {
  if (k === H.k) return;
  H.k = k;
  const p = PRODUCTS[k];
  $('#hIdx').textContent = String(k + 1).padStart(2, '0') + ' / ' + N;
  $('#hName').textContent = p.name;
  $('#hPrice').textContent = fmt(p.price);
  if (hasG && animate) gsap.fromTo('.hero-info > *', { opacity: 0.2, y: 10 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, overwrite: true });
}

function initHero() {
  const host = $('#hero'), cv = $('#heroCv');
  $('#hOpen').addEventListener('click', () => openProduct(PRODUCTS[Math.max(0, H.k)].id));
  setSel(0, false);

  const fallback = () => {
    cv.hidden = true;
    $('#heroFb').hidden = false;
    const show = () => { $('#heroFbImg').src = PRODUCTS[H.k].img; };
    show();
    $('#hPrev').onclick = () => { setSel((H.k - 1 + N) % N); show(); };
    $('#hNext').onclick = () => { setSel((H.k + 1) % N); show(); };
  };
  if (!hasT) return fallback();
  let renderer;
  try { renderer = makeRenderer(cv); } catch (e) { return fallback(); }

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const portal = makePortal(0.8, 1.0);
  scene.add(portal);
  const embers = makeEmbers(260, { x: 10, z0: -6, z1: 9 });
  scene.add(embers);
  const ring = new THREE.Group();
  scene.add(ring);
  const cards = [], refl = [];
  let dFront = 5.5, camD = 10.4;

  const layout = () => {
    const w = host.clientWidth, h = host.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
    const th = Math.tan(cam.fov * Math.PI / 360);
    dFront = Math.max(2 / th, 1.5 / (0.62 * 2 * th * cam.aspect));
    camD = RING + dFront;
    portal.material.uniforms.uAsp.value = cam.aspect;
    portal.material.uniforms.uR.value = cam.aspect < 1 ? 0.56 : 0.8;
    embers.material.uniforms.uPx.value = h * dpr / (2 * th);
  };
  layout();
  addEventListener('resize', layout);

  imgReady.then(() => {
    PRODUCTS.forEach((p, i) => {
      const img = IMGS[p.id], tex = texFrom(img);
      const asp = (img.naturalWidth || 3) / (img.naturalHeight || 4);
      const mk = isRefl => new THREE.ShaderMaterial({
        uniforms: {
          uTex: { value: tex }, uImgAsp: { value: asp }, uCardAsp: { value: CW / CH },
          uBright: { value: 1 }, uGlow: { value: 0 }, uAlpha: { value: 0 }, uRefl: { value: isRefl ? 1 : 0 },
          uFog: { value: new THREE.Vector2(RING * 0.9, RING * 3.2) }
        },
        vertexShader: SH.card.vs, fragmentShader: SH.card.fs, side: THREE.DoubleSide, ...PREM()
      });
      const geo = new THREE.PlaneGeometry(CW, CH);
      const m = new THREE.Mesh(geo, mk(false)); m.userData.i = i; m.renderOrder = 2;
      const r = new THREE.Mesh(geo, mk(true)); r.renderOrder = 1;
      ring.add(m, r); cards.push(m); refl.push(r);
    });
    H.ready = true;
    H.autoAt = performance.now() + 4500;
  });

  /* --- interaction --- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const pick = e => {
    const b = cv.getBoundingClientRect();
    ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const hit = ray.intersectObjects(cards, false)[0];
    return hit ? hit.object.userData.i : -1;
  };
  const front = () => ((Math.round(-H.rot / STEP) % N) + N) % N;
  const snapTo = i => {
    const m = Math.round((H.rot + i * STEP) / (Math.PI * 2));
    H.target = m * Math.PI * 2 - i * STEP;
    H.vel = 0;
  };
  const step = dir => {
    const base = H.target != null ? H.target : Math.round(H.rot / STEP) * STEP;
    H.target = base - dir * STEP; H.vel = 0;
    H.autoAt = performance.now() + 6000;
  };
  $('#hPrev').addEventListener('click', () => { if (H.ready) step(-1); });
  $('#hNext').addEventListener('click', () => { if (H.ready) step(1); });
  addEventListener('keydown', e => {
    if (modalOpen || !H.on || !H.ready) return;
    if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1);
  });

  let sx = 0, moved = 0, lastX = 0;
  cv.addEventListener('pointerdown', e => {
    if (!H.ready) return;
    H.drag = true; sx = lastX = e.clientX; moved = 0; H.target = null; H.vel = 0;
    cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener('pointermove', e => {
    const b = cv.getBoundingClientRect();
    H.mx = ((e.clientX - b.left) / b.width - 0.5) * 2; H.my = ((e.clientY - b.top) / b.height - 0.5) * 2;
    if (H.drag) {
      const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
      H.rot += dx * 0.0062; H.vel = H.vel * 0.5 + dx * 0.0062 * 0.5;
      H.autoAt = performance.now() + 5000;
    } else if (H.ready) {
      H.hover = pick(e);
      cv.style.cursor = H.hover === front() ? 'pointer' : 'grab';
    }
  });
  const up = e => {
    if (!H.drag) return;
    H.drag = false;
    if (moved < 6) {
      const i = pick(e);
      if (i >= 0) { if (i === front()) openProduct(PRODUCTS[i].id); else snapTo(i); }
    } else {
      H.target = Math.round((H.rot + H.vel * 14) / STEP) * STEP; H.vel = 0;
    }
    H.autoAt = performance.now() + 5000;
  };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', () => { H.drag = false; });
  cv.addEventListener('pointerleave', () => { H.hover = -1; });

  new IntersectionObserver(([en]) => { H.on = en.isIntersecting; }).observe(host);

  /* --- render loop --- */
  const loop = () => {
    requestAnimationFrame(loop);
    if (!H.on || modalOpen || document.hidden) return;
    const now = performance.now(), t = now / 1000;

    if (H.ready) {
      if (!H.drag) {
        if (H.target != null) {
          H.rot += (H.target - H.rot) * 0.085;
          if (Math.abs(H.target - H.rot) < 0.0008) { H.rot = H.target; H.target = null; }
        } else {
          H.rot += H.vel; H.vel *= 0.93;
          if (Math.abs(H.vel) < 0.0005) {
            H.vel = 0;
            if (now > H.autoAt && H.hover < 0) { H.target = Math.round(H.rot / STEP) * STEP - STEP; H.autoAt = now + 3800; }
          }
        }
      }
      const e = H.intro, sc = H.scroll, R = RING * (0.15 + 0.85 * e);
      ring.rotation.y = H.rot + (1 - e) * Math.PI * 2.5;
      ring.rotation.x = sc * 0.35;
      const fk = front();
      if (fk !== H.k) setSel(fk);
      cards.forEach((c, i) => {
        const th = i * STEP, wth = th + ring.rotation.y, face = Math.cos(wth);
        const f8 = Math.pow(Math.max(0, face), 8), hov = H.hover === i ? 1 : 0;
        const s = 1 + 0.09 * f8 + 0.03 * hov;
        c.position.set(Math.sin(th) * R, 0, Math.cos(th) * R);
        c.rotation.y = th; c.scale.set(s, s, 1);
        const bright = face >= 0 ? 0.38 + 0.62 * Math.pow(face, 1.2) : 0.28;
        const u = c.material.uniforms;
        u.uBright.value = bright; u.uGlow.value = f8 * 0.9 + hov * 0.5; u.uAlpha.value = e;
        const r = refl[i];
        r.position.set(c.position.x, -2.1, c.position.z);
        r.rotation.y = th; r.scale.set(s, -s, 1);
        const ru = r.material.uniforms;
        ru.uBright.value = bright; ru.uAlpha.value = 0.26 * e;
      });
    }
    // camera with mouse parallax + scroll dolly
    const sc = H.scroll;
    cam.position.x += (H.mx * 0.9 - cam.position.x) * 0.05;
    cam.position.y += (1.1 + H.my * -0.35 + sc * 1.4 - cam.position.y) * 0.05;
    cam.position.z = camD + sc * 5;
    cam.lookAt(0, -0.1, 0);
    portal.material.uniforms.uTime.value = t;
    portal.material.uniforms.uInt.value = 0.55 + 0.45 * H.intro;
    embers.material.uniforms.uTime.value = t;
    cv.style.opacity = String(1 - sc * 0.85);
    renderer.render(scene, cam);
  };
  loop();
}

function heroEnter() {
  if (hasG) {
    gsap.to(H, { intro: 1, duration: 2.6, ease: 'expo.out', delay: 0.1 });
    gsap.from('.hero-top > *', { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.3 });
    gsap.from('.hero-bar, .drag-hint', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.9 });
    gsap.from('.nav', { y: -60, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 });
  } else {
    H.intro = 1;
  }
}

/* ---------------------------------------------------------------- GRID */
let filter = 'all', sortBy = 'def';
function buildChips() {
  const wrap = $('#chips');
  wrap.innerHTML = [['all', 'All'], ...Object.entries(CAT)].map(([k, v]) => `<button class="chip${k === 'all' ? ' on' : ''}" type="button" data-k="${k}">${v}</button>`).join('');
  wrap.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    filter = b.dataset.k;
    $$('.chip', wrap).forEach(c => c.classList.toggle('on', c === b));
    renderGrid(true);
  });
  $('#sort').addEventListener('change', e => { sortBy = e.target.value; renderGrid(true); });
}
let cardTriggers = [];
function renderGrid(animate) {
  let list = PRODUCTS.filter(p => filter === 'all' || p.cat === filter);
  if (sortBy === 'lo') list = [...list].sort((a, b) => a.price - b.price);
  if (sortBy === 'hi') list = [...list].sort((a, b) => b.price - a.price);
  const g = $('#products');
  g.innerHTML = list.map(p => `
    <article class="card" data-id="${p.id}">
      <div class="tilt">
        <div class="ph"><img src="${p.img}" alt="${p.name}" loading="lazy">${p.badge ? `<span class="tag">${p.badge}</span>` : ''}<i class="glare"></i></div>
        <div class="meta"><span class="cat">${CAT[p.cat]}</span><h3>${p.name}</h3>
          <div class="pr"><span>${fmt(p.price)}</span>${p.old ? `<s>${fmt(p.old)}</s>` : ''}</div></div>
        <button class="quick" type="button" aria-label="Add to cart" data-quick>+</button>
      </div>
    </article>`).join('');
  $$('.card', g).forEach(card => {
    const t = $('.tilt', card);
    card.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg');
      t.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(2) + 'deg');
      t.style.setProperty('--gx', (x * 100) + '%'); t.style.setProperty('--gy', (y * 100) + '%');
    });
    card.addEventListener('pointerleave', () => { t.style.setProperty('--ry', '0deg'); t.style.setProperty('--rx', '0deg'); });
    card.addEventListener('click', e => {
      const id = +card.dataset.id;
      if (e.target.closest('[data-quick]')) { addToCart(id, 'L', 1); return; }
      openProduct(id);
    });
  });
  cardTriggers.forEach(t => t.kill()); cardTriggers = [];
  if (!hasG) return;
  const els = $$('.card', g);
  if (animate || !hasST) {
    gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'power3.out', overwrite: true });
  } else if (hasST) {
    gsap.set(els, { y: 60, opacity: 0 });
    cardTriggers = ScrollTrigger.batch(els, {
      start: 'top 92%', once: true,
      onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', overwrite: true })
    });
  }
}

function renderFeatured() {
  $('#hsTrack').innerHTML = FEATURED.map((id, i) => {
    const p = byId(id);
    return `<article class="hs-panel" data-id="${id}"><div class="im"><img src="${p.img}" alt="${p.name}" loading="lazy"><span class="n">0${i + 1}</span></div>
      <div class="t"><h3>${p.name}</h3><span class="p">${fmt(p.price)}</span></div></article>`;
  }).join('');
  $$('.hs-panel').forEach(el => el.addEventListener('click', () => openProduct(+el.dataset.id)));
}

/* ---------------------------------------------------------------- SCROLL ANIMATIONS */
function initScroll() {
  if (lenis) lenis.start();
  const nav = $('#nav');
  let lastY = 0;
  const onScroll = y => { nav.classList.toggle('hide', y > lastY && y > 300); lastY = y; };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

  if (!hasG || !hasST) { renderGrid(false); return; }

  // marquee reacts to scroll velocity
  const mq = gsap.to('#mq', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
  if (lenis) {
    lenis.on('scroll', ({ velocity }) => { mq.timeScale(1 + Math.min(Math.abs(velocity), 25) * 0.5); });
    gsap.ticker.add(() => { const ts = mq.timeScale(); if (ts > 1.001) mq.timeScale(ts + (1 - ts) * 0.04); });
  }

  // hero scrub
  ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => { H.scroll = s.progress; } });
  gsap.to('.hero-top', { yPercent: -70, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '65% top', scrub: true } });
  gsap.to('.hero-word', { yPercent: 14, scale: 1.18, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-bar', { opacity: 0, y: 40, ease: 'none', scrollTrigger: { trigger: '#hero', start: '30% top', end: '70% top', scrub: true } });

  // reveals
  const rv = $$('[data-reveal]');
  gsap.set(rv, { y: 50, opacity: 0 });
  ScrollTrigger.batch(rv, { start: 'top 88%', once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }) });
  renderGrid(false);

  // featured — pinned horizontal scroll
  const track = $('#hsTrack'), dist = () => Math.max(0, track.scrollWidth - innerWidth);
  gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#featured', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
  gsap.to('.hs-title', { x: '-25vw', ease: 'none', scrollTrigger: { trigger: '#featured', start: 'top top', end: () => '+=' + dist(), scrub: true, invalidateOnRefresh: true } });
  $$('.hs-panel img').forEach(im => gsap.fromTo(im, { x: '0%' }, { x: '-9%', ease: 'none', scrollTrigger: { trigger: '#featured', start: 'top top', end: () => '+=' + dist(), scrub: true, invalidateOnRefresh: true } }));

  // footer word
  gsap.from('.foot-word', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
  imgReady.then(() => ScrollTrigger.refresh());
}

/* ---------------------------------------------------------------- PRODUCT MODAL + 3D VIEWER */
let cur = null, curSize = 'L', curQty = 1;
const PV = { r: null, scene: null, cam: null, mesh: null, embers: null, portal: null, on: false, ry: 0, rx: 0, ty: 0, tx: 0, amp: 0.04, drag: false, lx: 0, ly: 0, idle: 0, ok: null };

function pvInit() {
  if (PV.ok !== null) return PV.ok;
  if (!hasT) return (PV.ok = false);
  try { PV.r = makeRenderer($('#pvCv')); } catch (e) { return (PV.ok = false); }
  PV.scene = new THREE.Scene();
  PV.cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  PV.portal = makePortal(0.62, 0.9); PV.scene.add(PV.portal);
  PV.embers = makeEmbers(150, { x: 4, z0: -3, z1: 3 }); PV.scene.add(PV.embers);
  const cv = $('#pvCv');
  cv.addEventListener('pointerdown', e => { PV.drag = true; PV.lx = e.clientX; PV.ly = e.clientY; cv.setPointerCapture(e.pointerId); if (hasG) gsap.killTweensOf(PV, 'ty,tx'); });
  cv.addEventListener('pointermove', e => {
    if (!PV.drag) return;
    const dx = e.clientX - PV.lx, dy = e.clientY - PV.ly; PV.lx = e.clientX; PV.ly = e.clientY;
    PV.ty += dx * 0.012; PV.tx = clamp(PV.tx + dy * 0.008, -0.6, 0.6);
    PV.amp = Math.min(0.2, PV.amp + (Math.abs(dx) + Math.abs(dy)) * 0.0025);
  });
  const rel = () => {
    if (!PV.drag) return; PV.drag = false;
    if (hasG) gsap.to(PV, { ty: 0, tx: 0, duration: 1.8, ease: 'elastic.out(1,.45)' }); else { PV.ty = 0; PV.tx = 0; }
  };
  cv.addEventListener('pointerup', rel); cv.addEventListener('pointercancel', rel);
  return (PV.ok = true);
}
function pvResize() {
  const cv = $('#pvCv'), w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  PV.r.setPixelRatio(dpr); PV.r.setSize(w, h, false);
  PV.cam.aspect = w / h; PV.cam.updateProjectionMatrix();
  PV.cam.position.set(0, 0, 7 * Math.max(1, 0.95 / (PV.cam.aspect * 0.8)));
  const th = Math.tan(PV.cam.fov * Math.PI / 360);
  PV.embers.material.uniforms.uPx.value = h * dpr / (2 * th);
  PV.portal.material.uniforms.uAsp.value = PV.cam.aspect;
  PV.portal.material.uniforms.uR.value = Math.min(0.7, 0.34 * PV.cam.aspect + 0.12);
}
function pvShow(p) {
  if (PV.mesh) { PV.scene.remove(PV.mesh); PV.mesh.geometry.dispose(); PV.mesh.material.uniforms.uTex.value.dispose(); PV.mesh.material.dispose(); }
  const img = IMGS[p.id], asp = (img.naturalWidth || 3) / (img.naturalHeight || 4);
  const h = 3.3, w = h * (CW / CH);
  PV.mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h, 26, 34),
    new THREE.ShaderMaterial({
      uniforms: { uTex: { value: texFrom(img) }, uImgAsp: { value: asp }, uCardAsp: { value: CW / CH }, uSize: { value: new THREE.Vector2(w, h) }, uT: { value: 0 }, uAmp: { value: 0.04 } },
      vertexShader: SH.wave.vs, fragmentShader: SH.wave.fs, side: THREE.DoubleSide, ...PREM()
    })
  );
  PV.mesh.renderOrder = 2;
  PV.scene.add(PV.mesh);
  PV.ry = -1.4; PV.ty = 0; PV.tx = 0; PV.amp = 0.2; // spin-in
}
function pvLoop() {
  if (!PV.on) return;
  requestAnimationFrame(pvLoop);
  const t = performance.now() / 1000;
  PV.ry += (PV.ty - PV.ry) * 0.1; PV.rx += (PV.tx - PV.rx) * 0.1;
  PV.amp += (0.04 - PV.amp) * 0.04;
  if (PV.mesh) {
    PV.mesh.rotation.y = PV.ry + Math.sin(t * 0.7) * 0.1;
    PV.mesh.rotation.x = PV.rx + Math.sin(t * 0.5) * 0.03;
    PV.mesh.position.y = Math.sin(t * 1.1) * 0.06;
    PV.mesh.material.uniforms.uT.value = t;
    PV.mesh.material.uniforms.uAmp.value = PV.amp;
  }
  PV.portal.material.uniforms.uTime.value = t;
  PV.embers.material.uniforms.uTime.value = t;
  PV.r.render(PV.scene, PV.cam);
}

function openProduct(id) {
  const p = byId(id); if (!p) return;
  cur = p; curSize = 'L'; curQty = 1;
  $('#pmCat').textContent = CAT[p.cat];
  $('#pmName').textContent = p.name;
  $('#pmPrice').textContent = fmt(p.price);
  $('#pmOld').textContent = p.old ? fmt(p.old) : '';
  $('#pmDesc').textContent = p.desc;
  $('#qVal').textContent = 1;
  $('#pmSizes').innerHTML = ['S', 'M', 'L', 'XL', 'XXL'].map(s => `<button type="button" data-s="${s}" class="${s === 'L' ? 'on' : ''}">${s}</button>`).join('');
  const m = $('#pm');
  m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
  modalOpen = true; lockScroll(true);
  if (pvInit()) {
    $('#pmImg').hidden = true; $('#pvCv').hidden = false;
    pvResize(); pvShow(p);
    if (!PV.on) { PV.on = true; pvLoop(); }
  } else {
    $('#pvCv').hidden = true; $('#pmImg').hidden = false; $('#pmImg').src = p.img;
  }
  if (hasG) gsap.fromTo('.pm-info > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', delay: 0.15 });
}
function closeProduct() {
  $('#pm').classList.remove('open'); $('#pm').setAttribute('aria-hidden', 'true');
  PV.on = false; modalOpen = false;
  if (!$('#dw').classList.contains('open')) lockScroll(false);
}
addEventListener('resize', () => { if (PV.on) pvResize(); });
$('#pm').addEventListener('click', e => { if (e.target.closest('[data-close]')) closeProduct(); });
$('#pmSizes').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  curSize = b.dataset.s; $$('#pmSizes button').forEach(x => x.classList.toggle('on', x === b));
});
$('#qMinus').addEventListener('click', () => { curQty = Math.max(1, curQty - 1); $('#qVal').textContent = curQty; });
$('#qPlus').addEventListener('click', () => { curQty = Math.min(9, curQty + 1); $('#qVal').textContent = curQty; });
$('#pmAdd').addEventListener('click', () => { addToCart(cur.id, curSize, curQty); closeProduct(); setTimeout(() => openCart(), 350); });

/* ---------------------------------------------------------------- CART */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('dragon_cart') || '[]').filter(i => byId(i.id)); } catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem('dragon_cart', JSON.stringify(cart)); } catch (e) { /* noop */ } };
const cartCount = () => cart.reduce((a, i) => a + i.qty, 0);
const cartTotal = () => cart.reduce((a, i) => a + byId(i.id).price * i.qty, 0);
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200);
}
function addToCart(id, size, qty) {
  const ex = cart.find(i => i.id === id && i.size === size);
  if (ex) ex.qty = Math.min(9, ex.qty + qty); else cart.push({ id, size, qty });
  saveCart(); renderCart();
  toast('Added to cart — ' + byId(id).name);
  if (hasG) gsap.fromTo('#cartBtn', { scale: 1.3 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,.4)' });
}
function renderCart() {
  $('#cartCount').textContent = cartCount();
  $('#cartTotal').textContent = fmt(cartTotal());
  const body = $('#cartItems');
  if (!cart.length) { body.innerHTML = '<div class="empty">Your cart is empty.<br>Pick a piece from the collection.</div>'; $('#cartFoot').hidden = true; return; }
  $('#cartFoot').hidden = false;
  body.innerHTML = cart.map((it, i) => {
    const p = byId(it.id);
    return `<div class="ci"><img src="${p.img}" alt=""><div><h4>${p.name}</h4><small>Size ${it.size} · ${fmt(p.price)}</small>
      <div class="row"><div class="qty"><button type="button" data-a="m" data-i="${i}">−</button><span>${it.qty}</span><button type="button" data-a="p" data-i="${i}">+</button></div>
      <button class="rm" type="button" data-a="r" data-i="${i}">Remove</button></div></div></div>`;
  }).join('');
}
function view(v) {
  $('#cartItems').hidden = v !== 'cart'; $('#cartFoot').hidden = v !== 'cart' || !cart.length;
  $('#co').hidden = v !== 'co'; $('#done').hidden = v !== 'done';
}
function openCart() { view('cart'); renderCart(); $('#dw').classList.add('open'); $('#dw').setAttribute('aria-hidden', 'false'); lockScroll(true); }
function closeCart() { $('#dw').classList.remove('open'); $('#dw').setAttribute('aria-hidden', 'true'); if (!modalOpen) lockScroll(false); }
$('#cartBtn').addEventListener('click', openCart);
$('#dw').addEventListener('click', e => { if (e.target.closest('[data-close-cart]')) closeCart(); });
$('#cartItems').addEventListener('click', e => {
  const b = e.target.closest('button[data-a]'); if (!b) return;
  const it = cart[+b.dataset.i]; if (!it) return;
  if (b.dataset.a === 'p') it.qty = Math.min(9, it.qty + 1);
  if (b.dataset.a === 'm') it.qty = Math.max(1, it.qty - 1);
  if (b.dataset.a === 'r') cart.splice(+b.dataset.i, 1);
  saveCart(); renderCart();
});
$('#toCheckout').addEventListener('click', () => view('co'));
$('#coBack').addEventListener('click', () => view('cart'));
$('#co').addEventListener('submit', e => {
  e.preventDefault();
  $('#orderNo').textContent = 'DRG-' + Math.floor(10000 + Math.random() * 90000);
  cart = []; saveCart(); renderCart(); view('done'); e.target.reset();
});
addEventListener('keydown', e => { if (e.key === 'Escape') { if (modalOpen) closeProduct(); else closeCart(); } });

/* ---------------------------------------------------------------- BOOT */
buildChips();
renderFeatured();
renderCart();
initSmooth();
initHero();
playIntro().then(() => {
  document.body.classList.remove('loading');
  heroEnter();
  initScroll();
});
})();
