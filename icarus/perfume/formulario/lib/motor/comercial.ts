import { MODALIDADES } from "../conhecimento/referencias";
import { rotuloDaOpcao } from "../questionario/perguntas";
import type { Respostas } from "../questionario/tipos";
import type { Comercial } from "./tipos";

// Banco 06. Compatibilidade das modalidades e sinais de pesquisa.
// As respostas da etapa 09 são PESQUISA de preferência: não autorizam nada e não são oferta.

const arr = (v: unknown): string[] => (Array.isArray(v) ? v : typeof v === "string" ? [v] : []);

export function avaliarComercial(r: Respostas): Comercial {
  const q34 = arr(r.q34);
  const semSinteticos = q34.includes("sinteticos");
  const semAlcool = q34.includes("alcool");

  const modalidades = MODALIDADES.map((m) => {
    let compativel = true;
    let observacao: string = m.condicao;
    if (m.codigo === "essencial" && semSinteticos) {
      compativel = false;
      observacao = "Bloqueada: a pessoa evita sintéticos (#34).";
    }
    if (m.codigo === "atelier-compartilhavel") observacao += " Excludente com o Atelier exclusivo.";
    if (m.codigo === "atelier-exclusivo") observacao += " Excludente com o Atelier compartilhável.";
    if (semAlcool) observacao += " Base oleosa: preço ainda a definir.";
    return { codigo: m.codigo, nome: m.nome, preco: m.preco, compativel, observacao };
  });

  const sinais: Comercial["sinais"] = [];
  if (typeof r.q43 === "string") sinais.push({ pergunta: "#43 Investimento habitual", leitura: rotuloDaOpcao("q43", r.q43) });
  const q44 = arr(r.q44);
  if (q44.length) sinais.push({ pergunta: "#44 O que pesa na escolha", leitura: q44.map((v) => rotuloDaOpcao("q44", v)).join(", ") });
  if (typeof r.q45 === "number") sinais.push({ pergunta: "#45 Importância de exclusividade", leitura: `${r.q45} de 5` });
  if (typeof r.q46 === "string") {
    const leitura: Record<string, string> = {
      "sim-desconto": "Aberta a compartilhar a fórmula em troca de desconto.",
      "nao-exclusivo": "Prefere que a fórmula não inspire outros perfumes.",
      depende: "Sensível ao valor do desconto.",
    };
    sinais.push({ pergunta: "#46 Reprodução em coleções futuras", leitura: `${rotuloDaOpcao("q46", r.q46)}. ${leitura[r.q46] ?? ""} Não é autorização.` });
  }

  let hipotese = "Sem dados suficientes da etapa 09.";
  const q43 = typeof r.q43 === "string" ? r.q43 : null;
  const exclusividade = typeof r.q45 === "number" ? r.q45 : 0;
  if (q43) {
    if (semSinteticos) hipotese = "Linha Atelier (Essencial bloqueada pela #34).";
    else if (q43 === "ate-150") hipotese = "Essencial é a única modalidade dentro do investimento habitual declarado.";
    else if (q43 === "150-300") hipotese = "Essencial cabe no hábito. O Atelier compartilhável (R$ 420) fica acima: teste de disposição a pagar.";
    else if (q43 === "300-600") hipotese = r.q46 === "nao-exclusivo" ? "Atelier (R$ 600) no limite do hábito declarado." : "Atelier compartilhável (R$ 420) ou Atelier (R$ 600).";
    else hipotese = exclusividade >= 4 || r.q46 === "nao-exclusivo" ? "Atelier exclusivo (R$ 745) é candidato natural." : "Atelier (R$ 600).";
  }

  return { modalidades, sinais, hipotese: `${hipotese} Hipótese interna para teste de mercado, não é oferta ao cliente.` };
}
