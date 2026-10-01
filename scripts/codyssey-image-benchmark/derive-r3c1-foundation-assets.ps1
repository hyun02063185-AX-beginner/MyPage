[CmdletBinding()]
param(
  [string]$StudyPath,
  [string]$OutputDirectory
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
if ([string]::IsNullOrWhiteSpace($StudyPath)) { $StudyPath = Join-Path $repositoryRoot 'output\codyssey-image-benchmark\r3c-foundation-batch-a-rerun-01\A-clean-gameplay-first.gemini-2.5-flash-image.png' }
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) { $OutputDirectory = Join-Path $repositoryRoot 'portfolio-world-v2\public\assets\world\foundation\r3c1' }

if (-not (Test-Path -LiteralPath $StudyPath -PathType Leaf)) { throw "Study A is missing: $StudyPath" }
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$source = [System.Drawing.Bitmap]::FromFile((Resolve-Path -LiteralPath $StudyPath))

function New-Canvas([int]$width, [int]$height, [System.Drawing.Color]$base) {
  $bitmap = New-Object System.Drawing.Bitmap $width, $height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear($base)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  return @($bitmap, $graphics)
}

function Save-Canvas($canvas, [string]$name) {
  $path = Join-Path $OutputDirectory $name
  $canvas[1].Dispose(); $canvas[0].Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $canvas[0].Dispose()
}

# Study A panels: plaza x=52..268, stairs x=294..504, quay x=532..742, wall x=767..972.
# Fixed offsets make the synthesis deterministic while retaining the source's natural limestone grain.
$plaza = New-Canvas 780 345 ([System.Drawing.Color]::FromArgb(225, 205, 164))
for ($row = 0; $row -lt 4; $row++) {
  for ($column = 0; $column -lt 6; $column++) {
    $dx = $column * 130; $dy = $row * 86; $sx = 52 + (($column * 17 + $row * 11) % 78); $sy = 195 + (($row * 131 + $column * 47) % 430)
    $plaza[1].DrawImage($source, (New-Object System.Drawing.Rectangle $dx, $dy, 130, 86), (New-Object System.Drawing.Rectangle $sx, $sy, 130, 86), [System.Drawing.GraphicsUnit]::Pixel)
  }
}
Save-Canvas $plaza 'upper-plaza-paving.png'

$quay = New-Canvas 890 285 ([System.Drawing.Color]::FromArgb(205, 183, 141))
for ($row = 0; $row -lt 4; $row++) {
  for ($column = 0; $column -lt 7; $column++) {
    $dx = $column * 127; $dy = $row * 72; $sx = 533 + (($column * 13 + $row * 7) % 73); $sy = 195 + (($row * 109 + $column * 31) % 470)
    $quay[1].DrawImage($source, (New-Object System.Drawing.Rectangle $dx, $dy, 127, 72), (New-Object System.Drawing.Rectangle $sx, $sy, 127, 72), [System.Drawing.GraphicsUnit]::Pixel)
  }
}
$quayGlaze = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(48, 190, 145, 96))
$quay[1].FillRectangle($quayGlaze, 0, 0, 890, 285)
$quayGlaze.Dispose()
Save-Canvas $quay 'lower-quay-paving.png'

$stairs = New-Canvas 260 190 ([System.Drawing.Color]::FromArgb(218, 196, 155))
for ($step = 0; $step -lt 8; $step++) {
  $dy = [int]($step * 23.75); $height = if ($step -eq 7) { 190 - $dy } else { [int](($step + 1) * 23.75) - $dy }
  $sy = 205 + (($step * 59) % 420)
  $stairs[1].DrawImage($source, (New-Object System.Drawing.Rectangle 0, $dy, 260, $height), (New-Object System.Drawing.Rectangle 295, $sy, 209, 46), [System.Drawing.GraphicsUnit]::Pixel)
}
Save-Canvas $stairs 'main-stair-surface.png'

$edge = New-Canvas 890 40 ([System.Drawing.Color]::FromArgb(139, 112, 79))
for ($column = 0; $column -lt 12; $column++) {
  $dx = $column * 75; $width = if ($column -eq 11) { 890 - $dx } else { 75 }
  $sx = 768 + (($column * 9) % 104); $sy = 205 + (($column * 53) % 480)
  $edge[1].DrawImage($source, (New-Object System.Drawing.Rectangle $dx, 0, $width, 40), (New-Object System.Drawing.Rectangle $sx, $sy, 75, 40), [System.Drawing.GraphicsUnit]::Pixel)
}
Save-Canvas $edge 'quay-edge-face.png'

$source.Dispose()
Write-Output "R3C.1 foundation derivatives saved to $OutputDirectory"
