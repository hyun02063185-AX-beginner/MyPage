# Build the final artifacts first, then compare the existing proxy at three scales.
. (Join-Path $PSScriptRoot 'build-evidence.ps1')
$sheet=[Drawing.Bitmap]::new(1440,1170)
$g=[Drawing.Graphics]::FromImage($sheet); $g.Clear([Drawing.Color]::FromArgb(238,234,221))
$g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$heights=@(64,73,84); $logical=@(49,56,64)
$locations=@(@(145,480),@(330,628),@(128,612),@(720,880))
$names=@('Hall approach','Middle quay','Lamp occlusion','Foreground promenade')
for($col=0;$col -lt 3;$col++){
 $g.DrawString("$($logical[$col]) logical px / $($heights[$col]) source px",$font,$ink,(12+$col*480),10)
 for($row=0;$row -lt 4;$row++){
  $x=$locations[$row][0];$y=$locations[$row][1]
  $im=Frame $x $y ($row -eq 2) $heights[$col]
  $rect=[Drawing.Rectangle]::new([Math]::Max(0,$x-135),($y-165),330,210)
  $yy=50+$row*280
  $g.DrawString($names[$row],$small,$ink,(12+$col*480),$yy)
  $g.DrawImage($im,[Drawing.Rectangle]::new((12+$col*480),($yy+24),450,245),$rect,[Drawing.GraphicsUnit]::Pixel)
  $im.Dispose()
 }
}
$g.Dispose(); Save $sheet 'evidence/player-scale-comparison.png'
$codec=[Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$encoder=[Drawing.Imaging.EncoderParameters]::new(1)
$encoder.Param[0]=[Drawing.Imaging.EncoderParameter]::new([Drawing.Imaging.Encoder]::Quality,[long]92)
$review=[Drawing.Image]::FromFile((Join-Path $root 'scene-first-vertical-slice-final.png'))
$review.Save((Join-Path $PSScriptRoot 'director-review-1280x720.jpg'),$codec,$encoder);$review.Dispose()
# Native source crop: all three mastheads, hull, berth, restored former mast background and water.
$hero=$src.Clone([Drawing.Rectangle]::new(660,0,1012,750),$src.PixelFormat)
$hero.Save((Join-Path $PSScriptRoot 'director-review-hero-crop.jpg'),$codec,$encoder);$hero.Dispose()
Write-Output 'Scale comparison and Director JPEGs saved.'
