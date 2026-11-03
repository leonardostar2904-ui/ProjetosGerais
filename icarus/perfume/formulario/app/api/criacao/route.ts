import { bancoServidor, criacaoExistente, criacoesHoje, registrarLog, salvarCriacao, salvarCruzamento, salvarSessao } from "@/lib/banco/servidor";
import type { EventoCriacao } from "@/lib/criacao/tipos";
import { configIA } from "@/lib/ia/config";
import { criarComIA } from "@/lib/ia/criar";
import { montarEntrada } from "@/lib/ia/entrada";
import { validarPedido } from "@/lib/ia/pedido";
import { VERSAO_PROMPT } from "@/lib/ia/prompt";
import { cruzar } from "@/lib/motor";

// POST /api/criacao
// Recebe a sessão concluída (formato de exportarSessao), grava no Supabase, roda o motor, chama a IA
// e devolve a criação. A resposta é um fluxo de linhas JSON (NDJSON), uma por evento, para a tela de
// espera mostrar o que está acontecendo de verdade.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const TAMANHO_MAX = 200_000;

export async function POST(req: Request) {
  const texto = await req.text();
  const codificador = new TextEncoder();

  const corpo = new ReadableStream<Uint8Array>({
    async start(controller) {
      let aberto = true;
      const enviar = (evento: EventoCriacao) => {
        if (!aberto) return;
        try {
          controller.enqueue(codificador.encode(`${JSON.stringify(evento)}\n`));
        } catch {
          aberto = false;
        }
      };
      const fechar = () => {
        if (!aberto) return;
        aberto = false;
        try {
          controller.close();
        } catch {
          /* conexão já encerrada */
        }
      };

      try {
        if (texto.length > TAMANHO_MAX) {
          enviar({ tipo: "erro", codigo: "pedido_invalido", mensagem: "Pedido grande demais." });
          return;
        }
        let json: unknown;
        try {
          json = JSON.parse(texto);
        } catch {
          enviar({ tipo: "erro", codigo: "pedido_invalido", mensagem: "Pedido sem JSON válido." });
          return;
        }
        const validado = validarPedido(json);
        if (!validado.ok) {
          enviar({ tipo: "erro", codigo: "pedido_invalido", mensagem: validado.motivo });
          return;
        }
        const pedido = validado.pedido;
        const cfg = configIA();
        const db = bancoServidor();

        // 1. Respostas no banco (mesmo sem IA configurada, as respostas ficam guardadas).
        enviar({ tipo: "etapa", texto: "Guardando a sua história" });
        let persistido = false;
        if (db) {
          const salvo = await salvarSessao(db, pedido);
          persistido = salvo.ok;
          if (!salvo.ok) console.error("[criacao] sessão não gravada:", salvo.erro);
          const anterior = salvo.ok ? await criacaoExistente(db, pedido.sessaoId) : null;
          if (anterior) {
            enviar({ tipo: "resultado", criacao: anterior, persistido: true, reaproveitada: true });
            return;
          }
        }

        if (!cfg.ativa) {
          enviar({ tipo: "erro", codigo: "nao_configurado", mensagem: "A leitura por IA ainda não está ligada neste ambiente." });
          return;
        }
        if (db) {
          const hoje = await criacoesHoje(db);
          if (hoje !== null && hoje >= cfg.limiteDiario) {
            enviar({ tipo: "erro", codigo: "limite_diario", mensagem: "O limite de criações de hoje foi atingido." });
            return;
          }
        }

        // 2. Motor determinístico (o servidor recalcula; não usa nada calculado no navegador).
        enviar({ tipo: "etapa", texto: "Cruzando as suas respostas com o nosso catálogo" });
        const cruzamento = cruzar(pedido.respostas);
        let cruzamentoId: string | null = null;
        if (db && persistido) {
          const c = await salvarCruzamento(db, pedido.sessaoId, cruzamento);
          if (c.ok) cruzamentoId = c.valor;
          else console.error("[criacao] cruzamento não gravado:", c.erro);
        }

        // 3. IA de criação.
        enviar({ tipo: "etapa", texto: "Lendo o que você contou com calma" });
        const entrada = montarEntrada(pedido.respostas, cruzamento);
        const inicio = Date.now();
        const saida = await criarComIA({
          entrada,
          db,
          aoProgresso: (t) => enviar({ tipo: "etapa", texto: t }),
          aoBuscar: (t) => enviar({ tipo: "busca", texto: t }),
        });
        const duracaoMs = Date.now() - inicio;

        // 4. Proposta e log no banco.
        let formulaId: string | null = null;
        if (db && saida.ok && cruzamentoId) {
          const f = await salvarCriacao(db, { pedido, cruzamentoId, criacao: saida.criacao });
          if (f.ok) formulaId = f.valor;
          else console.error("[criacao] proposta não gravada:", f.erro);
        }
        if (db && persistido) {
          await registrarLog(db, {
            sessaoId: pedido.sessaoId,
            cruzamentoId,
            formulaId,
            modelo: saida.modelo,
            versaoPrompt: VERSAO_PROMPT,
            entrada,
            saida: saida.ok ? saida.criacao : null,
            erro: saida.ok ? null : `${saida.codigo}: ${saida.mensagem}`,
            tokensEntrada: saida.uso.entrada,
            tokensSaida: saida.uso.saida,
            duracaoMs,
          }).catch((e) => console.error("[criacao] log não gravado:", e));
        }

        if (!saida.ok) {
          console.error("[criacao] falha:", saida.codigo, saida.mensagem);
          enviar({ tipo: "erro", codigo: saida.codigo, mensagem: saida.mensagem });
          return;
        }
        enviar({ tipo: "resultado", criacao: saida.criacao, persistido: Boolean(formulaId), reaproveitada: false });
      } catch (e) {
        console.error("[criacao] erro inesperado:", e);
        enviar({ tipo: "erro", codigo: "falha_ia", mensagem: "Erro inesperado no servidor." });
      } finally {
        fechar();
      }
    },
  });

  return new Response(corpo, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
