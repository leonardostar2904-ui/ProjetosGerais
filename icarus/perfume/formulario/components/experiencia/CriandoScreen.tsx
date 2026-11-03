"use client";

import { useEffect, useRef } from "react";
import LinhaDeVoo from "./LinhaDeVoo";

// Espera da criação. Só mostra etapas que o servidor realmente anunciou: nada de barra de progresso inventada.

type Props = {
  nome?: string;
  etapas: string[];
};

export default function CriandoScreen({ nome, etapas }: Props) {
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titulo.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, []);

  const ultima = etapas.length - 1;

  return (
    <main className="sobre-azul relative flex min-h-[100svh] flex-col overflow-hidden bg-azul text-papel" aria-busy="true">
      <div className="relative z-[2] mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-4 pb-44 pt-16 sm:px-8 lg:px-12 lg:pb-48">
        <p className="rotulo text-[10.5px] text-papel/70">ICARUS · Olfactory Experience</p>
        <h1
          ref={titulo}
          tabIndex={-1}
          className="mt-8 max-w-[18ch] font-serif text-[clamp(44px,6.6vw,96px)] leading-[0.98] outline-none [overflow-wrap:anywhere] texto-equilibrado animate-entrada"
        >
          {nome ? `${nome}, estamos` : "Estamos"} <em className="italic text-aurora">compondo a sua fragrância.</em>
        </h1>
        <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-papel/85 animate-entrada [animation-delay:100ms]">
          Lemos o que você contou e cruzamos com o nosso catálogo de matérias-primas. Isso pode levar alguns minutos. Deixe esta tela aberta.
        </p>

        <ol className="mt-12 max-w-[620px] space-y-3 border-l border-papel/25 pl-5" aria-live="polite" aria-label="O que está acontecendo agora">
          {etapas.map((t, i) => (
            <li key={`${i}-${t}`} className={`flex items-start gap-3 text-[15px] leading-snug animate-entrada ${i === ultima ? "text-papel" : "text-papel/55"}`}>
              <span aria-hidden="true" className={`mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full ${i === ultima ? "bg-aurora motion-safe:animate-pulse" : "bg-papel/40"}`} />
              <span className="[overflow-wrap:anywhere]">
                {t}
                {i < ultima && <span className="sr-only"> (feito)</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <LinhaDeVoo className="h-[120px] sm:h-[170px]" />
    </main>
  );
}
