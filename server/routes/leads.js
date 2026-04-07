const express = require('express');
const router = express.Router();
const db = require('../db');
const { clean, cleanEmail, cleanPhone } = require('../utils/sanitize');

router.post('/', async (req, res) => {
  const name = clean(req.body.name, 120);
  const phone = cleanPhone(req.body.phone);
  const email = cleanEmail(req.body.email);
  const service = clean(req.body.service, 120);
  const message = clean(req.body.message, 1000);
  const source = clean(req.body.source, 60);

  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  try {
    await db.execute(
      'INSERT INTO leads (name, phone, email, service, message, source, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, phone, email || null, service || null, message || null, source || null]
    );
    return res.json({ ok: true });
  } catch (error) {
    console.error('leads', error);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
