/* CloudPipe Design Lab · Auto-Generated · Motion */
(function () {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const overlay = document.getElementById('grid-overlay');
  if (overlay) {
    gsap.to(overlay, { opacity: 1, duration: 0.4, ease: 'power2.out',
      onComplete: () => { gsap.to(overlay, { opacity: 0, duration: 0.6, delay: 0.3 }); }
    });
  }

  const coverChars = document.querySelectorAll('.cover__date .char');
  if (coverChars.length && !reduced) {
    gsap.from(coverChars, { y: 80, opacity: 0, duration: 0.7, stagger: 0.04, ease: 'power4.out', delay: 0.2 });
  }
  gsap.from('.cover__sub',  { y: 30, opacity: 0, duration: 0.6, delay: 0.7,  ease: 'power3.out' });
  gsap.from('.cover__meta span', { y: 20, opacity: 0, duration: 0.4, stagger: 0.06, delay: 1.0, ease: 'power2.out' });

  function startCounter(el) {
    const target = parseFloat(el.getAttribute('data-count') || '0');
    const decs   = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (isNaN(target)) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: reduced ? 0 : 1.4, ease: 'power2.out',
      onUpdate: () => { el.textContent = obj.val.toFixed(decs).replace(/\B(?=(\d{3})+(?!\d))/g, ','); },
      onComplete: () => { el.textContent = target.toFixed(decs).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    });
  }

  function animateBars(scene) {
    scene.querySelectorAll('.trustbar, [data-pct]').forEach(bar => {
      const pct  = parseFloat(bar.getAttribute('data-pct') || '0');
      const fill = bar.querySelector('.trustbar__fill');
      if (!fill) return;
      const w = Math.max(pct / 30 * 100, pct > 0 ? 4 : 0);
      gsap.to(fill, { width: w + '%', duration: reduced ? 0 : 1.0, ease: 'power2.out', delay: 0.1 });
    });
  }

  const dots   = document.querySelectorAll('.progress span');
  const scenes = document.querySelectorAll('[data-scene]');

  function setActiveDot(i) {
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
    const now  = document.querySelector('.pagination .now');
    const what = document.querySelector('.pagination .what');
    if (now)  now.textContent  = String(i + 1).padStart(2, '0');
    if (what && scenes[i]) what.textContent = scenes[i].getAttribute('data-label') || '';
  }

  Array.from(scenes).forEach((scene, i) => {
    ScrollTrigger.create({ trigger: scene, start: 'top 60%',
      onEnter: () => setActiveDot(i), onEnterBack: () => setActiveDot(i) });

    const title = scene.querySelector('.scene__title');
    if (title && !reduced) {
      const parts = title.innerHTML.split(/<br\s*\/?>/i);
      title.innerHTML = '';
      parts.forEach(part => {
        const wrap = document.createElement('div');
        wrap.style.overflow = 'hidden';
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.innerHTML = part;
        wrap.appendChild(inner);
        title.appendChild(wrap);
        gsap.from(inner, { y: '110%', opacity: 0, duration: 0.7, ease: 'power4.out',
          scrollTrigger: { trigger: wrap, start: 'top 88%', once: true } });
      });
    }

    scene.querySelectorAll('.scene__label').forEach(label => {
      gsap.from(label, { opacity: 0, x: -20, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: label, start: 'top 90%', once: true } });
    });

    scene.querySelectorAll('[data-count]').forEach(el => {
      ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => startCounter(el) });
    });

    scene.querySelectorAll('.metric').forEach((m, mi) => {
      ScrollTrigger.create({ trigger: m, start: 'top 80%', once: true, onEnter: () => m.classList.add('in-view') });
      if (!reduced) gsap.from(m, { opacity: 0, y: 30, duration: 0.5, delay: mi * 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: m, start: 'top 85%', once: true } });
    });

    scene.querySelectorAll('.brief-card').forEach((card, ci) => {
      if (!reduced) gsap.from(card, { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out',
        delay: ci * 0.1, scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
    });

    scene.querySelectorAll('.outputs__row').forEach((row, ri) => {
      gsap.from(row, { opacity: 0, x: -16, duration: 0.4, delay: ri * 0.06, ease: 'power2.out',
        scrollTrigger: { trigger: row, start: 'top 90%', once: true } });
    });

    scene.querySelectorAll('.hotfix__card').forEach((card, ci) => {
      gsap.from(card, { opacity: 0, y: 20, duration: 0.5, delay: ci * 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
    });

    scene.querySelectorAll('.action').forEach((action, ai) => {
      gsap.from(action, { opacity: 0, x: -24, duration: 0.5, delay: ai * 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: action, start: 'top 90%', once: true } });
    });

    scene.querySelectorAll('.milestone').forEach((ms, mi) => {
      gsap.from(ms, { opacity: 0, x: -12, duration: 0.4, delay: mi * 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: ms, start: 'top 90%', once: true } });
    });

    ScrollTrigger.create({ trigger: scene, start: 'top 60%', once: true, onEnter: () => animateBars(scene) });
  });

  document.querySelectorAll('.scene__label .rule').forEach(rule => {
    gsap.from(rule, { scaleX: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: rule, start: 'top 90%', once: true } });
  });

  document.querySelectorAll('.figures > div').forEach((fig, fi) => {
    gsap.from(fig, { opacity: 0, y: 16, duration: 0.4, delay: fi * 0.07, ease: 'power2.out',
      scrollTrigger: { trigger: fig, start: 'top 88%', once: true } });
  });

  setActiveDot(0);
})();
