"use client";

import { useEffect, useRef, useState } from "react";
import type { Pergunta } from "@/lib/questionario/tipos";

// Área de escrita que cresce com o texto. Na variante "rotina" ela também se expande ao receber foco.
// Na variante "final" (pergunta 52) o campo é desenhado para o painel azul.

type Props = {
  pergunta: Pergunta;
  valor: string | undefined;
  onChange: (valor: string) => void;
  idCampo: string;
  descritoPor?: string;
  sobreAzul?: boolean;
  invalido?: boolean;
};

export default function LongTextInput({ pergunta, valor, onChange, idCampo, descritoPor, sobreAzul, invalido }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focado, setFocado] = useState(false);
  const texto = valor ?? "";

  const minimo = pergunta.variante === "rotina" ? (focado || texto ? 220 : 132) : pergunta.variante === "final" ? 160 : 128;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(minimo, el.scrollHeight + 2)}px`;
  }, [texto, minimo]);

  const estilo = sobreAzul
    ? "border-0 border-b border-papel/35 bg-transparent px-0 text-[20px] leading-relaxed text-papel placeholder:text-papel/75 focus:border-papel focus:shadow-[0_1px_0_0_#EAE6DF]"
    : "border border-azul/40 bg-branco px-4 py-3.5 text-[17px] leading-relaxed text-grafite placeholder:text-grafite-suave hover:border-azul/60 focus:border-azul focus:shadow-[inset_0_0_0_1px_#0D1B2A]";

  return (
    <textarea
      ref={ref}
      id={idCampo}
      value={texto}
      maxLength={1500}
      rows={3}
      placeholder={pergunta.placeholder}
      aria-describedby={descritoPor}
      aria-invalid={invalido || undefined}
      onFocus={() => setFocado(true)}
      onBlur={() => setFocado(false)}
      onChange={(e) => onChange(e.target.value)}
      className={`block w-full resize-none transition-[height,border-color,box-shadow] duration-300 ease-out focus:outline-none focus:ring-0 ${estilo}`}
    />
  );
}
