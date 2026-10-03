require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const { sendAutoReply, notifyOwner } = require('./mailer');

const app = express();
const dist = path.join(__dirname, 'client', 'dist');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
});

app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ['https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(dist));

/* ---------- public contact form ---------- */
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many messages. Please try again later.' } });
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

app.post('/api/contact', contactLimiter, async (req, res) => {
  if (req.body?.website) return res.json({ ok: true }); // honeypot
  const name = clean(req.body?.name, 100);
  const email = clean(req.body?.email, 150);
  const phone = clean(req.body?.phone, 30);
  const message = clean(req.body?.message, 3000);

  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email.' });
  if (phone && !/^[0-9+()\-.\s]{5,30}$/.test(phone)) return res.status(400).json({ error: 'Please enter a valid phone number.' });

  try {
    const { rows } = await pool.query(
      'INSERT INTO contact_messages (name, email, phone, message, ip) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [name, email, phone || null, message, req.ip]
    );
    res.status(201).json({ ok: true });

    // emails are sent after responding, so a mail problem never loses a message
    const id = rows[0].id;
    sendAutoReply({ name, email, message })
      .then((sent) => sent && pool.query('UPDATE contact_messages SET reply_sent = true WHERE id = $1', [id]))
      .catch((e) => console.error('Auto-reply failed:', e.message));
    notifyOwner({ name, email, phone, message }).catch((e) => console.error('Owner notification failed:', e.message));
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

/* ---------- admin dashboard API ---------- */
const SECRET = process.env.ADMIN_SECRET || crypto.randomBytes(32).toString('hex');
const sign = (p) => crypto.createHmac('sha256', SECRET).update(p).digest('base64url');
const makeToken = () => { const p = String(Date.now() + 8 * 3600 * 1000); return `${p}.${sign(p)}`; };
const validToken = (t) => {
  const [p, s] = String(t || '').split('.');
  if (!p || !s) return false;
  const a = Buffer.from(s), b = Buffer.from(sign(p));
  return a.length === b.length && crypto.timingSafeEqual(a, b) && Number(p) > Date.now();
};
const sameText = (a, b) => crypto.timingSafeEqual(
  crypto.createHash('sha256').update(String(a)).digest(), crypto.createHash('sha256').update(String(b)).digest());
const auth = (req, res, next) =>
  validToken((req.headers.authorization || '').replace('Bearer ', '')) ? next() : res.status(401).json({ error: 'Unauthorized' });

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many attempts. Try again later.' } });

app.post('/api/admin/login', loginLimiter, (req, res) => {
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'Set ADMIN_PASSWORD in .env first.' });
  if (!sameText(req.body?.password ?? '', process.env.ADMIN_PASSWORD)) return res.status(401).json({ error: 'Wrong password.' });
  res.json({ token: makeToken() });
});

app.get('/api/admin/messages', auth, async (req, res) => {
  try {
    const status = String(req.query.status || 'all');
    const q = String(req.query.q || '').trim().slice(0, 100);
    const where = [], params = [];
    if (status === 'unread') where.push('is_read = false');
    if (status === 'handled') where.push('handled = true');
    if (q) { params.push(`%${q}%`); where.push('(name ILIKE $1 OR email ILIKE $1 OR message ILIKE $1)'); }
    const list = await pool.query(
      `SELECT id,name,email,phone,message,created_at,is_read,handled,reply_sent FROM contact_messages
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC LIMIT 500`, params);
    const st = await pool.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE NOT is_read)::int AS unread,
              COUNT(*) FILTER (WHERE handled)::int AS handled,
              COUNT(*) FILTER (WHERE created_at >= date_trunc('day', NOW()))::int AS today
       FROM contact_messages`);
    res.json({ messages: list.rows, stats: st.rows[0] });
  } catch (e) { console.error(e.message); res.status(500).json({ error: 'Server error.' }); }
});

app.patch('/api/admin/messages/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Bad id.' });
  const b = (v) => (typeof v === 'boolean' ? v : null);
  try {
    const { rows } = await pool.query(
      `UPDATE contact_messages SET is_read = COALESCE($2, is_read), handled = COALESCE($3, handled)
       WHERE id = $1 RETURNING id,name,email,phone,message,created_at,is_read,handled,reply_sent`,
      [id, b(req.body?.is_read), b(req.body?.handled)]);
    rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'Not found.' });
  } catch (e) { console.error(e.message); res.status(500).json({ error: 'Server error.' }); }
});

app.delete('/api/admin/messages/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Bad id.' });
  try { await pool.query('DELETE FROM contact_messages WHERE id = $1', [id]); res.json({ ok: true }); }
  catch (e) { console.error(e.message); res.status(500).json({ error: 'Server error.' }); }
});

app.get('/admin', (req, res) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.sendFile(path.join(dist, 'admin.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Portfolio: http://localhost:${port}   Dashboard: http://localhost:${port}/admin`));
