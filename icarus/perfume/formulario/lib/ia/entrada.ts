import "server-only";
import type { ResultadoCruzamento } from "../motor/tipos";
import { perguntas, rotuloDaOpcao } from "../questionario/perguntas";
import type { Respostas } from "../questionario/tipos";

// O que a IA recebe. Princípio de minimização:
// - Só perguntas com destino "respostas" (a mesma regra da visão vw_respostas_ia do banco).
//   Nunca o nome (contato) e nunca dados_sensiveis: a pergunta 32 (texto de saúde) não sai do servidor.
// - Do motor, só a parte operacional (direção, candidatas, exclusões, lacunas, comercial).
//   As regras disparadas por respostas sensíveis viram restrições genéricas, sem dizer de onde vieram.
// - Pontuações de perfil (P001 a P012) não vão: a IA lê as respostas, não um rótulo psicológico.

const PERGUNTAS_SENSIVEIS = new Set(perguntas.filter((p) => p.destino !== "respostas").map((p) => p.id));

export type EntradaIA = {
  respostas: { numero: number; pergunta: string; resposta: string }[];
  restricoes: string[];
  motor: {
    versoes: ResultadoCruzamento["versoes"];
    pesosFamilias: ResultadoCruzamento["direcao"]["pesos"];
    concentracaoSugerida: { codigo: string | null; nome: string };
    base: "alcoolica" | "oleosa";
    ajustes: ResultadoCruzamento["direcao"]["ajustes"];
    conflitos: string[];
    alertas: string[];
    regras: { codigo: string; nome: string; efeito: string }[];
    candidatas: Record<"topo" | "coracao" | "fundo" | "citadas", { n: number; nome: string; pontuacao: number; sinais: string[] }[]>;
    excluidas: { n: number; nome: string; motivo: string }[];
    mencoes: { pergunta: number; termo: string; uso: string; materias: number[] }[];
    lacunas: string[];
    comercial: { hipotese: string; modalidades: { nome: string; preco: number; compativel: boolean }[] };
  };
};

function textoResposta(id: string, r: Respostas): string {
  const v = r[id];
  if (v === undefined) return "";
  const p = perguntas.find((q) => q.id === id)!;
  if (p.tipo === "escala") return `${v} de 5 (1 = ${p.escala?.min}, 5 = ${p.escala?.max})`;
  if (p.tipo === "escolha-unica") return rotuloDaOpcao(id, v as string);
  if (p.tipo === "escolha-multipla") return (v as string[]).map((x) => rotuloDaOpcao(id, x)).join("; ");
  if (p.tipo === "tres-palavras") return (v as string[]).filter((x) => x.trim()).join(", ");
  return String(v);
}

/** Restrições que vêm de respostas sensíveis, sem revelar a resposta. */
function restricoesDe(r: Respostas): string[] {
  const out: string[] = [];
  const q34 = Array.isArray(r.q34) ? r.q34 : [];
  if (q34.includes("alcool")) out.push("Base oleosa obrigatória (sem álcool).");
  if (q34.includes("sinteticos")) out.push("Sem sintéticos: só linha Atelier, fórmula 100% natural.");
  if (q34.includes("origem-animal") || q34.includes("testados-animais")) {
    out.push("Sem matérias-primas de origem animal; fornecedores com declaração de ausência de testes em animais.");
  }
  if (r.q31 === "sim" || r.q31 === "nao-sei" || r.q41 === "sim" || ["hormonal", "medicamento", "as-duas"].includes(String(r.q42))) {
    out.push("Revisão de segurança humana obrigatória antes de qualquer produção (motivo reservado à equipe). Prefira matérias com menos alergênicos de rotulagem quando houver alternativa equivalente.");
  }
  return out;
}

export function montarEntrada(r: Respostas, cruzamento: ResultadoCruzamento): EntradaIA {
  const respostas = perguntas
    .filter((p) => !PERGUNTAS_SENSIVEIS.has(p.id) && r[p.id] !== undefined)
    .map((p) => ({ numero: p.numero, pergunta: p.enunciado, resposta: textoResposta(p.id, r) }))
    .filter((x) => x.resposta.trim());

  const enxuta = (c: ResultadoCruzamento["candidatas"]["topo"]) =>
    c.slice(0, 8).map((x) => ({ n: x.n, nome: x.nome, pontuacao: Math.round(x.pontuacao * 10) / 10, sinais: x.sinais }));

  return {
    respostas,
    restricoes: restricoesDe(r),
    motor: {
      versoes: cruzamento.versoes,
      pesosFamilias: cruzamento.direcao.pesos,
      concentracaoSugerida: { codigo: cruzamento.direcao.concentracao.codigo, nome: cruzamento.direcao.concentracao.nome },
      base: cruzamento.direcao.base.tipo,
      ajustes: cruzamento.direcao.ajustes,
      conflitos: cruzamento.direcao.conflitos,
      alertas: cruzamento.direcao.alertas,
      regras: cruzamento.regras
        .filter((x) => !x.origens.some((o) => PERGUNTAS_SENSIVEIS.has(o)))
        .map((x) => ({ codigo: x.codigo, nome: x.nome, efeito: x.efeito })),
      candidatas: {
        topo: enxuta(cruzamento.candidatas.topo),
        coracao: enxuta(cruzamento.candidatas.coracao),
        fundo: enxuta(cruzamento.candidatas.fundo),
        citadas: enxuta(cruzamento.candidatas.citadas),
      },
      excluidas: cruzamento.candidatas.excluidas,
      mencoes: cruzamento.mencoes
        .filter((m) => !PERGUNTAS_SENSIVEIS.has(m.perguntaId))
        .map((m) => ({ pergunta: Number(m.perguntaId.slice(1)), termo: m.termo, uso: m.uso, materias: m.materias })),
      lacunas: cruzamento.lacunas.map((l) => l.texto),
      comercial: {
        hipotese: cruzamento.comercial.hipotese,
        modalidades: cruzamento.comercial.modalidades.map((m) => ({ nome: m.nome, preco: m.preco, compativel: m.compativel })),
      },
    },
  };
}
