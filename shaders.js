/* DRAGON — GLSL shaders (used with THREE.ShaderMaterial) */
window.DRG_SHADERS = {
  /* ---------- Intro: GPU particles that converge into the word DRAGON ---------- */
  intro: {
    vs: `
      attribute vec3 aTarget; attribute vec4 aRand; attribute vec3 aColor;
      uniform float uTime, uConv, uBurst, uPx;
      varying vec3 vC; varying float vA;
      void main(){
        float p = clamp((uConv - aRand.x*0.55)/0.45, 0.0, 1.0);
        float e = 1.0 - pow(1.0 - p, 3.0);
        float ang = uTime*0.25*aRand.y + aRand.w*6.2831;
        float c = cos(ang), s = sin(ang);
        vec3 o = vec3(position.x*c - position.z*s, position.y, position.x*s + position.z*c);
        vec3 d = aTarget - o;
        vec3 perp = vec3(-d.y, d.x, 0.0) * 0.55;
        vec3 pos = mix(o, aTarget, e) + perp * (e*(1.0-e)) * 1.6;
        pos += vec3(sin(uTime*2.0+aRand.w*50.0), cos(uTime*1.7+aRand.w*30.0), sin(uTime+aRand.w*10.0)) * 0.02 * e;
        vec3 dir = normalize(aTarget*vec3(0.35,0.35,0.0) + vec3(0.0,0.0,1.2) + (aRand.zyx-0.5)*1.5);
        pos += dir * uBurst*uBurst * 16.0 * (0.5 + aRand.y);
        vC = aColor;
        vA = mix(0.35, 1.0, e) * (1.0 - clamp(uBurst*1.4, 0.0, 1.0));
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (0.04 + aRand.z*0.05) * uPx / max(0.1, -mv.z);
      }`,
    fs: `
      precision highp float;
      varying vec3 vC; varying float vA;
      void main(){
        float d = length(gl_PointCoord - 0.5)*2.0;
        float a = smoothstep(1.0, 0.0, d); a *= a;
        gl_FragColor = vec4(vC*(1.0 + a*0.6), a*vA);
      }`
  },

  /* ---------- Product card (rounded, cover-cropped photo, fog, edge glow) ---------- */
  card: {
    vs: `
      varying vec2 vUv; varying float vZ;
      void main(){
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vZ = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fs: `
      precision highp float;
      varying vec2 vUv; varying float vZ;
      uniform sampler2D uTex;
      uniform float uImgAsp, uCardAsp, uBright, uGlow, uAlpha, uRefl;
      uniform vec2 uFog;
      float rr(vec2 u, float asp){
        vec2 p = (u - 0.5) * vec2(asp, 1.0);
        vec2 h = vec2(asp, 1.0) * 0.5;
        float r = 0.055;
        vec2 q = abs(p) - h + r;
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }
      void main(){
        float d = rr(vUv, uCardAsp);
        float mask = 1.0 - smoothstep(-0.003, 0.003, d);
        vec2 t = vUv;
        if (uImgAsp > uCardAsp) { t.x = (t.x - 0.5) * (uCardAsp/uImgAsp) + 0.5; }
        else { t.y = (t.y - 0.5) * (uImgAsp/uCardAsp) + 0.5; }
        vec3 c = texture2D(uTex, t).rgb * uBright;
        float vig = smoothstep(0.95, 0.35, length((vUv - 0.5) * vec2(1.0, 1.15)));
        c *= mix(0.8, 1.0, vig);
        float edge = smoothstep(-0.035, 0.0, d) * mask;
        c += vec3(1.0, 0.28, 0.05) * edge * uGlow;
        float fog = smoothstep(uFog.x, uFog.y, vZ);
        c = mix(c, vec3(0.02, 0.015, 0.02), fog*0.85);
        float a = mask * uAlpha;
        if (uRefl > 0.5) { a *= (1.0 - vUv.y) * (1.0 - vUv.y); }
        gl_FragColor = vec4(c * a, a);
      }`
  },

  /* ---------- Product viewer: hanging-cloth wave plane ---------- */
  wave: {
    vs: `
      uniform vec2 uSize; uniform float uT, uAmp;
      varying vec2 vUv; varying vec3 vN;
      void main(){
        vUv = uv;
        float ph = uv.y*5.0 + uT*1.7 + uv.x*3.0;
        float hang = (1.0 - uv.y)*0.85 + 0.15;
        float z = sin(ph) * uAmp * hang;
        float dzdy = (cos(ph)*5.0*uAmp*hang - sin(ph)*uAmp*0.85) / uSize.y;
        float dzdx = cos(ph)*3.0*uAmp*hang / uSize.x;
        vec3 n = normalize(vec3(-dzdx, -dzdy, 1.0));
        vN = (modelViewMatrix * vec4(n, 0.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, z, 1.0);
      }`,
    fs: `
      precision highp float;
      varying vec2 vUv; varying vec3 vN;
      uniform sampler2D uTex;
      uniform float uImgAsp, uCardAsp;
      float rr(vec2 u, float asp){
        vec2 p = (u - 0.5) * vec2(asp, 1.0);
        vec2 h = vec2(asp, 1.0) * 0.5;
        float r = 0.04;
        vec2 q = abs(p) - h + r;
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }
      void main(){
        float d = rr(vUv, uCardAsp);
        float mask = 1.0 - smoothstep(-0.003, 0.003, d);
        vec2 t = vUv;
        if (uImgAsp > uCardAsp) { t.x = (t.x - 0.5) * (uCardAsp/uImgAsp) + 0.5; }
        else { t.y = (t.y - 0.5) * (uImgAsp/uCardAsp) + 0.5; }
        vec3 c = texture2D(uTex, t).rgb;
        vec3 n = normalize(vN);
        if (!gl_FrontFacing) { n = -n; c *= 0.35; }
        vec3 L = normalize(vec3(-0.35, 0.55, 0.75));
        float df = max(dot(n, L), 0.0);
        c *= 0.62 + 0.5*df;
        c += pow(max(dot(reflect(-L, n), vec3(0.0,0.0,1.0)), 0.0), 24.0) * 0.18;
        float edge = smoothstep(-0.03, 0.0, d) * mask;
        c += vec3(1.0, 0.3, 0.06) * edge * 0.55;
        gl_FragColor = vec4(c * mask, mask);
      }`
  },

  /* ---------- Fire portal ring (fullscreen quad behind everything) ---------- */
  portal: {
    vs: `
      varying vec2 vP;
      void main(){ vP = position.xy; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fs: `
      precision highp float;
      varying vec2 vP;
      uniform float uTime, uAsp, uR, uInt;
      uniform vec2 uC;
      void main(){
        vec2 p = vP - uC; p.x *= uAsp;
        float r = length(p); float a = atan(p.y, p.x);
        float n = sin(a*7.0 + uTime*1.3)*0.5 + sin(a*13.0 - uTime*1.9)*0.5;
        float rr = uR + n*0.012;
        float dd = abs(r - rr);
        float core = 0.006/(dd + 0.004);
        float glow = exp(-dd*7.0);
        float fill = exp(-r*1.8)*0.22;
        vec3 col = vec3(1.0, 0.22, 0.02)*(glow*0.55 + fill) + vec3(1.0, 0.75, 0.3)*core*0.45;
        col *= uInt;
        float al = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
        gl_FragColor = vec4(col, al);
      }`
  },

  /* ---------- Rising embers (animated entirely in the vertex shader) ---------- */
  ember: {
    vs: `
      attribute vec4 aSeed;
      uniform float uTime, uPx;
      varying float vA; varying vec3 vC;
      void main(){
        float spd = 0.25 + aSeed.y*0.7;
        float y = mod(position.y + uTime*spd + 8.0, 16.0) - 8.0;
        float x = position.x + sin(uTime*0.6*aSeed.z + aSeed.x*20.0)*0.5;
        vec4 mv = modelViewMatrix * vec4(x, y, position.z, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (0.025 + aSeed.w*0.05) * uPx / max(0.1, -mv.z);
        vA = smoothstep(8.0, 5.0, abs(y)) * (0.4 + aSeed.w*0.6) * (0.6 + 0.4*sin(uTime*3.0 + aSeed.x*30.0));
        vC = mix(vec3(1.0, 0.25, 0.03), vec3(1.0, 0.75, 0.25), aSeed.z);
      }`,
    fs: `
      precision highp float;
      varying float vA; varying vec3 vC;
      void main(){
        float d = length(gl_PointCoord - 0.5)*2.0;
        float a = smoothstep(1.0, 0.0, d); a *= a * vA;
        gl_FragColor = vec4(vC * a, a * 0.25);
      }`
  }
};
