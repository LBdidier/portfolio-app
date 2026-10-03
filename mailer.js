const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, NOTIFY_TO } = process.env;
const enabled = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
const transporter = enabled
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;
const from = MAIL_FROM || `Didier Luboya <${SMTP_USER}>`;
if (!enabled) console.warn('Email is not configured (set SMTP_* in .env). Messages are saved but no emails are sent.');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const oneLine = (s) => String(s).replace(/[\r\n]+/g, ' ').trim();

// Confirmation email sent to the visitor. Returns true if sent.
async function sendAutoReply({ name, email, message }) {
  if (!enabled) return false;
  const first = oneLine(name).split(' ')[0];
  await transporter.sendMail({
    from,
    to: email,
    replyTo: SMTP_USER,
    subject: 'Thanks for your message, I will reach out to you soon',
    text:
`Hi ${first},

Thank you for contacting me. I have received your message and I will reach out to you soon.

Your message:
"${message}"

Best regards,
Didier Luboya
Cloud Engineer · Kraków, Poland
${SMTP_USER}`,
    html:
`<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1b2733;line-height:1.6">
  <h2 style="margin:0 0 12px;color:#0a9462">Thanks for reaching out, ${esc(first)}!</h2>
  <p>I have received your message and <b>I will reach out to you soon</b>.</p>
  <blockquote style="margin:16px 0;padding:10px 16px;border-left:4px solid #1d6fd1;background:#f4f8fc;white-space:pre-wrap">${esc(message)}</blockquote>
  <p style="margin:0">Best regards,<br><b>Didier Luboya</b><br>Cloud Engineer · Kraków, Poland<br>${esc(SMTP_USER)}</p>
</div>`,
  });
  return true;
}

// Notification email sent to you.
async function notifyOwner({ name, email, phone, message }) {
  if (!enabled) return false;
  await transporter.sendMail({
    from,
    to: NOTIFY_TO || SMTP_USER,
    replyTo: email,
    subject: `New portfolio message from ${oneLine(name)}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\n\n${message}`,
    html: `<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Phone:</b> ${esc(phone || '-')}</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
  });
  return true;
}

module.exports = { sendAutoReply, notifyOwner };
