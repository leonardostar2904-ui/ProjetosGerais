/* =====================================================================
   FILA DE DISPARO · CONFIGURAÇÃO
   ---------------------------------------------------------------------
   Tudo o que muda de um negócio para outro mora neste arquivo:
   quem vende, cores, limites, regiões, produtos, mensagens, nichos,
   artes e o texto da proposta em PDF. O index.html e o
   proposta-gerador.js só leem daqui.

   Marcadores que o sistema troca sozinho dentro dos textos:
     {vendedor} {empresa} {instagram} {telefone} {validade}
     {produto1} {produto2} {produto3}  -> "Nome do produto, preço"
     {nomeProduto1} ... {nomeProduto3} -> só o nome
     {preco1} ... {preco3}             -> só o preço
     {nome} {nota} {avaliacoes}        -> dados do lead (nas mensagens)
   Cada bloco abaixo diz quais marcadores extras aceita.

   Textos entre [colchetes] NÃO são trocados: são lembretes para você
   completar na hora de enviar.

   Os valores, preços e condições que vêm preenchidos são EXEMPLOS.
   Troque tudo antes de usar com cliente de verdade.
   ===================================================================== */
window.CONFIG = {

  /* ------------------------------------------------------------------
     1. QUEM VENDE
     Aparece nas mensagens, nas artes e na proposta.
     Enquanto o nome for "Seu Nome", a página mostra um aviso no topo.
     ------------------------------------------------------------------ */
  vendedor: {
    nome: 'Seu Nome',
    empresa: 'Sua Empresa',
    telefone: '(00) 00000-0000',      // WhatsApp que vai no rodapé da proposta
    instagram: '@suaempresa',         // deixe '' para esconder nas artes
    oQueFaz: 'Atendimento com IA',    // linha curta usada nas artes
    // Parágrafo "Quem faz" da última página da proposta. Aceita {vendedor}.
    bio: 'Eu sou {vendedor}. [Escreva aqui, em duas ou três frases, a sua experiência e o tipo de trabalho que você entrega.] Trabalho direto com você, sem intermediários.'
  },

  /* Fuso usado para "enviados hoje", horários do cronograma e datas. */
  fuso: 'America/Sao_Paulo',

  /* ------------------------------------------------------------------
     2. CORES DA ARTE E DA PROPOSTA (hexadecimal, #RRGGBB)
     As cores da interface ficam no topo do index.html (:root).
     ------------------------------------------------------------------ */
  marca: {
    papel: '#F4F2EC',     // fundo
    tinta: '#1E2329',     // texto principal e blocos escuros
    destaque: '#1D4ED8',  // o que chama atenção (nome do lead, números, marcadores)
    apoio: '#E2DED4',     // caixas de nota
    texto2: '#555B63'     // texto secundário
  },

  /* ------------------------------------------------------------------
     3. LIMITES DO DIA
     Protegem o seu número. Em dúvida, comece com menos.
     ------------------------------------------------------------------ */
  limites: {
    totalDia: 50,           // envios por dia, somando WhatsApp e Instagram
    novosWhatsappDia: 20,   // números novos no WhatsApp por dia
    minutosEntreEnvios: 2   // a página avisa se você enviar mais rápido que isso
  },

  /* ------------------------------------------------------------------
     4. REGIÕES E FAIXAS
     regioes: chave curta (sem espaço) -> nome que aparece no filtro.
     faixas: separam bairros ou cidades por poder de compra.
       A = ticket maior, C = decisão por preço, o resto vira B.
       Liste em "lugares" o nome do bairro ou da cidade como vem no lead.
     ------------------------------------------------------------------ */
  regioes: {
    'centro': 'Centro',
    'zona-norte': 'Zona Norte',
    'zona-sul': 'Zona Sul',
    'zona-oeste': 'Zona Oeste',
    'metropolitana': 'Região metropolitana'
  },
  faixas: {
    A: { rotulo: 'Faixa A, ticket maior', lugares: [] },
    B: { rotulo: 'Faixa B, preço sensível' },
    C: { rotulo: 'Faixa C, só a porta de entrada', lugares: [],
         oferta: '{produto1}. Região onde a decisão é por preço.' }
  },

  /* Ordem em que os nichos se alternam na fila. Repita um nicho para dar
     mais peso a ele. Vazio = todos os nichos, um de cada vez. */
  rodizio: [],

  /* ------------------------------------------------------------------
     5. PRODUTOS (exatamente três)
     Viram a tabela "Valores", os três cartões da proposta e os
     marcadores {produto1}, {produto2} e {produto3}.
     "de" é o preço riscado, opcional. Deixe '' para não mostrar.
     VALORES DE EXEMPLO: troque pelos seus.
     ------------------------------------------------------------------ */
  produtos: [
    { selo: 'Essencial', nome: 'Site profissional',
      para: 'Para quem ainda não tem site ou quer renovar o atual.',
      de: '', preco: 'R$ 1.200',
      condicao: 'Pagamento único, à vista ou parcelado.',
      prazo: 'Entrega em 15 dias',
      itens: ['Site de até 5 páginas', 'Textos pensados para conversão', 'SEO técnico', 'Google Analytics e Meta Pixel', 'Botão e integração com o WhatsApp', 'Perfil da Empresa no Google ajustado', '15 dias de suporte após a entrega'] },
    { selo: 'Recomendada', nome: 'Atendente com IA no WhatsApp',
      para: 'Para quem recebe contato pelo WhatsApp e não consegue responder a todos na hora.',
      de: '', preco: 'R$ 2.400',
      condicao: 'Implantação única. Acompanhamento opcional de R$ 500 por mês.',
      prazo: 'Entrega em 18 dias',
      itens: ['Atendente de IA no WhatsApp', 'Qualificação automática de contatos', 'Agendamento no Google Agenda', 'Follow-up automático', 'Transferência para você, quando precisar', 'Integração com CRM', 'Painel com o histórico das conversas'] },
    { selo: 'Completa', nome: 'Pacote completo',
      para: 'Para quem quer site, atendimento e redes funcionando como um sistema só.',
      de: '', preco: 'R$ 3.900',
      condicao: 'Implantação, mais R$ 800 por mês.',
      prazo: 'Entrega em 30 dias',
      itens: ['Tudo do Site profissional', 'Tudo do Atendente com IA', 'Site, WhatsApp e Instagram integrados', 'Automações no CRM', 'Painel único com as métricas', 'Reunião mensal de acompanhamento'] }
  ],

  /* Dica que aparece embaixo da oferta sugerida de cada lead. */
  ofertaDica: 'Para um escopo sob medida, descubra: quantos contatos novos chegam por semana, quem responde hoje, que agenda ou sistema usam, se têm site e quanto vale um cliente. Os três caminhos são ponto de partida: dá para juntar, cortar ou ajustar.',

  /* ------------------------------------------------------------------
     6. CONDIÇÃO ESPECIAL (opcional)
     Se "frase" tiver texto, aparece a caixa "Citar a condição especial"
     na segunda mensagem. Deixe frase: '' para desligar.
     ------------------------------------------------------------------ */
  promocao: {
    rotulo: 'Citar a condição especial deste mês',
    frase: 'Estou com poucas vagas com condição especial até o fim do mês.'
  },

  /* ------------------------------------------------------------------
     7. PRIMEIRA MENSAGEM (partes comuns a todos os nichos)
     A mensagem final junta: abertura + Google + horário + texto do nicho.
     Aceita {vendedor} {empresa} {nome} {nota} {avaliacoes}.
     Texto entre *asteriscos* sai em negrito no WhatsApp.
     ------------------------------------------------------------------ */
  mensagem: {
    abertura: 'Oi, tudo bem? Aqui é o {vendedor}, da {empresa}.',
    comNota: 'Vi no Google: {nome}, {nota} estrelas com {avaliacoes} avaliações. Parabéns pelo trabalho.',
    semNota: 'Encontramos o contato de vocês procurando por {nome}.',
    recepcaoFecho: '*Com quem podemos falar sobre isso, e qual o melhor horário?*',
    directAbertura: 'Oi! Tudo bem? Aqui é o {vendedor}, da {empresa}.',
    directComNota: 'Encontramos {nome} no Google, {nota} estrelas com {avaliacoes} avaliações, e viemos conhecer o perfil. Parabéns pelo trabalho.',
    directSemNota: 'Encontramos {nome} no Google e viemos conhecer o perfil. Parabéns pelo trabalho.',
    directFecho: '*Faz sentido mandarmos um exemplo de como ficaria aí?*',
    // Frase opcional no formato "Dono": a caixa de marcar aparece com este rótulo.
    // Deixe texto: '' para esconder a opção.
    extra: { rotulo: 'Citar que também fazemos sites',
             texto: 'Também fazemos sites, para quem ainda não tem ou quer renovar o atual.' }
  },

  /* ------------------------------------------------------------------
     8. SEGUNDA MENSAGEM (partes comuns)
     Aceita os campos do bloco "segunda" de cada nicho:
     {espera} {faz} {quem} {sai} {ocupado}, e também {promocao}.
     Cada item da lista vira uma linha. Linha vazia some.
     ------------------------------------------------------------------ */
  segunda: {
    auto: [
      'Oi! Recebi a mensagem automática de vocês, obrigado pelo retorno.',
      'Foi por causa desse momento que eu chamei: ela avisa o horário de atendimento, mas quem escreveu continua esperando para {espera}.',
      'O que montamos é diferente de uma resposta pronta. O atendente conversa com a pessoa, {faz}, e chama você quando precisa.',
      'Na prática, {quem} sai da conversa com {sai}, mesmo às 22h ou no domingo.',
      '{promocao}',
      '*Podemos te mandar um exemplo de como ficaria essa conversa no seu atendimento?* Leva um minuto para ver.'
    ],
    silencio: [
      'Oi, tudo bem? Aqui é o {vendedor}, da {empresa}. Mandei uma mensagem há alguns dias e imagino que a rotina aí esteja corrida.',
      'Resumindo em uma linha: montamos um atendente que conversa com quem chama, {faz}, para ninguém ficar esperando enquanto você {ocupado}.',
      '*Se fizer sentido, mandamos um exemplo curto de como ficaria a conversa. E se esse assunto for com outra pessoa, com quem podemos falar?*'
    ],
    audio: 'Oi, tudo bem? Aqui é o {vendedor}, da {empresa}. Mandei uma mensagem por escrito e resolvi gravar este áudio rapidinho, para você saber que tem uma pessoa do outro lado. A gente monta um atendente no WhatsApp que {faz}, para ninguém ficar esperando enquanto você {ocupado}. Se fizer sentido, te mando um exemplo de como ficaria aí. Obrigado e um abraço!',
    exemploIntro: 'Segue um exemplo de como ficaria, em uma noite de sábado, às 21h40:',
    exemploFecho: [
      'Os horários, os valores e o jeito de falar são os seus. Ajustamos tudo com você antes de entrar no ar.',
      '*Quer que a gente mande um vídeo curto mostrando isso funcionando?*'
    ]
  },

  /* ------------------------------------------------------------------
     9. ARTE (imagem 1080 x 1350 com o nome do lead)
     Por padrão a arte é desenhada pela página, com os textos do bloco
     "arte" de cada nicho e as cores do item 2. Três modelos:
     A Jornal, B Capa e C Ficha.

     Para usar imagens suas (feitas no Canva, Figma etc.):
       1. salve em pecas/ com o nome <nicho>-<A|B|C>.jpg, por exemplo
          pecas/clinica-A.jpg, no tamanho 1080 x 1350;
       2. troque imagensProprias para true;
       3. ajuste posicaoNome: onde o "PARA: NOME" é escrito em cada modelo
          (x e y em pixels a partir do canto superior esquerdo).
     Com imagens próprias, abra a página por um servidor local
     (o guia explica). Aberta direto do arquivo, o navegador bloqueia.
     ------------------------------------------------------------------ */
  arte: {
    fechoConvite: 'Responda aqui e eu te mostro, por mensagem mesmo.',
    fichaTitulo: 'Exemplo de atendimento no WhatsApp',
    imagensProprias: false,
    posicaoNome: {
      A: { x: 56, y: 150, tamanho: 19, largura: 540, cor: '#1D4ED8' },
      B: { x: 56, y: 40, tamanho: 20, largura: 670, cor: '#1D4ED8' },
      C: { x: 56, y: 40, tamanho: 20, largura: 670, cor: '#1D4ED8' }
    }
  },

  /* ------------------------------------------------------------------
     10. PROPOSTA EM PDF (partes comuns)
     A estrutura das 7 páginas está no proposta-gerador.js.
     Aceita {vendedor} {empresa} {validade} {nome} e os campos do bloco
     "proposta" de cada nicho ({vive} {decide} {fecha} {mapa} {preciso}
     {cenario} {agenda}).
     Pares ['negrito', 'texto normal'] viram uma frase com o começo em negrito.
     ------------------------------------------------------------------ */
  proposta: {
    validade: '',            // data fixa, ex.: '30.11.2026'. Vazio = hoje + validadeDias
    validadeDias: 15,
    descricaoEmpresa: 'Operações digitais',   // cabeçalho da capa: "{empresa} · ..."
    rodape: '{empresa}',                      // canto inferior esquerdo de cada página
    subtituloCapa: 'Site, atendimento com IA e aquisição para quem vive de {vive}.',
    recomendada: 2,          // qual dos três produtos leva o selo "Recomendada para você"
    porQueRecomenda: ['Por que eu recomendo a opção 02 para você.', 'A procura e a reputação você já tem. Falta velocidade de resposta. O atendente resolve isso primeiro, e o site ou o pacote completo podem entrar depois, sem refazer nada.'],
    condicoes: [
      ['Entrada no aceite.', 'Metade para começar, o restante na entrega.'],
      ['Cartão aceito.', 'Projetos que incluem o site podem ser parcelados.'],
      ['Aprovação sua.', 'Cada entrega passa por você antes de ir para o ar.'],
      ['Acompanhamento opcional.', 'Reunião mensal para ler os dados e ajustar o atendimento.']
    ],
    // Linha final das condições. Use null para não mostrar.
    promocao: ['Condição especial,', 'válida até {validade}. Depois dessa data, os valores voltam ao normal.'],
    frases: {
      diagnostico: 'A proposta não é vender mais. É não perder o que já chega.',
      cronograma: 'Começar pequeno, no ar e funcionando vale mais que um plano perfeito.',
      posicionamento: 'Você fala direto com quem faz o trabalho.',
      fechamento: ['Resposta rápida', 'é cliente que fica.']
    },
    escopo: {
      kicker: '03 · A opção recomendada, em detalhe',
      titulo: 'O que o atendente faz',
      intro: 'Ele não substitui você. Ele cuida da primeira hora, {decide}',
      nota: ['Tudo acontece no seu WhatsApp comercial.', 'Mesmo número, mesma conversa, mesmo histórico. Você não muda nada do que já funciona e continua sendo {fecha}.']
    },
    pratica: { exemploQuando: 'Exemplo · domingo, 22h14', tempoResposta: '00:00:08' },
    cronograma: {
      kicker: '05 · Prazo da opção recomendada',
      titulo: '18 dias, em quatro etapas',
      etapas: [
        ['Mapeamento', 'Dia 1', 'Conversa de 20 minutos. A gente levanta {mapa}'],
        ['Construção', 'Dias 2 a 12', 'Montagem do atendente, do roteiro de conversa, da integração com a agenda e do painel de histórico. Esta parte corre inteira por aqui.'],
        ['Validação', 'Dias 13 a 15', 'Você testa como se fosse um cliente. Ajustamos tom, perguntas e a regra de quando o atendimento passa para você.'],
        ['Entrada no ar', 'Dias 16 a 18', 'Publicação no seu número, acompanhamento dos primeiros atendimentos reais e ajuste fino com base no que aparecer.']
      ],
      nota: ['Do seu lado, dois momentos de 20 minutos:', 'o mapeamento e a validação. O resto do trabalho acontece por aqui, sem ocupar {agenda}.'],
      preciso: ['Acesso ao WhatsApp comercial, por leitura de código, como no WhatsApp Web.', '{preciso}', '20 minutos no começo e 20 na validação. Nada além disso.']
    },
    opcoes: [
      ['Opção A', 'Ver antes de decidir', 'Call de 15 minutos. Eu mostro o atendente rodando com um cenário de {cenario} e você decide depois.'],
      ['Opção B', 'Começar pelo mapeamento', 'A gente marca a conversa de 20 minutos e o prazo começa a contar a partir dela.']
    ],
    faq: [
      ['E se notarem que não é você?', 'Ele se apresenta como o atendimento de {nome}, fala no seu tom e chama você quando a conversa sai do básico.'],
      ['E se eu quiser assumir no meio?', 'Você entra na conversa quando quiser. O atendente para na hora e só volta se você mandar.'],
      ['E se eu quiser algo fora da lista?', 'Os três caminhos são pontos de partida. O escopo pode ser ajustado, por exemplo com o site dentro da opção 02.']
    ],
    garantia: ['Garantia de escopo.', 'Cada entrega passa pela sua aprovação antes de ir para o ar. Se algo não ficar como combinado, eu ajusto antes de fechar a etapa.']
  },

  /* ==================================================================
     11. NICHOS
     Um bloco por tipo de negócio. Para criar um nicho novo, copie um
     bloco inteiro, troque a chave (ex.: 'dentista') e reescreva os
     textos. A chave é o que vai no campo "nicho" de cada lead.

     abertura  -> primeira mensagem
       pergunta, oferta, chamada: formato "Dono ou dona lê o WhatsApp"
       recepcao: formato "Recepção ou atendente"
       direct:   formato "Direct do Instagram"
     segunda   -> pedaços da segunda mensagem (ver item 8)
     exemplo   -> conversa de exemplo: [cliente, atendente, cliente,
                  atendente, "o que você recebe na hora"]
     oferta    -> oferta sugerida por faixa: [principal, porta de entrada,
                  para crescer depois]. Aceita {produto1} etc.
     arte      -> textos das três artes
     proposta  -> textos da proposta em PDF deste nicho
     ================================================================== */
  nichos: {

    /* ---------------------------------------------------------- CLÍNICA */
    clinica: {
      rotulo: 'Clínica',
      rotuloForm: 'Clínica',
      abertura: {
        pergunta: 'Uma pergunta: quando chega mensagem no WhatsApp enquanto você está em atendimento, ou depois do horário, quem responde?',
        oferta: 'Montamos um atendente com IA que responde na hora, tira as dúvidas mais comuns e já marca o horário na sua agenda.',
        chamada: '*Podemos te mostrar como ficaria no seu atendimento?*',
        recepcao: 'Já adianto que não é anúncio nem rede social: montamos um assistente que responde o WhatsApp da clínica na hora, tira as dúvidas mais comuns e marca o horário na agenda, inclusive fora do expediente da recepção.',
        direct: 'Ajudamos clínicas a não perder paciente no WhatsApp: um atendente com IA que responde na hora, tira dúvidas e marca a avaliação, mesmo fora do horário.'
      },
      segunda: { espera: 'marcar', faz: 'tira as dúvidas mais comuns e marca o horário na agenda', quem: 'a pessoa', sai: 'o horário marcado', ocupado: 'está em atendimento' },
      exemplo: ['Oi, vocês têm horário para avaliação essa semana?', 'Oi! Temos sim. Tenho quarta às 15h ou sexta às 9h. Qual fica melhor para você?', 'Quarta às 15h', 'Marcado, quarta às 15h. Te mando a confirmação na véspera. Qual é o seu nome, para eu anotar?', 'nome, motivo do contato, horário marcado e de onde a pessoa veio'],
      oferta: {
        A: ['{produto2}: responde na hora, tira dúvidas, marca a avaliação e confirma na véspera.', '{produto1}, com as especialidades e o Perfil da Empresa no Google ajustado.', '{nomeProduto3}, para clínica com mais de um profissional.'],
        B: ['{produto1}, com o Perfil da Empresa no Google ajustado.', 'Atendente enxuto (escopo e valor a definir).', '{produto2}, quando a agenda lotar de mensagens.']
      },
      arte: {
        assunto: 'WhatsApp',
        jornal: 'Diário da Clínica',
        linhaTopo: 'Atendimento com IA no WhatsApp',
        manchete: 'Perguntou e sumiu.',
        subManchete: 'O valor foi enviado. A resposta nunca veio.',
        citacao: 'Quanto custa a avaliação?',
        problema: 'Chega muita mensagem perguntando valor. Boa parte some depois da resposta, ou antes dela.',
        solucao: 'Um atendimento com IA responde em segundos, separa quem está só curioso de quem quer agendar e marca a avaliação.',
        convite: 'Quer ver como ficaria na sua clínica?',
        pergunta: ['Perguntou o valor no WhatsApp', 'e nunca mais respondeu?'],
        palavra: 'Sumiu.',
        ficha: [['Perguntaram às', '13:40'], ['Quem respondeu:', 'a IA, em segundos'], ['Avaliação marcada para', 'quinta, 15h'], ['Na recepção:', 'só quem quer agendar']]
      },
      proposta: {
        capa: ['Nenhum', 'paciente', 'esperando.'], vive: 'agenda cheia',
        dia: [['09:12', 'Alguém procura atendimento na sua região, acha o seu perfil no Google e manda mensagem.'], ['13:40', 'Outra mensagem chega no WhatsApp enquanto você está em atendimento.'], ['13:45', 'Cinco minutos sem resposta. A pessoa já escreveu para outro profissional.', 1], ['18:30', 'O dia de atendimento acaba e as mensagens da tarde ainda estão sem resposta.'], ['22:00', 'Alguém pede horário à noite e só vai ter retorno amanhã, se ainda não tiver marcado em outro lugar.']],
        ticket: ['Seu ticket médio', 'Quanto vale, em média, um paciente novo no primeiro atendimento?'],
        custo: 'Se um só desses contatos virasse paciente por semana, quanto entraria a mais no mês?',
        naoMuda: 'Quem atende o paciente e conduz o tratamento',
        decide: 'que é quando quase todo paciente novo decide onde vai marcar.',
        itens: [['Responde na hora, em qualquer horário', 'Sete dias por semana. Ninguém fica no vácuo esperando o expediente começar.'], ['Pergunta o que importa', 'O que a pessoa procura, se é a primeira vez, o melhor dia e o melhor turno. Conversa natural, sem interrogatório.'], ['Registra de onde veio cada contato', 'Google, Instagram, anúncio ou indicação. No fim do mês você sabe qual canal traz paciente e qual só traz curioso.'], ['Marca o horário na sua agenda', 'Horário confirmado direto no Google Agenda, com lembrete para você e para o paciente.'], ['Passa o bastão quando precisa', 'Dúvida clínica ou caso fora do comum vai direto para você, com o resumo da conversa.'], ['Retoma quem sumiu', 'Follow-up automático de quem pediu valor e não marcou, no tempo certo e no tom certo. Sem parecer cobrança.']],
        fecha: 'quem atende o paciente', fluxo: 'Do contato ao agendamento',
        passos: [['Chega o contato', 'Google, Instagram, anúncio ou indicação. Terça às 10h ou domingo às 22h, tanto faz.'], ['O atendente responde em segundos', 'Em nome de {nome}, no tom que a gente definir junto no mapeamento.'], ['A conversa entende o que a pessoa precisa', 'Descobre o que ela procura, se é a primeira vez e qual horário funciona. Dúvida clínica segue para você.'], ['O horário é marcado', 'Confirmado na sua agenda, com lembrete automático para reduzir a falta.'], ['Você entra', 'Recebe o aviso com o resumo e atende alguém que já chega com horário marcado.']],
        chat: [['c', 'Oi, boa noite. Vocês têm horário para avaliação essa semana?'], ['a', 'Boa noite! Temos sim. É a sua primeira vez aqui?'], ['c', 'É sim'], ['a', 'Perfeito. Tenho quinta às 10h ou sexta às 15h. Qual fica melhor para você?'], ['c', 'Sexta às 15h'], ['a', 'Agendado. Te mando a confirmação por aqui na sexta de manhã. Qual é o seu nome completo?'], ['c', 'Mariana Souza']],
        resumo: ['PRIMEIRA VEZ · AVALIAÇÃO', 'SEXTA, 15H · CONFIRMADO', 'NOME: MARIANA SOUZA', 'ORIGEM: PERFIL NO GOOGLE'],
        mapa: 'as perguntas que você já responde todo dia, os serviços que você oferece, os horários de atendimento e o seu jeito de falar com o paciente.',
        preciso: 'Os serviços, os horários de atendimento e as dúvidas mais comuns de quem chama.',
        cenario: 'consultório', agenda: 'a sua agenda de atendimentos',
        frase: 'Você continua sendo quem atende. A gente só tira o atraso do caminho.'
      }
    },

    /* ----------------------------------------------------------- STUDIO */
    studio: {
      rotulo: 'Studio',
      rotuloForm: 'Studio, pilates, funcional',
      abertura: {
        pergunta: 'Uma pergunta: quando alguém pede aula experimental no WhatsApp enquanto você está dando aula, quem responde?',
        oferta: 'Montamos um atendente com IA que responde na hora, tira dúvida de horário e valor e já marca a experimental.',
        chamada: '*Podemos te mostrar como ficaria no studio?*',
        recepcao: 'Já adianto que não é anúncio nem rede social: montamos um assistente que responde o WhatsApp do studio na hora, explica horários e valores e marca a aula experimental, mesmo enquanto vocês estão em aula.',
        direct: 'Ajudamos studios a não perder aluno no WhatsApp: um atendente com IA que responde na hora e marca a aula experimental enquanto vocês estão em aula.'
      },
      segunda: { espera: 'marcar a aula experimental', faz: 'explica horários e valores e marca a aula experimental', quem: 'o aluno', sai: 'a experimental marcada', ocupado: 'está dando aula' },
      exemplo: ['Oi, queria saber como funciona a aula experimental', 'Oi! A experimental dura 50 minutos e é sem compromisso. Tenho terça às 19h ou sábado às 9h. Qual prefere?', 'Sábado às 9h', 'Marcado, sábado às 9h. Vem com roupa confortável. Qual é o seu nome, para eu anotar?', 'nome, objetivo, experimental marcada e de onde o aluno veio'],
      oferta: {
        A: ['Com recepção ou mais de um professor: {produto2}, que marca a experimental e lembra o aluno.', 'Quem dá aula sozinho: {produto1}, ou atendente enxuto (escopo e valor a definir).', '{nomeProduto3}, para abrir turmas novas.'],
        B: ['{produto1}.', 'Atendente enxuto (escopo e valor a definir).', '{produto2}, com turmas cheias.']
      },
      arte: {
        assunto: 'WhatsApp',
        jornal: 'Diário do Studio',
        linhaTopo: 'Atendimento com IA no WhatsApp',
        manchete: 'Quem responde?',
        subManchete: 'O WhatsApp do studio, enquanto você dá aula.',
        citacao: 'Vocês têm aula experimental?',
        problema: '07:12. A mensagem chega e você está dando aula, com o celular longe.',
        solucao: 'Um atendente com IA responde na hora, tira dúvida de horário e valor e marca a aula na agenda.',
        convite: 'Quer ver como ficaria no seu studio?',
        pergunta: ['Quem responde o WhatsApp', 'enquanto você dá aula?'],
        palavra: 'Aula.',
        ficha: [['Perguntaram às', '07:12'], ['Quem respondeu:', 'a IA, na hora'], ['Aula marcada para', 'amanhã, 7h'], ['Você, nesse momento:', 'dando aula']]
      },
      proposta: {
        capa: ['Nenhum', 'aluno', 'esperando.'], vive: 'turma cheia',
        dia: [['09:12', 'Alguém procura aula na sua região, acha o seu perfil no Google e manda mensagem.'], ['13:40', 'Outra mensagem chega no WhatsApp enquanto você está dando aula.'], ['13:45', 'Cinco minutos sem resposta. A pessoa já pediu aula experimental em outro lugar.', 1], ['18:30', 'As turmas da noite começam e as mensagens da tarde continuam sem resposta.'], ['22:00', 'Alguém pergunta valor e horário à noite e só vai ter retorno amanhã.']],
        ticket: ['Sua mensalidade média', 'Quanto vale, em média, um aluno novo por mês?'],
        custo: 'Se um só desses contatos virasse aluno por semana, quanto entraria a mais no mês?',
        naoMuda: 'Quem dá a aula e acompanha o aluno',
        decide: 'que é quando quase todo aluno novo decide onde vai fazer a aula experimental.',
        itens: [['Responde na hora, em qualquer horário', 'Sete dias por semana. Ninguém fica no vácuo esperando o expediente começar.'], ['Pergunta o que importa', 'Objetivo, se já praticou, melhor dia e melhor horário. Conversa natural, sem interrogatório.'], ['Registra de onde veio cada contato', 'Google, Instagram, anúncio ou indicação. No fim do mês você sabe qual canal traz aluno e qual só traz curioso.'], ['Marca a aula experimental', 'Horário confirmado direto no Google Agenda, com lembrete para você e para o aluno.'], ['Passa o bastão quando precisa', 'Caso com dor, lesão ou restrição vai direto para você, com o resumo da conversa.'], ['Retoma quem sumiu', 'Follow-up automático de quem fez a experimental e não fechou, no tempo certo e no tom certo.']],
        fecha: 'quem dá a aula', fluxo: 'Do contato à primeira aula',
        passos: [['Chega o contato', 'Google, Instagram, anúncio ou indicação. Terça às 10h ou domingo às 22h, tanto faz.'], ['O atendente responde em segundos', 'Em nome de {nome}, no tom que a gente definir junto no mapeamento.'], ['A conversa entende o objetivo', 'Descobre o que a pessoa busca, se já praticou e qual horário funciona.'], ['A experimental é marcada', 'Confirmada na sua agenda, com lembrete automático para reduzir a falta.'], ['Você entra', 'Recebe o aviso com o resumo e recebe um aluno que já chega com aula marcada.']],
        chat: [['c', 'Oi! Quanto é a mensalidade?'], ['a', 'Oi! Te passo os valores, sim. Antes, você já praticou ou seria a primeira vez?'], ['c', 'Primeira vez'], ['a', 'Ótimo. O melhor jeito de começar é uma aula experimental. Prefere de manhã ou à noite?'], ['c', 'À noite'], ['a', 'Tenho terça às 19h ou quinta às 20h. Qual fica melhor?'], ['c', 'Terça às 19h']],
        resumo: ['INICIANTE · PREFERE NOITE', 'EXPERIMENTAL: TERÇA, 19H', 'PEDIU VALORES', 'ORIGEM: INSTAGRAM'],
        mapa: 'as perguntas que você já responde todo dia, as modalidades, os horários das turmas e o seu jeito de falar com o aluno.',
        preciso: 'As modalidades, os horários das turmas e os valores que você quer informar.',
        cenario: 'studio', agenda: 'a sua grade de aulas',
        frase: 'Você continua sendo quem ensina. A gente só tira o atraso do caminho.'
      }
    },

    /* ------------------------------------------------------ IMOBILIÁRIA */
    imobiliaria: {
      rotulo: 'Imobiliária',
      rotuloForm: 'Imobiliária',
      abertura: {
        pergunta: 'Contato de imóvel esfria em minutos: quem responde primeiro leva a visita.',
        oferta: 'Montamos um atendente com IA no WhatsApp que responde na hora, pergunta região, faixa de valor e prazo, registra de qual anúncio o contato veio e só passa para você quem está pronto para visitar.',
        chamada: '*Podemos te mostrar como funciona na prática?*',
        recepcao: 'Já adianto que não é anúncio nem rede social: montamos um assistente que responde o WhatsApp na hora, pergunta região, faixa de valor e prazo e agenda a visita, inclusive à noite e no fim de semana.',
        direct: 'Ajudamos imobiliárias e corretores a responder contato de imóvel na hora: um atendente com IA que qualifica o interessado e agenda a visita.'
      },
      segunda: { espera: 'saber do imóvel', faz: 'pergunta região, faixa de valor e prazo e agenda a visita', quem: 'o interessado', sai: 'a visita agendada', ocupado: 'está em visita' },
      exemplo: ['Oi, vi o anúncio do apartamento. Ainda está disponível?', 'Oi! Está sim. Para eu te mandar certinho: é para comprar ou alugar, e até qual valor?', 'Alugar, até 1.800', 'Ótimo. Tenho opções nessa faixa. Prefere visitar sábado de manhã ou quinta à tarde?', 'tipo de negócio, região, faixa de valor, visita agendada e de qual anúncio veio'],
      oferta: {
        A: ['{produto2}: atendente que responde na hora, qualifica (comprar ou alugar, região, valor, prazo), agenda a visita e registra de qual portal o contato veio.', '{produto1}, com imóveis em destaque e página para captar proprietários.', '{nomeProduto3}, para quem tem equipe e anuncia.'],
        B: ['{produto1}, para corretor sem site ou com site fraco: passa confiança e leva o contato para o WhatsApp.', 'Atendente enxuto, que responde e qualifica (escopo e valor a definir).', '{produto2}, quando o volume de contatos crescer.']
      },
      arte: {
        assunto: 'Anúncios',
        jornal: 'Diário da Imobiliária',
        linhaTopo: 'Site, atendimento com IA e painel',
        oQueFaz: 'Site, IA e painel',
        manchete: 'Qual anúncio fechou?',
        subManchete: 'O cliente assinou. De qual anúncio ele veio?',
        citacao: 'Vi o anúncio do apartamento.',
        problema: 'Vários anúncios no ar, um cliente que fechou e nenhuma pista de qual deles trouxe.',
        solucao: 'Eu monto site com os imóveis, atendente com IA que qualifica o contato no WhatsApp e um painel de onde veio cada lead.',
        convite: 'Quer ver como isso funciona na prática?',
        pergunta: ['Hoje vocês sabem qual anúncio trouxe', 'o cliente que fechou?'],
        palavra: 'Fechou.',
        ficha: [['Veio do', 'anúncio 03'], ['Região e faixa de valor:', 'perguntadas pela IA'], ['Prazo:', 'até 3 meses'], ['No painel:', 'origem registrada']]
      },
      proposta: {
        capa: ['Nenhum', 'contato', 'esperando.'], vive: 'visita marcada',
        dia: [['09:12', 'Alguém procura imóvel na sua região, acha o seu perfil no Google e manda mensagem.'], ['13:40', 'Outra mensagem chega no WhatsApp enquanto você está em visita com um cliente.'], ['13:45', 'Cinco minutos sem resposta. A pessoa já escreveu para outro corretor.', 1], ['18:30', 'O anúncio segue no ar, trazendo contato que ninguém teve tempo de qualificar.'], ['22:00', 'O dia termina sem registro de onde veio cada contato nem de quem ficou sem retorno.']],
        ticket: ['Sua comissão média', 'Quanto vale, em média, uma venda ou uma locação fechada?'],
        custo: 'Se um só desses contatos virasse negócio por mês, quanto entraria a mais?',
        naoMuda: 'Quem conduz a visita e fecha o negócio',
        decide: 'que é quando quase todo contato de imóvel decide com qual corretor vai falar.',
        itens: [['Responde na hora, em qualquer horário', 'Sete dias por semana. Ninguém fica no vácuo esperando o expediente começar.'], ['Pergunta o que importa', 'Tipo de imóvel, região, faixa de valor, prazo e se é compra ou aluguel. Conversa natural, sem interrogatório.'], ['Registra de onde veio cada contato', 'Portal, Instagram, Google ou indicação. No fim do mês você sabe qual canal traz visita e qual só traz curioso.'], ['Marca a visita na sua agenda', 'Horário confirmado direto no Google Agenda, com lembrete para você e para o cliente.'], ['Passa o bastão quando está pronto', 'Você recebe o resumo da conversa e assume. Pode entrar no meio do atendimento a qualquer momento.'], ['Retoma quem sumiu', 'Follow-up automático de quem não respondeu, no tempo certo e no tom certo. Sem parecer cobrança.']],
        fecha: 'quem fecha a visita', fluxo: 'Do contato à visita',
        passos: [['Chega o contato', 'Portal, Instagram, Google ou indicação. Terça às 10h ou domingo às 22h, tanto faz.'], ['O atendente responde em segundos', 'Em nome de {nome}, no tom que a gente definir junto no mapeamento.'], ['A conversa qualifica', 'Descobre região, faixa de valor, prazo e urgência. Quem está só olhando recebe atenção sem ocupar o seu dia.'], ['A visita é marcada', 'Horário confirmado na sua agenda, com lembrete automático para reduzir o não comparecimento.'], ['Você entra', 'Recebe o aviso com o resumo e assume a conversa com alguém que já sabe o que quer.']],
        chat: [['c', 'Oi, vi o anúncio do apartamento no Centro. Ainda está disponível?'], ['a', 'Oi! Está sim. Para eu te mandar certinho: é para comprar ou alugar?'], ['c', 'Alugar'], ['a', 'Perfeito. Qual faixa de aluguel cabe no seu orçamento e para quando você precisa?'], ['c', 'Até 1.800, quero entrar no mês que vem'], ['a', 'Ótimo. Tenho três opções nessa faixa. Prefere visitar sábado de manhã ou quinta à tarde?'], ['c', 'Sábado de manhã']],
        resumo: ['ALUGAR · CENTRO · ATÉ R$ 1.800', 'ENTRADA: MÊS QUE VEM', 'VISITA: SÁBADO, 10H', 'ORIGEM: ANÚNCIO DO PORTAL'],
        mapa: 'as perguntas que você já faz, os bairros que você atende, as faixas de valor e o seu jeito de falar com o cliente.',
        preciso: 'Os bairros, os tipos de imóvel e as faixas de valor com que você trabalha hoje.',
        cenario: 'imóveis', agenda: 'a sua agenda de visitas',
        frase: 'Você continua sendo quem vende. A gente só tira o atraso do caminho.'
      }
    },

    /* ------------------------------------------------- SALÃO, BARBEARIA */
    salao: {
      rotulo: 'Salão',
      rotuloForm: 'Salão, barbearia',
      abertura: {
        pergunta: 'Pergunta sincera: quantas mensagens ficam sem resposta quando você está com cliente na cadeira?',
        oferta: 'Montamos um atendente com IA que responde na hora, mostra os horários livres e marca direto na agenda.',
        chamada: '*Podemos te mostrar como ficaria no salão?*',
        recepcao: 'Já adianto que não é anúncio nem rede social: montamos um assistente que responde o WhatsApp do salão na hora, mostra os horários livres e marca na agenda, mesmo com a equipe toda ocupada.',
        direct: 'Ajudamos salões a não perder cliente no WhatsApp: um atendente com IA que mostra os horários livres e marca na agenda.'
      },
      segunda: { espera: 'marcar', faz: 'mostra os horários livres e marca direto na agenda', quem: 'a cliente', sai: 'o horário marcado', ocupado: 'está com cliente na cadeira' },
      exemplo: ['Tem horário essa semana?', 'Oi! Tem sim. Tenho quinta às 14h ou sexta às 10h. Qual fica melhor para você?', 'Sexta às 10h', 'Marcado, sexta às 10h. Te mando a confirmação na véspera. Qual é o seu nome, para eu anotar?', 'nome, serviço, horário marcado e de onde a cliente veio'],
      oferta: {
        A: ['{produto2}: responde na hora, mostra os horários livres e marca na agenda, mesmo com a equipe ocupada.', '{produto1}, com serviços, valores e agendamento pelo WhatsApp.', '{nomeProduto3}, para salão com várias profissionais.'],
        B: ['{produto1}, com serviços, valores e agendamento pelo WhatsApp.', 'Atendente enxuto (escopo e valor a definir).', '{produto2}, quando a agenda lotar de mensagens.']
      },
      arte: {
        assunto: 'WhatsApp',
        jornal: 'Diário do Salão',
        linhaTopo: 'Atendimento com IA no WhatsApp',
        manchete: 'Cliente na cadeira.',
        subManchete: 'E o WhatsApp do salão tocando sem resposta.',
        citacao: 'Tem horário para hoje?',
        problema: 'Enquanto você atende, as mensagens esperam. Algumas não esperam muito.',
        solucao: 'Um atendente com IA responde na hora, mostra os horários livres e marca direto na agenda, até de madrugada.',
        convite: 'Quer ver como ficaria no seu salão?',
        pergunta: ['Quantas mensagens esperam', 'enquanto você atende?'],
        palavra: 'Espera.',
        ficha: [['Perguntaram às', '23:18'], ['Quem respondeu:', 'a IA, na hora'], ['Horário marcado para', 'sábado, 10h'], ['Você, nesse momento:', 'dormindo']]
      },
      /* Este nicho usa uma função para ajustar o texto a barbearia (masculino)
         ou salão (feminino), olhando o tipo e o nome do lead. Os outros nichos
         são texto fixo. Se preferir, troque por um objeto igual aos outros. */
      proposta: function (lead) {
        var sub = String(lead.sub || '').toLowerCase();
        var masc = /barb/.test(sub + ' ' + String(lead.nome || '').toLowerCase());
        var cl = masc ? 'o cliente' : 'a cliente', um = masc ? 'cliente novo' : 'cliente nova';
        var serv = /barb/.test(sub) ? 'Corte e barba' : /unha|nail|manicure/.test(sub) ? 'Alongamento em gel' : /c[ií]lio|lash/.test(sub) ? 'Extensão de cílios' : /sobrancelha|micropig/.test(sub) ? 'Design de sobrancelhas' : 'Escova e hidratação';
        return {
          capa: [masc ? 'Nenhum' : 'Nenhuma', 'cliente', 'esperando.'], vive: 'agenda cheia',
          dia: [['09:12', 'Alguém procura o seu serviço na região, acha o seu perfil no Google e manda mensagem.'], ['13:40', 'Outra mensagem chega no WhatsApp enquanto você está com cliente na cadeira.'], ['13:45', 'Cinco minutos sem resposta. A pessoa já pediu horário em outro lugar.', 1], ['18:30', 'O expediente aperta e as mensagens da tarde continuam sem resposta.'], ['22:00', 'Alguém pede horário para sábado à noite e só vai ter retorno amanhã.']],
          ticket: ['Seu ticket médio', 'Quanto vale, em média, um atendimento seu?'],
          custo: 'Se um só desses contatos virasse ' + (masc ? 'cliente fixo' : 'cliente fixa') + ', quanto entraria a mais por mês?',
          naoMuda: 'Quem atende e cuida de cada cliente',
          decide: 'que é quando quase ' + (masc ? 'todo ' : 'toda ') + um + ' decide onde vai marcar.',
          itens: [['Responde na hora, em qualquer horário', 'Sete dias por semana. Ninguém fica no vácuo esperando o expediente começar.'], ['Tira as dúvidas de sempre', 'Serviços, valores, duração e formas de pagamento, do jeito que você responderia.'], ['Mostra os horários livres', (masc ? 'O cliente' : 'A cliente') + ' escolhe o dia e a hora entre as vagas reais da sua agenda.'], ['Marca direto na agenda', 'Horário confirmado no Google Agenda, com lembrete para você e para ' + cl + '.'], ['Passa o bastão quando precisa', 'Pedido fora do comum vai direto para você, com o resumo da conversa.'], ['Retoma quem sumiu', 'Lembra quem pediu valor e não marcou, e quem está na hora de voltar.']],
          fecha: 'quem atende ' + cl, fluxo: 'Do contato ao horário marcado',
          passos: [['Chega o contato', 'Google, Instagram, anúncio ou indicação. Terça às 10h ou domingo às 22h, tanto faz.'], ['O atendente responde em segundos', 'Em nome de {nome}, no tom que a gente definir junto no mapeamento.'], ['A conversa tira as dúvidas', 'Serviço, valor, duração e forma de pagamento, sem você parar o atendimento.'], ['O horário é marcado', (masc ? 'O cliente' : 'A cliente') + ' escolhe entre as vagas livres e recebe a confirmação na hora.'], ['Você entra', 'Vê o horário na agenda e só recebe o chamado quando o pedido sai do comum.']],
          chat: [['c', 'Oi! Tem horário para sábado?'], ['a', 'Oi! Tenho sim. Qual serviço você quer fazer?'], ['c', serv], ['a', 'Perfeito. No sábado tenho às 9h ou às 14h. Qual prefere?'], ['c', 'Às 9h'], ['a', 'Agendado para sábado às 9h. Na sexta eu te mando um lembrete por aqui.'], ['c', masc ? 'Valeu!' : 'Obrigada!']],
          resumo: ['SERVIÇO: ' + serv.toUpperCase(), 'SÁBADO, 9H · CONFIRMADO', 'LEMBRETE: SEXTA', 'ORIGEM: INSTAGRAM'],
          mapa: 'os serviços, os valores, a duração de cada um e o seu jeito de falar com ' + cl + '.',
          preciso: 'A lista de serviços, com valores e duração, e os seus horários de atendimento.',
          cenario: /barb/.test(sub) ? 'barbearia' : 'salão', agenda: 'a sua agenda de atendimentos',
          frase: 'Você continua sendo quem atende. A gente só tira o atraso do caminho.'
        };
      }
    },

    /* ---------------------------------------------------- BUFFET, FESTAS */
    festas: {
      rotulo: 'Festas',
      rotuloForm: 'Buffet, festas',
      abertura: {
        pergunta: 'Muita gente pede orçamento no WhatsApp, recebe e some, e no fim de semana fica difícil responder tudo.',
        oferta: 'Montamos um atendente com IA que coleta data, número de convidados e tipo de evento, passa a faixa de preço e volta a falar com quem não respondeu.',
        chamada: '*Podemos te mostrar um exemplo?*',
        recepcao: 'Já adianto que não é anúncio nem rede social: montamos um assistente que responde o WhatsApp na hora, pergunta data, número de convidados e tipo de evento, já passa a faixa de preço e volta a falar com quem sumiu.',
        direct: 'Ajudamos casas de festa a responder orçamento na hora: um atendente com IA que coleta data e convidados, passa a faixa de preço e retoma quem sumiu.'
      },
      segunda: { espera: 'receber o orçamento', faz: 'pergunta data, número de convidados e tipo de evento e já passa a faixa de preço', quem: 'o cliente', sai: 'a faixa de preço em mãos', ocupado: 'está em evento' },
      exemplo: ['Oi, queria um orçamento de festa', 'Oi! Claro. Para qual data, e quantos convidados mais ou menos?', '15 de novembro, uns 60', 'Tenho essa data livre. Vou te mandar as opções com os valores para 60 convidados. Prefere receber por aqui mesmo?', 'data, número de convidados, tipo de evento e a faixa de preço que foi enviada'],
      oferta: {
        A: ['{produto2}: coleta data e convidados, passa a faixa de preço e retoma quem pediu orçamento e sumiu.', '{produto1}, com galeria do espaço e pedido de orçamento.', '{nomeProduto3}, para a temporada de fim de ano.'],
        B: ['{produto2}, se o volume de orçamentos for alto. Se pesar, comece pelo site.', '{produto1}, com galeria e pedido de orçamento.', 'Atendimento completo depois da temporada.']
      },
      arte: {
        assunto: 'WhatsApp',
        jornal: 'Diário da Festa',
        linhaTopo: 'Atendimento com IA no WhatsApp',
        manchete: 'Sábado, 21:40.',
        subManchete: 'O pedido de orçamento chega quando você está na festa.',
        citacao: 'Quanto fica para 80 pessoas?',
        problema: 'No fim de semana fica difícil responder tudo. Quem pede valor e não recebe resposta procura outro.',
        solucao: 'Um atendente com IA coleta data, número de convidados e tipo de evento, manda a faixa de preço e volta a falar com quem não respondeu.',
        convite: 'Quer ver um exemplo?',
        pergunta: ['Quem responde o orçamento que chega', 'no sábado à noite?'],
        palavra: 'Sábado.',
        ficha: [['Perguntaram', 'sábado, 21:40'], ['Quem respondeu:', 'a IA, na hora'], ['Já coletado:', 'data, convidados e tipo'], ['Você, nesse momento:', 'na festa']]
      },
      proposta: {
        capa: ['Nenhum', 'orçamento', 'esperando.'], vive: 'data fechada',
        dia: [['09:12', 'Alguém procura festa na sua região, acha o seu perfil no Google e pede orçamento.'], ['13:40', 'Outro pedido chega no WhatsApp enquanto você está montando um evento.'], ['14:40', 'Uma hora sem resposta. A pessoa já pediu orçamento em outros dois lugares.', 1], ['18:30', 'Você envia o orçamento, a pessoa visualiza e some. Ninguém volta a falar com ela.'], ['22:00', 'O fim de semana chega e os pedidos novos ficam para segunda-feira.']],
        ticket: ['Seu ticket médio', 'Quanto vale, em média, uma festa fechada?'],
        custo: 'Se um só desses pedidos virasse festa por mês, quanto entraria a mais?',
        naoMuda: 'Quem planeja e faz a festa acontecer',
        decide: 'que é quando quase todo cliente decide com quem vai fechar a festa.',
        itens: [['Responde na hora, em qualquer horário', 'Sete dias por semana. Ninguém fica no vácuo esperando o expediente começar.'], ['Pergunta o que importa', 'Data, número de convidados, tipo de evento e local. O que você precisa para orçar, sem interrogatório.'], ['Envia a faixa de preço', 'Com base nas suas regras, o cliente já sai da conversa sabendo se cabe no orçamento.'], ['Marca a visita ou a ligação', 'Horário confirmado na sua agenda para apresentar o trabalho ou fechar os detalhes.'], ['Passa o bastão quando está pronto', 'Você recebe o resumo do pedido e assume a negociação.'], ['Retoma quem sumiu', 'Volta a falar com quem recebeu o orçamento e não respondeu, no tempo certo e no tom certo.']],
        fecha: 'quem fecha a festa', fluxo: 'Do pedido à data fechada',
        passos: [['Chega o pedido', 'Google, Instagram ou indicação. Terça às 10h ou domingo às 22h, tanto faz.'], ['O atendente responde em segundos', 'Em nome de {nome}, no tom que a gente definir junto no mapeamento.'], ['A conversa coleta os dados', 'Data, convidados, tipo de evento e local: tudo o que você precisa para orçar.'], ['A faixa de preço vai na hora', 'Quem cabe no orçamento já marca um horário com você.'], ['Você entra', 'Recebe o resumo do pedido e negocia com quem já sabe o valor.']],
        chat: [['c', 'Oi! Queria um orçamento para aniversário de 5 anos.'], ['a', 'Oi! Que fase boa. Para qual data e para quantos convidados?'], ['c', 'Dia 12 de dezembro, uns 60'], ['a', 'Tenho essa data livre. Vou te mandar a faixa de valores para 60 convidados. Quer marcar um horário para ver os detalhes?'], ['c', 'Quero, pode ser sábado'], ['a', 'Sábado às 11h, combinado. Na sexta eu te mando um lembrete por aqui.'], ['c', 'Perfeito']],
        resumo: ['ANIVERSÁRIO INFANTIL · 60 CONVIDADOS', 'DATA: 12 DE DEZEMBRO', 'CONVERSA: SÁBADO, 11H', 'ORIGEM: INSTAGRAM'],
        mapa: 'os tipos de evento, as faixas de preço, as datas que você atende e o seu jeito de falar com o cliente.',
        preciso: 'Os pacotes, as faixas de preço e as regras de data e de número de convidados.',
        cenario: 'festas', agenda: 'a sua agenda de eventos',
        frase: 'Você continua sendo quem fecha a festa. A gente só tira o atraso do caminho.'
      }
    }
  }
};
