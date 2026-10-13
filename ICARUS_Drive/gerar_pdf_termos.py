import sys, glob
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as RLFont
from reportlab.lib.colors import HexColor
F="fonts/"
v=TTFont(glob.glob(F+"x/fontsource-variable-archivo-*/package/files/archivo-latin-wdth-normal.woff2")[0]); v.flavor=None
instancer.instantiateVariableFont(v,{"wght":800,"wdth":75}).save(F+"ArchivoCond.ttf")
for n,f in [("Cond","ArchivoCond.ttf"),("Serif","InstrumentSerif.ttf"),("SerifIt","InstrumentSerif-Italic.ttf"),("Mono","PlexMono.ttf"),("MonoM","PlexMono-Medium.ttf"),("Sans","Archivo.ttf"),("SansB","Archivo-Bold.ttf")]:
    pdfmetrics.registerFont(RLFont(n,F+f))
PAPEL=HexColor("#EAE6DF"); AZUL=HexColor("#0D1B2A"); BRASA=HexColor("#B8391F"); EGEU=HexColor("#4F6F8E"); GRAF=HexColor("#4A4E55"); NEVOA=HexColor("#DAD5CC")
W,H=landscape(A4); M=40
app=[
("swiss style poster navy cream","Tipográfico suíço, grid à vista","Post voz alta 4:5, séries Manifesto e Guia"),
("condensed bold typography poster","Voz alta: uma coisa gigante, o resto pequeno","Capa de carrossel, título de impacto"),
("serif italic quote poster minimal","Voz filosófica, frase com virada em itálico","Post de frase, série Manifesto"),
("film grain texture dark blue","Grão de filme, 30 a 45% sobre cor chapada","Fundo de post e story no azul"),
("grainy gradient blur poster","Desfoque granulado, mancha azul no papel","Story de pausa, série Pausa"),
("light leak texture dark background","Luz de passagem, só sobre azul","Conquista, fim de voo, Diário de voo"),
("classical sculpture editorial poster","Mármore com tipografia editorial","Manifesto, referência ao mito"),
("single line drawing minimal poster","Linha de voo: um traço que sobe e volta","Post filosófico no azul com grafismo"),
("minimal timer app ui dark","Interface limpa, números em mono","Diário de voo, demonstração do app"),
]
voe=[
("editorial portrait black natural light","Retrato documental, luz de janela","Prova social, apresentar persona"),
("documentary photography hands desk","Mãos e objetos, sem rosto","Bastidor, processo de trabalho"),
("educational carousel design minimal","Carrossel em passos numerados","Conteúdo educativo, como funciona"),
("case study social media design","Antes e depois com números em destaque","Case e resultado de cliente"),
("editorial grid layout cream paper","Grid suíço sobre papel creme","Oferta de serviço, post institucional"),
("wayfinding signage graphic design","Setas e sinalização, rótulos em mono","Processo em etapas, jornada do cliente"),
("paper texture collage editorial","Recorte e papel rasgado","Fundo, composição com foto recortada"),
("magazine layout photo headline","Revista: foto grande e manchete curta","Post com persona e chamada"),
("pricing card design minimal","Cartão de oferta limpo, sem preço gritado","Apresentar pacote e investimento"),
]
c=canvas.Canvas(sys.argv[1],pagesize=(W,H)); c.setTitle("ICARUS · 18 termos para Pinterest"); c.setAuthor("ICARUS")
def frame(page,section):
    c.setFillColor(PAPEL); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(GRAF); c.setFont("Mono",7.5)
    c.drawString(M,H-30,"ICARUS · BANCO DE IMAGENS"); c.drawRightString(W-M,H-30,section)
    c.setStrokeColor(GRAF); c.setLineWidth(0.6); c.line(M,H-38,W-M,H-38)
    c.drawString(M,24,"PARA QUEM VOLTA."); c.drawRightString(W-M,24,f"{page:02d} / 02")
def table(rows,start,y,title,sub):
    c.setFillColor(AZUL); c.setFont("Cond",26); c.drawString(M,y,title)
    tw=pdfmetrics.stringWidth(title,"Cond",26)
    c.setFillColor(GRAF); c.setFont("Mono",8); c.drawString(M+tw+12,y+3,sub)
    y-=22; cols=[M,M+30,M+300,M+520]
    c.setFont("Mono",7); c.setFillColor(GRAF)
    for x,t in zip(cols,["Nº","TERMO PARA BUSCAR","ESTILO","TIPO DE APLICAÇÃO"]): c.drawString(x,y,t)
    y-=6; c.setStrokeColor(AZUL); c.setLineWidth(1); c.line(M,y,W-M,y)
    for i,(t,e,a) in enumerate(rows):
        y-=19
        c.setFont("Mono",8.5); c.setFillColor(BRASA); c.drawString(cols[0],y,f"{start+i:02d}")
        c.setFont("MonoM",9.5); c.setFillColor(AZUL); c.drawString(cols[1],y,t)
        c.setFont("Sans",9); c.drawString(cols[2],y,e)
        c.setFillColor(GRAF); c.drawString(cols[3],y,a)
        y-=8; c.setStrokeColor(NEVOA); c.setLineWidth(0.6); c.line(M,y,W-M,y)
    return y
# page 1
frame(1,"TERMOS PARA PINTEREST")
c.setFillColor(AZUL); c.setFont("Cond",58); c.drawString(M,H-102,"18 TERMOS PRA BUSCAR"); 
tw=pdfmetrics.stringWidth("18 TERMOS PRA BUSCAR","Cond",58); c.setFillColor(BRASA); c.drawString(M+tw,H-102,".")
c.setFillColor(AZUL); c.setFont("SerifIt",20); c.drawString(M,H-128,"Referência é ponto de partida. A peça final passa pelo Brand Check.")
c.setFont("Sans",9); c.setFillColor(GRAF)
c.drawString(M,H-150,"Copie o termo da coluna do meio e cole na busca do Pinterest. Os termos estão em inglês porque devolvem resultados mais editoriais.")
c.drawString(M,H-163,"Ao salvar, ignore pins com dourado fora do logo, cor saturada, rosto gerado por IA de perto ou mais de uma textura por peça.")
table(app,1,H-198,"@USEIICARUS","APP · AZUL É CÉU · MÍTICO E EDITORIAL")
c.showPage()
# page 2
frame(2,"TERMOS PARA PINTEREST")
y=table(voe,10,H-72,"@VOE.ICARUS","SERVIÇOS · PAPEL É CHÃO · EDITORIAL E CLARO")
y-=26; c.setStrokeColor(AZUL); c.setLineWidth(1); c.line(M,y+12,W-M,y+12)
c.setFillColor(GRAF); c.setFont("Mono",7); c.drawString(M,y,"COMO REFINAR A BUSCA")
tips=[("Some a paleta ao termo","\"... navy cream\" ou \"... rust orange\" puxa o eixo azul e luz."),
("Use a aba Ideias do pin","Rola até \"Mais ideias\": é onde aparecem os achados menos óbvios."),
("Monte uma pasta por perfil","Pinterest/useiicarus e Pinterest/voe.icarus. Mesma divisão do Drive."),
("Salve no máximo 5 por busca","Curadoria pequena vira referência. Pasta com 200 pins vira ruído.")]
x=M; colw=(W-2*M)/4
for h,t in tips:
    c.setFillColor(AZUL); c.setFont("SansB",9.5); c.drawString(x,y-18,h)
    c.setFont("Sans",8.5); c.setFillColor(GRAF)
    words=t.split(); line=""; yy=y-32
    for w_ in words:
        if pdfmetrics.stringWidth(line+" "+w_,"Sans",8.5)>colw-16: c.drawString(x,yy,line.strip()); yy-=11; line=""
        line+=" "+w_
    c.drawString(x,yy,line.strip()); x+=colw
c.setFillColor(AZUL); c.setFont("SerifIt",15); c.drawString(M,62,"Subir não é nunca cair. É saber voltar.")
c.save()
