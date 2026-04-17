/* ══════════════════════════════════════════════════════════════
   CONFERENCE DETAIL — INTERACTIVE JS
   Hero orbital collage · Scroll reveal · Word reveal · Gallery lightbox
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Cinematic 3-Panel Hero ───
  var hero = document.querySelector('.conf-detail-hero');
  if (hero) {
    // Collect gallery images
    var galleryImgs = [];
    document.querySelectorAll('.cd-gallery-item img').forEach(function(img) {
      galleryImgs.push(img.src);
    });

    // Get cover image
    var heroBgEl = hero.querySelector('.conf-detail-hero-bg');
    var coverImgEl = heroBgEl ? heroBgEl.querySelector('img') : null;
    var coverSrc = coverImgEl ? coverImgEl.src : '';

    if (coverSrc || galleryImgs.length) {
      // Build side image pool — deduplicated gallery images
      var pool = galleryImgs.slice();
      while (pool.length < 4 && pool.length > 0) pool = pool.concat(galleryImgs);

      function makeCell(src) {
        var cell = document.createElement('div');
        cell.className = 'cd-cine-cell';
        var img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'eager';
        cell.appendChild(img);
        return cell;
      }

      var wrap = document.createElement('div');
      wrap.className = 'cd-cine-wrap';

      // Left column — images 0 and 1
      var leftCol = document.createElement('div');
      leftCol.className = 'cd-cine-col cd-cine-left';
      leftCol.appendChild(makeCell(pool[0] || coverSrc));
      leftCol.appendChild(makeCell(pool[1] || pool[0] || coverSrc));

      // Center — cover image
      var center = document.createElement('div');
      center.className = 'cd-cine-center';
      if (coverSrc) {
        var ci = document.createElement('img');
        ci.src = coverSrc;
        ci.alt = 'Conference Cover';
        ci.loading = 'eager';
        center.appendChild(ci);
      }

      // Right column — images 2 and 3
      var rightCol = document.createElement('div');
      rightCol.className = 'cd-cine-col cd-cine-right';
      rightCol.appendChild(makeCell(pool[2] || pool[0] || coverSrc));
      rightCol.appendChild(makeCell(pool[3] || pool[1] || pool[0] || coverSrc));

      wrap.appendChild(leftCol);
      wrap.appendChild(center);
      wrap.appendChild(rightCol);

      var overlay = hero.querySelector('.conf-detail-hero-overlay');
      hero.insertBefore(wrap, overlay || hero.firstChild);

      // Cinematic parallax — very gentle vertical drift
      window.addEventListener('scroll', function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          wrap.style.transform = 'translateY(' + (y * 0.08) + 'px)';
        }
      }, { passive: true });

      // Floating golden particles
      var particlesDiv = document.createElement('div');
      particlesDiv.className = 'cd-hero-particles';
      for (var p = 0; p < 22; p++) {
        var particle = document.createElement('div');
        particle.className = 'cd-hero-particle';
        particle.style.left = (Math.random() * 100) + '%';
        particle.style.top = (Math.random() * 100) + '%';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.animationDuration = (6 + Math.random() * 8) + 's';
        particlesDiv.appendChild(particle);
      }
      if (overlay && overlay.nextSibling) {
        hero.insertBefore(particlesDiv, overlay.nextSibling);
      } else {
        hero.appendChild(particlesDiv);
      }
    }

    // Add scroll cue if not already present
    if (!hero.querySelector('.cd-hero-scroll')) {
      var cue = document.createElement('div');
      cue.className = 'cd-hero-scroll';
      cue.innerHTML = '<span>Scroll</span><div class="cd-hero-scroll-line"></div>';
      hero.appendChild(cue);
    }

    requestAnimationFrame(function () {
      hero.classList.add('cd-loaded');
    });
  }

  // ─── Title Word Reveal ───
  var heroH1 = document.querySelector('.conf-detail-hero-content h1');
  if (heroH1) {
    // Get text nodes (not .hindi-sub)
    var hindiSub = heroH1.querySelector('.hindi-sub');
    var textContent = '';
    heroH1.childNodes.forEach(function (node) {
      if (node.nodeType === 3) textContent += node.textContent;
    });
    var words = textContent.trim().split(/\s+/);
    if (words.length > 1 && words[0] !== '') {
      // Remove text nodes
      heroH1.childNodes.forEach(function (node) {
        if (node.nodeType === 3) node.textContent = '';
      });
      // Insert word spans before hindi-sub
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'cd-word';
        span.textContent = word + ' ';
        span.style.animationDelay = (0.5 + i * 0.12) + 's';
        if (hindiSub) {
          heroH1.insertBefore(span, hindiSub);
        } else {
          heroH1.appendChild(span);
        }
      });
    }

    // ─── Inject gold ornament separator after h1 ───
    var heroContent = document.querySelector('.conf-detail-hero-content');
    var metaRow = heroContent ? heroContent.querySelector('.conf-detail-meta-row') : null;
    if (heroContent && metaRow && !heroContent.querySelector('.cd-hero-ornament')) {
      var ornament = document.createElement('div');
      ornament.className = 'cd-hero-ornament';
      ornament.innerHTML =
        '<div class="cd-hero-orn-line"></div>' +
        '<div class="cd-hero-orn-diamond"></div>' +
        '<div class="cd-hero-orn-line cd-hero-orn-line-r"></div>';
      heroContent.insertBefore(ornament, metaRow);
    }
  }

  // ─── Scroll-Reveal for Sections ───
  document.addEventListener('DOMContentLoaded', function () {
    // Auto-add cd-reveal to all conf-sec elements
    document.querySelectorAll('.conf-sec').forEach(function (sec) {
      if (!sec.classList.contains('cd-reveal')) {
        sec.classList.add('cd-reveal');
      }
    });

    var revealSections = document.querySelectorAll('.cd-reveal');
    if (revealSections.length) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            sectionObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

      revealSections.forEach(function (el) {
        sectionObserver.observe(el);
      });
    }

    // ─── Gallery Lightbox ───
    var lightbox = document.getElementById('cdLightbox');
    if (lightbox) {
      var lbImg = lightbox.querySelector('img');
      var lbCounter = lightbox.querySelector('.cd-lb-counter');
      var lbClose = lightbox.querySelector('.cd-lb-close');
      var lbPrev = lightbox.querySelector('.cd-lb-prev');
      var lbNext = lightbox.querySelector('.cd-lb-next');
      var galleryItems = document.querySelectorAll('.cd-gallery-item');
      var currentIndex = 0;

      function openLightbox(index) {
        currentIndex = index;
        var img = galleryItems[index].querySelector('img');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCounter.textContent = (index + 1) + ' / ' + galleryItems.length;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }

      function navigate(dir) {
        currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
        var img = galleryItems[currentIndex].querySelector('img');
        lbImg.style.opacity = '0';
        setTimeout(function () {
          lbImg.src = img.src;
          lbImg.alt = img.alt;
          lbCounter.textContent = (currentIndex + 1) + ' / ' + galleryItems.length;
          lbImg.style.opacity = '1';
        }, 150);
      }

      galleryItems.forEach(function (item, i) {
        item.addEventListener('click', function () { openLightbox(i); });
      });

      if (lbClose) lbClose.addEventListener('click', closeLightbox);
      if (lbPrev) lbPrev.addEventListener('click', function () { navigate(-1); });
      if (lbNext) lbNext.addEventListener('click', function () { navigate(1); });

      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
      });

      // Transition for image fade
      lbImg.style.transition = 'opacity .15s ease';
    }

    // ─── Animate Stats on Scroll ───
    var statsBar = document.querySelector('.conf-detail-stats');
    if (statsBar) {
      var statNums = statsBar.querySelectorAll('.conf-detail-stat-num');
      var statsAnimated = false;

      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statNums.forEach(function (el) {
              var text = el.textContent.trim();
              var match = text.match(/^([~]?)(\d[\d,]*)([+%]?)$/);
              if (match) {
                var prefix = match[1];
                var num = parseInt(match[2].replace(/,/g, ''));
                var suffix = match[3];
                var duration = 1600;
                var start = performance.now();
                (function tick(now) {
                  var t = Math.min((now - start) / duration, 1);
                  var eased = 1 - Math.pow(1 - t, 3);
                  var current = Math.round(num * eased);
                  el.textContent = prefix + current.toLocaleString() + suffix;
                  if (t < 1) requestAnimationFrame(tick);
                })(start);
              }
            });
            statsObserver.disconnect();
          }
        });
      }, { threshold: 0.5 });

      statsObserver.observe(statsBar);
    }

    // ─── MP Photo Panel Toggle ───
    document.querySelectorAll('.conf-guest-mp').forEach(function (card) {
      card.addEventListener('click', function () {
        var panel = card.closest('.conf-sec-inner, .conf-guests-grid')
          ? card.parentElement.querySelector('.conf-mp-photos')
          : null;
        if (!panel) {
          panel = document.querySelector('.conf-mp-photos');
        }
        if (panel) panel.classList.toggle('open');
      });
    });
  });
})();
