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
          // Send WhatsApp notification after email succeeds
          sendWhatsAppNotification(name, email, phone, subjectLabel, message);
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
