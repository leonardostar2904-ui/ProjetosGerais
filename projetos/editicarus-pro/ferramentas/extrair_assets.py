"""Regenera os assets da marca usados pelo protótipo a partir do brand book oficial.

Os assets não são versionados porque este repositório é público e o brand book
ICARUS é documento de uso interno. Uso:

    python3 -I ferramentas/extrair_assets.py caminho/icarus-brand-book.pdf arquitetura/assets

Requer poppler-utils (pdfimages) e Pillow. Nenhum traço do logo é redesenhado:
a imagem original é combinada com a própria máscara de transparência, recortada
na margem vazia e reduzida por reamostragem.
"""
import os, shutil, subprocess, sys, tempfile
from PIL import Image

LOGOS = {  # pagina, indice da imagem e da mascara na saida do pdfimages
    'assinatura-dourada.png': (23, 0, 1),   # dourado: só sobre Azul Profundo
    'assinatura-azul.png':    (23, 2, 3),   # azul: sobre Papel e acentos claros
    'simbolo-dourado.png':    (24, 0, 1),
    'simbolo-azul.png':       (24, 2, 3),
}
FOTOS = 32  # página do banco ICARUS (12 fotos)

def main(pdf, out):
    os.makedirs(os.path.join(out, 'marca'), exist_ok=True)
    os.makedirs(os.path.join(out, 'fotos'), exist_ok=True)
    tmp = tempfile.mkdtemp()
    try:
        for nome, (pg, im, mk) in LOGOS.items():
            d = os.path.join(tmp, str(pg)); os.makedirs(d, exist_ok=True)
            subprocess.run(['pdfimages', '-png', '-f', str(pg), '-l', str(pg), pdf, d + '/i'], check=True)
            a = Image.open(f'{d}/i-{im:03d}.png').convert('RGB')
            m = Image.open(f'{d}/i-{mk:03d}.png').convert('L').resize(a.size)
            a.putalpha(m); a = a.crop(m.getbbox())
            alvo = 360 if nome.startswith('assinatura') else 300
            a = a.resize((round(a.width * alvo / a.height), alvo), Image.LANCZOS)
            a.save(os.path.join(out, 'marca', nome), optimize=True)
        d = os.path.join(tmp, 'f'); os.makedirs(d)
        subprocess.run(['pdfimages', '-j', '-f', str(FOTOS), '-l', str(FOTOS), pdf, d + '/f'], check=True)
        for i, f in enumerate(sorted(os.listdir(d))):
            im = Image.open(os.path.join(d, f)).convert('RGB')
            im.thumbnail((480, 600), Image.LANCZOS)
            im.save(os.path.join(out, 'fotos', f'banco-{i+1:02d}.jpg'), quality=82, optimize=True, progressive=True)
    finally:
        shutil.rmtree(tmp)

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
