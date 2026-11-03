// Peças pequenas compartilhadas pelos componentes de pergunta.
// A seleção nunca depende só de cor: o marcador muda de forma (vazio, preenchido, com traço).

export function MarcadorSelecao({ tipo, marcado }: { tipo: "unica" | "multipla"; marcado: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-[3px] grid h-[15px] w-[15px] shrink-0 place-items-center border transition-colors duration-200 ${
        marcado ? "border-azul bg-azul" : "border-azul/70 bg-branco"
      }`}
    >
      {marcado && tipo === "multipla" && (
        <svg viewBox="0 0 12 12" className="h-[10px] w-[10px]" fill="none">
          <path d="M2 6.4 4.8 9 10 3" stroke="#EAE6DF" strokeWidth="1.6" strokeLinecap="square" />
        </svg>
      )}
      {marcado && tipo === "unica" && <span className="h-[5px] w-[5px] bg-papel" />}
    </span>
  );
}

export function SeloOpcional() {
  return <span className="rotulo border border-nevoa px-1.5 py-[2px] text-[10px] text-grafite-suave">Opcional</span>;
}

export function SeloReservado() {
  return (
    <span className="rotulo border border-azul/25 px-1.5 py-[2px] text-[10px] text-azul" title="Guardado separado das outras respostas">
      Reservado
    </span>
  );
}

export function NotaReservado() {
  return (
    <p className="mt-2 text-[13px] leading-snug text-grafite-suave">
      Guardado separado das outras respostas. Você pode pular sem problema.
    </p>
  );
}

export function MensagemErro({ id, texto }: { id: string; texto: string }) {
  return (
    // Sem role="alert": o aviso falado é um só, no resumo da etapa (evita leitura repetida).
    <p id={id} className="mt-3 flex items-center gap-2 text-[14px] font-medium text-brasa">
      <span aria-hidden="true" className="inline-block h-[7px] w-[7px] bg-brasa" />
      {texto}
    </p>
  );
}
