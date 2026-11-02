import { rotuloDaOpcao } from "../questionario/perguntas";
import type { Respostas } from "../questionario/tipos";
import type { Traco } from "./tipos";

// Banco 02. Indicadores de PREFERÊNCIAS DECLARADAS, não diagnóstico psicológico.
// Escalas 1 a 5 viram 0 a 10. Pesos são heurística v0, a calibrar com dados reais.
// Traços que dependem de texto livre ficam "aguarda_ia": nenhuma pontuação é inventada.

const esc = (v: unknown): number | null => (typeof v === "number" ? (v - 1) * 2.5 : null);
const arr = (v: unknown): string[] => (Array.isArray(v) ? v : []);
const temTexto = (v: unknown) => (typeof v === "string" && v.trim().length > 0) || (Array.isArray(v) && v.some((x) => String(x).trim()));
const media = (xs: (number | null)[]) => {
  const ok = xs.filter((x): x is number => x !== null);
  return ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : null;
};
const limitar = (x: number) => Math.max(0, Math.min(10, x));
const um = (x: number | null) => (x === null ? null : Math.round(x * 10) / 10);

function mediaMapa(valores: string[], mapa: Record<string, number>): number | null {
  return media(valores.map((v) => (v in mapa ? mapa[v] : null)));
}

function aguardaIA(codigo: string, nome: string, ids: string[], r: Respostas, categoria = false): Traco {
  const comTexto = ids.filter((id) => temTexto(r[id]));
  return {
    codigo, nome,
    tipo: categoria ? "categoria" : "escala-0-10",
    valor: null,
    status: comTexto.length ? "aguarda_ia" : "sem_dados",
    metodo: comTexto.length
      ? "Depende da leitura de texto livre pela IA, ainda não implementada. Nenhum valor é atribuído."
      : "Sem texto respondido para esta leitura.",
    origens: ids.map((id) => ({ perguntaId: id, papel: comTexto.includes(id) ? "texto na fila da IA" : "não respondida" })),
  };
}

export function calcularTracos(r: Respostas): Traco[] {
  const q01 = arr(r.q01), q15 = arr(r.q15), q16 = arr(r.q16), q23 = arr(r.q23), q44 = arr(r.q44), q49 = arr(r.q49);

  const p001 = esc(r.q10);
  const p002base = esc(r.q45);
  const p002 = p002base === null ? null : limitar(0.75 * p002base + (q01.includes("cheiro-unico") ? 2.5 : 0));
  const inv = (v: unknown) => {
    const e = esc(v);
    return e === null ? null : 10 - e;
  };
  const p003 = media([inv(r.q08), inv(r.q10)]);
  const p004 = media([esc(r.q09), esc(r.q11)]);
  const c14 = typeof r.q14 === "string" ? ({ "poucos-proximos": 4, "grupo-medio": 6.5, "muita-gente": 9 } as Record<string, number>)[r.q14] ?? null : null;
  const c16 = mediaMapa(q16, { anima: 9, escuta: 6, organiza: 7.5, observa: 4, junta: 10 });
  const c15 = mediaMapa(q15, { festa: 9, conversa: 7.5, "ar-livre": 6, cultura: 6, casa: 3 });
  const p005 = media([c14, c16, c15]);
  const s11 = esc(r.q11);
  const p008 = q44.length
    ? limitar(
        5 + (q44.includes("marca-status") ? 3 : 0) + (q44.includes("naturais") ? 1.5 : 0) +
          (q44.includes("cheiro-unico") ? 1 : 0) - (q44.includes("preco") ? 2 : 0) + (s11 !== null ? (s11 - 5) * 0.2 : 0),
      )
    : null;
  const p010 = media([
    mediaMapa(q15, { casa: 10, conversa: 8, cultura: 5, "ar-livre": 4, festa: 2 }),
    mediaMapa(q23, { casa: 10, mata: 6, praia: 5, cidade: 3, bares: 2 }),
  ]);

  const estado = (v: number | null, parcial = false): Traco["status"] => (v === null ? "sem_dados" : parcial ? "parcial" : "calculado");

  return [
    {
      codigo: "P001", nome: "Busca por reconhecimento", tipo: "escala-0-10", valor: um(p001),
      status: estado(p001, true),
      metodo: "Escala da #10 convertida para 0 a 10. Parcial: a #50 (como quer ser lembrado) aguarda IA.",
      origens: [{ perguntaId: "q10", papel: "escala" }, { perguntaId: "q50", papel: "texto na fila da IA" }],
    },
    {
      codigo: "P002", nome: "Necessidade de individualidade", tipo: "escala-0-10", valor: um(p002),
      status: estado(p002),
      metodo: "0,75 × escala da #45, mais 2,5 se a #1 inclui 'Ter um cheiro que ninguém mais tem'.",
      origens: [{ perguntaId: "q45", papel: "escala" }, { perguntaId: "q01", papel: "motivação" }],
    },
    {
      codigo: "P003", nome: "Preferência por discrição", tipo: "escala-0-10", valor: um(p003),
      status: estado(p003),
      metodo: "Média das escalas invertidas da #8 e da #10.",
      origens: [{ perguntaId: "q08", papel: "escala invertida" }, { perguntaId: "q10", papel: "escala invertida" }],
    },
    {
      codigo: "P004", nome: "Busca por experiências novas", tipo: "escala-0-10", valor: um(p004),
      status: estado(p004),
      metodo: "Média das escalas da #9 (improviso) e da #11 (moderno e ousado).",
      origens: [{ perguntaId: "q09", papel: "escala" }, { perguntaId: "q11", papel: "escala" }],
    },
    {
      codigo: "P005", nome: "Valorização de conexões sociais", tipo: "escala-0-10", valor: um(p005),
      status: estado(p005),
      metodo: "Média de pesos fixos para a roda (#14), o papel no grupo (#16) e o tipo de encontro (#15). Pesos v0.",
      origens: [{ perguntaId: "q14", papel: "escolha" }, { perguntaId: "q16", papel: "escolha" }, { perguntaId: "q15", papel: "escolha" }],
    },
    aguardaIA("P006", "Segurança emocional", ["q51"], r),
    aguardaIA("P007", "Expressividade emocional", ["q13", "q18"], r),
    {
      codigo: "P008", nome: "Valorização da sofisticação", tipo: "escala-0-10", valor: um(p008),
      status: estado(p008),
      metodo: "Base 5; +3 'Marca e status', +1,5 'Ingredientes naturais', +1 'Cheiro único', −2 'Preço' (#44); ajuste leve pela #11. Pesos v0.",
      origens: [{ perguntaId: "q44", papel: "escolha" }, { perguntaId: "q11", papel: "ajuste" }],
    },
    aguardaIA("P009", "Busca por autenticidade", ["q12", "q13"], r),
    {
      codigo: "P010", nome: "Preferência por ambientes acolhedores", tipo: "escala-0-10", valor: um(p010),
      status: estado(p010),
      metodo: "Média de pesos fixos para encontros (#15) e lugares (#23). Pesos v0.",
      origens: [{ perguntaId: "q15", papel: "escolha" }, { perguntaId: "q23", papel: "escolha" }],
    },
    aguardaIA("P011", "Como recebe afeto", ["q48"], r, true),
    {
      codigo: "P012", nome: "Como expressa afeto", tipo: "categoria", valor: null,
      categorias: q49.map((v) => rotuloDaOpcao("q49", v)),
      status: q49.length ? "calculado" : "sem_dados",
      metodo: "Leitura direta das opções escolhidas na #49.",
      origens: [{ perguntaId: "q49", papel: "escolha" }],
    },
  ];
}
