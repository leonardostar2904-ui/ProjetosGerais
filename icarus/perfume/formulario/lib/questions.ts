// Conteudo do questionario. Para editar perguntas, mexa SOMENTE neste arquivo.
// Cada resposta fica guardada pelo `id` da pergunta (estavel, e a chave que a IA vai ler depois).

export type AnswerValue = string | string[] | number | boolean;
export type Answers = Record<string, AnswerValue>;

export type Option = { value: string; label: string };

export type Question = {
  id: string;
  label: string;
  help?: string;
  required?: boolean;
  /** Pergunta sensivel: sempre opcional e com a opcao "Prefiro nao informar". */
  sensitive?: boolean;
  placeholder?: string;
} & (
  | { type: "text" | "longtext" }
  | { type: "single"; options: Option[] }
  | { type: "multi"; options: Option[]; maxSelect?: number }
  | { type: "scale"; min: string; max: string }
  | { type: "consent" }
);

export type Section = {
  id: string;
  title: string;
  intro?: string;
  questions: Question[];
};

const PREFIRO_NAO: Option = { value: "nao-informar", label: "Prefiro não informar" };

export const sections: Section[] = [
  {
    id: "sobre-voce",
    title: "Sobre você",
    intro: "O básico para começar. Só o nome é obrigatório.",
    questions: [
      { id: "nome", type: "text", label: "Como podemos te chamar?", required: true, placeholder: "Seu nome ou apelido" },
      {
        id: "faixa-etaria",
        type: "single",
        label: "Qual é a sua faixa de idade?",
        options: [
          { value: "18-24", label: "18 a 24" },
          { value: "25-34", label: "25 a 34" },
          { value: "35-44", label: "35 a 44" },
          { value: "45-54", label: "45 a 54" },
          { value: "55+", label: "55 ou mais" },
        ],
      },
      {
        id: "sexo",
        type: "single",
        label: "Qual é o seu sexo?",
        help: "Opcional. Ajuda a calibrar a base da fórmula, nunca limita as notas que você pode receber.",
        sensitive: true,
        options: [
          { value: "feminino", label: "Feminino" },
          { value: "masculino", label: "Masculino" },
          { value: "intersexo", label: "Intersexo" },
          PREFIRO_NAO,
        ],
      },
      {
        id: "genero",
        type: "single",
        label: "Com qual gênero você se identifica?",
        help: "Opcional.",
        sensitive: true,
        options: [
          { value: "mulher", label: "Mulher" },
          { value: "homem", label: "Homem" },
          { value: "nao-binario", label: "Não binário" },
          { value: "outro", label: "Outro" },
          PREFIRO_NAO,
        ],
      },
      {
        id: "clima",
        type: "single",
        label: "Como é o clima onde você mais circula?",
        help: "O calor muda como o perfume abre, projeta e dura na pele.",
        options: [
          { value: "quente-umido", label: "Quente e úmido" },
          { value: "quente-seco", label: "Quente e seco" },
          { value: "ameno", label: "Ameno" },
          { value: "frio", label: "Frio" },
          { value: "varia", label: "Varia bastante ao longo do ano" },
        ],
      },
    ],
  },
  {
    id: "personalidade",
    title: "Personalidade",
    intro: "Marque onde você se encaixa. Não existe resposta certa.",
    questions: [
      { id: "pers-social", type: "scale", label: "Em grupo, você se recolhe ou ocupa o espaço?", min: "Mais reservado(a)", max: "Mais expansivo(a)", required: true },
      { id: "pers-plano", type: "scale", label: "Você planeja ou improvisa?", min: "Planejo tudo", max: "Improviso", required: true },
      { id: "pers-ousadia", type: "scale", label: "Como você se apresenta ao mundo?", min: "Discreto(a)", max: "Marcante", required: true },
      { id: "pers-estilo", type: "scale", label: "Seu estilo pessoal está mais para...", min: "Clássico", max: "Moderno / ousado", required: true },
      { id: "pers-palavras", type: "longtext", label: "Escolha três palavras que te descrevem.", required: true, placeholder: "Ex.: intenso, curioso, leal" },
      { id: "pers-outros", type: "longtext", label: "O que as pessoas costumam dizer sobre você?", placeholder: "Elogios, apelidos, o que repetem a seu respeito" },
    ],
  },
  {
    id: "rotina",
    title: "Rotina",
    intro: "Onde e como você usaria o perfume no dia a dia.",
    questions: [
      {
        id: "rotina-dia",
        type: "single",
        label: "Como é o seu dia a dia?",
        required: true,
        options: [
          { value: "escritorio", label: "Escritório / ambiente fechado" },
          { value: "home-office", label: "Em casa / home office" },
          { value: "rua", label: "Na rua, em movimento" },
          { value: "estudo", label: "Estudando" },
          { value: "misto", label: "Um pouco de tudo" },
        ],
      },
      {
        id: "rotina-ocasioes",
        type: "multi",
        label: "Em quais ocasiões você quer usar esse perfume?",
        required: true,
        options: [
          { value: "trabalho", label: "Trabalho" },
          { value: "dia-a-dia", label: "Dia a dia" },
          { value: "encontros", label: "Encontros" },
          { value: "noite", label: "Festas e noite" },
          { value: "eventos", label: "Eventos especiais" },
          { value: "treino", label: "Depois do treino" },
        ],
      },
      {
        id: "rotina-horario",
        type: "single",
        label: "Em que momento do dia você mais usa perfume?",
        options: [
          { value: "manha", label: "Manhã" },
          { value: "tarde", label: "Tarde" },
          { value: "noite", label: "Noite" },
          { value: "o-dia-todo", label: "Passo de manhã e quero que dure o dia todo" },
        ],
      },
      {
        id: "rotina-atividade",
        type: "scale",
        label: "Como é a sua rotina física?",
        min: "Bem tranquila",
        max: "Muito ativa",
      },
    ],
  },
  {
    id: "gostos",
    title: "Gostos pessoais",
    intro: "O que você gosta diz muito sobre o cheiro que combina com você.",
    questions: [
      {
        id: "gosto-cheiros",
        type: "multi",
        label: "Quais destes cheiros te agradam?",
        help: "Escolha até 5.",
        required: true,
        maxSelect: 5,
        options: [
          { value: "citrico", label: "Cítricos (limão, laranja, bergamota)" },
          { value: "floral", label: "Flores (jasmim, rosa, flor de laranjeira)" },
          { value: "amadeirado", label: "Madeiras (cedro, sândalo, vetiver)" },
          { value: "doce", label: "Doces (baunilha, caramelo, fava tonka)" },
          { value: "especiado", label: "Especiarias (canela, pimenta, cardamomo)" },
          { value: "verde", label: "Folhas e ervas (capim, hortelã, chá)" },
          { value: "marinho", label: "Mar e brisa" },
          { value: "gourmand", label: "Café, cacau, comidinha" },
          { value: "defumado", label: "Defumado (incenso, couro, tabaco)" },
          { value: "limpo", label: "Roupa limpa, sabonete, pele" },
          { value: "frutado", label: "Frutas" },
        ],
      },
      { id: "gosto-evitar", type: "longtext", label: "Algum cheiro que você não suporta?", placeholder: "Ex.: cheiro muito doce, talco, cigarro" },
      { id: "gosto-memoria", type: "longtext", label: "Qual cheiro te lembra um momento especial?", help: "Pode ser a casa da avó, uma viagem, uma chuva.", placeholder: "Conte em poucas linhas" },
      {
        id: "gosto-lugares",
        type: "multi",
        label: "Onde você se sente mais você?",
        maxSelect: 3,
        help: "Escolha até 3.",
        options: [
          { value: "praia", label: "Praia" },
          { value: "mata", label: "Mata e cachoeira" },
          { value: "cidade", label: "Cidade grande" },
          { value: "montanha", label: "Montanha" },
          { value: "casa", label: "Em casa" },
          { value: "bar", label: "Bares e casas de show" },
        ],
      },
      { id: "gosto-musica", type: "text", label: "O que você mais ouve?", placeholder: "Artistas ou estilos" },
      { id: "gosto-extra", type: "longtext", label: "Filmes, livros, comidas ou hobbies que dizem quem você é.", placeholder: "O que quiser compartilhar" },
    ],
  },
  {
    id: "amigos",
    title: "Roda de amigos",
    intro: "As pessoas ao seu redor também contam sua história.",
    questions: [
      {
        id: "amigos-tamanho",
        type: "single",
        label: "Como é a sua roda de amigos?",
        required: true,
        options: [
          { value: "poucos-proximos", label: "Poucos e muito próximos" },
          { value: "grupo-medio", label: "Um grupo médio e fiel" },
          { value: "muita-gente", label: "Muita gente, vários círculos" },
        ],
      },
      {
        id: "amigos-clima",
        type: "multi",
        label: "Como são os encontros com seus amigos?",
        maxSelect: 3,
        help: "Escolha até 3.",
        options: [
          { value: "festa", label: "Festa e agito" },
          { value: "conversa", label: "Conversa longa e boa comida" },
          { value: "ao-ar-livre", label: "Ao ar livre" },
          { value: "cultura", label: "Cinema, música, arte" },
          { value: "esporte", label: "Esporte e atividade" },
          { value: "casa", label: "Casa e tranquilidade" },
        ],
      },
      {
        id: "amigos-papel",
        type: "single",
        label: "Qual é o seu papel no grupo?",
        options: [
          { value: "alegria", label: "Quem anima" },
          { value: "conselheiro", label: "Quem escuta e aconselha" },
          { value: "lider", label: "Quem puxa e organiza" },
          { value: "observador", label: "Quem observa e tira a melhor sacada" },
          { value: "ponte", label: "Quem junta todo mundo" },
        ],
      },
    ],
  },
  {
    id: "vida-afetiva",
    title: "Vida afetiva",
    intro: "Opcional. Serve para entender a impressão que você quer causar.",
    questions: [
      {
        id: "afetiva-relacionamento",
        type: "single",
        label: "Qual é o seu momento afetivo?",
        sensitive: true,
        options: [
          { value: "solteiro", label: "Solteiro(a)" },
          { value: "namorando", label: "Em um relacionamento" },
          { value: "casado", label: "Casado(a) / união estável" },
          { value: "aberto", label: "Prefiro não rotular" },
          PREFIRO_NAO,
        ],
      },
      {
        id: "afetiva-impressao",
        type: "multi",
        label: "Que impressão você quer deixar em quem importa?",
        maxSelect: 3,
        help: "Escolha até 3.",
        required: true,
        options: [
          { value: "sedutor", label: "Sedutor(a)" },
          { value: "acolhedor", label: "Acolhedor(a)" },
          { value: "marcante", label: "Marcante" },
          { value: "confiavel", label: "Confiável" },
          { value: "misterioso", label: "Misterioso(a)" },
          { value: "elegante", label: "Elegante" },
          { value: "leve", label: "Leve e fresco(a)" },
          { value: "poderoso", label: "Poderoso(a)" },
        ],
      },
    ],
  },
  {
    id: "perfume",
    title: "Seu perfume",
    intro: "Preferências práticas e segurança.",
    questions: [
      { id: "perf-usados", type: "longtext", label: "Quais perfumes você já usou ou usa?", help: "Inclua os que amou e os que não funcionaram.", placeholder: "Nomes ou marcas, se lembrar" },
      {
        id: "perf-intensidade",
        type: "scale",
        label: "Que intensidade você prefere?",
        min: "Suave, só de perto",
        max: "Marcante, deixa rastro",
        required: true,
      },
      {
        id: "perf-fixacao",
        type: "scale",
        label: "Quanto a duração na pele importa para você?",
        min: "Pouco",
        max: "É essencial",
        required: true,
      },
      {
        id: "perf-alergia",
        type: "single",
        label: "Você tem alergia ou sensibilidade a perfumes, cosméticos ou ingredientes?",
        required: true,
        options: [
          { value: "nao", label: "Não" },
          { value: "sim", label: "Sim" },
          { value: "nao-sei", label: "Não sei" },
        ],
      },
      { id: "perf-alergia-detalhe", type: "longtext", label: "Se sim, quais?", help: "Essa informação será usada para segurança da fórmula.", placeholder: "Ingredientes, reações, pele sensível, asma" },
    ],
  },
  {
    id: "icarus",
    title: "Voar mais alto",
    intro: "A última pergunta de conteúdo.",
    questions: [
      { id: "icarus-voar", type: "longtext", label: "O que significa \"voar mais alto\" para você hoje?", placeholder: "Um objetivo, uma fase, uma mudança" },
    ],
  },
  {
    id: "consentimento",
    title: "Antes de enviar",
    questions: [
      {
        id: "consentimento",
        type: "consent",
        required: true,
        label:
          "Autorizo o uso das minhas respostas, incluindo as informações pessoais que escolhi preencher, para criar a fórmula do meu perfume. Posso pedir a exclusão dos meus dados quando quiser.",
      },
    ],
  },
];
