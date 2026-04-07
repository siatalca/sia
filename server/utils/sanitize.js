const clean = (value, max = 500) => {
  if (value === undefined || value === null) return '';
  let text = String(value).trim();
  text = text.replace(/[<>]/g, '');
  text = text.replace(/\s+/g, ' ');
  if (text.length > max) text = text.slice(0, max);
  return text;
};

const cleanEmail = (value) => {
  const text = clean(value, 160);
  return text ? text.toLowerCase() : '';
};

const cleanPhone = (value) => {
  const text = clean(value, 40);
  return text.replace(/[^\d+()\s-]/g, '');
};

module.exports = { clean, cleanEmail, cleanPhone };
