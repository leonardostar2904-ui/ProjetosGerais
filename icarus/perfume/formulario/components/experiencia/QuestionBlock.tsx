"use client";

import type { Pergunta, Valor } from "@/lib/questionario/tipos";
import LongTextInput from "./LongTextInput";
import { MensagemErro, NotaReservado, SeloOpcional, SeloReservado } from "./Marcadores";
import MultipleChoiceCard from "./MultipleChoiceCard";
import ScaleSelector from "./ScaleSelector";
import ShortTextInput from "./ShortTextInput";
import SingleChoiceCard from "./SingleChoiceCard";

// Monta uma pergunta a partir da configuração: número, selos, enunciado, ajuda e o componente certo.

type Props = {
  pergunta: Pergunta;
  valor: Valor | undefined;
  onChange: (valor: Valor | undefined) => void;
  erro: boolean;
  pulada?: boolean;
  sobreAzul?: boolean;
};

export function mensagemDeErro(p: Pergunta): string {
  switch (p.tipo) {
    case "escolha-unica":
      return "Escolha uma opção para seguir.";
    case "escolha-multipla":
      return "Escolha ao menos uma opção para seguir.";
    case "escala":
      return "Marque um ponto da escala para seguir.";
    default:
      return "Responda para seguir.";
  }
}

export default function QuestionBlock({ pergunta: p, valor, onChange, erro, pulada, sobreAzul }: Props) {
  const idAjuda = `${p.id}-ajuda`;
  const idErro = `${p.id}-erro`;
  const idCampo = `${p.id}-campo`;
  const descritoPor = [p.ajuda ? idAjuda : null, erro ? idErro : null].filter(Boolean).join(" ") || undefined;
  const ehGrupo = p.tipo === "escolha-unica" || p.tipo === "escolha-multipla" || p.tipo === "escala" || p.tipo === "tres-palavras";
  const corTitulo = sobreAzul ? "text-papel" : "text-azul";
  const final = p.variante === "final";

  const cabecalho = (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className={`rotulo text-[10.5px] ${sobreAzul ? "text-papel/70" : "text-grafite-suave"}`}>
        Pergunta {String(p.numero).padStart(2, "0")}
      </span>
      {!p.obrigatoria && (sobreAzul ? <span className="rotulo border border-papel/30 px-1.5 py-[2px] text-[10px] text-papel/80">Opcional</span> : <SeloOpcional />)}
      {p.sensivel && <SeloReservado />}
      {pulada && !sobreAzul && <span className="rotulo text-[10px] text-grafite-suave">· Pulada, pode responder quando quiser</span>}
    </div>
  );

  const enunciadoClasse = final
    ? `font-serif text-[clamp(34px,5.4vw,60px)] leading-[1.02] texto-equilibrado ${corTitulo}`
    : `text-[19px] font-semibold leading-[1.35] texto-bonito md:text-[21px] ${corTitulo}`;

  const ajuda = p.ajuda && (
    <p id={idAjuda} className={`mt-2 text-[14.5px] leading-snug ${sobreAzul ? "text-papel/75" : "text-grafite-suave"}`}>
      {p.ajuda}
    </p>
  );

  const controle = (() => {
    switch (p.tipo) {
      case "escolha-unica":
        return <SingleChoiceCard pergunta={p} valor={typeof valor === "string" ? valor : undefined} onChange={onChange} />;
      case "escolha-multipla":
        return <MultipleChoiceCard pergunta={p} valor={Array.isArray(valor) ? valor : []} onChange={onChange} />;
      case "escala":
        return <ScaleSelector pergunta={p} valor={typeof valor === "number" ? valor : undefined} onChange={onChange} />;
      case "texto-curto":
      case "tres-palavras":
        return (
          <ShortTextInput
            pergunta={p}
            valor={valor as string | string[] | undefined}
            onChange={onChange}
            idCampo={idCampo}
            descritoPor={p.tipo === "tres-palavras" ? undefined : descritoPor}
            invalido={erro}
          />
        );
      case "texto-longo":
        return (
          <LongTextInput
            pergunta={p}
            valor={typeof valor === "string" ? valor : undefined}
            onChange={onChange}
            idCampo={idCampo}
            descritoPor={descritoPor}
            sobreAzul={sobreAzul}
            invalido={erro}
          />
        );
    }
  })();

  return (
    <section id={`p-${p.id}`} className="scroll-mt-44" data-pergunta={p.numero}>
      {ehGrupo ? (
        <fieldset aria-describedby={descritoPor} className="min-w-0">
          <legend className="sr-only">
            Pergunta {p.numero}
            {p.obrigatoria ? "" : ", opcional"}
            {p.sensivel ? ", reservada" : ""}
            {pulada ? ", pulada" : ""}. {p.enunciado}
          </legend>
          <div aria-hidden="true">{cabecalho}</div>
          <p aria-hidden="true" className={enunciadoClasse}>
            {p.enunciado}
          </p>
          {ajuda}
          {p.sensivel && !sobreAzul && <NotaReservado />}
          <div className="mt-5">{controle}</div>
        </fieldset>
      ) : (
        <div>
          {cabecalho}
          <label htmlFor={idCampo} className={`block ${enunciadoClasse}`}>
            {p.enunciado}
          </label>
          {ajuda}
          {p.sensivel && !sobreAzul && <NotaReservado />}
          <div className={final ? "mt-8" : "mt-5"}>{controle}</div>
        </div>
      )}
      {erro && <MensagemErro id={idErro} texto={mensagemDeErro(p)} />}
    </section>
  );
}
