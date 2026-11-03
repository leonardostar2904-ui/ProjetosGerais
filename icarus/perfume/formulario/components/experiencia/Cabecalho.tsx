"use client";

import type { ProgressoGeral } from "@/lib/questionario/progresso";
import ProgressTracker from "./ProgressTracker";
import { ContadorGeral } from "./QuestionCounter";

// Cabeçalho fixo: wordmark em Plex Mono (regra do brand book para o nome em texto),
// identificação da experiência, indicador de dez segmentos e o atalho para voltar.

type Props = {
  capitulo: number;
  nomeCapitulo: string;
  concluidos: number[];
  progressoCapitulo: number;
  progresso: ProgressoGeral;
  aviso: string | null;
  onVoltar: () => void;
};

export default function Cabecalho({ capitulo, nomeCapitulo, concluidos, progressoCapitulo, progresso, aviso, onVoltar }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b [@media(max-height:500px)]:static border-azul/15 bg-papel/95 supports-[backdrop-filter]:bg-papel/90 supports-[backdrop-filter]:backdrop-blur-sm">
      <div className="mx-auto max-w-[1280px] px-4 pb-3 pt-3 sm:px-8 lg:px-12 lg:pt-4">
        <div className="flex items-center justify-between gap-4">
          <p className="rotulo flex items-center gap-2 text-[11px] text-azul">
            <span className="font-medium tracking-[0.3em]">ICARUS</span>
            <span className="hidden text-grafite-suave sm:inline">· Olfactory Experience</span>
          </p>
          <button
            type="button"
            onClick={onVoltar}
            className="rotulo -mr-2 h-11 px-2 text-[10.5px] text-grafite-suave underline decoration-nevoa underline-offset-4 hover:text-azul"
          >
            Etapa anterior
          </button>
        </div>
        <div className="mt-3">
          <ProgressTracker atual={capitulo} concluidos={concluidos} progressoAtual={progressoCapitulo} />
        </div>
        <div className="mt-2.5 flex items-baseline justify-between gap-4">
          <p className="min-w-0 truncate text-[13px] text-grafite-suave">
            <span className="rotulo mr-2 text-[10.5px] text-azul">Etapa {String(capitulo).padStart(2, "0")} de 10</span>
            <span className="hidden sm:inline">{nomeCapitulo}</span>
          </p>
          <ContadorGeral progresso={progresso} />
        </div>
        <p aria-live="polite" className="rotulo h-0 overflow-visible text-[10.5px] text-azul">
          {aviso && (
            <span className="relative top-1.5 inline-block bg-mar px-2 py-1 animate-surgir">{aviso}</span>
          )}
        </p>
      </div>
    </header>
  );
}
