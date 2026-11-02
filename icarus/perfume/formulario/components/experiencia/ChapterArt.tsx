"use client";

import { useEffect, useState } from "react";
import type { ArteCapitulo } from "@/lib/questionario/tipos";

// Composições de cada capítulo. Traço fino (1 px), sem ícones e sem ilustração figurativa,
// como pede o brand book: "estrutura à vista, um elemento escapa".

const AZUL = "#0D1B2A";

function Rotina() {
  // Linha do dia. O marcador "agora" usa o horário do aparelho: um detalhe pessoal, sem coletar nada.
  const [pos, setPos] = useState<number | null>(null);
  useEffect(() => {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    setPos(Math.min(1, Math.max(0, (h - 6) / 17)));
  }, []);
  const marcas = [
    { x: 0, t: "Manhã", alinhamento: "translate-x-0" },
    { x: 0.5, t: "Tarde", alinhamento: "-translate-x-1/2" },
    { x: 1, t: "Noite", alinhamento: "-translate-x-full" },
  ];
  const alinharAgora = pos === null ? "" : pos < 0.12 ? "translate-x-0 left-0" : pos > 0.88 ? "-translate-x-full left-full" : "-translate-x-1/2 left-1/2";
  return (
    <div className="relative h-16 w-full max-w-[420px]" aria-hidden="true">
      <div className="absolute left-0 right-0 top-6 h-px bg-azul/40" />
      {marcas.map((m) => (
        <div key={m.t} className="absolute top-3 w-px" style={{ left: `calc(${m.x * 100}% - ${m.x}px)` }}>
          <div className="h-6 w-px bg-azul/60" />
          <span className={`rotulo absolute left-0 top-7 whitespace-nowrap text-[10px] text-grafite-suave ${m.alinhamento}`}>{m.t}</span>
        </div>
      ))}
      {pos !== null && (
        <div className="absolute top-[19px] w-[11px] transition-[left] duration-700" style={{ left: `calc(${pos * 100}% - ${pos * 11}px)` }}>
          <div className="h-[11px] w-[11px] bg-azul" />
          <span className={`rotulo absolute -top-5 whitespace-nowrap text-[9.5px] text-azul ${alinharAgora}`}>Agora</span>
        </div>
      )}
    </div>
  );
}

function Essencia() {
  return (
    <svg viewBox="0 0 320 40" className="h-10 w-full max-w-[320px]" aria-hidden="true">
      <line x1="10" y1="20" x2="310" y2="20" stroke={AZUL} strokeOpacity="0.3" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={10 + i * 75 - 5} y="15" width="10" height="10" fill={i === 2 ? AZUL : "#EAE6DF"} stroke={AZUL} strokeOpacity="0.6" />
      ))}
    </svg>
  );
}

function Conexoes() {
  const nos = [
    { x: 128, y: 104, r: 74 },
    { x: 238, y: 70, r: 40 },
    { x: 262, y: 160, r: 24 },
    { x: 46, y: 46, r: 14 },
    { x: 330, y: 120, r: 9 },
    { x: 72, y: 176, r: 7 },
  ];
  const ligacoes: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [0, 5], [2, 4]];
  return (
    <svg viewBox="0 0 360 210" className="h-auto w-full max-w-[360px]" aria-hidden="true">
      {ligacoes.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={nos[a].x} y1={nos[a].y} x2={nos[b].x} y2={nos[b].y} stroke={AZUL} strokeOpacity="0.28" />
      ))}
      {nos.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={AZUL} strokeOpacity={0.55 - i * 0.05} />
          <rect x={n.x - 2} y={n.y - 2} width="4" height="4" fill={AZUL} />
        </g>
      ))}
    </svg>
  );
}

function Memorias() {
  // Pirâmide olfativa como régua de laboratório (manual, seção 2.1).
  const camadas = [
    { t: "Topo", d: "5 a 30 min" },
    { t: "Coração", d: "20 min a 4 h" },
    { t: "Fundo", d: "4 a 24 h" },
  ];
  return (
    <div className="w-full max-w-[380px]" aria-hidden="true">
      {camadas.map((c, i) => (
        <div key={c.t} className="flex items-baseline justify-between border-t border-azul/25 py-2.5 last:border-b">
          <span className="font-serif text-[26px] italic leading-none text-azul" style={{ paddingLeft: `${i * 18}px` }}>
            {c.t}
          </span>
          <span className="rotulo text-[10px] text-grafite-suave">{c.d}</span>
        </div>
      ))}
    </div>
  );
}

function Presenca() {
  const raios = [14, 30, 48, 68, 90, 114];
  return (
    <svg viewBox="0 0 300 130" className="h-auto w-full max-w-[300px]" aria-hidden="true">
      {raios.map((r, i) => (
        <circle key={r} cx="150" cy="122" r={r} fill="none" stroke={AZUL} strokeOpacity={0.6 - i * 0.09} />
      ))}
      <rect x="147" y="119" width="6" height="6" fill={AZUL} />
      <line x1="0" y1="129.5" x2="300" y2="129.5" stroke="#EAE6DF" strokeWidth="14" />
      <line x1="0" y1="122.5" x2="300" y2="122.5" stroke={AZUL} strokeOpacity="0.25" />
    </svg>
  );
}

function Cuidados() {
  return <div className="h-px w-24 bg-azul/50" aria-hidden="true" />;
}

function Pele() {
  return (
    <svg viewBox="0 0 320 44" className="h-11 w-full max-w-[320px]" aria-hidden="true">
      <line x1="0" y1="30.5" x2="320" y2="30.5" stroke={AZUL} strokeOpacity="0.45" />
      {Array.from({ length: 41 }).map((_, i) => (
        <line key={i} x1={i * 8 + 0.5} y1={i % 5 === 0 ? 18 : 25} x2={i * 8 + 0.5} y2="30" stroke={AZUL} strokeOpacity={i % 5 === 0 ? 0.6 : 0.3} />
      ))}
      {[
        { x: 40, t: "A" },
        { x: 160, t: "B" },
        { x: 280, t: "C" },
      ].map((g) => (
        <text key={g.t} x={g.x} y="11" textAnchor="middle" fontSize="10" letterSpacing="1.4" fill={AZUL} style={{ fontFamily: "var(--font-plex)" }}>
          {g.t}
        </text>
      ))}
    </svg>
  );
}

function Criacao() {
  return (
    <figure className="w-full max-w-[400px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/marca/foto-embalagem.jpg"
        alt="Caixa da ICARUS em papel, frasco de vidro, ramos secos de lavanda e uma pétala sobre fundo escuro"
        loading="lazy"
        className="aspect-[4/5] w-full object-cover"
      />
      <figcaption className="rotulo mt-2.5 flex justify-between gap-4 text-[10px] text-grafite-suave">
        <span>Embalagem em estudo</span>
        <span>Mockup</span>
      </figcaption>
    </figure>
  );
}

function Final() {
  return <div className="h-[3px] w-14 bg-aurora" aria-hidden="true" />;
}

export default function ChapterArt({ arte }: { arte: ArteCapitulo }) {
  switch (arte) {
    case "rotina":
      return <Rotina />;
    case "essencia":
      return <Essencia />;
    case "conexoes":
      return <Conexoes />;
    case "memorias":
      return <Memorias />;
    case "presenca":
      return <Presenca />;
    case "cuidados":
      return <Cuidados />;
    case "pele":
      return <Pele />;
    case "criacao":
      return <Criacao />;
    case "final":
      return <Final />;
    default:
      return null;
  }
}
