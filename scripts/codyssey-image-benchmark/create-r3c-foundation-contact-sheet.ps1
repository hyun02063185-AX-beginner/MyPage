param(
  [Parameter(Mandatory = $true)][string]$InputDirectory
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$records = Get-ChildItem -LiteralPath $InputDirectory -Filter '*.metadata.json' | ForEach-Object {
  $metadata = Get-Content -Raw -LiteralPath $_.FullName | ConvertFrom-Json
  if ($metadata.image.file) {
    [PSCustomObject]@{
      File = $metadata.image.file
      Label = "$($metadata.study.code) $($metadata.study.title) — $($metadata.model)"
    }
  }
} | Sort-Object Label

if (@($records).Count -ne 2) { throw 'The R3C foundation contact sheet requires two successful original images.' }

$cellWidth = 600; $cellHeight = 460; $labelHeight = 46
$sheet = New-Object System.Drawing.Bitmap ($cellWidth * 2), ($cellHeight + $labelHeight)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.Color]::FromArgb(24, 48, 58))
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font('Segoe UI', 14, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(244, 229, 191))

for ($index = 0; $index -lt $records.Count; $index++) {
  $x = $index * $cellWidth
  $source = [System.Drawing.Image]::FromFile((Join-Path $InputDirectory $records[$index].File))
  $scale = [Math]::Min($cellWidth / $source.Width, $cellHeight / $source.Height)
  $drawWidth = [int]($source.Width * $scale); $drawHeight = [int]($source.Height * $scale)
  $drawX = $x + [int](($cellWidth - $drawWidth) / 2); $drawY = [int](($cellHeight - $drawHeight) / 2)
  $graphics.DrawImage($source, $drawX, $drawY, $drawWidth, $drawHeight)
  $graphics.DrawString($records[$index].Label, $font, $brush, $x + 10, $cellHeight + 12)
  $source.Dispose()
}

$sheet.Save((Join-Path $InputDirectory 'foundation-contact-sheet.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$brush.Dispose(); $font.Dispose(); $graphics.Dispose(); $sheet.Dispose()
