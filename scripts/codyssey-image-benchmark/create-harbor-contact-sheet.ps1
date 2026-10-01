param(
  [Parameter(Mandatory = $true)][string]$InputDirectory
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$records = Get-ChildItem -LiteralPath $InputDirectory -Filter '*.metadata.json' | ForEach-Object {
  $metadata = Get-Content -Raw -LiteralPath $_.FullName | ConvertFrom-Json
  if ($metadata.image.file) { [PSCustomObject]@{ File = $metadata.image.file; Label = "$($metadata.variant.code) $($metadata.variant.title) — $($metadata.model)" } }
} | Sort-Object Label

if (@($records).Count -ne 6) { throw 'A six-candidate contact sheet requires six successful original images.' }

$cellWidth = 420; $cellHeight = 320; $labelHeight = 42; $columns = 3; $rows = 2
$sheet = New-Object System.Drawing.Bitmap ($cellWidth * $columns), (($cellHeight + $labelHeight) * $rows)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.Color]::FromArgb(24, 48, 58))
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(244, 229, 191))

for ($index = 0; $index -lt $records.Count; $index++) {
  $column = $index % $columns; $row = [Math]::Floor($index / $columns)
  $x = $column * $cellWidth; $y = $row * ($cellHeight + $labelHeight)
  $sourcePath = Join-Path $InputDirectory $records[$index].File
  $source = [System.Drawing.Image]::FromFile($sourcePath)
  $scale = [Math]::Min($cellWidth / $source.Width, $cellHeight / $source.Height)
  $drawWidth = [int]($source.Width * $scale); $drawHeight = [int]($source.Height * $scale)
  $drawX = $x + [int](($cellWidth - $drawWidth) / 2); $drawY = $y + [int](($cellHeight - $drawHeight) / 2)
  $graphics.DrawImage($source, $drawX, $drawY, $drawWidth, $drawHeight)
  $graphics.DrawString($records[$index].Label, $font, $brush, $x + 10, $y + $cellHeight + 11)
  $source.Dispose()
}

$sheet.Save((Join-Path $InputDirectory 'contact-sheet.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$brush.Dispose(); $font.Dispose(); $graphics.Dispose(); $sheet.Dispose()
