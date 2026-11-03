-- GERADO de db/seed.sql por db/ferramentas/gerar-migracoes.mjs. Não editar à mão.
-- =============================================================================
-- ICARUS · Vertical de perfume · Dados iniciais (seed)
--
-- GERADO a partir dos arquivos TypeScript do projeto. Não editar à mão: mudanças
-- vão para os arquivos .ts e o seed é gerado de novo. Rodar depois de schema.sql.
-- Idempotente: pode rodar de novo; atualiza os catálogos e nunca apaga linhas.
--
-- Versões: questionário v1-52 · catálogo manual-2026-11-02 · motor motor-v0.1 · regras regras-v0.1
--
-- SHA-256 (16 primeiros dígitos) dos arquivos-fonte usados. Se algum arquivo
-- mudou e o hash não bate, este seed está desatualizado:
--   45efcf73417850b7  lib/questionario/perguntas.ts
--   a4f44d11bce931dc  lib/questionario/capitulos.ts
--   7ad4fb3d4ca1e260  lib/conhecimento/materias-primas.ts
--   dcdc0dc9c4229f1a  lib/conhecimento/referencias.ts
--   02d1125e3b0c8326  lib/motor/tipos.ts
--   edcd3d9ce504696b  lib/motor/tracos.ts
--   726a0ff98c793cf6  lib/motor/regras.ts
--   14c1262a7ee87e11  lib/armazenamento.ts
--
-- Conteúdo: 10 capítulos, 52 perguntas, 123 opções,
-- 12 traços, 21 regras, 6 grupos olfativos (5 da pergunta 19 + 1 transversal),
-- 5 concentrações, 8 lacunas naturais, 100 matérias-primas, 4 modalidades
-- e 1 texto de consentimento.
-- =============================================================================


set local standard_conforming_strings = on;

-- Banco 01 · Questionário v1-52. A versão do TS passa a ser a ativa.
update questionarios set status = 'arquivado' where status = 'ativo' and versao <> 'v1-52';
insert into questionarios (versao, total_capitulos, total_perguntas, minutos_estimados, status) values
  ('v1-52', 10, 52, 19, 'ativo')
on conflict (versao) do update set
  total_capitulos = excluded.total_capitulos,
  total_perguntas = excluded.total_perguntas,
  minutos_estimados = excluded.minutos_estimados,
  status = excluded.status;

-- Banco 01 · Capítulos (capitulos.ts)
insert into capitulos (questionario_versao, numero, id, nome, titulo, titulo_italico, descricao, arte, acento, grupos) values
  ('v1-52', 1, 'abertura', 'Abertura', 'Sua história tem um', 'cheiro próprio.', 'Antes de criar uma fragrância, precisamos conhecer quem vai carregá-la. Sua rotina, suas memórias, seus encontros e a maneira como você enxerga o mundo. Tudo isso faz parte da sua identidade.', 'abertura', 'aurora', null),
  ('v1-52', 2, 'contexto-rotina', 'Contexto e rotina', 'Sua', 'vida.', 'Comece pelo seu dia, do jeito que ele é. É nele que a sua fragrância vai viver.', 'rotina', 'mar', null),
  ('v1-52', 3, 'personalidade-identidade', 'Personalidade e identidade', 'Sua', 'essência.', 'Como você se percebe e como chega aos lugares. Não existe resposta certa.', 'essencia', 'mar', null),
  ('v1-52', 4, 'vida-social', 'Vida social e relacionamentos', 'Seu', 'mundo.', 'As pessoas e os encontros que também contam a sua história.', 'conexoes', 'mar', null),
  ('v1-52', 5, 'universo-olfativo', 'Universo olfativo e memórias', 'Suas', 'memórias.', 'Cheiro é lembrança. O que você guarda na memória vira matéria-prima da criação.', 'memorias', 'aurora', null),
  ('v1-52', 6, 'comportamento-uso', 'Comportamento e utilização', 'Sua', 'presença.', 'Onde, quando e com que intensidade a sua fragrância vai aparecer.', 'presenca', 'mar', null),
  ('v1-52', 7, 'restricoes', 'Restrições e preferências', 'Seus', 'cuidados.', 'Uma boa fragrância também respeita o que não combina com você. Todas as perguntas desta etapa são opcionais.', 'cuidados', 'mar', null),
  ('v1-52', 8, 'pele', 'Pele e experiência de uso', 'Sua relação com a', 'pele.', 'A mesma fragrância muda de pele para pele. Estas respostas dão contexto para a criação. Não são uma análise da sua pele.', 'pele', 'mar', '[{"id":"A","rotulo":"Características da pele"},{"id":"B","rotulo":"Experiência com fragrâncias"},{"id":"C","rotulo":"Contexto de uso"}]'::jsonb),
  ('v1-52', 9, 'produto', 'Produto, exclusividade e investimento', 'Sua', 'criação.', 'Agora, o perfume como objeto. Nenhuma resposta aqui é compromisso de compra.', 'criacao', 'mar', null),
  ('v1-52', 10, 'o-que-fica', 'Psicologia relacional e expressão emocional', 'O que', 'fica.', 'As últimas perguntas são sobre afeto. Responda no seu tempo.', 'final', 'aurora', null)
on conflict (questionario_versao, numero) do update set
  id = excluded.id,
  nome = excluded.nome,
  titulo = excluded.titulo,
  titulo_italico = excluded.titulo_italico,
  descricao = excluded.descricao,
  arte = excluded.arte,
  acento = excluded.acento,
  grupos = excluded.grupos;

-- Banco 01 · Perguntas (perguntas.ts)
insert into perguntas (questionario_versao, id, numero, capitulo, enunciado, ajuda, tipo, obrigatoria, sensivel, destino, condicao, max_selecoes, escala_min, escala_max, placeholder, variante, grupo, pilar) values
  ('v1-52', 'q01', 1, 1, 'O que te motivou a criar o seu perfume?', 'Escolha até 2.', 'escolha-multipla', true, null, 'respostas', null, 2, null, null, null, null, null, null),
  ('v1-52', 'q02', 2, 2, 'Como podemos te chamar?', null, 'texto-curto', true, null, 'contato', null, null, null, null, 'Seu nome ou apelido', null, null, null),
  ('v1-52', 'q03', 3, 2, 'Qual é a sua faixa de idade?', null, 'escolha-unica', true, null, 'respostas', null, null, null, null, null, null, null, null),
  ('v1-52', 'q04', 4, 2, 'Qual é o seu sexo?', 'Ajuda a calibrar a base da fórmula. Nunca limita as notas que você pode receber.', 'escolha-unica', false, 'pessoal', 'dados_sensiveis', null, null, null, null, null, null, null, null),
  ('v1-52', 'q05', 5, 2, 'Com qual gênero você se identifica?', null, 'escolha-unica', false, 'pessoal', 'dados_sensiveis', null, null, null, null, null, null, null, null),
  ('v1-52', 'q06', 6, 2, 'Como é o clima onde você mais circula?', 'Escolha até 2. O calor muda como o perfume abre e quanto ele dura.', 'escolha-multipla', true, null, 'respostas', null, 2, null, null, null, 'clima', null, null),
  ('v1-52', 'q07', 7, 2, 'Descreva um dia típico seu, da hora que acorda até dormir.', 'Não precisa ser longo.', 'texto-longo', false, null, 'respostas', null, null, null, null, 'Escreva do seu jeito. Pode ser em tópicos.', 'rotina', null, null),
  ('v1-52', 'q08', 8, 3, 'Em grupo, você se recolhe ou ocupa o espaço?', null, 'escala', true, null, 'respostas', null, null, 'Mais reservado(a)', 'Mais expansivo(a)', null, null, null, null),
  ('v1-52', 'q09', 9, 3, 'Você planeja ou improvisa?', null, 'escala', true, null, 'respostas', null, null, 'Planejo tudo', 'Improviso', null, null, null, null),
  ('v1-52', 'q10', 10, 3, 'Como você se apresenta ao mundo?', null, 'escala', true, null, 'respostas', null, null, 'Discreto(a)', 'Marcante', null, null, null, null),
  ('v1-52', 'q11', 11, 3, 'Seu estilo pessoal está mais para...', null, 'escala', true, null, 'respostas', null, null, 'Clássico', 'Moderno e ousado', null, null, null, null),
  ('v1-52', 'q12', 12, 3, 'Escolha três palavras que te descrevem.', 'Uma palavra em cada espaço.', 'tres-palavras', false, null, 'respostas', null, null, null, null, null, null, null, null),
  ('v1-52', 'q13', 13, 3, 'O que as pessoas costumam errar sobre você na primeira impressão?', null, 'texto-longo', false, null, 'respostas', null, null, null, null, 'Escreva do seu jeito.', null, null, null),
  ('v1-52', 'q14', 14, 4, 'Como é a sua roda de amigos?', null, 'escolha-unica', true, null, 'respostas', null, null, null, null, null, null, null, null),
  ('v1-52', 'q15', 15, 4, 'Como são os encontros com seus amigos?', 'Escolha até 2.', 'escolha-multipla', true, null, 'respostas', null, 2, null, null, null, 'cartoes-descricao', null, null),
  ('v1-52', 'q16', 16, 4, 'Qual é o seu papel no grupo?', 'Escolha até 2.', 'escolha-multipla', true, null, 'respostas', null, 2, null, null, null, null, null, null),
  ('v1-52', 'q17', 17, 4, 'Qual é o seu momento afetivo?', null, 'escolha-unica', false, 'pessoal', 'dados_sensiveis', null, null, null, null, null, null, null, null),
  ('v1-52', 'q18', 18, 4, 'Pense na pessoa mais importante da sua vida hoje. O que ela diria que é o seu melhor?', null, 'texto-longo', false, null, 'respostas', null, null, null, null, 'Do jeito que essa pessoa falaria.', null, null, null),
  ('v1-52', 'q19', 19, 5, 'Quais destes cheiros mais te agradam?', 'Escolha até 2.', 'escolha-multipla', true, null, 'respostas', null, 2, null, null, null, 'familias', null, null),
  ('v1-52', 'q20', 20, 5, 'Algum cheiro que você não suporta?', null, 'texto-longo', false, null, 'respostas', null, null, null, null, 'Escreva do seu jeito.', null, null, null),
  ('v1-52', 'q21', 21, 5, 'Qual cheiro te leva de volta a um momento especial?', null, 'texto-longo', false, null, 'respostas', null, null, null, null, 'Conte no seu tempo.', null, null, null),
  ('v1-52', 'q22', 22, 5, 'Qual é o cheiro da sua infância?', null, 'texto-longo', false, null, 'respostas', null, null, null, null, 'Conte no seu tempo.', null, null, null),
  ('v1-52', 'q23', 23, 5, 'Onde você se sente mais você?', 'Escolha até 2.', 'escolha-multipla', true, null, 'respostas', null, 2, null, null, null, 'cartoes-descricao', null, null),
  ('v1-52', 'q24', 24, 5, 'Qual estação do ano combina com você?', null, 'escolha-unica', true, null, 'respostas', null, null, null, null, null, 'estacoes', null, null),
  ('v1-52', 'q25', 25, 5, 'Se você fosse uma bebida, qual seria?', 'Escolha até 2.', 'escolha-multipla', true, null, 'respostas', null, 2, null, null, null, 'bebidas', null, null),
  ('v1-52', 'q26', 26, 6, 'Em quais ocasiões você quer usar esse perfume?', 'Escolha até 2.', 'escolha-multipla', true, null, 'respostas', null, 2, null, null, null, null, null, null),
  ('v1-52', 'q27', 27, 6, 'Em que momento do dia você mais usa perfume?', null, 'escolha-unica', true, null, 'respostas', null, null, null, null, null, null, null, null),
  ('v1-52', 'q28', 28, 6, 'Que intensidade você prefere?', null, 'escala', true, null, 'respostas', null, null, 'Suave, só de perto', 'Marcante, deixa rastro', null, 'projecao', null, null),
  ('v1-52', 'q29', 29, 6, 'Quanto a duração na pele importa para você?', null, 'escala', true, null, 'respostas', null, null, 'Pouco', 'É essencial', null, null, null, null),
  ('v1-52', 'q30', 30, 6, 'Quais perfumes você já usou? Quais amou e quais não funcionaram?', 'Pode citar nomes, descrever experiências e explicar o que não funcionou.', 'texto-longo', false, null, 'respostas', null, null, null, null, 'Nomes, lembranças, o que funcionou e o que não funcionou.', null, null, null),
  ('v1-52', 'q31', 31, 7, 'Você tem alergia ou sensibilidade a perfumes, cosméticos ou ingredientes?', 'Ajuda a evitar ingredientes que não combinam com você.', 'escolha-unica', false, 'saude', 'dados_sensiveis', null, null, null, null, null, null, null, null),
  ('v1-52', 'q32', 32, 7, 'Quais?', 'Ingredientes, produtos ou reações que você lembra.', 'texto-longo', false, 'saude', 'dados_sensiveis', '{"pergunta":"q31","em":["sim","nao-sei"]}'::jsonb, null, null, null, 'Escreva o que você souber.', null, null, null),
  ('v1-52', 'q33', 33, 7, 'Como você reage a perfumes fortes no ambiente?', null, 'escolha-unica', false, null, 'respostas', null, null, null, null, null, null, null, null),
  ('v1-52', 'q34', 34, 7, 'Você evita algum ingrediente por motivo ético ou religioso?', 'Escolha até 2. A opção Nenhum desmarca as outras.', 'escolha-multipla', false, 'pessoal', 'dados_sensiveis', null, 2, null, null, null, null, null, null),
  ('v1-52', 'q35', 35, 8, 'Sua pele costuma ser mais seca ou oleosa?', null, 'escolha-unica', true, null, 'respostas', null, null, null, null, null, null, 'A', null),
  ('v1-52', 'q36', 36, 8, 'Você usa hidratante corporal diariamente?', null, 'escolha-unica', true, null, 'respostas', null, null, null, null, null, null, 'A', null),
  ('v1-52', 'q37', 37, 8, 'Quando você usa perfumes comerciais, quanto tempo eles duram na sua pele?', null, 'escolha-unica', true, null, 'respostas', null, null, null, null, null, null, 'B', null),
  ('v1-52', 'q38', 38, 8, 'Perfumes cítricos ou florais ficam com aspecto azedo, metálico ou ardido em você?', null, 'escolha-unica', true, null, 'respostas', null, null, null, null, null, null, 'B', null),
  ('v1-52', 'q39', 39, 8, 'Sua alimentação inclui bastante café, pimenta ou especiarias?', null, 'escolha-unica', false, null, 'respostas', null, null, null, null, null, null, 'C', null),
  ('v1-52', 'q40', 40, 8, 'Como é o seu nível de estresse na rotina de trabalho?', null, 'escala', false, null, 'respostas', null, null, 'Tranquilo', 'Muito estressante', null, null, 'C', null),
  ('v1-52', 'q41', 41, 8, 'Você está gestante ou amamentando?', 'Usado só para escolher ingredientes com mais cuidado.', 'escolha-unica', false, 'saude', 'dados_sensiveis', '{"pergunta":"q04","naoEm":["masculino"]}'::jsonb, null, null, null, null, null, 'C', null),
  ('v1-52', 'q42', 42, 8, 'Alguma destas situações se aplica a você hoje?', 'Usado só como contexto. Não pedimos detalhes.', 'escolha-unica', false, 'saude', 'dados_sensiveis', null, null, null, null, null, null, 'C', null),
  ('v1-52', 'q43', 43, 9, 'Quanto você costuma investir em um perfume hoje?', null, 'escolha-unica', true, null, 'respostas', null, null, null, null, null, 'investimento', null, null),
  ('v1-52', 'q44', 44, 9, 'O que mais pesa na sua escolha de um perfume?', 'Escolha até 2.', 'escolha-multipla', true, null, 'respostas', null, 2, null, null, null, null, null, null),
  ('v1-52', 'q45', 45, 9, 'Quanto importa que ninguém mais tenha o mesmo cheiro que você?', null, 'escala', true, null, 'respostas', null, null, 'Não me importo', 'É o mais importante', null, null, null, null),
  ('v1-52', 'q46', 46, 9, 'Você aceitaria que a sua fórmula inspirasse coleções futuras da ICARUS em troca de desconto?', 'Isto não é um contrato. Nada é decidido sem a sua autorização no momento da compra.', 'escolha-unica', true, null, 'respostas', null, null, null, null, null, 'reproducao', null, null),
  ('v1-52', 'q47', 47, 9, 'Que detalhe da embalagem ou da entrega faria você sentir que aquilo foi feito para você?', null, 'texto-longo', false, null, 'respostas', null, null, null, null, 'Um detalhe já basta.', null, null, null),
  ('v1-52', 'q48', 48, 10, 'O que alguém faz que te faz sentir realmente querido(a)?', null, 'texto-longo', false, null, 'respostas', null, null, null, null, 'Escreva no seu tempo.', null, null, 'receber-afeto'),
  ('v1-52', 'q49', 49, 10, 'Como você demonstra que alguém é importante para você?', 'Escolha até 2.', 'escolha-multipla', true, null, 'respostas', null, 2, null, null, null, null, null, 'expressar-afeto'),
  ('v1-52', 'q50', 50, 10, 'Quando você sai de uma sala, como quer que as pessoas te lembrem?', null, 'texto-longo', false, null, 'respostas', null, null, null, null, 'Escreva no seu tempo.', null, null, 'reconhecimento-social'),
  ('v1-52', 'q51', 51, 10, 'Onde, ou com quem, você consegue ser 100% você?', null, 'texto-longo', false, null, 'respostas', null, null, null, null, 'Escreva no seu tempo.', null, null, 'seguranca-emocional'),
  ('v1-52', 'q52', 52, 10, 'O que significa “voar mais alto” para você hoje?', null, 'texto-longo', false, null, 'respostas', null, null, null, null, 'Escreva no seu tempo.', 'final', null, 'fecho-icarus')
on conflict (questionario_versao, id) do update set
  numero = excluded.numero,
  capitulo = excluded.capitulo,
  enunciado = excluded.enunciado,
  ajuda = excluded.ajuda,
  tipo = excluded.tipo,
  obrigatoria = excluded.obrigatoria,
  sensivel = excluded.sensivel,
  destino = excluded.destino,
  condicao = excluded.condicao,
  max_selecoes = excluded.max_selecoes,
  escala_min = excluded.escala_min,
  escala_max = excluded.escala_max,
  placeholder = excluded.placeholder,
  variante = excluded.variante,
  grupo = excluded.grupo,
  pilar = excluded.pilar;

-- Banco 01 · Opções, com o código estável em "valor" (perguntas.ts)
insert into opcoes (questionario_versao, pergunta_id, valor, ordem, rotulo, descricao, exclusiva, imagem, imagem_alt) values
  ('v1-52', 'q01', 'nunca-achei', 1, 'Nunca achei um perfume que fosse a minha cara', null, false, null, null),
  ('v1-52', 'q01', 'cheiro-unico', 2, 'Ter um cheiro que ninguém mais tem', null, false, null, null),
  ('v1-52', 'q01', 'nova-fase', 3, 'Marcar uma nova fase da minha vida', null, false, null, null),
  ('v1-52', 'q01', 'presente', 4, 'Me dar um presente que eu mereço', null, false, null, null),
  ('v1-52', 'q01', 'curiosidade', 5, 'Curiosidade de me ver traduzido(a) em um cheiro', null, false, null, null),
  ('v1-52', 'q03', '18-24', 1, '18 a 24', null, false, null, null),
  ('v1-52', 'q03', '25-34', 2, '25 a 34', null, false, null, null),
  ('v1-52', 'q03', '35-44', 3, '35 a 44', null, false, null, null),
  ('v1-52', 'q03', '45-mais', 4, '45 ou mais', null, false, null, null),
  ('v1-52', 'q04', 'feminino', 1, 'Feminino', null, false, null, null),
  ('v1-52', 'q04', 'masculino', 2, 'Masculino', null, false, null, null),
  ('v1-52', 'q04', 'intersexo', 3, 'Intersexo', null, false, null, null),
  ('v1-52', 'q04', 'nao-informar', 4, 'Prefiro não informar', null, false, null, null),
  ('v1-52', 'q05', 'mulher', 1, 'Mulher', null, false, null, null),
  ('v1-52', 'q05', 'homem', 2, 'Homem', null, false, null, null),
  ('v1-52', 'q05', 'nao-binario', 3, 'Não binário', null, false, null, null),
  ('v1-52', 'q05', 'outro', 4, 'Outro', null, false, null, null),
  ('v1-52', 'q05', 'nao-informar', 5, 'Prefiro não informar', null, false, null, null),
  ('v1-52', 'q06', 'quente-umido', 1, 'Quente e úmido', 'Calor com ar pesado.', false, null, null),
  ('v1-52', 'q06', 'quente-seco', 2, 'Quente e seco', 'Sol forte e ar seco.', false, null, null),
  ('v1-52', 'q06', 'ameno', 3, 'Ameno', 'Nem muito quente, nem frio.', false, null, null),
  ('v1-52', 'q06', 'frio', 4, 'Frio', 'Agasalho boa parte do ano.', false, null, null),
  ('v1-52', 'q06', 'varia', 5, 'Varia muito ao longo do ano', 'Cada estação é diferente.', false, null, null),
  ('v1-52', 'q14', 'poucos-proximos', 1, 'Poucos e muito próximos', null, false, null, null),
  ('v1-52', 'q14', 'grupo-medio', 2, 'Um grupo médio e fiel', null, false, null, null),
  ('v1-52', 'q14', 'muita-gente', 3, 'Muita gente, vários círculos', null, false, null, null),
  ('v1-52', 'q15', 'festa', 1, 'Festa e agito', 'Música, gente e noite longa.', false, null, null),
  ('v1-52', 'q15', 'conversa', 2, 'Conversa longa e boa comida', 'Mesa cheia e assunto que não acaba.', false, null, null),
  ('v1-52', 'q15', 'ar-livre', 3, 'Ao ar livre', 'Parque, praia, trilha ou rua.', false, null, null),
  ('v1-52', 'q15', 'cultura', 4, 'Cinema, música e arte', 'Sessão, show, exposição.', false, null, null),
  ('v1-52', 'q15', 'casa', 5, 'Em casa, no sossego', 'Poucas pessoas e tempo sem pressa.', false, null, null),
  ('v1-52', 'q16', 'anima', 1, 'Quem anima', null, false, null, null),
  ('v1-52', 'q16', 'escuta', 2, 'Quem escuta e aconselha', null, false, null, null),
  ('v1-52', 'q16', 'organiza', 3, 'Quem puxa e organiza', null, false, null, null),
  ('v1-52', 'q16', 'observa', 4, 'Quem observa e solta a melhor sacada', null, false, null, null),
  ('v1-52', 'q16', 'junta', 5, 'Quem junta todo mundo', null, false, null, null),
  ('v1-52', 'q17', 'solteiro', 1, 'Solteiro(a)', null, false, null, null),
  ('v1-52', 'q17', 'relacionamento', 2, 'Em um relacionamento', null, false, null, null),
  ('v1-52', 'q17', 'casado', 3, 'Casado(a) ou união estável', null, false, null, null),
  ('v1-52', 'q17', 'nao-rotular', 4, 'Prefiro não rotular', null, false, null, null),
  ('v1-52', 'q17', 'nao-informar', 5, 'Prefiro não informar', null, false, null, null),
  ('v1-52', 'q19', 'frescos', 1, 'Frescos', 'Cítricos, mar, folhas verdes', false, '/marca/familias/frescos.jpg', 'Gotas de chuva numa janela, com a cidade ao fundo'),
  ('v1-52', 'q19', 'florais', 2, 'Florais', 'Jasmim, rosa, flor de laranjeira', false, '/marca/familias/florais.jpg', 'Ramos secos de lavanda e uma pétala sobre pedra'),
  ('v1-52', 'q19', 'amadeirados', 3, 'Amadeirados e terrosos', 'Cedro, sândalo, vetiver', false, '/marca/familias/amadeirados.jpg', 'Tampo de madeira iluminado pela luz da tarde'),
  ('v1-52', 'q19', 'doces', 4, 'Doces e gourmand', 'Baunilha, caramelo, café, cacau', false, '/marca/familias/doces.jpg', 'Xícara de café com vapor sobre a mesa'),
  ('v1-52', 'q19', 'quentes', 5, 'Quentes e intensos', 'Especiarias, couro, incenso, tabaco', false, '/marca/familias/quentes.jpg', 'Faixa de luz âmbar atravessando o azul'),
  ('v1-52', 'q23', 'praia', 1, 'Praia', 'Sal, sol e horizonte aberto.', false, null, null),
  ('v1-52', 'q23', 'mata', 2, 'Mata, montanha e cachoeira', 'Verde, altitude e água corrente.', false, null, null),
  ('v1-52', 'q23', 'cidade', 3, 'Cidade grande', 'Movimento, prédios e luz da noite.', false, null, null),
  ('v1-52', 'q23', 'casa', 4, 'Em casa', 'O seu canto, do seu jeito.', false, null, null),
  ('v1-52', 'q23', 'bares', 5, 'Bares e casas de show', 'Música ao vivo e gente por perto.', false, null, null),
  ('v1-52', 'q24', 'verao', 1, 'Verão', 'Dez a mar', false, null, null),
  ('v1-52', 'q24', 'outono', 2, 'Outono', 'Mar a jun', false, null, null),
  ('v1-52', 'q24', 'inverno', 3, 'Inverno', 'Jun a set', false, null, null),
  ('v1-52', 'q24', 'primavera', 4, 'Primavera', 'Set a dez', false, null, null),
  ('v1-52', 'q25', 'cafe', 1, 'Café forte', 'Torrado e intenso.', false, null, null),
  ('v1-52', 'q25', 'vinho', 2, 'Vinho tinto', 'Encorpado e profundo.', false, null, null),
  ('v1-52', 'q25', 'gin', 3, 'Gin tônica', 'Cítrico, gelado e botânico.', false, null, null),
  ('v1-52', 'q25', 'cha', 4, 'Chá', 'Calmo e aromático.', false, null, null),
  ('v1-52', 'q25', 'champagne', 5, 'Champagne', 'Leve e de celebração.', false, null, null),
  ('v1-52', 'q26', 'trabalho', 1, 'Trabalho e dia a dia', null, false, null, null),
  ('v1-52', 'q26', 'encontros', 2, 'Encontros', null, false, null, null),
  ('v1-52', 'q26', 'noite', 3, 'Festas e noite', null, false, null, null),
  ('v1-52', 'q26', 'eventos', 4, 'Eventos especiais', null, false, null, null),
  ('v1-52', 'q26', 'treino', 5, 'Depois do treino, pra me sentir limpo(a)', null, false, null, null),
  ('v1-52', 'q27', 'manha', 1, 'Manhã', null, false, null, null),
  ('v1-52', 'q27', 'tarde', 2, 'Tarde', null, false, null, null),
  ('v1-52', 'q27', 'noite', 3, 'Noite', null, false, null, null),
  ('v1-52', 'q27', 'dia-todo', 4, 'Passo de manhã e quero que dure o dia todo', null, false, null, null),
  ('v1-52', 'q31', 'nao', 1, 'Não', null, false, null, null),
  ('v1-52', 'q31', 'sim', 2, 'Sim', null, false, null, null),
  ('v1-52', 'q31', 'nao-sei', 3, 'Não sei', null, false, null, null),
  ('v1-52', 'q33', 'nao-incomoda', 1, 'Não me incomoda', null, false, null, null),
  ('v1-52', 'q33', 'incomoda-pouco', 2, 'Incomoda um pouco', null, false, null, null),
  ('v1-52', 'q33', 'dor-cabeca', 3, 'Me dá dor de cabeça ou enjoo', null, false, null, null),
  ('v1-52', 'q34', 'origem-animal', 1, 'Origem animal', null, false, null, null),
  ('v1-52', 'q34', 'alcool', 2, 'Álcool', null, false, null, null),
  ('v1-52', 'q34', 'testados-animais', 3, 'Testados em animais', null, false, null, null),
  ('v1-52', 'q34', 'sinteticos', 4, 'Sintéticos em geral', null, false, null, null),
  ('v1-52', 'q34', 'nenhum', 5, 'Nenhum', null, true, null, null),
  ('v1-52', 'q35', 'seca', 1, 'Mais seca', null, false, null, null),
  ('v1-52', 'q35', 'normal-mista', 2, 'Normal ou mista', null, false, null, null),
  ('v1-52', 'q35', 'oleosa', 3, 'Mais oleosa', null, false, null, null),
  ('v1-52', 'q35', 'nao-sei', 4, 'Não sei dizer', null, false, null, null),
  ('v1-52', 'q36', 'todos-dias', 1, 'Todos os dias', null, false, null, null),
  ('v1-52', 'q36', 'as-vezes', 2, 'Às vezes', null, false, null, null),
  ('v1-52', 'q36', 'quase-nunca', 3, 'Quase nunca', null, false, null, null),
  ('v1-52', 'q37', 'somem', 1, 'Somem em poucas horas', null, false, null, null),
  ('v1-52', 'q37', 'metade-dia', 2, 'Duram metade do dia', null, false, null, null),
  ('v1-52', 'q37', 'dia-todo', 3, 'Duram o dia todo', null, false, null, null),
  ('v1-52', 'q37', 'nao-sei', 4, 'Não sei dizer', null, false, null, null),
  ('v1-52', 'q38', 'nao-mudam', 1, 'Não, ficam como no frasco', null, false, null, null),
  ('v1-52', 'q38', 'as-vezes', 2, 'Às vezes mudam', null, false, null, null),
  ('v1-52', 'q38', 'quase-sempre', 3, 'Sim, quase sempre mudam', null, false, null, null),
  ('v1-52', 'q38', 'nunca-percebi', 4, 'Nunca percebi', null, false, null, null),
  ('v1-52', 'q39', 'quase-todo-dia', 1, 'Quase todo dia', null, false, null, null),
  ('v1-52', 'q39', 'algumas-vezes', 2, 'Algumas vezes por semana', null, false, null, null),
  ('v1-52', 'q39', 'raramente', 3, 'Raramente', null, false, null, null),
  ('v1-52', 'q41', 'sim', 1, 'Sim', null, false, null, null),
  ('v1-52', 'q41', 'nao', 2, 'Não', null, false, null, null),
  ('v1-52', 'q41', 'nao-informar', 3, 'Prefiro não informar', null, false, null, null),
  ('v1-52', 'q42', 'nenhuma', 1, 'Nenhuma', null, false, null, null),
  ('v1-52', 'q42', 'hormonal', 2, 'Transição ou mudança hormonal', null, false, null, null),
  ('v1-52', 'q42', 'medicamento', 3, 'Medicamento de uso contínuo', null, false, null, null),
  ('v1-52', 'q42', 'as-duas', 4, 'As duas', null, false, null, null),
  ('v1-52', 'q42', 'nao-informar', 5, 'Prefiro não informar', null, false, null, null),
  ('v1-52', 'q43', 'ate-150', 1, 'Até R$ 150', null, false, null, null),
  ('v1-52', 'q43', '150-300', 2, 'R$ 150 a 300', null, false, null, null),
  ('v1-52', 'q43', '300-600', 3, 'R$ 300 a 600', null, false, null, null),
  ('v1-52', 'q43', 'acima-600', 4, 'Acima de R$ 600', null, false, null, null),
  ('v1-52', 'q44', 'cheiro-unico', 1, 'Cheiro único', null, false, null, null),
  ('v1-52', 'q44', 'fixacao', 2, 'Fixação', null, false, null, null),
  ('v1-52', 'q44', 'naturais', 3, 'Ingredientes naturais', null, false, null, null),
  ('v1-52', 'q44', 'marca-status', 4, 'Marca e status', null, false, null, null),
  ('v1-52', 'q44', 'preco', 5, 'Preço', null, false, null, null),
  ('v1-52', 'q46', 'sim-desconto', 1, 'Sim, com desconto', 'Sua fórmula pode inspirar coleções futuras da ICARUS. Em troca, você paga menos pelo seu perfume.', false, null, null),
  ('v1-52', 'q46', 'nao-exclusivo', 2, 'Não, quero só meu', 'Você prefere que a sua fórmula não inspire outros perfumes.', false, null, null),
  ('v1-52', 'q46', 'depende', 3, 'Depende do tamanho do desconto', 'Você decide depois de conhecer o valor do desconto.', false, null, null),
  ('v1-52', 'q49', 'presentes', 1, 'Presentes pensados', null, false, null, null),
  ('v1-52', 'q49', 'tempo', 2, 'Tempo junto', null, false, null, null),
  ('v1-52', 'q49', 'palavras', 3, 'Palavras e elogios', null, false, null, null),
  ('v1-52', 'q49', 'toque', 4, 'Toque e carinho físico', null, false, null, null),
  ('v1-52', 'q49', 'cuidado', 5, 'Cuidar e resolver as coisas da pessoa', null, false, null, null)
on conflict (questionario_versao, pergunta_id, valor) do update set
  ordem = excluded.ordem,
  rotulo = excluded.rotulo,
  descricao = excluded.descricao,
  exclusiva = excluded.exclusiva,
  imagem = excluded.imagem,
  imagem_alt = excluded.imagem_alt;

-- Banco 02 · Traços P001 a P012 (lib/motor/tracos.ts, motor-v0.1)
insert into tracos (codigo, nome, tipo, metodo, perguntas_origem, depende_ia, versao_motor) values
  ('P001', 'Busca por reconhecimento', 'escala-0-10', 'Escala da #10 convertida para 0 a 10. Parcial: a #50 (como quer ser lembrado) aguarda leitura da IA.', array['q10', 'q50']::text[], true, 'motor-v0.1'),
  ('P002', 'Necessidade de individualidade', 'escala-0-10', '0,75 × escala da #45, mais 2,5 se a #1 inclui ''Ter um cheiro que ninguém mais tem''.', array['q45', 'q01']::text[], false, 'motor-v0.1'),
  ('P003', 'Preferência por discrição', 'escala-0-10', 'Média das escalas invertidas da #8 e da #10.', array['q08', 'q10']::text[], false, 'motor-v0.1'),
  ('P004', 'Busca por experiências novas', 'escala-0-10', 'Média das escalas da #9 (improviso) e da #11 (moderno e ousado).', array['q09', 'q11']::text[], false, 'motor-v0.1'),
  ('P005', 'Valorização de conexões sociais', 'escala-0-10', 'Média de pesos fixos para a roda (#14), o papel no grupo (#16) e o tipo de encontro (#15). Pesos v0.', array['q14', 'q16', 'q15']::text[], false, 'motor-v0.1'),
  ('P006', 'Segurança emocional', 'escala-0-10', 'Depende da leitura de texto livre pela IA, ainda não implementada. Nenhum valor é atribuído.', array['q51']::text[], true, 'motor-v0.1'),
  ('P007', 'Expressividade emocional', 'escala-0-10', 'Depende da leitura de texto livre pela IA, ainda não implementada. Nenhum valor é atribuído.', array['q13', 'q18']::text[], true, 'motor-v0.1'),
  ('P008', 'Valorização da sofisticação', 'escala-0-10', 'Base 5; +3 ''Marca e status'', +1,5 ''Ingredientes naturais'', +1 ''Cheiro único'', −2 ''Preço'' (#44); ajuste leve pela #11. Pesos v0.', array['q44', 'q11']::text[], false, 'motor-v0.1'),
  ('P009', 'Busca por autenticidade', 'escala-0-10', 'Depende da leitura de texto livre pela IA, ainda não implementada. Nenhum valor é atribuído.', array['q12', 'q13']::text[], true, 'motor-v0.1'),
  ('P010', 'Preferência por ambientes acolhedores', 'escala-0-10', 'Média de pesos fixos para encontros (#15) e lugares (#23). Pesos v0.', array['q15', 'q23']::text[], false, 'motor-v0.1'),
  ('P011', 'Como recebe afeto', 'categoria', 'Depende da leitura de texto livre pela IA, ainda não implementada. Nenhum valor é atribuído.', array['q48']::text[], true, 'motor-v0.1'),
  ('P012', 'Como expressa afeto', 'categoria', 'Leitura direta das opções escolhidas na #49.', array['q49']::text[], false, 'motor-v0.1')
on conflict (codigo) do update set
  nome = excluded.nome,
  tipo = excluded.tipo,
  metodo = excluded.metodo,
  perguntas_origem = excluded.perguntas_origem,
  depende_ia = excluded.depende_ia,
  versao_motor = excluded.versao_motor;

-- Banco 02 · Regras de tradução (lib/motor/regras.ts, regras-v0.1)
insert into regras_traducao (codigo, versao, nome, descricao, tipo, evidencia, perguntas_origem) values
  ('R01', 'regras-v0.1', 'Família olfativa declarada', 'Famílias declaradas (#19)', 'direcao', 'declarada', array['q19']::text[]),
  ('R02', 'regras-v0.1', 'Estação que combina', 'Estação (#24)', 'ajuste', 'associacao', array['q24']::text[]),
  ('R03', 'regras-v0.1', 'Lugares onde se sente mais você', 'Lugares (#23)', 'ajuste', 'associacao', array['q23']::text[]),
  ('R04', 'regras-v0.1', 'Bebida que representa', 'Bebidas (#25)', 'ajuste', 'associacao', array['q25']::text[]),
  ('R05', 'regras-v0.1', 'Memórias olfativas (menções diretas)', 'Memórias (#21, #22): menções diretas', 'ajuste', 'declarada', array['q21', 'q22']::text[]),
  ('R06', 'regras-v0.1', 'Cheiros que não suporta', 'O que não suporta (#20): exclusões', 'restricao', 'declarada', array['q20']::text[]),
  ('R07', 'regras-v0.1', 'Concentração sugerida', 'Concentração (#28 intensidade × #29 duração, com #27)', 'direcao', 'aceita', array['q28', 'q29', 'q27']::text[]),
  ('R08', 'regras-v0.1', 'Clima quente / Clima frio', 'Clima (#6)', 'ajuste', 'moderada', array['q06']::text[]),
  ('R09', 'regras-v0.1', 'Reforço de fixação', 'Pele seca ou perfume que some (#35, #37)', 'ajuste', 'aceita', array['q35', 'q37']::text[]),
  ('R10', 'regras-v0.1', 'Pouca hidratação', 'Hidratação (#36)', 'ajuste', 'aceita', array['q36']::text[]),
  ('R11', 'regras-v0.1', 'Alteração de cítricos na pele', 'Cítricos e florais que mudam (#38)', 'ajuste', 'fraca', array['q38']::text[]),
  ('R12', 'regras-v0.1', 'Dieta e estresse', 'Dieta e estresse (#39, #40)', 'ajuste', 'fraca', array['q39', 'q40']::text[]),
  ('R13', 'regras-v0.1', 'Sensibilidade a perfumes fortes', 'Sensibilidade a perfumes fortes (#33)', 'restricao', 'declarada', array['q33']::text[]),
  ('R14', 'regras-v0.1', 'Sem álcool', 'Restrições éticas ou religiosas (#34)', 'restricao', 'declarada', array['q34']::text[]),
  ('R15', 'regras-v0.1', 'Sem sintéticos', 'Restrições éticas ou religiosas (#34)', 'restricao', 'declarada', array['q34']::text[]),
  ('R16', 'regras-v0.1', 'Restrições de origem e teste', 'Restrições éticas ou religiosas (#34)', 'restricao', 'declarada', array['q34']::text[]),
  ('R17', 'regras-v0.1', 'Alergia ou sensibilidade', 'Alergias (#31, #32)', 'seguranca', 'declarada', array['q31', 'q32']::text[]),
  ('R18', 'regras-v0.1', 'Gestação ou amamentação', 'Gestação (#41)', 'seguranca', 'declarada', array['q41']::text[]),
  ('R19', 'regras-v0.1', 'Contexto hormonal ou medicação', 'Mudanças hormonais e medicação (#42)', 'seguranca', 'fraca', array['q42']::text[]),
  ('R20', 'regras-v0.1', 'Ocasiões de uso', 'Ocasiões (#26)', 'ajuste', 'associacao', array['q26']::text[]),
  ('R21', 'regras-v0.1', 'Sexo e gênero', 'Sexo e gênero não filtram notas (decisão de projeto)', 'informativa', 'declarada', array['q04', 'q05']::text[])
on conflict (codigo, versao) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  tipo = excluded.tipo,
  evidencia = excluded.evidencia,
  perguntas_origem = excluded.perguntas_origem;

-- Banco 03 · Grupos olfativos (GRUPOS em referencias.ts; "transversal" vem do catálogo)
insert into grupos_olfativos (codigo, nome, exemplos, ordem, na_pergunta_19) values
  ('frescos', 'Frescos', 'Cítricos, mar, folhas verdes', 1, true),
  ('florais', 'Florais', 'Jasmim, rosa, flor de laranjeira', 2, true),
  ('amadeirados', 'Amadeirados e terrosos', 'Cedro, sândalo, vetiver', 3, true),
  ('doces', 'Doces e gourmand', 'Baunilha, caramelo, café, cacau', 4, true),
  ('quentes', 'Quentes e intensos', 'Especiarias, couro, incenso, tabaco', 5, true),
  ('transversal', 'Transversal', 'Semente de Ambreta', 6, false)
on conflict (codigo) do update set
  nome = excluded.nome,
  exemplos = excluded.exemplos,
  ordem = excluded.ordem,
  na_pergunta_19 = excluded.na_pergunta_19;

-- Banco 03 · Concentrações (CONCENTRACOES em referencias.ts)
insert into concentracoes (codigo, nome, concentrado, concentrado_min_pct, concentrado_max_pct, duracao, comportamento, ordem) values
  ('eau-fraiche', 'Eau Fraîche', '1% a 3%', 1, 3, '1 a 2 h', 'Domina o topo; rastro mínimo', 1),
  ('edc', 'Eau de Cologne (EDC)', '2% a 6%', 2, 6, '2 a 3 h', 'Abertura cítrica intensa; seca rápido', 2),
  ('edt', 'Eau de Toilette (EDT)', '5% a 15%', 5, 15, '3 a 5 h', 'Alta difusão; projeção expansiva', 3),
  ('edp', 'Eau de Parfum (EDP)', '15% a 20%', 15, 20, '6 a 10 h', 'Evolui para a base; rastro denso', 4),
  ('extrait', 'Extrait de Parfum', '20% a 40%', 20, 40, '12 a 24 h ou mais', 'Fixação extrema; projeção íntima', 5)
on conflict (codigo) do update set
  nome = excluded.nome,
  concentrado = excluded.concentrado,
  concentrado_min_pct = excluded.concentrado_min_pct,
  concentrado_max_pct = excluded.concentrado_max_pct,
  duracao = excluded.duracao,
  comportamento = excluded.comportamento,
  ordem = excluded.ordem;

-- Banco 03 · Lacunas naturais (LACUNAS_NATURAIS em referencias.ts)
insert into lacunas_naturais (codigo, texto) values
  ('mar', 'Notas marinhas: não há matéria-prima natural no catálogo. Na linha Essencial, sintéticos cobrem.'),
  ('couro', 'Couro: só existe como acorde (#100); bétula bruta é proibida e a retificada tem limite.'),
  ('tabaco', 'Tabaco: não há absoluto de tabaco no catálogo.'),
  ('cha', 'Chá: não há absoluto de chá no catálogo.'),
  ('vinho', 'Vinho: não há nota de vinho; cassis (#97) pode aproximar, a validar com perfumista.'),
  ('champagne', 'Champagne: não há nota natural; seria um acorde a desenvolver.'),
  ('caramelo', 'Caramelo: não há matéria-prima de caramelo no catálogo; baunilha e fava-tonca aproximam.'),
  ('limpo', 'Roupa limpa e sabonete: almíscares brancos e aldeídos são sintéticos; não há natural equivalente no catálogo.')
on conflict (codigo) do update set
  texto = excluded.texto;

-- Banco 04 · Matérias-primas (materias-primas.ts). Não toca nas colunas preenchidas
-- pelo perfumista (volatilidade, persistência, papel no acorde, ativa).
insert into materias_primas (n, nome, camada_manual, camadas, familia, grupo, grupo_secundario, descricao_manual, alertas, pagina, proibida_forma, fototoxica, cites, nativa_br, custo_alto, disponibilidade_rara, limite_uso, praticamente_inviavel, eh_acorde, duplicidade_com, sintetica, versao_catalogo) values
  (1, 'Bergamota FCF (Citrus bergamia)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Universal. Espinha dorsal dos acordes Chypre e Fougère com lavanda, rosa e patchouli.', array['OK: a versão FCF é justamente a sem bergapteno; a bergamota comum prensada é restrita por fototoxicidade [P]']::text[], 3, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (2, 'Limão Siciliano (Citrus limon)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Cítrico cortante. Ideal com manjericão, alecrim, vetiver e néroli.', array['Fototóxico se prensado a frio (furocumarinas). Preferir destilado ou FCF e pedir laudo de bergapteno; entra no somatório do padrão IFRA de fototóxicos [V]']::text[], 3, false, 'verificar', null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (3, 'Limão Taiti (Limo)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Efervescente. Excelente com gengibre, hortelã, pimenta-rosa e acordes tropicais.', array['Fototóxico se prensado a frio (furocumarinas). Preferir destilado ou FCF e pedir laudo de bergapteno; entra no somatório do padrão IFRA de fototóxicos [V]. Alternativa segura: #11 (lima destilada)']::text[], 3, false, 'verificar', null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (4, 'Laranja Doce (Citrus sinensis)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Radiante e doce. Harmoniza com canela, cravo, baunilha, gerânio e olíbano.', '{}'::text[], 3, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (5, 'Mandarina / Tangerina', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Cítrico licoroso. Combina com cardamomo, flor de laranjeira, bálsamo de Tolu e sândalo.', array['Se for prensado a frio, pedir laudo de furocumarinas ao fornecedor [V]']::text[], 3, false, 'pedir-laudo', null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (6, 'Grapefruit (Toranja)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Cítrico amargo. Ideal com vetiver, cedro, pimenta-preta e gerânio.', array['Fototóxico se prensado a frio (furocumarinas). Preferir destilado ou FCF e pedir laudo de bergapteno; entra no somatório do padrão IFRA de fototóxicos [V]']::text[], 3, false, 'verificar', null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (7, 'Petitgrain (Folha de Laranjeira-Azeda)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Cítrica verde', 'frescos', null, 'Faceta verde/cítrica. Harmoniza com néroli, lavanda, alecrim e cedro.', '{}'::text[], 3, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (8, 'Yuzu', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Cítrico exótico. Perfeito com gengibre, sândalo, vetiver e pimenta-rosa.', array['Se for prensado a frio, pedir laudo de furocumarinas ao fornecedor [V]']::text[], 3, false, 'pedir-laudo', null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (9, 'Cidra (Cedrat)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Cítrico seco e elegante. Harmoniza com lavanda, tomilho e sândalo.', array['Se for prensado a frio, pedir laudo de furocumarinas ao fornecedor [V]']::text[], 3, false, 'pedir-laudo', null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (10, 'Laranja Azeda (Bigarade)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Cítrico denso e amargo. Ideal com gerânio, alecrim, néroli e noz-moscada.', array['Fototóxico se prensado a frio (furocumarinas). Preferir destilado ou FCF e pedir laudo de bergapteno; entra no somatório do padrão IFRA de fototóxicos [V]']::text[], 3, false, 'verificar', null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (11, 'Casca de Lima Destilada', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Límpida e fresca. Combina com hortelã, eucalipto, cardamomo e baunilha.', array['Destilação remove as furocumarinas: substituto seguro do #3 [I]']::text[], 3, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (12, 'Clementina', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Doce e alegre. Combina com rosa, baunilha, sândalo e ylang-ylang.', array['Se for prensado a frio, pedir laudo de furocumarinas ao fornecedor [V]']::text[], 3, false, 'pedir-laudo', null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (13, 'Verbena de Espanha', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Aromática cítrica', 'frescos', null, 'Herbal cítrico límpido. Excelente com alecrim, lavanda e cedro.', array['Identificar a espécie antes de usar. O óleo de verbena (Lippia citriodora) é proibido pela IFRA e pela UE; só o absoluto é permitido, com limite [P]. O nome ''verbena'' é usado para espécies diferentes [V]']::text[], 3, true, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (14, 'Litsea Cubeba (May Chang)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica', 'frescos', null, 'Cítrico intenso. Combina com ylang-ylang, bergamota, patchouli e gerânio.', array['Rico em citral, alergênico com limite IFRA [V]']::text[], 3, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (15, 'Capim-Limão (Lemongrass)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica herbal', 'frescos', null, 'Cortante e tônico. Mistura-se com gerânio, pimenta-preta, cedro e vetiver.', array['Rico em citral, alergênico com limite IFRA [V]']::text[], 4, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (16, 'Rosa Damascena (Óleo/Absoluto)', 'Coração', array['Coração']::text[], 'Floral', 'florais', null, 'Soberana e aveludada. Combina com jasmim, gerânio, patchouli, baunilha, açafrão e oud.', array['Contém metil eugenol, que limita a % de rosa na fórmula [M]', 'Absoluto de custo alto [I]']::text[], 4, false, null, null, false, true, false, true, false, false, null, false, 'manual-2026-11-02'),
  (17, 'Jasmim Grandiflorum / Sambac', 'Coração', array['Coração']::text[], 'Floral branca', 'florais', null, 'Floral branco denso. Harmoniza com rosa, ylang-ylang, baunilha, sândalo e almíscar.', array['Absoluto de custo alto [I]']::text[], 4, false, null, null, false, true, false, false, false, false, null, false, 'manual-2026-11-02'),
  (18, 'Lavanda Bourbon (L. angustifolia)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Aromática', 'frescos', 'florais', 'Aromático limpo. Base do acorde Fougère com bergamota, gerânio, coumarina e musgo.', '{}'::text[], 4, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (19, 'Gerânio Bourbon', 'Coração', array['Coração']::text[], 'Floral rosada', 'florais', null, 'Ponte floral/picante (rico em geraniol). Harmonizador entre cítricos e madeiras.', '{}'::text[], 4, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (20, 'Ylang-Ylang (Extra/Completo)', 'Coração', array['Coração']::text[], 'Floral branca', 'florais', null, 'Exótico e adocicado. Perfeito com baunilha, sândalo, néroli e bergamota.', array['Rico em alergênicos; verificar padrão IFRA para extratos de ylang [V]']::text[], 4, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (21, 'Néroli (Flor de Laranjeira Destilada)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Floral cítrica', 'florais', 'frescos', 'Floral cítrico radiante. Mistura-se com bergamota, lavanda, petitgrain e sândalo.', array['Custo alto [I]']::text[], 4, false, null, null, false, true, false, false, false, false, null, false, 'manual-2026-11-02'),
  (22, 'Absoluto de Flor de Laranjeira', 'Coração', array['Coração']::text[], 'Floral branca', 'florais', null, 'Meloso e opulento. Perfeito com mandarina, bálsamo de Tolu, baunilha e benjoim.', array['Custo alto [I]']::text[], 4, false, null, null, false, true, false, false, false, false, null, false, 'manual-2026-11-02'),
  (23, 'Rizoma de Íris (Orris)', 'Coração / Fundo', array['Coração', 'Fundo']::text[], 'Floral atalcada', 'florais', 'amadeirados', 'Textura polvilhada (powdery). Harmoniza com rosa, violeta, sândalo e vetiver.', array['Um dos insumos mais caros da perfumaria (manteiga/absoluto de íris) [I]']::text[], 4, false, null, null, false, true, false, false, false, false, null, false, 'manual-2026-11-02'),
  (24, 'Tuberosa (Absoluto)', 'Coração', array['Coração']::text[], 'Floral branca', 'florais', null, 'Floral branca carnal. Combina com jasmim, ylang-ylang, pimenta-rosa e baunilha.', array['Absoluto de custo alto [I]']::text[], 4, false, null, null, false, true, false, false, false, false, null, false, 'manual-2026-11-02'),
  (25, 'Camomila Romana', 'Coração', array['Coração']::text[], 'Aromática floral', 'frescos', 'florais', 'Floral herbal com maçã. Combina com lavanda, bergamota, gerânio e sândalo.', '{}'::text[], 4, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (26, 'Camomila Azul (Matricaria)', 'Coração', array['Coração']::text[], 'Aromática', 'frescos', null, 'Herbal doce e profundo. Ideal com cedro, lavanda, gerânio e olíbano.', '{}'::text[], 4, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (27, 'Sálvia Esclareia (Salvia sclarea)', 'Coração / Fundo', array['Coração', 'Fundo']::text[], 'Aromática ambarada', 'frescos', 'quentes', 'Herbal macia e ambarada. Combina com bergamota, lavanda, cedro e gerânio.', '{}'::text[], 4, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (28, 'Seringa (Mock Orange)', 'Coração', array['Coração']::text[], 'Floral', 'florais', null, 'Floral fresco primaveril. Mistura-se com limão siciliano, mandarina e gerânio.', array['Natural praticamente inexistente no mercado; costuma ser reconstruído com sintéticos [I]']::text[], 4, false, null, null, false, false, true, false, false, false, null, false, 'manual-2026-11-02'),
  (29, 'Frangipani (Jasmin-Manga)', 'Coração', array['Coração']::text[], 'Floral tropical', 'florais', null, 'Solar e tropical. Perfeita com ylang-ylang, baunilha, sândalo e coco.', array['Absoluto raro e caro [I]']::text[], 4, false, null, null, false, true, true, false, false, false, null, false, 'manual-2026-11-02'),
  (30, 'Lótus Rosa', 'Coração', array['Coração']::text[], 'Floral aquática', 'florais', 'frescos', 'Aquático e meditativo. Combina com bergamota, néroli, sândalo e olíbano.', array['Absoluto raro e caro [I]']::text[], 4, false, null, null, false, true, true, false, false, false, null, false, 'manual-2026-11-02'),
  (31, 'Osmanto (Osmanthus)', 'Coração', array['Coração']::text[], 'Floral frutada', 'florais', null, 'Floral com damasco e camurça. Mistura-se com vetiver, rosa, baunilha e patchouli.', array['Absoluto de custo muito alto [I]']::text[], 4, false, null, null, false, true, false, false, false, false, null, false, 'manual-2026-11-02'),
  (32, 'Borrônia (Boronia)', 'Coração', array['Coração']::text[], 'Floral frutada', 'florais', null, 'Frutada e amadeirada exótica. Combina com sândalo, bergamota e mimosa.', array['Absoluto raro [I]']::text[], 4, false, null, null, false, true, true, false, false, false, null, false, 'manual-2026-11-02'),
  (33, 'Mimosa (Absoluto)', 'Coração', array['Coração']::text[], 'Floral atalcada', 'florais', null, 'Macia e melosa. Perfeita com violeta, rosa, íris, baunilha e cedro.', array['Absoluto de custo alto [I]']::text[], 4, false, null, null, false, true, false, false, false, false, null, false, 'manual-2026-11-02'),
  (34, 'Folhas de Violeta (Absoluto)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Verde', 'frescos', null, 'Verde, folhosa e ozônica. Combina com íris, rosa, cedro e vetiver.', '{}'::text[], 4, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (35, 'Tagetes (Marigold)', 'Coração', array['Coração']::text[], 'Frutada herbal', 'frescos', null, 'Frutada e herbácea intensa. Harmoniza com tangerina, patchouli e cravo.', array['Restrito: T. minuta e T. patula até 0,01% em produtos que ficam na pele; T. erecta proibida. Fototóxico [P]']::text[], 4, true, 'confirmada', null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (36, 'Alecrim (Salvia rosmarinus)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Aromática', 'frescos', null, 'Tônico e revigorante. Mistura-se com limão, lavanda, cedro e hortelã.', '{}'::text[], 4, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (37, 'Hortelã-Pimenta (Mentha piperita)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Aromática mentolada', 'frescos', null, 'Menta gelada e expansiva. Combina com limão, eucalipto, bergamota e alecrim.', '{}'::text[], 4, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (38, 'Hortelã-Verde (Mentha spicata)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Aromática mentolada', 'frescos', null, 'Mentolado doce. Combina com mandarina, néroli, manjericão e baunilha.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (39, 'Eucalipto Glóbulos', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Aromática canforada', 'frescos', null, 'Cânforado aberto. Ideal com hortelã, alecrim, lavanda e pinho.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (40, 'Manjericão Linalol', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Aromática', 'frescos', null, 'Verde e picante-doce. Combina com bergamota, limão, gerânio e vetiver.', array['Confirmar quimiotipo linalol. O tipo metil chavicol é rico em estragol, de limite muito baixo [V]']::text[], 5, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (41, 'Tomilho (Timol/Linalol)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Aromática', 'frescos', null, 'Aromático quente. Perfeito com lavanda, alecrim, bergamota e cedro.', array['Preferir quimiotipo linalol; timol irrita em concentração alta [I]']::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (42, 'Sálvia Oficial', 'Coração', array['Coração']::text[], 'Aromática', 'frescos', null, 'Herbal seca. Combina com gerânio, lavanda, alecrim e pinho.', array['Contém tujona; verificar uso e cautelas [V]']::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (43, 'Manjerona', 'Coração', array['Coração']::text[], 'Aromática', 'frescos', null, 'Suave e condimentada. Combina com lavanda, bergamota, camomila e cedro.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (44, 'Erva-Doce / Funcho Doce', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Aromática anisada', 'frescos', null, 'Anetolado doce. Harmoniza com lavanda, rosa, néroli e cardamomo.', array['Contém estragol (limite IFRA muito baixo na 51ª emenda); pedir teor no laudo [V]']::text[], 5, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (45, 'Melaleuca (Tea Tree)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Aromática', 'frescos', null, 'Herbal purificante. Combina com lavanda, alecrim, eucalipto e limão.', array['Oxida com facilidade e passa a sensibilizar; armazenar bem [V]']::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (46, 'Eucalipto Citriodora', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica aromática', 'frescos', null, 'Cítrico-cânforado. Combina com gerânio, bergamota, alfazema e cedro.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (47, 'Palmarosa', 'Coração', array['Coração']::text[], 'Floral herbal', 'florais', 'frescos', 'Frescor herbal rosado. Combina com rosa, gerânio, bergamota e patchouli.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (48, 'Citronela', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Cítrica herbal', 'frescos', null, 'Cítrico-herbal vibrante. Combina com gerânio, bergamota, cedro e alecrim.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (49, 'Priprioca (Cyperus articulatus)', 'Coração / Fundo', array['Coração', 'Fundo']::text[], 'Amadeirada especiada', 'amadeirados', 'quentes', 'Raiz amadeirada especiada. Combina com patchouli, cedro e breu-branco.', array['Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]']::text[], 5, false, null, null, true, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (50, 'Estoraque (Folha/Casca)', 'Coração / Fundo', array['Coração', 'Fundo']::text[], 'Balsâmica', 'doces', 'quentes', 'Balsâmico e aromático. Combina com baunilha, sândalo e cisto-lábdano.', array['Identificar espécie e origem. Storax (Liquidambar) tem restrição IFRA [V]']::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (51, 'Louro (Laurus nobilis)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Aromática especiada', 'frescos', 'quentes', 'Picante e fresco. Combina com pimenta-preta, bergamota, lavanda e cedro.', array['Contém eugenol e metil eugenol; status IFRA do óleo de folha inconclusivo [V]']::text[], 5, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (52, 'Coentro (Sementes)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Especiada cítrica', 'quentes', 'frescos', 'Cítrico-especiado. Perfeito com bergamota, noz-moscada e flor de laranjeira.', array['Possível duplicidade com #68 (óleo de semente de coentro é destilado) [I]']::text[], 5, false, null, null, false, false, false, false, false, false, 68, false, 'manual-2026-11-02'),
  (53, 'Salsa (Sementes)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Aromática verde', 'frescos', null, 'Herbal verde seco. Combina com citrus, vetiver e lavanda.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (54, 'Murta (Myrtle)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Aromática', 'frescos', null, 'Resinoso-fresco limpo. Combina com bergamota, lavanda e alecrim.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (55, 'Estragão (Tarragon)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Aromática anisada', 'frescos', null, 'Verde e anisado. Mistura-se com lavanda, gerânio, bergamota e rosa.', array['Rico em estragol (cerca de 80%). O limite IFRA de estragol na 51ª emenda é muito baixo, o que praticamente inviabiliza o uso [P]']::text[], 5, false, null, null, false, false, false, true, true, false, null, false, 'manual-2026-11-02'),
  (56, 'Canela (Casca/Folha)', 'Coração / Fundo', array['Coração', 'Fundo']::text[], 'Especiada', 'quentes', 'doces', 'Quente e envolvente. Combina com laranja, baunilha, cravo, olíbano e sândalo.', array['Casca: cinamaldeído, sensibilizante forte com limite IFRA. Folha: rica em eugenol [V]']::text[], 5, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (57, 'Cravo-da-Índia (Eugenol)', 'Coração', array['Coração']::text[], 'Especiada', 'quentes', null, 'Picante marcante. Essencial em florais de cravo, rosa, gerânio e baunilha.', array['Eugenol (limite IFRA) e metil eugenol, citado no manual [M]']::text[], 5, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (58, 'Cardamomo', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Especiada fresca', 'quentes', 'frescos', 'Efervescente e aromático. Perfeito com mandarina, pimenta-preta, sândalo e vetiver.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (59, 'Pimenta-Preta', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Especiada', 'quentes', null, 'Seco e vibrante. Combina com vetiver, cedro, pimenta-rosa, bergamota e rosa.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (60, 'Pimenta-Rosa (Aroeira)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Especiada frutada', 'quentes', 'frescos', 'Fresca e frutada. Combina com rosa, bergamota, vetiver e patchouli.', '{}'::text[], 5, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (61, 'Noz-Moscada', 'Coração', array['Coração']::text[], 'Especiada', 'quentes', null, 'Amadeirada e picante. Combina com canela, cardamomo, cedro e gerânio.', array['Contém miristicina e traços de safrol; verificar limite [V]']::text[], 6, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (62, 'Gengibre', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Especiada fresca', 'quentes', 'frescos', 'Cítrico-picante efervescente. Combina com limão taiti, néroli, vetiver e baunilha.', array['Possível sobreposição com #63 [I]']::text[], 6, false, null, null, false, false, false, false, false, false, 63, false, 'manual-2026-11-02'),
  (63, 'Gengibre Fresco (Raiz)', 'Topo / Saída', array['Topo', 'Saída']::text[], 'Especiada fresca', 'frescos', 'quentes', 'Cortante e aquoso. Combina com bergamota, rosa e sândalo.', array['Possível sobreposição com #62 [I]']::text[], 6, false, null, null, false, false, false, false, false, false, 62, false, 'manual-2026-11-02'),
  (64, 'Açafrão (Saffron)', 'Coração / Fundo', array['Coração', 'Fundo']::text[], 'Especiada couro', 'quentes', null, 'Couro especiado dourado. Essencial com rosa, oud, sândalo e âmbar.', array['Natural raríssimo e caríssimo; quase sempre reconstruído (safranal e sintéticos) [I]']::text[], 6, false, null, null, false, true, true, false, false, false, null, false, 'manual-2026-11-02'),
  (65, 'Anis-Estrelado', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Especiada anisada', 'quentes', 'doces', 'Doce e licoroso. Combina com baunilha, rosa, laranja doce e cedro.', array['Anetol e estragol; verificar teor e limite [V]']::text[], 6, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (66, 'Cominho', 'Coração', array['Coração']::text[], 'Especiada', 'quentes', null, 'Picante e sensual. Combina com rosa, patchouli, cedro, vetiver e bergamota.', array['Fototóxico: padrão IFRA específico para óleo de cominho [P]']::text[], 6, false, 'confirmada', null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (67, 'Pimenta-da-Jamaica', 'Coração', array['Coração']::text[], 'Especiada', 'quentes', null, 'Fusão cravo/canela/noz-moscada. Combina com baunilha, laranja e patchouli.', array['Eugenol e metil eugenol; verificar limite [V]']::text[], 6, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (68, 'Semente de Coentro Destilada', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Especiada cítrica', 'quentes', 'frescos', 'Amadeirado-cítrico. Harmoniza com gerânio, bergamota e sândalo.', array['Possível duplicidade com #52 [I]']::text[], 6, false, null, null, false, false, false, false, false, false, 52, false, 'manual-2026-11-02'),
  (69, 'Baunilha de Madagascar (Extrato)', 'Fundo', array['Fundo']::text[], 'Gourmand balsâmica', 'doces', null, 'Cremosa e balsâmica. Perfeita com cacau, canela, cisto-lábdano e benzoin.', array['Extrato natural de custo alto [I]']::text[], 6, false, null, null, false, true, false, false, false, false, null, false, 'manual-2026-11-02'),
  (70, 'Cacau (Absoluto)', 'Fundo', array['Fundo']::text[], 'Gourmand', 'doces', null, 'Gourmand rico e amargo. Combina com baunilha, patchouli, rosa e café.', '{}'::text[], 6, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (71, 'Sândalo (Santalum album)', 'Fundo', array['Fundo']::text[], 'Amadeirada cremosa', 'amadeirados', null, 'Madeira cremosa e aveludada. Combina com rosa, jasmim, baunilha e bergamota.', array['Custo muito alto; verificar origem e sustentabilidade da espécie [V]']::text[], 6, false, null, null, false, true, false, false, false, false, null, false, 'manual-2026-11-02'),
  (72, 'Cedro da Virgínia / Atlas', 'Fundo', array['Fundo']::text[], 'Amadeirada seca', 'amadeirados', null, 'Madeira seca e balsâmica. Combina com vetiver, bergamota, lavanda e pimenta.', '{}'::text[], 6, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (73, 'Vetiver (Haiti / Java)', 'Fundo', array['Fundo']::text[], 'Amadeirada terrosa', 'amadeirados', null, 'Amadeirado seco, terroso e defumado. Excelente com grapefruit, pimenta e rosa.', '{}'::text[], 6, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (74, 'Patchouli (Pogostemon cablin)', 'Fundo', array['Fundo']::text[], 'Amadeirada terrosa', 'amadeirados', null, 'Terroso e escuro. Espinha dorsal do Chypre com rosa, bergamota e cisto-lábdano.', '{}'::text[], 6, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (75, 'Oud / Agarwood (Dehn al-Oud)', 'Fundo', array['Fundo']::text[], 'Amadeirada resinosa', 'amadeirados', 'quentes', 'Amadeirado resinoso animalic. Combina com rosa damascena, açafrão e âmbar.', array['CITES Apêndice II (Aquilaria, inclui o óleo): exige documentação de origem [P]', 'Custo extremo; na prática quase todo ''oud'' comercial é acorde reconstruído [I]']::text[], 6, false, null, 'confirmado', false, true, true, false, false, false, null, false, 'manual-2026-11-02'),
  (76, 'Pau-Rosa (Rosewood)', 'Coração / Fundo', array['Coração', 'Fundo']::text[], 'Amadeirada floral', 'amadeirados', 'florais', 'Amadeirado-floral macio. Combina com bergamota, gerânio, rosa e ylang.', array['CITES Apêndice II desde 2010, incluindo o óleo; espécie ameaçada [P]. Só com documentação de manejo autorizado, ou substituir (ex.: ho wood) [I]', 'Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]']::text[], 6, false, null, 'confirmado', true, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (77, 'Guaiaco (Pau-Santo)', 'Fundo', array['Fundo']::text[], 'Amadeirada defumada', 'amadeirados', 'quentes', 'Defumado e rosado. Combina com patchouli, vetiver, rosa e baunilha.', array['Identificar espécie: guaiaco (Bulnesia sarmientoi) não é o mesmo que palo santo (Bursera graveolens). Verificar CITES da Bulnesia [V]']::text[], 6, false, null, 'verificar', false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (78, 'Cipreste', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Amadeirada resinosa', 'amadeirados', 'frescos', 'Amadeirado resinoso fresco. Combina com bergamota, lavanda e cedro.', '{}'::text[], 6, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (79, 'Pinho Silvestre / Abeto', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Conífera', 'frescos', 'amadeirados', 'Frescor florestal verde. Combina com lavanda, alecrim e eucalipto.', '{}'::text[], 6, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (80, 'Zimbro (Juniper Berries)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Aromática amadeirada', 'frescos', 'amadeirados', 'Aromático e amadeirado. Combina com vetiver, bergamota e pimenta.', '{}'::text[], 6, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (81, 'Copaíba (Bálsamo)', 'Fundo', array['Fundo']::text[], 'Amadeirada balsâmica', 'amadeirados', null, 'Amadeirado suave e fixador. Combina com rosa, patchouli e cedro.', array['Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]']::text[], 6, false, null, null, true, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (82, 'Cabrúva', 'Fundo', array['Fundo']::text[], 'Amadeirada floral', 'amadeirados', null, 'Amadeirado-floral doce. Combina com ylang-ylang, gerânio e rosa.', array['Nome usual: cabreúva (Myrocarpus) [I]', 'Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]']::text[], 6, false, null, null, true, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (83, 'Candeia', 'Fundo', array['Fundo']::text[], 'Amadeirada', 'amadeirados', null, 'Amadeirada macia. Combina com lavanda, camomila e cedro.', array['Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]']::text[], 6, false, null, null, true, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (84, 'Semente de Ambreta', 'Fundo', array['Fundo']::text[], 'Almiscarada', 'transversal', 'florais', 'Almiscarado vegetal. Combina com íris, rosa, sândalo e vetiver.', array['Não confundir com ''musk ambrette'', almíscar sintético proibido [I]']::text[], 7, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (85, 'Cálamo (Acorus calamus)', 'Coração / Fundo', array['Coração', 'Fundo']::text[], 'Amadeirada especiada', 'amadeirados', 'quentes', 'Amadeirado especiado exótico. Combina com patchouli, canela e cedro.', array['Asarona (carcinogênica): limite de 0,01% no produto final segundo fontes secundárias; óleos ricos em beta-asarona ficam praticamente inviáveis [V]']::text[], 7, false, null, null, false, false, false, true, true, false, null, false, 'manual-2026-11-02'),
  (86, 'Olíbano (Frankincense)', 'Fundo', array['Fundo']::text[], 'Resinosa (incenso)', 'quentes', null, 'Resinoso cítrico-defumado. Combina com mirra, bergamota, rosa e cedro.', '{}'::text[], 7, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (87, 'Mirra (Commiphora myrrha)', 'Fundo', array['Fundo']::text[], 'Resinosa balsâmica', 'quentes', null, 'Balsâmica e quente. Combina com olíbano, baunilha, rosa e patchouli.', '{}'::text[], 7, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (88, 'Benjoim de Sião (Styrax)', 'Fundo', array['Fundo']::text[], 'Balsâmica', 'doces', null, 'Balsâmico abaunilhado. Combina com baunilha, flor de laranjeira e rosa.', array['Benjoim de Sião é Styrax tonkinensis; não confundir com storax (Liquidambar) [I]']::text[], 7, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (89, 'Cisto-Lábdano (Labdanum)', 'Fundo', array['Fundo']::text[], 'Âmbar', 'quentes', 'doces', 'Ambarado e denso. Pilar dos acordes Âmbar e Chypre com baunilha.', '{}'::text[], 7, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (90, 'Bálsamo do Peru', 'Fundo', array['Fundo']::text[], 'Balsâmica', 'doces', null, 'Resinoso abaunilhado/canela. Combina com flor de laranjeira e mandarina.', array['Forma bruta PROIBIDA pela IFRA (STD 071). Só óleo, absoluto ou anidrol, com limite por categoria [P]']::text[], 7, true, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (91, 'Bálsamo de Tolu', 'Fundo', array['Fundo']::text[], 'Balsâmica', 'doces', null, 'Caloroso e doce. Combina com rosa, baunilha, cisto-lábdano e noz-moscada.', '{}'::text[], 7, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (92, 'Elemi', 'Topo / Fundo', array['Topo', 'Fundo']::text[], 'Resinosa cítrica', 'quentes', 'frescos', 'Resinoso limão-apimentado. Combina com olíbano, pimenta-preta e vetiver.', '{}'::text[], 7, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (93, 'Breu-Branco', 'Topo / Fundo', array['Topo', 'Fundo']::text[], 'Resinosa fresca', 'quentes', 'frescos', 'Resinoso fresco aromático. Combina com pimenta-rosa, priprioca e cedro.', array['Espécie nativa: Lei 13.123/2015 (SisGen e possível repartição de benefícios de 1% da receita líquida) [P]']::text[], 7, false, null, null, true, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (94, 'Café (Absoluto)', 'Fundo', array['Fundo']::text[], 'Gourmand', 'doces', null, 'Torrado e amargo. Combina com baunilha, cacau, cardamomo e patchouli.', '{}'::text[], 7, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (95, 'Fava-Tonca (Coumarina)', 'Fundo', array['Fundo']::text[], 'Gourmand cumarínica', 'doces', null, 'Amendoado e feno doce. Pilar do Fougère com lavanda e bergamota.', array['Cumarina: limite de 1,5% no produto final, Categoria 4 (49ª emenda; confirmar na vigente) [P]']::text[], 7, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (96, 'Musgo de Carvalho (Oakmoss)', 'Fundo', array['Fundo']::text[], 'Musgosa (chypre)', 'amadeirados', null, 'Terroso e florestal. Pilar do Chypre e Fougère com bergamota e lavanda.', array['Atranol e cloroatranol proibidos na UE desde 2019/2021 (Reg. 2017/1410). Usar só extrato de baixo atranol, dentro do limite IFRA [P]']::text[], 7, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (97, 'Cassis / Groselha-Preta', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Frutada', 'frescos', 'florais', 'Frutado verde e ácido. Combina com rosa, bergamota e jasmim.', '{}'::text[], 7, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (98, 'Feno Cortado (Absoluto)', 'Coração / Fundo', array['Coração', 'Fundo']::text[], 'Aromática cumarínica', 'frescos', 'doces', 'Herbáceo doce. Combina com lavanda, sálvia esclareia e fava-tonca.', array['Contém cumarina: soma no limite da cumarina [I]']::text[], 7, false, null, null, false, false, false, true, false, false, null, false, 'manual-2026-11-02'),
  (99, 'Extrato de Cachaça (Cana)', 'Topo / Coração', array['Topo', 'Coração']::text[], 'Gourmand', 'doces', 'frescos', 'Alcoólico vegetal doce. Combina com limão taiti, baunilha e gengibre.', '{}'::text[], 7, false, null, null, false, false, false, false, false, false, null, false, 'manual-2026-11-02'),
  (100, 'Acorde Couro (Bétula/Labdanum)', 'Fundo', array['Fundo']::text[], 'Couro', 'quentes', null, 'Defumado e camurça. Harmoniza com açafrão, rosa, oud e patchouli.', array['Não é matéria-prima: é um acorde [M]. Bétula bruta PROIBIDA pela IFRA (STD 114); só a retificada, com limite de PAH [P]']::text[], 7, true, null, null, false, false, false, false, false, true, null, false, 'manual-2026-11-02')
on conflict (n) do update set
  nome = excluded.nome,
  camada_manual = excluded.camada_manual,
  camadas = excluded.camadas,
  familia = excluded.familia,
  grupo = excluded.grupo,
  grupo_secundario = excluded.grupo_secundario,
  descricao_manual = excluded.descricao_manual,
  alertas = excluded.alertas,
  pagina = excluded.pagina,
  proibida_forma = excluded.proibida_forma,
  fototoxica = excluded.fototoxica,
  cites = excluded.cites,
  nativa_br = excluded.nativa_br,
  custo_alto = excluded.custo_alto,
  disponibilidade_rara = excluded.disponibilidade_rara,
  limite_uso = excluded.limite_uso,
  praticamente_inviavel = excluded.praticamente_inviavel,
  eh_acorde = excluded.eh_acorde,
  duplicidade_com = excluded.duplicidade_com,
  sintetica = excluded.sintetica,
  versao_catalogo = excluded.versao_catalogo;

-- Banco 06 · Modalidades (MODALIDADES em referencias.ts). Preço a confirmar; um preço
-- já confirmado no banco não é sobrescrito.
insert into modalidades (codigo, nome, preco, moeda, condicao, status_preco, ordem) values
  ('essencial', 'Essencial', 180, 'BRL', 'Formulação de entrada, com matérias-primas sintéticas.', 'a_confirmar', 1),
  ('atelier', 'Atelier', 600, 'BRL', 'Formulação premium, com predominância de naturais.', 'a_confirmar', 2),
  ('atelier-compartilhavel', 'Atelier compartilhável', 420, 'BRL', 'Atelier com autorização para inspirar coleções futuras.', 'a_confirmar', 3),
  ('atelier-exclusivo', 'Atelier exclusivo', 745, 'BRL', 'Atelier com exclusividade da fórmula por 3 anos.', 'a_confirmar', 4)
on conflict (codigo) do update set
  nome = excluded.nome,
  condicao = excluded.condicao,
  ordem = excluded.ordem,
  moeda = excluded.moeda,
  preco = case when modalidades.status_preco = 'a_confirmar' then excluded.preco else modalidades.preco end;

-- Banco 08 · Texto de consentimento (TEXTO_CONSENTIMENTO em armazenamento.ts). Só inclusão.
insert into textos_consentimento (tipo, versao, texto) values
  ('uso_respostas_criacao', 'c1-2026-11', 'Autorizo a ICARUS a usar minhas respostas, inclusive as informações pessoais e de saúde que escolhi informar, para criar a minha fragrância. Posso pedir a exclusão dos meus dados quando quiser.')
on conflict (tipo, versao) do nothing;

-- Conferência: a transação inteira é desfeita se alguma contagem não bater.
-- Questionário, traços, regras e matérias-primas desta versão: contagem exata (uma
-- opção a mais no banco do que no TS indica código renomeado ou removido, o que
-- pede versão nova do questionário). Catálogos abertos: no mínimo o que veio do TS.
do $$
declare
  exatos constant jsonb := '{"capitulos":10,"perguntas":52,"opcoes":123,"tracos":12,"regras":21,"materias":100}'::jsonb;
  minimos constant jsonb := '{"grupos":6,"concentracoes":5,"lacunas":8,"modalidades":4}'::jsonb;
  achado jsonb;
  item record;
begin
  select jsonb_build_object(
    'capitulos', (select count(*) from capitulos where questionario_versao = 'v1-52'),
    'perguntas', (select count(*) from perguntas where questionario_versao = 'v1-52'),
    'opcoes', (select count(*) from opcoes where questionario_versao = 'v1-52'),
    'tracos', (select count(*) from tracos where versao_motor = 'motor-v0.1'),
    'regras', (select count(*) from regras_traducao where versao = 'regras-v0.1'),
    'materias', (select count(*) from materias_primas where versao_catalogo = 'manual-2026-11-02'),
    'grupos', (select count(*) from grupos_olfativos),
    'concentracoes', (select count(*) from concentracoes),
    'lacunas', (select count(*) from lacunas_naturais),
    'modalidades', (select count(*) from modalidades)
  ) into achado;
  for item in select key, value from jsonb_each(exatos) loop
    if (achado ->> item.key)::int <> item.value::text::int then
      raise exception 'Seed: % tem % linhas, esperado exatamente %', item.key, achado ->> item.key, item.value;
    end if;
  end loop;
  for item in select key, value from jsonb_each(minimos) loop
    if (achado ->> item.key)::int < item.value::text::int then
      raise exception 'Seed: % tem % linhas, esperado no mínimo %', item.key, achado ->> item.key, item.value;
    end if;
  end loop;
end
$$;

