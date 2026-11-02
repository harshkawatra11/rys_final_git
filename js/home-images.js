/* Early section loading and decode-aware carousel transitions. */
(function () {
  'use strict';
  var data = window.RYS_HOME_IMAGES;
  if (!data) return;
  var pendingLoads = new WeakMap();

  function readyImage(img, priority) {
    if (!img) return Promise.resolve(false);
    if (priority === 'auto' || priority === 'high') img.fetchPriority = priority;
    if (pendingLoads.has(img)) return pendingLoads.get(img);
    var promise = new Promise(function (resolve) {
      function finish() {
        if (!img.naturalWidth) { resolve(false); return; }
        var decoded = img.decode ? img.decode().catch(function () {}) : Promise.resolve();
        decoded.then(function () { resolve(true); });
      }
      if (img.complete && img.naturalWidth) { finish(); return; }
      img.addEventListener('load', finish, { once: true });
      img.addEventListener('error', function () { resolve(false); }, { once: true });
      img.fetchPriority = priority || 'auto';
      img.loading = 'eager';
    });
    pendingLoads.set(img, promise);
    return promise;
  }

  function loadPanel(panel) {
    if (!panel) return;
    panel.querySelectorAll('img.dig-photo').forEach(function (img) { readyImage(img); });
  }

  var dignitaries = document.getElementById('dignitaries');
  if (dignitaries) {
    dignitaries.querySelectorAll('.dig-card').forEach(function (card) {
      var name = card.querySelector('.dig-name');
      var role = card.querySelector('.dig-role');
      if (!name || !role) return;
      var photo = data.portraits[name.textContent.trim()];
      if (!photo) return;
      var text = document.createElement('div');
      text.className = 'dig-text';
      text.append(name, role);
      var wrap = document.createElement('div');
      wrap.className = 'dig-photo-wrap';
      wrap.style.backgroundImage = 'url("' + photo.preview + '")';
      wrap.style.backgroundSize = 'cover';
      wrap.style.backgroundPosition = 'top center';
      var img = document.createElement('img');
      img.className = 'dig-photo';
      img.alt = name.textContent.trim();
      img.width = photo.width;
      img.height = photo.height;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.sizes = '(max-width: 768px) calc(100vw - 64px), (max-width: 960px) calc(18vw - 32px), calc(12vw - 32px)';
      img.srcset = photo.srcset;
      img.src = photo.src;
      wrap.append(img);
      card.replaceChildren(text, wrap);
    });

    function hoveredPanel(event) {
      var tab = event.target.closest('.dig-tab');
      if (!tab || !dignitaries.contains(tab)) return;
      var tabs = Array.from(dignitaries.querySelectorAll('.dig-tab'));
      loadPanel(dignitaries.querySelectorAll('.dig-panel')[tabs.indexOf(tab)]);
    }
    dignitaries.addEventListener('pointerover', hoveredPanel);
    dignitaries.addEventListener('focusin', hoveredPanel);
    dignitaries.addEventListener('click', function () {
      loadPanel(dignitaries.querySelector('.dig-panel.active'));
    });
    if ('IntersectionObserver' in window) {
      var portraitObserver = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
          loadPanel(dignitaries.querySelector('.dig-panel.active'));
          portraitObserver.disconnect();
        }
      }, { rootMargin: '1600px 0px' });
      portraitObserver.observe(dignitaries);
    } else {
      loadPanel(dignitaries.querySelector('.dig-panel.active'));
    }
  }

  var track = document.getElementById('carouselTrack');
  if (!track) return;
  var frame = track.closest('.carousel-wrap');
  var slides = Array.from(track.querySelectorAll('.carousel-slide'));
  var dots = Array.from(document.querySelectorAll('#carouselDots .carousel-dot'));
  if (!slides.length) return;
  var index = 0, intended = 0, request = 0, visible = false, hovered = false, timer;

  slides.forEach(function (slide, i) {
    slide.tabIndex = i === 0 ? 0 : -1;
    slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    var photo = data.carousel[i];
    if (photo) slide.style.backgroundImage = 'url("' + photo.preview + '")';
    var img = slide.querySelector('img');
    if (img) img.sizes = '(max-width: 768px) calc(100vw - 32px), (max-width: 1264px) 95vw, 1200px';
  });

  function normalized(n) { return (n + slides.length) % slides.length; }
  function warm(n, priority) { return readyImage(slides[normalized(n)].querySelector('img'), priority); }
  function nearby(n) { warm(n, 'auto'); warm(n + 1, 'low'); warm(n - 1, 'low'); }
  function schedule() {
    clearTimeout(timer);
    if (visible && !hovered && !document.hidden) {
      timer = setTimeout(function () { go(index + 1); }, 6000);
    }
  }
  async function go(n) {
    clearTimeout(timer);
    intended = normalized(n);
    var target = intended, ticket = ++request;
    nearby(target);
    var loaded = await warm(target, 'auto');
    if (ticket !== request) return;
    if (loaded) {
      index = target;
      track.style.transform = 'translateX(-' + index * 100 + '%)';
      slides.forEach(function (slide, i) {
        slide.tabIndex = i === index ? 0 : -1;
        slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }
    schedule();
  }
  document.getElementById('prevBtn').addEventListener('click', function () { go(intended - 1); });
  document.getElementById('nextBtn').addEventListener('click', function () { go(intended + 1); });
  dots.forEach(function (dot, i) {
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', 'Show conference ' + (i + 1));
    dot.addEventListener('click', function () { go(i); });
    dot.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(i); }
    });
  });
  var touchX = 0;
  track.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(intended + (diff > 0 ? 1 : -1));
  }, { passive: true });
  frame.addEventListener('mouseenter', function () { hovered = true; clearTimeout(timer); });
  frame.addEventListener('mouseleave', function () { hovered = false; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) {
    var preloadObserver = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { nearby(index); preloadObserver.disconnect(); }
    }, { rootMargin: '1400px 0px' });
    preloadObserver.observe(frame);
    var visibleObserver = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) { nearby(index); warm(index).then(schedule); } else clearTimeout(timer);
    }, { threshold: 0.05 });
    visibleObserver.observe(frame);
  } else {
    visible = true;
    nearby(index);
    warm(index).then(schedule);
  }
})();

/* ── Dignitary photo: 3D tilt + sparkles + ripple ── */
(function(){
  document.querySelectorAll('#dignitaries .dig-card').forEach(card => {
    const wrap = card.querySelector('.dig-photo-wrap');
    if (!wrap) return;

    let tiltRAF = null;
    let isHovered = false;

    /* 3D magnetic tilt on mouse move */
    card.addEventListener('mousemove', e => {
      if (!isHovered) return;
      if (tiltRAF) cancelAnimationFrame(tiltRAF);
      tiltRAF = requestAnimationFrame(() => {
        const rect = wrap.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width  - .5;
        const cy = (e.clientY - rect.top)  / rect.height - .5;
        const rx =  cy * -15;
        const ry =  cx *  18;
        wrap.style.transform = `scale(1.11) translateY(-7px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    });

    /* Reset tilt on leave */
    card.addEventListener('mouseleave', () => {
      isHovered = false;
      if (tiltRAF) cancelAnimationFrame(tiltRAF);
      wrap.style.transform = '';
    });

    /* Mark hover state on enter */
    card.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    /* Click ripple */
    wrap.addEventListener('click', e => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const r = document.createElement('span');
      r.className = 'dig-ripple';
      r.style.cssText = `width:60px;height:60px;left:${x - 30}px;top:${y - 30}px;`;
      wrap.appendChild(r);
      r.addEventListener('animationend', () => r.remove(), {once:true});
    });
  });
})();

