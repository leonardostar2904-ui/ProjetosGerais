# Banco de dados | Vertical de perfume ICARUS

Esquema PostgreSQL (15 ou superior, compatível com Supabase) de todo o banco planejado, alinhado aos
tipos TypeScript que já existem. Hoje o MVP grava no navegador (`lib/armazenamento.ts`); com este
esquema, trocar o localStorage pelo banco é mecânico.

| Arquivo | O que é |
|---|---|
| `schema.sql` | Tabelas, regras, gatilhos, visões e segurança (RLS) dos 8 bancos |
| `seed.sql` | Dados iniciais gerados dos arquivos `.ts`: questionário v1-52, catálogos, modalidades |
| `README.md` | Este guia |

## Como aplicar no Supabase

1. SQL Editor, nova query: colar `schema.sql` inteiro e rodar.
2. Nova query: colar `seed.sql` inteiro e rodar.
3. Conferir: `select count(*) from perguntas;` devolve 52 e `select count(*) from materias_primas;` devolve 100.

Os dois arquivos rodam numa transação e podem rodar de novo sem erro. Fora do Supabase:
`psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/schema.sql -f db/seed.sql`.

O linter do Supabase vai mostrar "RLS enabled, no policy" como informação nas tabelas que só o
servidor acessa. É intencional (ver Segurança).

## Organização

Um único schema (`public`) com 8 bancos lógicos. O banco de cada tabela abre o comentário dela
(`Banco 01 · Consumidores. ...`), visível no Table Editor do Supabase. Motivos: o Supabase expõe
`public` sem configuração extra, e os nomes das tabelas ficam iguais aos citados em
`lib/armazenamento.ts`. Separar em schemas depois é um `alter table ... set schema` por tabela.

| Banco | Tabelas | Para que serve |
|---|---|---|
| 01 Consumidores | `contas`, `consumidores`, `consumidores_contato`, `questionarios`, `capitulos`, `perguntas`, `opcoes`, `sessoes`, `respostas`, `dados_sensiveis` | Quem responde, o questionário versionado e as respostas. Contato e dados sensíveis ficam em tabelas próprias, fora do que a IA lê |
| 02 Psicologia e comportamento | `tracos`, `perfil_tracos`, `regras_traducao`, `aplicacoes_regras`, `cruzamentos` | Catálogo P001 a P012 e R01 a R21, e o resultado de cada execução do motor por sessão |
| 03 Inteligência olfativa | `grupos_olfativos`, `concentracoes`, `lacunas_naturais`, `afinidades`, `acordes`, `acorde_componentes`, `perfumes_referencia`, `perfumes_referencia_notas` | Conhecimento de perfumaria: famílias da #19, concentrações, acordes, pares que combinam, perfumes decompostos (#30) |
| 04 Matérias-primas | `materias_primas`, `substancias`, `fornecedores`, `lotes`, `lotes_composicao`, `restricoes_ifra`, `veiculos` | Catálogo com marcações de segurança, lotes com composição e alergênicos, limites IFRA versionados |
| 05 Formulações | `formulas`, `componentes_formula` | Fórmulas versionadas (cada mudança é uma linha nova), em % de massa |
| 06 Inteligência comercial | `modalidades`, `pedidos`, `pedidos_status_historico`, `pagamentos`, `direitos_comerciais`, `custos_producao` | Venda, etapas de produção, pagamento, exclusividade e custo real |
| 07 Aprendizado | `avaliacoes` | Avaliações de 7 e 30 dias depois da entrega |
| 08 Governança | `textos_consentimento`, `consentimentos`, `log_geracoes_ia`, `log_acesso_sensivel` | Consentimentos versionados, chamadas à IA e quem leu dados sensíveis |

Visões: `vw_respostas_ia` (o que a IA pode ler), `vw_formulas_conferencia`, `vw_formulas_substancias`,
`vw_formulas_ifra`, `vw_restricoes_ifra_vigentes`, `vw_lotes_alergenicos` e `vw_acordes_conferencia`.

Convenções: nomes em snake_case iguais aos campos do TS (`perguntaId` vira `pergunta_id`);
enumerações como check constraints; massa em gramas e percentuais em % de massa; dinheiro em
`numeric`. Tabelas espelhadas do TS usam o id texto que o app já gera (`cons_...`, `sess_...`); as
novas usam uuid.

## Do localStorage para o banco

| `lib/armazenamento.ts` | Tabela | Observação |
|---|---|---|
| `consumidores` `{ id, criadoEm }` | `consumidores` | Mesmo id do app |
| `contato` `{ consumidorId, nome, atualizadoEm }` | `consumidores_contato` | A q02 grava aqui; e-mail e telefone já têm coluna |
| `sessoes` (`Sessao`) | `sessoes` | `capitulosConcluidos` vira `smallint[]` |
| `respostas[sessao][pergunta]` (`RegistroResposta`) | `respostas` | Uma linha por pergunta. `valor` é o mesmo do TS, em jsonb. `questionario_versao` é copiada da sessão se vier vazia |
| `dadosSensiveis[sessao][pergunta]` | `dados_sensiveis` | Mesmo formato de `respostas` |
| `consentimentos` (`Consentimento`) | `consentimentos` e `textos_consentimento` | O texto fica uma vez em `textos_consentimento` (c1-2026-11); `consumidor_id` vem da sessão |
| `sessaoAtualId` | (não vai para o banco) | Estado da interface: continua no navegador |
| `versaoEsquema` | versão deste esquema (1) | |
| `ResultadoCruzamento` (`lib/motor`) | `cruzamentos`, `perfil_tracos`, `aplicacoes_regras` | Direção, candidatas e comercial ficam em jsonb no formato do TS |

Na prática, `carregarBanco` e `salvarBanco` viram leituras e gravações nessas tabelas pelo servidor
(rota ou server action com a chave `service_role`). Exemplo de uma resposta:

```sql
insert into respostas (sessao_id, pergunta_id, status, valor, atualizada_em)
values ('sess_...', 'q19', 'respondida', '["florais", "doces"]', '2026-11-02T21:00:00Z')
on conflict (sessao_id, pergunta_id)
do update set status = excluded.status, valor = excluded.valor, atualizada_em = excluded.atualizada_em;
```

## O que o banco garante

- Cada resposta é conferida contra o catálogo (gatilho `validar_resposta`): tabela certa para o destino
  da pergunta, formato por tipo, códigos de opção válidos, limite de seleções, opção exclusiva sozinha e
  obrigatória nunca marcada como pulada. Os códigos escolhidos ficam também em `opcoes_escolhidas`, com
  índice para busca.
- Toda pergunta sensível vai para `dados_sensiveis` e é opcional.
- Fórmula aprovada não muda: cada ajuste é uma versão nova. A aprovação exige perfumista, componentes
  somando 100%, concentrado dentro da faixa do tipo (ex.: EDP de 15% a 20%) e checagem IFRA "conforme".
- Limites IFRA guardam padrão, emenda, categoria e datas de vigência; a 52ª emenda entra como linhas
  novas. `vw_formulas_ifra` soma a mesma molécula vinda de várias matérias-primas (ex.: cumarina da
  fava-tonca e do feno), usando a composição de cada lote.
- Pedido só anda para a frente, só entra em produção com fórmula aprovada e guarda o histórico de status.
- Exclusividade e autorização para coleções futuras se excluem e ficam em `direitos_comerciais`, nunca
  no mesmo registro do consentimento de dados.
- Exclusão a pedido do titular: apagar o consumidor apaga sessões, respostas, dados sensíveis,
  consentimentos e logs de IA. Com pedido ou fórmula, o banco impede (registro fiscal e contratual);
  nesse caso, apagar `consumidores_contato` e `dados_sensiveis` da pessoa.

## Segurança (RLS)

- RLS ligado em todas as tabelas. Sem policy, a tabela fica fechada para `anon` e `authenticated`. O
  servidor do app usa a `service_role`, que ignora o RLS.
- Leitura pública só de `questionarios`, `capitulos`, `perguntas`, `opcoes` e `modalidades`.
- `dados_sensiveis` e `consumidores_contato`: só o servidor ou as funções `ler_dados_sensiveis` e
  `ler_contato`, que exigem motivo e registram quem leu em `log_acesso_sensivel` (que não aceita
  alteração nem exclusão). A execução dessas funções é negada a `anon` e `authenticated`.
- A IA lê só `vw_respostas_ia`, que não inclui dados sensíveis nem contato.
- Policies por pessoa dependem de login (`contas.auth_user_id = auth.uid()`). Há um exemplo comentado
  na seção 9 do `schema.sql`.

## Como o seed é gerado

`seed.sql` é gerado por script a partir dos arquivos `.ts` e não deve ser editado à mão. Os catálogos
de traços e regras saem da execução do próprio motor, então nome, tipo e evidência são os do código. O
cabeçalho traz o SHA-256 de cada arquivo-fonte: se `sha256sum lib/questionario/perguntas.ts | cut -c1-16`
não bater com o valor do cabeçalho, o seed está desatualizado. No fim, o seed confere as contagens e
desfaz tudo se algo não bater.

O seed nunca apaga linhas e não sobrescreve o que é preenchido no banco: propriedades olfativas das
matérias-primas, preço de modalidade já confirmado e textos de consentimento publicados.

Mudar texto de pergunta ou opção: editar o `.ts` e gerar o seed de novo, na pasta do projeto:

```bash
npx tsx db/ferramentas/gerar-seed.mts
```

O gerador está em `db/ferramentas/gerar-seed.mts` (fora da checagem de tipos do Next.js). Renomear ou
remover código de opção depois de haver respostas reais: criar versão nova do questionário (ex.: `v2-52`).

Validado em PostgreSQL 15.19, 16.15 e PGlite (PostgreSQL 18.6): esquema e seed aplicados duas vezes,
uma sessão completa do app gravada e lida de volta igual ao TS, e cada regra acima testada.

## O que ficou de fora, de propósito

- Login real: `contas` só guarda o vínculo; a chave estrangeira para `auth.users` está comentada.
- Policies por pessoa (dependem do login).
- Dados de `afinidades`, `acordes`, `perfumes_referencia`, `fornecedores`, `lotes`, `substancias`,
  `restricoes_ifra` e `veiculos`: só a estrutura. Esses dados vêm de perfumista, fornecedor e IFRA, não
  dos arquivos `.ts`.
- Volatilidade, persistência e papel no acorde das matérias-primas: colunas vazias, a preencher pelo
  perfumista.
- Condição de exibição (q32, q41): não é conferida na gravação, como no TS; `respostasValidas` filtra
  na leitura.
- Vocabulário de `palavras-chave.ts`: continua no código.
- Arquivos (certificados IFRA, laudos): só o caminho; o bucket de storage não foi criado.
- Endereço de entrega, nota fiscal, frete e cupom.
- Kit de amostras (decisão pendente). A validade de até 12 meses só é conferida quando o pedido é
  marcado como regime artesanal, que também é decisão pendente.
- Coerência entre modalidade e direitos (compartilhável com autorização, exclusivo com exclusividade):
  fica para o fluxo de compra.
- Migrações: `schema.sql` cria do zero. Mudar tabela que já existe pede migração (`alter table`).

## Migrações do Supabase

`supabase/migrations/` tem os mesmos dois arquivos (schema e seed) no formato da CLI do Supabase, sem
`begin;` e `commit;` (o Supabase já roda cada migração numa transação). Depois de mudar o schema ou
gerar o seed de novo, rode `node db/ferramentas/gerar-migracoes.mjs`. Mudança numa tabela que já tem
dados em produção pede uma migração nova (alter table), com data posterior, em vez de reescrever estas.
