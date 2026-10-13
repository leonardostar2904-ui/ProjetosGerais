# EDITICARUS PRO

Fluxo e arquitetura de um editor de video multiplataforma, derivados da engenharia
reversa do CapCut Pro 9.5.0.4050 (documento em `referencias/`).

## Entregavel

`arquitetura/fluxo.html` — canvas navegavel (pan, zoom, painel de detalhe), 12 quadros:

| # | Quadro | O que responde |
|---|---|---|
| 01 | Principio | O achado central da engenharia reversa e o que copiar vs inverter |
| 02 | Arquitetura | As 7 camadas e a fronteira do que funciona offline |
| 03 | Jornada | Fluxo do usuario ponta a ponta e a conta de cliques |
| 04 | Dado | Ciclo de vida: entra, processa, armazena, descarta |
| 05 | Espera | Loadings longos, jobs assincronos e os 3 niveis de erro |
| 06 | Acesso | Entitlement por item e o corte entre gratuito e pago |
| 07 | Falhas | Raio de dano por componente e degradacao graciosa |
| 08 | Seguranca | OAuth2 + PKCE, onde cada segredo mora |
| 09 | Plataformas | Decisao de framework e o que de fato compartilha |
| 10 | Design System | Atomic design, escolha de biblioteca, o que e custom |
| 11 | Carga e custo | Volumetria, dimensionamento e a conta de nuvem |
| 12 | Veredito | Esforco real, custo de oportunidade e recomendacao |

Abrir direto no navegador. Sem build, sem dependencia, arquivo unico.
Deeplink por quadro: `fluxo.html#arquitetura`, `fluxo.html#veredito`, etc.

## Decisao central

O valor do CapCut Pro nao esta no codigo do cliente: esta no catalogo de servidor,
nos modelos de IA e na CDN. A engenharia reversa provou isso pelos dois lados
(zero strings de gating no `EffectPlatform.dll`, e o flag `is_vip` marcado como
`unknown-coverage` no JS).

A consequencia arquitetural e a inversao economica:

- **CapCut:** cobra pelo que e barato para ele (catalogo em CDN) e da de graca o
  que e caro (render na maquina do usuario). Faz sentido na escala da ByteDance.
- **EDITICARUS:** o que roda no device e gratuito e ilimitado (custo marginal zero),
  o que custa servidor e pago e explicito.

Isso nao e posicionamento de marketing, e estrutural: o CapCut nao pode copiar sem
destruir a propria receita, porque a IA dele e server side por decisao de arquitetura.

## Status

Documento de arquitetura. **Nenhum codigo de produto foi escrito.**

O quadro 12 sustenta por que: construir o produto completo sao 14 a 20 meses em
tempo integral, com receita zero no caminho. A recomendacao e usar o material como
ativo de posicionamento agora e testar a fatia estreita (remover fundo + legenda,
6 a 10 semanas) antes de qualquer decisao de construir o resto.

## Stack avaliada (detalhe no quadro 09)

- **Escolhido:** React + Vite na web, Tauri v2 no desktop, Expo + NativeWind no mobile
- **Nucleo:** TypeScript puro, sem DOM, 100% compartilhado entre as tres plataformas
- **Render:** WebGPU + WebCodecs, fallback WebGL2 + ffmpeg.wasm, FFmpeg nativo no desktop
- **IA:** ONNX Runtime (Web com WebGPU, nativo no mobile)
- **UI:** shadcn/ui sobre Radix com Tailwind
- **Recusados:** Flutter (joga fora o ecossistema web), Electron (plano B), Tamagui universal
