"use client";

import { useEffect, useRef } from "react";
import { CONFIG } from "@/lib/config";
import type { Criacao } from "@/lib/criacao/tipos";
import LinhaDeVoo from "./LinhaDeVoo";

// Tela de resposta: a primeira leitura da fragrância, na voz da marca.
// Mostra só a parte "usuario" da criação: sem percentuais, sem número de catálogo, sem pontuação de perfil.
// A proposta técnica (fórmula) fica nos bastidores e no banco, para o perfumista.

type Props = {
  nome?: string;
  criacao: Criacao;
  persistido: boolean;
  onBaixar: () => void;
  onRecomecar: () => void;
};

const CAMADA = { saida: "Saída", coracao: "Coração", fundo: "Fundo" } as const;

export default function ResultadoScreen({ nome, criacao, persistido, onBaixar, onRecomecar }: Props) {
  const titulo = useRef<HTMLHeadingElement>(null);
  const u = criacao.usuario;

  useEffect(() => {
    titulo.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, []);

  const primeiroNome = nome?.split(/\s+/)[0];

  return (
    <main className="flex min-h-[100svh] flex-col">
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-12 sm:px-8 lg:px-12 lg:pt-16">
        <p className="rotulo flex justify-between gap-4 text-[10.5px] text-grafite-suave">
          <span>ICARUS · Olfactory Experience</span>
          <span>Primeira leitura</span>
        </p>

        {/* Abertura */}
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-7">
            <h1
              ref={titulo}
              tabIndex={-1}
              className="font-serif text-[clamp(46px,6.6vw,96px)] leading-[0.95] text-azul outline-none [overflow-wrap:anywhere] texto-equilibrado animate-entrada"
            >
              {primeiroNome ? `${primeiroNome}, ` : ""}
              <em className="italic">{primeiroNome ? u.titulo : u.titulo.replace(/^./, (l) => l.toUpperCase())}</em>
            </h1>
            <div className="mt-8 max-w-[58ch] space-y-4 text-[18px] leading-relaxed text-grafite texto-bonito animate-entrada [animation-delay:100ms]">
              {u.abertura.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/marca/foto-embalagem.jpg"
              alt="Frasco e caixa ICARUS sobre fundo escuro, com lavanda e papel de seda."
              className="h-[340px] w-full object-cover sm:h-[420px] lg:h-auto lg:max-h-[560px] lg:object-contain lg:object-top"
            />
          </div>
        </div>
      </div>

      {/* Pirâmide */}
      <section aria-labelledby="piramide" className="mx-auto mt-20 w-full max-w-[1280px] px-4 sm:px-8 lg:mt-28 lg:px-12">
        <h2 id="piramide" className="rotulo border-t border-azul pt-4 text-[11px] text-azul">
          Como ela se desenha
        </h2>
        <ol className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
          {u.piramide.map((c, i) => (
            <li key={c.camada} className="flex flex-col">
              <p className="rotulo text-[10.5px] text-grafite-suave">
                <span className="font-mono text-azul">{String(i + 1).padStart(2, "0")}</span> · {CAMADA[c.camada]}
              </p>
              <h3 className="mt-3 font-serif text-[34px] leading-tight text-azul">{c.titulo}</h3>
              <p className="mt-3 text-[16.5px] leading-relaxed text-grafite">{c.texto}</p>
              {c.notas.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Notas de ${CAMADA[c.camada].toLowerCase()}`}>
                  {c.notas.map((n) => (
                    <li key={n} className="rotulo border border-azul/25 px-2.5 py-1.5 text-[10.5px] text-azul">
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Concentração e pele */}
      <section aria-label="Concentração e comportamento na pele" className="mx-auto mt-20 w-full max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <dl className="grid border-y border-azul/20 md:grid-cols-2">
          <div className="py-6 md:pr-8">
            <dt className="rotulo text-[10.5px] text-grafite-suave">Concentração</dt>
            <dd className="mt-2">
              <span className="block font-serif text-[30px] leading-tight text-azul">{u.concentracao.nome}</span>
              <span className="mt-2 block text-[16px] leading-relaxed text-grafite">{u.concentracao.texto}</span>
            </dd>
          </div>
          <div className="border-t border-azul/20 py-6 md:border-l md:border-t-0 md:pl-8">
            <dt className="rotulo text-[10.5px] text-grafite-suave">Na sua pele</dt>
            <dd className="mt-2 text-[16px] leading-relaxed text-grafite">{u.naPele}</dd>
          </div>
        </dl>
      </section>

      {/* Por quê */}
      {u.porque.length > 0 && (
        <section aria-labelledby="porque" className="mx-auto mt-20 w-full max-w-[1280px] px-4 sm:px-8 lg:px-12">
          <h2 id="porque" className="rotulo border-t border-azul pt-4 text-[11px] text-azul">
            O que você contou e virou perfume
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {u.porque.map((p) => (
              <li key={`${p.pergunta}-${p.texto.slice(0, 12)}`} className="border-l border-aurora pl-4">
                <p className="rotulo text-[10px] text-grafite-suave">
                  Pergunta <span className="font-mono">{String(p.pergunta).padStart(2, "0")}</span>
                </p>
                <p className="mt-2 text-[16px] leading-relaxed text-grafite">{p.texto}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Fechamento no azul */}
      <section aria-label="Próximo passo" className="sobre-azul grao relative mt-24 overflow-hidden bg-azul text-papel">
        <div className="relative z-[2] mx-auto w-full max-w-[1280px] px-4 pb-44 pt-16 sm:px-8 lg:px-12 lg:pb-48">
          <p className="rotulo text-[10.5px] text-aurora">Próximo passo</p>
          <p className="mt-6 max-w-[34ch] font-serif text-[clamp(28px,3.4vw,44px)] leading-[1.12]">{u.fechamento}</p>
          <p className="mt-6 max-w-[62ch] text-[14px] leading-relaxed text-papel/75">
            Esta leitura foi escrita pela nossa inteligência de perfumaria a partir das suas respostas.
            {persistido ? " Ela fica guardada com a sua experiência." : " Nesta versão de teste, ela fica guardada só neste navegador."}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={onBaixar} className="rotulo h-12 bg-papel px-6 text-[11.5px] font-medium text-azul hover:bg-branco">
              Baixar minhas respostas
            </button>
            <button type="button" onClick={onRecomecar} className="rotulo h-12 border border-papel/40 px-6 text-[11.5px] text-papel hover:border-papel">
              Recomeçar do início
            </button>
            {CONFIG.mostrarLinkBastidores && (
              <a
                href="/bastidores"
                className="rotulo inline-flex h-12 items-center justify-center px-2 text-[10.5px] text-papel/75 underline decoration-papel/40 underline-offset-4 hover:text-papel"
              >
                Equipe ICARUS · ver a proposta técnica
              </a>
            )}
          </div>
        </div>
        <LinhaDeVoo className="z-[2] h-[120px] sm:h-[170px]" />
      </section>
    </main>
  );
}
