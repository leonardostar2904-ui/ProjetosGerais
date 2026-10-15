// Renderiza index.html em PDF A4 com o Chromium do Playwright.
// Uso: NODE_PATH=/opt/node-tools/node_modules node build.js
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const dir = __dirname;
  const out = path.join(dir, 'ICARUS-x-Unique-Energy-Fluxo-de-Operacao.pdf');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.goto('file://' + path.join(dir, 'index.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight} ${f.style} ${f.stretch}`));
  console.log('fontes carregadas:', fonts.length);
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
  console.log('ok', out);
})();
