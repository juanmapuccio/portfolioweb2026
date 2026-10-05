// Franjas Pincel — vanilla JS enhancements (the original canvas is pure CSS).
// 1) Pause off-screen animations. 2) Highlight the active category in the nav.
(() => {
  'use strict';
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.dv-opt').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const options = document.querySelectorAll('.dv-opt');
  const optObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('is-visible', e.isIntersecting)),
    { rootMargin: '200px 0px' }
  );
  options.forEach((el) => optObserver.observe(el));

  // 2) Highlight active category in nav
  const links = new Map();
  document.querySelectorAll('.cat-nav a[href^="#cat-"]').forEach((a) => links.set(a.getAttribute('href').slice(1), a));
  const sections = document.querySelectorAll('section.dv-turn');
  const navObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-active'));
        links.get(e.target.id)?.classList.add('is-active');
      }),
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => navObserver.observe(s));

  // 3) 3D Card Tilt + Spotlight tracking
  document.querySelectorAll('.dv-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);

      // Gentle 3D tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    // 4) Click ink splash ripple
    card.addEventListener('pointerdown', (e) => {
      const rect = card.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ink-ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // 5) Fluid mouse brush trail (sumi-e stroke on canvas)
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !('ontouchstart' in window)) {
    const canvas = document.createElement('canvas');
    canvas.id = 'brushCanvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);
      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      const points = [];
      const MAX_POINTS = 22;

      window.addEventListener('mousemove', (e) => {
        points.push({ x: e.clientX, y: e.clientY, age: 0, size: Math.random() * 4 + 4 });
      });

      function renderTrail() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          p.age += 1;
          const progress = p.age / 24;
          if (progress >= 1) continue;

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, p.size * (1 - progress)), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(28, 26, 23, ${(0.35 * (1 - progress)).toFixed(3)})`;
          ctx.fill();

          // Connect consecutive dots with ink strokes
          if (i > 0) {
            const prev = points[i - 1];
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(28, 26, 23, ${(0.22 * (1 - progress)).toFixed(3)})`;
            ctx.lineWidth = Math.max(0.8, p.size * (1 - progress));
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }
        // Remove dead points
        while (points.length && points[0].age >= 24) points.shift();
        requestAnimationFrame(renderTrail);
      }
      renderTrail();
    }
  }

  // 6) Interactive Hanko Stamp on Click (3g)
  const stampBox = document.querySelector('.dv-card--stamp-box .stamp-stage');
  if (stampBox) {
    const chars = ['예의', '염치', '인내', '극기', '백절불굴'];
    stampBox.addEventListener('pointerdown', (e) => {
      const rect = stampBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const stamp = document.createElement('div');
      const randomChar = chars[Math.floor(Math.random() * chars.length)];
      const rot = (Math.random() * 16 - 8).toFixed(1);

      stamp.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%) rotate(${rot}deg) scale(0.6);
        width: 48px;
        height: 48px;
        border: 2px solid #b91c1c;
        color: #b91c1c;
        display: grid;
        place-items: center;
        font: 800 13px/1 'Hanken Grotesk', sans-serif;
        user-select: none;
        pointer-events: none;
        opacity: 0.95;
        transition: transform 0.15s cubic-bezier(0.16,1,0.3,1);
        z-index: 10;
        box-shadow: inset 0 0 6px rgba(185, 28, 28, 0.2);
      `;
      stamp.innerHTML = randomChar;
      stampBox.appendChild(stamp);
      requestAnimationFrame(() => {
        stamp.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
      });

      // Keep maximum 8 stamps
      const existing = stampBox.querySelectorAll('div[style*="border: 2px solid"]');
      if (existing.length > 8) existing[0].remove();
    });
  }

  // 7) Interactive Scroll Reactor (3i)
  const scrollBox = document.querySelector('.dv-card--scroll-box');
  if (scrollBox) {
    const fill = scrollBox.querySelector('.scroll-gauge-fill');
    const val = scrollBox.querySelector('.scroll-gauge-val');
    let gaugePercent = 0;

    scrollBox.addEventListener('wheel', (e) => {
      e.preventDefault();
      gaugePercent = Math.min(100, Math.max(0, gaugePercent + (e.deltaY > 0 ? 8 : -8)));
      if (fill) fill.style.height = `${gaugePercent}%`;
      if (val) val.textContent = `${gaugePercent}%`;
    }, { passive: false });
  }

  // 8) Magnetic Ink Particles (3j)
  const magCanvas = document.querySelector('.magnetic-canvas');
  if (magCanvas instanceof HTMLCanvasElement) {
    const mCtx = magCanvas.getContext('2d');
    if (mCtx) {
      const pCount = 36;
      const particles = Array.from({ length: pCount }, () => ({
        x: Math.random() * magCanvas.width,
        y: Math.random() * magCanvas.height,
        originX: Math.random() * magCanvas.width,
        originY: Math.random() * magCanvas.height,
        vx: 0,
        vy: 0,
        r: Math.random() * 3 + 2,
      }));

      let mouse = { x: -1000, y: -1000, active: false };
      magCanvas.addEventListener('mousemove', (e) => {
        const rect = magCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });
      magCanvas.addEventListener('mouseleave', () => {
        mouse.active = false;
      });

      function renderMagnetic() {
        mCtx.clearRect(0, 0, magCanvas.width, magCanvas.height);
        for (const p of particles) {
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 110 && dist > 1) {
              const force = (110 - dist) / 110;
              p.vx += (dx / dist) * force * 0.8;
              p.vy += (dy / dist) * force * 0.8;
            }
          }
          // Return toward origin with spring
          p.vx += (p.originX - p.x) * 0.04;
          p.vy += (p.originY - p.y) * 0.04;
          p.vx *= 0.84;
          p.vy *= 0.84;
          p.x += p.vx;
          p.y += p.vy;

          mCtx.beginPath();
          mCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          mCtx.fillStyle = 'rgba(28, 26, 23, 0.75)';
          mCtx.fill();
        }
        requestAnimationFrame(renderMagnetic);
      }
      renderMagnetic();
    }
  }
})();
