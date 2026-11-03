import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { BetaContentBlock, BetaMessage, BetaMessageParam, BetaToolResultBlockParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import type { Banco } from "../banco/servidor";
import { CONCENTRACOES } from "../conhecimento/referencias";
import { materiasPrimas } from "../conhecimento/materias-primas";
import type { CodigoErroCriacao, Criacao } from "../criacao/tipos";
import { configIA } from "./config";
import type { EntradaIA } from "./entrada";
import { criarFerramentas, ferramentaEntrega, type Entrega } from "./ferramentas";
import { LEMBRETE_ENTREGA, mensagemInicial, SISTEMA, VERSAO_PROMPT } from "./prompt";

// Laço da criação com a API do Claude.
// - Streaming em todas as chamadas (pedidos longos não estouram tempo de conexão).
// - Ferramentas: busca na web (servidor da Anthropic), consulta e registro de perfumes de referência
//   (nosso banco) e a entrega estruturada, que encerra o laço.
// - Recusa: o parâmetro fallbacks "default" faz a própria API tentar de novo no modelo recomendado.
//   Se ainda assim vier recusa, a criação termina com erro e a tela final segue sem a leitura.

const MAX_RODADAS = 10;
const MAX_LEMBRETES = 1;
const MATERIAS = new Map(materiasPrimas.map((m) => [m.n, m]));
const FAIXAS: Record<string, [number, number]> = { edt: [5, 15], edp: [15, 20], extrait: [20, 40] };

export type Uso = { entrada: number; saida: number };
export type SaidaCriacao =
  | { ok: true; criacao: Criacao; modelo: string; uso: Uso; registradas: string[] }
  | { ok: false; codigo: CodigoErroCriacao; mensagem: string; modelo: string; uso: Uso };

type Args = {
  entrada: EntradaIA;
  db: Banco | null;
  aoProgresso: (texto: string) => void;
  aoBuscar: (texto: string) => void;
};

/** Tira o travessão (regra da marca) dos textos que a pessoa lê. */
function semTravessao(s: string): string {
  return s.replace(/\s*—\s*/g, ", ").replace(/\s*–\s*/g, ", ").trim();
}

function montarCriacao(e: Entrega, entrada: EntradaIA, modelo: string, fontes: Criacao["fontes"], registradas: string[]): Criacao {
  const avisos: string[] = [];
  const u = e.usuario;
  const respondidas = new Set(entrada.respostas.map((r) => r.numero));

  const ordem = ["saida", "coracao", "fundo"] as const;
  const piramide = ordem
    .map((c) => u.piramide.find((p) => p.camada === c))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ camada: p.camada, titulo: semTravessao(p.titulo), texto: semTravessao(p.texto), notas: p.notas.map(semTravessao).filter(Boolean) }));
  if (piramide.length !== 3) avisos.push("A pirâmide para a pessoa veio incompleta.");

  const componentes = e.equipe.componentes.map((c) => {
    const n = c.materiaN === null ? null : Math.round(c.materiaN);
    const noCatalogo = n !== null && MATERIAS.has(n);
    if (n !== null && !noCatalogo) avisos.push(`Matéria #${n} (${c.nome}) não existe no catálogo; tratada como fora do catálogo.`);
    if (noCatalogo && MATERIAS.get(n!)!.flags.praticamenteInviavel) avisos.push(`#${n} ${c.nome} está marcada como praticamente inviável.`);
    return { ...c, materiaN: noCatalogo ? n : null, percentual: Math.round(c.percentual * 100) / 100 };
  });
  const soma = componentes.reduce((t, c) => t + c.percentual, 0);
  if (Math.abs(soma - 100) > 0.5) avisos.push(`Os componentes somam ${soma.toFixed(2)}% do concentrado; o perfumista precisa fechar em 100%.`);
  const excluidas = new Set(entrada.motor.excluidas.map((x) => x.n));
  for (const c of componentes) if (c.materiaN !== null && excluidas.has(c.materiaN)) avisos.push(`#${c.materiaN} ${c.nome} tinha sido excluída pelo motor.`);
  const faixa = FAIXAS[e.equipe.concentracao];
  if (faixa && (e.equipe.percentualConcentrado < faixa[0] || e.equipe.percentualConcentrado > faixa[1])) {
    avisos.push(`Concentrado de ${e.equipe.percentualConcentrado}% fora da faixa de ${CONCENTRACOES[e.equipe.concentracao].nome}.`);
  }
  if (entrada.restricoes.some((r) => r.startsWith("Base oleosa")) && e.equipe.base !== "oleosa") {
    avisos.push("A pessoa evita álcool e a proposta veio em base alcoólica: corrigir para oleosa.");
  }

  return {
    versaoPrompt: VERSAO_PROMPT,
    modelo,
    geradaEm: new Date().toISOString(),
    usuario: {
      titulo: semTravessao(u.titulo).replace(/^[A-ZÀ-Ú]/, (l) => l.toLowerCase()),
      abertura: u.abertura.map(semTravessao).filter(Boolean),
      piramide,
      concentracao: { nome: semTravessao(u.concentracao.nome), texto: semTravessao(u.concentracao.texto) },
      naPele: semTravessao(u.naPele),
      porque: u.porque
        .map((p) => ({ pergunta: Math.round(p.pergunta), texto: semTravessao(p.texto) }))
        .filter((p) => respondidas.has(p.pergunta))
        .slice(0, 5),
      fechamento: semTravessao(u.fechamento),
    },
    equipe: { ...e.equipe, componentes },
    fontes,
    referenciasRegistradas: registradas,
    avisos,
  };
}

function fontesDe(blocos: BetaContentBlock[]): Criacao["fontes"] {
  const out: Criacao["fontes"] = [];
  for (const b of blocos) {
    if (b.type !== "web_search_tool_result" || !Array.isArray(b.content)) continue;
    for (const r of b.content) if (r.type === "web_search_result") out.push({ titulo: r.title, url: r.url });
  }
  return out;
}

export async function criarComIA({ entrada, db, aoProgresso, aoBuscar }: Args): Promise<SaidaCriacao> {
  const cfg = configIA();
  const client = new Anthropic({ maxRetries: 2 });
  const ctx = { db, aoProgresso, registradas: [] as string[] };
  const { consultar, registrar } = criarFerramentas(ctx);
  const executaveis = { [consultar.name]: consultar, [registrar.name]: registrar };
  // Ordem fixa das ferramentas: mudar a ordem invalida o cache do prompt.
  const tools = [
    consultar,
    registrar,
    ferramentaEntrega,
    ...(cfg.buscasMax > 0 ? [{ type: "web_search_20260209" as const, name: "web_search" as const, max_uses: cfg.buscasMax }] : []),
  ];

  const messages: BetaMessageParam[] = [{ role: "user", content: mensagemInicial(entrada) }];
  const uso: Uso = { entrada: 0, saida: 0 };
  const fontes: Criacao["fontes"] = [];
  const sinal = AbortSignal.timeout(cfg.tempoMaxSegundos * 1000);
  let modelo = cfg.modelo;
  let lembretes = 0;
  let falhasJson = 0;

  const erro = (codigo: CodigoErroCriacao, mensagem: string): SaidaCriacao => ({ ok: false, codigo, mensagem, modelo, uso });

  for (let rodada = 0; rodada < MAX_RODADAS; rodada++) {
    const stream = client.beta.messages.stream(
      {
        model: cfg.modelo,
        max_tokens: 32000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        thinking: { type: "adaptive" },
        output_config: { effort: cfg.esforco },
        system: [{ type: "text", text: SISTEMA, cache_control: { type: "ephemeral" } }],
        tools,
        messages,
      },
      { signal: sinal },
    );
    stream.on("contentBlock", (b) => {
      if (b.type === "server_tool_use") {
        // A consulta pode ter nome de marca de terceiros: a tela mostra só que a pesquisa aconteceu.
        aoBuscar("Pesquisando referências de perfumaria");
      }
      if (b.type === "tool_use" && b.name === ferramentaEntrega.name) aoProgresso("Escrevendo a sua leitura");
    });

    let msg: BetaMessage;
    try {
      msg = await stream.finalMessage();
      falhasJson = 0;
    } catch (e) {
      if (e instanceof Anthropic.APIUserAbortError || sinal.aborted) return erro("tempo_esgotado", "A criação passou do tempo máximo.");
      if (e instanceof Anthropic.APIError) return erro("falha_ia", `API ${e.status ?? ""}: ${e.message}`.trim());
      // Entrada de ferramenta que não virou JSON (streaming de entrada): repete a rodada.
      if (falhasJson++ < 2) continue;
      return erro("falha_ia", `Resposta ilegível: ${(e as Error).message}`);
    }

    modelo = msg.model;
    uso.entrada += msg.usage.input_tokens + (msg.usage.cache_read_input_tokens ?? 0) + (msg.usage.cache_creation_input_tokens ?? 0);
    uso.saida += msg.usage.output_tokens;
    fontes.push(...fontesDe(msg.content));

    if (msg.stop_reason === "refusal") return erro("recusa", "O modelo recusou a criação.");
    if (msg.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: msg.content });
      continue;
    }
    if (msg.stop_reason === "max_tokens") return erro("falha_ia", "A resposta passou do limite de tamanho.");

    const chamadas = msg.content.filter((b) => b.type === "tool_use");
    const entrega = chamadas.find((b) => b.name === ferramentaEntrega.name);
    if (entrega) {
      try {
        const dados = ferramentaEntrega.parse(entrega.input) as Entrega;
        const unicas = Array.from(new Map(fontes.map((f) => [f.url, f])).values()).slice(0, 12);
        return { ok: true, criacao: montarCriacao(dados, entrada, modelo, unicas, ctx.registradas), modelo, uso, registradas: ctx.registradas };
      } catch (e) {
        // Entrega fora do esquema: devolve o erro para o modelo corrigir.
        messages.push({ role: "assistant", content: msg.content });
        messages.push({
          role: "user",
          content: chamadas.map(
            (c): BetaToolResultBlockParam => ({
              type: "tool_result",
              tool_use_id: c.id,
              is_error: true,
              content: c.id === entrega.id ? `Entrega fora do esquema: ${(e as Error).message.slice(0, 600)}` : "Não executada: corrija a entrega.",
            }),
          ),
        });
        continue;
      }
    }

    if (!chamadas.length) {
      if (lembretes++ >= MAX_LEMBRETES) return erro("falha_ia", "O modelo terminou sem entregar a criação.");
      messages.push({ role: "assistant", content: msg.content });
      messages.push({ role: "user", content: LEMBRETE_ENTREGA });
      continue;
    }

    messages.push({ role: "assistant", content: msg.content });
    const resultados: BetaToolResultBlockParam[] = [];
    for (const c of chamadas) {
      const ferramenta = executaveis[c.name];
      if (!ferramenta) {
        resultados.push({ type: "tool_result", tool_use_id: c.id, is_error: true, content: `Ferramenta desconhecida: ${c.name}` });
        continue;
      }
      let entradaFerramenta: unknown;
      try {
        entradaFerramenta = ferramenta.parse(c.input);
      } catch (e) {
        resultados.push({ type: "tool_result", tool_use_id: c.id, is_error: true, content: `INVALID_JSON: ${(e as Error).message.slice(0, 400)}` });
        continue;
      }
      try {
        const saida = await ferramenta.run(entradaFerramenta as never);
        resultados.push({ type: "tool_result", tool_use_id: c.id, content: saida });
      } catch (e) {
        resultados.push({ type: "tool_result", tool_use_id: c.id, is_error: true, content: `Falhou: ${(e as Error).message.slice(0, 400)}` });
      }
    }
    messages.push({ role: "user", content: resultados });
  }

  return erro("falha_ia", "A criação passou do número máximo de rodadas.");
}
