const express = require('express');
const router = express.Router();
const db = require('../db');
const { clean, cleanEmail, cleanPhone } = require('../utils/sanitize');

const allowedTypes = new Set(['landing', 'pyme', 'vitrina']);

router.post('/', async (req, res) => {
  const websiteType = clean(req.body.website_type, 40).toLowerCase();
  const business = clean(req.body.business, 120);
  const goal = clean(req.body.goal, 200);
  const phone = cleanPhone(req.body.phone);
  const email = cleanEmail(req.body.email);
  const message = clean(req.body.message, 1000);

  if (!allowedTypes.has(websiteType) || !business || !phone) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  try {
    await db.execute(
      'INSERT INTO web_requests (website_type, business, goal, phone, email, message, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [websiteType, business, goal || null, phone, email || null, message || null]
    );
    return res.json({ ok: true });
  } catch (error) {
    console.error('web_requests', error);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
