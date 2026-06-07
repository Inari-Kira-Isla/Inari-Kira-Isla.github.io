/* CloudPipe Design Lab · Day 001 · Motion Choreography
 * Field.io 流派 — GSAP ScrollTrigger + particle morphs + counters
 */

(function () {
  if (window.gsap) gsap.registerPlugin(ScrollTrigger);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------------------
  // 1) Particle field — mounted on #particles canvas
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('particles');
  const field = window.ParticleField.mount(canvas, {
    count: reduced ? 1400 : 3400,
    accent: 0xFF3D2E,
    paper: 0xF5F1EA,
    initial: 'cloud'
  });
  window.__field = field; // expose for debug

  // -------------------------------------------------------------------------
  // 2) Manual SplitText — char-level for cover date, line-level otherwise.
  //    GSAP SplitText is paid; this lightweight splitter is enough for our 7
  //    headlines.
  // -------------------------------------------------------------------------
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = '';
    const frags = [];
    for (const ch of text) {
      const s = document.createElement('span');
      s.className = 'char';
      s.style.display = 'inline-block';
      s.style.willChange = 'transform, opacity';
      if (ch === ' ') s.innerHTML = '&nbsp;';
      else s.textContent = ch;
      el.appendChild(s);
      frags.push(s);
    }
    return frags;
  }

  function splitLines(el) {
    // We rely on natural line breaks — split by <br> if any, else by word
    // collected into one .split-line. For our headlines we hand-write breaks.
    const html = el.innerHTML;
    const parts = html.split(/<br\s*\/?>/i);
    el.innerHTML = '';
    const lines = [];
    parts.forEach(part => {
      const line = document.createElement('span');
      line.className = 'split-line';
      const inner = document.createElement('span');
      inner.innerHTML = part;
      inner.style.display = 'inline-block';
      inner.style.willChange = 'transform, opacity';
      line.appendChild(inner);
      el.appendChild(line);
      lines.push(inner);
    });
    return lines;
  }

  // -------------------------------------------------------------------------
  // 3) Cover — stagger date digits + sub copy
  // -------------------------------------------------------------------------
  const cover = document.querySelector('.cover');
  if (cover) {
    const dateEl = cover.querySelector('.cover__date');
    const digits = Array.from(dateEl.querySelectorAll('span'));
    // pre-set hidden state
    gsap.set(digits, { yPercent: 110, opacity: 0 });

    const subLines = splitLines(cover.querySelector('.cover__sub'));
    gsap.set(subLines, { yPercent: 110, opacity: 0 });

    const meta = cover.querySelector('.cover__meta');
    gsap.set(meta, { opacity: 0, y: 20 });

    const hint = cover.querySelector('.cover__hint');
    gsap.set(hint, { opacity: 0 });

    const intro = gsap.timeline({ delay: 0.2, defaults: { ease: 'expo.out' } });
    intro
      .to(digits, {
        yPercent: 0, opacity: 1, duration: 1.1,
        stagger: { each: 0.06, from: 'start' }
      })
      .to(subLines, {
        yPercent: 0, opacity: 1, duration: 0.9,
        stagger: 0.1
      }, '-=0.7')
      .to(meta, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to(hint, { opacity: 1, duration: 0.5 }, '-=0.2');
  }

  // -------------------------------------------------------------------------
  // 4) Scene title — line reveal on enter
  // -------------------------------------------------------------------------
  document.querySelectorAll('.scene__title').forEach(title => {
    const lines = splitLines(title);
    gsap.set(lines, { yPercent: 110, opacity: 0 });
    ScrollTrigger.create({
      trigger: title,
      start: 'top 78%',
      onEnter: () => {
        gsap.to(lines, {
          yPercent: 0, opacity: 1, duration: 1.0,
          ease: 'expo.out', stagger: 0.08
        });
      }
    });
  });

  // Scene labels — slide in
  document.querySelectorAll('.scene__label').forEach(label => {
    gsap.set(label, { opacity: 0, x: -20 });
    ScrollTrigger.create({
      trigger: label,
      start: 'top 88%',
      onEnter: () => gsap.to(label, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' })
    });
  });

  // Scene body — fade up
  document.querySelectorAll('.scene__body').forEach(b => {
    gsap.set(b, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: b,
      start: 'top 84%',
      onEnter: () => gsap.to(b, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    });
  });

  // -------------------------------------------------------------------------
  // 5) Section choreography — formations + counters + progress dots
  // -------------------------------------------------------------------------
  const sections = Array.from(document.querySelectorAll('[data-scene]'));
  const progressDots = Array.from(document.querySelectorAll('.progress span'));
  const paginationNow = document.querySelector('.pagination .now');
  const paginationLabel = document.querySelector('.pagination .what');

  const choreo = {
    cover:      { form: 'cloud',     args: {},                ambient: { rotateY: 0.025 } },
    executive:  { form: 'cluster',   args: { clusters: 4 },   ambient: { rotateY: 0.012 } },
    milestones: { form: 'column',    args: { columns: 4 },    ambient: { rotateY: 0.018 } },
    outputs:    { form: 'grid',      args: {},                ambient: { rotateY: 0.008 } },
    hotfix:     { form: 'cluster',   args: { clusters: 4 },   ambient: { rotateY: 0.03  } },
    snapshot:   { form: 'wave',      args: {},                ambient: { rotateY: 0.022 } },
    roadmap:    { form: 'ring',      args: {},                ambient: { rotateY: 0.04  } },
    actions:    { form: 'cluster',   args: { clusters: 5 },   ambient: { rotateY: 0.018 } },
    footer:     { form: 'drift',     args: {},                ambient: { rotateY: 0.05  } }
  };

  sections.forEach((sec, idx) => {
    const key = sec.dataset.scene;
    const conf = choreo[key];
    if (!conf) return;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter:    () => activate(sec, key, conf, idx),
      onEnterBack:() => activate(sec, key, conf, idx)
    });
  });

  function activate(sec, key, conf, idx) {
    field.morphTo(conf.form, conf.args, 1.6);
    field.setAmbient(conf.ambient);
    // progress dots
    progressDots.forEach((d, i) => d.classList.toggle('is-active', i <= idx));
    // pagination
    if (paginationNow) paginationNow.textContent = String(idx + 1).padStart(2, '0');
    if (paginationLabel) paginationLabel.textContent = sec.dataset.label || '';
  }

  // Trigger initial state once layout settles
  if (sections[0]) {
    requestAnimationFrame(() => {
      const c = choreo[sections[0].dataset.scene];
      if (c) { field.morphTo(c.form, c.args, 0.001); field.setAmbient(c.ambient); }
      progressDots.forEach((d, i) => d.classList.toggle('is-active', i === 0));
    });
  }

  // -------------------------------------------------------------------------
  // 6) Animated counters (§01 hero metrics + §05 figures)
  // -------------------------------------------------------------------------
  function tweenCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    el.textContent = prefix + (0).toFixed(decimals) + suffix;
    gsap.to(obj, {
      v: target,
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = prefix + obj.v.toFixed(decimals) + suffix;
      }
    });
  }
  document.querySelectorAll('[data-count]').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => tweenCounter(el)
    });
  });

  // -------------------------------------------------------------------------
  // 7) Trust bars — scaleX based on data-pct
  // -------------------------------------------------------------------------
  document.querySelectorAll('.trustbar').forEach((bar, i) => {
    const fill = bar.querySelector('.trustbar__fill');
    const pct = parseFloat(bar.dataset.pct);
    const max = 30; // visual ceiling; baseline numbers are all under 12% so scale up
    const scale = Math.min(1, pct / max);
    gsap.set(fill, { scaleX: 0 });
    ScrollTrigger.create({
      trigger: bar, start: 'top 85%', once: true,
      onEnter: () => {
        gsap.to(fill, {
          scaleX: scale,
          duration: 1.4 + i * 0.1,
          ease: 'power3.out',
          delay: i * 0.08
        });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 8) Hotfix typewriter — type out the root-cause text
  // -------------------------------------------------------------------------
  document.querySelectorAll('[data-typewriter]').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', once: true,
      onEnter: () => {
        el.classList.add('blink');
        const obj = { i: 0 };
        gsap.to(obj, {
          i: text.length,
          duration: Math.min(2.2, text.length * 0.025),
          ease: 'none',
          onUpdate: () => {
            const n = Math.floor(obj.i);
            el.textContent = text.slice(0, n);
          },
          onComplete: () => {
            el.textContent = text;
            setTimeout(() => el.classList.remove('blink'), 1400);
          }
        });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 9) Timeline items — reveal sequentially
  // -------------------------------------------------------------------------
  ScrollTrigger.create({
    trigger: '.timeline',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap.from('.tl-item', {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        stagger: 0.12
      });
    }
  });

  // Outputs rows
  ScrollTrigger.create({
    trigger: '.outputs',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      gsap.from('.outputs__row', {
        opacity: 0, y: 24, duration: 0.7, ease: 'power3.out',
        stagger: 0.08
      });
    }
  });

  // Actions
  ScrollTrigger.create({
    trigger: '.actions',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      gsap.from('.action', {
        opacity: 0, x: -24, duration: 0.7, ease: 'power3.out',
        stagger: 0.1
      });
    }
  });

  // Roadmap milestones
  ScrollTrigger.create({
    trigger: '.roadmap__rail',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap.from('.milestone', {
        opacity: 0, y: 24, duration: 0.6, ease: 'power3.out',
        stagger: 0.06
      });
    }
  });

  // -------------------------------------------------------------------------
  // 10) Mouse parallax on particle field
  // -------------------------------------------------------------------------
  if (!reduced) {
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.2;
    });
    function loop() {
      curX += (targetX - curX) * 0.04;
      curY += (targetY - curY) * 0.04;
      field.points.rotation.y += (curX - field.points.rotation.y * 0.0) * 0; // no-op kept to show intent
      field.camera.position.x = curX * 0.5;
      field.camera.position.y = -curY * 0.4;
      field.camera.lookAt(0, 0, 0);
      requestAnimationFrame(loop);
    }
    loop();
  }

  // ScrollTrigger refresh once everything is set up
  setTimeout(() => ScrollTrigger.refresh(), 100);
})();
