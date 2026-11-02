"use client";

import type { Pergunta } from "@/lib/questionario/tipos";

// Campo discreto, sublinhado. A variante "tres-palavras" mostra os três espaços da resposta.

type Props = {
  pergunta: Pergunta;
  valor: string | string[] | undefined;
  onChange: (valor: string | string[]) => void;
  idCampo: string;
  descritoPor?: string;
};

const campo =
  "w-full border-0 border-b border-azul/30 bg-transparent px-0 pb-2.5 pt-2 text-[19px] text-azul placeholder:text-grafite-suave/70 " +
  "transition-[border-color,box-shadow] duration-200 focus:border-azul focus:shadow-[0_1px_0_0_#0D1B2A] focus:outline-none focus:ring-0";

export default function ShortTextInput({ pergunta, valor, onChange, idCampo, descritoPor }: Props) {
  if (pergunta.tipo === "tres-palavras") {
    const palavras = Array.isArray(valor) ? [...valor, "", "", ""].slice(0, 3) : ["", "", ""];
    return (
      <div className="grid gap-5 sm:grid-cols-3 sm:gap-4">
        {palavras.map((p, i) => (
          <label key={i} className="block">
            <span className="rotulo mb-1 block text-[10px] text-grafite-suave">Palavra {i + 1}</span>
            <input
              id={i === 0 ? idCampo : undefined}
              type="text"
              value={p}
              maxLength={40}
              autoComplete="off"
              aria-describedby={descritoPor}
              onChange={(e) => {
                const novo = [...palavras];
                novo[i] = e.target.value.replace(/\s{2,}/g, " ");
                onChange(novo);
              }}
              className={campo}
            />
          </label>
        ))}
      </div>
    );
  }

  return (
    <input
      id={idCampo}
      type="text"
      value={typeof valor === "string" ? valor : ""}
      maxLength={60}
      autoComplete="given-name"
      placeholder={pergunta.placeholder}
      aria-describedby={descritoPor}
      aria-required={pergunta.obrigatoria || undefined}
      onChange={(e) => onChange(e.target.value)}
      className={`${campo} max-w-[460px]`}
    />
  );
}
