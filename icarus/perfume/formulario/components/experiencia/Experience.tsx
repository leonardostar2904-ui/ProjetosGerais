"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as A from "@/lib/armazenamento";
import { capituloPorNumero } from "@/lib/questionario/capitulos";
import { perguntaPorNumero, VERSAO_QUESTIONARIO } from "@/lib/questionario/perguntas";
import { aplicavel, estadoCapitulo, perguntasDoCapitulo, progressoGeral, respondida } from "@/lib/questionario/progresso";
import type { Valor } from "@/lib/questionario/tipos";
import Abertura from "./Abertura";
import Cabecalho from "./Cabecalho";
import ChapterHeader from "./ChapterHeader";
import ChapterNavigation from "./ChapterNavigation";
import CompletionScreen from "./CompletionScreen";
import ConditionalQuestion from "./ConditionalQuestion";
import QuestionBlock from "./QuestionBlock";

// Orquestra a experiência: carrega e salva a sessão, navega entre as 10 etapas (inclusive pelo botão
// voltar do navegador), valida obrigatórias, registra opcionais puladas e conclui com consentimento.

type Fase = "carregando" | "abertura" | "capitulo" | "convite" | "concluido";
type EstadoHistorico = { fase: Fase; capitulo: number };

const dois = (n: number) => String(n).padStart(2, "0");

// Histórico do navegador por âncora (#etapa-3). Entradas novas usam estado nulo: o roteador do
// Next.js ignora essas entradas e não recarrega a página; a âncora diz qual etapa mostrar.
function ancora(fase: Fase, capitulo: number): string {
  if (fase === "abertura") return "#abertura";
  if (fase === "convite") return "#conclusao";
  if (fase === "concluido") return "#concluido";
  return `#etapa-${capitulo}`;
}

function lerAncora(): EstadoHistorico | null {
  const h = window.location.hash;
  if (h === "#abertura") return { fase: "abertura", capitulo: 1 };
  if (h === "#conclusao") return { fase: "convite", capitulo: 10 };
  if (h === "#concluido") return { fase: "concluido", capitulo: 10 };
  const m = h.match(/^#etapa-(\d{1,2})$/);
  if (m && Number(m[1]) >= 2 && Number(m[1]) <= 10) return { fase: "capitulo", capitulo: Number(m[1]) };
  return null;
}

function registrar(modo: "push" | "replace", fase: Fase, capitulo: number) {
  const url = window.location.pathname + window.location.search + ancora(fase, capitulo);
  if (modo === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(window.history.state, "", url);
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

  // Botão voltar do navegador e do celular: navega entre etapas sem sair da experiência.
  useEffect(() => {
    function aoVoltar() {
      const destino = lerAncora();
      if (!destino) return;
      if (fase === "concluido") {
        registrar("push", "concluido", 10);
        return;
      }
      if (destino.fase === "concluido") return;
      aplicarFase(destino.fase, destino.capitulo);
    }
    window.addEventListener("popstate", aoVoltar);
    return () => window.removeEventListener("popstate", aoVoltar);
  }, [fase, aplicarFase]);

  // A cada troca de etapa: volta ao topo e leva o foco ao título (leitores de tela anunciam a etapa).
  useEffect(() => {
    if (fase !== "capitulo") return;
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => tituloRef.current?.focus({ preventScroll: true }), 30);
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

  const focar = useCallback((id: string) => {
    const secao = document.getElementById(`p-${id}`);
    secao?.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "center" });
    const alvo = secao?.querySelector<HTMLElement>("input:not([aria-disabled='true']), textarea, button");
    setTimeout(() => alvo?.focus({ preventScroll: true }), semMovimento() ? 0 : 380);
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
      setFase("convite");
      registrar("push", "convite", 10);
    } else {
      irPara("capitulo", capitulo + 1, `Etapa ${dois(capitulo)} concluída.`);
    }
  }, [capitulo, respostas, focar, concluirCapitulo, irPara, anunciar]);

  const voltar = useCallback(() => {
    if (fase === "convite") return irPara("capitulo", 10);
    if (fase === "capitulo" && capitulo <= 2) return irPara("abertura", 1);
    if (fase === "capitulo") return irPara("capitulo", capitulo - 1);
  }, [fase, capitulo, irPara]);

  const concluir = useCallback(() => {
    if (!sid) return;
    setBanco((b) => (b ? A.concluirSessao(b, sid) : b));
    setFase("concluido");
    registrar("replace", "concluido", 10);
  }, [sid]);

  const recomecar = useCallback(() => {
    const ok = window.confirm("Recomeçar abre uma experiência nova, do início. As respostas anteriores continuam guardadas neste navegador. Recomeçar agora?");
    if (!ok) return;
    setBanco((b) => (b ? A.iniciarSessao(b) : b));
    setFase("abertura");
    setCapitulo(1);
    setErros([]);
    registrar("replace", "abertura", 1);
    window.scrollTo({ top: 0 });
  }, []);

  const baixar = useCallback(() => {
    if (!banco || !sid || !sessao) return;
    const dados = {
      experiencia: "ICARUS Olfactory Experience",
      questionario: VERSAO_QUESTIONARIO,
      exportadoEm: new Date().toISOString(),
      sessao,
      contato: banco.contato.find((c) => c.consumidorId === sessao.consumidorId) ?? null,
      respostas: Object.values(banco.respostas[sid] ?? {}),
      dadosSensiveis: Object.values(banco.dadosSensiveis[sid] ?? {}),
      consentimento: banco.consentimentos.find((c) => c.sessaoId === sid) ?? null,
    };
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
      <div className="grid min-h-[100svh] place-items-center" aria-busy="true">
        <p className="rotulo text-[10.5px] text-grafite-suave">Preparando a sua experiência</p>
      </div>
    );
  }

  if (fase === "abertura") {
    return (
      <>
        {avisoLeitor}
        <Abertura valor={respostas.q01} onChange={(v) => responder("q01", v)} erro={erros.includes("q01")} onComecar={comecar} />
      </>
    );
  }

  if (fase === "convite") {
    return <CompletionScreen fase="convite" onConcluir={concluir} onRevisar={voltar} />;
  }

  if (fase === "concluido") {
    return (
      <CompletionScreen
        fase="concluido"
        nome={typeof respostas.q02 === "string" ? respostas.q02.trim() : undefined}
        progresso={progresso}
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
            <div className="lg:sticky lg:top-[150px] lg:max-h-[calc(100svh-170px)] lg:overflow-y-auto lg:pb-4 lg:[scrollbar-width:thin]">
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
                  <div className="flex items-baseline gap-3 border-t border-azul/25 pt-3">
                    <span className="rotulo text-[10.5px] font-medium text-azul">Grupo {grupo.id}</span>
                    <span className="rotulo text-[10.5px] text-grafite-suave">{grupo.rotulo}</span>
                  </div>
                  {conteudo}
                </div>
              );
            })}
          </div>
        </div>

        {final && (
          <section className="sobre-azul grao relative -mx-4 mt-20 overflow-hidden bg-azul px-5 pb-40 pt-14 sm:mx-0 sm:px-10 lg:px-16 lg:pb-48 lg:pt-20">
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
            <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[150px] w-full" aria-hidden="true">
              <path
                d="M -10 182 C 240 182, 360 160, 500 116 C 570 94, 628 84, 640 110 C 652 138, 600 154, 578 128 C 552 98, 668 64, 840 58 C 990 52, 1110 36, 1210 20"
                fill="none"
                stroke="#E7AE8E"
                strokeWidth="5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
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
