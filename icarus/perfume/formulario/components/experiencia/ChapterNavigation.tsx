"use client";

// Rodapé fixo da etapa: voltar, situação do capítulo e continuar.
// No celular os dois botões ficam lado a lado, na altura do polegar.

type Props = {
  capitulo: number;
  respondidas: number;
  aplicaveis: number;
  faltando: number;
  opcionaisEmBranco: number;
  rotuloContinuar: string;
  onVoltar: () => void;
  onContinuar: () => void;
};

export default function ChapterNavigation({
  capitulo,
  respondidas,
  aplicaveis,
  faltando,
  opcionaisEmBranco,
  rotuloContinuar,
  onVoltar,
  onContinuar,
}: Props) {
  const info =
    faltando > 0
      ? `${faltando} ${faltando > 1 ? "respostas necessárias" : "resposta necessária"} para seguir`
      : opcionaisEmBranco > 0
        ? `${opcionaisEmBranco} ${opcionaisEmBranco > 1 ? "opcionais em branco" : "opcional em branco"}. Pode seguir.`
        : "Etapa completa";

  return (
    <footer className="sticky bottom-0 z-30 border-t border-azul/15 bg-papel/95 pb-[env(safe-area-inset-bottom)] supports-[backdrop-filter]:bg-papel/90 supports-[backdrop-filter]:backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 lg:px-12">
        <p className="rotulo order-1 text-center text-[10px] text-grafite-suave sm:order-2 sm:flex-1 sm:text-[10.5px]">
          <span className="text-azul">Etapa {String(capitulo).padStart(2, "0")}</span> · {respondidas} de {aplicaveis} respondidas ·{" "}
          <span className={faltando > 0 ? "text-azul" : ""}>{info}</span>
        </p>
        <div className="order-2 grid grid-cols-[1fr_1.6fr] gap-2 sm:contents">
          <button
            type="button"
            onClick={onVoltar}
            className="rotulo h-12 border border-azul/25 px-5 text-[11.5px] text-azul transition-colors hover:border-azul sm:order-1"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={onContinuar}
            className="rotulo h-12 bg-azul px-7 text-[11.5px] font-medium text-papel transition-colors hover:bg-[#1b2c40] sm:order-3"
          >
            {rotuloContinuar}
          </button>
        </div>
      </div>
    </footer>
  );
}
