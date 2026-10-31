# Projetos Gerais

Repositorio dos projetos de cliente. Um diretorio por cliente.

## Clientes ativos

| Cliente | Entregaveis | Status |
|---|---|---|
| Barbearia do Douglas | Site + 12 templates de post | Em briefing |
| Pereira & Martins Contabilidade | Site + branding basico + 15 templates de post | Nao iniciado |
| BiblioMaison | Site + 7 templates de post | Nao iniciado |

## Portfolio

| Projeto | Entregaveis | Status |
|---|---|---|
| AVESSO Studio (desafio) | E-commerce de 5 paginas + case | Backlog montado, ver `portfolio/avesso-studio/board/` |

## Estrutura por cliente

```
clientes/<cliente>/
  site/       codigo do site
  conteudo/   copy, textos, dados coletados com o cliente
  posts/      especificacao dos posts e links dos templates no Canva
  branding/   so quando o escopo inclui identidade visual
  entrega/    checklist de entrega e handoff
```

## Decisoes tecnicas

**Stack dos sites:** Next.js (App Router) + Tailwind, deploy na Vercel.
Criterio: alem de entregar rapido, o codigo vira portfolio tecnico utilizavel
tanto em conversa comercial quanto em processo seletivo CLT.

**Posts:** construidos no Canva como templates de marca, nao como codigo.
O cliente consegue editar depois sem depender de mim, o que aumenta o valor
percebido da entrega e reduz suporte recorrente.

**Componentes compartilhados:** nao existem ainda, e isso e proposital.
Abstracao so sera extraida para `_base/` quando algo repetir de fato entre o
segundo e o terceiro site. Construir biblioteca antes do primeiro site ficar
pronto e otimizacao prematura.
