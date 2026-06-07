/* CloudPipe Design Lab — Particle Field utility (Field.io 流派)
 *
 * Reusable Three.js particle field with formation morphing.
 * - 3000+ particles, additive blending, DPR cap 2
 * - Formations: cloud / sphere / cluster(N) / grid / wave / column / ring
 * - GSAP-driven morph: tween a `progress` between two snapshots
 * - Honors prefers-reduced-motion
 *
 * Usage:
 *   const field = window.ParticleField.mount(canvasEl, { count: 3200, accent: 0xFF3D2E });
 *   field.morphTo('cluster', { clusters: 4 }, 1.6);
 *   field.setAmbient({ rotateY: 0.04 });
 */

(function () {
  const PARTICLE_BUDGET = 3200;
  const DPR_CAP = 2;

  function rand(min, max) { return min + Math.random() * (max - min); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // --- Formation generators -------------------------------------------------
  // All formations return Float32Array(count*3) in [-1,1] coordinate cube.
  const Formations = {
    cloud(count) {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        arr[i*3+0] = rand(-1, 1);
        arr[i*3+1] = rand(-0.6, 0.6);
        arr[i*3+2] = rand(-1, 1);
      }
      return arr;
    },
    sphere(count) {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const u = Math.random(), v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 0.85 + Math.random() * 0.1;
        arr[i*3+0] = r * Math.sin(phi) * Math.cos(theta);
        arr[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
        arr[i*3+2] = r * Math.cos(phi);
      }
      return arr;
    },
    cluster(count, opts) {
      const n = (opts && opts.clusters) || 4;
      const centers = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        centers.push([Math.cos(a) * 0.65, Math.sin(a) * 0.35, rand(-0.3, 0.3)]);
      }
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const c = centers[i % n];
        const r = Math.pow(Math.random(), 1.6) * 0.28;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        arr[i*3+0] = c[0] + r * Math.sin(phi) * Math.cos(theta);
        arr[i*3+1] = c[1] + r * Math.sin(phi) * Math.sin(theta) * 0.75;
        arr[i*3+2] = c[2] + r * Math.cos(phi);
      }
      return arr;
    },
    grid(count) {
      const arr = new Float32Array(count * 3);
      const side = Math.ceil(Math.sqrt(count));
      for (let i = 0; i < count; i++) {
        const ix = i % side, iy = Math.floor(i / side) % side;
        arr[i*3+0] = (ix / (side-1)) * 1.8 - 0.9;
        arr[i*3+1] = (iy / (side-1)) * 1.0 - 0.5;
        arr[i*3+2] = Math.sin(ix * 0.4 + iy * 0.4) * 0.08;
      }
      return arr;
    },
    wave(count) {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const x = t * 2 - 1;
        const lane = (i % 9) / 9;
        arr[i*3+0] = x;
        arr[i*3+1] = Math.sin(x * 6 + lane * 6) * 0.35 + (lane - 0.5) * 0.5;
        arr[i*3+2] = Math.cos(x * 4 + lane * 3) * 0.25;
      }
      return arr;
    },
    column(count, opts) {
      const cols = (opts && opts.columns) || 7;
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const x = (col / (cols - 1)) * 1.6 - 0.8;
        const y = rand(-0.8, 0.8);
        const z = rand(-0.15, 0.15);
        arr[i*3+0] = x + rand(-0.015, 0.015);
        arr[i*3+1] = y;
        arr[i*3+2] = z;
      }
      return arr;
    },
    ring(count) {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 0.7 + Math.random() * 0.15;
        const tilt = (Math.random() - 0.5) * 0.18;
        arr[i*3+0] = Math.cos(a) * r;
        arr[i*3+1] = Math.sin(a) * r * 0.45 + tilt;
        arr[i*3+2] = Math.sin(a) * r * 0.3;
      }
      return arr;
    },
    drift(count) {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        arr[i*3+0] = rand(-1.1, 1.1);
        arr[i*3+1] = rand(-0.8, 0.8);
        arr[i*3+2] = rand(-0.6, 0.6);
      }
      return arr;
    }
  };

  function mount(canvas, options) {
    const opts = Object.assign({
      count: PARTICLE_BUDGET,
      accent: 0xFF3D2E,
      paper: 0xF5F1EA,
      initial: 'cloud'
    }, options || {});

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = reduced ? Math.floor(opts.count * 0.4) : opts.count;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(0, 0, 2.4);

    const renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: false, powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
    renderer.setClearColor(0x000000, 0);

    // Two snapshot positions for morphing
    const A = Formations[opts.initial](count);
    const B = new Float32Array(A);
    const positions = new Float32Array(A); // live buffer

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Per-particle color mix between paper and accent
    const colors = new Float32Array(count * 3);
    const cA = new THREE.Color(opts.paper);
    const cB = new THREE.Color(opts.accent);
    for (let i = 0; i < count; i++) {
      const t = Math.pow(Math.random(), 2.2);
      const c = cA.clone().lerp(cB, t * 0.45);
      colors[i*3+0] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Per-particle size jitter
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) sizes[i] = rand(0.6, 2.6);
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    // ShaderMaterial — additive, soft round point with subtle glow
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uPxRatio: { value: renderer.getPixelRatio() },
        uOpacity: { value: 0.95 }
      },
      vertexShader: `
        attribute float aSize;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPxRatio;
        void main() {
          vColor = color;
          vec3 p = position;
          // Tiny breathing on z so the cloud feels alive even when static
          p.z += sin(uTime * 0.6 + position.x * 4.0 + position.y * 3.2) * 0.012;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float dist = -mv.z;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uPxRatio * (260.0 / dist);
          vAlpha = clamp(1.4 - dist * 0.35, 0.25, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uOpacity;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          float glow = smoothstep(0.5, 0.15, d);
          float a = (core * 0.85 + glow * 0.45) * vAlpha * uOpacity;
          gl_FragColor = vec4(vColor, a);
        }
      `
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // --- Morphing state ----------------------------------------------------
    const state = {
      progress: 1,   // 1 means we are at "current" snapshot (A is target, B is from)
      ambient: { rotateY: 0.04, rotateX: 0.0, breathe: 1.0 }
    };

    function commitProgress() {
      // Lerp B -> A by state.progress (0..1) into positions buffer
      const t = clamp(state.progress, 0, 1);
      // Smoother ease applied per-frame for less linearity
      const e = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
      const pos = positions;
      for (let i = 0; i < pos.length; i++) {
        pos[i] = B[i] + (A[i] - B[i]) * e;
      }
      geo.attributes.position.needsUpdate = true;
    }

    function setFormation(name, opts2) {
      // shift current A -> B (so we tween from where we are)
      for (let i = 0; i < B.length; i++) B[i] = positions[i];
      const next = (Formations[name] || Formations.cloud)(count, opts2 || {});
      for (let i = 0; i < A.length; i++) A[i] = next[i];
      state.progress = 0;
    }

    function morphTo(name, opts2, duration) {
      setFormation(name, opts2);
      if (window.gsap) {
        gsap.to(state, {
          progress: 1,
          duration: duration || 1.4,
          ease: 'power2.inOut',
          overwrite: 'auto'
        });
      } else {
        state.progress = 1;
        commitProgress();
      }
    }

    function setAmbient(amb) {
      Object.assign(state.ambient, amb || {});
    }

    // --- Resize ------------------------------------------------------------
    function resize() {
      const parent = canvas.parentElement;
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      mat.uniforms.uPxRatio.value = renderer.getPixelRatio();
    }
    resize();
    window.addEventListener('resize', resize);

    // --- Render loop -------------------------------------------------------
    let clock = new THREE.Clock();
    let raf = 0;
    function tick() {
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      const t = clock.elapsedTime;
      mat.uniforms.uTime.value = t;

      // commit morph progress every frame (cheap)
      commitProgress();

      // gentle ambient drift
      points.rotation.y += dt * (state.ambient.rotateY || 0);
      points.rotation.x = Math.sin(t * 0.15) * 0.08 + (state.ambient.rotateX || 0);

      renderer.render(scene, camera);
    }
    if (!reduced) tick();
    else {
      // Reduced motion: one static render, no loop
      commitProgress();
      renderer.render(scene, camera);
    }

    return {
      scene, camera, renderer, points,
      morphTo, setAmbient, setFormation,
      get state() { return state; },
      destroy() {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        geo.dispose(); mat.dispose(); renderer.dispose();
      }
    };
  }

  window.ParticleField = { mount, Formations };
})();
