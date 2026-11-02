# Questionario | Vertical de perfume ICARUS

Versao v0. Formulario em 9 etapas que coleta o perfil do cliente para a geracao
da formula personalizada.

## O que esta pronto

- 9 etapas: sobre voce, personalidade, rotina, gostos, roda de amigos, vida afetiva,
  seu perfume, voar mais alto, consentimento.
- Validacao das perguntas obrigatorias (marcadas com `*`).
- Progresso salvo no navegador: fechar a aba nao perde as respostas.
- Tela final com download das respostas em JSON.
- Mobile first, paleta ICARUS (#0D1B2A, #E0E0E0, #A7A9AC).

## O que NAO esta pronto (de proposito)

- Envio das respostas a um servidor. Hoje ficam so no navegador.
- Geracao da formula por IA e banco de essencias.
- Escolha de preco/formato (R$ 180, R$ 600, revenda, exclusividade).
- Pagamento.

## Como editar as perguntas

Tudo fica em `lib/questions.ts`. Cada pergunta tem um `id` estavel: e a chave que
a IA vai ler depois, entao nao renomeie ids de perguntas ja respondidas por alguem.

Tipos disponiveis: `text`, `longtext`, `single`, `multi` (com `maxSelect`),
`scale` (1 a 5 com rotulos nas pontas) e `consent`.

## Rodar

```bash
npm install
npm run dev
```

Abre em http://localhost:3000. Stack: Next.js (App Router) + Tailwind, igual aos
sites de cliente do repositorio.
