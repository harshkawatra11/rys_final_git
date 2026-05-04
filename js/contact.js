/* ══════════════════════════════════════════════════════════════
   CONTACT PAGE — SCRIPTS
   ══════════════════════════════════════════════════════════════ */

/* ─── WhatsApp Notification via CallMeBot ────────────────────────────────────
   ONE-TIME SETUP (do this once from the RYS WhatsApp number):
   1. Open WhatsApp and send this message to +34 644 59 78 64:
         I allow callmebot to send me messages
   2. Within seconds, CallMeBot replies with your personal API key.
   3. Replace CALLMEBOT_PHONE and CALLMEBOT_APIKEY below with your values.
   ─────────────────────────────────────────────────────────────────────────── */
const CALLMEBOT_PHONE  = 'YOUR_PHONE_WITH_COUNTRY_CODE'; // e.g. 919876543210 (no +)
const CALLMEBOT_APIKEY = 'YOUR_CALLMEBOT_APIKEY';

function sendWhatsAppNotification(name, email, phone, subject, message) {
  const text = [
    '📋 *New Contact Form Submission*',
    '━━━━━━━━━━━━━━━━━━━━',
    `👤 *Name:* ${name}`,
    `📧 *Email:* ${email}`,
    `📞 *Phone:* ${phone}`,
    `📌 *Subject:* ${subject}`,
    '━━━━━━━━━━━━━━━━━━━━',
    `💬 *Message:*\n${message}`,
    '━━━━━━━━━━━━━━━━━━━━',
    '_Sent via rajdhaniyuvasansad.com_'
  ].join('\n');

  const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encodeURIComponent(text)}&apikey=${CALLMEBOT_APIKEY}`;

  // no-cors: we don't need a response — the request fires and WA delivers the message
  fetch(url, { mode: 'no-cors' }).catch(() => {/* silent — email already sent */});
}

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
  const EMAILJS_SERVICE_ID  = 'service_fdeufne';
  const EMAILJS_TEMPLATE_ID = 'template_wvqnpm9';

  const form = document.getElementById('contactForm');
  const formFields = document.getElementById('formFields');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const btn      = form.querySelector('.form-submit');
      const btnText  = btn.querySelector('.form-submit-text');
      const btnArrow = btn.querySelector('.form-submit-arrow');
      const name     = document.getElementById('contactName').value.trim();
      const email    = document.getElementById('contactEmail').value.trim();
      const phone    = document.getElementById('contactPhone').value.trim() || 'Not provided';
      const subject  = document.getElementById('contactSubject');
      const subjectLabel = subject.options[subject.selectedIndex].text;
      const message  = document.getElementById('contactMessage').value.trim();

      // Button loading state
      btnText.textContent = 'Sending...';
      btnArrow.innerHTML = '<span class="loading-spinner"></span>';
      btn.style.opacity   = '.8';
      btn.disabled        = true;

      const templateParams = {
        name        : name,
        email       : email,
        phone       : phone,
        subject     : subjectLabel,
        message     : message,
        reply_to    : email
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          // Send WhatsApp notification after email succeeds
          sendWhatsAppNotification(name, email, phone, subjectLabel, message);
          
          // Show tick on button
          btnText.textContent = 'Sent!';
          btnArrow.innerHTML = '&#10004;';
          btn.style.opacity = '1';
          
          // Wait briefly, then show success container
          setTimeout(() => {
            if (formFields) formFields.style.display = 'none';
            if (formSuccess) formSuccess.classList.add('show');
          }, 1500);
        })
        .catch(err => {
          console.error('EmailJS error:', err);
          btnText.textContent = 'Failed — Try Again';
          btnArrow.innerHTML = '&rarr;';
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
