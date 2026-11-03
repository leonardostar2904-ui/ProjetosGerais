import "server-only";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { consultarReferencias, registrarReferencia, type Banco } from "../banco/servidor";

// Ferramentas da criação. Esquemas em zod: o SDK converte para JSON Schema e o mesmo esquema valida
// a entrada antes de executar (com streaming de entrada, o servidor da API não valida por nós).
// Sem números com mínimo ou máximo nos esquemas: o modo strict não aceita essas restrições.

const Camada = z.enum(["saida", "coracao", "fundo"]);
const CamadaRef = z.enum(["topo", "coracao", "fundo"]);
const Grupo = z.enum(["frescos", "florais", "amadeirados", "doces", "quentes", "transversal"]);

export const EsquemaEntrega = z.strictObject({
  usuario: z.strictObject({
    titulo: z.string().describe('Continua a frase depois do nome da pessoa, em minúscula. Ex.: "a sua fragrância começa assim."'),
    abertura: z.array(z.string()).describe("Um ou dois parágrafos curtos."),
    piramide: z
      .array(
        z.strictObject({
          camada: Camada,
          titulo: z.string().describe('Ex.: "Como ela abre", "No meio", "No fim".'),
          texto: z.string(),
          notas: z.array(z.string()).describe("Notas em palavras comuns, sem número do catálogo."),
        }),
      )
      .describe("Exatamente três itens: saida, coracao, fundo."),
    concentracao: z.strictObject({ nome: z.string(), texto: z.string() }),
    naPele: z.string().describe("Como o perfume se comporta na pele e no clima da pessoa."),
    porque: z
      .array(z.strictObject({ pergunta: z.number().describe("Número da pergunta respondida."), texto: z.string() }))
      .describe("De 3 a 5 respostas que guiaram a criação."),
    fechamento: z.string(),
  }),
  equipe: z.strictObject({
    nomeInterno: z.string().describe("Nome de trabalho da fórmula, sem nome de marca de terceiros."),
    leituraTextos: z.string().describe("O que os textos livres dizem, em poucas frases."),
    conflitos: z.array(z.string()),
    referencias: z.array(
      z.strictObject({
        perfume: z.string(),
        relacao: z.enum(["amou", "usou", "rejeitou", "citou"]),
        leitura: z.string(),
        fonte: z.enum(["banco", "web", "conhecimento-geral"]),
      }),
    ),
    linha: z.enum(["essencial", "atelier"]),
    concentracao: z.enum(["edt", "edp", "extrait"]),
    percentualConcentrado: z.number().describe("Percentual de concentrado no produto final, dentro da faixa da concentração."),
    base: z.enum(["alcoolica", "oleosa"]),
    componentes: z.array(
      z.strictObject({
        camada: Camada,
        materiaN: z.number().nullable().describe("Número do catálogo, ou null se não estiver no catálogo."),
        nome: z.string(),
        percentual: z.number().describe("% de massa dentro do concentrado. A soma de todos dá 100."),
        motivo: z.string(),
      }),
    ),
    alternativaEssencial: z.string().nullable(),
    pontosPerfumista: z.array(z.string()),
    modalidadeSugerida: z.string(),
  }),
});
export type Entrega = z.infer<typeof EsquemaEntrega>;

export type Contexto = {
  db: Banco | null;
  aoProgresso: (texto: string) => void;
  registradas: string[];
};

export function criarFerramentas(ctx: Contexto) {
  const consultar = betaZodTool({
    name: "consultar_perfumes_referencia",
    description:
      "Consulta no banco da ICARUS a pirâmide (topo, coração, fundo) de perfumes comerciais já decompostos. Passe todos os perfumes citados pela pessoa de uma vez. Devolve só os encontrados.",
    inputSchema: z.strictObject({
      nomes: z.array(z.string()).describe('Nomes como a pessoa escreveu, com a marca quando houver. Ex.: ["Born in Roma Intense", "One Million"].'),
    }),
    strict: true,
    eager_input_streaming: true,
    run: async ({ nomes }) => {
      if (!ctx.db) return JSON.stringify({ encontrados: [], aviso: "Banco indisponível nesta execução. Use a busca na web se precisar." });
      ctx.aoProgresso("Consultando a nossa base de perfumes de referência");
      try {
        const encontrados = await consultarReferencias(ctx.db, nomes);
        return JSON.stringify({
          encontrados,
          aviso: encontrados.length ? "Confira se cada achado é mesmo o perfume citado (versão e concentração)." : "Nenhum dos nomes está no banco.",
        });
      } catch (e) {
        return JSON.stringify({ encontrados: [], aviso: `Consulta falhou (${(e as Error).message}). Siga com a busca na web ou com o que sabe.` });
      }
    },
  });

  const registrar = betaZodTool({
    name: "registrar_perfume_referencia",
    description:
      "Grava no banco da ICARUS a pirâmide de um perfume comercial confirmada numa página da web, para as próximas criações. Use só depois de confirmar as notas na fonte. Uma chamada por perfume.",
    inputSchema: z.strictObject({
      marca: z.string(),
      nome: z.string().describe("Nome do perfume sem a marca. Ex.: Born in Roma Uomo Intense."),
      concentracao: z.enum(["eau-fraiche", "edc", "edt", "edp", "extrait"]).nullable(),
      ano: z.number().nullable(),
      fonte: z.string().describe("URL da página onde as notas foram confirmadas."),
      notas: z.array(
        z.strictObject({
          camada: CamadaRef,
          nota: z.string().describe("Nota em português, minúscula. Ex.: baunilha, groselha negra."),
          materiaN: z.number().nullable().describe("Número do catálogo quando a nota corresponde a uma matéria-prima dele; senão null."),
          grupo: Grupo.nullable(),
        }),
      ),
    }),
    strict: true,
    eager_input_streaming: true,
    run: async (ref) => {
      if (!/^https?:\/\//.test(ref.fonte)) return JSON.stringify({ registrado: false, motivo: "A fonte precisa ser a URL da página consultada." });
      if (!ctx.db) return JSON.stringify({ registrado: false, motivo: "Banco indisponível nesta execução. Siga com a criação." });
      const r = await registrarReferencia(ctx.db, { ...ref, notas: ref.notas });
      if (!r.ok) return JSON.stringify({ registrado: false, motivo: r.erro });
      ctx.registradas.push(`${ref.marca} ${ref.nome}`);
      ctx.aoProgresso("Guardando o que aprendemos para as próximas criações");
      return JSON.stringify({ registrado: true });
    },
  });

  return { consultar, registrar };
}

/** Definição da entrega (sem execução: o laço da criação lê a entrada e encerra). */
export const ferramentaEntrega = betaZodTool({
  name: "entregar_criacao",
  description:
    "Entrega final: a leitura para a pessoa (usuario) e a proposta técnica para o perfumista (equipe). Chame uma única vez, no fim. Encerra a criação.",
  inputSchema: EsquemaEntrega,
  strict: true,
  eager_input_streaming: true,
  run: () => "Recebido.",
});
