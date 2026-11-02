"use client";

import type { ProgressoGeral } from "@/lib/questionario/progresso";
import type { Pergunta } from "@/lib/questionario/tipos";

// Duas leituras de avanço:
// "geral": quantas perguntas aplicáveis já foram respondidas (sem arredondar para cima).
// "capitulo": o índice das perguntas da etapa, com o estado de cada uma. Toque para ir até ela.

type EstadoMarcador = "respondida" | "pendente" | "opcional" | "pulada";

export function ContadorGeral({ progresso, compacto }: { progresso: ProgressoGeral; compacto?: boolean }) {
  return (
    <p className="rotulo whitespace-nowrap text-[10.5px] text-grafite-suave" aria-live="polite" aria-atomic="true">
      <span className="font-medium text-azul">{progresso.respondidas}</span>
      {compacto ? "/" : " de "}
      {progresso.aplicaveis}
      {compacto ? "" : " perguntas"}
      {!compacto && progresso.naoAplicaveis > 0 && (
        <span className="hidden lg:inline">
          {" "}
          · {progresso.naoAplicaveis} não se aplica{progresso.naoAplicaveis > 1 ? "m" : ""}
        </span>
      )}
      <span className="sr-only">
        {" "}
        respondidas. {progresso.percentual}% do total que se aplica a você.
      </span>
    </p>
  );
}

export default function QuestionCounter({
  perguntas,
  estados,
  onIr,
}: {
  perguntas: Pergunta[];
  estados: Record<string, EstadoMarcador>;
  onIr: (id: string) => void;
}) {
  const respondidas = perguntas.filter((p) => estados[p.id] === "respondida").length;
  return (
    <div>
      <p className="rotulo mb-2.5 text-[10.5px] text-grafite-suave">
        Nesta etapa · {respondidas} de {perguntas.length}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {perguntas.map((p) => {
          const e = estados[p.id];
          const legenda =
            e === "respondida" ? "respondida" : e === "pendente" ? "falta responder" : e === "pulada" ? "pulada" : "opcional, em branco";
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onIr(p.id)}
                className={`grid h-8 min-w-[2.25rem] place-items-center px-1.5 font-mono text-[12px] transition-colors duration-200 ${
                  e === "respondida"
                    ? "bg-azul text-papel"
                    : e === "pendente"
                      ? "border border-azul text-azul hover:bg-azul/5"
                      : "border border-dashed border-grafite-suave/60 text-grafite-suave hover:border-azul hover:text-azul"
                }`}
              >
                <span className="sr-only">Ir para a pergunta {p.numero}, {legenda}</span>
                <span aria-hidden="true">{String(p.numero).padStart(2, "0")}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
