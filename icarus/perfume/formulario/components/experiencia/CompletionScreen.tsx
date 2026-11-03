"use client";

import { useEffect, useRef, useState } from "react";
import { TEXTO_CONSENTIMENTO } from "@/lib/armazenamento";
import { CONFIG } from "@/lib/config";
import type { ProgressoGeral } from "@/lib/questionario/progresso";
import LinhaDeVoo from "./LinhaDeVoo";

// Encerramento em duas partes:
// "convite": depois da última pergunta, no azul (o voo acontece no azul), com consentimento e botão de concluir.
// "concluido": tela final no papel. Não simula análise de IA nem mostra notas: só diz o que acontece depois.

type Convite = {
  fase: "convite";
  onConcluir: () => void;
  onRevisar: () => void;
};

type Concluido = {
  fase: "concluido";
  nome?: string;
  progresso: ProgressoGeral;
  /** Situação da leitura por IA quando ela não está na tela (ainda não pedida, indisponível ou com falha). */
  leitura: { estado: "nao_pedida" | "indisponivel" | "falhou"; mensagem?: string; persistido: boolean };
  onGerar: () => void;
  onBaixar: () => void;
  onRecomecar: () => void;
};

export default function CompletionScreen(props: Convite | Concluido) {
  const titulo = useRef<HTMLHeadingElement>(null);
  const [aceito, setAceito] = useState(false);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    titulo.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [props.fase]);

  if (props.fase === "convite") {
    return (
      <main className="sobre-azul relative flex min-h-[100svh] flex-col overflow-hidden bg-azul text-papel">
        <div className="relative z-[2] mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-4 pb-44 pt-16 sm:px-8 lg:px-12 lg:pb-48">
          <p className="rotulo text-[10.5px] text-papel/70">ICARUS · Olfactory Experience</p>
          <h1
            ref={titulo}
            tabIndex={-1}
            className="mt-8 max-w-[18ch] font-serif text-[clamp(44px,6.6vw,96px)] leading-[0.98] outline-none texto-equilibrado animate-entrada"
          >
            Você compartilhou sua história. <em className="italic text-aurora">Agora começa a criação da sua identidade olfativa.</em>
          </h1>

          <div className="mt-12 max-w-[620px] animate-entrada [animation-delay:120ms]">
            <label className="flex cursor-pointer items-start gap-3 border border-papel/25 p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-papel">
              <input
                type="checkbox"
                checked={aceito}
                onChange={(e) => {
                  setAceito(e.target.checked);
                  setErro(false);
                }}
                className="sr-only"
                aria-describedby={erro ? "consentimento-erro" : undefined}
              />
              <span
                aria-hidden="true"
                className={`mt-[3px] grid h-[15px] w-[15px] shrink-0 place-items-center border ${aceito ? "border-papel bg-papel" : "border-papel/60"}`}
              >
                {aceito && (
                  <svg viewBox="0 0 12 12" className="h-[10px] w-[10px]" fill="none">
                    <path d="M2 6.4 4.8 9 10 3" stroke="#0D1B2A" strokeWidth="1.6" strokeLinecap="square" />
                  </svg>
                )}
              </span>
              <span className="text-[15px] leading-relaxed text-papel/90">{TEXTO_CONSENTIMENTO.texto}</span>
            </label>
            {erro && (
              <p id="consentimento-erro" role="alert" className="mt-3 text-[14px] text-aurora">
                Para concluir, é preciso marcar a autorização acima.
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => (aceito ? props.onConcluir() : setErro(true))}
                className="rotulo h-14 bg-papel px-8 text-[12px] font-medium text-azul transition-colors hover:bg-branco"
              >
                Concluir minha experiência
              </button>
              <button type="button" onClick={props.onRevisar} className="rotulo h-12 px-4 text-[11px] text-papel/80 underline underline-offset-4 hover:text-papel">
                Voltar e revisar
              </button>
            </div>
          </div>
        </div>
        <LinhaDeVoo className="h-[120px] sm:h-[170px]" />
      </main>
    );
  }

  const { progresso, nome, leitura } = props;
  return (
    <main className="flex min-h-[100svh] flex-col">
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-4 py-12 sm:px-8 lg:px-12 lg:py-16">
        <p className="rotulo flex justify-between text-[10.5px] text-grafite-suave">
          <span>ICARUS · Olfactory Experience</span>
          <span>Experiência concluída</span>
        </p>
        <div className="mt-16 grid flex-1 gap-12 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 ref={titulo} tabIndex={-1} className="font-serif text-[clamp(48px,7vw,100px)] leading-[0.95] text-azul outline-none [overflow-wrap:anywhere] animate-entrada">
              {nome ? `${nome}, recebemos` : "Recebemos"} <em className="italic">a sua história.</em>
            </h1>
            <div className="mt-8 max-w-[56ch] space-y-4 text-[17.5px] leading-relaxed text-grafite animate-entrada [animation-delay:100ms]">
              <p>Ela é o ponto de partida da sua fragrância.</p>
              {leitura.estado === "indisponivel" && (
                <p>
                  O próximo passo é a criação: um perfumista e a nossa inteligência de perfumaria vão trabalhar a partir do que você contou. A
                  leitura automática ainda não está ligada nesta versão. Nada foi gerado agora.
                </p>
              )}
              {leitura.estado === "nao_pedida" && <p>A primeira leitura da sua fragrância está pronta para ser composta.</p>}
              {leitura.estado === "falhou" && (
                <p role="status">
                  Não conseguimos compor a sua leitura agora{leitura.mensagem ? ` (${leitura.mensagem})` : ""}. As suas respostas estão
                  guardadas. Você pode tentar de novo em alguns instantes.
                </p>
              )}
              <p className="text-[15px] text-grafite-suave">
                {leitura.persistido
                  ? "As suas respostas foram guardadas com segurança na ICARUS."
                  : "Nesta versão de teste, as respostas ficam guardadas só neste navegador."}
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 lg:pl-8">
            <dl className="grid grid-cols-3 border-y border-azul/20">
              {[
                { n: progresso.possiveis, t: "Perguntas possíveis" },
                { n: progresso.respondidas, t: "Respondidas" },
                { n: 10, t: "Capítulos" },
              ].map((x, i) => (
                <div key={x.t} className={`flex flex-col-reverse justify-end gap-2 py-4 ${i > 0 ? "border-l border-azul/20 pl-4" : ""}`}>
                  <dt className="rotulo text-[9.5px] text-grafite-suave">{x.t}</dt>
                  <dd className="font-mono text-[32px] font-medium leading-none text-azul">{x.n}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-col gap-3">
              {leitura.estado !== "indisponivel" && (
                <button type="button" onClick={props.onGerar} className="rotulo h-14 bg-azul px-6 text-[12px] font-medium text-papel hover:bg-[#1b2c40]">
                  {leitura.estado === "falhou" ? "Tentar compor de novo" : "Ver a leitura da minha fragrância"}
                </button>
              )}
              <button
                type="button"
                onClick={props.onBaixar}
                className={`rotulo h-12 px-6 text-[11.5px] ${leitura.estado === "indisponivel" ? "bg-azul font-medium text-papel hover:bg-[#1b2c40]" : "border border-azul/25 text-azul hover:border-azul"}`}
              >
                Baixar minhas respostas
              </button>
              <button type="button" onClick={props.onRecomecar} className="rotulo h-12 border border-azul/25 px-6 text-[11.5px] text-azul hover:border-azul">
                Recomeçar do início
              </button>
              {CONFIG.mostrarLinkBastidores && (
                <a href="/bastidores" className="rotulo mt-2 text-center text-[10.5px] text-grafite-suave underline decoration-nevoa underline-offset-4 hover:text-azul">
                  Equipe ICARUS · ver o cruzamento dos dados
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-16 flex items-end justify-between border-t border-azul/15 pt-5">
          <p className="rotulo text-[10.5px] text-azul">Para quem volta.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marca/simbolo-azul.png" alt="Símbolo ICARUS" className="h-12 w-auto" />
        </div>
      </div>
    </main>
  );
}
