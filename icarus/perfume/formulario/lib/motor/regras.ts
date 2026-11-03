import { encontrarMencoes } from "../conhecimento/palavras-chave";
import { CONCENTRACOES, LACUNAS_NATURAIS, type CodigoConcentracao, type CodigoLacuna } from "../conhecimento/referencias";
import { rotuloDaOpcao } from "../questionario/perguntas";
import type { Respostas } from "../questionario/tipos";
import type { Direcao, MencaoTexto, RegraAplicada } from "./tipos";

// Regras de tradução v0.1: "se a resposta X, então ajuste Y".
// Todas são determinísticas e auditáveis. Associações criativas (estação, lugar, bebida) têm
// peso menor que a escolha declarada de família (#19). Nada aqui gera fórmula.

type Grupo = keyof Direcao["pesos"];
const GRUPOS: Grupo[] = ["frescos", "florais", "amadeirados", "doces", "quentes"];

export type SaidaRegras = {
  regras: RegraAplicada[];
  direcao: Direcao;
  mencoes: MencaoTexto[];
  lacunas: { codigo: CodigoLacuna; texto: string; origem: string }[];
  bonusMaterias: Map<number, { pontos: number; motivo: string }[]>;
  exclusoes: Map<number, string>;
};

const arr = (v: unknown): string[] => (Array.isArray(v) ? v : typeof v === "string" ? [v] : []);
const num = (v: unknown): number | null => (typeof v === "number" ? v : null);
const rotulos = (id: string, vs: string[]) => vs.map((v) => rotuloDaOpcao(id, v)).join(", ");

export function aplicarRegras(r: Respostas): SaidaRegras {
  const regras: RegraAplicada[] = [];
  const pesos: Record<Grupo, number> = { frescos: 0, florais: 0, amadeirados: 0, doces: 0, quentes: 0 };
  const conflitos: string[] = [];
  const alertas: string[] = [];
  const ajustes = { fundo: 0, citricosSaida: 0, fundoPesadoCalor: 0 };
  const bonusMaterias = new Map<number, { pontos: number; motivo: string }[]>();
  const exclusoes = new Map<number, string>();
  const lacunas: SaidaRegras["lacunas"] = [];
  const mencoes: MencaoTexto[] = [];

  const bonus = (n: number, pontos: number, motivo: string) => {
    bonusMaterias.set(n, [...(bonusMaterias.get(n) ?? []), { pontos, motivo }]);
  };
  const lacuna = (codigo: CodigoLacuna, origem: string) => {
    if (!lacunas.some((l) => l.codigo === codigo)) lacunas.push({ codigo, texto: LACUNAS_NATURAIS[codigo], origem });
  };
  const add = (x: RegraAplicada) => regras.push(x);

  // R01 · Famílias declaradas (#19)
  const q19 = arr(r.q19) as Grupo[];
  if (q19.length) {
    q19.forEach((g) => (pesos[g] += 1));
    add({
      codigo: "R01", nome: "Família olfativa declarada", gatilho: `#19 = ${rotulos("q19", q19)}`,
      efeito: "Peso 1 para cada família escolhida. É o eixo principal da direção olfativa.",
      tipo: "direcao", evidencia: "declarada", origens: ["q19"],
    });
    if (q19.includes("frescos")) lacuna("mar", "#19 Frescos inclui notas de mar");
    if (q19.includes("quentes")) lacuna("couro", "#19 Quentes e intensos inclui couro e tabaco");
    if (q19.includes("quentes")) lacuna("tabaco", "#19 Quentes e intensos inclui couro e tabaco");
    if (q19.includes("doces")) lacuna("caramelo", "#19 Doces e gourmand inclui caramelo");
  }

  // R02 · Estação (#24)
  const q24 = typeof r.q24 === "string" ? r.q24 : null;
  if (q24) {
    const mapa: Record<string, Partial<Record<Grupo, number>>> = {
      verao: { frescos: 0.5 }, primavera: { florais: 0.5, frescos: 0.25 },
      outono: { amadeirados: 0.5, doces: 0.25 }, inverno: { quentes: 0.5, doces: 0.25 },
    };
    Object.entries(mapa[q24] ?? {}).forEach(([g, p]) => (pesos[g as Grupo] += p ?? 0));
    add({
      codigo: "R02", nome: "Estação que combina", gatilho: `#24 = ${rotuloDaOpcao("q24", q24)}`,
      efeito: `Ajuste leve: ${Object.entries(mapa[q24] ?? {}).map(([g, p]) => `${g} +${p}`).join(", ")}.`,
      tipo: "ajuste", evidencia: "associacao", origens: ["q24"],
    });
  }

  // R03 · Lugares (#23)
  const q23 = arr(r.q23);
  if (q23.length) {
    const mapa: Record<string, Partial<Record<Grupo, number>>> = {
      praia: { frescos: 0.4 }, mata: { amadeirados: 0.4, frescos: 0.2 }, cidade: { amadeirados: 0.2, quentes: 0.2 },
      casa: { doces: 0.3, florais: 0.2 }, bares: { quentes: 0.4 },
    };
    q23.forEach((l) => Object.entries(mapa[l] ?? {}).forEach(([g, p]) => (pesos[g as Grupo] += p ?? 0)));
    if (q23.includes("praia")) lacuna("mar", "#23 Praia");
    add({
      codigo: "R03", nome: "Lugares onde se sente mais você", gatilho: `#23 = ${rotulos("q23", q23)}`,
      efeito: "Ajuste leve de família por associação de lugar.",
      tipo: "ajuste", evidencia: "associacao", origens: ["q23"],
    });
  }

  // R04 · Bebidas (#25)
  const q25 = arr(r.q25);
  if (q25.length) {
    const efeitos: string[] = [];
    if (q25.includes("cafe")) { bonus(94, 1.5, "#25 Café forte"); pesos.doces += 0.2; efeitos.push("café absoluto (#94) +1,5"); }
    if (q25.includes("vinho")) { bonus(97, 1, "#25 Vinho tinto (aproximação)"); pesos.quentes += 0.2; lacuna("vinho", "#25 Vinho tinto"); efeitos.push("cassis (#97) +1 como aproximação"); }
    if (q25.includes("gin")) { bonus(80, 1.5, "#25 Gin tônica"); bonus(11, 1, "#25 Gin tônica"); pesos.frescos += 0.2; efeitos.push("zimbro (#80) +1,5 e lima destilada (#11) +1"); }
    if (q25.includes("cha")) { pesos.frescos += 0.2; lacuna("cha", "#25 Chá"); efeitos.push("frescos +0,2; sem chá no catálogo"); }
    if (q25.includes("champagne")) { pesos.frescos += 0.2; lacuna("champagne", "#25 Champagne"); efeitos.push("frescos +0,2; sem nota natural"); }
    add({
      codigo: "R04", nome: "Bebida que representa", gatilho: `#25 = ${rotulos("q25", q25)}`,
      efeito: efeitos.join("; ") + ".", tipo: "ajuste", evidencia: "associacao", origens: ["q25"],
    });
  }

  // R05 · Memórias (#21, #22): menções diretas
  for (const id of ["q21", "q22"]) {
    const achados = encontrarMencoes(typeof r[id] === "string" ? (r[id] as string) : undefined);
    const jaPontuadas = new Set<number>(); // sinônimos na mesma resposta contam uma vez
    achados.forEach((m) => {
      mencoes.push({ perguntaId: id, termo: m.termo, materias: m.materias, grupo: m.grupo, lacuna: m.lacuna, uso: "afinidade" });
      m.materias.filter((n) => !jaPontuadas.has(n)).forEach((n) => {
        jaPontuadas.add(n);
        bonus(n, 2.5, `#${id.slice(1)} menciona "${m.termo}"`);
      });
      if (m.grupo) pesos[m.grupo as Grupo] += 0.3;
      if (m.lacuna) lacuna(m.lacuna, `#${id.slice(1)} menciona "${m.termo}"`);
    });
  }
  const memorias = mencoes.filter((m) => m.uso === "afinidade");
  if (memorias.length) {
    add({
      codigo: "R05", nome: "Memórias olfativas (menções diretas)",
      gatilho: memorias.map((m) => `"${m.termo}" (#${m.perguntaId.slice(1)})`).join(", "),
      efeito: "Matérias-primas citadas ganham +2,5; famílias citadas +0,3. Leitura por palavra, sem interpretação.",
      tipo: "ajuste", evidencia: "declarada", origens: ["q21", "q22"],
    });
  }

  // R06 · O que não suporta (#20): exclusões
  const naoSuporta = encontrarMencoes(typeof r.q20 === "string" ? r.q20 : undefined);
  naoSuporta.forEach((m) => {
    mencoes.push({ perguntaId: "q20", termo: m.termo, materias: m.materias, grupo: m.grupo, lacuna: m.lacuna, uso: "exclusao" });
    m.materias.forEach((n) => exclusoes.set(n, `#20 cita "${m.termo}"`));
    if (m.grupo) pesos[m.grupo as Grupo] -= 0.5;
  });
  if (naoSuporta.length) {
    add({
      codigo: "R06", nome: "Cheiros que não suporta", gatilho: naoSuporta.map((m) => `"${m.termo}"`).join(", "),
      efeito: "Matérias-primas citadas saem da lista; famílias citadas perdem 0,5.",
      tipo: "restricao", evidencia: "declarada", origens: ["q20"],
    });
  }

  // #30 · Perfumes já usados: só referência (não dá para saber se é gosto ou rejeição sem leitura de sentido)
  encontrarMencoes(typeof r.q30 === "string" ? r.q30 : undefined).forEach((m) =>
    mencoes.push({ perguntaId: "q30", termo: m.termo, materias: m.materias, grupo: m.grupo, lacuna: m.lacuna, uso: "referencia" }),
  );

  // R07 · Concentração (#28 intensidade × #29 duração, com #27)
  const intensidade = num(r.q28);
  let duracao = num(r.q29);
  if (r.q27 === "dia-todo" && duracao !== null) duracao = Math.max(duracao, 4);
  let conc: CodigoConcentracao | null = null;
  let motivoConc = "Faltam as respostas de intensidade (#28) e duração (#29).";
  if (intensidade !== null && duracao !== null) {
    if (duracao >= 4 && intensidade <= 3) { conc = "extrait"; motivoConc = "Duração alta com projeção contida: o extrait fixa mais e projeta perto da pele."; }
    else if (duracao >= 4) { conc = "edp"; motivoConc = "Duração e intensidade altas: EDP com fixadores difusivos."; }
    else if (intensidade >= 4) { conc = "edt"; motivoConc = "Intensidade alta com duração moderada: o EDT projeta mais e evapora antes."; }
    else { conc = "edt"; motivoConc = "Intensidade e duração baixas ou moderadas: EDT leve."; }
    if (arr(r.q34).includes("alcool")) motivoConc += " Em base oleosa, a concentração equivalente é definida com o perfumista.";
    if (r.q33 === "dor-cabeca") motivoConc += " Projeção contida pela #33.";
    add({
      codigo: "R07", nome: "Concentração sugerida",
      gatilho: `#28 = ${intensidade}, #29 = ${num(r.q29)}${r.q27 === "dia-todo" ? ", #27 = dure o dia todo" : ""}`,
      efeito: `${CONCENTRACOES[conc].nome}. ${motivoConc}`,
      tipo: "direcao", evidencia: "aceita", origens: ["q28", "q29", "q27"],
    });
  }

  // R08 · Clima (#6)
  const q06 = arr(r.q06);
  const calor = q06.includes("quente-umido") || q06.includes("quente-seco");
  if (calor) {
    ajustes.fundoPesadoCalor = 0.5;
    alertas.push("Clima quente com sol: cítricos prensados a frio e cominho são fototóxicos. Usar versões FCF ou destiladas.");
    add({
      codigo: "R08", nome: "Clima quente", gatilho: `#6 = ${rotulos("q06", q06)}`,
      efeito: "Notas de fundo pesadas (âmbar, gourmand, resinas) perdem 0,5. Reforça o alerta de fototoxicidade.",
      tipo: "ajuste", evidencia: "moderada", origens: ["q06"],
    });
  } else if (q06.includes("frio")) {
    ajustes.fundo += 0.3;
    add({
      codigo: "R08", nome: "Clima frio", gatilho: `#6 = ${rotulos("q06", q06)}`,
      efeito: "Base densa é bem-vinda: fundo +0,3.", tipo: "ajuste", evidencia: "moderada", origens: ["q06"],
    });
  }

  // R09 · Pele seca ou perfume que some (#35, #37)
  if (r.q35 === "seca" || r.q37 === "somem") {
    ajustes.fundo += 0.6;
    add({
      codigo: "R09", nome: "Reforço de fixação",
      gatilho: [r.q35 === "seca" ? "#35 = Mais seca" : "", r.q37 === "somem" ? "#37 = Somem em poucas horas" : ""].filter(Boolean).join(" e "),
      efeito: "Matérias de fundo (fixadores) ganham +0,6.", tipo: "ajuste", evidencia: "aceita", origens: ["q35", "q37"],
    });
  }

  // R10 · Hidratação (#36)
  if (r.q36 === "quase-nunca") {
    ajustes.fundo += 0.2;
    add({
      codigo: "R10", nome: "Pouca hidratação", gatilho: "#36 = Quase nunca",
      efeito: "Fundo +0,2. Nota para a entrega: hidratante neutro antes do perfume ajuda a fixar.",
      tipo: "ajuste", evidencia: "aceita", origens: ["q36"],
    });
  }

  // R11 · Cítricos e florais que mudam (#38)
  if (r.q38 === "quase-sempre" || r.q38 === "as-vezes") {
    ajustes.citricosSaida = r.q38 === "quase-sempre" ? 1 : 0.4;
    add({
      codigo: "R11", nome: "Alteração de cítricos na pele", gatilho: `#38 = ${rotuloDaOpcao("q38", r.q38 as string)}`,
      efeito: `Cítricos de saída perdem ${ajustes.citricosSaida === 1 ? "1" : "0,4"}. Peso leve: a relação com o pH da pele tem evidência fraca.`,
      tipo: "ajuste", evidencia: "fraca", origens: ["q38"],
    });
  }

  // R12 · Dieta e estresse (#39, #40)
  if (r.q39 === "quase-todo-dia" || (num(r.q40) ?? 0) >= 4) {
    ajustes.fundo += 0.1;
    add({
      codigo: "R12", nome: "Dieta e estresse",
      gatilho: [r.q39 === "quase-todo-dia" ? "#39 = Quase todo dia" : "", (num(r.q40) ?? 0) >= 4 ? `#40 = ${r.q40}` : ""].filter(Boolean).join(" e "),
      efeito: "Contexto registrado. Ajuste mínimo (fundo +0,1): efeito real é incerto.",
      tipo: "ajuste", evidencia: "fraca", origens: ["q39", "q40"],
    });
  }

  // R13 · Sensibilidade a perfumes fortes (#33)
  if (r.q33 === "dor-cabeca" || r.q33 === "incomoda-pouco") {
    const forte = r.q33 === "dor-cabeca";
    if (forte && (intensidade ?? 0) >= 4) conflitos.push("Pede intensidade alta (#28) mas relata dor de cabeça com perfumes fortes (#33). Conversar antes de formular.");
    add({
      codigo: "R13", nome: "Sensibilidade a perfumes fortes", gatilho: `#33 = ${rotuloDaOpcao("q33", r.q33 as string)}`,
      efeito: forte ? "Limitar projeção e evitar materiais muito difusivos." : "Moderar a projeção.",
      tipo: "restricao", evidencia: "declarada", origens: ["q33"],
    });
  }

  // R14 a R16 · Restrições éticas ou religiosas (#34)
  const q34 = arr(r.q34);
  let base: Direcao["base"] = { tipo: "alcoolica", motivo: "Padrão: base hidroalcoólica." };
  if (q34.includes("alcool")) {
    base = { tipo: "oleosa", motivo: "#34: evita álcool. Base oleosa obrigatória (decisão de 02/11/2026)." };
    if ((intensidade ?? 0) >= 4) conflitos.push("Base oleosa projeta menos. Avisar que a intensidade pedida (#28) fica mais perto da pele.");
    add({
      codigo: "R14", nome: "Sem álcool", gatilho: "#34 = Álcool",
      efeito: "Base oleosa obrigatória. Concentração a definir com o perfumista.",
      tipo: "restricao", evidencia: "declarada", origens: ["q34"],
    });
  }
  if (q34.includes("sinteticos")) {
    add({
      codigo: "R15", nome: "Sem sintéticos", gatilho: "#34 = Sintéticos em geral",
      efeito: "Modalidade Essencial bloqueada. Só linha Atelier, com fórmula natural.",
      tipo: "restricao", evidencia: "declarada", origens: ["q34"],
    });
  }
  if (q34.includes("origem-animal") || q34.includes("testados-animais")) {
    add({
      codigo: "R16", nome: "Restrições de origem e teste",
      gatilho: `#34 = ${rotulos("q34", q34.filter((x) => x === "origem-animal" || x === "testados-animais"))}`,
      efeito: "O catálogo atual é todo vegetal. Exigir do fornecedor declaração de origem e de ausência de testes em animais.",
      tipo: "restricao", evidencia: "declarada", origens: ["q34"],
    });
  }

  // R17 · Alergias (#31, #32)
  if (r.q31 === "sim" || r.q31 === "nao-sei") {
    add({
      codigo: "R17", nome: "Alergia ou sensibilidade", gatilho: `#31 = ${rotuloDaOpcao("q31", r.q31 as string)}`,
      efeito: "Revisão de alergênicos obrigatória, lote a lote. O texto da #32 vai para leitura humana.",
      tipo: "seguranca", evidencia: "declarada", origens: ["q31", "q32"],
    });
  }

  // R18 · Gestação (#41)
  if (r.q41 === "sim") {
    add({
      codigo: "R18", nome: "Gestação ou amamentação", gatilho: "#41 = Sim",
      efeito: "Modo cautela: revisão por perfumista ou toxicologista. A lista de cautelas por matéria-prima ainda é lacuna. Nunca anunciar o produto como indicado para gestantes.",
      tipo: "seguranca", evidencia: "declarada", origens: ["q41"],
    });
  }

  // R19 · Mudanças hormonais e medicação (#42)
  if (r.q42 === "hormonal" || r.q42 === "medicamento" || r.q42 === "as-duas") {
    add({
      codigo: "R19", nome: "Contexto hormonal ou medicação", gatilho: `#42 = ${rotuloDaOpcao("q42", r.q42 as string)}`,
      efeito: "Registrado como contexto para o perfumista. Sem ajuste automático.",
      tipo: "seguranca", evidencia: "fraca", origens: ["q42"],
    });
  }

  // R20 · Ocasiões (#26)
  const q26 = arr(r.q26);
  if (q26.length) {
    const efeitos: string[] = [];
    if (q26.includes("treino")) { pesos.frescos += 0.3; efeitos.push("frescos +0,3"); }
    if (q26.includes("encontros")) { pesos.florais += 0.15; pesos.doces += 0.15; efeitos.push("florais e doces +0,15"); }
    if (q26.includes("noite")) { pesos.quentes += 0.2; efeitos.push("quentes +0,2"); }
    if (q26.includes("trabalho")) efeitos.push("projeção moderada no dia a dia");
    if (q26.includes("eventos")) efeitos.push("permite mais presença");
    add({
      codigo: "R20", nome: "Ocasiões de uso", gatilho: `#26 = ${rotulos("q26", q26)}`,
      efeito: efeitos.join("; ") + ".", tipo: "ajuste", evidencia: "associacao", origens: ["q26"],
    });
  }

  // R21 · Sexo e gênero não filtram notas (decisão de projeto)
  if (r.q04 !== undefined || r.q05 !== undefined) {
    add({
      codigo: "R21", nome: "Sexo e gênero", gatilho: "#4 e/ou #5 respondidas",
      efeito: "Registrado sem efeito sobre notas. Decisão do projeto: gênero não filtra a paleta (manual, seção 3.3).",
      tipo: "informativa", evidencia: "declarada", origens: ["q04", "q05"],
    });
  }

  for (const g of GRUPOS) pesos[g] = Math.round(pesos[g] * 100) / 100;
  ajustes.fundo = Math.round(ajustes.fundo * 10) / 10;

  const nomeConc = conc ? CONCENTRACOES[conc].nome : "Indefinida";
  return {
    regras,
    direcao: {
      pesos,
      concentracao: { codigo: conc, nome: nomeConc, motivo: motivoConc },
      base,
      ajustes,
      conflitos,
      alertas,
    },
    mencoes,
    lacunas,
    bonusMaterias,
    exclusoes,
  };
}
