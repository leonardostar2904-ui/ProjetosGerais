# ICARUS · Olfactory Experience (MVP)

Questionário de 52 perguntas em 10 etapas da vertical de perfume da ICARUS, com cruzamento das
respostas com a base de conhecimento de perfumaria. Versão para testar o fluxo como um usuário real.

## Como publicar (Vercel + Supabase + API do Claude)

**1. Banco no Supabase (uma vez).** O banco precisa das tabelas e dos catálogos antes do primeiro uso.
Dois caminhos:

- **Pelo SQL Editor (garantido).** No painel do projeto, SQL Editor, rode nesta ordem o conteúdo de
  `supabase/migrations/20261103120000_esquema_inicial.sql` e depois
  `supabase/migrations/20261103120100_dados_de_referencia.sql`. Os dois podem rodar de novo sem erro.
- **Pela integração com o GitHub.** A pasta `supabase/` segue o formato da CLI do Supabase
  (`config.toml` e `migrations/`). Na integração do projeto com o GitHub, aponte o diretório do Supabase
  para `icarus/perfume/formulario` (a pasta que contém `supabase/`). Não consegui abrir a documentação
  do Supabase desta sessão para conferir os nomes atuais dos campos; se a integração não aplicar as
  migrações, use o SQL Editor.

**2. Projeto na Vercel.** Add New, Project, importe o repositório `ProjetosGerais`, escolha a branch e,
em Root Directory, informe `icarus/perfume/formulario`. Em Settings, Environment Variables, cadastre:

| Variável | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | chave da API do Claude |
| `SUPABASE_URL` | `https://lusjmesjjypesvgxokqp.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | chave secreta do projeto (Project Settings, API). Nunca com prefixo `NEXT_PUBLIC_` |

As opcionais (modelo, esforço, buscas, limite diário, tempo máximo) estão em `.env.example`.
Depois de cadastrar, faça um novo deploy para as variáveis valerem.

**Sem as variáveis o app continua funcionando:** sem a chave da API, a tela final diz que a leitura
ainda não está ligada; sem o Supabase, a leitura aparece mas nada é gravado no banco.

Para testar no computador:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre em http://localhost:3000. A página da equipe fica em http://localhost:3000/bastidores.

## Como a criação funciona

Ao concluir, o navegador envia a sessão para `POST /api/criacao`. O servidor:

1. **Valida tudo de novo** (ids, opções, limites, condicionais, obrigatórias, consentimento). Pedido
   fora do formato é recusado.
2. **Grava no Supabase:** consumidor, contato (nome), sessão, respostas, dados sensíveis (tabela à
   parte) e consentimento. Se a sessão já tem leitura, devolve a mesma, sem chamar a IA de novo.
3. **Roda o motor** (perfil, regras, candidatas) e grava o cruzamento.
4. **Chama o Claude** (`claude-opus-5-5`, pensamento adaptativo, streaming) com três ferramentas:
   busca na web (até 4 por criação), consulta e registro de perfumes de referência no banco, e a
   entrega estruturada. Para os perfumes citados na pergunta 30, a IA consulta o banco primeiro; se não
   achar, pesquisa e **grava a pirâmide confirmada em `perfumes_referencia`**, com a URL da fonte. A
   próxima pessoa que citar o mesmo perfume já encontra no banco.
5. **Grava a proposta** como fórmula em rascunho (`formulas` e `componentes_formula`, origem `ia`) e o
   log da chamada (`log_geracoes_ia`: modelo, versão do prompt, tokens, duração).
6. **Devolve a leitura** para a tela de resposta. A tela de espera mostra as etapas reais.

**O que a IA recebe:** só as perguntas da tabela `respostas` (a mesma regra da visão
`vw_respostas_ia`). Nunca o nome e nunca `dados_sensiveis`: o texto de saúde da pergunta 32 não sai do
servidor. Restrições que vêm de respostas sensíveis (sem álcool, sem origem animal, revisão de
segurança) chegam como regra genérica, sem dizer de onde vieram.

**O que a pessoa vê:** título com o nome, abertura, pirâmide em palavras comuns, concentração, como
se comporta na pele, as respostas que viraram perfume e o próximo passo. Sem percentuais, sem número
do catálogo, sem pontuação de perfil e sem nome de perfume de terceiros. **A fórmula técnica** fica
nos bastidores e no banco, para o perfumista.

**Recusa da IA:** o pedido usa `fallbacks: "default"` (beta `server-side-fallback-2026-07-01`): se o
modelo recusar, a própria API tenta de novo no modelo recomendado. Se ainda assim falhar, a pessoa vê
a tela final com o botão "Tentar compor de novo".

**Custo:** sem login, qualquer pessoa com o link pode concluir e gerar uma leitura. Por isso existe o
teto diário (`ICARUS_IA_LIMITE_DIARIO`, padrão 40), contado no log do banco. Sem o Supabase ligado, o
teto não tem onde contar e não vale.

## O que está pronto

| Parte | Onde |
|---|---|
| 52 perguntas, 10 etapas, numeração, opções, limites, condicionais e sensíveis | `lib/questionario/perguntas.ts` e `capitulos.ts` (fonte única) |
| Progresso honesto (só perguntas aplicáveis; condicional escondida não conta) | `lib/questionario/progresso.ts` |
| Armazenamento no formato das tabelas do banco (respostas, dados sensíveis e contato separados) | `lib/armazenamento.ts` |
| Motor de cruzamento: perfil (P001 a P012), 21 regras de tradução, candidatas por camada, comercial | `lib/motor/` |
| Base de conhecimento: 100 matérias-primas do manual com alertas, concentrações, modalidades | `lib/conhecimento/` |
| Interface: 11 componentes do spec, artes por etapa, abertura, pergunta final, encerramento | `components/experiencia/` |
| Página da equipe com os 8 bancos e a proposta técnica da IA | `/bastidores` |
| Schema PostgreSQL dos 8 bancos, seed gerado do código e gerador | `db/` |
| Migrações do Supabase (geradas do schema e do seed: `node db/ferramentas/gerar-migracoes.mjs`) | `supabase/` |
| Rota da criação, validação do pedido, prompt, ferramentas e laço da IA | `app/api/criacao/`, `lib/ia/` |
| Gravação no Supabase pelo servidor | `lib/banco/servidor.ts` |
| Tela de espera e tela de resposta | `components/experiencia/CriandoScreen.tsx` e `ResultadoScreen.tsx` |

## Decisões desta versão (podem ser trocadas)

- **Obrigatórias (28):** escolhas e escalas que orientam a fórmula e não são sensíveis, mais o nome.
  **Opcionais (24):** todos os textos abertos, dados pessoais e de saúde e toda a etapa 07. Mudar é
  trocar `obrigatoria` em `perguntas.ts`.
- **Pergunta 41 (gestação)** aparece para quem não marcou "Masculino" na 4 (sugestão aprovada na
  definição das perguntas). **Pergunta 32** aparece só com "Sim" ou "Não sei" na 31.
- **Pergunta 34** (restrição ética ou religiosa) é tratada como reservada: revela crença, que a LGPD
  considera dado sensível. **Perguntas 39 e 40** (alimentação e estresse) são opcionais por terem peso
  fraco na fórmula, não por serem dados de saúde.
- **Respostas de condicionais** são apagadas quando a condição deixa de valer (ex.: a 31 muda para
  "Não"): nada escondido fica guardado ou é exportado.
- **Navegação:** o voltar do app e o do navegador andam juntos; nenhuma etapa à frente abre (por
  histórico ou pela âncora da URL) enquanto houver obrigatória em branco antes dela.
- **Consentimento** obrigatório antes de concluir, com texto versionado.
- **Sem cadastro de perfil** nesta versão, como pedido. O nome da pergunta 2 fica numa tabela de
  contato separada das respostas.
- **Rascunho no navegador, registro no servidor.** Enquanto a pessoa responde, tudo fica no
  localStorage. Ao concluir, a sessão vai para o Supabase. Os bastidores leem o navegador de quem
  abriu; o histórico de todas as pessoas está no banco.
- **Sem login obrigatório**, como pedido. Cada sessão tem um consumidor anônimo; a tabela `contas`
  já existe para quando o login entrar.
- **Imagens:** só material do Brand Book (texturas, banco de fotos e mockup de embalagem). Recortes
  em `public/marca/familias/`. Para trocar por fotos novas, substitua os arquivos com o mesmo nome.
- **Link de bastidores** na tela final: desligue em `lib/config.ts` antes de abrir para o público.

## O que NÃO existe ainda

- Validação de perfumista dentro do sistema (a proposta fica como rascunho no banco), checagem IFRA
  automática da fórmula, login, pagamento.
- Painel da equipe lendo do Supabase: os bastidores ainda mostram o que está no navegador.
- Teste com a API real do Claude e com o Supabase real: nesta entrega, a rota foi testada contra uma
  API simulada e o banco contra um Postgres local com as mesmas migrações (ver o relatório da entrega).
