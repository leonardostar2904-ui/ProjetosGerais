import type { Capitulo } from "./tipos";

// As 10 etapas, na ordem aprovada. Os números das perguntas seguem a numeração original (1 a 52).
export const capitulos: Capitulo[] = [
  {
    numero: 1,
    id: "abertura",
    nome: "Abertura",
    titulo: "Sua história tem um",
    tituloItalico: "cheiro próprio.",
    descricao:
      "Antes de criar uma fragrância, precisamos conhecer quem vai carregá-la. Sua rotina, suas memórias, seus encontros e a maneira como você enxerga o mundo. Tudo isso faz parte da sua identidade.",
    arte: "abertura",
    acento: "aurora",
    perguntas: [1],
  },
  {
    numero: 2,
    id: "contexto-rotina",
    nome: "Contexto e rotina",
    titulo: "Sua",
    tituloItalico: "vida.",
    descricao: "Comece pelo seu dia, do jeito que ele é. É nele que a sua fragrância vai viver.",
    arte: "rotina",
    acento: "mar",
    perguntas: [2, 3, 4, 5, 6, 7],
  },
  {
    numero: 3,
    id: "personalidade-identidade",
    nome: "Personalidade e identidade",
    titulo: "Sua",
    tituloItalico: "essência.",
    descricao: "Como você se percebe e como chega aos lugares. Não existe resposta certa.",
    arte: "essencia",
    acento: "mar",
    perguntas: [8, 9, 10, 11, 12, 13],
  },
  {
    numero: 4,
    id: "vida-social",
    nome: "Vida social e relacionamentos",
    titulo: "Seu",
    tituloItalico: "mundo.",
    descricao: "As pessoas e os encontros que também contam a sua história.",
    arte: "conexoes",
    acento: "mar",
    perguntas: [14, 15, 16, 17, 18],
  },
  {
    numero: 5,
    id: "universo-olfativo",
    nome: "Universo olfativo e memórias",
    titulo: "Suas",
    tituloItalico: "memórias.",
    descricao: "Cheiro é lembrança. O que você guarda na memória vira matéria-prima da criação.",
    arte: "memorias",
    acento: "aurora",
    perguntas: [19, 20, 21, 22, 23, 24, 25],
  },
  {
    numero: 6,
    id: "comportamento-uso",
    nome: "Comportamento e utilização",
    titulo: "Sua",
    tituloItalico: "presença.",
    descricao: "Onde, quando e com que intensidade a sua fragrância vai aparecer.",
    arte: "presenca",
    acento: "mar",
    perguntas: [26, 27, 28, 29, 30],
  },
  {
    numero: 7,
    id: "restricoes",
    nome: "Restrições e preferências",
    titulo: "Seus",
    tituloItalico: "cuidados.",
    descricao:
      "Uma boa fragrância também respeita o que não combina com você. Todas as perguntas desta etapa são opcionais.",
    arte: "cuidados",
    acento: "mar",
    perguntas: [31, 32, 33, 34],
  },
  {
    numero: 8,
    id: "pele",
    nome: "Pele e experiência de uso",
    titulo: "Sua relação com a",
    tituloItalico: "pele.",
    descricao:
      "A mesma fragrância muda de pele para pele. Estas respostas dão contexto para a criação. Não são uma análise da sua pele.",
    arte: "pele",
    acento: "mar",
    perguntas: [35, 36, 37, 38, 39, 40, 41, 42],
    grupos: [
      { id: "A", rotulo: "Características da pele" },
      { id: "B", rotulo: "Experiência com fragrâncias" },
      { id: "C", rotulo: "Contexto de uso" },
    ],
  },
  {
    numero: 9,
    id: "produto",
    nome: "Produto, exclusividade e investimento",
    titulo: "Sua",
    tituloItalico: "criação.",
    descricao: "Agora, o perfume como objeto. Nenhuma resposta aqui é compromisso de compra.",
    arte: "criacao",
    acento: "mar",
    perguntas: [43, 44, 45, 46, 47],
  },
  {
    numero: 10,
    id: "o-que-fica",
    nome: "Psicologia relacional e expressão emocional",
    titulo: "O que",
    tituloItalico: "fica.",
    descricao: "As últimas perguntas são sobre afeto. Responda no seu tempo.",
    arte: "final",
    acento: "aurora",
    perguntas: [48, 49, 50, 51, 52],
  },
];

export const TOTAL_CAPITULOS = capitulos.length;
export const MINUTOS_ESTIMADOS = 19;

export function capituloPorNumero(numero: number): Capitulo {
  const c = capitulos.find((x) => x.numero === numero);
  if (!c) throw new Error(`Capítulo inexistente: ${numero}`);
  return c;
}
