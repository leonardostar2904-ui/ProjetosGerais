/* Gerador da proposta comercial em PDF (A4, 7 páginas, texto vetorial).
   Uso: gerarProposta(jsPDF, window.PROPOSTA_ATIVOS, lead, { de, fone, hoje, config }) -> documento jsPDF.
   Todo o texto vem do config.js: CONFIG.vendedor, CONFIG.produtos, CONFIG.proposta
   e CONFIG.nichos[nicho].proposta. As cores vêm de CONFIG.marca.
   Fontes em proposta-ativos.js. Imagens opcionais em PROPOSTA_ATIVOS.img:
     papel (fundo A4), capa (faixa da capa), logo (fundo claro), logo-claro (fundo escuro). */
(function (root) {
  'use strict';

  var FONTS = {
    reg: ['Archivo-Regular', 0.878, 0.21], semi: ['Archivo-SemiBold', 0.878, 0.21], bold: ['Archivo-Bold', 0.878, 0.21],
    cond: ['ArchivoCond-ExtraBold', 0.878, 0.21], serif: ['InstrumentSerif-Italic', 0.99, 0.31],
    mono: ['PlexMono-Regular', 1.025, 0.275], monom: ['PlexMono-Medium', 1.025, 0.275]
  };
  var PW = 793.7, PH = 1122.6, MX = 68, W = 658, R = 726, BOTTOM = 1056;

  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(fg, bg, a) { var f = hex(fg), b = hex(bg); return [0, 1, 2].map(function (i) { return Math.round(f[i] * a + b[i] * (1 - a)); }); }

  /* troca {chave} pelo valor; chave desconhecida fica como está, para ser vista */
  function preencher(s, vars) { return String(s == null ? '' : s).replace(/\{(\w+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m; }); }

  /* ------------------------------------------------------------------ motor */
  function Eng(jsPDF, A, C, L) {
    var doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
    var k = doc.internal.pageSize.getWidth() / PW;
    Object.keys(FONTS).forEach(function (key) {
      var n = FONTS[key][0]; doc.addFileToVFS(n + '.ttf', A.fontes[n]); doc.addFont(n + '.ttf', n, 'normal');
    });
    var E = { doc: doc, k: k, page: 0 };
    function rgb(c) { return typeof c === 'string' ? hex(c) : c; }
    E.font = function (f, s) { doc.setFont(FONTS[f][0], 'normal'); doc.setFontSize(s * k); };
    E.w = function (t, f, s, cs) { E.font(f, s); return doc.getTextWidth(t) / k + (cs ? cs * s * Math.max(0, t.length - 1) : 0); };
    E.line = function (t, x, top, o) {
      var s = o.s, lh = o.lh || 1.2, cs = o.cs || 0, m = FONTS[o.f];
      if (!o.dry) {
        var c = rgb(o.c || C.tinta); E.font(o.f, s); doc.setTextColor(c[0], c[1], c[2]);
        var base = top + (lh * s - (m[1] + m[2]) * s) / 2 + m[1] * s, xx = x;
        if (o.align === 'right') xx = x - E.w(t, o.f, s, cs); else if (o.align === 'center') xx = x - E.w(t, o.f, s, cs) / 2;
        E.font(o.f, s);
        doc.text(t, xx * k, base * k, cs ? { charSpace: cs * s * k } : undefined);
        if (o.strike) { doc.setDrawColor(c[0], c[1], c[2]); doc.setLineWidth(0.8 * k); var yy = (base - s * 0.3) * k; doc.line(xx * k, yy, (xx + E.w(t, o.f, s, cs)) * k, yy); }
      }
      return top + lh * s;
    };
    E.wrap = function (t, w, f, s, cs) {
      var words = String(t).split(/\s+/), lines = [], cur = '';
      words.forEach(function (wd) {
        var test = cur ? cur + ' ' + wd : wd;
        if (cur && E.w(test, f, s, cs) > w) { lines.push(cur); cur = wd; } else cur = test;
      });
      if (cur) lines.push(cur); return lines;
    };
    E.para = function (t, x, top, w, o) {
      var y = top; E.wrap(t, w, o.f, o.s, o.cs).forEach(function (ln) { y = E.line(ln, x, y, o); }); return y;
    };
    /* texto com trechos em negrito: runs = [[texto, fonte], ...] */
    E.rich = function (runs, x, top, w, o) {
      var toks = []; runs.forEach(function (r) { String(r[0]).split(/\s+/).filter(Boolean).forEach(function (wd) { toks.push({ t: wd, f: r[1] || o.f, c: r[2] || o.c }); }); });
      var y = top, cx = x, s = o.s, sp = E.w(' ', o.f, s);
      toks.forEach(function (tk) {
        var tw = E.w(tk.t, tk.f, s);
        if (cx > x && cx + tw > x + w) { cx = x; y += (o.lh || 1.2) * s; }
        E.line(tk.t, cx, y, { f: tk.f, s: s, lh: o.lh, c: tk.c, dry: o.dry }); cx += tw + sp;
      });
      return y + (o.lh || 1.2) * s;
    };
    E.rect = function (x, y, w, h, c) { var r = rgb(c); doc.setFillColor(r[0], r[1], r[2]); doc.rect(x * k, y * k, w * k, h * k, 'F'); };
    E.box = function (x, y, w, h, c) { var r = rgb(c); doc.setDrawColor(r[0], r[1], r[2]); doc.setLineWidth(0.75 * k); doc.rect(x * k, y * k, w * k, h * k, 'S'); };
    E.hl = function (x1, x2, y, c) { var r = rgb(c || L.line); doc.setDrawColor(r[0], r[1], r[2]); doc.setLineWidth(0.75 * k); doc.line(x1 * k, y * k, x2 * k, y * k); };
    E.vl = function (x, y1, y2, c) { var r = rgb(c || L.line); doc.setDrawColor(r[0], r[1], r[2]); doc.setLineWidth(0.75 * k); doc.line(x * k, y1 * k, x * k, y2 * k); };
    E.has = function (name) { return !!(A.img && A.img[name]); };
    E.img = function (name, x, y, w, h) { var d = A.img[name]; doc.addImage(d, d.indexOf('image/png') > 0 ? 'PNG' : 'JPEG', x * k, y * k, w * k, h * k, name, 'FAST'); };
    /* imagem dentro de uma caixa, sem distorcer; alinhada à direita e embaixo */
    E.imgFit = function (name, x, y, w, h) {
      var p = doc.getImageProperties(A.img[name]), r = Math.min(w / p.width, h / p.height), iw = p.width * r, ih = p.height * r;
      E.img(name, x + w - iw, y + h - ih, iw, ih);
    };
    E.cap = function (t, x, top, o) { o = o || {}; return E.line(String(t).toUpperCase(), x, top, { f: o.f || 'mono', s: o.s || 9, lh: 1.3, cs: 0.13, c: o.c || C.texto2, align: o.align, dry: o.dry }); };
    E.bloco = function (x, y, w, h) { E.rect(x, y, w, h, C.tinta); };
    E.newPage = function (secao, total, topoCapa, topo, rodape) {
      if (E.page > 0) doc.addPage(); E.page++;
      if (E.has('papel')) E.img('papel', 0, 0, PW, PH); else E.rect(0, 0, PW, PH, C.papel);
      E.cap(E.page === 1 ? topoCapa : topo, MX, 49, { s: 9.2 });
      E.cap(secao, R, 49, { s: 9.2, align: 'right' });
      E.hl(MX, R, 67, L.line);
      if (rodape) E.cap(rodape, MX, BOTTOM + 9, { s: 9.2 });
      E.line(('0' + E.page).slice(-2) + ' / ' + ('0' + total).slice(-2), R, BOTTOM + 9, { f: 'monom', s: 9.2, lh: 1.3, cs: 0.13, c: C.texto2, align: 'right' });
    };
    /* título em voz alta, com ponto final na cor de destaque */
    E.titulo = function (kicker, t, top) {
      var y = E.cap(kicker, MX, top) + 9; t = t.toUpperCase(); var s = 60;
      while (s > 40 && E.w(t + '.', 'cond', s, -0.01) > W) s -= 1;
      var lines = E.wrap(t, W, 'cond', s, -0.01), last = lines[lines.length - 1];
      lines.forEach(function (ln, i) { E.line(ln, MX, y + i * 0.92 * s, { f: 'cond', s: s, lh: 0.92, cs: -0.01 }); });
      E.line('.', MX + E.w(last, 'cond', s, -0.01) + 0.5, y + (lines.length - 1) * 0.92 * s, { f: 'cond', s: s, lh: 0.92, c: C.destaque });
      return y + lines.length * 0.92 * s;
    };
    E.nota = function (runs, top, dry) {
      var h = E.rich(runs, 0, 0, W - 26 - 26, { f: 'reg', s: 13.2, lh: 1.58, dry: true }) + 36;
      if (!dry) { E.rect(MX, top, W, h, C.apoio); E.rect(MX, top, 3, h, C.destaque); E.rich(runs, MX + 26, top + 18, W - 52, { f: 'reg', s: 13.2, lh: 1.58 }); }
      return top + h;
    };
    E.frase = function (t) {
      if (!t) return;
      var lines = E.wrap(t, 567, 'serif', 26), h = lines.length * 26 * 1.18, top = BOTTOM - 8 - h;
      E.hl(MX, R, top - 23, L.line); E.para(t, MX, top, 567, { f: 'serif', s: 26, lh: 1.18 });
    };
    return E;
  }

  function fmtData(d, fuso) { var p = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso || 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric' }).format(d).split('/'); return p.join('.'); }
  function fmtNota(n) { return String(n).replace('.', ','); }

  /* -------------------------------------------------------------- páginas */
  function gerarProposta(jsPDF, A, lead, opt) {
    opt = opt || {};
    var CFG = opt.config || root.CONFIG;
    if (!CFG) throw new Error('config.js não carregado');
    var V = CFG.vendedor || {}, P = CFG.proposta || {}, PRODS = CFG.produtos || [], M = CFG.marca || {};
    var C = { papel: M.papel || '#F4F2EC', tinta: M.tinta || '#1E2329', destaque: M.destaque || '#1D4ED8', apoio: M.apoio || '#E2DED4', texto2: M.texto2 || '#555B63' };
    var L = { line: mix(C.tinta, C.papel, 0.22), lineS: mix(C.tinta, C.papel, 0.32), lineF: mix(C.tinta, C.papel, 0.14), lineEsc: mix(C.papel, C.tinta, 0.28), borda: mix(C.tinta, C.papel, 0.26) };

    var hojeD = opt.hoje || new Date();
    var de = opt.de || V.nome || '', fone = opt.fone || V.telefone || '', hoje = fmtData(hojeD, CFG.fuso);
    var validade = P.validade || fmtData(new Date(hojeD.getTime() + (P.validadeDias || 15) * 86400000), CFG.fuso);

    var nichos = CFG.nichos || {}, chaveNicho = nichos[lead.nicho] ? lead.nicho : Object.keys(nichos)[0];
    var bruto = nichos[chaveNicho].proposta; if (typeof bruto === 'function') bruto = bruto(lead);
    var nome = lead.nome;

    var vars = { vendedor: de, empresa: V.empresa || '', instagram: V.instagram || '', telefone: fone, validade: validade, nome: nome };
    PRODS.forEach(function (p, i) { vars['produto' + (i + 1)] = p.nome + ', ' + p.preco; vars['nomeProduto' + (i + 1)] = p.nome; vars['preco' + (i + 1)] = p.preco; });
    ['vive', 'decide', 'fecha', 'mapa', 'preciso', 'cenario', 'agenda', 'fluxo', 'naoMuda', 'custo'].forEach(function (key) { if (typeof bruto[key] === 'string') vars[key] = preencher(bruto[key], vars); });
    function f(s) { return preencher(s, vars); }
    function fundo(x) { return Array.isArray(x) ? x.map(fundo) : (typeof x === 'string' ? f(x) : x); }
    var T = {}; Object.keys(bruto).forEach(function (key) { T[key] = fundo(bruto[key]); });
    function par(x) { return x && x.length ? [[f(x[0]), 'bold'], [f(x[1] || '')]] : null; }

    var E = Eng(jsPDF, A, C, L), TOTAL = 7, y, rec = Math.min(Math.max((P.recomendada || 2) - 1, 0), 2);
    var PAR = { f: 'reg', s: 13.2, lh: 1.58, c: C.texto2 };
    var empresa = V.empresa || '';
    var topoCapa = empresa + (P.descricaoEmpresa ? ' · ' + f(P.descricaoEmpresa) : '');
    var topo = empresa ? empresa + ' · Proposta comercial' : 'Proposta comercial';
    var rodape = f(P.rodape || '');
    var FR = P.frases || {};
    function pagina(secao) { E.newPage(secao, TOTAL, topoCapa, topo, rodape); }

    /* 01 capa */
    pagina('Proposta comercial');
    if (E.has('capa')) E.img('capa', MX, 109, 726, 567); else E.bloco(MX, 109, 726, 567);
    var ts = 96; T.capa.forEach(function (ln) { while (ts > 60 && E.w(ln.toUpperCase(), 'cond', ts, -0.01) > 420) ts -= 2; });
    T.capa.forEach(function (ln, j) { E.line(ln.toUpperCase(), MX + 42, 158 + j * ts * 0.84, { f: 'cond', s: ts, lh: 0.84, cs: -0.01, c: C.papel }); });
    if (P.subtituloCapa) E.para(f(P.subtituloCapa), MX, 714, 484, { f: 'serif', s: 29, lh: 1.18 });
    var my = 844;
    E.cap('Proposta para', MX, my); E.line(nome, MX, my + 17, { f: 'semi', s: 13, lh: 1.3 });
    E.cap('De', MX, my + 52); E.line(de + (empresa ? ' · ' + empresa : ''), MX, my + 69, { f: 'semi', s: 13, lh: 1.3 });
    E.cap('Data', MX, my + 104); E.line(hoje, MX, my + 121, { f: 'monom', s: 13, lh: 1.3 });
    E.cap('Valores válidos até', MX + 127, my + 104); E.line(validade, MX + 127, my + 121, { f: 'monom', s: 13, lh: 1.3 });
    if (E.has('logo')) E.imgFit('logo', R - 140, 842, 140, 139.5);
    else if (empresa) { var ls = 30; while (ls > 16 && E.w(empresa.toUpperCase(), 'cond', ls) > 250) ls -= 1; E.line(empresa.toUpperCase(), R, 950, { f: 'cond', s: ls, lh: 1, align: 'right' }); }

    /* 02 diagnóstico */
    pagina('01 Diagnóstico');
    y = E.titulo('01 · O que eu entendi', 'O ponto de partida', 99);
    var rep = (lead.nota && lead.avaliacoes) ? fmtNota(lead.nota) + ' no Google, ' + lead.avaliacoes + ' avaliações e um negócio que entrega.' : 'um negócio com boa reputação e clientes que recomendam.';
    y = E.para('Essa leitura nasce do que dá para ver de fora: ' + rep + ' Quando o trabalho é bom, o gargalo raramente é a venda. É o tempo entre o contato chegar e alguém responder.', MX, y + 23, 574, { f: 'reg', s: 14.8, lh: 1.55 });
    y = E.cap('Um dia comum sem sistema', MX, y + 30) + 11;
    E.hl(MX, R, y, L.lineS);
    T.dia.forEach(function (d) {
      var top = y + 13.6;
      E.line(d[0], MX, top, { f: 'monom', s: 13, lh: 1.58 * 13.2 / 13, c: d[2] ? C.destaque : C.tinta });
      y = E.para(d[1], MX + 99, top, 559, { f: d[2] ? 'semi' : 'reg', s: 13.2, lh: 1.58, c: d[2] ? C.tinta : C.texto2 }) + 13.6;
      E.hl(MX, R, y, L.lineF);
    });
    y = E.cap('O que custa não resolver · a conta é sua', MX, y + 30) + 11;
    var cw = [172, 172, 216], cx = [MX, MX + 172 + 49, MX + 344 + 98];
    var caixas = [['Contatos sem resposta', 'Quantos por semana ficam para depois ou sem retorno?'], T.ticket, ['O custo do atraso', T.custo]];
    var ch = 0; caixas.forEach(function (c, j) { ch = Math.max(ch, E.para(c[1], 0, 0, cw[j] - 38, { f: 'reg', s: 12.4, lh: 1.45, dry: true })); }); ch += 17 * 2 + 12 + 5;
    caixas.forEach(function (c, j) {
      if (j === 2) E.bloco(cx[j], y, cw[j], ch); else E.box(cx[j], y, cw[j], ch, L.borda);
      var yy = E.cap(c[0], cx[j] + 19, y + 17, { c: j === 2 ? C.apoio : C.texto2 }) + 5;
      E.para(c[1], cx[j] + 19, yy, cw[j] - 38, { f: 'reg', s: 12.4, lh: 1.45, c: j === 2 ? C.papel : C.tinta });
    });
    E.line('×', MX + 172 + 24.5, y + ch / 2 - 11, { f: 'mono', s: 18, lh: 1.2, c: C.texto2, align: 'center' });
    E.line('=', MX + 344 + 73.5, y + ch / 2 - 11, { f: 'mono', s: 18, lh: 1.2, c: C.texto2, align: 'center' });
    y += ch + 30;
    var col2 = MX + 329;
    E.cap('O que não muda', MX, y + 4); E.cap('O que muda', col2 + 26, y + 4, { c: C.destaque });
    var ly = y + 4 + 12 + 8, li0 = ly;
    ['O seu número de WhatsApp', 'O seu jeito de falar com o cliente', T.naoMuda].forEach(function (t) { E.rect(MX, ly + 9.5, 5, 0.9, C.texto2); ly = E.line(t, MX + 13, ly, { f: 'reg', s: 12.8, lh: 1.5, c: C.texto2 }) + 5; });
    var ry = li0;
    ['O tempo entre a mensagem e a resposta', 'O que você sabe antes de atender', 'O tempo que sobra do seu dia'].forEach(function (t) { E.rect(col2 + 26, ry + 7, 5, 5, C.destaque); ry = E.line(t, col2 + 39, ry, { f: 'semi', s: 12.8, lh: 1.5 }) + 5; });
    E.vl(col2, y, ly + 4, L.line);
    E.frase(f(FR.diagnostico || ''));

    /* 03 três caminhos */
    pagina('02 Investimento');
    y = E.titulo('02 · O que eu ofereço', 'Três caminhos', 99);
    y = E.line('Do mais simples ao mais completo. Cada um funciona sozinho.', MX, y + 19, { f: 'reg', s: 14.8, lh: 1.55 });
    var cards = PRODS.slice(0, 3).map(function (p, j) {
      return { cap: ('0' + (j + 1)).slice(-2) + ' · ' + f(p.selo || ''), nome: f(p.nome), para: f(p.para || ''), de: p.de ? 'DE ' + f(p.de) : '', por: f(p.preco), mais: f(p.condicao || ''), pz: f(p.prazo || ''), li: (p.itens || []).map(f), azul: j === rec };
    });
    var wC = [201, 201, 201], xC = [MX, MX + 216, MX + 457];
    wC[rec] = 226; xC = [MX]; xC.push(MX + wC[0] + 15); xC.push(xC[1] + wC[1] + 15);
    var top3 = y + 41;
    function card(c, x, w, top, dry) {
      var px = c.azul ? 19 : 17.4, inner = w - px * 2, cor = c.azul ? C.papel : C.tinta, sec = c.azul ? C.apoio : C.texto2;
      var yy = top + (c.azul ? 28 : 19);
      yy = E.cap(c.cap, x + px, yy, { c: sec, dry: dry }) + 6;
      var ny = E.para(c.nome.toUpperCase(), x + px, yy, inner, { f: 'bold', s: 16.5, lh: 1.08, c: cor, dry: dry }); yy = Math.max(ny, yy + 54);
      var py = E.para(c.para, x + px, yy + 5, inner, { f: 'reg', s: 11.2, lh: 1.42, c: sec, dry: dry }); yy = Math.max(py, yy + 5 + 49);
      if (c.de) yy = E.line(c.de, x + px, yy + 4, { f: 'mono', s: 10, lh: 1.3, c: sec, strike: 1, cs: 0.04, dry: dry }); else yy += 4 + 13;
      yy = E.line(c.por, x + px, yy + 2, { f: 'monom', s: 25, lh: 1.1, c: cor, dry: dry });
      var my2 = E.para(c.mais, x + px, yy + 5, inner, { f: 'reg', s: 10.8, lh: 1.4, c: sec, dry: dry }); yy = Math.max(my2, yy + 5 + 31) + 7;
      if (!dry) { E.hl(x + px, x + w - px, yy, c.azul ? L.lineEsc : L.line); E.hl(x + px, x + w - px, yy + 24, c.azul ? L.lineEsc : L.line); }
      E.line(c.pz.toUpperCase(), x + px, yy + 6, { f: 'mono', s: 9.4, lh: 1.3, cs: 0.1, c: cor, dry: dry }); yy += 24 + 8;
      c.li.forEach(function (t) { if (!dry) E.rect(x + px, yy + 5.5, 4, 4, cor); yy = E.para(t, x + px + 11, yy, inner - 11, { f: 'reg', s: 11, lh: 1.38, c: cor, dry: dry }) + 3.6; });
      return yy - top + (c.azul ? 20 : 12);
    }
    var hC = 0; cards.forEach(function (c, j) { hC = Math.max(hC, card(c, xC[j], wC[j], 0, true) - (c.azul ? 19 : 0)); });
    cards.forEach(function (c, j) {
      if (c.azul) E.bloco(xC[j], top3 - 9.5, wC[j], hC + 19); else E.box(xC[j], top3, wC[j], hC, L.borda);
      card(c, xC[j], wC[j], c.azul ? top3 - 9.5 : top3, false);
    });
    var chipW = E.w('RECOMENDADA PARA VOCÊ', 'mono', 8.4, 0.13) + 14;
    E.rect(xC[rec] + 19, top3 - 9.5 - 8.5, chipW, 17, C.destaque); E.cap('Recomendada para você', xC[rec] + 26, top3 - 9.5 - 8.5 + 3, { s: 8.4, c: C.papel });
    y = top3 + hC + 9.5 + 20;
    if (P.porQueRecomenda) y = E.nota(par(P.porQueRecomenda), y);
    var cond = (P.condicoes || []).slice(0, 4).map(par);
    var ult = P.promocao ? par(P.promocao) : null;
    function condicoes(top, dry) {
      var yy = E.cap('Condições', MX, top, { dry: dry }) + 11, cwid = 312 - 22, o = { f: 'reg', s: 11.8, lh: 1.45, dry: dry };
      for (var r = 0; r < Math.ceil(cond.length / 2); r++) {
        var a = E.rich(cond[r * 2], MX + 22, yy, cwid, o), b = cond[r * 2 + 1] ? E.rich(cond[r * 2 + 1], MX + 346 + 22, yy, cwid, o) : a;
        if (!dry) { E.rect(MX, yy + 5.5, 7, 7, C.destaque); if (cond[r * 2 + 1]) E.rect(MX + 346, yy + 5.5, 7, 7, C.destaque); }
        yy = Math.max(a, b) + 8.3;
      }
      if (!ult) return yy;
      if (!dry) E.rect(MX, yy + 5.5, 7, 7, C.destaque);
      return E.rich(ult, MX + 22, yy, W - 22, o);
    }
    if (cond.length || ult) { var hCond = condicoes(0, true); condicoes(Math.max(y + 19, BOTTOM - 8 - hCond), false); }

    /* 04 escopo */
    var ES = P.escopo || {};
    pagina('03 Escopo');
    y = E.titulo(f(ES.kicker || '03 · A opção recomendada, em detalhe'), f(ES.titulo || 'O que está incluído'), 99);
    if (ES.intro) y = E.para(f(ES.intro), MX, y + 23, 574, { f: 'reg', s: 14.8, lh: 1.55 });
    y += 30;
    T.itens.forEach(function (it, j) {
      E.rect(MX, y, 24, 24, C.destaque); E.line(('0' + (j + 1)).slice(-2), MX + 12, y + 5.5, { f: 'monom', s: 10, lh: 1.3, c: C.papel, align: 'center' });
      var yy = E.line(it[0], MX + 36, y, { f: 'semi', s: 16, lh: 1.25 }) + 4;
      y = E.para(it[1], MX + 36, yy, 559, PAR) + 36;
    });
    if (ES.nota) { var nt = par(ES.nota), hN = E.nota(nt, 0, true); E.nota(nt, BOTTOM - 8 - hN); }

    /* 05 na prática */
    var PR = P.pratica || {};
    pagina('04 Na prática');
    y = E.titulo('04 · Como funciona', T.fluxo, 99) + 30;
    var py0 = y, tops = [];
    T.passos.forEach(function (p) {
      tops.push(y);
      var yy = E.line(p[0], MX + 42, y + 2, { f: 'semi', s: 15, lh: 1.25 }) + 4;
      var end = E.para(p[1], MX + 42, yy, 287, { f: 'reg', s: 12.4, lh: 1.58, c: C.texto2 });
      y = Math.max(end, y + 28) + 26;
    });
    tops.forEach(function (t, j) { if (j < tops.length - 1) E.vl(MX + 14, t + 28, tops[j + 1], L.lineS); });
    tops.forEach(function (t, j) { E.box(MX, t, 28, 28, C.tinta); E.line(('0' + (j + 1)).slice(-2), MX + 14, t + 7.2, { f: 'monom', s: 10.5, lh: 1.3, align: 'center' }); });
    var bx = R - 295, bw = 295, ipad = 21, iw = bw - ipad * 2, CLI = mix(C.papel, C.tinta, 0.11);
    function chat(top, dry) {
      var yy = E.cap(f(PR.exemploQuando || 'Exemplo'), bx + ipad, top + 23, { c: C.apoio, dry: dry }) + 21;
      T.chat.forEach(function (m) {
        var maxw = iw * 0.88 - 26, lines = E.wrap(m[1], maxw, 'reg', 11.8), tw = 0;
        lines.forEach(function (ln) { tw = Math.max(tw, E.w(ln, 'reg', 11.8)); });
        var w = tw + 26, h = lines.length * 11.8 * 1.45 + 21.2, x = m[0] === 'a' ? bx + bw - ipad - w : bx + ipad;
        if (!dry) { E.rect(x, yy, w, h, m[0] === 'a' ? C.papel : CLI); var ty = yy + 10.6; lines.forEach(function (ln) { ty = E.line(ln, x + 13, ty, { f: 'reg', s: 11.8, lh: 1.45, c: m[0] === 'a' ? C.tinta : C.apoio }); }); }
        yy += h + 11.3;
      });
      yy += 8; if (!dry) E.hl(bx + ipad, bx + bw - ipad, yy, L.lineEsc); yy += 17;
      if (PR.tempoResposta) {
        E.cap('Tempo de resposta', bx + ipad, yy + 6, { c: C.apoio, dry: dry });
        E.line(f(PR.tempoResposta), bx + bw - ipad, yy, { f: 'monom', s: 19, lh: 1.2, c: C.papel, align: 'right', dry: dry }); yy += 23 + 17;
        if (!dry) E.hl(bx + ipad, bx + bw - ipad, yy, L.lineEsc); yy += 17;
      }
      yy = E.cap('Você recebe na hora', bx + ipad, yy, { c: C.apoio, dry: dry }) + 5;
      T.resumo.forEach(function (r) { yy = E.para(r, bx + ipad, yy, iw, { f: 'mono', s: 9.6, lh: 1.75, cs: 0.03, c: C.papel, dry: dry }); });
      return yy + 21 - top;
    }
    var hChat = chat(0, true); E.bloco(bx, py0, bw, hChat); chat(py0, false);
    E.frase(T.frase);

    /* 06 cronograma */
    var CR = P.cronograma || {};
    pagina('05 Cronograma');
    y = E.titulo(f(CR.kicker || '05 · Prazo'), f(CR.titulo || 'Etapas'), 99) + 30;
    var xP = MX + 178, xO = MX + 291;
    E.cap('Etapa', MX, y); E.cap('Prazo', xP, y); y = E.cap('O que acontece', xO, y) + 7; E.hl(MX, R, y, L.lineS);
    (CR.etapas || []).forEach(function (r, j) {
      var top = y + 19;
      var a = E.line(('0' + (j + 1)).slice(-2), MX, top, { f: 'monom', s: 9, lh: 1.3, c: C.destaque, cs: 0.1 }) + 4;
      a = E.line(f(r[0]).toUpperCase(), MX, a, { f: 'bold', s: 14, lh: 1.3 });
      E.line(f(r[1]), xP, top + 2, { f: 'mono', s: 10.5, lh: 1.52, c: C.texto2 });
      var b = E.para(f(r[2]), xO, top, R - xO, { f: 'reg', s: 12.8, lh: 1.52, c: C.texto2 });
      y = Math.max(a, b) + 19; E.hl(MX, R, y, L.lineF);
    });
    if (CR.nota) y = E.nota(par(CR.nota), y + 30);
    if (CR.preciso && CR.preciso.length) {
      y = E.cap('O que eu preciso de você', MX, y + 30) + 19;
      CR.preciso.slice(0, 3).forEach(function (t, j) {
        var x = MX + j * 228; E.hl(x, x + 202, y, L.line);
        var yy = E.line(('0' + (j + 1)).slice(-2), x, y + 17, { f: 'monom', s: 9, lh: 1.3, c: C.destaque, cs: 0.1 }) + 5;
        E.para(f(t), x, yy, 202, { f: 'reg', s: 12.2, lh: 1.5, c: C.texto2 });
      });
    }
    E.frase(f(FR.cronograma || ''));

    /* 07 próximo passo */
    pagina('06 Como seguir');
    y = E.titulo('06 · Quem faz e como seguir', 'O próximo passo', 99) + 30;
    var qy = E.cap('Quem faz', MX, y) + 8;
    qy = E.para(f(V.bio || ''), MX, qy, 310, PAR);
    if (FR.posicionamento) E.para(f(FR.posicionamento), MX + 348, y, 310, { f: 'serif', s: 27, lh: 1.18 });
    y = qy + 30;
    var ops = (P.opcoes || []).slice(0, 2).map(function (o) { return o.map(f); });
    if (ops.length) {
      var oh = 0; ops.forEach(function (o) { oh = Math.max(oh, E.para(o[2], 0, 0, 319.5 - 46, { f: 'reg', s: 12.4, lh: 1.58, dry: true })); }); oh += 21 * 2 + 12 + 7 + 20 + 4;
      ops.forEach(function (o, j) {
        var x = MX + j * 338.5; E.box(x, y, 319.5, oh, L.borda);
        var yy = E.cap(o[0], x + 23, y + 21, { c: C.destaque }) + 7; yy = E.line(o[1], x + 23, yy, { f: 'semi', s: 16, lh: 1.25 }) + 4;
        E.para(o[2], x + 23, yy, 319.5 - 46, { f: 'reg', s: 12.4, lh: 1.58, c: C.texto2 });
      });
      y += oh;
    }
    var faq = (P.faq || []).slice(0, 3).map(function (q) { return q.map(f); });
    var fy = y;
    if (faq.length) {
      y = E.cap('Perguntas que costumam aparecer', MX, y + 30) + 19; fy = y;
      faq.forEach(function (q, j) {
        var x = MX + j * 228; E.hl(x, x + 202, y, L.line);
        var yy = E.para(q[0], x, y + 17, 202, { f: 'semi', s: 13.6, lh: 1.25 }) + 5;
        fy = Math.max(fy, E.para(q[1], x, yy, 202, { f: 'reg', s: 12.2, lh: 1.5, c: C.texto2 }));
      });
    }
    if (P.garantia) E.nota(par(P.garantia), fy + 30);
    var ay = 889, ah = BOTTOM - ay;
    E.bloco(0, ay, PW, ah);
    var ty = E.cap('Fala comigo', MX, ay + 52, { c: C.apoio }) + 6, cs7 = 12.5;
    while (cs7 > 8 && Math.max(E.w(de.toUpperCase(), 'mono', cs7, 0.04), E.w('WHATSAPP ' + fone, 'mono', cs7, 0.04)) > 351 - MX - 20) cs7 -= 0.5;
    ty = E.line(de.toUpperCase(), MX, ty, { f: 'mono', s: cs7, lh: 12.5 * 1.85 / cs7, cs: 0.04, c: C.papel });
    if (fone) E.line('WHATSAPP ' + fone, MX, ty, { f: 'mono', s: cs7, lh: 12.5 * 1.85 / cs7, cs: 0.04, c: C.papel });
    var fech = FR.fechamento || [];
    if (fech[0]) E.line(f(fech[0]), 351, ay + 54, { f: 'serif', s: 25, lh: 1.18, c: C.papel });
    if (fech[1]) E.line(f(fech[1]), 351, ay + 54 + 29.5, { f: 'serif', s: 25, lh: 1.18, c: C.papel });
    if (E.has('logo-claro')) E.imgFit('logo-claro', R - 110, ay + 30, 110, 107);

    E.doc.setProperties({ title: 'Proposta' + (empresa ? ' ' + empresa : '') + ' · ' + nome, author: de });
    return E.doc;
  }

  root.gerarProposta = gerarProposta;
  if (typeof module !== 'undefined' && module.exports) module.exports = gerarProposta;
})(typeof window !== 'undefined' ? window : globalThis);
