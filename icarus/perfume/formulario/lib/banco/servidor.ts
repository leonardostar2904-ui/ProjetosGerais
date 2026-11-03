import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Criacao } from "../criacao/tipos";
import { materiasPrimas } from "../conhecimento/materias-primas";
import type { PedidoCriacao } from "../ia/pedido";
import type { ResultadoCruzamento } from "../motor/tipos";
import { perguntas, VERSAO_QUESTIONARIO } from "../questionario/perguntas";

// Acesso ao Supabase pelo servidor, com a chave service_role (ignora o RLS; nunca vai para o navegador).
// Sem SUPABASE_URL e chave, tudo aqui devolve "indisponível" e a experiência segue sem gravar no banco.
// Cada função devolve o erro em vez de lançar: uma falha no banco não derruba a criação.

export type Banco = SupabaseClient;
type Resultado<T = null> = { ok: true; valor: T } | { ok: false; erro: string };

const MATERIAS = new Set(materiasPrimas.map((m) => m.n));
const GRUPOS = new Set(["frescos", "florais", "amadeirados", "doces", "quentes", "transversal"]);

export function bancoServidor(): Banco | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !chave) return null;
  return createClient(url, chave, { auth: { persistSession: false, autoRefreshToken: false } });
}

function falha(etapa: string, e: { message?: string } | null | undefined): { ok: false; erro: string } {
  return { ok: false, erro: `${etapa}: ${e?.message ?? "erro desconhecido"}` };
}

// ── Banco 01 · Sessão, respostas, contato e consentimento ──

export async function salvarSessao(db: Banco, p: PedidoCriacao): Promise<Resultado> {
  let r = await db.from("consumidores").upsert({ id: p.consumidorId }, { onConflict: "id", ignoreDuplicates: true });
  if (r.error) return falha("consumidores", r.error);

  if (p.nome) {
    r = await db
      .from("consumidores_contato")
      .upsert({ consumidor_id: p.consumidorId, nome: p.nome, atualizado_em: new Date().toISOString() }, { onConflict: "consumidor_id" });
    if (r.error) return falha("consumidores_contato", r.error);
  }

  r = await db.from("sessoes").upsert(
    {
      id: p.sessaoId,
      consumidor_id: p.consumidorId,
      questionario_versao: VERSAO_QUESTIONARIO,
      status: "concluida",
      iniciada_em: p.iniciadaEm,
      concluida_em: p.concluidaEm,
      capitulo_atual: 10,
      capitulos_concluidos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    { onConflict: "id" },
  );
  if (r.error) return falha("sessoes", r.error);

  const linhas = { respostas: [] as object[], dados_sensiveis: [] as object[] };
  for (const pergunta of perguntas) {
    if (pergunta.destino === "contato") continue;
    const valor = p.respostas[pergunta.id];
    const pulada = p.puladas.includes(pergunta.id);
    if (valor === undefined && !pulada) continue;
    linhas[pergunta.destino].push({
      sessao_id: p.sessaoId,
      pergunta_id: pergunta.id,
      questionario_versao: VERSAO_QUESTIONARIO,
      status: valor === undefined ? "pulada" : "respondida",
      valor: valor ?? null,
    });
  }
  for (const tabela of ["respostas", "dados_sensiveis"] as const) {
    if (!linhas[tabela].length) continue;
    r = await db.from(tabela).upsert(linhas[tabela], { onConflict: "sessao_id,pergunta_id" });
    if (r.error) return falha(tabela, r.error);
  }

  r = await db.from("consentimentos").upsert(
    {
      id: p.consentimento.id,
      consumidor_id: p.consumidorId,
      sessao_id: p.sessaoId,
      tipo: "uso_respostas_criacao",
      versao_texto: p.consentimento.versaoTexto,
      aceito_em: p.consentimento.aceitoEm,
    },
    { onConflict: "id", ignoreDuplicates: true },
  );
  // Um consentimento ativo da mesma sessão com outro id já basta (índice único parcial).
  if (r.error && r.error.code !== "23505") return falha("consentimentos", r.error);

  return { ok: true, valor: null };
}

// ── Banco 02 · Cruzamento do motor ──

export async function salvarCruzamento(db: Banco, sessaoId: string, c: ResultadoCruzamento): Promise<Resultado<string>> {
  const ins = await db
    .from("cruzamentos")
    .insert({
      sessao_id: sessaoId,
      versao_motor: c.versoes.motor,
      versao_regras: c.versoes.regras,
      versao_catalogo: c.versoes.catalogo,
      versao_questionario: c.versoes.questionario,
      gerado_em: c.geradoEm,
      direcao: c.direcao,
      mencoes: c.mencoes,
      candidatas: c.candidatas,
      lacunas: c.lacunas,
      comercial: c.comercial,
      fila_ia: c.filaIA,
      pendencias: c.pendencias,
      formulacao: c.formulacao,
      aprendizado: c.aprendizado,
    })
    .select("id")
    .single();
  if (ins.error || !ins.data) return falha("cruzamentos", ins.error);
  const id = ins.data.id as string;

  // Perfil e regras: complementos. Se o catálogo do seed estiver desatualizado, o cruzamento continua salvo.
  await db.from("perfil_tracos").insert(
    c.perfil.map((t) => ({
      cruzamento_id: id,
      sessao_id: sessaoId,
      traco_codigo: t.codigo,
      valor: t.valor,
      categorias: t.categorias ?? null,
      status: t.status,
      metodo: t.metodo,
      origens: t.origens,
      versao_motor: c.versoes.motor,
    })),
  );
  if (c.regras.length) {
    await db.from("aplicacoes_regras").insert(
      c.regras.map((x, i) => ({
        cruzamento_id: id,
        ordem: i + 1,
        sessao_id: sessaoId,
        regra_codigo: x.codigo,
        regra_versao: c.versoes.regras,
        nome: x.nome,
        gatilho: x.gatilho,
        efeito: x.efeito,
        origens: x.origens,
        versao_motor: c.versoes.motor,
      })),
    );
  }
  return { ok: true, valor: id };
}

/** Criação já feita para esta sessão (evita pagar duas vezes pela mesma leitura). */
export async function criacaoExistente(db: Banco, sessaoId: string): Promise<Criacao | null> {
  const { data } = await db
    .from("cruzamentos")
    .select("formulacao")
    .eq("sessao_id", sessaoId)
    .eq("formulacao->>status", "proposta_ia")
    .order("gerado_em", { ascending: false })
    .limit(1);
  const f = data?.[0]?.formulacao as { criacao?: Criacao } | undefined;
  return f?.criacao ?? null;
}

/** Quantas criações com IA já foram feitas hoje (UTC). */
export async function criacoesHoje(db: Banco): Promise<number | null> {
  const inicio = new Date();
  inicio.setUTCHours(0, 0, 0, 0);
  const { count, error } = await db
    .from("log_geracoes_ia")
    .select("id", { count: "exact", head: true })
    .eq("finalidade", "formulacao")
    .gte("criado_em", inicio.toISOString());
  return error ? null : count ?? 0;
}

// ── Banco 03 · Perfumes de referência ──

export type NotaReferencia = { camada: "topo" | "coracao" | "fundo"; nota: string; materiaN: number | null; grupo: string | null };

export async function consultarReferencias(db: Banco, nomes: string[]) {
  const achados: { marca: string; nome: string; concentracao: string | null; fonte: string | null; notas: NotaReferencia[] }[] = [];
  for (const nome of nomes.slice(0, 8)) {
    // Tira o que tem sentido especial no filtro do PostgREST; o valor vai entre aspas.
    const termo = nome.replace(/[%_,()"\\*]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
    if (!termo) continue;
    const { data, error } = await db
      .from("perfumes_referencia")
      .select("marca, nome, concentracao_codigo, fonte, perfumes_referencia_notas (camada, nota, materia_n, grupo)")
      .or(`nome.ilike."%${termo}%",marca.ilike."%${termo}%"`)
      .limit(3);
    if (error) throw new Error(error.message);
    for (const p of data ?? []) {
      achados.push({
        marca: p.marca,
        nome: p.nome,
        concentracao: p.concentracao_codigo,
        fonte: p.fonte,
        notas: ((p.perfumes_referencia_notas ?? []) as { camada: NotaReferencia["camada"]; nota: string; materia_n: number | null; grupo: string | null }[]).map(
          (n) => ({ camada: n.camada, nota: n.nota, materiaN: n.materia_n, grupo: n.grupo }),
        ),
      });
    }
  }
  return achados;
}

export async function registrarReferencia(
  db: Banco,
  ref: { marca: string; nome: string; concentracao: string | null; ano: number | null; fonte: string; notas: NotaReferencia[] },
): Promise<Resultado<string>> {
  const up = await db
    .from("perfumes_referencia")
    .upsert(
      {
        marca: ref.marca.trim().slice(0, 120),
        nome: ref.nome.trim().slice(0, 160),
        concentracao_codigo: ref.concentracao,
        ano: ref.ano && ref.ano >= 1800 && ref.ano <= 2100 ? Math.round(ref.ano) : null,
        fonte: ref.fonte.slice(0, 500),
        observacao: `Registrado pela IA de criação em ${new Date().toISOString().slice(0, 10)}, a partir de pesquisa na web. Validar com perfumista.`,
      },
      { onConflict: "marca,nome,concentracao_codigo" },
    )
    .select("id")
    .single();
  if (up.error || !up.data) return falha("perfumes_referencia", up.error);
  const id = up.data.id as string;

  const vistas = new Set<string>();
  const notas = ref.notas
    .map((n) => ({ ...n, nota: n.nota.trim().toLowerCase().slice(0, 80) }))
    .filter((n) => n.nota && !vistas.has(`${n.camada}|${n.nota}`) && vistas.add(`${n.camada}|${n.nota}`))
    .map((n) => ({
      perfume_id: id,
      camada: n.camada,
      nota: n.nota,
      materia_n: n.materiaN !== null && MATERIAS.has(n.materiaN) ? n.materiaN : null,
      grupo: n.grupo && GRUPOS.has(n.grupo) ? n.grupo : null,
    }));
  if (notas.length) {
    const r = await db.from("perfumes_referencia_notas").upsert(notas, { onConflict: "perfume_id,camada,nota", ignoreDuplicates: true });
    if (r.error) return falha("perfumes_referencia_notas", r.error);
  }
  return { ok: true, valor: id };
}

// ── Banco 05 · Proposta de fórmula e Banco 08 · Log ──

export async function salvarCriacao(
  db: Banco,
  args: { pedido: PedidoCriacao; cruzamentoId: string; criacao: Criacao },
): Promise<Resultado<string>> {
  const { pedido, cruzamentoId, criacao } = args;
  const e = criacao.equipe;

  const up = await db.from("cruzamentos").update({ formulacao: { status: "proposta_ia", criacao } }).eq("id", cruzamentoId);
  if (up.error) return falha("cruzamentos.formulacao", up.error);

  const foraDoCatalogo = e.componentes.filter((c) => c.materiaN === null || !MATERIAS.has(c.materiaN));
  const codigo = `ICR-${new Date().getUTCFullYear()}-${pedido.sessaoId.slice(5, 13).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const ins = await db
    .from("formulas")
    .insert({
      codigo,
      versao: 1,
      sessao_id: pedido.sessaoId,
      consumidor_id: pedido.consumidorId,
      cruzamento_id: cruzamentoId,
      nome_interno: e.nomeInterno.slice(0, 120) || "Proposta da IA",
      concentracao_codigo: e.concentracao,
      percentual_concentrado: e.percentualConcentrado,
      base: e.base,
      status: "rascunho",
      origem: "ia",
      observacoes: [
        `Linha ${e.linha}. Modalidade sugerida: ${e.modalidadeSugerida}.`,
        foraDoCatalogo.length
          ? `Componentes fora do catálogo (não entram em componentes_formula): ${foraDoCatalogo.map((c) => `${c.nome} ${c.percentual}%`).join(", ")}.`
          : "",
        ...criacao.avisos,
      ]
        .filter(Boolean)
        .join("\n"),
    })
    .select("id")
    .single();
  if (ins.error || !ins.data) return falha("formulas", ins.error);
  const formulaId = ins.data.id as string;

  // Uma linha por matéria-prima (a tabela não aceita a mesma matéria duas vezes sem lote).
  const porMateria = new Map<number, { percentual: number; motivos: string[] }>();
  for (const c of e.componentes) {
    if (c.materiaN === null || !MATERIAS.has(c.materiaN)) continue;
    const atual = porMateria.get(c.materiaN) ?? { percentual: 0, motivos: [] };
    atual.percentual += c.percentual;
    atual.motivos.push(`${c.camada}: ${c.motivo}`);
    porMateria.set(c.materiaN, atual);
  }
  const componentes = Array.from(porMateria.entries())
    .filter(([, v]) => v.percentual > 0 && v.percentual <= 100)
    .map(([n, v], i) => ({
      formula_id: formulaId,
      ordem: i + 1,
      materia_n: n,
      percentual_massa: Math.round(v.percentual * 10000) / 10000,
      observacao: v.motivos.join(" | ").slice(0, 500),
    }));
  if (componentes.length) {
    const r = await db.from("componentes_formula").insert(componentes);
    if (r.error) return falha("componentes_formula", r.error);
  }
  return { ok: true, valor: formulaId };
}

export async function registrarLog(
  db: Banco,
  log: {
    sessaoId: string;
    cruzamentoId: string | null;
    formulaId: string | null;
    modelo: string;
    versaoPrompt: string;
    entrada: unknown;
    saida: unknown;
    erro: string | null;
    tokensEntrada: number | null;
    tokensSaida: number | null;
    duracaoMs: number;
  },
): Promise<void> {
  await db.from("log_geracoes_ia").insert({
    sessao_id: log.sessaoId,
    cruzamento_id: log.cruzamentoId,
    formula_id: log.formulaId,
    finalidade: "formulacao",
    modelo: log.modelo,
    versao_prompt: log.versaoPrompt,
    entrada: log.entrada,
    saida: log.saida,
    status: log.erro ? "erro" : "sucesso",
    erro: log.erro,
    tokens_entrada: log.tokensEntrada,
    tokens_saida: log.tokensSaida,
    duracao_ms: log.duracaoMs,
  });
}
