import "server-only";
import { z } from "zod";
import { TEXTO_CONSENTIMENTO } from "../armazenamento";
import { perguntas, VERSAO_QUESTIONARIO } from "../questionario/perguntas";
import { estadoCapitulo, respondida, respostasValidas } from "../questionario/progresso";
import type { Pergunta, Respostas, Valor } from "../questionario/tipos";

// Validação do que o navegador envia para /api/criacao (o mesmo formato de exportarSessao).
// O servidor não confia no navegador: confere ids, tipos, códigos de opção, limites, condicionais,
// obrigatórias e consentimento, e só então devolve as respostas limpas.

const LIMITE_TEXTO = 3000;
const LIMITE_NOME = 80;

const Registro = z.object({
  perguntaId: z.string().regex(/^q\d{2}$/),
  valor: z.union([z.string(), z.number(), z.array(z.string()), z.null()]),
  status: z.enum(["respondida", "pulada"]),
  atualizadaEm: z.string().optional(),
});

const Pedido = z.object({
  sessao: z.object({
    id: z.string().regex(/^sess_[A-Za-z0-9-]{8,64}$/),
    consumidorId: z.string().regex(/^cons_[A-Za-z0-9-]{8,64}$/),
    questionarioVersao: z.literal(VERSAO_QUESTIONARIO),
    status: z.literal("concluida"),
    iniciadaEm: z.string(),
    concluidaEm: z.string(),
  }),
  contato: z.object({ nome: z.string() }).nullable(),
  respostas: z.array(Registro).max(60),
  dadosSensiveis: z.array(Registro).max(60),
  consentimento: z.object({
    id: z.string().regex(/^cons-uso_[A-Za-z0-9-]{8,64}$/),
    tipo: z.literal("uso_respostas_criacao"),
    versaoTexto: z.string(),
    aceitoEm: z.string(),
  }),
});

export type PedidoCriacao = {
  sessaoId: string;
  consumidorId: string;
  iniciadaEm: string;
  concluidaEm: string;
  nome: string | null;
  consentimento: { id: string; aceitoEm: string; versaoTexto: string };
  /** Todas as respostas aplicáveis e válidas (inclui sensíveis e o nome). Só o servidor usa este mapa inteiro. */
  respostas: Respostas;
  /** Ids das perguntas puladas (opcionais deixadas em branco), para o registro no banco. */
  puladas: string[];
};

function dataValida(s: string): string | null {
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

function limpar(p: Pergunta, v: Valor | null): Valor | undefined {
  if (v === null) return undefined;
  switch (p.tipo) {
    case "texto-curto":
    case "texto-longo":
      return typeof v === "string" && v.trim() ? v.slice(0, LIMITE_TEXTO) : undefined;
    case "tres-palavras":
      return Array.isArray(v) && v.length <= 3 ? v.map((x) => x.slice(0, 60)) : undefined;
    case "escala":
      return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 5 ? v : undefined;
    case "escolha-unica":
      return typeof v === "string" && p.opcoes?.some((o) => o.valor === v) ? v : undefined;
    case "escolha-multipla": {
      if (!Array.isArray(v) || v.length === 0) return undefined;
      const unicos = Array.from(new Set(v));
      if (unicos.length > (p.maxSelecoes ?? 1)) return undefined;
      if (!unicos.every((x) => p.opcoes?.some((o) => o.valor === x))) return undefined;
      const exclusiva = p.opcoes?.find((o) => o.exclusiva && unicos.includes(o.valor));
      if (exclusiva && unicos.length > 1) return undefined;
      return unicos;
    }
  }
}

export function validarPedido(corpo: unknown): { ok: true; pedido: PedidoCriacao } | { ok: false; motivo: string } {
  const lido = Pedido.safeParse(corpo);
  if (!lido.success) return { ok: false, motivo: "Formato do pedido inválido." };
  const d = lido.data;

  if (d.consentimento.versaoTexto !== TEXTO_CONSENTIMENTO.versao) {
    return { ok: false, motivo: "Versão do consentimento desconhecida." };
  }
  const iniciadaEm = dataValida(d.sessao.iniciadaEm);
  const concluidaEm = dataValida(d.sessao.concluidaEm);
  const aceitoEm = dataValida(d.consentimento.aceitoEm);
  if (!iniciadaEm || !concluidaEm || !aceitoEm || concluidaEm < iniciadaEm) return { ok: false, motivo: "Datas inválidas." };

  const brutas: Respostas = {};
  const puladas: string[] = [];
  const registros = [
    ...d.respostas.map((r) => ({ ...r, tabela: "respostas" as const })),
    ...d.dadosSensiveis.map((r) => ({ ...r, tabela: "dados_sensiveis" as const })),
  ];
  for (const reg of registros) {
    const p = perguntas.find((q) => q.id === reg.perguntaId);
    if (!p || p.destino !== reg.tabela) return { ok: false, motivo: `Pergunta fora do lugar: ${reg.perguntaId}.` };
    if (reg.status === "pulada") {
      if (p.obrigatoria) return { ok: false, motivo: `Obrigatória marcada como pulada: ${reg.perguntaId}.` };
      puladas.push(p.id);
      continue;
    }
    const v = limpar(p, reg.valor);
    if (v === undefined || !respondida(p, v)) return { ok: false, motivo: `Resposta inválida: ${reg.perguntaId}.` };
    brutas[p.id] = v;
  }

  const nome = d.contato?.nome.trim().slice(0, LIMITE_NOME) || null;
  if (nome) brutas.q02 = nome;

  const respostas = respostasValidas(brutas);
  for (let n = 1; n <= 10; n++) {
    if (estadoCapitulo(n, respostas).obrigatoriasFaltando.length) {
      return { ok: false, motivo: `Etapa ${n} com obrigatória em branco.` };
    }
  }

  return {
    ok: true,
    pedido: {
      sessaoId: d.sessao.id,
      consumidorId: d.sessao.consumidorId,
      iniciadaEm,
      concluidaEm,
      nome,
      consentimento: { id: d.consentimento.id, aceitoEm, versaoTexto: d.consentimento.versaoTexto },
      respostas,
      puladas: puladas.filter((id) => respostas[id] === undefined),
    },
  };
}
