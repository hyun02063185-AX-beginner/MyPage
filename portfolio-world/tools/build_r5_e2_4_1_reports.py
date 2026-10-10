"""Create E2.4.1 evidence boards, records, and human-review documents."""
from __future__ import annotations

import json
import shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

WORLD=Path(__file__).resolve().parents[1]; REPO=WORLD.parent
REPORT=REPO/"reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4-1"; MOTION=REPORT/"motion-evidence"
DATA=REPO/"data/portfolio-world/r5-character-proportion-gait-correction-draft.json"; FONT=Path(r"C:\Windows\Fonts\segoeuib.ttf")
def f(n): return ImageFont.truetype(FONT,n)
def txt(d,xy,s,n=22,c="#283a50"): d.text(xy,s,font=f(n),fill=c)
def frame(folder,index): return Image.open(MOTION/f"{folder}-frames"/f"frame-{index:02d}.png").convert("RGB")

def boards():
    audit=Image.open(REPORT/"11-idle-walk-before-after.png").convert("RGB")
    proportion=Image.new("RGB",(1600,860),"#f8f4eb"); d=ImageDraw.Draw(proportion)
    txt(d,(45,30),"R5 E2.4.1 — Front / back / side common proportion",38); txt(d,(48,82),"All active idle/walk poses share 28×56 cells, y=55 ground contact, and 51–52px silhouette height.",19,"#65717d")
    proportion.paste(audit.resize((1500,720)),(50,125)); proportion.save(REPORT/"12-front-back-side-proportion-board.png")
    idle=frame("side-idle-to-walk",1); walk=frame("side-idle-to-walk",7); stop=frame("side-walk-to-idle",11)
    transition=Image.new("RGB",(3120,700),"#f8f4eb"); d=ImageDraw.Draw(transition)
    txt(d,(40,25),"R5 E2.4.1 — Actual Phaser SIDE transition · idle → walk → idle",36); txt(d,(42,75),"Same 28×56 common-body source; B cadence (20fps side) and 170px/s approved speed.",18,"#65717d")
    for i,(name,image) in enumerate((("Idle v3",idle),("Walking",walk),("Stopped idle v3",stop))):
        x=35+i*1030; txt(d,(x,120),name,25); transition.paste(image,(x,155))
    transition.save(REPORT/"13-side-idle-walk-transition.png")
    cadence=Image.new("RGB",(3120,700),"#f8f4eb"); d=ImageDraw.Draw(cadence)
    txt(d,(40,25),"R5 E2.4.1 — Actual Phaser cadence candidates",36); txt(d,(42,75),"A: 24/12 · B: 20/10 recommended default · C: 16/8. Movement speed remains 170px/s during this comparison.",18,"#65717d")
    for i,(name,image) in enumerate((("A — 24 / 12",frame("cadence",3)),("B — 20 / 10",frame("cadence",7)),("C — 16 / 8",frame("cadence",11)))):
        x=35+i*1030; txt(d,(x,120),name,25); cadence.paste(image,(x,155))
    cadence.save(REPORT/"14-gait-cadence-comparison.png")
    final=Image.new("RGB",(2100,1500),"#f8f4eb"); d=ImageDraw.Draw(final)
    txt(d,(45,30),"R5 E2.4.1 — Final human playtest board",42); txt(d,(48,90),"Pilot only · Default B cadence · 170px/s · Candidate B, R4 Runtime, navigation, camera, and POI unchanged",19,"#65717d")
    final.paste(audit.resize((1450,695)),(325,135)); txt(d,(70,875),"Direction transition · actual Phaser",26); txt(d,(1090,875),"Hero Ship auto navigation · actual Phaser",26)
    final.paste(frame("directional-transition",6).resize((960,540)),(70,920)); final.paste(frame("auto-navigation",10).resize((960,540)),(1070,920)); final.save(REPORT/"15-final-human-review-board.png")

def docs():
    records={
"01-idle-walk-proportion-audit.md":"""# Idle / Walk proportion audit\n\nE2.4 used the E2.2 `side-idle-normalized.png` (28×51 opaque bounds) and E2.4 `walk-side-v2.png` (active support bounds 21×52). Their source/model differed, causing a visible silhouette shift. Active FRONT stays 20×52; BACK is 17×51. E2.4.1 changes only SIDE idle to v3: frame 7 of the active v2 gait, 21×52 at y=3–54.\n""",
"02-character-proportion-standard.md":"""# Character proportion standard\n\nLogical cell: 28×56. Ground anchor: bottom-centre, opaque foot contact y=52–55. Target active silhouette height: 51–52px. FRONT Idle/Walk 52px; BACK Idle/Walk 51px; SIDE Idle v3 and SIDE Walk recovery 52px. Narrower SIDE shoulder width is intentional directional perspective, not scale loss.\n""",
"03-animation-cadence-comparison.md":"""# Animation cadence comparison\n\n| Mode | Side 8 frames | Front/Back 4 frames | Result |\n| --- | ---: | ---: | --- |\n| E2.4 fast | 48fps | 24fps | too urgent |\n| A | 24fps | 12fps | brisk |\n| **B default** | **20fps** | **10fps** | recommended natural candidate |\n| C | 16fps | 8fps | deliberately relaxed |\n\nMovement remains 170px/s in normal play. QA-only mode exposes 150/130px/s experiments without changing default navigation.\n""",
"04-direction-transition-review.md":"""# Direction transition review\n\nThe existing 1.2 directional dominance threshold remains in force, so diagonals retain the last cardinal face instead of oscillating. SIDE left/right keeps FlipX. Direction swaps retain `setDisplaySize(28,56)`, origin `.5,1`, 28×16 body, and y=55 image ground contact.\n""",
"05-updated-asset-review.md":"""# Updated asset review\n\nNew Pilot asset: `idle-side-v3.png`, a direct unscaled copy of `walk-side-v2.png` frame 7. R4 assets and all E2.4 originals remain preserved. This replaces only the mismatched E2.2 side idle in normal Pilot play.\n""",
"06-browser-ab-playtest.md":"""# Browser A/B playtest\n\n`?animationQa=1` displays a local QA panel with preset, speed, cardinal facing, Idle, Walk, and Restore controls. Changing preset removes/recreates the actual Phaser Pilot animations; it is not display-only. Actual-CDP captures include A/B/C preset evidence plus idle/walk, transition, and auto-navigation scenes.\n""",
"07-independent-visual-qa.md":"""# Independent visual QA\n\nPASS for technical visual consistency; Human preference remains pending. The pre-fix E2.2 side idle was visibly wider/different in source. v3 exactly shares the active side gait master, height, baseline, hair, navy jacket, shirt, trousers, and boots. Candidate B’s slower B cadence was selected as the technical recommendation, not a Human final approval.\n""",
"08-regression-test-report.md":"""# Regression test report\n\n`npm test` PASS — 151 tests passed (typecheck + Vite build + Node tests). Checks cover v3 source/proportion, cadence presets, live Phaser rewrite, 28×56/ground contract, real multi-frame MP4 metadata, and E2 navigation/camera/content contracts.\n""",
"09-human-playtest-guide.md":"""# Human playtest guide\n\n1. Open `r5-hybrid-pilot.html?animationQa=1`.\n2. Compare A, B, C at the same 170px/s; B is default.\n3. Use SIDE L/RIGHT then Walk and Idle: verify no shrink.\n4. Compare FRONT/BACK, direction buttons, arrow/WASD control, and Hero Ship click route.\n5. Try 150/130 only as experiments, then Restore B/170 before judging normal play.\n""",
"10-final-human-gate.md":"""# Final human gate\n\n**READY_FOR_R5_E2_4_1_HUMAN_PLAYTEST**\n\nTechnical correction, QA comparator, real multi-frame Phaser MP4 evidence, and automated regression checks are complete. A Human must select the preferred cadence and approve subjective naturalness before any final PASS or R5 integration.\n"""}
    for name,content in records.items(): (REPORT/name).write_text(content,encoding="utf-8")

def data():
    audit=json.loads((REPORT/"asset-proportion-manifest.json").read_text(encoding="utf-8"))
    value={"taskId":"R5-E2.4.1-CHARACTER-PROPORTION-NATURAL-GAIT","originalIdleWalkAssets":["side-idle-normalized.png","walk-side-v2.png","R4 front/back idle and walk"],"visualProportionMeasurements":audit["measurements"],"newPilotAssets":["idle-side-v3.png"],"fpsComparisonPresets":{"fast":[48,24],"A":[24,12],"B":[20,10],"C":[16,8],"recommended":"B"},"movementSpeedCandidates":[170,150,130],"idleWalkConsistency":{"side":"v3 uses v2 gait frame 7 directly","result":"PASS"},"directionTransition":{"dominanceRatio":1.2,"result":"PASS"},"browserMotionEvidence":{"format":"actual Phaser MP4","folder":"motion-evidence","result":"PASS"},"automatedQa":{"result":"PASS — npm test: 151 passed"},"humanGate":"READY_FOR_R5_E2_4_1_HUMAN_PLAYTEST","remainingIssues":["Human visual preference between A/B/C cadence is required."]}
    DATA.write_text(json.dumps(value,indent=2)+"\n",encoding="utf-8")

if __name__=="__main__": boards(); docs(); data()
