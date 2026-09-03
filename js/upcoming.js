/* ══════════════════════════════════════════════════════════════
   UPCOMING CONFERENCES — INTERACTIVE JS
   Particles · Countdown · Tilt · Reveal · Magnetic Buttons
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Staggered Word Reveal for Hero Title ───
  function initHeroTitle() {
    var el = document.getElementById('heroTitle');
    if (!el) return;
    var words = [
      { text: 'Explore', highlight: false, linebreak: true },
      { text: 'Upcoming', highlight: true, linebreak: false },
      { text: 'Conferences', highlight: false, linebreak: false }
    ];
    el.innerHTML = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'uc-word' + (w.highlight ? ' uc-highlight' : '');
      span.textContent = w.text + ' ';
      span.style.animationDelay = (0.3 + i * 0.18) + 's';
      el.appendChild(span);
      if (w.linebreak) {
        var br = document.createElement('br');
        el.appendChild(br);
      }
    });
  }

  // ─── Hero Particle Canvas (constellation style) ───
  function initHeroParticles() {
    var canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var w, h, dpr;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var count = Math.min(Math.floor(w * h / 10000), 80);
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.3,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        o: Math.random() * 0.4 + 0.08
      });
    }

    canvas.parentElement.addEventListener('mousemove', function (e) {
      var rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var len = particles.length;
      for (var i = 0; i < len; i++) {
        var p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,80,10,' + p.o + ')';
        ctx.fill();

        // Lines between nearby particles
        for (var j = i + 1; j < len; j++) {
          var q = particles[j];
          var dx = p.x - q.x;
          var dy = p.y - q.y;
          var dist = dx * dx + dy * dy;
          if (dist < 12000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(184,137,42,' + (0.08 * (1 - dist / 12000)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse interaction — attract nearby particles
        var mdx = p.x - mouse.x;
        var mdy = p.y - mouse.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(212,80,10,' + (0.15 * (1 - mdist / 150)) + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ─── CTA Section Mini Particles ───
  function initCtaParticles() {
    var canvas = document.getElementById('ctaParticles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var w, h;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    var count = Math.min(Math.floor(w * h / 18000), 35);
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.5,
        dy: -(Math.random() * 0.5 + 0.1),
        o: Math.random() * 0.25 + 0.05
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.y += p.dy;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + p.o + ')';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ─── Countdown Timer ───
  function initCountdown() {
    // Target: November 21, 2026 — 3rd National Lawyers' Parliament Festival
    var target = new Date('2026-11-21T00:00:00+05:30').getTime();

    var daysEl = document.querySelector('[data-countdown="days"]');
    var hoursEl = document.querySelector('[data-countdown="hours"]');
    var minsEl = document.querySelector('[data-countdown="mins"]');
    var secsEl = document.querySelector('[data-countdown="secs"]');
    if (!daysEl) return;

    function pad(n) { return n < 10 ? '0' + n : n; }

    function tick() {
      var now = Date.now();
      var diff = target - now;
      if (diff < 0) diff = 0;

      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);

      daysEl.textContent = pad(d);
      hoursEl.textContent = pad(h);
      minsEl.textContent = pad(m);
      secsEl.textContent = pad(s);
    }

    tick();
    setInterval(tick, 1000);
  }

  // ─── 3D Tilt Cards ───
  function initTiltCards() {
    document.querySelectorAll('.uc-tilt-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-8px)';

        // Update glow position
        var glow = card.querySelector('.upcoming-card-glow');
        if (glow) {
          glow.style.setProperty('--mouse-x', ((x + 0.5) * 100) + '%');
          glow.style.setProperty('--mouse-y', ((y + 0.5) * 100) + '%');
        }
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  // ─── Staggered Scroll Reveal (for uc-stagger) ───
  function initStaggerReveal() {
    var els = document.querySelectorAll('.uc-stagger');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  // ─── Magnetic Buttons ───
  function initMagneticButtons() {
    document.querySelectorAll('.uc-magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * 0.2;
        var dy = (e.clientY - cy) * 0.2;
        btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ─── Animated Number Counters (specific to upcoming page stats) ───
  function initUpcomingCounters() {
    var statEls = document.querySelectorAll('.highlight-stat-num[data-count]');
    if (!statEls.length) return;
    var animated = false;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statEls.forEach(function (el) {
            var raw = el.getAttribute('data-count');
            var numStr = raw.replace(/[^0-9]/g, '');
            var num = parseInt(numStr, 10);
            var suffix = raw.replace(/[0-9]/g, '');
            var duration = 2000;
            var start = performance.now();

            // For "1 Lakh+" display
            var isLakh = num >= 100000;

            function tick(now) {
              var t = Math.min((now - start) / duration, 1);
              var eased = 1 - Math.pow(1 - t, 3);
              var current = Math.round(num * eased);

              if (isLakh) {
                var lakh = (current / 100000).toFixed(current >= 100000 ? 0 : 1);
                el.textContent = lakh + ' Lakh+';
              } else {
                el.textContent = current.toLocaleString() + suffix;
              }

              if (t < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statEls[0]);
  }

  // ─── Parallax on hero mosaic images + chakra ───
  function initHeroParallax() {
    var hero = document.querySelector('.uc-hero');
    if (!hero) return;
    var mosaic = hero.querySelectorAll('.uc-hero-mosaic-img img');
    var chakra = hero.querySelector('.uc-hero-chakra');

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;

      mosaic.forEach(function (img, i) {
        var factor = (i + 1) * 3;
        img.style.transform = 'scale(1.08) translate(' + (x * factor) + 'px, ' + (y * factor) + 'px)';
      });
      if (chakra) {
        chakra.style.transform = 'translate(calc(-50% + ' + (x * 12) + 'px), calc(-50% + ' + (y * 12) + 'px))';
      }
    });
  }

  // ─── Init All ───
  document.addEventListener('DOMContentLoaded', function () {
    initHeroTitle();
    initHeroParticles();
    initCtaParticles();
    initCountdown();
    initTiltCards();
    initStaggerReveal();
    initMagneticButtons();
    initUpcomingCounters();
    initHeroParallax();
  });
})();
