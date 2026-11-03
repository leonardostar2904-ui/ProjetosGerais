"use client";

import { useEffect, useMemo, useState } from "react";
import * as A from "@/lib/armazenamento";
import type { Criacao } from "@/lib/criacao/tipos";
import { materiasPrimas } from "@/lib/conhecimento/materias-primas";
import { GRUPOS } from "@/lib/conhecimento/referencias";
import { cruzar } from "@/lib/motor";
import type { Candidata, ResultadoCruzamento } from "@/lib/motor/tipos";
import { capituloPorNumero } from "@/lib/questionario/capitulos";
import { perguntas, rotuloDaOpcao } from "@/lib/questionario/perguntas";
import { aplicavel, progressoGeral, respondida } from "@/lib/questionario/progresso";
import type { Pergunta, Valor } from "@/lib/questionario/tipos";

// Página da equipe. Mostra como as respostas de uma sessão cruzam com a base de dados,
// banco por banco. Não faz parte da experiência do cliente e não gera fórmula.

function formatarValor(p: Pergunta, v: Valor | undefined): string {
  if (v === undefined) return "";
  if (p.tipo === "escala") return `${v} de 5`;
  if (Array.isArray(v)) {
    if (p.tipo === "tres-palavras") return v.filter((x) => x.trim()).join(" · ");
    return v.map((x) => rotuloDaOpcao(p.id, x)).join(" · ");
  }
  if (p.tipo === "escolha-unica") return rotuloDaOpcao(p.id, String(v));
  return String(v);
}

function data(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function Secao({ numero, titulo, children, nota }: { numero: string; titulo: string; nota?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-azul pt-5">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="rotulo text-[10.5px] text-grafite-suave">{numero}</p>
          <h2 className="voz-alta mt-2 text-[40px] text-azul">
            {titulo}
            <span className="text-brasa">.</span>
          </h2>
          {nota && <p className="mt-3 max-w-[32ch] text-[13.5px] leading-snug text-grafite-suave">{nota}</p>}
        </div>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}

function Barra({ valor }: { valor: number | null }) {
  if (valor === null) return <span className="rotulo text-[10px] text-grafite-suave">sem valor</span>;
  return (
    <span className="flex items-center gap-3">
      <span className="relative block h-[6px] w-28 bg-nevoa">
        <span className="absolute inset-y-0 left-0 bg-azul" style={{ width: `${valor * 10}%` }} />
      </span>
      <span className="font-mono text-[13px] text-azul">{valor.toFixed(1)}</span>
    </span>
  );
}

function Chip({ texto, forte }: { texto: string; forte?: boolean }) {
  return <span className={`rotulo inline-block border px-1.5 py-[1px] text-[9.5px] ${forte ? "border-brasa text-brasa" : "border-azul/25 text-grafite-suave"}`}>{texto}</span>;
}

function ListaCandidatas({ titulo, itens }: { titulo: string; itens: Candidata[] }) {
  return (
    <div>
      <p className="rotulo border-b border-azul/30 pb-2 text-[10.5px] text-azul">{titulo}</p>
      {itens.length === 0 && <p className="py-3 text-[13px] text-grafite-suave">Nenhuma candidata.</p>}
      <ol>
        {itens.map((c) => (
          <li key={c.n} className="border-b border-azul/10 py-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[14.5px] font-semibold text-azul">
                <span className="mr-1.5 font-mono text-[12px] font-normal text-grafite-suave">#{c.n}</span>
                {c.nome}
              </span>
              <span className="font-mono text-[12px] text-azul">{c.pontuacao.toFixed(1)}</span>
            </div>
            {c.sinais.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {c.sinais.map((s) => (
                  <Chip key={s} texto={s} forte={/Fototóxica$|CITES$|forma permitida|inviável/.test(s)} />
                ))}
              </div>
            )}
            <p className="mt-1.5 text-[12px] leading-snug text-grafite-suave">{c.motivos.join(" · ")}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

const CAMADA_ROTULO = { saida: "Saída", coracao: "Coração", fundo: "Fundo" } as const;

function PropostaIA({ criacao }: { criacao: Criacao }) {
  const e = criacao.equipe;
  const soma = e.componentes.reduce((t, c) => t + c.percentual, 0);
  return (
    <div className="space-y-8">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[14px] sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Nome interno", e.nomeInterno],
          ["Linha", e.linha],
          ["Concentração", e.concentracao.toUpperCase()],
          ["Concentrado", `${e.percentualConcentrado}%`],
          ["Base", e.base === "oleosa" ? "oleosa" : "alcoólica"],
          ["Modalidade", e.modalidadeSugerida],
        ].map(([t, v]) => (
          <div key={t}>
            <dt className="rotulo text-[9.5px] text-grafite-suave">{t}</dt>
            <dd className="mt-1 text-azul">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Componentes da proposta, com rolagem horizontal">
        <table className="w-full min-w-[720px] text-left text-[13.5px]">
          <caption className="sr-only">Componentes da proposta em percentual de massa dentro do concentrado</caption>
          <thead>
            <tr className="rotulo border-b border-azul/30 text-[9.5px] text-grafite-suave">
              <th className="py-2 pr-3 font-normal">Camada</th>
              <th className="py-2 pr-3 font-normal">#</th>
              <th className="py-2 pr-3 font-normal">Matéria-prima</th>
              <th className="py-2 pr-3 text-right font-normal">% massa</th>
              <th className="py-2 font-normal">Por quê</th>
            </tr>
          </thead>
          <tbody>
            {e.componentes.map((c, i) => (
              <tr key={i} className="border-b border-nevoa align-top">
                <td className="py-2 pr-3 text-grafite-suave">{CAMADA_ROTULO[c.camada]}</td>
                <td className="py-2 pr-3 font-mono text-azul">{c.materiaN ?? "fora"}</td>
                <td className="py-2 pr-3 text-azul">{c.nome}</td>
                <td className="py-2 pr-3 text-right font-mono">{c.percentual.toFixed(2)}</td>
                <td className="py-2 text-grafite">{c.motivo}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="rotulo py-2 text-[9.5px] text-grafite-suave">Soma</td>
              <td className="py-2 pr-3 text-right font-mono text-azul">{soma.toFixed(2)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 text-[14.5px] leading-relaxed text-grafite">
          <h3 className="rotulo text-[10px] text-azul">Leitura dos textos</h3>
          <p>{e.leituraTextos}</p>
          {e.conflitos.length > 0 && (
            <>
              <h3 className="rotulo pt-2 text-[10px] text-azul">Conflitos</h3>
              <ul className="list-disc space-y-1 pl-5">{e.conflitos.map((x) => <li key={x}>{x}</li>)}</ul>
            </>
          )}
          {e.alternativaEssencial && (
            <>
              <h3 className="rotulo pt-2 text-[10px] text-azul">Na linha Essencial</h3>
              <p>{e.alternativaEssencial}</p>
            </>
          )}
        </div>
        <div className="space-y-3 text-[14.5px] leading-relaxed text-grafite">
          <h3 className="rotulo text-[10px] text-azul">Para o perfumista conferir</h3>
          <ul className="list-disc space-y-1 pl-5">{e.pontosPerfumista.map((x) => <li key={x}>{x}</li>)}</ul>
          {criacao.avisos.length > 0 && (
            <>
              <h3 className="rotulo pt-2 text-[10px] text-brasa">Avisos do servidor</h3>
              <ul className="list-disc space-y-1 pl-5">{criacao.avisos.map((x) => <li key={x}>{x}</li>)}</ul>
            </>
          )}
        </div>
      </div>

      {e.referencias.length > 0 && (
        <div>
          <h3 className="rotulo text-[10px] text-azul">Perfumes citados (pergunta 30)</h3>
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {e.referencias.map((r) => (
              <li key={r.perfume} className="border border-nevoa bg-branco/60 p-3 text-[14px] text-grafite">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-azul">{r.perfume}</span>
                  <Chip texto={r.relacao} forte={r.relacao === "rejeitou"} />
                  <Chip texto={`fonte: ${r.fonte}`} />
                </p>
                <p className="mt-2 leading-relaxed">{r.leitura}</p>
              </li>
            ))}
          </ul>
          {criacao.referenciasRegistradas.length > 0 && (
            <p className="mt-3 text-[13px] text-grafite-suave">Gravados no banco nesta criação: {criacao.referenciasRegistradas.join(", ")}.</p>
          )}
        </div>
      )}

      {criacao.fontes.length > 0 && (
        <div>
          <h3 className="rotulo text-[10px] text-azul">Páginas consultadas na web</h3>
          <ul className="mt-2 space-y-1 text-[13px]">
            {criacao.fontes.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noreferrer noopener" className="text-azul underline decoration-nevoa underline-offset-4 [overflow-wrap:anywhere]">
                  {f.titulo || f.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Bastidores() {
  const [banco, setBanco] = useState<A.Banco | null>(null);
  const [sessaoId, setSessaoId] = useState<string | null>(null);

  useEffect(() => {
    const b = A.carregarBanco();
    setBanco(b);
    setSessaoId(b.sessaoAtualId ?? b.sessoes.at(-1)?.id ?? null);
  }, []);

  const sessao = banco?.sessoes.find((s) => s.id === sessaoId) ?? null;
  const respostas = useMemo(() => (banco && sessaoId ? A.respostasDaSessao(banco, sessaoId) : {}), [banco, sessaoId]);
  const resultado: ResultadoCruzamento | null = useMemo(() => (sessao ? cruzar(respostas) : null), [sessao, respostas]);
  const progresso = progressoGeral(respostas);
  const criacao = banco ? A.criacaoDaSessao(banco, sessaoId) : null;

  if (!banco) return null;

  const exportar = () => {
    if (!resultado || !sessao) return;
    const dados = { ...A.exportarSessao(banco, sessao.id), cruzamento: resultado, criacao: A.criacaoDaSessao(banco, sessao.id) };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `icarus-cruzamento-${sessao.id.slice(-8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const apagar = () => {
    if (!window.confirm("Apagar todos os dados de teste guardados neste navegador? Isso não pode ser desfeito.")) return;
    A.apagarBanco();
    setBanco(A.bancoVazio());
    setSessaoId(null);
  };

  const consentimento = sessao ? banco.consentimentos.find((c) => c.sessaoId === sessao.id) : undefined;
  const contato = sessao ? banco.contato.find((c) => c.consumidorId === sessao.consumidorId) : undefined;

  return (
    <main className="mx-auto max-w-[1280px] px-4 pb-24 pt-8 sm:px-8 lg:px-12">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-azul/20 pb-4">
        <p className="rotulo text-[11px] text-azul">
          <span className="tracking-[0.3em]">ICARUS</span> <span className="text-grafite-suave">· Bastidores do cruzamento</span>
        </p>
        <a href="/" className="rotulo text-[10.5px] text-grafite-suave underline decoration-nevoa underline-offset-4 hover:text-azul">
          Voltar à experiência
        </a>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="rotulo inline-block bg-azul px-2 py-1 text-[10px] text-papel">Modo equipe · não é exibido ao cliente</p>
          <h1 className="voz-alta mt-5 text-[clamp(52px,8vw,104px)] text-azul">
            Bastidores<span className="text-brasa">.</span>
          </h1>
          <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-grafite">
            Como as respostas de uma sessão cruzam com a base de dados, banco por banco. Tudo aqui é determinístico e auditável. Nada aqui é
            fórmula: a formulação depende de IA e de um perfumista, que ainda não estão conectados.
          </p>
        </div>
        <div className="lg:col-span-5">
          <label className="rotulo block text-[10.5px] text-grafite-suave" htmlFor="sessao">
            Sessão
          </label>
          <select
            id="sessao"
            value={sessaoId ?? ""}
            onChange={(e) => setSessaoId(e.target.value)}
            className="mt-2 h-11 w-full border border-azul/25 bg-branco px-3 font-mono text-[12.5px] text-azul"
          >
            {banco.sessoes.length === 0 && <option value="">Nenhuma sessão neste navegador</option>}
            {[...banco.sessoes].reverse().map((s) => {
              const n = progressoGeral(A.respostasDaSessao(banco, s.id)).respondidas;
              return (
                <option key={s.id} value={s.id}>
                  {s.id.slice(-8)} · {s.status === "concluida" ? "concluída" : "em andamento"} · {n} respostas · {data(s.iniciadaEm)}
                </option>
              );
            })}
          </select>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={exportar} disabled={!resultado} className="rotulo h-10 bg-azul px-4 text-[10.5px] text-papel disabled:opacity-40">
              Exportar JSON do cruzamento
            </button>
            <button type="button" onClick={apagar} className="rotulo h-10 border border-azul/25 px-4 text-[10.5px] text-azul hover:border-brasa hover:text-brasa">
              Apagar dados de teste
            </button>
          </div>
          {resultado && (
            <dl className="rotulo mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-grafite-suave">
              <dt>Questionário</dt>
              <dd className="text-azul">{resultado.versoes.questionario}</dd>
              <dt>Motor</dt>
              <dd className="text-azul">{resultado.versoes.motor}</dd>
              <dt>Regras</dt>
              <dd className="text-azul">{resultado.versoes.regras}</dd>
              <dt>Catálogo</dt>
              <dd className="text-azul">{resultado.versoes.catalogo}</dd>
            </dl>
          )}
        </div>
      </div>

      {!sessao || !resultado ? (
        <p className="mt-16 text-[16px] text-grafite-suave">
          Nenhuma sessão encontrada neste navegador. Responda a experiência na página inicial e volte aqui.
        </p>
      ) : (
        <div className="mt-16 space-y-16">
          <Secao numero="Banco 01" titulo="Consumidores" nota="Respostas, dados sensíveis e contato ficam em tabelas separadas.">
            <dl className="grid gap-x-8 gap-y-2 text-[14px] sm:grid-cols-2">
              <div className="flex justify-between gap-4 border-b border-azul/10 py-1.5">
                <dt className="text-grafite-suave">Consumidor (anônimo)</dt>
                <dd className="font-mono text-[12.5px] text-azul">{sessao.consumidorId.slice(0, 18)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-azul/10 py-1.5">
                <dt className="text-grafite-suave">Contato · nome</dt>
                <dd className="text-azul">{contato?.nome ?? "não informado"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-azul/10 py-1.5">
                <dt className="text-grafite-suave">Sessão</dt>
                <dd className="font-mono text-[12.5px] text-azul">{sessao.status === "concluida" ? "concluída" : "em andamento"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-azul/10 py-1.5">
                <dt className="text-grafite-suave">Progresso</dt>
                <dd className="font-mono text-[12.5px] text-azul">
                  {progresso.respondidas} de {progresso.aplicaveis} aplicáveis ({progresso.percentual}%)
                </dd>
              </div>
            </dl>
            <div className="mt-6 overflow-x-auto" tabIndex={0} role="region" aria-label="Respostas da sessão">
              <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="rotulo border-b border-azul/40 text-[9.5px] text-grafite-suave">
                    <th className="py-2 pr-3 font-normal">Nº</th>
                    <th className="py-2 pr-3 font-normal">Etapa</th>
                    <th className="py-2 pr-3 font-normal">Pergunta</th>
                    <th className="py-2 pr-3 font-normal">Resposta</th>
                    <th className="py-2 pr-3 font-normal">Status</th>
                    <th className="py-2 font-normal">Tabela</th>
                  </tr>
                </thead>
                <tbody>
                  {perguntas.map((p) => {
                    const ok = aplicavel(p, respostas);
                    const v = respostas[p.id];
                    const st = !ok ? "não se aplica" : respondida(p, v) ? "respondida" : A.statusDaPergunta(banco, sessao.id, p.id) === "pulada" ? "pulada" : "em branco";
                    return (
                      <tr key={p.id} className={`border-b border-azul/10 align-top ${!ok ? "italic text-grafite-suave" : ""}`}>
                        <td className="py-2 pr-3 font-mono text-[12px] text-grafite-suave">{String(p.numero).padStart(2, "0")}</td>
                        <td className="py-2 pr-3 font-mono text-[12px] text-grafite-suave">{String(p.capitulo).padStart(2, "0")}</td>
                        <td className="max-w-[300px] py-2 pr-3 text-grafite">{p.enunciado}</td>
                        <td className="max-w-[280px] py-2 pr-3 text-azul">{ok ? formatarValor(p, v) : ""}</td>
                        <td className="py-2 pr-3">
                          <Chip texto={st} forte={st === "em branco" && p.obrigatoria} />
                        </td>
                        <td className="py-2 font-mono text-[11.5px] text-grafite-suave">{p.destino}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Secao>

          <Secao numero="Banco 02" titulo="Perfil" nota="Indicadores de preferências declaradas. Não é diagnóstico psicológico. Pesos v0, a calibrar.">
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Tabela com rolagem horizontal">
              <table className="w-full min-w-[680px] border-collapse text-left text-[13px]">
                <tbody>
                  {resultado.perfil.map((t) => (
                    <tr key={t.codigo} className="border-b border-azul/10 align-top">
                      <td className="py-2.5 pr-3 font-mono text-[12px] text-grafite-suave">{t.codigo}</td>
                      <td className="py-2.5 pr-3 font-semibold text-azul">{t.nome}</td>
                      <td className="py-2.5 pr-3">
                        {t.tipo === "categoria" ? <span className="text-azul">{t.categorias?.join(" · ") || "sem valor"}</span> : <Barra valor={t.valor} />}
                      </td>
                      <td className="py-2.5 pr-3">
                        <Chip texto={t.status.replace("_", " ")} />
                      </td>
                      <td className="max-w-[340px] py-2.5 text-[12px] leading-snug text-grafite-suave">{t.metodo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Secao>

          <Secao numero="Regras" titulo="Tradução" nota={`${resultado.regras.length} regras disparadas nesta sessão. Cada uma registra gatilho, efeito e força da evidência.`}>
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Tabela com rolagem horizontal">
              <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="rotulo border-b border-azul/40 text-[9.5px] text-grafite-suave">
                    <th className="py-2 pr-3 font-normal">Regra</th>
                    <th className="py-2 pr-3 font-normal">Gatilho</th>
                    <th className="py-2 pr-3 font-normal">Efeito</th>
                    <th className="py-2 font-normal">Evidência</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.regras.map((r) => (
                    <tr key={r.codigo + r.nome} className="border-b border-azul/10 align-top">
                      <td className="py-2.5 pr-3">
                        <span className="font-mono text-[12px] text-grafite-suave">{r.codigo}</span>
                        <span className="mt-0.5 block font-semibold text-azul">{r.nome}</span>
                      </td>
                      <td className="max-w-[240px] py-2.5 pr-3 text-grafite">{r.gatilho}</td>
                      <td className="max-w-[340px] py-2.5 pr-3 text-grafite">{r.efeito}</td>
                      <td className="py-2.5">
                        <Chip texto={r.evidencia} forte={r.tipo === "seguranca"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Secao>

          <Secao numero="Banco 03" titulo="Direção" nota="Pesos por família, concentração, base e ajustes. Menções dos textos livres lidas por palavra-chave.">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="rotulo border-b border-azul/30 pb-2 text-[10.5px] text-azul">Pesos por família</p>
                <ul className="mt-2">
                  {Object.entries(resultado.direcao.pesos).map(([g, p]) => (
                    <li key={g} className="flex items-center justify-between gap-4 border-b border-azul/10 py-2">
                      <span className="text-[14px] text-azul">{GRUPOS[g as keyof typeof GRUPOS].nome}</span>
                      <span className="flex items-center gap-3">
                        <span className="relative block h-[6px] w-28 bg-nevoa">
                          <span className="absolute inset-y-0 left-0 bg-azul" style={{ width: `${Math.max(0, Math.min(100, (p / 2) * 100))}%` }} />
                        </span>
                        <span className="w-10 text-right font-mono text-[12px] text-azul">{p.toFixed(2)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <dl className="text-[14px]">
                {[
                  ["Concentração", `${resultado.direcao.concentracao.nome}. ${resultado.direcao.concentracao.motivo}`],
                  ["Base", `${resultado.direcao.base.tipo === "oleosa" ? "Oleosa" : "Alcoólica"}. ${resultado.direcao.base.motivo}`],
                  [
                    "Ajustes",
                    `Fixação +${resultado.direcao.ajustes.fundo.toFixed(1)}; cítricos de saída −${resultado.direcao.ajustes.citricosSaida.toFixed(1)}; fundo pesado no calor −${resultado.direcao.ajustes.fundoPesadoCalor.toFixed(1)}`,
                  ],
                ].map(([t, d]) => (
                  <div key={t} className="border-b border-azul/10 py-2.5">
                    <dt className="rotulo text-[10px] text-grafite-suave">{t}</dt>
                    <dd className="mt-1 text-grafite">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {(resultado.direcao.conflitos.length > 0 || resultado.direcao.alertas.length > 0) && (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {resultado.direcao.conflitos.length > 0 && (
                  <div className="border border-brasa/50 p-4">
                    <p className="rotulo text-[10px] text-brasa">Conflitos para conversar antes de formular</p>
                    <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[13.5px] text-grafite">
                      {resultado.direcao.conflitos.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {resultado.direcao.alertas.length > 0 && (
                  <div className="border border-azul/25 p-4">
                    <p className="rotulo text-[10px] text-azul">Alertas</p>
                    <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[13.5px] text-grafite">
                      {resultado.direcao.alertas.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <p className="rotulo border-b border-azul/30 pb-2 text-[10.5px] text-azul">Menções nos textos livres</p>
                {resultado.mencoes.length === 0 && <p className="py-3 text-[13px] text-grafite-suave">Nenhuma menção encontrada.</p>}
                <ul>
                  {resultado.mencoes.map((m, i) => (
                    <li key={`${m.perguntaId}-${m.termo}-${i}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-azul/10 py-2 text-[13px]">
                      <span className="font-mono text-[12px] text-grafite-suave">#{Number(m.perguntaId.slice(1))}</span>
                      <span className="font-semibold text-azul">“{m.termo}”</span>
                      <Chip texto={m.uso === "exclusao" ? "exclusão" : m.uso === "afinidade" ? "afinidade" : "referência"} forte={m.uso === "exclusao"} />
                      <span className="text-grafite-suave">
                        {m.materias.length ? m.materias.map((n) => `#${n} ${materiasPrimas.find((x) => x.n === n)?.nome.split(" (")[0]}`).join(", ") : ""}
                        {m.grupo ? ` grupo ${m.grupo}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="rotulo border-b border-azul/30 pb-2 text-[10.5px] text-azul">Lacunas acionadas</p>
                {resultado.lacunas.length === 0 && <p className="py-3 text-[13px] text-grafite-suave">Nenhuma.</p>}
                <ul>
                  {resultado.lacunas.map((l) => (
                    <li key={l.codigo} className="border-b border-azul/10 py-2 text-[13px] text-grafite">
                      {l.texto} <span className="text-grafite-suave">({l.origem})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Secao>

          <Secao
            numero="Banco 04"
            titulo="Candidatas"
            nota="Matérias-primas do manual ordenadas pela direção. Lista para o perfumista e para a futura IA. Não tem proporção e não é fórmula."
          >
            <div className="grid gap-8 lg:grid-cols-3">
              <ListaCandidatas titulo="Topo" itens={resultado.candidatas.topo} />
              <ListaCandidatas titulo="Coração" itens={resultado.candidatas.coracao} />
              <ListaCandidatas titulo="Fundo" itens={resultado.candidatas.fundo} />
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <ListaCandidatas titulo="Citadas pela pessoa" itens={resultado.candidatas.citadas} />
              <div>
                <p className="rotulo border-b border-azul/30 pb-2 text-[10.5px] text-azul">Excluídas e observações</p>
                {resultado.candidatas.excluidas.length === 0 && resultado.candidatas.observacoes.length === 0 && (
                  <p className="py-3 text-[13px] text-grafite-suave">Nenhuma.</p>
                )}
                <ul>
                  {resultado.candidatas.excluidas.map((x) => (
                    <li key={x.n} className="border-b border-azul/10 py-2 text-[13px] text-grafite">
                      <span className="font-mono text-[12px] text-grafite-suave">#{x.n}</span> {x.nome}. <span className="text-brasa">{x.motivo}</span>
                    </li>
                  ))}
                  {resultado.candidatas.observacoes.map((o) => (
                    <li key={o} className="border-b border-azul/10 py-2 text-[13px] text-grafite-suave">
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Secao>

          <Secao
            numero="Banco 05"
            titulo="Formulação"
            nota={criacao ? `Proposta da IA (${criacao.modelo}, ${criacao.versaoPrompt}, ${data(criacao.geradaEm)}). Rascunho para o perfumista: nada vai para a pele sem revisão.` : undefined}
          >
            {!criacao ? (
              <p className="max-w-[70ch] text-[15px] leading-relaxed text-grafite">
                <Chip texto="não gerada" forte />{" "}
                <span className="ml-2">A leitura por IA ainda não foi feita para esta sessão (ou a IA não está ligada neste ambiente).</span>
              </p>
            ) : (
              <PropostaIA criacao={criacao} />
            )}
          </Secao>

          <Secao numero="Banco 06" titulo="Comercial" nota="Respostas da etapa 09 são pesquisa de preferência. Não autorizam nada e não são oferta.">
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Tabela com rolagem horizontal">
              <table className="w-full min-w-[620px] border-collapse text-left text-[13px]">
                <tbody>
                  {resultado.comercial.modalidades.map((m) => (
                    <tr key={m.codigo} className="border-b border-azul/10 align-top">
                      <td className="py-2.5 pr-3 font-semibold text-azul">{m.nome}</td>
                      <td className="py-2.5 pr-3 font-mono text-[12.5px] text-azul">R$ {m.preco}</td>
                      <td className="py-2.5 pr-3">
                        <Chip texto={m.compativel ? "compatível" : "bloqueada"} forte={!m.compativel} />
                      </td>
                      <td className="py-2.5 text-[12.5px] text-grafite-suave">{m.observacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-6">
              {resultado.comercial.sinais.map((s) => (
                <li key={s.pergunta} className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-azul/10 py-2 text-[13.5px]">
                  <span className="text-grafite-suave">{s.pergunta}</span>
                  <span className="text-azul">{s.leitura}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-l-2 border-azul pl-4 text-[14px] leading-relaxed text-grafite">{resultado.comercial.hipotese}</p>
          </Secao>

          <Secao numero="Banco 07" titulo="Aprendizado">
            <p className="text-[15px] text-grafite">
              <Chip texto="sem avaliações" /> <span className="ml-2">{resultado.aprendizado.motivo}</span>
            </p>
          </Secao>

          <Secao numero="Banco 08" titulo="Governança" nota="Consentimento, fila de leitura da IA e pendências antes de qualquer formulação.">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="rotulo border-b border-azul/30 pb-2 text-[10.5px] text-azul">Consentimento</p>
                {consentimento ? (
                  <div className="py-3 text-[13.5px] leading-relaxed text-grafite">
                    <p>“{consentimento.texto}”</p>
                    <p className="rotulo mt-2 text-[10px] text-grafite-suave">
                      Versão {consentimento.versaoTexto} · aceito em {data(consentimento.aceitoEm)}
                    </p>
                  </div>
                ) : (
                  <p className="py-3 text-[13.5px] text-grafite-suave">Ainda não registrado. Acontece na conclusão da experiência.</p>
                )}
                <p className="rotulo mt-6 border-b border-azul/30 pb-2 text-[10.5px] text-azul">Pendências</p>
                <ul className="list-disc space-y-1.5 py-3 pl-4 text-[13.5px] text-grafite">
                  {resultado.pendencias.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="rotulo border-b border-azul/30 pb-2 text-[10.5px] text-azul">Fila de leitura da IA · textos livres</p>
                {resultado.filaIA.length === 0 && <p className="py-3 text-[13px] text-grafite-suave">Nenhum texto respondido.</p>}
                <ul>
                  {resultado.filaIA.map((f) => (
                    <li key={f.perguntaId} className="flex items-baseline justify-between gap-4 border-b border-azul/10 py-2 text-[13px]">
                      <span>
                        <span className="font-mono text-[12px] text-grafite-suave">#{f.numero}</span>{" "}
                        <span className="text-grafite">{f.alimenta}</span>
                      </span>
                      <span className="whitespace-nowrap font-mono text-[11.5px] text-grafite-suave">{f.caracteres} car.</span>
                    </li>
                  ))}
                </ul>
                <p className="rotulo mt-6 text-[10px] text-grafite-suave">
                  Sessão iniciada em {data(sessao.iniciadaEm)}
                  {sessao.concluidaEm ? ` · concluída em ${data(sessao.concluidaEm)}` : ""} · etapa atual {String(sessao.capituloAtual).padStart(2, "0")}{" "}
                  ({capituloPorNumero(sessao.capituloAtual).nome})
                </p>
              </div>
            </div>
          </Secao>
        </div>
      )}
    </main>
  );
}
