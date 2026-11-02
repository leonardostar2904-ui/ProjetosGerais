# Análise do Manual de Engenharia de Perfumaria Fina

| Item | Informação |
|---|---|
| Fonte | `manual-engenharia-perfumaria-fina.pdf` (11 páginas), enviado por Leonardo em 02/11/2026 |
| Leitura | Completa. Os trechos encobertos pelo layout (topo das páginas 3, 7, 8, 9 e 11) foram recuperados pela camada de texto do PDF |
| Pesquisa complementar | Buscas na web em 02/11/2026 sobre IFRA, Anvisa, biodiversidade e espécies protegidas (fontes na seção 9) |
| Limite desta análise | Os sites gov.br, IFRA e de escritórios não puderam ser abertos nesta sessão (bloqueio de rede). As confirmações vieram de resultados de busca com várias fontes coincidentes. Ler os textos oficiais antes de qualquer decisão regulatória |
| Arquivos gerados | `CATALOGO-MATERIAS-PRIMAS.md` (100 matérias-primas com alertas) e `REFERENCIAS-TECNICAS.md` (pirâmide, acordes, concentrações, pele, produção, regulatório) |

Legenda usada nos três arquivos: [M] manual · [P] confirmado em pesquisa · [I] inferência nossa · [V] a verificar.

---

## 1. Conclusão

O manual é uma **boa base para os Bancos 03 (inteligência olfativa) e 04 (matérias-primas)** e para as
regras de pele. Ele foi, inclusive, a origem das perguntas #35 a #42 do questionário. Mas **não é suficiente,
sozinho, para gerar fórmulas**: faltam família olfativa por matéria-prima, composição e alergênicos, custos,
limites IFRA atualizados, base oleosa, cautelas na gestação e o inventário de sintéticos da linha Essencial.

Quatro achados mudam decisões do projeto:

1. **A Anvisa criou um regime para perfumaria artesanal** (RDC 1.045/2026 e IN 474/2026), em vigor a
   partir de cerca de 04/12/2026, sem registro, sem notificação e sem AFE. Isso pode definir o modelo de
   produção da ICARUS (seção 4).
2. **O manual omite restrições importantes:** bálsamo do Peru bruto é proibido, óleo de verbena é proibido,
   estragão é praticamente inviável, quatro cítricos prensados e o cominho são fototóxicos, e oud e pau-rosa
   são controlados pela CITES.
3. **Os acordes do manual usam sintéticos**, e o Fougère passa do limite de cumarina se for usado como
   concentrado inteiro de um EDP. A linha Atelier, prometida como natural, não pode usá-los como estão.
4. **Um perfume leva de 4 a 9 semanas do pedido à entrega**, por causa da maturação e da maceração. Isso afeta
   promessa de prazo, status de pedido e fluxo de caixa.

## 2. O que o manual cobre e onde entra no projeto

| Módulo do manual | Conteúdo | Destino | Uso |
|---|---|---|---|
| 1. Laboratório | Balança 0,001 g, pesagem por massa, vidraria, veículos alcoólicos | Banco 04 (veículos), produção | Padrão de unidade do banco: gramas e % de massa |
| 2.1 Pirâmide | Camadas, volatilidade, duração | Banco 03 | Propriedades de cada nota |
| 2.2 Método Carles | Base, modificador, harmonizador; proporção de base | Banco 03, regras de tradução | Estrutura de acordes; liga a #29 (duração) ao peso da base |
| 2.3 Inventário | 100 matérias-primas com camada e combinações | Bancos 03 e 04 | Catálogo inicial e tabela de afinidades |
| 2.4 Acordes | Chypre, Fougère, Oriental com percentuais | Banco 03 (acordes) | Referência, com correções |
| 3. Pele | pH, hidratação, microbioma, dieta, hormônios | Regras de tradução | Ajustes das perguntas #35 a #42 |
| 3.2 Anamnese a distância | Questionário, kit de amostras, diário de teste | Fluxo do produto | Sugestão de kit de amostras (seção 5) |
| 3.3 Sem gênero | Gênero é convenção de proporção | Regras | Confirma: gênero não filtra notas |
| 4. Estabilização | Maturação, maceração, quebra fria, filtração | Banco 06 (pedidos) | Etapas e prazos de produção |
| 5.1 Concentrações | EDC a Extrait, com duração e projeção | Banco 05, regras | Liga #28 e #29 ao tipo de concentração |
| 5.2 Nicho x designer | Faixas de preço e tipo de insumo | Banco 06 | Referência de mercado para Essencial e Atelier |
| 5.3 IFRA | Cinco itens restritos ou proibidos | Banco 04 | Ponto de partida, ampliado pela pesquisa |
| 6. Contratipos | Dois casos, protocolo de 7 fases, curva de 30 dias | Produção, `perfumes_referencia` | Processo e custo de referência; nunca vender como contratipo |

## 3. Correções e ressalvas ao manual

| Ponto do manual | O que verificamos | Status |
|---|---|---|
| "IFRA 51ª emenda" | Vigente. A 52ª está em andamento: 48 novas restrições por sensibilização da pele, notificação prevista entre o fim de 2026 e janeiro de 2027, valendo para criações novas 11 meses depois | Confirmado, com atualização [P] |
| Só a bergamota é sinalizada como fototóxica | Limão, lima e laranja-amarga prensados, grapefruit e cominho também contêm compostos fototóxicos. No Brasil, com sol forte e perfume no pescoço, isso pesa | Ampliado [P] [V] |
| Bálsamo do Peru (#90) listado sem alerta | A forma bruta é **proibida** pela IFRA; só extratos, com limite | Corrigido [P] |
| "Verbena de Espanha" (#13) sem espécie | O óleo de verbena (Lippia citriodora) é **proibido** pela IFRA e pela UE; só o absoluto é permitido | Corrigido [P] |
| Estragão (#55), tagetes (#35), cálamo (#85) sem alerta | Estragol com limite muito baixo; tagetes restrita (T. erecta proibida); asarona do cálamo com limite | Corrigido [P] [V] |
| Acorde couro (#100) listado como matéria-prima | É um acorde. Bétula bruta é proibida; só a retificada | Corrigido [P] |
| Musgo de carvalho restrito | Correto. Na UE, atranol e cloroatranol são proibidos desde 2019/2021 | Confirmado [P] |
| Lilial e Lyral proibidos | Correto | Confirmado [P] |
| SD Alcohol 39-C (DEP) "proibido na UE" | Impreciso. O comitê científico da UE avaliou o DEP como seguro nos níveis usuais (2002, 2003 e 2007). Evitar é escolha de posicionamento | Corrigido [P] [V] |
| "100 matérias-primas naturais" | Uma é acorde. Seringa, lótus, borônia, frangipani e açafrão quase não existem como naturais acessíveis. Oud e pau-rosa estão na CITES | Ressalva [P] [I] |
| Acordes "consagrados" (2.4) | Usam Iso E Super, cumarina, eugenol, vanilina, Ambroxan e Habanolida. O Fougère, como concentrado inteiro de um EDP, leva a cumarina a 2,25% a 3%, acima de 1,5%. O Oriental não soma 100% | Corrigido [P] [I] |
| "Formular só por peso" (1.1) | Os casos 6.2 e 6.3 do próprio manual usam mL | Inconsistência interna. No banco, tudo em gramas [I] |
| Pele (3.1) | Hidratação e oleosidade são as mais sólidas; pH e estresse têm evidência mais fraca | Usar como pesos, sem promessa científica [I] |
| Contratipos (módulo 6) | Útil como referência técnica | Não usar nomes de marcas de terceiros para vender [I] |

## 4. Achado estratégico: regime artesanal da Anvisa

**O que é [P]:** a Lei 15.154/2025 mandou a Anvisa criar um regime simplificado para cosméticos e perfumes
artesanais. A RDC 1.045/2026 (requisitos) e a IN 474/2026 (lista de produtos) foram aprovadas em 30/09/2026,
publicadas no DOU em 05/10/2026 e entram em vigor 60 dias depois, por volta de **04/12/2026**.

| Regra | Conteúdo (segundo as fontes encontradas) |
|---|---|
| Dispensas | Registro ou notificação na Anvisa e AFE. Licença sanitária local automática, com fiscalização posterior |
| Critérios cumulativos | Produção predominantemente manual, com participação direta do produtor, em pequena escala; baixo risco microbiológico; processo simples; alegações só sensoriais ou funcionais básicas |
| **Terceirização** | **Vedada** |
| Produtos (IN 474) | Inclui "perfumes e outros produtos de perfumaria com base alcoólica". Óleos corporais aparecem como grupo separado |
| Rótulo | Nome, ingredientes, datas de fabricação e validade, endereço de produção, peso ou volume, advertências e a expressão "PRODUTO ARTESANAL" |
| Validade | No máximo 12 meses a partir da fabricação |
| Canais de venda | Lojas, feiras, redes sociais, site e marketplaces |
| Responsabilidade | A segurança do produto é do produtor |

**O que isso significa para a ICARUS [I]:** passam a existir dois caminhos de produção.

| | A. Artesanal (a ICARUS produz) | B. Laboratório com AFE (terceirizado) |
|---|---|---|
| Custo regulatório | Baixo | Alto: o laboratório precisa ter AFE e cada produto entra no regime comum |
| Quem produz | Você ou alguém da ICARUS, à mão | O laboratório |
| Fórmula única por cliente | Compatível | A notificar como Grau 1; o tratamento de fórmulas únicas precisa ser confirmado |
| Escala | Pequena, por definição | Maior |
| Posicionamento | "PRODUTO ARTESANAL" no rótulo combina com o nome "Atelier" | Mais industrial |
| Papel do perfumista | Consultor que valida fórmulas (a confirmar se isso conta como terceirização) | Pode ser do próprio laboratório |
| Risco | A responsabilidade pela segurança é sua; o banco de dados com IFRA e alergênicos passa a ser a prova de cuidado | Dividido com o laboratório |

O protocolo de fabricação do manual (seção 6.3) já descreve exatamente uma produção manual em pequena escala.

**Pontos a confirmar no texto oficial [V]:**
1. O que é "pequena escala" (há limite de volume ou de faturamento?).
2. Se perfume em base oleosa entra como perfume ou como óleo corporal.
3. Se a consultoria de um perfumista externo conta como terceirização.
4. Exigências de rótulo específicas para perfume (advertências, alergênicos).

O regime artesanal não dispensa a Lei 13.123 (biodiversidade) nem as boas práticas de segurança (IFRA).

## 5. Achados de produto e operação

**Prazo [I].** Pelo protocolo do manual, a produção leva de 35 a 46 dias (maturação, 30 dias de maceração,
quebra fria, filtragem e envase). O mínimo citado pelo manual para EDP é cerca de 20 dias. Com formulação,
validação e envio, o cliente recebe entre 4 e 9 semanas após o pedido. Consequências: o Banco 06 precisa dos
status de produção (em formulação, maturando, macerando, quebra fria, envase, enviado), a promessa de prazo
do site precisa refletir isso, e o caixa recebe antes de entregar.

**Natural x fixação [I].** O Atelier promete "naturais de máxima qualidade" e "maior fixação". Fixadores
naturais existem (lábdano, benjoim, vetiver, patchouli, íris, ambreta, sândalo, copaíba), mas parte da
fixação e do rastro dos perfumes modernos vem de sintéticos como Ambroxan e almíscares. Antes de prometer as
duas coisas juntas, validar com perfumista. Alternativa de promessa: "predominância de matérias-primas
naturais".

**Cobertura do questionário [I].** O inventário tem 42 itens no grupo Frescos e só 9 em Doces e gourmand.
Algumas opções do questionário quase não existem em versão natural no inventário: "mar" (#19), "couro" e
"tabaco" (#19), e "chá", "vinho tinto" e "champagne" (#25). Para a linha Atelier, é preciso buscar naturais
específicos (absoluto de tabaco, absoluto de chá) ou avisar o cliente. Na linha Essencial, sintéticos cobrem
essas notas.

**Custo [M] [I].** O manual só traz o orçamento de um contratipo feito com essência pronta: R$ 420 por lote
(R$ 350 de insumos e R$ 70 de frascos), sem rendimento informado. Se a concentração fosse a do caso 2 (22%),
120 mL de essência renderiam cerca de 545 mL, ou 10 frascos de 50 mL, a cerca de **R$ 42 por frasco**. Isso
é uma inferência e serve só como piso para a linha Essencial com essência pronta, nunca para o Atelier. O
manual também cita faixas de mercado (designer de R$ 180 a R$ 300; nicho a partir de R$ 600) que coincidem
com Essencial e Atelier. É referência do manual, não validação de preço.

**Kit de amostras [M] [I], fora do escopo atual.** O manual recomenda, na personalização a distância,
enviar flaconetes de 2 a 5 mL e pedir ao cliente um diário de teste (0 h, 2 h e 8 h). Aplicado à ICARUS:
questionário, IA propõe 2 ou 3 direções, kit de amostras, cliente testa e escolhe, fórmula final. Vantagens:
reduz o risco de o cliente receber um perfume que nunca testou na pele, pode virar produto de entrada pago e
ocupa o tempo de maceração. **Só entra no projeto com sua autorização.**

**Biodiversidade brasileira [P] [I].** Seis matérias-primas são nativas (priprioca, pau-rosa, copaíba,
cabreúva, candeia e breu-branco). Elas podem ser um diferencial forte da marca, mas pela Lei 13.123 exigem
cadastro no SisGen. Se o ingrediente for usado como **apelo de marketing** ou definir o cheiro, há
repartição de benefícios (1% da receita líquida anual do produto, ou acordo). Usado só como coadjuvante, é
tratado como excipiente. O pau-rosa, além disso, é espécie ameaçada e está na CITES. Confirmar com
especialista antes de usar biodiversidade brasileira na comunicação.

## 6. Lacunas: o que falta para gerar fórmulas

| Lacuna | Perguntas ou bancos afetados | Quem resolve |
|---|---|---|
| Família olfativa por matéria-prima (inferida por nós) | #19, Banco 03 | Perfumista valida |
| Composição e alergênicos por lote | #31, #32, Banco 04 | Fornecedor: certificado IFRA e declaração de alergênicos |
| Limites IFRA numéricos atualizados por matéria-prima | Todas as fórmulas | Biblioteca pública da IFRA e perfumista |
| Base oleosa: veículos, concentração, maceração, oxidação, validade | #34 "Álcool" | Perfumista e pesquisa |
| Cautelas por matéria-prima na gestação e em mudanças hormonais | #41, #42 | Toxicologista ou perfumista |
| Inventário de sintéticos para a linha Essencial | Modalidade Essencial | Fornecedor ou casa de fragrâncias |
| Custo por grama e fornecedores no Brasil | Banco 06 | Cotações |
| Naturais para mar, couro, tabaco, chá, vinho e champagne | #19, #25 | Pesquisa e perfumista |
| Perfumes comerciais decompostos em notas | #30, `perfumes_referencia` | Base pública de pirâmides olfativas |
| Texto oficial da RDC 1.045/2026 e da IN 474/2026 | Modelo de produção | Leitura do DOU (pode ser colado aqui) |

## 7. Ajustes que isso traz para a arquitetura do banco

| Banco | Ajuste [I] |
|---|---|
| 03 Inteligência olfativa | Campo "papel no acorde" (base, modificador, harmonizador); tabela de afinidades a partir do "combina com" |
| 04 Matérias-primas | Composição e alergênicos **por lote**; campos de fototoxicidade, CITES, espécie nativa e forma proibida; unidade padrão em gramas |
| 05 Formulações | Tipo de concentração (EDC a Extrait) e checagem de limite **somando todas as fontes** de uma mesma molécula (ex.: cumarina da fava-tonca, do feno e isolada) |
| 06 Comercial | Status de produção (maturação, maceração, quebra fria, envase); validade de até 12 meses se o regime for artesanal |
| 08 Governança | Limites IFRA versionados (padrão, emenda, valor por categoria, data de vigência) |

## 8. Decisões pendentes

| # | Decisão | Quando |
|---|---|---|
| 1 | Produção artesanal (a ICARUS produz) ou laboratório com AFE? | Depois de ler o texto oficial da RDC 1.045/2026 |
| 2 | Atelier promete "100% natural" ou "predominância de naturais"? | Antes de escrever a página de preços |
| 3 | O kit de amostras entra no escopo? | Quando desenharmos a jornada em telas |
| 4 | Biodiversidade brasileira vira apelo de marca (com SisGen) ou fica como coadjuvante? | Antes de definir a narrativa da vertical |

## 9. Fontes da pesquisa complementar

**IFRA**
- [IFRA: fim da consulta da 52ª emenda](https://ifrafragrance.org/latest-updates/ifra-news/ifra-publishes-end-of-consultation-letter-for-the-52nd-amendment-to-the-ifra-standards)
- [Maven: guia da 52ª emenda (out/2026)](https://www.mavenrs.com/blog/ifra-52nd-amendment-2026-fragrance-compliance-guide)
- [IFRA: notificação da 51ª emenda](https://ifrafragrance.org/latest-updates/press-releases/notification-of-the-51st-amendment-to-the-ifra-standards)
- [IFRA STD 071: bálsamo do Peru](https://IFRAfragrance.org/standards/IFRA_STD_071.pdf)
- [IFRA STD 083: verbena](https://IFRAfragrance.org/standards/IFRA_STD_083.pdf)
- [IFRA STD 089: cítricos e furocumarinas](https://ifrafragrance.org/standards/IFRA_STD_089.pdf)
- [IFRA STD 090: cominho](https://IFRAfragrance.org/standards/IFRA_STD_090.pdf)
- [IFRA STD 097: tagetes](https://IFRAfragrance.org/standards/IFRA_STD_097.pdf)
- [IFRA STD 099: estragol](https://IFRAfragrance.org/standards/IFRA_STD_099.pdf)
- [IFRA STD 114: bétula](https://IFRAfragrance.org/standards/IFRA_STD_114.pdf)
- [Padrão IFRA da cumarina, 49ª emenda (cópia Perfumers World)](https://www.perfumersworld.com/documents/Project-Templates/IFRA-Standards/Coumarin.pdf)
- Cálamo, fontes secundárias: [The Good Scents Company](https://thegoodscentscompany.com/data/es1002331.html) e [Basenotes](https://basenotes.com/threads/is-any-calamus-allowed.269960/)
- Categoria 4, escopo (certificado de fornecedor): [exemplo de certificado IFRA](https://cdn.shopify.com/s/files/1/0536/9859/2937/files/Kreed_IFRA.pdf)

**União Europeia**
- [Reg. (UE) 2017/1410: atranol, cloroatranol e HICC](https://eur-lex.europa.eu/eli/reg/2017/1410/oj)
- [HPRA: rotulagem de alergênicos (Reg. 2023/1545)](https://www.hpra.ie/regulation/cosmetics/labelling-and-claims/cosmetic-products-labelling/labelling-of-cosmetic-fragrance-allergens)
- [Coslaw: novos alergênicos a rotular](https://coslaw.eu/more-allergens-to-be-individually-labelled-cosmetics/)
- [Parecer SCCNFP sobre DEP](https://ec.europa.eu/health/archive/ph_risk/committees/sccp/documents/out168_en.pdf) e [reconfirmação de 2003](https://insights.citeline.com/RS011856/Diethyl-Phthalate-Safety-In-Cosmetics-Reconfirmed-By-SCCNFP)

**Brasil**
- [Anvisa: aprovação da regularização de cosméticos artesanais](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/anvisa-aprova-regularizacao-de-cosmeticos-artesanais)
- [Daniel Law: marco regulatório da produção artesanal](https://www.daniel.com.br/pt/client-alert/anvisa-estabelece-marco-regulatorio-para-producao-artesanal-de-cosmeticos-produtos-de-higiene-pessoal-e-perfumes/)
- [Correio Braziliense: sete grupos, validade de 12 meses](https://www.correiobraziliense.com.br/cbradar/sabonete-em-barra-vela-aromatica-perfume-e-outros-cosmeticos-artesanais-de-sete-grupos-deixam-de-precisar-de-registro-na-anvisa-a-partir-de-dezembro-de-2026-com-validade-de-ate-12-meses-e-sem-prome/)
- [LegisWeb: IN Anvisa 474/2026](https://www.legisweb.com.br/legislacao/?id=502572)
- [Procon SP: novas regras para cosméticos artesanais](https://prefeitura.sp.gov.br/web/procon/w/conhe%C3%A7a-as-novas-regras-da-anvisa-para-cosm%C3%A9ticos-artesanais)
- [Agência Senado: Lei 15.154/2025](https://www12.senado.leg.br/noticias/materias/2025/07/01/lei-isenta-cosmeticos-e-perfumes-artesanais-de-registro-na-anvisa)
- [RDC 752/2022 consolidada](https://antigo.anvisa.gov.br/documents/10181/5738443/RDC_752_2022_COMP.pdf/439ec340-390a-4920-8e32-14863cffdaf4) e [resumo DLA Piper](https://www.dlapiper.com/insights/publications/2022/10/anvisa-introduces-new-rules-for-framing-labeling-and-regularization-of-cosmetics)
- [Migalhas: fragrâncias da biodiversidade (Lei 13.123)](https://www.migalhas.com.br/depeso/290175/fragrancias-da-biodiversidade)
- [Decreto 8.772/2016, art. 43](https://www.legjur.com/legislacao/art/DEC_00087722016-43)

**CITES**
- [Proposta CoP15 (Aniba rosaeodora)](https://cites.org/sites/default/files/eng/cop/15/prop/E-15-Prop-29.pdf)
- [FAO: agarwood e CITES](https://www.fao.org/4/y3660e/y3660e04.htm) e [CITES CoP19 Inf. 12](https://cites.org/sites/default/files/documents/E-CoP19-Inf-12.pdf)
