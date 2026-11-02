"use client";

import { useEffect, useRef, useState } from "react";

// Envolve uma pergunta condicional. Quando a condição vale, ela entra com transição suave e o leitor
// de tela é avisado. Quando deixa de valer, ela sai da tela e da contagem de progresso.

type Props = { visivel: boolean; numero: number; children: React.ReactNode };

export default function ConditionalQuestion({ visivel, numero, children }: Props) {
  const anterior = useRef(visivel);
  const [anuncio, setAnuncio] = useState("");

  useEffect(() => {
    if (visivel && !anterior.current) setAnuncio(`A pergunta ${numero} apareceu logo abaixo.`);
    if (!visivel) setAnuncio("");
    anterior.current = visivel;
  }, [visivel, numero]);

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {anuncio}
      </p>
      {visivel && <div className="animate-entrada">{children}</div>}
    </>
  );
}
