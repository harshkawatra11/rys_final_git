/* ══════════════════════════════════════════════════════════════
   ABOUT PAGE — SCRIPTS
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Media Year Tabs ───
  const tabs = document.querySelectorAll('.media-tab-btn');
  const contents = document.querySelectorAll('.media-tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const year = tab.dataset.year;
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('media-' + year);
      if (target) target.classList.add('active');
    });
  });

  // ─── Parallax on hero chakra ───
  const chakra = document.querySelector('.page-chakra');
  if (chakra) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      chakra.style.transform = `translate(-50%,-50%) rotate(${scroll * 0.05}deg)`;
    }, { passive: true });
  }

  // ─── Timeline stagger animation ───
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    const tObserver = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = `${i * 0.1}s`;
          e.target.classList.add('visible');
          tObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    timelineItems.forEach(el => {
      el.classList.add('reveal');
      tObserver.observe(el);
    });
  }

  // ─── Init particles if canvas exists ───
  if (typeof initParticles === 'function') {
    initParticles('heroParticles');
  }
});
