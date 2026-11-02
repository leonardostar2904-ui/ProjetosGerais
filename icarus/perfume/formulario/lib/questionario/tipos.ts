// Tipos do questionário. Os dados ficam em perguntas.ts e capitulos.ts;
// a interface só lê estas estruturas e nunca guarda texto de pergunta em componente.

export type TipoPergunta =
  | "texto-curto"
  | "tres-palavras"
  | "texto-longo"
  | "escolha-unica"
  | "escolha-multipla"
  | "escala";

/** Valor salvo por pergunta. Escolhas guardam o código da opção, nunca o rótulo. */
export type Valor = string | string[] | number;
export type Respostas = Record<string, Valor | undefined>;

export type Opcao = {
  /** Código estável usado pelo banco e pelo motor de cruzamento. */
  valor: string;
  rotulo: string;
  descricao?: string;
  /** Selecionar esta opção limpa as outras (ex.: "Nenhum" na pergunta 34). */
  exclusiva?: boolean;
  /** Imagem editorial opcional (caminho em /public). */
  imagem?: string;
  /** Texto alternativo da imagem. */
  imagemAlt?: string;
};

export type Condicao =
  | { pergunta: string; em: string[] }
  | { pergunta: string; naoEm: string[] };

/** Onde a resposta é guardada (espelha a separação do Banco 01). */
export type Destino = "respostas" | "dados_sensiveis" | "contato";

export type Sensibilidade = "pessoal" | "saude";

export type VarianteVisual =
  | "padrao"
  | "cartoes-descricao"
  | "familias"
  | "clima"
  | "estacoes"
  | "bebidas"
  | "investimento"
  | "reproducao"
  | "projecao"
  | "rotina"
  | "final";

export type Pergunta = {
  /** Chave estável: q01 a q52. */
  id: string;
  numero: number;
  capitulo: number;
  enunciado: string;
  ajuda?: string;
  tipo: TipoPergunta;
  obrigatoria: boolean;
  sensivel?: Sensibilidade;
  condicao?: Condicao;
  opcoes?: Opcao[];
  maxSelecoes?: number;
  escala?: { min: string; max: string };
  placeholder?: string;
  variante?: VarianteVisual;
  /** Subgrupo visual dentro do capítulo (capítulo 08: A, B, C). */
  grupo?: string;
  /** Uso interno do motor (pilares do capítulo 10). Não aparece para o cliente. */
  pilar?: string;
  destino: Destino;
};

export type ArteCapitulo =
  | "abertura"
  | "rotina"
  | "essencia"
  | "conexoes"
  | "memorias"
  | "presenca"
  | "cuidados"
  | "pele"
  | "criacao"
  | "final";

export type Capitulo = {
  numero: number;
  id: string;
  /** Nome da etapa (aparece no progresso). */
  nome: string;
  /** Título editorial do capítulo. */
  titulo: string;
  /** Parte do título em itálico (virada da frase, como no brand book). */
  tituloItalico?: string;
  descricao: string;
  arte: ArteCapitulo;
  /** Acento do capítulo. Aurora só nas etapas emocionais e sensoriais. */
  acento: "mar" | "aurora";
  perguntas: number[];
  grupos?: { id: string; rotulo: string }[];
};
