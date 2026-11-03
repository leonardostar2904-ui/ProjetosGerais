import type { EventoCriacao } from "./tipos";

// Chama /api/criacao e lê o fluxo de eventos (uma linha JSON por evento).
// Devolve o evento final: "resultado" ou "erro". Os eventos intermediários vão para aoEvento.

export type EventoFinal = Extract<EventoCriacao, { tipo: "resultado" | "erro" }>;

export async function pedirCriacao(dados: unknown, aoEvento: (e: EventoCriacao) => void, sinal?: AbortSignal): Promise<EventoFinal> {
  let resposta: Response;
  try {
    resposta = await fetch("/api/criacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
      signal: sinal,
    });
  } catch {
    return { tipo: "erro", codigo: "falha_rede", mensagem: "Sem conexão com o servidor." };
  }
  if (!resposta.ok || !resposta.body) {
    return { tipo: "erro", codigo: "falha_rede", mensagem: `O servidor respondeu ${resposta.status}.` };
  }

  const leitor = resposta.body.getReader();
  const decodificador = new TextDecoder();
  let resto = "";
  let final: EventoFinal | null = null;
  const tratar = (linha: string) => {
    if (!linha.trim()) return;
    try {
      const e = JSON.parse(linha) as EventoCriacao;
      if (e.tipo === "resultado" || e.tipo === "erro") final = e;
      else aoEvento(e);
    } catch {
      /* linha incompleta ou corrompida: ignora */
    }
  };
  try {
    for (;;) {
      const { value, done } = await leitor.read();
      if (done) break;
      resto += decodificador.decode(value, { stream: true });
      const linhas = resto.split("\n");
      resto = linhas.pop() ?? "";
      linhas.forEach(tratar);
    }
    tratar(resto);
  } catch {
    return final ?? { tipo: "erro", codigo: "falha_rede", mensagem: "A conexão caiu durante a criação." };
  }
  return final ?? { tipo: "erro", codigo: "falha_rede", mensagem: "O servidor encerrou sem resposta." };
}
