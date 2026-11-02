"use client";

import { forwardRef } from "react";
import type { Capitulo, Pergunta } from "@/lib/questionario/tipos";
import ChapterArt from "./ChapterArt";
import QuestionCounter from "./QuestionCounter";

// Abertura de cada capítulo: número, nome da etapa, título editorial, contexto, composição e índice das perguntas.

type Props = {
  capitulo: Capitulo;
  perguntas: Pergunta[];
  estados: Record<string, "respondida" | "pendente" | "opcional" | "pulada">;
  onIr: (id: string) => void;
};

const ChapterHeader = forwardRef<HTMLHeadingElement, Props>(function ChapterHeader({ capitulo, perguntas, estados, onIr }, ref) {
  const chip = capitulo.acento === "aurora" ? "bg-aurora" : "bg-mar";
  return (
    <div className="lg:sticky lg:top-[136px]">
      <p className="rotulo flex flex-wrap items-center gap-2.5 text-[10.5px] text-grafite-suave">
        <span className={`${chip} px-1.5 py-[3px] font-medium text-azul`}>Nº {String(capitulo.numero).padStart(2, "0")}</span>
        <span>{capitulo.nome}</span>
      </p>
      <h1
        ref={ref}
        tabIndex={-1}
        className="mt-5 font-serif text-[clamp(54px,8.4vw,104px)] leading-[0.94] text-azul outline-none texto-equilibrado"
      >
        {capitulo.titulo} <em className="italic">{capitulo.tituloItalico}</em>
      </h1>
      <p className="mt-6 max-w-[38ch] text-[17px] leading-relaxed text-grafite texto-bonito">{capitulo.descricao}</p>
      <div className="mt-9">
        <ChapterArt arte={capitulo.arte} />
      </div>
      <div className="mt-9 border-t border-azul/15 pt-5">
        <QuestionCounter perguntas={perguntas} estados={estados} onIr={onIr} />
      </div>
    </div>
  );
});

export default ChapterHeader;
