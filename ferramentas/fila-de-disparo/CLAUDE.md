# Fila de Disparo · mapa para o Claude

Ferramenta de prospecção pelo WhatsApp em uma página só (HTML, CSS e JavaScript puro, sem build).
Um lead por vez: arte 1080 x 1350 com o nome do lead, mensagem pronta, link do WhatsApp Web,
registro do envio, segunda mensagem, revisão do retorno, pendências e proposta em PDF.
O guia completo para pessoas está em `Guia_Fila_de_Disparo.pdf`.

## Arquivos

| Arquivo | O que tem | Quando mexer |
|---|---|---|
| `config.js` | Tudo que muda de um negócio para outro: vendedor, cores, limites, regiões, faixas, produtos, mensagens, nichos, textos das artes e da proposta | Quase sempre. Comece por aqui |
| `index.html` | Interface, cronograma do dia, boas práticas, roteiros, método, lógica da fila e desenho das artes (canvas) | Para mudar telas, cronograma, roteiros ou comportamento |
| `proposta-gerador.js` | Estrutura das 7 páginas da proposta (jsPDF, texto vetorial) | Para mudar a estrutura do PDF |
| `proposta-ativos.js` | Fontes embutidas no PDF (OFL) e imagens opcionais (`logo`, `logo-claro`, `capa`, `papel`) em data URL | Para colocar logo ou imagem na proposta |
| `pecas/` | Artes próprias opcionais (`<nicho>-<A|B|C>.jpg`) | Só com `arte.imagensProprias: true` |

## Regras do projeto

- Texto adaptável fica no `config.js`, não espalhado no HTML. Marcadores `{vendedor}`, `{empresa}`,
  `{produto1}`, `{nome}` etc. são trocados por `fill()` (index.html) e `preencher()` (gerador).
  `[colchetes]` são lembretes para a pessoa completar na hora; não são trocados.
- Cada nicho em `CONFIG.nichos` é autocontido (abertura, segunda, exemplo, oferta, arte, proposta).
  Para criar um nicho, copie um bloco inteiro e troque a chave. `proposta` pode ser objeto ou
  função `(lead) => objeto` (o nicho `salao` usa função para ajustar o gênero).
- O nicho de um lead é o campo `nicho`. Chave inexistente cai no primeiro nicho do config.
- Telefone no formato `55` + DDD + número, só dígitos (ex.: `5521999999999`). Validação no formulário.
- Sem dependências novas. jsPDF 2.5.1 é carregado do cdnjs só quando a proposta é gerada.

## Onde os dados ficam

- Fora do Claude: `localStorage`, chave `fila-disparo-v1` (array de leads). Só neste navegador.
- Publicada como Artifact com o recurso `db`: coleção `leads` (um documento por lead, id = chave).
  O recurso `downloads` é usado para salvar imagem e PDF quando existe; senão, download comum.
- Outras chaves locais: `fila-cron-AAAA-MM-DD` (cronograma do dia), `fila-filtro`, `fila-filtro2`,
  `fila-optsite`, `fila-optvagas`, `fila-propde`.

## Modelo de um lead

```json
{
  "id": "m1abc",                 // obrigatório e único
  "nome": "Clínica Exemplo",     // obrigatório: vai na arte, na mensagem e na proposta
  "fone": "5521999999999",       // obrigatório para abrir o WhatsApp
  "nicho": "clinica",            // chave de CONFIG.nichos
  "sub": "Clínica odontológica", // rótulo livre do tipo de negócio
  "regiao": "zona-sul",          // chave de CONFIG.regioes
  "cidade": "Cidade", "bairro": "Bairro",
  "nota": 4.8, "avaliacoes": 120, // do Google; entram na mensagem se existirem
  "placeId": "",                 // Google Maps place_id, gera o link "Ver no Google Maps"
  "nomeGoogle": "",              // nome como está no Google, se diferente
  "dono": true,                  // true = o dono lê o WhatsApp (formato "Dono")
  "fecha": "18h", "sabado": "fechado", "domingo": "fechado", // horário entra na mensagem
  "sinal": "",                   // nota interna "por que este lead"
  "tier": "",                    // força a faixa A, B ou C
  "variante": "C",               // modelo de arte inicial: A, B ou C
  "status": "fila",              // fila | enviado | respondeu | pulado
  "ordem": 1,
  // preenchidos pela página: canal, enviadoEm, retorno (auto | pessoa | nao), retornoEm,
  // etapa, followEm, followTipo, propostaEm, revisadoEm, varianteEnviada
  // pendência quente (opcional): proxAcao, proxQuando, prioridade (1 = mais urgente),
  // msgPronta, crm, origem, proxFeitaEm, historico [{ em, acao }]
}
```

## Como testar depois de mudar

1. Servidor local na pasta: `npx http-server -p 8080` ou `python3 -m http.server 8080`.
2. Abra `http://localhost:8080`, adicione um lead pelo formulário e confira arte, mensagem,
   registro do envio, Revisão dos enviados e "Gerar PDF".
3. Console do navegador sem erros. Teste também em largura de celular (390 px).
