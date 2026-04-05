/* ══════════════════════════════════════════════════════════════
   CONTACT PAGE — SCRIPTS
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // ─── FAQ Accordion ───
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ─── Form Submit (demo) ───
  const form = document.getElementById('contactForm');
  const formFields = document.getElementById('formFields');
  const formSuccess = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // Animate button
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.style.opacity = '.7';
      btn.disabled = true;

      setTimeout(() => {
        if (formFields) formFields.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      }, 1200);
    });
  }

  // ─── Init particles ───
  if (typeof initParticles === 'function') {
    initParticles('heroParticles');
  }
});
