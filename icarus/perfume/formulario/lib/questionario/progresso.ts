import { capitulos } from "./capitulos";
import { perguntas } from "./perguntas";
import type { Pergunta, Respostas, Valor } from "./tipos";

// Regras de progresso. Princípio: o número mostrado nunca é maior do que o real.
// - Uma pergunta condicional que não está visível não conta no total (não é abandono).
// - Uma pergunta pulada continua fora do "respondidas".

function lista(v: Valor | undefined): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") return [v];
  return [];
}

export function aplicavel(p: Pergunta, r: Respostas): boolean {
  const c = p.condicao;
  if (!c) return true;
  const resposta = lista(r[c.pergunta]);
  if ("em" in c) return resposta.some((x) => c.em.includes(x));
  return !resposta.some((x) => c.naoEm.includes(x));
}

export function respondida(p: Pergunta, v: Valor | undefined): boolean {
  if (v === undefined || v === null) return false;
  switch (p.tipo) {
    case "texto-curto":
    case "texto-longo":
      return typeof v === "string" && v.trim().length > 0;
    case "tres-palavras":
      return Array.isArray(v) && v.some((x) => x.trim().length > 0);
    case "escolha-unica":
      return typeof v === "string" && !!p.opcoes?.some((o) => o.valor === v);
    case "escolha-multipla":
      return Array.isArray(v) && v.length > 0;
    case "escala":
      return typeof v === "number" && v >= 1 && v <= 5;
  }
}

export function perguntasDoCapitulo(numero: number): Pergunta[] {
  return perguntas.filter((p) => p.capitulo === numero);
}

/** Respostas que valem para o registro: só as perguntas aplicáveis e respondidas. */
export function respostasValidas(r: Respostas): Respostas {
  const out: Respostas = {};
  for (const p of perguntas) {
    if (aplicavel(p, r) && respondida(p, r[p.id])) out[p.id] = r[p.id];
  }
  return out;
}

export type EstadoCapitulo = {
  aplicaveis: Pergunta[];
  respondidas: number;
  obrigatoriasFaltando: Pergunta[];
  opcionaisEmBranco: Pergunta[];
  completo: boolean;
};

export function estadoCapitulo(numero: number, r: Respostas): EstadoCapitulo {
  const aplicaveis = perguntasDoCapitulo(numero).filter((p) => aplicavel(p, r));
  const respondidas = aplicaveis.filter((p) => respondida(p, r[p.id])).length;
  const obrigatoriasFaltando = aplicaveis.filter((p) => p.obrigatoria && !respondida(p, r[p.id]));
  const opcionaisEmBranco = aplicaveis.filter((p) => !p.obrigatoria && !respondida(p, r[p.id]));
  return {
    aplicaveis,
    respondidas,
    obrigatoriasFaltando,
    opcionaisEmBranco,
    completo: obrigatoriasFaltando.length === 0,
  };
}

export type ProgressoGeral = {
  possiveis: number;
  aplicaveis: number;
  respondidas: number;
  /** Percentual inteiro, arredondado para baixo: nunca exagera o avanço. */
  percentual: number;
  naoAplicaveis: number;
};

export function progressoGeral(r: Respostas): ProgressoGeral {
  const aplicaveisLista = perguntas.filter((p) => aplicavel(p, r));
  const respondidas = aplicaveisLista.filter((p) => respondida(p, r[p.id])).length;
  const aplicaveis = aplicaveisLista.length;
  return {
    possiveis: perguntas.length,
    aplicaveis,
    respondidas,
    percentual: aplicaveis ? Math.floor((respondidas / aplicaveis) * 100) : 0,
    naoAplicaveis: perguntas.length - aplicaveis,
  };
}

/** Garante que os números das perguntas dos capítulos cobrem 1 a 52, em ordem, sem buracos. */
export function validarEstrutura(): string[] {
  const erros: string[] = [];
  const nums = capitulos.flatMap((c) => c.perguntas);
  perguntas.forEach((p, i) => {
    if (p.numero !== i + 1) erros.push(`Pergunta fora de ordem: ${p.id}`);
    if (p.id !== `q${String(p.numero).padStart(2, "0")}`) erros.push(`Id inconsistente: ${p.id}`);
    const cap = capitulos.find((c) => c.perguntas.includes(p.numero));
    if (!cap || cap.numero !== p.capitulo) erros.push(`Capítulo inconsistente: ${p.id}`);
    if ((p.tipo === "escolha-unica" || p.tipo === "escolha-multipla") && !p.opcoes?.length) {
      erros.push(`Sem opções: ${p.id}`);
    }
    if (p.opcoes && (p.opcoes.length < 3 || p.opcoes.length > 5)) erros.push(`Opções fora de 3 a 5: ${p.id}`);
  });
  if (nums.length !== perguntas.length) erros.push("Capítulos não cobrem todas as perguntas");
  return erros;
}
