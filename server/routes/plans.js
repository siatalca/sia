const express = require('express');
const router = express.Router();
const db = require('../db');
const { clean, cleanEmail, cleanPhone } = require('../utils/sanitize');

const allowedPlans = new Set(['Plan Hogar', 'Plan Pyme', 'Plan Local Comercial']);

router.post('/', async (req, res) => {
  const planName = clean(req.body.plan_name, 80);
  const businessType = clean(req.body.business_type, 120);
  const phone = cleanPhone(req.body.phone);
  const email = cleanEmail(req.body.email);
  const message = clean(req.body.message, 1000);

  if (!allowedPlans.has(planName) || !businessType || !phone) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  try {
    await db.execute(
      'INSERT INTO plan_requests (plan_name, business_type, phone, email, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [planName, businessType, phone, email || null, message || null]
    );
    return res.json({ ok: true });
  } catch (error) {
    console.error('plan_requests', error);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
