// Armazenamento local do MVP. A estrutura espelha as tabelas do banco (db/schema.sql):
// consumidores, consumidores_contato, sessoes, respostas, dados_sensiveis e consentimentos.
// O navegador guarda o rascunho enquanto a pessoa responde (localStorage). Ao concluir, a sessão vai
// para o servidor (/api/criacao), que grava no Supabase e devolve a leitura da IA.

import { perguntas, perguntaPorId, VERSAO_QUESTIONARIO } from "./questionario/perguntas";
import { aplicavel, respondida } from "./questionario/progresso";
import type { Pergunta, Respostas, Valor } from "./questionario/tipos";
import type { Criacao } from "./criacao/tipos";

export const CHAVE_ARMAZENAMENTO = "icarus-olfactory-experience-v1";
const CHAVE = CHAVE_ARMAZENAMENTO;
const VERSAO_ESQUEMA = 1;

export type StatusResposta = "respondida" | "pulada";

export type RegistroResposta = {
  perguntaId: string;
  valor: Valor | null;
  status: StatusResposta;
  atualizadaEm: string;
};

export type Sessao = {
  id: string;
  consumidorId: string;
  questionarioVersao: string;
  status: "em_andamento" | "concluida";
  iniciadaEm: string;
  concluidaEm?: string;
  capituloAtual: number;
  capitulosConcluidos: number[];
};

export type Consentimento = {
  id: string;
  sessaoId: string;
  tipo: "uso_respostas_criacao";
  versaoTexto: string;
  texto: string;
  aceitoEm: string;
};

export type Banco = {
  versaoEsquema: number;
  consumidores: { id: string; criadoEm: string }[];
  /** Nome fica separado das respostas usadas pela IA (Banco 01). */
  contato: { consumidorId: string; nome: string; atualizadoEm: string }[];
  sessoes: Sessao[];
  respostas: Record<string, Record<string, RegistroResposta>>;
  /** Dados pessoais e de saúde ficam numa tabela à parte, com acesso restrito no banco real. */
  dadosSensiveis: Record<string, Record<string, RegistroResposta>>;
  consentimentos: Consentimento[];
  /** Leitura feita pela IA, por sessão (cópia local do que o servidor devolveu). */
  criacoes: Record<string, CriacaoLocal>;
  sessaoAtualId: string | null;
};

export const TEXTO_CONSENTIMENTO = {
  versao: "c1-2026-11",
  texto:
    "Autorizo a ICARUS a usar minhas respostas, inclusive as informações pessoais e de saúde que escolhi informar, para criar a minha fragrância. Posso pedir a exclusão dos meus dados quando quiser.",
};

function agora(): string {
  return new Date().toISOString();
}

function novoId(prefixo: string): string {
  const aleatorio =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefixo}_${aleatorio}`;
}

export function bancoVazio(): Banco {
  return {
    versaoEsquema: VERSAO_ESQUEMA,
    consumidores: [],
    contato: [],
    sessoes: [],
    respostas: {},
    dadosSensiveis: {},
    consentimentos: [],
    criacoes: {},
    sessaoAtualId: null,
  };
}

export function carregarBanco(): Banco {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return bancoVazio();
    const b = JSON.parse(bruto) as Banco;
    if (!b || b.versaoEsquema !== VERSAO_ESQUEMA || !Array.isArray(b.sessoes)) return bancoVazio();
    return { ...bancoVazio(), ...b };
  } catch {
    return bancoVazio();
  }
}

export function salvarBanco(b: Banco): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(b));
  } catch {
    // Navegação privada ou armazenamento cheio: a experiência continua só em memória.
  }
}

export function apagarBanco(): void {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* ignora */
  }
}

/** A leitura guardada no navegador, com a indicação de que o servidor também guardou. */
export type CriacaoLocal = Criacao & { persistido?: boolean };

export function guardarCriacao(b: Banco, sessaoId: string, criacao: Criacao, persistido: boolean): Banco {
  return { ...b, criacoes: { ...b.criacoes, [sessaoId]: { ...criacao, persistido } } };
}

export function criacaoDaSessao(b: Banco, sessaoId: string | null): CriacaoLocal | null {
  return sessaoId ? b.criacoes?.[sessaoId] ?? null : null;
}

export function sessaoAtual(b: Banco): Sessao | null {
  return b.sessoes.find((s) => s.id === b.sessaoAtualId) ?? null;
}

/** Cria consumidor anônimo e sessão nova, e torna a sessão nova a atual. */
export function iniciarSessao(b: Banco): Banco {
  const consumidorId = novoId("cons");
  const sessao: Sessao = {
    id: novoId("sess"),
    consumidorId,
    questionarioVersao: VERSAO_QUESTIONARIO,
    status: "em_andamento",
    iniciadaEm: agora(),
    capituloAtual: 1,
    capitulosConcluidos: [],
  };
  return {
    ...b,
    consumidores: [...b.consumidores, { id: consumidorId, criadoEm: agora() }],
    sessoes: [...b.sessoes, sessao],
    respostas: { ...b.respostas, [sessao.id]: {} },
    dadosSensiveis: { ...b.dadosSensiveis, [sessao.id]: {} },
    sessaoAtualId: sessao.id,
  };
}

export function garantirSessao(b: Banco): Banco {
  const s = sessaoAtual(b);
  if (s && s.status === "em_andamento") return b;
  return iniciarSessao(b);
}

function tabelaDe(p: Pergunta): "respostas" | "dadosSensiveis" | "contato" {
  if (p.destino === "dados_sensiveis") return "dadosSensiveis";
  if (p.destino === "contato") return "contato";
  return "respostas";
}

/** Grava (ou apaga, se vazia) a resposta na tabela certa para o destino da pergunta. */
export function registrarResposta(b: Banco, sessaoId: string, perguntaId: string, valor: Valor | undefined): Banco {
  const p = perguntaPorId(perguntaId);
  const sessao = b.sessoes.find((s) => s.id === sessaoId);
  if (!sessao) return b;
  const preenchida = respondida(p, valor);
  const tabela = tabelaDe(p);

  if (tabela === "contato") {
    const nome = preenchida && typeof valor === "string" ? valor.trim() : "";
    const outros = b.contato.filter((c) => c.consumidorId !== sessao.consumidorId);
    return {
      ...b,
      contato: nome ? [...outros, { consumidorId: sessao.consumidorId, nome: valor as string, atualizadoEm: agora() }] : outros,
    };
  }

  const atual = { ...(b[tabela][sessaoId] ?? {}) };
  if (preenchida) {
    atual[perguntaId] = { perguntaId, valor: valor as Valor, status: "respondida", atualizadaEm: agora() };
  } else {
    // Campo apagado ou escolha desmarcada: sem resposta. "Pulada" só é marcada ao sair do capítulo.
    delete atual[perguntaId];
  }
  return limparCondicionaisInvalidas({ ...b, [tabela]: { ...b[tabela], [sessaoId]: atual } }, sessaoId);
}

/**
 * Quando a condição de uma pergunta deixa de valer (ex.: a 31 muda para "Não"), a resposta dela é apagada.
 * Assim nenhum dado escondido (alergia, gestação) fica guardado, exportado ou enviado para leitura.
 */
function limparCondicionaisInvalidas(b: Banco, sessaoId: string): Banco {
  const r = respostasDaSessao(b, sessaoId);
  let novo = b;
  for (const p of perguntas) {
    if (!p.condicao || aplicavel(p, r)) continue;
    const tabela = tabelaDe(p);
    if (tabela === "contato") continue;
    if (!novo[tabela][sessaoId]?.[p.id]) continue;
    const atual = { ...novo[tabela][sessaoId] };
    delete atual[p.id];
    novo = { ...novo, [tabela]: { ...novo[tabela], [sessaoId]: atual } };
  }
  return novo;
}

/** Dados de uma sessão no formato das tabelas, só com perguntas que se aplicam. Usado nos dois botões de baixar. */
export function exportarSessao(b: Banco, sessaoId: string) {
  const sessao = b.sessoes.find((s) => s.id === sessaoId) ?? null;
  const r = respostasDaSessao(b, sessaoId);
  const aplicaveis = (registros: RegistroResposta[]) =>
    registros.filter((x) => {
      const p = perguntas.find((q) => q.id === x.perguntaId);
      return p ? aplicavel(p, r) : false;
    });
  return {
    exportadoEm: agora(),
    sessao,
    contato: sessao ? b.contato.find((c) => c.consumidorId === sessao.consumidorId) ?? null : null,
    respostas: aplicaveis(Object.values(b.respostas[sessaoId] ?? {})),
    dadosSensiveis: aplicaveis(Object.values(b.dadosSensiveis[sessaoId] ?? {})),
    consentimento: b.consentimentos.find((c) => c.sessaoId === sessaoId) ?? null,
  };
}

/** Junta as três tabelas num mapa simples para a interface. */
export function respostasDaSessao(b: Banco, sessaoId: string | null): Respostas {
  if (!sessaoId) return {};
  const sessao = b.sessoes.find((s) => s.id === sessaoId);
  const out: Respostas = {};
  for (const tabela of ["respostas", "dadosSensiveis"] as const) {
    for (const r of Object.values(b[tabela][sessaoId] ?? {})) {
      if (r.valor !== null) out[r.perguntaId] = r.valor;
    }
  }
  const contato = sessao ? b.contato.find((c) => c.consumidorId === sessao.consumidorId) : undefined;
  if (contato) out.q02 = contato.nome;
  return out;
}

/** Ao sair de um capítulo, as opcionais aplicáveis em branco ficam registradas como puladas. */
export function marcarPuladas(b: Banco, sessaoId: string, capitulo: number): Banco {
  const r = respostasDaSessao(b, sessaoId);
  let novo = b;
  for (const p of perguntas.filter((x) => x.capitulo === capitulo)) {
    if (p.obrigatoria || p.destino === "contato" || !aplicavel(p, r) || respondida(p, r[p.id])) continue;
    const tabela = tabelaDe(p) as "respostas" | "dadosSensiveis";
    const atual = { ...(novo[tabela][sessaoId] ?? {}) };
    atual[p.id] = { perguntaId: p.id, valor: null, status: "pulada", atualizadaEm: agora() };
    novo = { ...novo, [tabela]: { ...novo[tabela], [sessaoId]: atual } };
  }
  return novo;
}

export function statusDaPergunta(b: Banco, sessaoId: string | null, perguntaId: string): StatusResposta | null {
  if (!sessaoId) return null;
  return b.respostas[sessaoId]?.[perguntaId]?.status ?? b.dadosSensiveis[sessaoId]?.[perguntaId]?.status ?? null;
}

export function atualizarSessao(b: Banco, sessaoId: string, mudanca: Partial<Sessao>): Banco {
  return { ...b, sessoes: b.sessoes.map((s) => (s.id === sessaoId ? { ...s, ...mudanca } : s)) };
}

export function concluirSessao(b: Banco, sessaoId: string): Banco {
  const consentimento: Consentimento = {
    id: novoId("cons-uso"),
    sessaoId,
    tipo: "uso_respostas_criacao",
    versaoTexto: TEXTO_CONSENTIMENTO.versao,
    texto: TEXTO_CONSENTIMENTO.texto,
    aceitoEm: agora(),
  };
  const comConsentimento = {
    ...b,
    consentimentos: [...b.consentimentos.filter((c) => c.sessaoId !== sessaoId), consentimento],
  };
  return atualizarSessao(comConsentimento, sessaoId, {
    status: "concluida",
    concluidaEm: agora(),
    capituloAtual: 10,
    capitulosConcluidos: Array.from({ length: 10 }, (_, i) => i + 1),
  });
}
