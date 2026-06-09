const fs = require('fs');
let c = fs.readFileSync('prisma/seed.js', 'utf-8');
c = c.replace(/price: (\d+\.\d+)/g, (m, p1) => `price: ${Math.round(parseFloat(p1) * 4000)}`);
fs.writeFileSync('prisma/seed.js', c);
console.log('Seed file updated successfully.');
