#!/usr/bin/env bash
# Baixa as 50 imagens ICARUS, organiza em pastas, padroniza em 1080x1350 e gera o ZIP.
set -e
cd "$(dirname "$0")"
OUT="ICARUS_Imagens"
while IFS=$'\t' read -r n dir file url; do
  mkdir -p "$OUT/$dir"
  echo "Baixando $file"
  curl -fsSL -o "$OUT/$dir/$file" "$url"
done < manifesto.tsv
# Padroniza em 1080x1350 se o Python com Pillow estiver disponível
if python3 -c "import PIL" 2>/dev/null; then
  python3 - "$OUT" <<'PY'
import sys, pathlib
from PIL import Image, ImageOps
for p in pathlib.Path(sys.argv[1]).rglob("*.png"):
    im = Image.open(p).convert("RGB")
    ImageOps.fit(im, (1080, 1350), Image.LANCZOS).save(p, optimize=True)
PY
else
  echo "Aviso: Pillow não encontrado, imagens mantidas no tamanho original (4:5)."
fi
cp README.md "$OUT/"
rm -f "$OUT.zip"
zip -rq "$OUT.zip" "$OUT"
echo "Pronto: $OUT/ e $OUT.zip"
