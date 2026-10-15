// Gera o PDF do guia a partir de guia.html.
// Uso: NODE_PATH=$(npm root -g) node build.cjs <saida.pdf>
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const out = path.resolve(process.argv[2] || 'guia.pdf');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, 'guia.html'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  // Confere se algum conteúdo invade a área do rodapé ou passa da página.
  const report = await page.evaluate(() => {
    const mm = 96 / 25.4;
    return [...document.querySelectorAll('.page')].map((pg, i) => {
      const top = pg.getBoundingClientRect().top;
      const limit = top + (297 - 22) * mm;
      let bottom = 0;
      pg.querySelectorAll('*').forEach(el => {
        if (el.closest('.foot') || el.closest('svg') || el.classList.contains('tagline') || el.closest('.closing')) return;
        bottom = Math.max(bottom, el.getBoundingClientRect().bottom);
      });
      const closing = pg.querySelector('.closing');
      const closingTop = closing ? closing.getBoundingClientRect().top : null;
      return {
        page: i + 1,
        sobraMm: +((limit - bottom) / mm).toFixed(1),
        colideComFechamento: closingTop !== null && bottom > closingTop - 4 * mm,
      };
    });
  });
  console.table(report);

  const fonts = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight} ${f.style}`));
  console.log('Fontes carregadas:', fonts.join(' | '));

  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, outline: true, tagged: true });
  await browser.close();
  console.log('PDF:', out);
})();
