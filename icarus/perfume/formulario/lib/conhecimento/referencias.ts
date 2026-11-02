// Tabelas de referência usadas pelo motor de cruzamento.
// Fontes: Manual de Engenharia de Perfumaria Fina (seções 5.1 e 5.2), CONCEITO.md da vertical
// e as decisões registradas em conversa (modalidades e preços ainda a confirmar no mercado).

import type { GrupoOlfativo } from "./materias-primas";

export const GRUPOS: Record<Exclude<GrupoOlfativo, "transversal">, { nome: string; exemplos: string }> = {
  frescos: { nome: "Frescos", exemplos: "Cítricos, mar, folhas verdes" },
  florais: { nome: "Florais", exemplos: "Jasmim, rosa, flor de laranjeira" },
  amadeirados: { nome: "Amadeirados e terrosos", exemplos: "Cedro, sândalo, vetiver" },
  doces: { nome: "Doces e gourmand", exemplos: "Baunilha, caramelo, café, cacau" },
  quentes: { nome: "Quentes e intensos", exemplos: "Especiarias, couro, incenso, tabaco" },
};

/** Manual, seção 5.1. Percentual de concentrado no produto final. */
export const CONCENTRACOES = {
  "eau-fraiche": { nome: "Eau Fraîche", concentrado: "1% a 3%", duracao: "1 a 2 h", comportamento: "Domina o topo; rastro mínimo" },
  edc: { nome: "Eau de Cologne (EDC)", concentrado: "2% a 6%", duracao: "2 a 3 h", comportamento: "Abertura cítrica intensa; seca rápido" },
  edt: { nome: "Eau de Toilette (EDT)", concentrado: "5% a 15%", duracao: "3 a 5 h", comportamento: "Alta difusão; projeção expansiva" },
  edp: { nome: "Eau de Parfum (EDP)", concentrado: "15% a 20%", duracao: "6 a 10 h", comportamento: "Evolui para a base; rastro denso" },
  extrait: { nome: "Extrait de Parfum", concentrado: "20% a 40%", duracao: "12 a 24 h ou mais", comportamento: "Fixação extrema; projeção íntima" },
} as const;
export type CodigoConcentracao = keyof typeof CONCENTRACOES;

/** Modalidades comerciais (CONCEITO.md). Preços em reais, ainda sem validação de mercado. */
export const MODALIDADES = [
  { codigo: "essencial", nome: "Essencial", preco: 180, condicao: "Formulação de entrada, com matérias-primas sintéticas." },
  { codigo: "atelier", nome: "Atelier", preco: 600, condicao: "Formulação premium, com predominância de naturais." },
  { codigo: "atelier-compartilhavel", nome: "Atelier compartilhável", preco: 420, condicao: "Atelier com autorização para inspirar coleções futuras." },
  { codigo: "atelier-exclusivo", nome: "Atelier exclusivo", preco: 745, condicao: "Atelier com exclusividade da fórmula por 3 anos." },
] as const;
export type CodigoModalidade = (typeof MODALIDADES)[number]["codigo"];

/**
 * Notas pedidas pelo questionário que não têm matéria-prima natural no catálogo do manual.
 * Ver ANALISE-MANUAL.md, seção 5 (Cobertura do questionário).
 */
export const LACUNAS_NATURAIS = {
  mar: "Notas marinhas: não há matéria-prima natural no catálogo. Na linha Essencial, sintéticos cobrem.",
  couro: "Couro: só existe como acorde (#100); bétula bruta é proibida e a retificada tem limite.",
  tabaco: "Tabaco: não há absoluto de tabaco no catálogo.",
  cha: "Chá: não há absoluto de chá no catálogo.",
  vinho: "Vinho: não há nota de vinho; cassis (#97) pode aproximar, a validar com perfumista.",
  champagne: "Champagne: não há nota natural; seria um acorde a desenvolver.",
  caramelo: "Caramelo: não há matéria-prima de caramelo no catálogo; baunilha e fava-tonca aproximam.",
  limpo: "Roupa limpa e sabonete: almíscares brancos e aldeídos são sintéticos; não há natural equivalente no catálogo.",
} as const;
export type CodigoLacuna = keyof typeof LACUNAS_NATURAIS;
