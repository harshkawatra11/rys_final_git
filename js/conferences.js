/* ══════════════════════════════════════════════════════════════
   CONFERENCES PAGE — SCRIPTS
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // ─── Auto-scroll to conference hash ───
  const hash = window.location.hash.slice(1);
  if (hash) {
    const targetElement = document.getElementById(hash);
    if (targetElement) {
      setTimeout(() => {
        const yOffset = -120;
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Add highlight animation to draw attention
        targetElement.classList.add('highlight-entry');
        setTimeout(() => targetElement.classList.remove('highlight-entry'), 2000);
      }, 100);
    }
  }

  // ─── Year Filter Pills ───
  const pills = document.querySelectorAll('.filter-pill');
  const yearGroups = document.querySelectorAll('.year-group');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;

      yearGroups.forEach(group => {
        if (filter === 'all') {
          group.classList.remove('hidden');
          group.style.opacity = '0';
          group.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            group.style.transition = 'opacity .5s, transform .5s';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
          });
        } else if (group.dataset.year === filter) {
          group.classList.remove('hidden');
          group.style.opacity = '0';
          group.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            group.style.transition = 'opacity .5s, transform .5s';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
          });
        } else {
          group.style.transition = 'opacity .3s';
          group.style.opacity = '0';
          setTimeout(() => group.classList.add('hidden'), 300);
        }
      });
    });
  });

  // ─── Stagger card entrance ───
  const cards = document.querySelectorAll('.conf-card-featured, .conf-card-standard, .conf-card-compact');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${(i % 6) * 0.08}s`;
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => {
    card.classList.add('reveal');
    cardObserver.observe(card);
  });

  // ─── Init particles ───
  if (typeof initParticles === 'function') {
    initParticles('heroParticles');
  }
});
