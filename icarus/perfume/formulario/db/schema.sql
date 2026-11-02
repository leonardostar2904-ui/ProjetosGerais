-- =============================================================================
-- ICARUS · Vertical de perfume · Esquema do banco de dados
--
-- PostgreSQL 15 ou superior, compatível com Supabase (colar no SQL Editor e rodar).
-- Versão do esquema: 1 (a mesma VERSAO_ESQUEMA de lib/armazenamento.ts).
--
-- Organização: um único schema (public) com 8 bancos lógicos. O banco de cada
-- tabela abre o comentário dela ("Banco 01 · Consumidores. ..."). Os nomes das
-- tabelas e colunas são os mesmos dos tipos TypeScript, em snake_case
-- (perguntaId vira pergunta_id), para que trocar o localStorage pelo banco seja
-- mecânico. Ver db/README.md.
--
--   01 Consumidores ............... quem responde, questionário e respostas
--   02 Psicologia e comportamento . traços P001 a P012 e regras R01 a R21
--   03 Inteligência olfativa ...... grupos, concentrações, acordes, afinidades
--   04 Matérias-primas ............ catálogo, fornecedores, lotes, IFRA, veículos
--   05 Formulações ................ fórmulas versionadas e componentes
--   06 Inteligência comercial ..... modalidades, pedidos, pagamentos, direitos
--   07 Aprendizado ................ avaliações de 7 e 30 dias
--   08 Governança ................. consentimentos e logs
--
-- A seção do Banco 03 vem em duas partes: os catálogos simples antes do Banco 04
-- e as tabelas que apontam para materias_primas depois dele.
--
-- Idempotente: pode rodar de novo sem erro (create ... if not exists,
-- create or replace). Mudar uma tabela que já existe pede migração (alter table),
-- não reexecução deste arquivo.
--
-- Convenções:
-- - Enumerações são check constraints (mais fáceis de evoluir que enum types).
-- - Tabelas espelhadas do TypeScript usam id texto com prefixo (cons_, sess_),
--   gerado pelo app como hoje. As tabelas novas usam uuid.
-- - Massa em gramas e percentuais em % de massa (regra do manual, seção 1).
-- - Valores em reais (BRL) com numeric, nunca float.
-- - Row Level Security ligado em todas as tabelas (seção 9).
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 0. Funções utilitárias
-- -----------------------------------------------------------------------------

create or replace function usuario_atual() returns text
language sql stable
set search_path = public, pg_temp
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub',
    session_user::text
  )
$$;

comment on function usuario_atual() is
  'Quem está agindo: o "sub" do JWT quando a chamada vem da API do Supabase (PostgREST); fora dela, o usuário da conexão.';

create or replace function papel_atual() returns text
language sql stable
set search_path = public, pg_temp
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
    session_user::text
  )
$$;

comment on function papel_atual() is
  'Papel de quem está agindo: o "role" do JWT na API do Supabase; fora dela, o usuário da conexão.';

create or replace function impedir_alteracao() returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  raise exception '% em % não é permitido: a tabela só aceita inclusão.', tg_op, tg_table_name
    using errcode = 'check_violation';
end
$$;

comment on function impedir_alteracao() is
  'Gatilho para tabelas só de inclusão (textos de consentimento e log de acesso a dados sensíveis).';


-- =============================================================================
-- BANCO 01 · CONSUMIDORES
-- =============================================================================

create table if not exists contas (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid unique,
  status        text not null default 'ativa',
  criada_em     timestamptz not null default now(),
  encerrada_em  timestamptz,
  constraint contas_status check (status in ('ativa', 'encerrada')),
  constraint contas_encerramento check ((status = 'encerrada') = (encerrada_em is not null))
);

comment on table contas is
  'Banco 01 · Consumidores. Conta de login (futuro). Credenciais e e-mail de login ficam no provedor de autenticação (Supabase Auth); aqui só o vínculo. Um consumidor anônimo passa a ter conta quando faz login.';
comment on column contas.auth_user_id is
  'Id do usuário no Supabase Auth. No Supabase, ligar com: alter table contas add foreign key (auth_user_id) references auth.users (id) on delete set null.';

create table if not exists consumidores (
  id         text primary key default ('cons_' || gen_random_uuid()::text),
  conta_id   uuid references contas (id) on delete set null,
  criado_em  timestamptz not null default now(),
  constraint consumidores_id_formato check (id ~ '^cons_[A-Za-z0-9-]+$')
);

create index if not exists consumidores_conta_idx on consumidores (conta_id);

comment on table consumidores is
  'Banco 01 · Consumidores. Pessoa anônima que responde o questionário (TS: Banco.consumidores). Não guarda nome nem contato: isso fica em consumidores_contato, fora do alcance da IA.';
comment on column consumidores.id is 'TS: id gerado por novoId("cons"), formato cons_<uuid>.';
comment on column consumidores.criado_em is 'TS: criadoEm.';

create table if not exists consumidores_contato (
  consumidor_id  text primary key references consumidores (id) on delete cascade,
  nome           text not null,
  email          text,
  telefone       text,
  atualizado_em  timestamptz not null default now(),
  constraint consumidores_contato_nome check (btrim(nome) <> ''),
  constraint consumidores_contato_email check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint consumidores_contato_telefone check (telefone is null or telefone ~ '^\+?[0-9 ()-]{8,20}$')
);

create index if not exists consumidores_contato_email_idx
  on consumidores_contato (lower(email)) where email is not null;

comment on table consumidores_contato is
  'Banco 01 · Consumidores. Nome, e-mail e telefone (TS: Banco.contato; a pergunta q02 grava aqui). Separado das respostas que a IA lê. Acesso restrito por RLS: só o servidor (service_role) ou a função ler_contato, que registra o acesso.';
comment on column consumidores_contato.nome is 'TS: contato.nome (resposta da q02, "Como podemos te chamar?").';
comment on column consumidores_contato.atualizado_em is 'TS: contato.atualizadoEm.';

create table if not exists questionarios (
  versao             text primary key,
  total_capitulos    smallint not null,
  total_perguntas    smallint not null,
  minutos_estimados  smallint,
  status             text not null default 'rascunho',
  criado_em          timestamptz not null default now(),
  constraint questionarios_versao_formato check (versao ~ '^v[0-9]+'),
  constraint questionarios_totais check (total_capitulos > 0 and total_perguntas > 0),
  constraint questionarios_minutos check (minutos_estimados is null or minutos_estimados > 0),
  constraint questionarios_status check (status in ('rascunho', 'ativo', 'arquivado'))
);

create unique index if not exists questionarios_um_ativo_idx
  on questionarios (status) where status = 'ativo';

comment on table questionarios is
  'Banco 01 · Consumidores. Versões do questionário (TS: VERSAO_QUESTIONARIO, hoje v1-52). Só uma versão ativa por vez; cada sessão guarda a versão que respondeu.';
comment on column questionarios.minutos_estimados is 'TS: MINUTOS_ESTIMADOS (capitulos.ts).';

create table if not exists capitulos (
  questionario_versao  text not null references questionarios (versao) on delete cascade,
  numero               smallint not null,
  id                   text not null,
  nome                 text not null,
  titulo               text not null,
  titulo_italico       text,
  descricao            text not null,
  arte                 text not null,
  acento               text not null,
  grupos               jsonb,
  primary key (questionario_versao, numero),
  constraint capitulos_id_unico unique (questionario_versao, id),
  constraint capitulos_numero check (numero > 0),
  constraint capitulos_id_formato check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint capitulos_arte check (arte in ('abertura', 'rotina', 'essencia', 'conexoes', 'memorias',
                                             'presenca', 'cuidados', 'pele', 'criacao', 'final')),
  constraint capitulos_acento check (acento in ('mar', 'aurora')),
  constraint capitulos_grupos check (grupos is null or jsonb_typeof(grupos) = 'array')
);

comment on table capitulos is
  'Banco 01 · Consumidores. As 10 etapas do questionário por versão (TS: capitulos.ts). A lista de perguntas de cada capítulo sai de perguntas.capitulo.';
comment on column capitulos.grupos is 'TS: Capitulo.grupos, lista [{id, rotulo}] (só o capítulo 8 usa: A, B, C).';
comment on column capitulos.titulo_italico is 'TS: tituloItalico.';

create table if not exists perguntas (
  questionario_versao   text not null,
  id                    text not null,
  numero                smallint not null,
  capitulo              smallint not null,
  enunciado             text not null,
  ajuda                 text,
  tipo                  text not null,
  obrigatoria           boolean not null,
  sensivel              text,
  destino               text not null,
  condicao              jsonb,
  condicao_pergunta_id  text generated always as (condicao ->> 'pergunta') stored,
  max_selecoes          smallint,
  escala_min            text,
  escala_max            text,
  placeholder           text,
  variante              text,
  grupo                 text,
  pilar                 text,
  primary key (questionario_versao, id),
  constraint perguntas_numero_unico unique (questionario_versao, numero),
  constraint perguntas_capitulo_fk foreign key (questionario_versao, capitulo)
    references capitulos (questionario_versao, numero) on delete cascade,
  constraint perguntas_condicao_fk foreign key (questionario_versao, condicao_pergunta_id)
    references perguntas (questionario_versao, id),
  constraint perguntas_id_numero check (
    id = 'q' || case when numero < 10 then '0' else '' end || numero::text),
  constraint perguntas_tipo check (tipo in ('texto-curto', 'tres-palavras', 'texto-longo',
                                            'escolha-unica', 'escolha-multipla', 'escala')),
  constraint perguntas_sensivel check (sensivel in ('pessoal', 'saude')),
  constraint perguntas_destino check (destino in ('respostas', 'dados_sensiveis', 'contato')),
  constraint perguntas_sensivel_destino check ((sensivel is not null) = (destino = 'dados_sensiveis')),
  constraint perguntas_sensivel_opcional check (destino <> 'dados_sensiveis' or not obrigatoria),
  constraint perguntas_max_selecoes check (
    (max_selecoes is not null) = (tipo = 'escolha-multipla') and (max_selecoes is null or max_selecoes > 0)),
  constraint perguntas_escala check ((tipo = 'escala') = (escala_min is not null and escala_max is not null)),
  constraint perguntas_condicao check (condicao is null or (
    jsonb_typeof(condicao) = 'object'
    and jsonb_typeof(condicao -> 'pergunta') = 'string'
    and (condicao ? 'em') <> (condicao ? 'naoEm')
    and jsonb_typeof(coalesce(condicao -> 'em', condicao -> 'naoEm')) = 'array')),
  constraint perguntas_variante check (variante in ('padrao', 'cartoes-descricao', 'familias', 'clima',
                                                    'estacoes', 'bebidas', 'investimento', 'reproducao',
                                                    'projecao', 'rotina', 'final'))
);

comment on table perguntas is
  'Banco 01 · Consumidores. As 52 perguntas da versão v1-52 (TS: perguntas.ts, tipo Pergunta). O id (q01 a q52) é chave estável: não renomear depois que houver respostas reais. O destino diz em que tabela a resposta é gravada.';
comment on column perguntas.destino is 'TS: Destino. respostas (IA lê), dados_sensiveis (restrita) ou contato (consumidores_contato).';
comment on column perguntas.sensivel is 'TS: Sensibilidade (pessoal ou saude). Toda pergunta sensível vai para dados_sensiveis e é opcional.';
comment on column perguntas.condicao is 'TS: Condicao, guardada como no TS: {"pergunta": "q31", "em": [...]} ou {"pergunta": "q04", "naoEm": [...]}.';
comment on column perguntas.condicao_pergunta_id is 'Calculada a partir de condicao; garante por chave estrangeira que a pergunta da condição existe.';
comment on column perguntas.max_selecoes is 'TS: maxSelecoes. Só para escolha-multipla.';
comment on column perguntas.escala_min is 'TS: escala.min, rótulo do ponto 1 da escala de 1 a 5.';
comment on column perguntas.escala_max is 'TS: escala.max, rótulo do ponto 5 da escala de 1 a 5.';
comment on column perguntas.pilar is 'TS: pilar. Uso interno do motor (capítulo 10); não aparece para o cliente.';

create table if not exists opcoes (
  questionario_versao  text not null,
  pergunta_id          text not null,
  valor                text not null,
  ordem                smallint not null,
  rotulo               text not null,
  descricao            text,
  exclusiva            boolean not null default false,
  imagem               text,
  imagem_alt           text,
  primary key (questionario_versao, pergunta_id, valor),
  constraint opcoes_ordem_unica unique (questionario_versao, pergunta_id, ordem) deferrable initially deferred,
  constraint opcoes_pergunta_fk foreign key (questionario_versao, pergunta_id)
    references perguntas (questionario_versao, id) on delete cascade,
  constraint opcoes_valor_formato check (valor ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint opcoes_ordem check (ordem > 0),
  constraint opcoes_imagem_alt check (imagem is null or imagem_alt is not null)
);

comment on table opcoes is
  'Banco 01 · Consumidores. Opções das perguntas de escolha (TS: Opcao). "valor" é o código estável que as respostas e o motor usam; o rótulo pode mudar, o código não.';
comment on column opcoes.valor is 'TS: Opcao.valor. Código estável (ex.: florais, nao-informar).';
comment on column opcoes.exclusiva is 'TS: Opcao.exclusiva. Marcar esta opção desmarca as outras (ex.: "Nenhum" na q34).';
comment on column opcoes.imagem_alt is 'TS: Opcao.imagemAlt.';

create table if not exists sessoes (
  id                    text primary key default ('sess_' || gen_random_uuid()::text),
  consumidor_id         text not null references consumidores (id) on delete cascade,
  questionario_versao   text not null references questionarios (versao),
  status                text not null default 'em_andamento',
  iniciada_em           timestamptz not null default now(),
  concluida_em          timestamptz,
  capitulo_atual        smallint not null default 1,
  capitulos_concluidos  smallint[] not null default '{}',
  constraint sessoes_id_formato check (id ~ '^sess_[A-Za-z0-9-]+$'),
  constraint sessoes_status check (status in ('em_andamento', 'concluida')),
  constraint sessoes_conclusao check ((status = 'concluida') = (concluida_em is not null)),
  constraint sessoes_datas check (concluida_em is null or concluida_em >= iniciada_em),
  constraint sessoes_capitulo_fk foreign key (questionario_versao, capitulo_atual)
    references capitulos (questionario_versao, numero),
  constraint sessoes_id_versao_unico unique (id, questionario_versao),
  constraint sessoes_id_consumidor_unico unique (id, consumidor_id)
);

create index if not exists sessoes_consumidor_idx on sessoes (consumidor_id, iniciada_em desc);
create index if not exists sessoes_status_idx on sessoes (status, iniciada_em desc);

comment on table sessoes is
  'Banco 01 · Consumidores. Cada vez que alguém responde o questionário (TS: Sessao). Guarda a versão respondida e o capítulo atual. As chaves únicas compostas existem para que respostas, fórmulas e consentimentos provem que pertencem à mesma sessão, versão e consumidor.';
comment on column sessoes.questionario_versao is 'TS: questionarioVersao.';
comment on column sessoes.iniciada_em is 'TS: iniciadaEm.';
comment on column sessoes.concluida_em is 'TS: concluidaEm.';
comment on column sessoes.capitulo_atual is 'TS: capituloAtual.';
comment on column sessoes.capitulos_concluidos is 'TS: capitulosConcluidos.';

create table if not exists respostas (
  sessao_id            text not null,
  pergunta_id          text not null,
  questionario_versao  text not null,
  status               text not null,
  valor                jsonb,
  opcoes_escolhidas    text[],
  atualizada_em        timestamptz not null default now(),
  primary key (sessao_id, pergunta_id),
  constraint respostas_sessao_fk foreign key (sessao_id, questionario_versao)
    references sessoes (id, questionario_versao) on delete cascade,
  constraint respostas_pergunta_fk foreign key (questionario_versao, pergunta_id)
    references perguntas (questionario_versao, id),
  constraint respostas_status check (status in ('respondida', 'pulada')),
  constraint respostas_status_valor check ((status = 'respondida') = (valor is not null)),
  constraint respostas_valor_tipo check (valor is null or jsonb_typeof(valor) in ('string', 'number', 'array'))
);

create index if not exists respostas_pergunta_idx on respostas (questionario_versao, pergunta_id);
create index if not exists respostas_opcoes_idx on respostas using gin (opcoes_escolhidas);

comment on table respostas is
  'Banco 01 · Consumidores. Uma linha por pergunta respondida ou pulada (TS: RegistroResposta em Banco.respostas[sessao][pergunta]). Só perguntas com destino "respostas": é o que a IA lê. O gatilho validar_resposta confere tipo, códigos de opção e limite de seleções contra o catálogo.';
comment on column respostas.questionario_versao is 'Versão do questionário da sessão. Se vier vazia, o gatilho copia da sessão.';
comment on column respostas.status is 'TS: StatusResposta. "pulada" só para opcionais deixadas em branco (marcarPuladas).';
comment on column respostas.valor is 'TS: RegistroResposta.valor (Valor | null): texto, número da escala de 1 a 5, código de opção ou lista de códigos, como o app grava hoje.';
comment on column respostas.opcoes_escolhidas is 'Códigos das opções escolhidas (escolha única ou múltipla). Preenchida pelo gatilho a partir de "valor", para consulta e índice; não gravar direto.';
comment on column respostas.atualizada_em is 'TS: atualizadaEm.';

create table if not exists dados_sensiveis (
  sessao_id            text not null,
  pergunta_id          text not null,
  questionario_versao  text not null,
  status               text not null,
  valor                jsonb,
  opcoes_escolhidas    text[],
  atualizada_em        timestamptz not null default now(),
  primary key (sessao_id, pergunta_id),
  constraint dados_sensiveis_sessao_fk foreign key (sessao_id, questionario_versao)
    references sessoes (id, questionario_versao) on delete cascade,
  constraint dados_sensiveis_pergunta_fk foreign key (questionario_versao, pergunta_id)
    references perguntas (questionario_versao, id),
  constraint dados_sensiveis_status check (status in ('respondida', 'pulada')),
  constraint dados_sensiveis_status_valor check ((status = 'respondida') = (valor is not null)),
  constraint dados_sensiveis_valor_tipo check (valor is null or jsonb_typeof(valor) in ('string', 'number', 'array'))
);

create index if not exists dados_sensiveis_pergunta_idx on dados_sensiveis (questionario_versao, pergunta_id);

comment on table dados_sensiveis is
  'Banco 01 · Consumidores. Mesmo formato de respostas, só para perguntas com destino "dados_sensiveis": sexo, gênero, momento afetivo, alergias, restrições éticas, gestação e saúde (TS: Banco.dadosSensiveis). Acesso restrito por RLS: só o servidor (service_role) ou a função ler_dados_sensiveis, que registra cada leitura em log_acesso_sensivel.';

create or replace function validar_resposta() returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  p              record;
  destino_tabela text := case tg_table_name when 'dados_sensiveis' then 'dados_sensiveis' else 'respostas' end;
  escolhidas     text[];
  invalidas      text[];
begin
  if new.questionario_versao is null then
    select s.questionario_versao into new.questionario_versao from sessoes s where s.id = new.sessao_id;
    if new.questionario_versao is null then
      raise exception 'Sessão % não encontrada (ou sem permissão de leitura) ao gravar a pergunta %', new.sessao_id, new.pergunta_id
        using errcode = 'foreign_key_violation';
    end if;
  end if;

  select q.tipo, q.destino, q.obrigatoria, q.max_selecoes
    into p
    from perguntas q
   where q.questionario_versao = new.questionario_versao and q.id = new.pergunta_id;
  if not found then
    raise exception 'A pergunta % não existe na versão % do questionário', new.pergunta_id, new.questionario_versao
      using errcode = 'foreign_key_violation';
  end if;

  if p.destino <> destino_tabela then
    raise exception 'A pergunta % tem destino "%" e não pode ser gravada em %', new.pergunta_id, p.destino, tg_table_name
      using errcode = 'check_violation';
  end if;

  new.opcoes_escolhidas := null;

  if new.valor is null then
    if p.obrigatoria then
      raise exception 'A pergunta % é obrigatória e não pode ficar como pulada', new.pergunta_id
        using errcode = 'check_violation';
    end if;
    return new;
  end if;

  if p.tipo in ('texto-curto', 'texto-longo') then
    if jsonb_typeof(new.valor) <> 'string' or btrim(new.valor #>> '{}') = '' then
      raise exception 'A pergunta % (%) espera um texto não vazio', new.pergunta_id, p.tipo
        using errcode = 'check_violation';
    end if;

  elsif p.tipo = 'tres-palavras' then
    if jsonb_typeof(new.valor) <> 'array'
       or jsonb_array_length(new.valor) > 3
       or exists (select 1 from jsonb_array_elements(new.valor) e where jsonb_typeof(e) <> 'string')
       or not exists (select 1 from jsonb_array_elements_text(new.valor) e where btrim(e) <> '') then
      raise exception 'A pergunta % espera até 3 palavras, com pelo menos uma preenchida', new.pergunta_id
        using errcode = 'check_violation';
    end if;

  elsif p.tipo = 'escala' then
    if jsonb_typeof(new.valor) <> 'number' or (new.valor #>> '{}')::numeric not between 1 and 5 then
      raise exception 'A pergunta % espera um número de 1 a 5', new.pergunta_id
        using errcode = 'check_violation';
    end if;

  else
    if p.tipo = 'escolha-unica' then
      if jsonb_typeof(new.valor) <> 'string' then
        raise exception 'A pergunta % espera um único código de opção', new.pergunta_id
          using errcode = 'check_violation';
      end if;
      escolhidas := array[new.valor #>> '{}'];
    else
      if jsonb_typeof(new.valor) <> 'array'
         or jsonb_array_length(new.valor) = 0
         or exists (select 1 from jsonb_array_elements(new.valor) e where jsonb_typeof(e) <> 'string') then
        raise exception 'A pergunta % espera uma lista de códigos de opção', new.pergunta_id
          using errcode = 'check_violation';
      end if;
      escolhidas := array(select jsonb_array_elements_text(new.valor));
      if cardinality(escolhidas) > p.max_selecoes then
        raise exception 'A pergunta % aceita até % opções (recebeu %)', new.pergunta_id, p.max_selecoes, cardinality(escolhidas)
          using errcode = 'check_violation';
      end if;
      if cardinality(escolhidas) <> (select count(distinct x) from unnest(escolhidas) x) then
        raise exception 'A pergunta % recebeu opções repetidas', new.pergunta_id
          using errcode = 'check_violation';
      end if;
    end if;

    select array_agg(x order by x) into invalidas
      from unnest(escolhidas) x
     where not exists (select 1 from opcoes o
                        where o.questionario_versao = new.questionario_versao
                          and o.pergunta_id = new.pergunta_id
                          and o.valor = x);
    if invalidas is not null then
      raise exception 'Código de opção inválido na pergunta %: %', new.pergunta_id, array_to_string(invalidas, ', ')
        using errcode = 'check_violation';
    end if;

    if cardinality(escolhidas) > 1 and exists (
         select 1 from opcoes o
          where o.questionario_versao = new.questionario_versao
            and o.pergunta_id = new.pergunta_id
            and o.exclusiva
            and o.valor = any (escolhidas)) then
      raise exception 'Na pergunta %, a opção exclusiva não pode ser combinada com outras', new.pergunta_id
        using errcode = 'check_violation';
    end if;

    new.opcoes_escolhidas := escolhidas;
  end if;

  return new;
end
$$;

comment on function validar_resposta() is
  'Valida respostas e dados_sensiveis contra o catálogo: destino da pergunta, obrigatória não pulada, formato por tipo (como respondida() em progresso.ts), códigos de opção, limite de seleções e opção exclusiva. Preenche opcoes_escolhidas. Não confere a condição de exibição: como no TS, isso é filtrado na leitura (respostasValidas).';

create or replace trigger respostas_validar
  before insert or update on respostas
  for each row execute function validar_resposta();

create or replace trigger dados_sensiveis_validar
  before insert or update on dados_sensiveis
  for each row execute function validar_resposta();


-- =============================================================================
-- BANCO 02 · PSICOLOGIA E COMPORTAMENTO (e regras de tradução)
-- =============================================================================

create table if not exists tracos (
  codigo            text primary key,
  nome              text not null,
  tipo              text not null,
  metodo            text not null,
  perguntas_origem  text[] not null default '{}',
  depende_ia        boolean not null default false,
  versao_motor      text not null,
  ativo             boolean not null default true,
  constraint tracos_codigo_formato check (codigo ~ '^P[0-9]{3}$'),
  constraint tracos_tipo check (tipo in ('escala-0-10', 'categoria'))
);

comment on table tracos is
  'Banco 02 · Psicologia e comportamento. Catálogo dos traços P001 a P012 (TS: Traco em lib/motor/tracos.ts). São indicadores de preferências declaradas, não diagnóstico psicológico.';
comment on column tracos.metodo is 'Como o motor calcula o traço, na versao_motor indicada.';
comment on column tracos.perguntas_origem is 'Perguntas que alimentam o traço (TS: Traco.origens[].perguntaId).';
comment on column tracos.depende_ia is 'Verdadeiro quando o traço depende, no todo ou em parte, de texto livre lido pela IA.';

create table if not exists regras_traducao (
  codigo            text not null,
  versao            text not null,
  nome              text not null,
  descricao         text not null,
  tipo              text not null,
  evidencia         text not null,
  perguntas_origem  text[] not null default '{}',
  ativa             boolean not null default true,
  primary key (codigo, versao),
  constraint regras_traducao_codigo_formato check (codigo ~ '^R[0-9]{2}$'),
  constraint regras_traducao_tipo check (tipo in ('direcao', 'ajuste', 'restricao', 'seguranca',
                                                  'comercial', 'informativa')),
  constraint regras_traducao_evidencia check (evidencia in ('declarada', 'aceita', 'moderada', 'fraca', 'associacao'))
);

comment on table regras_traducao is
  'Banco 02 · Regras de tradução. Catálogo versionado das regras R01 a R21 ("se a resposta X, então ajuste Y"; TS: lib/motor/regras.ts, VERSAO_REGRAS). A evidência diz o quanto a regra é sólida (TS: Evidencia).';
comment on column regras_traducao.descricao is 'Título da regra no código-fonte (comentário "R01 · ...").';

create table if not exists cruzamentos (
  id                   uuid primary key default gen_random_uuid(),
  sessao_id            text not null,
  versao_motor         text not null,
  versao_regras        text not null,
  versao_catalogo      text not null,
  versao_questionario  text not null,
  gerado_em            timestamptz not null default now(),
  direcao              jsonb not null,
  mencoes              jsonb not null default '[]',
  candidatas           jsonb not null,
  lacunas              jsonb not null default '[]',
  comercial            jsonb not null,
  fila_ia              jsonb not null default '[]',
  pendencias           text[] not null default '{}',
  formulacao           jsonb,
  aprendizado          jsonb,
  constraint cruzamentos_sessao_fk foreign key (sessao_id, versao_questionario)
    references sessoes (id, questionario_versao) on delete cascade,
  constraint cruzamentos_chave_motor unique (id, sessao_id, versao_motor),
  constraint cruzamentos_chave_regras unique (id, sessao_id, versao_motor, versao_regras),
  constraint cruzamentos_json check (
    jsonb_typeof(direcao) = 'object' and jsonb_typeof(candidatas) = 'object' and jsonb_typeof(comercial) = 'object'
    and jsonb_typeof(mencoes) = 'array' and jsonb_typeof(lacunas) = 'array' and jsonb_typeof(fila_ia) = 'array')
);

create index if not exists cruzamentos_sessao_idx on cruzamentos (sessao_id, gerado_em desc);

comment on table cruzamentos is
  'Banco 02 · Motor de cruzamento. Cada execução do motor para uma sessão (TS: ResultadoCruzamento). Guarda as versões usadas e as partes que ainda não viraram tabela (direção, candidatas, comercial, menções, lacunas, fila da IA) como jsonb no formato do TS. O perfil vai para perfil_tracos e as regras para aplicacoes_regras.';
comment on column cruzamentos.direcao is 'TS: Direcao (pesos dos 5 grupos, concentração e base sugeridas, ajustes, conflitos, alertas).';
comment on column cruzamentos.candidatas is 'TS: Candidatas (matérias-primas por camada; não é fórmula, não tem proporção).';
comment on column cruzamentos.fila_ia is 'TS: filaIA (textos livres que aguardam leitura pela IA).';

create table if not exists perfil_tracos (
  cruzamento_id  uuid not null,
  sessao_id      text not null,
  traco_codigo   text not null references tracos (codigo),
  valor          numeric(3, 1),
  categorias     text[],
  status         text not null,
  metodo         text not null,
  origens        jsonb not null default '[]',
  versao_motor   text not null,
  gerado_em      timestamptz not null default now(),
  primary key (cruzamento_id, traco_codigo),
  constraint perfil_tracos_cruzamento_fk foreign key (cruzamento_id, sessao_id, versao_motor)
    references cruzamentos (id, sessao_id, versao_motor) on delete cascade,
  constraint perfil_tracos_valor check (valor between 0 and 10),
  constraint perfil_tracos_status check (status in ('calculado', 'parcial', 'aguarda_ia', 'sem_dados')),
  constraint perfil_tracos_sem_valor check (status not in ('aguarda_ia', 'sem_dados') or valor is null),
  constraint perfil_tracos_origens check (jsonb_typeof(origens) = 'array')
);

create index if not exists perfil_tracos_sessao_idx on perfil_tracos (sessao_id, traco_codigo);

comment on table perfil_tracos is
  'Banco 02 · Psicologia e comportamento. Valor de cada traço por sessão (TS: Traco em ResultadoCruzamento.perfil). Nenhum valor é inventado: traços que dependem de texto livre ficam "aguarda_ia" até a IA ler.';
comment on column perfil_tracos.valor is 'Escala de 0 a 10, uma casa decimal (traços tipo escala-0-10).';
comment on column perfil_tracos.categorias is 'Traços tipo categoria (ex.: P012): rótulos como o motor devolve.';
comment on column perfil_tracos.origens is 'TS: Traco.origens, lista [{perguntaId, papel}].';
comment on column perfil_tracos.metodo is 'Método no momento do cálculo (pode diferir do catálogo, ex.: "sem texto respondido").';

create table if not exists aplicacoes_regras (
  cruzamento_id  uuid not null,
  ordem          smallint not null,
  sessao_id      text not null,
  regra_codigo   text not null,
  regra_versao   text not null,
  nome           text not null,
  gatilho        text not null,
  efeito         text not null,
  origens        text[] not null default '{}',
  versao_motor   text not null,
  primary key (cruzamento_id, ordem),
  constraint aplicacoes_regras_regra_fk foreign key (regra_codigo, regra_versao)
    references regras_traducao (codigo, versao),
  constraint aplicacoes_regras_cruzamento_fk foreign key (cruzamento_id, sessao_id, versao_motor, regra_versao)
    references cruzamentos (id, sessao_id, versao_motor, versao_regras) on delete cascade,
  constraint aplicacoes_regras_ordem check (ordem > 0)
);

create index if not exists aplicacoes_regras_sessao_idx on aplicacoes_regras (sessao_id, regra_codigo);
create index if not exists aplicacoes_regras_regra_idx on aplicacoes_regras (regra_codigo, regra_versao);

comment on table aplicacoes_regras is
  'Banco 02 · Regras de tradução. Cada regra disparada numa sessão, com o gatilho e o efeito em texto (TS: RegraAplicada em ResultadoCruzamento.regras). Tipo e evidência vêm do catálogo regras_traducao.';
comment on column aplicacoes_regras.ordem is 'Posição da regra na lista devolvida pelo motor.';
comment on column aplicacoes_regras.nome is 'Nome no momento da aplicação (a R08 muda: Clima quente ou Clima frio).';


-- =============================================================================
-- BANCO 03 · INTELIGÊNCIA OLFATIVA (parte 1: catálogos simples)
-- =============================================================================

create table if not exists grupos_olfativos (
  codigo          text primary key,
  nome            text not null,
  exemplos        text,
  ordem           smallint not null,
  na_pergunta_19  boolean not null default true,
  constraint grupos_olfativos_codigo_formato check (codigo ~ '^[a-z]+$')
);

comment on table grupos_olfativos is
  'Banco 03 · Inteligência olfativa. As 5 famílias da pergunta 19 (TS: GRUPOS em referencias.ts), mais "transversal" para matérias-primas que atravessam famílias (ex.: ambreta, #84), que não aparece no questionário.';
comment on column grupos_olfativos.codigo is 'Mesmo código das opções da q19 (frescos, florais, amadeirados, doces, quentes).';

create table if not exists concentracoes (
  codigo               text primary key,
  nome                 text not null,
  concentrado          text not null,
  concentrado_min_pct  numeric(5, 2) not null,
  concentrado_max_pct  numeric(5, 2) not null,
  duracao              text not null,
  comportamento        text not null,
  ordem                smallint not null,
  constraint concentracoes_codigo_formato check (codigo ~ '^[a-z]+(-[a-z]+)*$'),
  constraint concentracoes_faixa check (
    concentrado_min_pct > 0 and concentrado_min_pct <= concentrado_max_pct and concentrado_max_pct <= 100)
);

comment on table concentracoes is
  'Banco 03 · Inteligência olfativa. Tipos de concentração, de Eau Fraîche a Extrait (TS: CONCENTRACOES; manual, seção 5.1). Percentual de concentrado no produto final.';
comment on column concentracoes.concentrado is 'Texto do manual (ex.: "15% a 20%"). As colunas _min_pct e _max_pct são a mesma faixa em número.';

create table if not exists lacunas_naturais (
  codigo     text primary key,
  texto      text not null,
  resolvida  boolean not null default false,
  constraint lacunas_naturais_codigo_formato check (codigo ~ '^[a-z]+$')
);

comment on table lacunas_naturais is
  'Banco 03 · Inteligência olfativa. Notas pedidas pelo questionário sem matéria-prima natural no catálogo (TS: LACUNAS_NATURAIS): mar, couro, tabaco, chá, vinho, champagne, caramelo, limpo.';


-- =============================================================================
-- BANCO 04 · MATÉRIAS-PRIMAS
-- =============================================================================

create table if not exists materias_primas (
  n                       smallint primary key,
  nome                    text not null,
  camada_manual           text,
  camadas                 text[] not null,
  familia                 text not null,
  grupo                   text not null references grupos_olfativos (codigo),
  grupo_secundario        text references grupos_olfativos (codigo),
  descricao_manual        text,
  alertas                 text[] not null default '{}',
  pagina                  smallint,
  proibida_forma          boolean not null default false,
  fototoxica              text,
  cites                   text,
  nativa_br               boolean not null default false,
  custo_alto              boolean not null default false,
  disponibilidade_rara    boolean not null default false,
  limite_uso              boolean not null default false,
  praticamente_inviavel   boolean not null default false,
  eh_acorde               boolean not null default false,
  duplicidade_com         smallint,
  volatilidade            text,
  persistencia_min_horas  numeric(6, 2),
  persistencia_max_horas  numeric(6, 2),
  papel_acorde            text,
  sintetica               boolean not null default false,
  versao_catalogo         text not null,
  ativa                   boolean not null default true,
  constraint materias_primas_n check (n > 0),
  constraint materias_primas_camadas check (
    cardinality(camadas) > 0 and camadas <@ array['Topo', 'Saída', 'Coração', 'Fundo']),
  constraint materias_primas_grupos_distintos check (grupo_secundario is distinct from grupo),
  constraint materias_primas_fototoxica check (fototoxica in ('confirmada', 'verificar', 'pedir-laudo')),
  constraint materias_primas_cites check (cites in ('confirmado', 'verificar')),
  constraint materias_primas_duplicidade_fk foreign key (duplicidade_com)
    references materias_primas (n) deferrable initially immediate,
  constraint materias_primas_duplicidade check (duplicidade_com is distinct from n),
  constraint materias_primas_volatilidade check (volatilidade in ('alta', 'media', 'baixa')),
  constraint materias_primas_persistencia check (
    persistencia_min_horas >= 0 and persistencia_min_horas <= persistencia_max_horas),
  constraint materias_primas_papel check (papel_acorde in ('base', 'modificador', 'harmonizador'))
);

create index if not exists materias_primas_grupo_idx on materias_primas (grupo);
create index if not exists materias_primas_grupo_secundario_idx on materias_primas (grupo_secundario);

comment on table materias_primas is
  'Banco 04 · Matérias-primas. Catálogo das 100 matérias-primas do manual (TS: MateriaPrima, VERSAO_CATALOGO), com as marcações de segurança e custo. Também guarda as propriedades olfativas do Banco 03 (fase, volatilidade e persistência em campos separados, como pede o manual). Nada aqui é fórmula: cada uso depende do perfumista e dos dados do lote.';
comment on column materias_primas.n is 'Número no manual (1 a 100). Novas matérias-primas continuam a numeração.';
comment on column materias_primas.camada_manual is 'TS: camadaManual, texto literal do manual (ex.: "Topo / Saída").';
comment on column materias_primas.camadas is 'TS: camadas. Fase olfativa (Topo, Saída, Coração, Fundo).';
comment on column materias_primas.familia is 'TS: familia. Inferência da análise, a validar com perfumista.';
comment on column materias_primas.grupo is 'TS: grupo. Liga a matéria-prima às famílias da q19.';
comment on column materias_primas.proibida_forma is 'TS: flags.proibidaForma. Alguma forma ou espécie é proibida (usar só a permitida).';
comment on column materias_primas.fototoxica is 'TS: flags.fototoxica.';
comment on column materias_primas.cites is 'TS: flags.cites. Espécie controlada pela CITES.';
comment on column materias_primas.nativa_br is 'TS: flags.nativaBR. Espécie nativa: Lei 13.123 (SisGen).';
comment on column materias_primas.limite_uso is 'TS: flags.limiteUso. Tem limite IFRA ou teor a controlar (ver restricoes_ifra).';
comment on column materias_primas.eh_acorde is 'TS: flags.ehAcorde. Não é matéria-prima, é acorde (#100).';
comment on column materias_primas.duplicidade_com is 'TS: flags.duplicidadeCom. Possível duplicidade com outra entrada do manual.';
comment on column materias_primas.volatilidade is 'Banco 03. A preencher pelo perfumista; não é deduzida da camada.';
comment on column materias_primas.persistencia_min_horas is 'Banco 03. Persistência na pele, em horas (mínimo). A preencher.';
comment on column materias_primas.papel_acorde is 'Banco 03. Papel típico no método Jean Carles (base, modificador, harmonizador). A preencher.';
comment on column materias_primas.sintetica is 'Falso para todo o catálogo do manual; os sintéticos da linha Essencial entram depois.';

create table if not exists substancias (
  id             uuid primary key default gen_random_uuid(),
  nome           text not null unique,
  cas            text unique,
  alergenico_ue  boolean not null default false,
  observacao     text,
  constraint substancias_cas_formato check (cas ~ '^[0-9]{2,7}-[0-9]{2}-[0-9]$')
);

comment on table substancias is
  'Banco 04 · Matérias-primas. Moléculas e grupos de moléculas (cumarina, citral, linalol, furocumarinas). É o que permite somar a mesma molécula vinda de várias matérias-primas na checagem IFRA de uma fórmula.';
comment on column substancias.alergenico_ue is 'Está na lista europeia de alergênicos de rotulagem (Reg. 2023/1545), usada como padrão interno.';

create table if not exists fornecedores (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null unique,
  cnpj        text unique,
  pais        char(2) not null default 'BR',
  email       text,
  telefone    text,
  site        text,
  observacoes text,
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now(),
  constraint fornecedores_cnpj_formato check (cnpj ~ '^[0-9]{14}$')
);

comment on table fornecedores is
  'Banco 04 · Matérias-primas. Fornecedores de matérias-primas e veículos.';

create table if not exists lotes (
  id                           uuid primary key default gen_random_uuid(),
  materia_n                    smallint not null references materias_primas (n),
  fornecedor_id                uuid not null references fornecedores (id),
  codigo_lote                  text not null,
  forma                        text,
  pais_origem                  char(2),
  data_aquisicao               date not null,
  data_fabricacao              date,
  validade                     date,
  quantidade_g                 numeric(12, 3),
  custo_total                  numeric(12, 2),
  custo_por_grama              numeric(14, 6) generated always as (round(custo_total / nullif(quantidade_g, 0), 6)) stored,
  moeda                        char(3) not null default 'BRL',
  certificado_ifra_arquivo     text,
  certificado_ifra_emenda      smallint,
  laudo_furocumarinas_arquivo  text,
  status                       text not null default 'quarentena',
  observacoes                  text,
  criado_em                    timestamptz not null default now(),
  constraint lotes_codigo_unico unique (fornecedor_id, codigo_lote),
  constraint lotes_id_materia_unico unique (id, materia_n),
  constraint lotes_quantidade check (quantidade_g > 0),
  constraint lotes_custo check (custo_total >= 0),
  constraint lotes_validade check (validade is null or validade > coalesce(data_fabricacao, data_aquisicao)),
  constraint lotes_status check (status in ('quarentena', 'aprovado', 'reprovado', 'esgotado', 'vencido')),
  constraint lotes_aprovado_certificado check (status <> 'aprovado' or certificado_ifra_arquivo is not null)
);

create index if not exists lotes_materia_idx on lotes (materia_n);
create index if not exists lotes_validade_idx on lotes (validade) where status = 'aprovado';

comment on table lotes is
  'Banco 04 · Matérias-primas. Cada lote comprado. A composição e os alergênicos variam por lote, por isso ficam aqui (lotes_composicao) e não na matéria-prima. Lote só é aprovado com certificado IFRA.';
comment on column lotes.forma is 'Forma comercial (ex.: óleo destilado, absoluto, FCF, CO2). Algumas formas são proibidas (ver materias_primas.proibida_forma).';
comment on column lotes.custo_por_grama is 'Calculado: custo_total / quantidade_g.';
comment on column lotes.certificado_ifra_arquivo is 'Caminho do arquivo no storage (ex.: bucket privado do Supabase).';
comment on column lotes.laudo_furocumarinas_arquivo is 'Laudo de bergapteno para cítricos prensados (materias_primas.fototoxica).';

create table if not exists lotes_composicao (
  lote_id       uuid not null references lotes (id) on delete cascade,
  substancia_id uuid not null references substancias (id),
  percentual    numeric(8, 5) not null,
  fonte         text,
  primary key (lote_id, substancia_id),
  constraint lotes_composicao_percentual check (percentual > 0 and percentual <= 100)
);

create index if not exists lotes_composicao_substancia_idx on lotes_composicao (substancia_id);

comment on table lotes_composicao is
  'Banco 04 · Matérias-primas. Composição de cada lote (certificado do fornecedor, GC-MS ou declaração de alergênicos), em % de massa. Os alergênicos do lote são as linhas cuja substância é alergênica.';

create table if not exists restricoes_ifra (
  id                        uuid primary key default gen_random_uuid(),
  padrao                    text not null,
  emenda                    smallint not null,
  substancia_id             uuid references substancias (id),
  materia_n                 smallint references materias_primas (n),
  tipo                      text not null,
  categoria                 text not null,
  limite_percentual         numeric(9, 5),
  vigente_novas_desde       date,
  vigente_existentes_desde  date,
  revogada_em               date,
  fonte                     text,
  observacao                text,
  constraint restricoes_ifra_alvo check (num_nonnulls(substancia_id, materia_n) = 1),
  constraint restricoes_ifra_emenda check (emenda > 0),
  constraint restricoes_ifra_tipo check (tipo in ('proibicao', 'limite', 'especificacao')),
  constraint restricoes_ifra_categoria check (
    categoria in ('1', '2', '3', '4', '5A', '5B', '5C', '5D', '6', '7A', '7B',
                  '8', '9', '10A', '10B', '11A', '11B', '12')),
  constraint restricoes_ifra_limite check ((tipo = 'limite') = (limite_percentual is not null)),
  constraint restricoes_ifra_limite_faixa check (limite_percentual >= 0 and limite_percentual <= 100),
  constraint restricoes_ifra_unica unique nulls not distinct (padrao, emenda, categoria, substancia_id, materia_n)
);

create index if not exists restricoes_ifra_substancia_idx on restricoes_ifra (substancia_id, categoria);
create index if not exists restricoes_ifra_materia_idx on restricoes_ifra (materia_n, categoria);

comment on table restricoes_ifra is
  'Banco 04 (governança regulatória). Limites e proibições IFRA versionados: número do padrão, emenda, valor por categoria e datas de vigência (REFERENCIAS-TECNICAS.md, seção 9). A 52ª emenda entra como linhas novas; as da 51ª ganham revogada_em. O alvo é uma substância ou uma matéria-prima.';
comment on column restricoes_ifra.padrao is 'Padrão IFRA (ex.: STD 089).';
comment on column restricoes_ifra.categoria is 'Categoria IFRA do produto. Perfume é a categoria 4.';
comment on column restricoes_ifra.limite_percentual is 'Máximo no produto final, em %. Só para tipo "limite".';
comment on column restricoes_ifra.vigente_novas_desde is 'Data em que passa a valer para criações novas.';
comment on column restricoes_ifra.vigente_existentes_desde is 'Data em que passa a valer para produtos que já existiam.';

create table if not exists veiculos (
  codigo      text primary key,
  nome        text not null,
  tipo_base   text not null,
  composicao  text,
  observacao  text,
  ativo       boolean not null default true,
  constraint veiculos_tipo_base check (tipo_base in ('alcoolica', 'oleosa')),
  constraint veiculos_codigo_base_unico unique (codigo, tipo_base)
);

comment on table veiculos is
  'Banco 04 · Matérias-primas. Veículos que diluem o concentrado: base alcoólica (álcool de cereais, SD Alcohol 40-B) ou oleosa (ex.: jojoba, coco fracionado; base oleosa ainda é lacuna do manual).';


-- =============================================================================
-- BANCO 03 · INTELIGÊNCIA OLFATIVA (parte 2: depende de materias_primas)
-- =============================================================================

create table if not exists afinidades (
  materia_a  smallint not null references materias_primas (n),
  materia_b  smallint not null references materias_primas (n),
  fonte      text not null default 'manual',
  pagina     smallint,
  trecho     text,
  validada   boolean not null default false,
  primary key (materia_a, materia_b),
  constraint afinidades_par_ordenado check (materia_a < materia_b)
);

create index if not exists afinidades_b_idx on afinidades (materia_b);

comment on table afinidades is
  'Banco 03 · Inteligência olfativa. Pares de matérias-primas que combinam, a partir do "combina com" do manual. Par sem ordem: sempre materia_a < materia_b.';

create table if not exists acordes (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null unique,
  materia_n       smallint unique references materias_primas (n),
  descricao       text,
  fonte           text,
  usa_sinteticos  boolean not null default false,
  status          text not null default 'referencia',
  observacao      text,
  constraint acordes_status check (status in ('referencia', 'a_corrigir', 'validado'))
);

comment on table acordes is
  'Banco 03 · Inteligência olfativa. Acordes (Chypre, Fougère, Oriental e os que vierem). Os do manual usam sintéticos e o Oriental não soma 100%: entram como "a_corrigir" até o perfumista validar.';
comment on column acordes.materia_n is 'Quando o acorde também aparece no catálogo (ex.: #100 Acorde Couro).';

create table if not exists acorde_componentes (
  acorde_id   uuid not null references acordes (id) on delete cascade,
  ordem       smallint not null,
  materia_n   smallint references materias_primas (n),
  nome        text,
  sintetico   boolean not null default false,
  camada      text,
  papel       text,
  percentual  numeric(6, 3) not null,
  primary key (acorde_id, ordem),
  constraint acorde_componentes_item check (materia_n is not null or nome is not null),
  constraint acorde_componentes_camada check (camada in ('topo', 'coracao', 'fundo')),
  constraint acorde_componentes_papel check (papel in ('base', 'modificador', 'harmonizador')),
  constraint acorde_componentes_percentual check (percentual > 0 and percentual <= 100)
);

comment on table acorde_componentes is
  'Banco 03 · Inteligência olfativa. Componentes de cada acorde, em % de massa dentro do acorde, com o papel no método Jean Carles. Sintéticos que não estão no catálogo entram pelo nome (ex.: Iso E Super).';

create table if not exists perfumes_referencia (
  id                   uuid primary key default gen_random_uuid(),
  marca                text not null,
  nome                 text not null,
  concentracao_codigo  text references concentracoes (codigo),
  ano                  smallint,
  fonte                text,
  observacao           text,
  constraint perfumes_referencia_unico unique nulls not distinct (marca, nome, concentracao_codigo),
  constraint perfumes_referencia_ano check (ano between 1800 and 2100)
);

comment on table perfumes_referencia is
  'Banco 03 · Inteligência olfativa. Perfumes comerciais decompostos em notas, para ler a pergunta 30 (perfumes já usados). Uso interno de referência: nunca usar o nome de marca de terceiros para vender.';

create table if not exists perfumes_referencia_notas (
  perfume_id  uuid not null references perfumes_referencia (id) on delete cascade,
  camada      text not null,
  nota        text not null,
  materia_n   smallint references materias_primas (n),
  grupo       text references grupos_olfativos (codigo),
  primary key (perfume_id, camada, nota),
  constraint perfumes_referencia_notas_camada check (camada in ('topo', 'coracao', 'fundo'))
);

create index if not exists perfumes_referencia_notas_materia_idx on perfumes_referencia_notas (materia_n);

comment on table perfumes_referencia_notas is
  'Banco 03 · Inteligência olfativa. Notas de cada perfume de referência por camada, ligadas ao catálogo quando existe a matéria-prima.';


-- =============================================================================
-- BANCO 05 · FORMULAÇÕES
-- =============================================================================

create table if not exists formulas (
  id                      uuid primary key default gen_random_uuid(),
  codigo                  text not null,
  versao                  smallint not null default 1,
  sessao_id               text not null,
  consumidor_id           text not null,
  cruzamento_id           uuid references cruzamentos (id) on delete set null,
  nome_interno            text not null,
  concentracao_codigo     text not null references concentracoes (codigo),
  percentual_concentrado  numeric(5, 2) not null,
  base                    text not null,
  veiculo_codigo          text,
  status                  text not null default 'rascunho',
  origem                  text not null default 'ia',
  aprovada_por            text,
  aprovada_em             timestamptz,
  ifra_status             text not null default 'nao_verificada',
  ifra_emenda             smallint,
  ifra_verificada_em      timestamptz,
  ifra_resultado          jsonb,
  observacoes             text,
  criada_em               timestamptz not null default now(),
  constraint formulas_versao_unica unique (codigo, versao),
  constraint formulas_id_sessao_unico unique (id, sessao_id),
  constraint formulas_sessao_fk foreign key (sessao_id, consumidor_id)
    references sessoes (id, consumidor_id),
  constraint formulas_veiculo_fk foreign key (veiculo_codigo, base)
    references veiculos (codigo, tipo_base),
  constraint formulas_versao check (versao > 0),
  constraint formulas_percentual_concentrado check (percentual_concentrado > 0 and percentual_concentrado <= 100),
  constraint formulas_base check (base in ('alcoolica', 'oleosa')),
  constraint formulas_status check (status in ('rascunho', 'em_revisao', 'aprovada', 'reprovada', 'substituida')),
  constraint formulas_origem check (origem in ('ia', 'perfumista')),
  constraint formulas_ifra_status check (ifra_status in ('nao_verificada', 'conforme', 'nao_conforme')),
  constraint formulas_ifra_verificacao check (
    (ifra_status = 'nao_verificada') = (ifra_verificada_em is null)
    and (ifra_status = 'nao_verificada' or ifra_emenda is not null)),
  constraint formulas_aprovacao check (
    status not in ('aprovada', 'substituida')
    or (aprovada_por is not null and aprovada_em is not null and ifra_status = 'conforme'))
);

create index if not exists formulas_sessao_idx on formulas (sessao_id);
create index if not exists formulas_consumidor_idx on formulas (consumidor_id);
create index if not exists formulas_status_idx on formulas (status);

comment on table formulas is
  'Banco 05 · Formulações. Fórmula de uma sessão. Cada mudança é uma nova linha com versao + 1 (mesmo codigo): fórmula aprovada, reprovada ou substituída não muda mais (gatilho proteger_formula). Só é aprovada com perfumista, componentes somando 100%, concentrado dentro da faixa da concentração e checagem IFRA "conforme".';
comment on column formulas.codigo is 'Identidade da fórmula entre versões (ex.: ICR-2026-0001).';
comment on column formulas.percentual_concentrado is 'Percentual do concentrado no produto final (o resto é veículo). Fica aqui, separado dos componentes.';
comment on column formulas.base is 'TS: Direcao.base.tipo. Oleosa é obrigatória quando a pessoa evita álcool (regra R14).';
comment on column formulas.aprovada_por is 'Perfumista que aprovou.';
comment on column formulas.ifra_resultado is 'Detalhe da checagem: cada substância somando todas as fontes, limite aplicado e emenda (ver vw_formulas_ifra).';

create table if not exists componentes_formula (
  formula_id        uuid not null references formulas (id) on delete cascade,
  ordem             smallint not null,
  materia_n         smallint not null references materias_primas (n),
  lote_id           uuid,
  percentual_massa  numeric(7, 4) not null,
  observacao        text,
  primary key (formula_id, ordem),
  constraint componentes_formula_unico unique nulls not distinct (formula_id, materia_n, lote_id),
  constraint componentes_formula_lote_fk foreign key (lote_id, materia_n)
    references lotes (id, materia_n),
  constraint componentes_formula_ordem check (ordem > 0),
  constraint componentes_formula_percentual check (percentual_massa > 0 and percentual_massa <= 100)
);

create index if not exists componentes_formula_materia_idx on componentes_formula (materia_n);
create index if not exists componentes_formula_lote_idx on componentes_formula (lote_id);

comment on table componentes_formula is
  'Banco 05 · Formulações. Matérias-primas de cada versão da fórmula, em % de MASSA dentro do concentrado (a soma precisa dar 100 para aprovar). O lote, quando informado, precisa ser da mesma matéria-prima.';

create or replace function proteger_formula() returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  qtd    integer;
  soma   numeric;
  faixa  record;
begin
  if tg_op = 'DELETE' then
    if old.status <> 'rascunho' then
      raise exception 'A fórmula % v% está "%" e não pode ser apagada', old.codigo, old.versao, old.status
        using errcode = 'check_violation';
    end if;
    return old;
  end if;

  if tg_op = 'INSERT' then
    if new.status in ('aprovada', 'substituida') then
      raise exception 'Grave a fórmula % como rascunho, inclua os componentes e aprove depois (update)', new.codigo
        using errcode = 'check_violation';
    end if;
    return new;
  end if;

  if old.status in ('aprovada', 'reprovada', 'substituida') then
    if not (old.status = 'aprovada' and new.status = 'substituida'
            and (to_jsonb(new) - 'status') = (to_jsonb(old) - 'status')) then
      raise exception 'A fórmula % v% está "%": cada mudança vira uma nova versão (nova linha)', old.codigo, old.versao, old.status
        using errcode = 'check_violation';
    end if;
  end if;

  if new.status = 'aprovada' and old.status <> 'aprovada' then
    select count(*), coalesce(sum(c.percentual_massa), 0) into qtd, soma
      from componentes_formula c where c.formula_id = new.id;
    if qtd = 0 or abs(soma - 100) > 0.001 then
      raise exception 'Fórmula % v%: os componentes somam % por cento do concentrado; precisa ser 100', new.codigo, new.versao, soma
        using errcode = 'check_violation';
    end if;
    select c.concentrado_min_pct, c.concentrado_max_pct into faixa
      from concentracoes c where c.codigo = new.concentracao_codigo;
    if new.percentual_concentrado not between faixa.concentrado_min_pct and faixa.concentrado_max_pct then
      raise exception 'Fórmula % v%: concentrado de % por cento fora da faixa de % (% a % por cento)', new.codigo, new.versao,
        new.percentual_concentrado, new.concentracao_codigo, faixa.concentrado_min_pct, faixa.concentrado_max_pct
        using errcode = 'check_violation';
    end if;
  end if;

  return new;
end
$$;

comment on function proteger_formula() is
  'Versionamento das fórmulas: nada muda depois de aprovada (só pode virar "substituida"), reprovada ou substituída; na aprovação confere soma de 100% e faixa de concentrado.';

create or replace trigger formulas_proteger
  before insert or update or delete on formulas
  for each row execute function proteger_formula();

create or replace function proteger_componentes_formula() returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  st text;
begin
  if tg_op in ('UPDATE', 'DELETE') then
    select f.status into st from formulas f where f.id = old.formula_id;
    if found and st not in ('rascunho', 'em_revisao') then
      raise exception 'A fórmula está "%": os componentes não mudam mais; crie uma nova versão', st
        using errcode = 'check_violation';
    end if;
  end if;
  if tg_op in ('INSERT', 'UPDATE') then
    select f.status into st from formulas f where f.id = new.formula_id;
    if found and st not in ('rascunho', 'em_revisao') then
      raise exception 'A fórmula está "%": os componentes não mudam mais; crie uma nova versão', st
        using errcode = 'check_violation';
    end if;
    return new;
  end if;
  return old;
end
$$;

create or replace trigger componentes_formula_proteger
  before insert or update or delete on componentes_formula
  for each row execute function proteger_componentes_formula();


-- =============================================================================
-- BANCO 06 · INTELIGÊNCIA COMERCIAL
-- =============================================================================

create table if not exists modalidades (
  codigo        text primary key,
  nome          text not null,
  preco         numeric(10, 2) not null,
  moeda         char(3) not null default 'BRL',
  condicao      text not null,
  status_preco  text not null default 'a_confirmar',
  ordem         smallint not null,
  ativa         boolean not null default true,
  constraint modalidades_codigo_formato check (codigo ~ '^[a-z]+(-[a-z]+)*$'),
  constraint modalidades_preco check (preco >= 0),
  constraint modalidades_status_preco check (status_preco in ('a_confirmar', 'confirmado'))
);

comment on table modalidades is
  'Banco 06 · Inteligência comercial. Modalidades de venda (TS: MODALIDADES): Essencial R$ 180, Atelier R$ 600, Atelier compartilhável R$ 420, Atelier exclusivo R$ 745. Preços ainda sem validação de mercado ("a_confirmar"). Compartilhável e exclusivo se excluem.';

create table if not exists pedidos (
  id                      uuid primary key default gen_random_uuid(),
  numero                  bigint generated always as identity unique,
  consumidor_id           text not null,
  sessao_id               text not null,
  formula_id              uuid,
  modalidade_codigo       text not null references modalidades (codigo),
  preco_tabela            numeric(10, 2) not null,
  desconto                numeric(10, 2) not null default 0,
  valor_total             numeric(10, 2) generated always as (preco_tabela - desconto) stored,
  moeda                   char(3) not null default 'BRL',
  status                  text not null default 'aguardando_pagamento',
  regime_producao         text,
  fabricado_em            date,
  validade_ate            date,
  prazo_entrega_estimado  date,
  enviado_em              timestamptz,
  entregue_em             timestamptz,
  cancelado_em            timestamptz,
  motivo_cancelamento     text,
  criado_em               timestamptz not null default now(),
  constraint pedidos_sessao_fk foreign key (sessao_id, consumidor_id)
    references sessoes (id, consumidor_id),
  constraint pedidos_formula_fk foreign key (formula_id, sessao_id)
    references formulas (id, sessao_id),
  constraint pedidos_status check (status in ('aguardando_pagamento', 'em_formulacao', 'maturando', 'macerando',
                                              'quebra_fria', 'envase', 'enviado', 'entregue', 'cancelado')),
  constraint pedidos_desconto check (desconto >= 0 and desconto <= preco_tabela),
  constraint pedidos_regime check (regime_producao in ('artesanal', 'laboratorio_afe')),
  constraint pedidos_validade_artesanal check (
    regime_producao is distinct from 'artesanal' or validade_ate is null or fabricado_em is null
    or validade_ate <= (fabricado_em + interval '12 months')::date),
  constraint pedidos_enviado check (status not in ('enviado', 'entregue') or enviado_em is not null),
  constraint pedidos_entregue check (status <> 'entregue' or entregue_em is not null),
  constraint pedidos_cancelado check ((status = 'cancelado') = (cancelado_em is not null))
);

create index if not exists pedidos_consumidor_idx on pedidos (consumidor_id);
create index if not exists pedidos_status_idx on pedidos (status);
create index if not exists pedidos_formula_idx on pedidos (formula_id);

comment on table pedidos is
  'Banco 06 · Inteligência comercial. Pedido de um perfume. O status acompanha a produção (formulação, maturação, maceração, quebra fria, envase, envio): do pedido à entrega são de 4 a 9 semanas. A partir de "maturando" exige fórmula aprovada. Preço copiado da modalidade no momento da compra.';
comment on column pedidos.preco_tabela is 'Preço da modalidade no momento do pedido (as modalidades podem mudar de preço).';
comment on column pedidos.regime_producao is 'Artesanal (RDC 1.045/2026, validade de até 12 meses) ou laboratório com AFE. Decisão pendente.';

create table if not exists pedidos_status_historico (
  id               bigint generated always as identity primary key,
  pedido_id        uuid not null references pedidos (id) on delete cascade,
  status_anterior  text,
  status           text not null,
  ocorrido_em      timestamptz not null default now(),
  registrado_por   text not null default usuario_atual()
);

create index if not exists pedidos_status_historico_pedido_idx on pedidos_status_historico (pedido_id, ocorrido_em);

comment on table pedidos_status_historico is
  'Banco 06 · Inteligência comercial. Cada mudança de status do pedido, gravada pelo gatilho pedidos_status. Mede prazos reais de produção.';

create or replace function registrar_status_pedido() returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  fluxo constant text[] := array['aguardando_pagamento', 'em_formulacao', 'maturando', 'macerando',
                                 'quebra_fria', 'envase', 'enviado', 'entregue'];
begin
  if tg_op = 'UPDATE' then
    if new.status is not distinct from old.status then
      return null;
    end if;
    if old.status in ('entregue', 'cancelado') then
      raise exception 'O pedido % já está "%" e não muda mais de status', old.numero, old.status
        using errcode = 'check_violation';
    end if;
    if new.status <> 'cancelado' and array_position(fluxo, new.status) < array_position(fluxo, old.status) then
      raise exception 'O pedido % não pode voltar de "%" para "%"', old.numero, old.status, new.status
        using errcode = 'check_violation';
    end if;
  end if;

  if array_position(fluxo, new.status) >= array_position(fluxo, 'maturando')
     and not exists (select 1 from formulas f
                      where f.id = new.formula_id and f.status in ('aprovada', 'substituida')) then
    raise exception 'O pedido % só entra em produção com uma fórmula aprovada', new.numero
      using errcode = 'check_violation';
  end if;

  insert into pedidos_status_historico (pedido_id, status_anterior, status)
  values (new.id, case when tg_op = 'UPDATE' then old.status end, new.status);
  return null;
end
$$;

comment on function registrar_status_pedido() is
  'Fluxo do pedido: só anda para a frente (ou cancela), entregue e cancelado são finais, produção exige fórmula aprovada; grava o histórico.';

create or replace trigger pedidos_status
  after insert or update of status on pedidos
  for each row execute function registrar_status_pedido();

create table if not exists pagamentos (
  id                     uuid primary key default gen_random_uuid(),
  pedido_id              uuid not null references pedidos (id),
  valor                  numeric(10, 2) not null,
  moeda                  char(3) not null default 'BRL',
  metodo                 text not null,
  status                 text not null default 'pendente',
  provedor               text,
  provedor_transacao_id  text,
  criado_em              timestamptz not null default now(),
  pago_em                timestamptz,
  estornado_em           timestamptz,
  constraint pagamentos_transacao_unica unique (provedor, provedor_transacao_id),
  constraint pagamentos_valor check (valor > 0),
  constraint pagamentos_metodo check (metodo in ('pix', 'cartao_credito', 'boleto', 'outro')),
  constraint pagamentos_status check (status in ('pendente', 'aprovado', 'recusado', 'estornado', 'cancelado')),
  constraint pagamentos_pago check (status not in ('aprovado', 'estornado') or pago_em is not null),
  constraint pagamentos_estornado check ((status = 'estornado') = (estornado_em is not null))
);

create index if not exists pagamentos_pedido_idx on pagamentos (pedido_id);

comment on table pagamentos is
  'Banco 06 · Inteligência comercial. Pagamentos de cada pedido (um pedido pode ter tentativas recusadas antes da aprovada).';

create table if not exists direitos_comerciais (
  id                         uuid primary key default gen_random_uuid(),
  pedido_id                  uuid not null unique references pedidos (id),
  consumidor_id              text not null references consumidores (id),
  exclusiva                  boolean not null default false,
  exclusividade_inicio       date,
  exclusividade_fim          date,
  autoriza_colecoes_futuras  boolean not null default false,
  desconto_concedido         numeric(10, 2),
  versao_termo               text not null,
  aceito_em                  timestamptz not null default now(),
  revogado_em                timestamptz,
  criado_em                  timestamptz not null default now(),
  constraint direitos_comerciais_excludentes check (not (exclusiva and autoriza_colecoes_futuras)),
  constraint direitos_comerciais_periodo check (
    exclusiva = (exclusividade_inicio is not null and exclusividade_fim is not null)
    and (exclusividade_fim is null or exclusividade_fim > exclusividade_inicio)),
  constraint direitos_comerciais_desconto check (
    desconto_concedido is null or (desconto_concedido >= 0 and autoriza_colecoes_futuras)),
  constraint direitos_comerciais_revogacao check (revogado_em is null or revogado_em >= aceito_em)
);

create index if not exists direitos_comerciais_consumidor_idx on direitos_comerciais (consumidor_id);
create index if not exists direitos_comerciais_exclusividade_idx
  on direitos_comerciais (exclusividade_fim) where exclusiva;

comment on table direitos_comerciais is
  'Banco 06 · Inteligência comercial. Direitos sobre a fórmula vendida: exclusividade (início e fim, ex.: 3 anos) ou autorização para inspirar coleções futuras em troca de desconto; as duas se excluem. É um contrato comercial e NUNCA o mesmo registro do consentimento de uso de dados (consentimentos).';
comment on column direitos_comerciais.versao_termo is 'Versão da cláusula contratual aceita.';

create table if not exists custos_producao (
  id              uuid primary key default gen_random_uuid(),
  pedido_id       uuid references pedidos (id) on delete cascade,
  formula_id      uuid references formulas (id),
  tipo            text not null,
  descricao       text,
  lote_id         uuid references lotes (id),
  quantidade      numeric(12, 3),
  unidade         text,
  custo_unitario  numeric(12, 4),
  valor_total     numeric(12, 2) not null,
  moeda           char(3) not null default 'BRL',
  registrado_em   timestamptz not null default now(),
  constraint custos_producao_alvo check (num_nonnulls(pedido_id, formula_id) >= 1),
  constraint custos_producao_tipo check (tipo in ('materia_prima', 'veiculo', 'frasco', 'embalagem', 'rotulo',
                                                  'mao_de_obra', 'frete', 'taxa_pagamento', 'outro')),
  constraint custos_producao_unidade check (unidade in ('g', 'ml', 'un', 'h')),
  constraint custos_producao_valores check (
    valor_total >= 0 and (quantidade is null or quantidade > 0) and (custo_unitario is null or custo_unitario >= 0)),
  constraint custos_producao_conta check (
    quantidade is null or custo_unitario is null or abs(valor_total - quantidade * custo_unitario) < 0.01)
);

create index if not exists custos_producao_pedido_idx on custos_producao (pedido_id);
create index if not exists custos_producao_formula_idx on custos_producao (formula_id);

comment on table custos_producao is
  'Banco 06 · Inteligência comercial. Custo real de cada pedido ou fórmula (insumos por lote, frasco, mão de obra, frete), para conferir a margem de cada modalidade.';


-- =============================================================================
-- BANCO 07 · APRENDIZADO
-- =============================================================================

create table if not exists avaliacoes (
  id                        uuid primary key default gen_random_uuid(),
  formula_id                uuid not null,
  sessao_id                 text not null,
  pedido_id                 uuid references pedidos (id),
  marco_dias                smallint not null,
  representa_personalidade  smallint,
  gostou                    smallint,
  intensidade               smallint,
  fixacao                   smallint,
  compraria_novamente       boolean,
  recomendaria              smallint,
  comentario                text,
  respondida_em             timestamptz not null default now(),
  constraint avaliacoes_formula_fk foreign key (formula_id, sessao_id)
    references formulas (id, sessao_id),
  constraint avaliacoes_unica unique nulls not distinct (formula_id, pedido_id, marco_dias),
  constraint avaliacoes_marco check (marco_dias in (7, 30)),
  constraint avaliacoes_escalas check (
    representa_personalidade between 1 and 5 and gostou between 1 and 5
    and intensidade between 1 and 5 and fixacao between 1 and 5),
  constraint avaliacoes_recomendaria check (recomendaria between 0 and 10)
);

create index if not exists avaliacoes_sessao_idx on avaliacoes (sessao_id);

comment on table avaliacoes is
  'Banco 07 · Aprendizado. Avaliação depois da entrega, aos 7 e aos 30 dias, ligada à fórmula e à sessão: é o que calibra traços, regras e pesos com dados reais.';
comment on column avaliacoes.representa_personalidade is 'De 1 a 5: o quanto o perfume representa a pessoa.';
comment on column avaliacoes.intensidade is 'De 1 (fraco demais) a 5 (forte demais); 3 é na medida.';
comment on column avaliacoes.fixacao is 'De 1 (some rápido) a 5 (dura o dia todo).';
comment on column avaliacoes.recomendaria is 'De 0 a 10 (escala NPS).';


-- =============================================================================
-- BANCO 08 · GOVERNANÇA
-- =============================================================================

create table if not exists textos_consentimento (
  tipo          text not null,
  versao        text not null,
  texto         text not null,
  publicado_em  timestamptz not null default now(),
  primary key (tipo, versao),
  constraint textos_consentimento_tipo check (tipo in ('uso_respostas_criacao', 'termos_conta', 'marketing_opt_in'))
);

comment on table textos_consentimento is
  'Banco 08 · Governança. Texto de cada versão de consentimento (TS: TEXTO_CONSENTIMENTO, hoje c1-2026-11). Só inclusão: mudar o texto é publicar uma versão nova.';

create or replace trigger textos_consentimento_imutavel
  before update or delete on textos_consentimento
  for each row execute function impedir_alteracao();

create table if not exists consentimentos (
  id             text primary key default ('cons-' || gen_random_uuid()::text),
  consumidor_id  text not null references consumidores (id) on delete cascade,
  sessao_id      text,
  tipo           text not null,
  versao_texto   text not null,
  aceito_em      timestamptz not null default now(),
  revogado_em    timestamptz,
  constraint consentimentos_sessao_fk foreign key (sessao_id, consumidor_id)
    references sessoes (id, consumidor_id) on delete cascade,
  constraint consentimentos_texto_fk foreign key (tipo, versao_texto)
    references textos_consentimento (tipo, versao),
  constraint consentimentos_id_formato check (id ~ '^cons-[A-Za-z0-9_-]+$'),
  constraint consentimentos_tipo check (tipo in ('uso_respostas_criacao', 'termos_conta', 'marketing_opt_in')),
  constraint consentimentos_sessao_obrigatoria check (tipo <> 'uso_respostas_criacao' or sessao_id is not null),
  constraint consentimentos_revogacao check (revogado_em is null or revogado_em >= aceito_em)
);

create unique index if not exists consentimentos_ativo_sessao_idx
  on consentimentos (sessao_id, tipo) where revogado_em is null and sessao_id is not null;
create unique index if not exists consentimentos_ativo_consumidor_idx
  on consentimentos (consumidor_id, tipo) where revogado_em is null and sessao_id is null;

comment on table consentimentos is
  'Banco 08 · Governança. Aceites de consentimento (TS: Consentimento). Tipos separados: uso das respostas na criação (por sessão), termos da conta e marketing (opt-in). Revogar é preencher revogado_em; o texto aceito está em textos_consentimento. Direitos comerciais ficam em outra tabela (direitos_comerciais).';
comment on column consentimentos.id is 'TS: id gerado por novoId("cons-uso"), formato cons-uso_<uuid>.';
comment on column consentimentos.versao_texto is 'TS: versaoTexto.';
comment on column consentimentos.aceito_em is 'TS: aceitoEm.';

create table if not exists log_geracoes_ia (
  id              uuid primary key default gen_random_uuid(),
  sessao_id       text references sessoes (id) on delete cascade,
  cruzamento_id   uuid references cruzamentos (id) on delete set null,
  formula_id      uuid references formulas (id) on delete set null,
  finalidade      text not null,
  modelo          text not null,
  versao_prompt   text not null,
  entrada         jsonb not null,
  saida           jsonb,
  status          text not null default 'sucesso',
  erro            text,
  tokens_entrada  integer,
  tokens_saida    integer,
  custo           numeric(12, 6),
  moeda           char(3) not null default 'USD',
  duracao_ms      integer,
  criado_em       timestamptz not null default now(),
  constraint log_geracoes_ia_finalidade check (finalidade in ('leitura_textos', 'direcao_olfativa', 'formulacao',
                                                              'narrativa', 'outra')),
  constraint log_geracoes_ia_status check (status in ('sucesso', 'erro')),
  constraint log_geracoes_ia_erro check ((status = 'erro') = (erro is not null)),
  constraint log_geracoes_ia_numeros check (
    (tokens_entrada is null or tokens_entrada >= 0) and (tokens_saida is null or tokens_saida >= 0)
    and (custo is null or custo >= 0) and (duracao_ms is null or duracao_ms >= 0))
);

create index if not exists log_geracoes_ia_sessao_idx on log_geracoes_ia (sessao_id, criado_em desc);
create index if not exists log_geracoes_ia_criado_idx on log_geracoes_ia (criado_em desc);

comment on table log_geracoes_ia is
  'Banco 08 · Governança. Cada chamada à IA: retrato da entrada, saída, modelo, versão do prompt, tokens e custo. A entrada pode conter respostas da pessoa, por isso o log é apagado junto com a sessão e tem acesso restrito por RLS.';

create table if not exists log_acesso_sensivel (
  id              bigint generated always as identity primary key,
  tabela          text not null,
  chave           text not null,
  operacao        text not null default 'leitura',
  motivo          text not null,
  acessado_por    text not null default usuario_atual(),
  papel           text not null default papel_atual(),
  acessado_em     timestamptz not null default now(),
  constraint log_acesso_sensivel_tabela check (tabela in ('dados_sensiveis', 'consumidores_contato')),
  constraint log_acesso_sensivel_operacao check (operacao in ('leitura', 'exportacao', 'alteracao', 'exclusao')),
  constraint log_acesso_sensivel_motivo check (btrim(motivo) <> '')
);

create index if not exists log_acesso_sensivel_chave_idx on log_acesso_sensivel (chave, acessado_em desc);
create index if not exists log_acesso_sensivel_data_idx on log_acesso_sensivel (acessado_em desc);

comment on table log_acesso_sensivel is
  'Banco 08 · Governança. Quem leu dados sensíveis ou de contato, quando e por quê. Só inclusão (gatilho impede update e delete). As funções ler_dados_sensiveis e ler_contato gravam aqui automaticamente.';
comment on column log_acesso_sensivel.chave is 'sessao_id (dados_sensiveis) ou consumidor_id (consumidores_contato).';

create or replace trigger log_acesso_sensivel_imutavel
  before update or delete on log_acesso_sensivel
  for each row execute function impedir_alteracao();

create or replace function ler_dados_sensiveis(p_sessao_id text, p_motivo text)
returns setof dados_sensiveis
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_motivo is null or btrim(p_motivo) = '' then
    raise exception 'Informe o motivo do acesso aos dados sensíveis' using errcode = 'check_violation';
  end if;
  insert into log_acesso_sensivel (tabela, chave, operacao, motivo)
  values ('dados_sensiveis', p_sessao_id, 'leitura', p_motivo);
  return query select d.* from dados_sensiveis d where d.sessao_id = p_sessao_id;
end
$$;

comment on function ler_dados_sensiveis(text, text) is
  'Porta de leitura de dados_sensiveis para a equipe: devolve as respostas sensíveis de uma sessão e registra quem leu e por quê em log_acesso_sensivel. Execução negada a public, anon e authenticated: conceder só ao papel da equipe quando existir.';

create or replace function ler_contato(p_consumidor_id text, p_motivo text)
returns setof consumidores_contato
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_motivo is null or btrim(p_motivo) = '' then
    raise exception 'Informe o motivo do acesso ao contato' using errcode = 'check_violation';
  end if;
  insert into log_acesso_sensivel (tabela, chave, operacao, motivo)
  values ('consumidores_contato', p_consumidor_id, 'leitura', p_motivo);
  return query select c.* from consumidores_contato c where c.consumidor_id = p_consumidor_id;
end
$$;

comment on function ler_contato(text, text) is
  'Porta de leitura de consumidores_contato para a equipe, com registro em log_acesso_sensivel. Mesmas permissões de ler_dados_sensiveis.';


-- =============================================================================
-- VISÕES (security_invoker: respeitam o RLS de quem consulta)
-- =============================================================================

create or replace view vw_respostas_ia with (security_invoker = true) as
select r.sessao_id,
       r.questionario_versao,
       p.numero,
       r.pergunta_id,
       p.capitulo,
       p.tipo,
       p.enunciado,
       r.status,
       r.valor,
       r.opcoes_escolhidas,
       (select array_agg(o.rotulo order by o.ordem)
          from opcoes o
         where o.questionario_versao = r.questionario_versao
           and o.pergunta_id = r.pergunta_id
           and o.valor = any (r.opcoes_escolhidas)) as rotulos_escolhidos,
       r.atualizada_em
  from respostas r
  join perguntas p on p.questionario_versao = r.questionario_versao and p.id = r.pergunta_id;

comment on view vw_respostas_ia is
  'Banco 01. O que a IA pode ler: só a tabela respostas, com enunciado e rótulos. Nunca inclui dados_sensiveis nem consumidores_contato.';

create or replace view vw_lotes_alergenicos with (security_invoker = true) as
select l.id as lote_id, l.materia_n, l.fornecedor_id, l.codigo_lote, s.nome as substancia, s.cas, c.percentual, c.fonte
  from lotes l
  join lotes_composicao c on c.lote_id = l.id
  join substancias s on s.id = c.substancia_id
 where s.alergenico_ue;

comment on view vw_lotes_alergenicos is 'Banco 04. Alergênicos declarados em cada lote.';

create or replace view vw_restricoes_ifra_vigentes with (security_invoker = true) as
select distinct on (r.substancia_id, r.materia_n, r.categoria) r.*
  from restricoes_ifra r
 where r.vigente_novas_desde is not null
   and r.vigente_novas_desde <= current_date
   and (r.revogada_em is null or r.revogada_em > current_date)
 order by r.substancia_id, r.materia_n, r.categoria, r.emenda desc;

comment on view vw_restricoes_ifra_vigentes is
  'Banco 04. Restrição IFRA em vigor hoje para criações novas: por alvo e categoria, a da emenda mais recente já vigente.';

create or replace view vw_acordes_conferencia with (security_invoker = true) as
select a.id as acorde_id, a.nome, a.status, count(c.ordem) as componentes,
       coalesce(sum(c.percentual), 0) as soma_percentual,
       coalesce(sum(c.percentual), 0) = 100 as fecha_100
  from acordes a
  left join acorde_componentes c on c.acorde_id = a.id
 group by a.id, a.nome, a.status;

comment on view vw_acordes_conferencia is 'Banco 03. Soma dos percentuais de cada acorde (o Oriental do manual não fecha 100%).';

create or replace view vw_formulas_conferencia with (security_invoker = true) as
select f.id as formula_id, f.codigo, f.versao, f.status, f.concentracao_codigo, f.percentual_concentrado,
       k.concentrado_min_pct, k.concentrado_max_pct,
       count(c.ordem) as componentes,
       coalesce(sum(c.percentual_massa), 0) as soma_percentual,
       abs(coalesce(sum(c.percentual_massa), 0) - 100) <= 0.001 as soma_ok,
       f.percentual_concentrado between k.concentrado_min_pct and k.concentrado_max_pct as concentrado_ok
  from formulas f
  join concentracoes k on k.codigo = f.concentracao_codigo
  left join componentes_formula c on c.formula_id = f.id
 group by f.id, f.codigo, f.versao, f.status, f.concentracao_codigo, f.percentual_concentrado,
          k.concentrado_min_pct, k.concentrado_max_pct;

comment on view vw_formulas_conferencia is 'Banco 05. Conferência antes da aprovação: soma dos componentes e faixa de concentrado.';

create or replace view vw_formulas_substancias with (security_invoker = true) as
select f.id as formula_id, f.codigo, f.versao, s.id as substancia_id, s.nome as substancia, s.cas, s.alergenico_ue,
       count(distinct c.materia_n) as fontes,
       round(sum(c.percentual_massa * lc.percentual / 100), 6) as pct_no_concentrado,
       round(sum(c.percentual_massa * lc.percentual / 100) * f.percentual_concentrado / 100, 6) as pct_no_produto
  from formulas f
  join componentes_formula c on c.formula_id = f.id
  join lotes_composicao lc on lc.lote_id = c.lote_id
  join substancias s on s.id = lc.substancia_id
 group by f.id, f.codigo, f.versao, f.percentual_concentrado, s.id, s.nome, s.cas, s.alergenico_ue;

comment on view vw_formulas_substancias is
  'Banco 05. Cada substância de cada fórmula SOMANDO todas as fontes (ex.: cumarina da fava-tonca e do feno), no concentrado e no produto final. Usa a composição dos lotes informados nos componentes.';

create or replace view vw_formulas_ifra with (security_invoker = true) as
select fs.formula_id, fs.codigo, fs.versao, 'substancia'::text as alvo, fs.substancia as nome, fs.fontes,
       fs.pct_no_produto, r.padrao, r.emenda, r.tipo as tipo_restricao, r.limite_percentual,
       case r.tipo when 'proibicao' then true
                   when 'limite' then fs.pct_no_produto > r.limite_percentual end as excede
  from vw_formulas_substancias fs
  join vw_restricoes_ifra_vigentes r on r.substancia_id = fs.substancia_id and r.categoria = '4'
union all
select f.id, f.codigo, f.versao, 'materia_prima', m.nome, 1,
       round(sum(c.percentual_massa) * f.percentual_concentrado / 100, 6),
       r.padrao, r.emenda, r.tipo, r.limite_percentual,
       case r.tipo when 'proibicao' then true
                   when 'limite' then round(sum(c.percentual_massa) * f.percentual_concentrado / 100, 6) > r.limite_percentual end
  from formulas f
  join componentes_formula c on c.formula_id = f.id
  join materias_primas m on m.n = c.materia_n
  join vw_restricoes_ifra_vigentes r on r.materia_n = c.materia_n and r.categoria = '4'
 group by f.id, f.codigo, f.versao, f.percentual_concentrado, m.n, m.nome, r.padrao, r.emenda, r.tipo, r.limite_percentual;

comment on view vw_formulas_ifra is
  'Banco 05. Checagem IFRA da categoria 4 (perfume): cada substância (somando as fontes) e cada matéria-prima com restrição vigente, e se excede. Base para formulas.ifra_status.';


-- =============================================================================
-- 9. ROW LEVEL SECURITY
--
-- Ligado em TODAS as tabelas. Tabela com RLS e sem policy fica fechada para os
-- papéis da API (anon e authenticated no Supabase); o servidor do app usa a
-- service_role, que ignora o RLS. Assim, nada fica exposto por engano.
--
-- Leitura pública só para o que o questionário mostra a qualquer visitante:
-- questionarios, capitulos, perguntas, opcoes e modalidades.
--
-- Policies por pessoa dependem do login (contas.auth_user_id = auth.uid() no
-- Supabase) e ficam para quando ele existir. Exemplo, NÃO aplicado:
--
--   create policy titular_le_respostas on respostas for select to authenticated
--   using (exists (select 1 from sessoes s
--                    join consumidores c on c.id = s.consumidor_id
--                    join contas a on a.id = c.conta_id
--                   where s.id = respostas.sessao_id and a.auth_user_id = auth.uid()));
-- =============================================================================

-- Banco 01
alter table contas enable row level security;
alter table consumidores enable row level security;
alter table questionarios enable row level security;
alter table capitulos enable row level security;
alter table perguntas enable row level security;
alter table opcoes enable row level security;
alter table sessoes enable row level security;
alter table respostas enable row level security;

-- Contato (nome, e-mail, telefone). Política pretendida: só o servidor
-- (service_role) e a função ler_contato, que registra o acesso; no futuro, o
-- próprio titular lendo e corrigindo o seu contato (policy com auth.uid()).
-- A IA nunca lê esta tabela.
alter table consumidores_contato enable row level security;

-- Dados sensíveis (LGPD: sexo, gênero, vida afetiva, saúde). Política
-- pretendida: nenhuma leitura pela API. Só o servidor (service_role) e a função
-- ler_dados_sensiveis, que grava quem leu em log_acesso_sensivel. A IA só recebe
-- o que o servidor decidir mandar, com o consentimento da sessão aceito.
alter table dados_sensiveis enable row level security;

-- Banco 02
alter table tracos enable row level security;
alter table regras_traducao enable row level security;
alter table cruzamentos enable row level security;
alter table perfil_tracos enable row level security;
alter table aplicacoes_regras enable row level security;

-- Banco 03
alter table grupos_olfativos enable row level security;
alter table concentracoes enable row level security;
alter table lacunas_naturais enable row level security;
alter table afinidades enable row level security;
alter table acordes enable row level security;
alter table acorde_componentes enable row level security;
alter table perfumes_referencia enable row level security;
alter table perfumes_referencia_notas enable row level security;

-- Banco 04
alter table materias_primas enable row level security;
alter table substancias enable row level security;
alter table fornecedores enable row level security;
alter table lotes enable row level security;
alter table lotes_composicao enable row level security;
alter table restricoes_ifra enable row level security;
alter table veiculos enable row level security;

-- Banco 05
alter table formulas enable row level security;
alter table componentes_formula enable row level security;

-- Banco 06
alter table modalidades enable row level security;
alter table pedidos enable row level security;
alter table pedidos_status_historico enable row level security;
alter table pagamentos enable row level security;
alter table direitos_comerciais enable row level security;
alter table custos_producao enable row level security;

-- Banco 07
alter table avaliacoes enable row level security;

-- Banco 08
alter table textos_consentimento enable row level security;
alter table consentimentos enable row level security;

-- Logs. Política pretendida: só inclusão pelo servidor; leitura só pela
-- auditoria (papel próprio, a criar). Nenhum acesso pela API.
alter table log_geracoes_ia enable row level security;
alter table log_acesso_sensivel enable row level security;

-- Leitura pública do questionário e das modalidades (vale para todos os papéis).
drop policy if exists leitura_publica on questionarios;
create policy leitura_publica on questionarios for select using (true);
drop policy if exists leitura_publica on capitulos;
create policy leitura_publica on capitulos for select using (true);
drop policy if exists leitura_publica on perguntas;
create policy leitura_publica on perguntas for select using (true);
drop policy if exists leitura_publica on opcoes;
create policy leitura_publica on opcoes for select using (true);
drop policy if exists leitura_publica on modalidades;
create policy leitura_publica on modalidades for select using (true);

-- As funções de leitura com registro não podem ser chamadas pela API.
revoke all on function ler_dados_sensiveis(text, text) from public;
revoke all on function ler_contato(text, text) from public;
do $$
declare
  papel text;
begin
  foreach papel in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = papel) then
      execute format('revoke all on function ler_dados_sensiveis(text, text) from %I', papel);
      execute format('revoke all on function ler_contato(text, text) from %I', papel);
    end if;
  end loop;
end
$$;

commit;
