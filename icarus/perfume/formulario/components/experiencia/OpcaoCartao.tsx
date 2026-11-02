"use client";

import type { Opcao, VarianteVisual } from "@/lib/questionario/tipos";
import { MarcadorSelecao } from "./Marcadores";

// Cartão de opção reutilizado por SingleChoiceCard e MultipleChoiceCard.
// O input nativo (radio ou checkbox) fica dentro do label: teclado, leitor de tela e foco funcionam sem script.

type Props = {
  tipo: "unica" | "multipla";
  nome: string;
  opcao: Opcao;
  indice: number;
  marcado: boolean;
  bloqueado?: boolean;
  variante?: VarianteVisual;
  descritoPor?: string;
  onAlternar: () => void;
};

const base =
  "group relative cursor-pointer border text-left transition-[background-color,box-shadow,border-color,opacity] duration-200 " +
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-azul";

function estado(marcado: boolean, bloqueado?: boolean) {
  if (marcado) return "border-mar bg-mar-claro shadow-[inset_0_0_0_1px_#8EB1C7]";
  if (bloqueado) return "border-azul/10 bg-branco/60 opacity-55";
  return "border-azul/15 bg-branco hover:border-azul/45";
}

export function GlifoClima({ valor }: { valor: string }) {
  const comum = { fill: "none", stroke: "#0D1B2A", strokeWidth: 1, strokeLinecap: "square" as const };
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0 opacity-70" aria-hidden="true">
      {valor === "quente-umido" && (
        <>
          <circle cx="16" cy="11" r="5" {...comum} />
          <path d="M6 22c3-2 5 2 8 0s5 2 8 0 4 1 4 1M6 27c3-2 5 2 8 0s5 2 8 0 4 1 4 1" {...comum} />
        </>
      )}
      {valor === "quente-seco" && (
        <>
          <circle cx="16" cy="16" r="5" {...comum} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            return <line key={i} x1={16 + Math.cos(a) * 8} y1={16 + Math.sin(a) * 8} x2={16 + Math.cos(a) * 12} y2={16 + Math.sin(a) * 12} {...comum} />;
          })}
        </>
      )}
      {valor === "ameno" && (
        <>
          <circle cx="16" cy="16" r="9" {...comum} />
          <path d="M16 7a9 9 0 0 1 0 18z" fill="#0D1B2A" />
        </>
      )}
      {valor === "frio" && <path d="M16 5v22M6.5 10.5l19 11M6.5 21.5l19-11" {...comum} />}
      {valor === "varia" && (
        <>
          <circle cx="16" cy="16" r="9" {...comum} />
          <path d="M16 7v18M7 16h18" {...comum} />
        </>
      )}
    </svg>
  );
}

export default function OpcaoCartao({ tipo, nome, opcao, indice, marcado, bloqueado, variante = "padrao", descritoPor, onAlternar }: Props) {
  const input = (
    <input
      type={tipo === "unica" ? "radio" : "checkbox"}
      name={nome}
      value={opcao.valor}
      checked={marcado}
      onChange={onAlternar}
      aria-disabled={bloqueado || undefined}
      aria-describedby={descritoPor}
      className="sr-only"
    />
  );
  const numero = String(indice + 1).padStart(2, "0");

  if (variante === "familias") {
    return (
      <label className={`${base} ${estado(marcado, bloqueado)} flex flex-col overflow-hidden`}>
        {input}
        <span className="relative block aspect-[4/3] overflow-hidden bg-azul">
          {opcao.imagem && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={opcao.imagem}
              alt={opcao.imagemAlt ?? ""}
              loading="lazy"
              className={`h-full w-full object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] ${marcado ? "saturate-[0.85]" : ""}`}
            />
          )}
          <span className="rotulo absolute left-3 top-3 bg-azul/85 px-1.5 py-[3px] text-[10px] text-papel">Nº {numero}</span>
        </span>
        <span className="flex items-start gap-3 px-4 pb-4 pt-3.5">
          <MarcadorSelecao tipo={tipo} marcado={marcado} />
          <span className="block">
            <span className="block text-[17px] font-semibold leading-tight text-azul">{opcao.rotulo}</span>
            {opcao.descricao && <span className="mt-1 block text-[14px] leading-snug text-grafite-suave">{opcao.descricao}</span>}
          </span>
        </span>
      </label>
    );
  }

  if (variante === "estacoes") {
    return (
      <label className={`${base} ${estado(marcado, bloqueado)} flex min-h-[132px] flex-col justify-between px-4 py-3.5`}>
        {input}
        <span className="flex items-start justify-between gap-2">
          <span className="rotulo text-[10px] text-grafite-suave">{opcao.descricao}</span>
          <MarcadorSelecao tipo={tipo} marcado={marcado} />
        </span>
        <span className="font-serif text-[30px] italic leading-none text-azul">{opcao.rotulo}</span>
      </label>
    );
  }

  if (variante === "bebidas") {
    return (
      <label className={`${base} ${estado(marcado, bloqueado)} flex items-center gap-4 px-4 py-3`}>
        {input}
        <MarcadorSelecao tipo={tipo} marcado={marcado} />
        <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
          <span className="font-serif text-[27px] leading-tight text-azul">{opcao.rotulo}</span>
          {opcao.descricao && <span className="rotulo text-[10.5px] text-grafite-suave">{opcao.descricao}</span>}
        </span>
      </label>
    );
  }

  if (variante === "investimento") {
    return (
      <label className={`${base} ${estado(marcado, bloqueado)} flex min-h-[96px] flex-col justify-between gap-3 px-4 py-3.5`}>
        {input}
        <span className="flex items-start justify-between">
          <span className="rotulo text-[10px] text-grafite-suave">Faixa {numero}</span>
          <MarcadorSelecao tipo={tipo} marcado={marcado} />
        </span>
        <span className="font-mono text-[16px] font-medium leading-tight text-azul">{opcao.rotulo}</span>
      </label>
    );
  }

  const comDescricao = !!opcao.descricao;
  return (
    <label
      className={`${base} ${estado(marcado, bloqueado)} flex items-start gap-3 px-4 ${comDescricao ? "py-3.5" : "min-h-[52px] py-3"} ${
        variante === "reproducao" ? "py-4" : ""
      }`}
    >
      {input}
      <MarcadorSelecao tipo={tipo} marcado={marcado} />
      <span className="block flex-1">
        <span className={`block leading-snug ${marcado ? "text-azul" : "text-grafite"} ${variante === "reproducao" ? "text-[17px] font-semibold text-azul" : "text-[16px]"}`}>
          {opcao.rotulo}
        </span>
        {comDescricao && <span className="mt-1 block text-[14px] leading-snug text-grafite-suave">{opcao.descricao}</span>}
      </span>
      {variante === "clima" && <GlifoClima valor={opcao.valor} />}
    </label>
  );
}
