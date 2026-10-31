# ENTRELINHAS · imagens da Coleção 01

Banco de imagens conceituais do desafio de portfólio AVESSO STUDIO, gerado por IA em 31/10/2026.
Marca e campanha são fictícias. As imagens devem ser declaradas no case como conceituais e geradas por IA.

## Onde estão as imagens

| Onde | O que tem | Como acessar |
|---|---|---|
| Figma, arquivo "AVESSO ENTRELINHAS imagens" | 84 imagens em 928x1152 (4:5), organizadas em grade: uma linha por peça, colunas Principal, Detalhe, Em uso, Outro ângulo. A primeira linha é campanha e categorias. | https://www.figma.com/design/e3Aj4WY6rc2yXEYWEd2GCX |
| `elevenlabs/` nesta pasta | H1, H2 e H3 em 1376x768 | arquivos JPG |
| Canva, biblioteca de uploads | H4 (bastidores, 1680x944) e uma cópia do H1 | https://www.canva.com/M/MAHZm8h2hF8 |

Para exportar do Figma: selecionar todos os frames (Ctrl+A na página), painel Export, JPG 1x, Export. Os arquivos saem com o nome do frame, que já tem o código da foto.

## Status

Prontas: **87 de 99**.
Faltam 12: MC2, CE2, BM2, CP2, CF2, SJ2, PJ2, BP2, CL2, JB2, CT2, CR2. Todas são fotos de detalhe de tecido.
Motivo: o crédito de IA do Figma acabou. Ele renova em 01/11/2026 às 00:00 UTC (21h no Rio), e a geração está agendada para retomar nesse horário.

## Catálogo: 23 peças

9 femininas, 13 masculinas e 1 acessório unissex. Fotos na ordem principal, detalhe, em uso, outro ângulo (✓ pronta, · falta).

| Código | Peça | Categoria | Gênero | Cor | Origem | Fotos |
|---|---|---|---|---|---|---|
| B | Camisa Bruma | Camisas | Feminina | Pergaminho | briefing | ✓✓✓✓ |
| E | Calça Eixo | Calças | Feminina | Grafite | briefing | ✓✓✓✓ |
| D | Colete Dobra | Terceiras peças | Feminina | Argila | briefing | ✓✓✓✓ |
| R | Regata Base | Camisas | Masculina | Pergaminho | briefing | ✓✓✓✓ |
| V | Jaqueta Vértice | Terceiras peças | Masculina | Oliva | briefing | ✓✓✓✓ |
| T | Bolsa Traço | Acessórios | Unissex | Grafite | briefing | ✓✓✓✓ |
| VF | Vestido Fresta | Vestidos e saias | Feminina | Grafite | nova | ✓✓✓✓ |
| SL | Saia Linha | Vestidos e saias | Feminina | Oliva | nova | ✓✓✓✓ |
| BS | Blusa Sombra | Camisas | Feminina | Pergaminho | nova | ✓✓✓✓ |
| CV | Calça Vão | Calças | Feminina | Argila | nova | ✓✓✓✓ |
| TP | Top Prumo | Camisas | Feminina | Névoa | nova | ✓✓✓✓ |
| MC | Macacão Cais | Calças | Feminina | Grafite | nova | ✓·✓✓ |
| CE | Camisa Esquadro | Camisas | Masculina | Grafite | nova | ✓·✓✓ |
| BM | Bermuda Marco | Calças | Masculina | Pergaminho | nova | ✓·✓✓ |
| CP | Camiseta Peso | Camisas | Masculina | Névoa | nova | ✓·✓✓ |
| CF | Calça Fôrma | Calças | Masculina | Oliva | nova | ✓·✓✓ |
| SJ | Sobrecamisa Laje | Terceiras peças | Masculina | Argila | nova | ✓·✓✓ |
| PJ | Polo Junta | Camisas | Masculina | Pergaminho | nova | ✓·✓✓ |
| BP | Blazer Planta | Terceiras peças | Masculina | Grafite | nova | ✓·✓✓ |
| CL | Calça Pilar | Calças | Masculina | Névoa | nova | ✓·✓✓ |
| JB | Jaqueta Beiral | Terceiras peças | Masculina | Pergaminho | nova | ✓·✓✓ |
| CT | Cardigã Trama | Terceiras peças | Masculina | Oliva | nova | ✓·✓✓ |
| CR | Calça Recuo | Calças | Masculina | Argila | nova | ✓·✓✓ |

As 6 peças "briefing" vêm do catálogo oficial do desafio. As 17 "novas" foram criadas para chegar às 23 pedidas. Elas não têm preço definido, porque o briefing proíbe inventar preços e nomes fora do catálogo; essa expansão é decisão do Kleber e precisa constar no case.
"Vestidos e saias" é uma categoria nova que o filtro do briefing não prevê.

## Pontos para revisar antes de usar

- O rosto de cada modelo varia entre fotos. O modelo usado gera cada imagem a partir de texto, sem referência de personagem.
- H2 e H3 do ElevenLabs saíram em 16:9. O H2 foi refeito no Figma em 4:5. O H3 pedia 3:2 e precisa de corte.
- E2 (detalhe da Calça Eixo) saiu em cinza médio, não em grafite.
- Conferir em todas: logotipos, letras ou marcas que a IA possa ter inventado.

## Arquivos de fonte

- `fonte/catalogo.py`: catálogo das 23 peças, elenco e gerador dos 99 prompts.
- `fonte/prompts.json`: os 99 prompts completos, com a base de estilo.
- `fonte/artefato_prompts.json`: os 37 prompts originais do artefato "Prompts ENTRELINHAS".
- `fonte/registro.tsv`: qual imagem saiu em qual ferramenta, com o nó do Figma.
- `fonte/ordem.json`: ordem de prioridade usada na geração.

Nas chamadas foi usada uma versão condensada da base de estilo, com as mesmas regras de paleta, luz, filme 35mm e proibição de marca.
