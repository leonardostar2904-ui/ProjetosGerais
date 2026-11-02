// GERADO a partir do Manual de Engenharia de Perfumaria Fina (seção 2.3, págs. 3 a 7)
// e da análise em icarus/perfume/pesquisa/ (CATALOGO-MATERIAS-PRIMAS.md).
// Nome, camada e descrição são literais do manual. Família, grupo e flags são marcações da análise.
// Nada aqui é fórmula: toda matéria-prima precisa de validação de perfumista e dados do lote.

export type GrupoOlfativo = "frescos" | "florais" | "amadeirados" | "doces" | "quentes" | "transversal";
export type Camada = "Topo" | "Saída" | "Coração" | "Fundo";

export type MateriaPrima = {
  n: number;
  nome: string;
  camadaManual: string;
  camadas: string[];
  familia: string;
  grupo: GrupoOlfativo;
  grupoSecundario: GrupoOlfativo | null;
  descricaoManual: string;
  alertas: string[];
  pagina: number;
  flags: {
    proibidaForma: boolean;
    fototoxica: "confirmada" | "verificar" | "pedir-laudo" | null;
    cites: "confirmado" | "verificar" | null;
    nativaBR: boolean;
    custoAlto: boolean;
    disponibilidadeRara: boolean;
    limiteUso: boolean;
    praticamenteInviavel: boolean;
    ehAcorde: boolean;
    duplicidadeCom?: number | null;
  };
};

export const VERSAO_CATALOGO = "manual-2026-11-02";

export const materiasPrimas: MateriaPrima[] = [
 {
  "n": 1,
  "nome": "Bergamota FCF (Citrus bergamia)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Universal. Espinha dorsal dos acordes Chypre e Fougère com lavanda, rosa e patchouli.",
  "alertas": [
   "OK: a versão FCF é justamente a sem bergapteno; a bergamota comum prensada é restrita por fototoxicidade [P]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 2,
  "nome": "Limão Siciliano (Citrus limon)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cítrico cortante. Ideal com manjericão, alecrim, vetiver e néroli.",
  "alertas": [
   "Fototóxico se prensado a frio (furocumarinas). Preferir destilado ou FCF e pedir laudo de bergapteno; entra no somatório do padrão IFRA de fototóxicos [V]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": "verificar",
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 3,
  "nome": "Limão Taiti (Limo)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Efervescente. Excelente com gengibre, hortelã, pimenta-rosa e acordes tropicais.",
  "alertas": [
   "Fototóxico se prensado a frio (furocumarinas). Preferir destilado ou FCF e pedir laudo de bergapteno; entra no somatório do padrão IFRA de fototóxicos [V]. Alternativa segura: #11 (lima destilada)"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": "verificar",
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 4,
  "nome": "Laranja Doce (Citrus sinensis)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Radiante e doce. Harmoniza com canela, cravo, baunilha, gerânio e olíbano.",
  "alertas": [],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 5,
  "nome": "Mandarina / Tangerina",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cítrico licoroso. Combina com cardamomo, flor de laranjeira, bálsamo de Tolu e sândalo.",
  "alertas": [
   "Se for prensado a frio, pedir laudo de furocumarinas ao fornecedor [V]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": "pedir-laudo",
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 6,
  "nome": "Grapefruit (Toranja)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cítrico amargo. Ideal com vetiver, cedro, pimenta-preta e gerânio.",
  "alertas": [
   "Fototóxico se prensado a frio (furocumarinas). Preferir destilado ou FCF e pedir laudo de bergapteno; entra no somatório do padrão IFRA de fototóxicos [V]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": "verificar",
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 7,
  "nome": "Petitgrain (Folha de Laranjeira-Azeda)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Cítrica verde",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Faceta verde/cítrica. Harmoniza com néroli, lavanda, alecrim e cedro.",
  "alertas": [],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 8,
  "nome": "Yuzu",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cítrico exótico. Perfeito com gengibre, sândalo, vetiver e pimenta-rosa.",
  "alertas": [
   "Se for prensado a frio, pedir laudo de furocumarinas ao fornecedor [V]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": "pedir-laudo",
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 9,
  "nome": "Cidra (Cedrat)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cítrico seco e elegante. Harmoniza com lavanda, tomilho e sândalo.",
  "alertas": [
   "Se for prensado a frio, pedir laudo de furocumarinas ao fornecedor [V]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": "pedir-laudo",
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 10,
  "nome": "Laranja Azeda (Bigarade)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cítrico denso e amargo. Ideal com gerânio, alecrim, néroli e noz-moscada.",
  "alertas": [
   "Fototóxico se prensado a frio (furocumarinas). Preferir destilado ou FCF e pedir laudo de bergapteno; entra no somatório do padrão IFRA de fototóxicos [V]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": "verificar",
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 11,
  "nome": "Casca de Lima Destilada",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Límpida e fresca. Combina com hortelã, eucalipto, cardamomo e baunilha.",
  "alertas": [
   "Destilação remove as furocumarinas: substituto seguro do #3 [I]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 12,
  "nome": "Clementina",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Doce e alegre. Combina com rosa, baunilha, sândalo e ylang-ylang.",
  "alertas": [
   "Se for prensado a frio, pedir laudo de furocumarinas ao fornecedor [V]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": "pedir-laudo",
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 13,
  "nome": "Verbena de Espanha",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Aromática cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Herbal cítrico límpido. Excelente com alecrim, lavanda e cedro.",
  "alertas": [
   "Identificar a espécie antes de usar. O óleo de verbena (Lippia citriodora) é proibido pela IFRA e pela UE; só o absoluto é permitido, com limite [P]. O nome 'verbena' é usado para espécies diferentes [V]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": true,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 14,
  "nome": "Litsea Cubeba (May Chang)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cítrico intenso. Combina com ylang-ylang, bergamota, patchouli e gerânio.",
  "alertas": [
   "Rico em citral, alergênico com limite IFRA [V]"
  ],
  "pagina": 3,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 15,
  "nome": "Capim-Limão (Lemongrass)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica herbal",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cortante e tônico. Mistura-se com gerânio, pimenta-preta, cedro e vetiver.",
  "alertas": [
   "Rico em citral, alergênico com limite IFRA [V]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 16,
  "nome": "Rosa Damascena (Óleo/Absoluto)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Soberana e aveludada. Combina com jasmim, gerânio, patchouli, baunilha, açafrão e oud.",
  "alertas": [
   "Contém metil eugenol, que limita a % de rosa na fórmula [M]",
   "Absoluto de custo alto [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 17,
  "nome": "Jasmim Grandiflorum / Sambac",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral branca",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Floral branco denso. Harmoniza com rosa, ylang-ylang, baunilha, sândalo e almíscar.",
  "alertas": [
   "Absoluto de custo alto [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 18,
  "nome": "Lavanda Bourbon (L. angustifolia)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Aromática",
  "grupo": "frescos",
  "grupoSecundario": "florais",
  "descricaoManual": "Aromático limpo. Base do acorde Fougère com bergamota, gerânio, coumarina e musgo.",
  "alertas": [],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 19,
  "nome": "Gerânio Bourbon",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral rosada",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Ponte floral/picante (rico em geraniol). Harmonizador entre cítricos e madeiras.",
  "alertas": [],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 20,
  "nome": "Ylang-Ylang (Extra/Completo)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral branca",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Exótico e adocicado. Perfeito com baunilha, sândalo, néroli e bergamota.",
  "alertas": [
   "Rico em alergênicos; verificar padrão IFRA para extratos de ylang [V]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 21,
  "nome": "Néroli (Flor de Laranjeira Destilada)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Floral cítrica",
  "grupo": "florais",
  "grupoSecundario": "frescos",
  "descricaoManual": "Floral cítrico radiante. Mistura-se com bergamota, lavanda, petitgrain e sândalo.",
  "alertas": [
   "Custo alto [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 22,
  "nome": "Absoluto de Flor de Laranjeira",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral branca",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Meloso e opulento. Perfeito com mandarina, bálsamo de Tolu, baunilha e benjoim.",
  "alertas": [
   "Custo alto [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 23,
  "nome": "Rizoma de Íris (Orris)",
  "camadaManual": "Coração / Fundo",
  "camadas": [
   "Coração",
   "Fundo"
  ],
  "familia": "Floral atalcada",
  "grupo": "florais",
  "grupoSecundario": "amadeirados",
  "descricaoManual": "Textura polvilhada (powdery). Harmoniza com rosa, violeta, sândalo e vetiver.",
  "alertas": [
   "Um dos insumos mais caros da perfumaria (manteiga/absoluto de íris) [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 24,
  "nome": "Tuberosa (Absoluto)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral branca",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Floral branca carnal. Combina com jasmim, ylang-ylang, pimenta-rosa e baunilha.",
  "alertas": [
   "Absoluto de custo alto [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 25,
  "nome": "Camomila Romana",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Aromática floral",
  "grupo": "frescos",
  "grupoSecundario": "florais",
  "descricaoManual": "Floral herbal com maçã. Combina com lavanda, bergamota, gerânio e sândalo.",
  "alertas": [],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 26,
  "nome": "Camomila Azul (Matricaria)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Aromática",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Herbal doce e profundo. Ideal com cedro, lavanda, gerânio e olíbano.",
  "alertas": [],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 27,
  "nome": "Sálvia Esclareia (Salvia sclarea)",
  "camadaManual": "Coração / Fundo",
  "camadas": [
   "Coração",
   "Fundo"
  ],
  "familia": "Aromática ambarada",
  "grupo": "frescos",
  "grupoSecundario": "quentes",
  "descricaoManual": "Herbal macia e ambarada. Combina com bergamota, lavanda, cedro e gerânio.",
  "alertas": [],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 28,
  "nome": "Seringa (Mock Orange)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Floral fresco primaveril. Mistura-se com limão siciliano, mandarina e gerânio.",
  "alertas": [
   "Natural praticamente inexistente no mercado; costuma ser reconstruído com sintéticos [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": true,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 29,
  "nome": "Frangipani (Jasmin-Manga)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral tropical",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Solar e tropical. Perfeita com ylang-ylang, baunilha, sândalo e coco.",
  "alertas": [
   "Absoluto raro e caro [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": true,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 30,
  "nome": "Lótus Rosa",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral aquática",
  "grupo": "florais",
  "grupoSecundario": "frescos",
  "descricaoManual": "Aquático e meditativo. Combina com bergamota, néroli, sândalo e olíbano.",
  "alertas": [
   "Absoluto raro e caro [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": true,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 31,
  "nome": "Osmanto (Osmanthus)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral frutada",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Floral com damasco e camurça. Mistura-se com vetiver, rosa, baunilha e patchouli.",
  "alertas": [
   "Absoluto de custo muito alto [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 32,
  "nome": "Borrônia (Boronia)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral frutada",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Frutada e amadeirada exótica. Combina com sândalo, bergamota e mimosa.",
  "alertas": [
   "Absoluto raro [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": true,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 33,
  "nome": "Mimosa (Absoluto)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral atalcada",
  "grupo": "florais",
  "grupoSecundario": null,
  "descricaoManual": "Macia e melosa. Perfeita com violeta, rosa, íris, baunilha e cedro.",
  "alertas": [
   "Absoluto de custo alto [I]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 34,
  "nome": "Folhas de Violeta (Absoluto)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Verde",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Verde, folhosa e ozônica. Combina com íris, rosa, cedro e vetiver.",
  "alertas": [],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 35,
  "nome": "Tagetes (Marigold)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Frutada herbal",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Frutada e herbácea intensa. Harmoniza com tangerina, patchouli e cravo.",
  "alertas": [
   "Restrito: T. minuta e T. patula até 0,01% em produtos que ficam na pele; T. erecta proibida. Fototóxico [P]"
  ],
  "pagina": 4,
  "flags": {
   "proibidaForma": true,
   "fototoxica": "confirmada",
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 36,
  "nome": "Alecrim (Salvia rosmarinus)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Aromática",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Tônico e revigorante. Mistura-se com limão, lavanda, cedro e hortelã.",
  "alertas": [],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 37,
  "nome": "Hortelã-Pimenta (Mentha piperita)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Aromática mentolada",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Menta gelada e expansiva. Combina com limão, eucalipto, bergamota e alecrim.",
  "alertas": [],
  "pagina": 4,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 38,
  "nome": "Hortelã-Verde (Mentha spicata)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Aromática mentolada",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Mentolado doce. Combina com mandarina, néroli, manjericão e baunilha.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 39,
  "nome": "Eucalipto Glóbulos",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Aromática canforada",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cânforado aberto. Ideal com hortelã, alecrim, lavanda e pinho.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 40,
  "nome": "Manjericão Linalol",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Aromática",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Verde e picante-doce. Combina com bergamota, limão, gerânio e vetiver.",
  "alertas": [
   "Confirmar quimiotipo linalol. O tipo metil chavicol é rico em estragol, de limite muito baixo [V]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 41,
  "nome": "Tomilho (Timol/Linalol)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Aromática",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Aromático quente. Perfeito com lavanda, alecrim, bergamota e cedro.",
  "alertas": [
   "Preferir quimiotipo linalol; timol irrita em concentração alta [I]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 42,
  "nome": "Sálvia Oficial",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Aromática",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Herbal seca. Combina com gerânio, lavanda, alecrim e pinho.",
  "alertas": [
   "Contém tujona; verificar uso e cautelas [V]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 43,
  "nome": "Manjerona",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Aromática",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Suave e condimentada. Combina com lavanda, bergamota, camomila e cedro.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 44,
  "nome": "Erva-Doce / Funcho Doce",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Aromática anisada",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Anetolado doce. Harmoniza com lavanda, rosa, néroli e cardamomo.",
  "alertas": [
   "Contém estragol (limite IFRA muito baixo na 51ª emenda); pedir teor no laudo [V]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 45,
  "nome": "Melaleuca (Tea Tree)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Aromática",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Herbal purificante. Combina com lavanda, alecrim, eucalipto e limão.",
  "alertas": [
   "Oxida com facilidade e passa a sensibilizar; armazenar bem [V]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 46,
  "nome": "Eucalipto Citriodora",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica aromática",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cítrico-cânforado. Combina com gerânio, bergamota, alfazema e cedro.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 47,
  "nome": "Palmarosa",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Floral herbal",
  "grupo": "florais",
  "grupoSecundario": "frescos",
  "descricaoManual": "Frescor herbal rosado. Combina com rosa, gerânio, bergamota e patchouli.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 48,
  "nome": "Citronela",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Cítrica herbal",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Cítrico-herbal vibrante. Combina com gerânio, bergamota, cedro e alecrim.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 49,
  "nome": "Priprioca (Cyperus articulatus)",
  "camadaManual": "Coração / Fundo",
  "camadas": [
   "Coração",
   "Fundo"
  ],
  "familia": "Amadeirada especiada",
  "grupo": "amadeirados",
  "grupoSecundario": "quentes",
  "descricaoManual": "Raiz amadeirada especiada. Combina com patchouli, cedro e breu-branco.",
  "alertas": [
   "Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": true,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 50,
  "nome": "Estoraque (Folha/Casca)",
  "camadaManual": "Coração / Fundo",
  "camadas": [
   "Coração",
   "Fundo"
  ],
  "familia": "Balsâmica",
  "grupo": "doces",
  "grupoSecundario": "quentes",
  "descricaoManual": "Balsâmico e aromático. Combina com baunilha, sândalo e cisto-lábdano.",
  "alertas": [
   "Identificar espécie e origem. Storax (Liquidambar) tem restrição IFRA [V]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 51,
  "nome": "Louro (Laurus nobilis)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Aromática especiada",
  "grupo": "frescos",
  "grupoSecundario": "quentes",
  "descricaoManual": "Picante e fresco. Combina com pimenta-preta, bergamota, lavanda e cedro.",
  "alertas": [
   "Contém eugenol e metil eugenol; status IFRA do óleo de folha inconclusivo [V]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 52,
  "nome": "Coentro (Sementes)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Especiada cítrica",
  "grupo": "quentes",
  "grupoSecundario": "frescos",
  "descricaoManual": "Cítrico-especiado. Perfeito com bergamota, noz-moscada e flor de laranjeira.",
  "alertas": [
   "Possível duplicidade com #68 (óleo de semente de coentro é destilado) [I]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": 68
  }
 },
 {
  "n": 53,
  "nome": "Salsa (Sementes)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Aromática verde",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Herbal verde seco. Combina com citrus, vetiver e lavanda.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 54,
  "nome": "Murta (Myrtle)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Aromática",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Resinoso-fresco limpo. Combina com bergamota, lavanda e alecrim.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 55,
  "nome": "Estragão (Tarragon)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Aromática anisada",
  "grupo": "frescos",
  "grupoSecundario": null,
  "descricaoManual": "Verde e anisado. Mistura-se com lavanda, gerânio, bergamota e rosa.",
  "alertas": [
   "Rico em estragol (cerca de 80%). O limite IFRA de estragol na 51ª emenda é muito baixo, o que praticamente inviabiliza o uso [P]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": true,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 56,
  "nome": "Canela (Casca/Folha)",
  "camadaManual": "Coração / Fundo",
  "camadas": [
   "Coração",
   "Fundo"
  ],
  "familia": "Especiada",
  "grupo": "quentes",
  "grupoSecundario": "doces",
  "descricaoManual": "Quente e envolvente. Combina com laranja, baunilha, cravo, olíbano e sândalo.",
  "alertas": [
   "Casca: cinamaldeído, sensibilizante forte com limite IFRA. Folha: rica em eugenol [V]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 57,
  "nome": "Cravo-da-Índia (Eugenol)",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Especiada",
  "grupo": "quentes",
  "grupoSecundario": null,
  "descricaoManual": "Picante marcante. Essencial em florais de cravo, rosa, gerânio e baunilha.",
  "alertas": [
   "Eugenol (limite IFRA) e metil eugenol, citado no manual [M]"
  ],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 58,
  "nome": "Cardamomo",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Especiada fresca",
  "grupo": "quentes",
  "grupoSecundario": "frescos",
  "descricaoManual": "Efervescente e aromático. Perfeito com mandarina, pimenta-preta, sândalo e vetiver.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 59,
  "nome": "Pimenta-Preta",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Especiada",
  "grupo": "quentes",
  "grupoSecundario": null,
  "descricaoManual": "Seco e vibrante. Combina com vetiver, cedro, pimenta-rosa, bergamota e rosa.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 60,
  "nome": "Pimenta-Rosa (Aroeira)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Especiada frutada",
  "grupo": "quentes",
  "grupoSecundario": "frescos",
  "descricaoManual": "Fresca e frutada. Combina com rosa, bergamota, vetiver e patchouli.",
  "alertas": [],
  "pagina": 5,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 61,
  "nome": "Noz-Moscada",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Especiada",
  "grupo": "quentes",
  "grupoSecundario": null,
  "descricaoManual": "Amadeirada e picante. Combina com canela, cardamomo, cedro e gerânio.",
  "alertas": [
   "Contém miristicina e traços de safrol; verificar limite [V]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 62,
  "nome": "Gengibre",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Especiada fresca",
  "grupo": "quentes",
  "grupoSecundario": "frescos",
  "descricaoManual": "Cítrico-picante efervescente. Combina com limão taiti, néroli, vetiver e baunilha.",
  "alertas": [
   "Possível sobreposição com #63 [I]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": 63
  }
 },
 {
  "n": 63,
  "nome": "Gengibre Fresco (Raiz)",
  "camadaManual": "Topo / Saída",
  "camadas": [
   "Topo",
   "Saída"
  ],
  "familia": "Especiada fresca",
  "grupo": "frescos",
  "grupoSecundario": "quentes",
  "descricaoManual": "Cortante e aquoso. Combina com bergamota, rosa e sândalo.",
  "alertas": [
   "Possível sobreposição com #62 [I]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": 62
  }
 },
 {
  "n": 64,
  "nome": "Açafrão (Saffron)",
  "camadaManual": "Coração / Fundo",
  "camadas": [
   "Coração",
   "Fundo"
  ],
  "familia": "Especiada couro",
  "grupo": "quentes",
  "grupoSecundario": null,
  "descricaoManual": "Couro especiado dourado. Essencial com rosa, oud, sândalo e âmbar.",
  "alertas": [
   "Natural raríssimo e caríssimo; quase sempre reconstruído (safranal e sintéticos) [I]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": true,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 65,
  "nome": "Anis-Estrelado",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Especiada anisada",
  "grupo": "quentes",
  "grupoSecundario": "doces",
  "descricaoManual": "Doce e licoroso. Combina com baunilha, rosa, laranja doce e cedro.",
  "alertas": [
   "Anetol e estragol; verificar teor e limite [V]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 66,
  "nome": "Cominho",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Especiada",
  "grupo": "quentes",
  "grupoSecundario": null,
  "descricaoManual": "Picante e sensual. Combina com rosa, patchouli, cedro, vetiver e bergamota.",
  "alertas": [
   "Fototóxico: padrão IFRA específico para óleo de cominho [P]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": "confirmada",
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 67,
  "nome": "Pimenta-da-Jamaica",
  "camadaManual": "Coração",
  "camadas": [
   "Coração"
  ],
  "familia": "Especiada",
  "grupo": "quentes",
  "grupoSecundario": null,
  "descricaoManual": "Fusão cravo/canela/noz-moscada. Combina com baunilha, laranja e patchouli.",
  "alertas": [
   "Eugenol e metil eugenol; verificar limite [V]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 68,
  "nome": "Semente de Coentro Destilada",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Especiada cítrica",
  "grupo": "quentes",
  "grupoSecundario": "frescos",
  "descricaoManual": "Amadeirado-cítrico. Harmoniza com gerânio, bergamota e sândalo.",
  "alertas": [
   "Possível duplicidade com #52 [I]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": 52
  }
 },
 {
  "n": 69,
  "nome": "Baunilha de Madagascar (Extrato)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Gourmand balsâmica",
  "grupo": "doces",
  "grupoSecundario": null,
  "descricaoManual": "Cremosa e balsâmica. Perfeita com cacau, canela, cisto-lábdano e benzoin.",
  "alertas": [
   "Extrato natural de custo alto [I]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 70,
  "nome": "Cacau (Absoluto)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Gourmand",
  "grupo": "doces",
  "grupoSecundario": null,
  "descricaoManual": "Gourmand rico e amargo. Combina com baunilha, patchouli, rosa e café.",
  "alertas": [],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 71,
  "nome": "Sândalo (Santalum album)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Amadeirada cremosa",
  "grupo": "amadeirados",
  "grupoSecundario": null,
  "descricaoManual": "Madeira cremosa e aveludada. Combina com rosa, jasmim, baunilha e bergamota.",
  "alertas": [
   "Custo muito alto; verificar origem e sustentabilidade da espécie [V]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 72,
  "nome": "Cedro da Virgínia / Atlas",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Amadeirada seca",
  "grupo": "amadeirados",
  "grupoSecundario": null,
  "descricaoManual": "Madeira seca e balsâmica. Combina com vetiver, bergamota, lavanda e pimenta.",
  "alertas": [],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 73,
  "nome": "Vetiver (Haiti / Java)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Amadeirada terrosa",
  "grupo": "amadeirados",
  "grupoSecundario": null,
  "descricaoManual": "Amadeirado seco, terroso e defumado. Excelente com grapefruit, pimenta e rosa.",
  "alertas": [],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 74,
  "nome": "Patchouli (Pogostemon cablin)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Amadeirada terrosa",
  "grupo": "amadeirados",
  "grupoSecundario": null,
  "descricaoManual": "Terroso e escuro. Espinha dorsal do Chypre com rosa, bergamota e cisto-lábdano.",
  "alertas": [],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 75,
  "nome": "Oud / Agarwood (Dehn al-Oud)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Amadeirada resinosa",
  "grupo": "amadeirados",
  "grupoSecundario": "quentes",
  "descricaoManual": "Amadeirado resinoso animalic. Combina com rosa damascena, açafrão e âmbar.",
  "alertas": [
   "CITES Apêndice II (Aquilaria, inclui o óleo): exige documentação de origem [P]",
   "Custo extremo; na prática quase todo 'oud' comercial é acorde reconstruído [I]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": "confirmado",
   "nativaBR": false,
   "custoAlto": true,
   "disponibilidadeRara": true,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 76,
  "nome": "Pau-Rosa (Rosewood)",
  "camadaManual": "Coração / Fundo",
  "camadas": [
   "Coração",
   "Fundo"
  ],
  "familia": "Amadeirada floral",
  "grupo": "amadeirados",
  "grupoSecundario": "florais",
  "descricaoManual": "Amadeirado-floral macio. Combina com bergamota, gerânio, rosa e ylang.",
  "alertas": [
   "CITES Apêndice II desde 2010, incluindo o óleo; espécie ameaçada [P]. Só com documentação de manejo autorizado, ou substituir (ex.: ho wood) [I]",
   "Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": "confirmado",
   "nativaBR": true,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 77,
  "nome": "Guaiaco (Pau-Santo)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Amadeirada defumada",
  "grupo": "amadeirados",
  "grupoSecundario": "quentes",
  "descricaoManual": "Defumado e rosado. Combina com patchouli, vetiver, rosa e baunilha.",
  "alertas": [
   "Identificar espécie: guaiaco (Bulnesia sarmientoi) não é o mesmo que palo santo (Bursera graveolens). Verificar CITES da Bulnesia [V]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": "verificar",
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 78,
  "nome": "Cipreste",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Amadeirada resinosa",
  "grupo": "amadeirados",
  "grupoSecundario": "frescos",
  "descricaoManual": "Amadeirado resinoso fresco. Combina com bergamota, lavanda e cedro.",
  "alertas": [],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 79,
  "nome": "Pinho Silvestre / Abeto",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Conífera",
  "grupo": "frescos",
  "grupoSecundario": "amadeirados",
  "descricaoManual": "Frescor florestal verde. Combina com lavanda, alecrim e eucalipto.",
  "alertas": [],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 80,
  "nome": "Zimbro (Juniper Berries)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Aromática amadeirada",
  "grupo": "frescos",
  "grupoSecundario": "amadeirados",
  "descricaoManual": "Aromático e amadeirado. Combina com vetiver, bergamota e pimenta.",
  "alertas": [],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 81,
  "nome": "Copaíba (Bálsamo)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Amadeirada balsâmica",
  "grupo": "amadeirados",
  "grupoSecundario": null,
  "descricaoManual": "Amadeirado suave e fixador. Combina com rosa, patchouli e cedro.",
  "alertas": [
   "Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": true,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 82,
  "nome": "Cabrúva",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Amadeirada floral",
  "grupo": "amadeirados",
  "grupoSecundario": null,
  "descricaoManual": "Amadeirado-floral doce. Combina com ylang-ylang, gerânio e rosa.",
  "alertas": [
   "Nome usual: cabreúva (Myrocarpus) [I]",
   "Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": true,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 83,
  "nome": "Candeia",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Amadeirada",
  "grupo": "amadeirados",
  "grupoSecundario": null,
  "descricaoManual": "Amadeirada macia. Combina com lavanda, camomila e cedro.",
  "alertas": [
   "Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]"
  ],
  "pagina": 6,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": true,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 84,
  "nome": "Semente de Ambreta",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Almiscarada",
  "grupo": "transversal",
  "grupoSecundario": "florais",
  "descricaoManual": "Almiscarado vegetal. Combina com íris, rosa, sândalo e vetiver.",
  "alertas": [
   "Não confundir com 'musk ambrette', almíscar sintético proibido [I]"
  ],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 85,
  "nome": "Cálamo (Acorus calamus)",
  "camadaManual": "Coração / Fundo",
  "camadas": [
   "Coração",
   "Fundo"
  ],
  "familia": "Amadeirada especiada",
  "grupo": "amadeirados",
  "grupoSecundario": "quentes",
  "descricaoManual": "Amadeirado especiado exótico. Combina com patchouli, canela e cedro.",
  "alertas": [
   "Asarona (carcinogênica): limite de 0,01% no produto final segundo fontes secundárias; óleos ricos em beta-asarona ficam praticamente inviáveis [V]"
  ],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": true,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 86,
  "nome": "Olíbano (Frankincense)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Resinosa (incenso)",
  "grupo": "quentes",
  "grupoSecundario": null,
  "descricaoManual": "Resinoso cítrico-defumado. Combina com mirra, bergamota, rosa e cedro.",
  "alertas": [],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 87,
  "nome": "Mirra (Commiphora myrrha)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Resinosa balsâmica",
  "grupo": "quentes",
  "grupoSecundario": null,
  "descricaoManual": "Balsâmica e quente. Combina com olíbano, baunilha, rosa e patchouli.",
  "alertas": [],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 88,
  "nome": "Benjoim de Sião (Styrax)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Balsâmica",
  "grupo": "doces",
  "grupoSecundario": null,
  "descricaoManual": "Balsâmico abaunilhado. Combina com baunilha, flor de laranjeira e rosa.",
  "alertas": [
   "Benjoim de Sião é Styrax tonkinensis; não confundir com storax (Liquidambar) [I]"
  ],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 89,
  "nome": "Cisto-Lábdano (Labdanum)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Âmbar",
  "grupo": "quentes",
  "grupoSecundario": "doces",
  "descricaoManual": "Ambarado e denso. Pilar dos acordes Âmbar e Chypre com baunilha.",
  "alertas": [],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 90,
  "nome": "Bálsamo do Peru",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Balsâmica",
  "grupo": "doces",
  "grupoSecundario": null,
  "descricaoManual": "Resinoso abaunilhado/canela. Combina com flor de laranjeira e mandarina.",
  "alertas": [
   "Forma bruta PROIBIDA pela IFRA (STD 071). Só óleo, absoluto ou anidrol, com limite por categoria [P]"
  ],
  "pagina": 7,
  "flags": {
   "proibidaForma": true,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 91,
  "nome": "Bálsamo de Tolu",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Balsâmica",
  "grupo": "doces",
  "grupoSecundario": null,
  "descricaoManual": "Caloroso e doce. Combina com rosa, baunilha, cisto-lábdano e noz-moscada.",
  "alertas": [],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 92,
  "nome": "Elemi",
  "camadaManual": "Topo / Fundo",
  "camadas": [
   "Topo",
   "Fundo"
  ],
  "familia": "Resinosa cítrica",
  "grupo": "quentes",
  "grupoSecundario": "frescos",
  "descricaoManual": "Resinoso limão-apimentado. Combina com olíbano, pimenta-preta e vetiver.",
  "alertas": [],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 93,
  "nome": "Breu-Branco",
  "camadaManual": "Topo / Fundo",
  "camadas": [
   "Topo",
   "Fundo"
  ],
  "familia": "Resinosa fresca",
  "grupo": "quentes",
  "grupoSecundario": "frescos",
  "descricaoManual": "Resinoso fresco aromático. Combina com pimenta-rosa, priprioca e cedro.",
  "alertas": [
   "Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]"
  ],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": true,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 94,
  "nome": "Café (Absoluto)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Gourmand",
  "grupo": "doces",
  "grupoSecundario": null,
  "descricaoManual": "Torrado e amargo. Combina com baunilha, cacau, cardamomo e patchouli.",
  "alertas": [],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 95,
  "nome": "Fava-Tonca (Coumarina)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Gourmand cumarínica",
  "grupo": "doces",
  "grupoSecundario": null,
  "descricaoManual": "Amendoado e feno doce. Pilar do Fougère com lavanda e bergamota.",
  "alertas": [
   "Cumarina: limite de 1,5% no produto final, Categoria 4 (49ª emenda; confirmar na vigente) [P]"
  ],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 96,
  "nome": "Musgo de Carvalho (Oakmoss)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Musgosa (chypre)",
  "grupo": "amadeirados",
  "grupoSecundario": null,
  "descricaoManual": "Terroso e florestal. Pilar do Chypre e Fougère com bergamota e lavanda.",
  "alertas": [
   "Atranol e cloroatranol proibidos na UE desde 2019/2021 (Reg. 2017/1410). Usar só extrato de baixo atranol, dentro do limite IFRA [P]"
  ],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 97,
  "nome": "Cassis / Groselha-Preta",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Frutada",
  "grupo": "frescos",
  "grupoSecundario": "florais",
  "descricaoManual": "Frutado verde e ácido. Combina com rosa, bergamota e jasmim.",
  "alertas": [],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 98,
  "nome": "Feno Cortado (Absoluto)",
  "camadaManual": "Coração / Fundo",
  "camadas": [
   "Coração",
   "Fundo"
  ],
  "familia": "Aromática cumarínica",
  "grupo": "frescos",
  "grupoSecundario": "doces",
  "descricaoManual": "Herbáceo doce. Combina com lavanda, sálvia esclareia e fava-tonca.",
  "alertas": [
   "Contém cumarina: soma no limite da cumarina [I]"
  ],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": true,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 99,
  "nome": "Extrato de Cachaça (Cana)",
  "camadaManual": "Topo / Coração",
  "camadas": [
   "Topo",
   "Coração"
  ],
  "familia": "Gourmand",
  "grupo": "doces",
  "grupoSecundario": "frescos",
  "descricaoManual": "Alcoólico vegetal doce. Combina com limão taiti, baunilha e gengibre.",
  "alertas": [],
  "pagina": 7,
  "flags": {
   "proibidaForma": false,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": false,
   "duplicidadeCom": null
  }
 },
 {
  "n": 100,
  "nome": "Acorde Couro (Bétula/Labdanum)",
  "camadaManual": "Fundo",
  "camadas": [
   "Fundo"
  ],
  "familia": "Couro",
  "grupo": "quentes",
  "grupoSecundario": null,
  "descricaoManual": "Defumado e camurça. Harmoniza com açafrão, rosa, oud e patchouli.",
  "alertas": [
   "Não é matéria-prima: é um acorde [M]. Bétula bruta PROIBIDA pela IFRA (STD 114); só a retificada, com limite de PAH [P]"
  ],
  "pagina": 7,
  "flags": {
   "proibidaForma": true,
   "fototoxica": null,
   "cites": null,
   "nativaBR": false,
   "custoAlto": false,
   "disponibilidadeRara": false,
   "limiteUso": false,
   "praticamenteInviavel": false,
   "ehAcorde": true,
   "duplicidadeCom": null
  }
 }
];
