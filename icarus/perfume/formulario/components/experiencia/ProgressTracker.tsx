"use client";

import { capitulos } from "@/lib/questionario/capitulos";

// Indicador de dez segmentos. Concluído: azul profundo. Atual: mais alto, com preenchimento em azul mar
// proporcional às perguntas respondidas no capítulo. Futuro: névoa.

type Props = {
  atual: number;
  concluidos: number[];
  /** De 0 a 1: respondidas sobre aplicáveis no capítulo atual. */
  progressoAtual: number;
  sobreAzul?: boolean;
};

export default function ProgressTracker({ atual, concluidos, progressoAtual, sobreAzul }: Props) {
  return (
    <div role="group" aria-label="Progresso da experiência">
      <ol className="grid grid-cols-10 items-end gap-[3px] sm:gap-1">
        {capitulos.map((c) => {
          const concluido = concluidos.includes(c.numero) && c.numero !== atual;
          const ehAtual = c.numero === atual;
          const estado = ehAtual ? "atual" : concluido ? "concluída" : "a seguir";
          return (
            <li key={c.numero} className="relative" aria-current={ehAtual ? "step" : undefined}>
              <span className="sr-only">
                Etapa {c.numero} de 10, {c.nome}, {estado}
              </span>
              {ehAtual ? (
                <span
                  aria-hidden="true"
                  className={`block h-[6px] overflow-hidden border-b ${sobreAzul ? "border-papel bg-papel/20" : "border-azul bg-nevoa"}`}
                >
                  <span
                    className="block h-full bg-mar transition-[width] duration-500 ease-out"
                    style={{ width: `${Math.round(Math.min(1, Math.max(0, progressoAtual)) * 100)}%` }}
                  />
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className={`block h-[3px] transition-colors duration-500 ${
                    concluido ? (sobreAzul ? "bg-papel" : "bg-azul") : sobreAzul ? "bg-papel/20" : "bg-nevoa"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
