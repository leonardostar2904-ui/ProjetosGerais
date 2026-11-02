"use client";

import { useState } from "react";
import type { Pergunta } from "@/lib/questionario/tipos";
import OpcaoCartao from "./OpcaoCartao";

type Props = {
  pergunta: Pergunta;
  valor: string[] | undefined;
  onChange: (valor: string[]) => void;
  descritoPor?: string;
};

function grade(variante: Pergunta["variante"]) {
  switch (variante) {
    case "familias":
      return "grid gap-3 sm:grid-cols-2 [&>*:first-child]:sm:col-span-2 [&>*:first-child>span:first-of-type]:sm:aspect-[16/7]";
    case "bebidas":
      return "grid gap-2";
    case "cartoes-descricao":
    case "clima":
      return "grid gap-2.5 sm:grid-cols-2";
    default:
      return "grid gap-2.5 sm:grid-cols-2";
  }
}

export default function MultipleChoiceCard({ pergunta, valor = [], onChange, descritoPor }: Props) {
  const [aviso, setAviso] = useState("");
  const limite = pergunta.maxSelecoes ?? Infinity;
  const opcoes = pergunta.opcoes ?? [];
  const exclusivas = opcoes.filter((o) => o.exclusiva).map((o) => o.valor);
  const cheio = valor.length >= limite;
  const idAviso = `${pergunta.id}-limite`;

  function alternar(v: string) {
    if (valor.includes(v)) {
      onChange(valor.filter((x) => x !== v));
      setAviso("");
      return;
    }
    if (exclusivas.includes(v)) {
      onChange([v]);
      setAviso("");
      return;
    }
    const semExclusivas = valor.filter((x) => !exclusivas.includes(x));
    if (semExclusivas.length >= limite) {
      setAviso(`Limite de ${limite} escolhas. Desmarque uma para trocar.`);
      return;
    }
    onChange([...semExclusivas, v]);
    setAviso("");
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rotulo text-[10.5px] text-grafite-suave" aria-hidden="true">
          {valor.length} de {limite === Infinity ? opcoes.length : limite} escolhas
        </span>
      </div>
      <div className={grade(pergunta.variante)}>
        {opcoes.map((o, i) => {
          const marcado = valor.includes(o.valor);
          const bloqueado = !marcado && cheio && !o.exclusiva && !valor.some((x) => exclusivas.includes(x));
          return (
            <OpcaoCartao
              key={o.valor}
              tipo="multipla"
              nome={pergunta.id}
              opcao={o}
              indice={i}
              marcado={marcado}
              bloqueado={bloqueado}
              variante={pergunta.variante}
              descritoPor={[descritoPor, bloqueado ? idAviso : undefined].filter(Boolean).join(" ") || undefined}
              onAlternar={() => alternar(o.valor)}
            />
          );
        })}
      </div>
      <p id={idAviso} aria-live="polite" className="mt-3 min-h-[1.25rem] text-[14px] text-grafite-suave">
        {aviso || (cheio && limite !== Infinity ? `Você escolheu ${limite}. Para trocar, desmarque uma.` : "")}
      </p>
    </div>
  );
}
