/**
 * Eau animée du port (V2) : une photo plate, déformée par un petit programme graphique (shader WebGL).
 * Aucune bibliothèque : rien d'autre à charger.
 *
 * - Un « masque » (image noir et blanc) dit où se trouve l'eau : le ciel, les bâtiments et les coques
 *   des bateaux restent fixes, seule l'eau bouge.
 * - Les vagues suivent la perspective : fines et lentes au loin, larges et plus marquées près de nous.
 * - Le passage de la souris (ou du doigt) laisse des ondulations qui s'élargissent puis s'éteignent.
 */

export interface WaterParams {
  /** Hauteur des vagues (1 = réglage de base). */
  amplitude: number;
  /** Vitesse de l'animation. */
  speed: number;
  /** Finesse : plus grand = vagues plus serrées. */
  fineness: number;
  /** Force des ondulations laissées par la souris. */
  pointer: number;
  /** Cadrage vertical quand l'écran est moins haut que la photo (comme `object-position`) : 0 = haut, 1 = bas. */
  focusY: number;
  /** Colore en rouge la zone d'eau qui bouge (pour vérifier le masque). */
  showMask: boolean;
}

// Réglages choisis par le client sur la page d'essai (/v2/eau) : hauteur 3 (le maximum du
// curseur), vitesse 1,30, finesse 2. Avant : 1,5 / 1,2 / 1.
export const DEFAULT_WATER_PARAMS: WaterParams = {
  amplitude: 3,
  speed: 1.3,
  fineness: 2,
  pointer: 1,
  focusY: 0.75,
  showMask: false,
};

/** Une photo + son masque d'eau (blanc = l'eau bouge). */
export interface WaterSource {
  image: string;
  mask: string;
  /** Hauteur (0 = haut, 1 = bas) où la perspective de l'eau « se perd » : au niveau des quais. */
  horizon: number;
}

const MAX_DROPS = 8;

/** Pixels d'écran couverts par la largeur entière de la photo sur un ordinateur (1 280 px / 0,9). */
const REFERENCE_PX_PER_UV_X = 1400;

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;
varying vec2 vUv;

uniform sampler2D uTex;
uniform sampler2D uMaskTex;
uniform vec2 uScale;      // portion visible de la photo (cadrage « cover »)
uniform vec2 uOffset;
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uFreqX;     // finesse dans le sens de la largeur (adaptée à la largeur de l'écran)
uniform float uPointer;
uniform float uHorizon;
uniform float uAspect;    // largeur / hauteur de la photo
uniform float uShowMask;
uniform vec4 uDrops[${MAX_DROPS}]; // x, y (photo), naissance, force

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  vec2 uv = vUv * uScale + uOffset;

  float mask = texture2D(uMaskTex, uv).r;
  vec2 disp = vec2(0.0);
  float shimmer = 0.0;

  if (mask > 0.01) {
    float d = max(uv.y - uHorizon, 0.0);       // profondeur sous les quais
    float depth = clamp(d, 0.0, 1.0);
    float z = 1.0 / (d + 0.05);                // perspective : le lointain est compressé

    // Houle : décale les reflets d'un côté puis de l'autre
    float n = noise(vec2(uv.x * 7.0 * uFreqX, z * 0.9) + vec2(uTime * 0.2, uTime * 0.3));
    float swell = sin(z * 3.2 * uFreq + uTime * 1.5 + n * 6.0);
    // Clapot : petites rides plus rapides
    float chop = sin(uv.x * 60.0 * uFreqX * (0.5 + depth) + z * 2.4 - uTime * 1.3 + n * 5.0);

    float strength = (0.35 + depth * 2.2) * uAmp * 0.011 * mask;
    disp.x += (swell * 0.7 + chop * 0.35) * strength;
    disp.y += (n - 0.5) * strength * 1.4;
    shimmer = chop * 0.5 + swell * 0.5;
  }

  // Ondulations laissées par la souris / le doigt
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    vec4 drop = uDrops[i];
    float age = uTime - drop.z;
    if (age > 0.0 && age < 5.0) {
      vec2 delta = (uv - drop.xy) * vec2(uAspect, 1.0);
      delta.y *= 2.6;                          // cercles vus en perspective = ellipses
      float r = length(delta) + 0.0001;
      float front = age * 0.2;
      float rel = (r - front) / 0.045;
      float band = exp(-rel * rel);
      float ring = sin((r - front) * 70.0) * band;
      float fade = exp(-age * 0.9) * drop.w;
      disp += (delta / r) * vec2(1.0 / uAspect, 0.4) * ring * fade * 0.012 * uPointer * mask;
    }
  }

  vec3 col = texture2D(uTex, clamp(uv + disp, 0.0, 1.0)).rgb;
  // Scintillements de lumière sur les vagues
  col += (disp.x * 12.0 + shimmer * 0.015 * uAmp) * mask * vec3(1.0, 0.95, 0.85);

  if (uShowMask > 0.5) col = mix(col, vec3(1.0, 0.1, 0.1), mask * 0.45);
  gl_FragColor = vec4(col, 1.0);
}
`;

export interface WaterOptions {
  canvas: HTMLCanvasElement;
  source: WaterSource;
  params: WaterParams;
  /** Vrai : une seule image fixe, pas de boucle ni de réaction au pointeur (mouvement réduit). */
  still: boolean;
  /** Appelé quand la première image est dessinée (le canvas peut remplacer la photo de secours). */
  onReady: () => void;
  /** Appelé si WebGL est indisponible ou perdu : on garde la photo de secours. */
  onFail: () => void;
  /** Facultatif : nombre d'images dessinées par seconde (diagnostic du banc d'essai). */
  onFps?: (fps: number) => void;
}

export interface WaterRenderer {
  setParams: (params: WaterParams) => void;
  destroy: () => void;
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("createShader a échoué");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "Erreur de shader");
  }
  return shader;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Image introuvable : ${url}`));
    image.src = url;
  });
}

export function createWaterRenderer(options: WaterOptions): WaterRenderer | null {
  const { canvas, source, still, onReady, onFail, onFps } = options;
  let params = options.params;

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  let program: WebGLProgram;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("link");
  } catch {
    return null;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = {
    tex: u("uTex"),
    maskTex: u("uMaskTex"),
    scale: u("uScale"),
    offset: u("uOffset"),
    time: u("uTime"),
    amp: u("uAmp"),
    freq: u("uFreq"),
    freqX: u("uFreqX"),
    pointer: u("uPointer"),
    horizon: u("uHorizon"),
    aspect: u("uAspect"),
    showMask: u("uShowMask"),
    drops: u("uDrops"),
  };

  const drops = new Float32Array(MAX_DROPS * 4);
  for (let i = 0; i < MAX_DROPS; i++) drops[i * 4 + 2] = -100;
  let nextDrop = 0;

  let imageAspect = 2 / 3;
  let ready = false;
  let destroyed = false;
  let visible = true;
  let raf = 0;
  let clock = 0; // secondes d'animation (ne tourne que quand la boucle tourne)
  let last = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let slowFrames = 0;
  let frames = 0;
  let fpsFrames = 0;
  let fpsStart = 0;
  let view = { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 };
  // Largeur de l'écran (en pixels CSS) rapportée à la part de photo visible : « combien de pixels
  // occupe la largeur entière de la photo ». Sert à garder des ondulations de même taille à l'écran.
  let pxPerUvX = REFERENCE_PX_PER_UV_X;

  /**
   * Les petites ondulations sont calculées sur la largeur de la PHOTO : sur un téléphone, 3 fois plus
   * étroit qu'un ordinateur, elles étaient 2,5 fois plus serrées (effet « marbré », peu naturel). On les
   * élargit donc quand l'écran est étroit, pour retrouver à peu près la même taille de vague à
   * l'écran. Sur ordinateur (facteur plafonné à 1), rien ne change.
   */
  function widthFactor() {
    return Math.min(1, Math.max(0.3, pxPerUvX / REFERENCE_PX_PER_UV_X));
  }

  function computeView() {
    const screenAspect = canvas.width / Math.max(canvas.height, 1);
    let scaleX = 1;
    let scaleY = 1;
    if (screenAspect > imageAspect) scaleY = imageAspect / screenAspect;
    else scaleX = screenAspect / imageAspect;
    const offsetX = (1 - scaleX) / 2;
    // Même règle que `object-position` en CSS : la photo de secours se cale donc exactement pareil.
    const offsetY = params.focusY * (1 - scaleY);
    view = { scaleX, scaleY, offsetX, offsetY };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
    }
    computeView();
    pxPerUvX = rect.width / view.scaleX;
  }

  function draw() {
    if (!ready) return;
    const g = gl!;
    computeView();
    g.uniform2f(uniforms.scale, view.scaleX, view.scaleY);
    g.uniform2f(uniforms.offset, view.offsetX, view.offsetY);
    g.uniform1f(uniforms.time, clock);
    g.uniform1f(uniforms.amp, params.amplitude);
    g.uniform1f(uniforms.freq, params.fineness);
    g.uniform1f(uniforms.freqX, params.fineness * widthFactor());
    g.uniform1f(uniforms.pointer, params.pointer);
    g.uniform1f(uniforms.horizon, source.horizon);
    g.uniform1f(uniforms.aspect, imageAspect);
    g.uniform1f(uniforms.showMask, params.showMask ? 1 : 0);
    g.uniform4fv(uniforms.drops, drops);
    g.drawArrays(g.TRIANGLES, 0, 3);
  }

  function frame(now: number) {
    raf = 0;
    if (destroyed) return;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    clock += dt * params.speed;
    draw();

    if (onFps) {
      if (!fpsStart) fpsStart = now;
      fpsFrames += 1;
      if (now - fpsStart >= 1000) {
        onFps(Math.round((fpsFrames * 1000) / (now - fpsStart)));
        fpsFrames = 0;
        fpsStart = now;
      }
    }

    // Machines modestes : on baisse la résolution du canvas plutôt que de saccader.
    frames += 1;
    if (dt > 0.034) slowFrames += 1;
    if (frames === 90) {
      if (slowFrames > 30 && dpr > 0.75) {
        dpr = Math.max(0.75, dpr - 0.5);
        resize();
      }
      frames = 0;
      slowFrames = 0;
    }
    schedule();
  }

  function schedule() {
    if (!raf && !destroyed && ready && visible && !still && !document.hidden) {
      raf = requestAnimationFrame(frame);
    }
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    fpsStart = 0;
    fpsFrames = 0;
  }

  // ----- Pointeur -----
  let lastDrop = { x: -1e4, y: -1e4, t: 0 };

  function addDrop(clientX: number, clientY: number, strength: number) {
    const rect = canvas.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return;
    }
    const sx = (clientX - rect.left) / rect.width;
    const sy = (clientY - rect.top) / rect.height;
    const ix = sx * view.scaleX + view.offsetX;
    const iy = sy * view.scaleY + view.offsetY;
    if (iy < source.horizon - 0.04) return; // ni dans le ciel ni sur les bâtiments
    const i = nextDrop;
    nextDrop = (nextDrop + 1) % MAX_DROPS;
    drops[i * 4] = ix;
    drops[i * 4 + 1] = iy;
    drops[i * 4 + 2] = clock;
    drops[i * 4 + 3] = strength;
  }

  function onPointerMove(event: PointerEvent) {
    const now = performance.now();
    const dx = event.clientX - lastDrop.x;
    const dy = event.clientY - lastDrop.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 28 || now - lastDrop.t < 60) return;
    const speed = dist / Math.max(now - lastDrop.t, 1); // px par ms
    addDrop(event.clientX, event.clientY, Math.min(0.35 + speed * 0.5, 1.1));
    lastDrop = { x: event.clientX, y: event.clientY, t: now };
  }

  function onPointerDown(event: PointerEvent) {
    addDrop(event.clientX, event.clientY, 1.3);
    lastDrop = { x: event.clientX, y: event.clientY, t: performance.now() };
  }

  if (!still) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (ready && !raf) draw();
  });
  resizeObserver.observe(canvas);

  const intersection = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible) schedule();
    else stop();
  });
  intersection.observe(canvas);

  const onVisibility = () => (document.hidden ? stop() : schedule());
  document.addEventListener("visibilitychange", onVisibility);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    ready = false;
    onFail();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  // ----- Textures (photo + masque) -----
  function upload(unit: number, image: HTMLImageElement) {
    const g = gl!;
    const texture = g.createTexture();
    g.activeTexture(g.TEXTURE0 + unit);
    g.bindTexture(g.TEXTURE_2D, texture);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, image);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
  }

  Promise.all([loadImage(source.image), loadImage(source.mask)])
    .then(([photo, mask]) => {
      if (destroyed) return;
      upload(0, photo);
      upload(1, mask);
      gl.uniform1i(uniforms.tex, 0);
      gl.uniform1i(uniforms.maskTex, 1);
      imageAspect = photo.naturalWidth / photo.naturalHeight;
      ready = true;
      resize();
      draw();
      onReady();
      schedule();
    })
    .catch(() => {
      if (!destroyed) onFail();
    });

  return {
    setParams(next) {
      params = next;
      if (ready) {
        computeView();
        draw(); // image immédiate : les curseurs réagissent même si la boucle est en pause
      }
    },
    destroy() {
      destroyed = true;
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      resizeObserver.disconnect();
      intersection.disconnect();
    },
  };
}
