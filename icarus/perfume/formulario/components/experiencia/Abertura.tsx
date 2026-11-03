"use client";

import { forwardRef } from "react";
import { capituloPorNumero, MINUTOS_ESTIMADOS, TOTAL_CAPITULOS } from "@/lib/questionario/capitulos";
import { perguntaPorNumero, TOTAL_PERGUNTAS } from "@/lib/questionario/perguntas";
import type { Valor } from "@/lib/questionario/tipos";
import { MensagemErro } from "./Marcadores";
import MultipleChoiceCard from "./MultipleChoiceCard";
import ProgressTracker from "./ProgressTracker";

// Etapa 01. Não é tela de formulário: é a apresentação da experiência.
// À esquerda, título e contexto; à direita, a luz de passagem da marca com a assinatura em papel.

type Props = {
  valor: Valor | undefined;
  onChange: (valor: Valor | undefined) => void;
  erro: boolean;
  onComecar: () => void;
  concluidos: number[];
};

const Abertura = forwardRef<HTMLHeadingElement, Props>(function Abertura({ valor, onChange, erro, onComecar, concluidos }, ref) {
  const cap = capituloPorNumero(1);
  const p = perguntaPorNumero(1);
  const escolhas = Array.isArray(valor) ? valor : [];

  return (
    <main className="grid min-h-[100svh] lg:grid-cols-12">
      {/* Composição visual: no celular vem primeiro, como faixa; no desktop ocupa a coluna direita. */}
      <div className="relative order-1 h-[46svh] min-h-[300px] overflow-hidden bg-azul lg:order-2 lg:col-span-5 lg:h-auto lg:min-h-[100svh] lg:overflow-visible">
        <div className="relative h-full overflow-hidden lg:sticky lg:top-0 lg:h-[100svh]">
          <div className="grao absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/marca/textura-luz-de-passagem.jpg"
              alt=""
              className="h-full w-full object-cover opacity-95"
              fetchPriority="high"
            />
          </div>
          <div className="sobre-azul absolute inset-0 z-[2] flex flex-col justify-between p-5 sm:p-8 lg:p-10">
            <p className="rotulo flex justify-between text-[10px] text-papel">
              <span className="bg-azul/75 px-1.5 py-1">ICARUS</span>
              <span className="bg-azul/75 px-1.5 py-1">Olfactory Experience</span>
            </p>
            <div className="flex items-end justify-between gap-6">
              <p className="rotulo max-w-[26ch] bg-azul/75 px-1.5 py-1 text-[10px] leading-relaxed text-papel">Luz de passagem · textura da marca</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/marca/assinatura-papel.png" alt="ICARUS" className="h-[104px] w-auto sm:h-[132px] lg:h-[168px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="order-2 flex flex-col px-4 pb-16 pt-8 sm:px-8 lg:order-1 lg:col-span-7 lg:px-14 lg:pb-20 lg:pt-12 xl:px-20">
        <div className="mb-12 max-w-[560px] lg:mb-16">
          <div className="mb-3 flex items-center justify-between">
            <p className="rotulo text-[10.5px] text-azul">
              Etapa 01 de 10 · <span className="text-grafite-suave">{cap.nome}</span>
            </p>
            <p className="rotulo text-[10.5px] text-grafite-suave">ICARUS</p>
          </div>
          <ProgressTracker atual={1} concluidos={concluidos} progressoAtual={escolhas.length ? 1 : 0} />
        </div>

        <h1 ref={ref} tabIndex={-1} className="max-w-[12ch] font-serif outline-none text-[clamp(52px,7.6vw,112px)] leading-[0.92] text-azul texto-equilibrado animate-entrada">
          {cap.titulo} <em className="italic">{cap.tituloItalico}</em>
        </h1>
        <p className="mt-8 max-w-[52ch] text-[18px] leading-relaxed text-grafite texto-bonito animate-entrada [animation-delay:80ms]">
          {cap.descricao}
        </p>

        <dl className="mt-10 grid max-w-[560px] grid-cols-3 border-y border-azul/20 animate-entrada [animation-delay:140ms]">
          {[
            { n: String(TOTAL_PERGUNTAS), t: "Perguntas possíveis" },
            { n: String(TOTAL_CAPITULOS), t: "Capítulos" },
            { n: `~${MINUTOS_ESTIMADOS}`, t: "Minutos" },
          ].map((item, i) => (
            <div key={item.t} className={`flex min-w-0 flex-col-reverse justify-end gap-2 py-4 ${i > 0 ? "border-l border-azul/20 pl-3 sm:pl-4" : ""}`}>
              <dt className="rotulo break-words text-[9.5px] leading-snug text-grafite-suave sm:text-[10px]">{item.t}</dt>
              <dd className="font-mono text-[26px] font-medium leading-none text-azul sm:text-[34px]">
                {item.n}
                {item.t === "Minutos" && <span className="sr-only"> aproximadamente</span>}
              </dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="motivacao" className="mt-12 max-w-[640px] border border-azul/15 bg-branco/70 p-5 sm:p-7">
          <p className="rotulo text-[10.5px] text-grafite-suave">Antes de começar · Pergunta 01</p>
          <h2 id="motivacao" className="mt-3 text-[21px] font-semibold leading-snug text-azul md:text-[23px]">
            {p.enunciado}
          </h2>
          <p id="q01-ajuda" className="mt-2 text-[14.5px] text-grafite-suave">
            {p.ajuda}
          </p>
          <fieldset className="mt-5" aria-describedby={`q01-ajuda${erro ? " q01-erro" : ""}`}>
            <legend className="sr-only">{p.enunciado}</legend>
            <MultipleChoiceCard pergunta={p} valor={escolhas} onChange={onChange} />
          </fieldset>
          {erro && <MensagemErro id="q01-erro" texto="Escolha ao menos uma motivação para começar." />}
        </section>

        <div className="mt-10 flex max-w-[640px] flex-col gap-5">
          <button
            type="button"
            onClick={onComecar}
            className="rotulo h-14 w-full bg-azul px-8 text-[12px] font-medium text-papel transition-colors hover:bg-[#1b2c40] sm:w-auto sm:self-start"
          >
            Começar minha experiência
          </button>
          <p className="max-w-[60ch] text-[13.5px] leading-relaxed text-grafite-suave">
            Perguntas sobre sexo, gênero, relacionamento, crenças e saúde são opcionais e ficam identificadas. Nesta versão de teste, suas
            respostas ficam guardadas só neste navegador.
          </p>
        </div>
      </div>
    </main>
  );
});

export default Abertura;
