const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { rateLimit, honeypot } = require('./middleware/antiSpam');
const leadsRoutes = require('./routes/leads');
const securityRoutes = require('./routes/security');
const webRoutes = require('./routes/webquote');
const planRoutes = require('./routes/plans');

const app = express();
const PORT = process.env.PORT || 3126;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/leads', rateLimit(10000, 5), honeypot('website'), leadsRoutes);
app.use('/api/security_requests', rateLimit(10000, 4), honeypot('website'), securityRoutes);
app.use('/api/web_requests', rateLimit(10000, 4), honeypot('website'), webRoutes);
app.use('/api/plan_requests', rateLimit(10000, 4), honeypot('website'), planRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`SIA server running on port ${PORT}`);
});

