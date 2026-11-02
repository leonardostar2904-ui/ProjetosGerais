import type { GrupoOlfativo } from "./materias-primas";
import type { CodigoLacuna } from "./referencias";

// Dicionário para ler os textos livres (perguntas 20, 21, 22 e 30) por correspondência de
// palavras. Isso NÃO é interpretação: só encontra menções diretas a matérias-primas do catálogo,
// a famílias olfativas ou a notas sem versão natural. A leitura de sentido fica para a IA.
//
// Os termos estão normalizados (minúsculas, sem acento). Termos mais longos são testados antes,
// para que "pimenta rosa" não vire "rosa" nem "pimenta".

export type Termo = {
  termo: string;
  materias?: number[];
  grupo?: Exclude<GrupoOlfativo, "transversal">;
  lacuna?: CodigoLacuna;
  /** Expressão que não deve gerar correspondência (ex.: "cor de rosa"). */
  ignorar?: boolean;
};

export const TERMOS: Termo[] = [
  // expressões que não são cheiro
  { termo: "cor de rosa", ignorar: true },
  { termo: "pau a pau", ignorar: true },

  // cítricos e frescos
  { termo: "bergamota", materias: [1] },
  { termo: "limao siciliano", materias: [2] },
  { termo: "limao taiti", materias: [3] },
  { termo: "limao", materias: [2, 3] },
  { termo: "lima", materias: [3, 11] },
  { termo: "laranja amarga", materias: [10] },
  { termo: "laranja azeda", materias: [10] },
  { termo: "flor de laranjeira", materias: [21, 22] },
  { termo: "laranja", materias: [4] },
  { termo: "mexerica", materias: [5] },
  { termo: "tangerina", materias: [5] },
  { termo: "mandarina", materias: [5] },
  { termo: "ponca", materias: [5] },
  { termo: "grapefruit", materias: [6] },
  { termo: "toranja", materias: [6] },
  { termo: "yuzu", materias: [8] },
  { termo: "clementina", materias: [12] },
  { termo: "capim limao", materias: [15] },
  { termo: "capim santo", materias: [15] },
  { termo: "capim cidreira", materias: [15] },
  { termo: "citronela", materias: [48] },
  { termo: "hortela", materias: [37, 38] },
  { termo: "menta", materias: [37, 38] },
  { termo: "eucalipto", materias: [39, 46] },
  { termo: "alecrim", materias: [36] },
  { termo: "manjericao", materias: [40] },
  { termo: "tomilho", materias: [41] },
  { termo: "salvia", materias: [27, 42] },
  { termo: "erva doce", materias: [44] },
  { termo: "funcho", materias: [44] },
  { termo: "pinheiro", materias: [79] },
  { termo: "pinho", materias: [79] },
  { termo: "gin", materias: [80] },
  { termo: "zimbro", materias: [80] },
  { termo: "maresia", lacuna: "mar", grupo: "frescos" },
  { termo: "oceano", lacuna: "mar", grupo: "frescos" },
  { termo: "mar", lacuna: "mar", grupo: "frescos" },
  { termo: "praia", lacuna: "mar", grupo: "frescos" },
  { termo: "chuva", grupo: "frescos" },
  { termo: "citrico", grupo: "frescos" },
  { termo: "citricos", grupo: "frescos" },
  { termo: "fresco", grupo: "frescos" },
  { termo: "frescor", grupo: "frescos" },

  // florais
  { termo: "lavanda", materias: [18] },
  { termo: "alfazema", materias: [18] },
  { termo: "jasmim", materias: [17] },
  { termo: "rosa", materias: [16] },
  { termo: "rosas", materias: [16] },
  { termo: "geranio", materias: [19] },
  { termo: "ylang", materias: [20] },
  { termo: "neroli", materias: [21] },
  { termo: "iris", materias: [23] },
  { termo: "talco", materias: [23] },
  { termo: "tuberosa", materias: [24] },
  { termo: "camomila", materias: [25, 26] },
  { termo: "violeta", materias: [34] },
  { termo: "mimosa", materias: [33] },
  { termo: "osmanthus", materias: [31] },
  { termo: "floral", grupo: "florais" },
  { termo: "flores", grupo: "florais" },
  { termo: "flor", grupo: "florais" },

  // especiarias e quentes
  { termo: "pimenta rosa", materias: [60] },
  { termo: "aroeira", materias: [60] },
  { termo: "pimenta do reino", materias: [59] },
  { termo: "pimenta", materias: [59] },
  { termo: "noz moscada", materias: [61] },
  { termo: "canela", materias: [56] },
  { termo: "cravo", materias: [57] },
  { termo: "cardamomo", materias: [58] },
  { termo: "gengibre", materias: [62, 63] },
  { termo: "acafrao", materias: [64] },
  { termo: "anis", materias: [65] },
  { termo: "cominho", materias: [66] },
  { termo: "coentro", materias: [52] },
  { termo: "louro", materias: [51] },
  { termo: "incenso", materias: [86] },
  { termo: "olibano", materias: [86] },
  { termo: "mirra", materias: [87] },
  { termo: "ambar", materias: [89] },
  { termo: "couro", materias: [100], lacuna: "couro", grupo: "quentes" },
  { termo: "tabaco", lacuna: "tabaco", grupo: "quentes" },
  { termo: "cigarro", lacuna: "tabaco", grupo: "quentes" },
  { termo: "fumaca", grupo: "quentes" },
  { termo: "defumado", grupo: "quentes" },
  { termo: "especiaria", grupo: "quentes" },
  { termo: "especiarias", grupo: "quentes" },
  { termo: "picante", grupo: "quentes" },

  // amadeirados e terrosos
  { termo: "cedro", materias: [72] },
  { termo: "sandalo", materias: [71] },
  { termo: "vetiver", materias: [73] },
  { termo: "patchouli", materias: [74] },
  { termo: "patchuli", materias: [74] },
  { termo: "oud", materias: [75] },
  { termo: "copaiba", materias: [81] },
  { termo: "priprioca", materias: [49] },
  { termo: "breu", materias: [93] },
  { termo: "musgo", materias: [96] },
  { termo: "feno", materias: [98] },
  { termo: "grama cortada", materias: [98] },
  { termo: "terra molhada", grupo: "amadeirados" },
  { termo: "madeira", grupo: "amadeirados" },
  { termo: "amadeirado", grupo: "amadeirados" },
  { termo: "terra", grupo: "amadeirados" },

  // doces e gourmand
  { termo: "baunilha", materias: [69] },
  { termo: "cacau", materias: [70] },
  { termo: "chocolate", materias: [70] },
  { termo: "cafe", materias: [94] },
  { termo: "tonka", materias: [95] },
  { termo: "cumarina", materias: [95] },
  { termo: "benjoim", materias: [88] },
  { termo: "cassis", materias: [97] },
  { termo: "groselha", materias: [97] },
  { termo: "cachaca", materias: [99] },
  { termo: "cana", materias: [99] },
  { termo: "vinho", materias: [97], lacuna: "vinho" },
  { termo: "champagne", lacuna: "champagne" },
  { termo: "espumante", lacuna: "champagne" },
  { termo: "cha", lacuna: "cha" },
  { termo: "caramelo", lacuna: "caramelo", grupo: "doces" },
  { termo: "doce", grupo: "doces" },
  { termo: "doces", grupo: "doces" },
  { termo: "adocicado", grupo: "doces" },
  { termo: "acucar", grupo: "doces" },
  { termo: "bolo", grupo: "doces" },

  // limpo
  { termo: "roupa limpa", lacuna: "limpo" },
  { termo: "sabonete", lacuna: "limpo" },
];

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export type Mencao = { termo: string; materias: number[]; grupo?: string; lacuna?: CodigoLacuna };

const ORDENADOS = [...TERMOS].sort((a, b) => b.termo.length - a.termo.length);

/** Encontra menções no texto. Cada trecho é consumido uma vez, do termo mais longo ao mais curto. */
export function encontrarMencoes(texto: string | undefined): Mencao[] {
  if (!texto || !texto.trim()) return [];
  let alvo = ` ${normalizar(texto)} `;
  const achados: Mencao[] = [];
  for (const t of ORDENADOS) {
    const padrao = ` ${t.termo} `;
    if (!alvo.includes(padrao)) continue;
    while (alvo.includes(padrao)) alvo = alvo.replace(padrao, " ".repeat(padrao.length - 1) + " ");
    if (t.ignorar) continue;
    if (!achados.some((a) => a.termo === t.termo)) {
      achados.push({ termo: t.termo, materias: t.materias ?? [], grupo: t.grupo, lacuna: t.lacuna });
    }
  }
  return achados;
}
