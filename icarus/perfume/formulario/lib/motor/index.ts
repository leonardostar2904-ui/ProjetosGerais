import { VERSAO_CATALOGO } from "../conhecimento/materias-primas";
import { perguntas, VERSAO_QUESTIONARIO } from "../questionario/perguntas";
import { respostasValidas } from "../questionario/progresso";
import type { Respostas } from "../questionario/tipos";
import { selecionarCandidatas } from "./candidatas";
import { avaliarComercial } from "./comercial";
import { aplicarRegras } from "./regras";
import { calcularTracos } from "./tracos";
import { VERSAO_MOTOR, VERSAO_REGRAS, type ItemFilaIA, type ResultadoCruzamento } from "./tipos";

// Motor de cruzamento v0.1. Determinístico: mesmas respostas, mesmo resultado.
// Cruza as respostas (Banco 01) com perfil (02), inteligência olfativa (03), matérias-primas (04)
// e comercial (06). Formulação (05) e aprendizado (07) ficam registrados como não implementados.

const ALIMENTA: Record<string, string> = {
  q07: "Contexto de rotina para o perfumista",
  q12: "P009 Busca por autenticidade",
  q13: "P007 Expressividade e P009 Autenticidade",
  q18: "P007 Expressividade emocional",
  q20: "Exclusões (lidas por palavra-chave na R06; sentido completo pela IA)",
  q21: "Memórias olfativas (R05 por palavra-chave; sentido completo pela IA)",
  q22: "Memórias olfativas (R05 por palavra-chave; sentido completo pela IA)",
  q30: "Perfumes de referência (Banco 03)",
  q47: "Embalagem e entrega (Banco 06)",
  q48: "P011 Como recebe afeto",
  q50: "P001 Busca por reconhecimento",
  q51: "P006 Segurança emocional",
  q52: "Narrativa da fragrância",
};

export function cruzar(respostasBrutas: Respostas): ResultadoCruzamento {
  const r = respostasValidas(respostasBrutas);
  const saida = aplicarRegras(r);

  const filaIA: ItemFilaIA[] = perguntas
    .filter((p) => (p.tipo === "texto-longo" || p.tipo === "tres-palavras") && !p.sensivel && r[p.id] !== undefined)
    .map((p) => {
      const v = r[p.id];
      const texto = Array.isArray(v) ? v.join(" ") : String(v ?? "");
      return { perguntaId: p.id, numero: p.numero, alimenta: ALIMENTA[p.id] ?? "Contexto", caracteres: texto.trim().length };
    });

  const pendencias = [
    "Fórmula: depende da IA de formulação e da validação de um perfumista (ainda não implementadas).",
    ...(r.q31 === "sim" || r.q31 === "nao-sei" ? ["Alergias: a #32 é dado de saúde e vai para leitura humana (perfumista), nunca para a IA."] : []),
    ...(r.q41 === "sim" ? ["Gestação: revisão de segurança obrigatória; lista de cautelas por matéria-prima ainda é lacuna."] : []),
    ...(saida.direcao.conflitos.length ? ["Conflitos de preferência: conversar com a pessoa antes de formular."] : []),
    ...(filaIA.length ? [`Textos livres: ${filaIA.length} respostas aguardam leitura de sentido pela IA.`] : []),
  ];

  return {
    versoes: { motor: VERSAO_MOTOR, regras: VERSAO_REGRAS, catalogo: VERSAO_CATALOGO, questionario: VERSAO_QUESTIONARIO },
    geradoEm: new Date().toISOString(),
    perfil: calcularTracos(r),
    regras: saida.regras,
    direcao: saida.direcao,
    mencoes: saida.mencoes,
    candidatas: selecionarCandidatas(saida),
    lacunas: saida.lacunas,
    comercial: avaliarComercial(r),
    filaIA,
    pendencias,
    formulacao: {
      status: "nao_gerada",
      motivo: "Nesta versão não existe IA de formulação nem perfumista conectado. Nenhuma nota ou proporção é inventada.",
    },
    aprendizado: {
      status: "sem_avaliacoes",
      motivo: "As avaliações acontecem depois da entrega do perfume (7 e 30 dias).",
    },
  };
}
