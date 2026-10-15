# Unique Energy

**Status:** em prospeccao (ideia de projeto enviada, sem escopo nem valor fechados)
**Contato:** Marcos, fundador. Conversa por WhatsApp em 15/10/2026: pediu para receber a ideia por ali.
**Empresa:** usinas fotovoltaicas estruturadas como ativo de investimento. Frentes: construcao, operacao, assinatura. Publico: investidores, empresas medias e grandes, parceiros.

## Restricoes

- Site, trafego e social da Unique sao feitos pela Hias. Nao oferecer site, nao comentar o estado do site, nao comparar.
- O fluxo proposto comeca no momento em que alguem chama a Unique (atendimento, CRM, ClickUp, acompanhamento do cliente). Nao toca em site, trafego ou redes.
- Nenhum valor no documento. Preco se negocia na conversa, depois de entender o que ja existe.

## O que foi lembrado da conversa de fevereiro/2026

- Ampliar o uso do ClickUp.
- CRM conectado ao ClickUp: quando um negocio fecha, nasce o projeto com acompanhamento.
- Atendimento com IA integrado a tudo.
- Nao se sabe o que a Hias chegou a implementar desde entao. O documento trata tudo como "a confirmar".

## Entregavel

`proposta/ICARUS-x-Unique-Energy-Fluxo-de-Operacao.pdf` (8 paginas, A4, marca ICARUS com as duas logos).

Estrutura (v2, escrita com o cliente como leitor): Capa, 01 O que a Unique ganha, 02 O que mapeamos (seis pontos, sem licao de casa), 03 O fluxo (seis etapas), 04 As camadas (cinco, ordem livre), 05 Na pratica (cenario ilustrativo), 06 Proximo passo (levantamento de 20 min, desenho final em ate uma semana, primeira camada no ar), Contracapa.

Regras de texto: uma chamada so (levantamento de 20 minutos), sem a palavra "conversa", sem "passo pequeno" e sem "pouco feito vale mais que muito planejado". A ideia de comeco aparece como primeiro degrau: comeca simples, vai longe.

Relacao com a oferta: camadas 01, 02 e 05 = Operacao Comercial Inteligente. Camadas 03 e 04 = ampliacao especifica para a Unique (ponte CRM para ClickUp e acompanhamento do cliente).

## Como regerar o PDF

```
cd clientes/unique-energy/proposta
NODE_PATH=/opt/node-tools/node_modules node build.js
```

Fonte do documento: `proposta/index.html`. Fontes (Archivo, Instrument Serif, IBM Plex Mono) em `proposta/fonts/`. Logos extraidos dos dois brandbooks em `proposta/assets/`.

## Proximos passos

1. Enviar o PDF para o Marcos pelo WhatsApp.
2. Levantamento de 20 minutos por chamada para mapear os seis pontos.
3. Voltar com o fluxo ajustado ao que ja existe e escolher uma camada para comecar.
