"""Anexa as skills ao PDF e grava os metadados.

Uso: python3 anexar.py <entrada.pdf> <saida.pdf> <pasta-das-skills>
"""
import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject

entrada, saida, pasta = sys.argv[1], sys.argv[2], Path(sys.argv[3])

writer = PdfWriter(clone_from=PdfReader(entrada))
for zip_path in sorted(pasta.glob("*.zip")):
    writer.add_attachment(zip_path.name, zip_path.read_bytes())

writer.add_metadata({
    "/Title": "Como eu faço as coisas da ICARUS",
    "/Author": "Leonardo",
    "/Subject": "Skills, referências, organização no Claude e lições de lançamento",
})
# O Chrome junta as duas linhas do título da capa sem espaço no marcador.
primeiro = writer._root_object["/Outlines"]["/First"].get_object()
primeiro[NameObject("/Title")] = TextStringObject("Como eu faço as coisas da ICARUS")
writer.page_mode = "/UseOutlines"

with open(saida, "wb") as f:
    writer.write(f)
print("ok:", saida)
