const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, 'plano-ajuste-v3.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const fontes = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight));
  console.log('fontes carregadas:', fontes.join(', '));
  await page.pdf({ path: path.join(__dirname, 'plano-ajuste-v3.pdf'), preferCSSPageSize: true, printBackground: true });
  await browser.close();
})();
