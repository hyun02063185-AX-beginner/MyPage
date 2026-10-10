Codex 5.6 High — R5 Phase E.2.4 작업 지시서
작업명: 전체 캐릭터 걷기 애니메이션 품질 개선
TASK ID: R5-E2.4-FULL-WALK-ANIMATION-POLISH
이번 작업은 캐릭터가 실제로 걷는 느낌을 완성하는 데 집중합니다. 지금까지 안정화한 디자인, 경로 탐색, 목적지 안내, 콘텐츠 방문 기능은 그대로 유지합니다.
GitHub에서 확인한 최신 기준은 다음과 같습니다.
항목	기준
Repository	C:\Users\hyun0\MyPage
Branch	design/world-layout-recovery-r5
HEAD	5a13e37ab5679582189bacba1126231b6f158ae2
개발 환경	Codex 5.6 High
작업 범위	R5 Hybrid Pilot 전용
정식 Runtime	변경 금지

1. 작업 배경 및 목표
사용자의 실제 플레이 검증에서 다음 사항이 확인됐다.
Human Accepted
- Candidate B 전체 디자인
- 캐릭터의 방향별 크기와 비율
- 마우스 클릭 및 A* 자동 이동
- 방향키·WASD 수동 이동
- Hero Ship 접근 경로
- 목적지 Marker 및 설명
- 콘텐츠 방문 패널
- 현재 수준의 전경 가림
개선 필요
- 좌우 이동 시 캐릭터가 미끄러지는 느낌이 강하다.
- 실제 걸음걸이와 화면상 이동 속도가 일치하지 않는다.
- 상하 걷기는 상대적으로 낫지만 전체적인 자연스러움은 더 개선할 수 있다.
- 방향 전환과 걷기·정지 사이의 연결도 함께 검토해야 한다.
이번 단계의 목표는 정면·후면·측면 모두 자연스럽고 일관된 걷기 애니메이션을 확보하는 것이다.
단순히 프레임 재생 속도를 바꾸거나 몸 전체를 흔드는 효과로 문제를 감추지 않는다.
2. 현재 애니메이션 구조 분석
실제 코드 기준:
portfolio-world/src/prototypes/r5-hybrid/hybridPilot.ts
현재 기본 계약:
Player Frame: 28×56
Collision Body: 28×16
Ground Anchor: Bottom-center
Camera Zoom: 1.25
Movement Speed: 170 world px/s
Walk Animation: 4 frames / 8fps
Directions: FRONT / BACK / SIDE
SIDE Right: FlipX


기존 SIDE는 E.2.2에서 비율을 보정한 Pilot 전용 자산을 사용한다.
public/assets/r5-hybrid/pilot-player/
  side-idle-normalized.png
  side-walk-normalized.png


이전에는 측면 캐릭터의 크기와 불투명 영역이 프레임마다 달라지는 문제를 해결했다.
그러나 프레임 크기를 정규화하는 과정에서 다리의 실제 자세 변화가 충분하지 않을 가능성이 있다.
이는 아직 가설이다. 원본 프레임과 실제 이동 영상을 분석해 원인을 검증한다.
반드시 확인할 항목
1. FRONT / BACK / SIDE 각 걷기 프레임의 실제 자세
2. 다리 교차와 발 접지 표현
3. 팔 흔들림과 체중 이동
4. Idle과 Walk 사이의 시각적 연결
5. 애니메이션 프레임 간 중복·유사도
6. 캐릭터가 이동하는 거리와 걸음 주기의 관계
7. 방향 전환 시 움직임의 연속성
8. 캐릭터의 발 접점·크기·체형 유지 여부

3. Task A — 기존 걷기 애니메이션 정밀 분석
A-1. 전체 프레임 분석
다음 방향을 모두 분석한다.
방향	Idle	Walk
FRONT	분석	모든 프레임 분석
BACK	분석	모든 프레임 분석
SIDE LEFT	분석	모든 프레임 분석
SIDE RIGHT	분석	FlipX와 실제 화면 확인
각 프레임에서 다음 항목을 비교한다.
- 머리와 몸통 위치
- 골반과 무릎의 상대 위치
- 양발의 위치
- 발이 지면에 닿는 순간
- 팔의 전후 움직임
- 프레임 사이 불필요한 형태 변화
같은 포즈의 이미지를 반복해서 프레임 수만 늘리는 것은 금지한다.
A-2. 실제 이동 거리 분석
현재 이동 속도는 170px/s이고, 기존 애니메이션은 4프레임·8fps이다.
이 경우 한 애니메이션 사이클은 0.5초이며, 캐릭터는 그동안 약 85월드픽셀을 이동한다.
이것이 측면 걷기가 미끄러져 보이는 원인 중 하나인지 확인한다.
다음을 비교한다.
- 캐릭터 이동 거리
- 한 걸음당 예상 이동 거리
- 애니메이션 한 주기
- 발 접지 프레임 간 시간
- 실제 화면에서 발이 미끄러지는 정도
이동 속도와 애니메이션 주기를 서로 독립적으로 결정하지 않는다.
다만 현재 사용자 승인된 이동 속도 170px/s를 우선 유지하고, 애니메이션 개선만으로 해결 가능한지 먼저 검증한다.
이동 속도 변경이 반드시 필요하다면 별도 비교안을 만들고 Human 승인 전까지 기본값을 변경하지 않는다.

4. Task B — 전체 걷기 애니메이션 개선
B-1. 캐릭터 디자인 유지
기존 Refined Portfolio Guide를 기준으로 한다.
반드시 유지:
- 얼굴과 헤어스타일
- 복장과 색상
- 머리·몸통·다리의 기본 비율
- 28×56 논리 프레임
- Bottom-center 기준
- 현재 사용자가 승인한 방향별 외형
새로운 캐릭터를 디자인하지 않는다.
B-2. 걷기 주기 개선
모든 방향에서 자연스러운 보행 주기를 구성한다.
기본적으로 다음 동작이 시각적으로 구분되어야 한다.
1. 왼발 접지
2. 체중 이동
3. 오른발 전진
4. 오른발 접지
5. 반대 방향 체중 이동
6. 왼발 전진
필요하면 추가적인 중간 프레임을 사용한다.
기존 4프레임 구조를 유지해도 되지만, 실제 동작을 표현하기 부족하다면 6~8프레임 이상으로 확장하는 방안을 검토할 수 있다.
프레임 수는 기술적인 목표가 아니다.
실제 보행의 자연스러움을 기준으로 결정한다.
B-3. SIDE 개선 우선
SIDE는 가장 중요한 개선 대상이다.
반드시 확인:
- 좌우 이동 중 양발이 구분되는가
- 다리가 실제로 교차하거나 번갈아 전진하는가
- 접지하는 발과 이동하는 발이 구분되는가
- 팔 흔들림이 다리 움직임과 어울리는가
- 측면 캐릭터의 얼굴·몸통 형태가 유지되는가
- 애니메이션이 반복될 때 튀는 구간이 없는가
SIDE 캐릭터가 다리를 거의 움직이지 않은 채 좌우로 이동한다면 FAIL이다.
B-4. FRONT / BACK 개선
상하 걷기는 기존 사용자가 상대적으로 자연스럽다고 평가했다.
따라서 무리한 변경을 피하고 다음 항목을 개선한다.
- 좌우 발의 번갈아 움직임
- 자연스러운 팔 흔들림
- 걷기 주기
- 발 접점
- 반복 애니메이션의 연결
기존보다 품질이 떨어지는 경우 원본을 유지한다.

5. Task C — 실제 이동과 애니메이션 동기화
C-1. 이동 속도와 Walk Cycle
현재 Pilot의 A* 경로 탐색은 유지한다.
새 애니메이션은 실제 이동 거리와 조화를 이루어야 한다.
다음 항목을 조정·검증한다.
- 실제 이동 속도에 맞는 Animation Frame Rate
- Walk Cycle 반복 간격
- 방향별 동일한 속도 체감
- Waypoint 전환 시 애니메이션 연속성
- 자동 이동과 수동 이동의 모션 일치
가능하다면 실제 이동량에 따라 애니메이션 진행 속도를 결정하는 구조를 검토한다.
단, 과도한 보간이나 동적 프레임 변경으로 캐릭터 이미지가 왜곡되어서는 안 된다.
C-2. 이동 시작과 정지
다음 상황을 확인한다.
- Idle → Walk
- Walk → Idle
- Walk → 방향 전환 → Walk
- 자동 이동 도착 → Idle
- 자동 이동 중 수동 조작 전환
캐릭터가 멈췄는데 다리가 계속 움직이거나, 이동하기 시작했는데 한동안 정지 자세로 미끄러져서는 안 된다.
C-3. 대각선 이동
현재 구조는 FRONT / BACK / SIDE 중 하나를 선택하는 방식이다.
이번 단계에서는 별도의 대각선 캐릭터 자산을 반드시 만들 필요는 없다.
기존 4방향 표현으로 가능한 자연스러운 방향 선택을 구현한다.
방향 전환 시 짧은 구간마다 FRONT와 SIDE가 반복적으로 튀는 현상이 있다면 전환 기준을 보완한다.

6. Task D — 자산 제작 및 관리
D-1. 원본 보존
기존 R4 애니메이션 자산은 변경하지 않는다.
새 애니메이션은 Pilot 전용으로 제작한다.
권장 경로:
portfolio-world/public/assets/r5-hybrid/
  pilot-player/
    walk-front-v2.png
    walk-back-v2.png
    walk-side-v2.png
    idle-front-v2.png       # 필요할 때만
    idle-back-v2.png        # 필요할 때만
    idle-side-v2.png        # 필요할 때만


Idle 원본에 문제가 없다면 변경하지 않아도 된다.
각 Walk 시트의 프레임 크기는 28×56으로 유지한다.
예를 들어 8프레임을 가로로 배열한다면 시트 전체 크기는 224×56이다.
D-2. 실질적인 애니메이션 제작
기존 이미지를 확대·복제·좌우 반전만 하여 프레임 수를 채우지 않는다.
각 프레임에는 실제 걷기 동작의 변화가 있어야 한다.
기존 아트의 색상과 픽셀 표현을 최대한 유지한다.
새로운 아트를 제작할 수 있는 수단이 없다면, 애니메이션 전체를 완성한 것으로 보고하지 않는다.
이 경우 필요한 제작 방법과 자산 의존성을 명시하고 ART_ASSET_REQUIRED로 보고한다.
외부 유료 이미지 생성 API를 추가 호출해야 한다면 승인된 비용 범위를 확인한다.
D-3. 재현성
생성된 최종 자산은 Git에 보존한다.
추가로 다음을 기록한다.
- 원본 자산
- 수정 방법
- 프레임 수
- 이미지 크기
- 프레임별 역할
- 재생 FPS
- SHA-256
- 원본 대비 변경 사항

7. Task E — 실제 Phaser 애니메이션 적용
변경 대상:
portfolio-world/src/prototypes/r5-hybrid/hybridPilot.ts
필요하면 애니메이션 관리를 별도 모듈로 분리한다.
예:
hybridPlayerAnimation.ts
다음 기능을 구현한다.
- FRONT / BACK / SIDE의 새 Walk Sprite Sheet 로딩
- 프레임 수에 맞는 Animation 정의
- 움직임에 맞는 재생 속도
- 방향 전환 시 안정적인 애니메이션 변경
- 정지 시 Idle 전환
- 좌우 FlipX 유지
- Ground Anchor 유지
Phaser의 Texture Frame 변경으로 논리 크기나 Physics Body가 바뀌지 않도록 한다.
기존 A, 충돌 처리, 카메라, POI 기능은 수정하지 않는다.*

8. Task F — Before / After 시각 비교
이번 단계는 실제 동영상 수준의 검증을 요구한다.
F-1. 동일 조건 비교
기존 애니메이션과 개선 애니메이션을 동일 조건에서 비교한다.
- 동일한 Candidate B 배경
- 동일한 출발 지점
- 동일한 경로
- 동일한 카메라
- 동일한 이동 속도
- 동일한 재생 시간
다음 이동 장면을 제작한다.
1. 좌측으로 이동
2. 우측으로 이동
3. 위쪽으로 이동
4. 아래쪽으로 이동
5. 좌우 전환
6. 상하 전환
7. 대각선 이동
8. 목적지 자동 이동
F-2. 비교 방식
필수:
- 실제 Phaser 브라우저 실행 화면
- Before 영상
- After 영상
- 프레임별 Sprite Sheet 비교
- 정지·이동 전환 장면
가능하면 동일한 화면에 Before / After를 나란히 표시한 비교 영상도 생성한다.
정지 이미지 몇 장으로 자연스러운 걷기를 증명했다고 보고하지 않는다.
F-3. 영상 검증 기준
다음 현상이 있으면 FAIL이다.
- 이동 중 다리가 거의 움직이지 않음
- 발이 지면 위에서 지속적으로 미끄러짐
- 프레임 사이 신체 크기 급변
- 캐릭터가 반복적으로 커졌다 작아짐
- 걸을 때 몸통이 과도하게 튐
- 정지 시 부자연스러운 자세
- 방향 전환 중 캐릭터가 순간적으로 뒤집히거나 흔들림

9. Task G — 기존 기능 회귀 QA
다음 기능은 사용자 승인된 상태이므로 보존한다.
항목	회귀 검증
클릭 자동 이동	정상
WASD 및 방향키	정상
자동 이동 중 수동 전환	정상
Hero Ship 부두 경로	정상
바다 진입 차단	정상
4개 목적지 Marker	정상
목적지 설명	정상
콘텐츠 방문 패널	정상
외부 콘텐츠 새 탭	정상
월드 복귀	정상
카메라 Zoom 1.25	유지
기존 전경 가림	회귀 문제 없음
검증 중 기존 기능의 문제가 발견되면 이번 애니메이션 작업으로 발생한 문제인지 구분해 보고한다.
기존부터 남아 있던 해안 석벽의 ART_OCCLUSION_REQUIRED 문제는 별도로 유지하며, 이번 작업에서 무리하게 해결하지 않는다.
테스트 실행
작업 후 실제 저장소 명령으로 다음을 실행한다.
cd C:\Users\hyun0\MyPage\portfolio-world

npm run typecheck
npm run build
npm test


이 외에 애니메이션 관련 테스트를 추가한다.
- 프레임 수와 시트 크기 일치
- 프레임별 유효 불투명 픽셀 존재
- 발 접점 범위 검증
- 애니메이션 반복 검증
- Walk / Idle 전환
- A* 이동 중 정상 애니메이션
- 기존 자산 해시 보존
자동 검증과 실제 시각 검증은 별도의 PASS 항목으로 관리한다.

10. 필수 산출물
저장 경로:
reports/portfolio-world-rebuild/
  r5-world-layout-recovery/
    phase-e2-4/


작업 문서
00-task-instruction.md
01-original-animation-audit.md
02-gait-cycle-design.md
03-updated-sprite-asset-review.md
04-animation-speed-synchronization.md
05-browser-motion-qa.md
06-independent-visual-qa.md
07-regression-test-report.md
08-human-playtest-guide.md
09-final-human-gate.md


00-task-instruction.md에는 이 지시서의 전체 원문을 보존한다. 요약본으로 대체하지 않는다.
이는 채팅에서 지시서가 보이지 않더라도 GitHub를 기준으로 작업 내역을 확인하기 위한 것이다.
이미지
10-original-walk-sprite-comparison.png
11-improved-walk-sprite-comparison.png
12-front-back-side-turnaround.png
13-ground-contact-analysis.png
14-character-gameplay-comparison.png
15-final-human-review-board.png


실제 동작 영상
motion-evidence/
  side-before.gif
  side-after.gif

  front-before.gif
  front-after.gif

  back-before.gif
  back-after.gif

  direction-transition.gif
  auto-navigation-walk.gif


GIF의 품질이 실제 평가에 부족하다면 MP4로 대체 가능하다.
중요한 것은 캐릭터가 실제 화면에서 움직이는 결과를 확인할 수 있어야 한다는 점이다.
설계 데이터
data/portfolio-world/r5-full-walk-animation-polish-draft.json
필수 항목:
- Original Assets
- New Pilot Assets
- Walk Frame Counts
- Animation FPS
- Foot Contact Analysis
- Movement Speed Comparison
- Direction Transition
- Browser Motion QA
- Regression Results
- Human Gate
- Remaining Issues

11. Human Gate
성공 조건
다음 항목을 모두 만족해야 한다.
1. 좌우 이동이 미끄러지는 느낌을 명확히 줄였다.
2. 정면·후면·측면에서 자연스러운 걷기 동작을 표현한다.
3. 같은 캐릭터로 보이는 디자인 일관성을 유지한다.
4. 발 접점과 이동 속도가 시각적으로 조화롭다.
5. 방향 전환과 Idle / Walk 전환이 자연스럽다.
6. 클릭 이동에서도 걷기 모션이 정상 작동한다.
7. 기존 사용자 승인 기능이 모두 유지된다.
8. R4 Runtime과 원본 캐릭터 자산을 보존한다.
9. 실제 Phaser 동작 영상으로 품질을 확인할 수 있다.
Gate 결과
READY_FOR_R5_E2_4_HUMAN_ANIMATION_REVIEW
- 개선된 애니메이션 자산 제작 완료
- 실제 플레이 적용 완료
- Before / After 비교 가능
- 심각한 시각 결함 없음
- 기존 이동·방문 기능 유지
CONDITIONAL_ANIMATION_REWORK_REQUIRED
- 일부 방향은 개선됐지만 미끄러짐 또는 프레임 문제가 남음
BLOCKED_ANIMATION_ART
- 필요한 애니메이션 원본을 확보하지 못했거나 제작 자산의 품질을 확보하지 못함
Human이 실제로 플레이하여 걷기 모션을 승인하기 전에는 최종 Animation Gate를 PASS로 변경하지 않는다.

12. 변경 금지 범위
이번 단계에서는 다음 작업을 하지 않는다.
- Candidate B 배경 변경
- 월드 크기 변경
- 카메라 Zoom 변경
- 새 건물 및 방문 포인트 추가
- A* 알고리즘 재작성
- 충돌·보행면 변경
- 목적지 Marker 재디자인
- 콘텐츠 패널 재설계
- 기존 HTML 수정
- Hero Ship 전체 이미지 분리 재개
- R4 Runtime 수정
- 정식 R5 Runtime 개발
오직 캐릭터의 걷기 모션과 이를 자연스럽게 재생하기 위한 애니메이션 로직만 수정한다.

13. Git 및 최종 보고
현재 R5 브랜치에서 작업한다.
작업 시작 전에 기준 HEAD와 Working Tree 상태를 확인한다. 예상하지 못한 변경이 있으면 임의로 삭제하거나 덮어쓰지 않는다.
완료 후 Commit & Push한다.
보고 형식:
TASK_ID: R5-E2.4-FULL-WALK-ANIMATION-POLISH

HEAD:
BRANCH:
PUSH:

ANIMATION AUDIT:
- Existing walk frames:
- Original FPS:
- Side sliding root cause:
- Foot contact findings:

NEW ANIMATION:
- Front frames / FPS:
- Back frames / FPS:
- Side frames / FPS:
- Idle / Walk transitions:
- Character appearance consistency:

MOVEMENT:
- Original speed:
- Final test speed:
- Gait synchronization:
- Click navigation result:
- Keyboard result:

VISUAL QA:
- Side walking:
- Front walking:
- Back walking:
- Direction transitions:
- Before / After evidence:

REGRESSION:
- A* pathfinding:
- Hero Ship route:
- POI markers:
- Content panel:
- Camera:

TESTS:
- Typecheck:
- Build:
- Automated tests:
- Browser motion QA:

R4 RUNTIME MODIFIED: NO
CANDIDATE B MODIFIED: NO
R5 FORMAL RUNTIME IMPLEMENTED: NO

GATE: