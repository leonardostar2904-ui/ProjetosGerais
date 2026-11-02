import type { Opcao, Pergunta } from "./tipos";

// FONTE ÚNICA DO QUESTIONÁRIO (versão v1, 52 perguntas aprovadas em 02/11/2026).
// Para mudar uma pergunta, edite só este arquivo. O "id" e o "valor" das opções são
// chaves do banco de dados: não renomeie depois que houver respostas reais.
//
// Regras de obrigatoriedade desta versão (hipótese registrada no README):
// - obrigatórias: escolhas e escalas que orientam a fórmula e não são sensíveis;
// - opcionais: textos abertos, dados pessoais e de saúde, e toda a etapa 07;
// - o nome (pergunta 2) é a única resposta de texto obrigatória.

export const VERSAO_QUESTIONARIO = "v1-52";

const ATE_DOIS = "Escolha até 2.";
const NAO_INFORMAR: Opcao = { valor: "nao-informar", rotulo: "Prefiro não informar" };

export const perguntas: Pergunta[] = [
  // ─────────────── ETAPA 01 · ABERTURA ───────────────
  {
    id: "q01", numero: 1, capitulo: 1, destino: "respostas",
    enunciado: "O que te motivou a criar o seu perfume?",
    ajuda: ATE_DOIS,
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: true,
    opcoes: [
      { valor: "nunca-achei", rotulo: "Nunca achei um perfume que fosse a minha cara" },
      { valor: "cheiro-unico", rotulo: "Ter um cheiro que ninguém mais tem" },
      { valor: "nova-fase", rotulo: "Marcar uma nova fase da minha vida" },
      { valor: "presente", rotulo: "Me dar um presente que eu mereço" },
      { valor: "curiosidade", rotulo: "Curiosidade de me ver traduzido(a) em um cheiro" },
    ],
  },

  // ─────────────── ETAPA 02 · CONTEXTO E ROTINA ───────────────
  {
    id: "q02", numero: 2, capitulo: 2, destino: "contato",
    enunciado: "Como podemos te chamar?",
    tipo: "texto-curto", obrigatoria: true,
    placeholder: "Seu nome ou apelido",
  },
  {
    id: "q03", numero: 3, capitulo: 2, destino: "respostas",
    enunciado: "Qual é a sua faixa de idade?",
    tipo: "escolha-unica", obrigatoria: true,
    opcoes: [
      { valor: "18-24", rotulo: "18 a 24" },
      { valor: "25-34", rotulo: "25 a 34" },
      { valor: "35-44", rotulo: "35 a 44" },
      { valor: "45-mais", rotulo: "45 ou mais" },
    ],
  },
  {
    id: "q04", numero: 4, capitulo: 2, destino: "dados_sensiveis", sensivel: "pessoal",
    enunciado: "Qual é o seu sexo?",
    ajuda: "Ajuda a calibrar a base da fórmula. Nunca limita as notas que você pode receber.",
    tipo: "escolha-unica", obrigatoria: false,
    opcoes: [
      { valor: "feminino", rotulo: "Feminino" },
      { valor: "masculino", rotulo: "Masculino" },
      { valor: "intersexo", rotulo: "Intersexo" },
      NAO_INFORMAR,
    ],
  },
  {
    id: "q05", numero: 5, capitulo: 2, destino: "dados_sensiveis", sensivel: "pessoal",
    enunciado: "Com qual gênero você se identifica?",
    tipo: "escolha-unica", obrigatoria: false,
    opcoes: [
      { valor: "mulher", rotulo: "Mulher" },
      { valor: "homem", rotulo: "Homem" },
      { valor: "nao-binario", rotulo: "Não binário" },
      { valor: "outro", rotulo: "Outro" },
      NAO_INFORMAR,
    ],
  },
  {
    id: "q06", numero: 6, capitulo: 2, destino: "respostas",
    enunciado: "Como é o clima onde você mais circula?",
    ajuda: "Escolha até 2. O calor muda como o perfume abre e quanto ele dura.",
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: true, variante: "clima",
    opcoes: [
      { valor: "quente-umido", rotulo: "Quente e úmido", descricao: "Calor com ar pesado." },
      { valor: "quente-seco", rotulo: "Quente e seco", descricao: "Sol forte e ar seco." },
      { valor: "ameno", rotulo: "Ameno", descricao: "Nem muito quente, nem frio." },
      { valor: "frio", rotulo: "Frio", descricao: "Agasalho boa parte do ano." },
      { valor: "varia", rotulo: "Varia muito ao longo do ano", descricao: "Cada estação é diferente." },
    ],
  },
  {
    id: "q07", numero: 7, capitulo: 2, destino: "respostas",
    enunciado: "Descreva um dia típico seu, da hora que acorda até dormir.",
    ajuda: "Não precisa ser longo.",
    tipo: "texto-longo", obrigatoria: false, variante: "rotina",
    placeholder: "Escreva do seu jeito. Pode ser em tópicos.",
  },

  // ─────────────── ETAPA 03 · PERSONALIDADE E IDENTIDADE ───────────────
  {
    id: "q08", numero: 8, capitulo: 3, destino: "respostas",
    enunciado: "Em grupo, você se recolhe ou ocupa o espaço?",
    tipo: "escala", obrigatoria: true,
    escala: { min: "Mais reservado(a)", max: "Mais expansivo(a)" },
  },
  {
    id: "q09", numero: 9, capitulo: 3, destino: "respostas",
    enunciado: "Você planeja ou improvisa?",
    tipo: "escala", obrigatoria: true,
    escala: { min: "Planejo tudo", max: "Improviso" },
  },
  {
    id: "q10", numero: 10, capitulo: 3, destino: "respostas",
    enunciado: "Como você se apresenta ao mundo?",
    tipo: "escala", obrigatoria: true,
    escala: { min: "Discreto(a)", max: "Marcante" },
  },
  {
    id: "q11", numero: 11, capitulo: 3, destino: "respostas",
    enunciado: "Seu estilo pessoal está mais para...",
    tipo: "escala", obrigatoria: true,
    escala: { min: "Clássico", max: "Moderno e ousado" },
  },
  {
    id: "q12", numero: 12, capitulo: 3, destino: "respostas",
    enunciado: "Escolha três palavras que te descrevem.",
    ajuda: "Uma palavra em cada espaço.",
    tipo: "tres-palavras", obrigatoria: false,
  },
  {
    id: "q13", numero: 13, capitulo: 3, destino: "respostas",
    enunciado: "O que as pessoas costumam errar sobre você na primeira impressão?",
    tipo: "texto-longo", obrigatoria: false,
    placeholder: "Escreva do seu jeito.",
  },

  // ─────────────── ETAPA 04 · VIDA SOCIAL E RELACIONAMENTOS ───────────────
  {
    id: "q14", numero: 14, capitulo: 4, destino: "respostas",
    enunciado: "Como é a sua roda de amigos?",
    tipo: "escolha-unica", obrigatoria: true,
    opcoes: [
      { valor: "poucos-proximos", rotulo: "Poucos e muito próximos" },
      { valor: "grupo-medio", rotulo: "Um grupo médio e fiel" },
      { valor: "muita-gente", rotulo: "Muita gente, vários círculos" },
    ],
  },
  {
    id: "q15", numero: 15, capitulo: 4, destino: "respostas",
    enunciado: "Como são os encontros com seus amigos?",
    ajuda: ATE_DOIS,
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: true, variante: "cartoes-descricao",
    opcoes: [
      { valor: "festa", rotulo: "Festa e agito", descricao: "Música, gente e noite longa." },
      { valor: "conversa", rotulo: "Conversa longa e boa comida", descricao: "Mesa cheia e assunto que não acaba." },
      { valor: "ar-livre", rotulo: "Ao ar livre", descricao: "Parque, praia, trilha ou rua." },
      { valor: "cultura", rotulo: "Cinema, música e arte", descricao: "Sessão, show, exposição." },
      { valor: "casa", rotulo: "Em casa, no sossego", descricao: "Poucas pessoas e tempo sem pressa." },
    ],
  },
  {
    id: "q16", numero: 16, capitulo: 4, destino: "respostas",
    enunciado: "Qual é o seu papel no grupo?",
    ajuda: ATE_DOIS,
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: true,
    opcoes: [
      { valor: "anima", rotulo: "Quem anima" },
      { valor: "escuta", rotulo: "Quem escuta e aconselha" },
      { valor: "organiza", rotulo: "Quem puxa e organiza" },
      { valor: "observa", rotulo: "Quem observa e solta a melhor sacada" },
      { valor: "junta", rotulo: "Quem junta todo mundo" },
    ],
  },
  {
    id: "q17", numero: 17, capitulo: 4, destino: "dados_sensiveis", sensivel: "pessoal",
    enunciado: "Qual é o seu momento afetivo?",
    tipo: "escolha-unica", obrigatoria: false,
    opcoes: [
      { valor: "solteiro", rotulo: "Solteiro(a)" },
      { valor: "relacionamento", rotulo: "Em um relacionamento" },
      { valor: "casado", rotulo: "Casado(a) ou união estável" },
      { valor: "nao-rotular", rotulo: "Prefiro não rotular" },
      NAO_INFORMAR,
    ],
  },
  {
    id: "q18", numero: 18, capitulo: 4, destino: "respostas",
    enunciado: "Pense na pessoa mais importante da sua vida hoje. O que ela diria que é o seu melhor?",
    tipo: "texto-longo", obrigatoria: false,
    placeholder: "Do jeito que essa pessoa falaria.",
  },

  // ─────────────── ETAPA 05 · UNIVERSO OLFATIVO E MEMÓRIAS ───────────────
  {
    id: "q19", numero: 19, capitulo: 5, destino: "respostas",
    enunciado: "Quais destes cheiros mais te agradam?",
    ajuda: ATE_DOIS,
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: true, variante: "familias",
    opcoes: [
      {
        valor: "frescos", rotulo: "Frescos", descricao: "Cítricos, mar, folhas verdes",
        imagem: "/marca/familias/frescos.jpg", imagemAlt: "Gotas de chuva numa janela, com a cidade ao fundo",
      },
      {
        valor: "florais", rotulo: "Florais", descricao: "Jasmim, rosa, flor de laranjeira",
        imagem: "/marca/familias/florais.jpg", imagemAlt: "Ramos secos de lavanda e uma pétala sobre pedra",
      },
      {
        valor: "amadeirados", rotulo: "Amadeirados e terrosos", descricao: "Cedro, sândalo, vetiver",
        imagem: "/marca/familias/amadeirados.jpg", imagemAlt: "Tampo de madeira iluminado pela luz da tarde",
      },
      {
        valor: "doces", rotulo: "Doces e gourmand", descricao: "Baunilha, caramelo, café, cacau",
        imagem: "/marca/familias/doces.jpg", imagemAlt: "Xícara de café com vapor sobre a mesa",
      },
      {
        valor: "quentes", rotulo: "Quentes e intensos", descricao: "Especiarias, couro, incenso, tabaco",
        imagem: "/marca/familias/quentes.jpg", imagemAlt: "Faixa de luz âmbar atravessando o azul",
      },
    ],
  },
  {
    id: "q20", numero: 20, capitulo: 5, destino: "respostas",
    enunciado: "Algum cheiro que você não suporta?",
    tipo: "texto-longo", obrigatoria: false,
    placeholder: "Escreva do seu jeito.",
  },
  {
    id: "q21", numero: 21, capitulo: 5, destino: "respostas",
    enunciado: "Qual cheiro te leva de volta a um momento especial?",
    tipo: "texto-longo", obrigatoria: false,
    placeholder: "Conte no seu tempo.",
  },
  {
    id: "q22", numero: 22, capitulo: 5, destino: "respostas",
    enunciado: "Qual é o cheiro da sua infância?",
    tipo: "texto-longo", obrigatoria: false,
    placeholder: "Conte no seu tempo.",
  },
  {
    id: "q23", numero: 23, capitulo: 5, destino: "respostas",
    enunciado: "Onde você se sente mais você?",
    ajuda: ATE_DOIS,
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: true, variante: "cartoes-descricao",
    opcoes: [
      { valor: "praia", rotulo: "Praia", descricao: "Sal, sol e horizonte aberto." },
      { valor: "mata", rotulo: "Mata, montanha e cachoeira", descricao: "Verde, altitude e água corrente." },
      { valor: "cidade", rotulo: "Cidade grande", descricao: "Movimento, prédios e luz da noite." },
      { valor: "casa", rotulo: "Em casa", descricao: "O seu canto, do seu jeito." },
      { valor: "bares", rotulo: "Bares e casas de show", descricao: "Música ao vivo e gente por perto." },
    ],
  },
  {
    id: "q24", numero: 24, capitulo: 5, destino: "respostas",
    enunciado: "Qual estação do ano combina com você?",
    tipo: "escolha-unica", obrigatoria: true, variante: "estacoes",
    opcoes: [
      { valor: "verao", rotulo: "Verão", descricao: "Dez a mar" },
      { valor: "outono", rotulo: "Outono", descricao: "Mar a jun" },
      { valor: "inverno", rotulo: "Inverno", descricao: "Jun a set" },
      { valor: "primavera", rotulo: "Primavera", descricao: "Set a dez" },
    ],
  },
  {
    id: "q25", numero: 25, capitulo: 5, destino: "respostas",
    enunciado: "Se você fosse uma bebida, qual seria?",
    ajuda: ATE_DOIS,
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: true, variante: "bebidas",
    opcoes: [
      { valor: "cafe", rotulo: "Café forte", descricao: "Torrado e intenso." },
      { valor: "vinho", rotulo: "Vinho tinto", descricao: "Encorpado e profundo." },
      { valor: "gin", rotulo: "Gin tônica", descricao: "Cítrico, gelado e botânico." },
      { valor: "cha", rotulo: "Chá", descricao: "Calmo e aromático." },
      { valor: "champagne", rotulo: "Champagne", descricao: "Leve e de celebração." },
    ],
  },

  // ─────────────── ETAPA 06 · COMPORTAMENTO E UTILIZAÇÃO ───────────────
  {
    id: "q26", numero: 26, capitulo: 6, destino: "respostas",
    enunciado: "Em quais ocasiões você quer usar esse perfume?",
    ajuda: ATE_DOIS,
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: true,
    opcoes: [
      { valor: "trabalho", rotulo: "Trabalho e dia a dia" },
      { valor: "encontros", rotulo: "Encontros" },
      { valor: "noite", rotulo: "Festas e noite" },
      { valor: "eventos", rotulo: "Eventos especiais" },
      { valor: "treino", rotulo: "Depois do treino, pra me sentir limpo(a)" },
    ],
  },
  {
    id: "q27", numero: 27, capitulo: 6, destino: "respostas",
    enunciado: "Em que momento do dia você mais usa perfume?",
    tipo: "escolha-unica", obrigatoria: true,
    opcoes: [
      { valor: "manha", rotulo: "Manhã" },
      { valor: "tarde", rotulo: "Tarde" },
      { valor: "noite", rotulo: "Noite" },
      { valor: "dia-todo", rotulo: "Passo de manhã e quero que dure o dia todo" },
    ],
  },
  {
    id: "q28", numero: 28, capitulo: 6, destino: "respostas",
    enunciado: "Que intensidade você prefere?",
    tipo: "escala", obrigatoria: true, variante: "projecao",
    escala: { min: "Suave, só de perto", max: "Marcante, deixa rastro" },
  },
  {
    id: "q29", numero: 29, capitulo: 6, destino: "respostas",
    enunciado: "Quanto a duração na pele importa para você?",
    tipo: "escala", obrigatoria: true,
    escala: { min: "Pouco", max: "É essencial" },
  },
  {
    id: "q30", numero: 30, capitulo: 6, destino: "respostas",
    enunciado: "Quais perfumes você já usou? Quais amou e quais não funcionaram?",
    ajuda: "Pode citar nomes, descrever experiências e explicar o que não funcionou.",
    tipo: "texto-longo", obrigatoria: false,
    placeholder: "Nomes, lembranças, o que funcionou e o que não funcionou.",
  },

  // ─────────────── ETAPA 07 · RESTRIÇÕES E PREFERÊNCIAS ───────────────
  {
    id: "q31", numero: 31, capitulo: 7, destino: "dados_sensiveis", sensivel: "saude",
    enunciado: "Você tem alergia ou sensibilidade a perfumes, cosméticos ou ingredientes?",
    ajuda: "Ajuda a evitar ingredientes que não combinam com você.",
    tipo: "escolha-unica", obrigatoria: false,
    opcoes: [
      { valor: "nao", rotulo: "Não" },
      { valor: "sim", rotulo: "Sim" },
      { valor: "nao-sei", rotulo: "Não sei" },
    ],
  },
  {
    id: "q32", numero: 32, capitulo: 7, destino: "dados_sensiveis", sensivel: "saude",
    enunciado: "Quais?",
    ajuda: "Ingredientes, produtos ou reações que você lembra.",
    tipo: "texto-longo", obrigatoria: false,
    condicao: { pergunta: "q31", em: ["sim", "nao-sei"] },
    placeholder: "Escreva o que você souber.",
  },
  {
    id: "q33", numero: 33, capitulo: 7, destino: "respostas",
    enunciado: "Como você reage a perfumes fortes no ambiente?",
    tipo: "escolha-unica", obrigatoria: false,
    opcoes: [
      { valor: "nao-incomoda", rotulo: "Não me incomoda" },
      { valor: "incomoda-pouco", rotulo: "Incomoda um pouco" },
      { valor: "dor-cabeca", rotulo: "Me dá dor de cabeça ou enjoo" },
    ],
  },
  {
    id: "q34", numero: 34, capitulo: 7, destino: "dados_sensiveis", sensivel: "pessoal",
    enunciado: "Você evita algum ingrediente por motivo ético ou religioso?",
    ajuda: "Escolha até 2. A opção Nenhum desmarca as outras.",
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: false,
    opcoes: [
      { valor: "origem-animal", rotulo: "Origem animal" },
      { valor: "alcool", rotulo: "Álcool" },
      { valor: "testados-animais", rotulo: "Testados em animais" },
      { valor: "sinteticos", rotulo: "Sintéticos em geral" },
      { valor: "nenhum", rotulo: "Nenhum", exclusiva: true },
    ],
  },

  // ─────────────── ETAPA 08 · PELE E EXPERIÊNCIA DE USO ───────────────
  {
    id: "q35", numero: 35, capitulo: 8, grupo: "A", destino: "respostas",
    enunciado: "Sua pele costuma ser mais seca ou oleosa?",
    tipo: "escolha-unica", obrigatoria: true,
    opcoes: [
      { valor: "seca", rotulo: "Mais seca" },
      { valor: "normal-mista", rotulo: "Normal ou mista" },
      { valor: "oleosa", rotulo: "Mais oleosa" },
      { valor: "nao-sei", rotulo: "Não sei dizer" },
    ],
  },
  {
    id: "q36", numero: 36, capitulo: 8, grupo: "A", destino: "respostas",
    enunciado: "Você usa hidratante corporal diariamente?",
    tipo: "escolha-unica", obrigatoria: true,
    opcoes: [
      { valor: "todos-dias", rotulo: "Todos os dias" },
      { valor: "as-vezes", rotulo: "Às vezes" },
      { valor: "quase-nunca", rotulo: "Quase nunca" },
    ],
  },
  {
    id: "q37", numero: 37, capitulo: 8, grupo: "B", destino: "respostas",
    enunciado: "Quando você usa perfumes comerciais, quanto tempo eles duram na sua pele?",
    tipo: "escolha-unica", obrigatoria: true,
    opcoes: [
      { valor: "somem", rotulo: "Somem em poucas horas" },
      { valor: "metade-dia", rotulo: "Duram metade do dia" },
      { valor: "dia-todo", rotulo: "Duram o dia todo" },
      { valor: "nao-sei", rotulo: "Não sei dizer" },
    ],
  },
  {
    id: "q38", numero: 38, capitulo: 8, grupo: "B", destino: "respostas",
    enunciado: "Perfumes cítricos ou florais ficam com aspecto azedo, metálico ou ardido em você?",
    tipo: "escolha-unica", obrigatoria: true,
    opcoes: [
      { valor: "nao-mudam", rotulo: "Não, ficam como no frasco" },
      { valor: "as-vezes", rotulo: "Às vezes mudam" },
      { valor: "quase-sempre", rotulo: "Sim, quase sempre mudam" },
      { valor: "nunca-percebi", rotulo: "Nunca percebi" },
    ],
  },
  {
    id: "q39", numero: 39, capitulo: 8, grupo: "C", destino: "respostas",
    enunciado: "Sua alimentação inclui bastante café, pimenta ou especiarias?",
    tipo: "escolha-unica", obrigatoria: false,
    opcoes: [
      { valor: "quase-todo-dia", rotulo: "Quase todo dia" },
      { valor: "algumas-vezes", rotulo: "Algumas vezes por semana" },
      { valor: "raramente", rotulo: "Raramente" },
    ],
  },
  {
    id: "q40", numero: 40, capitulo: 8, grupo: "C", destino: "respostas",
    enunciado: "Como é o seu nível de estresse na rotina de trabalho?",
    tipo: "escala", obrigatoria: false,
    escala: { min: "Tranquilo", max: "Muito estressante" },
  },
  {
    id: "q41", numero: 41, capitulo: 8, grupo: "C", destino: "dados_sensiveis", sensivel: "saude",
    enunciado: "Você está gestante ou amamentando?",
    ajuda: "Usado só para escolher ingredientes com mais cuidado.",
    tipo: "escolha-unica", obrigatoria: false,
    condicao: { pergunta: "q04", naoEm: ["masculino"] },
    opcoes: [
      { valor: "sim", rotulo: "Sim" },
      { valor: "nao", rotulo: "Não" },
      NAO_INFORMAR,
    ],
  },
  {
    id: "q42", numero: 42, capitulo: 8, grupo: "C", destino: "dados_sensiveis", sensivel: "saude",
    enunciado: "Alguma destas situações se aplica a você hoje?",
    ajuda: "Usado só como contexto. Não pedimos detalhes.",
    tipo: "escolha-unica", obrigatoria: false,
    opcoes: [
      { valor: "nenhuma", rotulo: "Nenhuma" },
      { valor: "hormonal", rotulo: "Transição ou mudança hormonal" },
      { valor: "medicamento", rotulo: "Medicamento de uso contínuo" },
      { valor: "as-duas", rotulo: "As duas" },
      NAO_INFORMAR,
    ],
  },

  // ─────────────── ETAPA 09 · PRODUTO, EXCLUSIVIDADE E INVESTIMENTO ───────────────
  {
    id: "q43", numero: 43, capitulo: 9, destino: "respostas",
    enunciado: "Quanto você costuma investir em um perfume hoje?",
    tipo: "escolha-unica", obrigatoria: true, variante: "investimento",
    opcoes: [
      { valor: "ate-150", rotulo: "Até R$ 150" },
      { valor: "150-300", rotulo: "R$ 150 a 300" },
      { valor: "300-600", rotulo: "R$ 300 a 600" },
      { valor: "acima-600", rotulo: "Acima de R$ 600" },
    ],
  },
  {
    id: "q44", numero: 44, capitulo: 9, destino: "respostas",
    enunciado: "O que mais pesa na sua escolha de um perfume?",
    ajuda: ATE_DOIS,
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: true,
    opcoes: [
      { valor: "cheiro-unico", rotulo: "Cheiro único" },
      { valor: "fixacao", rotulo: "Fixação" },
      { valor: "naturais", rotulo: "Ingredientes naturais" },
      { valor: "marca-status", rotulo: "Marca e status" },
      { valor: "preco", rotulo: "Preço" },
    ],
  },
  {
    id: "q45", numero: 45, capitulo: 9, destino: "respostas",
    enunciado: "Quanto importa que ninguém mais tenha o mesmo cheiro que você?",
    tipo: "escala", obrigatoria: true,
    escala: { min: "Não me importo", max: "É o mais importante" },
  },
  {
    id: "q46", numero: 46, capitulo: 9, destino: "respostas",
    enunciado: "Você aceitaria que a sua fórmula inspirasse coleções futuras da ICARUS em troca de desconto?",
    ajuda: "Isto não é um contrato. Nada é decidido sem a sua autorização no momento da compra.",
    tipo: "escolha-unica", obrigatoria: true, variante: "reproducao",
    opcoes: [
      {
        valor: "sim-desconto", rotulo: "Sim, com desconto",
        descricao: "Sua fórmula pode inspirar coleções futuras da ICARUS. Em troca, você paga menos pelo seu perfume.",
      },
      {
        valor: "nao-exclusivo", rotulo: "Não, quero só meu",
        descricao: "Você prefere que a sua fórmula não inspire outros perfumes.",
      },
      {
        valor: "depende", rotulo: "Depende do tamanho do desconto",
        descricao: "Você decide depois de conhecer o valor do desconto.",
      },
    ],
  },
  {
    id: "q47", numero: 47, capitulo: 9, destino: "respostas",
    enunciado: "Que detalhe da embalagem ou da entrega faria você sentir que aquilo foi feito para você?",
    tipo: "texto-longo", obrigatoria: false,
    placeholder: "Um detalhe já basta.",
  },

  // ─────────────── ETAPA 10 · PSICOLOGIA RELACIONAL E EXPRESSÃO EMOCIONAL ───────────────
  {
    id: "q48", numero: 48, capitulo: 10, pilar: "receber-afeto", destino: "respostas",
    enunciado: "O que alguém faz que te faz sentir realmente querido(a)?",
    tipo: "texto-longo", obrigatoria: false,
    placeholder: "Escreva no seu tempo.",
  },
  {
    id: "q49", numero: 49, capitulo: 10, pilar: "expressar-afeto", destino: "respostas",
    enunciado: "Como você demonstra que alguém é importante para você?",
    ajuda: ATE_DOIS,
    tipo: "escolha-multipla", maxSelecoes: 2, obrigatoria: true,
    opcoes: [
      { valor: "presentes", rotulo: "Presentes pensados" },
      { valor: "tempo", rotulo: "Tempo junto" },
      { valor: "palavras", rotulo: "Palavras e elogios" },
      { valor: "toque", rotulo: "Toque e carinho físico" },
      { valor: "cuidado", rotulo: "Cuidar e resolver as coisas da pessoa" },
    ],
  },
  {
    id: "q50", numero: 50, capitulo: 10, pilar: "reconhecimento-social", destino: "respostas",
    enunciado: "Quando você sai de uma sala, como quer que as pessoas te lembrem?",
    tipo: "texto-longo", obrigatoria: false,
    placeholder: "Escreva no seu tempo.",
  },
  {
    id: "q51", numero: 51, capitulo: 10, pilar: "seguranca-emocional", destino: "respostas",
    enunciado: "Onde, ou com quem, você consegue ser 100% você?",
    tipo: "texto-longo", obrigatoria: false,
    placeholder: "Escreva no seu tempo.",
  },
  {
    id: "q52", numero: 52, capitulo: 10, pilar: "fecho-icarus", destino: "respostas",
    enunciado: "O que significa “voar mais alto” para você hoje?",
    tipo: "texto-longo", obrigatoria: false, variante: "final",
    placeholder: "Escreva no seu tempo.",
  },
];

export const TOTAL_PERGUNTAS = perguntas.length;

const porId = new Map(perguntas.map((p) => [p.id, p]));
const porNumero = new Map(perguntas.map((p) => [p.numero, p]));

export function perguntaPorId(id: string): Pergunta {
  const p = porId.get(id);
  if (!p) throw new Error(`Pergunta inexistente: ${id}`);
  return p;
}

export function perguntaPorNumero(numero: number): Pergunta {
  const p = porNumero.get(numero);
  if (!p) throw new Error(`Pergunta inexistente: ${numero}`);
  return p;
}

export function rotuloDaOpcao(perguntaId: string, valor: string): string {
  const p = porId.get(perguntaId);
  return p?.opcoes?.find((o) => o.valor === valor)?.rotulo ?? valor;
}
