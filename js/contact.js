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

  // ─── Form Submit via EmailJS ───────────────────────────────────────────────
  // EmailJS credentials — replace these three values:
  //   SERVICE_ID  : your Email Service ID  (emailjs.com → Email Services)
  //   TEMPLATE_ID : your Template ID       (emailjs.com → Email Templates)
  // Public Key is already set in contact/index.html <head>
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

  const form = document.getElementById('contactForm');
  const formFields = document.getElementById('formFields');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const btn      = form.querySelector('.form-submit');
      const btnText  = btn.querySelector('.form-submit-text');
      const name     = document.getElementById('contactName').value.trim();
      const email    = document.getElementById('contactEmail').value.trim();
      const phone    = document.getElementById('contactPhone').value.trim() || 'Not provided';
      const subject  = document.getElementById('contactSubject');
      const subjectLabel = subject.options[subject.selectedIndex].text;
      const message  = document.getElementById('contactMessage').value.trim();

      // Button loading state
      btnText.textContent = 'Sending...';
      btn.style.opacity   = '.7';
      btn.disabled        = true;

      const templateParams = {
        from_name   : name,
        from_email  : email,
        phone       : phone,
        subject     : subjectLabel,
        message     : message,
        reply_to    : email
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          if (formFields) formFields.style.display = 'none';
          if (formSuccess) formSuccess.classList.add('show');
        })
        .catch(err => {
          console.error('EmailJS error:', err);
          btnText.textContent = 'Failed — Try Again';
          btn.style.opacity   = '1';
          btn.disabled        = false;
        });
    });
  }

  // ─── Init particles ───
  if (typeof initParticles === 'function') {
    initParticles('heroParticles');
  }
});
