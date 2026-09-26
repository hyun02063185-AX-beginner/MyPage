$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$platePath = Join-Path $root 'environment-plate.png'
Copy-Item (Join-Path $PSScriptRoot 'authored-initial.png') $platePath -Force
$src = [Drawing.Bitmap]::FromFile($platePath)
$w=$src.Width; $h=$src.Height
function Bitmap { return [Drawing.Bitmap]::new($w,$h,[Drawing.Imaging.PixelFormat]::Format32bppArgb) }
function Save($im,$path) { $im.Save((Join-Path $root $path),[Drawing.Imaging.ImageFormat]::Png) }
function Points($pairs) { [Drawing.Point[]]@($pairs | ForEach-Object { [Drawing.Point]::new($_[0],$_[1]) }) }
function Poly($g,$color,$pairs) { $b=[Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml($color)); $g.FillPolygon($b,(Points $pairs)); $b.Dispose() }
$ground=@(@(0,487),@(91,476),@(119,460),@(219,441),@(442,440),@(560,438),@(684,451),@(684,466),@(609,474),@(490,489),@(320,513),@(215,543),@(206,557),@(292,584),@(399,620),@(491,660),@(594,704),@(732,755),@(870,815),@(1040,897),@(1092,929),@(1092,940),@(0,940))
$planter=@(@(0,574),@(63,626),@(176,641),@(329,693),@(457,742),@(515,775),@(548,806),@(548,884),@(469,919),@(291,909),@(169,871),@(123,838),@(51,814),@(0,809))
$obstacles=@(
 @(@(162,482),@(234,466),@(280,481),@(278,514),@(191,533),@(162,519)),
 @(@(285,499),@(309,499),@(310,518),@(284,518)),
 @(@(437,432),@(522,424),@(526,461),@(442,472)),
 @(@(548,414),@(628,411),@(632,448),@(548,455)),
 @(@(99,637),@(130,637),@(130,657),@(99,657)),
 @(@(440,635),@(530,638),@(537,695),@(445,690)),
 @(@(394,606),@(431,606),@(431,647),@(390,647)),
 @(@(562,673),@(602,673),@(602,720),@(559,720)),
 @(@(646,710),@(686,710),@(686,765),@(642,765)),
 @(@(774,768),@(824,768),@(825,834),@(770,834)),
 @(@(967,858),@(1025,858),@(1027,922),@(963,922))
)
$walk=Bitmap; $g=[Drawing.Graphics]::FromImage($walk); $g.Clear([Drawing.Color]::Black); Poly $g '#FFFFFF' $ground; Poly $g '#000000' $planter
foreach($p in $obstacles){ Poly $g '#000000' $p }; $g.Dispose(); Save $walk 'walkable-mask.png'
# Collision = explicit footprints and a simple 10px exclusion band inside the navigable domain.
# Black elsewhere is NOT permission: future movement must require walkable AND !collision.
$collision=Bitmap
for($y=0;$y -lt $h;$y++){for($x=0;$x -lt $w;$x++){
 $blocked=$false
 if($walk.GetPixel($x,$y).R -gt 0){
  foreach($d in @(@(-10,0),@(10,0),@(0,-10),@(0,10))){$xx=$x+$d[0];$yy=$y+$d[1]; if($xx -lt 0 -or $xx -ge $w -or $yy -lt 0 -or $yy -ge $h -or $walk.GetPixel($xx,$yy).R -eq 0){$blocked=$true;break}}
 }
 $collision.SetPixel($x,$y,$(if($blocked){[Drawing.Color]::White}else{[Drawing.Color]::Black}))
}}
$g=[Drawing.Graphics]::FromImage($collision); Poly $g '#FFFFFF' $planter; foreach($p in $obstacles){Poly $g '#FFFFFF' $p}; $g.Dispose(); Save $collision 'collision-mask.png'
# Exact source-pixel occlusion redraw of the playable-height lamp shaft and base.
# Decorative lamp crown remains baked: every allowed actor head is below source y=480.
# Restrict this overlay to actors behind the lamp base; this is not a reusable prop sprite.
$shaft=@(@(110,479),@(119,479),@(118,554),@(122,565),@(121,576),@(124,591),@(128,599),@(128,625),@(130,642),@(126,651),@(104,651),@(99,646),@(100,638),@(101,608),@(102,602),@(108,592),@(110,578),@(106,571),@(110,560))
$selection=Bitmap; $g=[Drawing.Graphics]::FromImage($selection); Poly $g '#FFFFFF' $shaft; $g.Dispose()
$fg=Bitmap
for($y=479;$y -le 652;$y++){for($x=98;$x -le 131;$x++){if($selection.GetPixel($x,$y).A -gt 0){$fg.SetPixel($x,$y,$src.GetPixel($x,$y))}}}
Save $fg 'foreground-occlusion.png'
$reconstruction=Bitmap; $g=[Drawing.Graphics]::FromImage($reconstruction); $g.DrawImageUnscaled($src,0,0); $g.DrawImageUnscaled($fg,0,0); $g.Dispose(); Save $reconstruction 'layer-reconstruction-proof.png'
$workerPath=Join-Path $root '../astra-vertical-slice-validation/assets/props/scale-worker.png'
$worker=[Drawing.Bitmap]::FromFile([IO.Path]::GetFullPath($workerPath))
Copy-Item ([IO.Path]::GetFullPath($workerPath)) (Join-Path $PSScriptRoot 'temporary-player-proxy.png') -Force
function Frame($px,$py,$behind){
 $im=Bitmap; $g=[Drawing.Graphics]::FromImage($im); $g.DrawImageUnscaled($src,0,0)
 $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
 $shadow=[Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(52,49,39,24)); $g.FillEllipse($shadow,($px-12),($py-4),25,7); $shadow.Dispose()
 $g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
 $g.DrawImage($worker,[Drawing.Rectangle]::new(($px-12),($py-64),24,64))
 if($behind){$g.DrawImageUnscaled($fg,0,0)}
 $g.Dispose(); return $im
}
$frames=@((Frame 330 628 $false),(Frame 128 612 $true),(Frame 145 480 $false))
for($i=0;$i -lt 3;$i++){Save $frames[$i] "evidence/placement-$($i+1).png"}
$final=[Drawing.Bitmap]::new(1280,720); $g=[Drawing.Graphics]::FromImage($final); $g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic; $g.DrawImage($frames[0],0,0,1280,720);$g.Dispose();Save $final 'scene-first-vertical-slice-final.png'
$proof=[Drawing.Bitmap]::new(1536,1100); $g=[Drawing.Graphics]::FromImage($proof);$g.Clear([Drawing.Color]::FromArgb(238,234,221));$g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font=[Drawing.Font]::new('Arial',17);$small=[Drawing.Font]::new('Arial',12);$ink=[Drawing.Brushes]::DarkSlateGray
$labels=@('1 / Open quay - player in front','2 / Behind lamp - real scene pixels occlude','3 / Hall entrance approach')
$centers=@(@(330,628),@(128,612),@(145,480))
for($i=0;$i -lt 3;$i++){
 $yy=15+$i*360;$g.DrawString($labels[$i],$font,$ink,18,$yy)
 $g.DrawImage($frames[$i],18,($yy+35),560,315)
 $cx=$centers[$i][0];$cy=$centers[$i][1]
 $rect=[Drawing.Rectangle]::new([Math]::Max(0,$cx-100),($cy-160),250,190)
 $g.DrawImage($frames[$i],[Drawing.Rectangle]::new(605,($yy+35),414,315),$rect,[Drawing.GraphicsUnit]::Pixel)
 $g.DrawString('Source detail / temporary scale proxy',$small,$ink,1040,($yy+50))
 $g.DrawString("Feet: ($cx, $cy) source pixels`nHeight: 64 source px / 49 logical px",$small,$ink,1040,($yy+84))
}
$g.Dispose();Save $proof 'scene-first-playability-proof.png'
$compare=[Drawing.Bitmap]::new(1280,1190);$g=[Drawing.Graphics]::FromImage($compare);$g.Clear([Drawing.Color]::FromArgb(238,234,221));$g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$refs=@((Join-Path $root '../astra-master-harbor-benchmark/master-harbor-scene-final.png'),(Join-Path $root '../astra-vertical-slice-validation/vertical-slice-reconstruction-final.png'),(Join-Path $root 'scene-first-vertical-slice-final.png'))
$titles=@('A / Master Harbor reference','B / Failed modular reconstruction','C / Scene-first candidate - NO-GO: four masts')
for($i=0;$i -lt 3;$i++){$im=[Drawing.Image]::FromFile([IO.Path]::GetFullPath($refs[$i]));$yy=10+$i*395;$g.DrawString($titles[$i],$font,$ink,15,$yy);$g.DrawImage($im,15,($yy+34),620,349);$im.Dispose()}
$g.DrawString("Scene-level observations`n`nC retains integrated stone, water and lighting.`nNo repeated surface tiles or asset assembly.`n`nHard failure: four visible hero masts.`nRefinement request blocked by image-service quota.`n`nStatic evidence only. No Phaser runtime changes.",$font,$ink,665,450);$g.Dispose();Save $compare 'evidence/reference-comparison.png'
$geo=@{source_size=@($w,$h);logical_viewport=@(1280,720);start=@(330,628);player_height=64;player_foot_radius=10;placements=@(@(330,628),@(128,612),@(145,480));ground_polygon=$ground;planter_polygon=$planter;obstacle_polygons=$obstacles;occlusion=@{polygon=$shaft;depth_foot_y=652;actor_minimum_foot_y=554;rule='Render above actor only when feet y < 652, and head y >= 479. Lamp crown stays baked.'}}
$geo|ConvertTo-Json -Depth 12|Set-Content (Join-Path $PSScriptRoot 'geometry.json') -Encoding utf8
Write-Output 'Evidence, masks, layer and frames saved.'
