const express = require('express');
const router = express.Router();
const db = require('../db');
const { clean, cleanEmail, cleanPhone } = require('../utils/sanitize');

const allowedTypes = new Set(['hogar', 'pyme', 'local']);

router.post('/', async (req, res) => {
  const propertyType = clean(req.body.property_type, 20).toLowerCase();
  const location = clean(req.body.location, 120);
  const qty = clean(req.body.qty, 40);
  const phone = cleanPhone(req.body.phone);
  const email = cleanEmail(req.body.email);
  const message = clean(req.body.message, 1000);

  if (!allowedTypes.has(propertyType) || !location || !phone) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  try {
    await db.execute(
      'INSERT INTO security_requests (property_type, location, qty, phone, email, message, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [propertyType, location, qty || null, phone, email || null, message || null]
    );
    return res.json({ ok: true });
  } catch (error) {
    console.error('security_requests', error);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
