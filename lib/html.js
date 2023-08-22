
const html = (s,...v) => s.map(x => x + (v.shift() || '')).join('').replace(/\s+/g,' ');

module.exports = html;