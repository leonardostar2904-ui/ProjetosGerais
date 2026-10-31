"""Catálogo ENTRELINHAS: 23 peças (9 femininas, 13 masculinas, 1 acessório unissex).
Gera prompts.json com 99 prompts: 7 de campanha/categorias + 4 por peça.
As 6 peças originais usam os prompts 1 a 4 do artefato "Prompts ENTRELINHAS".
As 17 peças novas usam os modelos abaixo, no mesmo padrão."""
import json, sys

ELENCO = {
 "P1": "homem negro de pele retinta, cabeça raspada, muito alto e magro, cerca de 30 anos, traços angulosos",
 "P2": "mulher negra de pele retinta, tranças longas e finas presas num coque alto, cerca de 28 anos, pescoço longo",
 "P3": "mulher negra de pele média, cabelo crespo curto em black power, cerca de 35 anos, ombros largos",
 "P4": "homem negro de pele média, locs curtos presos atrás, barba curta aparada, cerca de 38 anos, corpo encorpado",
 "P5": "mulher negra de pele retinta, cabeça raspada, baixa e forte, cerca de 24 anos, sardas no rosto",
 "P6": "homem negro de pele média clara, cabelo crespo curto com degradê baixo, bigode fino, cerca de 26 anos, magro e de ombros estreitos",
 "P7": "homem negro de pele retinta, cabelo crespo médio penteado para trás com as têmporas grisalhas, cerca de 45 anos, alto e de ombros largos",
}

CENA = {
 "GRÉCIA": dict(
   lugar=["num terraço de concreto aparente no alto de uma ilha grega, com o mar Egeu ao fundo",
          "num corredor estreito entre uma parede caiada de branco e uma parede de concreto bruto, numa ilha grega",
          "numa escada de pedra branca de uma ilha grega, com uma oliveira retorcida no canto",
          "diante de um muro baixo de concreto com o mar Egeu ao fundo, numa ilha grega"],
   luz="Sol de meio-dia a pino, sombra curta, dura e desenhada no chão, a parede clara refletindo luz quente no rosto e na roupa. Calor visível no ar.",
   luz_macro="Sol de meio-dia batendo quase paralelo ao tecido, revelando a trama e o relevo das costuras.",
   fundo_macro="parede caiada branca fora de foco"),
 "RIO": dict(
   lugar=["diante de uma parede de concreto com a marca da fôrma de madeira, sob os pilotis de um prédio modernista carioca",
          "diante de um painel de cobogó de concreto num prédio modernista carioca",
          "num corredor aberto de um prédio modernista carioca, com vegetação tropical de folhas grandes ao fundo",
          "encostada numa coluna de concreto aparente de um prédio modernista carioca"],
   luz="Luz de fim de tarde, dourada e baixa, vindo de lado, atravessando o cobogó e desenhando sombras geométricas na parede e na roupa. Umidade do Atlântico no ar.",
   luz_macro="Luz de fim de tarde rasante e dourada, revelando a trama do tecido e o relevo de cada pesponto.",
   fundo_macro="concreto aparente fora de foco, em tom quente"),
}

# id, nome, categoria, gênero, modelo, cor principal, capítulo, peça, complemento,
# macro (o que o detalhe mostra), costas (o que o outro ângulo mostra), gesto (em uso)
NOVAS = [
 # femininas
 ("VF","Vestido Fresta","Vestidos e saias","F","P2","Grafite","GRÉCIA",
  "um vestido longo de linho grafite quase preto, alças largas, decote reto, corpo solto e reto, fenda lateral alta que abre com o passo, barra tocando o tornozelo",
  "sandália baixa de couro escuro",
  "a alça larga encontrando o decote reto, o acabamento de viés interno e a trama aberta do linho escuro sobre a pele",
  "as costas do vestido: decote baixo e reto nas costas, alças largas cruzando a escápula e a queda reta do linho até o chão",
  "caminhando em passo largo, a fenda lateral abrindo e o linho escuro se movendo com o vento"),
 ("SL","Saia Linha","Vestidos e saias","F","P3","Oliva","RIO",
  "uma saia midi reta de lã fria verde oliva acinzentado, cintura alta com cós largo, uma prega macho central na frente, barra no meio da canela",
  "regata canelada bege pergaminho por dentro da saia e sapato baixo de couro escuro",
  "o cós largo, o início da prega macho descendo pela frente e a trama fina da lã fria",
  "a saia por trás: cós limpo, zíper invisível, caimento reto e a fenda discreta atrás na barra",
  "subindo um degrau, a prega da saia abrindo com o movimento da perna"),
 ("BS","Blusa Sombra","Camisas","F","P5","Pergaminho","GRÉCIA",
  "uma blusa de algodão cru bege pergaminho, gola canoa alta, mangas muito amplas cortadas no corpo, comprimento curto parando na cintura",
  "calça reta de cintura alta em grafite",
  "a gola canoa, o encontro da manga ampla com o corpo e a trama encorpada do algodão cru",
  "a blusa por trás: a linha contínua das mangas cortadas no corpo, o volume caindo dos ombros e a barra reta na cintura",
  "erguendo os braços para prender a gola, as mangas amplas abrindo como asas"),
 ("CV","Calça Vão","Calças","F","P2","Argila","RIO",
  "uma pantalona de linho terracota, cintura alta com amarração do mesmo tecido, pernas muito largas que balançam a cada passo, barra cobrindo o pé",
  "regata canelada bege pergaminho por dentro da calça",
  "a amarração da cintura, o nó do próprio tecido e o volume do linho terracota começando a cair pela perna",
  "a pantalona por trás: cintura alta franzida pela amarração e o volume das pernas largas caindo até o chão",
  "atravessando o corredor em passo rápido, as pernas largas da calça abrindo com o vento"),
 ("TP","Top Prumo","Camisas","F","P3","Névoa","GRÉCIA",
  "um top de tricô canelado cinza claro, alças finas, decote reto, justo ao corpo, comprimento na cintura",
  "saia midi reta de lã fria verde oliva acinzentado",
  "as colunas do canelado do tricô, a alça fina saindo do decote reto e a pele do ombro ao lado",
  "o top visto de perfil: as alças finas, as costas retas do tricô e a linha da cintura",
  "ajustando a alça no ombro enquanto caminha, o corpo em leve torção"),
 ("MC","Macacão Cais","Calças","F","P5","Grafite","RIO",
  "um macacão utilitário de sarja grafite quase preto, sem mangas, decote em V fechado por botões escondidos, cinto do mesmo tecido amarrado na cintura, pernas retas largas",
  "sapato baixo de couro escuro",
  "o cinto de sarja amarrado na cintura, os botões escondidos e o pesponto duplo da sarja",
  "o macacão por trás: o corte limpo das costas sem manga, o cinto marcando a cintura e as pernas retas",
  "sentando na borda de um banco de concreto, o tecido do macacão dobrando no quadril"),
 # masculinas
 ("CE","Camisa Esquadro","Camisas","M","P6","Grafite","RIO",
  "uma camisa de algodão grafite quase preto, gola padre sem colarinho, manga curta ampla, caimento quadrado e solto, barra reta usada por fora",
  "calça de linho cinza claro com cordão na cintura",
  "a gola padre, a carcela com botões foscos sem inscrição e a trama fechada do algodão escuro",
  "a camisa por trás: o caimento quadrado, a pala reta nos ombros e as mangas curtas largas",
  "andando com as mãos nos bolsos da calça, a camisa se movendo solta no corpo"),
 ("BM","Bermuda Marco","Calças","M","P1","Pergaminho","GRÉCIA",
  "uma bermuda de alfaiataria em linho bege pergaminho, cintura com duas pregas, comprimento no joelho, perna larga",
  "regata canelada grafite e sandália de couro escuro",
  "as pregas da cintura, o bolso faca e a trama aberta do linho claro",
  "a bermuda por trás: cós limpo, bolso embutido sem aba e o caimento largo da perna",
  "descendo a escada de pedra em passo largo, a perna larga da bermuda balançando"),
 ("CP","Camiseta Peso","Camisas","M","P7","Névoa","RIO",
  "uma camiseta de malha de algodão pesada cinza claro, gola careca estreita, ombro caído, caimento quadrado, comprimento no quadril",
  "calça reta de cintura alta em grafite",
  "a gola careca de ribana estreita, a costura do ombro caído e a textura encorpada da malha",
  "a camiseta por trás: ombros largos, caimento reto e o peso da malha marcando a queda",
  "virando o corpo para olhar por cima do ombro, a malha pesada acompanhando o giro"),
 ("CF","Calça Fôrma","Calças","M","P4","Oliva","GRÉCIA",
  "uma calça utilitária de sarja verde oliva acinzentado, pernas largas e retas, bolsos laterais chapados, reforço duplo no joelho, cintura média",
  "camiseta de malha pesada bege pergaminho",
  "o reforço duplo no joelho, o pesponto da sarja e a borda do bolso lateral chapado",
  "a calça por trás: bolsos traseiros chapados sem aba, o reforço no joelho e a perna larga caindo reta",
  "agachado para amarrar a sandália, a sarja dobrando no joelho reforçado"),
 ("SJ","Sobrecamisa Laje","Terceiras peças","M","P6","Argila","GRÉCIA",
  "uma sobrecamisa de lona leve terracota, dois bolsos chapados no peito, botões de corozo foscos, modelagem ampla, usada aberta",
  "camiseta de malha pesada bege pergaminho e calça reta grafite",
  "o bolso chapado do peito, um botão de corozo fosco sem inscrição e a trama firme da lona",
  "a sobrecamisa por trás: pala reta, prega central e a barra reta cobrindo o quadril",
  "vestindo a sobrecamisa no meio do gesto, um braço já na manga, o tecido abrindo com o vento"),
 ("PJ","Polo Junta","Camisas","M","P1","Pergaminho","RIO",
  "uma polo de tricô de linho bege pergaminho, gola aberta sem botões, manga curta, caimento reto e leve",
  "calça de alfaiataria terracota de cintura alta",
  "a gola aberta de tricô, o ponto do tricô de linho e a borda da manga curta",
  "a polo de perfil: a gola deitada, o caimento leve do tricô e a manga curta",
  "encostado numa coluna, cruzando os braços devagar, o tricô se ajustando ao corpo"),
 ("BP","Blazer Planta","Terceiras peças","M","P7","Grafite","GRÉCIA",
  "um blazer desestruturado de linho grafite quase preto, sem forro, dois botões, ombro natural, lapela estreita, usado aberto",
  "camiseta de malha pesada cinza claro e calça de linho bege pergaminho",
  "a lapela estreita, a casa do botão feita à mão e a trama do linho escuro sem forro",
  "o blazer por trás: costas sem forro com a costura central aparente e as fendas laterais",
  "tirando o blazer dos ombros enquanto anda, o linho escuro balançando"),
 ("CL","Calça Pilar","Calças","M","P6","Névoa","GRÉCIA",
  "uma calça de linho cinza claro com cordão na cintura, perna reta e larga, barra tocando o peito do pé",
  "camisa de algodão grafite gola padre",
  "o cordão de algodão saindo do cós, o franzido da cintura e a trama do linho claro",
  "a calça por trás: o cós franzido pelo cordão e a perna reta e larga caindo até o chão",
  "caminhando na escada de pedra, o linho claro da calça ondulando no passo"),
 ("JB","Jaqueta Beiral","Terceiras peças","M","P4","Pergaminho","RIO",
  "uma jaqueta estilo quimono de algodão cru bege pergaminho, mangas largas, faixa de amarração na cintura, comprimento no quadril",
  "calça utilitária de sarja verde oliva acinzentado",
  "a faixa de amarração, o cruzamento das lapelas e a trama encorpada do algodão cru",
  "a jaqueta por trás: costas sem costura central, mangas largas caindo e a faixa amarrada na frente",
  "amarrando a faixa da jaqueta enquanto caminha pelo corredor"),
 ("CT","Cardigã Trama","Terceiras peças","M","P7","Oliva","RIO",
  "um cardigã de tricô aberto de algodão verde oliva acinzentado, decote em V, botões foscos, modelagem ampla, usado aberto",
  "camiseta de malha pesada bege pergaminho e calça reta grafite",
  "o ponto aberto do tricô, um botão fosco sem inscrição e a borda canelada do decote",
  "o cardigã por trás: o tricô aberto deixando passar a luz e a barra canelada no quadril",
  "ajeitando a manga do cardigã no antebraço, sentado no banco de concreto"),
 ("CR","Calça Recuo","Calças","M","P1","Argila","RIO",
  "uma calça de alfaiataria terracota, cintura alta com pregas duplas, perna larga afunilando levemente até a barra",
  "polo de tricô de linho bege pergaminho",
  "as pregas duplas da cintura, o passante do cós e a trama fina da alfaiataria",
  "a calça por trás: cós alto, bolso embutido e o vinco central descendo reto",
  "atravessando o pilotis em passo firme, o vinco da calça marcando o movimento"),
]

ORIGINAIS = [  # id no artefato, nome, categoria, gênero, cor
 ("B","Camisa Bruma","Camisas","F","Pergaminho"),
 ("E","Calça Eixo","Calças","F","Grafite"),
 ("D","Colete Dobra","Terceiras peças","F","Argila"),
 ("R","Regata Base","Camisas","M","Pergaminho"),
 ("V","Jaqueta Vértice","Terceiras peças","M","Oliva"),
 ("T","Bolsa Traço","Acessórios","U","Grafite"),
]

def nova(p):
    pid,nome,cat,gen,mod,cor,cap,peca,comp,macro,costas,gesto = p
    c = CENA[cap]; pessoa = ELENCO[mod]
    pron = "Ela" if gen=="F" else "Ele"
    a = "a" if gen=="F" else "o"
    return [
     (f"{pid}1","Principal", f"Retrato vertical de corpo inteiro. {pessoa[0].upper()+pessoa[1:]}, em pé {c['lugar'][0]}.\n\nVeste {peca}. Complemento: {comp}.\n\n{c['luz']} A luz mostra a textura do tecido e a queda da peça.\n\n{pron} está parad{a} em leve torção, peso numa perna só, olhando para fora do quadro. Corpo inteiro, deslocad{a} para a direita, com o terço esquerdo ocupado só pela parede vazia.\n\nProporção retrato 4:5."),
     (f"{pid}2","Detalhe do tecido", f"Macro vertical, muito próximo. Detalhe de {peca.split(',')[0]} vestid{a} por uma pessoa negra. O quadro mostra {macro}.\n\n{c['luz_macro']} A pele aparece com textura real, sem retoque.\n\nFundo: {c['fundo_macro']}. Foco rigoroso no detalhe da peça. Sem rosto no quadro.\n\nSem logotipo, sem etiqueta, sem nada escrito em botões ou ferragens.\n\nProporção retrato 4:5."),
     (f"{pid}3","Em uso", f"Plano médio vertical com movimento. {pessoa[0].upper()+pessoa[1:]}, {c['lugar'][2]}, {gesto}.\n\nVeste {peca}, com {comp}.\n\n{c['luz']}\n\n{pron} olha para fora do quadro, {'pega' if gen=='F' else 'pego'} no meio do movimento, sem posar. Enquadrad{a} da coxa para cima, deslocad{a} para a esquerda, com espaço vazio de concreto à direita.\n\nProporção retrato 4:5."),
     (f"{pid}4","Outro ângulo", f"Retrato vertical de costas ou em três quartos de costas. {pessoa[0].upper()+pessoa[1:]}, {c['lugar'][3]}.\n\nO quadro mostra {costas}. Complemento: {comp}.\n\n{c['luz']} A silhueta fica recortada pela luz.\n\n{pron} está parad{a}, cabeça levemente virada mostrando o perfil. Corpo inteiro, centralizad{a} na metade inferior, com a parede ou o céu ocupando a parte de cima do quadro.\n\nProporção retrato 4:5."),
    ]

def main(art_json, out):
    art = json.load(open(art_json))
    by = {c["id"]: c for c in art["cards"]}
    itens = []
    for k in ["H1","H2","H3","H4","C1","C2","C3"]:
        itens.append(dict(id=k, peca="Campanha" if k[0]=="H" else "Categorias", foto=by[k]["name"], prompt=by[k]["prompt"]))
    catalogo = []
    for pre,nome,cat,gen,cor in ORIGINAIS:
        catalogo.append(dict(prefixo=pre,nome=nome,categoria=cat,genero=gen,cor=cor,origem="briefing"))
        for i in range(1,5):
            c = by[f"{pre}{i}"]
            itens.append(dict(id=c["id"], peca=nome, foto=c["name"], prompt=c["prompt"]))
    for p in NOVAS:
        catalogo.append(dict(prefixo=p[0],nome=p[1],categoria=p[2],genero=p[3],cor=p[5],modelo=p[4],capitulo=p[6],origem="nova"))
        for fid,foto,pr in nova(p):
            itens.append(dict(id=fid, peca=p[1], foto=foto, prompt=pr))
    for it in itens:
        it["prompt_completo"] = art["base"].strip() + "\n\n" + it["prompt"].strip()
    json.dump(dict(base=art["base"], elenco=ELENCO, catalogo=catalogo, imagens=itens), open(out,"w"), ensure_ascii=False, indent=1)
    g = {k: sum(1 for c in catalogo if c["genero"]==k) for k in "FMU"}
    print(len(catalogo), "peças", g, "|", len(itens), "imagens")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
