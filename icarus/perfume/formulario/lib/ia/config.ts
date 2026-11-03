import "server-only";

// Configuração da IA de criação. Tudo vem de variáveis de ambiente (Vercel: Settings, Environment Variables).
// Sem ANTHROPIC_API_KEY a rota responde "nao_configurado" e a tela final continua funcionando sem a leitura.

const ESFORCOS = ["low", "medium", "high", "xhigh", "max"] as const;
export type Esforco = (typeof ESFORCOS)[number];

function inteiro(valor: string | undefined, padrao: number, min: number, max: number): number {
  const n = Number.parseInt(valor ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : padrao;
}

export function configIA() {
  const esforco = (process.env.ICARUS_IA_ESFORCO ?? "medium") as Esforco;
  return {
    ativa: Boolean(process.env.ANTHROPIC_API_KEY),
    /** Modelo padrão: Claude Opus 5.5. Para gastar menos, use claude-sonnet-5-5 em ICARUS_IA_MODELO. */
    modelo: process.env.ICARUS_IA_MODELO || "claude-opus-5-5",
    esforco: ESFORCOS.includes(esforco) ? esforco : ("medium" as Esforco),
    /** Máximo de buscas na web por criação. 0 desliga a busca. */
    buscasMax: inteiro(process.env.ICARUS_IA_BUSCAS_MAX, 4, 0, 10),
    /** Teto de criações por dia (conta no log do banco). Protege o custo enquanto não existe login. */
    limiteDiario: inteiro(process.env.ICARUS_IA_LIMITE_DIARIO, 40, 1, 10000),
    /** Tempo máximo de uma criação, em segundos (a função da Vercel vai até 300). */
    tempoMaxSegundos: inteiro(process.env.ICARUS_IA_TEMPO_MAX, 270, 30, 290),
  };
}
