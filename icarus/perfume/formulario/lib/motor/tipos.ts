import type { GrupoOlfativo } from "../conhecimento/materias-primas";
import type { CodigoConcentracao, CodigoLacuna, CodigoModalidade } from "../conhecimento/referencias";

export const VERSAO_MOTOR = "motor-v0.1";
export const VERSAO_REGRAS = "regras-v0.1";

/** Força da evidência por trás de uma regra (ver ANALISE-MANUAL.md e REFERENCIAS-TECNICAS.md). */
export type Evidencia = "declarada" | "aceita" | "moderada" | "fraca" | "associacao";

export type Origem = { perguntaId: string; papel: string };

// ── Banco 02 · Psicologia e comportamento ──
export type Traco = {
  codigo: string;
  nome: string;
  tipo: "escala-0-10" | "categoria";
  valor: number | null;
  categorias?: string[];
  status: "calculado" | "parcial" | "aguarda_ia" | "sem_dados";
  metodo: string;
  origens: Origem[];
};

// ── Regras de tradução ──
export type RegraAplicada = {
  codigo: string;
  nome: string;
  gatilho: string;
  efeito: string;
  tipo: "direcao" | "ajuste" | "restricao" | "seguranca" | "comercial" | "informativa";
  evidencia: Evidencia;
  origens: string[];
};

// ── Banco 03 · Inteligência olfativa ──
export type Direcao = {
  pesos: Record<Exclude<GrupoOlfativo, "transversal">, number>;
  concentracao: { codigo: CodigoConcentracao | null; nome: string; motivo: string };
  base: { tipo: "alcoolica" | "oleosa"; motivo: string };
  ajustes: { fundo: number; citricosSaida: number; fundoPesadoCalor: number };
  conflitos: string[];
  alertas: string[];
};

export type MencaoTexto = {
  perguntaId: string;
  termo: string;
  materias: number[];
  grupo?: string;
  lacuna?: CodigoLacuna;
  uso: "exclusao" | "afinidade" | "referencia";
};

// ── Banco 04 · Matérias-primas candidatas ──
export type Candidata = {
  n: number;
  nome: string;
  camada: "topo" | "coracao" | "fundo";
  pontuacao: number;
  motivos: string[];
  sinais: string[];
};

export type Candidatas = {
  topo: Candidata[];
  coracao: Candidata[];
  fundo: Candidata[];
  /** Matérias-primas citadas pela pessoa (memórias e bebidas), mostradas mesmo fora do topo do ranking. */
  citadas: Candidata[];
  excluidas: { n: number; nome: string; motivo: string }[];
  observacoes: string[];
};

// ── Banco 06 · Inteligência comercial ──
export type AvaliacaoModalidade = {
  codigo: CodigoModalidade;
  nome: string;
  preco: number;
  compativel: boolean;
  observacao: string;
};

export type Comercial = {
  modalidades: AvaliacaoModalidade[];
  sinais: { pergunta: string; leitura: string }[];
  hipotese: string;
};

export type ItemFilaIA = { perguntaId: string; numero: number; alimenta: string; caracteres: number };

export type ResultadoCruzamento = {
  versoes: { motor: string; regras: string; catalogo: string; questionario: string };
  geradoEm: string;
  perfil: Traco[];
  regras: RegraAplicada[];
  direcao: Direcao;
  mencoes: MencaoTexto[];
  candidatas: Candidatas;
  lacunas: { codigo: CodigoLacuna; texto: string; origem: string }[];
  comercial: Comercial;
  filaIA: ItemFilaIA[];
  pendencias: string[];
  formulacao: { status: "nao_gerada"; motivo: string };
  aprendizado: { status: "sem_avaliacoes"; motivo: string };
};
