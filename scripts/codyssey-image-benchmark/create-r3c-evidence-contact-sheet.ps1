param(
  [Parameter(Mandatory = $true)][string]$StudyDirectory,
  [Parameter(Mandatory = $true)][string]$EvidenceDirectory
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$sources = @(
  @{ Path = (Join-Path $StudyDirectory 'A-clean-gameplay-first.gemini-2.5-flash-image.png'); Label = 'Study A - Gameplay-first' },
  @{ Path = (Join-Path $StudyDirectory 'B-richer-premium.gemini-2.5-flash-image.png'); Label = 'Study B - Premium-richness' },
  @{ Path = (Join-Path $EvidenceDirectory 'A-upper-plaza.png'); Label = 'Deterministic runtime treatment' }
)
foreach ($source in $sources) { if (-not (Test-Path -LiteralPath $source.Path -PathType Leaf)) { throw "Missing contact-sheet source: $($source.Path)" } }

$cellWidth = 420; $cellHeight = 300; $labelHeight = 42
$sheet = New-Object System.Drawing.Bitmap ($cellWidth * $sources.Count), ($cellHeight + $labelHeight)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.Color]::FromArgb(24, 48, 58))
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(244, 229, 191))

for ($index = 0; $index -lt $sources.Count; $index++) {
  $x = $index * $cellWidth; $source = [System.Drawing.Image]::FromFile($sources[$index].Path)
  $scale = [Math]::Min($cellWidth / $source.Width, $cellHeight / $source.Height)
  $drawWidth = [int]($source.Width * $scale); $drawHeight = [int]($source.Height * $scale)
  $graphics.DrawImage($source, $x + [int](($cellWidth - $drawWidth) / 2), [int](($cellHeight - $drawHeight) / 2), $drawWidth, $drawHeight)
  $graphics.DrawString($sources[$index].Label, $font, $brush, $x + 10, $cellHeight + 10)
  $source.Dispose()
}

$sheet.Save((Join-Path $EvidenceDirectory 'foundation-study-contact-sheet.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$brush.Dispose(); $font.Dispose(); $graphics.Dispose(); $sheet.Dispose()
