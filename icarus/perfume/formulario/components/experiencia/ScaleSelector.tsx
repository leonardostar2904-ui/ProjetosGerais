"use client";

import type { Pergunta } from "@/lib/questionario/tipos";

// Seletor horizontal de cinco posições (radios nativos: setas do teclado funcionam).
// O trilho preenche até a posição escolhida; o número escolhido fica em azul profundo.

type Props = {
  pergunta: Pergunta;
  valor: number | undefined;
  onChange: (valor: number | undefined) => void;
  descritoPor?: string;
  sobreAzul?: boolean;
};

function Projecao({ valor }: { valor: number | undefined }) {
  const v = valor ?? 0;
  const raios = [10, 22, 36, 52, 70];
  return (
    <svg viewBox="0 0 320 96" className="mb-4 h-24 w-full" aria-hidden="true">
      <line x1="0" y1="95.5" x2="320" y2="95.5" stroke="#0D1B2A" strokeOpacity="0.15" />
      {raios.map((r, i) => (
        <path
          key={r}
          d={`M ${160 - r} 95 A ${r} ${r} 0 0 1 ${160 + r} 95`}
          fill="none"
          stroke="#0D1B2A"
          strokeWidth="1"
          style={{ transition: "stroke-opacity 260ms ease, stroke 260ms ease" }}
          strokeOpacity={i < v ? 0.75 - i * 0.11 : 0.08}
        />
      ))}
      <rect x="157" y="88" width="6" height="6" fill={v ? "#0D1B2A" : "#4A4E55"} />
    </svg>
  );
}

export default function ScaleSelector({ pergunta, valor, onChange, descritoPor, sobreAzul }: Props) {
  const min = pergunta.escala?.min ?? "";
  const max = pergunta.escala?.max ?? "";
  const pct = valor ? ((valor - 1) / 4) * 100 : 0;
  const cor = sobreAzul ? "text-papel" : "text-azul";

  return (
    <div>
      {pergunta.variante === "projecao" && <Projecao valor={valor} />}
      <div className="relative mx-auto max-w-[460px]">
        <div aria-hidden="true" className="absolute left-[22px] right-[22px] top-1/2 h-px -translate-y-1/2 bg-azul/20" />
        <div
          aria-hidden="true"
          className="absolute left-[22px] top-1/2 h-[3px] -translate-y-1/2 bg-mar transition-[width] duration-300 ease-out"
          style={{ width: `calc((100% - 44px) * ${pct / 100})` }}
        />
        <div className="relative flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((n) => {
            const marcado = valor === n;
            const rotuloAcessivel = n === 1 ? `1 de 5, ${min}` : n === 5 ? `5 de 5, ${max}` : `${n} de 5`;
            return (
              <label
                key={n}
                className={`relative grid h-11 w-11 cursor-pointer place-items-center border font-mono text-[15px] transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-azul ${
                  marcado
                    ? "border-azul bg-azul text-papel"
                    : valor && n < valor
                      ? "border-mar bg-mar-claro text-azul"
                      : "border-azul/30 bg-branco text-azul hover:border-azul/70"
                }`}
              >
                <input
                  type="radio"
                  name={pergunta.id}
                  value={n}
                  checked={marcado}
                  onChange={() => onChange(n)}
                  aria-label={rotuloAcessivel}
                  aria-describedby={descritoPor}
                  className="sr-only"
                />
                <span aria-hidden="true">{n}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div className={`mx-auto mt-3 flex max-w-[460px] justify-between gap-6 ${cor}`} aria-hidden="true">
        <span className="rotulo max-w-[46%] text-[10.5px] leading-snug">{min}</span>
        <span className="rotulo max-w-[46%] text-right text-[10.5px] leading-snug">{max}</span>
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
