"use client";

import type { Pergunta } from "@/lib/questionario/tipos";
import OpcaoCartao from "./OpcaoCartao";

type Props = {
  pergunta: Pergunta;
  valor: string | undefined;
  onChange: (valor: string | undefined) => void;
  descritoPor?: string;
};

function grade(variante: Pergunta["variante"], quantidade: number) {
  switch (variante) {
    case "estacoes":
      return "grid grid-cols-2 gap-2.5 sm:grid-cols-4";
    case "investimento":
      return "grid grid-cols-2 gap-2.5 sm:grid-cols-4";
    case "reproducao":
      return "grid gap-2.5";
    default:
      return quantidade <= 3 ? "grid gap-2.5" : "grid gap-2.5 sm:grid-cols-2";
  }
}

export default function SingleChoiceCard({ pergunta, valor, onChange, descritoPor }: Props) {
  const opcoes = pergunta.opcoes ?? [];
  return (
    <div>
      <div className={grade(pergunta.variante, opcoes.length)}>
        {opcoes.map((o, i) => (
          <OpcaoCartao
            key={o.valor}
            tipo="unica"
            nome={pergunta.id}
            opcao={o}
            indice={i}
            marcado={valor === o.valor}
            variante={pergunta.variante}
            descritoPor={descritoPor}
            onAlternar={() => onChange(o.valor)}
          />
        ))}
      </div>
      {!pergunta.obrigatoria && valor !== undefined && (
        <button
          type="button"
          onClick={(e) => {
            const grupo = e.currentTarget.parentElement;
            onChange(undefined);
            requestAnimationFrame(() => grupo?.querySelector<HTMLInputElement>("input")?.focus());
          }}
          className="rotulo -my-2 mt-1 py-3 text-[10.5px] text-grafite-suave underline decoration-nevoa underline-offset-4 hover:text-azul"
        >
          Limpar resposta
        </button>
      )}
    </div>
  );
}
