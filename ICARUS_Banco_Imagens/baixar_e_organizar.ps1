# Baixa as 50 imagens ICARUS, organiza em pastas, padroniza em 1080x1350 e gera o ZIP.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
Add-Type -AssemblyName System.Drawing
$out = "ICARUS_Imagens"
Get-Content manifesto.tsv | ForEach-Object {
  $n, $dir, $file, $url = $_ -split "`t"
  $folder = Join-Path $out $dir
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  $path = Join-Path (Resolve-Path $folder) $file
  Write-Host "Baixando $file"
  Invoke-WebRequest -Uri $url -OutFile $path
  # Recorte central + redimensionamento para 1080x1350
  $src = [System.Drawing.Image]::FromFile($path)
  $scale = [Math]::Max(1080 / $src.Width, 1350 / $src.Height)
  $w = [int]($src.Width * $scale); $h = [int]($src.Height * $scale)
  $bmp = New-Object System.Drawing.Bitmap 1080, 1350
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($src, [int]((1080 - $w) / 2), [int]((1350 - $h) / 2), $w, $h)
  $src.Dispose(); $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
}
Copy-Item README.md $out
if (Test-Path "$out.zip") { Remove-Item "$out.zip" }
Compress-Archive -Path $out -DestinationPath "$out.zip"
Write-Host "Pronto: $out\ e $out.zip"
