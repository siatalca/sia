const store = new Map();

const rateLimit = (windowMs, max) => (req, res, next) => {
  const key = `${req.ip}:${req.originalUrl}`;
  const now = Date.now();
  const hits = (store.get(key) || []).filter((timestamp) => now - timestamp < windowMs);

  if (hits.length >= max) {
    return res.status(429).json({ ok: false, error: 'Too many requests' });
  }

  hits.push(now);
  store.set(key, hits);
  return next();
};

const honeypot = (field = 'website') => (req, res, next) => {
  if (req.body && typeof req.body[field] === 'string' && req.body[field].trim() !== '') {
    return res.status(200).json({ ok: true });
  }
  return next();
};

module.exports = { rateLimit, honeypot };
