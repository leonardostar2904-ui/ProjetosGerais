# ICARUS · Olfactory Experience (MVP)

Questionário de 52 perguntas em 10 etapas da vertical de perfume da ICARUS, com cruzamento das
respostas com a base de conhecimento de perfumaria. Versão para testar o fluxo como um usuário real.

## Como publicar na Vercel

A Vercel não importa arquivo zip pelo painel. Dois caminhos:

**A. Pelo GitHub (recomendado).** No painel da Vercel: Add New, Project, importe o repositório
`ProjetosGerais`, escolha a branch e, em Root Directory, informe `icarus/perfume/formulario`.
Framework: Next.js (detectado sozinho). Não precisa de variável de ambiente.

**B. Pelo terminal, a partir do zip.** Descompacte, entre na pasta e rode:

```bash
npx vercel
```

Para testar no computador antes:

```bash
npm install
npm run dev
```

Abre em http://localhost:3000. A página da equipe fica em http://localhost:3000/bastidores.

## O que está pronto

| Parte | Onde |
|---|---|
| 52 perguntas, 10 etapas, numeração, opções, limites, condicionais e sensíveis | `lib/questionario/perguntas.ts` e `capitulos.ts` (fonte única) |
| Progresso honesto (só perguntas aplicáveis; condicional escondida não conta) | `lib/questionario/progresso.ts` |
| Armazenamento no formato das tabelas do banco (respostas, dados sensíveis e contato separados) | `lib/armazenamento.ts` |
| Motor de cruzamento: perfil (P001 a P012), 21 regras de tradução, candidatas por camada, comercial | `lib/motor/` |
| Base de conhecimento: 100 matérias-primas do manual com alertas, concentrações, modalidades | `lib/conhecimento/` |
| Interface: 11 componentes do spec, artes por etapa, abertura, pergunta final, encerramento | `components/experiencia/` |
| Página da equipe com os 8 bancos | `/bastidores` |
| Schema PostgreSQL dos 8 bancos | `db/` |

## Decisões desta versão (podem ser trocadas)

- **Obrigatórias (28):** escolhas e escalas que orientam a fórmula e não são sensíveis, mais o nome.
  **Opcionais (24):** todos os textos abertos, dados pessoais e de saúde e toda a etapa 07. Mudar é
  trocar `obrigatoria` em `perguntas.ts`.
- **Pergunta 41 (gestação)** aparece para quem não marcou "Masculino" na 4 (sugestão aprovada na
  definição das perguntas). **Pergunta 32** aparece só com "Sim" ou "Não sei" na 31.
- **Consentimento** obrigatório antes de concluir, com texto versionado.
- **Sem cadastro de perfil** nesta versão, como pedido. O nome da pergunta 2 fica numa tabela de
  contato separada das respostas.
- **Dados ficam no navegador** de quem responde (localStorage). Para coletar respostas de outras
  pessoas, o próximo passo é ligar um banco (Supabase), trocando só `carregarBanco` e `salvarBanco`.
- **Imagens:** só material do Brand Book (texturas, banco de fotos e mockup de embalagem). Recortes
  em `public/marca/familias/`. Para trocar por fotos novas, substitua os arquivos com o mesmo nome.
- **Link de bastidores** na tela final: desligue em `lib/config.ts` antes de abrir para o público.

## O que NÃO existe ainda

- IA de formulação e leitura de sentido dos textos livres (os textos ficam numa fila, visível nos bastidores).
- Fórmula, notas ou proporções para o cliente. A tela final não simula análise.
- Validação de perfumista, banco de dados real, cadastro, pagamento.
