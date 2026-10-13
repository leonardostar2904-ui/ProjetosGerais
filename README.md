# Projetos Gerais

Repositorio dos projetos de cliente. Um diretorio por cliente.

## Clientes ativos

| Cliente | Entregaveis | Status |
|---|---|---|
| Barbearia do Douglas | Site + 12 templates de post | Em briefing |
| Pereira & Martins Contabilidade | Site + branding basico + 15 templates de post | Nao iniciado |
| BiblioMaison | Site + 7 templates de post | Nao iniciado |

## Projetos proprios

Alem dos clientes, este repositorio guarda os projetos da marca ICARUS em
`projetos/<projeto>/`.

| Projeto | Entregavel | Status |
|---|---|---|
| EDITICARUS PRO | Arquitetura e fluxo de editor de video multiplataforma | Documento de arquitetura, sem codigo de produto |

**Criterio de separacao:** `clientes/` e trabalho pago com prazo e escopo acordados.
`projetos/` e investimento proprio e compete por tempo com a prospeccao, entao cada
um precisa declarar no README o criterio que justifica continuar.

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
