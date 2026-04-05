/* ══════════════════════════════════════════════════════════════
   RAJDHANI YUVA SANSAD — SHARED JS
   ══════════════════════════════════════════════════════════════ */

// ─── Theme Toggle ───
(function(){
  var THEME_KEY = 'rys-theme';
  var root = document.documentElement;
  // Default is set by data-default-theme attribute on <html> (dark or light)
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    var knob = document.querySelector('.theme-toggle-knob');
    if (knob) knob.textContent = t === 'light' ? '☀' : '🌙';
    var btn = document.querySelector('.theme-toggle-btn');
    if (btn) btn.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }
  var saved = localStorage.getItem(THEME_KEY);
  var def = root.getAttribute('data-default-theme') || 'dark';
  applyTheme(saved || def);

  document.addEventListener('DOMContentLoaded', function(){
    var btn = document.querySelector('.theme-toggle-btn');
    if (btn) {
      btn.addEventListener('click', function(){
        var curr = root.getAttribute('data-theme') || 'dark';
        applyTheme(curr === 'dark' ? 'light' : 'dark');
      });
    }
    // Also handle toggle inside mobile overlay if present
    var mobileBtn = document.querySelector('.mobile-theme-toggle');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', function(){
        var curr = root.getAttribute('data-theme') || 'dark';
        applyTheme(curr === 'dark' ? 'light' : 'dark');
      });
    }
  });
})();

// ─── Sticky Nav ───
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 60);
  }, { passive: true });
}

// ─── Mobile Nav ───
const mobileToggle = document.querySelector('.nav-mobile-toggle');
const mobileOverlay = document.querySelector('.mobile-nav-overlay');
const mobileClose = document.querySelector('.mobile-nav-close');
if (mobileToggle && mobileOverlay) {
  mobileToggle.addEventListener('click', () => mobileOverlay.classList.add('open'));
  if (mobileClose) mobileClose.addEventListener('click', () => mobileOverlay.classList.remove('open'));
  mobileOverlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileOverlay.classList.remove('open'));
  });
}

// ─── Scroll Reveal (Intersection Observer) ───
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
}

// ─── Animated Number Counters ───
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = el.getAttribute('data-count');
    const isNum = /^\d+$/.test(target.replace('+','').replace(',','').replace('~',''));
    if (!isNum) { el.textContent = target; return; }
    const num = parseInt(target.replace(/[^0-9]/g,''));
    const suffix = target.replace(/[0-9]/g,'');
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(num * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

const counterEls = document.querySelectorAll('[data-count]');
if (counterEls.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  counterObserver.observe(counterEls[0]);
}

// ─── Mini Particle Background ───
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }
  resize();
  window.addEventListener('resize', resize);

  const particleCount = Math.min(Math.floor(w * h / 12000), 60);
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.4,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.3 + 0.05
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184,137,42,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── Smooth Section Anchors ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });
});

// ─── Typing Effect Utility ───
function typeText(el, text, speed = 50) {
  el.textContent = '';
  let i = 0;
  function t() {
    if (i < text.length) { el.textContent += text[i]; i++; setTimeout(t, speed); }
  }
  t();
}

// ─── Tilt on Hover (for cards) ───
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
    });
  });
}
document.addEventListener('DOMContentLoaded', initTiltCards);
