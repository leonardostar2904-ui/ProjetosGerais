// Tipos da criação feita pela IA. Este arquivo é usado no navegador e no servidor: não importa nada do servidor.
//
// Duas partes com públicos diferentes:
// - "usuario": o que a pessoa lê na tela de resposta. Sem pontuação de perfil, sem percentuais, sem marca de terceiros.
// - "equipe": a proposta técnica para o perfumista (fórmula em % de massa, conflitos, referências). Só nos bastidores.

export type CamadaCriacao = "saida" | "coracao" | "fundo";

export type CriacaoUsuario = {
  /** Continua o nome da pessoa: "Kleber, a sua fragrância começa assim." */
  titulo: string;
  abertura: string[];
  piramide: { camada: CamadaCriacao; titulo: string; texto: string; notas: string[] }[];
  concentracao: { nome: string; texto: string };
  naPele: string;
  porque: { pergunta: number; texto: string }[];
  fechamento: string;
};

export type ComponenteProposto = {
  camada: CamadaCriacao;
  /** Número no catálogo de matérias-primas (1 a 100) ou null quando não existe no catálogo. */
  materiaN: number | null;
  nome: string;
  percentual: number;
  motivo: string;
};

export type ReferenciaLida = {
  perfume: string;
  relacao: "amou" | "usou" | "rejeitou" | "citou";
  leitura: string;
  fonte: "banco" | "web" | "conhecimento-geral";
};

export type CriacaoEquipe = {
  nomeInterno: string;
  leituraTextos: string;
  conflitos: string[];
  referencias: ReferenciaLida[];
  linha: "essencial" | "atelier";
  concentracao: "edt" | "edp" | "extrait";
  percentualConcentrado: number;
  base: "alcoolica" | "oleosa";
  componentes: ComponenteProposto[];
  alternativaEssencial: string | null;
  pontosPerfumista: string[];
  modalidadeSugerida: string;
};

export type Criacao = {
  versaoPrompt: string;
  modelo: string;
  geradaEm: string;
  usuario: CriacaoUsuario;
  equipe: CriacaoEquipe;
  /** Páginas consultadas na busca na web durante a criação. */
  fontes: { titulo: string; url: string }[];
  /** Perfumes de referência que a IA gravou no banco nesta criação. */
  referenciasRegistradas: string[];
  /** Avisos do servidor (ex.: soma dos percentuais diferente de 100, matéria fora do catálogo). */
  avisos: string[];
};

/** Eventos que a rota /api/criacao envia, uma linha JSON por evento. */
export type EventoCriacao =
  | { tipo: "etapa"; texto: string }
  | { tipo: "busca"; texto: string }
  | { tipo: "resultado"; criacao: Criacao; persistido: boolean; reaproveitada: boolean }
  | { tipo: "erro"; codigo: CodigoErroCriacao; mensagem: string };

export type CodigoErroCriacao =
  | "nao_configurado"
  | "pedido_invalido"
  | "limite_diario"
  | "recusa"
  | "tempo_esgotado"
  | "falha_ia"
  | "falha_rede";
