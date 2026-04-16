/* ══════════════════════════════════════════════════════════════
   CONFERENCE DETAIL — INTERACTIVE JS
   Hero orbital collage · Scroll reveal · Word reveal · Gallery lightbox
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Orbital Gallery Hero ───
  var hero = document.querySelector('.conf-detail-hero');
  if (hero) {
    // Collect gallery images
    var galleryImgs = [];
    document.querySelectorAll('.cd-gallery-item img').forEach(function(img) {
      galleryImgs.push(img.src);
    });

    // Get cover image
    var heroBgEl = hero.querySelector('.conf-detail-hero-bg');
    var coverImg = heroBgEl ? heroBgEl.querySelector('img') : null;
    var coverSrc = coverImg ? coverImg.src : '';

    if (coverSrc || galleryImgs.length) {
      var orbitalEl = document.createElement('div');
      orbitalEl.className = 'cd-orbital';

      // 1) Cover image — large center piece
      if (coverSrc) {
        var coverDiv = document.createElement('div');
        coverDiv.className = 'cd-orb-cover';
        var cImg = document.createElement('img');
        cImg.src = coverSrc;
        cImg.alt = 'Conference Cover';
        cImg.loading = 'eager';
        coverDiv.appendChild(cImg);
        orbitalEl.appendChild(coverDiv);
      }

      // 2) Satellite images — positioned around the cover
      // Predefined orbital slots with varied sizes, positions, rotations, aspect ratios
      var slots = [
        { top:'3%',  left:'2%',   w:'220px', h:'150px', rot:-4,  float:'cdFloat1', dur:'7s'  },
        { top:'5%',  right:'3%',  w:'200px', h:'260px', rot:3,   float:'cdFloat2', dur:'8s'  },
        { top:'15%', left:'22%',  w:'180px', h:'120px', rot:-2,  float:'cdFloat3', dur:'9s'  },
        { top:'8%',  right:'25%', w:'160px', h:'200px', rot:5,   float:'cdFloat4', dur:'7.5s'},
        { bottom:'22%', left:'1%',w:'240px', h:'160px', rot:2,   float:'cdFloat1', dur:'8.5s'},
        { bottom:'8%', right:'1%',w:'200px', h:'140px', rot:-3,  float:'cdFloat2', dur:'9s'  },
        { top:'45%', left:'0%',   w:'160px', h:'220px', rot:4,   float:'cdFloat3', dur:'7s'  },
        { top:'40%', right:'0%',  w:'180px', h:'130px', rot:-5,  float:'cdFloat4', dur:'8s'  },
        { bottom:'35%',left:'20%',w:'140px', h:'100px', rot:1,   float:'cdFloat1', dur:'9.5s'},
        { bottom:'30%',right:'18%',w:'170px',h:'230px', rot:-2,  float:'cdFloat2', dur:'7.5s'},
        { top:'2%',  left:'45%',  w:'130px', h:'90px',  rot:3,   float:'cdFloat3', dur:'8s'  },
      ];

      // Deduplicate if needed
      var satImgs = galleryImgs.slice();
      while (satImgs.length < slots.length && satImgs.length > 0) {
        satImgs = satImgs.concat(galleryImgs);
      }
      satImgs = satImgs.slice(0, slots.length);

      satImgs.forEach(function(src, i) {
        var slot = slots[i];
        var sat = document.createElement('div');
        sat.className = 'cd-orb-sat';
        sat.style.width = slot.w;
        sat.style.height = slot.h;
        if (slot.top) sat.style.top = slot.top;
        if (slot.bottom) sat.style.bottom = slot.bottom;
        if (slot.left) sat.style.left = slot.left;
        if (slot.right) sat.style.right = slot.right;
        sat.style.transform = 'rotate(' + slot.rot + 'deg)';
        sat.style.animation = slot.float + ' ' + slot.dur + ' ease-in-out infinite, cdOrbSatIn .9s cubic-bezier(.25,.46,.45,.94) forwards';
        sat.style.animationDelay = (0.3 + i * 0.12) + 's, ' + (0.3 + i * 0.12) + 's';

        var img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'eager';
        sat.appendChild(img);
        orbitalEl.appendChild(sat);
      });

      // Insert orbital before overlay
      var overlay = hero.querySelector('.conf-detail-hero-overlay');
      hero.insertBefore(orbitalEl, overlay || hero.firstChild);

      // Floating particles
      var particlesDiv = document.createElement('div');
      particlesDiv.className = 'cd-hero-particles';
      for (var p = 0; p < 20; p++) {
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

    // Parallax on orbital layer
    var orbLayer = hero.querySelector('.cd-orbital');
    if (orbLayer) {
      window.addEventListener('scroll', function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          orbLayer.style.transform = 'translateY(' + (y * 0.12) + 'px)';
        }
      }, { passive: true });
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
