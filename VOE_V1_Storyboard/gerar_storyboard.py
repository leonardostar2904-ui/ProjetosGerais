import math, random, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
F="fonts/"; OUT="/home/user/ProjetosGerais/VOE_V1_Storyboard/"
W,H=1080,1920
PAPEL=(234,230,223); NEVOA=(218,213,204); GRAF=(74,78,85); AZUL=(13,27,42); BRASA=(184,57,31); SOMBRA=(150,148,145)
def font(n,s): return ImageFont.truetype(F+n,s)
COND=lambda s:font("ArchivoCond.ttf",s); MONO=lambda s:font("PlexMono.ttf",s); MONOM=lambda s:font("PlexMono-Medium.ttf",s); SERIF=lambda s:font("InstrumentSerif-Italic.ttf",s)
rng=np.random.default_rng(7)
def grain(img,amt=14):
    a=np.asarray(img).astype(np.int16); n=rng.normal(0,amt,(a.shape[0],a.shape[1],1)).astype(np.int16)
    return Image.fromarray(np.clip(a+n,0,255).astype(np.uint8))
def lowfreq(w,h,scale,amp,seed):
    r=np.random.default_rng(seed); small=r.normal(0,1,(h//scale+2,w//scale+2))
    im=Image.fromarray(((small-small.min())/(np.ptp(small))*255).astype(np.uint8)).resize((w,h),Image.BICUBIC).filter(ImageFilter.GaussianBlur(scale/2))
    return (np.asarray(im).astype(np.float32)/255-0.5)*amp
def shade(img,amp=18,scale=120,seed=1):
    a=np.asarray(img).astype(np.float32); a+=lowfreq(img.width,img.height,scale,amp,seed)[...,None]
    return Image.fromarray(np.clip(a,0,255).astype(np.uint8))
def figure(d,x,y,s,col=GRAF,shadow=True,ang=-0.35):
    if shadow:
        L=s*5; d.polygon([(x-s*0.35,y),(x+s*0.35,y),(x+s*0.35+L*math.sin(-ang)*1.4,y+L*0.18),(x-s*0.35+L*math.sin(-ang)*1.4,y+L*0.18)],fill=SOMBRA)
    d.rounded_rectangle([x-s*0.33,y-s*1.55,x+s*0.33,y],radius=s*0.25,fill=col)
    d.ellipse([x-s*0.2,y-s*2.0,x+s*0.2,y-s*1.6],fill=col)
    d.rectangle([x+s*0.18,y-s*1.25,x+s*0.45,y-s*0.75],fill=col)  # bolsa
def hall(v):
    im=Image.new("RGB",(W,H),PAPEL); d=ImageDraw.Draw(im)
    d.rectangle([0,0,W,H],fill=NEVOA)
    # janelas de luz no piso
    for i in range(5):
        x0=-200+i*300+(80 if v==2 else 0); d.polygon([(x0,250),(x0+170,250),(x0+420,H),(x0+180,H)],fill=PAPEL)
    for j in range(0,H,150): d.line([(0,j+ (60 if v==2 else 0)),(W,j+(60 if v==2 else 0))],fill=(206,201,192),width=2)
    for i in range(-6,14): d.line([(i*120,0),(i*120+300,H)],fill=(206,201,192),width=2)
    if v==1: figure(d,610,1230,60)
    elif v==2: figure(d,430,1420,110)
    else: figure(d,700,1050,30)
    return shade(im.filter(ImageFilter.GaussianBlur(1.2)),22,160,v)
def corridor(v):
    im=Image.new("RGB",(W,H),PAPEL); d=ImageDraw.Draw(im); vx,vy=W//2+(60 if v==2 else 0),820
    d.polygon([(0,0),(vx-90,vy-130),(vx-90,vy+130),(0,H)],fill=NEVOA)
    d.polygon([(W,0),(vx+90,vy-130),(vx+90,vy+130),(W,H)],fill=(205,200,191))
    d.rectangle([vx-90,vy-130,vx+90,vy+130],fill=(245,242,236))
    for k in range(9):
        t0=k/9; t1=t0+0.055; 
        def pt(t,side): 
            y=vy+130+(H-vy-130)*t**1.6; x=vx+(side*90)+(side*(W/2+200))*t**1.6; return (x,y)
        d.polygon([pt(t0,-1),pt(t1,-1),(pt(t1,-1)[0]+600,pt(t1,1)[1]),(pt(t0,-1)[0]+600,pt(t0,1)[1])],fill=(196,190,180))
    figure(d,vx+10,vy+230 if v==1 else vy+330,45 if v==1 else 70,shadow=False)
    return shade(im.filter(ImageFilter.GaussianBlur(1.4)),20,150,v+10)
def arrow(d,cx,cy,w,h,dirn,fill):
    if dirn>0: d.polygon([(cx-w/2,cy-h*0.18),(cx+w*0.15,cy-h*0.18),(cx+w*0.15,cy-h*0.4),(cx+w/2,cy),(cx+w*0.15,cy+h*0.4),(cx+w*0.15,cy+h*0.18),(cx-w/2,cy+h*0.18)],fill=fill)
    else: d.polygon([(cx+w/2,cy-h*0.18),(cx-w*0.15,cy-h*0.18),(cx-w*0.15,cy-h*0.4),(cx-w/2,cy),(cx-w*0.15,cy+h*0.4),(cx-w*0.15,cy+h*0.18),(cx+w/2,cy+h*0.18)],fill=fill)
def signs(v):
    im=Image.new("RGB",(W,H),PAPEL); d=ImageDraw.Draw(im); s=1.0 if v==1 else 1.55; ox=0 if v==1 else -120
    d.rectangle([W//2-14*s+ox,700,W//2+14*s+ox,H],fill=GRAF)
    for k,(y,dirn) in enumerate([(820,1),(1060,-1),(1300,1)]):
        y=700+(y-700)*s; x0=W//2+ox+(30 if dirn>0 else -30-420*s); 
        d.rectangle([x0,y-80*s,x0+420*s,y+80*s],fill=GRAF)
        arrow(d,x0+(110*s if dirn>0 else 310*s),y,140*s,120*s,dirn,PAPEL)
        for b in range(3): d.rectangle([x0+(190*s if dirn>0 else 40*s)+b*0,y-12*s+ (b-1)*34*s,x0+(390*s if dirn>0 else 240*s)-b*40*s,y+12*s+(b-1)*34*s],fill=(120,124,130))
    return shade(im.filter(ImageFilter.GaussianBlur(1.0 if v==1 else 2.2)),18,140,v+20)
def splitflap(v):
    im=Image.new("RGB",(W,H),(38,40,44)); d=ImageDraw.Draw(im); r=random.Random(v)
    cols,rows=(7,9) if v==1 else (4,5); cw=(W-80)/cols; ch=(H-500)/rows if v==1 else (H-300)/rows; y0=420 if v==1 else 260
    for i in range(cols):
        for j in range(rows):
            x=40+i*cw; y=y0+j*ch; d.rounded_rectangle([x+6,y+6,x+cw-6,y+ch-6],radius=8,fill=GRAF)
            d.line([(x+6,y+ch/2),(x+cw-6,y+ch/2)],fill=(30,32,36),width=4)
            gx=x+cw*0.3; gw=cw*0.4
            if r.random()<0.75: d.rectangle([gx,y+ch*0.25,gx+gw*r.choice([0.3,0.6,1]),y+ch*0.75],fill=NEVOA)
            if r.random()<0.25: d.rectangle([x+10,y+ch*0.1,x+cw-10,y+ch*0.5],fill=(110,114,120))
    im=im.filter(ImageFilter.GaussianBlur(1.6 if v==1 else 3))
    return shade(im,14,120,v+30)
def paper_crumpled(seed):
    a=np.ones((H,W,3),np.float32)*np.array(PAPEL,np.float32)
    a+=lowfreq(W,H,60,40,seed)[...,None]+lowfreq(W,H,200,30,seed+1)[...,None]
    im=Image.fromarray(np.clip(a,0,255).astype(np.uint8)); d=ImageDraw.Draw(im); r=random.Random(seed)
    for _ in range(14):
        x0,y0=r.randint(-200,W),r.randint(0,H); ang=r.uniform(0,math.pi); L=r.randint(300,900)
        d.line([(x0,y0),(x0+L*math.cos(ang),y0+L*math.sin(ang))],fill=(212,207,198),width=2)
    return im.filter(ImageFilter.GaussianBlur(1.2))
def bez(p,n=400):
    pts=[]
    for i in range(n+1):
        t=i/n; x=sum(math.comb(3,k)*(1-t)**(3-k)*t**k*p[k][0] for k in range(4)); y=sum(math.comb(3,k)*(1-t)**(3-k)*t**k*p[k][1] for k in range(4)); pts.append((x,y))
    return pts
def thread():
    im=paper_crumpled(5); d=ImageDraw.Draw(im)
    pts=bez([(120,1800),(900,1500),(80,1100),(860,800)])
    d.line(pts[:int(len(pts)*0.82)],fill=BRASA,width=7,joint="curve")
    x,y=pts[int(len(pts)*0.82)]; d.ellipse([x-9,y-9,x+9,y+9],fill=BRASA)
    return im
def converge():
    im=Image.new("RGB",(W,H),(240,237,231)); d=ImageDraw.Draw(im); r=random.Random(3)
    for _ in range(40):
        x,y=r.randint(0,W),r.randint(500,H); pts=[(x+r.randint(-150,150),y+r.randint(-90,90)) for _ in range(5)]
        d.line(pts,fill=(222,218,210),width=2)
    meet=(W//2,980)
    for sx,sy in [(60,1900),(W//2+40,1920),(1020,1880)]:
        for i in range(16):
            t=i/16; x=sx+(meet[0]-sx)*t+math.sin(t*6+sx)*25*(1-t); y=sy+(meet[1]-sy)*t
            d.ellipse([x-7,y-11,x+7,y+11],fill=(150,148,145))
    d.line(bez([meet,(W//2+60,820),(W//2-40,640),(W//2,470)],120),fill=BRASA,width=7)
    return shade(im.filter(ImageFilter.GaussianBlur(1)),14,160,40)
def chrome(im,code,tc,dark=False):
    d=ImageDraw.Draw(im); c=PAPEL if dark else GRAF; m=56
    d.text((m,52),"VOE.ICARUS · V1",font=MONOM(26),fill=c); tw=d.textlength(tc,font=MONOM(26)); d.text((W-m-tw,52),tc,font=MONOM(26),fill=c)
    d.line([(m,96),(W-m,96)],fill=c,width=2)
    d.line([(m,H-110),(W-m,H-110)],fill=c,width=2)
    d.text((m,H-90),"PARA QUEM VOLTA.",font=MONOM(26),fill=c); tw=d.textlength(code,font=MONOM(26)); d.text((W-m-tw,H-90),code,font=MONOM(26),fill=c)
def word(im,text,color=AZUL,y=150,size=230,box=False):
    d=ImageDraw.Draw(im); m=56; lines=text.split("\n")
    if box:
        h=len(lines)*size*1.0+40; d.rectangle([m-10,y-10,m+max(d.textlength(l,font=COND(size)) for l in lines)+40,y+h],fill=PAPEL)
    for i,l in enumerate(lines): d.text((m+10,y+i*size*1.0),l,font=COND(size),fill=color)
scenes=[
 ("DE ONDE","0:00 a 0:02,4","P01",lambda:hall(1),False),
 ("VEIO","0:02,4 a 0:04,8","P01",lambda:hall(2),False),
 ("SEU\nÚLTIMO","0:04,8 a 0:07,2","P05",lambda:corridor(1),True),
 ("CLIENTE?","0:07,2 a 0:09,6","P02",lambda:signs(1),False),
 ("INSTAGRAM","0:09,6 a 0:12","P02",lambda:signs(2),True),
 ("GOOGLE","0:12 a 0:14,4","P03",lambda:splitflap(1),True),
 ("INDICAÇÃO","0:14,4 a 0:16,8","P03",lambda:splitflap(2),True),
 ("CADA\nCANAL","0:16,8 a 0:19,2","P05",lambda:corridor(2),True),
 ("SOZINHO","0:19,2 a 0:21,6","P01",lambda:hall(3),False),
 ("LIGUE","0:21,6 a 0:24","P06",thread,False),
 ("TUDO","0:24 a 0:26,4","P10",converge,False),
]
frames=[]
for i,(t,tc,code,fn,box) in enumerate(scenes,1):
    im=fn(); sz=230 if len(t.replace("\n",""))<8 else 190
    if t=="INSTAGRAM" or t=="INDICAÇÃO": sz=170
    word(im,t,BRASA if t=="TUDO" else AZUL,size=sz,box=box)
    chrome(im,code,tc,dark=(code=="P03")); im=grain(im,12); im.save(OUT+f"quadros/{i:02d}_{t.replace(chr(10),'_').replace('?','')}.png"); frames.append((im,tc,t))
# fecho
im=Image.new("RGB",(W,H),PAPEL); im=shade(im,10,200,99); d=ImageDraw.Draw(im)
d.text((66,560),"MÁQUINA",font=COND(210),fill=AZUL); d.text((66,740),"DE AQUISIÇÃO",font=COND(150),fill=AZUL)
d.text((66,960),"Entrega em 30 dias.",font=SERIF(84),fill=AZUL)
d.line([(56,1120),(W-56,1120)],fill=GRAF,width=2); d.text((56,1145),"LINK NA BIO",font=MONOM(40),fill=GRAF)
chrome(im,"FECHO","0:26,4 a 0:31"); im=grain(im,10); im.save(OUT+"quadros/12_FECHO.png"); frames.append((im,"0:26,4 a 0:31","FECHO"))
# tira de contato
tw,th=300,533; gap=28; side=70; per=4; rows=3
SW=side*2+per*tw+(per-1)*gap; stripH=th+64+84
SH=250+rows*(stripH+60)+90
sheet=Image.new("RGB",(SW,SH),PAPEL); d=ImageDraw.Draw(sheet)
d.text((side,50),"VOE.ICARUS · V1 · STORYBOARD · 9:16 · 31 S",font=MONOM(22),fill=GRAF)
d.text((side,92),"De onde veio seu último cliente?",font=SERIF(70),fill=AZUL)
d.line([(side,200),(SW-side,200)],fill=GRAF,width=2)
for r_ in range(rows):
    y0=250+r_*(stripH+60); d.rectangle([0,y0,SW,y0+stripH],fill=(46,49,54))
    for x in range(14,SW,44):
        d.rounded_rectangle([x,y0+16,x+24,y0+44],radius=5,fill=NEVOA); d.rounded_rectangle([x,y0+stripH-38,x+24,y0+stripH-12],radius=5,fill=NEVOA)
    for c_ in range(per):
        k=r_*per+c_
        if k>=len(frames): continue
        im,tc,t=frames[k]; x0=side+c_*(tw+gap); sheet.paste(im.resize((tw,th),Image.LANCZOS),(x0,y0+64))
        d.text((x0,y0+64+th+8),f"{k+1:02d}  {tc}",font=MONO(15),fill=NEVOA)
d.text((side,SH-60),"Quadros ilustrativos feitos por código. As cenas finais saem do Flow (P01 a P10).",font=MONO(18),fill=GRAF)
grain(sheet,8).save(OUT+"V1_tira_storyboard.png")
print("ok",len(frames))
