"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as A from "@/lib/armazenamento";
import { pedirCriacao } from "@/lib/criacao/cliente";
import type { CodigoErroCriacao } from "@/lib/criacao/tipos";
import { capituloPorNumero } from "@/lib/questionario/capitulos";
import { perguntaPorNumero, VERSAO_QUESTIONARIO } from "@/lib/questionario/perguntas";
import { aplicavel, estadoCapitulo, perguntasDoCapitulo, progressoGeral, respondida } from "@/lib/questionario/progresso";
import type { Respostas, Valor } from "@/lib/questionario/tipos";
import Abertura from "./Abertura";
import Cabecalho from "./Cabecalho";
import ChapterHeader from "./ChapterHeader";
import ChapterNavigation from "./ChapterNavigation";
import CompletionScreen from "./CompletionScreen";
import ConditionalQuestion from "./ConditionalQuestion";
import CriandoScreen from "./CriandoScreen";
import LinhaDeVoo from "./LinhaDeVoo";
import QuestionBlock from "./QuestionBlock";
import ResultadoScreen from "./ResultadoScreen";

// Orquestra a experiência: carrega e salva a sessão, navega entre as 10 etapas (inclusive pelo botão
// voltar do navegador), valida obrigatórias, registra opcionais puladas e conclui com consentimento.

type Fase = "carregando" | "abertura" | "capitulo" | "convite" | "concluido";
type Destino = { fase: Fase; capitulo: number };

const dois = (n: number) => String(n).padStart(2, "0");

// Estado da leitura por IA depois de concluir.
type Leitura =
  | { estado: "nao_pedida"; persistido: boolean }
  | { estado: "criando"; etapas: string[]; persistido: boolean }
  | { estado: "pronta"; persistido: boolean }
  | { estado: "indisponivel"; persistido: boolean }
  | { estado: "falhou"; mensagem: string; persistido: boolean };

const MENSAGEM_ERRO: Record<CodigoErroCriacao, string> = {
  nao_configurado: "a leitura automática ainda não está ligada",
  pedido_invalido: "as respostas não chegaram completas ao servidor",
  limite_diario: "atingimos o limite de leituras de hoje",
  recusa: "a leitura não pôde ser composta",
  tempo_esgotado: "a composição demorou mais do que o esperado",
  falha_ia: "a nossa inteligência de perfumaria não respondeu como devia",
  falha_rede: "a conexão caiu no meio do caminho",
};

// ── Histórico do navegador ──
// Cada etapa vira uma âncora (#etapa-3). Entradas novas usam estado nulo: o roteador do Next.js ignora
// essas entradas e não recarrega a página. Uma pilha local acompanha a posição no histórico para que o
// "Voltar" do app use o mesmo histórico do navegador (sem criar entradas que o voltar do celular desfaria).
const pilha: { itens: string[]; pos: number } = { itens: [], pos: -1 };

function ancora(fase: Fase, capitulo: number): string {
  if (fase === "abertura") return "#abertura";
  if (fase === "convite") return "#conclusao";
  if (fase === "concluido") return "#concluido";
  return `#etapa-${capitulo}`;
}

function lerAncora(): Destino | null {
  const h = window.location.hash;
  if (h === "#abertura") return { fase: "abertura", capitulo: 1 };
  if (h === "#conclusao") return { fase: "convite", capitulo: 10 };
  if (h === "#concluido") return { fase: "concluido", capitulo: 10 };
  const m = h.match(/^#etapa-(\d{1,2})$/);
  if (m && Number(m[1]) >= 2 && Number(m[1]) <= 10) return { fase: "capitulo", capitulo: Number(m[1]) };
  return null;
}

function registrar(modo: "push" | "replace", fase: Fase, capitulo: number) {
  const hash = ancora(fase, capitulo);
  const url = window.location.pathname + window.location.search + hash;
  if (modo === "push") {
    window.history.pushState(null, "", url);
    pilha.itens = [...pilha.itens.slice(0, pilha.pos + 1), hash];
    pilha.pos = pilha.itens.length - 1;
  } else {
    window.history.replaceState(window.history.state, "", url);
    if (pilha.pos < 0) {
      pilha.itens = [hash];
      pilha.pos = 0;
    } else pilha.itens[pilha.pos] = hash;
  }
}

function sincronizarPilha(hash: string) {
  if (pilha.itens[pilha.pos - 1] === hash) pilha.pos -= 1;
  else if (pilha.itens[pilha.pos + 1] === hash) pilha.pos += 1;
  else {
    pilha.itens = [hash];
    pilha.pos = 0;
  }
}

/** Primeira etapa com obrigatória em branco antes do destino (ninguém pula etapa pela URL ou pelo histórico). */
function etapaBloqueante(destino: Destino, r: Respostas): number | null {
  const limite = destino.fase === "convite" || destino.fase === "concluido" ? 11 : destino.fase === "abertura" ? 1 : destino.capitulo;
  for (let n = 1; n < limite; n++) if (estadoCapitulo(n, r).obrigatoriasFaltando.length) return n;
  return null;
}

function semMovimento() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Experience() {
  const [banco, setBanco] = useState<A.Banco | null>(null);
  const [fase, setFase] = useState<Fase>("carregando");
  const [capitulo, setCapitulo] = useState(1);
  const [erros, setErros] = useState<string[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState("");
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const tituloAberturaRef = useRef<HTMLHeadingElement>(null);
  const primeiraCarga = useRef(true);
  const [leitura, setLeitura] = useState<Leitura>({ estado: "nao_pedida", persistido: false });
  const pedidoAtivo = useRef<AbortController | null>(null);

  useEffect(() => () => pedidoAtivo.current?.abort(), []);

  // Um único aviso falado por ação. Limpa antes para o leitor repetir a mensagem se ela for igual.
  const anunciar = useCallback((mensagem: string) => {
    setAnuncio("");
    requestAnimationFrame(() => setAnuncio(mensagem));
  }, []);

  // Carrega a sessão salva (ou cria uma nova) e retoma de onde a pessoa parou.
  useEffect(() => {
    const salvo = A.carregarBanco();
    const anterior = A.sessaoAtual(salvo);
    if (anterior?.status === "concluida") {
      setBanco(salvo);
      setFase("concluido");
      registrar("replace", "concluido", 10);
      return;
    }
    const b = A.garantirSessao(salvo);
    const s = A.sessaoAtual(b)!;
    setBanco(b);
    if (s.capituloAtual > 1) {
      setCapitulo(s.capituloAtual);
      setFase("capitulo");
      setAviso(`Você voltou. Seguimos da etapa ${dois(s.capituloAtual)}.`);
      registrar("replace", "capitulo", s.capituloAtual);
    } else {
      setFase("abertura");
      registrar("replace", "abertura", 1);
    }
  }, []);

  useEffect(() => {
    if (banco) A.salvarBanco(banco);
  }, [banco]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3400);
    return () => clearTimeout(t);
  }, [aviso]);

  const sessao = banco ? A.sessaoAtual(banco) : null;
  const sid = sessao?.id ?? null;
  const respostas = useMemo(() => (banco ? A.respostasDaSessao(banco, sid) : {}), [banco, sid]);
  const progresso = useMemo(() => progressoGeral(respostas), [respostas]);

  const aplicarFase = useCallback(
    (novaFase: Fase, novoCapitulo: number) => {
      setFase(novaFase);
      setCapitulo(novoCapitulo);
      setErros([]);
      setAnuncio("");
      if (sid && (novaFase === "capitulo" || novaFase === "abertura")) {
        setBanco((b) => (b ? A.atualizarSessao(b, sid, { capituloAtual: novaFase === "abertura" ? 1 : novoCapitulo }) : b));
      }
    },
    [sid],
  );

  const irPara = useCallback(
    (novaFase: Fase, novoCapitulo: number, mensagem?: string) => {
      aplicarFase(novaFase, novoCapitulo);
      if (mensagem) setAviso(mensagem);
      registrar("push", novaFase, novoCapitulo);
    },
    [aplicarFase],
  );

  // Botão voltar e avançar do navegador (e âncora digitada na URL): navega entre etapas sem sair da
  // experiência e sem permitir pular etapa com obrigatória em branco.
  useEffect(() => {
    function aoMudarHistorico() {
      sincronizarPilha(window.location.hash);
      const destino = lerAncora();
      if (!destino) return;
      if (fase === "concluido") {
        registrar("push", "concluido", 10);
        return;
      }
      if (destino.fase === "concluido") {
        registrar("replace", fase, capitulo);
        return;
      }
      const bloqueio = etapaBloqueante(destino, respostas);
      if (bloqueio !== null) {
        const faseBloqueio: Fase = bloqueio === 1 ? "abertura" : "capitulo";
        aplicarFase(faseBloqueio, bloqueio);
        registrar("replace", faseBloqueio, bloqueio);
        setAviso(`Responda a etapa ${dois(bloqueio)} antes de seguir.`);
        return;
      }
      aplicarFase(destino.fase, destino.capitulo);
    }
    window.addEventListener("popstate", aoMudarHistorico);
    return () => window.removeEventListener("popstate", aoMudarHistorico);
  }, [fase, capitulo, respostas, aplicarFase]);

  // Outra aba mudou os dados (ex.: "Apagar dados de teste" nos bastidores): recarrega em vez de sobrescrever.
  useEffect(() => {
    function aoMudarArmazenamento(e: StorageEvent) {
      if (e.key !== A.CHAVE_ARMAZENAMENTO) return;
      const novo = A.carregarBanco();
      const s = A.sessaoAtual(novo);
      if (!s || s.status !== "em_andamento") {
        if (s?.status === "concluida") {
          setBanco(novo);
          setFase("concluido");
          registrar("replace", "concluido", 10);
          return;
        }
        setBanco(A.garantirSessao(novo));
        setFase("abertura");
        setCapitulo(1);
        registrar("replace", "abertura", 1);
        return;
      }
      setBanco(novo);
    }
    window.addEventListener("storage", aoMudarArmazenamento);
    return () => window.removeEventListener("storage", aoMudarArmazenamento);
  }, []);

  // Foco por teclado nunca fica atrás do cabeçalho ou do rodapé fixos (complementa o scroll-padding do CSS).
  useEffect(() => {
    if (fase !== "capitulo") return;
    function aoFocar(e: FocusEvent) {
      const el = e.target as HTMLElement | null;
      if (!el || !(el instanceof HTMLElement) || el.closest("header, footer")) return;
      const alvo = (el.closest("label") ?? el) as HTMLElement;
      const r = alvo.getBoundingClientRect();
      const cab = document.querySelector("header");
      const rod = document.querySelector("footer");
      const topoLivre = cab && getComputedStyle(cab).position === "sticky" ? cab.getBoundingClientRect().bottom : 0;
      const baseLivre = rod && getComputedStyle(rod).position === "sticky" ? rod.getBoundingClientRect().top : window.innerHeight;
      if (r.top < topoLivre + 8) window.scrollBy({ top: r.top - topoLivre - 16 });
      else if (r.bottom > baseLivre - 8) {
        const cabe = r.height < baseLivre - topoLivre - 32;
        window.scrollBy({ top: cabe ? r.bottom - baseLivre + 16 : r.top - topoLivre - 16 });
      }
    }
    document.addEventListener("focusin", aoFocar);
    return () => document.removeEventListener("focusin", aoFocar);
  }, [fase]);

  // A cada troca de etapa: volta ao topo e leva o foco ao título (leitores de tela anunciam a etapa).
  useEffect(() => {
    if (fase !== "capitulo" && fase !== "abertura") return;
    if (fase === "abertura" && primeiraCarga.current) {
      primeiraCarga.current = false;
      return;
    }
    primeiraCarga.current = false;
    window.scrollTo({ top: 0, behavior: "auto" });
    const alvo = fase === "capitulo" ? tituloRef : tituloAberturaRef;
    const t = setTimeout(() => alvo.current?.focus({ preventScroll: true }), 30);
    return () => clearTimeout(t);
  }, [fase, capitulo]);

  const responder = useCallback(
    (id: string, valor: Valor | undefined) => {
      if (!sid) return;
      setBanco((b) => (b ? A.registrarResposta(b, sid, id, valor) : b));
      setErros((es) => es.filter((e) => e !== id));
    },
    [sid],
  );

  // Leva a pergunta para logo abaixo do cabeçalho fixo e põe o foco no primeiro controle dela.
  const focar = useCallback((id: string) => {
    const secao = document.getElementById(`p-${id}`);
    if (!secao) return;
    const alturaCabecalho = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const cabecalhoFixo = document.querySelector("header") && getComputedStyle(document.querySelector("header")!).position === "sticky";
    const topo = secao.getBoundingClientRect().top + window.scrollY - (cabecalhoFixo ? alturaCabecalho : 0) - 20;
    window.scrollTo({ top: Math.max(0, topo), behavior: semMovimento() ? "auto" : "smooth" });
    const alvo = secao.querySelector<HTMLElement>("input:not([aria-disabled='true']), textarea, button");
    setTimeout(() => alvo?.focus({ preventScroll: true }), semMovimento() ? 0 : 420);
  }, []);

  const concluirCapitulo = useCallback(
    (numero: number) => {
      if (!sid) return;
      setBanco((b) => {
        if (!b) return b;
        const comPuladas = A.marcarPuladas(b, sid, numero);
        const s = A.sessaoAtual(comPuladas);
        const concluidos = Array.from(new Set([...(s?.capitulosConcluidos ?? []), numero])).sort((x, y) => x - y);
        return A.atualizarSessao(comPuladas, sid, { capitulosConcluidos: concluidos });
      });
    },
    [sid],
  );

  const comecar = useCallback(() => {
    const est = estadoCapitulo(1, respostas);
    if (est.obrigatoriasFaltando.length) {
      setErros(["q01"]);
      anunciar("Escolha ao menos uma motivação para começar.");
      document.querySelector<HTMLInputElement>('input[name="q01"]')?.focus();
      return;
    }
    concluirCapitulo(1);
    irPara("capitulo", 2, "Etapa 01 concluída.");
  }, [respostas, concluirCapitulo, irPara, anunciar]);

  const continuar = useCallback(() => {
    const est = estadoCapitulo(capitulo, respostas);
    if (est.obrigatoriasFaltando.length) {
      const ids = est.obrigatoriasFaltando.map((p) => p.id);
      const nums = est.obrigatoriasFaltando.map((p) => p.numero).join(", ");
      setErros(ids);
      anunciar(`Para seguir, ${ids.length > 1 ? `faltam as perguntas ${nums}` : `falta a pergunta ${nums}`}.`);
      focar(ids[0]);
      return;
    }
    concluirCapitulo(capitulo);
    if (capitulo === 10) {
      const bloqueio = etapaBloqueante({ fase: "convite", capitulo: 10 }, respostas);
      if (bloqueio !== null) {
        irPara(bloqueio === 1 ? "abertura" : "capitulo", bloqueio, `Responda a etapa ${dois(bloqueio)} antes de concluir.`);
        return;
      }
      setFase("convite");
      setErros([]);
      registrar("push", "convite", 10);
    } else {
      irPara("capitulo", capitulo + 1, `Etapa ${dois(capitulo)} concluída.`);
    }
  }, [capitulo, respostas, focar, concluirCapitulo, irPara, anunciar]);

  // "Voltar" do app: se a etapa anterior é a entrada anterior do histórico, usa o próprio histórico.
  const voltar = useCallback(() => {
    let alvo: Destino | null = null;
    if (fase === "convite") alvo = { fase: "capitulo", capitulo: 10 };
    else if (fase === "capitulo" && capitulo <= 2) alvo = { fase: "abertura", capitulo: 1 };
    else if (fase === "capitulo") alvo = { fase: "capitulo", capitulo: capitulo - 1 };
    if (!alvo) return;
    if (pilha.pos > 0 && pilha.itens[pilha.pos - 1] === ancora(alvo.fase, alvo.capitulo)) {
      window.history.back();
      return;
    }
    aplicarFase(alvo.fase, alvo.capitulo);
    registrar("replace", alvo.fase, alvo.capitulo);
  }, [fase, capitulo, aplicarFase]);

  // Envia a sessão concluída ao servidor, acompanha as etapas e guarda a leitura que voltar.
  const gerarLeitura = useCallback(async (b: A.Banco, sessaoId: string) => {
    pedidoAtivo.current?.abort();
    const controle = new AbortController();
    pedidoAtivo.current = controle;
    setLeitura({ estado: "criando", etapas: ["Enviando as suas respostas"], persistido: false });
    const final = await pedirCriacao(
      A.exportarSessao(b, sessaoId),
      (e) => {
        if (e.tipo === "etapa" || e.tipo === "busca") {
          setLeitura((l) => (l.estado === "criando" && l.etapas.at(-1) !== e.texto ? { ...l, etapas: [...l.etapas, e.texto].slice(-8) } : l));
        }
      },
      controle.signal,
    );
    if (controle.signal.aborted) return;
    pedidoAtivo.current = null;
    if (final.tipo === "resultado") {
      setBanco((atual) => (atual ? A.guardarCriacao(atual, sessaoId, final.criacao, final.persistido) : atual));
      setLeitura({ estado: "pronta", persistido: final.persistido });
      return;
    }
    if (final.codigo === "nao_configurado") {
      setLeitura({ estado: "indisponivel", persistido: false });
      return;
    }
    setLeitura({ estado: "falhou", mensagem: MENSAGEM_ERRO[final.codigo], persistido: false });
  }, []);

  const concluir = useCallback(() => {
    if (!sid || !banco) return;
    const bloqueio = etapaBloqueante({ fase: "convite", capitulo: 10 }, respostas);
    if (bloqueio !== null) {
      irPara(bloqueio === 1 ? "abertura" : "capitulo", bloqueio, `Responda a etapa ${dois(bloqueio)} antes de concluir.`);
      return;
    }
    const concluido = A.concluirSessao(banco, sid);
    setBanco(concluido);
    setFase("concluido");
    registrar("replace", "concluido", 10);
    void gerarLeitura(concluido, sid);
  }, [sid, banco, respostas, irPara, gerarLeitura]);

  const recomecar = useCallback(() => {
    const ok = window.confirm("Recomeçar abre uma experiência nova, do início. As respostas anteriores continuam guardadas neste navegador. Recomeçar agora?");
    if (!ok) return;
    pedidoAtivo.current?.abort();
    pedidoAtivo.current = null;
    setLeitura({ estado: "nao_pedida", persistido: false });
    setBanco((b) => (b ? A.iniciarSessao(b) : b));
    setFase("abertura");
    setCapitulo(1);
    setErros([]);
    registrar("replace", "abertura", 1);
  }, []);

  const baixar = useCallback(() => {
    if (!banco || !sid || !sessao) return;
    const dados = { experiencia: "ICARUS Olfactory Experience", questionario: VERSAO_QUESTIONARIO, ...A.exportarSessao(banco, sid) };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "icarus-minhas-respostas.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [banco, sid, sessao]);

  const avisoLeitor = (
    <p className="sr-only" aria-live="assertive">
      {anuncio}
    </p>
  );

  if (fase === "carregando" || !banco) {
    return (
      <main className="grid min-h-[100svh] place-items-center" aria-busy="true">
        <p className="rotulo text-[10.5px] text-grafite-suave">Preparando a sua experiência</p>
      </main>
    );
  }

  if (fase === "abertura") {
    return (
      <>
        {avisoLeitor}
        <Abertura
          ref={tituloAberturaRef}
          valor={respostas.q01}
          onChange={(v) => responder("q01", v)}
          erro={erros.includes("q01")}
          onComecar={comecar}
          concluidos={sessao?.capitulosConcluidos ?? []}
        />
      </>
    );
  }

  if (fase === "convite") {
    return <CompletionScreen fase="convite" onConcluir={concluir} onRevisar={voltar} />;
  }

  if (fase === "concluido") {
    const nome = typeof respostas.q02 === "string" ? respostas.q02.trim() : undefined;
    const criacao = A.criacaoDaSessao(banco, sid);
    if (criacao) {
      return <ResultadoScreen nome={nome} criacao={criacao} persistido={Boolean(criacao.persistido)} onBaixar={baixar} onRecomecar={recomecar} />;
    }
    if (leitura.estado === "criando") return <CriandoScreen nome={nome?.split(/\s+/)[0]} etapas={leitura.etapas} />;
    return (
      <CompletionScreen
        fase="concluido"
        nome={nome}
        progresso={progresso}
        leitura={leitura.estado === "pronta" ? { estado: "nao_pedida", persistido: leitura.persistido } : leitura}
        onGerar={() => sid && void gerarLeitura(banco, sid)}
        onBaixar={baixar}
        onRecomecar={recomecar}
      />
    );
  }

  // Etapas 02 a 10
  const cap = capituloPorNumero(capitulo);
  const lista = perguntasDoCapitulo(capitulo);
  const est = estadoCapitulo(capitulo, respostas);
  const progressoCapitulo = est.aplicaveis.length ? est.respondidas / est.aplicaveis.length : 0;
  const estados: Record<string, "respondida" | "pendente" | "opcional" | "pulada"> = {};
  for (const p of est.aplicaveis) {
    if (respondida(p, respostas[p.id])) estados[p.id] = "respondida";
    else if (A.statusDaPergunta(banco, sid, p.id) === "pulada") estados[p.id] = "pulada";
    else estados[p.id] = p.obrigatoria ? "pendente" : "opcional";
  }
  const final = lista.find((p) => p.variante === "final");
  const normais = lista.filter((p) => p.variante !== "final");

  const bloco = (numero: number) => {
    const p = perguntaPorNumero(numero);
    return (
      <QuestionBlock
        pergunta={p}
        valor={respostas[p.id]}
        onChange={(v) => responder(p.id, v)}
        erro={erros.includes(p.id)}
        pulada={estados[p.id] === "pulada"}
      />
    );
  };

  return (
    <div className="flex min-h-[100svh] flex-col">
      {avisoLeitor}
      <a href="#perguntas" className="rotulo sr-only z-50 bg-azul px-3 py-2 text-papel focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Ir para as perguntas
      </a>
      <Cabecalho
        capitulo={capitulo}
        nomeCapitulo={cap.nome}
        concluidos={sessao?.capitulosConcluidos ?? []}
        progressoCapitulo={progressoCapitulo}
        progresso={progresso}
        aviso={aviso}
        onVoltar={voltar}
      />

      <main data-etapa={capitulo} className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div key={capitulo} className="grid gap-12 animate-entrada lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[150px] lg:max-h-[calc(100svh-250px)] lg:overflow-y-auto lg:pb-4 lg:[scrollbar-width:thin]">
              <ChapterHeader ref={tituloRef} capitulo={cap} perguntas={est.aplicaveis} estados={estados} onIr={focar} />
            </div>
          </div>

          <div id="perguntas" className="max-w-[680px] space-y-16 lg:col-span-7 lg:pt-2">
            {normais.map((p, i) => {
              const grupo = cap.grupos?.find((g) => g.id === p.grupo);
              const novoGrupo = grupo && normais[i - 1]?.grupo !== p.grupo;
              const conteudo = p.condicao ? (
                <ConditionalQuestion key={p.id} visivel={aplicavel(p, respostas)} numero={p.numero}>
                  {bloco(p.numero)}
                </ConditionalQuestion>
              ) : (
                <div key={p.id}>{bloco(p.numero)}</div>
              );
              if (!novoGrupo) return conteudo;
              return (
                <div key={`g-${p.id}`} className="space-y-8">
                  <h2 className="flex items-baseline gap-3 border-t border-azul/25 pt-3">
                    <span className="rotulo text-[10.5px] font-medium text-azul">Grupo {grupo.id}</span>
                    <span className="rotulo text-[10.5px] text-grafite-suave">{grupo.rotulo}</span>
                  </h2>
                  {conteudo}
                </div>
              );
            })}
          </div>
        </div>

        {final && (
          <section
            aria-label="Última pergunta"
            className="sobre-azul grao relative -mx-4 mt-20 overflow-hidden bg-azul px-5 pb-40 pt-14 sm:mx-0 sm:px-10 lg:px-16 lg:pb-48 lg:pt-20"
          >
            <div className="relative z-[2] max-w-[900px]">
              <p className="rotulo mb-8 text-[10.5px] text-aurora">Última pergunta</p>
              <QuestionBlock
                pergunta={final}
                valor={respostas[final.id]}
                onChange={(v) => responder(final.id, v)}
                erro={false}
                sobreAzul
              />
            </div>
            <LinhaDeVoo className="z-[2] h-[150px]" />
          </section>
        )}
      </main>

      <ChapterNavigation
        capitulo={capitulo}
        respondidas={est.respondidas}
        aplicaveis={est.aplicaveis.length}
        faltando={est.obrigatoriasFaltando.length}
        opcionaisEmBranco={est.opcionaisEmBranco.length}
        rotuloContinuar={capitulo === 10 ? "Finalizar" : "Continuar"}
        onVoltar={voltar}
        onContinuar={continuar}
      />
    </div>
  );
}
